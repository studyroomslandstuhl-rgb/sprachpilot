(function(){
'use strict';
if(window.__SP_L7T3_ERROR_SELECTION_FIX_V1)return;window.__SP_L7T3_ERROR_SELECTION_FIX_V1=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__spL7T3ErrorSelectionFix)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7),theme=3,id='t3-fehler-korrigieren-v2',esc=S.esc;
 const clean=v=>S.norm(String(v||'').replace(/[.,!?;:“”„"'`()]/g,''));
 function render(th,taskId){
  if(String(taskId)!==id)return raw(th,taskId);
  const t=S.task(id);if(!t)return raw(th,taskId);const st=S.load(theme,t.id,t.items.length);if((st.done||[]).length>=t.items.length)return raw(th,taskId);const index=S.index(theme,t.id,t.items.length),item=t.items[index];if(index==null||!item)return raw(th,taskId);
  const fresh=S.load(theme,t.id,t.items.length);fresh.answers=fresh.answers||{};delete fresh.answers[`errSel:${index}`];S.save(theme,t.id,fresh,false);
  let selected=-1;const draft=String(fresh.answers[`errInput:${index}`]||''),words=String(item.sentence||'').split(/\s+/),pct=S.pct(theme,t.id,t.items.length);
  document.getElementById('app').innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card"><div class="l7-progress-row"><span>${fresh.done.length} fehlerfrei · ${t.items.length-fresh.done.length} übrig</span><strong>${pct}%</strong></div><div class="l7-progress"><span style="width:${pct}%"></span></div><div class="l7-instruction">${esc(t.description||'1. Klicke das falsche Wort an. 2. Schreibe die richtige Form.')}</div><div class="l7-question-card"><div class="sp-error-sentence">${words.map((word,n)=>`<button type="button" data-error-word="${n}">${esc(word)}</button>`).join(' ')}</div><div class="l7-answer-box"><label for="spErrorInput">Richtige Form</label><div><input id="spErrorInput" value="${esc(draft)}" autocomplete="off"><button class="l7-btn" id="spErrorCheck">Prüfen</button></div></div><div id="spFeedback"></div></div></section></div>`;
  setTimeout(()=>document.querySelector('.l7-question-card')?.scrollIntoView({block:'start',behavior:'smooth'}),40);
  document.querySelectorAll('[data-error-word]').forEach(btn=>btn.onclick=()=>{selected=Number(btn.dataset.errorWord);document.querySelectorAll('[data-error-word]').forEach(x=>x.classList.toggle('selected',x===btn))});
  const input=document.getElementById('spErrorInput');input.oninput=()=>{const x=S.load(theme,t.id,t.items.length);x.answers=x.answers||{};x.answers[`errInput:${index}`]=input.value;S.save(theme,t.id,x,false)};
  const check=()=>{const value=String(input.value||'').trim();if(selected<0||!value){document.getElementById('spFeedback').innerHTML='<div class="l7-hint">Klicke zuerst selbst das falsche Wort an und schreibe danach die richtige Form.</div>';return}const okWord=clean(words[selected])===clean(item.wrongWord),okForm=S.norm(value)===S.norm(item.answer);if(okWord&&okForm){const x=S.load(theme,t.id,t.items.length);delete x.answers[`errInput:${index}`];S.save(theme,t.id,x,false);S.attempt(theme,t.id,t.items.length,index,true);S.right(theme,t.id,t.items.length,true);document.querySelectorAll('#app button,#app input').forEach(x=>x.disabled=true);document.getElementById('spFeedback').innerHTML='<div class="l7-ok">Richtig.</div>';setTimeout(()=>render(theme,id),520);return}const x=S.load(theme,t.id,t.items.length);delete x.answers[`errInput:${index}`];S.save(theme,t.id,x,false);S.attempt(theme,t.id,t.items.length,index,false);const count=Number(S.wrong(theme,t.id,t.items.length))||1;document.querySelectorAll('#app button,#app input').forEach(x=>x.disabled=true);if(count===1)document.getElementById('spFeedback').innerHTML='<div class="l7-no">Noch nicht richtig. Der Satz kommt später noch einmal.</div>';else if(count===2)document.getElementById('spFeedback').innerHTML=`<div class="l7-hint"><strong>Hinweis:</strong> ${esc(okWord?'Prüfe die richtige Schreibweise.':`Suche den Fehler bei ${item.errorType||'diesem Wort'}.`)}</div>`;else document.getElementById('spFeedback').innerHTML=`<div class="l7-hint"><strong>Lösung:</strong> ${esc(item.wrongWord)} → ${esc(item.answer)}<br>Beim nächsten Durchgang markierst und korrigierst du selbst.</div>`};
  document.getElementById('spErrorCheck').onclick=check;input.onkeydown=e=>{if(e.key==='Enter')check()};
 }
 window.L7.renderTaskPage=render;window.L7.__spL7T3ErrorSelectionFix=true;return true
}
window.L7T3ErrorSelectionFix={install};
})();
