import { db, doc, getDoc, setDoc, serverTimestamp } from "/js/firebase.js";
import { getActiveProfile, getActiveRole } from "/js/auth.js";

const FIELD="clientProgressStateV1";
const VERSION=2;
const OWNER_KEY="SP_ACCOUNT_PROGRESS_OWNER";
const TRACKED_KEY="SP_ACCOUNT_PROGRESS_TRACKED";
const META_PREFIX="SP_ACCOUNT_PROGRESS_META_";
const INTERNAL_PREFIX="SP_ACCOUNT_PROGRESS_";
const MAX_ENTRY_CHARS=180000;
const MAX_TOTAL_CHARS=650000;
const MAX_ENTRIES=600;
const FLUSH_DELAY=650;

const nativeSet=Storage.prototype.setItem;
const nativeRemove=Storage.prototype.removeItem;
let patched=false;
let started=false;
let hydrating=true;
let applyingRemote=false;
let activeStudentId="";
let meta={};
let tracked=new Set();
let dirty=new Set();
let hydratedRemote=new Map();
let flushTimer=null;
let flushPromise=null;
let readyResolve=()=>{};

export const accountProgressReady=new Promise(resolve=>{readyResolve=resolve});
try{window.SPAccountProgressReady=accountProgressReady}catch(e){}

function parse(value,fallback=null){try{return JSON.parse(value||"")}catch(e){return fallback}}
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(value=>String(value)))]}
function cleanId(value){return String(value||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function profile(){return getActiveProfile()||parse(localStorage.getItem("SP_USER_PROFILE"),null)||parse(localStorage.getItem("SP_STUDENT_PROFILE"),null)||{}}
function role(){return String(getActiveRole?.()||localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase()}
function isStudent(){const p=profile();return role()==="student"&&!!(p.studentId||p.userId||p.docId||p.email)&&!p.teacherPreview&&!p.isTeacher}
function course(p=profile()){return p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem("SP_COURSE_CODE")||""}
function candidates(p=profile()){
  const fallback=cleanId(`${course(p)||"kurs"}_${String(p.email||p.vorname||p.firstName||"student").trim().toLowerCase()}`);
  return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem("SP_STUDENT_ID"),fallback]);
}
function studentId(){return candidates()[0]||""}
function metaKey(id){return META_PREFIX+cleanId(id)}
function now(){return Date.now()}
function exercisePath(){return /\/(?:wortschatz|fragen-A1|fragen|verben-A1|verben|perfekt|grammatik|finnisch)\//i.test(location.pathname)}

const DENY_EXACT=new Set([
  "SP_USER_PROFILE","SP_STUDENT_PROFILE","SP_PROFILE_BACKUP","SP_STUDENT_PROFILE_BACKUP",
  "SP_KEEP_LOGGED_IN","SP_LOGIN_ROLE","SP_ACTIVE_ROLE","SP_USER_ROLE","SP_AUTH_ROLE","SP_LOGIN_CONTEXT",
  "SP_STUDENT_ID","SP_COURSE_CODE","SP_MOTHER_LANGUAGE_CODE","motherLanguage","muttersprache",
  "SP_POINTS_LAST_REPAIR","SP_PROGRESS_LAST_SYNC","SP_TEACHER_PREVIEW","teacherPreview"
]);
function denied(key){
  const k=String(key||"");
  if(!k||k.startsWith(INTERNAL_PREFIX)||DENY_EXACT.has(k))return true;
  if(/^A1_STUDENTS_/i.test(k))return true;
  if(/(?:PASSWORD|PASSWORT|TOKEN|SECRET|CREDENTIAL|AUTH_TOKEN|ID_TOKEN|REFRESH_TOKEN)/i.test(k))return true;
  if(/^(?:SP_)?(?:TEACHER|ADMIN|OWNER|COURSE_INVITE|INVITE|DIAGNOSTIC|DEBUG|FIREBASE)/i.test(k))return true;
  if(/(?:PROFILE_BACKUP|SESSION_BACKUP|TEACHER_MODE|TEACHER_UID|TEACHER_ID|TEACHER_EMAIL)/i.test(k))return true;
  if(/(?:_CACHE|CACHE_|ASSET_|IMAGE_|AUDIO_)/i.test(k))return true;
  return false;
}
function progressObject(value,depth=0){
  if(!value||typeof value!=="object"||depth>2)return false;
  if(Array.isArray(value))return false;
  const keys=Object.keys(value);
  const markers=["done","queue","current","tries","hadWrong","answers","exerciseProgress","progress","percent","progressPercent","completed","completedTasks","score","bestScore","stars","points","attempts","firstSeen","firstCorrect","known","unknown","unsure","learned","learnedVerbs","activeVerbs","assessmentBatch","currentPackageVerbs","exam"];
  if(keys.some(key=>markers.includes(key)))return true;
  return keys.slice(0,25).some(key=>progressObject(value[key],depth+1));
}
function looksProgressValue(value){
  const raw=String(value??"");
  if(!raw||raw.length>MAX_ENTRY_CHARS)return false;
  const parsed=parse(raw,null);
  return progressObject(parsed);
}
function knownProgressKey(key){
  const k=String(key||"");
  if(k==="A1_ACTIVE_SESSION")return true;
  if(/^A1_(?!STUDENTS_)/i.test(k))return true;
  if(/^SP_(?:L\d+(?:_|$)|SCORE_RUN_|POINTS_TOTAL$|TASK_|EXAM_|VERBS?_|FRAGEN_|WORTSCHATZ_|PERFEKT_|GRAMMATIK_|LESSON_|THEME_|RUN_|STARS?_)/i.test(k))return true;
  if(/(?:progress|fortschritt|score|punkte|points|stars|attempt|completed|done|learned|known|unknown|unsure)/i.test(k)&&/^(?:SP_|A1_)/i.test(k))return true;
  return false;
}
function eligible(key,value,changed=false){
  if(denied(key))return false;
  const raw=String(value??"");
  if(raw.length>MAX_ENTRY_CHARS)return false;
  if(knownProgressKey(key))return true;
  if(looksProgressValue(raw))return true;
  return !!(changed&&exercisePath()&&/^(?:SP_|A1_)/i.test(String(key||"")));
}
function safeSet(key,value){applyingRemote=true;try{nativeSet.call(localStorage,key,String(value))}finally{applyingRemote=false}}
function safeRemove(key){applyingRemote=true;try{nativeRemove.call(localStorage,key)}finally{applyingRemote=false}}
function saveInternal(key,value){try{nativeSet.call(localStorage,key,value)}catch(e){}}
function loadMeta(id){const value=parse(localStorage.getItem(metaKey(id)),{});return value&&typeof value==="object"&&!Array.isArray(value)?value:{}}
function saveMeta(){if(activeStudentId)saveInternal(metaKey(activeStudentId),JSON.stringify(meta))}
function saveTracked(){saveInternal(TRACKED_KEY,JSON.stringify([...tracked]));if(activeStudentId)saveInternal(OWNER_KEY,activeStudentId)}
function isolateAccount(id){
  const owner=String(localStorage.getItem(OWNER_KEY)||"");
  const oldTracked=parse(localStorage.getItem(TRACKED_KEY),[]);
  if(owner&&owner!==id&&Array.isArray(oldTracked)){
    oldTracked.forEach(key=>{if(!denied(key))safeRemove(key)});
    safeRemove(TRACKED_KEY);
  }
  tracked=new Set(owner===id&&Array.isArray(oldTracked)?oldTracked:[]);
  saveInternal(OWNER_KEY,id);
}
function encodeKey(key){
  try{
    const bytes=new TextEncoder().encode(String(key));
    let binary="";bytes.forEach(byte=>binary+=String.fromCharCode(byte));
    return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
  }catch(e){return cleanId(key)||String(key).replace(/[^a-z0-9_-]/gi,"_")}
}
function normalizeEntry(entry){
  if(!entry||typeof entry!=="object"||!entry.key)return null;
  return {key:String(entry.key),value:entry.deleted?null:String(entry.value??""),deleted:!!entry.deleted,updatedAt:Math.max(0,Number(entry.updatedAt)||0)};
}
function remoteEntries(map){
  const out=new Map();
  if(!map||typeof map!=="object")return out;
  Object.values(map).forEach(raw=>{
    const entry=normalizeEntry(raw);if(!entry||denied(entry.key))return;
    const old=out.get(entry.key);if(!old||entry.updatedAt>=old.updatedAt)out.set(entry.key,entry);
  });
  return out;
}
function strength(raw){
  if(raw==null)return 0;
  const parsed=parse(String(raw),null);
  if(typeof parsed==="number")return Math.max(0,parsed);
  if(!parsed||typeof parsed!=="object"){
    const n=Number(raw);return Number.isFinite(n)?Math.max(0,n):0;
  }
  let score=0;
  const seen=new Set();
  function walk(value,depth=0){
    if(!value||typeof value!=="object"||depth>3||seen.has(value))return;
    seen.add(value);
    if(Array.isArray(value)){score+=value.length*10;return}
    for(const [key,v] of Object.entries(value)){
      const k=String(key).toLowerCase();
      if(Array.isArray(v)){
        if(/done|known|learned|completed|firstseen|assessed/.test(k))score+=v.length*10000;
        else if(/queue/.test(k))score+=Math.max(0,1000-v.length);
        else score+=v.length*10;
      }else if(typeof v==="number"&&Number.isFinite(v)){
        if(/percent|progress/.test(k))score+=Math.max(0,v)*1000;
        else if(/correct|done|completed|score|points|stars|attempt/.test(k))score+=Math.max(0,v)*100;
      }else if(typeof v==="boolean"&&v&&/completed|finished|done|passed/.test(k))score+=100000;
      else if(v&&typeof v==="object")walk(v,depth+1);
    }
  }
  walk(parsed);
  return score;
}
function entryFromLocal(key,ts=now()){
  const value=localStorage.getItem(key);
  return value===null?{key,value:null,deleted:true,updatedAt:ts}:{key,value:String(value),deleted:false,updatedAt:ts};
}
function markLocal(key,value){
  if(!started||hydrating||applyingRemote||!isStudent())return;
  if(!eligible(key,value,true))return;
  const ts=now();meta[key]=ts;tracked.add(key);dirty.add(key);saveMeta();saveTracked();scheduleFlush();
}
function patchStorage(){
  if(patched)return;patched=true;
  Storage.prototype.setItem=function(key,value){
    const result=nativeSet.apply(this,arguments);
    try{if(this===localStorage)markLocal(String(key||""),String(value??""))}catch(e){}
    return result;
  };
  Storage.prototype.removeItem=function(key){
    const old=this===localStorage?this.getItem(key):null;
    const result=nativeRemove.apply(this,arguments);
    try{if(this===localStorage&&eligible(String(key||""),old,true))markLocal(String(key||""),old)}catch(e){}
    return result;
  };
}
function scanLocal(){
  const out=new Map();
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);if(!key||denied(key))continue;
    const value=localStorage.getItem(key);if(eligible(key,value,false))out.set(key,String(value??""));
  }
  return out;
}
async function readRemote(){
  const merged=new Map();
  let successfulReads=0;
  for(const id of candidates().slice(0,5)){
    try{
      const snap=await getDoc(doc(db,"progress",id));
      successfulReads++;
      if(!snap.exists())continue;
      const data=snap.data()||{};
      for(const [key,entry] of remoteEntries(data[FIELD])){
        const old=merged.get(key);if(!old||entry.updatedAt>=old.updatedAt)merged.set(key,entry);
      }
    }catch(e){console.warn("Account-Fortschritt konnte nicht gelesen werden",id,e)}
  }
  if(!successfulReads)throw new Error("Kein Fortschrittsdokument konnte sicher gelesen werden.");
  return merged;
}
function applyRemote(remote,local){
  let changed=false,restored=0,removed=0,seeded=0,remoteStamp=0;
  const all=new Set([...remote.keys(),...local.keys(),...tracked]);
  const timestamp=now();
  for(const key of all){
    if(denied(key))continue;
    const re=remote.get(key)||null;
    const localValue=localStorage.getItem(key);
    const localTs=Math.max(0,Number(meta[key])||0);
    if(re){
      const remoteTs=Math.max(0,Number(re.updatedAt)||0);remoteStamp=Math.max(remoteStamp,remoteTs);
      let remoteWins=remoteTs>localTs;
      if(localTs===0&&localValue!==null&&!re.deleted&&localValue!==re.value){remoteWins=strength(re.value)>=strength(localValue)}
      if(localTs===0&&localValue===null)remoteWins=true;
      if(remoteWins){
        if(re.deleted){if(localValue!==null){safeRemove(key);changed=true;removed++}}
        else if(localValue!==re.value){safeSet(key,re.value);changed=true;restored++}
        meta[key]=remoteTs||timestamp;
      }else if(localValue!==null&&localValue!==re.value){
        if(!localTs)meta[key]=timestamp;
        dirty.add(key);seeded++;
      }else if(localValue===null&&!re.deleted&&localTs>remoteTs){dirty.add(key)}
      tracked.add(key);
      continue;
    }
    if(localValue!==null&&eligible(key,localValue,false)){
      if(!meta[key])meta[key]=timestamp;
      tracked.add(key);dirty.add(key);seeded++;
    }
  }
  saveMeta();saveTracked();
  return{changed,restored,removed,seeded,remoteStamp};
}
function buildMap(entries){
  const list=[...entries.values()].filter(entry=>entry&&entry.key&&!denied(entry.key)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));
  const out={};let chars=0,count=0;
  for(const entry of list){
    const valueChars=entry.deleted?0:String(entry.value||"").length;
    if(valueChars>MAX_ENTRY_CHARS)continue;
    const estimated=valueChars+String(entry.key).length+80;
    if(count>=MAX_ENTRIES||chars+estimated>MAX_TOTAL_CHARS)continue;
    out[encodeKey(entry.key)]={key:entry.key,value:entry.deleted?null:String(entry.value??""),deleted:!!entry.deleted,updatedAt:Number(entry.updatedAt)||now()};
    chars+=estimated;count++;
  }
  return out;
}
async function flush(){
  if(flushPromise)return flushPromise;
  if(!started||hydrating||!isStudent()||!activeStudentId||!dirty.size)return null;
  const keys=[...dirty];dirty.clear();
  flushPromise=(async()=>{
    try{
      const ref=doc(db,"progress",activeStudentId);
      const snap=await getDoc(ref);
      const current=snap.exists()?snap.data()||{}:{};
      const entries=remoteEntries(current[FIELD]);
      for(const [key,entry] of hydratedRemote){
        const old=entries.get(key);if(!old||entry.updatedAt>old.updatedAt)entries.set(key,entry);
      }
      for(const key of keys){
        if(denied(key))continue;
        const ts=Math.max(Number(meta[key])||0,now());
        meta[key]=ts;
        entries.set(key,entryFromLocal(key,ts));
        tracked.add(key);
      }
      const map=buildMap(entries);
      await setDoc(ref,{[FIELD]:map,clientProgressStateVersion:VERSION,clientProgressStateUpdatedAt:serverTimestamp()},{merge:true});
      hydratedRemote=remoteEntries(map);
      saveMeta();saveTracked();
      try{window.dispatchEvent(new CustomEvent("SP_ACCOUNT_PROGRESS_SYNCED",{detail:{studentId:activeStudentId,keys:keys.length}}))}catch(e){}
      return{keys:keys.length};
    }catch(e){
      keys.forEach(key=>dirty.add(key));
      console.warn("Account-Fortschritt konnte nicht gespeichert werden",e);
      return null;
    }finally{flushPromise=null}
  })();
  return flushPromise;
}
function scheduleFlush(){clearTimeout(flushTimer);flushTimer=setTimeout(()=>flush(),FLUSH_DELAY)}
function shouldReloadAfterRestore(result){return !!(result?.changed&&exercisePath())}
function reloadOnce(result){
  if(!shouldReloadAfterRestore(result))return;
  const signature=`${activeStudentId}:${result.remoteStamp||0}:${result.restored}:${result.removed}:${tracked.size}`;
  const key="SP_ACCOUNT_PROGRESS_RELOAD";
  if(sessionStorage.getItem(key)===signature)return;
  sessionStorage.setItem(key,signature);
  setTimeout(()=>location.reload(),0);
}

export async function startAccountProgressSync(options={}){
  if(started)return accountProgressReady;
  started=true;patchStorage();
  if(!isStudent()||window.SP_NO_FIREBASE_SYNC||window.SP_PERFORMANCE_MODE){hydrating=false;readyResolve({active:false});return accountProgressReady}
  activeStudentId=studentId();
  if(!activeStudentId){hydrating=false;readyResolve({active:false});return accountProgressReady}
  isolateAccount(activeStudentId);
  meta=loadMeta(activeStudentId);
  try{
    const remote=await readRemote();
    hydratedRemote=new Map(remote);
    const local=scanLocal();
    const result=applyRemote(remote,local);
    hydrating=false;
    if(dirty.size)await flush();
    const detail={active:true,studentId:activeStudentId,...result,tracked:tracked.size};
    readyResolve(detail);
    try{window.dispatchEvent(new CustomEvent("SP_ACCOUNT_PROGRESS_READY",{detail}))}catch(e){}
    if(options.reload!==false)reloadOnce(result);
  }catch(e){
    hydrating=false;console.warn("Account-Fortschritt Initialisierung fehlgeschlagen",e);readyResolve({active:false,error:String(e?.message||e)});
  }
  return accountProgressReady;
}

window.addEventListener("online",()=>{if(started&&!hydrating&&dirty.size)scheduleFlush()});
window.addEventListener("pagehide",()=>{if(started&&!hydrating&&dirty.size)flush()});
document.addEventListener("visibilitychange",()=>{if(document.hidden&&started&&!hydrating&&dirty.size)flush()});

window.SPAccountProgressSync={start:startAccountProgressSync,flush,ready:accountProgressReady,field:FIELD,version:VERSION};
