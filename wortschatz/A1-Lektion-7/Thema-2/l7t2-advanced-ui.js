(function(){
'use strict';
if(window.__SP_L7T2_ADVANCED_UI_V1)return;
window.__SP_L7T2_ADVANCED_UI_V1=true;
const AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
let activeAudio=null;

function install(){
 if(!window.L7||!window.L7S||window.L7.__l7t2AdvancedV1)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7);
 const esc=S.esc;
 let feedback='';
 function taskById(id){return S.task(id)}
 function nextTask(t){const a=S.T.tasks||[];return a[a.findIndex(x=>x.id===t.id)+1]||null}
 function pct(theme,t){return Math.round(S.load(theme,t.id,t.items.length).done.length/Math.max(1,t.items.length)*100)}
 function progress(theme,t,label='fertig'){const st=S.load(theme,t.id,t.items.length),p=pct(theme,t);return`<div class="l7-progress-row"><span>${st.done.length} von ${t.items.length} ${label}</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
 function shell(theme,t,body,instruction=t.description){return`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card">${progress(theme,t)}<div class="l7-instruction">${esc(instruction||'')}</div>${body}</section><footer>© SprachPilot</footer></div>`}
 function finish(theme,t){const root=document.getElementById('app'),next=nextTask(t);root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(t.id)}">Zur Übersicht</a>${next&&!next.exam?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`}
 function saveAnswer(theme,t,key,value){const st=S.load(theme,t.id,t.items.length);st.answers=st.answers||{};if(value===''||value==null)delete st.answers[key];else st.answers[key]=value;S.save(theme,t.id,st,false)}
 function markDone(theme,t,index){const st=S.load(theme,t.id,t.items.length);if(!st.done.includes(index))st.done.push(index);st.current=null;st.tries=0;st.hadWrong=false;S.save(theme,t.id,st,true)}
 function current(theme,t){const st=S.load(theme,t.id,t.items.length);if(st.done.length>=t.items.length)return null;return S.index(theme,t.id,t.items.length)}
 function wrong(theme,t,index){S.attempt(theme,t.id,t.items.length,index,false);S.wrong(theme,t.id,t.items.length)}
 function right(theme,t,index){S.attempt(theme,t.id,t.items.length,index,true);S.right(theme,t.id,t.items.length)}
 function playFile(file,button){try{activeAudio?.pause()}catch(e){};activeAudio=null;const audio=new Audio(AUDIO_BASE+encodeURIComponent(file));activeAudio=audio;button?.classList.add('bunny-audio-playing');audio.addEventListener('ended',()=>{button?.classList.remove('bunny-audio-playing');if(activeAudio===audio)activeAudio=null},{once:true});audio.addEventListener('error',()=>{button?.classList.remove('bunny-audio-playing');const box=button?.parentElement?.querySelector('.sp-audio-error');if(box)box.textContent='Audio nicht verfügbar.'},{once:true});audio.play().catch(()=>{button?.classList.remove('bunny-audio-playing')})}
 function nearSentence(a,b){const clean=x=>String(x||'').toLowerCase().replace(/[.?!]/g,'').replace(/\s+/g,' ').trim();return clean(a)===clean(b)}
 function exactSentence(a,b){return String(a||'').replace(/\s+/g,' ').trim()===String(b||'').replace(/\s+/g,' ').trim()}

 function renderListenParticiple(theme,t){
  const index=current(theme,t);if(index==null)return finish(theme,t);const item=t.items[index],st=S.load(theme,t.id,t.items.length),draft=String(st.answers?.[`listen:${index}`]||'');
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card sp-center"><button type="button" class="l7-btn sp-audio-big" id="spListenWord">🔊 Anhören</button><div class="sp-audio-error"></div><div class="l7-answer-box"><label for="spListenInput">Partizip II</label><div><input id="spListenInput" autocomplete="off" value="${esc(draft)}"><button class="l7-btn" id="spListenCheck">Prüfen</button></div></div><div id="spFeedback">${feedback}</div></div>`,'Höre den Infinitiv und schreibe Partizip II.');
  const input=document.getElementById('spListenInput');input?.addEventListener('input',e=>saveAnswer(theme,t,`listen:${index}`,e.target.value));document.getElementById('spListenWord')?.addEventListener('click',e=>playFile(item.audioFile,e.currentTarget));document.getElementById('spListenCheck')?.addEventListener('click',()=>{const v=String(input?.value||'').trim();if(!v)return;if(S.norm(v)===S.norm(item.answer)){feedback='<div class="l7-ok">Richtig.</div>';saveAnswer(theme,t,`listen:${index}`,'');right(theme,t,index);setTimeout(()=>{feedback='';renderListenParticiple(theme,t)},400)}else{wrong(theme,t,index);const n=S.load(theme,t.id,t.items.length).tries||0;feedback=n>=3?`<div class="l7-no">Lösung: ${esc(item.answer)}</div>`:n===2?'<div class="l7-hint">Achte auf die Partizip-II-Form.</div>':'<div class="l7-no">Noch nicht richtig.</div>';renderListenParticiple(theme,t)}});input?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('spListenCheck')?.click()})
 }

 function renderHaben(theme,t){
  const st=S.load(theme,t.id,t.items.length);if(st.done.length>=t.items.length)return finish(theme,t);const rows=t.items.map((item,index)=>{const done=st.done.includes(index),v=String(st.answers?.[`haben:${index}`]||'');return`<div class="sp-haben-row ${done?'done':''}"><strong>${esc(item.pronoun)}</strong><input data-haben="${index}" ${done?'disabled':''} autocomplete="off" value="${esc(done?item.form:v)}" placeholder="haben"></div>`}).join('');
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="sp-haben-title">haben</div><div class="sp-haben-table">${rows}</div><button class="l7-btn sp-full" id="spHabenCheck">Prüfen</button><div id="spFeedback">${feedback}</div>`,'Konjugiere haben.');
  document.querySelectorAll('[data-haben]').forEach(input=>input.addEventListener('input',()=>saveAnswer(theme,t,`haben:${input.dataset.haben}`,input.value)));
  document.getElementById('spHabenCheck')?.addEventListener('click',()=>{const fresh=S.load(theme,t.id,t.items.length);let changed=false,wrongCount=0;t.items.forEach((item,index)=>{if(fresh.done.includes(index))return;const input=document.querySelector(`[data-haben="${index}"]`),v=String(input?.value||'').trim();if(S.norm(v)===S.norm(item.form)){fresh.done.push(index);delete fresh.answers?.[`haben:${index}`];changed=true}else if(v)wrongCount++});S.save(theme,t.id,fresh,true);feedback=wrongCount?'<div class="l7-no">Korrigiere die falschen Formen.</div>':changed?'<div class="l7-ok">Richtig.</div>':'';renderHaben(theme,t)})
 }

 function renderGrammar(theme,t){
  const index=current(theme,t);if(index==null)return finish(theme,t);const item=t.items[index];
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-sentence-frame">${esc(item.sentence)}</div><h2 class="sp-question">${esc(item.question)}</h2><div class="l7-options">${S.shuffle(item.parts).map(x=>`<button type="button" data-grammar-answer="${esc(x)}">${esc(x)}</button>`).join('')}</div><div id="spFeedback">${feedback}</div></div>`,'Antworte auf die Frage.');
  document.querySelectorAll('[data-grammar-answer]').forEach(btn=>btn.addEventListener('click',()=>{const v=btn.dataset.grammarAnswer;if(S.norm(v)===S.norm(item.answer)){feedback='<div class="l7-ok">Richtig.</div>';right(theme,t,index);setTimeout(()=>{feedback='';renderGrammar(theme,t)},350)}else{wrong(theme,t,index);feedback='<div class="l7-no">Noch nicht richtig.</div>';renderGrammar(theme,t)}}))
 }

 function orderState(theme,t,index){const st=S.load(theme,t.id,t.items.length);st.answers=st.answers||{};return Array.isArray(st.answers[`order:${index}`])?[...st.answers[`order:${index}`]]:[]}
 function renderSentenceOrder(theme,t){
  const index=current(theme,t);if(index==null)return finish(theme,t);const item=t.items[index],selected=orderState(theme,t,index),pool=item.tokens.map((token,i)=>({token,i})).filter(x=>!selected.some(s=>s.i===x.i));
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-order-answer">${selected.length?selected.map(x=>esc(x.token)).join(' '):' '}</div><div class="l7-tokens">${S.shuffle(pool).map(x=>`<button type="button" data-order-token="${x.i}">${esc(x.token)}</button>`).join('')}</div><div class="sp-three-actions"><button class="l7-btn" id="spOrderCheck">Prüfen</button><button class="l7-btn secondary" id="spOrderReset">Neu</button><button class="l7-btn secondary" id="spOrderBack">Zurück</button></div><div id="spFeedback">${feedback}</div></div>`,'Ordne die Sätze im Perfekt.');
  document.querySelectorAll('[data-order-token]').forEach(btn=>btn.addEventListener('click',()=>{const arr=orderState(theme,t,index),i=Number(btn.dataset.orderToken);arr.push({token:item.tokens[i],i});saveAnswer(theme,t,`order:${index}`,arr);renderSentenceOrder(theme,t)}));
  document.getElementById('spOrderReset')?.addEventListener('click',()=>{saveAnswer(theme,t,`order:${index}`,[]);feedback='';renderSentenceOrder(theme,t)});document.getElementById('spOrderBack')?.addEventListener('click',()=>{const arr=orderState(theme,t,index);arr.pop();saveAnswer(theme,t,`order:${index}`,arr);renderSentenceOrder(theme,t)});document.getElementById('spOrderCheck')?.addEventListener('click',()=>{const arr=orderState(theme,t,index),v=arr.map(x=>x.token).join(' '),target=item.sentence.replace(/[.?!]$/,'');if(v===target){saveAnswer(theme,t,`order:${index}`,'');feedback='<div class="l7-ok">Richtig.</div>';right(theme,t,index);setTimeout(()=>{feedback='';renderSentenceOrder(theme,t)},350)}else{wrong(theme,t,index);feedback='<div class="l7-no">Noch nicht richtig.</div>';renderSentenceOrder(theme,t)}})
 }

 function renderSentenceWrite(theme,t){
  const index=current(theme,t);if(index==null)return finish(theme,t);const item=t.items[index],st=S.load(theme,t.id,t.items.length),draft=String(st.answers?.[`write:${index}`]||'');
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-cue-frame">${esc(item.cue)}</div><div class="l7-answer-box"><label for="spSentenceInput">Antwort</label><div><input id="spSentenceInput" autocomplete="off" value="${esc(draft)}"><button class="l7-btn" id="spSentenceCheck">Prüfen</button></div></div><div id="spFeedback">${feedback}</div></div>`,'Schreibe die Sätze im Perfekt.');
  const input=document.getElementById('spSentenceInput');input?.addEventListener('input',e=>saveAnswer(theme,t,`write:${index}`,e.target.value));document.getElementById('spSentenceCheck')?.addEventListener('click',()=>{const v=input?.value||'';if(!String(v).trim())return;if(exactSentence(v,item.answer)){saveAnswer(theme,t,`write:${index}`,'');feedback='<div class="l7-ok">Richtig.</div>';right(theme,t,index);setTimeout(()=>{feedback='';renderSentenceWrite(theme,t)},350)}else{wrong(theme,t,index);const n=S.load(theme,t.id,t.items.length).tries||0;feedback=nearSentence(v,item.answer)?'<div class="l7-hint">Achte auf Großschreibung und Satzzeichen.</div>':n>=3?`<div class="l7-no">Lösung: ${esc(item.answer)}</div>`:'<div class="l7-no">Noch nicht richtig.</div>';renderSentenceWrite(theme,t)}});input?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('spSentenceCheck')?.click()})
 }

 function renderDialogs(theme,t){
  const index=current(theme,t);if(index==null)return finish(theme,t);const item=t.items[index];
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-dialog"><div class="sp-bubble left">${esc(item.left)}</div><div class="sp-bubble right">${esc(item.right)}</div></div><div class="l7-options">${S.shuffle(item.options).map(x=>`<button type="button" data-dialog-answer="${esc(x)}">${esc(x)}</button>`).join('')}</div><div id="spFeedback">${feedback}</div></div>`,'Wähle das passende Verb.');
  document.querySelectorAll('[data-dialog-answer]').forEach(btn=>btn.addEventListener('click',()=>{if(S.norm(btn.dataset.dialogAnswer)===S.norm(item.answer)){feedback='<div class="l7-ok">Richtig.</div>';right(theme,t,index);setTimeout(()=>{feedback='';renderDialogs(theme,t)},350)}else{wrong(theme,t,index);feedback='<div class="l7-no">Noch nicht richtig.</div>';renderDialogs(theme,t)}}))
 }

 function renderRewrite(theme,t){
  const index=current(theme,t);if(index==null)return finish(theme,t);const item=t.items[index],st=S.load(theme,t.id,t.items.length),draft=String(st.answers?.rewrite||'');
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-text-frame">${esc(item.present)}</div><div class="l7-free"><label for="spRewrite">Perfekt</label><textarea id="spRewrite" rows="9">${esc(draft)}</textarea><button class="l7-btn sp-full" id="spRewriteCheck">Prüfen</button></div><div id="spFeedback">${feedback}</div></div>`,'Schreibe den Text im Perfekt.');
  const input=document.getElementById('spRewrite');input?.addEventListener('input',e=>saveAnswer(theme,t,'rewrite',e.target.value));document.getElementById('spRewriteCheck')?.addEventListener('click',()=>{const v=input?.value||'';if(exactSentence(v,item.perfect)){saveAnswer(theme,t,'rewrite','');feedback='<div class="l7-ok">Richtig.</div>';right(theme,t,index);setTimeout(()=>{feedback='';renderRewrite(theme,t)},350)}else{wrong(theme,t,index);feedback=nearSentence(v,item.perfect)?'<div class="l7-hint">Achte auf Großschreibung und Satzzeichen.</div>':'<div class="l7-no">Der Text stimmt noch nicht vollständig.</div>';renderRewrite(theme,t)}})
 }

 function selected(st,key){return String(st.answers?.[key]??'')}
 function setChoice(theme,t,key,value){saveAnswer(theme,t,key,value)}
 function renderReading(theme,t){
  const st=S.load(theme,t.id,t.items.length);if(st.done.length>=t.items.length)return finish(theme,t);const index=[...Array(t.items.length).keys()].find(i=>!st.done.includes(i)),item=t.items[index];let q=0;
  const tf=item.tf.map(([text,answer])=>{const key=`read:${index}:${q++}`,v=selected(st,key);return`<div class="sp-read-q"><strong>${esc(text)}</strong><div class="sp-choice-row"><button data-read-key="${key}" data-read-value="true" class="${v==='true'?'selected':''}">Richtig</button><button data-read-key="${key}" data-read-value="false" class="${v==='false'?'selected':''}">Falsch</button></div></div>`}).join('');
  const abc=item.abc.map(([text,options,answer])=>{const key=`read:${index}:${q++}`,v=selected(st,key);return`<div class="sp-read-q"><strong>${esc(text)}</strong><div class="sp-choice-row">${options.map(x=>`<button data-read-key="${key}" data-read-value="${esc(x)}" class="${v===x?'selected':''}">${esc(x)}</button>`).join('')}</div></div>`}).join('');
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-text-frame">${esc(item.text)}</div><div class="sp-question-list">${tf}${abc}</div><button class="l7-btn sp-full" id="spReadCheck">Prüfen</button><div id="spFeedback">${feedback}</div></div>`,'Lies den Text und antworte.');
  document.querySelectorAll('[data-read-key]').forEach(btn=>btn.addEventListener('click',()=>{setChoice(theme,t,btn.dataset.readKey,btn.dataset.readValue);renderReading(theme,t)}));document.getElementById('spReadCheck')?.addEventListener('click',()=>{const fresh=S.load(theme,t.id,t.items.length);let qi=0,all=true;item.tf.forEach(([,ans])=>{if(selected(fresh,`read:${index}:${qi++}`)!==String(ans))all=false});item.abc.forEach(([,opts,ans])=>{if(selected(fresh,`read:${index}:${qi++}`)!==ans)all=false});if(all){for(let i=0;i<qi;i++)delete fresh.answers?.[`read:${index}:${i}`];if(!fresh.done.includes(index))fresh.done.push(index);S.save(theme,t.id,fresh,true);feedback='<div class="l7-ok">Richtig.</div>';setTimeout(()=>{feedback='';renderReading(theme,t)},350)}else{feedback='<div class="l7-no">Prüfe deine Antworten.</div>';renderReading(theme,t)}})
 }

 function renderListening(theme,t){
  const st=S.load(theme,t.id,t.items.length);if(st.done.length>=t.items.length)return finish(theme,t);const index=[...Array(t.items.length).keys()].find(i=>!st.done.includes(i)),item=t.items[index];
  const questions=item.questions.map(([text,options,answer],q)=>{const key=`listenSet:${index}:${q}`,v=selected(st,key);return`<div class="sp-read-q"><strong>${esc(text)}</strong><div class="sp-choice-row">${options.map(x=>`<button data-listen-key="${key}" data-listen-value="${esc(x)}" class="${v===x?'selected':''}">${esc(x)}</button>`).join('')}</div></div>`}).join('');
  document.getElementById('app').innerHTML=shell(theme,t,`<div class="l7-question-card sp-center"><button class="l7-btn sp-audio-big" id="spRecapAudio">🔊 Anhören</button><div class="sp-audio-error"></div><div class="sp-question-list">${questions}</div><button class="l7-btn sp-full" id="spListenSetCheck">Prüfen</button><div id="spFeedback">${feedback}</div></div>`,'Höre kurze Tagesrückblicke und antworte.');
  document.getElementById('spRecapAudio')?.addEventListener('click',e=>playFile(item.audioFile,e.currentTarget));document.querySelectorAll('[data-listen-key]').forEach(btn=>btn.addEventListener('click',()=>{setChoice(theme,t,btn.dataset.listenKey,btn.dataset.listenValue);renderListening(theme,t)}));document.getElementById('spListenSetCheck')?.addEventListener('click',()=>{const fresh=S.load(theme,t.id,t.items.length);let all=true;item.questions.forEach(([,opts,answer],q)=>{if(selected(fresh,`listenSet:${index}:${q}`)!==answer)all=false});if(all){item.questions.forEach((x,q)=>delete fresh.answers?.[`listenSet:${index}:${q}`]);if(!fresh.done.includes(index))fresh.done.push(index);S.save(theme,t.id,fresh,true);feedback='<div class="l7-ok">Richtig.</div>';setTimeout(()=>{feedback='';renderListening(theme,t)},350)}else{feedback='<div class="l7-no">Prüfe deine Antworten.</div>';renderListening(theme,t)}})
 }

 const renderers={
  'listen-participle':renderListenParticiple,
  'haben-table':renderHaben,
  'grammar-parts':renderGrammar,
  'sentence-order':renderSentenceOrder,
  'sentence-write':renderSentenceWrite,
  'dialog-choice':renderDialogs,
  'rewrite-text':renderRewrite,
  'reading-sets':renderReading,
  'listening-sets':renderListening
 };
 const style=document.createElement('style');style.id='sp-l7t2-advanced-style';style.textContent=`
 .sp-center{text-align:center}.sp-audio-big{min-width:190px;margin:12px auto 18px}.sp-audio-error{min-height:22px;color:#a33;font-weight:800}.sp-full{width:100%;margin-top:14px}.sp-sentence-frame,.sp-cue-frame,.sp-text-frame{border:2px solid var(--line);background:#fff;border-radius:16px;padding:18px;margin:12px 0 18px;font-size:clamp(18px,3vw,24px);line-height:1.55;text-align:left}.sp-cue-frame{font-weight:900}.sp-question{margin:18px 0 12px;text-align:center}.sp-haben-title{text-align:center;font-size:34px;font-weight:950;margin:8px 0 15px}.sp-haben-table{max-width:560px;margin:auto;display:grid;gap:8px}.sp-haben-row{display:grid;grid-template-columns:120px 1fr;gap:10px;align-items:center}.sp-haben-row strong{font-size:19px}.sp-haben-row input{padding:12px;border:2px solid var(--line);border-radius:12px;font-size:18px}.sp-haben-row.done input{background:#e9f8ee;border-color:#78b98c}.sp-order-answer{min-height:64px;border:2px solid var(--line);border-radius:14px;background:#fff;padding:16px;margin-bottom:14px;font-weight:900;font-size:18px}.sp-three-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}.sp-three-actions>*{width:100%!important;min-width:0!important;display:flex;justify-content:center;align-items:center}.sp-dialog{max-width:720px;margin:8px auto 20px;display:grid;gap:12px}.sp-bubble{max-width:78%;padding:14px 16px;border-radius:18px;font-size:18px;line-height:1.4}.sp-bubble.left{justify-self:start;background:#eef3fb;border-bottom-left-radius:5px}.sp-bubble.right{justify-self:end;background:var(--soft,#f4effb);border-bottom-right-radius:5px}.sp-question-list{display:grid;gap:14px;margin-top:18px;text-align:left}.sp-read-q{border:1px solid var(--line);border-radius:14px;padding:14px;background:#fff}.sp-read-q>strong{display:block;margin-bottom:10px}.sp-choice-row{display:flex;gap:8px;flex-wrap:wrap}.sp-choice-row button{border:2px solid var(--line);background:#fff;border-radius:12px;padding:9px 12px;font:inherit;font-weight:800;cursor:pointer}.sp-choice-row button.selected{background:var(--soft,#f4effb);border-color:var(--main,#8d73bd)}
 @media(max-width:600px){.sp-haben-row{grid-template-columns:78px 1fr}.sp-three-actions{gap:6px}.sp-three-actions>*{padding-left:6px!important;padding-right:6px!important}.sp-bubble{max-width:90%}}
 `;document.head.appendChild(style);
 window.L7.renderTaskPage=function(theme,id){const t=taskById(id),fn=t&&renderers[t.kind];if(fn){feedback='';return fn(Number(theme),t)}return raw(theme,id)};
 window.L7.__l7t2AdvancedV1=true;return true
}
window.L7T2AdvancedUI={install};
})();
