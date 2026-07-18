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
  {key:'ich',label:'ich',spoken:'ich'},
  {key:'du',label:'du',spoken:'du'},
  {key:'er',label:'er',spoken:'er'},
  {key:'er',label:'sie (Singular)',spoken:'sie'},
  {key:'er',label:'es',spoken:'es'},
  {key:'wir',label:'wir',spoken:'wir'},
  {key:'ihr',label:'ihr',spoken:'ihr'},
  {key:'sie',label:'sie (Plural)',spoken:'sie'},
  {key:'sie',label:'Sie',spoken:'Sie'}
];
const TABLE_PERSONS=[
  {key:'ich',label:'ich'},
  {key:'du',label:'du'},
  {key:'er',label:'er/sie/es'},
  {key:'wir',label:'wir'},
  {key:'ihr',label:'ihr'},
  {key:'sie',label:'sie/Sie'}
];
const TASKS=[
  ['cards','Aa','Karteikarten','Lerne die drei neuen Verben mit Bild, Muttersprache und Formen.'],
  ['meaning-to-verb','B→V','Bedeutung → Verb','Lies eine kurze Erklärung. Finde das Verb.'],
  ['verb-to-meaning','V→B','Verb → Bedeutung','Lies das Verb. Wähle die richtige Erklärung.'],
  ['listen','🔊','Hören → Verb','Höre das Verb. Wähle das richtige Wort.'],
  ['image-to-verb','▣','Bild → Verb','Sieh das Bild an. Finde das Verb.'],
  ['verb-to-image','V→▣','Verb → Bild','Lies das Verb. Wähle das passende Bild.'],
  ['read-sentence','📖','Lesen → Verb','Lies den Satz. Finde den Infinitiv.'],
  ['change','e→i','Vokalwechsel','Ordne das Verb einer Gruppe zu.'],
  ['choose-form','du','Form auswählen','Wähle eine Form. Alle vier Formen sind vom selben Verb.'],
  ['write-form','✎','Form schreiben','Schreibe verschiedene Formen im Präsens.'],
  ['speak','🎙','Form sprechen','Sprich eine Form. Du kannst immer auch schreiben.'],
  ['sentence','…','Satz ergänzen','Setze die richtige Form in den Satz ein.'],
  ['exam','★','Tagesprüfung','Eine Frage aus jeder Aufgabe. Es kommen die drei neuen Verben.']
];
const TASK_IDS=TASKS.map(task=>task[0]);
const PRACTICE_IDS=TASK_IDS.filter(id=>id!=='exam');
const CHANGES=['a → ä','e → i','e → ie','Sonderform'];
let STATE;
let RUN=null;
let RECOGNITION=null;

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const norm=value=>String(value??'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[.,!?;:"'`´()]/g,'').replace(/\s+/g,' ');
const shuffle=list=>{list=[...(list||[])];for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list};
const uniqueStrings=list=>{const seen=new Set();return (list||[]).filter(value=>{const key=norm(value);if(!key||seen.has(key))return false;seen.add(key);return true})};
const role=()=>String(getActiveRole()||'').toLowerCase();
const profile=()=>getActiveProfile()||{};
const taskMeta=id=>TASKS.find(task=>task[0]===id);
const dayData=number=>DAYS.find(day=>day.day===+number)||DAYS[0];
const newVerbs=number=>dayData(number)?.verbs||[];
const learnedVerbs=number=>DAYS.filter(day=>day.day<=+number).flatMap(day=>day.verbs||[]);
const record=(day,task)=>STATE.completed?.[String(day)]?.[task];
const countDay=day=>PRACTICE_IDS.filter(task=>record(day,task)?.done).length;
const practiceComplete=day=>PRACTICE_IDS.every(task=>record(day,task)?.done);
const examDone=day=>!!record(day,'exam')?.done;
const dayComplete=day=>practiceComplete(day)&&examDone(day);
const examUnlocked=day=>teacherPreview()||practiceComplete(day);
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
function normalizeState(saved){
  return {version:3,selectedDay:1,completed:{},runs:{},...(saved||{}),completed:saved?.completed||{},runs:saved?.runs||{}};
}
function loadState(){
  try{return normalizeState(JSON.parse(localStorage.getItem(storageKey())||'null'))}catch(error){return normalizeState(null)}
}
function saveState(){
  if(teacherPreview())return;
  try{localStorage.setItem(storageKey(),JSON.stringify(STATE))}catch(error){}
}
function markDone(day,task,perfect,firstScore=100){
  if(teacherPreview())return;
  const key=String(day);
  STATE.completed[key]??={};
  const old=STATE.completed[key][task]||{};
  STATE.completed[key][task]={done:true,perfect:!!(old.perfect||perfect),bestScore:100,firstScore:Math.max(old.firstScore||0,firstScore)};
  if(STATE.runs?.[key])delete STATE.runs[key][task];
  saveState();
}
function runStore(day,task){return STATE.runs?.[String(day)]?.[task]||null}
function writeRun(){
  if(!RUN||teacherPreview())return;
  const day=String(RUN.day.day);
  STATE.runs[day]??={};
  if(RUN.task==='cards'){
    STATE.runs[day][RUN.task]={kind:'cards',index:RUN.index,revealed:RUN.revealed,cardSolved:RUN.cardSolved,tries:RUN.tries,hadWrong:RUN.hadWrong};
  }else{
    STATE.runs[day][RUN.task]={kind:'quiz',order:RUN.order,index:RUN.index,tries:RUN.tries,firstSeen:[...RUN.firstSeen],firstCorrect:RUN.firstCorrect,hadWrong:RUN.hadWrong,correct:RUN.correct,write:RUN.write};
  }
  saveState();
}
function dayUnlocked(day){
  if(teacherPreview()||day===1)return true;
  return dayComplete(day-1);
}
function highestUnlocked(){
  let highest=1;
  for(const item of DAYS){if(dayUnlocked(item.day))highest=item.day;else break}
  return highest;
}
function taskPartial(day,task){
  if(record(day,task)?.done)return 100;
  const saved=runStore(day,task);
  if(!saved)return 0;
  if(saved.kind==='cards')return percent(saved.index,newVerbs(day).length);
  return percent(saved.index,saved.order?.length||0);
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
function scrollToElement(selector,block='center'){
  requestAnimationFrame(()=>setTimeout(()=>document.querySelector(selector)?.scrollIntoView({behavior:'smooth',block}),80));
}
function imageName(verb){return String(verb||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')+'.webp'}
function imageUrl(verb){return BUNNY+encodeURIComponent(imageName(verb))}
function fullSentence(verb){return `${verb.sentence.subject} ${verb.forms[verb.sentence.person]} ${verb.sentence.rest}`}
function optionList(answer,pool,size=4){
  const alternatives=uniqueStrings(shuffle(pool)).filter(value=>norm(value)!==norm(answer));
  return shuffle([answer,...alternatives.slice(0,size-1)]);
}
function sameVerbForms(verb,answer){
  const forms=uniqueStrings(Object.values(verb.forms));
  const rest=shuffle(forms.filter(form=>norm(form)!==norm(answer)));
  return shuffle([answer,...rest.slice(0,3)]);
}
function personFor(index,day,offset=0){return PERSONS[(index+day+offset)%PERSONS.length]}
function personPhrase(person,form){return `${person.spoken} ${form}`}
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
    {key:'a',title:'a → ä',note:'Bei du und er/sie/es wird a zu ä. laufen und saufen gehören auch hier: au wird äu.'},
    {key:'ei',title:'e → i',note:'Bei du und er/sie/es wird e zu i.'},
    {key:'eie',title:'e → ie',note:'Bei du und er/sie/es wird e zu ie.'},
    {key:'special',title:'Speziell',note:'haben, sein, werden und wissen haben eigene Formen.'}
  ];
}
function motherLanguage(){
  const raw=String(profile().muttersprache||profile().motherLanguage||'Englisch').trim().toLowerCase();
  const map=[
    [/russ/,'Russisch'],[/ukrain|ukrainisch|україн/,'Ukrainisch'],[/türk|turk/,'Türkisch'],[/arab/,'Arabisch'],[/japan/,'Japanisch'],[/rumän|ruman|roman/,'Rumänisch'],[/pol/,'Polnisch'],[/kurd/,'Kurdisch'],[/engl|english/,'Englisch']
  ];
  return map.find(([pattern])=>pattern.test(raw))?.[1]||profile().muttersprache||'Englisch';
}
function translation(verb){
  const all=window.SP_VERB_TRANSLATIONS||{};
  const lang=motherLanguage();
  return all?.[lang]?.[verb.v]||all?.Englisch?.[verb.v]||verb.meaning;
}
function imageBlock(verb,compact=false,neutralFallback=false){
  const fallbackTitle=neutralFallback?'Kein Bild verfügbar':verb.v;
  const alt=neutralFallback?'Bild zur Aufgabe':`Bild zu ${verb.v}`;
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
  HEADER.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot Logo"><div><h1>${NAME}</h1><p>${ALL.length} Verben · ${DAYS.length} Lerntage</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a><button class="btn secondary" id="logoutButton">Abmelden</button></div></div><nav class="topnav"><a class="btn secondary" href="/index.html">← Startseite</a><button class="btn danger-btn" id="resetProgressButton">Fortschritte löschen</button></nav>`;
  HEADER.querySelector('#logoutButton').onclick=logout;
  HEADER.querySelector('#resetProgressButton').onclick=resetProgress;
}
function resetProgress(){
  if(teacherPreview()){alert('In der Lehrer-Vorschau wird kein Teilnehmerfortschritt gespeichert.');return}
  if(!confirm('Fortschritte bei „Irreguläre Verben“ löschen? Bereits verdiente Punkte in anderen Modulen bleiben erhalten.'))return;
  localStorage.removeItem(storageKey());
  sessionStorage.removeItem('SP_IRREGULAR_RETURN_TASK');
  STATE=normalizeState(null);
  stopRecognition();
  setUrl(null,false);
  home(false,'',true);
}
const previewNote=()=>teacherPreview()?'<div class="preview-note">Lehrer-Vorschau: Alle Tage sind offen. Es wird kein Teilnehmerfortschritt gespeichert.</div>':'';
function lockedModule(){APP.innerHTML='<section class="card locked-card"><h2>Noch gesperrt</h2><p>Dein Kurs hat diese Aufgabe noch nicht.</p><a class="btn" href="/index.html">Zur Startseite</a></section>'}
function conjugationOverview(){
  const groups=groupDefinition().map(group=>({...group,verbs:ALL.filter(verb=>groupKey(verb)===group.key)}));
  return `<section class="card overview-card"><div class="section-head"><div><p class="eyebrow">Zuerst ansehen</p><h2>Verben und Formen</h2></div><span class="overview-total">${ALL.length} Verben</span></div><p class="overview-intro">Öffne eine Gruppe. Sieh dir besonders <strong>du</strong> und <strong>er/sie/es</strong> an.</p><div class="verb-groups">${groups.map(group=>`<details class="verb-group"><summary><span>${esc(group.title)}</span><span>${group.verbs.length} Verben</span></summary><p class="group-note">${esc(group.note)}</p><div class="table-scroll"><table class="conjugation-table"><thead><tr><th>Verb</th>${TABLE_PERSONS.map(person=>`<th>${esc(person.label)}</th>`).join('')}</tr></thead><tbody>${group.verbs.map(verb=>`<tr><th>${esc(verb.v)}<small>${esc(verb.change)}</small></th>${TABLE_PERSONS.map(person=>`<td class="${person.key==='du'||person.key==='er'?'changed':''}">${esc(verb.forms[person.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`).join('')}</div></section>`;
}
function taskCards(day){
  const examOpen=examUnlocked(day.day);
  return TASKS.map((task,index)=>{
    const id=task[0];
    const result=record(day.day,id);
    const locked=id==='exam'&&!examOpen;
    const partial=taskPartial(day.day,id);
    const status=locked?'Erst alle Aufgaben zu 100% abschließen':result?.done?'100% abgeschlossen':partial?`${partial}% gespeichert`:'Noch offen';
    return `<button class="task-card ${result?.done?'done-card':''} ${locked?'locked-task':''}" data-task="${id}" data-task-card="${id}" ${locked?'disabled aria-disabled="true"':''}><span class="task-number">${index+1}</span><span class="task-icon">${locked?'🔒':task[1]}</span><span class="task-title">${task[2]}</span><span class="task-desc">${task[3]}</span><div class="task-mini-progress"><span style="width:${result?.done?100:partial}%"></span></div><span class="task-status">${status}</span></button>`;
  }).join('');
}
function dayPanels(){
  return DAYS.map(item=>{
    const unlocked=dayUnlocked(item.day);
    const selected=item.day===+STATE.selectedDay;
    const practice=countDay(item.day);
    const active=learnedVerbs(item.day).length;
    return `<details class="day-panel ${unlocked?'':'locked'}" data-day-panel="${item.day}" ${selected&&unlocked?'open':''}><summary data-day-summary="${item.day}" aria-disabled="${unlocked?'false':'true'}"><span class="day-number">${unlocked?'':'🔒 '}Tag ${item.day}</span><span class="day-verbs"><strong>Neu:</strong> ${esc(item.verbs.map(verb=>verb.v).join(', '))}</span><span class="day-cumulative">${active} Verben insgesamt</span><span class="day-progress">${unlocked?`${practice}/${PRACTICE_IDS.length} Aufgaben · Prüfung ${examDone(item.day)?'fertig':examUnlocked(item.day)?'offen':'gesperrt'}`:`Tag ${item.day-1} zuerst fertig machen`}</span></summary>${unlocked?`<div class="day-body" id="day-tasks-${item.day}"><div class="cumulative-note"><strong>Heute neu:</strong> ${esc(item.verbs.map(verb=>verb.v).join(' · '))}<br>Die Karteikarten zeigen die drei neuen Verben. Danach übst du alle ${active} Verben.</div><div class="task-grid">${taskCards(item)}</div></div>`:''}</details>`;
  }).join('');
}
function home(push=false,scrollTask='',scrollDay=false){
  stopRecognition();
  RUN=null;
  const max=highestUnlocked();
  if(!dayUnlocked(+STATE.selectedDay))STATE.selectedDay=max;
  if(push)setUrl(null,true);else setUrl(null,false);
  const completedPractice=DAYS.reduce((sum,item)=>sum+countDay(item.day),0);
  const totalPractice=DAYS.length*PRACTICE_IDS.length;
  const completedDays=DAYS.filter(item=>dayComplete(item.day)).length;
  const progress=percent(completedPractice,totalPractice);
  APP.innerHTML=`${previewNote()}${conjugationOverview()}<section class="card progress-card"><div class="circle">${progress}%</div><div><p class="eyebrow">Dein Fortschritt</p><h2>${completedDays} von ${DAYS.length} Tagen fertig</h2><p>${completedPractice} von ${totalPractice} Lernaufgaben abgeschlossen.</p><div class="progress"><div class="bar" style="width:${progress}%"></div></div><p class="small">Tag 2 öffnet erst, wenn Tag 1 fertig ist. Jeder neue Tag wiederholt auch die alten Verben.</p></div></section><section class="card days-card"><div class="section-head"><div><p class="eyebrow">Schritt für Schritt</p><h2>Tage öffnen</h2></div><div class="day-status">Tag ${STATE.selectedDay}</div></div><div class="days-accordion">${dayPanels()}</div></section>`;
  bindImageFallbacks();
  if(scrollTask)scrollToElement(`[data-day-panel="${STATE.selectedDay}"] [data-task-card="${scrollTask}"]`);
  else if(scrollDay)scrollToElement(`#day-tasks-${STATE.selectedDay}`,'start');
}
function taskShell(body){
  const meta=taskMeta(RUN.task);
  const active=learnedVerbs(RUN.day.day).length;
  return `${previewNote()}<section class="card task-page"><div class="task-page-head"><button class="btn secondary" data-act="back">← Zurück</button><div><p class="eyebrow">Tag ${RUN.day.day}</p><h2>${esc(meta[2])}</h2></div><span class="package-label">3 neu · ${active} insgesamt</span></div>${body}</section>`;
}
function buildQuestion(task,verb,index,day,examId=''){
  const active=learnedVerbs(day.day);
  const verbNames=active.map(item=>item.v);
  const meanings=active.map(item=>item.meaning);
  const prefix=examId||task;
  if(task==='cards')return {id:`${prefix}-card-${verb.v}`,verb,p:'Welches deutsche Verb passt?',support:`Muttersprache (${motherLanguage()}): ${translation(verb)}`,a:verb.v,input:true,imagePrompt:true,hideVerb:true};
  if(task==='meaning-to-verb')return {id:`${prefix}-mv-${verb.v}`,verb,p:verb.meaning,a:verb.v,o:optionList(verb.v,verbNames),imagePrompt:true,hideVerb:true};
  if(task==='verb-to-meaning')return {id:`${prefix}-vm-${verb.v}`,verb,p:`Was bedeutet „${verb.v}“?`,a:verb.meaning,o:optionList(verb.meaning,meanings),smallImage:true};
  if(task==='listen')return {id:`${prefix}-listen-${verb.v}`,verb,p:'Höre das Wort. Wähle das Verb.',a:verb.v,o:optionList(verb.v,verbNames),audio:verb.v,hideVerb:true};
  if(task==='image-to-verb')return {id:`${prefix}-iv-${verb.v}`,verb,p:'Welches Verb zeigt das Bild?',a:verb.v,o:optionList(verb.v,verbNames),imagePrompt:true,hideVerb:true};
  if(task==='verb-to-image')return {id:`${prefix}-vi-${verb.v}`,verb,p:`Welches Bild passt zu „${verb.v}“?`,a:verb.v,imageChoice:optionList(verb.v,verbNames).map(name=>active.find(item=>item.v===name)||ALL.find(item=>item.v===name))};
  if(task==='read-sentence')return {id:`${prefix}-read-${verb.v}`,verb,p:fullSentence(verb),support:'Welcher Infinitiv passt?',a:verb.v,o:optionList(verb.v,verbNames),smallImage:true,hideVerb:true};
  if(task==='change')return {id:`${prefix}-change-${verb.v}`,verb,p:`Zu welcher Gruppe gehört „${verb.v}“?`,a:changeGroupLabel(verb),o:CHANGES,hideChange:true};
  if(task==='choose-form'){
    const person=personFor(index,day.day,0);
    const answer=verb.forms[person.key];
    return {id:`${prefix}-choose-${verb.v}-${person.label}`,verb,p:`${person.label}: ${verb.v}`,support:'Wähle die richtige Form.',a:answer,o:sameVerbForms(verb,answer),smallImage:true};
  }
  if(task==='write-form'){
    const person=personFor(index,day.day,3);
    return {id:`${prefix}-write-${verb.v}-${person.label}`,verb,p:`${person.label}: ${verb.v}`,support:'Schreibe nur die Verbform.',a:verb.forms[person.key],input:true,smallImage:true};
  }
  if(task==='speak'){
    const person=personFor(index,day.day,6);
    const form=verb.forms[person.key];
    const phrase=personPhrase(person,form);
    return {id:`${prefix}-speak-${verb.v}-${person.label}`,verb,p:`Sprich: ${person.label} – ${verb.v}`,support:`Sage: ${person.label} + Verbform.`,a:phrase,answers:[phrase,form],speech:true,person,smallImage:true};
  }
  if(task==='sentence'){
    const person=personFor(index,day.day,8);
    const form=verb.forms[person.key];
    return {id:`${prefix}-sentence-${verb.v}-${person.label}`,verb,p:`${person.label} ___ heute.`,support:`Verb: ${verb.v}`,a:form,o:sameVerbForms(verb,form),smallImage:true};
  }
  return null;
}
function questions(task,day){
  if(task==='exam'){
    const fresh=newVerbs(day.day);
    return PRACTICE_IDS.map((source,index)=>buildQuestion(source,fresh[index%fresh.length],index,day,`exam-${source}`)).filter(Boolean);
  }
  return learnedVerbs(day.day).map((verb,index)=>buildQuestion(task,verb,index,day)).filter(Boolean);
}
function restoreQuiz(task,day,all,saved){
  const byId=new Map(all.map(question=>[question.id,question]));
  const order=(saved?.order||[]).filter(id=>byId.has(id));
  const finalOrder=order.length===all.length?order:shuffle(all.map(question=>question.id));
  const ordered=finalOrder.map(id=>byId.get(id));
  return {task,day,all:ordered,order:finalOrder,index:Math.min(saved?.index||0,ordered.length),tries:saved?.tries||{},firstSeen:new Set(saved?.firstSeen||[]),firstCorrect:saved?.firstCorrect||0,hadWrong:!!saved?.hadWrong,correct:!!saved?.correct,feedback:null,finished:false,write:!!saved?.write,listening:false,tech:''};
}
function openTask(task,push=true){
  if(!taskMeta(task)||!dayUnlocked(+STATE.selectedDay))return home(push,task);
  if(task==='exam'&&!examUnlocked(+STATE.selectedDay))return home(push,'exam');
  stopRecognition();
  sessionStorage.setItem('SP_IRREGULAR_RETURN_TASK',task);
  setUrl(task,push);
  const day=dayData(STATE.selectedDay);
  const saved=record(day.day,task)?.done?null:runStore(day.day,task);
  if(task==='cards')RUN={task,day,index:Math.min(saved?.index||0,newVerbs(day.day).length-1),revealed:!!saved?.revealed,cardSolved:!!saved?.cardSolved,tries:saved?.tries||0,hadWrong:!!saved?.hadWrong,feedback:null,finished:false,write:false,listening:false,tech:''};
  else RUN=restoreQuiz(task,day,questions(task,day),saved);
  writeRun();
  renderTask();
}
function renderTask(){
  if(RUN.task==='cards')return renderCards();
  if(RUN.finished||RUN.index>=RUN.all.length)return renderFinish();
  renderQuiz();
}
function flashBack(verb){
  return `<p class="eyebrow">Lösung</p><div class="flash-verb">${esc(verb.v)}</div><p class="flash-meaning">${esc(verb.meaning)}</p><div class="translation-box"><strong>${esc(motherLanguage())}:</strong> ${esc(translation(verb))}</div><div class="change-badge">${esc(verb.change)}</div><div class="forms-grid">${TABLE_PERSONS.map(person=>`<div><span>${esc(person.label)}</span><strong>${esc(verb.forms[person.key])}</strong></div>`).join('')}</div><div class="example-sentence"><strong>Beispiel:</strong> ${esc(fullSentence(verb))}</div>${verb.note?`<div class="word-note">${esc(verb.note)}</div>`:''}<button class="btn secondary card-listen" data-act="play-card">🔊 Verb anhören</button>`;
}
function renderCards(){
  if(RUN.finished)return renderFinish();
  const verbs=newVerbs(RUN.day.day);
  const verb=verbs[RUN.index];
  const showBack=RUN.revealed||RUN.cardSolved;
  const help=RUN.tries>=3&&!RUN.cardSolved?`<div class="feedback no">Lösung: <strong>${esc(verb.v)}</strong>. Schreibe oder sprich das Wort jetzt richtig.</div>`:RUN.feedback?`<div class="feedback ${RUN.feedback.ok?'ok':'no'}">${esc(RUN.feedback.message)}</div>`:'';
  APP.innerHTML=taskShell(`<div class="task-progress-row"><span>Karte ${RUN.index+1} von ${verbs.length}</span><span>${percent(RUN.index,verbs.length)}% gespeichert</span></div><div class="mini-progress"><div style="width:${percent(RUN.index,verbs.length)}%"></div></div><div class="flip-wrap"><div class="flip-card ${showBack?'flipped':''}" data-act="reveal-card" role="button" tabindex="0"><div class="flip-face flip-front">${imageBlock(verb)}<div class="translation-box"><strong>${esc(motherLanguage())}:</strong> ${esc(translation(verb))}</div><p class="hint">Wie heißt das Verb auf Deutsch?</p></div><div class="flip-face flip-back">${flashBack(verb)}</div></div></div>${showBack?'':`<div class="actions"><button class="btn" data-act="card-mic" ${RUN.listening?'disabled':''}>${RUN.listening?'Ich höre zu …':'Sprechen'}</button><button class="btn secondary" data-act="card-write">Schreiben</button></div>${RUN.write?inputForm(false,'Schreibe den Infinitiv'):''}${RUN.tech?`<div class="tech-note">${esc(RUN.tech)}</div>`:''}${help}`}${RUN.cardSolved?`<div class="actions"><button class="btn" data-act="next-card">${RUN.index===verbs.length-1?'Weiter zur nächsten Aufgabe':'Weiter'}</button></div>`:''}`);
  bindImageFallbacks();
  if(RUN.write&&!RUN.cardSolved)requestAnimationFrame(()=>APP.querySelector('input')?.focus());
}
function currentQuestion(){return RUN.all[RUN.index]||null}
function inputForm(disabled=false,label='Schreibe deine Antwort'){return `<form id="answerForm" class="answer-form"><label>${esc(label)}</label><div class="answer-row"><input name="answer" autocomplete="off" autocapitalize="none" spellcheck="false" ${disabled?'disabled':''}><button class="btn" ${disabled?'disabled':''}>Prüfen</button></div></form>`}
function textOptions(question,disabled){return `<div class="option-grid">${question.o.map(option=>`<button class="option" data-answer="${esc(option)}" ${disabled?'disabled':''}>${esc(option)}</button>`).join('')}</div>`}
function imageOptions(question,disabled){return `<div class="image-choice-grid">${question.imageChoice.map(verb=>`<button class="image-option" data-answer="${esc(verb.v)}" aria-label="Bild auswählen" ${disabled?'disabled':''}>${imageBlock(verb,true,true)}</button>`).join('')}</div>`}
function renderQuiz(){
  const question=currentQuestion();
  if(!question){RUN.finished=true;return renderFinish()}
  const correct=RUN.correct;
  const tries=RUN.tries[question.id]||0;
  let answerArea='';
  if(question.imageChoice)answerArea=imageOptions(question,correct);
  else if(question.speech){
    if(!(window.SpeechRecognition||window.webkitSpeechRecognition))RUN.write=true;
    answerArea=`<div class="speech-box"><p>${esc(question.support)}</p><div class="actions"><button class="btn" data-act="mic" ${correct||RUN.listening?'disabled':''}>${RUN.listening?'Ich höre zu …':'Form sprechen'}</button><button class="btn secondary" data-act="write" ${correct?'disabled':''}>Stattdessen schreiben</button></div>${RUN.write?inputForm(correct,'Schreibe Pronomen und Verbform'):''}</div>`;
  }else if(question.o)answerArea=textOptions(question,correct);
  else answerArea=inputForm(correct,question.support||'Schreibe deine Antwort');
  const visual=question.imagePrompt?imageBlock(question.verb,false,true):question.smallImage?imageBlock(question.verb,true,true):'';
  const audio=question.audio?`<div class="listen-box"><button class="btn" data-act="play" ${correct?'disabled':''}>🔊 Anhören</button><span>Du kannst das Wort oft hören.</span></div>`:'';
  const wrongText=tries>=3?`Noch nicht richtig. Die Lösung ist <strong>${esc(question.a)}</strong>. Versuche es noch einmal.`:'Noch nicht richtig. Versuche es noch einmal.';
  const message=correct?'<div class="feedback ok">Richtig.</div><div class="actions"><button class="btn" data-act="next">Weiter</button></div>':RUN.feedback?`<div class="feedback no">${wrongText}</div>`:'';
  const label=question.hideVerb?'Wortschatz':question.hideChange?`${question.verb.v} · Gruppe`:`${question.verb.v}`;
  APP.innerHTML=taskShell(`<div class="task-progress-row"><span>${RUN.index} von ${RUN.all.length} gelöst</span><span>Versuche: ${tries}</span></div><div class="mini-progress"><div style="width:${percent(RUN.index,RUN.all.length)}%"></div></div><div class="question-card"><p class="eyebrow">${esc(label)}</p>${visual}${audio}<div class="question">${esc(question.p)}</div>${question.support&&!question.speech&&!question.input?`<p class="question-support">${esc(question.support)}</p>`:''}${question.verb.note?`<div class="word-note">${esc(question.verb.note)}</div>`:''}${RUN.tech?`<div class="tech-note">${esc(RUN.tech)}</div>`:''}${answerArea}${message}</div>`);
  bindImageFallbacks();
  if(!correct&&!question.o&&!question.imageChoice&&(!question.speech||RUN.write))requestAnimationFrame(()=>APP.querySelector('input')?.focus());
}
function registerFirstAttempt(question,correct){
  if(RUN.firstSeen.has(question.id))return;
  RUN.firstSeen.add(question.id);
  if(correct)RUN.firstCorrect++;
}
function answerQuestion(raw){
  const question=currentQuestion();
  if(!question||RUN.correct||!String(raw||'').trim())return;
  const accepted=question.answers||[question.a];
  const correct=accepted.some(answer=>norm(answer)===norm(raw));
  registerFirstAttempt(question,correct);
  if(correct){
    RUN.correct=true;
    RUN.feedback={ok:true};
    RUN.tech='';
  }else{
    RUN.hadWrong=true;
    RUN.tries[question.id]=(RUN.tries[question.id]||0)+1;
    RUN.feedback={ok:false};
  }
  writeRun();
  renderQuiz();
}
function nextQuestion(){
  if(!RUN.correct)return;
  RUN.index++;
  RUN.correct=false;
  RUN.feedback=null;
  RUN.tech='';
  RUN.write=false;
  RUN.listening=false;
  if(RUN.index>=RUN.all.length){
    RUN.finished=true;
    const firstScore=percent(RUN.firstCorrect,RUN.all.length);
    markDone(RUN.day.day,RUN.task,!RUN.hadWrong,firstScore);
  }else writeRun();
  renderTask();
}
function say(text,onError){
  if(!('speechSynthesis' in window)){onError?.();return}
  try{
    speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang='de-DE';
    utterance.rate=.82;
    utterance.onerror=()=>onError?.();
    speechSynthesis.speak(utterance);
  }catch(error){onError?.()}
}
function playAudio(){
  const word=currentQuestion()?.audio;
  if(!word)return;
  say(word,()=>{RUN.tech='Das Hören funktioniert hier nicht. Lies die Aufgabe.';renderQuiz()});
}
function startMicrophone(forCard=false){
  const question=forCard?null:currentQuestion();
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){
    RUN.write=true;
    RUN.tech='Das Mikrofon ist nicht da. Bitte schreibe.';
    writeRun();
    return forCard?renderCards():renderQuiz();
  }
  stopRecognition();
  let received=false;
  const run=RUN;
  try{
    RECOGNITION=new Recognition();
    RECOGNITION.lang='de-DE';
    RECOGNITION.interimResults=false;
    RECOGNITION.maxAlternatives=5;
    RUN.listening=true;
    forCard?renderCards():renderQuiz();
    RECOGNITION.onresult=event=>{
      if(RUN!==run)return;
      received=true;
      RUN.listening=false;
      const alternatives=Array.from(event.results[0]).map(result=>result.transcript);
      if(forCard){
        const verb=newVerbs(RUN.day.day)[RUN.index];
        const exact=alternatives.find(value=>norm(value)===norm(verb.v));
        answerCard(exact||alternatives[0]||'');
      }else{
        const accepted=question.answers||[question.a];
        const exact=alternatives.find(value=>accepted.some(answer=>norm(answer)===norm(value)));
        answerQuestion(exact||alternatives[0]||'');
      }
    };
    RECOGNITION.onerror=event=>{
      if(RUN!==run)return;
      RUN.listening=false;
      RUN.write=true;
      RUN.tech=event.error==='not-allowed'?'Das Mikrofon ist gesperrt. Bitte schreibe.':'Das Mikrofon hat nichts verstanden. Bitte schreibe.';
      RECOGNITION=null;
      writeRun();
      forCard?renderCards():renderQuiz();
    };
    RECOGNITION.onend=()=>{
      RECOGNITION=null;
      if(RUN!==run||received)return;
      RUN.listening=false;
      RUN.write=true;
      RUN.tech='Ich habe nichts gehört. Bitte schreibe.';
      writeRun();
      forCard?renderCards():renderQuiz();
    };
    RECOGNITION.start();
  }catch(error){
    RECOGNITION=null;
    RUN.listening=false;
    RUN.write=true;
    RUN.tech='Das Mikrofon startet nicht. Bitte schreibe.';
    writeRun();
    forCard?renderCards():renderQuiz();
  }
}
function answerCard(raw){
  const verb=newVerbs(RUN.day.day)[RUN.index];
  if(RUN.cardSolved||!String(raw||'').trim())return;
  if(norm(raw)===norm(verb.v)){
    RUN.cardSolved=true;
    RUN.revealed=true;
    RUN.feedback={ok:true,message:'Richtig.'};
    RUN.tech='';
  }else{
    RUN.tries++;
    RUN.hadWrong=true;
    RUN.feedback={ok:false,message:'Noch nicht richtig. Versuche es noch einmal.'};
  }
  writeRun();
  renderCards();
}
function revealCard(){
  if(RUN.cardSolved)return;
  RUN.revealed=true;
  RUN.cardSolved=true;
  RUN.hadWrong=true;
  writeRun();
  renderCards();
}
function finishCard(){
  const verbs=newVerbs(RUN.day.day);
  if(!RUN.cardSolved)return;
  if(RUN.index===verbs.length-1){
    RUN.finished=true;
    markDone(RUN.day.day,'cards',!RUN.hadWrong,100);
    return renderFinish();
  }
  RUN.index++;
  RUN.revealed=false;
  RUN.cardSolved=false;
  RUN.tries=0;
  RUN.feedback=null;
  RUN.write=false;
  RUN.tech='';
  writeRun();
  renderCards();
}
function nextTaskId(){
  const index=TASK_IDS.indexOf(RUN.task);
  for(let i=index+1;i<TASK_IDS.length;i++){
    if(TASK_IDS[i]!=='exam'||examUnlocked(RUN.day.day))return TASK_IDS[i];
  }
  return '';
}
function renderFinish(){
  const firstScore=RUN.task==='cards'?100:percent(RUN.firstCorrect,RUN.all.length);
  const next=nextTaskId();
  const practiceIsComplete=practiceComplete(RUN.day.day);
  const dayIsComplete=dayComplete(RUN.day.day);
  const nextDay=RUN.day.day<DAYS.length?RUN.day.day+1:null;
  const notice=RUN.task!=='exam'&&practiceIsComplete?'<div class="day-unlocked"><strong>Alle Lernaufgaben sind zu 100% fertig.</strong> Die Prüfung ist jetzt offen.</div>':RUN.task==='exam'&&dayIsComplete?`<div class="day-unlocked"><strong>Tag ${RUN.day.day} ist fertig.</strong>${nextDay?` Tag ${nextDay} ist jetzt offen.`:' Du hast alle Tage beendet.'}</div>`:'';
  const finishButton=next?'<button class="btn" data-act="continue">Weiter</button>':RUN.task==='exam'&&nextDay?'<button class="btn" data-act="next-day">Weiter</button>':'<button class="btn" data-act="back">Zur Übersicht</button>';
  APP.innerHTML=taskShell(`<div class="finish-box"><div class="finish-icon">✓</div><h3>Aufgabe fertig</h3><p>Du hast alle Fragen richtig gelöst.</p>${RUN.task!=='cards'?`<p class="small">Beim ersten Versuch waren ${firstScore}% richtig.</p>`:''}${notice}<div class="actions">${finishButton}</div></div>`);
}

APP.onclick=event=>{
  const summary=event.target.closest('summary[data-day-summary]');
  if(summary){
    const target=+summary.dataset.daySummary;
    if(!dayUnlocked(target)){event.preventDefault();return}
    if(target!==+STATE.selectedDay){
      event.preventDefault();
      STATE.selectedDay=target;
      saveState();
      setUrl(null,false);
      return home(false,'',true);
    }
    setTimeout(()=>{if(summary.parentElement.open)scrollToElement(`#day-tasks-${target}`,'start')},40);
    return;
  }
  const flip=event.target.closest('[data-act="reveal-card"]');
  if(flip&&!event.target.closest('button'))return revealCard();
  const button=event.target.closest('button');
  if(!button)return;
  if(button.dataset.task)return openTask(button.dataset.task);
  if(button.dataset.answer)return answerQuestion(button.dataset.answer);
  const action=button.dataset.act;
  if(action==='back'){
    const task=RUN?.task||sessionStorage.getItem('SP_IRREGULAR_RETURN_TASK')||'';
    return home(true,task);
  }
  if(action==='card-write'){RUN.write=true;RUN.tech='';writeRun();return renderCards()}
  if(action==='card-mic')return startMicrophone(true);
  if(action==='reveal-card')return revealCard();
  if(action==='play-card'){
    event.stopPropagation();
    const verb=newVerbs(RUN.day.day)[RUN.index];
    return say(verb.v,()=>{RUN.tech='Das Hören funktioniert hier nicht.';renderCards()});
  }
  if(action==='next-card')return finishCard();
  if(action==='next')return nextQuestion();
  if(action==='write'){RUN.write=true;RUN.tech='';writeRun();return renderQuiz()}
  if(action==='mic')return startMicrophone(false);
  if(action==='play')return playAudio();
  if(action==='continue'){
    const next=nextTaskId();
    return next?openTask(next,true):home(true,RUN.task);
  }
  if(action==='next-day'){
    const next=RUN.day.day+1;
    if(!dayUnlocked(next))return home(true,RUN.task);
    STATE.selectedDay=next;
    saveState();
    setUrl(null,false);
    return home(false,'',true);
  }
};
APP.onsubmit=event=>{
  if(event.target.id!=='answerForm')return;
  event.preventDefault();
  const value=new FormData(event.target).get('answer');
  RUN.task==='cards'?answerCard(value):answerQuestion(value);
};
APP.onkeydown=event=>{
  if(event.target.closest('.flip-card')&&(event.key==='Enter'||event.key===' ')){
    event.preventDefault();
    revealCard();
  }
};
window.onpopstate=()=>{
  stopRecognition();
  const params=new URLSearchParams(location.search);
  const requested=+params.get('day');
  STATE.selectedDay=DAYS.some(day=>day.day===requested)&&dayUnlocked(requested)?requested:highestUnlocked();
  const task=params.get('task');
  if((taskMeta(task)&&task!=='exam')||(task==='exam'&&examUnlocked(STATE.selectedDay)))openTask(task,false);
  else home(false,sessionStorage.getItem('SP_IRREGULAR_RETURN_TASK')||'');
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
  if(taskMeta(task)&&(task!=='exam'||examUnlocked(STATE.selectedDay)))openTask(task,false);
  else home(false,'');
}
init().catch(error=>{
  console.error(error);
  APP.innerHTML='<section class="card locked-card"><h2>Die Seite lädt nicht.</h2><button class="btn" onclick="location.reload()">Neu laden</button></section>';
});