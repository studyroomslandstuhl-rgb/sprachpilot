import {requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout} from '/js/auth.js?v=login-main-4';
import {loadCourseRelease,moduleOpen} from '/js/course-releases.js?v=irregular-verbs-1';

const NAME='Irreguläre Verben';
const DAYS=window.IRREGULAR_VERB_DAYS||[];
const ALL=DAYS.flatMap(day=>day.verbs||[]);
const APP=document.querySelector('#app');
const HEADER=document.querySelector('#topbar');
const BUNNY='https://sprachpilot.b-cdn.net/';
const SPECIAL=new Set(['haben','sein','werden','wissen']);
const PERSONS=[
  {key:'ich',label:'ich'},
  {key:'du',label:'du'},
  {key:'er',label:'er/sie/es'},
  {key:'wir',label:'wir'},
  {key:'ihr',label:'ihr'},
  {key:'sie',label:'sie/Sie'}
];
const TASKS=[
  ['cards','Aa','Karteikarten','Lerne die drei neuen Verben, ihre Bedeutung und ihre Formen.'],
  ['meaning-to-verb','B→V','Bedeutung → Verb','Lies die Bedeutung und finde das passende Verb.'],
  ['verb-to-meaning','V→B','Verb → Bedeutung','Wähle die richtige Bedeutung.'],
  ['listen','🔊','Hören → Verb','Höre das Verb und wähle es aus.'],
  ['image-to-verb','▣','Bild → Verb','Erkenne das Verb auf dem Bild.'],
  ['verb-to-image','V→▣','Verb → Bild','Wähle das passende Bild.'],
  ['read-sentence','📖','Lesen → Verb','Lies einen Satz und erkenne den Infinitiv.'],
  ['change','e→i','Vokalwechsel','Ordne das Verb der richtigen Gruppe zu.'],
  ['choose-form','du','Form auswählen','Wähle verschiedene Präsensformen.'],
  ['write-form','✎','Form schreiben','Schreibe verschiedene Präsensformen.'],
  ['speak','🎙','Form sprechen','Sprich die verlangte Form oder schreibe sie.'],
  ['sentence','…','Satz ergänzen','Setze die richtige Verbform in einen Satz ein.'],
  ['exam','★','Tagesprüfung','Prüfe Bedeutung und Konjugation aller bisher gelernten Verben.']
];
const TASK_IDS=TASKS.map(task=>task[0]);
const CHANGES=['a → ä','e → i','e → ie','Sonderform'];
let STATE;
let RUN=null;
let RECOGNITION=null;

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const norm=value=>String(value??'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[.,!?;:"'`´]/g,'').replace(/\s+/g,' ');
const shuffle=list=>{list=[...(list||[])];for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list};
const uniq=list=>{const seen=new Set();return (list||[]).filter(item=>{const key=norm(typeof item==='string'?item:item?.v);if(!key||seen.has(key))return false;seen.add(key);return true})};
const role=()=>String(getActiveRole()||'').toLowerCase();
const profile=()=>getActiveProfile()||{};
const taskMeta=id=>TASKS.find(task=>task[0]===id);
const dayData=number=>DAYS.find(day=>day.day===+number)||DAYS[0];
const newVerbs=number=>dayData(number)?.verbs||[];
const learnedVerbs=number=>DAYS.filter(day=>day.day<=+number).flatMap(day=>day.verbs||[]);
const record=(day,task)=>STATE.completed?.[String(day)]?.[task];
const countDay=day=>TASK_IDS.filter(task=>record(day,task)?.done).length;
const dayComplete=day=>countDay(day)===TASK_IDS.length;
const percent=(value,total)=>total?Math.round(value/total*100):0;

function teacherPreview(){
  if(role()==='teacher')return true;
  try{return JSON.parse(sessionStorage.getItem('SP_TEACHER_PREVIEW')||'null')?.teacherPreview===true}catch(error){return false}
}
function storageKey(){
  const p=profile();
  const id=[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_')||'student';
  return 'SP_IRREGULAR_VERBS_PROGRESS_'+id.toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_');
}
function loadState(){
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey())||'null');
    if(saved)return {version:2,selectedDay:1,completed:{},...saved};
  }catch(error){}
  return {version:2,selectedDay:1,completed:{}};
}
function saveState(){
  if(teacherPreview())return;
  try{localStorage.setItem(storageKey(),JSON.stringify(STATE))}catch(error){}
}
function markDone(day,task,perfect,score=100){
  if(teacherPreview())return;
  const key=String(day);
  STATE.completed[key]??={};
  const old=STATE.completed[key][task]||{};
  STATE.completed[key][task]={done:true,perfect:!!(old.perfect||perfect),bestScore:Math.max(old.bestScore||0,score)};
  saveState();
}
function dayUnlocked(day){
  if(teacherPreview()||day===1)return true;
  return dayComplete(day-1);
}
function highestUnlocked(){
  let highest=1;
  for(const day of DAYS){if(dayUnlocked(day.day))highest=day.day;else break}
  return highest;
}
function stopRecognition(){
  if(RECOGNITION)try{RECOGNITION.abort()}catch(error){}
  RECOGNITION=null;
}
function setUrl(task,push=false){
  const url=new URL(location.href);
  url.searchParams.set('day',STATE.selectedDay);
  task?url.searchParams.set('task',task):url.searchParams.delete('task');
  history[push?'pushState':'replaceState']({},'',url);
}
function imageName(verb){return String(verb||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'.webp'}
function imageUrl(verb){return BUNNY+encodeURIComponent(imageName(verb))}
function fullSentence(verb){return `${verb.sentence.subject} ${verb.forms[verb.sentence.person]} ${verb.sentence.rest}`}
function optionList(answer,pool,size=4){
  const alternatives=uniq(shuffle(pool)).filter(value=>norm(value)!==norm(answer));
  return shuffle([answer,...alternatives.slice(0,size-1)]);
}
function personFor(index,day,offset=0){return PERSONS[(index+day+offset)%PERSONS.length]}
function groupKey(verb){
  if(SPECIAL.has(verb.v))return 'special';
  if(verb.change==='e → i')return 'ei';
  if(verb.change==='e → ie')return 'eie';
  return 'a';
}
function changeGroupLabel(verb){
  const key=groupKey(verb);
  if(key==='ei')return 'e → i';
  if(key==='eie')return 'e → ie';
  if(key==='special')return 'Sonderform';
  return 'a → ä';
}
function groupDefinition(){
  return [
    {key:'a',title:'a → ä',note:'Hier stehen auch laufen und saufen mit au → äu.'},
    {key:'ei',title:'e → i',note:'Der Stammvokal ändert sich bei du und er/sie/es.'},
    {key:'eie',title:'e → ie',note:'Der Stammvokal wird bei du und er/sie/es zu ie.'},
    {key:'special',title:'Speziell',note:'haben, sein, werden und wissen haben besondere Formen.'}
  ];
}
function imageBlock(verb,compact=false,neutralFallback=false){
  const fallbackTitle=neutralFallback?'Bild nicht verfügbar':verb.v;
  const alt=neutralFallback?'Illustration zur Aufgabe':`Bild zu ${verb.v}`;
  return `<div class="verb-image ${compact?'compact':''}" data-image-box><img src="${esc(imageUrl(verb.v))}" alt="${esc(alt)}" data-verb-image><div class="image-fallback" hidden><strong>${esc(fallbackTitle)}</strong><span>${esc(verb.meaning)}</span></div></div>`;
}
function bindImageFallbacks(){
  APP.querySelectorAll('[data-verb-image]').forEach(image=>{
    image.addEventListener('error',()=>{
      image.hidden=true;
      const fallback=image.parentElement?.querySelector('.image-fallback');
      if(fallback)fallback.hidden=false;
    },{once:true});
  });
}
function header(){
  const p=profile();
  const name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(' ')||(role()==='teacher'?'Lehrer-Vorschau':'Schüler');
  HEADER.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot Logo"><div><h1>${NAME}</h1><p>${ALL.length} Verben im Präsens · ${DAYS.length} aufeinander aufbauende Tage</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a><button class="btn secondary" id="logoutButton">Abmelden</button></div></div><nav class="topnav"><a class="btn secondary" href="/index.html">← Startseite</a><button class="btn secondary" id="overviewButton">Tagesübersicht</button></nav>`;
  HEADER.querySelector('#logoutButton').onclick=logout;
  HEADER.querySelector('#overviewButton').onclick=()=>home(true);
}
const previewNote=()=>teacherPreview()?'<div class="preview-note">Lehrer-Vorschau: Alle Tage sind offen. Teilnehmerfortschritt und Teilnehmerpunkte werden nicht gespeichert.</div>':'';
function lockedModule(){APP.innerHTML='<section class="card locked-card"><h2>Noch nicht freigeschaltet</h2><p>Das Modul „Irreguläre Verben“ ist für deinen Kurs gesperrt.</p><a class="btn" href="/index.html">Zur Startseite</a></section>'}
function conjugationOverview(){
  const groups=groupDefinition().map(group=>({...group,verbs:ALL.filter(verb=>groupKey(verb)===group.key)}));
  return `<section class="card overview-card"><div class="section-head"><div><p class="eyebrow">Zuerst ansehen</p><h2>Übersicht: Verben und Konjugation</h2></div><span class="overview-total">${ALL.length} Verben</span></div><p class="overview-intro">Öffne die vier Gruppen. Achte besonders auf die Formen bei <strong>du</strong> und <strong>er/sie/es</strong>.</p><div class="verb-groups">${groups.map(group=>`<details class="verb-group" ${group.key==='special'?'open':''}><summary><span>${esc(group.title)}</span><span>${group.verbs.length} Verben</span></summary><p class="group-note">${esc(group.note)}</p><div class="table-scroll"><table class="conjugation-table"><thead><tr><th>Infinitiv</th><th>ich</th><th>du</th><th>er/sie/es</th><th>wir</th><th>ihr</th><th>sie/Sie</th></tr></thead><tbody>${group.verbs.map(verb=>`<tr><th>${esc(verb.v)}<small>${esc(verb.change)}</small></th><td>${esc(verb.forms.ich)}</td><td class="changed">${esc(verb.forms.du)}</td><td class="changed">${esc(verb.forms.er)}</td><td>${esc(verb.forms.wir)}</td><td>${esc(verb.forms.ihr)}</td><td>${esc(verb.forms.sie)}</td></tr>`).join('')}</tbody></table></div></details>`).join('')}</div></section>`;
}
function home(push=false){
  stopRecognition();
  RUN=null;
  const max=highestUnlocked();
  if(!dayUnlocked(+STATE.selectedDay))STATE.selectedDay=max;
  if(push)setUrl(null,true);else setUrl(null,false);
  const selected=dayData(STATE.selectedDay);
  const completedTasks=DAYS.reduce((sum,day)=>sum+countDay(day.day),0);
  const totalTasks=DAYS.length*TASK_IDS.length;
  const completedDays=DAYS.filter(day=>dayComplete(day.day)).length;
  const progress=percent(completedTasks,totalTasks);
  APP.innerHTML=`${previewNote()}${conjugationOverview()}<section class="card progress-card"><div class="circle">${progress}%</div><div><p class="eyebrow">Dein Lernweg</p><h2>${completedDays} von ${DAYS.length} Tagen abgeschlossen</h2><p>${completedTasks} von ${totalTasks} Tagesaufgaben abgeschlossen.</p><div class="progress"><div class="bar" style="width:${progress}%"></div></div><p class="small">Jeder Tag bringt drei neue Verben. In allen Übungen kommen zusätzlich alle Verben aus den vorherigen Tagen wieder.</p></div></section><section class="card"><div class="section-head"><div><p class="eyebrow">Schritt für Schritt</p><h2>Tagespakete</h2></div><div class="day-status">Tag ${selected.day}: ${countDay(selected.day)}/${TASK_IDS.length}</div></div><div class="day-grid">${DAYS.map(day=>{const unlocked=dayUnlocked(day.day),active=learnedVerbs(day.day).length;return`<button class="day-card ${day.day===selected.day?'active':''} ${unlocked?'':'locked'}" data-day="${day.day}" ${unlocked?'':'disabled'}><span class="day-number">${unlocked?'':'🔒 '}Tag ${day.day}</span><span class="day-verbs"><strong>Neu:</strong> ${esc(day.verbs.map(verb=>verb.v).join(', '))}</span><span class="day-cumulative">${active} Verben werden wiederholt</span><span class="day-progress">${unlocked?`${countDay(day.day)}/${TASK_IDS.length} Aufgaben abgeschlossen`:`Erst Tag ${day.day-1} vollständig abschließen`}</span></button>`}).join('')}</div></section><section class="card"><div class="section-head"><div><p class="eyebrow">Tag ${selected.day}</p><h2>3 neue · ${learnedVerbs(selected.day).length} Verben insgesamt</h2><p class="selected-verbs"><strong>Neue Verben:</strong> ${esc(selected.verbs.map(verb=>verb.v).join(' · '))}</p></div><div class="change-legend">${esc(uniq(selected.verbs.map(verb=>verb.change)).join(' · '))}</div></div><div class="cumulative-note">Die Karteikarten zeigen zuerst nur die drei neuen Verben. Danach übst du alle Verben von Tag 1 bis Tag ${selected.day}.</div><div class="task-grid">${TASKS.map((task,index)=>{const result=record(selected.day,task[0]);return`<button class="task-card ${result?.done?'done-card':''}" data-task="${task[0]}"><span class="task-number">${index+1}</span><span class="task-icon">${task[1]}</span><span class="task-title">${task[2]}</span><span class="task-desc">${task[3]}</span><span class="task-status">${result?.done?(result.perfect?'Fehlerfrei abgeschlossen':'Abgeschlossen'):'Noch offen'}</span></button>`}).join('')}</div></section>`;
}
function taskShell(body){
  const meta=taskMeta(RUN.task);
  const active=learnedVerbs(RUN.day.day).length;
  return `${previewNote()}<section class="card task-page"><div class="task-page-head"><button class="btn secondary" data-act="back">← Zur Übersicht</button><div><p class="eyebrow">Tag ${RUN.day.day}</p><h2>${esc(meta[2])}</h2></div><span class="package-label">3 neue · ${active} insgesamt</span></div>${body}</section>`;
}
function questions(task,day){
  const active=shuffle(learnedVerbs(day.day));
  const verbNames=active.map(verb=>verb.v);
  const meanings=active.map(verb=>verb.meaning);
  if(task==='meaning-to-verb')return active.map(verb=>({id:`mv-${verb.v}`,verb,p:verb.meaning,a:verb.v,o:optionList(verb.v,verbNames),hideVerb:true}));
  if(task==='verb-to-meaning')return active.map(verb=>({id:`vm-${verb.v}`,verb,p:`Was bedeutet „${verb.v}“?`,a:verb.meaning,o:optionList(verb.meaning,meanings)}));
  if(task==='listen')return active.map(verb=>({id:`listen-${verb.v}`,verb,p:'Höre das Wort und wähle das Verb.',a:verb.v,o:optionList(verb.v,verbNames),audio:verb.v,hideVerb:true}));
  if(task==='image-to-verb')return active.map(verb=>({id:`iv-${verb.v}`,verb,p:'Welches Verb zeigt das Bild?',a:verb.v,o:optionList(verb.v,verbNames),imagePrompt:true,hideVerb:true}));
  if(task==='verb-to-image')return active.map(verb=>({id:`vi-${verb.v}`,verb,p:`Welches Bild passt zu „${verb.v}“?`,a:verb.v,imageChoice:optionList(verb.v,verbNames).map(name=>active.find(item=>item.v===name)||ALL.find(item=>item.v===name))}));
  if(task==='read-sentence')return active.map(verb=>({id:`read-${verb.v}`,verb,p:fullSentence(verb),support:'Welcher Infinitiv gehört zu diesem Satz?',a:verb.v,o:optionList(verb.v,verbNames),hideVerb:true}));
  if(task==='change')return active.map(verb=>({id:`change-${verb.v}`,verb,p:`Zu welcher Gruppe gehört „${verb.v}“?`,a:changeGroupLabel(verb),o:CHANGES}));
  if(task==='choose-form')return active.map((verb,index)=>{const person=personFor(index,day.day,0);return{id:`choose-${verb.v}-${person.key}`,verb,p:`${person.label} – ${verb.v}`,support:'Wähle die richtige Präsensform.',a:verb.forms[person.key],o:optionList(verb.forms[person.key],[...Object.values(verb.forms),...ALL.map(item=>item.forms[person.key])])}});
  if(task==='write-form')return active.map((verb,index)=>{const person=personFor(index,day.day,2);return{id:`write-${verb.v}-${person.key}`,verb,p:`${person.label} – ${verb.v}`,support:'Schreibe nur die Verbform.',a:verb.forms[person.key],input:true}});
  if(task==='speak')return active.map((verb,index)=>{const person=personFor(index,day.day,4),form=verb.forms[person.key],phrase=`${person.label} ${form}`;return{id:`speak-${verb.v}-${person.key}`,verb,p:`Sprich: ${person.label} – ${verb.v}`,support:`Bilde die ${person.label}-Form.`,a:phrase,answers:[phrase,form],speech:true}});
  if(task==='sentence')return active.map(verb=>{const form=verb.forms[verb.sentence.person];return{id:`sentence-${verb.v}`,verb,p:`${verb.sentence.subject} ___ ${verb.sentence.rest}`,support:`Infinitiv: ${verb.v}`,a:form,o:optionList(form,[...Object.values(verb.forms),...ALL.map(item=>item.forms[verb.sentence.person])])}});
  if(task==='exam'){
    const newest=new Set(newVerbs(day.day).map(verb=>verb.v));
    const makeVocab=verb=>({id:`exam-v-${verb.v}`,verb,p:verb.meaning,support:'Schreibe den Infinitiv.',a:verb.v,input:true,hideVerb:true});
    const makeForm=(verb,index,extra='')=>{const person=personFor(index,day.day,extra?4:1);return{id:`exam-f-${extra}${verb.v}-${person.key}`,verb,p:`${person.label} – ${verb.v}`,support:'Schreibe die richtige Präsensform.',a:verb.forms[person.key],input:true}};
    const base=active.map((verb,index)=>index%2===0?makeVocab(verb):makeForm(verb,index));
    const extra=active.map((verb,index)=>({verb,index})).filter(item=>newest.has(item.verb.v)).map(item=>item.index%2===0?makeForm(item.verb,item.index,'new-'):makeVocab(item.verb));
    extra.forEach((question,index)=>question.id=`${question.id}-new-${index}`);
    return [...base,...extra];
  }
  return [];
}
function openTask(task,push=true){
  if(!taskMeta(task)||!dayUnlocked(+STATE.selectedDay))return home(push);
  stopRecognition();
  setUrl(task,push);
  const day=dayData(STATE.selectedDay);
  if(task==='cards')RUN={task,day,index:0,revealed:false,finished:false};
  else{
    const all=questions(task,day);
    RUN={task,day,all,queue:[...all],current:null,tries:{},firstSeen:new Set(),firstCorrect:0,solved:new Set(),hadWrong:false,feedback:null,finished:false,write:false,listening:false,tech:''};
    nextQuestion();
  }
  renderTask();
}
function renderTask(){
  if(RUN.task==='cards')return renderCards();
  if(RUN.finished)return renderFinish();
  renderQuiz();
}
function renderCards(){
  if(RUN.finished)return renderFinish();
  const verbs=newVerbs(RUN.day.day);
  const verb=verbs[RUN.index];
  APP.innerHTML=taskShell(`<div class="task-progress-row"><span>Karte ${RUN.index+1} von ${verbs.length}</span><span>Heute neu</span></div><div class="flashcard">${imageBlock(verb)}<p class="eyebrow">Infinitiv</p><div class="flash-verb">${esc(verb.v)}</div>${RUN.revealed?`<p class="flash-meaning">${esc(verb.meaning)}</p><div class="change-badge">Vokalwechsel: ${esc(verb.change)}</div><div class="forms-grid">${PERSONS.map(person=>`<div><span>${esc(person.label)}</span><strong>${esc(verb.forms[person.key])}</strong></div>`).join('')}</div><div class="example-sentence"><strong>Beispiel:</strong> ${esc(fullSentence(verb))}</div>${verb.note?`<div class="word-note">${esc(verb.note)}</div>`:''}`:'<p class="hint">Sprich das Verb laut. Überlege: Was bedeutet es?</p>'}</div><div class="actions"><button class="btn" data-act="${RUN.revealed?'next-card':'reveal'}">${RUN.revealed?(RUN.index===verbs.length-1?'Karteikarten abschließen':'Nächste Karte'):'Bedeutung und Formen zeigen'}</button></div>`);
  bindImageFallbacks();
}
function nextQuestion(){
  RUN.feedback=null;
  RUN.tech='';
  RUN.write=false;
  RUN.listening=false;
  RUN.current=RUN.queue.shift()||null;
  if(!RUN.current){
    RUN.finished=true;
    markDone(RUN.day.day,RUN.task,!RUN.hadWrong,percent(RUN.firstCorrect,RUN.all.length));
  }
}
function inputForm(disabled=false,label='Schreibe deine Antwort'){return `<form id="answerForm" class="answer-form"><label>${esc(label)}</label><div class="answer-row"><input name="answer" autocomplete="off" autocapitalize="none" spellcheck="false" ${disabled?'disabled':''}><button class="btn" ${disabled?'disabled':''}>Prüfen</button></div></form>`}
function textOptions(question,disabled){return `<div class="option-grid ${question.o.length===5?'five-options':''}">${question.o.map(option=>`<button class="option" data-answer="${esc(option)}" ${disabled?'disabled':''}>${esc(option)}</button>`).join('')}</div>`}
function imageOptions(question,disabled){return `<div class="image-choice-grid">${question.imageChoice.map(verb=>`<button class="image-option" data-answer="${esc(verb.v)}" aria-label="Bild auswählen" ${disabled?'disabled':''}>${imageBlock(verb,true,true)}</button>`).join('')}</div>`}
function renderQuiz(){
  const question=RUN.current;
  if(!question){RUN.finished=true;return renderFinish()}
  const feedback=RUN.feedback;
  let answerArea='';
  if(question.imageChoice)answerArea=imageOptions(question,!!feedback);
  else if(question.speech){
    if(!(window.SpeechRecognition||window.webkitSpeechRecognition))RUN.write=true;
    answerArea=`<div class="speech-box"><p>Sprich die vollständige Form mit Pronomen.</p><div class="actions"><button class="btn" data-act="mic" ${feedback||RUN.listening?'disabled':''}>${RUN.listening?'Ich höre zu …':'Form sprechen'}</button><button class="btn secondary" data-act="write" ${feedback?'disabled':''}>Stattdessen schreiben</button></div>${RUN.tech?`<div class="tech-note">${esc(RUN.tech)}</div>`:''}${RUN.write?inputForm(!!feedback,'Schreibe Pronomen und Verbform'):''}</div>`;
  }else if(question.o)answerArea=textOptions(question,!!feedback);
  else answerArea=inputForm(!!feedback,question.support||'Schreibe deine Antwort');
  const visual=question.imagePrompt?imageBlock(question.verb,false,true):'';
  const audio=question.audio?`<div class="listen-box"><button class="btn" data-act="play" ${feedback?'disabled':''}>🔊 Verb anhören</button><span>Du kannst das Wort mehrmals hören.</span></div>${RUN.tech?`<div class="tech-note">${esc(RUN.tech)}</div>`:''}`:'';
  const message=feedback?`<div class="feedback ${feedback.ok?'ok':'no'}">${feedback.ok?'Richtig.':esc(feedback.message)}${feedback.solution?`<div class="solution">Lösung: <strong>${esc(question.a)}</strong></div>`:''}</div><div class="actions"><button class="btn" data-act="next">Weiter</button></div>`:'';
  const questionLabel=question.hideVerb?'Wortschatz · Wiederholung':`${question.verb.v} · ${question.verb.change}`;
  APP.innerHTML=taskShell(`<div class="task-progress-row"><span>${RUN.solved.size} von ${RUN.all.length} gelöst</span><span>Fehler bei dieser Aufgabe: ${RUN.tries[question.id]||0}/3</span></div><div class="mini-progress"><div style="width:${percent(RUN.solved.size,RUN.all.length)}%"></div></div><div class="question-card"><p class="eyebrow">${esc(questionLabel)}</p>${visual}${audio}<div class="question">${esc(question.p)}</div>${question.support&&!question.input&&!question.speech?`<p class="question-support">${esc(question.support)}</p>`:''}${question.verb.note?`<div class="word-note">${esc(question.verb.note)}</div>`:''}${answerArea}${message}</div>`);
  bindImageFallbacks();
  if(!feedback&&!question.o&&!question.imageChoice&&(!question.speech||RUN.write))requestAnimationFrame(()=>APP.querySelector('input')?.focus());
}
function answerQuestion(raw){
  const question=RUN?.current;
  if(!question||RUN.feedback||!String(raw||'').trim())return;
  const accepted=question.answers||[question.a];
  const correct=accepted.some(answer=>norm(answer)===norm(raw));
  if(!RUN.firstSeen.has(question.id)){
    RUN.firstSeen.add(question.id);
    if(correct)RUN.firstCorrect++;
  }
  if(correct){
    RUN.solved.add(question.id);
    RUN.feedback={ok:true};
  }else{
    RUN.hadWrong=true;
    const tries=(RUN.tries[question.id]||0)+1;
    RUN.tries[question.id]=tries;
    if(tries>=3){
      RUN.solved.add(question.id);
      RUN.feedback={ok:false,message:'Das war der dritte Fehler. Jetzt siehst du die Lösung.',solution:true};
    }else{
      RUN.queue.push(question);
      RUN.feedback={ok:false,message:'Noch nicht richtig. Diese Aufgabe kommt am Ende erneut.'};
    }
  }
  renderQuiz();
}
function playAudio(){
  const word=RUN?.current?.audio;
  if(!word)return;
  if(!('speechSynthesis' in window)){
    RUN.tech='Die Hörfunktion ist auf diesem Gerät nicht verfügbar. Lies das Verb als technischen Ersatz: '+word;
    return renderQuiz();
  }
  try{
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(word);
    utterance.lang='de-DE';
    utterance.rate=.82;
    utterance.onerror=()=>{if(RUN){RUN.tech='Das Verb konnte nicht abgespielt werden. Lies es als technischen Ersatz: '+word;renderQuiz()}};
    window.speechSynthesis.speak(utterance);
  }catch(error){
    RUN.tech='Das Verb konnte nicht abgespielt werden. Lies es als technischen Ersatz: '+word;
    renderQuiz();
  }
}
function startMicrophone(){
  const question=RUN.current;
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){
    RUN.write=true;
    RUN.tech='Das Mikrofon ist nicht verfügbar. Bitte schreibe die Antwort.';
    return renderQuiz();
  }
  stopRecognition();
  let received=false;
  const run=RUN;
  try{
    RECOGNITION=new Recognition();
    RECOGNITION.lang='de-DE';
    RECOGNITION.interimResults=false;
    RECOGNITION.maxAlternatives=4;
    RUN.listening=true;
    renderQuiz();
    RECOGNITION.onresult=event=>{
      if(RUN!==run)return;
      received=true;
      RUN.listening=false;
      const alternatives=Array.from(event.results[0]).map(result=>result.transcript);
      const accepted=question.answers||[question.a];
      const exact=alternatives.find(value=>accepted.some(answer=>norm(answer)===norm(value)));
      answerQuestion(exact||alternatives[0]||'');
    };
    RECOGNITION.onerror=event=>{
      if(RUN!==run)return;
      RUN.listening=false;
      RUN.write=true;
      RUN.tech=event.error==='not-allowed'?'Der Mikrofonzugriff ist blockiert. Bitte schreibe die Antwort.':'Das Mikrofon konnte nichts erkennen. Bitte schreibe die Antwort.';
      RECOGNITION=null;
      renderQuiz();
    };
    RECOGNITION.onend=()=>{
      RECOGNITION=null;
      if(RUN!==run||received||RUN.feedback)return;
      RUN.listening=false;
      RUN.write=true;
      RUN.tech='Es wurde keine Antwort erkannt. Bitte schreibe die Antwort.';
      renderQuiz();
    };
    RECOGNITION.start();
  }catch(error){
    RECOGNITION=null;
    RUN.listening=false;
    RUN.write=true;
    RUN.tech='Das Mikrofon konnte nicht gestartet werden. Bitte schreibe die Antwort.';
    renderQuiz();
  }
}
function renderFinish(){
  const cards=RUN.task==='cards';
  const score=cards?100:percent(RUN.firstCorrect,RUN.all.length);
  const perfect=cards||!RUN.hadWrong;
  const complete=dayComplete(RUN.day.day);
  const next=RUN.day.day<DAYS.length?RUN.day.day+1:null;
  APP.innerHTML=taskShell(`<div class="finish-box"><div class="finish-icon">${perfect?'★':'✓'}</div><h3>${perfect?'Fehlerfrei abgeschlossen':'Aufgabe abgeschlossen'}</h3><p>${cards?'Du hast die drei neuen Verben mit Bedeutung und Konjugation angesehen.':`Beim ersten Versuch waren ${score}% richtig.`}</p>${perfect?'':'<p class="small">Falsche Aufgaben wurden am Ende wiederholt. Nach drei Fehlern wurde die Lösung gezeigt.</p>'}${complete?`<div class="day-unlocked"><strong>Tag ${RUN.day.day} ist vollständig abgeschlossen.</strong>${next?` Tag ${next} ist jetzt freigeschaltet.`:' Du hast alle Tage abgeschlossen.'}</div>`:''}<div class="actions"><button class="btn" data-act="repeat">Wiederholen</button><button class="btn secondary" data-act="back">Zur Übersicht</button>${complete&&next?`<button class="btn" data-act="next-day">Tag ${next} beginnen</button>`:''}</div></div>`);
}

APP.onclick=event=>{
  const button=event.target.closest('button');
  if(!button)return;
  if(button.dataset.day){
    const target=+button.dataset.day;
    if(!dayUnlocked(target))return;
    STATE.selectedDay=target;
    saveState();
    setUrl(null,false);
    return home();
  }
  if(button.dataset.task)return openTask(button.dataset.task);
  if(button.dataset.answer)return answerQuestion(button.dataset.answer);
  const action=button.dataset.act;
  if(action==='back')return home(true);
  if(action==='reveal'){RUN.revealed=true;return renderCards()}
  if(action==='next-card'){
    const verbs=newVerbs(RUN.day.day);
    if(RUN.index===verbs.length-1){RUN.finished=true;markDone(RUN.day.day,'cards',true)}else{RUN.index++;RUN.revealed=false}
    return renderTask();
  }
  if(action==='next'){stopRecognition();nextQuestion();return renderTask()}
  if(action==='write'){RUN.write=true;RUN.tech='';return renderQuiz()}
  if(action==='mic')return startMicrophone();
  if(action==='play')return playAudio();
  if(action==='repeat')return openTask(RUN.task,false);
  if(action==='next-day'){
    const next=RUN.day.day+1;
    if(!dayUnlocked(next))return;
    STATE.selectedDay=next;
    saveState();
    setUrl(null,false);
    return home();
  }
};
APP.onsubmit=event=>{
  if(event.target.id!=='answerForm')return;
  event.preventDefault();
  answerQuestion(new FormData(event.target).get('answer'));
};
window.onpopstate=()=>{
  stopRecognition();
  const params=new URLSearchParams(location.search);
  const requested=+params.get('day');
  STATE.selectedDay=DAYS.some(day=>day.day===requested)&&dayUnlocked(requested)?requested:highestUnlocked();
  const task=params.get('task');
  taskMeta(task)?openTask(task,false):home();
};
async function init(){
  if(!requireLogin())return;
  window.logout=logout;
  STATE=loadState();
  const params=new URLSearchParams(location.search);
  const requested=+params.get('day');
  STATE.selectedDay=DAYS.some(day=>day.day===requested)&&dayUnlocked(requested)?requested:Math.min(+STATE.selectedDay||1,highestUnlocked());
  if(!dayUnlocked(+STATE.selectedDay))STATE.selectedDay=highestUnlocked();
  saveState();
  header();
  if(role()!=='teacher'){
    try{if(!moduleOpen(await loadCourseRelease(profile()),NAME))return lockedModule()}
    catch(error){return lockedModule()}
  }
  const task=params.get('task');
  taskMeta(task)?openTask(task,false):home();
}
init().catch(error=>{
  console.error(error);
  APP.innerHTML='<section class="card locked-card"><h2>Das Modul konnte nicht geladen werden.</h2><button class="btn" onclick="location.reload()">Neu laden</button></section>';
});