const TeacherApp = {
  state:{
    teacher:null,
    courses:[],
    students:[],
    progress:{},
    pending:[]
  },

  modules:[
    {key:"Fragen A1", href:"../fragen-A1/", title:"Fragen A1"},
    {key:"Wortschatz", href:"../wortschatz/", title:"Wortschatz"},
    {key:"Verben A1", href:"../verben-A1/", title:"Verben A1"},
    {key:"Grammatik", href:"../grammatik/", title:"Grammatik"}
  ],

  wortschatzTasks:{
    "A1 Lektion 3":{
      "Thema 1":["karteikarten.html","bild-wort.html","wort-bild.html","hoeren.html","artikel.html","drag-drop-artikel.html","plural.html","plural-drag-drop.html","ein-eine.html","kein-keine.html","fragen-mit-fragewort.html","fragen-ohne-fragewort.html","sprechen.html","schreiben.html","memory.html","pruefung.html"],
      "Thema 2":["karteikarten.html","bild-wort.html","wort-bild.html","hoeren.html","artikel.html","drag-drop-artikel.html","plural.html","plural-drag-drop.html","verpackungen.html","frage-und-antwort.html","preis-hoeren.html","preis-auswaehlen.html","preis-schreiben.html","pruefung.html"]
    },
    "A1 Lektion 4":{
      "Thema 1":["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","wo-ist.html","ist-hier.html","pruefung.html"],
      "Thema 2":["karteikarten.html","hoeren.html","artikel-klick.html","artikel.html","plural.html","bild-wort.html","wort-bild.html","kategorien.html","dialoge.html","pruefung.html"],
      "Thema 3":["karteikarten.html","hoeren.html","farbe-nennen.html","moebel-farbe.html","gegenteil-memory.html","gegenteil-zuordnen.html","satz-ergaenzen.html","farbenbild.html","pruefung.html"]
    }
  },

  verbWords:[
    "antworten","arbeiten","atmen","backen","bedeuten","befehlen","bekommen","benutzen","bezahlen","beißen","blasen","brauchen","brechen","bringen","buchstabieren","denken","drehen","empfehlen","erklären","essen","fahren","fallen","fangen","finden","fotografieren","fragen","fressen","funktionieren","füttern","geben","gehen","genießen","gewinnen","gießen","glauben","graben","greifen","grüßen","haben","halten","hassen","helfen","hoffen","hören","kennen","kleben","kochen","kommen","kontrollieren","kosten","küssen","lachen","laden","lassen","laufen","leben","lernen","lesen","lieben","machen","malen","markieren","messen","mixen","nehmen","notieren","öffnen","probieren","putzen","raten","reden","rechnen","reisen","rennen","reparieren","reservieren","rufen","sagen","saufen","schicken","schieben","schlafen","schlagen","schließen","schmecken","schneiden","schreiben","schreien","schwimmen","sehen","sein","singen","sitzen","spielen","sprechen","springen","stechen","stehen","stehlen","sterben","streiten","suchen","tanzen","telefonieren","tragen","träumen","trinken","tun","überqueren","unterschreiben","vergessen","verlieren","verkaufen","verstehen","versuchen","wachsen","warten","waschen","werden","werben","werfen","wiederholen","winken","wissen","wohnen","zeichnen","zeigen","ziehen"
  ].sort((a,b)=>a.localeCompare(b,"de")),

  async render(){
    const app=document.getElementById("app");
    if(!app) return;

    app.innerHTML="<div class='card'>Dashboard wird geladen …</div>";

    try{
      const user=auth.currentUser;
      if(!user){
        location.href="login.html";
        return;
      }

      await this.ensureTeacher(user);
      await this.loadData();

      const isOwner=this.isOwner();
      const visibleCourses=this.visibleCourses();

      app.innerHTML=`
        <section class="dash-top">
          <div class="mini-stat"><b>${visibleCourses.length}</b><span>Kurse</span></div>
          <div class="mini-stat"><b>${this.visibleStudents(visibleCourses.map(c=>c.id)).length}</b><span>TN</span></div>
          <div class="mini-stat"><b>${this.state.pending.length}</b><span>Anfragen</span></div>
        </section>

        <section class="card compact">
          <h2>Lehrer-Testmodus</h2>
          <p class="small">Als Lehrkraft ist nichts gesperrt. Du kannst alle Module, Lektionen, Aufgaben und Prüfungen öffnen.</p>
          <div class="quick-links">
            ${this.modules.map(m=>`<a class="btn secondary" href="${m.href}" target="_blank">${m.title} öffnen</a>`).join("")}
            <a class="btn secondary" href="../wortschatz/A1-Lektion-3/" target="_blank">Wortschatz Lektion 3</a>
            <a class="btn secondary" href="../wortschatz/A1-Lektion-4/" target="_blank">Wortschatz Lektion 4</a>
          </div>
        </section>

        ${isOwner?this.pendingSection():""}

        <section class="card compact">
          <h2>Kurs erstellen</h2>
          <div class="create-course">
            <input id="newCourseName" placeholder="Kursname, z. B. GLK Abendkurs">
            <input id="newCourseCode" placeholder="Kurscode, z. B. GLK-68">
            <button onclick="TeacherApp.createCourse()">Kurs erstellen</button>
          </div>
        </section>

        <section class="course-list">
          ${visibleCourses.length?visibleCourses.map(c=>this.courseAccordion(c)).join(""):"<div class='card'>Noch keine Kurse vorhanden.</div>"}
        </section>
      `;

    }catch(err){
      console.error(err);
      app.innerHTML=`<div class='card no'>Dashboard konnte nicht geladen werden: ${this.safe(err.message)}</div>`;
    }
  },

  async ensureTeacher(user){
    const doc=await db.collection("teachers").doc(user.uid).get();
    if(!doc.exists){
      await auth.signOut();
      location.href="login.html";
      throw new Error("Kein freigegebener Lehrerzugang.");
    }

    const teacher=doc.data();
    if(teacher.approved===false || teacher.active===false || !["owner","admin","teacher"].includes(teacher.role)){
      await auth.signOut();
      location.href="login.html";
      throw new Error("Lehrerzugang nicht freigegeben.");
    }

    this.state.teacher={id:user.uid,...teacher};
    localStorage.setItem("SP_TEACHER_MODE","1");
    localStorage.setItem("SP_USER_ROLE",teacher.role||"teacher");
    localStorage.setItem("SP_TEACHER_ID",user.uid);
  },

  async loadData(){
    const [coursesSnap,studentsSnap,progressSnap,pendingSnap]=await Promise.all([
      db.collection("courses").get(),
      db.collection("students").get(),
      db.collection("progress").get(),
      db.collection("teachers_pending").get()
    ]);

    this.state.courses=coursesSnap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(a.courseName||a.name||a.id).localeCompare(String(b.courseName||b.name||b.id),"de"));
    this.state.students=studentsSnap.docs.map(d=>({docId:d.id,...d.data()})).sort((a,b)=>String(a.nachname||"").localeCompare(String(b.nachname||""),"de"));
    this.state.progress={};
    progressSnap.docs.forEach(d=>this.state.progress[d.id]=d.data());
    this.state.pending=pendingSnap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(a.email||"").localeCompare(String(b.email||""),"de"));
  },

  isOwner(){
    return this.state.teacher?.role==="owner" || this.state.teacher?.role==="admin";
  },

  visibleCourses(){
    if(this.isOwner()) return this.state.courses;
    const tid=this.state.teacher?.id;
    return this.state.courses.filter(c=>!c.teacherId || c.teacherId===tid || (Array.isArray(c.teacherIds)&&c.teacherIds.includes(tid)));
  },

  visibleStudents(courseIds){
    return this.state.students.filter(s=>courseIds.includes(String(s.kurs||s.courseCode||s.kursnummer||"")));
  },

  pendingSection(){
    if(!this.state.pending.length){
      return `<section class="card compact"><h2>Lehreranfragen</h2><p class="small">Keine offenen Anfragen.</p></section>`;
    }

    return `<section class="card compact">
      <h2>Lehreranfragen (${this.state.pending.length})</h2>
      ${this.state.pending.map(p=>`
        <details class="tiny-accordion">
          <summary><b>${this.safe((p.firstName||"")+" "+(p.lastName||""))}</b> · ${this.safe(p.email||"")}</summary>
          <div class="inside">
            <p class="small">Institution: ${this.safe(p.school||"")}<br>Rolle/Beruf: ${this.safe(p.job||"")}</p>
            <button onclick="TeacherApp.approveTeacher('${this.esc(p.id)}')">Genehmigen</button>
            <button class="danger" onclick="TeacherApp.rejectTeacher('${this.esc(p.id)}')">Ablehnen</button>
          </div>
        </details>`).join("")}
    </section>`;
  },

  courseAccordion(c){
    const courseCode=String(c.courseCode||c.id);
    const courseName=String(c.courseName||c.name||c.id);
    const students=this.state.students.filter(s=>String(s.kurs||s.courseCode||s.kursnummer||"")===courseCode);

    return `<details class="course-accordion">
      <summary>
        <span><b>${this.safe(courseName)}</b> <small>${this.safe(courseCode)}</small></span>
        <span class="pill">${students.length} TN</span>
      </summary>
      <div class="inside">
        <div class="course-tools">
          <button onclick="TeacherApp.showReleasePanel('${this.esc(courseCode)}')">Freigaben bearbeiten</button>
          <button class="secondary" onclick="TeacherApp.openStudentLinks('${this.esc(courseCode)}')">Testlinks</button>
        </div>
        <div id="release-${this.attr(courseCode)}" class="release-box hidden"></div>
        <h3>Teilnehmer</h3>
        ${students.length?students.map(s=>this.studentAccordion(s)).join(""):"<p class='small'>Keine TN in diesem Kurs.</p>"}
      </div>
    </details>`;
  },

  studentAccordion(s){
    const p=this.state.progress[s.studentId] || this.state.progress[s.docId] || {};
    return `<details class="student-accordion">
      <summary>
        <span><b>${this.safe((s.vorname||"")+" "+(s.nachname||""))}</b><small>${this.safe(s.email||"")} · ${this.safe(s.muttersprache||"")}</small></span>
      </summary>
      <div class="inside">
        ${this.studentModule("Fragen", s, p)}
        ${this.studentModule("Wortschatz", s, p)}
        ${this.studentModule("Verben", s, p)}
        ${this.studentModule("Grammatik", s, p)}
      </div>
    </details>`;
  },

  studentModule(name,s,p){
    if(name==="Wortschatz"){
      return `<details class="tiny-accordion"><summary>${name} <span class="pill">${this.modulePercent(p,"wortschatz",s.wortschatzFortschritt)}%</span></summary><div class="inside">${this.wortschatzDetail(p)}</div></details>`;
    }
    const key=name.toLowerCase();
    const val=this.modulePercent(p,key,s[key+"Fortschritt"]);
    return `<details class="tiny-accordion"><summary>${name} <span class="pill">${val}%</span></summary><div class="inside"><p class="small">Detailauswertung wird gespeichert, sobald die Aufgaben Fortschritte in Firebase schreiben.</p></div></details>`;
  },

  modulePercent(p,key,fallback){
    const val=fallback ?? p?.[key]?.progress ?? p?.[key]?.percent ?? 0;
    return this.percent(val);
  },

  wortschatzDetail(progress){
    const state=progress?.wortschatz?.state || progress?.wortschatz || {};
    return Object.entries(this.wortschatzTasks).map(([lesson,themes])=>`
      <details class="tiny-accordion">
        <summary>${lesson}</summary>
        <div class="inside">
          ${Object.entries(themes).map(([theme,tasks])=>`
            <details class="tiny-accordion">
              <summary>${theme}</summary>
              <div class="task-grid">
                ${tasks.map(task=>{
                  const val=this.findTaskProgress(state,lesson,theme,task);
                  return `<div class="task-pill ${val>0?'done':'notdone'}"><span>${task.replace(".html","")}</span><b>${val}%</b></div>`;
                }).join("")}
              </div>
            </details>`).join("")}
        </div>
      </details>`).join("");
  },

  findTaskProgress(state,lesson,theme,task){
    const keys=[
      `${lesson}/${theme}/${task}`,
      `${lesson}_${theme}_${task}`,
      `${theme}/${task}`,
      task
    ];
    for(const k of keys){
      const v=state?.[k];
      if(typeof v==="number") return this.percent(v);
      if(v && typeof v==="object") return this.percent(v.percent ?? v.progress ?? 0);
    }
    return 0;
  },

  showReleasePanel(courseCode){
    const box=document.getElementById("release-"+this.attr(courseCode));
    const course=this.state.courses.find(c=>String(c.courseCode||c.id)===courseCode);
    if(!box || !course) return;
    box.classList.toggle("hidden");
    box.innerHTML=this.releasePanel(course);
  },

  releasePanel(c){
    const enabledModules=c.enabledModules||{};
    const enabledLessons=c.enabledLessons||{};
    const enabledTasks=c.enabledTasks||{};
    const enabledWords=c.enabledWords||{};

    return `<div class="release-panel">
      <h3>Freigaben: ${this.safe(c.courseName||c.name||c.id)}</h3>

      <details open class="tiny-accordion">
        <summary>Module</summary>
        <div class="checks">
          ${this.modules.map(m=>this.check(`module-${m.key}`, enabledModules[m.key]!==false, `TeacherApp.toggleModule('${this.esc(c.id)}','${this.esc(m.key)}')`, m.title)).join("")}
        </div>
      </details>

      <details class="tiny-accordion">
        <summary>Wortschatz Lektionen / Aufgaben / Prüfungen</summary>
        <div class="inside">
          ${Object.entries(this.wortschatzTasks).map(([lesson,themes])=>`
            <details class="tiny-accordion">
              <summary>${lesson}</summary>
              ${Object.entries(themes).map(([theme,tasks])=>`
                <details class="tiny-accordion">
                  <summary>${theme}</summary>
                  <div class="task-grid">
                    ${tasks.map(task=>{
                      const key=`Wortschatz/${lesson}/${theme}/${task}`;
                      const on=enabledTasks[key]!==false;
                      return this.check(key,on,`TeacherApp.toggleTask('${this.esc(c.id)}','${this.esc(key)}')`,task.replace(".html",""));
                    }).join("")}
                  </div>
                </details>`).join("")}
            </details>`).join("")}
        </div>
      </details>

      <details class="tiny-accordion">
        <summary>Verben einzeln freigeben</summary>
        <div class="verb-list">
          ${this.verbWords.map(v=>{
            const key=`Verben A1/${v}`;
            const on=enabledWords[key]!==false;
            return this.check(key,on,`TeacherApp.toggleWord('${this.esc(c.id)}','${this.esc(key)}')`,v);
          }).join("")}
        </div>
      </details>
    </div>`;
  },

  check(id,on,onclick,label){
    return `<label class="checkrow"><input type="checkbox" ${on?"checked":""} onchange="${onclick}"> <span>${this.safe(label)}</span></label>`;
  },

  async createCourse(){
    const name=document.getElementById("newCourseName").value.trim();
    const code=document.getElementById("newCourseCode").value.trim();

    if(!name || !code){
      alert("Bitte Kursname und Kurscode eingeben.");
      return;
    }

    await db.collection("courses").doc(code).set({
      courseName:name,
      name,
      courseCode:code,
      teacherId:this.state.teacher.id,
      teacherIds:[this.state.teacher.id],
      enabledModules:{
        "Fragen A1":true,
        "Wortschatz":true,
        "Verben A1":true,
        "Grammatik":false
      },
      enabledLessons:{},
      enabledTasks:{},
      enabledWords:{},
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});

    this.render();
  },

  async approveTeacher(id){
    const ref=db.collection("teachers_pending").doc(id);
    const snap=await ref.get();
    if(!snap.exists) return;
    const p=snap.data();

    await db.collection("teachers").doc(id).set({
      ...p,
      role:"teacher",
      active:true,
      approved:true,
      approvedBy:this.state.teacher.id,
      approvedAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    }, {merge:true});

    await ref.delete();
    this.render();
  },

  async rejectTeacher(id){
    if(!confirm("Lehreranfrage wirklich ablehnen?")) return;
    const ref=db.collection("teachers_pending").doc(id);
    const snap=await ref.get();
    if(snap.exists){
      await db.collection("teachers_rejected").doc(id).set({
        ...snap.data(),
        rejectedBy:this.state.teacher.id,
        rejectedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
    }
    await ref.delete();
    this.render();
  },

  async toggleModule(courseId,moduleName){
    const course=this.state.courses.find(c=>c.id===courseId);
    const current=(course?.enabledModules||{})[moduleName]!==false;
    const update={};
    update[`enabledModules.${moduleName}`]=!current;
    update.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
    await db.collection("courses").doc(courseId).set(update,{merge:true});
    await this.loadData();
    this.showReleasePanel(String(course.courseCode||course.id));
  },

  async toggleTask(courseId,key){
    const course=this.state.courses.find(c=>c.id===courseId);
    const current=(course?.enabledTasks||{})[key]!==false;
    const update={};
    update[`enabledTasks.${key}`]=!current;
    update.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
    await db.collection("courses").doc(courseId).set(update,{merge:true});
    await this.loadData();
    this.showReleasePanel(String(course.courseCode||course.id));
  },

  async toggleWord(courseId,key){
    const course=this.state.courses.find(c=>c.id===courseId);
    const current=(course?.enabledWords||{})[key]!==false;
    const update={};
    update[`enabledWords.${key}`]=!current;
    update.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
    await db.collection("courses").doc(courseId).set(update,{merge:true});
    await this.loadData();
    this.showReleasePanel(String(course.courseCode||course.id));
  },

  openStudentLinks(courseCode){
    alert("Lehrer-Testmodus ist aktiv. Öffne Startseite/Wortschatz/Verben/Fragen über die Buttons oben.");
  },

  percent(v){
    const n=Number(v||0);
    return Math.max(0,Math.min(100,Math.round(n)));
  },

  attr(s){return String(s||"").replace(/[^a-zA-Z0-9_-]/g,"_")},
  esc(s){return String(s||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")},
  safe(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}
};

window.TeacherApp=TeacherApp;

firebase.auth().onAuthStateChanged(async user=>{
  if(!user){
    location.href="login.html";
    return;
  }

  TeacherApp.render();
});
