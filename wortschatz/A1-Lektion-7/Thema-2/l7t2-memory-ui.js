(function(){
'use strict';
if(window.__SP_L7T2_MEMORY_UI_V3)return;
window.__SP_L7T2_MEMORY_UI_V3=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t2MemoryV3)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7);
 let open=[],busy=false,feedback='';
 function taskById(id){return S.task(id)}
 function allCards(task){return (task.items||[]).flatMap((pair,index)=>[
  {id:`${index}:i`,pair:index,text:pair.infinitive,type:'Infinitiv'},
  {id:`${index}:p`,pair:index,text:pair.perfekt,type:'Partizip II'}
 ])}
 function state(theme,task){
  const st=S.load(theme,task.id,task.items.length);st.answers=st.answers||{};
  st.answers.memoryWrongPairs=st.answers.memoryWrongPairs||{};
  st.answers.memoryHelpTries=Number(st.answers.memoryHelpTries||0);
  return st
 }
 function stableCards(theme,task){
  const all=allCards(task),ids=all.map(x=>x.id),byId=new Map(all.map(x=>[x.id,x])),st=state(theme,task);
  let order=Array.isArray(st.answers.memoryOrder)?st.answers.memoryOrder:[];
  if(order.length!==ids.length||new Set(order).size!==ids.length||ids.some(id=>!order.includes(id))){order=S.shuffle(ids);st.answers.memoryOrder=order;S.save(theme,task.id,st,false)}
  return order.map(id=>byId.get(id)).filter(Boolean)
 }
 function progress(theme,task){const st=state(theme,task),p=Math.round(st.done.length/Math.max(1,task.items.length)*100);return`<div class="l7-progress-row"><span>${st.done.length} Paare gefunden · ${task.items.length-st.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function nextTask(task){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(x=>x.id===task.id)+1]||null}
 function finish(theme,task){const root=document.getElementById('app'),next=nextTask(task);root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Gut gemacht!</h2><p>Aufgabe abgeschlossen.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${S.esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
 function render(theme,id){
  const task=taskById(id);if(!task?.spL7T2Memory)return raw(theme,id);
  const total=task.items.length,st=state(theme,task);if(st.done.length>=total)return finish(theme,task);
  const cards=stableCards(theme,task),done=new Set(st.done.map(Number)),root=document.getElementById('app');
  const visible=card=>done.has(card.pair)||open.some(x=>x.id===card.id);
  root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progress(theme,task)}<div class="l7-instruction">${S.esc(task.description)}</div><div class="l7-question-card"><div class="sp-l7t2-memory">${cards.map(card=>`<button type="button" class="sp-l7t2-memory-card ${done.has(card.pair)?'done':''} ${open.some(x=>x.id===card.id)?'selected':''}" data-memory="${S.esc(card.id)}">${visible(card)?`<strong>${S.esc(card.text)}</strong><span>${S.esc(card.type)}</span>`:'<strong>?</strong>'}</button>`).join('')}</div><div id="spL7T2MemoryFeedback">${feedback}</div></div></section><footer>© SprachPilot</footer></div>`;
  document.querySelectorAll('[data-memory]').forEach(btn=>btn.addEventListener('click',()=>pick(theme,task,cards,btn.dataset.memory)))
 }
 function mismatchFeedback(st,a,b,cards){
  const n=Number(st.answers.memoryHelpTries||0),partner=cards.find(x=>x.pair===a.pair&&x.id!==a.id);
  if(n===1)return'<div class="l7-no">Noch nicht richtig.</div>';
  if(n===2)return`<div class="l7-hint"><strong>Hinweis:</strong> Suche zu „${S.esc(a.text)}“ die passende ${a.type==='Infinitiv'?'Partizip-II-Form':'Infinitivform'}.</div>`;
  return`<div class="l7-no"><strong>Lösung:</strong> ${S.esc(a.text)} ↔ ${S.esc(partner?.text||'')}<br>Finde das Paar jetzt selbst. Das Paar bleibt in der Aufgabe.</div>`
 }
 function pick(theme,task,cards,id){
  if(busy)return;const st=state(theme,task),done=new Set(st.done.map(Number)),card=cards.find(x=>x.id===id);if(!card||done.has(card.pair)||open.some(x=>x.id===id))return;
  open.push(card);feedback='';render(theme,task.id);if(open.length<2)return;
  const[a,b]=open;
  if(a.pair===b.pair&&a.id!==b.id){
   busy=true;const fresh=state(theme,task),needsRepeat=!!fresh.answers.memoryWrongPairs[a.pair];
   if(needsRepeat){
    delete fresh.answers.memoryWrongPairs[a.pair];fresh.answers.memoryHelpTries=0;S.save(theme,task.id,fresh,false);
    feedback='<div class="l7-ok">Richtig. Dieses Paar kommt später noch einmal.</div>';
   }else{
    if(!fresh.done.map(Number).includes(a.pair))fresh.done.push(a.pair);fresh.current=null;fresh.tries=0;fresh.hadWrong=false;fresh.answers.memoryHelpTries=0;S.save(theme,task.id,fresh,true);
    feedback='<div class="l7-ok">Richtig!</div>';
   }
   setTimeout(()=>{open=[];busy=false;render(theme,task.id)},520)
  }else{
   busy=true;const fresh=state(theme,task);fresh.answers.memoryHelpTries=Number(fresh.answers.memoryHelpTries||0)+1;fresh.answers.memoryWrongPairs[a.pair]=true;fresh.answers.memoryWrongPairs[b.pair]=true;S.save(theme,task.id,fresh,false);feedback=mismatchFeedback(fresh,a,b,cards);render(theme,task.id);setTimeout(()=>{open=[];busy=false;render(theme,task.id)},fresh.answers.memoryHelpTries>=3?1800:900)
  }
 }
 const style=document.createElement('style');style.id='sp-l7t2-memory-style';style.textContent=`.sp-l7t2-memory{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:16px 0}.sp-l7t2-memory-card{min-height:92px;border:2px solid var(--line);border-radius:14px;background:var(--soft,#f7f4fb);color:var(--dark);font:inherit;font-weight:900;cursor:pointer;padding:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}.sp-l7t2-memory-card strong{font-size:18px}.sp-l7t2-memory-card span{font-size:11px;opacity:.68}.sp-l7t2-memory-card.selected{outline:3px solid rgba(91,61,135,.22);background:#fff}.sp-l7t2-memory-card.done{background:#e8f8ee;border-color:#52a56d;color:#245c36}@media(max-width:850px){.sp-l7t2-memory{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:620px){.sp-l7t2-memory{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.sp-l7t2-memory-card{min-height:82px}.sp-l7t2-memory-card strong{font-size:16px}}@media(max-width:430px){.sp-l7t2-memory{grid-template-columns:repeat(2,minmax(0,1fr))}}`;document.head.appendChild(style);
 window.L7.renderTaskPage=function(theme,id){const t=taskById(id);if(t?.spL7T2Memory){open=[];busy=false;feedback='';return render(Number(theme),id)}return raw(theme,id)};
 window.L7.__l7t2MemoryV3=true;return true
 }
 window.L7T2MemoryUI={install};
})();
