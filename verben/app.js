import{requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,moduleOpen,releasedVerbs}from'/js/course-releases.js?v=verb-release-order2';

const CANONICAL_ALL=VerbGroupsEngine.ALL.slice();

function storedAssignments(profile){
 try{
  const cached=JSON.parse(localStorage.getItem('SP_COURSE_RELEASES')||'null');
  if(cached&&typeof cached==='object'&&Object.keys(cached).length)return cached
 }catch{}
 return profile?.assignments||{}
}

function uniq(list){const seen=new Set(),out=[];(list||[]).forEach(v=>{v=String(v||'').trim();if(v&&!seen.has(v)){seen.add(v);out.push(v)}});return out}
function releaseOrder(data){
 const candidates=[data?.verbReleaseOrder,data?.releases?.Verben?.wordOrder,data?.releases?.verben?.wordOrder,data?.releases?.['Verben A1']?.wordOrder,data?.releases?.['verben-A1']?.wordOrder];
 return uniq(candidates.find(Array.isArray)||[])
}
function orderedReleasedVerbs(data,all){
 const active=releasedVerbs(data,all),activeSet=new Set(active),allowed=new Set(all);
 const explicit=releaseOrder(data).filter(v=>allowed.has(v)&&activeSet.has(v));
 // Sobald eine Lehrer-Reihenfolge gespeichert ist, ist sie die exakte Freigabeliste.
 // Dadurch werden keine durch allgemeine Modul-Defaults geöffneten Zusatzverben angehängt.
 if(releaseOrder(data).length)return explicit;
 return uniq(active).filter(v=>allowed.has(v))
}
function installVerbGroups(active){
 const allowed=new Set(CANONICAL_ALL),ordered=uniq(active).filter(v=>allowed.has(v));
 const internalAll=VerbGroupsEngine.ALL,activeSet=new Set(ordered),rest=CANONICAL_ALL.filter(v=>!activeSet.has(v));
 // Die Freigabereihenfolge bestimmt die Gruppen. Gruppen haben maximal 20 Verben;
 // die letzte Gruppe darf kleiner sein.
 internalAll.splice(0,internalAll.length,...ordered,...rest);
 window.SP_VERB_PENDING={verbs:[],count:0,needed:0};
 window.SP_VERB_RELEASE_VISIBLE={verbs:ordered.slice(),count:ordered.length,groupSize:20,partialLastGroup:ordered.length%20};
 VerbGroupsEngine.setActiveVerbs(ordered)
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
 await install(profile,preview,storedAssignments(profile));
 loadCourseRelease(profile).then(data=>{
  if(preview||!data)return;
  try{install(profile,preview,data)}catch(error){console.warn('Aktualisierte Verben-Freigabe konnte nicht übernommen werden',error)}
 }).catch(error=>console.warn('Kursfreigaben konnten nicht aktualisiert werden',error))
}

init().catch(error=>{
 console.error(error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte öffne den Verben-Bereich erneut.</p><a class="btn" href="/verben-bereich/">Zum Verben-Bereich</a></section>'
});
