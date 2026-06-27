const TeacherIdentity = {
  user(){
    try{return firebase.auth().currentUser || null}catch(e){return null}
  },
  uid(){return this.user()?.uid || ""},
  email(){return String(this.user()?.email || "").toLowerCase()},
  matches(value){
    value=String(value||"").toLowerCase().trim();
    return !!value && (value===this.uid().toLowerCase() || value===this.email());
  },
  courseBelongsToTeacher(course){
    if(!course)return false;
    const fields=[
      course.teacherUid,course.teacherId,course.ownerUid,course.createdByUid,course.assignedTeacherId,
      course.teacherEmail,course.ownerEmail,course.createdByEmail,course.assignedTeacherEmail,
      course.teacher,course.lehrer,course.lehrerin,course.teacherOwner
    ];
    if(fields.some(v=>this.matches(v)))return true;
    const arr=[course.teachers,course.teacherUids,course.teacherEmails,course.assignedTeachers,course.lehrerInnen,course.lehrkraefte]
      .flatMap(x=>Array.isArray(x)?x:[]);
    return arr.some(v=>this.matches(typeof v==="object"?(v.uid||v.email||v.id):v));
  }
};

const Courses = {
  async list(){
    if(!db) return [];
    const uid=TeacherIdentity.uid();
    const email=TeacherIdentity.email();
    const map=new Map();
    const add=snap=>snap.docs.forEach(d=>{const c={id:d.id,...d.data()};if(TeacherIdentity.courseBelongsToTeacher(c))map.set(d.id,c)});
    const queries=[
      ["teacherUid",uid],["teacherId",uid],["ownerUid",uid],["createdByUid",uid],["assignedTeacherId",uid],
      ["teacherEmail",email],["ownerEmail",email],["createdByEmail",email],["assignedTeacherEmail",email]
    ].filter(([,v])=>v);
    for(const [field,value] of queries){
      try{add(await db.collection("courses").where(field,"==",value).get())}catch(e){}
    }
    try{
      const snap=await db.collection("courses").get();
      add(snap);
    }catch(e){}
    return [...map.values()].sort((a,b)=>String(a.id||a.name).localeCompare(String(b.id||b.name)));
  },
  async create(name){
    name=String(name||"").trim();
    if(!name)return alert("Bitte Kursnamen eingeben, z. B. GLK-68.");
    if(!db)return alert("Firebase ist nicht verbunden.");
    const user=TeacherIdentity.user();
    await db.collection("courses").doc(name).set({
      name,
      teacherUid:user?.uid||"",
      teacherEmail:user?.email||"",
      teachers:[user?.uid,user?.email].filter(Boolean),
      enabledModules:{"Verben A1":true,"Wortschatz":true,"Fragen A1":true},
      enabledLessons:{},enabledTasks:{},enabledWords:{},releases:{},
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    TeacherApp.render();
  },
  async update(name,data){
    if(!db)return;
    await db.collection("courses").doc(name).set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  },
  async remove(name){
    if(!db)return;
    if(confirm(`Kurs ${name} wirklich löschen? Freigaben und Kursdaten werden gelöscht. Schüler-Profile bleiben erhalten.`)){
      await db.collection("courses").doc(name).delete();
      TeacherApp.render();
    }
  }
};
