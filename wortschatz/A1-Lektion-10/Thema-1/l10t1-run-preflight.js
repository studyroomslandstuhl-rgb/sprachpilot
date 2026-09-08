const TOPIC='wortschatz-a1-lektion-10-thema-1';
const taskId=String(new URLSearchParams(location.search).get('task')||'karteikarten');
const run=Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));
const stateKey=`SP_L10_T1_${taskId}`;
const isTeacher=(()=>{try{return ['teacher','lehrer','admin','owner','superadmin'].includes(String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase())||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}})();

if(!window.__SP_L10T1_RUN_PATCHED){
 window.__SP_L10T1_RUN_PATCHED=true;
 const originalGet=Storage.prototype.getItem;
 const originalSet=Storage.prototype.setItem;
 const originalRemove=Storage.prototype.removeItem;
 Storage.prototype.getItem=function(key){
  if(isTeacher&&this===localStorage&&/^SP_L10_T1_/.test(String(key||'')))return originalGet.call(sessionStorage,key);
  return originalGet.call(this,key);
 };
 Storage.prototype.setItem=function(key,value){
  if(/^SP_L10_T1_/.test(String(key||''))){
   try{const data=JSON.parse(String(value||'null'));if(data&&typeof data==='object'){data._run=Math.max(1,Math.min(3,Number(originalGet.call(localStorage,'SP_SCORE_RUN_'+TOPIC)||1)||1));value=JSON.stringify(data)}}catch(e){}
   if(isTeacher&&this===localStorage)return originalSet.call(sessionStorage,key,value);
  }
  return originalSet.call(this,key,value);
 };
 Storage.prototype.removeItem=function(key){
  if(isTeacher&&this===localStorage&&/^SP_L10_T1_/.test(String(key||'')))return originalRemove.call(sessionStorage,key);
  return originalRemove.call(this,key);
 };
}

try{
 const s=JSON.parse(localStorage.getItem(stateKey)||'null');
 if(s&&Number(s._run||1)!==run)localStorage.removeItem(stateKey);
}catch(e){}

async function examAllowed(){
 if(taskId!=='pruefung'||isTeacher)return true;
 const practice=(window.L10T1?.tasks||[]).filter(t=>!t.exam);
 const localDone=practice.every(t=>{try{const s=JSON.parse(localStorage.getItem(`SP_L10_T1_${t.id}`)||'null');return s&&Number(s._run||1)===run&&Array.isArray(s.done)&&Number(s.total||34)>0&&s.done.length>=Number(s.total||34)}catch(e){return false}});
 if(localDone)return true;
 try{
  const mod=await import('/js/progress.js?v=20260831-central6');
  const all=await mod.loadCurrentStudentProgress();
  const topic=all?.wortschatz?.[TOPIC];
  if(!topic)return false;
  const topicRun=Number(topic.currentRun||topic.current?.run||run)||run;
  if(topicRun!==run)return false;
  return practice.every(t=>{const rec=topic.tasks?.[t.id]||topic.tasks?.[`task.html?task=${t.id}`];return rec&&Number(rec.run||topicRun)===run&&Number(rec.percent||0)>=100});
 }catch(e){return false}
}

export const allowed=await examAllowed();
if(!allowed)location.replace('./');
