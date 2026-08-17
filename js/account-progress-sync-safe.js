import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const FIELD='clientProgressStateV1';
const VERSION=4;
const OWNER_KEY='SP_ACCOUNT_PROGRESS_OWNER';
const TRACKED_KEY='SP_ACCOUNT_PROGRESS_TRACKED';
const INTERNAL_PREFIX='SP_ACCOUNT_PROGRESS_';
const MAX_ENTRY_CHARS=180000;
const MAX_ENTRIES=700;
const MAX_TOTAL_CHARS=700000;
const FLUSH_DELAY=500;
const nativeSet=Storage.prototype.setItem;
const nativeRemove=Storage.prototype.removeItem;
let started=false,patched=false,hydrating=true,applying=false,activeId='';
let tracked=new Set(),dirty=new Set(),remoteCache=new Map(),flushTimer=null,flushPromise=null;
let readyResolve=()=>{};
export const accountProgressReady=new Promise(resolve=>{readyResolve=resolve});
try{window.SPAccountProgressReady=accountProgressReady}catch(e){}

function parse(v,f=null){try{return JSON.parse(v||'')}catch(e){return f}}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function clean(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function profile(){return getActiveProfile()||parse(localStorage.getItem('SP_USER_PROFILE'),null)||parse(localStorage.getItem('SP_STUDENT_PROFILE'),null)||{}}
function role(){return String(getActiveRole?.()||localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase()}
function isStudent(){const p=profile();return role()==='student'&&!!(p.studentId||p.userId||p.docId||p.uid||p.email)&&!p.teacherPreview&&!p.isTeacher}
function course(p=profile()){return p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function ids(p=profile()){
 const fallback=clean(`${course(p)||'kurs'}_${String(p.email||p.vorname||p.firstName||'student').trim().toLowerCase()}`);
 return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallback]);
}
function denied(key){const k=String(key||'');if(!k||k.startsWith(INTERNAL_PREFIX))return true;if(['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_STUDENT_ID','SP_COURSE_CODE','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_AUTH_ROLE','SP_KEEP_LOGGED_IN','SP_MOTHER_LANGUAGE_CODE','motherLanguage','muttersprache','SP_TEACHER_PREVIEW'].includes(k))return true;if(/PASSWORD|PASSWORT|TOKEN|SECRET|CREDENTIAL|AUTH_TOKEN|ID_TOKEN|REFRESH_TOKEN/i.test(k))return true;if(/^(?:SP_)?(?:TEACHER|ADMIN|OWNER|COURSE_INVITE|INVITE|FIREBASE)/i.test(k))return true;if(/(?:_CACHE|CACHE_|ASSET_|IMAGE_|AUDIO_)/i.test(k))return true;return false}
function progressObject(value,depth=0){if(!value||typeof value!=='object'||depth>3)return false;if(Array.isArray(value))return false;const markers=['done','queue','current','tries','hadWrong','answers','progress','percent','progressPercent','completed','completedTasks','score','bestScore','stars','points','attempts','known','unknown','unsure','learned','learnedVerbs','activeVerbs','exam'];if(Object.keys(value).some(k=>markers.includes(k)))return true;return Object.values(value).slice(0,30).some(v=>progressObject(v,depth+1))}
function eligible(key,value){if(denied(key))return false;const k=String(key||''),raw=String(value??'');if(raw.length>MAX_ENTRY_CHARS)return false;if(k==='A1_ACTIVE_SESSION')return true;if(/^A1_(?!STUDENTS_)/i.test(k))return true;if(/^SP_(?:L\d+(?:_|$)|SCORE_RUN_|POINTS_TOTAL$|TASK_|EXAM_|VERBS?_|FRAGEN_|WORTSCHATZ_|PERFEKT_|GRAMMATIK_|LESSON_|THEME_|RUN_|STARS?_)/i.test(k))return true;if(/(?:progress|fortschritt|score|punkte|points|stars|attempt|completed|done|learned|known|unknown|unsure)/i.test(k)&&/^(?:SP_|A1_)/i.test(k))return true;return progressObject(parse(raw,null))}
function strength(raw){if(raw==null)return 0;const parsed=parse(String(raw),null);if(typeof parsed==='number')return Math.max(0,parsed);const n=Number(raw);if(!parsed||typeof parsed!=='object')return Number.isFinite(n)?Math.max(0,n):0;let score=0,seen=new Set();function walk(v,d=0){if(!v||typeof v!=='object'||d>3||seen.has(v))return;seen.add(v);if(Array.isArray(v)){score+=v.length*10;return}for(const[k,x]of Object.entries(v)){const key=String(k).toLowerCase();if(Array.isArray(x)){if(/done|known|learned|completed|firstseen|assessed/.test(key))score+=x.length*10000;else if(/queue/.test(key))score+=Math.max(0,1000-x.length);else score+=x.length*10}else if(typeof x==='number'&&Number.isFinite(x)){if(/percent|progress/.test(key))score+=Math.max(0,x)*1000;else if(/correct|done|completed|score|points|stars|attempt/.test(key))score+=Math.max(0,x)*100}else if(typeof x==='boolean'&&x&&/completed|finished|done|passed/.test(key))score+=100000;else if(x&&typeof x==='object')walk(x,d+1)}}walk(parsed);return score}
function enc(key){try{const bytes=new TextEncoder().encode(String(key));let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'')}catch(e){return clean(key)}}
function remoteEntries(map){const out=new Map();if(!map||typeof map!=='object')return out;Object.values(map).forEach(raw=>{if(!raw||typeof raw!=='object'||!raw.key||denied(raw.key))return;const e={key:String(raw.key),value:raw.deleted?null:String(raw.value??''),deleted:!!raw.deleted,updatedAt:Number(raw.updatedAt)||0};const old=out.get(e.key);if(!old||e.updatedAt>=old.updatedAt)out.set(e.key,e)});return out}
function scanLocal(){const out=new Map();for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k)continue;const v=localStorage.getItem(k);if(eligible(k,v))out.set(k,String(v??''))}return out}
function safeSet(k,v){applying=true;try{nativeSet.call(localStorage,k,String(v))}finally{applying=false}}
function safeRemove(k){applying=true;try{nativeRemove.call(localStorage,k)}finally{applying=false}}
function saveTracking(){try{nativeSet.call(localStorage,OWNER_KEY,activeId);nativeSet.call(localStorage,TRACKED_KEY,JSON.stringify([...tracked]))}catch(e){}}

function absorbRemoteRow(id,data,entries,aliases,docs,queue,seenDocs){
 if(!id||seenDocs.has(id))return;
 seenDocs.add(id);docs.push({id,data:data||{}});aliases.add(String(id));
 const linked=uniq([...(data?.aliasIds||[]),data?.canonicalStudentId,data?.studentId,data?.userId,data?.docId]);
 linked.forEach(a=>{aliases.add(a);if(!seenDocs.has(a))queue.push(a)});
 for(const[k,e]of remoteEntries(data?.[FIELD])){const old=entries.get(k);if(!old||e.updatedAt>=old.updatedAt)entries.set(k,e)}
}
async function readRemote(){
 const entries=new Map(),aliases=new Set(ids()),docs=[],queue=ids().slice(),seenLookups=new Set(),seenDocs=new Set();let successfulReads=0;
 while(queue.length&&seenLookups.size<40){
  const id=String(queue.shift()||'');if(!id||seenLookups.has(id))continue;seenLookups.add(id);
  try{const s=await getDoc(doc(db,'progress',id));successfulReads++;if(s.exists())absorbRemoteRow(s.id||id,s.data()||{},entries,aliases,docs,queue,seenDocs)}catch(e){console.warn('Account-Fortschritt konnte nicht gelesen werden',id,e)}
 }
 const mail=String(profile().email||'').trim().toLowerCase();
 if(mail){
  try{
   const snap=await getDocs(query(collection(db,'progress'),where('email','==',mail),limit(20)));successfulReads++;
   for(const d of snap.docs)absorbRemoteRow(d.id,d.data()||{},entries,aliases,docs,queue,seenDocs);
   while(queue.length&&seenLookups.size<60){const id=String(queue.shift()||'');if(!id||seenLookups.has(id))continue;seenLookups.add(id);try{const s=await getDoc(doc(db,'progress',id));successfulReads++;if(s.exists())absorbRemoteRow(s.id||id,s.data()||{},entries,aliases,docs,queue,seenDocs)}catch(e){}}
  }catch(e){console.warn('Fortschritts-Aliasse konnten nicht per E-Mail gesucht werden',e)}
 }
 if(!successfulReads)throw new Error('Cloud-Fortschritt konnte nicht sicher gelesen werden.');
 return{entries,aliases,docs}
}
function buildMap(entries){const list=[...entries.values()].filter(e=>e&&e.key&&!denied(e.key)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));const out={};let chars=0,count=0;for(const e of list){const len=e.deleted?0:String(e.value||'').length,est=len+String(e.key).length+80;if(len>MAX_ENTRY_CHARS||count>=MAX_ENTRIES||chars+est>MAX_TOTAL_CHARS)continue;out[enc(e.key)]={key:e.key,value:e.deleted?null:String(e.value??''),deleted:!!e.deleted,updatedAt:Number(e.updatedAt)||Date.now()};chars+=est;count++}return out}
function markDirty(key,oldValue=null){if(!started||hydrating||applying||!isStudent()||denied(key))return;const current=localStorage.getItem(key);if(current===null&&oldValue===null)return;if(current!==null&&!eligible(key,current))return;tracked.add(key);dirty.add(key);saveTracking();scheduleFlush()}
function patchStorage(){if(patched)return;patched=true;Storage.prototype.setItem=function(k,v){const r=nativeSet.apply(this,arguments);try{if(this===localStorage)markDirty(String(k||''))}catch(e){}return r};Storage.prototype.removeItem=function(k){const old=this===localStorage?this.getItem(k):null;const r=nativeRemove.apply(this,arguments);try{if(this===localStorage&&old!==null&&eligible(String(k||''),old))markDirty(String(k||''),old)}catch(e){}return r}}
async function flush(){if(flushPromise)return flushPromise;if(!started||hydrating||!activeId||!isStudent()||!dirty.size)return null;const keys=[...dirty];dirty.clear();flushPromise=(async()=>{try{const ref=doc(db,'progress',activeId),snap=await getDoc(ref),current=snap.exists()?snap.data()||{}:{},entries=remoteEntries(current[FIELD]);for(const[k,e]of remoteCache){const old=entries.get(k);if(!old||e.updatedAt>old.updatedAt)entries.set(k,e)}const ts=Date.now();for(const key of keys){const value=localStorage.getItem(key);entries.set(key,{key,value:value===null?null:String(value),deleted:value===null,updatedAt:ts});tracked.add(key)}const map=buildMap(entries);await setDoc(ref,{[FIELD]:map,clientProgressStateVersion:VERSION,clientProgressStateUpdatedAt:serverTimestamp()},{merge:true});remoteCache=remoteEntries(map);saveTracking();try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNCED',{detail:{studentId:activeId,keys:keys.length}}))}catch(e){}return{ok:true}}catch(error){keys.forEach(k=>dirty.add(k));console.warn('Account-Fortschritt konnte nicht gespeichert werden',error);scheduleFlush(1800);return{ok:false,error}}finally{flushPromise=null}})();return flushPromise}
function scheduleFlush(delay=FLUSH_DELAY){clearTimeout(flushTimer);flushTimer=setTimeout(()=>flush(),delay)}
function topicNumbers(key,topic){
 const text=[key,topic?.topicId,topic?.themeId,topic?.title,topic?.lesson,topic?.lektion,topic?.theme,topic?.thema].filter(Boolean).join(' ');
 const directLesson=String(topic?.lesson||topic?.lektion||'').match(/\d+/)?.[0]||'';
 const directTheme=String(topic?.theme||topic?.thema||'').match(/\d+/)?.[0]||'';
 const lesson=directLesson||(text.match(/lektion[-_\s]*(\d+)/i)?.[1]||'');
 const theme=directTheme||(text.match(/thema[-_\s]*(\d+)/i)?.[1]||'');
 return{lesson,theme}
}
function recoverLegacyL4L5(docs){
 const prefixes={'4|1':'SP_L4_T1_V2','4|2':'SP_L4_T2_FINAL_V3','4|3':'SP_L4_T3_V2','5|1':'SP_L5_T1_V1','5|2':'SP_L5_T2_V1','5|3':'SP_L5_T3_V2'};let restored=0;
 for(const row of docs||[]){
  for(const[key,topic]of Object.entries(row.data?.wortschatz||{})){
   if(!topic||typeof topic!=='object'||!topic.tasks)continue;
   const nums=topicNumbers(key,topic),prefix=prefixes[nums.lesson+'|'+nums.theme];if(!prefix)continue;
   for(const[file,t]of Object.entries(topic.tasks||{})){
    if(!t||typeof t!=='object')continue;
    const pct=Math.max(0,Math.min(100,Number(t.percent??t.progress??0)||0));
    const total=Math.max(1,Number(t.total)||Number(t.done)||1);
    const done=Math.max(0,Math.min(total,Number(t.done)||((t.completed||pct>=100)?total:Math.round(total*pct/100))));
    if(done<=0)continue;
    const doneIndexes=[...Array(done).keys()],queue=[...Array(total).keys()].filter(i=>!doneIndexes.includes(i));
    const state={total,done:doneIndexes,queue,current:null,tries:0,hadWrong:false};
    const localKey=prefix+'_'+file,raw=JSON.stringify(state),local=localStorage.getItem(localKey);
    if(local===null||strength(raw)>strength(local)){safeSet(localKey,raw);tracked.add(localKey);dirty.add(localKey);restored++}
   }
  }
 }
 return restored
}

export async function startAccountProgressSync(options={}){
 if(started)return accountProgressReady;started=true;patchStorage();
 if(!isStudent()||window.SP_NO_FIREBASE_SYNC||window.SP_PERFORMANCE_MODE){hydrating=false;readyResolve({active:false});return accountProgressReady}
 const candidateIds=ids();activeId=candidateIds[0]||'';if(!activeId){hydrating=false;readyResolve({active:false});return accountProgressReady}
 const oldOwner=String(localStorage.getItem(OWNER_KEY)||''),oldTracked=parse(localStorage.getItem(TRACKED_KEY),[]);tracked=new Set(Array.isArray(oldTracked)?oldTracked:[]);
 try{
  const remote=await readRemote();remoteCache=new Map(remote.entries);
  const sameAccount=!oldOwner||oldOwner===activeId||candidateIds.includes(oldOwner)||remote.aliases.has(oldOwner);
  if(oldOwner&&!sameAccount){for(const key of tracked){if(!denied(key))safeRemove(key)}tracked.clear()}
  let restored=0;
  for(const[key,e]of remote.entries){if(e.deleted)continue;const local=localStorage.getItem(key);if(local===null||strength(e.value)>strength(local)){safeSet(key,e.value);restored++;tracked.add(key)}else if(local!==e.value){dirty.add(key);tracked.add(key)}}
  restored+=recoverLegacyL4L5(remote.docs);
  const localAfter=scanLocal();for(const[key,value]of localAfter){if(!remote.entries.has(key)||strength(value)>strength(remote.entries.get(key)?.value)){dirty.add(key);tracked.add(key)}}
  activeId=candidateIds.find(id=>remote.aliases.has(id))||activeId;saveTracking();hydrating=false;
  if(dirty.size)await flush();
  try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_READY',{detail:{studentId:activeId,restored,sameAccount,sourceDocs:remote.docs.length}}))}catch(e){}
  readyResolve({active:true,studentId:activeId,restored,sameAccount,sourceDocs:remote.docs.length});
  return accountProgressReady;
 }catch(error){hydrating=false;console.warn('Account-Fortschritt wurde aus Sicherheitsgründen nicht verändert, weil die Cloud nicht sicher gelesen werden konnte.',error);readyResolve({active:false,error:String(error?.message||error)});return accountProgressReady}
}

window.addEventListener('online',()=>{if(started&&!hydrating&&dirty.size)scheduleFlush(100)});
window.addEventListener('pagehide',()=>{if(started&&!hydrating&&dirty.size)flush()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!hydrating&&dirty.size)flush()});
window.SPAccountProgressSync={start:startAccountProgressSync,flush,ready:accountProgressReady,field:FIELD,version:VERSION};
