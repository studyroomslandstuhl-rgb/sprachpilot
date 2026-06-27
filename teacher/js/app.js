const TeacherApp = {
  state:{
    teacher:null,
    courses:[],
    students:[],
    progress:{},
    pending:[]
  },

  techProgressKeys:new Set(["state","progress","stars","activeVerbs","learnedVerbs","known","unknown","unsure","updatedAt","lastActive","lastLogin","totals","current","profile","metadata"]),
  isTopicRecord(key,value){return !this.techProgressKeys.has(key) && value && typeof value==="object" && !Array.isArray(value) && !!(value.tasks || value.exam || value.current || value.lifetime || value.progressPercent || value.title || value.moduleTitle)},
  listLen(x){return Array.isArray(x)?x.length:(x&&typeof x==="object"?Object.keys(x).length:0)},
  verbStats(mod={}){const learned=this.listLen(mod.learnedVerbs||mod.known||mod.state?.learnedVerbs||mod.state?.known||[]);const active=this.listLen(mod.activeVerbs||mod.state?.activeVerbs||mod.state?.active||[]);const known=this.listLen(mod.known||mod.state?.known||[]);const unsure=this.listLen(mod.unsure||mod.state?.unsure||[]);const unknown=this.listLen(mod.unknown||mod.state?.unknown||[]);return{learned,active,known,unsure,unknown,contentsDone:Math.floor(learned/20),packagePercent:Math.min(100,Math.round(((learned%20)||(learned?20:0))/20*100))}},
  realStudentName(s){return [s.vorname||s.firstName||s.name, s.nachname||s.lastName].filter(Boolean).join(" ").trim() || s.displayName || s.email || ""},
  isRealStudent(s){return !!this.realStudentName(s)},

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
      "Thema 3":["karteikarten.html","hoeren.html","farbe-nennen.html","moebel-farbe.html","gegenteil-memory.html","gegenteil-zuordnen.html","satz-ergaenzen.html","farbenbild.html","pruefung.html"],
      "Thema 4":["karteikarten.html","hoeren.html","schreibe-mit-artikel.html","paare-finden.html","anzeige-lesen.html","passt-die-wohnung.html","pruefung.html"],
      "Thema 5":["karteikarten.html","hoeren.html","dialog-verstehen.html","satzbausteine.html","rollenkarte.html","telefon-dialog.html","pruefung.html"]
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
    const role=String(teacher.role || teacher.rolle || teacher.typ || teacher.type || "teacher").trim().toLowerCase();
    const roleOk = !role || ["owner","admin","teacher","lehrer","lehrerin","lehrkraft","dozent","dozentin","kursleitung"].includes(role) || /lehr|teacher|dozent|kursleit|admin|owner/.test(role) || teacher.owner===true || teacher.isTeacher===true || teacher.lehrer===true || teacher.lehrkraft===true;
    const explicitStudent = /^(student|schueler|schüler|learner|teilnehmer|teilnehmerin|tn)$/.test(role);
    if(teacher.approved===false || teacher.active===false || explicitStudent || !roleOk){
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
    return this.state.students.filter(s=>courseIds.includes(String(s.kurs||s.courseCode||s.kursnummer||"")) && this.isRealStudent(s));
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
    const students=this.state.students.filter(s=>String(s.kurs||s.courseCode||s.kursnummer||"")===courseCode && this.isRealStudent(s));

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

  progressForStudent(s){
    return this.state.progress[s.studentId] || this.state.progress[s.docId] || this.state.progress[s.id] || {};
  },

  progressTotals(p){
    return p?.totals || {
      points:0,
      stars:0,
      progressPercent:this.percent(p?.wortschatz?.progress || p?.verben?.progress || p?.fragen?.progress || p?.grammatik?.progress || 0),
      completedTasks:0,
      completedExams:0
    };
  },

  formatTime(v){
    if(!v) return "nie";
    try{
      const d = v.toDate ? v.toDate() : new Date(v.seconds ? v.seconds*1000 : v);
      if(isNaN(d.getTime())) return "nie";
      return d.toLocaleString("de-DE", {day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
    }catch(e){return "nie"}
  },

  studentAccordion(s){
    const p=this.progressForStudent(s);
    const totals=this.progressTotals(p);
    const last=this.formatTime(p.lastActive || p.updatedAt || s.lastLogin);
    return `<details class="student-accordion">
      <summary>
        <span><b>${this.safe(this.realStudentName(s))}</b><small>${this.safe(s.email||"")} · ${this.safe(s.muttersprache||"")} · zuletzt aktiv: ${this.safe(last)}</small></span>
        <span class="student-summary-metrics">
          <span class="pill ok">${this.percent(totals.progressPercent)}%</span>
          <span class="pill">⭐ ${Number(totals.stars||0)}</span>
          <span class="pill">${Number(totals.points||0)} Punkte</span>
        </span>
      </summary>
      <div class="inside compact-progress">
        <div class="progress-overview">
          <div class="metric"><b>${this.percent(totals.progressPercent)}%</b><span>Gesamtfortschritt</span></div>
          <div class="metric"><b>${Number(totals.points||0)}</b><span>Punkte</span></div>
          <div class="metric"><b>${Number(totals.stars||0)}</b><span>Sterne</span></div>
          <div class="metric"><b>${Number(totals.completedTasks||0)}</b><span>Aufgaben fertig</span></div>
          <div class="metric"><b>${Number(totals.completedExams||0)}</b><span>Prüfungen</span></div>
          <div class="metric"><b>${this.safe(last)}</b><span>letzte Aktivität</span></div>
        </div>
        ${this.studentModule("Fragen", s, p)}
        ${this.studentModule("Wortschatz", s, p)}
        ${this.studentModule("Verben", s, p)}
        ${this.studentModule("Grammatik", s, p)}
      </div>
    </details>`;
  },

  studentModule(name,s,p){
    const key=name.toLowerCase();
    if(key==="wortschatz") return this.moduleAccordion(name,"wortschatz",p,s.wortschatzFortschritt);
    if(key==="fragen") return this.moduleAccordion(name,"fragen",p,s.fragenFortschritt);
    if(key==="verben") return this.moduleAccordion(name,"verben",p,s.verbenFortschritt);
    return this.moduleAccordion(name,"grammatik",p,s.grammatikFortschritt);
  },

  moduleAccordion(label,key,p,fallback){
    const mod=p?.[key] || {};
    if(key==="verben") return this.verbenModuleAccordion(label,mod,fallback);
    const topics=Object.entries(mod).filter(([k,v])=>this.isTopicRecord(k,v));
    const percent=this.modulePercent(p,key,fallback);
    const topicHtml=topics.length ? topics.map(([topicId,topic])=>this.topicDetail(topicId,topic)).join("") : this.legacyModuleDetail(key,p,mod);
    return `<details class="tiny-accordion module-detail">
      <summary><span>${this.safe(label)}</span><span class="pill ${percent>=100?'ok':percent>0?'warn':''}">${percent}%</span></summary>
      <div class="inside">${topicHtml}</div>
    </details>`;
  },

  verbenModuleAccordion(label,mod={},fallback=0){
    const v=this.verbStats(mod);
    const packagePercent=v.packagePercent;
    return `<details class="tiny-accordion module-detail">
      <summary><span>${this.safe(label)}</span><span class="pill">${v.learned} Verben gelernt</span></summary>
      <div class="inside">
        <div class="progress-line"><div class="progress-fill" style="width:${packagePercent}%"></div></div>
        <div class="topic-metrics">
          <span class="pill">${v.learned} Verben gelernt</span>
          <span class="pill">${v.contentsDone} Inhalt${v.contentsDone===1?"":"e"} fertig</span>
          <span class="pill">1 Inhalt = 20 Verben</span>
        </div>
        <div class="task-grid compact-task-grid">
          <div class="task-pill done"><span>Sicher/gelernt</span><b>${v.known||v.learned}</b></div>
          <div class="task-pill"><span>Aktiv</span><b>${v.active}</b></div>
          <div class="task-pill"><span>Unsicher</span><b>${v.unsure}</b></div>
          <div class="task-pill notdone"><span>Unbekannt</span><b>${v.unknown}</b></div>
        </div>
      </div>
    </details>`;
  },

  legacyModuleDetail(key,p,mod){
    if(key==="wortschatz") return this.wortschatzLegacyDetail(p);
    if(key==="verben") return this.verbenModuleAccordion("Verben",mod,0);
    return `<p class="small">Noch keine Detaildaten gespeichert.</p>`;
  },

  topicDetail(topicId,topic){
    const pct=this.percent(topic.progressPercent || topic.current?.percent || 0);
    const exam=topic.exam || {};
    const lifetime=topic.lifetime || {};
    const tasks=topic.tasks || {};
    const taskRows=Object.entries(tasks).length ? Object.entries(tasks).map(([taskKey,task])=>this.taskDetail(taskKey,task)).join("") : `<p class="small">Noch keine Aufgaben gespeichert.</p>`;
    return `<details class="tiny-accordion topic-detail">
      <summary>
        <span>${this.safe(topic.title || topicId)}</span>
        <span class="student-summary-metrics"><span class="pill ${pct>=100?'ok':pct>0?'warn':''}">${pct}%</span>${exam.attempted?`<span class="pill exam">Prüfung ${this.percent(exam.bestPercent||exam.lastPercent)}% · ⭐ ${Number(exam.stars||0)}</span>`:""}<span class="pill">${Number(lifetime.points||0)} Punkte</span></span>
      </summary>
      <div class="inside">
        <div class="progress-line"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="topic-metrics">
          <span class="pill">Aufgaben: ${Number(topic.completedTasks||0)}/${Number(topic.totalTasks||Object.keys(tasks).length||0)}</span>
          <span class="pill">Punkte: ${Number(lifetime.points||0)}</span>
          <span class="pill">Resets: ${Number(lifetime.resets||0)}</span>
          ${exam.attempted?`<span class="pill exam">Versuche: ${Number(exam.attempts||0)}</span>`:""}
        </div>
        <details class="tiny-accordion">
          <summary>Aufgaben genau anzeigen</summary>
          <div class="task-grid compact-task-grid">${taskRows}</div>
        </details>
        ${exam.attempted?this.examDetail(exam):""}
      </div>
    </details>`;
  },

  taskDetail(taskKey,task){
    const pct=this.percent(task.percent || 0);
    const wrong=(task.wrongItems||[]).slice(-6);
    return `<div class="task-pill ${pct>=100?'done':pct>0?'':'notdone'}">
      <span>${this.safe(task.title || taskKey)}${wrong.length?`<small> Fehler: ${wrong.map(x=>this.safe(x)).join(', ')}</small>`:""}</span>
      <b>${pct}%</b>
    </div>`;
  },

  examDetail(exam){
    const attempts=(exam.attemptsLog||[]).slice(-5).reverse().map((a,i)=>`<div class="task-pill done"><span>Versuch ${Number(exam.attempts||0)-i}</span><b>${this.percent(a.percent)}% · ${Number(a.score||0)}/${Number(a.maxScore||200)}</b></div>`).join("");
    return `<details class="tiny-accordion"><summary>Prüfungsdetails</summary><div class="task-grid compact-task-grid">${attempts||'<p class="small">Keine Versuchsliste gespeichert.</p>'}</div></details>`;
  },

  modulePercent(p,key,fallback){
    const mod=p?.[key] || {};
    const topics=Object.entries(mod).filter(([k,v])=>this.isTopicRecord(k,v));
    if(topics.length){
      return this.percent(topics.reduce((sum,[_,topic])=>sum+this.percent(topic.progressPercent || topic.current?.percent || 0),0)/topics.length);
    }
    const val=fallback ?? mod.progress ?? mod.percent ?? 0;
    return this.percent(val);
  },

  wortschatzLegacyDetail(progress){
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
    const enabledThemes=c.enabledThemes||{};
    const enabledTasks=c.enabledTasks||{};
    const enabledWords=c.enabledWords||{};

    return `<div class="release-panel">
      <h3>Freigaben: ${this.safe(c.courseName||c.name||c.id)}</h3>
      <p class="small">Du kannst hier Module, Lektionen, einzelne Themen, Aufgaben und Prüfungen für diesen Kurs freigeben oder sperren.</p>

      <details class="tiny-accordion">
        <summary>Module</summary>
        <div class="checks">
          ${this.modules.map(m=>this.check(`module-${m.key}`, enabledModules[m.key]!==false, `TeacherApp.toggleModule('${this.esc(c.id)}','${this.esc(m.key)}')`, m.title)).join("")}
        </div>
      </details>

      <details class="tiny-accordion">
        <summary>Wortschatz · Lektionen, Themen und Aufgaben</summary>
        <div class="inside">
          ${Object.entries(this.wortschatzTasks).map(([lesson,themes])=>this.releaseLessonBlock(c,lesson,themes,enabledLessons,enabledThemes,enabledTasks)).join("")}
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

  releaseLessonBlock(c,lesson,themes,enabledLessons,enabledThemes,enabledTasks){
    const lessonKey=this.lessonKey(lesson);
    const legacyLessonKey=`Wortschatz/${lesson}`;
    const lessonOn=enabledLessons[lessonKey]!==false && enabledLessons[legacyLessonKey]!==false;
    return `<details class="tiny-accordion release-lesson">
      <summary>
        <span>${this.safe(lesson)}</span>
        <span class="pill ${lessonOn?'ok':''}">${lessonOn?'freigegeben':'gesperrt'}</span>
      </summary>
      <div class="inside">
        <div class="release-main-check">
          ${this.check(lessonKey,lessonOn,`TeacherApp.toggleLesson('${this.esc(c.id)}','${this.esc(lesson)}')`,`ganze Lektion freigeben`)}
        </div>
        ${Object.entries(themes).map(([theme,tasks])=>this.releaseThemeBlock(c,lesson,theme,tasks,enabledThemes,enabledTasks)).join("")}
      </div>
    </details>`;
  },

  releaseThemeBlock(c,lesson,theme,tasks,enabledThemes,enabledTasks){
    const themeKey=this.themeKey(lesson,theme);
    const legacyThemeKey=`Wortschatz/${lesson}/${theme}`;
    const themeOn=enabledThemes[themeKey]!==false && enabledThemes[legacyThemeKey]!==false;
    return `<details class="tiny-accordion release-theme">
      <summary>
        <span>${this.safe(theme)}</span>
        <span class="pill ${themeOn?'ok':''}">${themeOn?'freigegeben':'gesperrt'}</span>
      </summary>
      <div class="inside">
        <div class="release-main-check">
          ${this.check(themeKey,themeOn,`TeacherApp.toggleTheme('${this.esc(c.id)}','${this.esc(lesson)}','${this.esc(theme)}')`,`ganzes Thema freigeben`)}
        </div>
        <div class="task-grid">
          ${tasks.map(task=>{
            const key=`Wortschatz/${lesson}/${theme}/${task}`;
            const on=enabledTasks[key]!==false;
            return this.check(key,on,`TeacherApp.toggleTask('${this.esc(c.id)}','${this.esc(key)}')`,task.replace(".html",""));
          }).join("")}
        </div>
      </div>
    </details>`;
  },

  lessonKey(lesson){
    if(String(lesson)==="A1 Lektion 4") return "wortschatz/A1-Lektion-4";
    return `Wortschatz/${lesson}`;
  },

  themeKey(lesson,theme){
    if(String(lesson)==="A1 Lektion 4"){
      const themeId=String(theme||"").replace(/\s+/g,"-");
      return `wortschatz/A1-Lektion-4/${themeId}`;
    }
    return `Wortschatz/${lesson}/${theme}`;
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
      enabledThemes:{},
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
    const enabledModules={...(course?.enabledModules||{})};
    const current=enabledModules[moduleName]!==false;
    enabledModules[moduleName]=!current;

    await db.collection("courses").doc(courseId).set({
      enabledModules,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});

    await this.loadData();
    const fresh=this.state.courses.find(c=>c.id===courseId);
    this.showReleasePanel(String(fresh.courseCode||fresh.id));
  },

  async toggleLesson(courseId,lesson){
    const course=this.state.courses.find(c=>c.id===courseId);
    const enabledLessons={...(course?.enabledLessons||{})};
    const key=this.lessonKey(lesson);
    const legacyKey=`Wortschatz/${lesson}`;
    const current=enabledLessons[key]!==false && enabledLessons[legacyKey]!==false;
    enabledLessons[key]=!current;
    enabledLessons[legacyKey]=!current;

    await db.collection("courses").doc(courseId).set({
      enabledLessons,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});

    await this.loadData();
    const fresh=this.state.courses.find(c=>c.id===courseId);
    this.showReleasePanel(String(fresh.courseCode||fresh.id));
  },

  async toggleTheme(courseId,lesson,theme){
    const course=this.state.courses.find(c=>c.id===courseId);
    const enabledThemes={...(course?.enabledThemes||{})};
    const key=this.themeKey(lesson,theme);
    const legacyKey=`Wortschatz/${lesson}/${theme}`;
    const current=enabledThemes[key]!==false && enabledThemes[legacyKey]!==false;
    enabledThemes[key]=!current;
    enabledThemes[legacyKey]=!current;

    await db.collection("courses").doc(courseId).set({
      enabledThemes,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});

    await this.loadData();
    const fresh=this.state.courses.find(c=>c.id===courseId);
    this.showReleasePanel(String(fresh.courseCode||fresh.id));
  },

  async toggleTask(courseId,key){
    const course=this.state.courses.find(c=>c.id===courseId);
    const enabledTasks={...(course?.enabledTasks||{})};
    const current=enabledTasks[key]!==false;
    enabledTasks[key]=!current;

    await db.collection("courses").doc(courseId).set({
      enabledTasks,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});

    await this.loadData();
    const fresh=this.state.courses.find(c=>c.id===courseId);
    this.showReleasePanel(String(fresh.courseCode||fresh.id));
  },

  async toggleWord(courseId,key){
    const course=this.state.courses.find(c=>c.id===courseId);
    const enabledWords={...(course?.enabledWords||{})};
    const current=enabledWords[key]!==false;
    enabledWords[key]=!current;

    await db.collection("courses").doc(courseId).set({
      enabledWords,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});

    await this.loadData();
    const fresh=this.state.courses.find(c=>c.id===courseId);
    this.showReleasePanel(String(fresh.courseCode||fresh.id));
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
