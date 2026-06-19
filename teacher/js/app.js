const TeacherApp = {
  async render(){
    const app = document.getElementById("app");

    app.innerHTML = `<div class="card">Dashboard wird geladen …</div>`;

    const [courses, studentsRaw, progressRows] = await Promise.all([
      Courses.list(),
      Students.list(),
      Students.progressList()
    ]);

    const students = Students.mergeStudentProgress(studentsRaw, progressRows);
    const byCourse = Students.byCourse(students);

    const courseNames = Array.from(new Set([
      ...courses.map(c => c.id || c.name),
      ...Object.keys(byCourse)
    ])).sort();

    const totalStudents = students.length;

    const avgProgress = totalStudents
      ? Math.round(
          students.reduce((sum, s) => {
            const verben = Analytics.verbenData(s);
            return sum + Analytics.percent(
              verben.progress ?? s.verbenFortschritt ?? 0
            );
          }, 0) / totalStudents
        )
      : 0;

    const finished = students.filter(s => {
      const verben = Analytics.verbenData(s);
      return Analytics.percent(
        verben.progress ?? s.verbenFortschritt ?? 0
      ) >= 100;
    }).length;

    app.innerHTML = `
      <section class="card">
        <h2>Gesamtübersicht</h2>

        <div class="overview-stats">
          <div class="stat">
            <div class="num">${courseNames.length}</div>
            <div>Kurse</div>
          </div>

          <div class="stat">
            <div class="num">${totalStudents}</div>
            <div>Schüler</div>
          </div>

          <div class="stat">
            <div class="num">${avgProgress}%</div>
            <div>Ø Verben</div>
          </div>

          <div class="stat">
            <div class="num">${finished}</div>
            <div>bei 100%</div>
          </div>
        </div>
      </section>

      <section class="card">
        <h2>Kurs anlegen</h2>

        <div class="toolbar">
          <input id="courseName" placeholder="z. B. GLK-68" />
          <button onclick="Courses.create(document.getElementById('courseName').value)">
            Kurs anlegen
          </button>
        </div>
      </section>

      <section class="card">
        <h2>Kurs-Freigaben</h2>

        <div class="toolbar">
          <select id="releaseCourse">
            <option value="">Kurs auswählen</option>
            ${courseNames.map(c =>
              `<option value="${c}">${c}</option>`
            ).join("")}
          </select>
        </div>

        <div id="releaseEditor" class="release-editor">
          <div class="empty">Bitte Kurs auswählen.</div>
        </div>
      </section>

      <section class="card">
        <h2>Alle Kurse und Fortschritte</h2>

        ${
          courseNames.length
            ? courseNames.map(name =>
                Analytics.courseCard(
                  name,
                  byCourse[name] || [],
                  courses.find(c => (c.id || c.name) === name)
                )
              ).join("")
            : `<div class="empty">Noch keine Kurse oder Schülerdaten gefunden.</div>`
        }
      </section>
    `;

    const select = document.getElementById("releaseCourse");

    if(select){
      select.addEventListener("change", e => {
        TeacherApp.openReleaseEditor(e.target.value, courses);
      });
    }
  },

  async openReleaseEditor(courseName, courses){
    const box = document.getElementById("releaseEditor");

    if(!courseName){
      box.innerHTML = `<div class="empty">Bitte Kurs auswählen.</div>`;
      return;
    }

    const course =
      courses.find(c => (c.id || c.name) === courseName) || {};

    const enabledModules = course.enabledModules || {};
    const enabledLessons = course.enabledLessons || {};
    const enabledTasks = course.enabledTasks || {};
    const enabledWords = course.enabledWords || {};

    box.innerHTML = `
      <div class="release-section">
        <h3>Module</h3>

        ${MODULES.map(m => `
          <label class="check-row">
            <input
              type="checkbox"
              ${enabledModules[m] ? "checked" : ""}
              onchange="Releases.toggleModule('${courseName}','${m}',this.checked)"
            >
            <span>${m}</span>
          </label>
        `).join("")}
      </div>

      <div class="release-section">
        <h3>Lektionen</h3>

        ${LESSONS.map(l => `
          <label class="check-row">
            <input
              type="checkbox"
              ${enabledLessons[l] ? "checked" : ""}
              onchange="Releases.toggleLesson('${courseName}','${l}',this.checked)"
            >
            <span>${l}</span>
          </label>
        `).join("")}
      </div>

      <div class="release-section">
        <h3>Aufgaben</h3>

        ${DEFAULT_TASKS.map(t => `
          <label class="check-row">
            <input
              type="checkbox"
              ${enabledTasks[t] ? "checked" : ""}
              onchange="Releases.toggleTask('${courseName}','${t}',this.checked)"
            >
            <span>${t}</span>
          </label>
        `).join("")}
      </div>

      <div class="release-section">
        <h3>Wörter / Verben</h3>

        <p class="small">
          Hier werden einzelne Verben pro Kurs freigegeben.
        </p>

        ${(typeof VERB_WORDS !== "undefined" ? VERB_WORDS : []).map(v => `
          <label class="check-row">
            <input
              type="checkbox"
              ${enabledWords[v] ? "checked" : ""}
              onchange="Releases.toggleWord('${courseName}','${v}',this.checked)"
            >
            <span>${v}</span>
          </label>
        `).join("") || `<div class="empty">Noch keine VERB_WORDS in data.js gefunden.</div>`}
      </div>
    `;
  }
};

firebase.auth().onAuthStateChanged(async user => {

  if(!user){
    location.href = "login.html";
    return;
  }

  try{

    const teacherDoc = await db
      .collection("teachers")
      .doc(user.uid)
      .get();

    if(!teacherDoc.exists){
      await auth.signOut();
      location.href = "login.html";
      return;
    }

    const teacher = teacherDoc.data();

    if(
      teacher.role !== "teacher" ||
      teacher.active !== true
    ){
      await auth.signOut();
      location.href = "login.html";
      return;
    }

    TeacherApp.render();

  }catch(err){

    console.error(err);
    location.href = "login.html";

  }

});
