import {getActiveProfile,getActiveRole,loginUrlForCurrent,renderAccountStrip,dashboardHref,logout} from "/js/auth.js?v=login-main-4";

const VERBS=(window.SP_FI_VERBS||[]).map((v,i)=>({...v,index:i+1}));
const GROUP_SIZE=Number(window.SP_FI_VERB_GROUP_SIZE)||20;
const GROUPS=[];
for(let i=0;i<VERBS.length;i+=GROUP_SIZE) GROUPS.push({id:GROUPS.length+1,verbs:VERBS.slice(i,i+GROUP_SIZE)});
const TASKS=[
  ["cards","Aa","Karteikarten",true],
  ["meaning-to-verb","B→V","Bedeutung → Verb",false],
  ["verb-to-meaning","V→B","Verb → Bedeutung",false],
  ["listen","🔊","Hören → Verb",false],
  ["image-to-verb","▣","Bild → Verb",false],
  ["verb-to-image","V→▣","Verb → Bild",false],
  ["read-sentence","📖","Lesen → Verb",false],
  ["verb-type","1–6","Verbtyp",false],
  ["choose-form","du","Form auswählen",false],
  ["write-form","✎","Form schreiben",false],
  ["speak-form","🎙","Form sprechen",false],
  ["sentence","…","Satz ergänzen",false],
  ["exam","★","Gruppenprüfung",false]
];

const app=document.querySelector("#app");
const topbar=document.querySelector("#fiTopbar");
const role=String(getActiveRole()||"").toLowerCase();
const profile=getActiveProfile();
if(!profile&&role!=="teacher"){location.href=loginUrlForCurrent()}
try{renderAccountStrip()}catch(e){}
window.logout=logout;

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const norm=s=>String(s??"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[.,!?;:“”"'`´()…]/g,"").replace(/\s+/g," ");
const slug=s=>String(s||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/^sich\s+/,"sich_").replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"");
const imgUrl=v=>"https://sprachpilot.b-cdn.net/"+encodeURIComponent((v.img||slug(v.de))+".webp");
const userSlug=()=>[profile?.email,profile?.kurs,profile?.courseCode,profile?.vorname,profile?.nachname].filter(Boolean).join("_").toLowerCase().replace(/[^a-z0-9äöüß]+/gi,"_")||"user";
const key="SP_FI_VERBS_PROGRESS_"+userSlug();
let state=loadState();
let recognition=null;
let helpLevel=0;

function loadState(){try{return JSON.parse(localStorage.getItem(key)||"{}")||{}}catch(e){return{}}}
function saveState(){if(role==="teacher")return;try{localStorage.setItem(key,JSON.stringify(state))}catch(e){}}
function groupState(id){const k=String(id);if(!state[k])state[k]={cards:{done:[],index:0,wrong:{}}};if(!state[k].cards)state[k].cards={done:[],index:0,wrong:{}};return state[k]}
function groupProgress(id){const st=groupState(id).cards;return GROUPS[id-1]?.verbs.length?Math.round((st.done.length/GROUPS[id-1].verbs.length)*100):0}
function href({group=0,task="",view=""}={}){const q=new URLSearchParams();if(group)q.set("group",group);if(task)q.set("task",task);if(view)q.set("view",view);return "/finnisch/verben/"+(q.toString()?"?"+q.toString():"")}
function route(){const q=new URLSearchParams(location.search);const group=Math.max(0,Math.min(GROUPS.length,Number(q.get("group"))||0));const task=TASKS.some(t=>t[0]===q.get("task"))?q.get("task"):"";const view=q.get("view")==="overview"?"overview":"";return{group,task,view}}
function speak(text,slow=false){if(!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="fi-FI";u.rate=slow?.62:.88;speechSynthesis.speak(u)}
function image(v,small=false){return `<img src="${imgUrl(v)}" alt="Bild zu ${esc(v.fi)}" loading="${small?"lazy":"eager"}" onerror="this.style.visibility='hidden'">`}
function backHref(r){
 if(r.task&&r.group)return href({group:r.group});
 if(r.group||r.view)return "/finnisch/verben/";
 return "/finnisch/";
}
function renderHeader(r){
 const count=VERBS.length;
 const subtitle=r.group?`Gruppe ${r.group} · ${GROUPS[r.group-1]?.verbs.length||0} Verben`:`${count} Verben · ${GROUPS.length} Gruppen`;
 topbar.innerHTML=`<div class="fi-top-main"><a class="fi-brand" href="/finnisch/"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"><div><h1>Finnische Verben</h1><p>${esc(subtitle)}</p></div></a><span class="fi-pill">🇫🇮 A1</span></div><nav class="fi-nav"><a class="btn secondary" href="${backHref(r)}">Zurück</a>${r.task?"":`<a class="btn secondary" href="${href({view:"overview"})}">Übersicht</a>`}${r.group&&!r.task?`<button class="btn danger" id="resetGroup">Fortschritt löschen</button>`:""}</nav>`;
 document.querySelector("#resetGroup")?.addEventListener("click",()=>{if(confirm("Fortschritt dieser Gruppe wirklich löschen?")){delete state[String(r.group)];saveState();render()}});
}
function renderHome(){
 app.innerHTML=`<section class="fi-card"><div class="fi-section-head"><h2>Gruppen</h2><span class="fi-pill">${VERBS.length} Verben</span></div><div class="fi-groups">${GROUPS.map(g=>{const p=groupProgress(g.id);return `<a class="fi-group-card" href="${href({group:g.id})}"><h3>Gruppe ${g.id}</h3><p>${g.verbs.length} Verben</p><div class="fi-progress"><span style="width:${p}%"></span></div><p>${p}% Karteikarten</p></a>`}).join("")}</div></section>`
}
function renderOverview(){
 app.innerHTML=`<section class="fi-card"><div class="fi-section-head"><h2>Übersicht</h2><span class="fi-pill">${VERBS.length} Verben</span></div><div class="fi-overview-grid">${VERBS.map(v=>`<article class="fi-word-card">${image(v,true)}<div class="fi-word-body"><span class="fi-small">Gruppe ${Math.floor((v.index-1)/GROUP_SIZE)+1}</span><h3>${esc(v.fi)}</h3><p>${esc(v.de)}</p><button class="btn secondary fi-audio" data-speak="${esc(v.fi)}">🔊 Anhören</button></div></article>`).join("")}</div></section>`;
 bindSpeak();
}
function renderGroup(id){
 const g=GROUPS[id-1];if(!g)return renderHome();const p=groupProgress(id);
 app.innerHTML=`<section class="fi-card"><div class="fi-section-head"><div><h2>Gruppe ${id}</h2><p class="fi-small">${g.verbs.map(v=>esc(v.fi)).join(" · ")}</p></div><span class="fi-pill">${p}%</span></div><div class="fi-progress"><span style="width:${p}%"></span></div><div class="fi-task-grid">${TASKS.map(t=>`<a class="fi-task-card ${t[3]?"ready":"pending"}" href="${href({group:id,task:t[0]})}"><span class="fi-task-icon">${t[1]}</span><span class="fi-task-title">${t[2]}</span><span class="fi-task-status">${t[3]?(t[0]==="cards"?(p>=100?"Fertig":p?`${p}%`:"Starten"):"Starten"):"Finnische Aufgabe wird aufgebaut"}</span></a>`).join("")}</div></section>`
}
function currentCard(id){
 const g=GROUPS[id-1],st=groupState(id).cards;if(!g)return null;
 const remaining=g.verbs.filter(v=>!st.done.includes(v.de));
 if(!remaining.length)return null;
 const idx=Math.max(0,Math.min(remaining.length-1,Number(st.index)||0));
 return {v:remaining[idx],remaining,index:idx};
}
function setFeedback(type,text){const el=document.querySelector("#spFeedback");if(!el)return;el.innerHTML=`<div class="sp-${type}">${esc(text)}</div>`}
function revealCard(){document.querySelector("#spFlipCard")?.classList.add("flipped");setFeedback("hint","Sprich das finnische Wort oder schreibe es. Nur eine richtige Antwort geht weiter.")}
function helpCard(id){
 const c=currentCard(id);if(!c)return;const v=c.v;
 helpLevel+=1;
 if(helpLevel===1)setFeedback("hint",`Hilfe: Das Wort beginnt mit „${v.fi.charAt(0)}“ und hat ${v.fi.replace(/\s/g,"").length} Buchstaben.`);
 else setFeedback("hint",`Lösung: ${v.fi}. Die Hilfe zählt nicht als richtige Antwort.`);
}
function markWrong(id,v){const st=groupState(id).cards;st.wrong[v.de]=(st.wrong[v.de]||0)+1;saveState();const n=st.wrong[v.de];setFeedback("wrong",n>=3?`Noch nicht richtig. Lösung: ${v.fi}. Versuche es erneut.`:"Noch nicht richtig. Versuche es erneut.")}
function markRight(id,v){const st=groupState(id).cards;if(!st.done.includes(v.de))st.done.push(v.de);delete st.wrong[v.de];st.index=0;saveState();setFeedback("correct","Richtig!");setTimeout(()=>render(),650)}
function checkCard(id,value){const c=currentCard(id);if(!c)return;if(norm(value)===norm(c.v.fi))markRight(id,c.v);else markWrong(id,c.v)}
function startMic(id){
 const R=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!R){setFeedback("hint","Das Mikrofon wird nicht unterstützt. Bitte schreibe die Antwort.");document.querySelector("#spWriteBox").hidden=false;return}
 try{recognition?.abort()}catch(e){}
 recognition=new R();recognition.lang="fi-FI";recognition.interimResults=false;recognition.maxAlternatives=5;setFeedback("hint","Ich höre zu …");
 recognition.onresult=e=>{const vals=Array.from(e.results[0]||[]).map(x=>x.transcript);const c=currentCard(id);const exact=vals.find(x=>norm(x)===norm(c?.v.fi));checkCard(id,exact||vals[0]||"")};
 recognition.onerror=()=>{setFeedback("hint","Das Mikrofon hat nicht funktioniert. Bitte schreibe die Antwort.");document.querySelector("#spWriteBox").hidden=false};
 recognition.onend=()=>recognition=null;recognition.start()
}
function renderCards(id){
 helpLevel=0;
 const g=GROUPS[id-1],c=currentCard(id);if(!g)return renderHome();
 if(!c){app.innerHTML=`<section class="fi-card fi-finish"><h2>Gut gemacht!</h2><p>Du hast alle ${g.verbs.length} Karteikarten richtig gesprochen oder geschrieben.</p><a class="btn" href="${href({group:id})}">Zurück</a></section>`;return}
 const v=c.v,done=groupState(id).cards.done.length;
 app.innerHTML=`<section class="fi-card sp-card-task"><div class="sp-task-header"><div>1. Karteikarten</div><div>${done+1} / ${g.verbs.length}</div></div><div class="fi-progress"><span style="width:${Math.round(done/g.verbs.length*100)}%"></span></div><div class="sp-flip-wrap"><div id="spFlipCard" class="sp-flip-card" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="sp-flip-face sp-flip-front"><div class="sp-card-image">${image(v)}</div><div class="sp-translation-box"><span>Deutsch</span><strong>${esc(v.de)}</strong></div></div><div class="sp-flip-face sp-flip-back"><div class="sp-back-grid"><div class="sp-back-image">${image(v)}</div><div class="sp-back-info"><div class="sp-card-word">${esc(v.fi)}</div><div class="sp-translation-box"><span>Deutsch</span><strong>${esc(v.de)}</strong></div><button class="btn secondary fi-audio" id="cardAudio">🔊 Anhören</button></div></div></div></div></div><div class="sp-card-actions"><button class="btn" id="cardMic">🎤 Sprechen</button><button class="btn secondary" id="cardWrite">✍️ Schreiben</button><button class="btn secondary" id="cardHelp">Hilfe</button></div><div id="spWriteBox" class="sp-write-box" hidden><label for="spAnswerInput">Finnisches Verb schreiben</label><div class="sp-answer-row"><input id="spAnswerInput" autocomplete="off" autocapitalize="none"><button class="btn" id="cardCheck">Kontrollieren</button></div></div><div id="spFeedback" class="sp-feedback"></div></section>`;
 const card=document.querySelector("#spFlipCard");card.addEventListener("click",e=>{if(!e.target.closest("button,input,a"))revealCard()});card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();revealCard()}});
 document.querySelector("#cardAudio").onclick=e=>{e.stopPropagation();speak(v.fi)};
 document.querySelector("#cardMic").onclick=()=>startMic(id);
 document.querySelector("#cardWrite").onclick=()=>{document.querySelector("#spWriteBox").hidden=false;setTimeout(()=>document.querySelector("#spAnswerInput").focus(),20)};
 document.querySelector("#cardHelp").onclick=()=>helpCard(id);
 document.querySelector("#cardCheck").onclick=()=>checkCard(id,document.querySelector("#spAnswerInput").value);
 document.querySelector("#spAnswerInput").addEventListener("keydown",e=>{if(e.key==="Enter")checkCard(id,e.target.value)});
}
function renderPending(id,task){
 const title=TASKS.find(t=>t[0]===task)?.[2]||"Aufgabe";
 const grammar=["verb-type","choose-form","write-form","speak-form","sentence","exam"].includes(task);
 app.innerHTML=`<section class="fi-card"><div class="fi-section-head"><h2>${esc(title)}</h2><span class="fi-pill">Gruppe ${id}</span></div>${grammar?`<div class="fi-grammar-info"><strong>Finnische Grammatik:</strong> Diese Aufgabe wird nicht mit deutscher Grammatik übernommen. Sie bekommt eine eigene finnische Erklärung und finnische Regeln.</div>`:""}<div class="fi-placeholder"><p>Diese Aufgabe bekommt dieselbe SprachPilot-Logik mit Hilfe, richtigen/falschen Antworten und gespeichertem Fortschritt. Sie wird als nächster eigener Schritt für Finnisch umgesetzt.</p></div><a class="btn secondary" href="${href({group:id})}">Zurück</a></section>`
}
function bindSpeak(){document.querySelectorAll("[data-speak]").forEach(b=>b.onclick=()=>speak(b.dataset.speak))}
function render(){
 const r=route();renderHeader(r);
 if(r.task&&r.group){if(r.task==="cards")renderCards(r.group);else renderPending(r.group,r.task);return}
 if(r.group){renderGroup(r.group);return}
 if(r.view==="overview"){renderOverview();return}
 renderHome()
}
window.addEventListener("popstate",render);
render();
