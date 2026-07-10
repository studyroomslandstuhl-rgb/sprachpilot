function $(id){return document.getElementById(id)}
function clean(s){return String(s||'').trim().toLowerCase().replace(/[.,!?]/g,'').replace(/ß/g,'ss').replace(/ä/g,'a').replace(/ö/g,'o').replace(/ü/g,'u').replace(/\s+/g,' ')}
function shuffle(a){return [...(a||[])].sort(()=>Math.random()-.5)}
function safeText(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function uniqueList(arr){return [...new Set((arr||[]).filter(Boolean))]}
function readProfileJson(k,f=null){try{return JSON.parse(localStorage.getItem(k)||sessionStorage.getItem(k)||'')||f}catch(e){return f}}

let profile=null;
let state={
  phase:'home',index:0,
  known:[],learned:[],unsure:[],unknown:[],active:[],practicePool:[],archivedPackages:[],assessmentBatch:[],assessed:[],currentPackageVerbs:[],
  weak:{},currentGame:'',currentVerb:'',currentTask:null,memoryCards:[],memoryDone:[],first:null,openCards:[],lock:false,
  skillDone:{},skillAttempts:{},skillSuccess:{},taskQueues:{},taskDoneSets:{},
  alertsShown:{},taskRewardsShown:{},packageNo:1,assessmentStart:0,assessmentTries:0,revealed:false,
  exam:{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false}
};

const VERB_SKILLS=['karteikarte','memory','bild_verb','verb_bild','schreiben','hoeren_schreiben','hoeren_sprechen','bild_sprechen','satz_puzzle','konjugieren'];
const VERB_SKILL_LABELS={karteikarte:'Karteikarten',memory:'Memory',bild_verb:'Bild → Verb',verb_bild:'Verb → Bild',schreiben:'Schreiben',hoeren_schreiben:'Hören → Schreiben',hoeren_sprechen:'Hören → Sprechen',bild_sprechen:'Bild → Sprechen',satz_puzzle:'Satz-Puzzle',konjugieren:'Konjugieren',pruefung:'Prüfung'};
const ASSESSMENT_FAST_SECONDS=7;
const PRACTICE_TARGET_COUNT=20;

function nativeLang(){return (profile&&profile.muttersprache)||'Englisch'}
function normalizedNativeLang(){
  const raw=String(nativeLang()||'').trim().toLowerCase();
  const aliases={english:'Englisch',englisch:'Englisch',en:'Englisch',russian:'Russisch',russisch:'Russisch','русский':'Russisch',ru:'Russisch',ukrainian:'Ukrainisch',ukrainisch:'Ukrainisch','українська':'Ukrainisch',uk:'Ukrainisch',arabic:'Arabisch',arabisch:'Arabisch','العربية':'Arabisch',ar:'Arabisch',turkish:'Türkisch','türkisch':'Türkisch',turkisch:'Türkisch','türkçe':'Türkisch',tr:'Türkisch',romanian:'Rumänisch','rumänisch':'Rumänisch',rumanisch:'Rumänisch','română':'Rumänisch',ro:'Rumänisch',japanese:'Japanisch',japanisch:'Japanisch','日本語':'Japanisch',ja:'Japanisch'};
  return aliases[raw]||nativeLang();
}
function nativeWord(v){const lang=normalizedNativeLang();return (VERB_TRANSLATIONS[lang]&&VERB_TRANSLATIONS[lang][v])||(VERB_TRANSLATIONS.Englisch&&VERB_TRANSLATIONS.Englisch[v])||v}
function storageKey(){return 'SP_VERBS_'+(profile?(profile.userId||profile.studentId||profile.email||'guest'):'guest')}
function firebaseStudentId(){return profile&&(profile.studentId||profile.userId)}
function ensureSkillState(v){state.skillDone[v]=state.skillDone[v]||{};state.skillAttempts[v]=state.skillAttempts[v]||{};state.skillSuccess[v]=state.skillSuccess[v]||{}}
function migrateState(){
  ['known','learned','unsure','unknown','active','practicePool','archivedPackages','assessmentBatch','assessed','currentPackageVerbs','memoryCards','memoryDone','openCards'].forEach(k=>state[k]=Array.isArray(state[k])?state[k]:[]);
  ['weak','skillDone','skillAttempts','skillSuccess','taskQueues','taskDoneSets','alertsShown','taskRewardsShown'].forEach(k=>state[k]=state[k]||{});
  state.exam=state.exam||{passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false};
  state.packageNo=state.packageNo||1;state.assessmentStart=state.assessmentStart||0;state.assessmentTries=state.assessmentTries||0;state.currentTask=state.currentTask||null;
  normalizeVerbStatusLists();
  (state.active||[]).forEach(ensureSkillState);
}
function normalizeVerbStatusLists(){
  state.known=uniqueList(state.known);state.learned=uniqueList(state.learned);
  const mastered=new Set([...state.known,...state.learned]);
  state.unsure=uniqueList(state.unsure).filter(v=>!mastered.has(v));
  state.unknown=uniqueList(state.unknown).filter(v=>!mastered.has(v)&&!state.unsure.includes(v));
  state.active=uniqueList([...(state.active||[]),...(state.unsure||[]),...(state.unknown||[]),...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[])]).filter(v=>!mastered.has(v));
  state.currentPackageVerbs=uniqueList([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...state.active]).filter(v=>!mastered.has(v));
  state.assessmentBatch=uniqueList([...(state.assessmentBatch||[]),...state.active]).filter(v=>!mastered.has(v));
  state.assessed=uniqueList(state.assessed);
}
function currentPracticeVerbs(){normalizeVerbStatusLists();return state.active.slice()}
function currentPackageAllVerbs(){normalizeVerbStatusLists();return uniqueList([...(state.currentPackageVerbs||[]),...(state.assessmentBatch||[]),...(state.active||[])])}
function currentAssessmentCount(){return currentPackageAllVerbs().length}

const SP_BUNNY_IMAGE_BASE='https://sprachpilot.b-cdn.net/';
const VERB_IMAGE_CACHE_VERSION='bunny-20260710-preload';
const SP_VERB_IMAGE_READY=new Map();
const SP_VERB_IMAGE_LOADING=new Map();
function imageSlug(s){return String(s||'').toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function imageRawName(s){return String(s||'').trim().toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').replace(/\s+/g,'_').replace(/[\/]+/g,'_')}
function imageBaseNames(v){const entry=(typeof ALL_VERBS!=='undefined'?ALL_VERBS:[]).find(x=>x&&x.v===v);return uniqueList([String((entry&&entry.img)||'').replace(/^\/+/,''),imageSlug(v),imageRawName(v)]).filter(Boolean)}
function imageFileCandidates(v){const out=[];imageBaseNames(v).forEach(base=>{const stem=String(base).replace(/\.(webp|png|jpe?g)$/i,'');out.push(stem+'.webp',stem+'.png',stem+'.jpg',stem+'.jpeg')});return uniqueList(out)}
function imageSrcWithVersion(src){return encodeURI(src)+(src.includes('?')?'&':'?')+'v='+VERB_IMAGE_CACHE_VERSION}
function imageUrls(v){return imageFileCandidates(v).map(file=>imageSrcWithVersion(SP_BUNNY_IMAGE_BASE+file))}
function preloadVerbImage(v){
  if(!v)return Promise.resolve('');
  if(SP_VERB_IMAGE_READY.has(v))return Promise.resolve(SP_VERB_IMAGE_READY.get(v));
  if(SP_VERB_IMAGE_LOADING.has(v))return SP_VERB_IMAGE_LOADING.get(v);
  const urls=imageUrls(v);
  if(!urls.length)return Promise.resolve('');
  const p=new Promise(resolve=>{
    let i=0;
    const tryNext=()=>{
      if(i>=urls.length){resolve('');return}
      const img=new Image();
      img.decoding='async';
      img.loading='eager';
      img.onload=()=>{SP_VERB_IMAGE_READY.set(v,urls[i]);resolve(urls[i])};
      img.onerror=()=>{i++;tryNext()};
      img.src=urls[i];
    };
    tryNext();
  }).finally(()=>SP_VERB_IMAGE_LOADING.delete(v));
  SP_VERB_IMAGE_LOADING.set(v,p);
  return p;
}
function preloadVerbImages(list,limit=20){uniqueList(list).slice(0,limit).forEach(v=>preloadVerbImage(v))}
function imageBox(v,small=false){
  const cls=small?'mem-img-holder':'img-holder';
  const ready=SP_VERB_IMAGE_READY.get(v);
  if(ready)return `<span class="${cls} image-loaded" data-verb="${safeText(v)}" data-loaded="1"><img src="${ready}" alt="${safeText(v)}" loading="eager" decoding="sync" fetchpriority="high"></span>`;
  preloadVerbImage(v);
  return `<span class="${cls}" data-verb="${safeText(v)}"><span class="image-fallback">Bild</span></span>`
}
function hydrateImages(root=document){
  const boxes=[...root.querySelectorAll('[data-verb]')].filter(box=>box.dataset.loaded!=='1').slice(0,200);
  boxes.forEach(box=>{
    box.dataset.loaded='1';
    const v=box.getAttribute('data-verb')||'';
    const ready=SP_VERB_IMAGE_READY.get(v);
    const urls=imageUrls(v);
    if(!urls.length){box.innerHTML='<span class="image-fallback">Bild fehlt</span>';return}
    const img=document.createElement('img');img.alt=safeText(v);img.loading='eager';img.decoding='async';img.fetchPriority='high';let i=0;
    img.onload=()=>box.classList.add('image-loaded');
    img.onerror=()=>{i++;if(i<urls.length)img.src=urls[i];else{box.innerHTML='<span class="image-fallback">Bild fehlt</span>';box.classList.add('image-missing')}};
    box.textContent='';box.appendChild(img);img.src=ready||urls[0];
    preloadVerbImage(v);
  });
}
function renderAndHydrate(){hydrateImages(document);setTimeout(()=>hydrateImages(document),30)}
function preloadActiveImages(){try{preloadVerbImages([...(currentPracticeVerbs?currentPracticeVerbs():[]),...(state&&state.practicePool||[]),...(state&&state.currentPackageVerbs||[])],30)}catch(e){}}
if(typeof window!=='undefined'){
  window.hydrateImages=hydrateImages;window.renderAndHydrate=renderAndHydrate;window.preloadVerbImage=preloadVerbImage;window.preloadVerbImages=preloadVerbImages;window.preloadActiveImages=preloadActiveImages;
  document.addEventListener('toggle',e=>{if(e.target&&e.target.matches&&e.target.matches('details[open]'))setTimeout(()=>hydrateImages(e.target),30)},true)
}

function makeTeacherPreviewProfileLocal(){
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||localStorage.getItem('SP_LOGIN_CONTEXT')||'').toLowerCase();
  const preview=readProfileJson('SP_TEACHER_PREVIEW',null);
  if(role!=='teacher'||!preview||preview.teacherPreview!==true)return null;
  const teacher=readProfileJson('SP_TEACHER_PROFILE',{})||{};
  const firstName=teacher.firstName||teacher.vorname||teacher.name||'Lehrer';
  const lastName=teacher.lastName||teacher.nachname||'';
  const course=preview.courseCode||preview.kurs||(preview.allAccess?'ALLE':'Lehrer-Vorschau');
  return {vorname:firstName,nachname:lastName,firstName,lastName,email:teacher.email||'',kurs:course,kursnummer:course,courseCode:course,muttersprache:preview.muttersprache||teacher.muttersprache||'Deutsch',assignments:preview.assignments||{enabledModules:{'Fragen A1':true,'Wortschatz':true,'Verben A1':true}},releases:preview.releases||{},role:'teacher',loginRole:'teacher',isTeacher:true,teacherPreview:true,allAccess:!!preview.allAccess,previewOnly:true};
}
function getVerbenProfile(){return readProfileJson('SP_USER_PROFILE',null)||readProfileJson('SP_STUDENT_PROFILE',null)||makeTeacherPreviewProfileLocal()}
function loginUrlForVerben(){return '/login/?redirect='+encodeURIComponent(location.pathname+location.search+location.hash)}
function loadProfile(){
  profile=getVerbenProfile();
  if(profile&&profile.role!=='teacher'&&!profile.teacherPreview){try{localStorage.setItem('SP_USER_PROFILE',JSON.stringify(profile));localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(profile));localStorage.setItem('SP_KEEP_LOGGED_IN','1')}catch(e){}}
  if(!profile){const app=$('app');if(app)app.innerHTML='<section class="card"><h2>Bitte einloggen</h2><p class="small">Du musst eingeloggt sein, um Verben zu öffnen.</p><div class="actions"><a class="btn green" href="'+loginUrlForVerben()+'">Einloggen</a><a class="btn secondary" href="/index.html">Zur Startseite</a></div></section>';return false}
  return true;
}
async function loadState(){try{const saved=JSON.parse(localStorage.getItem(storageKey())||'null');if(saved)state={...state,...saved}}catch(e){}migrateState();localStorage.setItem(storageKey(),JSON.stringify(state))}
function saveState(){migrateState();localStorage.setItem(storageKey(),JSON.stringify(state));try{localStorage.setItem('SP_VERBS_LAST_STATE',JSON.stringify(state));localStorage.setItem('SP_VERBS_BACKUP_STATE',JSON.stringify(state));sessionStorage.setItem('SP_VERBS_SESSION_BACKUP',JSON.stringify(state))}catch(e){}}

const PHASE_HASHES={home:'home',taskOverview:'aufgaben',overview:'overview',chooser:'chooser',assessment:'assessment',karteikarte:'karteikarte',memory:'memory',bild_verb:'bild-verb',verb_bild:'verb-bild',schreiben:'schreiben',hoeren_schreiben:'hoeren-schreiben',hoeren_sprechen:'hoeren-sprechen',bild_sprechen:'bild-sprechen',satz_puzzle:'satz-puzzle',konjugieren:'konjugieren',pruefung:'pruefung'};
const HASH_PHASES=Object.fromEntries(Object.entries(PHASE_HASHES).map(([k,v])=>[v,k]));
function setVerbHashForPhase(phase){if(!phase||phase==='home')return;const h=PHASE_HASHES[phase];if(h&&location.hash!=='#'+h)history.pushState(null,'','#'+h)}
function clearVerbHash(replace=true){if(location.hash){const url=location.pathname+location.search;if(replace)history.replaceState(null,'',url);else history.pushState(null,'',url)}}
function phaseFromHash(){return HASH_PHASES[(location.hash||'').replace(/^#/,'')]||'home'}
function rememberPhase(phase){state.phase=phase;const app=$('app');if(app){if(phase==='home'||phase==='taskOverview')app.classList.remove('card');else app.classList.add('card')}if(phase!=='home'&&phase!=='taskOverview')setVerbHashForPhase(phase);saveState()}
function clearCurrentTask(skill){if(!state.currentTask||!skill||state.currentTask.skill===skillKey(skill))state.currentTask=null}
function resetPackageTasks(){state.practicePool=[];state.taskQueues={};state.taskDoneSets={};state.currentTask=null;state.memoryCards=[];state.memoryDone=[];state.openCards=[];state.first=null;state.lock=false;state.exam={passed:false,score:0,stars:0,answers:[],current:0,items:[],awaiting:false,currentTry:0,hadWrong:false}}
function packageExamPassed(){return !!(state.exam&&state.exam.passed&&Number(state.exam.score)===100)}
function allPracticeTasksDone(){return VERB_SKILLS.every(taskDone)}