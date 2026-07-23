const app=document.querySelector('#app');
const SOURCE_URL='/perfekt/app-stable.js?v=perfekt-stable6';

function replaceRequired(source,search,replacement,label){
 if(!source.includes(search))throw new Error(`Perfekt-Patch nicht möglich: ${label}`);
 return source.replace(search,replacement);
}

try{
 const response=await fetch(SOURCE_URL,{cache:'no-store'});
 if(!response.ok)throw new Error(`Perfekt-App konnte nicht geladen werden (${response.status})`);
 let source=await response.text();

 source=source.replace(/from'\/([^']+)'/g,(_,path)=>`from'${location.origin}/${path}'`);

 source=replaceRequired(
  source,
  "const CATEGORY_ORDER=[['reflexive','Reflexive Verben'],['separable','Trennbare Verben'],['strong','Starke / unregelmäßige Verben'],['ieren','Verben auf -ieren'],['inseparable','Nicht trennbare Verben'],['weak','Regelmäßige Verben']];",
  "const CATEGORY_ORDER=[['weak','Regelmäßige Verben'],['strong','Starke / unregelmäßige Verben'],['ieren','Verben auf -ieren'],['inseparable','Nicht trennbare Verben'],['reflexive','Reflexive Verben'],['separable','Trennbare Verben']];",
  'Gruppenreihenfolge'
 );

 source=replaceRequired(
  source,
  "const userSlug=()=>[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';\nconst storageKey=()=>`SP_PERFEKT_STABLE_${userSlug()}`;",
  `const slugify=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const legacyUserSlug=()=>[profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
const stableIdentity=()=>profile.studentId||profile.userId||profile.docId||profile.email||legacyUserSlug();
const userSlug=()=>slugify(stableIdentity())||'student';
const storageKey=()=>\`SP_PERFEKT_STABLE_V2_\${userSlug()}\`;
const legacyStorageKey=()=>\`SP_PERFEKT_STABLE_\${legacyUserSlug()}\`;`,
  'stabiler Speicherschlüssel'
 );

 source=replaceRequired(
  source,
  "const blankState=()=>({version:1,selectedGroup:1,groups:{}});",
  "const blankState=()=>({version:2,selectedGroup:1,groups:{},archivedPoints:0,archivedSignatures:{}});",
  'Speicherversion'
 );

 const oldLoad="function load(){try{state=JSON.parse(localStorage.getItem(storageKey())||'null')||blankState()}catch{state=blankState()}state.groups=state.groups||{};GROUPS.forEach(g=>groupState(g.id))}";
 const newLoad=`function stateScore(value){
 let score=Number(value?.archivedPoints)||0;
 for(const group of Object.values(value?.groups||{}))for(const run of Object.values(group?.runs||{})){
  for(const task of Object.values(run?.tasks||{}))score+=(task?.done||[]).length;
  score+=Number(run?.exam?.bestPercent)||0;
  score+=Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0);
 }
 return score
}
function mergeRun(left,right){
 const result={...blankRun(),...(left||{})},incoming=right||{};
 result.tasks=result.tasks||{};
 for(const task of LEARN){
  const a=result.tasks[task]||blankTask(0),b=incoming.tasks?.[task]||blankTask(0),done=[...new Set([...(a.done||[]),...(b.done||[])])];
  result.tasks[task]={total:Math.max(Number(a.total)||0,Number(b.total)||0),done,queue:[...new Set([...(a.queue||[]),...(b.queue||[])])].filter(v=>!done.includes(v)),current:a.current||b.current||null,tries:Math.max(Number(a.tries)||0,Number(b.tries)||0),hadWrong:!!(a.hadWrong||b.hadWrong)};
 }
 result.exam={bestPercent:Math.max(Number(result.exam?.bestPercent)||0,Number(incoming.exam?.bestPercent)||0),stars:Math.max(Number(result.exam?.stars)||0,Number(incoming.exam?.stars)||0),session:result.exam?.session||incoming.exam?.session||null};
 result.awards={tasks:{...(incoming.awards?.tasks||{}),...(result.awards?.tasks||{})},examPoints:Math.max(Number(result.awards?.examPoints)||0,Number(incoming.awards?.examPoints)||0)};
 for(const task of LEARN)result.awards.tasks[task]=Math.max(Number(left?.awards?.tasks?.[task])||0,Number(right?.awards?.tasks?.[task])||0);
 result.completed=!!(result.completed||incoming.completed);
 return result
}
function mergeState(left,right){
 if(!left)return right;
 if(!right)return left;
 const preferred=stateScore(right)>stateScore(left)?right:left,other=preferred===right?left:right;
 const result={...blankState(),...preferred,groups:{...(preferred.groups||{})},archivedPoints:Math.max(Number(preferred.archivedPoints)||0,Number(other.archivedPoints)||0),archivedSignatures:{...(other.archivedSignatures||{}),...(preferred.archivedSignatures||{})}};
 for(const [signature,incoming]of Object.entries(other.groups||{})){
  const existing=result.groups[signature];
  if(!existing){result.groups[signature]=incoming;continue}
  const merged={...existing,signature:existing.signature||incoming.signature||signature,currentRun:Math.max(Number(existing.currentRun)||1,Number(incoming.currentRun)||1),runs:{...(existing.runs||{})}};
  for(const [runId,run]of Object.entries(incoming.runs||{}))merged.runs[runId]=mergeRun(merged.runs[runId],run);
  result.groups[signature]=merged;
 }
 return result
}
function relatedStorageKeys(){
 const keys=[storageKey(),legacyStorageKey()],tokens=[profile.email,profile.studentId,profile.userId,profile.docId].map(slugify).filter(token=>token.length>=3);
 for(let i=0;i<localStorage.length;i++){
  const key=String(localStorage.key(i)||'');
  if(!key.startsWith('SP_PERFEKT_'))continue;
  const normalized=slugify(key);
  if(tokens.some(token=>normalized.includes(token)))keys.push(key)
 }
 return[...new Set(keys)]
}
function readStoredState(key){try{const value=JSON.parse(localStorage.getItem(key)||'null');return value&&typeof value==='object'&&value.groups&&typeof value.groups==='object'?value:null}catch{return null}}
function signatureVerbs(value){return String(value||'').split('|').slice(1).filter(Boolean)}
function pointsOfGroup(group){let points=0;for(const run of Object.values(group?.runs||{}))points+=Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0);return points}
function migrateGroups(raw){
 raw={...blankState(),...(raw||{})};raw.groups=raw.groups||{};raw.archivedSignatures=raw.archivedSignatures||{};
 const currentSignatures=new Set(GROUPS.map(group=>group.signature)),sources=Object.entries(raw.groups).map(([key,group])=>({key,group,verbs:signatureVerbs(group?.signature||key)}));
 for(const source of sources){
  if(currentSignatures.has(source.key)||raw.archivedSignatures[source.key])continue;
  raw.archivedPoints=(Number(raw.archivedPoints)||0)+pointsOfGroup(source.group);raw.archivedSignatures[source.key]=true
 }
 for(const group of GROUPS){
  if(raw.groups[group.signature])continue;
  const overlaps=sources.filter(source=>source.verbs.some(verb=>group.verbs.includes(verb)));
  if(!overlaps.length)continue;
  const migrated=blankGroup(group.signature);migrated.currentRun=Math.max(1,...overlaps.map(source=>Number(source.group?.currentRun)||1));migrated.runs={};
  for(let runId=1;runId<=migrated.currentRun;runId++){
   const run=normalizeRun(blankRun(),group);
   for(const task of LEARN){
    const done=new Set();
    overlaps.forEach(source=>(source.group?.runs?.[String(runId)]?.tasks?.[task]?.done||[]).forEach(verb=>{if(group.verbs.includes(verb))done.add(verb)}));
    run.tasks[task].done=group.verbs.filter(verb=>done.has(verb));run.tasks[task].queue=[];run.tasks[task].current=null;run.tasks[task].tries=0;run.tasks[task].hadWrong=false
   }
   const sameSet=overlaps.find(source=>source.verbs.length===group.verbs.length&&group.verbs.every(verb=>source.verbs.includes(verb)));
   if(sameSet){const oldRun=sameSet.group?.runs?.[String(runId)];run.exam={...run.exam,...(oldRun?.exam||{}),session:null};run.awards.examPoints=Number(oldRun?.awards?.examPoints)||0}
   migrated.runs[String(runId)]=run
  }
  raw.groups[group.signature]=migrated
 }
 raw.version=2;return raw
}
function persistState(){
 if(preview||!state)return;
 const serialized=JSON.stringify(state);
 try{relatedStorageKeys().forEach(key=>localStorage.setItem(key,serialized))}catch{}
}
function load(){
 let merged=null;
 for(const key of relatedStorageKeys())merged=mergeState(merged,readStoredState(key));
 state=migrateGroups(merged||blankState());state.groups=state.groups||{};GROUPS.forEach(group=>groupState(group.id));persistState()
}`;
 source=replaceRequired(source,oldLoad,newLoad,'Fortschrittsmigration');

 source=replaceRequired(
  source,
  "function save(){if(preview)return;try{localStorage.setItem(storageKey(),JSON.stringify(state))}catch{}}",
  "function save(){persistState()}",
  'Fortschritt speichern'
 );

 const cloudHelpers=[
  "const totalPoints=()=>(Number(state?.archivedPoints)||0)+GROUPS.reduce((s,g)=>s+groupPoints(g.id),0);",
  "const cloudPad=n=>String(n).padStart(2,'0');",
  "function cloudCategoryOrdinal(id){const group=GROUPS[id-1];return group?GROUPS.filter(item=>item.category===group.category&&item.id<=group.id).length:1}",
  "function cloudTopicId(id){const group=GROUPS[id-1];return group?'perfekt-'+group.category+'-gruppe-'+cloudPad(cloudCategoryOrdinal(id)):'perfekt-gruppe-'+cloudPad(id)}",
  "function cloudTitle(id){const group=GROUPS[id-1];return group?'Perfekt · '+group.title+' '+cloudCategoryOrdinal(id):'Perfekt · Gruppe '+id}",
  "function setCloudRun(id,run){if(!preview)localStorage.setItem('SP_SCORE_RUN_'+cloudTopicId(id),String(Math.max(1,Number(run)||1)))}",
  "async function cloudApi(){if(preview)return null;if(window.SPProgress)return window.SPProgress;try{await import(location.origin+'/js/progress.js?v=verb-points-1')}catch(error){console.warn('Perfekt-Punktesynchronisierung nicht verfügbar',error)}return window.SPProgress||null}",
  "async function syncCloudTask(id,task,runId=null,runData=null){if(preview)return;const group=GROUPS[id-1],gs=groupState(id);if(!group||!gs)return;const selectedRun=String(runId||gs.currentRun),run=runData||gs.runs?.[selectedRun],item=run?.tasks?.[task];if(!item)return;const api=await cloudApi();if(!api?.recordTaskProgress)return;setCloudRun(id,selectedRun);try{await api.recordTaskProgress({module:'perfekt',moduleTitle:'Perfekt',level:'A1',lesson:group.title,theme:'Runde '+selectedRun,topicId:cloudTopicId(id),title:cloudTitle(id),file:task,taskKey:task,taskTitle:TITLE[task]||task,total:Number(item.total)||group.verbs.length,done:(item.done||[]).length,percent:item.total?Math.round((item.done||[]).length/item.total*100):0,completed:item.total>0&&(item.done||[]).length>=item.total})}catch(error){console.warn('Perfekt-Aufgabenpunkte konnten nicht übertragen werden',error)}}",
  "async function syncCloudExam(id,percent=null,stars=null,runId=null,runData=null){if(preview)return;const group=GROUPS[id-1],gs=groupState(id);if(!group||!gs)return;const selectedRun=String(runId||gs.currentRun),run=runData||gs.runs?.[selectedRun],exam=run?.exam||{},value=Math.max(0,Number(percent??exam.bestPercent)||0);if(!value&&!Number(run?.awards?.examPoints||0))return;const api=await cloudApi();if(!api?.recordExamResult)return;setCloudRun(id,selectedRun);try{await api.recordExamResult({module:'perfekt',moduleTitle:'Perfekt',level:'A1',lesson:group.title,theme:'Runde '+selectedRun,topicId:cloudTopicId(id),title:cloudTitle(id),percent:value,stars:Number(stars??exam.stars)||0})}catch(error){console.warn('Perfekt-Prüfungspunkte konnten nicht übertragen werden',error)}}",
  "function cloudHash(value){let hash=2166136261;for(const char of String(value||'')){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619)}return(hash>>>0).toString(36)}",
  "async function syncCloudExisting(){if(preview)return;const fingerprint=cloudHash(GROUPS.map(group=>group.signature).join('||')),marker='SP_PERFEKT_CLOUD_SYNC_V2_'+userSlug()+'_'+fingerprint;if(localStorage.getItem(marker)==='1')return;const api=await cloudApi();if(!api)return;try{for(const group of GROUPS){const gs=groupState(group.id);for(const [runId,run]of Object.entries(gs?.runs||{})){for(const task of LEARN){const item=run?.tasks?.[task];if((item?.done||[]).length||Number(run?.awards?.tasks?.[task]||0))await syncCloudTask(group.id,task,runId,run)}if(Number(run?.exam?.bestPercent||0)||Number(run?.awards?.examPoints||0))await syncCloudExam(group.id,null,null,runId,run)}}localStorage.setItem(marker,'1')}catch(error){console.warn('Vorhandene Perfekt-Punkte konnten nicht vollständig übertragen werden',error)}}"
 ].join('\n');
 source=replaceRequired(
  source,
  "const totalPoints=()=>GROUPS.reduce((s,g)=>s+groupPoints(g.id),0);",
  cloudHelpers,
  'Punkte erhalten und übertragen'
 );

 source=replaceRequired(
  source,
  "function markRight(id,t){const x=taskState(id,t),v=x?.current;if(!x||!v)return;if(x.hadWrong||x.tries>0){if(!x.done.includes(v)&&!x.queue.includes(v))x.queue.push(v)}else if(!x.done.includes(v))x.done.push(v);x.current=null;x.tries=0;x.hadWrong=false;if(taskDone(id,t)&&!currentRun(id).awards.tasks[t])currentRun(id).awards.tasks[t]=taskPoints(id);save()}",
  "function markRight(id,t){const x=taskState(id,t),v=x?.current;if(!x||!v)return;if(x.hadWrong||x.tries>0){if(!x.done.includes(v)&&!x.queue.includes(v))x.queue.push(v)}else if(!x.done.includes(v))x.done.push(v);x.current=null;x.tries=0;x.hadWrong=false;if(taskDone(id,t)&&!currentRun(id).awards.tasks[t])currentRun(id).awards.tasks[t]=taskPoints(id);save();syncCloudTask(id,t)}",
  'Aufgabenpunkte synchronisieren'
 );

 source=replaceRequired(
  source,
  "run.completed=learnDone(id)&&run.exam.bestPercent>=100;save();app.innerHTML=",
  "run.completed=learnDone(id)&&run.exam.bestPercent>=100;save();syncCloudExam(id,p,stars);app.innerHTML=",
  'Prüfungspunkte synchronisieren'
 );

 source=replaceRequired(
  source,
  "rebuildGroups();load();render()}",
  "rebuildGroups();load();render();syncCloudExisting()}",
  'vorhandene Punkte synchronisieren'
 );

 source=replaceRequired(
  source,
  "<nav class=\"topnav\"><a class=\"btn secondary\" href=\"/index.html\">← Startseite</a>",
  "<nav class=\"topnav\"><a class=\"btn secondary\" href=\"/verben-bereich/\">← Verben</a>",
  'Navigation zum Verben-Bereich'
 );

 const blobUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));
 try{await import(blobUrl)}finally{URL.revokeObjectURL(blobUrl)}
}catch(error){
 console.error('Perfekt-Stabilitätsfix fehlgeschlagen',error);
 if(app)app.innerHTML='<section class="card"><h2>Perfekt konnte nicht geladen werden</h2><p>Bitte lade die Seite neu. Falls der Fehler bleibt, informiere die Lehrkraft.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>';
}