function $(id){return document.getElementById(id)}
function clean(s){return String(s||"").trim().toLowerCase().replace(/[.,!?]/g,"").replace(/ß/g,"ss").replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/\s+/g," ")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}

let profile = null;
let state = {
  phase:"assessment", index:0,
  known:[], unsure:[], unknown:[], active:[], learned:[], practicePool:[], archivedPackages:[],
  weak:{}, currentGame:"", currentVerb:"", currentTask:null, memoryCards:[], memoryDone:[], first:null, lock:false,
  skillDone:{}, skillAttempts:{}, skillSuccess:{}, taskQueues:{}, taskDoneSets:{},
  alertsShown:{}, taskRewardsShown:{}, packageNo:1, assessmentStart:0, revealed:false,
  exam:{passed:false,score:0,stars:0,answers:[],current:0,items:[]}
};

const VERB_SKILLS=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];
const VERB_SKILL_LABELS={karteikarte:"Karteikarten",memory:"Memory",bild_verb:"Bild → Verb",verb_bild:"Verb → Bild",schreiben:"Schreiben",hoeren_schreiben:"Hören → Schreiben",hoeren_sprechen:"Hören → Sprechen",bild_sprechen:"Bild → Sprechen",satz_puzzle:"Satz-Puzzle",konjugieren:"Konjugieren",pruefung:"Prüfung"};
const ASSESSMENT_FAST_SECONDS=7;
function nativeLang(){return (profile&&profile.muttersprache)||"Englisch"}
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
  (state.active||[]).forEach(ensureSkillState);
}
const VERB_IMAGE_BASES=[
  "assets/img/",
  "assets/",
  "/assets/img/",
  "/assets/",
  "https://raw.githubusercontent.com/studyroomslandstuhl-rgb/sprachpilot/4f1ebc6391558b144fbad1cfcb18a758d5634160/assets/img/",
  "https://raw.githubusercontent.com/studyroomslandstuhl-rgb/sprachpilot/4f1ebc6391558b144fbad1cfcb18a758d5634160/assets/"
];
function imageFileName(v){
  const entry=(typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).find(x=>x.v===v);
  const base=(entry&&entry.img)?entry.img:String(v||"").toLowerCase().replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  return String(base).endsWith(".png")?String(base):String(base)+".png";
}
function imageBox(v,small=false){const cls=small?"mem-img-holder":"img-holder";return `<span class="${cls}" data-verb="${safeText(v)}"><span class="image-fallback">Bild</span></span>`}
function hydrateImages(root=document){
  root.querySelectorAll("[data-verb]").forEach(box=>{
    if(box.dataset.loaded==="1")return;
    box.dataset.loaded="1";
    const v=box.getAttribute("data-verb");
    const file=imageFileName(v);
    const img=document.createElement("img");
    img.alt="";
    img.loading="eager";
    img.decoding="async";
    let pos=0;
    const tryNext=()=>{
      if(pos>=VERB_IMAGE_BASES.length){box.innerHTML="<span class='image-fallback'>Bild</span>";return;}
      img.src=VERB_IMAGE_BASES[pos++]+file;
    };
    img.onerror=tryNext;
    box.textContent="";
    box.appendChild(img);
    tryNext();
  });
}
function renderAndHydrate(){setTimeout(()=>hydrateImages(document),20)}
function loadProfile(){try{profile=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){profile=null}if(!profile){$("profileBox").innerHTML="<div class='no'>Bitte zuerst auf der Startseite registrieren oder einloggen.</div>";$("app").innerHTML="<button onclick=\"location.href='../'\">Zur Startseite</button>";return false}$("profileBox").innerHTML=`<div class="ok"><strong>${safeText(profile.vorname)} ${safeText(profile.nachname)}</strong><br><span class="small">Kurs: ${safeText(profile.kurs||profile.kursnummer||"")} · Sprache: ${safeText(nativeLang())}</span></div>`;return true}
async function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey())||"null");if(saved)state={...state,...saved}}catch(e){}migrateState();const sid=firebaseStudentId();if(sid&&db){try{const snap=await db.collection("progress").doc(sid).get();if(snap.exists){const data=snap.data()||{};if(data.verben&&data.verben.state){state={...state,...data.verben.state};migrateState();localStorage.setItem(storageKey(),JSON.stringify(state))}}}catch(e){console.warn("Firebase Laden fehlgeschlagen",e)}}}
function saveState(){migrateState();localStorage.setItem(storageKey(),JSON.stringify(state));sendProgress()}

function rememberPhase(phase){state.phase=phase;saveState()}
function clearCurrentTask(skill){if(!state.currentTask || !skill || state.currentTask.skill===skillKey(skill)) state.currentTask=null}
function resetPackageTasks(){state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[]}}
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
