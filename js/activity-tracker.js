import { db, doc, setDoc, serverTimestamp } from "/js/firebase.js";
import { getActiveProfile } from "/js/auth.js";

function cleanId(s){return String(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"student"}
function isTeacherOrPreview(){
  try{
    const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
    if(role==="teacher")return true;
    if(sessionStorage.getItem("SP_TEACHER_PREVIEW")==="1"||localStorage.getItem("SP_TEACHER_PREVIEW")==="1")return true;
  }catch(e){}
  return false;
}
function profile(){try{return getActiveProfile()||JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")||{}}catch(e){return {}}}
function studentId(p=profile()){return p.studentId||p.userId||p.docId||localStorage.getItem("SP_STUDENT_ID")||cleanId((p.kurs||"")+"_"+(p.email||p.vorname||"student"))}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||localStorage.getItem("SP_COURSE_CODE")||""}
function nameOf(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(" ")||p.displayName||p.email||"Schüler/in"}
let lastWrite=0;
async function touch(force=false){
  if(isTeacherOrPreview())return;
  const now=Date.now();
  if(!force && now-lastWrite<60000)return;
  lastWrite=now;
  const p=profile();const id=studentId(p);if(!id)return;
  await setDoc(doc(db,"progress",id),{
    studentId:id,userId:id,kurs:course(p),studentName:nameOf(p),email:p.email||"",muttersprache:p.muttersprache||p.motherLanguage||"",
    lastActive:serverTimestamp(),updatedAt:serverTimestamp(),lastActiveAt:new Date().toISOString(),lastPage:location.pathname,lastAction:"online"
  },{merge:true});
}
try{
  touch(true).catch(e=>console.warn("Aktivität konnte nicht gespeichert werden",e));
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)touch(true).catch(()=>{})});
  window.addEventListener("beforeunload",()=>{try{touch(false)}catch(e){}});
}catch(e){console.warn("Aktivitäts-Tracker Fehler",e)}
