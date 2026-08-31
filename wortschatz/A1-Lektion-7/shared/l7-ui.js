(function(){
'use strict';
const S=window.L7S,T=S.T;
let R={},order=[];
const VERSION='l7-progress4';
const href=t=>`task.html?task=${encodeURIComponent(t.id)}&v=${VERSION}`;
const note=()=>S.preview()?'<div class="l7-preview">Lehrer-Vorschau: Es werden keine Teilnehmerpunkte und keine Teilnehmerfortschritte gespeichert.</div>':'';
const accepted=i=>[i.answer,i.word,...(i.answers||[])].filter(Boolean);
const generic=i=>{const a=String(i.answer||i.word||'');return i.kind==='order'?'Achte auf Verbposition und Satzende.':a?`Die Lösung beginnt mit „${a[0]}“.`:'Lies die Aufgabe noch einmal.'};
const help=(i,n)=>n===1?'<div class="l7-no">Noch nicht richtig. Versuche es noch einmal.</div>':n===2?`<div class="l7-hint"><strong>Hinweis:</strong> ${S.esc(i.hint||generic(i))}</div>`:n>=3?`<div class="l7-no"><strong>Lösung:</strong> ${S.esc(i.answer||i.word)}<br>Gib die richtige Antwort selbst ein. Die Aufgabe kommt später erneut.</div>`:'';
const context=i=>i.context?`<div class="l7-context">${S.esc(i.context)}</div>`:'';
const audio=i=>i.audio?`<div class="l7-audio"><button class="l7-btn secondary" data-audio="${S.esc(i.audio)}">🔊 Anhören</button><span>Du kannst den Text mehrmals hören.</span></div>`:'';
const input=(label='Schreibe die Antwort.',value='')=>`<div class="l7-answer-box"><label for="answerInput">${S.esc(label)}</label><div><input id="answerInput" autocomplete="off" value="${S.esc(value)}"><button class="l7-btn" data-action="check">Prüfen</button></div></div>`;
function draftKey(index){return`text:${index}`}
function orderKey(index){return`order:${index}`}
function getDraft(st,index){return String(st.answers?.[draftKey(index)]??'')}
function getOrder(st,index){return Array.isArray(st.answers?.[orderKey(index)])?[...st.answers[orderKey(index)]]:[]}
function saveAnswerValue(key,value){
 const{theme,t}=R,st=S.load(theme,t.id,t.items.length);
 st.answers=st.answers||{};
 if(value===''||value==null||(Array.isArray(value)&&!value.length))delete st.answers[key];else st.answers[key]=value;
 S.save(theme,t.id,st,false)
}
function clearDrafts(index){saveAnswerValue(draftKey(index),'');saveAnswerValue(orderKey(index),[])}
function progress(theme,t){
 const x=S.load(theme,t.id,t.items.length),p=S.pct(theme,t.id,t.items.length);
 return`<div class="l7-progress-row"><span>${x.done.length} fehlerfrei · ${t.items.length-x.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`
}
function theme(theme){
 theme=Number(theme);
 const root=document.getElementById('app'),tasks=T.tasks,avg=Math.round(tasks.reduce((a,t)=>a+S.pct(theme,t.id,t.items.length),0)/tasks.length);
 root.innerHTML=`<div class="l7-page">${S.header(theme,T.title,true)}${note()}<section class="l7-card l7-hero"><div class="l7-circle">${avg}%</div><div><p class="eyebrow">${S.esc(T.subtitle)}</p><h2>${S.esc(T.title)}</h2><p>${S.esc(T.goal)}</p><div class="l7-progress"><span style="width:${avg}%"></span></div><p class="small">${tasks.filter(t=>S.pct(theme,t.id,t.items.length)>=100).length} von ${tasks.length} Aufgaben abgeschlossen</p></div></section><section class="l7-card"><div class="l7-section-head"><div><p class="eyebrow">Vom Erkennen zur Anwendung</p><h2>Aufgaben</h2></div><span>${tasks.length} Aufgaben</span></div><div class="l7-grid">${tasks.map((t,i)=>{const p=S.pct(theme,t.id,t.items.length),lock=t.exam&&!S.allDone(theme);return`<a id="task-${t.id}" class="l7-module ${lock?'locked':''} ${p>=100?'done':''}" href="${lock?'#':href(t)}" ${lock?'onclick="return false" aria-disabled="true"':''}><div class="l7-module-top"><span>${i+1}</span><b>${p>=100?'✓':lock?'🔒':''}</b></div><div class="l7-icon">${t.icon}</div><h3>${S.esc(t.title)}</h3><p>${S.esc(t.description)}</p><div class="l7-progress"><span style="width:${p}%"></span></div><div class="l7-module-bottom"><span>${lock?'Erst alle Lernaufgaben abschließen':p+'%'}</span><strong>${p>=100?'Fertig':'Starten'}</strong></div></a>`}).join('')}</div></section><footer>© SprachPilot</footer></div>`;
 document.getElementById('resetTheme')?.addEventListener('click',()=>S.reset(theme));
 if(location.hash)setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'center'}),80)
}
function task(theme,id){
 theme=Number(theme);
 const t=S.task(id),root=document.getElementById('app');
 R={theme,t,index:null};
 if(!t){root.innerHTML='<section class="l7-card"><h2>Aufgabe nicht gefunden</h2></section>';return}
 if(t.exam&&!S.allDone(theme)){root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card l7-finish"><div>🔒</div><h2>Prüfung gesperrt</h2><p>Schließe zuerst alle anderen Aufgaben mit 100% ab.</p><a class="l7-btn" href="index.html#task-${t.id}">Zur Übersicht</a></section></div>`;return}
 const st=S.load(theme,t.id,t.items.length);
 if(st.done.length>=t.items.length)return finish();
 R.index=S.index(theme,t.id,t.items.length);
 root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}${note()}<section class="l7-card">${progress(theme,t)}<div class="l7-instruction">${S.esc(t.description)}</div><div id="taskArea"></div></section><footer>© SprachPilot</footer></div>`;
 render()
}
function render(){
 const{theme,t,index}=R,i=t.items[index],st=S.load(theme,t.id,t.items.length),area=document.getElementById('taskArea');
 order=getOrder(st,index);
 let kind=t.kind||i.kind||'choice',body='';
 const draft=getDraft(st,index);
 if(kind==='cards')body=card(i,draft);
 else if(kind==='choice')body=`<div class="l7-options">${S.shuffle(i.options||[]).map(o=>`<button data-answer="${S.esc(o)}">${S.esc(o)}</button>`).join('')}</div>`;
 else if(kind==='input')body=input('Schreibe die vollständige Antwort.',draft);
 else if(kind==='order')body=`<div id="orderAnswer" class="l7-order-answer">${order.length?order.map(S.esc).join(' '):'Klicke die Wörter in der richtigen Reihenfolge an.'}</div><div class="l7-tokens">${renderTokens(i.tokens||[],order)}</div><div class="l7-actions"><button class="l7-btn" data-action="check-order">Prüfen</button><button class="l7-btn secondary" data-action="undo">Zurück</button><button class="l7-btn ghost" data-action="reset-order">Neu</button></div>`;
 else if(kind==='free')body=`<div class="l7-free"><label for="freeAnswer">Deine Antwort</label><textarea id="freeAnswer" rows="7" placeholder="${S.esc(i.example||'Schreibe vollständige Sätze.')}">${S.esc(st.answers?.[index]||'')}</textarea><p>Mindestens ${i.minWords||5} Wörter.</p><button class="l7-btn" data-action="save-free">Speichern und weiter</button></div>`;
 else if(kind==='speak')body=`<div class="l7-speech"><p>Sprich die Antwort oder schreibe sie.</p><div class="l7-actions"><button class="l7-btn" data-action="mic">🎤 Sprechen</button><button class="l7-btn secondary" data-action="write">✍️ Schreiben</button></div>${input('Schreibe die vollständige Antwort.',draft)}</div>`;
 area.innerHTML=`<div class="l7-question-card">${context(i)}${i.image?S.image(i.image,i.prompt||i.word):''}${audio(i)}<p class="eyebrow">Aufgabe ${st.done.length+1}</p><h2>${S.esc(i.prompt||i.meaning||'Was ist das auf Deutsch?')}</h2>${body}<div id="feedback">${help(i,st.tries||0)}</div><div id="technical"></div></div>`;
 document.getElementById('answerInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')check(e.target.value)});
 document.getElementById('answerInput')?.addEventListener('input',e=>saveAnswerValue(draftKey(index),e.target.value));
 document.getElementById('freeAnswer')?.addEventListener('input',e=>saveAnswerValue(String(index),e.target.value));
 bind()
}
function renderTokens(tokens,usedOrder){
 const used={};usedOrder.forEach(x=>used[x]=(used[x]||0)+1);
 return S.shuffle(tokens).map((x,n)=>{const disabled=used[x]>0;if(disabled)used[x]--;return`<button data-token="${S.esc(x)}" data-n="${n}" ${disabled?'disabled':''}>${S.esc(x)}</button>`}).join('')
}
function card(i,draft){
 const pl=i.plural?`<div><span>Plural</span><strong>${S.esc(i.plural)}</strong></div>`:'';
 return`<div class="l7-learning">${i.image?S.image(i.image,i.word):''}<div class="l7-meaning">${S.esc(i.meaning)}</div><div class="l7-actions"><button class="l7-btn secondary" data-audio="${S.esc(i.audio||i.word)}">🔊 Anhören</button><button class="l7-btn" data-action="mic">🎤 Sprechen</button><button class="l7-btn secondary" data-action="write">✍️ Schreiben</button><button class="l7-btn ghost" data-action="reveal">Lösung zeigen</button></div>${input('Deutsches Wort oder Form',draft)}<div id="cardBack" class="l7-card-back" hidden><div class="word">${S.esc(i.word)}</div><div class="details"><div><span>Bedeutung</span><strong>${S.esc(i.meaning)}</strong></div>${pl}<div><span>Beispiel</span><strong>${S.esc(i.example||'')}</strong></div></div></div></div>`
}
function bind(){
 const a=document.getElementById('taskArea');
 a.onclick=e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.answer!==undefined)return check(b.dataset.answer);
  if(b.dataset.token!==undefined)return token(b);
  if(b.dataset.audio!==undefined)return S.say(b.dataset.audio,()=>tech('Die Audiofunktion ist nicht verfügbar. Lies den Text.'));
  const x=b.dataset.action;
  if(x==='check')return check(document.getElementById('answerInput')?.value);
  if(x==='mic')return mic();
  if(x==='write')return document.getElementById('answerInput')?.focus();
  if(x==='reveal')return reveal();
  if(x==='check-order')return check(order.join(' '));
  if(x==='undo')return undo();
  if(x==='reset-order')return resetOrder();
  if(x==='save-free')return saveFree()
 }
}
function check(v){
 const{theme,t,index}=R,i=t.items[index];
 if(!String(v||'').trim())return;
 const kind=t.kind||i.kind||'choice',compact=value=>S.norm(value).replace(/\s+/g,'');
 if(kind==='input'||kind==='speak'||kind==='cards')saveAnswerValue(draftKey(index),String(v));
 if(kind==='order')saveAnswerValue(orderKey(index),order);
 const ok=kind==='speak'&&i.open?String(v).trim().split(/\s+/).length>=4:accepted(i).some(a=>S.norm(a)===S.norm(v)||(kind==='order'&&compact(a)===compact(v)));
 S.attempt(theme,t.id,t.items.length,index,ok);
 if(ok)return correct();
 const tries=Number(S.wrong(theme,t.id,t.items.length))||1;
 const feedback=document.getElementById('feedback');if(feedback)feedback.innerHTML=help(i,tries);
 document.getElementById('answerInput')?.focus();
}
function correct(){
 const{theme,t,index}=R,st=S.load(theme,t.id,t.items.length),repeat=st.hadWrong||st.tries>0;
 clearDrafts(index);
 S.right(theme,t.id,t.items.length);
 document.querySelectorAll('#taskArea button,#taskArea input,#taskArea textarea').forEach(x=>x.disabled=true);
 document.getElementById('feedback').innerHTML=`<div class="l7-ok">Richtig.${repeat?' Die Aufgabe kommt am Ende noch einmal.':''}</div>`;
 setTimeout(()=>task(theme,t.id),550)
}
function reveal(){
 const{theme,t,index}=R,i=t.items[index];
 S.attempt(theme,t.id,t.items.length,index,false);
 const st=S.load(theme,t.id,t.items.length);st.tries=Math.max(3,st.tries||0);st.hadWrong=true;S.save(theme,t.id,st);
 document.getElementById('cardBack').hidden=false;
 document.getElementById('feedback').innerHTML=help(i,3);
 document.getElementById('answerInput')?.focus()
}
function saveFree(){
 const{theme,t,index}=R,i=t.items[index],f=document.getElementById('freeAnswer'),v=String(f?.value||'').trim(),n=v.split(/\s+/).filter(Boolean).length;
 saveAnswerValue(String(index),v);
 if(n<(i.minWords||5)){document.getElementById('feedback').innerHTML=`<div class="l7-hint">Schreibe mindestens ${i.minWords||5} Wörter und vollständige Sätze.</div>`;f?.focus();return}
 S.attempt(theme,t.id,t.items.length,index,true);S.right(theme,t.id,t.items.length,true);
 document.getElementById('feedback').innerHTML='<div class="l7-ok">Gespeichert.</div>';
 setTimeout(()=>task(theme,t.id),450)
}
function tech(x){const e=document.getElementById('technical');if(e)e.innerHTML=`<div class="l7-hint">${S.esc(x)}</div>`}
function mic(){const i=R.t.items[R.index];S.mic(i,a=>{const exact=a.find(v=>accepted(i).some(x=>S.norm(x)===S.norm(v)));check(exact||a[0]||'')},tech)}
function token(b){if(b.disabled)return;order.push(b.dataset.token);b.disabled=true;saveAnswerValue(orderKey(R.index),order);drawOrder()}
function drawOrder(){document.getElementById('orderAnswer').innerHTML=order.length?order.map(S.esc).join(' '):'Klicke die Wörter in der richtigen Reihenfolge an.'}
function undo(){
 if(!order.length)return;order.pop();saveAnswerValue(orderKey(R.index),order);
 const used={};order.forEach(x=>used[x]=(used[x]||0)+1);
 document.querySelectorAll('[data-token]').forEach(b=>{const x=b.dataset.token;if(used[x]){b.disabled=true;used[x]--}else b.disabled=false});drawOrder()
}
function resetOrder(){order=[];saveAnswerValue(orderKey(R.index),order);document.querySelectorAll('[data-token]').forEach(b=>b.disabled=false);drawOrder()}
function finish(){
 const{theme,t}=R,root=document.getElementById('app'),tasks=T.tasks,next=tasks[tasks.findIndex(x=>x.id===t.id)+1],st=S.load(theme,t.id,t.items.length),p=Math.round((st.firstCorrect||0)/t.items.length*100),stars=p>=100?3:p>=70?2:p>=50?1:0;
 root.innerHTML=`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card l7-finish"><div>✓</div><h2>${t.exam?'Prüfung':'Aufgabe'} abgeschlossen</h2><p>Du hast alle Fragen richtig gelöst.</p>${t.exam?`<p>Beim ersten Versuch: <strong>${p}%</strong></p><div class="l7-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>`:''}<div class="l7-actions">${next?`<a class="l7-btn" href="${href(next)}">Weiter →</a>`:''}<a class="l7-btn secondary" href="index.html#task-${t.id}">Zur Übersicht</a></div></section></div>`
}
window.L7={renderTheme:theme,renderTaskPage:task};
})();