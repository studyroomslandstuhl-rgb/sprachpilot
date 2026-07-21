import{requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,moduleOpen}from'/js/course-releases.js?v=verb-groups-1';

async function init(){
 const user=requireLogin();if(!user)return;
 const profile=getActiveProfile()||{};
 const role=String(getActiveRole()||'').toLowerCase();
 let preview=role==='teacher';
 try{const raw=sessionStorage.getItem('SP_TEACHER_PREVIEW');if(raw==='1'||JSON.parse(raw||'null')?.teacherPreview===true)preview=true}catch{}
 window.VerbGroupsProfile=profile;
 VerbGroupsEngine.setContext(profile,preview);
 let locked=false;
 try{const assignments=await loadCourseRelease(profile);locked=!preview&&!moduleOpen(assignments,'Verben')}catch{}
 VerbGroupsUI.install({dashboard:dashboardHref(),logout,locked});
}
init().catch(error=>{
 console.error(error);
 const app=document.querySelector('#app');
 if(app)app.innerHTML='<section class="card"><h2>Verben konnten nicht geladen werden</h2><p>Bitte lade die Seite neu.</p></section>';
});
