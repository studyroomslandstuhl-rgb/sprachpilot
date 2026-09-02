(function(){
'use strict';
if(window.__SP_L8T2_TASK3_STABLE_UI_20260902_V1)return;window.__SP_L8T2_TASK3_STABLE_UI_20260902_V1=true;
const TASK_ID='zeitwoerter-seit-vor';
const base=window.L8UI;if(!base||typeof base.taskPage!=='function')return;
const original=base.taskPage;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function current(){const id=new URLSearchParams(location.search).get('task');return (window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id))||null}
function taskNo(task){const i=(window.L8_THEME?.tasks||[]).findIndex(t=>String(t?.id)===String(task.id));return i>=0?i+1:''}
function finish(root){root.innerHTML='<div class="l8-wrap"><section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Zeitangaben richtig gebildet.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>'}
function render(task,root){
 const S=window.L8S,T=window.L8_THEME;if(!S||!T)return original();
 let state=S.load(T.number,task.id,task.items.length),idx=S.nextIndex(T.number,task.id,task.items.length);
 if(idx==null||idx<0)return finish(root);
 state=S.load(T.number,task.id,task.items.length);
 const item=task.items[idx],done=state.done?.length||0,pct=Math.round(done/Math.max(1,task.items.length)*100);
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNo(task)}</span><h1>${esc(task.title)}</h1><p>✍️ ${esc(task.instruction||'Schreibe die richtige Zeitangabe.')}</p></div><div class="l8-progress-row"><span>${done} von ${task.items.length} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section><section class="l8-card l8-exercise" data-sp-task-stage="1"><div class="l8-prompt">${esc(item.prompt)}</div><div class="l8-answer-row"><input class="l8-input" id="spT2Task3Answer" autocomplete="off" inputmode="text" placeholder="Antwort"><button class="l8-btn primary" id="spT2Task3Check" type="button">Prüfen</button></div><div id="feedback"></div></section></div>`;
 const input=document.getElementById('spT2Task3Answer'),button=document.getElementById('spT2Task3Check'),box=document.getElementById('feedback');
 let busy=false;
 const check=()=>{
  if(busy)return;const value=String(input.value||'').trim();if(!value)return;
  if(S.equal(value,item.answer)){
   busy=true;button.disabled=true;input.disabled=true;
   const result=S.right(T.number,task.id,task.items.length,idx,value);
   if(box)box.innerHTML=`<div class="l8-feedback good">${result.needsReview?'Richtig. Diese Form kommt am Ende noch einmal.':'Richtig!'}</div>`;
   requestAnimationFrame(()=>requestAnimationFrame(()=>render(task,root)));
   return;
  }
  const result=S.wrong(T.number,task.id,task.items.length,idx,value),tries=result.tries||1;
  if(box)box.innerHTML=`<div class="l8-feedback ${tries===1?'bad':'warn'}">${tries===1?'Noch nicht richtig. Versuch es noch einmal.':tries===2?'Achte auf seit/vor und die richtige Dativform.':`Lösung: ${esc(Array.isArray(item.answer)?item.answer[0]:item.answer)}. Gib sie jetzt selbst richtig ein.`}</div>`;
  input.select();input.focus();
 };
 button.onclick=check;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check()}};setTimeout(()=>input.focus(),0);
}
function patched(){const task=current(),root=document.getElementById('app');if(task?.id===TASK_ID&&root)return render(task,root);return original()}
window.L8UI={...base,taskPage:patched};
window.L8T2Task3StableUI20260902={render,version:1};
})();