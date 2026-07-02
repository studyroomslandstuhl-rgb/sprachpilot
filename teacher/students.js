const Students = {
  database(){return TeacherEnv?.db?.() || null},
  async list(){
    const database=this.database();
    if(!database){TeacherEnv?.note?.("Schüler nicht geladen: Firestore ist nicht verbunden.");return []}
    try{
      const snap=await database.collection("students").get();
      return snap.docs.map(d=>({id:d.id,...d.data()}));
    }catch(e){TeacherEnv?.note?.("Schüler konnten nicht geladen werden", e);return []}
  },
  async progressList(){
    const database=this.database();
    if(!database){TeacherEnv?.note?.("Fortschritt nicht geladen: Firestore ist nicht verbunden.");return []}
    try{
      const snap=await database.collection("progress").get();
      return snap.docs.map(d=>({id:d.id,...d.data()}));
    }catch(e){TeacherEnv?.note?.("Fortschritt konnte nicht geladen werden", e);return []}
  },
  norm(v){return String(v||"").trim().toLowerCase()},
  progressKeys(x){
    const course=this.norm(x.kurs||x.kursnummer||x.courseCode||x.courseDocId);
    const email=this.norm(x.email);
    return [...new Set([
      x.id,x.studentId,x.userId,x.docId,x.uid,
      email&&course?email+"|"+course:"",
      email?"email:"+email:""
    ].filter(Boolean).map(String))];
  },
  mergeStudentProgress(students,progressRows){
    const progressByKey=new Map();
    for(const p of progressRows||[]){
      for(const key of this.progressKeys(p)){
        if(!progressByKey.has(key))progressByKey.set(key,p);
      }
    }
    return (students||[]).map(s=>{
      let progressDoc=null;
      for(const key of this.progressKeys(s)){
        if(progressByKey.has(key)){progressDoc=progressByKey.get(key);break;}
      }
      return {...s,progressDoc:progressDoc||null};
    });
  },
  byCourse(students){
    const groups={};
    for(const s of students||[]){
      const k=s.kurs||s.kursnummer||s.courseCode||"Ohne Kurs";
      groups[k]=groups[k]||[];
      groups[k].push(s);
    }
    return groups;
  },
  filterByCourses(students,courseNames){
    const allowed=new Set((courseNames||[]).map(x=>String(x).trim().toLowerCase()));
    return (students||[]).filter(s=>allowed.has(String(s.kurs||s.kursnummer||s.courseCode||"").trim().toLowerCase()));
  },
  async updateStudent(studentId,data){
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Schülerdaten wurden nicht gespeichert.");
    await database.collection("students").doc(studentId).set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    TeacherApp.render();
  },
  async remove(studentId,name=""){
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Schüler kann nicht gelöscht werden.");
    if(confirm(`Schüler ${name||studentId} wirklich löschen? Fortschritt wird ebenfalls entfernt.`)){
      await database.collection("students").doc(studentId).delete();
      try{await database.collection("progress").doc(studentId).delete()}catch(e){TeacherEnv?.note?.("Fortschritt zum Schüler konnte nicht gelöscht werden", e)}
      TeacherApp.render();
    }
  },
  editForm(student){
    const id=student.studentId||student.id;
    const safe=v=>TeacherEnv?.safe?.(v) || String(v||"");
    return `<div class="edit-box" id="edit-${safe(id)}">
      <h4>Schüler bearbeiten</h4>
      <div class="toolbar wrap">
        <input id="edit-vorname-${safe(id)}" value="${safe(student.vorname)}" placeholder="Vorname">
        <input id="edit-nachname-${safe(id)}" value="${safe(student.nachname)}" placeholder="Nachname">
        <input id="edit-email-${safe(id)}" value="${safe(student.email)}" placeholder="E-Mail">
        <input id="edit-kurs-${safe(id)}" value="${safe(student.kurs||student.kursnummer||student.courseCode)}" placeholder="Kurs">
        <input id="edit-muttersprache-${safe(id)}" value="${safe(student.muttersprache)}" placeholder="Muttersprache">
        <button onclick="Students.saveEdit('${safe(id)}')">Speichern</button>
        <button class="secondary" onclick="document.getElementById('edit-${safe(id)}').remove()">Abbrechen</button>
      </div>
    </div>`;
  },
  openEdit(studentId){
    const row=document.querySelector(`[data-student-row="${CSS.escape(studentId)}"]`);
    const data=window.__SP_STUDENTS_BY_ID?.[studentId];
    if(row&&data)row.insertAdjacentHTML("afterend",`<tr><td colspan="6">${Students.editForm(data)}</td></tr>`);
  },
  async saveEdit(studentId){
    const v=id=>document.getElementById(id)?.value?.trim()||"";
    await Students.updateStudent(studentId,{
      vorname:v(`edit-vorname-${studentId}`),
      nachname:v(`edit-nachname-${studentId}`),
      email:v(`edit-email-${studentId}`).toLowerCase(),
      kurs:v(`edit-kurs-${studentId}`),
      kursnummer:v(`edit-kurs-${studentId}`),
      courseCode:v(`edit-kurs-${studentId}`),
      muttersprache:v(`edit-muttersprache-${studentId}`)
    });
  }
};