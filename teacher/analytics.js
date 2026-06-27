const Analytics = {
  num(v){return Number.isFinite(Number(v))?Number(v):0},
  percent(v){return Math.max(0,Math.min(100,Math.round(this.num(v))))},
  pill(text,type=""){return `<span class="pill ${type}">${text}</span>`},
  progressBar(v){const p=this.percent(v);return `<div><strong>${p}%</strong><div class="progress-line"><div class="progress-fill" style="width:${p}%"></div></div></div>`},
  studentName(s){return `${s.vorname||""} ${s.nachname||""}`.trim()||s.email||s.id||"Unbekannt"},
  verbenData(s){return (s.progressDoc&&s.progressDoc.verben)||{}},
  taskStatus(s){
    const verben=this.verbenData(s),state=verben.state||{},done=state.taskDoneSets||{},active=state.active||verben.activeVerbs||[];
    if(!active.length)return this.pill("noch keine aktiven Verben","warn");
    return (typeof TASK_KEYS!=="undefined"?TASK_KEYS:[]).map(key=>{
      const arr=done[`done_${key}`]||[];
      const pct=active.length?Math.round(arr.filter(v=>active.includes(v)).length*100/active.length):0;
      return this.pill(`${key}: ${pct}%`,pct>=100?"ok":pct>0?"warn":"");
    }).join(" ");
  },
  studentRow(s){
    const id=s.studentId||s.id;
    const verben=this.verbenData(s);
    const progress=this.percent(verben.progress??s.verbenFortschritt??0);
    const active=verben.activeVerbs||[],known=verben.known||[],unsure=verben.unsure||[],unknown=verben.unknown||[];
    const stars=verben.stars||0;
    return `<tr data-student-row="${id}">
      <td><strong>${this.studentName(s)}</strong><div class="small">${s.email||"keine E-Mail"}<br>${s.muttersprache||""}</div></td>
      <td>${this.progressBar(progress)}</td>
      <td>${this.pill(`⭐ ${stars}`)} ${progress>=100?this.pill("100%","ok"):this.pill("offen","warn")}</td>
      <td>${this.pill(`aktiv: ${active.length}`)} ${this.pill(`kann: ${known.length}`,"ok")} ${this.pill(`unsicher: ${unsure.length}`,"warn")} ${this.pill(`nicht: ${unknown.length}`,"no")}</td>
      <td>${this.taskStatus(s)}</td>
      <td class="row-actions"><button class="secondary" onclick="Students.openEdit('${id}')">Bearbeiten</button><button class="danger" onclick="Students.remove('${id}','${this.studentName(s).replace(/'/g,"\\'")}')">Löschen</button></td>
    </tr>`;
  },
  courseCard(courseName,students,courseData){
    const count=students.length;
    const avg=count?Math.round(students.reduce((sum,s)=>sum+this.percent((this.verbenData(s).progress??s.verbenFortschritt??0)),0)/count):0;
    const title=Courses.displayName(courseData||{id:courseName,name:courseName});
    const code=Courses.code(courseData||{id:courseName,name:courseName}) || courseName;
    const safeCode=String(code).replace(/'/g,"\'");
    return `<section class="course-card">
      <div class="course-head">
        <div>
          <div class="course-title">${title}</div>
          <div class="small"><b>${count} Teilnehmer</b> · Durchschnitt Verben: ${avg}% · Kurscode: ${code}</div>
        </div>
        <div class="course-actions">
          <button onclick="TeacherPreview.open('${safeCode}')">SprachPilot</button>
          <button class="secondary" onclick="TeacherApp.openReleaseEditor('${safeCode}',window.__SP_COURSES||[])">Freigabe</button>
          <button class="danger" onclick="Courses.remove('${safeCode}')">Kurs löschen</button>
        </div>
      </div>
      ${this.progressBar(avg)}
      <div class="student-table-wrap"><table class="student-table">
        <thead><tr><th>Schüler</th><th>Gesamt</th><th>Sterne / Status</th><th>Verbgruppen</th><th>Aufgabenfortschritt</th><th>Aktionen</th></tr></thead>
        <tbody>${students.map(s=>this.studentRow(s)).join("")||`<tr><td colspan="6">Noch keine Schüler in diesem Kurs.</td></tr>`}</tbody>
      </table></div>
    </section>`;
  }
};
