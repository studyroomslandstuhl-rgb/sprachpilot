const Analytics = {
  num(v){ return Number.isFinite(Number(v)) ? Number(v) : 0; },
  percent(v){ return Math.max(0, Math.min(100, Math.round(this.num(v)))); },
  progressBar(v){
    const p = this.percent(v);
    return `<div><strong>${p}%</strong><div class="progress-line"><div class="progress-fill" style="width:${p}%"></div></div></div>`;
  },
  pill(text, type=""){ return `<span class="pill ${type}">${text}</span>`; },
  studentName(s){ return `${s.vorname||""} ${s.nachname||""}`.trim() || s.id || "Unbekannt"; },
  verbenData(s){ return (s.progressDoc && s.progressDoc.verben) || {}; },
  taskStatus(s){
    const verben = this.verbenData(s);
    const state = verben.state || {};
    const done = state.taskDoneSets || {};
    const active = state.active || verben.activeVerbs || [];
    if(!active.length) return this.pill("noch keine aktiven Verben", "warn");
    return TASK_KEYS.map(key => {
      const arr = done[`done_${key}`] || [];
      const pct = active.length ? Math.round(arr.filter(v=>active.includes(v)).length * 100 / active.length) : 0;
      const type = pct >= 100 ? "ok" : pct > 0 ? "warn" : "";
      return this.pill(`${key}: ${pct}%`, type);
    }).join(" ");
  },
  studentRow(s){
    const verben = this.verbenData(s);
    const progress = this.percent(verben.progress ?? s.verbenFortschritt ?? 0);
    const active = verben.activeVerbs || [];
    const known = verben.known || [];
    const unsure = verben.unsure || [];
    const unknown = verben.unknown || [];
    const stars = verben.stars || 0;
    return `<tr>
      <td><strong>${this.studentName(s)}</strong><div class="small">${s.muttersprache||""}</div></td>
      <td>${this.progressBar(progress)}</td>
      <td>${this.pill(`⭐ ${stars}`)} ${progress>=100?this.pill("100%", "ok"):this.pill("offen", "warn")}</td>
      <td>${this.pill(`aktiv: ${active.length}`)} ${this.pill(`kann: ${known.length}`, "ok")} ${this.pill(`unsicher: ${unsure.length}`, "warn")} ${this.pill(`nicht: ${unknown.length}`, "no")}</td>
      <td>${this.taskStatus(s)}</td>
    </tr>`;
  },
  courseCard(courseName, students, courseData){
    const count = students.length;
    const avg = count ? Math.round(students.reduce((sum,s)=>sum + this.percent((this.verbenData(s).progress ?? s.verbenFortschritt ?? 0)),0)/count) : 0;
    return `<section class="course-card">
      <div class="course-head">
        <div>
          <div class="course-title">${courseName}</div>
          <div class="small">${count} Schüler · Durchschnitt Verben: ${avg}%</div>
        </div>
        <div>${this.progressBar(avg)}</div>
      </div>
      <div class="student-table-wrap">
        <table class="student-table">
          <thead><tr><th>Schüler</th><th>Gesamt</th><th>Sterne / Status</th><th>Verbgruppen</th><th>Aufgabenfortschritt</th></tr></thead>
          <tbody>${students.map(s=>this.studentRow(s)).join("") || `<tr><td colspan="5">Noch keine Schüler in diesem Kurs.</td></tr>`}</tbody>
        </table>
      </div>
    </section>`;
  }
};
