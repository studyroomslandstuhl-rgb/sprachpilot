function $(id){return document.getElementById(id)}
function clean(s){return String(s||"").trim().toLowerCase().replace(/[.,!?]/g,"").replace(/ß/g,"ss").replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/\s+/g," ")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}

let profile = null;
let state = {
  phase:"home", index:0,
  known:[], unsure:[], unknown:[], active:[], learned:[], practicePool:[], archivedPackages:[], assessmentBatch:[], assessed:[], currentPackageVerbs:[],
  weak:{}, currentGame:"", currentVerb:"", currentTask:null, memoryCards:[], memoryDone:[], first:null, openCards:[], lock:false,
  skillDone:{}, skillAttempts:{}, skillSuccess:{}, taskQueues:{}, taskDoneSets:{},
  alertsShown:{}, taskRewardsShown:{}, packageNo:1, assessmentStart:0, assessmentTries:0, revealed:false,
  exam:{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}
};

const VERB_SKILLS=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle","konjugieren"];
const VERB_SKILL_LABELS={karteikarte:"Karteikarten",memory:"Memory",bild_verb:"Bild → Verb",verb_bild:"Verb → Bild",schreiben:"Schreiben",hoeren_schreiben:"Hören → Schreiben",hoeren_sprechen:"Hören → Sprechen",bild_sprechen:"Bild → Sprechen",satz_puzzle:"Satz-Puzzle",konjugieren:"Konjugieren",pruefung:"Prüfung"};
const ASSESSMENT_FAST_SECONDS=7;
const PRACTICE_TARGET_COUNT=20;
function nativeLang(){return (profile&&profile.muttersprache)||"Englisch"}
function normalizedNativeLang(){
  const raw=String(nativeLang()||"").trim().toLowerCase();
  const aliases={"english":"Englisch","englisch":"Englisch","en":"Englisch","russian":"Russisch","russisch":"Russisch","русский":"Russisch","ru":"Russisch","ukrainian":"Ukrainisch","ukrainisch":"Ukrainisch","українська":"Ukrainisch","uk":"Ukrainisch","arabic":"Arabisch","arabisch":"Arabisch","العربية":"Arabisch","ar":"Arabisch","turkish":"Türkisch","türkisch":"Türkisch","turkisch":"Türkisch","türkçe":"Türkisch","tr":"Türkisch","romanian":"Rumänisch","rumänisch":"Rumänisch","rumanisch":"Rumänisch","română":"Rumänisch","ro":"Rumänisch","japanese":"Japanisch","japanisch":"Japanisch","日本語":"Japanisch","ja":"Japanisch"};
  return aliases[raw] || nativeLang();
}
function nativeWord(v){const lang=normalizedNativeLang();return (VERB_TRANSLATIONS[lang]&&VERB_TRANSLATIONS[lang][v])||(VERB_TRANSLATIONS["Englisch"]&&VERB_TRANSLATIONS["Englisch"][v])||v}
function storageKey(){return "SP_VERBS_"+(profile?profile.userId||profile.studentId:"guest")}
function firebaseStudentId(){return profile && (profile.studentId||profile.userId)}
function ensureSkillState(v){state.skillDone[v]=state.skillDone[v]||{};state.skillAttempts[v]=state.skillAttempts[v]||{};state.skillSuccess[v]=state.skillSuccess[v]||{}}
function migrateState(){
  ["known","unsure","unknown","active","learned","practicePool","archivedPackages","memoryDone","openCards","assessmentBatch","assessed","currentPackageVerbs"].forEach(k=>state[k]=Array.isArray(state[k])?state[k]:[]);
  ["weak","skillDone","skillAttempts","skillSuccess","taskQueues","taskDoneSets","alertsShown","taskRewardsShown"].forEach(k=>state[k]=state[k]||{});
  state.packageNo=state.packageNo||1;
  state.exam=state.exam||{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0};
  state.currentTask=state.currentTask||null;
  state.assessmentTries=state.assessmentTries||0;
  const seed=uniqueList([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...(state.active||[])]);
  if(!state.currentPackageVerbs.length && seed.length) state.currentPackageVerbs=[...seed];
  if(!state.assessmentBatch.length && seed.length) state.assessmentBatch=[...seed];
  if(!state.unsure.length && !state.unknown.length && (state.active||[]).length){
    state.unsure=uniqueList(state.active||[]).filter(v=>!(state.known||[]).includes(v)&&!(state.learned||[]).includes(v));
  }
  normalizeVerbStatusLists();
  (state.active||[]).forEach(ensureSkillState);
}

function uniqueList(arr){return [...new Set((arr||[]).filter(Boolean))]}
function normalizeVerbStatusLists(){
  state.known=uniqueList(state.known);
  state.learned=uniqueList(state.learned);
  state.unsure=uniqueList(state.unsure).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
  state.unknown=uniqueList(state.unknown).filter(v=>!state.known.includes(v)&&!state.learned.includes(v)&&!state.unsure.includes(v));
  const baseActive=uniqueList([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[]),...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[])]).filter(v=>!state.known.includes(v)&&!state.learned.includes(v));
  state.active=baseActive;
  if(baseActive.length && !state.unsure.length && !state.unknown.length){
    state.unsure=[...baseActive];
  }
  state.assessmentBatch=uniqueList([...(state.assessmentBatch||[]),...baseActive]);
  state.assessed=uniqueList(state.assessed);
  state.currentPackageVerbs=uniqueList([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...baseActive]);
  const packageSeed=uniqueList([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...(state.active||[])]);
  if((state.active||[]).length && packageSeed.length<20 && (state.known||[]).length){packageSeed.push(...(state.known||[]).slice(-(20-packageSeed.length)))}
  if(packageSeed.length>state.currentPackageVerbs.length){state.currentPackageVerbs=uniqueList(packageSeed)}
}
function currentPracticeVerbs(){normalizeVerbStatusLists();return (state.active||[]).filter(v=>!(state.known||[]).includes(v)&&!(state.learned||[]).includes(v))}
function currentPackageAllVerbs(){normalizeVerbStatusLists();return uniqueList([...(state.currentPackageVerbs||[]), ...(state.assessmentBatch||[]), ...(state.active||[])])}
function currentAssessmentCount(){normalizeVerbStatusLists();return (state.assessmentBatch&&state.assessmentBatch.length)||0}

const VERB_IMAGE_CACHE_VERSION="33";
const VERB_IMAGE_BASES=["../assets/img/","/assets/img/","/sprachpilot/assets/img/","https://studyroomslandstuhl-rgb.github.io/sprachpilot/assets/img/","../assets/","/assets/","/sprachpilot/assets/"];
function imageBaseName(v){const entry=(typeof ALL_VERBS!=="undefined"?ALL_VERBS:[]).find(x=>x.v===v);return (entry&&entry.img)?String(entry.img):String(v||"").toLowerCase().replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
function imageFileCandidates(v){const base=imageBaseName(v);if(/\.(png|jpg|jpeg|webp)$/i.test(base)) return [base];return [base+".png",base+".jpg",base+".jpeg",base+".webp"]}
function imageSrcWithVersion(src){return src+(src.includes("?")?"&":"?")+"v="+VERB_IMAGE_CACHE_VERSION}
function imageMimeFromBytes(bytes){if(!bytes || bytes.length<12)return "";if(bytes[0]===0x89 && bytes[1]===0x50 && bytes[2]===0x4E && bytes[3]===0x47)return "image/png";if(bytes[0]===0xFF && bytes[1]===0xD8)return "image/jpeg";if(bytes[0]===0x52 && bytes[1]===0x49 && bytes[2]===0x46 && bytes[3]===0x46 && bytes[8]===0x57 && bytes[9]===0x45 && bytes[10]===0x42 && bytes[11]===0x50)return "image/webp";return ""}
function loadImageBlobUrl(src){return Promise.reject(new Error("disabled"))}
function imageBox(v,small=false){const cls=small?"mem-img-holder":"img-holder";return `<span class="${cls}" data-verb="${safeText(v)}"><span class="image-fallback">Bild</span></span>`}
function hydrateImages(root=document){root.querySelectorAll("[data-verb]").forEach(box=>{if(box.dataset.loaded==="1")return;box.dataset.loaded="1";const v=box.getAttribute("data-verb");const files=imageFileCandidates(v);const img=document.createElement("img");img.alt=safeText(v);img.loading="lazy";img.decoding="async";img.onerror=()=>{box.innerHTML="<span class='image-fallback'>Bild fehlt</span>";box.classList.add("image-missing")};img.onload=()=>{box.classList.add("image-loaded")};box.textContent="";box.appendChild(img);img.src=imageSrcWithVersion("/assets/img/"+files[0])})}
function renderAndHydrate(){setTimeout(()=>hydrateImages(document),120)}
function preloadActiveImages(){}

function loadProfile(){try{profile=JSON.parse(localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){profile=null}if(!profile){const app=$("app");if(app) app.innerHTML=`<section class="card"><div class="no">Bitte zuerst auf der Startseite registrieren oder einloggen.</div><button onclick="location.href='/index.html'">Zur Startseite</button></section>`;return false}const profileBox=$("profileBox");if(profileBox){profileBox.innerHTML=`<div class="ok"><strong>${safeText(profile.vorname)} ${safeText(profile.nachname)}</strong><br><span class="small">Kurs: ${safeText(profile.kurs||profile.kursnummer||"")} · Sprache: ${safeText(nativeLang())}</span></div>`}return true}
async function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey())||"null");if(saved)state={...state,...saved}}catch(e){}migrateState();localStorage.setItem(storageKey(),JSON.stringify(state))}
function saveState(){migrateState();localStorage.setItem(storageKey(),JSON.stringify(state));try{localStorage.setItem('SP_VERBS_LAST_STATE',JSON.stringify(state));localStorage.setItem('SP_VERBS_BACKUP_STATE',JSON.stringify(state));sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',JSON.stringify(state))}catch(e){}}

const PHASE_HASHES={home:"home",overview:"overview",chooser:"chooser",assessment:"assessment",karteikarte:"karteikarte",memory:"memory",bild_verb:"bild-verb",verb_bild:"verb-bild",schreiben:"schreiben",hoeren_schreiben:"hoeren-schreiben",hoeren_sprechen:"hoeren-sprechen",bild_sprechen:"bild-sprechen",satz_puzzle:"satz-puzzle",konjugieren:"konjugieren",pruefung:"pruefung"};
const HASH_PHASES=Object.fromEntries(Object.entries(PHASE_HASHES).map(([k,v])=>[v,k]));
function setVerbHashForPhase(phase){if(!phase||phase==="home")return;const h=PHASE_HASHES[phase];if(h && location.hash!=="#"+h){history.pushState(null,"","#"+h)}}
function clearVerbHash(replace=true){if(location.hash){const url=location.pathname+location.search;if(replace)history.replaceState(null,"",url);else history.pushState(null,"",url)}}
function phaseFromHash(){return HASH_PHASES[(location.hash||"").replace(/^#/,"")]||"home"}

function rememberPhase(phase){state.phase=phase;const app=$("app");if(app){if(phase==="home")app.classList.remove("card");else app.classList.add("card")}if(phase!=="home")setVerbHashForPhase(phase);saveState()}
function clearCurrentTask(skill){if(!state.currentTask || !skill || state.currentTask.skill===skillKey(skill)) state.currentTask=null}
function resetPackageTasks(){state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0}}
function packageExamPassed(){return !!(state.exam&&state.exam.passed&&Number(state.exam.score)===100)}
function allPracticeTasksDone(){return VERB_SKILLS.every(taskDone)}