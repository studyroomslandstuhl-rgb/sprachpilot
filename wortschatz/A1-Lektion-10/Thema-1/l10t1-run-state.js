(function(){
'use strict';
const taskId=String(new URLSearchParams(location.search).get('task')||'').trim();
if(!taskId)return;
const topicId='wortschatz-a1-lektion-10-thema-1';
const currentRun=Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+topicId)||1)||1));
const key=`SP_L10_T1_${taskId}`;
function read(){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
function write(s){try{localStorage.setItem(key,JSON.stringify(s))}catch(e){}}
const existing=read();
if(existing&&typeof existing==='object'){
 const stateRun=Number(existing._run||1)||1;
 const total=Number(existing.total||0),done=Array.isArray(existing.done)?existing.done.length:Number(existing.done||0);
 const completedPractice=taskId!=='pruefung'&&total>0&&done>=total;
 if(stateRun!==currentRun||completedPractice){try{localStorage.removeItem(key)}catch(e){}}
 else{existing._run=currentRun;write(existing)}
}
setTimeout(()=>{const s=read();if(s&&typeof s==='object'&&Number(s._run||0)!==currentRun){s._run=currentRun;write(s)}},350);
window.L10T1RunState={currentRun,key};
})();
