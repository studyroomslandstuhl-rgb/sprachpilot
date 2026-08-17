(function(){
'use strict';
if(window.__SP_L7T2_MEMORY_UI_V1)return;
window.__SP_L7T2_MEMORY_UI_V1=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t2MemoryV1)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7);
 let open=[],busy=false,feedback='';
 function taskById(id){return S.task(id)}
 function allCards(task){return (task.items||[]).flatMap((pair,index)=>[
  {id:`${index}:i`,pair:index,text:pair.infinitive,type:'Infinitiv'},
  {id:`${index}:p`,pair:index,text:pair.perfekt,type:'Partizip II'}
 ])}
 function stableCards(theme,task){
  const all=allCards(task),ids=all.map(x=>x.id),byId=new Map(all.map(x=>[x.id,x])),st=S.load(theme,task.id,task.items.length);st.answers=st.answers||{};
  let order=Array.isArray(st.answers.memoryOrder)?st.answers.memoryOrder:[];
  if(order.length!==ids.length||new Set(order).size!==ids.length||ids.some(id=>!order.includes(id))){order=S.shuffle(ids);st.answers.memoryOrder=order;S.save(theme,task.id,st,false)}
  return order.map(id=>byId.get(id)).filter(Boolean)
 }
 function progress(theme,task){const st=S.load(theme,task.id,task.items.length),p=Math.round(st.done.length/Math.max(1,task.items.length)*100);return`<div class="l7-progress-row"><span>${st.done.length} Paare gefunden · ${task.items.length-st.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function nextTask(task){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(x=>x.id===task.id)+1]||null}
 function finish(theme,task){const root=document.getElementById('app'),next=nextTask(task);root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Infinitive mit dem richtigen Partizip II verbunden.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${S.esc(task.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
 function render(theme,id){
  const task=taskById(id);if(!task?.spL7T2Memory)return raw(theme,id);
  const total=task.items.length,st=S.load(theme,task.id,total);if(st.done.length>=total)return finish(theme,task);
  const cards=stableCards(theme,task),done=new Set(st.done.map(Number)),root=document.getElementById('app');
  const visible=card=>done.has(card.pair)||open.some(x=>x.id===card.id);
  root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card">${progress(theme,task)}<div class="l7-instruction">${S.esc(task.description)}</div><div class="l7-question-card"><h2>Finde Infinitiv und Partizip II.</h2><div class="sp-l7t2-memory">${cards.map(card=>`<button type="button" class="sp-l7t2-memory-card ${done.has(card.pair)?'done':''} ${open.some(x=>x.id===card.id)?'selected':''}" data-memory="${S.esc(card.id)}">${visible(card)?`<strong>${S.esc(card.text)}</strong><span>${S.esc(card.type)}</span>`:'<strong>?</strong>'}</button>`).join('')}</div><div id="spL7T2MemoryFeedback">${feedback}</div></div></section><footer>© SprachPilot</footer></div>`;
  document.querySelectorAll('[data-memory]').forEach(btn=>btn.addEventListener('click',()=>pick(theme,task,cards,btn.dataset.memory)))
 }
 function pick(theme,task,cards,id){
  if(busy)return;const st=S.load(theme,task.id,task.items.length),done=new Set(st.done.map(Number)),card=cards.find(x=>x.id===id);if(!card||done.has(card.pair)||open.some(x=>x.id===id))return;
  open.push(card);feedback='';render(theme,task.id);if(open.length<2)return;
  const[a,b]=open;
  if(a.pair===b.pair&&a.id!==b.id){busy=true;const fresh=S.load(theme,task.id,task.items.length);if(!fresh.done.map(Number).includes(a.pair))fresh.done.push(a.pair);fresh.current=null;fresh.tries=0;fresh.hadWrong=false;S.save(theme,task.id,fresh,true);feedback='<div class="l7-ok">Richtiges Paar!</div>';setTimeout(()=>{open=[];busy=false;render(theme,task.id)},420)}
  else{busy=true;feedback='<div class="l7-no">Das passt noch nicht zusammen.</div>';render(theme,task.id);setTimeout(()=>{open=[];busy=false;feedback='';render(theme,task.id)},850)}
 }
 const style=document.createElement('style');style.id='sp-l7t2-memory-style';style.textContent=`.sp-l7t2-memory{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}.sp-l7t2-memory-card{min-height:112px;border:2px solid var(--line);border-radius:16px;background:var(--soft,#f7f4fb);color:var(--dark);font:inherit;font-weight:900;cursor:pointer;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px}.sp-l7t2-memory-card strong{font-size:20px}.sp-l7t2-memory-card span{font-size:12px;opacity:.7}.sp-l7t2-memory-card.selected{outline:3px solid rgba(91,61,135,.22);background:#fff}.sp-l7t2-memory-card.done{background:#e8f8ee;border-color:#52a56d;color:#245c36}@media(max-width:760px){.sp-l7t2-memory{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:520px){.sp-l7t2-memory{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.sp-l7t2-memory-card{min-height:92px}.sp-l7t2-memory-card strong{font-size:17px}}`;document.head.appendChild(style);
 window.L7.renderTaskPage=function(theme,id){const t=taskById(id);if(t?.spL7T2Memory){open=[];busy=false;feedback='';return render(Number(theme),id)}return raw(theme,id)};
 window.L7.__l7t2MemoryV1=true;return true
 }
 window.L7T2MemoryUI={install};
})();