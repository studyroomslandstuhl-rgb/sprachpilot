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
    const courseNames = Array.from(new Set([...courses.map(c=>c.id||c.name), ...Object.keys(byCourse)])).sort();
    const totalStudents = students.length;
    const avgProgress = totalStudents ? Math.round(students.reduce((sum,s)=>sum + Analytics.percent((Analytics.verbenData(s).progress ?? s.verbenFortschritt ?? 0)),0)/totalStudents) : 0;
    const finished = students.filter(s => Analytics.percent((Analytics.verbenData(s).progress ?? s.verbenFortschritt ?? 0)) >= 100).length;

    app.innerHTML = `
      <section class="card">
        <h2>Gesamtübersicht</h2>
        <div class="overview-stats">
          <div class="stat"><div class="num">${courseNames.length}</div><div>Kurse</div></div>
          <div class="stat"><div class="num">${totalStudents}</div><div>Schüler</div></div>
          <div class="stat"><div class="num">${avgProgress}%</div><div>Ø Verben</div></div>
          <div class="stat"><div class="num">${finished}</div><div>bei 100%</div></div>
        </div>
      </section>

      <section class="card">
        <h2>Kurs anlegen</h2>
        <div class="toolbar">
          <input id="courseName" placeholder="z. B. GLK-68" />
          <button onclick="Courses.create(document.getElementById('courseName').value)">Kurs anlegen</button>
        </div>
      </section>

      <section class="card">
        <h2>Freigaben – Entwurf</h2>
        <p class="small">Die echte Umschaltung pro Kurs verbinden wir später. Hier ist schon die Struktur vorbereitet.</p>
        <div class="release-grid">
          <div class="release-box"><strong>Module</strong><br>${MODULES.map(m=>Analytics.pill(m)).join(" ")}</div>
          <div class="release-box"><strong>Lektionen</strong><br>${LESSONS.map(l=>Analytics.pill(l)).join(" ")}</div>
          <div class="release-box"><strong>Aufgaben</strong><br>${DEFAULT_TASKS.map(t=>Analytics.pill(t)).join(" ")}</div>
          <div class="release-box"><strong>Wörter</strong><br><span class="small">Einzelne Wörter wie zeigen, reden, sagen werden später pro Kurs aktiviert/deaktiviert.</span></div>
        </div>
      </section>

      <section class="card">
        <h2>Alle Kurse und Fortschritte</h2>
        ${courseNames.length ? courseNames.map(name => Analytics.courseCard(name, byCourse[name] || [], courses.find(c=>(c.id||c.name)===name))).join("") : `<div class="empty">Noch keine Kurse oder Schülerdaten gefunden.</div>`}
      </section>
    `;
  }
};

document.addEventListener("DOMContentLoaded", () => TeacherApp.render());
