(function(){
'use strict';
if(window.__SP_L8T2_MEMORY_FIX_20260902)return;
window.__SP_L8T2_MEMORY_FIX_20260902=true;
const base=window.L8UI;if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
const S=()=>window.L8S,T=()=>window.L8_THEME;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageSrc=raw=>{const v=String(raw||'').trim();if(!v)return'';return /^https?:\/\//i.test(v)?v:`https://sprachpilot.b-cdn.net/${v.replace(/^\/+/, '')}`};
function currentTask(){const id=new URLSearchParams(location.search).get('task');return (T()?.tasks||[]).find(t=>String(t?.id)===String(id))}
function taskNumber(task){const i=(T()?.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''}
function previewNote(){return S()?.preview?.()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':''}
function head(task,state){const total=Math.max(1,task.items.length),done=state.done?.length||0,pct=Math.round(done/total*100),emoji=task.emoji||task.icon||'🧠';return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title)}</h1><p>${esc(emoji)} ${esc(task.instruction||'')}</p></div><div class="l8-progress-row"><span>${done} von ${task.items.length} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
function feedback(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`}
function hashSeed(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function shuffle(values,seedText){const a=[...values];let seed=hashSeed(seedText)||1;for(let i=a.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function finish(task,root){root.innerHTML=`<div class="l8-wrap">${previewNote()}<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast die Aufgabe zu 100 % abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
function renderMemory(task,root){
 let state=S().load(T().number,task.id,task.items.length);
 const pairs=(task.items||[]).map((p,i)=>({...p,_id:String(i),_index:i})).filter(p=>p.term&&p.image);
 const matched=new Set((state.done||[]).map(String));
 if(pairs.length&&matched.size>=pairs.length)return finish(task,root);
 const cards=[];pairs.forEach(p=>{cards.push({pair:p._id,side:'word',text:p.term});cards.push({pair:p._id,side:'image',image:p.image,term:p.term})});
 const board=shuffle(cards,`${T().number}|${task.id}|memory|${S().pid?.()||''}`);
 root.innerHTML=`<div class="l8-wrap">${previewNote()}${head(task,state)}<section class="l8-card l8-exercise l8-memory-exercise"><div class="l8-memory-status"><strong>${matched.size} von ${pairs.length} Paaren gefunden</strong></div><div class="l8-memory-grid">${board.map((c,i)=>`<button class="l8-memory-card ${matched.has(c.pair)?'matched revealed':''}" type="button" data-pair="${esc(c.pair)}" data-side="${esc(c.side)}" data-card="${i}" ${matched.has(c.pair)?'disabled':''}><span class="l8-memory-front">?</span><span class="l8-memory-back">${c.side==='image'?`<img src="${esc(imageSrc(c.image))}" alt="" loading="lazy">`:`<strong>${esc(c.text)}</strong>`}</span></button>`).join('')}</div><div id="feedback"></div></section></div>`;
 let open=[];
 const refreshProgress=()=>{state=S().load(T().number,task.id,task.items.length);const done=state.done?.length||0,pct=Math.round(done/Math.max(1,task.items.length)*100);const status=root.querySelector('.l8-memory-status strong');if(status)status.textContent=`${done} von ${pairs.length} Paaren gefunden`;const row=root.querySelector('.l8-progress-row');if(row)row.innerHTML=`<span>${done} von ${task.items.length} fertig</span><strong>${pct}%</strong>`;const bar=root.querySelector('.l8-task-head .l8-progress > div');if(bar)bar.style.width=`${pct}%`;return done};
 root.querySelectorAll('.l8-memory-card:not(.matched)').forEach(card=>card.onclick=()=>{
  if(card.classList.contains('revealed')||card.classList.contains('matched')||card.classList.contains('checking'))return;
  card.classList.add('revealed');open.push(card);if(open.length<2)return;
  const [a,b]=open;open=[];
  const same=a.dataset.pair===b.dataset.pair&&a.dataset.side!==b.dataset.side;
  if(same){
   const pairIndex=Number(a.dataset.pair);a.classList.add('checking');b.classList.add('checking');
   let r=S().right(T().number,task.id,task.items.length,pairIndex,task.items[pairIndex]?.term||'memory-pair');if(r.needsReview)r=S().right(T().number,task.id,task.items.length,pairIndex,task.items[pairIndex]?.term||'memory-pair');
   matched.add(a.dataset.pair);a.classList.add('matched');b.classList.add('matched');a.disabled=true;b.disabled=true;a.classList.remove('checking');b.classList.remove('checking');
   const done=refreshProgress();feedback('good','Paar gefunden!');if(done>=pairs.length)setTimeout(()=>finish(task,root),450);return;
  }
  a.classList.add('checking');b.classList.add('checking');feedback('warn','Das passt noch nicht zusammen.');
  /* Wichtig: Das Spielfeld wird sofort wieder freigegeben. Der Timer schließt nur noch die beiden falschen Karten. */
  setTimeout(()=>{for(const node of [a,b]){if(!node.isConnected)continue;node.classList.remove('revealed','checking')}},500);
 });
}
window.L8UI={...base,taskPage:function(){const task=currentTask(),root=document.getElementById('app');if(task?.kind==='vocab-memory'&&root)return renderMemory(task,root);return originalTaskPage()}};
const style=document.createElement('style');style.textContent='.l8-memory-card.checking{pointer-events:none}.l8-memory-card:not(.checking):not(.matched){pointer-events:auto}';document.head.appendChild(style);
})();