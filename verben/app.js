import{requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,moduleOpen,releasedVerbs}from'/js/course-releases.js?v=verb-stable3';

function storedAssignments(profile){
 try{
  const cached=JSON.parse(localStorage.getItem('SP_COURSE_RELEASES')||'null');
  if(cached&&typeof cached==='object'&&Object.keys(cached).length)return cached
 }catch{}
 return profile?.assignments||{}
}

function install(profile,preview,assignments){
 const data=assignments&&typeof assignments==='object'?assignments:{};
 const locked=!preview&&!moduleOpen(data,'Verben');
 const all=VerbGroupsEngine.ALL.slice();
 const active=preview?all:releasedVerbs(data,all);
 VerbGroupsEngine.setActiveVerbs(active);
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
 install(profile,preview,storedAssignments(profile));
 loadCourseRelease(profile).catch(error=>console.warn('Kursfreigaben konnten nicht aktualisiert werden',error))
}

init().catch(error=>{
 console.error(error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte öffne den Verben-Bereich erneut.</p><a class="btn" href="/verben-bereich/">Zum Verben-Bereich</a></section>'
});
