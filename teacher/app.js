const TeacherEnv = {
  errors: [],
  teacherData: null,
  note(message, error){
    const text = message + (error && error.message ? " · " + error.message : "");
    console.warn("[SprachPilot Lehrer-Dashboard]", text, error || "");
    this.errors.push(text);
  },
  db(){
    try{
      if(window.db) return window.db;
      if(typeof firebase !== "undefined" && firebase.apps && firebase.apps.length && firebase.firestore){
        window.db = firebase.firestore();
        return window.db;
      }
    }catch(e){ this.note("Firebase/Firestore konnte nicht geöffnet werden", e); }
    return null;
  },
  auth(){
    try{
      if(typeof firebase !== "undefined" && firebase.apps && firebase.apps.length && firebase.auth){
        return firebase.auth();
      }
    }catch(e){ this.note("Firebase/Auth konnte nicht geöffnet werden", e); }
    return null;
  },
  currentUser(){
    try{return this.auth()?.currentUser || null}catch(e){return null}
  },
  profile(){
    try{return JSON.parse(localStorage.getItem("SP_USER_PROFILE") || "{}")}catch(e){return {}}
  },
  teacherProfile(){
    if(this.teacherData) return this.teacherData;
    try{return JSON.parse(localStorage.getItem("SP_TEACHER_PROFILE") || "{}")}catch(e){return {}}
  },
  setTeacher(user,data={}){
    const profile={
      ...(data||{}),
      uid:user?.uid || data.uid || data.id || "",
      id:user?.uid || data.id || "",
      email:user?.email || data.email || "",
      name:data.name || data.fullName || user?.displayName || `${data.vorname||data.firstName||""} ${data.nachname||data.lastName||""}`.trim() || user?.email || ""
    };
    this.teacherData=profile;
    try{
      localStorage.setItem("SP_TEACHER_PROFILE",JSON.stringify(profile));
      localStorage.setItem("SP_TEACHER_ID",profile.uid||profile.id||"");
      localStorage.setItem("SP_TEACHER_UID",profile.uid||profile.id||"");
      localStorage.setItem("SP_TEACHER_EMAIL",String(profile.email||"").toLowerCase());
    }catch(e){}
  },
  profileRole(){
    const p=this.profile();
    return String(p.role || p.typ || p.type || p.accountType || p.loginRole || "").toLowerCase();
  },
  clearStudentPreviewState(){
    try{
      sessionStorage.removeItem("SP_TEACHER_PREVIEW");
      sessionStorage.removeItem("SP_TEACHER_MODE_WAS_ACTIVE");
      sessionStorage.removeItem("SP_PREVIEW_COURSE");
    }catch(e){}
  },
  safe(value){
    return String(value || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;");
  }
};

const TeacherApp = {
  lastCourses: [],
  renderNotice(extra=""){
    const messages = [...new Set([...(TeacherEnv.errors || []), extra].filter(Boolean))];
    if(!messages.length) return "";
    return `<section class="card warning-card">
      <h2>Hinweis</h2>
      <p>Das Dashboard wurde geladen, aber es gibt ein technisches Problem.</p>
      <div class="small">${messages.map(m=>`• ${TeacherEnv.safe(m)}`).join("<br>")}</div>
    </section>`;
  },
  async render(options={}){
    const app=document.getElementById("app");
    if(!app) return;
    app.innerHTML=`<div class="card">Dashboard wird geladen …</div>`;

    let courses=[], studentsRaw=[], progressRows=[];
    const results = await Promise.allSettled([
      Courses.list(),
      Students.list(),
      Students.progressList()
    ]);

    if(results[0].status === "fulfilled") courses = results[0].value || [];
    else TeacherEnv.note("Kurse konnten nicht geladen werden", results[0].reason);

    if(results[1].status === "fulfilled") studentsRaw = results[1].value || [];
    else TeacherEnv.note("Schüler konnten nicht geladen werden", results[1].reason);

    if(results[2].status === "fulfilled") progressRows = results[2].value || [];
    else TeacherEnv.note("Fortschritt konnte nicht geladen werden", results[2].reason);

    const courseNames=courses.map(c=>Courses.code(c)).filter(Boolean).sort((a,b)=>String(a).localeCompare(String(b),"de"));
    const studentsAll=Students.mergeStudentProgress(studentsRaw,progressRows);
    const students=Students.filterByCourses(studentsAll,courseNames);
    window.__SP_COURSES=courses;
    window.__SP_STUDENTS_BY_ID=Object.fromEntries(students.map(s=>[s.studentId||s.id,s]));
    const byCourse=Students.byCourse(students);

    const totalStudents=students.length;
    const avgProgress=totalStudents?Math.round(students.reduce((sum,s)=>{
      const verben=Analytics.verbenData(s);
      return sum+Analytics.percent(verben.progress??s.verbenFortschritt??0);
    },0)/totalStudents):0;
    const finished=students.filter(s=>{
      const verben=Analytics.verbenData(s);
      return Analytics.percent(verben.progress??s.verbenFortschritt??0)>=100;
    }).length;

    const user=TeacherEnv.currentUser();
    const teacherLine=user ? `${TeacherEnv.safe(user.email || user.uid || "Lehrer/in")}` : "Keine aktive Firebase-Anmeldung erkannt.";

    app.innerHTML=`
      ${this.renderNotice(options.notice)}
      <section class="card">
        <h2>Gesamtübersicht</h2>
        <div class="small">Angemeldet: ${teacherLine}</div>
        <div class="overview-stats">
          <div class="stat"><div class="num">${courseNames.length}</div><div>meine Kurse</div></div>
          <div class="stat"><div class="num">${totalStudents}</div><div>Schüler</div></div>
          <div class="stat"><div class="num">${avgProgress}%</div><div>Ø Verben</div></div>
          <div class="stat"><div class="num">${finished}</div><div>bei 100%</div></div>
        </div>
      </section>

      <section class="card">
        <h2>Kurs anlegen</h2>
        <div class="toolbar">
          <input id="courseName" placeholder="z. B. Integrationskurs B1" />
          <button onclick="Courses.create(document.getElementById('courseName').value)">Kurs anlegen</button>
        </div>
      </section>

      <section class="card">
        <div class="release-toolbar">
          <h2>Kurs-Freigaben</h2>
          <div><button onclick="TeacherApp.render()">Aktualisieren</button><button class="save-btn" onclick="ReleaseDraft.save()">Speichern</button></div>
        </div>
        <div class="toolbar">
          <select id="releaseCourse">
            <option value="">Kurs auswählen</option>
            ${courseNames.map(c=>`<option value="${TeacherEnv.safe(c)}">${TeacherEnv.safe(c)}</option>`).join("")}
          </select>
        </div>
        <div id="releaseEditor" class="release-editor"><div class="empty">Bitte Kurs auswählen.</div></div>
      </section>

      <section class="card">
        <h2>Meine Kurse und Fortschritte</h2>
        ${courseNames.length?courseNames.map(name=>{
          const course=courses.find(c=>Courses.code(c)===name || c.id===name || c.name===name);
          return Analytics.courseCard(name,byCourse[name]||[],course);
        }).join(""):`<div class="empty">Noch keine Kurse zugewiesen.</div>${Courses.debugBox()}`}
      </section>
    `;

    const select=document.getElementById("releaseCourse");
    if(select){select.addEventListener("change",e=>TeacherApp.openReleaseEditor(e.target.value,courses));}
  },
  async openReleaseEditor(courseName,courses){
    const box=document.getElementById("releaseEditor");
    if(!box)return;
    if(!courseName){box.innerHTML=`<div class="empty">Bitte Kurs auswählen.</div>`;return;}
    const course=(courses||window.__SP_COURSES||[]).find(c=>Courses.code(c)===courseName || c.id===courseName || c.name===courseName)||{};
    box.innerHTML=renderReleaseEditor(course);
    const select=document.getElementById("releaseCourse");
    if(select)select.value=courseName;
  }
};

async function teacherLogout(){
  try{
    localStorage.removeItem("SP_TEACHER_MODE");
    localStorage.removeItem("SP_USER_ROLE");
    localStorage.removeItem("SP_TEACHER_EMAIL");
    localStorage.removeItem("SP_TEACHER_ID");
    localStorage.removeItem("SP_LOGIN_ROLE");
    localStorage.removeItem("SP_ACTIVE_ROLE");
    sessionStorage.removeItem("SP_TEACHER_PREVIEW");
    const auth=TeacherEnv.auth();
    if(auth) await auth.signOut();
  }catch(e){console.warn(e)}
  location.href="/index.html";
}
window.teacherLogout=teacherLogout;

function startTeacherDashboard(){
  const app=document.getElementById("app");
  let finished=false;
  const activeRole=String(localStorage.getItem("SP_LOGIN_ROLE")||localStorage.getItem("SP_ACTIVE_ROLE")||"").toLowerCase();
  if(activeRole==="student"){
    TeacherEnv.clearStudentPreviewState();
    if(app) app.innerHTML=`<div class="card warning-card"><h2>Schüler-Login aktiv</h2><p>Du bist gerade als Schüler/in angemeldet. Schülerkonten dürfen das Lehrer-Dashboard nicht öffnen.</p><div class="toolbar"><a class="btn" href="/student-dashboard/index.html">Zum Schüler-Dashboard</a><a class="btn secondary" href="/index.html">Zur Startseite</a></div></div>`;
    return;
  }

  function finish(fn){
    if(finished) return;
    finished=true;
    try{fn()}catch(e){
      TeacherEnv.note("Dashboard konnte nicht gerendert werden", e);
      if(app) app.innerHTML=`<div class="card warning-card"><h2>Fehler</h2><p>Dashboard konnte nicht geladen werden.</p><div class="small">${TeacherEnv.safe(e.message||e)}</div><button onclick="location.reload()">Neu laden</button></div>`;
    }
  }

  setTimeout(()=>{
    if(!finished){
      TeacherEnv.note("Firebase/Auth antwortet nicht. Fallback-Dashboard wird angezeigt.");
      finish(()=>TeacherApp.render({notice:"Firebase/Auth antwortet nicht. Bitte Firebase-Konfiguration und Login prüfen."}));
    }
  }, 5000);

  const auth=TeacherEnv.auth();
  if(!auth){
    TeacherEnv.note("Firebase/Auth ist nicht verbunden. Prüfe js/firebase-config.js bzw. deine Firebase-Konfiguration.");
    finish(()=>TeacherApp.render({notice:"Firebase/Auth ist nicht verbunden. Prüfe Firebase-Konfiguration."}));
    return;
  }

  try{
    auth.onAuthStateChanged(async user=>{
      if(!user){
        finish(()=>{ location.href="login.html"; });
        return;
      }

      const database=TeacherEnv.db();
      let teacherAllowed=false;
      let teacherPending=false;

      if(database){
        try{
          const snap=await database.collection("teachers").doc(user.uid).get();
          if(!snap.exists){
            TeacherEnv.clearStudentPreviewState();
            localStorage.setItem("SP_ACTIVE_ROLE","student");
            finish(()=>{
              if(app) app.innerHTML=`
                <div class="card warning-card">
                  <h2>Kein Lehrerzugang</h2>
                  <p>Dieses Konto ist nicht als Lehrer freigeschaltet.</p>
                  <p class="small">Schülerkonten dürfen das Lehrer-Dashboard nicht öffnen.</p>
                  <div class="toolbar"><a class="btn" href="/student-dashboard/index.html">Zum Schüler-Dashboard</a><a class="btn secondary" href="/index.html">Zur Startseite</a></div>
                </div>`;
            });
            return;
          }

          const data=snap.data()||{};
          TeacherEnv.setTeacher(user,data);
          const role=String(data.role || data.typ || data.type || data.accountType || "teacher").toLowerCase();
          const roleOk=["teacher","lehrer","admin",""].includes(role);

          if(data.active===false || data.approved===false || data.status==="pending"){
            teacherPending=true;
          }

          if(teacherPending){
            TeacherEnv.clearStudentPreviewState();
            finish(()=>{
              if(app) app.innerHTML=`<div class="card warning-card"><h2>Zugang noch nicht freigeschaltet</h2><p>Dein Lehrerzugang ist noch nicht aktiv.</p></div>`;
            });
            return;
          }

          if(!roleOk){
            TeacherEnv.clearStudentPreviewState();
            localStorage.setItem("SP_ACTIVE_ROLE","student");
            finish(()=>{
              if(app) app.innerHTML=`<div class="card warning-card"><h2>Kein Lehrerzugang</h2><p>Dieses Konto ist nicht als Lehrerzugang markiert.</p></div>`;
            });
            return;
          }

          teacherAllowed=true;
          localStorage.setItem("SP_ACTIVE_ROLE","teacher");
          localStorage.setItem("SP_LOGIN_ROLE","teacher");
          localStorage.setItem("SP_LOGIN_CONTEXT","teacher");
        }catch(e){
          TeacherEnv.note("Lehrerstatus konnte nicht geprüft werden. Dashboard wird nicht geöffnet, bis die Rolle klar ist.", e);
          TeacherEnv.clearStudentPreviewState();
          finish(()=>{
            if(app) app.innerHTML=`
              <div class="card warning-card">
                <h2>Lehrerstatus konnte nicht geprüft werden</h2>
                <p>Das Dashboard wird aus Sicherheitsgründen nicht geöffnet.</p>
                <div class="small">${TeacherEnv.safe(e.message||e)}</div>
                <div class="toolbar"><button onclick="location.reload()">Neu laden</button><a class="btn secondary" href="/index.html">Zur Startseite</a></div>
              </div>`;
          });
          return;
        }
      } else {
        TeacherEnv.note("Firestore ist nicht verbunden. Lehrerrolle kann nicht geprüft werden.");
        TeacherEnv.clearStudentPreviewState();
        finish(()=>{
          if(app) app.innerHTML=`<div class="card warning-card"><h2>Lehrerrolle nicht geprüft</h2><p>Ohne Firebase/Firestore wird das Lehrer-Dashboard nicht geöffnet.</p></div>`;
        });
        return;
      }

      if(!teacherAllowed){
        TeacherEnv.clearStudentPreviewState();
        finish(()=>{
          if(app) app.innerHTML=`<div class="card warning-card"><h2>Kein Lehrerzugang</h2><p>Bitte mit einem freigeschalteten Lehrerkonto anmelden.</p></div>`;
        });
        return;
      }

      finish(()=>TeacherApp.render());
    });
  }catch(e){
    TeacherEnv.note("Auth-Status konnte nicht gelesen werden", e);
    finish(()=>TeacherApp.render({notice:"Auth-Status konnte nicht gelesen werden."}));
  }
}

document.addEventListener("DOMContentLoaded",startTeacherDashboard);
window.addEventListener("error",e=>{
  TeacherEnv.note("JavaScript-Fehler", e.error || e.message);
});
