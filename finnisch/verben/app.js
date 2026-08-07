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
const LEARN=TASKS.slice(0,-1).map(t=>t[0]);
const TASK_TITLE=Object.fromEntries(TASKS.map(t=>[t[0],t[2]]));
const PERSONS=[
 {key:"minä",label:"minä",i:0},{key:"sinä",label:"sinä",i:1},{key:"hän",label:"hän",i:2},
 {key:"me",label:"me",i:3},{key:"te",label:"te",i:4},{key:"he",label:"he",i:5}
];

const app=document.querySelector("#app");
const topbar=document.querySelector("#topbar");
const role=String(getActiveRole()||"").toLowerCase();
const profile=getActiveProfile();
if(!profile&&role!=="teacher")location.href=loginUrlForCurrent();
window.logout=logout;

let rec=null;
let currentQuestion=null;
let cardSolved=false;
let cardRevealed=false;
const isPreview=()=>role==="teacher";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=v=>String(v??"").trim().toLocaleLowerCase("fi-FI").normalize("NFC").replace(/[.,!?;:“”"'`´()…]/g,"").replace(/\s+/g," ");
const slug=v=>String(v||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/^sich\s+/,"sich_").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const pickOptions=(correct,pool,n=4)=>shuffle([correct,...shuffle(pool.filter(x=>norm(x)!==norm(correct))).slice(0,n-1)]);

/* Bilder: immer deutsches Ursprungsverb/Bilddatei. Beispiel rakastaa -> lieben.webp. */
function imageCandidates(v){
 const key=v.img||slug(v.de),out=[];
 out.push(`https://sprachpilot.b-cdn.net/${encodeURIComponent(key)}.webp`);
 try{if(typeof window.SP_VERB_IMAGE_OVERRIDE==="function"){const u=window.SP_VERB_IMAGE_OVERRIDE(v.de);if(u)out.push(u)}}catch{}
 out.push(`https://sprachpilot.b-cdn.net/Neu/${encodeURIComponent(key)}.webp`);
 return [...new Set(out.filter(Boolean))];
}
function image(v,compact=false){
 const first=imageCandidates(v)[0];
 return `<div class="verb-image ${compact?"compact":""}"><img data-fi-verb-index="${v.index-1}" src="${esc(first)}" alt="Bild zu ${esc(v.fi)}"><div class="image-fallback" hidden><strong>${esc(v.fi)}</strong><span>${esc(v.de)}</span></div></div>`;
}
function bindImages(){
 document.querySelectorAll("img[data-fi-verb-index]").forEach(img=>{
  if(img.dataset.boundImage==="1")return;img.dataset.boundImage="1";
  const v=VERBS[Number(img.dataset.fiVerbIndex)];if(!v)return;
  const candidates=imageCandidates(v);let pos=Math.max(0,candidates.indexOf(img.getAttribute("src")));
  img.addEventListener("error",()=>{
   pos+=1;
   if(pos<candidates.length){img.src=candidates[pos];return}
   img.hidden=true;const fb=img.nextElementSibling;if(fb)fb.hidden=false;
  });
 });
}

function speak(text,slow=false){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="fi-FI";u.rate=slow?.55:.92;speechSynthesis.speak(u)}
function stopMic(){if(rec)try{rec.abort()}catch{}rec=null}

const FIRST_GROUP_FORMS={
 "rakastaa":["rakastan","rakastat","rakastaa","rakastamme","rakastatte","rakastavat"],
 "ostaa":["ostan","ostat","ostaa","ostamme","ostatte","ostavat"],
 "ymmärtää":["ymmärrän","ymmärrät","ymmärtää","ymmärrämme","ymmärrätte","ymmärtävät"],
 "tarvita":["tarvitsen","tarvitset","tarvitsee","tarvitsemme","tarvitsette","tarvitsevat"],
 "kuulla":["kuulen","kuulet","kuulee","kuulemme","kuulette","kuulevat"],
 "oppia":["opin","opit","oppii","opimme","opitte","oppivat"],
 "asua":["asun","asut","asuu","asumme","asutte","asuvat"],
 "tuoda":["tuon","tuot","tuo","tuomme","tuotte","tuovat"],
 "olla":["olen","olet","on","olemme","olette","ovat"],
 "kirjoittaa":["kirjoitan","kirjoitat","kirjoittaa","kirjoitamme","kirjoitatte","kirjoittavat"],
 "valokuvata":["valokuvaan","valokuvaat","valokuvaa","valokuvaamme","valokuvaatte","valokuvaavat"],
 "soittaa":["soitan","soitat","soittaa","soitamme","soitatte","soittavat"],
 "kokata":["kokkaan","kokkaat","kokkaa","kokkaamme","kokkaatte","kokkaavat"],
 "elää":["elän","elät","elää","elämme","elätte","elävät"],
 "tulla":["tulen","tulet","tulee","tulemme","tulette","tulevat"],
 "tavata":["tapaan","tapaat","tapaa","tapaamme","tapaatte","tapaavat"],
 "mennä":["menen","menet","menee","menemme","menette","menevät"],
 "uida":["uin","uit","ui","uimme","uitte","uivat"],
 "etsiä":["etsin","etsit","etsii","etsimme","etsitte","etsivät"],
 "tilata":["tilaan","tilaat","tilaa","tilaamme","tilaatte","tilaavat"]
};
function verbType(word){const w=String(word||"").toLocaleLowerCase("fi-FI");if(/(da|dä)$/.test(w))return 2;if(/(lla|llä|nna|nnä|rra|rrä|sta|stä)$/.test(w))return 3;if(/(ita|itä)$/.test(w))return 5;if(/(eta|etä)$/.test(w))return 6;if(/(ata|ätä|ota|ötä|uta|ytä)$/.test(w))return 4;return 1}
function harmonyA(word){return /[äöy]/.test(word)&&!/[aou]/.test(word)?"ä":"a"}
function genericForms(word){
 const w=String(word||"");if(w==="tehdä")return["teen","teet","tekee","teemme","teette","tekevät"];if(w==="nähdä")return["näen","näet","näkee","näemme","näette","näkevät"];
 const type=verbType(w),a=harmonyA(w),vat=a==="ä"?"vät":"vat";
 if(type===2){const s=w.slice(0,-2);return[s+"n",s+"t",s,s+"mme",s+"tte",s+vat]}
 if(type===3){let s=w.slice(0,-1).replace(/ll$/,"l").replace(/nn$/,"n").replace(/rr$/,"r").replace(/st$/,"s")+"e";return[s+"n",s+"t",s+"e",s+"mme",s+"tte",s+vat]}
 if(type===5){const s=w.slice(0,-2)+"tse";return[s+"n",s+"t",s+"e",s+"mme",s+"tte",s+vat]}
 if(type===6){const s=w.slice(0,-2)+"ne";return[s+"n",s+"t",s+"e",s+"mme",s+"tte",s+vat]}
 return null;
}
function formsFor(v){return FIRST_GROUP_FORMS[v.fi]||genericForms(v.fi)}
function grammarVerbs(group){const list=group.verbs.filter(v=>Array.isArray(formsFor(v)));return list.length?list:group.verbs.slice(0,Math.min(5,group.verbs.length))}
function personFor(v){return PERSONS[(v.index-1)%PERSONS.length]}

const userSlug=()=>[profile?.email,profile?.courseCode,profile?.kurs,profile?.kursnummer,profile?.vorname,profile?.nachname].filter(Boolean).join("_").toLowerCase().replace(/[^a-z0-9äöüß]+/gi,"_")||"student";
const storageKey=()=>`SP_FI_VERB_GROUPS_PROGRESS_${userSlug()}`;
function blankTask(total=0){return{total,done:[],queue:[],current:null,tries:0,hadWrong:false}}
function blankRun(){return{tasks:{},awards:{tasks:{},examPoints:0,examPercent:0},exam:{bestPercent:0,stars:0,session:null},completed:false}}
function blankGroup(){return{currentRun:1,runs:{"1":blankRun()}}}
let state=loadState();
function loadState(){try{return JSON.parse(localStorage.getItem(storageKey())||"{}")||{}}catch{return{}}}
function saveState(){if(isPreview())return;try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch{}}
function groupState(id){const k=String(id);if(!state[k])state[k]=blankGroup();if(!state[k].runs)state[k].runs={"1":blankRun()};return state[k]}
function currentRun(id){const gs=groupState(id),k=String(gs.currentRun||1);if(!gs.runs[k])gs.runs[k]=blankRun();return gs.runs[k]}
function taskTargets(id,task){const g=GROUPS[id-1];if(!g)return[];return ["choose-form","write-form","speak-form","sentence"].includes(task)?grammarVerbs(g):g.verbs}
function taskState(id,task){
 const run=currentRun(id),targets=taskTargets(id,task),allowed=new Set(targets.map(v=>v.de));
 if(!run.tasks[task])run.tasks[task]=blankTask(targets.length);
 const st=run.tasks[task];
 st.total=targets.length;
 st.done=[...new Set((st.done||[]).filter(v=>allowed.has(v)))];
 st.queue=[...new Set((st.queue||[]).filter(v=>allowed.has(v)&&!st.done.includes(v)))];
 st.current=st.current&&allowed.has(st.current)&&!st.done.includes(st.current)?st.current:null;
 st.tries=Math.max(0,Number(st.tries)||0);
 st.hadWrong=!!st.hadWrong;
 return st;
}
function taskPercent(id,task){const targets=taskTargets(id,task);if(!targets.length)return 100;const done=new Set(taskState(id,task).done);return Math.round(targets.filter(v=>done.has(v.de)).length*100/targets.length)}
function taskDone(id,task){return taskPercent(id,task)>=100}
function learnDone(id){return LEARN.every(t=>taskDone(id,t))}
function awardTask(id,task){const run=currentRun(id);if(!taskDone(id,task)||run.awards.tasks[task])return;run.awards.tasks[task]=5*(groupState(id).currentRun||1);saveState()}
function groupPoints(id){const gs=groupState(id);return Object.values(gs.runs||{}).reduce((sum,run)=>sum+Object.values(run.awards?.tasks||{}).reduce((a,n)=>a+(Number(n)||0),0)+(Number(run.awards?.examPoints)||0),0)}
function totalPoints(){return GROUPS.reduce((n,g)=>n+groupPoints(g.id),0)}
function stars(p){return p>=100?3:p>=70?2:p>=50?1:0}

/* Exakt wie der deutsche Standard: aktuelles Wort + Warteschlange. Falsch/Hilfe wird später wiederholt. */
function nextVerb(groupId,task){
 const st=taskState(groupId,task),targets=taskTargets(groupId,task);if(!st||!targets.length)return null;
 if(st.current&&!st.done.includes(st.current))return targets.find(v=>v.de===st.current)||null;
 if(!st.queue.length)st.queue=shuffle(targets.filter(v=>!st.done.includes(v.de)).map(v=>v.de));
 st.current=st.queue.shift()||null;st.tries=0;st.hadWrong=false;saveState();
 return targets.find(v=>v.de===st.current)||null;
}
function markWrong(groupId,task){const st=taskState(groupId,task);if(!st)return 0;st.tries+=1;st.hadWrong=true;saveState();return st.tries}
function markRight(groupId,task){
 const st=taskState(groupId,task),v=st?.current;if(!st||!v)return false;
 const repeat=st.hadWrong||st.tries>0;
 if(repeat){if(!st.done.includes(v)&&!st.queue.includes(v))st.queue.push(v)}else if(!st.done.includes(v))st.done.push(v);
 st.current=null;st.tries=0;st.hadWrong=false;
 if(taskPercent(groupId,task)>=100)awardTask(groupId,task);
 saveState();return !repeat;
}

function route(){const q=new URLSearchParams(location.search),group=Math.max(0,Math.min(GROUPS.length,Number(q.get("group"))||0)),raw=q.get("task")||"",task=TASKS.some(t=>t[0]===raw)?raw:"",view=q.get("view")==="overview"?"overview":"";return{group,task,view}}
function href(group=0,task="",view=""){const q=new URLSearchParams();if(group)q.set("group",group);if(task)q.set("task",task);if(view)q.set("view",view);return"/finnisch/verben/"+(q.toString()?"?"+q.toString():"")}
function go({group=0,task="",view=""}={}){history.pushState(null,"",href(group,task,view));render()}

function header(r){
 const p=profile||{},name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(" ")||(isPreview()?"Lehrer-Vorschau":"Schüler");
 const back=r.task&&r.group?href(r.group):(r.group||r.view?href():"/finnisch/");
 topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/finnisch/"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>Verben</h1><p>${VERBS.length} Verben · ${GROUPS.length} Gruppen</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a><button class="btn secondary" data-action="logout">Abmelden</button></div></div><nav class="topnav"><a class="btn secondary" href="${back}">Zurück</a>${!r.task?`<button class="btn secondary ${r.view==="overview"?"active-nav":""}" data-action="overview">Übersicht</button>`:""}${r.group&&!r.task?`<button class="btn danger-btn" data-action="reset-group" data-group="${r.group}">Fortschritt löschen</button>`:""}</nav>`;
}
const previewNote=()=>isPreview()?'<div class="preview-note">Lehrer-Vorschau · nichts wird gespeichert</div>':'';
function scoreCard(groupId=0){if(isPreview())return"";if(!groupId)return`<section class="card score-card compact-score"><h2>${totalPoints()} Punkte</h2><span>gesamt</span></section>`;const gs=groupState(groupId),run=currentRun(groupId),taskSum=Object.values(run.awards.tasks||{}).reduce((s,n)=>s+(Number(n)||0),0);return`<section class="card score-card"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Runde ${gs.currentRun||1} von 3</h2><p>${taskSum} Aufgabenpunkte · ${Number(run.awards.examPoints)||0} Prüfungspunkte</p></div><div class="score-total">${groupPoints(groupId)}<span>Punkte</span></div></section>`}
function taskCards(groupId){const run=currentRun(groupId);return TASKS.map((t,i)=>{const exam=t[0]==="exam",open=!exam||learnDone(groupId),p=exam?Number(run.exam.bestPercent)||0:taskPercent(groupId,t[0]);return`<button class="task-card ${p>=100?"done-card":""} ${!open?"locked-task":""}" data-action="task" data-group="${groupId}" data-task="${t[0]}" ${open?"":"disabled"}><span class="task-number">${i+1}</span><span class="task-icon">${open?t[1]:"🔒"}</span><span class="task-title">${t[2]}</span><div class="task-mini-progress"><span style="width:${p}%"></span></div><span class="task-status">${open?(p>=100?"Fertig":p?`${p}%`:"Starten"):"Gesperrt"}</span></button>`}).join("")}
function groupPanels(selected=0){return GROUPS.map(g=>{const run=currentRun(g.id),done=LEARN.filter(t=>taskDone(g.id,t)).length,exam=Number(run.exam.bestPercent)||0,open=selected===g.id;return`<details class="group-panel" data-group-panel="${g.id}" ${open?"open":""}><summary data-action="group" data-group="${g.id}"><span class="group-number">Gruppe ${g.id}</span><span>${g.verbs.length} Verben</span><span>Runde ${groupState(g.id).currentRun||1}/3</span><span>${done}/${LEARN.length} · Prüfung ${exam}%</span></summary><div class="group-body"><div class="task-grid">${taskCards(g.id)}</div></div></details>`}).join("")}
function renderHome(selected=0){app.innerHTML=`${previewNote()}${scoreCard(selected)}<section class="card"><div class="section-head"><h2>Gruppen</h2><span class="overview-total">${VERBS.length} Verben</span></div><div class="groups-accordion">${groupPanels(selected)}</div></section>`;if(selected)setTimeout(()=>document.querySelector(`[data-group-panel="${selected}"]`)?.scrollIntoView({behavior:"smooth",block:"start"}),80)}
function renderOverview(){app.innerHTML=`${previewNote()}<section class="card"><div class="section-head"><h2>Übersicht</h2><span class="overview-total">${VERBS.length} Verben</span></div><div class="overview-grid">${VERBS.map(v=>`<article class="overview-verb-card">${image(v,true)}<div class="overview-verb-text"><span class="group-badge">Gruppe ${Math.floor((v.index-1)/GROUP_SIZE)+1}</span><h3>${esc(v.fi)}</h3><p>${esc(v.de)}</p><button class="audio-mini" data-action="audio" data-text="${esc(v.fi)}">🔊</button></div></article>`).join("")}</div></section>`}
function taskProgressHtml(groupId,task){const targets=taskTargets(groupId,task),done=new Set(taskState(groupId,task).done),n=targets.filter(v=>done.has(v.de)).length,p=taskPercent(groupId,task);return`<div class="task-progress-row"><span>${n} richtig · ${Math.max(0,targets.length-n)} übrig</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div>`}
function grammarBox(task){if(!["verb-type","choose-form","write-form","speak-form","sentence"].includes(task))return"";const text=task==="verb-type"?"Finnische Verben werden nach ihrer Infinitiv-Endung in sechs Verbtypen eingeteilt. Achte auf die Endung des Verbs.":"Im Finnischen wird das Verb nach der Person verändert. Übe hier die Präsensform. Die Personalpronomen sind minä, sinä, hän, me, te und he.";return`<div class="question-support"><strong>Grammatik:</strong> ${esc(text)}</div>`}

function wrongFeedback(groupId,task,v,solution,hint){const tries=markWrong(groupId,task);const el=document.querySelector("#feedback");if(!el)return;el.className="feedback no";if(tries===1)el.innerHTML="Noch nicht richtig.";else if(tries===2)el.innerHTML=`Hilfe: ${esc(hint||`Die Lösung beginnt mit „${String(solution).charAt(0)}“.`)}`;else el.innerHTML=`Lösung: <strong>${esc(solution)}</strong>`}
function markQuestionRight(groupId,task){const saved=markRight(groupId,task);const el=document.querySelector("#feedback");if(el){el.className="feedback ok";el.textContent=saved?"Richtig!":"Richtig – diese Aufgabe wird noch einmal wiederholt."}setTimeout(()=>renderTask(groupId,task),650)}
function optionButtons(options){return`<div class="option-grid">${options.map(o=>`<button class="option" data-answer="${esc(o.value)}">${esc(o.label)}</button>`).join("")}</div>`}
function imageOptionButtons(options){return`<div class="image-choice-grid">${options.map(v=>`<button class="image-option" data-answer="${esc(v.de)}">${image(v,true)}</button>`).join("")}</div>`}
function inputBox(placeholder="Antwort schreiben"){return`<div class="answer-form"><div class="answer-row"><input id="answerInput" autocomplete="off" autocapitalize="none" placeholder="${esc(placeholder)}"><button class="btn" id="checkInput">Kontrollieren</button></div></div>`}
function taskPage(groupId,task,body){return`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>${esc(TASK_TITLE[task])}</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div>${grammarBox(task)}${taskProgressHtml(groupId,task)}<div class="question-card">${body}<div id="feedback"></div></div></section>`}

function renderCards(groupId){
 const task="cards",v=nextVerb(groupId,task);if(!v)return finishTask(groupId,task);cardSolved=false;cardRevealed=false;currentQuestion={task,v,answer:v.fi};
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Karteikarten</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div>${taskProgressHtml(groupId,task)}<div class="flip-wrap"><div id="verbFlipCard" class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-face flip-front">${image(v)}</div><div class="flip-face flip-back"><div class="flip-word">${esc(v.fi)}</div><div class="flip-note">Lösung</div><button type="button" class="btn secondary card-listen-btn" id="cardListenBtn">🔊 Anhören</button></div></div></div><div class="hint card-translation">Übersetzung: <b>${esc(v.de)}</b></div><div class="actions card-actions"><button id="cardMicBtn" type="button" class="btn">Sprechen</button><button id="cardWriteBtn" type="button" class="btn secondary">Schreiben</button></div><div id="cardMicStatus" class="small card-mic-status"></div><div id="cardAnswerBox" class="card-answer-box" hidden><div class="answer-row"><input id="cardAnswerInput" autocomplete="off" autocapitalize="none" placeholder="Verb schreiben"><button id="cardCheckBtn" type="button" class="btn">Kontrollieren</button></div></div><div id="cardFeedback"></div><div id="cardAfter" class="actions card-actions"></div></section>`;
 const card=document.querySelector("#verbFlipCard");
 const reveal=()=>{if(cardSolved||cardRevealed)return;cardRevealed=true;card.classList.add("flipped");markWrong(groupId,task);const status=document.querySelector("#cardMicStatus");if(status)status.textContent="Als falsch gewertet. Das Verb wird später noch einmal wiederholt.";const after=document.querySelector("#cardAfter");if(after){after.innerHTML='<button type="button" class="btn" id="cardHelpNext">Weiter</button>';document.querySelector("#cardHelpNext").onclick=()=>{markRight(groupId,task);renderCards(groupId)}}};
 card.addEventListener("click",e=>{if(!e.target.closest("button,input,a"))reveal()});
 card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();reveal()}});
 document.querySelector("#cardListenBtn").onclick=e=>{e.preventDefault();e.stopPropagation();speak(v.fi)};
 document.querySelector("#cardMicBtn").onclick=()=>startSpeech(value=>checkCard(groupId,value));
 document.querySelector("#cardWriteBtn").onclick=()=>{document.querySelector("#cardAnswerBox").hidden=false;document.querySelector("#cardAnswerInput").focus()};
 document.querySelector("#cardCheckBtn").onclick=()=>checkCard(groupId,document.querySelector("#cardAnswerInput").value);
 document.querySelector("#cardAnswerInput").onkeydown=e=>{if(e.key==="Enter")checkCard(groupId,e.target.value)};
}
function checkCard(groupId,value){
 if(cardSolved||!currentQuestion)return;const v=currentQuestion.v,task="cards";
 if(norm(value)===norm(v.fi)){
  cardSolved=true;document.querySelector("#verbFlipCard")?.classList.add("flipped");const saved=markRight(groupId,task);const fb=document.querySelector("#cardFeedback");if(fb){fb.className="feedback ok";fb.textContent=saved?"Richtig!":"Richtig – das Verb wird noch einmal wiederholt."}setTimeout(()=>renderCards(groupId),650);return;
 }
 const tries=markWrong(groupId,task),fb=document.querySelector("#cardFeedback");if(fb){fb.className="feedback no";fb.innerHTML=tries===1?"Noch nicht richtig.":tries===2?`Hilfe: Das Wort beginnt mit „${esc(v.fi.charAt(0))}“.`:`Lösung: <strong>${esc(v.fi)}</strong>`}
}
function startSpeech(callback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){const el=document.querySelector("#feedback")||document.querySelector("#cardMicStatus");if(el)el.textContent="Mikrofon wird nicht unterstützt. Bitte schreibe die Antwort.";return}try{stopMic();rec=new SR();rec.lang="fi-FI";rec.interimResults=false;rec.maxAlternatives=5;rec.onresult=e=>{const vals=Array.from(e.results?.[0]||[]).map(x=>x.transcript);callback(vals[0]||"")};rec.onerror=()=>{const el=document.querySelector("#feedback")||document.querySelector("#cardMicStatus");if(el)el.textContent="Mikrofon hat nicht funktioniert. Bitte schreibe die Antwort."};rec.onend=()=>rec=null;rec.start()}catch{}}

function buildQuestion(groupId,task,v){
 const g=GROUPS[groupId-1],fiPool=g.verbs.map(x=>x.fi),dePool=g.verbs.map(x=>x.de);
 if(task==="meaning-to-verb")return{kind:"mc",prompt:`Was heißt „${v.de}“ auf Finnisch?`,answer:v.fi,options:pickOptions(v.fi,fiPool).map(x=>({value:x,label:x})),hint:`Das finnische Wort beginnt mit „${v.fi.charAt(0)}“.`};
 if(task==="verb-to-meaning")return{kind:"mc",prompt:`Was bedeutet „${v.fi}“?`,answer:v.de,options:pickOptions(v.de,dePool).map(x=>({value:x,label:x})),hint:`Die deutsche Bedeutung beginnt mit „${v.de.charAt(0)}“.`};
 if(task==="listen")return{kind:"mc",prompt:"Höre und wähle das richtige finnische Verb.",answer:v.fi,audio:v.fi,options:pickOptions(v.fi,fiPool).map(x=>({value:x,label:x})),hint:`Das Wort beginnt mit „${v.fi.charAt(0)}“.`};
 if(task==="image-to-verb")return{kind:"mc",prompt:"Welches finnische Verb passt zum Bild?",answer:v.fi,image:v,options:pickOptions(v.fi,fiPool).map(x=>({value:x,label:x})),hint:`Das Wort beginnt mit „${v.fi.charAt(0)}“.`};
 if(task==="verb-to-image")return{kind:"images",prompt:`Welches Bild passt zu „${v.fi}“?`,answer:v.de,options:shuffle([v,...shuffle(g.verbs.filter(x=>x.de!==v.de)).slice(0,3)]),hint:`Die deutsche Bedeutung ist „${v.de}“.`};
 if(task==="read-sentence")return{kind:"mc",prompt:`Lies: „Haluan ${v.fi}.“ Was bedeutet das Verb?`,answer:v.de,options:pickOptions(v.de,dePool).map(x=>({value:x,label:x})),hint:`${v.fi} bedeutet auf Deutsch „${v.de}“.`};
 if(task==="verb-type"){const t=verbType(v.fi);return{kind:"mc",prompt:`Zu welchem finnischen Verbtyp gehört „${v.fi}“?`,answer:String(t),options:[1,2,3,4,5,6].map(n=>({value:String(n),label:`Verbtyp ${n}`})),hint:`Achte auf die Endung von „${v.fi}“.`}}
 if(["choose-form","write-form","speak-form","sentence"].includes(task)){const forms=formsFor(v),p=personFor(v),answer=forms?forms[p.i]:v.fi;if(task==="choose-form"){const distract=forms?forms.filter((x,i)=>i!==p.i):fiPool;return{kind:"mc",prompt:`${p.label} — ${v.fi}. Wähle die richtige Präsensform.`,answer,options:pickOptions(answer,distract).map(x=>({value:x,label:x})),hint:`Gesucht ist die Form für „${p.label}“.`}}if(task==="write-form")return{kind:"input",prompt:`Schreibe die Präsensform: ${p.label} — ${v.fi}`,answer,hint:`Gesucht ist die Form für „${p.label}“.`};if(task==="speak-form")return{kind:"speech",prompt:`Sprich die Präsensform: ${p.label} — ${v.fi}`,answer,hint:`Gesucht ist die Form für „${p.label}“.`};return{kind:"input",prompt:`Ergänze: ${p.label} ___ nyt. (${v.de}; Infinitiv: ${v.fi})`,answer,hint:`Setze ${v.fi} in die Form für „${p.label}“.`}}
 return null;
}
function renderTask(groupId,task){
 if(task==="cards")return renderCards(groupId);if(task==="exam")return renderExam(groupId);if(taskDone(groupId,task))return finishTask(groupId,task);
 const v=nextVerb(groupId,task);if(!v)return finishTask(groupId,task);const q=buildQuestion(groupId,task,v);currentQuestion={...q,v,task};
 let media=q.image?image(q.image):q.audio?`<div class="listen-box"><button class="btn" id="playAudio">🔊 Hören</button><button class="btn secondary" id="playSlow">Langsam</button></div>`:"";
 let answer="";if(q.kind==="mc")answer=optionButtons(q.options);else if(q.kind==="images")answer=imageOptionButtons(q.options);else if(q.kind==="input")answer=inputBox("Antwort schreiben");else if(q.kind==="speech")answer=`<div class="speech-box"><div class="actions"><button class="btn" id="speakAnswer">🎤 Sprechen</button><button class="btn secondary" id="writeFallback">✍️ Schreiben</button></div><div id="speechStatus" class="small"></div><div id="writeBox" class="answer-form hidden">${inputBox("Verbform schreiben")}</div></div>`;
 app.innerHTML=taskPage(groupId,task,`${media}<div class="question">${esc(q.prompt)}</div>${answer}`);
 document.querySelector("#playAudio")?.addEventListener("click",()=>speak(q.audio));document.querySelector("#playSlow")?.addEventListener("click",()=>speak(q.audio,true));
 document.querySelectorAll(".option[data-answer]").forEach(b=>b.addEventListener("click",()=>checkTaskAnswer(groupId,task,b.dataset.answer)));
 document.querySelectorAll(".image-option[data-answer]").forEach(b=>b.addEventListener("click",()=>checkTaskAnswer(groupId,task,b.dataset.answer)));
 const input=document.querySelector("#answerInput");document.querySelector("#checkInput")?.addEventListener("click",()=>checkTaskAnswer(groupId,task,input?.value||""));input?.addEventListener("keydown",e=>{if(e.key==="Enter")checkTaskAnswer(groupId,task,e.target.value)});
 document.querySelector("#speakAnswer")?.addEventListener("click",()=>startSpeech(v=>checkTaskAnswer(groupId,task,v)));
 document.querySelector("#writeFallback")?.addEventListener("click",()=>{document.querySelector("#writeBox")?.classList.remove("hidden");setTimeout(()=>document.querySelector("#answerInput")?.focus(),20)});
}
function checkTaskAnswer(groupId,task,value){const q=currentQuestion;if(!q)return;if(norm(value)===norm(q.answer))markQuestionRight(groupId,task);else wrongFeedback(groupId,task,q.v,q.answer,q.hint)}
function finishTask(groupId,task){awardTask(groupId,task);const points=Number(currentRun(groupId).awards.tasks[task])||0;app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>Gut gemacht!</h2><p>${points} Punkte · Runde ${groupState(groupId).currentRun||1}</p><div class="actions"><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div></div></section>`;bind()}

function examQuestions(groupId){const g=GROUPS[groupId-1];return g.verbs.map((v,i)=>{const mode=i%4;if(mode===0)return buildQuestion(groupId,"meaning-to-verb",v);if(mode===1)return buildQuestion(groupId,"verb-to-meaning",v);if(mode===2)return buildQuestion(groupId,"image-to-verb",v);return buildQuestion(groupId,"verb-type",v)}).slice(0,20)}
function renderExam(groupId){
 if(!learnDone(groupId)){app.innerHTML=`<section class="card locked-card"><h2>🔒 Gruppenprüfung</h2><p>Die Prüfung wird freigeschaltet, wenn alle Lernaufgaben 100 % erreicht haben.</p><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></section>`;return}
 const run=currentRun(groupId);if(!run.exam.session)run.exam.session={index:0,correct:0,questions:examQuestions(groupId).map(q=>({kind:q.kind,prompt:q.prompt,answer:q.answer,options:q.options,imageDe:q.image?.de||""}))};const s=run.exam.session;
 if(s.index>=s.questions.length)return finishExam(groupId);
 const raw=s.questions[s.index],v=raw.imageDe?GROUPS[groupId-1].verbs.find(x=>x.de===raw.imageDe):null;let body=v?image(v):"";body+=`<div class="question">${esc(raw.prompt)}</div>`;body+=raw.kind==="mc"?optionButtons(raw.options):"";
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>★ Gruppenprüfung</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div><div class="task-progress-row"><span>Frage ${s.index+1} von ${s.questions.length}</span><strong>${s.correct} richtig</strong></div><div class="question-card">${body}<div id="feedback"></div></div></section>`;
 document.querySelectorAll(".option[data-answer]").forEach(b=>b.addEventListener("click",()=>{if(norm(b.dataset.answer)===norm(raw.answer))s.correct+=1;s.index+=1;saveState();renderExam(groupId)}));
}
function finishExam(groupId){const run=currentRun(groupId),s=run.exam.session,total=s?.questions?.length||20,p=Math.round((Number(s?.correct)||0)*100/total),st=stars(p),old=Number(run.exam.bestPercent)||0;if(p>old){run.exam.bestPercent=p;run.exam.stars=st;run.awards.examPercent=p;run.awards.examPoints=p*(groupState(groupId).currentRun||1)}run.exam.session=null;saveState();app.innerHTML=`<section class="card"><div class="finish-box"><div class="exam-percent">${p}%</div><div class="stars">${"★".repeat(st)}${"☆".repeat(3-st)}</div><h2>Prüfung beendet</h2><p>Bestes Ergebnis in dieser Runde: ${run.exam.bestPercent}%</p><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div></section>`;bind()}

function render(){stopMic();const r=route();header(r);if(r.view==="overview")renderOverview();else if(r.group&&r.task)renderTask(r.group,r.task);else renderHome(r.group||0);bind();bindImages()}
function bind(){document.querySelectorAll("[data-action]").forEach(el=>{if(el.dataset.boundAction==="1")return;el.dataset.boundAction="1";el.addEventListener("click",e=>{const b=e.currentTarget,a=b.dataset.action;if(a==="logout"){logout();return}if(a==="overview"){go({view:"overview"});return}if(a==="group"){go({group:Number(b.dataset.group)||0});return}if(a==="task"){go({group:Number(b.dataset.group)||0,task:b.dataset.task||""});return}if(a==="audio"){speak(b.dataset.text||"");return}if(a==="reset-group"){const id=Number(b.dataset.group)||0;if(id&&confirm("Fortschritt dieser Gruppe wirklich löschen?")){delete state[String(id)];saveState();render()}}})})}
window.addEventListener("popstate",render);
render();