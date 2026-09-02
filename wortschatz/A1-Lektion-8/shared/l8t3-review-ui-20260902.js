(function(){
'use strict';
if(window.__SP_L8T3_REVIEW_UI_20260902_V2)return;
window.__SP_L8T3_REVIEW_UI_20260902_V2=true;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function themeNo(){return Number(window.L8_THEME?.number||document.body?.dataset?.theme||3)}
function taskNo(task){const i=(window.L8_THEME?.tasks||[]).findIndex(t=>t?.id===task?.id);return i>=0?i+1:''}
function load(task){return window.L8S.load(themeNo(),task.id,task.items.length)}
function pct(task,state){return Math.round((state.done.length/Math.max(1,task.items.length))*100)}
function current(task){const i=window.L8S.nextIndex(themeNo(),task.id,task.items.length);return Number.isInteger(i)?i:null}
function answerText(item){return Array.isArray(item.answer)?item.answer[0]:item.answer}
function noteTime(state,index,item){
 const tries=Number(state.tries?.[index]||0),review=Number(state.review?.[index]||0);
 if(review===2)return '<div class="sp-rv-note hint">Richtig korrigiert. Dieser Satz kommt noch einmal.</div>';
 if(tries===1)return '<div class="sp-rv-note bad">Noch nicht richtig. Prüfe Zeitwort und Verbform.</div>';
 if(tries===2)return '<div class="sp-rv-note hint">Hinweis: heute/jetzt = Gegenwart. früher/damals/gestern/vor ... = Vergangenheit.</div>';
 if(tries>=3)return `<div class="sp-rv-note hint">Richtige Gruppe: <strong>${esc(answerText(item))}</strong>.</div>`;
 return ''
}
function noteImage(state,index,item){
 const tries=Number(state.tries?.[index]||0),review=Number(state.review?.[index]||0);
 if(review===2)return '<div class="sp-rv-note hint">Richtig korrigiert. Dieses Bild kommt noch einmal.</div>';
 if(tries===1)return '<div class="sp-rv-note bad">Noch nicht richtig. Schau noch einmal genau auf die dargestellte Situation.</div>';
 if(tries===2)return '<div class="sp-rv-note hint">Hinweis: Denke an Bedeutung, Beruf oder Ort – nicht nur an die Form des Wortes.</div>';
 if(tries>=3)return `<div class="sp-rv-note hint">Passendes Wort: <strong>${esc(answerText(item))}</strong>. Wähle es jetzt selbst.</div>`;
 return ''
}
function progress(task,state){const p=pct(task,state);return `<div class="sp-rv-progress"><span>${state.done.length} von ${task.items.length} fertig</span><strong>${p}%</strong></div><div class="sp-rv-bar"><span style="width:${p}%"></span></div>`}
function finish(task,icon,text){document.getElementById('app').innerHTML=`<div class="l8-wrap"><section class="l8-card sp-rv-finish"><div>${icon}</div><h2>Aufgabe abgeschlossen</h2><p>${esc(text)}</p><a class="l8-btn primary" href="index.html">Zur Übersicht</a></section></div>`}

function renderTime(task){
 const root=document.getElementById('app'),S=window.L8S;if(!root||!S)return false;
 let state=load(task);if(state.done.length>=task.items.length){finish(task,'🕒','Du hast Gegenwart und Vergangenheit sicher unterschieden.');return true}
 const idx=current(task);if(idx==null){finish(task,'🕒','Du hast Gegenwart und Vergangenheit sicher unterschieden.');return true}
 state=load(task);const item=task.items[idx];
 const present=state.done.map(i=>task.items[i]).filter(x=>answerText(x)==='Gegenwart');
 const past=state.done.map(i=>task.items[i]).filter(x=>answerText(x)==='Vergangenheit');
 const rows=list=>list.length?list.map(x=>`<div class="sp-time-row">${esc(x.sentence)}</div>`).join(''):'<div class="sp-time-empty">Noch kein Satz</div>';
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-rv-head"><div class="sp-rv-kicker">Aufgabe ${taskNo(task)}</div><h1>🕒 ${esc(task.title)}</h1><p>${esc(task.instruction)}</p><div class="sp-rv-intro">${esc(task.intro||'')}</div>${progress(task,state)}</section><section class="l8-card sp-time-card"><div class="sp-time-current"><div class="sp-time-label">Ordne diesen Satz zu:</div><div class="sp-time-sentence">${esc(item.sentence)}</div><div class="sp-time-actions"><button type="button" data-time-answer="Gegenwart">☀️ Gegenwart</button><button type="button" data-time-answer="Vergangenheit">🕰️ Vergangenheit</button></div>${noteTime(state,idx,item)}</div><div class="sp-time-tables"><section><h3>☀️ Gegenwart</h3>${rows(present)}</section><section><h3>🕰️ Vergangenheit</h3>${rows(past)}</section></div></section></div>`;
 document.querySelectorAll('[data-time-answer]').forEach(btn=>btn.addEventListener('click',()=>{
  const value=btn.dataset.timeAnswer;
  if(S.equal(value,item.answer))S.right(themeNo(),task.id,task.items.length,idx,value);else S.wrong(themeNo(),task.id,task.items.length,idx,value);
  renderTime(task)
 }));
 return true
}

function renderImage(task){
 const root=document.getElementById('app'),S=window.L8S;if(!root||!S)return false;
 let state=load(task);if(state.done.length>=task.items.length){finish(task,'🖼️','Du hast den Wortschatz über Bilder wiederholt.');return true}
 const idx=current(task);if(idx==null){finish(task,'🖼️','Du hast den Wortschatz über Bilder wiederholt.');return true}
 state=load(task);const item=task.items[idx];
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card sp-rv-head"><div class="sp-rv-kicker">Aufgabe ${taskNo(task)} · Bild ${idx+1} von ${task.items.length}</div><h1>🖼️ ${esc(task.title)}</h1><p>${esc(task.instruction)}</p>${progress(task,state)}</section><section class="l8-card sp-img-card"><div class="sp-img-box"><img src="${esc(item.image)}" alt="" onerror="this.closest('.sp-img-box').classList.add('missing');this.hidden=true"></div><div class="sp-img-prompt">${esc(item.prompt)}</div><div class="sp-img-options">${(item.options||[]).map(o=>`<button type="button" data-img-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div>${noteImage(state,idx,item)}</section></div>`;
 document.querySelectorAll('[data-img-answer]').forEach(btn=>btn.addEventListener('click',()=>{
  const value=btn.dataset.imgAnswer;
  if(S.equal(value,item.answer))S.right(themeNo(),task.id,task.items.length,idx,value);else S.wrong(themeNo(),task.id,task.items.length,idx,value);
  renderImage(task)
 }));
 return true
}

function install(){
 if(!window.L8UI||window.L8UI.__spT3ReviewUI)return false;
 const raw=window.L8UI.taskPage.bind(window.L8UI);
 window.L8UI.taskPage=function(){
  const id=new URLSearchParams(location.search).get('task'),task=(window.L8_THEME?.tasks||[]).find(t=>String(t?.id)===String(id));
  if(task?.spL8T3TimeSort)return renderTime(task);
  if(task?.spL8T3ImageVocab)return renderImage(task);
  return raw()
 };
 window.L8UI.__spT3ReviewUI=true;return true
}
const style=document.createElement('style');style.id='sp-l8t3-review-ui-style';style.textContent=`
.sp-rv-head h1{margin:6px 0 8px}.sp-rv-kicker{font-weight:900;color:var(--muted);letter-spacing:.04em;text-transform:uppercase}.sp-rv-intro{margin-top:10px;padding:10px 12px;border-radius:12px;background:var(--lesson-soft,var(--l8-soft,#f3effa));font-weight:750}.sp-rv-progress{display:flex;justify-content:space-between;gap:12px;margin-top:14px;font-weight:850}.sp-rv-bar{height:9px;border-radius:999px;background:#ececf2;overflow:hidden;margin-top:6px}.sp-rv-bar span{display:block;height:100%;background:var(--lesson-main,var(--l8-main,#68539b));border-radius:inherit}.sp-rv-note{margin-top:12px;padding:10px 12px;border-radius:12px;font-weight:800}.sp-rv-note.bad{background:#fff0f0;color:#9d2828}.sp-rv-note.hint{background:#fff8dc;color:#725500}.sp-time-card,.sp-img-card{margin-top:16px}.sp-time-current{padding:18px;border:2px solid var(--lesson-line,var(--l8-line,#dedce5));border-radius:18px}.sp-time-label{font-weight:850;color:var(--muted);margin-bottom:8px}.sp-time-sentence{font-size:clamp(22px,3vw,30px);font-weight:950;line-height:1.35}.sp-time-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}.sp-time-actions button,.sp-img-options button{border:2px solid var(--lesson-line,var(--l8-line,#dedce5));background:#fff;border-radius:14px;padding:13px 16px;font:inherit;font-weight:900;cursor:pointer}.sp-time-actions button:hover,.sp-img-options button:hover{border-color:var(--lesson-main,var(--l8-main,#68539b));background:var(--lesson-soft,var(--l8-soft,#f3effa))}.sp-time-tables{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:18px}.sp-time-tables section{border:2px solid var(--lesson-line,var(--l8-line,#dedce5));border-radius:18px;padding:15px;min-height:220px}.sp-time-tables h3{margin:0 0 12px;font-size:20px}.sp-time-row{padding:9px 10px;border-radius:10px;background:var(--lesson-soft,var(--l8-soft,#f6f3fb));margin-top:7px;font-weight:750;line-height:1.35}.sp-time-empty{color:var(--muted);font-style:italic}.sp-img-box{width:min(430px,100%);aspect-ratio:1/1;margin:0 auto 18px;display:grid;place-items:center;border:2px solid var(--lesson-line,var(--l8-line,#dedce5));border-radius:20px;overflow:hidden;background:#fff}.sp-img-box img{width:100%;height:100%;object-fit:contain}.sp-img-box.missing:after{content:'Bild nicht verfügbar';font-weight:850;color:var(--muted)}.sp-img-prompt{text-align:center;font-size:22px;font-weight:900;margin-bottom:16px}.sp-img-options{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.sp-rv-finish{text-align:center}.sp-rv-finish>div:first-child{font-size:56px}@media(max-width:650px){.sp-time-actions,.sp-time-tables,.sp-img-options{grid-template-columns:1fr}.sp-time-tables section{min-height:0}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.L8T3ReviewUI20260902={install,renderTime,renderImage};install();
})();
