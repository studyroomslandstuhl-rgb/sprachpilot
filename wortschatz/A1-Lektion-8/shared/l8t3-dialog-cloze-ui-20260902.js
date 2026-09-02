(function(){
'use strict';
if(window.__SP_L8T3_DIALOG_CLOZE_UI_20260902)return;
window.__SP_L8T3_DIALOG_CLOZE_UI_20260902=true;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
function themeNo(){return Number(window.L8_THEME?.number||document.body?.dataset?.theme||3)}
function taskNo(task){const i=(window.L8_THEME?.tasks||[]).findIndex(t=>t?.id===task?.id);return i>=0?i+1:''}
function state(task){return window.L8S.load(themeNo(),task.id,task.items.length)}
function save(task,s,sync=false){return window.L8S.save(themeNo(),task.id,s,sync)}
function progress(task,s){const p=Math.round((s.done.length/Math.max(1,task.items.length))*100);return `<div class="sp-dlg-progress"><span>${s.done.length} von ${task.items.length} Lücken richtig</span><strong>${p}%</strong></div><div class="sp-dlg-bar"><span style="width:${p}%"></span></div>`}
function currentDialog(task,s){
 for(let d=0;d<(task.dialogues||[]).length;d++){
  const ids=(task.dialogues[d].lines||[]).map(x=>Number.isInteger(x.blank)?x.blank:null).filter(Number.isInteger);
  if(ids.some(i=>!s.done.includes(i)))return d
 }
 return null
}
function note(s,item,index){
 if(s.done.includes(index))return '<small class="sp-dlg-msg ok">Richtig</small>';
 const tries=Number(s.tries?.[index]||0),review=Number(s.review?.[index]||0);
 if(review===2)return '<small class="sp-dlg-msg hint">Richtig korrigiert. Schreibe die Form noch einmal.</small>';
 if(tries===1)return '<small class="sp-dlg-msg bad">Noch nicht richtig.</small>';
 if(tries===2)return `<small class="sp-dlg-msg hint">Hinweis: ${esc(item.time)}. Entscheide zwischen sein und haben und achte auf die Person.</small>`;
 if(tries>=3)return `<small class="sp-dlg-msg bad">Lösung: <strong>${esc(item.answer?.[0]||'')}</strong>. Schreibe sie selbst ein.</small>`;
 return ''
}
function lineHtml(task,s,line){
 if(!Number.isInteger(line.blank))return `<div class="sp-dlg-line"><span class="sp-dlg-speaker">${esc(line.speaker)}</span><div class="sp-dlg-bubble">${esc(line.text)}</div></div>`;
 const index=line.blank,item=task.items[index],done=s.done.includes(index),draft=String(s.answers?.[`dlg:${index}`]||''),value=done?(item.answer?.[0]||''):draft;
 return `<div class="sp-dlg-line"><span class="sp-dlg-speaker">${esc(line.speaker)}</span><div class="sp-dlg-bubble">${esc(line.before||'')}<span class="sp-dlg-slot"><input data-dlg-input="${index}" value="${esc(value)}" ${done?'disabled':''} autocomplete="off" inputmode="text" aria-label="Verbform"><span>${note(s,item,index)}</span></span>${esc(line.after||'')}</div></div>`
}
function finish(task){
 const next=(window.L8_THEME?.tasks||[])[(window.L8_THEME?.tasks||[]).findIndex(t=>t?.id===task.id)+1];
 document.getElementById('app').innerHTML=`<div class="l8-wrap"><section class="l8-card sp-dlg-finish"><div>🌟</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Dialoge ergänzt.</p><div class="sp-dlg-finish-actions"><a class="l8-btn" href="index.html">Zur Übersicht</a>${next&&!next.exam?`<a class="l8-btn primary" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section></div>`
}
function render(task){
 const root=document.getElementById('app'),S=window.L8S;if(!root||!S)return false;
 let s=state(task);if(s.done.length>=task.items.length){finish(task);return true}
 const dIndex=currentDialog(task,s);if(dIndex==null){finish(task);return true}
 const d=task.dialogues[dIndex];
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-dlg-head"><div class="sp-dlg-kicker">Aufgabe ${taskNo(task)} · Dialog ${dIndex+1} von ${task.dialogues.length}</div><h1>🗣️ ${esc(task.title)}</h1><p>${esc(task.instruction)}</p>${task.intro?`<div class="sp-dlg-intro">${esc(task.intro)}</div>`:''}${progress(task,s)}</section><section class="l8-card sp-dlg-card"><div class="sp-dlg-story-head"><span class="sp-dlg-story-icon">${esc(d.icon||'💬')}</span><div><h2>${esc(d.title)}</h2><div class="sp-dlg-clue">Zeitwörter: <strong>${esc(d.clue||'')}</strong></div></div></div><div class="sp-dlg-lines">${d.lines.map(line=>lineHtml(task,s,line)).join('')}</div><button class="l8-btn primary sp-dlg-check" id="spDlgCheck" type="button">Prüfen</button></section></div>`;
 document.querySelectorAll('[data-dlg-input]').forEach(input=>input.addEventListener('input',()=>{const x=state(task);x.answers=x.answers||{};x.answers[`dlg:${input.dataset.dlgInput}`]=input.value;save(task,x,false)}));
 document.getElementById('spDlgCheck')?.addEventListener('click',()=>{
  const blankIds=d.lines.map(x=>Number.isInteger(x.blank)?x.blank:null).filter(Number.isInteger);
  blankIds.forEach(index=>{
   let x=state(task);if(x.done.includes(index))return;
   const input=document.querySelector(`[data-dlg-input="${index}"]`),value=String(input?.value||x.answers?.[`dlg:${index}`]||'').trim();if(!value)return;
   const item=task.items[index];
   if(S.equal(value,item.answer)){
    const r=S.right(themeNo(),task.id,task.items.length,index,value),y=r.s;y.answers=y.answers||{};y.answers[`dlg:${index}`]=r.needsReview?'':(item.answer?.[0]||value);save(task,y,false)
   }else{
    const r=S.wrong(themeNo(),task.id,task.items.length,index,value),y=r.s;y.answers=y.answers||{};y.answers[`dlg:${index}`]=value;save(task,y,false)
   }
  });
  render(task)
 });
 return true
}
function install(){
 if(!window.L8UI||window.L8UI.__spT3DialogCloze)return false;
 const raw=window.L8UI.taskPage.bind(window.L8UI);
 window.L8UI.taskPage=function(){
  const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
  if(task?.spL8T3DialogCloze)return render(task);
  return raw()
 };
 window.L8UI.__spT3DialogCloze=true;return true
}
const style=document.createElement('style');style.id='sp-l8t3-dialog-cloze-style';style.textContent=`
.sp-dlg-head h1{margin:6px 0 8px}.sp-dlg-kicker{font-weight:900;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}.sp-dlg-intro{margin:12px 0;padding:11px 13px;border-radius:12px;background:var(--lesson-soft,var(--l8-soft,#f3effa));font-weight:750}.sp-dlg-progress{display:flex;justify-content:space-between;gap:12px;margin-top:14px;font-weight:850}.sp-dlg-bar{height:9px;border-radius:999px;background:#ececf2;overflow:hidden;margin-top:6px}.sp-dlg-bar span{display:block;height:100%;background:var(--lesson-main,var(--l8-main,#68539b));border-radius:inherit}.sp-dlg-card{margin-top:16px}.sp-dlg-story-head{display:flex;align-items:center;gap:14px;margin-bottom:18px}.sp-dlg-story-icon{font-size:38px}.sp-dlg-story-head h2{margin:0 0 5px;font-size:25px}.sp-dlg-clue{font-size:15px;color:var(--muted);font-weight:750}.sp-dlg-lines{display:grid;gap:12px}.sp-dlg-line{display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:start}.sp-dlg-speaker{padding-top:12px;font-weight:950;color:var(--lesson-main-dark,var(--l8-dark,#4f3a79))}.sp-dlg-bubble{padding:12px 14px;border:2px solid var(--lesson-line,var(--l8-line,#dedce5));border-radius:16px;background:#fff;font-size:18px;line-height:1.8}.sp-dlg-slot{display:inline-flex;flex-direction:column;vertical-align:middle;min-width:110px;margin:0 4px;line-height:1.15}.sp-dlg-slot input{width:100%;box-sizing:border-box;padding:7px 9px;border:2px solid var(--lesson-main,var(--l8-main,#68539b));border-radius:9px;font:inherit;font-weight:850;background:#fff}.sp-dlg-slot input:disabled{background:#eaf8ee;border-color:#55a46b}.sp-dlg-msg{display:block;margin-top:4px;font-size:11px;font-weight:800;line-height:1.25}.sp-dlg-msg.ok{color:#287a42}.sp-dlg-msg.bad{color:#a12626}.sp-dlg-msg.hint{color:#765600}.sp-dlg-check{display:block;width:min(420px,100%);margin:22px auto 0}.sp-dlg-finish{text-align:center}.sp-dlg-finish>div:first-child{font-size:55px}.sp-dlg-finish-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px}@media(max-width:600px){.sp-dlg-line{grid-template-columns:1fr}.sp-dlg-speaker{padding:0 2px}.sp-dlg-bubble{font-size:17px}.sp-dlg-slot{min-width:96px}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.L8T3DialogClozeUI={install,render};install();
})();
