const {getActiveProfile,getActiveRole,dashboardHref,loadCourseRelease,moduleOpen}=window.VT_DEPS;
const APP_VERSION=1;
const MODULE_TITLE='Verben Test';
const MODULE_KEY='verben';
const PACKAGE_SIZE=20;
const BUNNY='https://sprachpilot.b-cdn.net/';
const TASKS=[
  {id:'karteikarten',title:'Karteikarten',icon:'🃏',desc:'Bild sehen und das Verb nennen.'},
  {id:'memory',title:'Memory',icon:'🧠',desc:'Bilder und Verben in kleinen Gruppen verbinden.'},
  {id:'bild-verb',title:'Bild → Verb',icon:'🖼️',desc:'Zum Bild das richtige Verb wählen.'},
  {id:'verb-bild',title:'Verb → Bild',icon:'🔁',desc:'Zum Verb das richtige Bild wählen.'},
  {id:'schreiben',title:'Schreiben',icon:'✍️',desc:'Die deutsche Verbform schreiben.'},
  {id:'hoeren-schreiben',title:'Hören → Schreiben',icon:'🎧',desc:'Verb hören und schreiben.'},
  {id:'hoeren-sprechen',title:'Hören → Sprechen',icon:'🎙️',desc:'Verb hören und nachsprechen.'},
  {id:'bild-sprechen',title:'Bild → Sprechen',icon:'🗣️',desc:'Bild sehen und das Verb sprechen.'},
  {id:'satz-puzzle',title:'Satz-Puzzle',icon:'🧩',desc:'Einen korrekten Satz mit dem Verb bauen.'},
  {id:'konjugieren',title:'Konjugieren',icon:'🔤',desc:'Die passende Ich-Form bilden.'}
];
const TASK_IDS=new Set(TASKS.map(t=>t.id));
const SPECIAL_IMAGE_FILES={
  'sich vorstellen':'sich_vorstellen.webp','sich kämmen':'sich_kaemmen.webp','sich rasieren':'sich_rasieren.webp',
  'sich schminken':'sich_schminken.webp','sich bewegen':'sich_bewegen.webp','wandern':'wandern.webp','meinen':'meinen.webp',
  'grillen':'grillen.webp','wecken':'wecken.webp','üben':'ueben.webp','trainieren':'trainieren.webp','losfahren':'losfahren.webp',
  'dabeihaben':'dabeihaben.webp','leidtun':'leidtun.webp','leiden':'leiden.webp','opfern':'opfern.webp','reißen':'reissen.webp','können':'koennen.webp',
  'öffnen':'oeffnen.webp','schließen':'schliessen.webp','spazieren gehen':'spazierengehen.webp','sich verändern':'sich_veraendern.webp',
  'stören':'stoeren.webp','wählen':'waehlen.webp','sich benehmen':'sich_benehmen.webp'
};
const SPECIAL_ICH={
  'sein':'bin','haben':'habe','werden':'werde','wissen':'weiß','tun':'tue','können':'kann','müssen':'muss','dürfen':'darf','wollen':'will','sollen':'soll','mögen':'mag',
  'gehen':'gehe','kommen':'komme','fahren':'fahre','schlafen':'schlafe','sehen':'sehe','lesen':'lese','sprechen':'spreche','essen':'esse','nehmen':'nehme','geben':'gebe',
  'helfen':'helfe','treffen':'treffe','laufen':'laufe','tragen':'trage','halten':'halte','lassen':'lasse','fallen':'falle','fangen':'fange','waschen':'wasche',
  'bringen':'bringe','denken':'denke','kennen':'kenne','nennen':'nenne','reißen':'reiße','leiden':'leide','leidtun':'tue mir leid','dabeihaben':'habe dabei',
  'losfahren':'fahre los','aufstehen':'stehe auf','anfangen':'fange an','anrufen':'rufe an','einkaufen':'kaufe ein','aufräumen':'räume auf','fernsehen':'sehe fern',
  'sich vorstellen':'stelle mich vor','sich kämmen':'kämme mich','sich rasieren':'rasiere mich','sich schminken':'schminke mich','sich bewegen':'bewege mich',
  'sich verändern':'verändere mich','sich benehmen':'benehme mich'
};

const app=document.getElementById('app');
const topbar=document.getElementById('topbar');
let profile=null;
let assignments={};
let catalog=[];
let catalogByVerb=new Map();
let state=null;
let choiceSelection=new Set();
let choiceSearch='';
let memoryUi=null;
let saveTimer=null;
let remoteLoaded=false;

function esc(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
function clean(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return String(value||'').trim().toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'|'+separator+'$','g'),'')}
function uniq(list){return [...new Set((list||[]).filter(Boolean).map(String))]}
function shuffle(list,seed=Math.random()*1e9){const out=[...(list||[])];let x=(Number(seed)||1)>>>0;for(let i=out.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);[out[i],out[j]]=[out[j],out[i]]}return out}
function hash(value){let h=2166136261;for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function exact(value,answer){return clean(value)===clean(answer)}
function now(){return Date.now()}
function clone(value){return JSON.parse(JSON.stringify(value))}
function currentRole(){return String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase()}
function isTeacher(){return currentRole()==='teacher'}
function nativeLanguage(){
  const raw=String(profile?.muttersprache||profile?.motherLanguage||'Englisch').trim().toLowerCase();
  const map={english:'Englisch',englisch:'Englisch',en:'Englisch',russian:'Russisch',russisch:'Russisch','русский':'Russisch',ru:'Russisch',ukrainian:'Ukrainisch',ukrainisch:'Ukrainisch','українська':'Ukrainisch',uk:'Ukrainisch',arabic:'Arabisch',arabisch:'Arabisch','العربية':'Arabisch',ar:'Arabisch',turkish:'Türkisch','türkisch':'Türkisch',turkisch:'Türkisch','türkçe':'Türkisch',tr:'Türkisch',romanian:'Rumänisch','rumänisch':'Rumänisch',rumanisch:'Rumänisch','română':'Rumänisch',ro:'Rumänisch',japanese:'Japanisch',japanisch:'Japanisch','日本語':'Japanisch',ja:'Japanisch',polish:'Polnisch',polnisch:'Polnisch',pl:'Polnisch',kurdish:'Kurdisch',kurdisch:'Kurdisch',ku:'Kurdisch'};
  return map[raw]||profile?.muttersprache||'Englisch';
}
function translationFor(verb){
  const source=window.VERBEN_TEST_SOURCE?.translations||{};
  const language=nativeLanguage();
  return source?.[language]?.[verb]||source?.Englisch?.[verb]||source?.Russisch?.[verb]||'—';
}
function sentenceFor(verb){
  const map=window.VERBEN_TEST_SOURCE?.sentences||{};
  if(map[verb])return String(map[verb]);
  if(verb.startsWith('sich '))return `Ich möchte mich ${verb.slice(5)}.`;
  if(verb==='können')return 'Ich kann gut Deutsch sprechen.';
  if(verb==='leidtun')return 'Das tut mir leid.';
  if(verb==='dabeihaben')return 'Ich habe meinen Ausweis dabei.';
  return `Ich möchte ${verb}.`;
}
function ichForm(verb){
  if(SPECIAL_ICH[verb])return SPECIAL_ICH[verb];
  const irregular=window.VERBEN_TEST_SOURCE?.irregular||{};
  if(irregular?.[verb]?.ich)return String(irregular[verb].ich);
  const sentence=sentenceFor(verb);
  const match=sentence.match(/^Ich\s+([A-Za-zÄÖÜäöüß-]+)/);
  if(match&&match[1]&&!/^möchte$/i.test(match[1]))return match[1].trim();
  if(verb.startsWith('sich '))return regularIch(verb.slice(5))+' mich';
  return regularIch(verb);
}
function regularIch(verb){
  const prefixes=['ab','an','auf','aus','ein','fest','her','hin','los','mit','nach','vor','weg','weiter','wieder','zu','zurück','zusammen'];
  for(const prefix of prefixes){
    if(verb.startsWith(prefix)&&verb.length>prefix.length+3){const base=verb.slice(prefix.length);if(SPECIAL_ICH[base])return SPECIAL_ICH[base]+' '+prefix;return regularIch(base)+' '+prefix}
  }
  if(verb.endsWith('eln'))return verb.slice(0,-3)+'le';
  if(verb.endsWith('ern'))return verb.slice(0,-1)+'e';
  if(verb.endsWith('en'))return verb.slice(0,-2)+'e';
  if(verb.endsWith('n'))return verb.slice(0,-1)+'e';
  return verb+'e';
}
function sentenceGap(verb){
  const sentence=sentenceFor(verb),form=ichForm(verb);
  const candidates=uniq([form,form.split(' ')[0],verb,verb.replace(/^sich\s+/,'')]).sort((a,b)=>b.length-a.length);
  for(const candidate of candidates){const re=new RegExp('\\b'+candidate.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i');if(re.test(sentence))return sentence.replace(re,'___')}
  return verb.startsWith('sich ')?`Ich möchte mich ___.`:`Ich möchte ___.`;
}
function imageCandidates(verb){
  const entry=catalogByVerb.get(verb)||{};
  const explicit=SPECIAL_IMAGE_FILES[verb]||String(entry.img||'').split('/').pop();
  const raw=slug(verb,'_')+'.webp',hyphen=slug(verb,'-')+'.webp';
  const names=uniq([explicit,raw,hyphen]);
  return uniq(names.flatMap(name=>[BUNNY+name,BUNNY+'Neu/'+name]));
}
window.vtImageNext=function(img){
  try{const list=JSON.parse(img.dataset.candidates||'[]');let index=Number(img.dataset.index||0)+1;if(index<list.length){img.dataset.index=String(index);img.src=list[index]}else{img.outerHTML='<span class="image-fallback">Bild fehlt</span>'}}catch(e){img.outerHTML='<span class="image-fallback">Bild fehlt</span>'}
};
function imageHtml(verb,alt=verb){const list=imageCandidates(verb);return `<img src="${esc(list[0]||'')}" alt="${esc(alt)}" data-candidates='${esc(JSON.stringify(list))}' data-index="0" loading="eager" decoding="async" onerror="vtImageNext(this)">`}
function imageBox(verb){return `<div class="image-box">${imageHtml(verb)}</div>`}

function normalizeCatalog(){
  const raw=window.VERBEN_TEST_SOURCE?.verbs||[];
  const out=[];const seen=new Set();
  raw.forEach(item=>{const verb=String(typeof item==='string'?item:item?.v||'').trim();if(!verb||seen.has(verb))return;seen.add(verb);out.push({verb,img:typeof item==='object'?item.img||'':'',translation:translationFor(verb),sentence:sentenceFor(verb)})});
  out.sort((a,b)=>a.verb.localeCompare(b.verb,'de',{sensitivity:'base'}));
  catalog=out;catalogByVerb=new Map(out.map(item=>[item.verb,item]));
}
function ownerId(){
  const course=profile?.courseDocId||profile?.courseCode||profile?.kurs||profile?.kursnummer||'kurs';
  const person=profile?.email||profile?.docId||profile?.studentId||profile?.userId||profile?.uid||profile?.vorname||'student';
  return slug(course+'_'+person,'-')||'guest';
}
function storageKey(){return `SP_VERBEN_TEST_V1_${ownerId()}`}
function backupKey(){return `SP_VERBEN_TEST_BACKUP_V1_${ownerId()}`}
function defaultState(){return{version:APP_VERSION,ownerId:ownerId(),revision:0,updatedAt:now(),learned:[],activePackage:null,assessment:{queue:[],index:0,selected:[]},archives:[]}}
function normalizeState(input){
  const next=input&&typeof input==='object'?clone(input):defaultState();
  next.version=APP_VERSION;next.ownerId=ownerId();next.revision=Math.max(0,Number(next.revision)||0);next.updatedAt=Number(next.updatedAt)||now();
  next.learned=uniq(next.learned).filter(v=>catalogByVerb.has(v));
  next.archives=Array.isArray(next.archives)?next.archives:[];
  next.assessment=next.assessment&&typeof next.assessment==='object'?next.assessment:{queue:[],index:0,selected:[]};
  next.assessment.queue=uniq(next.assessment.queue).filter(v=>catalogByVerb.has(v)&&!next.learned.includes(v));
  next.assessment.selected=uniq(next.assessment.selected).filter(v=>catalogByVerb.has(v)&&!next.learned.includes(v)).slice(0,PACKAGE_SIZE);
  next.assessment.index=Math.max(0,Math.min(next.assessment.queue.length,Number(next.assessment.index)||0));
  if(next.activePackage&&typeof next.activePackage==='object'){
    const pkg=next.activePackage;
    pkg.id=String(pkg.id||`package-${now()}`);pkg.verbs=uniq(pkg.verbs).filter(v=>catalogByVerb.has(v)&&!next.learned.includes(v)).slice(0,PACKAGE_SIZE);
    pkg.createdAt=Number(pkg.createdAt)||now();pkg.revision=Math.max(0,Number(pkg.revision)||0);pkg.taskProgress=pkg.taskProgress&&typeof pkg.taskProgress==='object'?pkg.taskProgress:{};pkg.taskRuntime=pkg.taskRuntime&&typeof pkg.taskRuntime==='object'?pkg.taskRuntime:{};pkg.taskPoints=pkg.taskPoints&&typeof pkg.taskPoints==='object'?pkg.taskPoints:{};pkg.examBest=Math.max(0,Math.min(100,Number(pkg.examBest)||0));pkg.examAttempts=Math.max(0,Number(pkg.examAttempts)||0);pkg.examRun=pkg.examRun&&typeof pkg.examRun==='object'?pkg.examRun:null;
    TASKS.forEach(task=>{pkg.taskProgress[task.id]=uniq(pkg.taskProgress[task.id]).filter(v=>pkg.verbs.includes(v));pkg.taskPoints[task.id]=pkg.taskProgress[task.id].length===pkg.verbs.length&&pkg.verbs.length?5:Math.max(0,Math.min(5,Number(pkg.taskPoints[task.id])||0))});
    if(!pkg.verbs.length)next.activePackage=null;
  }
  return next;
}
function stateWeight(value){const pkg=value?.activePackage;return (value?.learned?.length||0)*50+(pkg?.verbs?.length||0)*20+TASKS.reduce((sum,t)=>sum+(pkg?.taskProgress?.[t.id]?.length||0),0)*5+(pkg?.examBest||0)+(value?.archives?.length||0)*200}
function loadLocal(){
  let primary=null,backup=null;try{primary=JSON.parse(localStorage.getItem(storageKey())||'null')}catch(e){}try{backup=JSON.parse(localStorage.getItem(backupKey())||'null')}catch(e){}
  const selected=stateWeight(backup)>stateWeight(primary)?backup:primary;
  return normalizeState(selected||defaultState());
}
function persistLocal(){
  state=normalizeState(state);state.revision++;state.updatedAt=now();if(state.activePackage)state.activePackage.revision=(state.activePackage.revision||0)+1;
  const text=JSON.stringify(state);localStorage.setItem(storageKey(),text);localStorage.setItem(backupKey(),text);scheduleRemoteSave();
}
function scheduleRemoteSave(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>saveRemote().catch(()=>{}),700)}
async function firebaseTools(){return import('/js/firebase.js?v=verben-test-1')}
async function saveRemote(){
  if(isTeacher()||!profile||window.SP_NO_FIREBASE_SYNC)return;
  const tools=await firebaseTools();
  const id=ownerId();if(!id||id==='guest')return;
  const snapshot=clone(state);
  await tools.setDoc(tools.doc(tools.db,'progress',id),{studentId:id,userId:id,docId:id,courseCode:profile.courseCode||profile.kurs||profile.kursnummer||'',email:profile.email||'',verbenTestV1:{state:snapshot,revision:snapshot.revision,updatedAtMs:now()},lastPage:location.pathname,lastActive:tools.serverTimestamp(),updatedAt:tools.serverTimestamp()},{merge:true});
}
async function restoreRemoteIfNeeded(){
  if(remoteLoaded||isTeacher()||!profile||window.SP_NO_FIREBASE_SYNC)return;remoteLoaded=true;
  try{const tools=await firebaseTools();const snap=await Promise.race([tools.getDoc(tools.doc(tools.db,'progress',ownerId())),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),2500))]);if(!snap.exists())return;const remote=normalizeState(snap.data()?.verbenTestV1?.state);if(stateWeight(state)===0&&stateWeight(remote)>0){state=remote;persistLocal();renderRoute()}else if(state.revision>=remote.revision){scheduleRemoteSave()}}catch(e){}
}

function activePackage(){return state.activePackage}
function packageVerbs(){return activePackage()?.verbs?.slice()||[]}
function newVerbs(){const used=new Set([...state.learned,...packageVerbs()]);return catalog.map(x=>x.verb).filter(v=>!used.has(v))}
function taskDoneList(taskId){return activePackage()?.taskProgress?.[taskId]||[]}
function taskPercent(taskId){const total=packageVerbs().length;if(!total)return 0;return Math.round(taskDoneList(taskId).length/total*100)}
function allTasksComplete(){return !!activePackage()&&TASKS.every(t=>taskPercent(t.id)>=100)}
function packagePoints(){const pkg=activePackage();if(!pkg)return 0;return TASKS.reduce((sum,t)=>sum+(Number(pkg.taskPoints?.[t.id])||0),0)+(Number(pkg.examBest)||0)}
function completedPackage(){return allTasksComplete()&&activePackage()?.examBest>=100}
function createPackage(verbs,source){
  const cleanVerbs=uniq(verbs).filter(v=>newVerbs().includes(v)).slice(0,PACKAGE_SIZE);
  if(cleanVerbs.length!==Math.min(PACKAGE_SIZE,newVerbs().length))throw new Error(`Bitte genau ${Math.min(PACKAGE_SIZE,newVerbs().length)} Verben auswählen.`);
  const id=`package-${now()}-${Math.random().toString(36).slice(2,7)}`;
  const taskProgress={},taskPoints={};TASKS.forEach(t=>{taskProgress[t.id]=[];taskPoints[t.id]=0});
  state.activePackage={id,verbs:cleanVerbs,source,createdAt:now(),revision:0,taskProgress,taskRuntime:{},taskPoints,examBest:0,examAttempts:0,examRun:null};
  state.assessment={queue:[],index:0,selected:[]};choiceSelection.clear();persistLocal();goHome();
}
async function syncTaskPoints(task){
  const pkg=activePackage();if(!pkg)return;
  const done=taskPercent(task.id)>=100;
  if(done&&Number(pkg.taskPoints[task.id]||0)<5){pkg.taskPoints[task.id]=5;persistLocal()}
  if(!done)return;
  try{const progress=await import('/js/progress.js?v=verben-test-1');await progress.recordTaskProgress?.({module:MODULE_KEY,moduleTitle:MODULE_TITLE,topicId:`verben-test-${pkg.id}`,title:`Verben Test · Paket ${pkg.id}`,level:'A1',file:task.id,taskTitle:task.title,percent:100,done:pkg.verbs.length,total:pkg.verbs.length,completed:true})}catch(e){}
}
async function syncExam(percent){
  const pkg=activePackage();if(!pkg)return;
  try{const progress=await import('/js/progress.js?v=verben-test-1');await progress.recordExamResult?.({module:MODULE_KEY,moduleTitle:MODULE_TITLE,topicId:`verben-test-${pkg.id}`,title:`Verben Test · Paket ${pkg.id}`,level:'A1',percent,scorePercent:percent,stars:percent>=100?3:percent>=70?2:percent>=50?1:0})}catch(e){}
}
function finishPackage(){
  if(!completedPackage())return;
  const pkg=clone(activePackage());pkg.completedAt=now();state.learned=uniq([...state.learned,...pkg.verbs]);state.archives.push(pkg);state.activePackage=null;state.assessment={queue:[],index:0,selected:[]};persistLocal();goHome();
}
function resetTest(){if(!confirm('Alle Fortschritte in „Verben Test“ löschen? Die bestehenden Bereiche „Verben A1“ und „Fragen A1“ bleiben unverändert.'))return;state=defaultState();localStorage.removeItem(storageKey());localStorage.removeItem(backupKey());persistLocal();goHome()}
