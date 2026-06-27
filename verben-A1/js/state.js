function $(id){return document.getElementById(id)}
function clean(s){return String(s||"").trim().toLowerCase().replace(/[.,!?]/g,"")}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function safeText(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}
function isTeacherPreview(){return (localStorage.getItem("SP_LOGIN_ROLE")==="teacher"||localStorage.getItem("SP_USER_ROLE")==="teacher") && (localStorage.getItem("SP_TEACHER_PREVIEW")==="1"||localStorage.getItem("SP_TEACHER_MODE")==="1")}
function currentStudentProfile(){try{return JSON.parse(localStorage.getItem("SP_STUDENT_PROFILE")||localStorage.getItem("SP_USER_PROFILE")||"null")}catch(e){return null}}
function currentTeacherProfile(){try{return JSON.parse(localStorage.getItem("SP_TEACHER_PROFILE")||"null")}catch(e){return null}}

let profile = null;
let state = {
  phase:"assessment", index:0,
  known:[], unsure:[], unknown:[], active:[], learned:[], practicePool:[],
  weak:{}, currentGame:"", currentVerb:"", memoryCards:[], first:null, lock:false,
  skillDone:{}, skillAttempts:{}, skillSuccess:{}, taskQueues:{}, taskDoneSets:{},
  alertsShown:{}, taskRewardsShown:{}, packageNo:1, assessmentStart:0, revealed:false
};

const VERB_SKILLS=["karteikarte","memory","bild_verb","verb_bild","schreiben","hoeren_schreiben","hoeren_sprechen","bild_sprechen","satz_puzzle"];
const VERB_SKILL_LABELS={karteikarte:"Karteikarten",memory:"Memory",bild_verb:"Bild → Verb",verb_bild:"Verb → Bild",schreiben:"Schreiben",hoeren_schreiben:"Hören → Schreiben",hoeren_sprechen:"Hören → Sprechen",bild_sprechen:"Bild → Sprechen",satz_puzzle:"Satz-Puzzle"};
const ASSESSMENT_FAST_SECONDS=7;
function nativeLang(){return (profile&&profile.muttersprache)||"Englisch"}
function nativeWord(v){const lang=nativeLang();return (VERB_TRANSLATIONS[lang]&&VERB_TRANSLATIONS[lang][v])||(VERB_TRANSLATIONS["Englisch"]&&VERB_TRANSLATIONS["Englisch"][v])||v}
function storageKey(){return "SP_VERBS_"+(isTeacherPreview()?"teacher_preview":(profile?profile.userId||profile.studentId:"guest"))}
function firebaseStudentId(){return profile && (profile.studentId||profile.userId)}
function ensureSkillState(v){state.skillDone[v]=state.skillDone[v]||{};state.skillAttempts[v]=state.skillAttempts[v]||{};state.skillSuccess[v]=state.skillSuccess[v]||{}}
function migrateState(){["known","unsure","unknown","active","learned","practicePool"].forEach(k=>state[k]=state[k]||[]);["weak","skillDone","skillAttempts","skillSuccess","taskQueues","taskDoneSets","alertsShown","taskRewardsShown"].forEach(k=>state[k]=state[k]||{});state.packageNo=state.packageNo||1;(state.active||[]).forEach(ensureSkillState)}
function imageFileName(v){return String(v||"").toLowerCase().replaceAll("ä","ae").replaceAll("ö","oe").replaceAll("ü","ue").replaceAll("ß","ss").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".png"}
function imageBox(v,small=false){const cls=small?"mem-img-holder":"img-holder";return `<span class="${cls}" data-verb="${safeText(v)}"><span class="image-fallback">Bild</span></span>`}
function hydrateImages(root=document){root.querySelectorAll("[data-verb]").forEach(box=>{if(box.dataset.loaded==="1")return;box.dataset.loaded="1";const v=box.getAttribute("data-verb");const img=document.createElement("img");img.alt="";img.loading="eager";img.decoding="async";img.src="bilder/"+imageFileName(v);img.onerror=()=>{box.innerHTML="<span class='image-fallback'>Bild</span>"};box.textContent="";box.appendChild(img)})}
function renderAndHydrate(){setTimeout(()=>hydrateImages(document),20)}
function loadProfile(){
  if(isTeacherPreview()){
    const t=currentTeacherProfile()||{};
    profile={userId:"teacher_preview",studentId:"teacher_preview",vorname:t.vorname||t.firstName||"Lehrer",nachname:t.nachname||t.lastName||"Vorschau",kurs:localStorage.getItem("SP_PREVIEW_COURSE_CODE")||localStorage.getItem("SP_PREVIEW_COURSE")||"Lehrer-Testmodus",muttersprache:"Englisch",isTeacherPreview:true};
  } else {
    profile=currentStudentProfile();
  }
  if(!profile){
    $("profileBox").innerHTML="<div class='no'>Bitte zuerst auf der Startseite registrieren oder einloggen.</div>";
    $("app").innerHTML="<button onclick=\"location.href='/index.html'\">Zur Startseite</button>";
    return false;
  }
  const name=`${safeText(profile.vorname)} ${safeText(profile.nachname)}`.trim()||"Schüler/in";
  $("profileBox").innerHTML=`<div class="ok"><strong>${name}</strong><br><span class="small">Kurs: ${safeText(profile.kurs||profile.kursnummer||"")} · Sprache: ${safeText(nativeLang())}</span></div>`;
  return true;
}
async function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey())||"null");if(saved)state={...state,...saved}}catch(e){}migrateState();const sid=firebaseStudentId();if(sid&&db){try{const snap=await db.collection("progress").doc(sid).get();if(snap.exists){const data=snap.data()||{};if(data.verben&&data.verben.state){state={...state,...data.verben.state};migrateState();localStorage.setItem(storageKey(),JSON.stringify(state))}}}catch(e){console.warn("Firebase Laden fehlgeschlagen",e)}}}
function saveState(){migrateState();localStorage.setItem(storageKey(),JSON.stringify(state));sendProgress()}
