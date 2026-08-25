(function(){
'use strict';
if(window.__SP_L5T4_TASK10_PROGRESS_SCOPE_V7)return;window.__SP_L5T4_TASK10_PROGRESS_SCOPE_V7=true;
function read(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(e){return null}}
function clean(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9@._-]+/g,'_').replace(/^_+|_+$/g,'')}
function browserId(){let id=clean(localStorage.getItem('SP_L5T4_BROWSER_PID_V1'));if(id)return id;try{id='browser_'+crypto.randomUUID().replace(/-/g,'')}catch(e){id='browser_'+Date.now().toString(36)+Math.random().toString(36).slice(2)};try{localStorage.setItem('SP_L5T4_BROWSER_PID_V1',id)}catch(e){}return id}
function pid(){const p=read('SP_USER_PROFILE')||read('SP_STUDENT_PROFILE')||{},course=p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem('SP_COURSE_CODE')||'',name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join('_');return [p.authUid,p.canonicalStudentId,p.docId,p.studentId,p.uid,p.userId,p.id,localStorage.getItem('SP_STUDENT_ID'),p.email,course&&(p.email||name)?`${course}_${p.email||name}`:''].map(clean).find(Boolean)||browserId()}
const cfgKey=String(window.SP_L5_THEME?.key||'SP_L5_T4_V1');
const rawTaskKey=typeof window.taskKey==='function'?window.taskKey:null;
function isTask10(file){return /^zuordnen(?:-v[567])?\.html$/i.test(String(file||''))}
function scopedTaskKey(file){if(isTask10(file))return `${cfgKey}_U_${pid()}_zuordnen_v7`;return rawTaskKey?rawTaskKey(file):`${cfgKey}_${file}`}
if(rawTaskKey){window.taskKey=scopedTaskKey;try{taskKey=scopedTaskKey}catch(e){}}
window.SP_L5T4_TASK10_PID=pid;
window.SP_L5T4_TASK10_KEY=function(file='zuordnen-v7.html'){return scopedTaskKey(file)};
})();