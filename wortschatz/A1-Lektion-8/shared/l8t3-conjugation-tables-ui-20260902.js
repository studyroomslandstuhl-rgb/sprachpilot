(function(){
'use strict';
if(window.__SP_L8T3_CONJ_TABLE_UI_20260902)return;
window.__SP_L8T3_CONJ_TABLE_UI_20260902=true;

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function taskNo(task){const list=window.L8_THEME?.tasks||[];const i=list.findIndex(x=>x?.id===task?.id);return i>=0?i+1:''}
function nextTask(task){const list=window.L8_THEME?.tasks||[];const i=list.findIndex(x=>x?.id===task?.id);return i>=0?list[i+1]||null:null}
function messageFor(state,item,index){
 if(state.done.includes(index))return '<span class="sp-t3-row-msg ok">Richtig</span>';
 const tries=Number(state.tries?.[index]||0),stage=Number(state.review?.[index]||0);
 if(stage===2)return '<span class="sp-t3-row-msg hint">Richtig korrigiert. Gib die Form noch einmal ein.</span>';
 if(tries===1)return '<span class="sp-t3-row-msg bad">Noch nicht richtig.</span>';
 if(tries===2)return `<span class="sp-t3-row-msg hint">Hinweis: ${item.verb==='sein'?'Achte auf war / warst / waren / wart.':'Achte auf hatte / hattest / hatten / hattet.'}</span>`;
 if(tries>=3)return `<span class="sp-t3-row-msg bad">Lösung: <strong>${esc(item.form)}</strong>. Gib die Form selbst ein.</span>`;
 return '';
}
function tableRows(task,state,verb){
 return task.items.map((item,index)=>({item,index})).filter(x=>x.item.verb===verb).map(({item,index})=>{
  const done=state.done.includes(index),saved=String(state.answers?.[`draft:${index}`]||''),value=done?item.form:saved;
  return `<div class="sp-t3-conj-row ${done?'done':''}"><div class="sp-t3-pronoun">${esc(item.pronoun)}</div><div><input data-t3-conj="${index}" value="${esc(value)}" ${done?'disabled':''} autocomplete="off" placeholder="Form"><div>${messageFor(state,item,index)}</div></div></div>`
 }).join('')
}
function head(task,state){const pct=Math.round((state.done.length/Math.max(1,task.items.length))*100);return `<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNo(task)}</span><h1>${esc(task.title)}</h1><p>🔤 ${esc(task.instruction)}</p></div><div class="l8-progress-row"><span>${state.done.length} von ${task.items.length} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section>`}
function finish(task){
 const root=document.getElementById('app'),next=nextTask(task);
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-finish"><div class="sp-t3-finish-check">✓</div><h2>Gut gemacht!</h2><p>Du hast beide Tabellen richtig ausgefüllt.</p><div class="sp-t3-finish-actions"><a class="l8-btn" href="index.html">Zurück zur Übersicht</a>${next&&!next.exam?`<a class="l8-btn primary" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section></div>`;
}
function render(task){
 const S=window.L8S,root=document.getElementById('app');if(!S||!root)return false;
 let state=S.load(window.L8_THEME.number,task.id,task.items.length);
 if(state.done.length>=task.items.length){finish(task);return true}
 root.innerHTML=`<div class="l8-wrap">${head(task,state)}<section class="l8-card sp-t3-conj-card"><div class="sp-t3-two-tables"><div class="sp-t3-table"><h2>sein – Präteritum</h2><div class="sp-t3-table-head"><span>Person</span><span>Form</span></div>${tableRows(task,state,'sein')}</div><div class="sp-t3-table"><h2>haben – Präteritum</h2><div class="sp-t3-table-head"><span>Person</span><span>Form</span></div>${tableRows(task,state,'haben')}</div></div><button class="l8-btn primary sp-t3-check" id="spT3ConjCheck" type="button">Prüfen</button></section></div>`;
 document.querySelectorAll('[data-t3-conj]').forEach(input=>input.addEventListener('input',()=>{
  const x=S.load(window.L8_THEME.number,task.id,task.items.length);x.answers=x.answers||{};x.answers[`draft:${input.dataset.t3Conj}`]=input.value;S.save(window.L8_THEME.number,task.id,x,false)
 }));
 document.getElementById('spT3ConjCheck')?.addEventListener('click',()=>{
  task.items.forEach((item,index)=>{
   let x=S.load(window.L8_THEME.number,task.id,task.items.length);if(x.done.includes(index))return;
   const input=document.querySelector(`[data-t3-conj="${index}"]`),value=String(input?.value||x.answers?.[`draft:${index}`]||'').trim();if(!value)return;
   if(S.equal(value,item.form)){
    const r=S.right(window.L8_THEME.number,task.id,task.items.length,index,value);r.s.answers=r.s.answers||{};r.s.answers[`draft:${index}`]=r.needsReview?'':item.form;S.save(window.L8_THEME.number,task.id,r.s,false)
   }else{
    const r=S.wrong(window.L8_THEME.number,task.id,task.items.length,index,value);r.s.answers=r.s.answers||{};r.s.answers[`draft:${index}`]=value;S.save(window.L8_THEME.number,task.id,r.s,false)
   }
  });
  render(task)
 });
 return true
}
function install(){
 if(!window.L8UI||window.L8UI.__spT3ConjTables)return false;
 const raw=window.L8UI.taskPage.bind(window.L8UI);
 window.L8UI.taskPage=function(){
  const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
  if(task?.spL8T3Tables)return render(task);
  return raw()
 };
 window.L8UI.__spT3ConjTables=true;
 return true
}
const style=document.createElement('style');style.id='sp-l8t3-conj-table-style';style.textContent=`
.sp-t3-conj-card{padding:22px}.sp-t3-two-tables{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}.sp-t3-table{border:2px solid var(--lesson-line,var(--l8-line));border-radius:18px;overflow:hidden;background:#fff}.sp-t3-table h2{margin:0;padding:16px 18px;background:var(--lesson-soft,var(--l8-soft));color:var(--lesson-main-dark,var(--l8-dark));font-size:22px}.sp-t3-table-head,.sp-t3-conj-row{display:grid;grid-template-columns:minmax(115px,.8fr) minmax(0,1.2fr);gap:12px;align-items:center;padding:10px 14px}.sp-t3-table-head{font-weight:900;background:#f7f7f7;border-top:1px solid var(--lesson-line,var(--l8-line));border-bottom:1px solid var(--lesson-line,var(--l8-line))}.sp-t3-conj-row{border-bottom:1px solid var(--lesson-line,var(--l8-line))}.sp-t3-conj-row:last-child{border-bottom:0}.sp-t3-conj-row.done{background:#eaf8ee}.sp-t3-pronoun{font-weight:900}.sp-t3-conj-row input{width:100%;box-sizing:border-box;padding:11px 12px;border:2px solid var(--lesson-line,var(--l8-line));border-radius:10px;font:inherit;background:#fff}.sp-t3-conj-row.done input{background:#f4fff6}.sp-t3-row-msg{display:block;margin-top:5px;font-size:12px;font-weight:800;line-height:1.25}.sp-t3-row-msg.ok{color:#287a42}.sp-t3-row-msg.bad{color:#a12626}.sp-t3-row-msg.hint{color:#765600}.sp-t3-check{display:block;width:min(420px,100%);margin:22px auto 0}.sp-t3-finish-check{font-size:54px;font-weight:950}.sp-t3-finish-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px}@media(max-width:760px){.sp-t3-two-tables{grid-template-columns:1fr}.sp-t3-conj-card{padding:14px}.sp-t3-table-head,.sp-t3-conj-row{grid-template-columns:95px 1fr;padding:9px 10px}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.L8T3ConjugationTablesUI={install,render};
})();
