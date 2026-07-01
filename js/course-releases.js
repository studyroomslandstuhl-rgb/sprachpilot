import { db, doc, getDoc, collection, query, where, getDocs, limit } from "./firebase.js";

function profileFromStorage(){
  try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE")||localStorage.getItem("SP_STUDENT_PROFILE")||"null")||{}}catch(e){return {}}
}
function uniq(list){return [...new Set((list||[]).filter(Boolean))]}
function clean(v){return String(v||"").trim()}
function variants(value){
  const v=clean(value);
  if(!v)return [];
  return [v,v.toUpperCase(),v.toLowerCase(),v.replace(/\s+/g,""),v.toLowerCase().replace(/\s+/g,"")];
}
function isTeacher(){
  const role=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
  const p=profileFromStorage();
  return role==="teacher" || role==="lehrer" || p.role==="teacher" || p.teacherPreview===true || p.isTeacher===true;
}
function hasReleaseData(d){
  return !!(d && typeof d==="object" && (d.enabledModules || d.enabledLessons || d.enabledThemes || d.enabledTasks || d.enabledWords || d.enabledSets || d.releases || d.releaseMode || d.defaultLocked!==undefined || d.verbenA1AssessmentEnabled!==undefined));
}
export function courseCodes(profile=profileFromStorage()){
  const raw=[profile.courseDocId,profile.kurs,profile.kursnummer,profile.courseCode,profile.courseId,profile.courseName,profile.code,profile.id,localStorage.getItem("SP_COURSE_CODE")];
  return uniq(raw.flatMap(variants));
}
async function readCourseDoc(id){
  try{
    const snap=await getDoc(doc(db,"courses",String(id)));
    return snap.exists()?{id:snap.id,...(snap.data()||{})}:null;
  }catch(e){return null}
}
async function queryCourse(field,value){
  try{
    const snap=await getDocs(query(collection(db,"courses"),where(field,"==",String(value)),limit(1)));
    if(!snap.empty){
      const d=snap.docs[0];
      return {id:d.id,...(d.data()||{})};
    }
  }catch(e){}
  return null;
}
export async function loadCourseRelease(profile=profileFromStorage()){
  if(isTeacher())return {releaseMode:"all",defaultLocked:false,teacherPreview:true};
  const fallback=profile.assignments || (()=>{try{return JSON.parse(localStorage.getItem("SP_COURSE_RELEASES")||"{}")||{}}catch(e){return {}}})();
  const codes=courseCodes(profile);
  for(const code of codes){
    const d=await readCourseDoc(code);
    if(hasReleaseData(d))return rememberRelease(profile,d);
  }
  const fields=["courseCode","kurs","kursnummer","courseDocId","courseId","id","name","courseName","code"];
  for(const field of fields){
    for(const code of codes){
      const d=await queryCourse(field,code);
      if(hasReleaseData(d))return rememberRelease(profile,d);
    }
  }
  return rememberRelease(profile,fallback||{});
}
export function rememberRelease(profile,data){
  try{
    const p={...(profile||profileFromStorage())};
    p.assignments=data||{};
    if(data?.id || data?.courseDocId)p.courseDocId=data.courseDocId||data.id;
    if(data?.courseCode || data?.kurs || data?.kursnummer){
      p.courseCode=data.courseCode||data.kurs||data.kursnummer;
      p.kurs=p.kurs||p.courseCode;
      p.kursnummer=p.kursnummer||p.courseCode;
    }
    localStorage.setItem("SP_USER_PROFILE",JSON.stringify(p));
    localStorage.setItem("SP_STUDENT_PROFILE",JSON.stringify(p));
    localStorage.setItem("SP_COURSE_RELEASES",JSON.stringify(data||{}));
  }catch(e){}
  return data||{};
}
function getPath(obj,path){
  let cur=obj;
  for(const part of path){
    if(!cur || typeof cur!=="object" || !(part in cur))return undefined;
    cur=cur[part];
  }
  return cur;
}
function anyValue(data,paths){
  for(const p of paths){
    const v=Array.isArray(p)?getPath(data,p):undefined;
    if(v!==undefined)return v;
  }
  return undefined;
}
function normalizeModule(module){
  const m=String(module||"").trim();
  const low=m.toLowerCase();
  if(low==="wortschatz")return {title:"Wortschatz",slug:"wortschatz"};
  if(low==="verben-a1"||low==="verben a1")return {title:"Verben A1",slug:"verben-A1"};
  if(low==="fragen-a1"||low==="fragen a1")return {title:"Fragen A1",slug:"fragen-A1"};
  return {title:m,slug:m};
}
function moduleExplicitOff(data,m){
  return data.enabledModules?.[m.title]===false || data.enabledModules?.[m.slug]===false || data.releases?.[m.title]?.enabled===false || data.releases?.[m.slug]?.enabled===false;
}
function defaultOpen(data){return data.releaseMode==="all" || data.releaseMode==="open" || data.defaultLocked===false}
function directModuleContent(data,m){
  const prefixSlug=m.slug+"/";
  const prefixTitle=m.title+"/";
  return Object.keys(data.enabledLessons||{}).some(k=>k.startsWith(prefixSlug)||k.startsWith(prefixTitle)) ||
    Object.keys(data.enabledThemes||{}).some(k=>k.startsWith(prefixSlug)||k.startsWith(prefixTitle)) ||
    Object.keys(data.enabledTasks||{}).some(k=>k.startsWith(prefixSlug)||k.startsWith(prefixTitle)) ||
    (m.slug==="verben-A1" && Object.keys(data.enabledWords||{}).length>0) ||
    !!(data.releases?.[m.slug] || data.releases?.[m.title]);
}
export function moduleOpen(data,module){
  if(isTeacher())return true;
  if(!hasReleaseData(data))return false;
  const m=normalizeModule(module);
  const vals=[data.enabledModules?.[m.title],data.enabledModules?.[m.slug],data.releases?.[m.title]?.enabled,data.releases?.[m.slug]?.enabled];
  if(vals.some(v=>v===false))return false;
  if(vals.some(v=>v===true))return true;
  if(directModuleContent(data,m))return true;
  return defaultOpen(data);
}
export function lessonOpen(data,module,lessonKey){
  if(isTeacher())return true;
  if(!hasReleaseData(data))return false;
  const m=normalizeModule(module);
  if(moduleExplicitOff(data,m))return false;
  const keys=[lessonKey,`${m.slug}/${lessonKey}`,`${m.title}/${lessonKey}`];
  const vals=keys.map(k=>data.enabledLessons?.[k]).concat([
    getPath(data,["releases",m.slug,"lessons",lessonKey,"enabled"]),
    getPath(data,["releases",m.title,"lessons",lessonKey,"enabled"])
  ]);
  if(vals.some(v=>v===false))return false;
  if(vals.some(v=>v===true))return true;
  return defaultOpen(data);
}
export function themeOpen(data,module,lessonKey,themeKey){
  if(isTeacher())return true;
  if(!hasReleaseData(data))return false;
  const m=normalizeModule(module);
  if(moduleExplicitOff(data,m))return false;
  const keys=[themeKey,`${lessonKey}/${themeKey}`,`${m.slug}/${lessonKey}/${themeKey}`,`${m.title}/${lessonKey}/${themeKey}`];
  const vals=keys.map(k=>data.enabledThemes?.[k]).concat([
    getPath(data,["releases",m.slug,"lessons",lessonKey,"themes",themeKey,"enabled"]),
    getPath(data,["releases",m.title,"lessons",lessonKey,"themes",themeKey,"enabled"])
  ]);
  if(vals.some(v=>v===false))return false;
  if(vals.some(v=>v===true))return true;
  return lessonOpen(data,module,lessonKey);
}
export function taskOpen(data,module,lessonKey,themeKey,file){
  if(isTeacher())return true;
  if(!hasReleaseData(data))return false;
  const m=normalizeModule(module);
  if(moduleExplicitOff(data,m))return false;
  const keys=[file,`${themeKey}/${file}`,`${lessonKey}/${themeKey}/${file}`,`${m.slug}/${lessonKey}/${themeKey}/${file}`,`${m.title}/${lessonKey}/${themeKey}/${file}`];
  const vals=keys.map(k=>data.enabledTasks?.[k]).concat([
    getPath(data,["releases",m.slug,"lessons",lessonKey,"themes",themeKey,"tasks",file]),
    getPath(data,["releases",m.title,"lessons",lessonKey,"themes",themeKey,"tasks",file])
  ]);
  if(vals.some(v=>v===false))return false;
  if(vals.some(v=>v===true))return true;
  return themeOpen(data,module,lessonKey,themeKey);
}
export function verbOpen(data,verb){
  if(isTeacher())return true;
  if(!hasReleaseData(data))return false;
  const m=normalizeModule("Verben A1");
  if(moduleExplicitOff(data,m))return false;
  const vals=[
    data.enabledWords?.[verb],data.enabledWords?.[`verben-A1/${verb}`],data.enabledWords?.[`Verben A1/${verb}`],
    getPath(data,["releases","verben-A1","words",verb]),getPath(data,["releases","Verben A1","words",verb])
  ];
  if(vals.some(v=>v===false))return false;
  if(vals.some(v=>v===true))return true;
  return defaultOpen(data);
}
export function releasedVerbs(data,verbs){
  const list=(verbs||[]).map(v=>typeof v==="string"?v:v?.v).filter(Boolean);
  return list.filter(v=>verbOpen(data,v));
}
export function assessmentEnabled(data){
  const v=anyValue(data,[
    ["settings","verben-A1","assessmentEnabled"],
    ["settings","Verben A1","assessmentEnabled"],
    ["releases","verben-A1","assessmentEnabled"],
    ["releases","Verben A1","assessmentEnabled"],
    ["verbenA1AssessmentEnabled"]
  ]);
  return v===undefined?true:v!==false;
}
window.SPCourseReleases={loadCourseRelease,rememberRelease,courseCodes,moduleOpen,lessonOpen,themeOpen,taskOpen,verbOpen,releasedVerbs,assessmentEnabled};
