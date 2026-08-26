(function(){
'use strict';
if(window.__SP_L5T4_TASK10_PROGRESS_SCOPE_V8)return;
window.__SP_L5T4_TASK10_PROGRESS_SCOPE_V8=true;

const cfgKey=String(window.SP_L5_THEME?.key||'SP_L5_T4_V1');
const LOGICAL_FILE='zuordnen.html';
const REV='20260826-task10-v8';
const TOTAL=10;
const rawTaskKey=typeof window.taskKey==='function'?window.taskKey:null;

function read(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(e){return null}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){console.warn('L5T4 progress',e);return false}}
function clean(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9@._-]+/g,'_').replace(/^_+|_+$/g,'')}
function profile(){return read('SP_USER_PROFILE')||read('SP_STUDENT_PROFILE')||read('SP_PROFILE_BACKUP')||read('SP_STUDENT_PROFILE_BACKUP')||{}}
function pid(){
 const p=profile();
 return [p.authUid,p.canonicalStudentId,p.docId,p.studentId,p.uid,p.userId,p.id,localStorage.getItem('SP_STUDENT_AUTH_UID'),localStorage.getItem('SP_STUDENT_ID'),p.email]
  .map(clean).find(Boolean)||'';
}
function browserPid(){return clean(localStorage.getItem('SP_L5T4_BROWSER_PID_V1'))}
function isTask10(file){return /^zuordnen(?:-v\d+)?\.html$/i.test(String(file||''))}
function stableKey(){return `${cfgKey}_${LOGICAL_FILE}`}
function normalizeState(raw){
 if(!raw||typeof raw!=='object')return null;
 const done=[...new Set((Array.isArray(raw.done)?raw.done:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<TOTAL))];
 let current=raw.current===null||raw.current===undefined?null:Number(raw.current);
 if(!Number.isInteger(current)||current<0||current>=TOTAL||done.includes(current))current=null;
 let queue=[...new Set((Array.isArray(raw.queue)?raw.queue:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<TOTAL&&!done.includes(i)&&i!==current))];
 if(!queue.length&&done.length<TOTAL&&current===null)queue=[...Array(TOTAL).keys()].filter(i=>!done.includes(i));
 return{rev:REV,total:TOTAL,done,queue,current,tries:Math.max(0,Number(raw.tries)||0),hadWrong:raw.hadWrong===true};
}
function score(state){if(!state)return-1;return state.done.length*100+(state.current!==null?5:0)+Math.min(4,state.tries||0)}
function candidateKeys(){
 const keys=[stableKey(),`${cfgKey}_zuordnen-v7.html`,`${cfgKey}_zuordnen-v6.html`,`${cfgKey}_zuordnen-v5.html`];
 const id=pid();
 if(id){
  ['zuordnen','zuordnen_v8','zuordnen_v7','zuordnen_v6','zuordnen_v5'].forEach(s=>keys.push(`${cfgKey}_U_${id}_${s}`));
 }else{
  const bid=browserPid();
  if(bid)['zuordnen','zuordnen_v8','zuordnen_v7','zuordnen_v6','zuordnen_v5'].forEach(s=>keys.push(`${cfgKey}_U_${bid}_${s}`));
 }
 return [...new Set(keys)];
}
function migrate(){
 let best=null;
 for(const key of candidateKeys()){
  const state=normalizeState(read(key));
  if(state&&score(state)>score(best))best=state;
 }
 if(best)write(stableKey(),best);
 return best;
}
function task10Key(){migrate();return stableKey()}
function scopedTaskKey(file){if(isTask10(file))return task10Key();return rawTaskKey?rawTaskKey(file):`${cfgKey}_${file}`}

if(rawTaskKey){window.taskKey=scopedTaskKey;try{taskKey=scopedTaskKey}catch(e){}}
window.SP_L5T4_TASK10_PID=pid;
window.SP_L5T4_TASK10_KEY=function(file=LOGICAL_FILE){return isTask10(file)?task10Key():(rawTaskKey?rawTaskKey(file):`${cfgKey}_${file}`)};
window.SP_L5T4_TASK10_MIGRATE=migrate;
window.SP_L5T4_TASK10_REV=REV;
window.SP_L5T4_TASK10_FILE=LOGICAL_FILE;

migrate();
window.addEventListener('SP_STUDENT_IDENTITY_NORMALIZED',migrate);
window.addEventListener('SP_PROFILE_SYNCED',migrate);
})();
