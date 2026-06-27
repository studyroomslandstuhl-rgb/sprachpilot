const TeacherIdentity = {
  user(){
    try{return TeacherEnv?.currentUser?.() || firebase.auth().currentUser || null}catch(e){return null}
  },
  uid(){return this.user()?.uid || ""},
  email(){return String(this.user()?.email || "").toLowerCase()},
  name(){return String(this.user()?.displayName || "").toLowerCase().trim()},
  matches(value){
    if(value && typeof value==="object") value=value.uid||value.email||value.id||value.name||value.displayName||value.teacherEmail||value.teacherUid||"";
    value=String(value||"").toLowerCase().trim();
    return !!value && (value===this.uid().toLowerCase() || value===this.email() || (!!this.name() && value===this.name()));
  },
  courseBelongsToTeacher(course){
    if(!course)return false;
    const fields=[
      course.teacherUid,course.teacherId,course.ownerUid,course.createdByUid,course.assignedTeacherId,course.uid,course.owner,course.createdBy,
      course.teacherEmail,course.ownerEmail,course.createdByEmail,course.assignedTeacherEmail,course.email,
      course.teacher,course.lehrer,course.lehrerin,course.teacherOwner,course.teacherName,course.lehrerName,course.createdByName
    ];
    if(fields.some(v=>this.matches(v)))return true;
    const arr=[course.teachers,course.teacherUids,course.teacherEmails,course.assignedTeachers,course.lehrerInnen,course.lehrkraefte,course.owners]
      .flatMap(x=>Array.isArray(x)?x:[]);
    return arr.some(v=>this.matches(v));
  }
};

const Courses = {
  database(){return TeacherEnv?.db?.() || null},
  async list(){
    const database=this.database();
    if(!database){
      TeacherEnv?.note?.("Kurse nicht geladen: Firestore ist nicht verbunden.");
      return [];
    }
    const uid=TeacherIdentity.uid();
    const email=TeacherIdentity.email();
    const map=new Map();
    const add=snap=>{
      if(!snap || !snap.docs) return;
      snap.docs.forEach(d=>{
        const c={id:d.id,...d.data()};
        if(TeacherIdentity.courseBelongsToTeacher(c)) map.set(d.id,c);
      });
    };
    const queries=[
      ["teacherUid",uid],["teacherId",uid],["ownerUid",uid],["createdByUid",uid],["assignedTeacherId",uid],
      ["teacherEmail",email],["ownerEmail",email],["createdByEmail",email],["assignedTeacherEmail",email]
    ].filter(([,v])=>v);

    for(const [field,value] of queries){
      try{add(await database.collection("courses").where(field,"==",value).get())}
      catch(e){TeacherEnv?.note?.(`Kurs-Abfrage fehlgeschlagen: ${field}`, e)}
    }

    // Fallback für ältere Kursdokumente mit Array-Feldern / anderer Struktur.
    try{add(await database.collection("courses").get())}
    catch(e){TeacherEnv?.note?.("Kurse konnten nicht vollständig geladen werden", e)}

    return [...map.values()].sort((a,b)=>String(a.id||a.name).localeCompare(String(b.id||b.name)));
  },
  async create(name){
    name=String(name||"").trim();
    if(!name)return alert("Bitte Kursnamen eingeben, z. B. GLK-68.");
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Kurs kann nicht gespeichert werden.");
    const user=TeacherIdentity.user();
    await database.collection("courses").doc(name).set({
      name,
      teacherUid:user?.uid||"",
      teacherId:user?.uid||"",
      ownerUid:user?.uid||"",
      createdByUid:user?.uid||"",
      teacherEmail:user?.email||"",
      ownerEmail:user?.email||"",
      createdByEmail:user?.email||"",
      teachers:[user?.uid,user?.email].filter(Boolean),
      assignedTeachers:[{uid:user?.uid||"",email:user?.email||""}],
      enabledModules:{"Verben A1":true,"Wortschatz":true,"Fragen A1":true},
      enabledLessons:{},enabledTasks:{},enabledWords:{},enabledSets:{},enabledThemes:{},releases:{},
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    TeacherApp.render();
  },
  async update(name,data){
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Änderungen wurden nicht gespeichert.");
    await database.collection("courses").doc(name).set({...data,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
  },
  async remove(name){
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Kurs kann nicht gelöscht werden.");
    if(confirm(`Kurs ${name} wirklich löschen? Freigaben und Kursdaten werden gelöscht. Schüler-Profile bleiben erhalten.`)){
      await database.collection("courses").doc(name).delete();
      TeacherApp.render();
    }
  }
};
