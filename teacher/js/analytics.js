const TASK_KEYS = [
  "karteikarte",
  "memory",
  "bild_verb",
  "verb_bild",
  "schreiben",
  "hoeren_schreiben",
  "hoeren_sprechen",
  "bild_sprechen",
  "satz_puzzle"
];

const TASK_LABELS = {
  karteikarte:"Karteikarten",
  memory:"Memory",
  bild_verb:"Bild → Verb",
  verb_bild:"Verb → Bild",
  schreiben:"Schreiben",
  hoeren_schreiben:"Hören → Schreiben",
  hoeren_sprechen:"Hören → Sprechen",
  bild_sprechen:"Bild → Sprechen",
  satz_puzzle:"Satz-Puzzle"
};

const Analytics = {

  num(v){
    return Number.isFinite(Number(v))
      ? Number(v)
      : 0;
  },

  percent(v){
    return Math.max(
      0,
      Math.min(100, Math.round(this.num(v)))
    );
  },

  progressBar(v){
    const p = this.percent(v);

    return `
      <div>
        <strong>${p}%</strong>
        <div class="progress-line">
          <div class="progress-fill" style="width:${p}%"></div>
        </div>
      </div>
    `;
  },

  pill(text,type=""){
    return `<span class="pill ${type}">${text}</span>`;
  },

  studentName(s){
    return Students.studentName
      ? Students.studentName(s)
      : `${s.vorname||""} ${s.nachname||""}`.trim();
  },

  verbenData(s){
    return (
      s.progressDoc &&
      s.progressDoc.verben
    ) || {};
  },

  verbState(s){
    const verben = this.verbenData(s);
    return verben.state || {};
  },

  taskStatus(s){
    const verben = this.verbenData(s);
    const state = verben.state || {};
    const done = state.taskDoneSets || {};
    const active =
      state.active ||
      verben.activeVerbs ||
      [];

    if(!active.length){
      return this.pill(
        "noch keine aktiven Verben",
        "warn"
      );
    }

    return TASK_KEYS.map(key => {

      const arr =
        done[`done_${key}`] || [];

      const pct =
        active.length
          ? Math.round(
              arr.filter(v =>
                active.includes(v)
              ).length * 100 / active.length
            )
          : 0;

      const type =
        pct >= 100
          ? "ok"
          : pct > 0
            ? "warn"
            : "";

      return this.pill(
        `${TASK_LABELS[key] || key}: ${pct}%`,
        type
      );

    }).join(" ");
  },

  currentGroup(s){
    const verben = this.verbenData(s);
    const state = verben.state || {};
    const active =
      state.active ||
      verben.activeVerbs ||
      [];

    if(!active.length){
      return "keine Gruppe";
    }

    return `${active.length} aktive Verben`;
  },

  studentRow(s){
    const verben = this.verbenData(s);

    const progress =
      this.percent(
        verben.progress ??
        s.verbenFortschritt ??
        0
      );

    const active =
      verben.activeVerbs || [];

    const known =
      verben.known || [];

    const unsure =
      verben.unsure || [];

    const unknown =
      verben.unknown || [];

    const stars =
      verben.stars || 0;

    return `
      <tr>
        <td>
          <strong>${this.studentName(s)}</strong>
          <div class="small">
            ${s.muttersprache || ""}
          </div>
        </td>

        <td>
          ${this.progressBar(progress)}
        </td>

        <td>
          ${
            progress >= 100
              ? this.pill("100%", "ok")
              : this.pill("offen", "warn")
          }
          ${this.pill(`⭐ ${stars}`)}
        </td>

        <td>
          ${this.pill(this.currentGroup(s))}
          ${this.pill(`kann: ${known.length}`, "ok")}
          ${this.pill(`unsicher: ${unsure.length}`, "warn")}
          ${this.pill(`nicht: ${unknown.length}`, "no")}
        </td>

        <td>
          ${this.taskStatus(s)}
        </td>
      </tr>
    `;
  },

  courseCard(courseName,students,courseData){
    const count = students.length;

    const avg =
      count
        ? Math.round(
            students.reduce((sum,s) => {
              const verben =
                this.verbenData(s);

              return sum + this.percent(
                verben.progress ??
                s.verbenFortschritt ??
                0
              );
            },0) / count
          )
        : 0;

    const finished =
      students.filter(s => {
        const verben = this.verbenData(s);

        return this.percent(
          verben.progress ??
          s.verbenFortschritt ??
          0
        ) >= 100;
      }).length;

    return `
      <section class="course-card">
        <div class="course-head">
          <div>
            <div class="course-title">
              ${courseName}
            </div>

            <div class="small">
              ${count} Schüler · Ø Verben: ${avg}% · ${finished} bei 100%
            </div>
          </div>

          <div>
            ${this.progressBar(avg)}
          </div>
        </div>

        <div class="student-table-wrap">
          <table class="student-table">
            <thead>
              <tr>
                <th>Schüler</th>
                <th>Gesamt</th>
                <th>Status</th>
                <th>Verbgruppe</th>
                <th>Aufgabenfortschritt</th>
              </tr>
            </thead>

            <tbody>
              ${
                students.length
                  ? students.map(s =>
                      this.studentRow(s)
                    ).join("")
                  : `<tr>
                      <td colspan="5">
                        Noch keine Schüler in diesem Kurs.
                      </td>
                    </tr>`
              }
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

};
