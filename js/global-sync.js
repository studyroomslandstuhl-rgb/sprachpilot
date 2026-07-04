import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit, onSnapshot } from "/js/firebase.js";
import { getActiveProfile, getActiveRole, loadCourse, normText, normId } from "/js/auth.js";

let started=false;
let unsubscribeStudent=null;
let unsubscribeProgress=null;
let localWrite=false;
let profileWriteTimer=null;

function readJSON(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||"")||fallback}catch(e){return fallback}}
function uniq(list){return Array.from(new Set((list||[]).filter(Boolean).map(String)))}
function clean(v){
  if(v===undefined||typeof v==="function")return undefined;
  if(v===null||typeof v==="string"||typeof v==="boolean")return v;
  if(typeof v==="number")return Number.isFinite(v)?v:0;
  if(Array.isArray(v))return v.map(clean).filter(x=>x!==undefined);
  if(typeof v==="object"){
    if(typeof v.toDate==="function"||typeof v.isEqual==="function"||v._methodName||v._delegate)return v;
    const out={};
    Object.keys(v).forEach(k=>{const c=clean(v[k]);if(c!==undefined)out[k]=c});
    return out;
  }
  return String(v||"");
}
function safeSet(key,value){localWrite=true;try{localStorage.setItem(key,value)}finally{setTimeout(()=>{localWrite=false},0)}}
function activeLocalProfile(){return getActiveProfile() || readJSON("SP_USER_PROFILE",readJSON("SP_STUDENT_PROFILE",null)) || null}
function courseOf(p={}){return String(p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem("SP_COURSE_CODE")||"").trim()}
function emailOf(p={}){return String(p.email||"").trim().toLowerCase()}
function fallbackId(p={}){const c=normId(p.courseDocId||courseOf(p)||"kurs");const e=normId(emailOf(p)||p.vorname||p.firstName||"student");return c&&e?c+"_"+e:""}
export function globalStudentId(p=activeLocalProfile()||{}){return (idCandidates(p)[0]||"")}
export function idCandidates(p=activeLocalProfile()||{}){return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem("SP_STUDENT_ID"),fallbackId(p)])}
function isStudentSession(){return getActiveRole()==="student" && !!activeLocalProfile()}
function mergeProfile(local={},remote={},docId=""){
  const course=remote.kurs||remote.courseCode||remote.kursnummer||local.kurs||local.courseCode||local.kursnummer||"";
  const studentId=remote.studentId||remote.userId||local.studentId||local.userId||docId||local.docId||fallbackId({...local,...remote,kurs:course});
  return {
    ...local,
    ...remote,
    docId:docId||remote.docId||local.docId||studentId,
    studentId,
    userId:studentId,
    kurs:course,
    kursnummer:course,
    courseCode:course,
    courseDocId:remote.courseDocId||local.courseDocId||"",
    email:emailOf(remote)||emailOf(local),
    muttersprache:remote.muttersprache||remote.motherLanguage||remote.fremdsprache||local.muttersprache||local.motherLanguage||"Englisch",
    role:"student",
    loginRole:"student",
    isStudent:true,
    isTeacher:false,
    firebase:true,
    keepLoggedIn:true
  };
}
function applyProfile(profile,{dispatch=true}={}){
  if(!profile)return null;
  const p={...profile};
  safeSet("SP_USER_PROFILE",JSON.stringify(p));
  safeSet("SP_STUDENT_PROFILE",JSON.stringify(p));
  safeSet("SP_KEEP_LOGGED_IN","1");
  safeSet("SP_STUDENT_ID",p.studentId||p.docId||p.userId||"");
  safeSet("SP_USER_ROLE","student");
  safeSet("SP_LOGIN_ROLE","student");
  safeSet("SP_ACTIVE_ROLE","student");
  safeSet("motherLanguage",p.muttersprache||"");
  safeSet("muttersprache",p.muttersprache||"");
  window.SP_GLOBAL_PROFILE=p;
  if(dispatch)window.dispatchEvent(new CustomEvent("SP_PROFILE_SYNCED",{detail:{profile:p}}));
  return p;
}
function progressToDashboard(progress={}){
  const all={};
  ["wortschatz","fragen","grammatik"].forEach(moduleKey=>{
    Object.entries(progress[moduleKey]||{}).forEach(([id,t])=>{
      if(!t||typeof t!=="object")return;
      if(!(t.tasks||t.exam||t.current||t.lifetime||t.progressPercent||t.title))return;
      all[id]={id,module:moduleKey,moduleTitle:t.moduleTitle||moduleKey,level:t.level||"",lesson:t.lesson||"",theme:t.theme||"",title:t.title||id,percent:Math.max(0,Math.min(100,Math.round(Number(t.progressPercent||t.current?.percent||0)||0))),completedTasks:Number(t.completedTasks||t.current?.completedTasks||0),totalTasks:Number(t.totalTasks||t.current?.totalTasks||0),exam:t.exam||{}};
    });
  });
  const v=progress.verben||{};
  const learned=(v.learnedVerbs||v.known||v.state?.learned||v.state?.known||[]).length||0;
  const active=(v.activeVerbs||v.state?.active||[]).length||0;
  const known=(v.known||v.state?.known||[]).length||0;
  const unsure=(v.unsure||v.state?.unsure||[]).length||0;
  const unknown=(v.unknown||v.state?.unknown||[]).length||0;
  const vp=Math.max(0,Math.min(100,Math.round(Number(v.progress||v.progressPercent||0)||0)));
  if(learned||active||known||unsure||unknown||vp){
    all["verben-a1"]={id:"verben-a1",module:"verben",moduleTitle:"Verben",title:"Verben A1",isVerbSummary:true,learned,active,known,unsure,unknown,percent:vp,packagePercent:vp};
  }
  safeSet("SP_DASHBOARD_PROGRESS",JSON.stringify(all));
  const points=Math.max(Number(progress.lifetimePoints||0),Number(progress.pointsTotal||0),Number(progress.punkteGesamt||0),Number(progress.totals?.points||0));
  if(points)safeSet("SP_POINTS_TOTAL",String(points));
  window.dispatchEvent(new CustomEvent("SP_PROGRESS_SYNCED",{detail:{progress,items:all}}));
}
async function findStudentDoc(profile){
  for(const id of idCandidates(profile)){
    try{const snap=await getDoc(doc(db,"students",id));if(snap.exists())return {id:snap.id,data:snap.data()||{}}}catch(e){console.warn("GlobalSync student direct failed",id,e)}
  }
  const email=emailOf(profile),course=courseOf(profile);
  if(email){
    const fields=["kurs","courseCode","kursnummer","courseDocId"];
    const variants=uniq([course,String(course).toLowerCase(),String(course).toUpperCase(),profile.courseDocId]);
    for(const field of fields){
      for(const value of variants){
        if(!value)continue;
        try{const qs=await getDocs(query(collection(db,"students"),where("email","==",email),where(field,"==",value),limit(5)));if(!qs.empty){const d=qs.docs[0];return {id:d.id,data:d.data()||{}}}}catch(e){}
      }
    }
  }
  return null;
}
async function readProgressFor(profile){
  const ids=idCandidates(profile);
  for(const id of ids){
    try{const snap=await getDoc(doc(db,"progress",id));if(snap.exists())return {id:snap.id,data:snap.data()||{}}}catch(e){console.warn("GlobalSync progress read failed",id,e)}
  }
  return null;
}
export async function refreshActiveProfileFromCloud(existing=activeLocalProfile()){
  if(!existing||getActiveRole()!=="student")return existing||null;
  const found=await findStudentDoc(existing);
  let merged=existing;
  if(found){
    let courseData=merged.assignments||{};
    try{const loaded=await loadCourse(found.data.kurs||found.data.courseCode||found.data.kursnummer||courseOf(merged));courseData=loaded?.data||courseData}catch(e){}
    merged=mergeProfile({...existing,assignments:courseData},found.data,found.id);
    applyProfile(merged);
  }else{
    merged=applyProfile(mergeProfile(existing,{},existing.docId||existing.studentId||existing.userId||""));
  }
  const pr=await readProgressFor(merged);
  if(pr)progressToDashboard(pr.data);
  return merged;
}
export async function saveProfileToCloud(profile=activeLocalProfile(),extra={}){
  if(!profile||getActiveRole()!=="student")return false;
  const p=mergeProfile(profile,extra,profile.docId||profile.studentId||profile.userId||"");
  const id=globalStudentId(p)||p.docId||p.studentId;
  if(!id)return false;
  const data=clean({
    ...p,
    studentId:id,userId:id,docId:id,
    kurs:courseOf(p),kursnummer:courseOf(p),courseCode:courseOf(p),email:emailOf(p),
    muttersprache:p.muttersprache||p.motherLanguage||"",
    role:"student",loginRole:"student",isStudent:true,isTeacher:false,active:true,
    updatedAt:serverTimestamp(),lastActivity:serverTimestamp(),lastActiveAt:serverTimestamp()
  });
  await setDoc(doc(db,"students",id),data,{merge:true});
  await setDoc(doc(db,"progress",id),clean({studentId:id,userId:id,docId:id,email:data.email,kurs:data.kurs,kursnummer:data.kurs,courseCode:data.kurs,muttersprache:data.muttersprache,studentName:[data.vorname||data.firstName||data.name,data.nachname||data.lastName].filter(Boolean).join(" "),updatedAt:serverTimestamp(),lastActiveAt:serverTimestamp()}),{merge:true});
  applyProfile(data);
  return true;
}
function watchCloud(profile){
  try{if(unsubscribeStudent)unsubscribeStudent();if(unsubscribeProgress)unsubscribeProgress()}catch(e){}
  const id=globalStudentId(profile);if(!id)return;
  unsubscribeStudent=onSnapshot(doc(db,"students",id),snap=>{if(!snap.exists())return;const current=activeLocalProfile()||{};const merged=mergeProfile(current,snap.data()||{},snap.id);applyProfile(merged);},e=>console.warn("GlobalSync student watch",e));
  unsubscribeProgress=onSnapshot(doc(db,"progress",id),snap=>{if(!snap.exists())return;progressToDashboard(snap.data()||{});},e=>console.warn("GlobalSync progress watch",e));
}
function patchLocalStorage(){
  if(window.__SP_GLOBAL_SYNC_STORAGE_PATCHED)return;
  window.__SP_GLOBAL_SYNC_STORAGE_PATCHED=true;
  const native=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){
    const out=native.apply(this,arguments);
    if(!localWrite && ["SP_USER_PROFILE","SP_STUDENT_PROFILE","motherLanguage","muttersprache"].includes(String(key))){
      clearTimeout(profileWriteTimer);
      profileWriteTimer=setTimeout(()=>saveProfileToCloud().catch(e=>console.warn("GlobalSync profile write",e)),700);
    }
    return out;
  };
}
export async function startGlobalSync(){
  if(started)return activeLocalProfile();
  started=true;
  patchLocalStorage();
  if(!isStudentSession())return null;
  let p=activeLocalProfile();
  try{p=await refreshActiveProfileFromCloud(p)}catch(e){console.warn("GlobalSync refresh failed",e)}
  if(p)watchCloud(p);
  window.addEventListener("focus",()=>refreshActiveProfileFromCloud().then(p=>p&&watchCloud(p)).catch(()=>{}));
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)refreshActiveProfileFromCloud().then(p=>p&&watchCloud(p)).catch(()=>{})});
  return p;
}
window.SprachPilotGlobalSync={start:startGlobalSync,refresh:refreshActiveProfileFromCloud,saveProfile:saveProfileToCloud,id:globalStudentId,ids:idCandidates};
