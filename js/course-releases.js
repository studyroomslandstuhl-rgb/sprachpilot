import { db, doc, getDocFromServer, collection, query, where, getDocsFromServer, limit } from "./firebase.js";

function profileFromStorage(){try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("SP_STUDENT_PROFILE")||"null")||{}}catch(e){return {}}}
function uniq(list){return [...new Set((list||[]).filter(Boolean))]}
function clean(v){return String(v||"").trim()}
function norm(v){return clean(v).toLowerCase().replace(/\s+/g,"")}
function variants(value){const v=clean(value);if(!v)return [];return [v,v.toUpperCase(),v.toLowerCase(),v.replace(/\s+/g,""),v.toLowerCase().replace(/\s+/g,"")]}
function isTeacher(){const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();const p=profileFromStorage();return role==="teacher"||role==="lehrer"||p.role==="teacher"||p.teacherPreview===true||p.isTeacher===true}
function hasReleaseData(d){return !!(d&&typeof d==="object"&&(d.enabledModules||d.enabledLessons||d.enabledThemes||d.enabledTasks||d.enabledWords||d.enabledSets||d.releases||d.releaseMode||d.defaultLocked!==undefined||d.verbenA1AssessmentEnabled!==undefined))}
function withTimeout(promise,ms,fallback=null){return Promise.race([Promise.resolve(promise),new Promise(resolve=>setTimeout(()=>resolve(fallback),ms))])}
function profileCourseRaw(profile=profileFromStorage()){
 const direct=[profile.courseCode,profile.kurs,profile.kursnummer,profile.course].filter(v=>clean(v));
 return direct.length?direct:[localStorage.getItem("SP_COURSE_CODE")].filter(v=>clean(v))
}
function profileCourseIdentityRaw(profile=profileFromStorage()){
 return uniq([...profileCourseRaw(profile),profile.courseDocId,profile.courseId,profile.courseName,profile.code].filter(v=>clean(v)))
}
function activeCourseValues(profile=profileFromStorage()){return uniq(profileCourseIdentityRaw(profile).flatMap(variants)).map(norm).filter(Boolean)}
function rowCourseValues(data={},id=""){return uniq([id,data.id,data.courseDocId,data.courseId,data.courseCode,data.kurs,data.kursnummer,data.code,data.name,data.courseName].flatMap(variants)).map(norm).filter(Boolean)}
function matchesActiveCourse(data={},id="",profile=profileFromStorage()){const wanted=activeCourseValues(profile);if(!wanted.length)return true;const got=rowCourseValues(data,id);return got.some(v=>wanted.includes(v))}
function timestampValue(value){
 try{if(value&&typeof value.toMillis==="function")return value.toMillis()}catch(e){}
 if(value&&typeof value.seconds==="number")return value.seconds*1000+Math.floor(Number(value.nanoseconds||0)/1000000);
 const parsed=Date.parse(value||"");return Number.isFinite(parsed)?parsed:0
}
function releaseUpdatedAt(data={}){return Math.max(timestampValue(data.updatedAt),timestampValue(data.releaseUpdatedAt),timestampValue(data.createdAt))}
export function courseCodes(profile=profileFromStorage()){
 const primary=profileCourseRaw(profile);
 const secondary=[profile.courseDocId,profile.courseId,profile.courseName,profile.code];
 return uniq([...primary,...secondary].flatMap(variants))
}
async function readCourseDoc(id,profile){
 try{
  const snap=await withTimeout(getDocFromServer(doc(db,"courses",String(id))),2500,null);
  if(!snap?.exists?.())return null;
  const data={...(snap.data()||{}),id:snap.id};
  return matchesActiveCourse(data,snap.id,profile)?data:null
 }catch(e){return null}
}
async function queryCourse(field,value,profile){
 try{
  const snap=await withTimeout(getDocsFromServer(query(collection(db,"courses"),where(field,"==",String(value)),limit(5))),2500,null);
  if(!snap||snap.empty)return null;
  const rows=[];
  for(const d of snap.docs){const data={...(d.data()||{}),id:d.id};if(matchesActiveCourse(data,d.id,profile))rows.push(data)}
  rows.sort((a,b)=>releaseUpdatedAt(b)-releaseUpdatedAt(a));
  return rows[0]||null
 }catch(e){}
 return null
}
function cachedRelease(profile=profileFromStorage()){
 let stored={};try{stored=JSON.parse(localStorage.getItem("SP_COURSE_RELEASES")||"{}")||{}}catch(e){}
 const active=activeCourseValues(profile),marker=norm(localStorage.getItem("SP_RELEASE_CACHE_COURSE")||"");
 const candidates=[profile.assignments,stored].filter(hasReleaseData);
 for(const data of candidates){
  if(!active.length)return data;
  const own=rowCourseValues(data,data?.id||"");
  if(own.length){if(own.some(v=>active.includes(v)))return data;continue}
  if(marker&&active.includes(marker))return data;
 }
 return {}
}
export async function loadCourseRelease(profile=profileFromStorage()){
 if(isTeacher())return {releaseMode:"all",defaultLocked:false,teacherPreview:true};
 const fallback=cachedRelease(profile);
 const lookup=(async()=>{
  const primary=uniq(profileCourseRaw(profile).flatMap(variants));
  const secondary=uniq([profile.courseDocId,profile.courseId,profile.courseName,profile.code].flatMap(variants));

  // Ein im Schülerprofil gespeichertes Kursdokument ist die stärkste Identität.
  // So wird nicht versehentlich ein altes Kurscode-Duplikat vor dem echten Kurs gelesen.
  for(const code of secondary){const d=await readCourseDoc(code,profile);if(hasReleaseData(d))return rememberRelease(profile,d)}

  // Bei alten Profilen ohne courseDocId kann es mehrere Dokumente mit demselben Kurscode geben.
  // In diesem Fall gewinnt innerhalb der passenden Treffer der zuletzt aktualisierte Freigabestand.
  const fields=["courseCode","kurs","kursnummer","code","name","courseName","courseDocId","courseId"];
  for(const field of fields){for(const code of primary.length?primary:secondary){const d=await queryCourse(field,code,profile);if(hasReleaseData(d))return rememberRelease(profile,d)}}

  // Letzter Fallback: Kurscode war selbst die Dokument-ID, aber in den Feldern nicht hinterlegt.
  for(const code of primary){const d=await readCourseDoc(code,profile);if(hasReleaseData(d))return rememberRelease(profile,d)}
  return fallback||{}
 })();
 const result=await withTimeout(lookup,10000,null);
 if(hasReleaseData(result))return result;
 return fallback||{}
}
export function rememberRelease(profile,data){
 try{
  const p={...(profile||profileFromStorage())};
  const canonical=clean(data?.courseCode||data?.kurs||data?.kursnummer||p.courseCode||p.kurs||p.kursnummer||"");
  p.assignments=data||{};
  if(data?.id||data?.courseDocId)p.courseDocId=data.courseDocId||data.id;
  if(canonical){p.courseCode=canonical;p.kurs=canonical;p.kursnummer=canonical;localStorage.setItem("SP_COURSE_CODE",canonical)}
  localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));
  localStorage.setItem("SP_STUDENT_PROFILE",JSON.stringify(p));
  localStorage.setItem("SP_COURSE_RELEASES",JSON.stringify(data||{}));
  localStorage.setItem("SP_RELEASE_CACHE_COURSE",canonical||clean(data?.id||p.courseDocId||""));
  localStorage.setItem("SP_RELEASE_SYNC_AT",String(Date.now()));
 }catch(e){}
 return data||{}
}
function getPath(obj,path){let cur=obj;for(const part of path){if(!cur||typeof cur!=="object"||!(part in cur))return undefined;cur=cur[part]}return cur}
function anyValue(data,paths){for(const p of paths){const v=Array.isArray(p)?getPath(data,p):undefined;if(v!==undefined)return v}return undefined}
function normalizeModule(module){const m=String(module||"").trim(),low=m.toLowerCase();if(low==="wortschatz")return{title:"Wortschatz",slug:"wortschatz",aliases:["Wortschatz","wortschatz"]};if(["verben","verben a1","verben-a1","verben test","verben-test"].includes(low))return{title:"Verben",slug:"verben",aliases:["Verben","verben","Verben A1","verben-A1","Verben Test","verben-test"]};if(low==="irreguläre verben"||low==="irregulaere verben"||low==="irregulaere-verben")return{title:"Irreguläre Verben",slug:"irregulaere-verben",aliases:["Irreguläre Verben","irregulaere-verben"]};if(low==="fragen-a1"||low==="fragen a1")return{title:"Fragen A1",slug:"fragen-A1",aliases:["Fragen A1","fragen-A1"]};return{title:m,slug:m,aliases:[m]}}
function moduleValues(data,m){return uniq(m.aliases).flatMap(a=>[data.enabledModules?.[a],data.releases?.[a]?.enabled]).filter(v=>v!==undefined)}
function moduleExplicitOff(data,m){const vals=moduleValues(data,m);return !vals.some(v=>v===true)&&vals.some(v=>v===false)}
function defaultOpen(data){return data.releaseMode==="all"||data.releaseMode==="open"||data.defaultLocked===false}
function directModuleContent(data,m){const aliases=uniq(m.aliases);return aliases.some(a=>Object.keys(data.enabledLessons||{}).some(k=>k.startsWith(a+"/"))||Object.keys(data.enabledThemes||{}).some(k=>k.startsWith(a+"/"))||!!data.releases?.[a])||(m.slug==="verben"&&Object.keys(data.enabledWords||{}).length>0)}
export function moduleOpen(data,module){if(isTeacher())return true;if(!hasReleaseData(data))return false;const m=normalizeModule(module),vals=moduleValues(data,m);if(vals.some(v=>v===true))return true;if(vals.some(v=>v===false))return false;if(directModuleContent(data,m))return true;return defaultOpen(data)}
export function lessonOpen(data,module,lessonKey){if(isTeacher())return true;if(!hasReleaseData(data))return false;const m=normalizeModule(module);if(moduleExplicitOff(data,m))return false;const keys=[lessonKey,...m.aliases.map(a=>`${a}/${lessonKey}`)],vals=keys.map(k=>data.enabledLessons?.[k]);m.aliases.forEach(a=>vals.push(getPath(data,["releases",a,"lessons",lessonKey,"enabled"])));if(vals.some(v=>v===true))return true;if(vals.some(v=>v===false))return false;return defaultOpen(data)}
export function themeOpen(data,module,lessonKey,themeKey){if(isTeacher())return true;if(!hasReleaseData(data))return false;const m=normalizeModule(module);if(moduleExplicitOff(data,m))return false;const keys=[`${lessonKey}/${themeKey}`,...m.aliases.map(a=>`${a}/${lessonKey}/${themeKey}`)],vals=keys.map(k=>data.enabledThemes?.[k]);m.aliases.forEach(a=>vals.push(getPath(data,["releases",a,"lessons",lessonKey,"themes",themeKey,"enabled"])));if(vals.some(v=>v===true))return true;if(vals.some(v=>v===false))return false;return defaultOpen(data)}
export function taskOpen(data,module,lessonKey,themeKey,file){if(isTeacher())return true;if(!hasReleaseData(data))return false;if(!themeOpen(data,module,lessonKey,themeKey))return false;const m=normalizeModule(module);const scoped=[`${lessonKey}/${themeKey}/${file}`,...m.aliases.map(a=>`${a}/${lessonKey}/${themeKey}/${file}`)],vals=scoped.map(k=>data.enabledTasks?.[k]);m.aliases.forEach(a=>vals.push(getPath(data,["releases",a,"lessons",lessonKey,"themes",themeKey,"tasks",file])));if(vals.some(v=>v===true))return true;if(vals.some(v=>v===false))return false;return true}
export function verbOpen(data,verb){if(isTeacher())return true;if(!hasReleaseData(data))return false;const m=normalizeModule("Verben");if(moduleExplicitOff(data,m))return false;const vals=[data.enabledWords?.[verb],data.enabledWords?.[`verben/${verb}`],data.enabledWords?.[`Verben/${verb}`],data.enabledWords?.[`verben-A1/${verb}`],data.enabledWords?.[`Verben A1/${verb}`],getPath(data,["releases","verben","words",verb]),getPath(data,["releases","Verben","words",verb]),getPath(data,["releases","verben-A1","words",verb]),getPath(data,["releases","Verben A1","words",verb])];if(vals.some(v=>v===true))return true;if(vals.some(v=>v===false))return false;return defaultOpen(data)}
export function releasedVerbs(data,verbs){const list=(verbs||[]).map(v=>typeof v==="string"?v:v?.v).filter(Boolean);return list.filter(v=>verbOpen(data,v))}
export function assessmentEnabled(data){const v=anyValue(data,[["settings","verben","assessmentEnabled"],["releases","verben","assessmentEnabled"],["settings","verben-A1","assessmentEnabled"],["settings","Verben A1","assessmentEnabled"],["releases","verben-A1","assessmentEnabled"],["releases","Verben A1","assessmentEnabled"],["verbenA1AssessmentEnabled"]]);return v===undefined?true:v!==false}
window.SPCourseReleases={loadCourseRelease,rememberRelease,courseCodes,moduleOpen,lessonOpen,themeOpen,taskOpen,verbOpen,releasedVerbs,assessmentEnabled};
