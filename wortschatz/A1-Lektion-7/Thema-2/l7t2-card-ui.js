(function(){
'use strict';
if(window.__SP_L7T2_CARD_UI_V1)return;
window.__SP_L7T2_CARD_UI_V1=true;

function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t2ImageCardsV1)return false;
 const S=window.L7S;
 const raw=window.L7.renderTaskPage.bind(window.L7);
 let current=null;

 function task(){return (S.T.tasks||[]).find(x=>x?.spL7T2ImageCards)||null}
 function accepted(item,value){const v=S.norm(value);return [item.answer,...(item.answers||[])].filter(Boolean).some(a=>S.norm(a)===v)}
 function draftKey(index){return`perfect-card:${index}`}
 function getDraft(state,index){return String(state.answers?.[draftKey(index)]||'')}
 function saveDraft(theme,t,index,value){const st=S.load(theme,t.id,t.items.length);st.answers=st.answers||{};if(String(value||'').trim())st.answers[draftKey(index)]=String(value);else delete st.answers[draftKey(index)];S.save(theme,t.id,st,false)}
 function clearDraft(theme,t,index){saveDraft(theme,t,index,'')}
 function progress(theme,t){const st=S.load(theme,t.id,t.items.length),p=Math.round(st.done.length/Math.max(1,t.items.length)*100);return`<div class="l7-progress-row"><span>${st.done.length} fehlerfrei · ${t.items.length-st.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function nextTask(t){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(x=>x.id===t.id)+1]||null}
 function finish(theme,t){const root=document.getElementById('app'),next=nextTask(t);root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Perfektformen mit dem Hilfsverb richtig genannt.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${S.esc(t.id)}">Zur Übersicht</a>${next?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
 function feedback(item,tries){if(tries<=0)return'';if(tries===1)return'<div class="l7-no">Noch nicht richtig. Versuche es noch einmal.</div>';if(tries===2)return'<div class="l7-hint"><strong>Hinweis:</strong> Das Hilfsverb ist „hat“. Ergänze das richtige Partizip II.</div>';return`<div class="l7-no"><strong>Lösung:</strong> ${S.esc(item.infinitive)} – ${S.esc(item.answer)}<br>Gib die richtige Form selbst ein. Diese Karte kommt später noch einmal.</div>`}
 function render(theme,id){
  const t=task();if(!t||id!==t.id)return raw(theme,id);
  const total=t.items.length,st0=S.load(theme,t.id,total);if(st0.done.length>=total)return finish(theme,t);
  const index=S.index(theme,t.id,total),st=S.load(theme,t.id,total),item=t.items[index],draft=getDraft(st,index),root=document.getElementById('app');
  current={theme,t,index,item};
  const reveal=(st.tries||0)>=3;
  root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card">${progress(theme,t)}<div class="l7-instruction">${S.esc(t.description)}</div><div class="l7-question-card sp-l7t2-image-card"><p class="eyebrow">Karte ${st.done.length+1}</p><h2>Wie heißt das Verb im Perfekt?</h2>${S.image(item.image,'Bild')}<div class="l7-actions"><button class="l7-btn" type="button" id="spCardMic">🎤 Sprechen</button><button class="l7-btn secondary" type="button" id="spCardWrite">✍️ Schreiben</button><button class="l7-btn ghost" type="button" id="spCardReveal">Lösung zeigen</button></div><div class="l7-answer-box"><label for="spCardAnswer">Perfekt mit Hilfsverb</label><div><input id="spCardAnswer" autocomplete="off" placeholder="z. B. hat gearbeitet" value="${S.esc(draft)}"><button class="l7-btn" type="button" id="spCardCheck">Prüfen</button></div></div><div id="spCardBack" class="l7-card-back" ${reveal?'':'hidden'}><div class="word">${S.esc(item.infinitive)} – ${S.esc(item.answer)}</div><div class="details"><div><span>Infinitiv</span><strong>${S.esc(item.infinitive)}</strong></div><div><span>Perfekt</span><strong>${S.esc(item.answer)}</strong></div></div><button class="l7-btn secondary" type="button" id="spCardAudio">🔊 Lösung anhören</button></div><div id="spCardFeedback">${feedback(item,Number(st.tries||0))}</div><div id="spCardTechnical"></div></div></section><footer>© SprachPilot</footer></div>`;
  const input=document.getElementById('spCardAnswer');
  input?.addEventListener('input',e=>saveDraft(theme,t,index,e.target.value));
  input?.addEventListener('keydown',e=>{if(e.key==='Enter')check(e.target.value)});
  document.getElementById('spCardCheck')?.addEventListener('click',()=>check(input?.value));
  document.getElementById('spCardWrite')?.addEventListener('click',()=>input?.focus());
  document.getElementById('spCardReveal')?.addEventListener('click',revealSolution);
  document.getElementById('spCardAudio')?.addEventListener('click',()=>S.say(item.answer,()=>technical('Die Audiofunktion ist nicht verfügbar.')));
  document.getElementById('spCardMic')?.addEventListener('click',()=>S.mic(item,answers=>{const exact=answers.find(v=>accepted(item,v));check(exact||answers[0]||'')},technical));
 }
 function technical(text){const el=document.getElementById('spCardTechnical');if(el)el.innerHTML=`<div class="l7-hint">${S.esc(text)}</div>`}
 function revealSolution(){if(!current)return;const{theme,t,index,item}=current,st=S.load(theme,t.id,t.items.length);S.attempt(theme,t.id,t.items.length,index,false);st.tries=Math.max(3,Number(st.tries||0));st.hadWrong=true;S.save(theme,t.id,st,true);document.getElementById('spCardBack').hidden=false;document.getElementById('spCardFeedback').innerHTML=feedback(item,3);document.getElementById('spCardAnswer')?.focus()}
 function check(value){
  if(!current||!String(value||'').trim())return;
  const{theme,t,index,item}=current,ok=accepted(item,value);saveDraft(theme,t,index,value);S.attempt(theme,t.id,t.items.length,index,ok);
  if(!ok){S.wrong(theme,t.id,t.items.length);return render(theme,t.id)}
  const before=S.load(theme,t.id,t.items.length),repeat=before.hadWrong||before.tries>0;clearDraft(theme,t,index);S.right(theme,t.id,t.items.length);
  document.querySelectorAll('.sp-l7t2-image-card button,.sp-l7t2-image-card input').forEach(x=>x.disabled=true);
  const f=document.getElementById('spCardFeedback');if(f)f.innerHTML=`<div class="l7-ok">Richtig.${repeat?' Diese Karte kommt am Ende noch einmal.':''}</div>`;
  setTimeout(()=>render(theme,t.id),550)
 }

 const style=document.createElement('style');style.id='sp-l7t2-card-style';style.textContent=`.sp-l7t2-image-card .l7-image{margin:8px auto 20px}.sp-l7t2-image-card .l7-image img{display:block;max-width:min(360px,76vw);max-height:360px;object-fit:contain;margin:auto}.sp-l7t2-image-card .l7-card-back{margin-top:18px}.sp-l7t2-image-card .l7-card-back .word{font-size:clamp(24px,4vw,34px);font-weight:950}.sp-l7t2-image-card .l7-card-back[hidden]{display:none!important}`;document.head.appendChild(style);
 window.L7.renderTaskPage=function(theme,id){const t=task();if(t&&id===t.id)return render(Number(theme),id);return raw(theme,id)};
 window.L7.__l7t2ImageCardsV1=true;
 return true
 }
 window.L7T2CardUI={install};
})();