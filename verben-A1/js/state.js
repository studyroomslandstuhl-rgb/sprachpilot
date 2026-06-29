function $(id){return document.getElementById(id)}
function clean(s){return String(s||"").trim().toLowerCase().replace(/[.,!?]/g,"").replace(/ÃŸ/g,"ss").replace(/Ã¤/g,"a").replace(/Ã¶/g,"o").replace(/Ã¼/g,"u").replace(/\s+/g," ")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}

let profile = null;
let state = {
  phase:"home", index:0,
  known:[], unsure:[], unknown:[], active:[], learned:[], practicePool:[], archivedPackages:[],
  weak:{}, currentGame:"", currentVerb:"", currentTask:null, memoryCards:[], memoryDone:[], first:null, openCards:[], lock:false,
  skillDone:{}, skillAttempts:{}, skillSuccess:{}, taskQueues:{}, taskDoneSets:{},
  alertsShown:{}, taskRewardsShown:{}, packageNo:1, assessmentStart:0, assessmentTries:0, revealed:false,
  exam:{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}
};

const VERB_SKILLS=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];
const VERB_SKILL_LABELS={karteikarte:"Karteikarten",memory:"Memory",bild_verb:"Bild â†’ Verb",verb_bild:"Verb â†’ Bild",schreiben:"Schreiben",hoeren_schreiben:"HÃ¶ren â†’ Schreiben",hoeren_sprechen:"HÃ¶ren â†’ Sprechen",bild_sprechen:"Bild â†’ Sprechen",satz_puzzle:"Satz-Puzzle",konjugieren:"Konjugieren",pruefung:"PrÃ¼fung"};
const ASSESSMENT_FAST_SECONDS=7;
function nativeLang(){return (profile&&profile.muttersprache)||"Englisch"}
function normalizedNativeLang(){
  const raw=String(nativeLang()||"").trim().toLowerCase();
  const aliases={
    "english":"Englisch","englisch":"Englisch","en":"Englisch",
    "russian":"Russisch","russisch":"Russisch","Ñ€ÑƒÑÑÐºÐ¸Ð¹":"Russisch","ru":"Russisch",
    "ukrainian":"Ukrainisch","ukrainisch":"Ukrainisch","ÑƒÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ°":"Ukrainisch","uk":"Ukrainisch",
    "arabic":"Arabisch","arabisch":"Arabisch","Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©":"Arabisch","ar":"Arabisch",
    "turkish":"TÃ¼rkisch","tÃ¼rkisch":"TÃ¼rkisch","turkisch":"TÃ¼rkisch","tÃ¼rkÃ§e":"TÃ¼rkisch","tr":"TÃ¼rkisch",
    "romanian":"RumÃ¤nisch","rumÃ¤nisch":"RumÃ¤nisch","rumanisch":"RumÃ¤nisch","romÃ¢nÄƒ":"RumÃ¤nisch","ro":"RumÃ¤nisch",
    "japanese":"Japanisch","japanisch":"Japanisch","æ—¥æœ¬èªž":"Japanisch","ja":"Japanisch"
  };
  return aliases[raw] || nativeLang();
}
function nativeWord(v){
  const lang=normalizedNativeLang();
  return (VERB_TRANSLATIONS[lang]&&VERB_TRANSLATIONS[lang][v])||(VERB_TRANSLATIONS["Englisch"]&&VERB_TRANSLATIONS["Englisch"][v])||v;
}
function storageKey(){return "SP_VERBS_"+(profile?profile.userId||profile.studentId:"guest")}
function firebaseStudentId(){return profile && (profile.studentId||profile.userId)}
function canSaveVerbProgress(){return typeof spCanSaveStudentProgress!=="function" || spCanSaveStudentProgress()}
function verbProgressStore(){return canSaveVerbProgress()?localStorage:sessionStorage}
function verbProgressKey(key){if(canSaveVerbProgress())return key;const course=(profile&&(profile.courseCode||profile.kurs||profile.kursnummer))||"kurs";return "SP_TEACHER_PREVIEW_PROGRESS_"+course+"_"+key}
function ensureSkillState(v){state.skillDone[v]=state.skillDone[v]||{};state.skillAttempts[v]=state.skillAttempts[v]||{};state.skillSuccess[v]=state.skillSuccess[v]||{}}
function migrateState(){
  ["known","unsure","unknown","active","learned","practicePool","archivedPackages","memoryDone","openCards"].forEach(k=>state[k]=state[k]||[]);
  ["weak","skillDone","skillAttempts","skillSuccess","taskQueues","taskDoneSets","alertsShown","taskRewardsShown"].forEach(k=>state[k]=state[k]||{});
  state.packageNo=state.packageNo||1;
  state.exam=state.exam||{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0};
  state.currentTask=state.currentTask||null;
  state.assessmentTries=state.assessmentTries||0;
  (state.active||[]).forEach(ensureSkillState);
}

const VERB_IMAGE_BASES=[
  "/sprachpilot/assets/",
  "/sprachpilot/assets/img/",
  "/assets/",
  "/assets/img/",
  "assets/",
  "assets/img/",
  "../assets/",
  "../assets/img/",
  "../../assets/",
  "../../assets/img/",
  "https://raw.githubusercontent.com/studyroomslandstuhl-rgb/sprachpilot/4f1ebc6391558b144fbad1cfcb18a758d5634160/assets/",
  "https://raw.githubusercontent.com/studyroomslandstuhl-rgb/sprachpilot/4f1ebc6391558b144fbad1cfcb18a758d5634160/assets/img/",
  "https://studyroomslandstuhl-rgb.github.io/sprachpilot/assets/",
  "https://studyroomslandstuhl-rgb.github.io/sprachpilot/assets/img/"
];
function imageBaseName(v){
  const entry=(typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).find(x=>x.v===v);
  return (entry&&entry.img)?String(entry.img):String(v||"").toLowerCase().replaceAll("Ã¤","ae").replaceAll("Ã¶","oe").replaceAll("Ã¼","ue").replaceAll("ÃŸ","ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
}
function imageFileCandidates(v){
  const base=imageBaseName(v);
  if(/\.(png|jpg|jpeg|webp)$/i.test(base)) return [base];
  return [base+".png",base+".jpg",base+".webp"];
}
function imageBox(v,small=false){const cls=small?"mem-img-holder":"img-holder";return `<span class="${cls}" data-verb="${safeText(v)}"><span class="image-fallback">Bild</span></span>`}
function hydrateImages(root=document){
  root.querySelectorAll("[data-verb]").forEach(box=>{
    if(box.dataset.loaded==="1")return;
    box.dataset.loaded="1";
    const v=box.getAttribute("data-verb");
    const files=imageFileCandidates(v);
    const img=document.createElement("img");
    img.alt=safeText(v);
    img.loading="eager";
    img.decoding="async";
    let basePos=0,filePos=0;
    const tryNext=()=>{
      if(filePos>=files.length){filePos=0;basePos++;}
      if(basePos>=VERB_IMAGE_BASES.length){box.innerHTML="<span class='image-fallback'>Bild fehlt</span>";return;}
      img.src=VERB_IMAGE_BASES[basePos]+files[filePos++];
    };
    img.onerror=tryNext;
    img.onload=()=>{box.classList.add("image-loaded")};
    box.textContent="";
    box.appendChild(img);
    tryNext();
  });
}
function renderAndHydrate(){setTimeout(()=>hydrateImages(document),20)}
function preloadActiveImages(){(state.active||[]).forEach(v=>{const files=imageFileCandidates(v);const img=new Image();img.src=VERB_IMAGE_BASES[0]+files[0];})}

function loadProfile(){
  try{profile=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){profile=null}
  if(!profile){
    const app=$("app");
    if(app) app.innerHTML=`<section class="card"><div class="no">Bitte zuerst auf der Startseite registrieren oder einloggen.</div><button onclick="location.href='/index.html'">Zur Startseite</button></section>`;
    return false
  }
  const profileBox=$("profileBox");
  if(profileBox){profileBox.innerHTML=`<div class="ok"><strong>${safeText(profile.vorname)} ${safeText(profile.nachname)}</strong><br><span class="small">Kurs: ${safeText(profile.kurs||profile.kursnummer||"")} Â· Sprache: ${safeText(nativeLang())}</span></div>`}
  return true
}
async function loadState(){try{const saved=JSON.parse(verbProgressStore().getItem(verbProgressKey(storageKey()))||"null");if(saved)state={...state,...saved}}catch(e){}migrateState();const sid=firebaseStudentId();if(canSaveVerbProgress()&&sid&&db){try{const snap=await db.collection("progress").doc(sid).get();if(snap.exists){const data=snap.data()||{};if(data.verben&&data.verben.state){state={...state,...data.verben.state};migrateState();verbProgressStore().setItem(verbProgressKey(storageKey()),JSON.stringify(state))}}}catch(e){console.warn("Firebase Laden fehlgeschlagen",e)}}}
function saveState(){migrateState();verbProgressStore().setItem(verbProgressKey(storageKey()),JSON.stringify(state));if(canSaveVerbProgress())sendProgress()}

const PHASE_HASHES={assessment:"assessment",karteikarte:"karteikarte",memory:"memory",bild_verb:"bild-verb",verb_bild:"verb-bild",schreiben:"schreiben",hoeren_schreiben:"hoeren-schreiben",hoeren_sprechen:"hoeren-sprechen",bild_sprechen:"bild-sprechen",satz_puzzle:"satz-puzzle",konjugieren:"konjugieren",pruefung:"pruefung"};
const HASH_PHASES=Object.fromEntries(Object.entries(PHASE_HASHES).map(([k,v])=>[v,k]));
function setVerbHashForPhase(phase){
  if(!phase||phase==="home")return;
  const h=PHASE_HASHES[phase];
  if(h && location.hash!=="#"+h){history.pushState(null,"","#"+h)}
}
function clearVerbHash(replace=true){
  if(location.hash){const url=location.pathname+location.search;if(replace)history.replaceState(null,"",url);else history.pushState(null,"",url)}
}
function phaseFromHash(){return HASH_PHASES[(location.hash||"").replace(/^#/,"")]||"home"}

function rememberPhase(phase){state.phase=phase;const app=$("app");if(app){if(phase==="home")app.classList.remove("card");else app.classList.add("card")}if(phase!=="home")setVerbHashForPhase(phase);saveState()}
function clearCurrentTask(skill){if(!state.currentTask || !skill || state.currentTask.skill===skillKey(skill)) state.currentTask=null}
function resetPackageTasks(){state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}}
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
    $("app").innerHTML=`<h2>Neue Verben noch gesperrt</h2><div class="no">Du kannst neue Verben erst einschÃ¤tzen, wenn die aktuelle PrÃ¼fung 100% hat.</div><button class="secondary" onclick="renderHome()">Zur Ãœbersicht</button>`;
    state.phase="home"; saveState(); return;
  }
  if(packageExamPassed()) completeCurrentPackage();
  startAssessment();
}

function activeVerbPool(){return (state.active&&state.active.length)?[...state.active]:[]}
function optionVerbs(correct,count=4){
  const pool=activeVerbPool().filter(v=>v!==correct);
  return shuffle([correct,...shuffle(pool).slice(0,Math.max(0,count-1))]);
}
function currentTries(){return (state.currentTask&&Number(state.currentTask.tries))||0}
function currentHadWrong(){return !!(state.currentTask&&state.currentTask.hadWrong)}
function ensureAttempt(skill,v){
  const sk=skillKey(skill);
  if(!state.currentTask || state.currentTask.skill!==sk || state.currentTask.v!==v){state.currentTask={skill:sk,v,slot:null,tries:0,hadWrong:false,helped:false}}
  state.currentTask.tries=Number(state.currentTask.tries||0);
  state.currentTask.hadWrong=!!state.currentTask.hadWrong;
  state.currentTask.helped=!!state.currentTask.helped;
  return state.currentTask;
}
function markHelped(skill,v){const t=ensureAttempt(skill,v);t.helped=true;t.hadWrong=true;saveState()}
function standardFeedback(tries,solution,tip="Form und Schreibweise"){
  if(tries===1)return "Da ist noch ein Fehler.";
  if(tries===2)return "Tipp: PrÃ¼fe "+tip+".";
  return "LÃ¶sung: "+solution;
}
function handleWrongAnswer(skill,v,solution,tip="Form und Schreibweise",fbId="fb"){
  const t=ensureAttempt(skill,v);t.tries+=1;t.hadWrong=true;
  const fb=$(fbId);if(fb)fb.innerHTML=`<div class="no">${safeText(standardFeedback(t.tries,solution,tip))}</div>`;
  addEncounter(v,skill,false);
  saveState();
}
function handleCorrectAnswer(skill,v,nextFn,delay=600,fbId="fb"){
  const t=ensureAttempt(skill,v);
  const firstTry=!t.hadWrong&&!t.helped;
  const fb=$(fbId);if(fb)fb.innerHTML=`<div class="ok">Richtig.</div>`;
  addEncounter(v,skill,firstTry);
  finishQueuedVerb(skill,v,firstTry);
  setTimeout(nextFn,delay);
}
