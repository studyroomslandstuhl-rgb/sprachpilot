import{requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,moduleOpen,releasedVerbs}from'/js/course-releases.js?v=verb-groups-2';

async function init(){
 const user=requireLogin();if(!user)return;
 const profile=getActiveProfile()||{};
 const role=String(getActiveRole()||'').toLowerCase();
 let preview=role==='teacher';
 try{const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true}catch{}
 window.PerfektGroupsProfile=profile;
 PerfektGroupsEngine.setContext(profile,preview);
 let locked=false,active=PerfektGroupsEngine.ALL.slice();
 try{
  const assignments=await loadCourseRelease(profile);
  locked=!preview&&!moduleOpen(assignments,'Verben');
  active=preview?PerfektGroupsEngine.ALL.slice():releasedVerbs(assignments,PerfektGroupsEngine.ALL);
 }catch{
  active=preview?PerfektGroupsEngine.ALL.slice():[];
 }
 PerfektGroupsEngine.setActiveVerbs(active);
 PerfektGroupsUI.install({dashboard:dashboardHref(),logout,locked});
}
init().catch(error=>{
 console.error(error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Perfekt konnte nicht geladen werden</h2><button class="btn" onclick="location.reload()">Neu laden</button></section>';
});
