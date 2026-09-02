(function(){
'use strict';
if(window.__SP_L8T2_MEMORY_V2_UI_20260902)return;window.__SP_L8T2_MEMORY_V2_UI_20260902=true;
const base=window.L8UI;if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageSrc=raw=>{const v=String(raw||'').trim();if(!v)return'';return /^https?:\/\//i.test(v)?v:`https://sprachpilot.b-cdn.net/${v.replace(/^\/+/, '')}`};
const shuffle=values=>{const a=[...(values||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function currentTask(){const id=new URLSearchParams(location.search).get('task');return (window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id))||null}
function taskNo(task){const i=(window.L8_THEME?.tasks||[]).findIndex(t=>String(t?.id)===String(task?.id));return i>=0?i+1:''}
function head(task,state){const total=Math.max(1,task.items.length),done=state.done?.length||0,pct=Math.round(done/total*100);return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNo(task)}</span><h1>${esc(task.title)}</h1><p>🧠 ${esc(task.instruction||'Finde die Paare: Bild und Wort.')}</p></div><div class="l8-progress-row"><span>${done} von ${task.items.length} Paaren gefunden</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
function finish(task,root){root.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Paare gefunden.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>`}
function render(task,root){
 const S=window.L8S,T=window.L8_THEME;if(!S||!T)return originalTaskPage();
 let state=S.load(T.number,task.id,task.items.length);
 if((state.done||[]).length>=task.items.length)return finish(task,root);
 const matched=new Set((state.done||[]).map(Number));
 const cards=[];
 (task.items||[]).forEach((item,index)=>{cards.push({pair:index,side:'word',term:item.term});cards.push({pair:index,side:'image',term:item.term,image:item.image})});
 const board=shuffle(cards);
 root.innerHTML=`<div class="l8-wrap">${head(task,state)}<section class="l8-card l8-exercise sp-l8t2-memory-v2" data-sp-task-stage="1"><div class="sp-memory-status" id="spMemoryStatus">${matched.size} von ${task.items.length} Paaren gefunden</div><div class="sp-memory-grid">${board.map((card,i)=>`<button class="sp-memory-card ${matched.has(card.pair)?'matched revealed':''}" type="button" data-card="${i}" data-pair="${card.pair}" data-side="${card.side}" ${matched.has(card.pair)?'disabled':''}><span class="sp-memory-front">?</span><span class="sp-memory-back">${card.side==='image'?`<img src="${esc(imageSrc(card.image))}" alt="">`:`<strong>${esc(card.term)}</strong>`}</span></button>`).join('')}</div><div id="feedback"></div></section></div>`;
 let first=null,locked=false;
 const feedback=(type,text)=>{const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`};
 const updateProgress=()=>{state=S.load(T.number,task.id,task.items.length);const done=state.done?.length||0,pct=Math.round(done/Math.max(1,task.items.length)*100);const status=document.getElementById('spMemoryStatus');if(status)status.textContent=`${done} von ${task.items.length} Paaren gefunden`;const row=root.querySelector('.l8-progress-row');if(row)row.innerHTML=`<span>${done} von ${task.items.length} Paaren gefunden</span><strong>${pct}%</strong>`;const bar=root.querySelector('.l8-task-head .l8-progress > div');if(bar)bar.style.width=`${pct}%`;return done};
 root.querySelectorAll('.sp-memory-card:not(.matched)').forEach(btn=>btn.onclick=()=>{
  if(locked||btn.classList.contains('revealed')||btn.classList.contains('matched'))return;
  btn.classList.add('revealed');
  if(!first){first=btn;return}
  locked=true;const second=btn;
  const same=first.dataset.pair===second.dataset.pair&&first.dataset.side!==second.dataset.side;
  if(same){
   const pair=Number(first.dataset.pair);S.completeFree(T.number,task.id,task.items.length,pair,task.items[pair]?.term||'memory-pair');
   for(const node of [first,second]){node.classList.add('matched');node.disabled=true}
   first=null;locked=false;feedback('good','Paar gefunden!');const done=updateProgress();if(done>=task.items.length)setTimeout(()=>finish(task,root),450);return;
  }
  feedback('warn','Das passt noch nicht zusammen.');
  const a=first,b=second;setTimeout(()=>{for(const node of [a,b])if(node?.isConnected&&!node.classList.contains('matched'))node.classList.remove('revealed');first=null;locked=false},650);
 });
}
function patchedTaskPage(){const task=currentTask(),root=document.getElementById('app');if(task?.id==='wortschatz-memory-bild-wort-v2'&&root)return render(task,root);return originalTaskPage()}
window.L8UI={...base,taskPage:patchedTaskPage};
if(!document.getElementById('sp-l8t2-memory-v2-style')){const style=document.createElement('style');style.id='sp-l8t2-memory-v2-style';style.textContent='.sp-l8t2-memory-v2{max-width:980px;margin-inline:auto}.sp-memory-status{text-align:center;font-weight:900;margin-bottom:14px}.sp-memory-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px}.sp-memory-card{position:relative;min-height:112px;border:2px solid var(--lesson-line,var(--l8-line));border-radius:15px;background:var(--lesson-main,var(--l8-main));color:#fff;padding:7px;cursor:pointer;overflow:hidden}.sp-memory-front,.sp-memory-back{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:8px;box-sizing:border-box}.sp-memory-front{font-size:30px;font-weight:900}.sp-memory-back{opacity:0;background:#fff;color:var(--lesson-text,#20384a);text-align:center}.sp-memory-back strong{font-size:14px;line-height:1.25;overflow-wrap:anywhere}.sp-memory-back img{width:100%;height:100%;object-fit:contain;border-radius:9px}.sp-memory-card.revealed .sp-memory-front{opacity:0}.sp-memory-card.revealed .sp-memory-back{opacity:1}.sp-memory-card.matched{border-color:var(--lesson-main-dark,var(--l8-dark));box-shadow:0 0 0 3px rgba(64,140,188,.12)}@media(max-width:760px){.sp-memory-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}@media(max-width:560px){.sp-memory-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.sp-memory-card{min-height:94px}.sp-memory-back strong{font-size:12px}}';document.head.appendChild(style)}
})();
