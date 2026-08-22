(function(){
'use strict';
if(window.__SP_L7T3_SCHON_EINMAL_UI_V2)return;window.__SP_L7T3_SCHON_EINMAL_UI_V2=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__spSchonEinmalV2)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7),theme=3;
 const esc=S.esc;
 function exact(a,b){return S.norm(a)===S.norm(b)}
 function state(t){return S.load(theme,t.id,t.items.length)}
 function saveMeta(t,key,value){const st=state(t);st.answers=st.answers||{};if(value==null||value==='')delete st.answers[key];else st.answers[key]=value;S.save(theme,t.id,st,false)}
 function phaseKey(i){return`schon:${i}:phase`}
 function draftKey(i,p){return`schon:${i}:${p}`}
 function example(t){
  const st=state(t);if(st.answers?.schonExampleDone)return false;
  const root=document.getElementById('app');root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card"><div class="l7-instruction">${esc(t.description)}</div><div class="l7-question-card"><p class="eyebrow">Beispiel</p>${S.image('backen.webp','backen')}<div class="sp-schon-cues"><b>backen</b><span>der Schokoladenkuchen</span></div><div class="sp-schon-example"><p><strong>Frage:</strong> Hast du schon einmal einen Schokoladenkuchen gebacken?</p><p><strong>🙁 Antwort:</strong> Nein, ich habe noch nie einen Schokoladenkuchen gebacken.</p></div><button class="l7-btn" id="spSchonStart">Aufgabe starten</button></div></section></div>`;
  document.getElementById('spSchonStart').onclick=()=>{saveMeta(t,'schonExampleDone',true);render(theme,t.id)};return true
 }
 function style(){if(document.getElementById('sp-schon-style'))return;const x=document.createElement('style');x.id='sp-schon-style';x.textContent=`.sp-schon-cues{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:12px 0}.sp-schon-cues>*{padding:9px 12px;border-radius:999px;background:#f3f0ff;border:1px solid #dcd4f4}.sp-schon-mode{font-size:54px;text-align:center;margin:10px 0}.sp-schon-example{background:#faf9ff;border:1px solid #e4def8;border-radius:14px;padding:12px 14px;margin:12px 0}.sp-schon-actions{display:flex;gap:10px;flex-wrap:wrap;margin:12px 0}.sp-schon-actions .l7-btn{flex:1 1 180px}.sp-schon-input{display:none;margin-top:10px}.sp-schon-input.open{display:block}.sp-schon-input input{width:100%;padding:12px;border:2px solid #d9d4f4;border-radius:12px;font:inherit}.sp-schon-input .l7-btn{margin-top:8px;width:100%}`;document.head.appendChild(x)}
 function feedback(count,item){if(count<=1)return'<div class="l7-no">Noch nicht richtig.</div>';if(count===2)return`<div class="l7-hint"><strong>Hinweis:</strong> ${esc(item.hint)}</div>`;return`<div class="l7-no"><strong>Lösung der Frage:</strong> ${esc(item.question)}<br><strong>Lösung der Antwort:</strong> ${esc(item.answer)}<br>Sprich oder schreibe beim nächsten Durchgang selbst.</div>`}
 function fail(t,index,item){
  const st=state(t);st.answers=st.answers||{};st.answers[phaseKey(index)]='q';delete st.answers[draftKey(index,'q')];delete st.answers[draftKey(index,'a')];S.save(theme,t.id,st,false);S.attempt(theme,t.id,t.items.length,index,false);const count=S.wrong(theme,t.id,t.items.length);const fb=document.getElementById('spSchonFeedback');if(fb)fb.innerHTML=feedback(count,item);document.querySelectorAll('#app button,#app input').forEach(x=>x.disabled=true)
 }
 function render(th,id){
  const t=S.task(id);if(!t||t.kind!=='schon-einmal')return raw(th,id);style();if(example(t))return;
  const st=state(t);if(st.done.length>=t.items.length)return raw(th,id);const index=S.index(theme,t.id,t.items.length),item=t.items[index];if(index==null||!item)return raw(th,id);
  const fresh=state(t),phase=fresh.answers?.[phaseKey(index)]||'q',draft=String(fresh.answers?.[draftKey(index,phase)]||'');
  const p=S.pct(theme,t.id,t.items.length),root=document.getElementById('app');
  root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card"><div class="l7-progress-row"><span>${fresh.done.length} fehlerfrei · ${t.items.length-fresh.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div><div class="l7-instruction">${esc(t.description)}</div><div class="l7-question-card"><p class="eyebrow">${phase==='q'?'1. Frage bilden':'2. Antworten'}</p>${S.image(item.image,item.verb)}<div class="sp-schon-cues"><b>${esc(item.verb)}</b><span>${esc(item.extra)}</span></div>${phase==='a'?`<div class="sp-schon-mode" aria-label="${item.positive?'Ja':'Nein'}">${item.positive?'🙂':'🙁'}</div>`:''}<h2>${phase==='q'?'Bilde eine Frage mit „schon einmal“.':'Antworte mit einem ganzen Satz.'}</h2><div class="sp-schon-actions"><button class="l7-btn" id="spSchonMic">🎤 ${phase==='q'?'Frage':'Antwort'} sprechen</button><button class="l7-btn secondary" id="spSchonWrite">✍️ ${phase==='q'?'Frage':'Antwort'} schreiben</button></div><div class="sp-schon-input ${draft?'open':''}" id="spSchonInputBox"><input id="spSchonInput" value="${esc(draft)}" autocomplete="off" placeholder="${phase==='q'?'Schreibe die Frage.':'Schreibe die Antwort.'}"><button class="l7-btn" id="spSchonCheck">Prüfen</button></div><div id="spSchonFeedback">${fresh.tries?feedback(fresh.tries,item):''}</div></div></section></div>`;
  const input=document.getElementById('spSchonInput'),box=document.getElementById('spSchonInputBox');
  input.oninput=()=>saveMeta(t,draftKey(index,phase),input.value);
  const check=value=>{const expected=phase==='q'?item.question:item.answer;if(!String(value||'').trim())return;if(!exact(value,expected))return fail(t,index,item);if(phase==='q'){saveMeta(t,draftKey(index,'q'),'');saveMeta(t,phaseKey(index),'a');render(theme,t.id);return}saveMeta(t,draftKey(index,'a'),'');saveMeta(t,phaseKey(index),'q');S.attempt(theme,t.id,t.items.length,index,true);S.right(theme,t.id,t.items.length);document.getElementById('spSchonFeedback').innerHTML='<div class="l7-ok">Richtig.</div>';document.querySelectorAll('#app button,#app input').forEach(x=>x.disabled=true);setTimeout(()=>render(theme,t.id),520)};
  document.getElementById('spSchonWrite').onclick=()=>{box.classList.add('open');input.focus()};document.getElementById('spSchonCheck').onclick=()=>check(input.value);input.onkeydown=e=>{if(e.key==='Enter')check(input.value)};
  document.getElementById('spSchonMic').onclick=()=>S.mic(item,values=>{const heard=values.find(v=>exact(v,phase==='q'?item.question:item.answer))||values[0]||'';box.classList.add('open');input.value=heard;saveMeta(t,draftKey(index,phase),heard);check(heard)},message=>{document.getElementById('spSchonFeedback').innerHTML=`<div class="l7-hint">${esc(message)}</div>`});
 }
 window.L7.renderTaskPage=render;window.L7.__spSchonEinmalV2=true;return true
}
window.L7T3SchonEinmalUI={install};
if(!install()){let n=0;const timer=setInterval(()=>{if(install()||++n>200)clearInterval(timer)},25)}
})();
