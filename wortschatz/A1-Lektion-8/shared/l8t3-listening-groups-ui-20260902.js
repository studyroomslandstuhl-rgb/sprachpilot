(function(){
'use strict';
if(window.__SP_L8T3_LISTENING_GROUPS_UI_20260902)return;
window.__SP_L8T3_LISTENING_GROUPS_UI_20260902=true;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function themeNo(){return Number(window.L8_THEME?.number||document.body?.dataset?.theme||3)}
function taskNo(task){const i=(window.L8_THEME?.tasks||[]).findIndex(t=>t?.id===task?.id);return i>=0?i+1:''}
function load(task){return window.L8S.load(themeNo(),task.id,task.items.length)}
function save(task,state,sync=false){return window.L8S.save(themeNo(),task.id,state,sync)}
function doneDialog(task,state,d){return (task.dialogues[d]?.questionIndexes||[]).every(i=>state.done.includes(i))}
function currentDialog(task,state){for(let d=0;d<(task.dialogues||[]).length;d++)if(!doneDialog(task,state,d))return d;return null}
function answerKey(i){return `listenGroup:${i}`}
function answerOf(state,i){return String(state.answers?.[answerKey(i)]||'')}
function setAnswer(task,state,i,value){state.answers=state.answers||{};state.answers[answerKey(i)]=value;save(task,state,false)}
function questionStatus(state,item,i){
 if(state.done.includes(i))return '<div class="sp-lg-status good">✓ Richtig</div>';
 const tries=Number(state.tries?.[i]||0),review=Number(state.review?.[i]||0);
 if(review===2)return '<div class="sp-lg-status hint">Richtig korrigiert. Beantworte diese Frage noch einmal.</div>';
 if(tries===1)return '<div class="sp-lg-status bad">Noch nicht richtig.</div>';
 if(tries===2)return `<div class="sp-lg-status hint">${esc(item.hint||'Höre den Dialog noch einmal genau an.')}</div>`;
 if(tries>=3)return `<div class="sp-lg-status hint">Lösung: <strong>${esc(Array.isArray(item.answer)?item.answer[0]:item.answer)}</strong>. Gib die richtige Antwort selbst ein.</div>`;
 return ''
}
function choiceHtml(item,i,value){
 const opts=item.options||[];
 return `<div class="sp-lg-options">${opts.map((o,n)=>`<button type="button" class="sp-lg-option ${value===String(o)?'selected':''}" data-lg-choice="${i}" data-lg-value="${esc(o)}"><b>${String.fromCharCode(65+n)}.</b> ${esc(o)}</button>`).join('')}</div>`
}
function inputHtml(i,value){return `<div class="sp-lg-input-row"><input class="l8-input" data-lg-input="${i}" value="${esc(value)}" autocomplete="off" placeholder="Kurze Antwort"></div>`}
function questionHtml(task,state,i,n){
 const item=task.items[i],value=answerOf(state,i),done=state.done.includes(i);
 return `<section class="sp-lg-question ${done?'done':''}"><div class="sp-lg-qtitle"><span>${n}.</span><strong>${esc(item.prompt)}</strong></div>${done?`<div class="sp-lg-saved">${esc(Array.isArray(item.answer)?item.answer[0]:item.answer)}</div>`:(item.type==='choice'?choiceHtml(item,i,value):inputHtml(i,value))}${questionStatus(state,item,i)}</section>`
}
function progress(task,state){
 const total=task.items.length,done=state.done.length,p=Math.round(done/Math.max(1,total)*100),dialogs=(task.dialogues||[]).filter((_,d)=>doneDialog(task,state,d)).length;
 return `<div class="sp-lg-progress"><span>${dialogs} von ${task.dialogues.length} Dialogen fertig · ${done} von ${total} Fragen</span><strong>${p}%</strong></div><div class="sp-lg-bar"><span style="width:${p}%"></span></div>`
}
function finish(task){
 const root=document.getElementById('app');
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-lg-finish"><div>🎧</div><h2>Höraufgabe abgeschlossen</h2><p>Du hast alle 5 Dialoge und 15 Fragen bearbeitet.</p><a class="l8-btn primary" href="index.html">Zur Übersicht</a></section></div>`
}
function render(task){
 const root=document.getElementById('app'),S=window.L8S;if(!root||!S)return false;
 let state=load(task);if(state.done.length>=task.items.length){finish(task);return true}
 const dIndex=currentDialog(task,state);if(dIndex==null){finish(task);return true}
 const d=task.dialogues[dIndex],ids=d.questionIndexes||[];
 const allAnswered=ids.every(i=>state.done.includes(i)||answerOf(state,i).trim());
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-lg-head"><div class="sp-lg-kicker">Aufgabe ${taskNo(task)} · Dialog ${dIndex+1} von ${task.dialogues.length}</div><h1>🎧 ${esc(task.title)}</h1><p>${esc(task.instruction)}</p>${progress(task,state)}</section><section class="l8-card sp-lg-card"><div class="sp-lg-dialog-head"><div><div class="sp-lg-dialog-title">${esc(d.title)}</div><div class="sp-lg-small">Höre zuerst den ganzen Dialog. Beantworte danach alle drei Fragen.</div></div><button class="l8-btn l8-audio" id="spLgListen" type="button">🔊 Dialog anhören</button></div><div class="sp-lg-questions">${ids.map((i,n)=>questionHtml(task,state,i,n+1)).join('')}</div><button class="l8-btn primary sp-lg-check" id="spLgCheck" type="button" ${allAnswered?'':'disabled'}>Alle 3 prüfen</button></section></div>`;
 document.getElementById('spLgListen')?.addEventListener('click',()=>S.say(d.audio));
 document.querySelectorAll('[data-lg-choice]').forEach(btn=>btn.addEventListener('click',()=>{const s=load(task);setAnswer(task,s,Number(btn.dataset.lgChoice),btn.dataset.lgValue);render(task)}));
 document.querySelectorAll('[data-lg-input]').forEach(inp=>inp.addEventListener('input',()=>{const s=load(task);setAnswer(task,s,Number(inp.dataset.lgInput),inp.value)}));
 document.querySelectorAll('[data-lg-input]').forEach(inp=>inp.addEventListener('change',()=>render(task)));
 document.getElementById('spLgCheck')?.addEventListener('click',()=>{
  ids.forEach(i=>{
   let s=load(task);if(s.done.includes(i))return;
   const item=task.items[i],value=answerOf(s,i).trim();if(!value)return;
   if(S.equal(value,item.answer)){
    const r=S.right(themeNo(),task.id,task.items.length,i,value),y=r.s;y.answers=y.answers||{};y.answers[answerKey(i)]=r.needsReview?'':value;save(task,y,false)
   }else{
    const r=S.wrong(themeNo(),task.id,task.items.length,i,value),y=r.s;y.answers=y.answers||{};y.answers[answerKey(i)]=value;save(task,y,false)
   }
  });
  render(task)
 });
 return true
}
function install(){
 if(!window.L8UI||window.L8UI.__spT3ListeningGroups)return false;
 const raw=window.L8UI.taskPage.bind(window.L8UI);
 window.L8UI.taskPage=function(){
  const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
  if(task?.spL8T3ListeningGroups)return render(task);
  return raw()
 };
 window.L8UI.__spT3ListeningGroups=true;return true
}
const style=document.createElement('style');style.id='sp-l8t3-listening-groups-style';style.textContent=`
.sp-lg-head h1{margin:6px 0 8px}.sp-lg-kicker{font-weight:900;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}.sp-lg-progress{display:flex;justify-content:space-between;gap:12px;margin-top:14px;font-weight:850}.sp-lg-bar{height:9px;border-radius:999px;background:#ececf2;overflow:hidden;margin-top:6px}.sp-lg-bar span{display:block;height:100%;background:var(--lesson-main,var(--l8-main,#68539b));border-radius:inherit}.sp-lg-card{margin-top:16px}.sp-lg-dialog-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:18px;border-bottom:2px solid var(--lesson-line,var(--l8-line,#dedce5))}.sp-lg-dialog-title{font-size:24px;font-weight:950}.sp-lg-small{margin-top:4px;color:var(--muted);font-weight:700}.sp-lg-questions{display:grid;gap:14px;margin-top:18px}.sp-lg-question{padding:16px;border:2px solid var(--lesson-line,var(--l8-line,#dedce5));border-radius:16px;background:#fff}.sp-lg-question.done{background:#f0faf3;border-color:#8fc79d}.sp-lg-qtitle{display:flex;gap:8px;align-items:flex-start;font-size:18px;margin-bottom:12px}.sp-lg-options{display:flex;flex-wrap:wrap;gap:9px}.sp-lg-option{border:2px solid var(--lesson-line,var(--l8-line,#dedce5));background:#fff;border-radius:12px;padding:10px 13px;font:inherit;font-weight:800;cursor:pointer}.sp-lg-option.selected{border-color:var(--lesson-main,var(--l8-main,#68539b));background:var(--lesson-soft,var(--l8-soft,#f3effa))}.sp-lg-input-row{max-width:520px}.sp-lg-status{margin-top:9px;font-size:14px;font-weight:800}.sp-lg-status.good{color:#287a42}.sp-lg-status.bad{color:#a12626}.sp-lg-status.hint{color:#765600}.sp-lg-saved{font-weight:900;color:#287a42}.sp-lg-check{display:block;width:min(420px,100%);margin:22px auto 0}.sp-lg-finish{text-align:center}.sp-lg-finish>div:first-child{font-size:56px}@media(max-width:650px){.sp-lg-dialog-head{align-items:stretch;flex-direction:column}.sp-lg-dialog-head .l8-btn{width:100%}.sp-lg-options{display:grid}.sp-lg-option{width:100%;text-align:left}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.L8T3ListeningGroupsUI={install,render};install();
})();
