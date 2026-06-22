const TeacherApp = {

  async render(){
    const app = document.getElementById("app");
    if(!app) return;

    app.innerHTML = "<div class='card'>Dashboard wird geladen …</div>";

    try{
      const [coursesSnap, studentsSnap, progressSnap] = await Promise.all([
        db.collection("courses").get(),
        db.collection("students").get(),
        db.collection("progress").get()
      ]);

      const courses = coursesSnap.docs.map(d=>({id:d.id,...d.data()}))
        .sort((a,b)=>String(a.id).localeCompare(String(b.id)));

      const students = studentsSnap.docs.map(d=>({docId:d.id,...d.data()}))
        .sort((a,b)=>String(a.kurs||"").localeCompare(String(b.kurs||"")) || String(a.nachname||"").localeCompare(String(b.nachname||"")));

      const progressMap = {};
      progressSnap.docs.forEach(d=>progressMap[d.id]=d.data());

      app.innerHTML = `
        <section class="teacher-grid">
          <div class="card stat"><h2>${courses.length}</h2><p>Kurse</p></div>
          <div class="card stat"><h2>${students.length}</h2><p>Schüler</p></div>
          <div class="card stat"><h2>${students.filter(s=>s.active!==false).length}</h2><p>aktiv</p></div>
        </section>

        <section class="card">
          <h2>Kurse</h2>
          <div class="teacher-actions">
            <input id="newCourseName" placeholder="Neuer Kurscode, z. B. GLK-68">
            <button onclick="TeacherApp.createCourse()">Kurs erstellen</button>
          </div>
          <div id="coursesList"></div>
        </section>

        <section class="card">
          <h2>Schüler & Fortschritte</h2>
          <div id="studentsList"></div>
        </section>
      `;

      document.getElementById("coursesList").innerHTML = courses.length
        ? courses.map(c=>this.courseCard(c)).join("")
        : "<p>Noch keine Kurse vorhanden.</p>";

      document.getElementById("studentsList").innerHTML = students.length
        ? students.map(s=>this.studentRow(s, progressMap[s.studentId] || progressMap[s.docId] || {})).join("")
        : "<p>Noch keine Schüler vorhanden.</p>";

    }catch(err){
      console.error(err);
      app.innerHTML = `<div class='card no'>Dashboard konnte nicht geladen werden: ${this.safe(err.message)}</div>`;
    }
  },

  courseCard(c){
    const enabled = c.enabledModules || {};
    return `
      <div class="course-card">
        <h3>${this.safe(c.name || c.id)}</h3>
        <p class="small">Code: <b>${this.safe(c.id)}</b></p>
        <div class="chips">
          ${["Fragen A1","Wortschatz","Verben A1","Grammatik"].map(m=>{
            const on = enabled[m] !== false;
            return `<button class="${on?'chip-on':'chip-off'}" onclick="TeacherApp.toggleModule('${this.esc(c.id)}','${this.esc(m)}',${on?'false':'true'})">${m}: ${on?'an':'aus'}</button>`;
          }).join("")}
        </div>
      </div>
    `;
  },

  studentRow(s,p){
    const fragen = this.percent(s.fragenFortschritt ?? p.fragen?.progress ?? 0);
    const wortschatz = this.percent(s.wortschatzFortschritt ?? p.wortschatz?.progress ?? 0);
    const verben = this.percent(s.verbenFortschritt ?? p.verben?.progress ?? 0);

    return `
      <div class="student-row">
        <div>
          <b>${this.safe(s.vorname||"")} ${this.safe(s.nachname||"")}</b>
          <div class="small">${this.safe(s.email||"")} · Kurs: ${this.safe(s.kurs||"")} · Muttersprache: ${this.safe(s.muttersprache||"")}</div>
        </div>
        <div class="progress-mini">
          <span>Fragen ${fragen}%</span><div><b style="width:${fragen}%"></b></div>
          <span>Wortschatz ${wortschatz}%</span><div><b style="width:${wortschatz}%"></b></div>
          <span>Verben ${verben}%</span><div><b style="width:${verben}%"></b></div>
        </div>
      </div>
    `;
  },

  async createCourse(){
    const input = document.getElementById("newCourseName");
    const name = String(input.value||"").trim();
    if(!name){
      alert("Bitte Kurscode eingeben.");
      return;
    }

    await db.collection("courses").doc(name).set({
      name,
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

    input.value="";
    this.render();
  },

  async toggleModule(courseId,moduleName,value){
    const update = {};
    update[`enabledModules.${moduleName}`] = value;
    update.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    await db.collection("courses").doc(courseId).set(update,{merge:true});
    this.render();
  },

  percent(v){
    const n = Number(v||0);
    return Math.max(0, Math.min(100, Math.round(n)));
  },

  esc(s){
    return String(s||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'");
  },

  safe(s){
    return String(s||"")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }
};

window.TeacherApp = TeacherApp;

firebase.auth().onAuthStateChanged(async user => {
  if(!user){
    location.href = "login.html";
    return;
  }

  try{
    const ref=db.collection("teachers").doc(user.uid);
    let teacherDoc=await ref.get();

    if(!teacherDoc.exists){
      await ref.set({
        email:user.email || "",
        role:"teacher",
        active:true,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
      teacherDoc=await ref.get();
    }

    const teacher=teacherDoc.data();

    if(teacher.role !== "teacher" || teacher.active === false){
      await auth.signOut();
      alert("Lehrerzugang ist nicht aktiv.");
      location.href = "login.html";
      return;
    }

    TeacherApp.render();

  }catch(err){
    console.error(err);
    document.getElementById("app").innerHTML =
      "<div class='card no'>Dashboard konnte nicht geladen werden: "+err.message+"</div>";
  }
});
