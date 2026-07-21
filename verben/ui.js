(function(){
'use strict';
const E=window.VerbGroupsEngine,app=document.querySelector('#app'),topbar=document.querySelector('#topbar');
let dashboard='/student-dashboard/index.html',logoutFn=()=>{},locked=false,currentQuestion=null,rec=null;
let cardRevealed=false,cardSolved=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>{const q=new URLSearchParams(location.search),group=Math.max(0,Math.min(E.GROUPS.length,Number(q.get('group'))||0)),task=q.get('task')||'',view=q.get('view')||'';return{group,task:E.TASKS.some(x=>x[0]===task)?task:'',view:view==='overview'?'overview':''}};
const href=(group=0,task='',view='')=>{const q=new URLSearchParams();if(group)q.set('group',group);if(task)q.set('task',task);if(view)q.set('view',view);return'/verben/'+(q.toString()?'?'+q.toString():'')};
const go=({group=0,task='',view=''})=>{history.pushState(null,'',href(group,task,view));render()};
function image(v,compact=false){return`<div class="verb-image ${compact?'compact':''}"><img src="${E.imageUrl(v)}" alt="Bild zu ${esc(v)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-fallback" hidden><strong>${esc(v)}</strong></div></div>`}
function speak(text,slow=false){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=slow?.55:.92;speechSynthesis.speak(u)}
function stopMic(){if(rec)try{rec.abort()}catch{}rec=null}
function header(r){const p=window.VerbGroupsProfile||{},name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(' ')||(E.isPreview()?'Lehrer-Vorschau':'Schüler');topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>Verben</h1><p>${E.VERBS.length} freigegeben · ${E.GROUPS.length} Gruppen</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboard)}">Dashboard</a><button class="btn secondary" data-action="logout">Abmelden</button></div></div><nav class="topnav"><a class="btn secondary" href="/index.html">← Startseite</a><button class="btn secondary ${r.view==='overview'?'active-nav':''}" data-action="overview">Übersicht</button>${r.group?`<button class="btn secondary" data-action="group" data-group="${r.group}">Aufgaben</button><button class="btn danger-btn" data-action="reset-group" data-group="${r.group}">Fortschritt löschen</button>`:''}</nav>`}
const previewNote=()=>E.isPreview()?'<div class="preview-note">Lehrer-Vorschau · nichts wird gespeichert</div>':'';
function scoreCard(groupId=0){
 if(E.isPreview())return'';
 if(!groupId)return`<section class="card score-card compact-score"><h2>${E.totalPoints()} Punkte</h2><span>gesamt</span></section>`;
 const gs=E.groupState(groupId),run=E.currentRun(groupId),taskSum=Object.values(run.awards.tasks||{}).reduce((s,n)=>s+(Number(n)||0),0);
 return`<section class="card score-card"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Runde ${gs.currentRun} von 3</h2><p>${taskSum} Aufgabenpunkte · ${Number(run.awards.examPoints)||0} Prüfungspunkte</p>${E.canRepeat(groupId)?`<button class="btn" data-action="next-run" data-group="${groupId}">Runde ${gs.currentRun+1} starten</button>`:''}</div><div class="score-total">${E.groupPoints(groupId)}<span>Punkte</span></div></section>`}
function taskCards(groupId){
 const run=E.currentRun(groupId);
 return E.TASKS.map((t,i)=>{const exam=t[0]==='exam',open=!exam||E.learnDone(groupId),p=exam?Number(run.exam.bestPercent)||0:E.taskPercent(groupId,t[0]);return`<button class="task-card ${p>=100?'done-card':''} ${!open?'locked-task':''}" data-action="task" data-group="${groupId}" data-task="${t[0]}" ${open?'':'disabled'}><span class="task-number">${i+1}</span><span class="task-icon">${open?t[1]:'🔒'}</span><span class="task-title">${t[2]}</span><div class="task-mini-progress"><span style="width:${p}%"></span></div><span class="task-status">${open?(p>=100?'Fertig':p?`${p}%`:'Starten'):'Gesperrt'}</span></button>`}).join('')
}
function groupPanels(selected=0){
 return E.GROUPS.map(g=>{const gs=E.groupState(g.id),run=E.currentRun(g.id),done=E.LEARN.filter(t=>E.taskDone(g.id,t)).length,exam=Number(run.exam.bestPercent)||0,open=selected===g.id;return`<details class="group-panel" data-group-panel="${g.id}" ${open?'open':''}><summary data-action="group" data-group="${g.id}"><span class="group-number">Gruppe ${g.id}</span><span>${g.verbs.length} Verben</span><span>Runde ${gs.currentRun}/3</span><span>${done}/${E.LEARN.length} · Prüfung ${exam}%</span></summary><div class="group-body"><div class="task-grid">${taskCards(g.id)}</div></div></details>`}).join('')
}
function renderHome(selected=0){
 if(!E.GROUPS.length){app.innerHTML=`${previewNote()}<section class="card empty-state"><h2>Noch keine Verben freigegeben</h2><p>Die Lehrkraft wählt die Verben im Lehrer-Dashboard aus.</p></section>`;return}
 app.innerHTML=`${previewNote()}${scoreCard(selected)}<section class="card"><div class="section-head"><h2>Gruppen</h2><span class="overview-total">${E.VERBS.length} Verben</span></div><div class="groups-accordion">${groupPanels(selected)}</div></section>`;
 if(selected)setTimeout(()=>document.querySelector(`[data-group-panel="${selected}"]`)?.scrollIntoView({behavior:'smooth',block:'start'}),80)
}
function renderOverview(){
 const cards=E.VERBS.map(v=>{const index=E.VERBS.indexOf(v),group=Math.floor(index/20)+1;return`<article class="overview-verb-card">${image(v,true)}<div class="overview-verb-text"><span class="group-badge">Gruppe ${group}</span><h3>${esc(v)}</h3><p>${esc(E.meaning(v))}</p><button class="audio-mini" data-action="audio" data-text="${esc(v)}">🔊</button></div></article>`}).join('');
 app.innerHTML=`${previewNote()}<section class="card"><div class="section-head"><h2>Übersicht</h2><span class="overview-total">${E.VERBS.length} Verben</span></div><div class="overview-grid">${cards}</div></section>`
}
function taskProgressHtml(groupId,task){const st=E.taskState(groupId,task),p=E.taskPercent(groupId,task);return`<div class="task-progress-row"><span>${st.done.length} richtig · ${st.total-st.done.length} übrig</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div>`}
function feedback(text,ok=false){const el=document.querySelector('#feedback');if(el){el.className='feedback '+(ok?'ok':'no');el.innerHTML=text}}
function questionBody(q){
 const media=q.image?image(q.image):q.audio?`<div class="listen-box"><button class="btn" data-action="audio" data-text="${esc(q.audio)}">🔊 Hören</button><button class="btn secondary" data-action="audio-slow" data-text="${esc(q.audio)}">Langsam</button></div>`:'';
 let answer='';
 if(q.kind==='mc')answer=`<div class="option-grid">${q.options.map(o=>`<button class="option" data-action="answer" data-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
 if(q.kind==='images')answer=`<div class="image-choice-grid">${q.options.map(o=>`<button class="image-option" data-action="answer" data-answer="${esc(o)}">${image(o,true)}</button>`).join('')}</div>`;
 if(q.kind==='input')answer=`<div class="answer-form"><div class="answer-row"><input id="answerInput" autocomplete="off" placeholder="${esc(q.placeholder||'Antwort schreiben')}"><button class="btn" data-action="check-input">Kontrollieren</button></div></div>`;
 if(q.kind==='speech')answer=`<div class="speech-box"><div class="actions"><button class="btn" data-action="mic">🎤 Sprechen</button><button class="btn secondary" data-action="write-fallback">✍️ Schreiben</button></div><div id="micStatus" class="small"></div><div id="writeFallback" class="answer-form hidden"><div class="answer-row"><input id="answerInput" autocomplete="off" placeholder="Verbform schreiben"><button class="btn" data-action="check-input">Kontrollieren</button></div></div></div>`;
 return`${media}<div class="question">${esc(q.prompt)}</div>${answer}<div id="feedback"></div>`
}
function renderCards(groupId){
 const task='cards',v=E.nextVerb(groupId,task);if(!v)return finishTask(groupId,task);
 currentQuestion={kind:'card',answer:v};cardRevealed=false;cardSolved=false;
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Karteikarten</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Aufgaben</button></div>${taskProgressHtml(groupId,task)}<div class="flip-wrap"><div id="verbFlipCard" class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-face flip-front">${image(v)}</div><div class="flip-face flip-back"><div class="flip-word">${esc(v)}</div><div class="flip-note">Lösung</div><button type="button" class="btn secondary card-listen-btn" id="cardListenBtn">🔊 Anhören</button></div></div></div><div class="hint card-translation">Übersetzung: <b>${esc(E.meaning(v))}</b></div><div class="actions card-actions"><button id="cardMicBtn" type="button" class="btn">Sprechen</button><button id="cardWriteBtn" type="button" class="btn secondary">Schreiben</button></div><div id="cardMicStatus" class="small card-mic-status"></div><div id="cardAnswerBox" class="card-answer-box" hidden><div class="answer-row"><input id="cardAnswerInput" autocomplete="off" placeholder="Verb schreiben"><button id="cardCheckBtn" type="button" class="btn">Kontrollieren</button></div></div><div id="cardFeedback"></div><div id="cardAfter" class="actions card-actions"></div></section>`;
 const card=document.querySelector('#verbFlipCard');
 card.addEventListener('click',()=>revealCard(groupId));
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();revealCard(groupId)}});
 document.querySelector('#cardListenBtn').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();speak(v)});
 document.querySelector('#cardMicBtn').addEventListener('click',()=>startCardMic(groupId));
 document.querySelector('#cardWriteBtn').addEventListener('click',openCardWrite);
 document.querySelector('#cardCheckBtn').addEventListener('click',()=>checkCardAnswer(groupId,document.querySelector('#cardAnswerInput').value));
 document.querySelector('#cardAnswerInput').addEventListener('keydown',e=>{if(e.key==='Enter')checkCardAnswer(groupId,e.target.value)});
}
function openCardWrite(message=''){
 const box=document.querySelector('#cardAnswerBox'),input=document.querySelector('#cardAnswerInput'),status=document.querySelector('#cardMicStatus');
 if(box)box.hidden=false;if(status&&message)status.textContent=message;setTimeout(()=>input?.focus(),30)
}
function revealCard(groupId){
 if(cardSolved)return;
 document.querySelector('#verbFlipCard')?.classList.add('flipped');
 if(!cardRevealed){cardRevealed=true;E.markWrong(groupId,'cards');const after=document.querySelector('#cardAfter');if(after){after.innerHTML='<button type="button" class="btn" id="cardHelpNext">Weiter</button>';document.querySelector('#cardHelpNext').addEventListener('click',()=>{E.markRight(groupId,'cards');renderCards(groupId)})}}
}
function startCardMic(groupId){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition,status=document.querySelector('#cardMicStatus'),btn=document.querySelector('#cardMicBtn');
 if(!SR){openCardWrite('Mikrofon wird hier nicht unterstützt. Bitte schreiben.');return}
 try{stopMic();rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.continuous=false;if(status)status.textContent='Ich höre zu …';btn?.classList.add('active');rec.onresult=e=>{const value=e.results?.[0]?.[0]?.transcript||'';if(!value){openCardWrite('Nichts erkannt. Bitte schreiben.');return}openCardWrite();const input=document.querySelector('#cardAnswerInput');if(input)input.value=value;checkCardAnswer(groupId,value)};rec.onerror=()=>openCardWrite('Mikrofon hat nicht funktioniert. Bitte schreiben.');rec.onnomatch=()=>openCardWrite('Nichts erkannt. Bitte schreiben.');rec.onend=()=>{btn?.classList.remove('active');rec=null};rec.start()}catch{openCardWrite('Mikrofon konnte nicht gestartet werden. Bitte schreiben.')}
}
function checkCardAnswer(groupId,value){
 if(cardSolved||!currentQuestion)return;
 const feedbackBox=document.querySelector('#cardFeedback'),after=document.querySelector('#cardAfter');
 if(E.isCorrect(value,currentQuestion)){
  cardSolved=true;document.querySelector('#verbFlipCard')?.classList.add('flipped');
  if(feedbackBox){feedbackBox.className='feedback ok';feedbackBox.textContent='Richtig!'}
  E.markRight(groupId,'cards');
  if(after){after.innerHTML='<button type="button" class="btn" id="cardNextBtn">Weiter</button>';document.querySelector('#cardNextBtn').addEventListener('click',()=>renderCards(groupId))}
  return
 }
 const tries=E.markWrong(groupId,'cards');
 if(feedbackBox){feedbackBox.className='feedback no';feedbackBox.innerHTML=tries>=3?`Lösung: <strong>${esc(currentQuestion.answer)}</strong>`:'Noch nicht richtig.'}
}
function renderTask(groupId,task){
 if(task==='exam')return renderExam(groupId);
 if(E.taskDone(groupId,task))return finishTask(groupId,task);
 if(task==='cards')return renderCards(groupId);
 const v=E.nextVerb(groupId,task);if(!v)return finishTask(groupId,task);currentQuestion=E.question(groupId,task,v);
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>${esc(E.TASK_TITLE[task])}</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Aufgaben</button></div>${taskProgressHtml(groupId,task)}<div class="question-card">${questionBody(currentQuestion)}</div></section>`;setTimeout(()=>document.querySelector('#answerInput')?.focus(),60)
}
function finishTask(groupId,task){const gs=E.groupState(groupId),points=Number(E.currentRun(groupId).awards.tasks[task])||0,next=E.LEARN[E.LEARN.indexOf(task)+1]||'exam';app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>Fertig</h2><p>${points} Punkte · Runde ${gs.currentRun}</p><div class="actions"><button class="btn" data-action="task" data-group="${groupId}" data-task="${next}">Weiter</button><button class="btn secondary" data-action="group" data-group="${groupId}">Aufgaben</button></div></div></section>`}
function checkTaskAnswer(value){const r=route(),q=currentQuestion;if(!r.group||!r.task||!q)return;if(E.isCorrect(value,q)){feedback('Richtig.',true);E.markRight(r.group,r.task);setTimeout(()=>renderTask(r.group,r.task),500);return}const tries=E.markWrong(r.group,r.task);feedback(tries>=3?`Lösung: <strong>${esc(q.writeAnswer||q.answer)}</strong>`:'Noch nicht richtig.')}
function openWriteFallback(message='Bitte schreibe die Antwort.'){const box=document.querySelector('#writeFallback'),status=document.querySelector('#micStatus');if(box)box.classList.remove('hidden');if(status)status.textContent=message;setTimeout(()=>document.querySelector('#answerInput')?.focus(),30)}
function startMic(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){openWriteFallback();return}try{stopMic();rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.continuous=false;const status=document.querySelector('#micStatus');if(status)status.textContent='Ich höre zu …';rec.onresult=e=>{const text=e.results?.[0]?.[0]?.transcript||'';if(!text){openWriteFallback();return}checkTaskAnswer(text)};rec.onerror=()=>openWriteFallback();rec.onnomatch=()=>openWriteFallback();rec.onend=()=>{rec=null};rec.start()}catch{openWriteFallback()}}
function renderExam(groupId){
 if(!E.learnDone(groupId)){app.innerHTML=`<section class="card locked-card"><h2>Prüfung gesperrt</h2><button class="btn" data-action="group" data-group="${groupId}">Aufgaben</button></section>`;return}
 const run=E.currentRun(groupId),ex=run.exam;
 if(!ex.session){app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">★</div><h2>Gruppenprüfung</h2><p>Bester Stand: ${ex.bestPercent||0}%</p><button class="btn" data-action="start-exam" data-group="${groupId}">Starten</button><button class="btn secondary" data-action="group" data-group="${groupId}">Aufgaben</button></div></section>`;return}
 if(ex.session.index>=ex.session.items.length)return finishExam(groupId);
 const item=ex.session.items[ex.session.index];currentQuestion=E.question(groupId,item.task,item.v,item.person);const p=Math.round(ex.session.index/ex.session.items.length*100);
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Gruppenprüfung</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Abbrechen</button></div><div class="task-progress-row"><span>${ex.session.index+1}/${ex.session.items.length}</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div><div class="question-card">${questionBody(currentQuestion)}</div></section>`
}
function startExam(groupId){E.currentRun(groupId).exam.session={items:E.examItems(groupId),index:0,correct:0};E.save();renderExam(groupId)}
function checkExamAnswer(value){const r=route(),ex=E.currentRun(r.group).exam,q=currentQuestion;if(!ex.session||!q)return;const good=E.isCorrect(value,q);if(good)ex.session.correct++;feedback(good?'Richtig.':`Lösung: <strong>${esc(q.writeAnswer||q.answer)}</strong>`,good);ex.session.index++;E.save();setTimeout(()=>renderExam(r.group),600)}
function finishExam(groupId){const run=E.currentRun(groupId),session=run.exam.session,total=session?.items?.length||1,correct=session?.correct||0,percent=Math.round(correct/total*100),stars=percent>=100?3:percent>=70?2:percent>=50?1:0;run.exam.session=null;E.awardExam(groupId,percent);app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>${percent}%</h2><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p>${correct}/${total} richtig</p><div class="actions"><button class="btn" data-action="start-exam" data-group="${groupId}">Noch einmal</button><button class="btn secondary" data-action="group" data-group="${groupId}">Aufgaben</button>${E.canRepeat(groupId)?`<button class="btn" data-action="next-run" data-group="${groupId}">Runde ${E.groupState(groupId).currentRun+1}</button>`:''}</div></div></section>`}
function answerFromInput(){const value=document.querySelector('#answerInput')?.value||'',r=route();r.task==='exam'?checkExamAnswer(value):checkTaskAnswer(value)}
function render(){stopMic();const r=route();header(r);if(locked){app.innerHTML='<section class="card locked-card"><h2>Verben sind gesperrt</h2><a class="btn" href="/index.html">Zur Startseite</a></section>';return}if(r.view==='overview')return renderOverview();if(r.group&&r.task)return renderTask(r.group,r.task);renderHome(r.group)}
function install(options={}){dashboard=options.dashboard||dashboard;logoutFn=options.logout||logoutFn;locked=!!options.locked;E.load();render()}
document.addEventListener('click',ev=>{const b=ev.target.closest('[data-action]');if(!b)return;const a=b.dataset.action,g=Number(b.dataset.group)||0,t=b.dataset.task||'';if(a==='logout')return logoutFn();if(a==='overview')return go({view:'overview'});if(a==='group')return go({group:g});if(a==='task')return go({group:g,task:t});if(a==='reset-group'){if(E.isPreview())return;if(confirm(`Fortschritt von Gruppe ${g} löschen? Punkte bleiben erhalten.`)){E.resetGroup(g);render()}return}if(a==='next-run'){const next=E.groupState(g).currentRun+1;if(confirm(`Runde ${next} starten?`)&&E.startNextRun(g))go({group:g});return}if(a==='audio')return speak(b.dataset.text||'');if(a==='audio-slow')return speak(b.dataset.text||'',true);if(a==='answer'){const r=route();return r.task==='exam'?checkExamAnswer(b.dataset.answer||''):checkTaskAnswer(b.dataset.answer||'')}if(a==='check-input')return answerFromInput();if(a==='mic')return startMic();if(a==='write-fallback')return openWriteFallback();if(a==='start-exam'){go({group:g,task:'exam'});return startExam(g)}});
document.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&ev.target?.id==='answerInput'){ev.preventDefault();answerFromInput()}});
window.addEventListener('popstate',render);
window.VerbGroupsUI={install,render};
})();