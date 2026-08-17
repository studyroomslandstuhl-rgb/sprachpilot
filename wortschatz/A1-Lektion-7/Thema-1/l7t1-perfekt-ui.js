(function(){
'use strict';
if(window.__SP_L7T1_PERFEKT_UI_V1)return;
window.__SP_L7T1_PERFEKT_UI_V1=true;

function install(){
 if(!window.L7||!window.L7S||window.L7.__perfektMemoryV1)return false;
 const S=window.L7S;
 const raw=window.L7.renderTaskPage.bind(window.L7);
 let openCards=[];
 let busy=false;
 let feedback='';

 function esc(v){return S.esc(v)}
 function task(){return S.task('perfekt-memory')}
 function nextTask(t){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(x=>x.id===t.id)+1]||null}
 function allCards(t){return (t.items||[]).flatMap((pair,index)=>[
   {id:`${index}:inf`,pair:index,text:pair.infinitive,type:'Infinitiv'},
   {id:`${index}:perf`,pair:index,text:pair.perfekt,type:'Perfekt'}
 ])}
 function stableCards(theme,t){
   const total=t.items.length,all=allCards(t),ids=all.map(x=>x.id),byId=new Map(all.map(x=>[x.id,x]));
   const st=S.load(theme,t.id,total);st.answers=st.answers||{};
   let order=Array.isArray(st.answers.memoryOrder)?st.answers.memoryOrder:[];
   if(order.length!==ids.length||new Set(order).size!==ids.length||ids.some(id=>!order.includes(id))){
     order=S.shuffle(ids);st.answers.memoryOrder=order;S.save(theme,t.id,st,false);
   }
   return order.map(id=>byId.get(id)).filter(Boolean)
 }
 function progress(theme,t){const st=S.load(theme,t.id,t.items.length),p=Math.round(st.done.length/Math.max(1,t.items.length)*100);return`<div class="l7-progress-row"><span>${st.done.length} Paare gefunden · ${t.items.length-st.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function finish(theme,t){const root=document.getElementById('app'),next=nextTask(t);root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Infinitive mit der richtigen Perfektform verbunden.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(t.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
 function visible(card,done){return done.has(card.pair)||openCards.some(x=>x.id===card.id)}
 function render(theme){
   const t=task();if(!t)return raw(theme,'perfekt-memory');
   const total=t.items.length,st=S.load(theme,t.id,total);if(st.done.length>=total)return finish(theme,t);
   const cards=stableCards(theme,t),done=new Set(st.done.map(Number)),root=document.getElementById('app');
   root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card">${progress(theme,t)}<div class="l7-instruction">${esc(t.description)}</div><div class="l7-question-card"><p class="eyebrow">Memory</p><h2>Finde Infinitiv und Perfekt.</h2><div class="sp-perfekt-memory-grid">${cards.map(card=>`<button type="button" class="sp-perfekt-memory-card ${done.has(card.pair)?'done':''} ${openCards.some(x=>x.id===card.id)?'selected':''}" data-memory-id="${esc(card.id)}">${visible(card,done)?`<strong>${esc(card.text)}</strong><span>${esc(card.type)}</span>`:'<strong>?</strong>'}</button>`).join('')}</div><div id="spPerfektMemoryFeedback">${feedback}</div></div></section><footer>© SprachPilot</footer></div>`;
   document.querySelectorAll('[data-memory-id]').forEach(button=>button.addEventListener('click',()=>pick(theme,cards,button.dataset.memoryId)));
 }
 function pick(theme,cards,id){
   if(busy)return;const t=task(),total=t.items.length,st=S.load(theme,t.id,total),done=new Set(st.done.map(Number)),card=cards.find(x=>x.id===id);if(!card||done.has(card.pair)||openCards.some(x=>x.id===id))return;
   openCards.push(card);feedback='';render(theme);
   if(openCards.length<2)return;
   const[a,b]=openCards;
   if(a.pair===b.pair&&a.id!==b.id){
     busy=true;const fresh=S.load(theme,t.id,total);if(!fresh.done.map(Number).includes(a.pair))fresh.done.push(a.pair);fresh.current=null;fresh.tries=0;fresh.hadWrong=false;S.attempt(theme,t.id,total,a.pair,true);S.save(theme,t.id,fresh,true);feedback='<div class="l7-ok">Richtiges Paar!</div>';
     setTimeout(()=>{openCards=[];busy=false;render(theme)},420);
   }else{
     busy=true;feedback='<div class="l7-no">Das passt noch nicht zusammen.</div>';render(theme);
     setTimeout(()=>{openCards=[];busy=false;feedback='';render(theme)},850);
   }
 }

 const style=document.createElement('style');style.id='sp-l7t1-perfekt-memory-style';style.textContent=`
 .sp-perfekt-memory-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:20px 0}.sp-perfekt-memory-card{min-height:112px;border:2px solid var(--line);border-radius:16px;background:var(--soft,#f7f4fb);color:var(--dark);font:inherit;font-weight:900;cursor:pointer;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;transition:transform .15s ease,border-color .15s ease,background .15s ease}.sp-perfekt-memory-card:hover{transform:translateY(-2px);border-color:var(--main,#7b5aa6)}.sp-perfekt-memory-card strong{font-size:20px}.sp-perfekt-memory-card span{font-size:12px;opacity:.7}.sp-perfekt-memory-card.selected{outline:3px solid rgba(91,61,135,.22);background:#fff}.sp-perfekt-memory-card.done{background:#e8f8ee;border-color:#52a56d;color:#245c36}@media(max-width:760px){.sp-perfekt-memory-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:520px){.sp-perfekt-memory-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.sp-perfekt-memory-card{min-height:92px}.sp-perfekt-memory-card strong{font-size:17px}}
 `;document.head.appendChild(style);
 window.L7.renderTaskPage=function(theme,id){if(id==='perfekt-memory'){openCards=[];busy=false;feedback='';return render(Number(theme))}return raw(theme,id)};
 window.L7.__perfektMemoryV1=true;
 return true
 }

 window.L7T1PerfektUI={install};
})();
