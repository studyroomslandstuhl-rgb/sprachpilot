const Analytics = {
  num(v){return Number.isFinite(Number(v))?Number(v):0},
  percent(v){return Math.max(0,Math.min(100,Math.round(this.num(v))))},
  safe(v){return TeacherEnv?.safe?.(v)||String(v||"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]))},
  pill(text,type=""){return `<span class="pill ${type}">${this.safe(text)}</span>`},
  progressBar(v,label=""){const p=this.percent(v);return `<div class="progress-box"><div class="progress-top"><strong>${p}%</strong>${label?`<span>${this.safe(label)}</span>`:""}</div><div class="progress-line"><div class="progress-fill" style="width:${p}%"></div></div></div>`},
  studentName(s){return `${s.vorname||s.firstName||""} ${s.nachname||s.lastName||""}`.trim()||s.email||s.id||"Unbekannt"},
  progressDoc(s){return s.progressDoc||{}},
  verbenData(s){const p=this.progressDoc(s);const v=p.verben||{};return v["verben-a1"]||v.state?{...v,...(v["verben-a1"]||{})}:v},
  totals(s){const p=this.progressDoc(s);return p.totals||{}},
  points(s){const p=this.progressDoc(s);return this.num(p.lifetimePoints||p.pointsTotal||p.punkteGesamt||this.totals(s).points||0)},
  lastActiveRaw(s){const p=this.progressDoc(s);return p.lastActiveAt||p.updatedAt||this.totals(s).updatedAt||s.lastActiveAt||s.updatedAt||s.lastLogin||""},
  formatDate(v){
    if(!v)return "noch keine Aktivität";
    try{
      let d=v;
      if(v&&typeof v.toDate==="function")d=v.toDate();
      else if(v&&v.seconds)d=new Date(v.seconds*1000);
      else d=new Date(v);
      if(Number.isNaN(d.getTime()))return "noch keine Aktivität";
      return d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit"})+" · "+d.toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"});
    }catch(e){return "noch keine Aktivität"}
  },
  pageLabel(path){
    const p=String(path||"");
    if(!p)return "kein Bereich gespeichert";
    if(p.includes("verben-A1"))return "Verben A1";
    if(p.includes("fragen-A1")||p.includes("fragen/"))return "Fragen A1";
    if(p.includes("wortschatz")){
      const m=p.match(/A(\d)-Lektion-(\d+)(?:\/(Thema-\d+))?/);
      if(m)return `Wortschatz A${m[1]} · Lektion ${m[2]}${m[3]?" · "+m[3].replace("Thema-","Thema "):""}`;
      return "Wortschatz";
    }
    if(p.includes("student-dashboard"))return "Schüler-Dashboard";
    return p.split("/").filter(Boolean).slice(-2).join(" / ")||"Startseite";
  },
  lastPlace(s){return this.pageLabel(this.progressDoc(s).lastPage||s.lastPage||"")},
  verbStats(s){
    const v=this.verbenData(s),state=v.state||{};
    const learned=v.learned||v.learnedVerbs||state.learned||state.learnedVerbs||[];
    const active=v.active||v.activeVerbs||state.active||state.activeVerbs||[];
    const known=v.known||state.known||[];
    const unsure=v.unsure||state.unsure||[];
    const unknown=v.unknown||state.unknown||[];
    const progress=this.percent(v.progress??v.progressPercent??s.verbenFortschritt??0);
    return {learned,active,known,unsure,unknown,progress};
  },
  taskStatus(s){
    const st=this.verbStats(s);
    if(!st.active.length&&!st.learned.length)return this.pill("noch nicht gestartet","warn");
    return `${this.pill(`${st.learned.length} gelernt`,st.learned.length?"ok":"")} ${this.pill(`${st.active.length} aktiv`)} ${this.pill(`${st.known.length} sicher`,"ok")} ${this.pill(`${st.unsure.length} unsicher`,"warn")} ${this.pill(`${st.unknown.length} nicht sicher`,"no")}`;
  },
  studentStatus(s){
    const p=this.progressDoc(s);
    if(!p||!Object.keys(p).length)return this.pill("kein Fortschritt", "warn");
    const pts=this.points(s);
    if(pts>0)return this.pill("aktiv", "ok");
    return this.pill("angefangen", "warn");
  },
  studentRow(s){
    const id=s.studentId||s.id;
    const st=this.verbStats(s);
    const stars=this.num(this.verbenData(s).stars||this.totals(s).stars||0);
    return `<tr data-student-row="${this.safe(id)}">
      <td><strong>${this.safe(this.studentName(s))}</strong><div class="small">${this.safe(s.email||"keine E-Mail")}<br>${this.safe(s.muttersprache||"")}</div></td>
      <td>${this.studentStatus(s)}<div class="small">${this.safe(s.kurs||s.kursnummer||s.courseCode||"ohne Kurs")}</div></td>
      <td><strong>${this.points(s)}</strong><div class="small">Punkte</div>${stars?`<div>${this.pill(`⭐ ${stars}`)}</div>`:""}</td>
      <td>${this.progressBar(st.progress,"Verben")}</td>
      <td>${this.taskStatus(s)}</td>
      <td><strong>${this.safe(this.lastPlace(s))}</strong><div class="small">${this.safe(this.formatDate(this.lastActiveRaw(s)))}</div></td>
      <td class="row-actions"><button class="secondary" onclick="Students.openEdit('${String(id).replace(/'/g,"\\'")}')">Schüler bearbeiten</button><button class="danger" onclick="Students.remove('${String(id).replace(/'/g,"\\'")}','${this.studentName(s).replace(/'/g,"\\'")}')">Löschen</button></td>
    </tr>`;
  },
  releaseSummary(course){
    const enabledLessons=course?.enabledLessons||{};
    const lessonCount=Object.values(enabledLessons).filter(v=>v===true).length;
    const releases=course?.releases||{};
    const w=(releases.wortschatz||releases.Wortschatz||{}).lessons||{};
    const lessonCount2=Object.values(w).filter(x=>x&&x.enabled===true).length;
    const words=course?.enabledWords||{};
    const verbCount=Object.keys(words).filter(k=>words[k]===true&&(k.includes("verben")||!k.includes("/"))).length;
    const parts=[];
    parts.push(this.pill(`Wortschatz: ${Math.max(lessonCount,lessonCount2)} Lektion(en)`,Math.max(lessonCount,lessonCount2)?"ok":"warn"));
    parts.push(this.pill(`Verben: ${verbCount} Wort/Wörter`,verbCount?"ok":"warn"));
    return parts.join(" ");
  },
  courseCard(courseName,students,courseData){
    const count=students.length;
    const avg=count?Math.round(students.reduce((sum,s)=>sum+this.verbStats(s).progress,0)/count):0;
    const points=students.reduce((sum,s)=>sum+this.points(s),0);
    const active=students.filter(s=>Object.keys(this.progressDoc(s)||{}).length).length;
    const course=courseData||{id:courseName,name:courseName};
    const title=Courses.displayName(course);
    const code=Courses.code(course) || courseName;
    const docId=Courses.docId(course) || code;
    const safeCode=String(code).replace(/'/g,"\\'");
    const safeDocId=String(docId).replace(/'/g,"\\'");
    const unassigned=course.__unassigned;
    return `<section class="course-card ${unassigned ? "course-unassigned" : ""}">
      <div class="course-head friendly-course-head">
        <div>
          <div class="course-kicker">Kurs</div>
          <div class="course-title">${this.safe(title)}</div>
          <div class="small">Kurscode: <b>${this.safe(code)}</b>${unassigned ? " · Lehrer-Zuordnung fehlt" : ""}</div>
          <div class="course-release-summary">${this.releaseSummary(course)}</div>
        </div>
        <div class="course-actions">
          ${unassigned ? `<button onclick="Courses.assignToMe('${safeDocId}')">Mir zuweisen</button>` : ""}
          <button onclick="TeacherPreview.open('${safeCode}')">Als Schüler öffnen</button>
          <button class="secondary" onclick="TeacherApp.openReleaseEditor('${safeCode}',window.__SP_COURSES||[]);document.getElementById('releaseCourse').value='${safeCode}';document.getElementById('releaseEditor')?.scrollIntoView({behavior:'smooth',block:'start'});">Freigaben bearbeiten</button>
          <button class="danger" onclick="Courses.remove('${safeDocId}')">Kurs löschen</button>
        </div>
      </div>
      ${unassigned ? `<div class="debug-box small">Dieser Kurs hat keine Lehrer-Zuordnung. Wenn das dein Kurs ist, klicke einmal auf <b>Mir zuweisen</b>.</div>` : ""}
      <div class="course-mini-stats">
        <div><b>${count}</b><span>Schüler</span></div>
        <div><b>${active}</b><span>aktiv</span></div>
        <div><b>${points}</b><span>Punkte gesamt</span></div>
        <div><b>${avg}%</b><span>Ø Verben</span></div>
      </div>
      ${this.progressBar(avg,"Durchschnitt Verben")}
      <details class="teacher-course-details" open><summary>Schüler in diesem Kurs anzeigen</summary>
        <div class="student-table-wrap"><table class="student-table friendly-table">
          <thead><tr><th>Schüler</th><th>Status</th><th>Punkte</th><th>Fortschritt</th><th>Verben</th><th>Zuletzt</th><th>Aktionen</th></tr></thead>
          <tbody>${students.map(s=>this.studentRow(s)).join("")||`<tr><td colspan="7">Noch keine Schüler in diesem Kurs.</td></tr>`}</tbody>
        </table></div>
      </details>
    </section>`;
  }
};