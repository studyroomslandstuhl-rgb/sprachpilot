(function(){
'use strict';
if(window.__SP_L7T3_NO_REPEAT_SPECIAL_V1)return;window.__SP_L7T3_NO_REPEAT_SPECIAL_V1=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__spL7T3NoRepeatSpecialV1)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7),theme=3,esc=S.esc;
 function task(id){return S.task(id)}
 function progress(t,st){const p=Math.round((st.done?.length||0)/Math.max(1,t.items.length)*100);return`<div class="l7-progress-row"><span>${st.done.length} von ${t.items.length} fertig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function shell(t,st,body){return`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card">${progress(t,st)}<div class="l7-instruction">${esc(t.description||'')}</div>${body}</section><footer>© SprachPilot</footer></div>`}
 function finish(t){return raw(theme,t.id)}
 function state(t){const st=S.load(theme,t.id,t.items.length);st.answers=st.answers||{};return st}
 function save(t,st,sync=false){S.save(theme,t.id,st,sync)}
 function help(tries,answer,hint){if(tries===1)return'<small class="sp-l7-fixed-help no">Noch nicht richtig. Korrigiere die Antwort.</small>';if(tries===2)return`<small class="sp-l7-fixed-help hint"><strong>Hinweis:</strong> ${esc(hint)}</small>`;if(tries>=3)return`<small class="sp-l7-fixed-help solution"><strong>Lösung:</strong> ${esc(answer)}<br>Trage die richtige Form selbst ein.</small>`;return''}
 function renderSein(t){
  const st=state(t);if((st.done||[]).length>=t.items.length)return finish(t);st.answers.stableSeinTries=st.answers.stableSeinTries||{};
  const rows=t.items.map((item,i)=>{const done=st.done.includes(i),key=`stableSein:${i}`,value=done?item.form:String(st.answers[key]||''),tries=Number(st.answers.stableSeinTries[i]||0);return`<div class="sp-sein-row ${done?'done':''}"><strong>${esc(item.pronoun)}</strong><div><input data-stable-sein="${i}" ${done?'disabled':''} value="${esc(value)}" autocomplete="off" placeholder="sein">${done?'':help(tries,item.form,'Achte auf das Pronomen und die passende Form von „sein“.')}</div></div>`}).join('');
  document.getElementById('app').innerHTML=shell(t,st,`<div class="sp-sein-title">sein</div><div class="sp-sein-table">${rows}</div><button class="l7-btn sp-full" id="stableSeinCheck">Prüfen</button><div id="spFeedback"></div>`);
  document.querySelectorAll('[data-stable-sein]').forEach(input=>input.oninput=()=>{const x=state(t);x.answers[`stableSein:${input.dataset.stableSein}`]=input.value;save(t,x,false)});
  document.getElementById('stableSeinCheck').onclick=()=>{const x=state(t);x.answers.stableSeinTries=x.answers.stableSeinTries||{};let touched=false,wrong=false,corrected=false;t.items.forEach((item,i)=>{if(x.done.includes(i))return;const input=document.querySelector(`[data-stable-sein="${i}"]`),v=String(input?.value||'').trim();if(!v)return;touched=true;if(S.norm(v)===S.norm(item.form)){x.done.push(i);delete x.answers[`stableSein:${i}`];delete x.answers.stableSeinTries[i];corrected=true}else{x.answers.stableSeinTries[i]=Number(x.answers.stableSeinTries[i]||0)+1;wrong=true}});if(!touched)return;x.current=null;x.tries=0;x.hadWrong=false;save(t,x,true);renderSein(t);if(!wrong&&corrected){const box=document.getElementById('spFeedback');if(box)box.innerHTML='<div class="l7-ok">Richtig.</div>'}}
 }
 function clozeParts(t){return Array.isArray(t.clozeParts)?t.clozeParts:[]}
 function renderCloze(t){
  const st=state(t);if((st.done||[]).length>=t.items.length)return finish(t);st.answers.stableClozeTries=st.answers.stableClozeTries||{};const parts=clozeParts(t);let html='';
  t.items.forEach((item,i)=>{const done=st.done.includes(i),key=`stableCloze:${i}`,value=done?item.answer:String(st.answers[key]||''),tries=Number(st.answers.stableClozeTries[i]||0);html+=esc(parts[i]||'')+`<span class="sp-cloze-slot"><input class="sp-cloze-input ${done?'done':''} ${tries&&!done?'wrong':''}" data-stable-cloze="${i}" ${done?'disabled':''} value="${esc(value)}" autocomplete="off">${done?'':help(tries,item.answer,'Prüfe das Subjekt und die passende Form von „haben“ oder „sein“.')}</span>`});html+=esc(parts[t.items.length]||'');
  document.getElementById('app').innerHTML=shell(t,st,`<div class="sp-big-cloze">${html}</div><button class="l7-btn sp-full" id="stableClozeCheck">Prüfen</button><div id="spFeedback"></div>`);
  document.querySelectorAll('[data-stable-cloze]').forEach(input=>input.oninput=()=>{const x=state(t);x.answers[`stableCloze:${input.dataset.stableCloze}`]=input.value;save(t,x,false)});
  document.getElementById('stableClozeCheck').onclick=()=>{const x=state(t);x.answers.stableClozeTries=x.answers.stableClozeTries||{};let touched=false,wrong=false,corrected=false;t.items.forEach((item,i)=>{if(x.done.includes(i))return;const input=document.querySelector(`[data-stable-cloze="${i}"]`),v=String(input?.value||'').trim();if(!v)return;touched=true;if(S.norm(v)===S.norm(item.answer)){x.done.push(i);delete x.answers[`stableCloze:${i}`];delete x.answers.stableClozeTries[i];corrected=true}else{x.answers.stableClozeTries[i]=Number(x.answers.stableClozeTries[i]||0)+1;wrong=true}});if(!touched)return;x.current=null;x.tries=0;x.hadWrong=false;save(t,x,true);renderCloze(t);if(!wrong&&corrected){const box=document.getElementById('spFeedback');if(box)box.innerHTML='<div class="l7-ok">Richtig.</div>'}}
 }
 const style=document.createElement('style');style.id='sp-l7t3-no-repeat-special-style';style.textContent=`.sp-l7-fixed-help{display:block;margin-top:5px;font-size:11px;line-height:1.3;font-weight:800;text-align:left}.sp-l7-fixed-help.no,.sp-l7-fixed-help.solution{color:#a12626}.sp-l7-fixed-help.hint{color:#765600}.sp-sein-row>div{min-width:0}.sp-sein-row input{width:100%;box-sizing:border-box}`;document.head.appendChild(style);
 window.L7.renderTaskPage=function(th,id){const t=task(id);if(t?.spL7T3Kind==='sein')return renderSein(t);if(t?.spL7T3Kind==='cloze')return renderCloze(t);return raw(th,id)};
 window.L7.__spL7T3NoRepeatSpecialV1=true;return true
}
window.L7T3NoRepeatSpecial={install};if(!install()){let n=0;const timer=setInterval(()=>{if(install()||++n>200)clearInterval(timer)},25)}
})();