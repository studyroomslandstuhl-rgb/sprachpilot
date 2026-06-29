function $(id){return document.getElementById(id)}
function clean(s){return String(s||"").trim().toLowerCase().replace(/[.,!?]/g,"").replace(/ß/g,"ss").replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/\s+/g," ")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}

let profile = null;
let state = {
  phase:"home", index:0,
  known:[], unsure:[], unknown:[], active:[], learned:[], practicePool:[], archivedPackages:[],
  weak:{}, currentGame:"", currentVerb:"", currentTask:null, memoryCards:[], memoryDone:[], first:null, lock:false,
  skillDone:{}, skillAttempts:{}, skillSuccess:{}, taskQueues:{}, taskDoneSets:{},
  alertsShown:{}, taskRewardsShown:{}, packageNo:1, assessmentStart:0, revealed:false,
  exam:{passed:false,score:0,stars:0,answers:[],current:0,items:[]}
};

const VERB_SKILLS=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];
const VERB_SKILL_LABELS={karteikarte:"Karteikarten",memory:"Memory",bild_verb:"Bild → Verb",verb_bild:"Verb → Bild",schreiben:"Schreiben",hoeren_schreiben:"Hören → Schreiben",hoeren_sprechen:"Hören → Sprechen",bild_sprechen:"Bild → Sprechen",satz_puzzle:"Satz-Puzzle",konjugieren:"Konjugieren",pruefung:"Prüfung"};
const ASSESSMENT_FAST_SECONDS=7;
function normalizeLangName(lang){
  const raw=String(lang||"Englisch").trim();
  const map={
    "English":"Englisch","englisch":"Englisch",
    "Russian":"Russisch","russisch":"Russisch",
    "Ukrainian":"Ukrainisch","ukrainisch":"Ukrainisch",
    "Arabic":"Arabisch","arabisch":"Arabisch",
    "Turkish":"Türkisch","Türkisch":"Türkisch","tuerkisch":"Türkisch","turkisch":"Türkisch",
    "Romanian":"Rumänisch","Rumänisch":"Rumänisch","rumaenisch":"Rumänisch",
    "Japanese":"Japanisch","japanisch":"Japanisch"
  };
  return map[raw]||map[raw.toLowerCase()]||raw;
}
function nativeLang(){return normalizeLangName((profile&&profile.muttersprache)||"Englisch")}
function nativeWord(v){const lang=nativeLang();return (VERB_TRANSLATIONS[lang]&&VERB_TRANSLATIONS[lang][v])||(VERB_TRANSLATIONS["Englisch"]&&VERB_TRANSLATIONS["Englisch"][v])||v}
function storageKey(){return "SP_VERBS_"+(profile?profile.userId||profile.studentId:"guest")}
function firebaseStudentId(){return profile && (profile.studentId||profile.userId)}
function ensureSkillState(v){state.skillDone[v]=state.skillDone[v]||{};state.skillAttempts[v]=state.skillAttempts[v]||{};state.skillSuccess[v]=state.skillSuccess[v]||{}}
function migrateState(){
  ["known","unsure","unknown","active","learned","practicePool","archivedPackages"].forEach(k=>state[k]=state[k]||[]);
  ["weak","skillDone","skillAttempts","skillSuccess","taskQueues","taskDoneSets","alertsShown","taskRewardsShown"].forEach(k=>state[k]=state[k]||{});
  state.packageNo=state.packageNo||1;
  state.exam=state.exam||{passed:false,score:0,stars:0,answers:[],current:0,items:[]};
  state.currentTask=state.currentTask||null;
  const assessed=new Set([...(state.known||[]),...(state.unsure||[]),...(state.unknown||[])]);
  state.active=(state.active||[]).filter(v=>assessed.has(v));
  if(state.active.length>20)state.active=state.active.slice(0,20);
  if(state.currentTask&&state.currentTask.v&&!state.active.includes(state.currentTask.v))state.currentTask=null;
  (state.active||[]).forEach(ensureSkillState);
}
const VERB_IMAGE_BASES=[
  "/assets/img/",
  "/assets/",
  "assets/img/",
  "assets/",
  "../assets/img/",
  "../assets/",
  "../../assets/img/",
  "../../assets/",
  "/sprachpilot/assets/img/",
  "/sprachpilot/assets/",
  "https://studyroomslandstuhl-rgb.github.io/sprachpilot/assets/img/",
  "https://studyroomslandstuhl-rgb.github.io/sprachpilot/assets/"
];
const VERB_IMAGE_CACHE={};
const VERB_MISSING_IMAGES={};
function imageBaseName(v){
  const entry=(typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).find(x=>x.v===v);
  return (entry&&entry.img)?String(entry.img):String(v||"").toLowerCase().replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function imageFileCandidates(v){
  const base=imageBaseName(v);
  if(/\.(png|jpg|jpeg|webp)$/i.test(base)) return [base];
  return [base+".png",base+".jpg",base+".webp"];
}
function imageCandidates(v){
  const files=imageFileCandidates(v), out=[];
  VERB_IMAGE_BASES.forEach(base=>files.forEach(file=>out.push(base+file)));
  return out;
}
function imageBox(v,small=false){const cls=small?"mem-img-holder":"img-holder";return `<span class="${cls}" data-verb="${safeText(v)}"><span class="image-fallback">Bild</span></span>`}
function hydrateImages(root=document){
  root.querySelectorAll("[data-verb]").forEach(box=>{
    if(box.dataset.loaded==="1")return;
    const v=box.getAttribute("data-verb");
    if(VERB_IMAGE_CACHE[v]){
      box.dataset.loaded="1";
      box.innerHTML=`<img alt="${safeText(v)}" src="${VERB_IMAGE_CACHE[v]}" loading="eager" decoding="async">`;
      box.classList.add("image-loaded");
      return;
    }
    if(VERB_MISSING_IMAGES[v]){
      box.dataset.loaded="1";
      box.innerHTML="<span class='image-fallback'>Bild fehlt</span>";
      return;
    }
    box.dataset.loaded="1";
    const candidates=imageCandidates(v);
    const img=document.createElement("img");
    img.alt=safeText(v);
    img.loading="eager";
    img.decoding="async";
    let pos=0;
    const tryNext=()=>{
      if(pos>=candidates.length){VERB_MISSING_IMAGES[v]=true;box.innerHTML="<span class='image-fallback'>Bild fehlt</span>";return;}
      img.src=candidates[pos++];
    };
    img.onerror=tryNext;
    img.onload=()=>{VERB_IMAGE_CACHE[v]=img.src;box.classList.add("image-loaded")};
    box.textContent="";
    box.appendChild(img);
    tryNext();
  });
}
function preloadVerbImages(list){
  (list||[]).slice(0,20).forEach(v=>{
    if(VERB_IMAGE_CACHE[v]||VERB_MISSING_IMAGES[v])return;
    const candidates=imageCandidates(v);let pos=0;const img=new Image();
    img.onload=()=>{VERB_IMAGE_CACHE[v]=img.src};
    img.onerror=()=>{if(++pos<candidates.length)img.src=candidates[pos];else VERB_MISSING_IMAGES[v]=true};
    img.src=candidates[pos];
  });
}
function renderAndHydrate(){setTimeout(()=>{hydrateImages(document);preloadVerbImages(state.active||[])},20)}
function loadProfile(){
  try{profile=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){profile=null}
  if(!profile){
    const app=$("app");
    if(app) app.innerHTML=`<section class="card"><div class="no">Bitte zuerst auf der Startseite registrieren oder einloggen.</div><button onclick="location.href='/index.html'">Zur Startseite</button></section>`;
    return false
  }
  const profileBox=$("profileBox");
  if(profileBox){profileBox.innerHTML=`<div class="ok"><strong>${safeText(profile.vorname)} ${safeText(profile.nachname)}</strong><br><span class="small">Kurs: ${safeText(profile.kurs||profile.kursnummer||"")} · Sprache: ${safeText(nativeLang())}</span></div>`}
  return true
}
async function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey())||"null");if(saved)state={...state,...saved}}catch(e){}migrateState();const sid=firebaseStudentId();if(sid&&db){try{const snap=await db.collection("progress").doc(sid).get();if(snap.exists){const data=snap.data()||{};if(data.verben&&data.verben.state){state={...state,...data.verben.state};migrateState();localStorage.setItem(storageKey(),JSON.stringify(state))}}}catch(e){console.warn("Firebase Laden fehlgeschlagen",e)}}}
function saveState(){migrateState();localStorage.setItem(storageKey(),JSON.stringify(state));sendProgress()}

function feedbackForTry(tries, solution, typeText="Form und Schreibweise"){
  if(tries===1)return "Da ist noch ein Fehler.";
  if(tries===2)return "Tipp: Prüfe "+typeText+".";
  return "Lösung: "+solution;
}
function taskWrong(skill, solution, hint){
  const sk=skillKey(skill);
  if(!state.currentTask||state.currentTask.skill!==sk)state.currentTask={skill:sk,v:state.currentVerb||"",slot:null};
  state.currentTask.tries=(state.currentTask.tries||0)+1;
  state.currentTask.hadWrong=true;
  const fb=$("fb")||$("assessmentFeedback");
  if(fb)fb.innerHTML=`<div class="no">${safeText(feedbackForTry(state.currentTask.tries, solution, hint))}</div>`;
  saveState();
}
function finishAfterCorrect(skill,v,nextFn){
  const sk=skillKey(skill);
  const hadWrong=!!(state.currentTask&&state.currentTask.skill===sk&&state.currentTask.hadWrong);
  const fb=$("fb");
  if(fb)fb.innerHTML="<div class='ok'>Richtig.</div>";
  addEncounter(v,sk,!hadWrong);
  finishQueuedVerb(sk,v,!hadWrong);
  setTimeout(nextFn,650);
}
function activeVerbList(){return (state.active&&state.active.length)?state.active:[]}
function verbOptions(correct,count=4){
  const source=activeVerbList().filter(x=>x!==correct);
  const pool=source.length?source:ALL_VERBS.map(x=>x.v).filter(x=>x!==correct);
  return shuffle([correct,...shuffle(pool).slice(0,count-1)]);
}

function rememberPhase(phase){
  state.phase=phase;
  const app=$("app");
  if(app){if(phase==="home")app.classList.remove("card");else app.classList.add("card")}
  if(phase!=="home" && location.hash!=="#"+phase){
    try{history.pushState({spVerbPhase:phase},"","#"+phase)}catch(e){}
  }
  saveState();
}
function clearCurrentTask(skill){if(!state.currentTask || !skill || state.currentTask.skill===skillKey(skill)) state.currentTask=null}
function resetPackageTasks(){state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.memoryOpen=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[]}}
function packageExamPassed(){return !!(state.exam&&state.exam.passed&&Number(state.exam.score)===100)}
function allPracticeTasksDone(){return VERB_SKILLS.every(s=>taskDone(s))}
function canStartNewAssessment(){return !state.active.length || packageExamPassed()}
function completeCurrentPackage(){
  if(!state.active.length)return;
  state.active.forEach(v=>{if(!state.learned.includes(v))state.learned.push(v); if(!state.known.includes(v))state.known.push(v)});
  state.archivedPackages.push({packageNo:state.packageNo||1,verbs:[...state.active],completedAt:new Date().toISOString(),exam:state.exam});
  state.active=[]; resetPackageTasks(); state.packageNo=(state.packageNo||1)+1; saveState();
}
function handleAssessmentClick(){
  if(state.active.length && !packageExamPassed()){
    $("app").innerHTML=`<h2>Neue Verben noch gesperrt</h2><div class="no">Du kannst neue Verben erst einschätzen, wenn die aktuelle Prüfung 100% hat.</div><button class="secondary" onclick="renderHome()">Zur Übersicht</button>`;
    state.phase="home"; saveState(); return;
  }
  if(packageExamPassed()) completeCurrentPackage();
  startAssessment();
}
