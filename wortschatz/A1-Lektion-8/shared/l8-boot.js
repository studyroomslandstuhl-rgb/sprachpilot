(function(){
'use strict';
let stateV2Promise=null;
function ensureStateV2(){
 if(window.__SP_L8_STATE_V2&&window.L8S?.stateSchema===2)return Promise.resolve();
 if(stateV2Promise)return stateV2Promise;
 stateV2Promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='../shared/l8-state-v2.js?v=20260825-progress2';s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
 return stateV2Promise;
}
function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim()}
function taskText(task){
 const items=(Array.isArray(task?.items)?task.items:[]).slice(0,6).map(item=>`${item?.type||''} ${item?.prompt||''} ${item?.context||''} ${item?.hint||''}`).join(' ');
 return norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''} ${task?.instruction||''} ${task?.intro||''} ${items}`);
}
function taskEmoji(task){
 const text=taskText(task),types=new Set((Array.isArray(task?.items)?task.items:[]).map(item=>String(item?.type||'').toLowerCase()));
 if(task?.exam||/prufung|exam/.test(text))return'⭐';
 if(/karte|card/.test(text)||task?.kind==='cards')return'📚';
 if(/memory/.test(text))return'🧠';
 if(/hor|listen|audio/.test(text)||(task?.items||[]).some(item=>item?.audio||item?.audioFile))return'🎧';
 if(/lesen|reading|text versteh|leseversteh/.test(text))return'📖';
 if(/grammatik|grammar|satzteil/.test(text))return'🧲';
 if(/konjug|\bsein\b|\bhaben\b/.test(text))return'🔤';
 if(/endung|gruppe|sort|zuord/.test(text))return'📦';
 if(/ordnen|order|reihenfolge|redemittel/.test(text)||types.has('order'))return'🧩';
 if(/schreib|write|lucke|text|brief|information|markier|plural/.test(text)||types.has('input')||types.has('free'))return'✍️';
 if(/wahl|choice|artikel|richtig|falsch|uberschrift|fehler/.test(text)||types.has('choice'))return'✅';
 return'✅';
}
function polishHeader(){
 const t=window.L8_THEME;if(!t)return;
 const taskId=new URLSearchParams(location.search).get('task');
 const task=(t.tasks||[]).find(x=>x.id===taskId);
 const subtitle=document.querySelector('.sp-header__subtitle');
 if(subtitle)subtitle.textContent=task?`${task.title} · A1 Lektion 8 · Thema ${t.number}`:`${t.title} · A1 Lektion 8 · Thema ${t.number}`;
 document.querySelectorAll('.sp-header__nav-link').forEach(link=>{if(String(link.textContent||'').trim()==='Übersicht'&&link.tagName==='A')link.setAttribute('href','uebersicht.html')});
}
function polishTaskEmojis(){
 const t=window.L8_THEME;if(!t||!Array.isArray(t.tasks))return;
 if(document.body.dataset.page==='theme'){
  document.querySelectorAll('.l8-task-card').forEach((card,index)=>{
   const task=t.tasks[index],node=card.querySelector('.emoji');
   if(task&&node)node.textContent=taskEmoji(task);
  });
  return;
 }
 const taskId=new URLSearchParams(location.search).get('task'),task=t.tasks.find(item=>String(item?.id)===String(taskId));
 const line=document.querySelector('.l8-task-title-block p');
 if(task&&line)line.textContent=`${taskEmoji(task)} ${task.instruction||''}`;
}
async function start(){
 try{await ensureStateV2()}catch(error){console.error('L8 Fortschrittssystem konnte nicht geladen werden',error)}
 if(window.L8_T2_TIME_REVIEW_PENDING||window.L8_T2_QUALITY_PENDING||!window.L8_THEME||!window.L8S||!window.L8UI||window.L8S.stateSchema!==2){setTimeout(start,30);return}
 if(document.body.dataset.page==='theme')window.L8UI.themeOverview();else window.L8UI.taskPage();
 [0,80,250,700,1500].forEach(ms=>setTimeout(()=>{polishHeader();polishTaskEmojis()},ms));
}
window.L8TaskEmoji=taskEmoji;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();