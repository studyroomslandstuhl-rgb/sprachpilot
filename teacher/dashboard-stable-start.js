(function(){
'use strict';
if(window.__SP_TEACHER_STABLE_START_V1)return;
window.__SP_TEACHER_STABLE_START_V1=true;

try{if(typeof window.startTeacherDashboard==='function')document.removeEventListener('DOMContentLoaded',window.startTeacherDashboard)}catch(e){}

function safe(v){try{return TeacherEnv.safe(v)}catch(e){return String(v||'')}}
function show(html){const app=document.getElementById('app');if(app)app.innerHTML=html}
function accessProblem(access,user){
 const email=safe(user?.email||''),uid=safe(user?.uid||'');
 if(access?.pending)return `<div class="card warning-card"><h2>Zugang noch nicht freigeschaltet</h2><p>Dein Lehrerzugang ist registriert, aber noch nicht freigeschaltet.</p><p class="small">E-Mail: ${email}<br>UID: ${uid}</p></div>`;
 if(access?.blocked)return `<div class="card warning-card"><h2>Lehrerzugang deaktiviert</h2><p>Dieser Lehrerzugang ist deaktiviert.</p><p class="small">E-Mail: ${email}</p></div>`;
 if(access?.roleInvalid)return `<div class="card warning-card"><h2>Kein Lehrerzugang</h2><p>Dieser Account ist nicht als Lehrerrolle markiert.</p><p class="small">E-Mail: ${email}</p></div>`;
 return `<div class="card warning-card"><h2>Kein Lehrerzugang</h2><p>Für diese Anmeldung wurde kein freigeschalteter Lehrer-Datensatz gefunden.</p><p class="small">E-Mail: ${email}<br>UID: ${uid}</p><div class="toolbar"><a class="btn secondary" href="login.html">Zum Lehrerlogin</a><a class="btn secondary" href="/index.html">Zur Startseite</a></div></div>`;
}

function stableStart(){
 const app=document.getElementById('app');
 const activeRole=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();
 if(activeRole==='student'){
  TeacherEnv.clearStudentPreviewState();
  show('<div class="card warning-card"><h2>Schüler-Login aktiv</h2><p>Du bist gerade als Schüler/in angemeldet.</p><div class="toolbar"><a class="btn" href="/student-dashboard/index.html">Zum Schüler-Dashboard</a><a class="btn secondary" href="/index.html">Zur Startseite</a></div></div>');
  return;
 }
 const auth=TeacherEnv.auth();
 if(!auth){show('<div class="card warning-card"><h2>Firebase/Auth ist nicht verbunden</h2><p>Das Lehrer-Dashboard kann ohne Firebase-Anmeldung nicht geladen werden.</p><button onclick="location.reload()">Neu laden</button></div>');return}
 let rendered=false;
 const slowTimer=setTimeout(()=>{if(!rendered&&app)app.innerHTML='<div class="card"><h2>Dashboard wird verbunden …</h2><p class="small">Firebase antwortet langsam. Die Seite lädt weiter; ein erneutes Laden ist normalerweise nicht nötig.</p></div>'},12000);
 try{
  auth.onAuthStateChanged(async user=>{
   if(!user){clearTimeout(slowTimer);location.href='login.html';return}
   try{
    const database=TeacherEnv.db();
    if(!database)throw new Error('Firestore ist nicht verbunden.');
    const access=await TeacherAccess.resolve(database,user);
    if(!access?.ok){clearTimeout(slowTimer);rendered=true;TeacherEnv.clearStudentPreviewState();show(accessProblem(access,user));return}
    TeacherEnv.setTeacher(user,access.data||{});
    localStorage.setItem('SP_ACTIVE_ROLE','teacher');localStorage.setItem('SP_LOGIN_ROLE','teacher');localStorage.setItem('SP_LOGIN_CONTEXT','teacher');localStorage.setItem('SP_TEACHER_MODE','1');
    await TeacherApp.render({notice:''});
    rendered=true;clearTimeout(slowTimer);
   }catch(error){
    rendered=true;clearTimeout(slowTimer);TeacherEnv.note('Lehrer-Dashboard konnte nicht geladen werden',error);
    show(`<div class="card warning-card"><h2>Dashboard konnte nicht geladen werden</h2><p>${safe(error?.message||error)}</p><div class="toolbar"><button onclick="location.reload()">Neu laden</button><a class="btn secondary" href="login.html">Zum Lehrerlogin</a></div></div>`);
   }
  });
 }catch(error){rendered=true;clearTimeout(slowTimer);show(`<div class="card warning-card"><h2>Firebase/Auth-Fehler</h2><p>${safe(error?.message||error)}</p><button onclick="location.reload()">Neu laden</button></div>`)}
}
window.startTeacherDashboard=stableStart;
document.addEventListener('DOMContentLoaded',stableStart);
})();