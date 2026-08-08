import{requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,moduleOpen,releasedVerbs}from'/js/course-releases.js?v=verb-release-order3';

const CANONICAL_ALL=VerbGroupsEngine.ALL.slice();
const verbKey=v=>String(v||'').normalize('NFC').trim().toLowerCase().replace(/\s+/g,' ');
const CANONICAL_BY_KEY=new Map(CANONICAL_ALL.map(v=>[verbKey(v),v]));

function storedAssignments(profile){
 try{
  const cached=JSON.parse(localStorage.getItem('SP_COURSE_RELEASES')||'null');
  if(cached&&typeof cached==='object'&&Object.keys(cached).length)return cached
 }catch{}
 return profile?.assignments||{}
}

function uniq(list){
 const seen=new Set(),out=[];
 (list||[]).forEach(raw=>{
  const key=verbKey(raw),verb=CANONICAL_BY_KEY.get(key)||String(raw||'').trim();
  if(verb&&CANONICAL_BY_KEY.has(key)&&!seen.has(key)){seen.add(key);out.push(verb)}
 });
 return out
}
function releaseOrder(data){
 const candidates=[data?.verbReleaseOrder,data?.releases?.Verben?.wordOrder,data?.releases?.verben?.wordOrder,data?.releases?.['Verben A1']?.wordOrder,data?.releases?.['verben-A1']?.wordOrder];
 return uniq(candidates.find(Array.isArray)||[])
}
function orderedReleasedVerbs(data,all){
 const active=uniq(releasedVerbs(data,all));
 const activeKeys=new Set(active.map(verbKey));
 const saved=releaseOrder(data);
 if(saved.length)return saved.filter(v=>activeKeys.has(verbKey(v)));
 // Wichtig: Die Gruppenreihenfolge darf niemals vom individuellen Lernstand
 // eines TN abhängen. Ohne gespeicherte Lehrer-Reihenfolge gilt deshalb für
 // alle TN dieselbe kanonische Reihenfolge der freigegebenen Verben.
 return uniq(all.filter(v=>activeKeys.has(verbKey(v))))
}
function installVerbGroups(active){
 const ordered=uniq(active);
 const internalAll=VerbGroupsEngine.ALL,activeKeys=new Set(ordered.map(verbKey));
 const rest=CANONICAL_ALL.filter(v=>!activeKeys.has(verbKey(v)));
 // Freigabereihenfolge = Gruppenreihenfolge. Maximal 20 pro Gruppe; letzte Gruppe darf kleiner sein.
 internalAll.splice(0,internalAll.length,...ordered,...rest);
 window.SP_VERB_PENDING={verbs:[],count:0,needed:0};
 window.SP_VERB_RELEASE_VISIBLE={verbs:ordered.slice(),count:ordered.length,groupSize:20,partialLastGroup:ordered.length%20};
 VerbGroupsEngine.setActiveVerbs(ordered);

 const seen=new Map(),duplicates=[];
 for(const group of VerbGroupsEngine.GROUPS){
  for(const verb of group.verbs){
   const key=verbKey(verb);
   if(seen.has(key))duplicates.push({verb,firstGroup:seen.get(key),duplicateGroup:group.id});
   else seen.set(key,group.id)
  }
 }
 window.SP_VERB_GROUP_AUDIT={released:ordered.length,grouped:seen.size,duplicates,groups:VerbGroupsEngine.GROUPS.map(g=>({id:g.id,count:g.verbs.length,verbs:g.verbs.slice()}))};
 if(duplicates.length)console.error('Doppelte Verben zwischen Gruppen verhindert',duplicates)
}

async function install(profile,preview,assignments){
 const data=assignments&&typeof assignments==='object'?assignments:{};
 const locked=!preview&&!moduleOpen(data,'Verben');
 const active=preview?CANONICAL_ALL.slice():orderedReleasedVerbs(data,CANONICAL_ALL);
 installVerbGroups(active);
 try{
  if(!preview&&window.SPVerbProgressPersistence?.restoreCloud)await window.SPVerbProgressPersistence.restoreCloud();
 }catch(error){console.warn('Gespeicherter Verben-Fortschritt konnte nicht wiederhergestellt werden',error)}
 VerbGroupsUI.install({dashboard:dashboardHref(),logout,locked});
 window.SP_VERBEN_READY=true
}

async function init(){
 const user=requireLogin();if(!user)return;
 const profile=getActiveProfile()||{};
 const role=String(getActiveRole()||'').toLowerCase();
 let preview=role==='teacher';
 try{const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true}catch{}
 window.VerbGroupsProfile=profile;
 VerbGroupsEngine.setContext(profile,preview);
 // Nur ein Gruppenaufbau pro Seitenaufruf. loadCourseRelease hat selbst einen
 // Cache/Fallback; dadurch kann eine spätere Firebase-Antwort die Gruppen nicht
 // mitten im Lernen noch einmal umsortieren.
 let assignments;
 try{assignments=await loadCourseRelease(profile)}catch{assignments=storedAssignments(profile)}
 await install(profile,preview,assignments||storedAssignments(profile))
}

init().catch(error=>{
 console.error(error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte öffne den Verben-Bereich erneut.</p><a class="btn" href="/verben-bereich/">Zum Verben-Bereich</a></section>'
});
