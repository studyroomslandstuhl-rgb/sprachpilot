(function(){
'use strict';
if(window.__SP_RELEASE_STALE_CLEANUP_V2)return;window.__SP_RELEASE_STALE_CLEANUP_V2=true;
// L7+ use task.html?task=... routes and must never be cleaned by the old filename catalog.
const lessonRange=lesson=>{const n=Number(String(lesson||'').match(/A1-Lektion-(\d+)/i)?.[1]||0);return n>=3&&n<=6};
const catalog=()=>window.SP_A1_RELEASE_CATALOG_L3_L7?.lessons||[];
function valid(){
 const themes=new Set(),tasks=new Map();
 for(const lesson of catalog())for(const theme of lesson.themes||[]){const base=`${lesson.key}/${theme.key}`;themes.add(base);const set=new Set();for(const entry of theme.tasks||[]){const file=Array.isArray(entry)?entry[0]:entry?.file;if(file)set.add(String(file))}tasks.set(base,set)}
 return{themes,tasks}
}
function parseThemeKey(key){const m=String(key||'').match(/(A1-Lektion-\d+)\/(Thema-\d+)/i);return m?{lesson:m[1],theme:m[2],base:`${m[1]}/${m[2]}`}:null}
function parseTaskKey(key){const m=String(key||'').match(/(A1-Lektion-\d+)\/(Thema-\d+)\/(.+)$/i);return m?{lesson:m[1],theme:m[2],base:`${m[1]}/${m[2]}`,file:m[3]}:null}
function cleanCourse(course){
 const rules=valid();if(!rules.themes.size)return null;let changed=false;
 const enabledThemes={...(course.enabledThemes||{})};
 for(const key of Object.keys(enabledThemes)){const p=parseThemeKey(key);if(p&&lessonRange(p.lesson)&&!rules.themes.has(p.base)){delete enabledThemes[key];changed=true}}
 const enabledTasks={...(course.enabledTasks||{})};
 for(const key of Object.keys(enabledTasks)){const p=parseTaskKey(key);if(!p||!lessonRange(p.lesson))continue;const allowed=rules.tasks.get(p.base);if(!allowed||!allowed.has(p.file)){delete enabledTasks[key];changed=true}}
 const releases=JSON.parse(JSON.stringify(course.releases||{}));
 for(const moduleKey of ['wortschatz','Wortschatz']){
  const lessons=releases?.[moduleKey]?.lessons;if(!lessons||typeof lessons!=='object')continue;
  for(const [lessonKey,lesson] of Object.entries(lessons)){
   if(!lessonRange(lessonKey)||!lesson?.themes)continue;
   for(const themeKey of Object.keys(lesson.themes)){
    const base=`${lessonKey}/${themeKey}`;
    if(!rules.themes.has(base)){delete lesson.themes[themeKey];changed=true;continue}
    const taskMap=lesson.themes[themeKey]?.tasks;if(!taskMap||typeof taskMap!=='object')continue;const allowed=rules.tasks.get(base)||new Set();
    for(const file of Object.keys(taskMap))if(!allowed.has(file)){delete taskMap[file];changed=true}
   }
  }
 }
 return changed?{enabledThemes,enabledTasks,releases}:null
}
let running=false,lastSignature='';
async function run(){
 if(running)return false;const rows=Object.values(window.__SP_COURSES_BY_CODE||{}).filter(Boolean);const database=window.db;if(!rows.length||!database?.collection)return false;
 const signature=rows.map(row=>String(row.__docId||row.id||row.courseCode||'')).sort().join('|');if(signature&&signature===lastSignature)return true;
 running=true;let changedCount=0;
 try{
  for(const course of rows){const patch=cleanCourse(course);if(!patch)continue;const id=String(course.__docId||course.docId||course.id||'').trim();if(!id)continue;
   try{await database.collection('courses').doc(id).update(patch);Object.assign(course,patch);changedCount++}catch(error){console.warn('Alte Schein-Freigaben konnten für einen Kurs nicht bereinigt werden',id,error)}
  }
  lastSignature=signature;if(changedCount)try{window.dispatchEvent(new CustomEvent('SP_RELEASE_STALE_KEYS_CLEANED',{detail:{courses:changedCount}}))}catch(e){}return true;
 }finally{running=false}
}
// Only one delayed cleanup pass. No focus listener and no repeated background writes.
function schedule(){setTimeout(()=>run().catch(()=>{}),2200)}
window.SPReleaseStaleCleanupL3L6={run,cleanCourse};
window.addEventListener('load',schedule,{once:true});
})();
