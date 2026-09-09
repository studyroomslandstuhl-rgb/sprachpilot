(function(){
'use strict';
if(window.__SP_RELEASE_SAVE_VERIFIED_20260908)return;
window.__SP_RELEASE_SAVE_VERIFIED_20260908=true;

const RELEASE_KEYS=['releaseMode','defaultLocked','enabledModules','enabledLessons','enabledThemes','enabledTasks','enabledWords','enabledSets','releases','settings','verbenA1AssessmentEnabled'];
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase().replace(/\s+/g,'');

function status(message,kind=''){
  const el=document.getElementById('spStatus');
  if(!el)return;
  el.textContent=message;
  el.className='sp-status'+(kind?' '+kind:'');
}
function firestoreSafeKey(key){
  const value=String(key||'');
  if(!/^__.*__$/.test(value))return value;
  if(value==='__exam__')return 'task.html?task=exam';
  const core=value.replace(/^__+|__+$/g,'')||'field';
  return 'sp_'+core;
}
function sanitize(value){
  if(Array.isArray(value))return value.map(sanitize);
  if(!value||typeof value!=='object'||value instanceof Date||typeof value.toDate==='function')return value;
  const out={};
  Object.entries(value).forEach(([key,item])=>{
    if(item===undefined||typeof item==='function')return;
    const safeKey=firestoreSafeKey(key);
    const safeValue=sanitize(item);
    if(Object.prototype.hasOwnProperty.call(out,safeKey)&&typeof out[safeKey]==='boolean'&&typeof safeValue==='boolean')out[safeKey]=out[safeKey]||safeValue;
    else out[safeKey]=safeValue;
  });
  return out;
}
function same(a,b){
  if(a===b)return true;
  if(a==null||b==null)return a===b;
  if(Array.isArray(a)||Array.isArray(b)){
    if(!Array.isArray(a)||!Array.isArray(b)||a.length!==b.length)return false;
    return a.every((item,index)=>same(item,b[index]));
  }
  if(typeof a==='object'&&typeof b==='object'){
    const ak=Object.keys(a).sort(),bk=Object.keys(b).sort();
    if(ak.length!==bk.length||ak.some((key,index)=>key!==bk[index]))return false;
    return ak.every(key=>same(a[key],b[key]));
  }
  return false;
}
function stateCourses(){return window.SPTeacherDashboard?.state?.courses||window.__SP_COURSES||[]}
function courseDocId(course={}){return text(course.__docId||course.docId||course.courseDocId||course.id)}
function courseCode(course={}){return text(course.courseCode||course.kurs||course.kursnummer||course.code||course.name||course.courseName)}
function resolveCourse(id,data={}){
  const wanted=[id,data.courseDocId,data.courseCode,data.kurs,data.kursnummer,data.courseName].map(norm).filter(Boolean);
  const rows=stateCourses();
  const matches=rows.filter(course=>{
    const values=[courseDocId(course),courseCode(course),course.id,course.name,course.courseName].map(norm).filter(Boolean);
    return values.some(value=>wanted.includes(value));
  });
  if(matches.length===1)return matches[0];
  const exact=matches.find(course=>norm(courseDocId(course))===norm(id));
  return exact||null;
}
function rebuildCourseGlobals(courses){
  window.__SP_COURSES=courses;
  window.__SP_COURSES_BY_CODE=Object.fromEntries(courses.map(course=>[courseCode(course),course]).filter(([code])=>code));
}
function install(){
  const Courses=window.Courses;
  if(!Courses||Courses.__verifiedReleaseSave20260908)return false;
  const originalUpdate=typeof Courses.update==='function'?Courses.update.bind(Courses):null;
  Courses.__verifiedReleaseSave20260908=true;

  Courses.update=async function(id,data){
    const releaseUpdate=RELEASE_KEYS.some(key=>Object.prototype.hasOwnProperty.call(data||{},key));
    if(!releaseUpdate&&originalUpdate)return originalUpdate(id,data);
    const database=typeof Courses.database==='function'?Courses.database():(window.db||window.firebase?.firestore?.());
    if(!database?.collection)throw new Error('Firebase ist nicht verfügbar.');

    const course=resolveCourse(id,data||{});
    const docId=courseDocId(course)||text(id);
    if(!docId)throw new Error('Kurs-ID fehlt.');

    const canonicalCode=courseCode(course)||text(data?.courseCode||data?.kurs||data?.kursnummer);
    const clean=sanitize(data||{});
    clean.courseDocId=docId;
    if(canonicalCode){clean.courseCode=canonicalCode;clean.kurs=canonicalCode;clean.kursnummer=canonicalCode;}
    if(!clean.courseName)clean.courseName=text(course?.courseName||course?.name||canonicalCode||docId);

    const serverTimestamp=window.firebase?.firestore?.FieldValue?.serverTimestamp;
    const stamp=typeof serverTimestamp==='function'?serverTimestamp():new Date();
    const ref=database.collection('courses').doc(docId);
    status('Freigaben werden in Firebase gespeichert …');
    await ref.set({...clean,updatedAt:stamp,releaseUpdatedAt:stamp},{merge:true});

    let snap;
    try{snap=await ref.get({source:'server'});}catch(error){snap=await ref.get();}
    if(!snap?.exists)throw new Error('Firebase hat das Kursdokument nach dem Speichern nicht zurückgeliefert.');
    const saved={id:snap.id,__docId:snap.id,...(snap.data()||{})};

    for(const key of RELEASE_KEYS){
      if(Object.prototype.hasOwnProperty.call(clean,key)&&!same(saved[key],clean[key])){
        throw new Error('Firebase-Rückprüfung fehlgeschlagen: '+key+' wurde nicht vollständig gespeichert.');
      }
    }

    const courses=stateCourses();
    const index=courses.findIndex(row=>courseDocId(row)===docId);
    if(index>=0)courses[index]=saved;else courses.push(saved);
    if(window.SPTeacherDashboard?.state)window.SPTeacherDashboard.state.courses=courses;
    rebuildCourseGlobals(courses);
    status('Freigaben gespeichert und in Firebase geprüft.','ok');
    try{window.dispatchEvent(new CustomEvent('SP_RELEASES_SAVED_VERIFIED',{detail:{courseDocId:docId,courseCode:courseCode(saved)}}));}catch(e){}
    return saved;
  };
  return true;
}

if(!install()){
  let tries=0;
  const timer=setInterval(()=>{
    tries++;
    if(install()||tries>100)clearInterval(timer);
  },100);
}
})();
