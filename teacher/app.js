const TeacherApp = {
  async render(){
    const app=document.getElementById("app");
    app.innerHTML=`<div class="card">Dashboard wird geladen …</div>`;

    const [courses,studentsRaw,progressRows]=await Promise.all([
      Courses.list(),Students.list(),Students.progressList()
    ]);
    const courseNames=courses.map(c=>c.id||c.name).filter(Boolean).sort();
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

    app.innerHTML=`
      <section class="card">
        <h2>Gesamtübersicht</h2>
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
            ${courseNames.map(c=>`<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>
        <div id="releaseEditor" class="release-editor"><div class="empty">Bitte Kurs auswählen.</div></div>
      </section>

      <section class="card">
        <h2>Meine Kurse und Fortschritte</h2>
        ${courseNames.length?courseNames.map(name=>Analytics.courseCard(name,byCourse[name]||[],courses.find(c=>(c.id||c.name)===name))).join(""):`<div class="empty">Noch keine Kurse zugewiesen.</div>`}
      </section>
    `;

    const select=document.getElementById("releaseCourse");
    if(select){select.addEventListener("change",e=>TeacherApp.openReleaseEditor(e.target.value,courses));}
  },
  async openReleaseEditor(courseName,courses){
    const box=document.getElementById("releaseEditor");
    if(!box)return;
    if(!courseName){box.innerHTML=`<div class="empty">Bitte Kurs auswählen.</div>`;return;}
    const course=(courses||window.__SP_COURSES||[]).find(c=>(c.id||c.name)===courseName)||{};
    box.innerHTML=renderReleaseEditor(course);
    const select=document.getElementById("releaseCourse");
    if(select)select.value=courseName;
  }
};

function startTeacherDashboard(){
  if(typeof firebase!=="undefined" && firebase.auth){
    firebase.auth().onAuthStateChanged(async user=>{
      if(!user){location.href="login.html";return;}
      try{
        const snap=await db.collection("teachers").doc(user.uid).get();
        const data=snap.exists?snap.data():{};
        if(!snap.exists || data.active===false || !["teacher","lehrer",undefined].includes(data.role)){
          alert("Kein aktiver Lehrerzugang.");
          await firebase.auth().signOut();
          location.href="login.html";
          return;
        }
      }catch(e){console.warn(e)}
      TeacherApp.render();
    });
  }else{
    TeacherApp.render();
  }
}

document.addEventListener("DOMContentLoaded",startTeacherDashboard);
