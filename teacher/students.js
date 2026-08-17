const Students = {
  database(){return TeacherEnv?.db?.() || null},
  async list(){
    const database=this.database();
    if(!database){TeacherEnv?.note?.("Schüler nicht geladen: Firestore ist nicht verbunden.");return []}
    try{const snap=await database.collection("students").get();return snap.docs.map(d=>({id:d.id,...d.data()}))}catch(e){TeacherEnv?.note?.("Schüler konnten nicht geladen werden", e);return []}
  },
  async progressList(){
    const database=this.database();
    if(!database){TeacherEnv?.note?.("Fortschritt nicht geladen: Firestore ist nicht verbunden.");return []}
    try{const snap=await database.collection("progress").get();return snap.docs.map(d=>({id:d.id,...d.data()}))}catch(e){TeacherEnv?.note?.("Fortschritt konnte nicht geladen werden", e);return []}
  },
  norm(v){return String(v||"").trim().toLowerCase()},
  progressKeys(x){
    const course=this.norm(x.kurs||x.kursnummer||x.courseCode||x.courseDocId),email=this.norm(x.email);
    return [...new Set([x.id,x.studentId,x.userId,x.docId,x.uid,x.canonicalStudentId,...(Array.isArray(x.aliasIds)?x.aliasIds:[]),email&&course?email+"|"+course:"",email?"email:"+email:""].filter(Boolean).map(String))];
  },
  progressTopicStrength(t){
    if(!t||typeof t!=="object")return 0;
    let score=Math.max(0,Number(t.progressPercent||t.current?.percent||0))*100000+Math.max(0,Number(t.lifetime?.points||0))*100;
    for(const task of Object.values(t.tasks||{})){if(!task||typeof task!=="object")continue;score+=Math.max(0,Number(task.percent||0))*1000+Math.max(0,Number(task.done||0))*100+(task.completed?100000:0)}
    score+=Math.max(0,Number(t.exam?.bestPercent||t.exam?.percent||0))*1000;
    return score
  },
  mergeProgressTopic(a={},b={}){
    const strong=this.progressTopicStrength(a)>=this.progressTopicStrength(b)?a:b,weak=strong===a?b:a,out={...weak,...strong},tasks={...(weak.tasks||{})};
    for(const[k,t]of Object.entries(strong.tasks||{})){const old=tasks[k]||{},po=Math.max(0,Number(old.percent||0)),pn=Math.max(0,Number(t?.percent||0));tasks[k]=pn>=po?{...old,...t,percent:Math.max(po,pn),done:Math.max(Number(old.done||0),Number(t?.done||0)),total:Math.max(Number(old.total||0),Number(t?.total||0)),completed:!!(old.completed||t?.completed)}:{...t,...old,percent:Math.max(po,pn),done:Math.max(Number(old.done||0),Number(t?.done||0)),total:Math.max(Number(old.total||0),Number(t?.total||0)),completed:!!(old.completed||t?.completed)}}
    out.tasks=tasks;out.progressPercent=Math.max(Number(a.progressPercent||a.current?.percent||0),Number(b.progressPercent||b.current?.percent||0));out.completedTasks=Math.max(Number(a.completedTasks||a.current?.completedTasks||0),Number(b.completedTasks||b.current?.completedTasks||0));out.totalTasks=Math.max(Number(a.totalTasks||a.current?.totalTasks||0),Number(b.totalTasks||b.current?.totalTasks||0),Object.keys(tasks).length);out.current={...(weak.current||{}),...(strong.current||{}),percent:out.progressPercent,completedTasks:out.completedTasks,totalTasks:out.totalTasks};const al=a.lifetime||{},bl=b.lifetime||{};out.lifetime={...al,...bl,points:Math.max(Number(al.points||0),Number(bl.points||0)),taskPointRuns:{...(al.taskPointRuns||{}),...(bl.taskPointRuns||{})},examPointRuns:{...(al.examPointRuns||{}),...(bl.examPointRuns||{})}};const ae=a.exam||{},be=b.exam||{};out.exam={...ae,...be,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed)};out.technicalRecovery=!!(a.technicalRecovery||b.technicalRecovery);return out
  },
  mergeProgressRows(a={},b={}){
    const out={...a,...b},mods=["fragen","wortschatz","verben","perfekt","grammatik"];
    for(const m of mods){const mod={...(a[m]||{})};for(const[k,v]of Object.entries(b[m]||{})){if(v&&typeof v==="object"&&!Array.isArray(v)&&(v.tasks||v.lifetime||v.current||v.exam||v.progressPercent!=null))mod[k]=this.mergeProgressTopic(mod[k]||{},v);else if(!(k in mod))mod[k]=v}out[m]=mod}
    out.metadata={...(a.metadata||{}),...(b.metadata||{})};out.aliasIds=[...new Set([...(a.aliasIds||[]),...(b.aliasIds||[]),a.id,b.id,a.studentId,b.studentId,a.userId,b.userId].filter(Boolean).map(String))];out.ranking={...(a.ranking||{}),...(b.ranking||{}),points:Math.max(Number(a.ranking?.points||0),Number(b.ranking?.points||0))};out.totals={...(a.totals||{}),...(b.totals||{}),points:Math.max(Number(a.totals?.points||0),Number(b.totals?.points||0))};out.pointsTotal=Math.max(Number(a.pointsTotal||0),Number(b.pointsTotal||0));out.lifetimePoints=Math.max(Number(a.lifetimePoints||0),Number(b.lifetimePoints||0));out.punkteGesamt=Math.max(Number(a.punkteGesamt||0),Number(b.punkteGesamt||0));return out
  },
  mergeStudentProgress(students,progressRows){
    const progressByKey=new Map();
    for(const p of progressRows||[]){
      const initialKeys=this.progressKeys(p),related=[];
      for(const key of initialKeys){const old=progressByKey.get(key);if(old&&!related.includes(old))related.push(old)}
      let merged=related.reduce((acc,row)=>this.mergeProgressRows(acc,row),p);
      const allKeys=new Set([...initialKeys,...related.flatMap(row=>this.progressKeys(row)),...this.progressKeys(merged)]);
      for(const key of allKeys)progressByKey.set(key,merged);
    }
    return (students||[]).map(s=>{let progressDoc=null;for(const key of this.progressKeys(s)){if(progressByKey.has(key)){const candidate=progressByKey.get(key);progressDoc=progressDoc?this.mergeProgressRows(progressDoc,candidate):candidate}}return {...s,progressDoc:progressDoc||null}});
  },
  byCourse(students){const groups={};for(const s of students||[]){const k=s.kurs||s.kursnummer||s.courseCode||"Ohne Kurs";groups[k]=groups[k]||[];groups[k].push(s)}return groups},
  filterByCourses(students,courseNames){const allowed=new Set((courseNames||[]).map(x=>String(x).trim().toLowerCase()));return (students||[]).filter(s=>allowed.has(String(s.kurs||s.kursnummer||s.courseCode||"").trim().toLowerCase()))},
  async updateStudent(studentId,data){const database=this.database();if(!database)return alert("Firebase ist nicht verbunden. Schülerdaten wurden nicht gespeichert.");await database.collection("students").doc(studentId).set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});TeacherApp.render()},
  async remove(studentId,name=""){const database=this.database();if(!database)return alert("Firebase ist nicht verbunden. Schüler kann nicht gelöscht werden.");if(confirm(`Schüler ${name||studentId} wirklich löschen? Fortschritt wird ebenfalls entfernt.`)){await database.collection("students").doc(studentId).delete();try{await database.collection("progress").doc(studentId).delete()}catch(e){TeacherEnv?.note?.("Fortschritt zum Schüler konnte nicht gelöscht werden", e)}TeacherApp.render()}},
  editForm(student){const id=student.studentId||student.id,safe=v=>TeacherEnv?.safe?.(v)||String(v||"");return `<div class="edit-box" id="edit-${safe(id)}"><h4>Schüler bearbeiten</h4><div class="toolbar wrap"><input id="edit-vorname-${safe(id)}" value="${safe(student.vorname)}" placeholder="Vorname"><input id="edit-nachname-${safe(id)}" value="${safe(student.nachname)}" placeholder="Nachname"><input id="edit-email-${safe(id)}" value="${safe(student.email)}" placeholder="E-Mail"><input id="edit-kurs-${safe(id)}" value="${safe(student.kurs||student.kursnummer||student.courseCode)}" placeholder="Kurs"><input id="edit-muttersprache-${safe(id)}" value="${safe(student.muttersprache)}" placeholder="Muttersprache"><button onclick="Students.saveEdit('${safe(id)}')">Speichern</button><button class="secondary" onclick="document.getElementById('edit-${safe(id)}').remove()">Abbrechen</button></div></div>`},
  openEdit(studentId){const row=document.querySelector(`[data-student-row="${CSS.escape(studentId)}"]`),data=window.__SP_STUDENTS_BY_ID?.[studentId];if(row&&data)row.insertAdjacentHTML("afterend",`<tr><td colspan="6">${Students.editForm(data)}</td></tr>`)},
  async saveEdit(studentId){const v=id=>document.getElementById(id)?.value?.trim()||"";await Students.updateStudent(studentId,{vorname:v(`edit-vorname-${studentId}`),nachname:v(`edit-nachname-${studentId}`),email:v(`edit-email-${studentId}`).toLowerCase(),kurs:v(`edit-kurs-${studentId}`),kursnummer:v(`edit-kurs-${studentId}`),courseCode:v(`edit-kurs-${studentId}`),muttersprache:v(`edit-muttersprache-${studentId}`)})}
};
