(function(){
'use strict';
if(window.__SP_TEACHER_LIVE_PROGRESS_REFRESH_V2)return;
window.__SP_TEACHER_LIVE_PROGRESS_REFRESH_V2=true;
let busy=false,last=0,timer=null;
function editing(){const el=document.activeElement,tag=String(el?.tagName||'').toLowerCase();return tag==='input'||tag==='textarea'||tag==='select'||el?.isContentEditable===true}
async function refresh(force=false){
 if(busy||document.hidden||editing())return false;
 const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 if(role==='student')return false;
 if(!force&&Date.now()-last<15000)return false;
 if(typeof TeacherApp==='undefined'||typeof TeacherEnv==='undefined'||!TeacherEnv.currentUser?.())return false;
 busy=true;try{await TeacherApp.render({notice:''});last=Date.now();return true}catch(e){TeacherEnv.note?.('Live-Aktualisierung konnte nicht geladen werden',e);return false}finally{busy=false}
}
function later(ms=250,force=false){clearTimeout(timer);timer=setTimeout(()=>refresh(force),ms)}
window.addEventListener('focus',()=>later(150,true));
window.addEventListener('pageshow',()=>later(250,true));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)later(150,true)});
setInterval(()=>refresh(false),30000);
window.SP_TEACHER_LIVE_REFRESH=()=>refresh(true);
})();