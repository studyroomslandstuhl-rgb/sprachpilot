// Lehrer-Dashboard: Fortschritt nur aus freigeschalteten Kursinhalten berechnen.
(function(){
  if(!window.Analytics||window.Analytics.__releasedStatusFix)return;
  const A=window.Analytics;
  const oldTopicRecords=A.topicRecords?.bind(A);
  const oldVerbStats=A.verbStats?.bind(A);
  function norm(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function lessonKey(t){const raw=String(t.lesson||t.id||t.title||'');const m=raw.match(/lektion[- ]?(\d+)/i)||String(t.title||'').match(/lektion[- ]?(\d+)/i);return raw.includes('Lektion')?raw.match(/A\d[- ]Lektion[- ]\d+/i)?.[0]?.replace(/ /g,'-'):(m?'A1-Lektion-'+m[1]:'')}
  function themeKey(t){const raw=String(t.theme||t.id||t.title||'');const m=raw.match(/thema[- ]?(\d+)/i)||String(t.title||'').match(/thema[- ]?(\d+)/i);return raw.includes('Thema')?raw.match(/Thema[- ]\d+/i)?.[0]?.replace(/ /g,'-'):(m?'Thema-'+m[1]:'')}
  function hasReleaseData(c){return !!(c&&typeof c==='object'&&(c.enabledModules||c.enabledLessons||c.enabledThemes||c.enabledTasks||c.enabledWords||c.enabledSets||c.releases||c.releaseMode||c.defaultLocked!==undefined))}
  function defaultOpen(c){return c&&((c.releaseMode==='all'||c.releaseMode==='open')||c.defaultLocked===false)}
  function moduleOff(c,slug,title){return c.enabledModules?.[slug]===false||c.enabledModules?.[title]===false||c.releases?.[slug]?.enabled===false||c.releases?.[title]?.enabled===false}
  function moduleOn(c,slug,title){return c.enabledModules?.[slug]===true||c.enabledModules?.[title]===true||c.releases?.[slug]?.enabled===true||c.releases?.[title]?.enabled===true}
  function releasedTopic(c,t){
    if(!hasReleaseData(c))return true;
    const module=String(t.module||'').toLowerCase();
    if(module==='verben'){
      if(moduleOff(c,'verben-A1','Verben A1'))return false;
      if(moduleOn(c,'verben-A1','Verben A1'))return true;
      if(Object.keys(c.enabledWords||{}).some(k=>c.enabledWords[k]===true))return true;
      return defaultOpen(c);
    }
    if(module==='fragen'){
      if(moduleOff(c,'fragen-A1','Fragen A1'))return false;
      if(moduleOn(c,'fragen-A1','Fragen A1'))return true;
      return defaultOpen(c);
    }
    const l=lessonKey(t), th=themeKey(t);
    if(moduleOff(c,'wortschatz','Wortschatz'))return false;
    const keys=[th,l&&th?l+'/'+th:'',l&&th?'wortschatz/'+l+'/'+th:'',l&&th?'Wortschatz/'+l+'/'+th:''].filter(Boolean);
    if(keys.some(k=>c.enabledThemes?.[k]===false))return false;
    if(keys.some(k=>c.enabledThemes?.[k]===true))return true;
    const vals=[c.releases?.wortschatz?.lessons?.[l]?.themes?.[th]?.enabled,c.releases?.Wortschatz?.lessons?.[l]?.themes?.[th]?.enabled];
    if(vals.some(v=>v===false))return false;
    if(vals.some(v=>v===true))return true;
    const lessonVals=[c.enabledLessons?.[l],c.enabledLessons?.['wortschatz/'+l],c.enabledLessons?.['Wortschatz/'+l],c.releases?.wortschatz?.lessons?.[l]?.enabled,c.releases?.Wortschatz?.lessons?.[l]?.enabled];
    if(lessonVals.some(v=>v===false))return false;
    if(lessonVals.some(v=>v===true))return true;
    return defaultOpen(c);
  }
  function releasedRows(s,course){return (oldTopicRecords?oldTopicRecords(s):[]).filter(row=>releasedTopic(course,row))}
  function repetitionNumber(row){const lifetime=row.lifetime||{};return Math.max(1,Number(row.run||lifetime.currentRun||Number(lifetime.resets||0)+1||1)||1,Number(lifetime.finishedRuns||lifetime.completedRuns||0)||0)}
  function rowStatus(row){const p=A.percent(row.percent);const exam=A.percent(row.exam?.bestPercent||row.exam?.percent||row.exam?.lastPercent||0);const examDone=row.module==='verben'?p>=100:(exam>=100||row.exam?.completed===true);if(p>=100&&examDone){if(repetitionNumber(row)>=3)return A.pill('fertig','');return A.pill(Math.min(2,repetitionNumber(row))+'. Wiederholung','no')}if(p>0)return A.pill('aktiv','ok');return A.pill('neu','warn')}
  A.topicRecords=function(s,course){return releasedRows(s,course)};
  A.overallProgress=function(s,course){const rows=this.topicRecords(s,course);return rows.length?this.percent(rows.reduce((sum,x)=>sum+this.percent(x.percent),0)/rows.length):this.percent(s.verbenFortschritt||0)};
  A.topicSummary=function(s,course){const rows=this.topicRecords(s,course);if(!rows.length)return this.pill('keine freigegebenen Inhalte','warn');const active=rows.filter(x=>x.percent>0&&x.percent<100).length;const done=rows.filter(x=>x.percent>=100&&repetitionNumber(x)>=3).length;const repeat=rows.filter(x=>x.percent>=100&&repetitionNumber(x)<3).length;const fresh=rows.filter(x=>this.percent(x.percent)===0).length;return `${this.pill(`${active} aktiv`,active?'ok':'')} ${this.pill(`${repeat} Wiederholung`,repeat?'no':'')} ${this.pill(`${done} fertig`,done?'ok':'')} ${fresh?this.pill(`${fresh} neu`,'warn'):''}`};
  A.studentRow=function(s,course){
    const id=s.studentId||s.id;
    const stars=this.num(this.verbenData(s).stars||this.totals(s).stars||0);
    const overall=this.overallProgress(s,course);
    const rows=this.topicRecords(s,course).slice(0,4);
    const mini=rows.length?rows.map(r=>`<div class="small">${this.safe(r.title)} · ${this.percent(r.percent)}% · ${rowStatus(r)}</div>`).join(''):'';
    return `<tr data-student-row="${this.safe(id)}">
      <td><strong>${this.safe(this.studentName(s))}</strong><div class="small">${this.safe(s.email||'keine E-Mail')}<br>${this.safe(s.muttersprache||'')}</div></td>
      <td>${this.studentStatus(s)}<div class="small">${this.safe(s.kurs||s.kursnummer||s.courseCode||'ohne Kurs')}</div></td>
      <td><strong>${this.points(s)}</strong><div class="small">Punkte</div>${stars?`<div>${this.pill(`⭐ ${stars}`)}</div>`:''}</td>
      <td>${this.progressBar(overall,'freigegebene Inhalte')}</td>
      <td>${this.topicSummary(s,course)}${mini}<div class="small">${this.verbenProgressLine?this.verbenProgressLine(s):''}</div></td>
      <td><strong>${this.safe(this.lastPlace(s))}</strong><div class="small">${this.safe(this.formatDate(this.lastActiveRaw(s)))}</div></td>
      <td class="row-actions"><button class="secondary" onclick="Students.openEdit('${String(id).replace(/'/g,"\\'")}')">Schüler bearbeiten</button><button class="danger" onclick="Students.remove('${String(id).replace(/'/g,"\\'")}','${this.studentName(s).replace(/'/g,"\\'")}')">Löschen</button></td>
    </tr>`;
  };
  const oldCourseCard=A.courseCard.bind(A);
  A.courseCard=function(courseName,students,courseData){
    const course=courseData||{id:courseName,name:courseName};
    const count=students.length;
    const avg=count?Math.round(students.reduce((sum,s)=>sum+this.overallProgress(s,course),0)/count):0;
    const points=students.reduce((sum,s)=>sum+this.points(s),0);
    const active=students.filter(s=>Object.keys(this.progressDoc(s)||{}).length).length;
    const title=Courses.displayName(course), code=Courses.code(course)||courseName, docId=Courses.docId(course)||code;
    const safeCode=String(code).replace(/'/g,"\\'"), safeDocId=String(docId).replace(/'/g,"\\'");
    const unassigned=course.__unassigned;
    return `<section class="course-card ${unassigned?'course-unassigned':''}">
      <div class="course-head friendly-course-head"><div><div class="course-kicker">Kurs</div><div class="course-title">${this.safe(title)}</div><div class="small">Kurscode: <b>${this.safe(code)}</b>${unassigned?' · Lehrer-Zuordnung fehlt':''}</div><div class="course-release-summary">${this.releaseSummary(course)}</div></div><div class="course-actions">${unassigned?`<button onclick="Courses.assignToMe('${safeDocId}')">Mir zuweisen</button>`:''}<button onclick="TeacherPreview.open('${safeCode}')">Als Schüler öffnen</button><button class="secondary" onclick="TeacherApp.openReleaseEditor('${safeCode}',window.__SP_COURSES||[]);document.getElementById('releaseCourse').value='${safeCode}';document.getElementById('releaseEditor')?.scrollIntoView({behavior:'smooth',block:'start'});">Freigaben bearbeiten</button><button class="danger" onclick="Courses.remove('${safeDocId}')">Kurs löschen</button></div></div>
      ${unassigned?`<div class="debug-box small">Dieser Kurs hat keine Lehrer-Zuordnung. Wenn das dein Kurs ist, klicke einmal auf <b>Mir zuweisen</b>.</div>`:''}
      <div class="course-mini-stats"><div><b>${count}</b><span>Schüler</span></div><div><b>${active}</b><span>aktiv</span></div><div><b>${points}</b><span>Punkte gesamt</span></div><div><b>${avg}%</b><span>Ø freigegeben</span></div></div>
      ${this.progressBar(avg,'Durchschnitt freigegebene Inhalte')}
      <details class="teacher-course-details" open><summary>Schüler in diesem Kurs anzeigen</summary><div class="student-table-wrap"><table class="student-table friendly-table"><thead><tr><th>Schüler</th><th>Status</th><th>Punkte</th><th>Fortschritt</th><th>Freigegebene Inhalte</th><th>Zuletzt</th><th>Aktionen</th></tr></thead><tbody>${students.map(s=>this.studentRow(s,course)).join('')||`<tr><td colspan="7">Noch keine Schüler in diesem Kurs.</td></tr>`}</tbody></table></div></details>
    </section>`;
  };
  A.__releasedStatusFix=true;
})();
