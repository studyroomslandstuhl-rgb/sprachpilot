import {getActiveProfile,getActiveRole,loginUrlForCurrent,dashboardHref,logout} from "/js/auth.js?v=login-main-4";

const VERBS=(window.SP_FI_VERBS||[]).map((v,i)=>({...v,index:i+1}));
const GROUP_SIZE=Number(window.SP_FI_VERB_GROUP_SIZE)||20;
const GROUPS=[];
for(let i=0;i<VERBS.length;i+=GROUP_SIZE)GROUPS.push({id:GROUPS.length+1,verbs:VERBS.slice(i,i+GROUP_SIZE)});

const TASKS=[
 ["cards","Aa","Karteikarten"],
 ["meaning-to-verb","B→V","Bedeutung → Verb"],
 ["verb-to-meaning","V→B","Verb → Bedeutung"],
 ["listen","🔊","Hören → Verb"],
 ["image-to-verb","▣","Bild → Verb"],
 ["verb-to-image","V→▣","Verb → Bild"],
 ["read-sentence","📖","Lesen → Verb"],
 ["verb-type","↔","Verbtyp"],
 ["choose-form","du","Form auswählen"],
 ["write-form","✎","Form schreiben"],
 ["speak-form","🎙","Form sprechen"],
 ["sentence","…","Satz ergänzen"],
 ["exam","★","Gruppenprüfung"]
];
const LEARN=TASKS.slice(0,-1).map(x=>x[0]);
const TITLE=Object.fromEntries(TASKS.map(x=>[x[0],x[2]]));
const PERSONS=[['minä',0],['sinä',1],['hän',2],['me',3],['te',4],['he',5]].map(([label,i])=>({label,i}));

const app=document.querySelector('#app');
const topbar=document.querySelector('#topbar');
const role=String(getActiveRole()||'').toLowerCase();
const profile=getActiveProfile();
if(!profile&&role!=='teacher')location.href=loginUrlForCurrent();
window.logout=logout;

let rec=null;
let currentQuestion=null;
let lockedAnswer=false;
const preview=()=>role==='teacher';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').trim().toLocaleLowerCase('fi-FI').normalize('NFC').replace(/[.,!?;:“”"'`´()…]/g,'').replace(/\s+/g,' ');
const slug=v=>String(v||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^sich\s+/,'sich_').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const optionSet=(correct,pool,n=4)=>shuffle([correct,...shuffle(pool.filter(x=>norm(x)!==norm(correct))).slice(0,n-1)]);
function speak(text,slow=false){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='fi-FI';u.rate=slow?.55:.92;speechSynthesis.speak(u)}
function stopMic(){if(rec)try{rec.abort()}catch{}rec=null}

function imageCandidates(v){
 const key=v.img||slug(v.de),out=[];
 try{if(typeof window.SP_VERB_IMAGE_OVERRIDE==='function'){const u=window.SP_VERB_IMAGE_OVERRIDE(v.de);if(u)out.push(u)}}catch{}
 out.push(`https://sprachpilot.b-cdn.net/${encodeURIComponent(key)}.webp`);
 out.push(`https://sprachpilot.b-cdn.net/Neu/${encodeURIComponent(key)}.webp`);
 return [...new Set(out.filter(Boolean))];
}
function image(v,compact=false){return `<div class="verb-image ${compact?'compact':''}"><img data-fi-image="1" data-fi-verb-index="${v.index-1}" alt="Bild zu ${esc(v.fi)}"><div class="image-fallback" hidden><strong>${esc(v.fi)}</strong><span>${esc(v.de)}</span></div></div>`}
function bindImages(root=document){
 root.querySelectorAll('img[data-fi-image="1"]').forEach(img=>{
  if(img.dataset.fiBound==='1')return;
  img.dataset.fiBound='1';
  const v=VERBS[Number(img.dataset.fiVerbIndex)];
  if(!v)return;
  const list=imageCandidates(v);let pos=0;
  const fail=()=>{pos++;if(pos<list.length){img.src=list[pos];return}img.hidden=true;const fb=img.nextElementSibling;if(fb)fb.hidden=false};
  img.addEventListener('error',fail);
  img.hidden=false;
  if(list.length)img.src=list[0];else fail();
 });
}

const FORMS={
 rakastaa:['rakastan','rakastat','rakastaa','rakastamme','rakastatte','rakastavat'],
 ostaa:['ostan','ostat','ostaa','ostamme','ostatte','ostavat'],
 ymmärtää:['ymmärrän','ymmärrät','ymmärtää','ymmärrämme','ymmärrätte','ymmärtävät'],
 tarvita:['tarvitsen','tarvitset','tarvitsee','tarvitsemme','tarvitsette','tarvitsevat'],
 kuulla:['kuulen','kuulet','kuulee','kuulemme','kuulette','kuulevat'],
 oppia:['opin','opit','oppii','opimme','opitte','oppivat'],
 asua:['asun','asut','asuu','asumme','asutte','asuvat'],
 tuoda:['tuon','tuot','tuo','tuomme','tuotte','tuovat'],
 olla:['olen','olet','on','olemme','olette','ovat'],
 kirjoittaa:['kirjoitan','kirjoitat','kirjoittaa','kirjoitamme','kirjoitatte','kirjoittavat'],
 valokuvata:['valokuvaan','valokuvaat','valokuvaa','valokuvaamme','valokuvaatte','valokuvaavat'],
 soittaa:['soitan','soitat','soittaa','soitamme','soitatte','soittavat'],
 kokata:['kokkaan','kokkaat','kokkaa','kokkaamme','kokkaatte','kokkaavat'],
 elää:['elän','elät','elää','elämme','elätte','elävät'],
 tulla:['tulen','tulet','tulee','tulemme','tulette','tulevat'],
 tavata:['tapaan','tapaat','tapaa','tapaamme','tapaatte','tapaavat'],
 mennä:['menen','menet','menee','menemme','menette','menevät'],
 uida:['uin','uit','ui','uimme','uitte','uivat'],
 etsiä:['etsin','etsit','etsii','etsimme','etsitte','etsivät'],
 tilata:['tilaan','tilaat','tilaa','tilaamme','tilaatte','tilaavat']
};
function verbType(w){w=String(w||'').toLocaleLowerCase('fi-FI');if(/(da|dä)$/.test(w))return 2;if(/(lla|llä|nna|nnä|rra|rrä|sta|stä)$/.test(w))return 3;if(/(ita|itä)$/.test(w))return 5;if(/(eta|etä)$/.test(w))return 6;if(/(ata|ätä|ota|ötä|uta|ytä)$/.test(w))return 4;return 1}
function harmony(w){return /[äöy]/.test(w)&&!/[aou]/.test(w)?'ä':'a'}
function genericForms(w){
 if(w==='tehdä')return['teen','teet','tekee','teemme','teette','tekevät'];
 if(w==='nähdä')return['näen','näet','näkee','näemme','näette','näkevät'];
 const t=verbType(w),a=harmony(w),vat=a==='ä'?'vät':'vat';
 if(t===2){const s=w.slice(0,-2);return[s+'n',s+'t',s,s+'mme',s+'tte',s+vat]}
 if(t===3){const s=w.slice(0,-1).replace(/ll$/,'l').replace(/nn$/,'n').replace(/rr$/,'r').replace(/st$/,'s')+'e';return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat]}
 if(t===5){const s=w.slice(0,-2)+'tse';return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat]}
 if(t===6){const s=w.slice(0,-2)+'ne';return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat]}
 return null;
}
const formsFor=v=>FORMS[v.fi]||genericForms(v.fi);
const grammarTargets=g=>{const x=g.verbs.filter(v=>Array.isArray(formsFor(v)));return x.length?x:g.verbs};
const personFor=v=>PERSONS[(v.index-1)%6];

const userSlug=()=>[profile?.email,profile?.courseCode,profile?.kurs,profile?.kursnummer,profile?.vorname,profile?.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
const storageKey=()=>`SP_FI_VERB_GROUPS_PROGRESS_${userSlug()}`;
const blankTask=()=>({done:[],queue:[],current:null,tries:0,hadWrong:false});
const blankRun=()=>({tasks:{},awards:{tasks:{},examPoints:0,examPercent:0},exam:{bestPercent:0,stars:0,session:null}});
const blankGroup=()=>({currentRun:1,runs:{'1':blankRun()}});
let state=load();
function load(){try{return JSON.parse(localStorage.getItem(storageKey())||'{}')||{}}catch{return{}}}
function save(){if(preview())return;try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch{}}
function gs(id){const k=String(id);if(!state[k])state[k]=blankGroup();if(!state[k].runs)state[k].runs={'1':blankRun()};return state[k]}
function run(id){const g=gs(id),k=String(g.currentRun||1);if(!g.runs[k])g.runs[k]=blankRun();return g.runs[k]}
function st(id,task){const r=run(id);if(!r.tasks[task])r.tasks[task]=blankTask();const s=r.tasks[task];s.done=Array.isArray(s.done)?s.done:[];s.queue=Array.isArray(s.queue)?s.queue:[];s.current=s.current||null;s.tries=Number(s.tries)||0;s.hadWrong=!!s.hadWrong;return s}
function targets(id,task){const g=GROUPS[id-1];if(!g)return[];return['choose-form','write-form','speak-form','sentence'].includes(task)?grammarTargets(g):g.verbs}
function byDe(id,task,de){return targets(id,task).find(v=>v.de===de)||null}
function percent(id,task){const t=targets(id,task),d=new Set(st(id,task).done);return t.length?Math.round(t.filter(v=>d.has(v.de)).length*100/t.length):100}
const done=(id,task)=>percent(id,task)>=100;
const learnDone=id=>LEARN.every(t=>done(id,t));
function next(id,task){
 const s=st(id,task),t=targets(id,task);
 if(s.current&&!s.done.includes(s.current))return byDe(id,task,s.current);
 if(!s.queue.length)s.queue=shuffle(t.filter(v=>!s.done.includes(v.de)).map(v=>v.de));
 s.current=s.queue.shift()||null;s.tries=0;s.hadWrong=false;save();return byDe(id,task,s.current);
}
function wrong(id,task){const s=st(id,task);s.tries++;s.hadWrong=true;save();return s.tries}
function right(id,task){
 const s=st(id,task),de=s.current;if(!de)return {repeated:false};
 const repeated=s.hadWrong||s.tries>0;
 if(repeated){if(!s.done.includes(de)&&!s.queue.includes(de))s.queue.push(de)}else if(!s.done.includes(de))s.done.push(de);
 s.current=null;s.tries=0;s.hadWrong=false;
 if(done(id,task)&&!run(id).awards.tasks[task])run(id).awards.tasks[task]=5*(gs(id).currentRun||1);
 save();return{repeated};
}
function skipAsWrong(id,task){wrong(id,task);return right(id,task)}
function points(id){return Object.values(gs(id).runs||{}).reduce((a,r)=>a+Object.values(r.awards?.tasks||{}).reduce((x,n)=>x+(Number(n)||0),0)+(Number(r.awards?.examPoints)||0),0)}
const totalPoints=()=>GROUPS.reduce((n,g)=>n+points(g.id),0);
const stars=p=>p>=100?3:p>=70?2:p>=50?1:0;

function route(){const q=new URLSearchParams(location.search),group=Math.max(0,Math.min(GROUPS.length,Number(q.get('group'))||0)),raw=q.get('task')||'',task=TASKS.some(x=>x[0]===raw)?raw:'',view=q.get('view')==='overview'?'overview':'';return{group,task,view}}
function href(group=0,task='',view=''){const q=new URLSearchParams();if(group)q.set('group',group);if(task)q.set('task',task);if(view)q.set('view',view);return'/finnisch/verben/'+(q.toString()?'?'+q.toString():'')}
function go(x={}){history.pushState(null,'',href(x.group||0,x.task||'',x.view||''));render()}

function header(r){
 const p=profile||{},name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(' ')||(preview()?'Lehrer-Vorschau':'Schüler');
 const back=r.task&&r.group?href(r.group):(r.group||r.view?href():'/finnisch/');
 topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/finnisch/"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>Verben</h1><p>${VERBS.length} Verben · ${GROUPS.length} Gruppen</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a><button class="btn secondary" data-action="logout">Abmelden</button></div></div><nav class="topnav"><a class="btn secondary" href="${back}">Zurück</a>${!r.task?`<button class="btn secondary ${r.view==='overview'?'active-nav':''}" data-action="overview">Übersicht</button>`:''}${r.group&&!r.task?`<button class="btn danger-btn" data-action="reset-group" data-group="${r.group}">Fortschritt löschen</button>`:''}</nav>`;
}
const previewNote=()=>preview()?'<div class="preview-note">Lehrer-Vorschau · nichts wird gespeichert</div>':'';
function score(id=0){if(preview())return'';if(!id)return`<section class="card score-card compact-score"><h2>${totalPoints()} Punkte</h2><span>gesamt</span></section>`;const r=run(id),sum=Object.values(r.awards.tasks||{}).reduce((a,n)=>a+(Number(n)||0),0);return`<section class="card score-card"><div><p class="eyebrow">Gruppe ${id}</p><h2>Runde ${gs(id).currentRun||1} von 3</h2><p>${sum} Aufgabenpunkte · ${Number(r.awards.examPoints)||0} Prüfungspunkte</p></div><div class="score-total">${points(id)}<span>Punkte</span></div></section>`}
function taskCards(id){const r=run(id);return TASKS.map((t,i)=>{const exam=t[0]==='exam',open=!exam||learnDone(id),p=exam?Number(r.exam.bestPercent)||0:percent(id,t[0]);return`<button class="task-card ${p>=100?'done-card':''} ${!open?'locked-task':''}" data-action="task" data-group="${id}" data-task="${t[0]}" ${open?'':'disabled'}><span class="task-number">${i+1}</span><span class="task-icon">${open?t[1]:'🔒'}</span><span class="task-title">${t[2]}</span><div class="task-mini-progress"><span style="width:${p}%"></span></div><span class="task-status">${open?(p>=100?'Fertig':p?`${p}%`:'Starten'):'Gesperrt'}</span></button>`}).join('')}
function panels(selected=0){return GROUPS.map(g=>{const r=run(g.id),count=LEARN.filter(t=>done(g.id,t)).length,open=selected===g.id;return`<details class="group-panel" data-group-panel="${g.id}" ${open?'open':''}><summary data-action="group" data-group="${g.id}"><span class="group-number">Gruppe ${g.id}</span><span>${g.verbs.length} Verben</span><span>Runde ${gs(g.id).currentRun||1}/3</span><span>${count}/${LEARN.length} · Prüfung ${Number(r.exam.bestPercent)||0}%</span></summary><div class="group-body"><div class="task-grid">${taskCards(g.id)}</div></div></details>`}).join('')}
function renderHome(selected=0){app.innerHTML=`${previewNote()}${score(selected)}<section class="card"><div class="section-head"><h2>Gruppen</h2><span class="overview-total">${VERBS.length} Verben</span></div><div class="groups-accordion">${panels(selected)}</div></section>`;if(selected)setTimeout(()=>document.querySelector(`[data-group-panel="${selected}"]`)?.scrollIntoView({behavior:'smooth',block:'start'}),50)}
function renderOverview(){app.innerHTML=`${previewNote()}<section class="card"><div class="section-head"><h2>Übersicht</h2><span class="overview-total">${VERBS.length} Verben</span></div><div class="overview-grid">${VERBS.map(v=>`<article class="overview-verb-card">${image(v,true)}<div class="overview-verb-text"><span class="group-badge">Gruppe ${Math.floor((v.index-1)/GROUP_SIZE)+1}</span><h3>${esc(v.fi)}</h3><p>${esc(v.de)}</p><button class="audio-mini" data-action="audio" data-text="${esc(v.fi)}">🔊</button></div></article>`).join('')}</div></section>`}
function progress(id,task){const t=targets(id,task),d=new Set(st(id,task).done),n=t.filter(v=>d.has(v.de)).length,p=percent(id,task);return`<div class="task-progress-row"><span>${n} richtig · ${Math.max(0,t.length-n)} übrig</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div>`}
function grammarBox(task){if(!['verb-type','choose-form','write-form','speak-form','sentence'].includes(task))return'';const text=task==='verb-type'?'Finnische Verben werden nach ihrer Infinitiv-Endung in sechs Verbtypen eingeteilt. Achte auf die Endung des Verbs.':'Im Finnischen verändert sich das Verb nach der Person. Die Personalpronomen sind minä, sinä, hän, me, te und he.';return`<div class="question-support"><strong>Grammatik:</strong> ${esc(text)}</div>`}
function taskPage(id,task,body){return`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${id}</p><h2>${esc(TITLE[task])}</h2></div></div>${grammarBox(task)}${progress(id,task)}<div class="question-card">${body}<div id="feedback"></div><div id="afterAnswer" class="actions"></div></div></section>`}
function setFeedback(type,html){const el=document.querySelector('#feedback');if(!el)return;el.className='feedback '+type;el.innerHTML=html}
function setAfter(html=''){const el=document.querySelector('#afterAnswer');if(el)el.innerHTML=html}
function disableAnswers(){document.querySelectorAll('.option,.image-option,#checkInput,#speakAnswer,#answerInput').forEach(el=>el.disabled=true)}
function nextButton(id,task,label='Weiter'){setAfter(`<button class="btn" id="nextBtn">${label}</button>`);document.querySelector('#nextBtn')?.addEventListener('click',()=>renderTask(id,task))}
function mc(opts){return`<div class="option-grid">${opts.map(o=>`<button class="option" data-answer="${esc(o.value)}">${esc(o.label)}</button>`).join('')}</div>`}
function imgs(opts){return`<div class="image-choice-grid">${opts.map(v=>`<button class="image-option" data-answer="${esc(v.de)}">${image(v,true)}</button>`).join('')}</div>`}
function input(ph='Antwort schreiben'){return`<div class="answer-form"><div class="answer-row"><input id="answerInput" autocomplete="off" autocapitalize="none" placeholder="${esc(ph)}"><button class="btn" id="checkInput">Kontrollieren</button></div></div>`}

function renderCards(id){
 const task='cards',v=next(id,task);if(!v)return finish(id,task);lockedAnswer=false;currentQuestion={v,answer:v.fi};
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${id}</p><h2>Karteikarten</h2></div></div>${progress(id,task)}<div class="flip-wrap"><div id="verbFlipCard" class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-face flip-front">${image(v)}</div><div class="flip-face flip-back"><div class="flip-word">${esc(v.fi)}</div><div class="flip-note">Lösung</div><button type="button" class="btn secondary card-listen-btn" id="cardListenBtn">🔊 Anhören</button></div></div></div><div class="hint card-translation">Übersetzung: <b>${esc(v.de)}</b></div><div class="actions card-actions"><button id="cardMicBtn" type="button" class="btn">Sprechen</button><button id="cardWriteBtn" type="button" class="btn secondary">Schreiben</button></div><div id="cardMicStatus" class="small card-mic-status"></div><div id="cardAnswerBox" class="card-answer-box" hidden><div class="answer-row"><input id="cardAnswerInput" autocomplete="off" autocapitalize="none" placeholder="Verb schreiben"><button id="cardCheckBtn" type="button" class="btn">Kontrollieren</button></div></div><div id="cardFeedback"></div><div id="cardAfter" class="actions card-actions"></div></section>`;
 bindImages(app);
 const card=document.querySelector('#verbFlipCard');
 const reveal=()=>{if(lockedAnswer||card.dataset.used==='1')return;card.dataset.used='1';card.classList.add('flipped');skipAsWrong(id,task);lockedAnswer=true;const f=document.querySelector('#cardFeedback');f.className='feedback no';f.textContent='Als Hilfe aufgedeckt. Diese Karte wird später wiederholt.';document.querySelector('#cardMicBtn').disabled=true;document.querySelector('#cardWriteBtn').disabled=true;const a=document.querySelector('#cardAfter');a.innerHTML='<button type="button" class="btn" id="cardHelpNext">Weiter</button>';document.querySelector('#cardHelpNext').onclick=()=>renderCards(id)};
 card.addEventListener('click',e=>{if(!e.target.closest('button,input,a'))reveal()});
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();reveal()}});
 document.querySelector('#cardListenBtn').onclick=e=>{e.stopPropagation();speak(v.fi)};
 document.querySelector('#cardMicBtn').onclick=()=>speech(x=>checkCard(id,x));
 document.querySelector('#cardWriteBtn').onclick=()=>{document.querySelector('#cardAnswerBox').hidden=false;document.querySelector('#cardAnswerInput').focus()};
 document.querySelector('#cardCheckBtn').onclick=()=>checkCard(id,document.querySelector('#cardAnswerInput').value);
 document.querySelector('#cardAnswerInput').onkeydown=e=>{if(e.key==='Enter')checkCard(id,e.target.value)};
}
function checkCard(id,value){
 if(lockedAnswer||!currentQuestion)return;const v=currentQuestion.v;
 if(norm(value)===norm(v.fi)){
  const result=right(id,'cards');lockedAnswer=true;document.querySelector('#verbFlipCard')?.classList.add('flipped');const f=document.querySelector('#cardFeedback');f.className='feedback ok';f.textContent=result.repeated?'Richtig. Diese Karte wird später noch einmal wiederholt.':'Richtig!';document.querySelector('#cardMicBtn').disabled=true;document.querySelector('#cardWriteBtn').disabled=true;const a=document.querySelector('#cardAfter');a.innerHTML='<button type="button" class="btn" id="cardNextBtn">Weiter</button>';document.querySelector('#cardNextBtn').onclick=()=>renderCards(id);return;
 }
 const n=wrong(id,'cards');const f=document.querySelector('#cardFeedback');f.className='feedback no';f.innerHTML=n===1?'Noch nicht richtig.':n===2?`Hilfe: Das Wort beginnt mit „${esc(v.fi.charAt(0))}“.`:`Lösung: <strong>${esc(v.fi)}</strong>`;
 if(n>=3){right(id,'cards');lockedAnswer=true;document.querySelector('#cardMicBtn').disabled=true;document.querySelector('#cardWriteBtn').disabled=true;const a=document.querySelector('#cardAfter');a.innerHTML='<button type="button" class="btn" id="cardNextBtn">Weiter</button>';document.querySelector('#cardNextBtn').onclick=()=>renderCards(id)}
}
function speech(cb){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){const e=document.querySelector('#feedback')||document.querySelector('#cardMicStatus');if(e)e.textContent='Mikrofon wird nicht unterstützt. Bitte schreibe die Antwort.';return}try{stopMic();rec=new SR();rec.lang='fi-FI';rec.interimResults=false;rec.maxAlternatives=5;rec.onresult=e=>{const vals=Array.from(e.results?.[0]||[]).map(x=>x.transcript);cb(vals[0]||'')};rec.onerror=()=>{const x=document.querySelector('#feedback')||document.querySelector('#cardMicStatus');if(x)x.textContent='Mikrofon hat nicht funktioniert. Bitte schreibe die Antwort.'};rec.onend=()=>rec=null;rec.start()}catch{}}

function question(id,task,v){
 const g=GROUPS[id-1],fi=g.verbs.map(x=>x.fi),de=g.verbs.map(x=>x.de);
 if(task==='meaning-to-verb')return{kind:'mc',prompt:`Was heißt „${v.de}“ auf Finnisch?`,answer:v.fi,options:optionSet(v.fi,fi).map(x=>({value:x,label:x})),hint:`Das finnische Wort beginnt mit „${v.fi.charAt(0)}“.`};
 if(task==='verb-to-meaning')return{kind:'mc',prompt:`Was bedeutet „${v.fi}“?`,answer:v.de,options:optionSet(v.de,de).map(x=>({value:x,label:x})),hint:`Die deutsche Bedeutung beginnt mit „${v.de.charAt(0)}“.`};
 if(task==='listen')return{kind:'mc',prompt:'Höre und wähle das richtige finnische Verb.',answer:v.fi,audio:v.fi,options:optionSet(v.fi,fi).map(x=>({value:x,label:x})),hint:`Das Wort beginnt mit „${v.fi.charAt(0)}“.`};
 if(task==='image-to-verb')return{kind:'mc',prompt:'Welches finnische Verb passt zum Bild?',answer:v.fi,image:v,options:optionSet(v.fi,fi).map(x=>({value:x,label:x})),hint:`Das Wort beginnt mit „${v.fi.charAt(0)}“.`};
 if(task==='verb-to-image')return{kind:'images',prompt:`Welches Bild passt zu „${v.fi}“?`,answer:v.de,options:shuffle([v,...shuffle(g.verbs.filter(x=>x.de!==v.de)).slice(0,3)]),hint:`Die deutsche Bedeutung ist „${v.de}“.`};
 if(task==='read-sentence')return{kind:'mc',prompt:`Lies: „Haluan ${v.fi}.“ Was bedeutet das Verb?`,answer:v.de,options:optionSet(v.de,de).map(x=>({value:x,label:x})),hint:`${v.fi} bedeutet „${v.de}“.`};
 if(task==='verb-type'){const t=verbType(v.fi);return{kind:'mc',prompt:`Zu welchem finnischen Verbtyp gehört „${v.fi}“?`,answer:String(t),options:[1,2,3,4,5,6].map(n=>({value:String(n),label:`Verbtyp ${n}`})),hint:`Achte auf die Infinitiv-Endung von „${v.fi}“.`}}
 if(['choose-form','write-form','speak-form','sentence'].includes(task)){
  const forms=formsFor(v),p=personFor(v),answer=forms?.[p.i]||v.fi;
  if(task==='choose-form'){const pool=forms?forms.filter((x,i)=>i!==p.i):fi;return{kind:'mc',prompt:`${p.label} — ${v.fi}. Wähle die richtige Präsensform.`,answer,options:optionSet(answer,pool).map(x=>({value:x,label:x})),hint:`Gesucht ist die Form für „${p.label}“.`}}
  if(task==='write-form')return{kind:'input',prompt:`Schreibe die Präsensform: ${p.label} — ${v.fi}`,answer,hint:`Gesucht ist die Form für „${p.label}“.`};
  if(task==='speak-form')return{kind:'speech',prompt:`Sprich die Präsensform: ${p.label} — ${v.fi}`,answer,hint:`Gesucht ist die Form für „${p.label}“.`};
  return{kind:'input',prompt:`Ergänze: ${p.label} ___ nyt. (${v.de}; Infinitiv: ${v.fi})`,answer,hint:`Setze ${v.fi} in die Form für „${p.label}“.`};
 }
 return null;
}
function renderTask(id,task){
 if(task==='cards')return renderCards(id);
 if(task==='exam')return renderExam(id);
 if(done(id,task))return finish(id,task);
 const v=next(id,task);if(!v)return finish(id,task);const q=question(id,task,v);currentQuestion={...q,v};lockedAnswer=false;
 let media=q.image?image(q.image):q.audio?`<div class="listen-box"><button class="btn" id="playAudio">🔊 Hören</button><button class="btn secondary" id="playSlow">Langsam</button></div>`:'';
 let answer='';if(q.kind==='mc')answer=mc(q.options);else if(q.kind==='images')answer=imgs(q.options);else if(q.kind==='input')answer=input();else if(q.kind==='speech')answer=`<div class="speech-box"><div class="actions"><button class="btn" id="speakAnswer">🎤 Sprechen</button><button class="btn secondary" id="writeFallback">✍️ Schreiben</button></div><div id="micStatus" class="small"></div><div id="writeBox" class="answer-form hidden">${input('Verbform schreiben')}</div></div>`;
 app.innerHTML=taskPage(id,task,`${media}<div class="question">${esc(q.prompt)}</div>${answer}`);bindImages(app);
 document.querySelector('#playAudio')?.addEventListener('click',()=>speak(q.audio));document.querySelector('#playSlow')?.addEventListener('click',()=>speak(q.audio,true));
 document.querySelectorAll('.option[data-answer],.image-option[data-answer]').forEach(b=>b.addEventListener('click',()=>check(id,task,b.dataset.answer)));
 const inp=document.querySelector('#answerInput');document.querySelector('#checkInput')?.addEventListener('click',()=>check(id,task,inp?.value||''));inp?.addEventListener('keydown',e=>{if(e.key==='Enter')check(id,task,e.target.value)});
 document.querySelector('#speakAnswer')?.addEventListener('click',()=>speech(x=>check(id,task,x)));
 document.querySelector('#writeFallback')?.addEventListener('click',()=>{document.querySelector('#writeBox')?.classList.remove('hidden');setTimeout(()=>document.querySelector('#answerInput')?.focus(),20)});
}
function check(id,task,value){
 if(lockedAnswer||!currentQuestion)return;const q=currentQuestion;
 if(norm(value)===norm(q.answer)){
  const result=right(id,task);lockedAnswer=true;setFeedback('ok',result.repeated?'Richtig. Diese Aufgabe wird später noch einmal wiederholt.':'Richtig!');disableAnswers();nextButton(id,task);return;
 }
 const n=wrong(id,task);if(n===1)setFeedback('no','Noch nicht richtig.');else if(n===2)setFeedback('no',`Hilfe: ${esc(q.hint||`Die Lösung beginnt mit „${String(q.answer).charAt(0)}“.`)}`);else{setFeedback('no',`Lösung: <strong>${esc(q.answer)}</strong>`);right(id,task);lockedAnswer=true;disableAnswers();nextButton(id,task)}
}
function finish(id,task){const p=Number(run(id).awards.tasks[task])||0;app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>Gut gemacht!</h2><p>${p} Punkte · Runde ${gs(id).currentRun||1}</p></div></section>`}

function examQuestions(id){const g=GROUPS[id-1];return g.verbs.map((v,i)=>{const modes=['meaning-to-verb','verb-to-meaning','listen','image-to-verb','verb-type','choose-form','write-form','sentence'],task=modes[i%modes.length],q=question(id,task,v);return{...q,imageDe:q.image?.de||'',audio:q.audio||'',verbDe:v.de}}).slice(0,20)}
function renderExam(id){
 if(!learnDone(id)){app.innerHTML=`<section class="card locked-card"><h2>🔒 Gruppenprüfung</h2><p>Die Prüfung wird freigeschaltet, wenn alle Lernaufgaben 100 % erreicht haben.</p></section>`;return}
 const r=run(id);if(!r.exam.session)r.exam.session={index:0,correct:0,questions:examQuestions(id)};const s=r.exam.session;if(s.index>=s.questions.length)return finishExam(id);const q=s.questions[s.index],v=q.imageDe?GROUPS[id-1].verbs.find(x=>x.de===q.imageDe):null;
 let media=v?image(v):q.audio?`<div class="listen-box"><button class="btn" id="examAudio">🔊 Hören</button><button class="btn secondary" id="examSlow">Langsam</button></div>`:'';
 let answer=q.kind==='mc'?mc(q.options):q.kind==='input'?input():'';
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${id}</p><h2>★ Gruppenprüfung</h2></div></div><div class="task-progress-row"><span>Frage ${s.index+1} von ${s.questions.length}</span><strong>${s.correct} richtig</strong></div><div class="question-card">${media}<div class="question">${esc(q.prompt)}</div>${answer}</div></section>`;bindImages(app);
 document.querySelector('#examAudio')?.addEventListener('click',()=>speak(q.audio));document.querySelector('#examSlow')?.addEventListener('click',()=>speak(q.audio,true));
 const answerExam=value=>{if(norm(value)===norm(q.answer))s.correct++;s.index++;save();renderExam(id)};
 document.querySelectorAll('.option[data-answer]').forEach(b=>b.addEventListener('click',()=>answerExam(b.dataset.answer)));const inp=document.querySelector('#answerInput');document.querySelector('#checkInput')?.addEventListener('click',()=>answerExam(inp?.value||''));inp?.addEventListener('keydown',e=>{if(e.key==='Enter')answerExam(e.target.value)});
}
function finishExam(id){const r=run(id),s=r.exam.session,total=s?.questions?.length||20,p=Math.round((Number(s?.correct)||0)*100/total),star=stars(p),old=Number(r.exam.bestPercent)||0;if(p>old){r.exam.bestPercent=p;r.exam.stars=star;r.awards.examPercent=p;r.awards.examPoints=p*(gs(id).currentRun||1)}r.exam.session=null;save();app.innerHTML=`<section class="card"><div class="finish-box"><div class="exam-percent">${p}%</div><div class="stars">${'★'.repeat(star)}${'☆'.repeat(3-star)}</div><h2>Prüfung beendet</h2><p>Bestes Ergebnis in dieser Runde: ${r.exam.bestPercent}%</p></div></section>`}

function render(){stopMic();const r=route();header(r);if(r.view==='overview')renderOverview();else if(r.group&&r.task)renderTask(r.group,r.task);else renderHome(r.group||0);bind();bindImages(app)}
function bind(){document.querySelectorAll('[data-action]').forEach(el=>{if(el.dataset.bound==='1')return;el.dataset.bound='1';el.addEventListener('click',e=>{const b=e.currentTarget,a=b.dataset.action;if(a==='logout'){logout();return}if(a==='overview'){go({view:'overview'});return}if(a==='group'){go({group:Number(b.dataset.group)||0});return}if(a==='task'){go({group:Number(b.dataset.group)||0,task:b.dataset.task||''});return}if(a==='audio'){speak(b.dataset.text||'');return}if(a==='reset-group'){const id=Number(b.dataset.group)||0;if(id&&confirm('Fortschritt dieser Gruppe wirklich löschen?')){delete state[String(id)];save();render()}}})})}
window.addEventListener('popstate',render);
render();