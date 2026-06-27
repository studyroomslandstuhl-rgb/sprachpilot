const TeacherIdentity = {
  _cache: null,

  norm(value){
    return String(value || "").toLowerCase().trim();
  },

  safeParse(key){
    try{return JSON.parse(localStorage.getItem(key) || "{}")}catch(e){return {}}
  },

  user(){
    try{return TeacherEnv?.currentUser?.() || firebase.auth().currentUser || null}catch(e){return null}
  },

  teacherProfile(){
    return TeacherEnv?.teacherProfile?.() || this.safeParse("SP_TEACHER_PROFILE") || {};
  },

  userProfile(){
    return this.safeParse("SP_USER_PROFILE") || {};
  },

  identityValues(){
    if(this._cache) return this._cache;

    const user=this.user() || {};
    const teacher=this.teacherProfile() || {};
    const profile=this.userProfile() || {};

    const raw=[
      user.uid,
      user.email,
      user.displayName,
      localStorage.getItem("SP_TEACHER_ID"),
      localStorage.getItem("SP_TEACHER_UID"),
      localStorage.getItem("SP_TEACHER_EMAIL"),
      teacher.uid,
      teacher.id,
      teacher.teacherUid,
      teacher.teacherId,
      teacher.email,
      teacher.teacherEmail,
      teacher.displayName,
      teacher.name,
      teacher.fullName,
      `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`,
      `${profile.vorname||profile.firstName||""} ${profile.nachname||profile.lastName||""}`
    ];

    const values=[...new Set(raw.map(v=>this.norm(v)).filter(Boolean))];
    this._cache=values;
    return values;
  },

  debugText(){
    const values=this.identityValues();
    const uid=this.norm(this.user()?.uid || localStorage.getItem("SP_TEACHER_ID") || localStorage.getItem("SP_TEACHER_UID"));
    const email=this.norm(this.user()?.email || localStorage.getItem("SP_TEACHER_EMAIL"));
    const teacher=this.teacherProfile() || {};
    const name=this.norm(teacher.name || teacher.fullName || `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`);
    return `UID: ${uid || "nicht erkannt"} · E-Mail: ${email || "nicht erkannt"}${name ? " · Name: " + name : ""} · Suchwerte: ${values.join(", ") || "keine"}`;
  },

  matches(value){
    if(value && typeof value==="object"){
      value=value.uid||value.email||value.id||value.name||value.displayName||value.fullName||value.teacherEmail||value.teacherUid||value.teacherId||value.ownerUid||value.createdByUid||"";
    }
    const v=this.norm(value);
    if(!v) return false;
    return this.identityValues().includes(v);
  },

  collectValues(value, bucket=[]){
    if(value === null || value === undefined) return bucket;

    if(Array.isArray(value)){
      value.forEach(item=>this.collectValues(item,bucket));
      return bucket;
    }

    if(typeof value === "object"){
      Object.keys(value).forEach(k=>{
        // Maps like {uid:true} or {email:true} should count the key as value.
        if(value[k] === true || value[k] === "true" || value[k] === 1) bucket.push(k);
        this.collectValues(value[k],bucket);
      });
      return bucket;
    }

    bucket.push(value);
    return bucket;
  },

  ownershipValues(course){
    if(!course) return [];

    const fields=[
      course.teacherUid, course.teacherId, course.teacherUID, course.teacher_id,
      course.teacherIds, course.teacherUids, course.teacherUIDs, course.teacher_ids,
      course.teacherEmail, course.teacherEmails, course.teacher_email, course.teacher_mail,
      course.ownerUid, course.ownerId, course.ownerEmail, course.owner,
      course.createdByUid, course.createdById, course.createdByEmail, course.createdBy,
      course.assignedTeacherId, course.assignedTeacherUid, course.assignedTeacherEmail, course.assignedTeacher,
      course.assignedTeachers, course.assignedTeacherIds, course.assignedTeacherUids, course.assignedTeacherEmails,
      course.teachers, course.teacherList, course.teacherOwner, course.instructors, course.lehrkraefte,
      course.lehrer, course.lehrerin, course.lehrerId, course.lehrerUid, course.lehrerEmail, course.lehrerName,
      course.lehrerIds, course.lehrerUids, course.lehrerEmails, course.lehrerInnen,
      course.admins, course.owners, course.members
    ];

    return fields.flatMap(v=>this.collectValues(v,[])).map(v=>this.norm(v)).filter(Boolean);
  },

  courseBelongsToTeacher(course){
    const values=this.ownershipValues(course);
    const identities=this.identityValues();
    if(!values.length) return false;
    return values.some(v=>identities.includes(v));
  },

  courseLabel(course){
    return String(course?.courseCode || course?.code || course?.id || course?.name || "").trim();
  }
};

const Courses = {
  lastScan: {total:0,matched:0,queries:[],debug:""},

  database(){return TeacherEnv?.db?.() || null},

  resetDebug(){
    TeacherIdentity._cache=null;
    this.lastScan={total:0,matched:0,queries:[],debug:TeacherIdentity.debugText()};
  },

  addSnapshotToMap(map,snap,source){
    if(!snap || !snap.docs) return;
    this.lastScan.queries.push(`${source}: ${snap.docs.length}`);
    snap.docs.forEach(d=>{
      const c={id:d.id,...d.data()};
      this.lastScan.total += 1;
      if(TeacherIdentity.courseBelongsToTeacher(c)){
        const key=TeacherIdentity.courseLabel(c) || d.id;
        map.set(key,{...c,id:d.id,__courseKey:key});
      }
    });
  },

  async list(){
    const database=this.database();
    this.resetDebug();

    if(!database){
      TeacherEnv?.note?.("Kurse nicht geladen: Firestore ist nicht verbunden.");
      return [];
    }

    const user=TeacherIdentity.user() || {};
    const uid=TeacherIdentity.norm(user.uid || localStorage.getItem("SP_TEACHER_ID") || localStorage.getItem("SP_TEACHER_UID"));
    const email=TeacherIdentity.norm(user.email || localStorage.getItem("SP_TEACHER_EMAIL"));
    const identities=TeacherIdentity.identityValues();
    const map=new Map();

    const eqQueries=[
      ["teacherUid",uid],["teacherId",uid],["teacherUID",uid],["teacher_id",uid],
      ["ownerUid",uid],["ownerId",uid],["createdByUid",uid],["createdById",uid],
      ["assignedTeacherId",uid],["assignedTeacherUid",uid],["lehrerId",uid],["lehrerUid",uid],
      ["teacherEmail",email],["ownerEmail",email],["createdByEmail",email],["assignedTeacherEmail",email],["lehrerEmail",email]
    ].filter(([,v])=>v);

    for(const [field,value] of eqQueries){
      try{
        this.addSnapshotToMap(map,await database.collection("courses").where(field,"==",value).get(),`${field} == ${value}`);
      }catch(e){
        TeacherEnv?.note?.(`Kurs-Abfrage fehlgeschlagen: ${field}`, e);
      }
    }

    const arrayFields=[
      "teacherIds","teacherUids","teacherEmails","teachers",
      "assignedTeachers","assignedTeacherIds","assignedTeacherUids","assignedTeacherEmails",
      "lehrerIds","lehrerUids","lehrerEmails","lehrerInnen","lehrkraefte","owners","members","admins"
    ];

    for(const field of arrayFields){
      for(const value of identities){
        try{
          this.addSnapshotToMap(map,await database.collection("courses").where(field,"array-contains",value).get(),`${field} enthält ${value}`);
        }catch(e){
          // Viele Felder existieren nicht oder enthalten Objekte statt Strings. Das ist okay.
        }
      }
    }

    // Fallback: vollständiger Scan für ältere Kursdokumente mit verschachtelten Objekten.
    try{
      this.addSnapshotToMap(map,await database.collection("courses").get(),"vollständiger Scan");
    }catch(e){
      TeacherEnv?.note?.("Kurse konnten nicht vollständig geladen werden. Prüfe Firestore-Regeln.", e);
    }

    const list=[...map.values()].sort((a,b)=>{
      const an=String(a.courseName||a.name||a.courseCode||a.id||"");
      const bn=String(b.courseName||b.name||b.courseCode||b.id||"");
      return an.localeCompare(bn,"de");
    });

    this.lastScan.matched=list.length;
    return list;
  },

  displayName(course){
    return String(course?.courseName || course?.name || course?.courseCode || course?.id || "Unbenannter Kurs");
  },

  code(course){
    return String(course?.courseCode || course?.code || course?.id || course?.name || "");
  },

  debugBox(){
    const d=this.lastScan || {};
    return `<div class="debug-box">
      <b>Keine eigenen Kurse gefunden.</b><br>
      <span>Gesucht wurde mit: ${TeacherEnv.safe(d.debug || TeacherIdentity.debugText())}</span><br>
      <span>Geprüfte Kurs-Treffer: ${TeacherEnv.safe(d.total || 0)} · passende Kurse: ${TeacherEnv.safe(d.matched || 0)}</span>
      ${Array.isArray(d.queries)&&d.queries.length?`<details><summary>Abfragen anzeigen</summary><div class="small">${d.queries.map(q=>TeacherEnv.safe(q)).join("<br>")}</div></details>`:""}
      <p class="small">Wenn ein eigener Kurs fehlt, muss im Kursdokument eine Lehrer-Zuordnung stehen, z. B. <code>teacherUid</code>, <code>teacherEmail</code>, <code>teacherIds</code> oder <code>assignedTeachers</code>.</p>
    </div>`;
  },

  async create(name){
    name=String(name||"").trim();
    if(!name)return alert("Bitte Kursnamen eingeben, z. B. GLK-68.");
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Kurs kann nicht gespeichert werden.");

    const user=TeacherIdentity.user() || {};
    const teacher=TeacherIdentity.teacherProfile() || {};
    const uid=user.uid || teacher.uid || teacher.id || localStorage.getItem("SP_TEACHER_ID") || "";
    const email=user.email || teacher.email || localStorage.getItem("SP_TEACHER_EMAIL") || "";
    const displayName=user.displayName || teacher.name || teacher.fullName || `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`.trim() || email;

    await database.collection("courses").doc(name).set({
      name,
      courseName:name,
      courseCode:name,
      teacherUid:uid,
      teacherId:uid,
      ownerUid:uid,
      createdByUid:uid,
      teacherEmail:email,
      ownerEmail:email,
      createdByEmail:email,
      teacherName:displayName,
      teacherIds:[uid].filter(Boolean),
      teacherUids:[uid].filter(Boolean),
      teacherEmails:[String(email||"").toLowerCase()].filter(Boolean),
      teachers:[uid,String(email||"").toLowerCase()].filter(Boolean),
      assignedTeachers:[{uid,email:String(email||"").toLowerCase(),name:displayName}],
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
