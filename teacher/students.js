const Students = {
  async list(){
    if(!db) return [];
    const snap=await db.collection("students").get();
    return snap.docs.map(d=>({id:d.id,...d.data()}));
  },
  async progressList(){
    if(!db) return [];
    const snap=await db.collection("progress").get();
    return snap.docs.map(d=>({id:d.id,...d.data()}));
  },
  mergeStudentProgress(students,progressRows){
    const progressById=new Map(progressRows.map(p=>[p.studentId||p.id,p]));
    return students.map(s=>({...s,progressDoc:progressById.get(s.studentId||s.id)||null}));
  },
  byCourse(students){
    const groups={};
    for(const s of students){
      const k=s.kurs||s.kursnummer||s.courseCode||"Ohne Kurs";
      groups[k]=groups[k]||[];
      groups[k].push(s);
    }
    return groups;
  },
  filterByCourses(students,courseNames){
    const allowed=new Set(courseNames.map(x=>String(x).trim().toLowerCase()));
    return students.filter(s=>allowed.has(String(s.kurs||s.kursnummer||s.courseCode||"").trim().toLowerCase()));
  },
  async updateStudent(studentId,data){
    if(!db)return;
    await db.collection("students").doc(studentId).set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    TeacherApp.render();
  },
  async remove(studentId,name=""){
    if(!db)return;
    if(confirm(`Schüler ${name||studentId} wirklich löschen? Fortschritt wird ebenfalls entfernt.`)){
      await db.collection("students").doc(studentId).delete();
      try{await db.collection("progress").doc(studentId).delete()}catch(e){}
      TeacherApp.render();
    }
  },
  editForm(student){
    const id=student.studentId||student.id;
    const safe=v=>String(v||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
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
    const row=document.querySelector(`[data-student-row="${studentId}"]`);
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
