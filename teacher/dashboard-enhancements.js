(function(){
  function ready(){return typeof Analytics!=="undefined" && typeof Students!=="undefined" && typeof TeacherEnv!=="undefined"}
  function safe(v){return TeacherEnv.safe ? TeacherEnv.safe(v) : String(v||"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[m]))}
  function num(v){return Number.isFinite(Number(v))?Number(v):0}
  function percent(v){return Math.max(0,Math.min(100,Math.round(num(v))))}
  function arr(x){return Array.isArray(x)?x:[]}
  function domId(id){return String(id||"").replace(/[^a-zA-Z0-9_-]/g,"_")}
  function jsString(v){return String(v||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")}
  function norm(v){return String(v||"").trim().toLowerCase()}
  function uniq(a){return Array.from(new Set((a||[]).filter(Boolean)))}
  function tsValue(v){
    if(!v)return null;
    if(v.toDate && typeof v.toDate==="function")return v.toDate();
    if(v.seconds)return new Date(v.seconds*1000);
    if(typeof v==="string")return new Date(v);
    if(v instanceof Date)return v;
    return null;
  }
  function formatDate(v){const d=tsValue(v);if(!d||Number.isNaN(d.getTime()))return "noch nicht sichtbar";return d.toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit"})}
  function topicRecords(progressDoc={}){
    const out=[];
    ["fragen","wortschatz","verben","grammatik"].forEach(moduleKey=>{
      const mod=progressDoc[moduleKey]||{};
      Object.entries(mod).forEach(([key,topic])=>{
        if(!topic||typeof topic!=="object"||Array.isArray(topic))return;
        if(!(topic.tasks||topic.exam||topic.current||topic.lifetime||topic.progressPercent||topic.title))return;
        out.push({moduleKey,key,topic});
      });
      if(moduleKey==="verben" && (mod.progress||mod.state||mod.known||mod.activeVerbs)){
        out.push({moduleKey,key:"verben-a1",topic:{title:"Verben A1",progressPercent:mod.progress||mod.current?.percent||0,current:{percent:mod.progress||0},tasks:mod.state?.taskDoneSets||{},exam:mod.exam||mod.state?.exam||{}}});
      }
    });
    return out;
  }
  function overallPercent(s){
    const p=s.progressDoc||{};
    if(p.totals&&p.totals.progressPercent!==undefined)return percent(p.totals.progressPercent);
    const topics=topicRecords(p).map(x=>percent(x.topic.progressPercent??x.topic.current?.percent??0));
    if(topics.length)return percent(topics.reduce((a,b)=>a+b,0)/topics.length);
    const verben=(p.verben||{});return percent(verben.progress??s.verbenFortschritt??0);
  }
  function pointsTotal(s){const p=s.progressDoc||{};return Math.max(num(p.lifetimePoints),num(p.pointsTotal),num(p.punkteGesamt),num(p.totals?.points))}
  function lastActive(s){const p=s.progressDoc||{};return p.lastActive||p.lastActiveAt||p.updatedAt||p.lastLogin||s.lastActive||s.lastLogin||s.updatedAt}
  function taskBadges(s){
    const topics=topicRecords(s.progressDoc||{});
    if(!topics.length)return `<span class="pill warn">noch kein Aufgabenfortschritt</span>`;
    return topics.slice(0,8).map(({moduleKey,key,topic})=>{
      const p=percent(topic.progressPercent??topic.current?.percent??0);
      const tasks=Object.values(topic.tasks||{}).filter(t=>t&&typeof t==="object");
      const done=tasks.filter(t=>t.completed||percent(t.percent)>=100).length;
      const total=topic.totalTasks||tasks.length||topic.current?.totalTasks||0;
      const title=topic.title||topic.themeTitle||key;
      const label=`${title}: ${p}%${total?` · ${done}/${total}`:""}`;
      return `<span class="pill ${p>=100?"ok":p>0?"warn":""}">${safe(label)}</span>`;
    }).join(" ") + (topics.length>8?` <span class="pill">+${topics.length-8} weitere</span>`:"");
  }
  function detailsHtml(s){
    const topics=topicRecords(s.progressDoc||{});
    if(!topics.length)return `<div class="small">Noch keine Detaildaten.</div>`;
    return `<details class="progress-details"><summary>Details ansehen</summary><div class="detail-list">${topics.map(({key,topic})=>{
      const p=percent(topic.progressPercent??topic.current?.percent??0);
      const tasks=Object.values(topic.tasks||{}).filter(t=>t&&typeof t==="object");
      const rows=tasks.length?tasks.map(t=>`<div class="small">${safe(t.title||t.file||t.key)}: <b>${percent(t.percent)}%</b>${t.completed?" · fertig":""}</div>`).join(""):`<div class="small">Keine einzelnen Aufgaben gespeichert.</div>`;
      return `<div class="detail-topic"><b>${safe(topic.title||topic.themeTitle||key)} · ${p}%</b>${rows}</div>`;
    }).join("")}</div></details>`;
  }
  function installAnalytics(){
    Analytics.overallPercent=overallPercent;
    Analytics.lastActive=lastActive;
    Analytics.pointsTotal=pointsTotal;
    Analytics.verbenData=function(s){const v=(s.progressDoc&&s.progressDoc.verben)||{};return {...v,progress:v.progress??overallPercent(s)}};
    Analytics.taskStatus=function(s){return taskBadges(s)};
    Analytics.studentRow=function(s){
      const id=s.studentId||s.id;
      const did=domId(id);
      const p=overallPercent(s);
      const points=pointsTotal(s);
      return `<tr data-student-row="${safe(id)}">
        <td><strong>${safe(this.studentName(s))}</strong><div class="small">${safe(s.email||"keine E-Mail")}<br>${safe(s.muttersprache||"")}</div></td>
        <td>${this.progressBar(p)}</td>
        <td>${this.pill(`Punkte: ${points}`,points>0?"ok":"")}<div class="manual-point-box"><input id="manual-points-${did}" type="number" min="1" step="1" placeholder="+ Punkte"><input id="manual-reason-${did}" placeholder="Grund"><button class="secondary" onclick="Students.addManualPoints('${jsString(id)}')">Hinzufügen</button></div></td>
        <td><strong>${safe(formatDate(lastActive(s)))}</strong><div class="small">${safe((s.progressDoc&&s.progressDoc.lastPage)||"")}</div></td>
        <td>${taskBadges(s)}${detailsHtml(s)}</td>
        <td class="row-actions"><button class="secondary" onclick="Students.openEdit('${jsString(id)}')">Bearbeiten</button><button class="danger" onclick="Students.remove('${jsString(id)}','${jsString(this.studentName(s))}')">Löschen</button></td>
      </tr>`;
    };
    Analytics.courseCard=function(courseName,students,courseData){
      const count=students.length;
      const avg=count?Math.round(students.reduce((sum,s)=>sum+overallPercent(s),0)/count):0;
      const course=courseData||{id:courseName,name:courseName};
      const title=Courses.displayName(course);
      const code=Courses.code(course)||courseName;
      const docId=Courses.docId(course)||code;
      const safeCode=String(code).replace(/'/g,"\\'");
      const safeDocId=String(docId).replace(/'/g,"\\'");
      const unassigned=course.__unassigned;
      return `<section class="course-card ${unassigned?"course-unassigned":""}">
        <div class="course-head"><div><div class="course-title">${safe(title)}</div><div class="small"><b>${count} Teilnehmer</b> · Durchschnitt Fortschritt: ${avg}% · Kurscode: ${safe(code)}${unassigned?" · Lehrer-Zuordnung fehlt":""}</div></div><div class="course-actions">${unassigned?`<button onclick="Courses.assignToMe('${safeDocId}')">Mir zuweisen</button>`:""}<button onclick="TeacherPreview.open('${safeCode}')">SprachPilot</button><button class="secondary" onclick="TeacherApp.openReleaseEditor('${safeCode}',window.__SP_COURSES||[])">Freigabe</button><button class="danger" onclick="Courses.remove('${safeDocId}')">Kurs löschen</button></div></div>
        ${unassigned?`<div class="debug-box small">Dieser Kurs hat keine Lehrer-Zuordnung. Wenn das dein Kurs ist, klicke einmal auf <b>Mir zuweisen</b>. Danach bleibt er korrekt in deinem Dashboard.</div>`:""}
        ${this.progressBar(avg)}
        <div class="student-table-wrap"><table class="student-table"><thead><tr><th>Schüler</th><th>Gesamtfortschritt</th><th>Punkte</th><th>Zuletzt aktiv</th><th>Aufgabenfortschritt</th><th>Aktionen</th></tr></thead><tbody>${students.map(s=>this.studentRow(s)).join("")||`<tr><td colspan="6">Noch keine Schüler in diesem Kurs.</td></tr>`}</tbody></table></div>
      </section>`;
    };
  }
  function installStudents(){
    Students.addManualPoints=async function(studentId){
      const id=String(studentId||"");const did=domId(id);
      const amount=Math.max(0,Math.round(Number(document.getElementById(`manual-points-${did}`)?.value||0)));
      const reason=(document.getElementById(`manual-reason-${did}`)?.value||"").trim();
      if(!amount)return alert("Bitte eine positive Punktzahl eingeben.");
      const database=this.database();if(!database)return alert("Firebase ist nicht verbunden. Punkte wurden nicht gespeichert.");
      const row=window.__SP_STUDENTS_BY_ID?.[id]||{};const progressId=row.studentId||row.userId||row.id||id;
      const ref=database.collection("progress").doc(progressId);const snap=await ref.get();const data=snap.exists?(snap.data()||{}):{};
      const oldTotal=Math.max(num(data.lifetimePoints),num(data.pointsTotal),num(data.punkteGesamt),num(data.totals?.points));
      const nextTotal=oldTotal+amount;
      const teacher=TeacherEnv.teacherProfile?TeacherEnv.teacherProfile():{};
      const log=arr(data.manualPointsLog).concat([{points:amount,reason,teacher:teacher.email||teacher.name||"Lehrkraft",date:new Date().toISOString()}]).slice(-100);
      await ref.set({studentId:progressId,userId:progressId,kurs:row.kurs||row.kursnummer||row.courseCode||data.kurs||"",studentName:Analytics.studentName(row),email:row.email||data.email||"",lifetimePoints:nextTotal,pointsTotal:nextTotal,punkteGesamt:nextTotal,manualPointsTotal:num(data.manualPointsTotal)+amount,manualPointsLog:log,totals:{...(data.totals||{}),points:nextTotal},updatedAt:firebase.firestore.FieldValue.serverTimestamp(),lastManualPointsAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      alert(`${amount} Punkte hinzugefügt.`);
      TeacherApp.render();
    };
  }
  function courseValues(R){return uniq([R.courseCode,R.courseName].map(x=>String(x||"").trim()).flatMap(x=>x?[x,x.toLowerCase(),x.toUpperCase()]:[]))}
  function studentInCourse(s,values){const set=new Set(values.map(norm));return [s.kurs,s.kursnummer,s.courseCode,s.courseDocId,s.courseId].some(v=>set.has(norm(v)))}
  async function syncStudentAssignments(){
    try{
      if(typeof ReleaseDraft==="undefined"||!ReleaseDraft.data)return 0;
      const database=TeacherEnv.db&&TeacherEnv.db();
      if(!database)return 0;
      const values=courseValues(ReleaseDraft);
      if(!values.length)return 0;
      const payload=JSON.parse(JSON.stringify(ReleaseDraft.data||{}));
      payload.courseCode=ReleaseDraft.courseCode||payload.courseCode||"";
      payload.courseDocId=ReleaseDraft.courseName||payload.courseDocId||"";
      payload.source="teacher-release-dashboard";
      payload.updatedAt=new Date().toISOString();
      const snap=await database.collection("students").get();
      const batch=database.batch();
      let count=0;
      snap.docs.forEach(d=>{
        const s=d.data()||{};
        if(!studentInCourse(s,values))return;
        batch.set(d.ref,{assignments:payload,courseCode:s.courseCode||ReleaseDraft.courseCode||"",kurs:s.kurs||ReleaseDraft.courseCode||ReleaseDraft.courseName||"",kursnummer:s.kursnummer||s.kurs||ReleaseDraft.courseCode||ReleaseDraft.courseName||"",courseDocId:s.courseDocId||ReleaseDraft.courseName||"",updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
        count++;
      });
      if(count)await batch.commit();
      console.log("[SprachPilot] Freigabe in Schülerprofile synchronisiert",count);
      return count;
    }catch(e){console.warn("[SprachPilot] Schüler-Freigabe-Sync fehlgeschlagen",e);return 0}
  }
  function installReleaseSync(){
    if(typeof ReleaseDraft==="undefined"||ReleaseDraft.__dashboardStudentSync)return;
    ReleaseDraft.__dashboardStudentSync=true;
    const oldSave=ReleaseDraft.save&&ReleaseDraft.save.bind(ReleaseDraft);
    ReleaseDraft.save=async function(){
      const result=oldSave?await oldSave():undefined;
      await syncStudentAssignments();
      return result;
    };
    ReleaseDraft.syncStudentAssignments=syncStudentAssignments;
  }
  function installTeacherAppPatch(){
    if(typeof TeacherApp==="undefined"||TeacherApp.__dashboardEnhancements)return;
    const oldRender=TeacherApp.render.bind(TeacherApp);
    TeacherApp.render=async function(options={}){const result=await oldRender(options);document.querySelectorAll(".stat div").forEach(el=>{if(el.textContent.trim()==="Ø Verben")el.textContent="Ø Fortschritt"});return result};
    TeacherApp.__dashboardEnhancements=true;
  }
  function install(){if(!ready()){setTimeout(install,50);return}try{window.TeacherEnv=TeacherEnv;window.ReleaseDraft=ReleaseDraft;window.TeacherApp=TeacherApp}catch(e){}installAnalytics();installStudents();installReleaseSync();installTeacherAppPatch()}
  install();
})();