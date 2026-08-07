import {getActiveProfile,getActiveRole,loginUrlForCurrent,dashboardHref,logout} from "/js/auth.js?v=login-main-4";

const VERBS=(window.SP_FI_VERBS||[]).map((v,i)=>({...v,index:i+1}));
const GROUP_SIZE=Number(window.SP_FI_VERB_GROUP_SIZE)||20;
const GROUPS=[];
for(let i=0;i<VERBS.length;i+=GROUP_SIZE){GROUPS.push({id:GROUPS.length+1,verbs:VERBS.slice(i,i+GROUP_SIZE)})}

// Reihenfolge und Darstellung entsprechen dem deutschen Verbenbereich.
// Inhaltlich finnische Grammatik-Aufgaben werden danach einzeln übertragen.
const TASKS=[
  ["cards","Aa","Karteikarten",true],
  ["meaning-to-verb","B→V","Bedeutung → Verb",false],
  ["verb-to-meaning","V→B","Verb → Bedeutung",false],
  ["listen","🔊","Hören → Verb",false],
  ["image-to-verb","▣","Bild → Verb",false],
  ["verb-to-image","V→▣","Verb → Bild",false],
  ["read-sentence","📖","Lesen → Verb",false],
  ["verb-type","↔","Verbtyp",false],
  ["choose-form","du","Form auswählen",false],
  ["write-form","✎","Form schreiben",false],
  ["speak-form","🎙","Form sprechen",false],
  ["sentence","…","Satz ergänzen",false],
  ["exam","★","Gruppenprüfung",false]
];

const app=document.querySelector("#app");
const topbar=document.querySelector("#topbar");
const role=String(getActiveRole()||"").toLowerCase();
const profile=getActiveProfile();
if(!profile&&role!=="teacher"){location.href=loginUrlForCurrent()}
window.logout=logout;

let currentQuestion=null;
let rec=null;
let cardSolved=false;

const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const norm=v=>String(v??"").trim().toLocaleLowerCase("fi-FI").normalize("NFC").replace(/[.,!?;:“”"'`´()…]/g,"").replace(/\s+/g," ");
const slug=v=>String(v||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/^sich\s+/,"sich_").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");
const imageUrl=v=>"https://sprachpilot.b-cdn.net/"+encodeURIComponent((v.img||slug(v.de))+".webp");
const isPreview=()=>role==="teacher";
const userSlug=()=>[profile?.email,profile?.courseCode,profile?.kurs,profile?.kursnummer,profile?.vorname,profile?.nachname].filter(Boolean).join("_").toLowerCase().replace(/[^a-z0-9äöüß]+/gi,"_")||"student";
const storageKey=()=>`SP_FI_VERB_GROUPS_PROGRESS_${userSlug()}`;

let state=loadState();
function loadState(){try{return JSON.parse(localStorage.getItem(storageKey())||"{}")||{}}catch{return{}}}
function saveState(){if(isPreview())return;try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch{}}
function blankGroup(){return{currentRun:1,cards:{done:[],wrong:{}},awards:{cards:0}}}
function groupState(id){const k=String(id);if(!state[k])state[k]=blankGroup();if(!state[k].cards)state[k].cards={done:[],wrong:{}};if(!state[k].awards)state[k].awards={cards:0};return state[k]}
function cardProgress(id){const g=GROUPS[id-1];if(!g)return 0;const done=new Set(groupState(id).cards.done||[]);return Math.round(g.verbs.filter(v=>done.has(v.de)).length*100/g.verbs.length)}
function cardDone(id){return cardProgress(id)>=100}
function groupPoints(id){return Number(groupState(id).awards.cards)||0}
function totalPoints(){return GROUPS.reduce((n,g)=>n+groupPoints(g.id),0)}

function route(){
 const q=new URLSearchParams(location.search);
 const group=Math.max(0,Math.min(GROUPS.length,Number(q.get("group"))||0));
 const rawTask=q.get("task")||"";
 const task=TASKS.some(t=>t[0]===rawTask)?rawTask:"";
 const view=q.get("view")==="overview"?"overview":"";
 return{group,task,view};
}
function href(group=0,task="",view=""){
 const q=new URLSearchParams();
 if(group)q.set("group",group);
 if(task)q.set("task",task);
 if(view)q.set("view",view);
 return "/finnisch/verben/"+(q.toString()?"?"+q.toString():"");
}
function go({group=0,task="",view=""}={}){history.pushState(null,"",href(group,task,view));render()}
function stopMic(){if(rec)try{rec.abort()}catch{}rec=null}
function speak(text,slow=false){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="fi-FI";u.rate=slow?.55:.92;speechSynthesis.speak(u)}
function image(v,compact=false){return `<div class="verb-image ${compact?"compact":""}"><img src="${imageUrl(v)}" alt="Bild zu ${esc(v.fi)}" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-fallback" hidden><strong>${esc(v.fi)}</strong></div></div>`}

function header(r){
 const p=profile||{};
 const name=[p.vorname||p.firstName,p.nachname||p.lastName].filter(Boolean).join(" ")||(isPreview()?"Lehrer-Vorschau":"Schüler");
 let back="/finnisch/";
 if(r.task&&r.group)back=href(r.group);
 else if(r.group||r.view)back=href();
 topbar.innerHTML=`<div class="topbar-main"><a class="brand" href="/finnisch/"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>Verben</h1><p>${VERBS.length} Verben · ${GROUPS.length} Gruppen</p></div></a><div class="account-actions"><span class="account-pill">${esc(name)}</span><a class="btn secondary" href="${esc(dashboardHref())}">Dashboard</a><button class="btn secondary" data-action="logout">Abmelden</button></div></div><nav class="topnav"><a class="btn secondary" href="${back}">Zurück</a>${!r.task?`<button class="btn secondary ${r.view==="overview"?"active-nav":""}" data-action="overview">Übersicht</button>`:""}${r.group&&!r.task?`<button class="btn danger-btn" data-action="reset-group" data-group="${r.group}">Fortschritt löschen</button>`:""}</nav>`;
}
const previewNote=()=>isPreview()?'<div class="preview-note">Lehrer-Vorschau · nichts wird gespeichert</div>':'';
function scoreCard(groupId=0){
 if(isPreview())return"";
 if(!groupId)return `<section class="card score-card compact-score"><h2>${totalPoints()} Punkte</h2><span>gesamt</span></section>`;
 const gs=groupState(groupId);
 return `<section class="card score-card"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Runde ${gs.currentRun||1} von 3</h2><p>${groupPoints(groupId)} Aufgabenpunkte · 0 Prüfungspunkte</p></div><div class="score-total">${groupPoints(groupId)}<span>Punkte</span></div></section>`;
}
function taskCards(groupId){
 const p=cardProgress(groupId);
 return TASKS.map((t,i)=>{
   const open=t[3]===true;
   const tp=t[0]==="cards"?p:0;
   return `<button class="task-card ${tp>=100?"done-card":""} ${!open?"locked-task":""}" data-action="task" data-group="${groupId}" data-task="${t[0]}" ${open?"":"disabled"}><span class="task-number">${i+1}</span><span class="task-icon">${open?t[1]:"🔒"}</span><span class="task-title">${t[2]}</span><div class="task-mini-progress"><span style="width:${tp}%"></span></div><span class="task-status">${open?(tp>=100?"Fertig":tp?`${tp}%`:"Starten"):"Gesperrt"}</span></button>`;
 }).join("");
}
function groupPanels(selected=0){
 return GROUPS.map(g=>{const open=selected===g.id;return `<details class="group-panel" data-group-panel="${g.id}" ${open?"open":""}><summary data-action="group" data-group="${g.id}"><span class="group-number">Gruppe ${g.id}</span><span>${g.verbs.length} Verben</span><span>Runde ${groupState(g.id).currentRun||1}/3</span><span>${cardDone(g.id)?1:0}/12 · Prüfung 0%</span></summary><div class="group-body"><div class="task-grid">${taskCards(g.id)}</div></div></details>`}).join("");
}
function renderHome(selected=0){
 app.innerHTML=`${previewNote()}${scoreCard(selected)}<section class="card"><div class="section-head"><h2>Gruppen</h2><span class="overview-total">${VERBS.length} Verben</span></div><div class="groups-accordion">${groupPanels(selected)}</div></section>`;
 if(selected)setTimeout(()=>document.querySelector(`[data-group-panel="${selected}"]`)?.scrollIntoView({behavior:"smooth",block:"start"}),80);
}
function renderOverview(){
 const cards=VERBS.map(v=>{const group=Math.floor((v.index-1)/GROUP_SIZE)+1;return `<article class="overview-verb-card">${image(v,true)}<div class="overview-verb-text"><span class="group-badge">Gruppe ${group}</span><h3>${esc(v.fi)}</h3><p>${esc(v.de)}</p><button class="audio-mini" data-action="audio" data-text="${esc(v.fi)}">🔊</button></div></article>`}).join("");
 app.innerHTML=`${previewNote()}<section class="card"><div class="section-head"><h2>Übersicht</h2><span class="overview-total">${VERBS.length} Verben</span></div><div class="overview-grid">${cards}</div></section>`;
}
function taskProgressHtml(groupId){
 const g=GROUPS[groupId-1],done=groupState(groupId).cards.done.length,p=cardProgress(groupId);
 return `<div class="task-progress-row"><span>${done} richtig · ${g.verbs.length-done} übrig</span><strong>${p}%</strong></div><div class="mini-progress"><div style="width:${p}%"></div></div>`;
}
function nextVerb(groupId){const g=GROUPS[groupId-1];if(!g)return null;const done=new Set(groupState(groupId).cards.done||[]);return g.verbs.find(v=>!done.has(v.de))||null}
function feedback(text,ok=false){const el=document.querySelector("#cardFeedback");if(el){el.className="feedback "+(ok?"ok":"no");el.innerHTML=text}}

function renderCards(groupId){
 const v=nextVerb(groupId);if(!v)return finishCards(groupId);
 currentQuestion={answer:v.fi,verb:v};cardSolved=false;
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>Karteikarten</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div>${taskProgressHtml(groupId)}<div class="flip-wrap"><div id="verbFlipCard" class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-face flip-front">${image(v)}</div><div class="flip-face flip-back"><div class="flip-word">${esc(v.fi)}</div><div class="flip-note">Lösung</div><button type="button" class="btn secondary card-listen-btn" id="cardListenBtn">🔊 Anhören</button></div></div></div><div class="hint card-translation">Übersetzung: <b>${esc(v.de)}</b></div><div class="actions card-actions"><button id="cardMicBtn" type="button" class="btn">Sprechen</button><button id="cardWriteBtn" type="button" class="btn secondary">Schreiben</button></div><div id="cardMicStatus" class="small card-mic-status"></div><div id="cardAnswerBox" class="card-answer-box" hidden><div class="answer-row"><input id="cardAnswerInput" autocomplete="off" autocapitalize="none" placeholder="Verb schreiben"><button id="cardCheckBtn" type="button" class="btn">Kontrollieren</button></div></div><div id="cardFeedback"></div><div id="cardAfter" class="actions card-actions"></div></section>`;
 const card=document.querySelector("#verbFlipCard");
 card.addEventListener("click",e=>{if(!e.target.closest("button,input,a"))revealCard()});
 card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();revealCard()}});
 document.querySelector("#cardListenBtn").addEventListener("click",e=>{e.preventDefault();e.stopPropagation();speak(v.fi)});
 document.querySelector("#cardMicBtn").addEventListener("click",()=>startCardMic(groupId));
 document.querySelector("#cardWriteBtn").addEventListener("click",openCardWrite);
 document.querySelector("#cardCheckBtn").addEventListener("click",()=>checkCardAnswer(groupId,document.querySelector("#cardAnswerInput").value));
 document.querySelector("#cardAnswerInput").addEventListener("keydown",e=>{if(e.key==="Enter")checkCardAnswer(groupId,e.target.value)});
}
function revealCard(){
 if(cardSolved)return;
 document.querySelector("#verbFlipCard")?.classList.add("flipped");
 const status=document.querySelector("#cardMicStatus");
 if(status)status.textContent="Sprich das Verb oder schreibe es. Erst eine richtige Antwort geht weiter.";
 // Standardregel: Umdrehen ist Hilfe, aber keine Antwort und kein Fortschritt.
}
function openCardWrite(message=""){
 const box=document.querySelector("#cardAnswerBox"),input=document.querySelector("#cardAnswerInput"),status=document.querySelector("#cardMicStatus");
 if(box)box.hidden=false;if(status&&message)status.textContent=message;setTimeout(()=>input?.focus(),30);
}
function startCardMic(groupId){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition,status=document.querySelector("#cardMicStatus"),btn=document.querySelector("#cardMicBtn");
 if(!SR){openCardWrite("Mikrofon wird hier nicht unterstützt. Bitte schreiben.");return}
 try{stopMic();rec=new SR();rec.lang="fi-FI";rec.interimResults=false;rec.continuous=false;rec.maxAlternatives=5;if(status)status.textContent="Ich höre zu …";btn?.classList.add("active");rec.onresult=e=>{const values=Array.from(e.results?.[0]||[]).map(x=>x.transcript);const exact=values.find(x=>norm(x)===norm(currentQuestion?.answer));const value=exact||values[0]||"";if(!value){openCardWrite("Nichts erkannt. Bitte schreiben.");return}openCardWrite();const input=document.querySelector("#cardAnswerInput");if(input)input.value=value;checkCardAnswer(groupId,value)};rec.onerror=()=>openCardWrite("Mikrofon hat nicht funktioniert. Bitte schreiben.");rec.onnomatch=()=>openCardWrite("Nichts erkannt. Bitte schreiben.");rec.onend=()=>{btn?.classList.remove("active");rec=null};rec.start()}catch{openCardWrite("Mikrofon konnte nicht gestartet werden. Bitte schreiben.")}
}
function checkCardAnswer(groupId,value){
 if(cardSolved||!currentQuestion)return;
 const v=currentQuestion.verb,st=groupState(groupId).cards;
 if(norm(value)===norm(currentQuestion.answer)){
   cardSolved=true;document.querySelector("#verbFlipCard")?.classList.add("flipped");
   if(!st.done.includes(v.de))st.done.push(v.de);
   delete st.wrong[v.de];
   if(cardProgress(groupId)>=100&&Number(groupState(groupId).awards.cards||0)===0){groupState(groupId).awards.cards=5*(groupState(groupId).currentRun||1)}
   saveState();
   feedback("Richtig!",true);
   const after=document.querySelector("#cardAfter");
   if(after){after.innerHTML='<button type="button" class="btn" id="cardNextBtn">Weiter</button>';document.querySelector("#cardNextBtn").addEventListener("click",()=>renderCards(groupId))}
   return;
 }
 const tries=(st.wrong[v.de]||0)+1;st.wrong[v.de]=tries;saveState();
 feedback(tries>=3?`Lösung: <strong>${esc(currentQuestion.answer)}</strong>`:"Noch nicht richtig.",false);
}
function finishCards(groupId){
 app.innerHTML=`<section class="card"><div class="finish-box"><div class="finish-icon">✓</div><h2>Fertig</h2><p>${groupPoints(groupId)} Punkte · Runde ${groupState(groupId).currentRun||1}</p><div class="actions"><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div></div></section>`;
}
function renderLocked(groupId,task){
 const title=TASKS.find(t=>t[0]===task)?.[2]||"Aufgabe";
 app.innerHTML=`<section class="card task-page"><div class="task-page-head"><div><p class="eyebrow">Gruppe ${groupId}</p><h2>${esc(title)}</h2></div><button class="btn secondary" data-action="group" data-group="${groupId}">Zurück</button></div><div class="locked-card"><h3>Gesperrt</h3><p class="small">Diese finnische Aufgabe wird als nächster Schritt nach demselben deutschen Standard übertragen.</p></div></section>`;
}
function render(){
 stopMic();
 const r=route();header(r);
 if(r.view==="overview")renderOverview();
 else if(r.group&&r.task){if(r.task==="cards")renderCards(r.group);else renderLocked(r.group,r.task)}
 else renderHome(r.group||0);
 bind();
}
function bind(){
 document.querySelectorAll("[data-action]").forEach(el=>el.addEventListener("click",e=>{
   const b=e.currentTarget,a=b.dataset.action;
   if(a==="logout"){logout();return}
   if(a==="overview"){go({view:"overview"});return}
   if(a==="group"){go({group:Number(b.dataset.group)||0});return}
   if(a==="task"){go({group:Number(b.dataset.group)||0,task:b.dataset.task||""});return}
   if(a==="audio"){speak(b.dataset.text||"");return}
   if(a==="reset-group"){
     const id=Number(b.dataset.group)||0;
     if(id&&confirm("Fortschritt dieser Gruppe wirklich löschen?")){delete state[String(id)];saveState();render()}
   }
 }));
}
window.addEventListener("popstate",render);
render();
