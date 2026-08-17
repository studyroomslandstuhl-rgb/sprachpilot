import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const FIELD='clientProgressStateV1';
const VERSION=5;
const OWNER_KEY='SP_ACCOUNT_PROGRESS_OWNER';
const TRACKED_KEY='SP_ACCOUNT_PROGRESS_TRACKED';
const INTERNAL_PREFIX='SP_ACCOUNT_PROGRESS_';
const MAX_ENTRY_CHARS=180000;
const MAX_ENTRIES=700;
const MAX_TOTAL_CHARS=700000;
const FLUSH_DELAY=650;
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
function denied(key){
 const k=String(key||'');
 if(!k||k.startsWith(INTERNAL_PREFIX))return true;
 if(['SP_USER_PROFILE','SP_STUDENT_PROFILE','SP_STUDENT_ID','SP_COURSE_CODE','SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_AUTH_ROLE','SP_KEEP_LOGGED_IN','SP_MOTHER_LANGUAGE_CODE','motherLanguage','muttersprache','SP_TEACHER_PREVIEW'].includes(k))return true;
 if(/PASSWORD|PASSWORT|TOKEN|SECRET|CREDENTIAL|AUTH_TOKEN|ID_TOKEN|REFRESH_TOKEN/i.test(k))return true;
 if(/^(?:SP_)?(?:TEACHER|ADMIN|OWNER|COURSE_INVITE|INVITE|FIREBASE)/i.test(k))return true;
 if(/(?:_CACHE|CACHE_|ASSET_|IMAGE_|AUDIO_)/i.test(k))return true;
 return false;
}
function progressObject(value,depth=0){
 if(!value||typeof value!=='object'||depth>3||Array.isArray(value))return false;
 const markers=['done','queue','current','tries','hadWrong','answers','progress','percent','progressPercent','completed','completedTasks','score','bestScore','stars','points','attempts','known','unknown','unsure','learned','learnedVerbs','activeVerbs','exam'];
 if(Object.keys(value).some(k=>markers.includes(k)))return true;
 return Object.values(value).slice(0,30).some(v=>progressObject(v,depth+1));
}
function eligible(key,value){
 if(denied(key))return false;
 const k=String(key||''),raw=String(value??'');
 if(raw.length>MAX_ENTRY_CHARS)return false;
 if(k==='A1_ACTIVE_SESSION')return true;
 if(/^A1_(?!STUDENTS_)/i.test(k))return true;
 if(/^SP_(?:A1_L\d+|L\d+(?:_|$)|SCORE_RUN_|POINTS_TOTAL$|TASK_|EXAM_|VERBS?_|FRAGEN_|WORTSCHATZ_|PERFEKT_|GRAMMATIK_|LESSON_|THEME_|RUN_|STARS?_)/i.test(k))return true;
 if(/(?:progress|fortschritt|score|punkte|points|stars|attempt|completed|done|learned|known|unknown|unsure)/i.test(k)&&/^(?:SP_|A1_)/i.test(k))return true;
 return progressObject(parse(raw,null));
}
function strength(raw){
 if(raw==null)return 0;
 const parsed=parse(String(raw),null);
 if(typeof parsed==='number')return Math.max(0,parsed);
 const n=Number(raw);
 if(!parsed||typeof parsed!=='object')return Number.isFinite(n)?Math.max(0,n):0;
 let score=0,seen=new Set();
 function walk(v,d=0){
  if(!v||typeof v!=='object'||d>4||seen.has(v))return;seen.add(v);
  if(Array.isArray(v)){score+=v.length*10;return}
  for(const[k,x]of Object.entries(v)){
   const key=String(k).toLowerCase();
   if(Array.isArray(x)){
    if(/done|known|learned|completed|firstseen|assessed/.test(key))score+=x.length*10000;
    else if(/queue/.test(key))score+=Math.max(0,1000-x.length);
    else score+=x.length*10;
   }else if(typeof x==='number'&&Number.isFinite(x)){
    if(/percent|progress/.test(key))score+=Math.max(0,x)*1000;
    else if(/correct|done|completed|score|points|stars|attempt/.test(key))score+=Math.max(0,x)*100;
   }else if(typeof x==='boolean'&&x&&/completed|finished|done|passed/.test(key))score+=100000;
   else if(x&&typeof x==='object')walk(x,d+1);
  }
 }
 walk(parsed);return score;
}
function enc(key){try{const bytes=new TextEncoder().encode(String(key));let s='';bytes.forEach(b=>s+=String.fromCharCode(b));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/g,'')}catch(e){return clean(key)}}
function positiveEntries(map){
 const out=new Map();if(!map||typeof map!=='object')return out;
 Object.values(map).forEach(raw=>{
  if(!raw||typeof raw!=='object'||!raw.key||raw.deleted||raw.value==null||denied(raw.key))return;
  const e={key:String(raw.key),value:String(raw.value),deleted:false,updatedAt:Number(raw.updatedAt)||0};
  const old=out.get(e.key),es=strength(e.value),os=old?strength(old.value):-1;
  if(!old||es>os||(es===os&&e.updatedAt>old.updatedAt))out.set(e.key,e);
 });
 return out;
}
function mergeBest(target,source){
 for(const[k,e]of source||[]){
  if(!e||e.deleted||e.value==null)continue;
  const old=target.get(k),es=strength(e.value),os=old?strength(old.value):-1;
  if(!old||es>os||(es===os&&(e.updatedAt||0)>(old.updatedAt||0)))target.set(k,{...e,deleted:false});
 }
 return target;
}
function scanLocal(){const out=new Map();for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k)continue;const v=localStorage.getItem(k);if(v!==null&&eligible(k,v))out.set(k,String(v))}return out}
function safeSet(k,v){applying=true;try{nativeSet.call(localStorage,k,String(v))}finally{applying=false}}
function saveTracking(){try{nativeSet.call(localStorage,OWNER_KEY,activeId);nativeSet.call(localStorage,TRACKED_KEY,JSON.stringify([...tracked]))}catch(e){}}

function absorbRemoteRow(id,data,entries,aliases,docs,queue,seenDocs){
 if(!id||seenDocs.has(id))return;
 seenDocs.add(id);docs.push({id,data:data||{}});aliases.add(String(id));
 const linked=uniq([...(data?.aliasIds||[]),data?.canonicalStudentId,data?.studentId,data?.userId,data?.docId]);
 linked.forEach(a=>{aliases.add(a);if(!seenDocs.has(a))queue.push(a)});
 mergeBest(entries,positiveEntries(data?.[FIELD]));
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
   const snap=await getDocs(query(collection(db,'progress'),where('email','==',mail),limit(30)));successfulReads++;
   for(const d of snap.docs)absorbRemoteRow(d.id,d.data()||{},entries,aliases,docs,queue,seenDocs);
   while(queue.length&&seenLookups.size<70){const id=String(queue.shift()||'');if(!id||seenLookups.has(id))continue;seenLookups.add(id);try{const s=await getDoc(doc(db,'progress',id));successfulReads++;if(s.exists())absorbRemoteRow(s.id||id,s.data()||{},entries,aliases,docs,queue,seenDocs)}catch(e){}}
  }catch(e){console.warn('Fortschritts-Aliasse konnten nicht per E-Mail gesucht werden',e)}
 }
 if(!successfulReads)throw new Error('Cloud-Fortschritt konnte nicht sicher gelesen werden.');
 return{entries,aliases,docs};
}
function buildMap(entries){
 const list=[...entries.values()].filter(e=>e&&e.key&&e.value!=null&&!e.deleted&&!denied(e.key)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
 const out={};let chars=0,count=0;
 for(const e of list){const len=String(e.value||'').length,est=len+String(e.key).length+80;if(len>MAX_ENTRY_CHARS||count>=MAX_ENTRIES||chars+est>MAX_TOTAL_CHARS)continue;out[enc(e.key)]={key:e.key,value:String(e.value),deleted:false,updatedAt:Number(e.updatedAt)||Date.now()};chars+=est;count++}
 return out;
}
function markDirty(key){
 if(!started||hydrating||applying||!isStudent()||denied(key))return;
 const current=localStorage.getItem(key);if(current===null||!eligible(key,current))return;
 tracked.add(key);dirty.add(key);saveTracking();scheduleFlush();
}
function patchStorage(){
 if(patched)return;patched=true;
 Storage.prototype.setItem=function(k,v){const r=nativeSet.apply(this,arguments);try{if(this===localStorage)markDirty(String(k||''))}catch(e){}return r};
 // WICHTIG: lokale removeItem-Aufrufe werden absichtlich NICHT in die Cloud gespiegelt.
 // Ein Reset/alte Seitenlogik darf keinen bestehenden Account-Fortschritt vernichten.
 Storage.prototype.removeItem=function(){return nativeRemove.apply(this,arguments)};
}
async function flush(){
 if(flushPromise)return flushPromise;
 if(!started||hydrating||!activeId||!isStudent()||!dirty.size)return null;
 const keys=[...dirty];dirty.clear();
 flushPromise=(async()=>{
  try{
   const ref=doc(db,'progress',activeId),snap=await getDoc(ref),current=snap.exists()?snap.data()||{}:{},entries=positiveEntries(current[FIELD]);
   mergeBest(entries,remoteCache);
   const ts=Date.now();
   for(const key of keys){
    const value=localStorage.getItem(key);if(value===null||!eligible(key,value))continue;
    const old=entries.get(key),newStrength=strength(value),oldStrength=old?strength(old.value):-1;
    // Fortschritt ist monoton: ein schwächerer/leer gewordener Zustand überschreibt nie einen stärkeren Cloud-Stand.
    if(old&&newStrength<oldStrength)continue;
    entries.set(key,{key,value:String(value),deleted:false,updatedAt:ts});tracked.add(key);
   }
   const map=buildMap(entries);
   await setDoc(ref,{[FIELD]:map,clientProgressStateVersion:VERSION,clientProgressStateUpdatedAt:serverTimestamp(),clientProgressNonDestructive:true},{merge:true});
   remoteCache=positiveEntries(map);saveTracking();
   try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_SYNCED',{detail:{studentId:activeId,keys:keys.length,nonDestructive:true}}))}catch(e){}
   return{ok:true};
  }catch(error){keys.forEach(k=>dirty.add(k));console.warn('Account-Fortschritt konnte nicht gespeichert werden',error);scheduleFlush(1800);return{ok:false,error}}
  finally{flushPromise=null}
 })();
 return flushPromise;
}
function scheduleFlush(delay=FLUSH_DELAY){clearTimeout(flushTimer);flushTimer=setTimeout(()=>flush(),delay)}
function topicNumbers(key,topic){
 const text=[key,topic?.topicId,topic?.themeId,topic?.title,topic?.lesson,topic?.lektion,topic?.theme,topic?.thema].filter(Boolean).join(' ');
 const directLesson=String(topic?.lesson||topic?.lektion||'').match(/\d+/)?.[0]||'';
 const directTheme=String(topic?.theme||topic?.thema||'').match(/\d+/)?.[0]||'';
 const lesson=directLesson||(text.match(/lektion[-_\s]*(\d+)/i)?.[1]||'');
 const theme=directTheme||(text.match(/thema[-_\s]*(\d+)/i)?.[1]||'');
 return{lesson,theme};
}
function stateFromTask(t){
 if(!t||typeof t!=='object')return null;
 const pct=Math.max(0,Math.min(100,Number(t.percent??t.progress??0)||0));
 const doneRaw=Array.isArray(t.done)?t.done.length:Number(t.done)||0;
 const total=Math.max(1,Number(t.total)||doneRaw||((t.completed||pct>=100)?1:0));
 const done=Math.max(0,Math.min(total,doneRaw||((t.completed||pct>=100)?total:Math.round(total*pct/100))));
 if(done<=0)return null;
 const doneIndexes=[...Array(done).keys()],queue=[...Array(total).keys()].filter(i=>i>=done);
 return{total,done:doneIndexes,queue,current:null,tries:0,hadWrong:false,completed:done>=total,percent:Math.round(done/total*100)};
}
function l6t4LocalFile(file){
 const f=String(file||'');
 if(/^dialoge\.html/i.test(f))return'task-dialog-abc';
 if(/^task-/.test(f)||f==='plural-sprechen.html')return f;
 if(/^task\.html\?/i.test(f)){
  try{const q=f.split('?')[1]||'',id=new URLSearchParams(q).get('task');if(id)return'task-'+id}catch(e){}
 }
 return f;
}
function localKeysFor(lesson,theme,file){
 const lt=`${lesson}|${theme}`;
 const prefix={
  '4|1':'SP_L4_T1_V2_','4|2':'SP_L4_T2_FINAL_V3_','4|3':'SP_L4_T3_V2_',
  '5|1':'SP_L5_T1_V1_','5|2':'SP_L5_T2_V1_','5|3':'SP_L5_T3_V2_',
  '6|2':'SP_L6_T2_V1_','6|3':'SP_L6_T3_V1_'
 }[lt];
 if(prefix)return[prefix+file];
 if(lt==='6|1')return['SP_L6_T1_V1_'+(localStorage.getItem('SP_L6_T1_EXTRA_WEATHER')==='1'?'EXTRA_':'BOOK_')+file];
 if(lt==='6|4')return['SP_L6_T4_V2_'+l6t4LocalFile(file)];
 return[];
}
function restoreLocal(key,raw){
 if(!key||raw==null)return 0;
 const local=localStorage.getItem(key);
 if(local===null||strength(raw)>strength(local)){safeSet(key,raw);tracked.add(key);dirty.add(key);return 1}
 return 0;
}
function recoverStructuredLessons(docs){
 let restored=0;
 for(const row of docs||[]){
  for(const[key,topic]of Object.entries(row.data?.wortschatz||{})){
   if(!topic||typeof topic!=='object')continue;
   const nums=topicNumbers(key,topic);if(!nums.lesson||!nums.theme)continue;
   for(const[file,t]of Object.entries(topic.tasks||{})){
    const state=stateFromTask(t);if(!state)continue;
    const raw=JSON.stringify(state);
    for(const localKey of localKeysFor(nums.lesson,nums.theme,file))restored+=restoreLocal(localKey,raw);
   }
  }
 }
 return restored;
}

export async function startAccountProgressSync(){
 if(started)return accountProgressReady;started=true;patchStorage();
 if(!isStudent()||window.SP_NO_FIREBASE_SYNC||window.SP_PERFORMANCE_MODE){hydrating=false;readyResolve({active:false});return accountProgressReady}
 const candidateIds=ids();activeId=candidateIds[0]||'';if(!activeId){hydrating=false;readyResolve({active:false});return accountProgressReady}
 const oldOwner=String(localStorage.getItem(OWNER_KEY)||''),oldTracked=parse(localStorage.getItem(TRACKED_KEY),[]);tracked=new Set(Array.isArray(oldTracked)?oldTracked:[]);
 try{
  const remote=await readRemote();remoteCache=new Map(remote.entries);
  const sameAccount=!oldOwner||oldOwner===activeId||candidateIds.includes(oldOwner)||remote.aliases.has(oldOwner);
  // Niemals mehr lokale Fortschritte wegen einer ID-/Alias-Abweichung löschen.
  let restored=0;
  for(const[key,e]of remote.entries){
   const local=localStorage.getItem(key);
   if(local===null||strength(e.value)>strength(local)){safeSet(key,e.value);restored++;tracked.add(key)}
   else if(sameAccount&&local!==e.value&&strength(local)>=strength(e.value)){dirty.add(key);tracked.add(key)}
  }
  restored+=recoverStructuredLessons(remote.docs);
  const localAfter=scanLocal();
  if(sameAccount||!oldOwner){
   for(const[key,value]of localAfter){const r=remote.entries.get(key);if(!r||strength(value)>=strength(r.value)){dirty.add(key);tracked.add(key)}}
  }
  activeId=candidateIds.find(id=>remote.aliases.has(id))||remote.docs[0]?.id||activeId;
  saveTracking();hydrating=false;
  if(dirty.size)await flush();
  try{window.dispatchEvent(new CustomEvent('SP_ACCOUNT_PROGRESS_READY',{detail:{studentId:activeId,restored,sameAccount,sourceDocs:remote.docs.length,nonDestructive:true}}))}catch(e){}
  readyResolve({active:true,studentId:activeId,restored,sameAccount,sourceDocs:remote.docs.length,nonDestructive:true});
  return accountProgressReady;
 }catch(error){hydrating=false;console.warn('Account-Fortschritt wurde nicht verändert, weil die Cloud nicht sicher gelesen werden konnte.',error);readyResolve({active:false,error:String(error?.message||error)});return accountProgressReady}
}

window.addEventListener('online',()=>{if(started&&!hydrating&&dirty.size)scheduleFlush(100)});
window.addEventListener('pagehide',()=>{if(started&&!hydrating&&dirty.size)flush()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!hydrating&&dirty.size)flush()});
window.SPAccountProgressSync={start:startAccountProgressSync,flush,ready:accountProgressReady,field:FIELD,version:VERSION,nonDestructive:true};
