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
      localStorage.getItem("SP_USER_EMAIL"),
      localStorage.getItem("SP_LOGIN_EMAIL"),
      teacher.uid,
      teacher.id,
      teacher.teacherUid,
      teacher.teacherId,
      teacher.email,
      teacher.teacherEmail,
      teacher.displayName,
      teacher.name,
      teacher.fullName,
      teacher.vorname,
      teacher.nachname,
      `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`,
      profile.uid,
      profile.id,
      profile.teacherUid,
      profile.teacherId,
      profile.email,
      profile.teacherEmail,
      profile.displayName,
      profile.name,
      profile.fullName,
      `${profile.vorname||profile.firstName||""} ${profile.nachname||profile.lastName||""}`
    ];

    const values=[...new Set(raw.map(v=>this.norm(v)).filter(Boolean))];
    this._cache=values;
    return values;
  },

  courseAssignmentsFromTeacher(){
    const teacher=this.teacherProfile() || {};
    const profile=this.userProfile() || {};
    return this.collectValues([
      teacher.courses, teacher.kurse, teacher.courseCodes, teacher.assignedCourses, teacher.assignedCourseIds,
      teacher.ownedCourses, teacher.myCourses,
      profile.courses, profile.kurse, profile.courseCodes, profile.assignedCourses
    ],[]).map(v=>this.norm(v)).filter(Boolean);
  },

  debugText(){
    const values=this.identityValues();
    const uid=this.norm(this.user()?.uid || localStorage.getItem("SP_TEACHER_ID") || localStorage.getItem("SP_TEACHER_UID"));
    const email=this.norm(this.user()?.email || localStorage.getItem("SP_TEACHER_EMAIL") || localStorage.getItem("SP_LOGIN_EMAIL"));
    const teacher=this.teacherProfile() || {};
    const name=this.norm(teacher.name || teacher.fullName || `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`);
    const assigned=this.courseAssignmentsFromTeacher();
    return `UID: ${uid || "nicht erkannt"} · E-Mail: ${email || "nicht erkannt"}${name ? " · Name: " + name : ""} · Suchwerte: ${values.join(", ") || "keine"}${assigned.length ? " · Kursliste im Lehrerprofil: " + assigned.join(", ") : ""}`;
  },

  collectValues(value, bucket=[]){
    if(value === null || value === undefined) return bucket;

    if(Array.isArray(value)){
      value.forEach(item=>this.collectValues(item,bucket));
      return bucket;
    }

    if(typeof value === "object"){
      Object.keys(value).forEach(k=>{
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
      course.teacherUid, course.teacherId, course.teacherUID, course.teacher_id, course.teacher,
      course.teacherIds, course.teacherUids, course.teacherUIDs, course.teacher_ids,
      course.teacherEmail, course.teacherEmails, course.teacher_email, course.teacher_mail,
      course.ownerUid, course.ownerId, course.ownerEmail, course.owner, course.ownerName,
      course.createdByUid, course.createdById, course.createdByEmail, course.createdBy, course.createdByName,
      course.createdByTeacher, course.createdByTeacherUid, course.createdByTeacherEmail,
      course.assignedTeacherId, course.assignedTeacherUid, course.assignedTeacherEmail, course.assignedTeacher,
      course.assignedTeachers, course.assignedTeacherIds, course.assignedTeacherUids, course.assignedTeacherEmails,
      course.teachers, course.teacherList, course.teacherOwner, course.instructors, course.lehrkraefte,
      course.lehrer, course.lehrerin, course.lehrerId, course.lehrerUid, course.lehrerEmail, course.lehrerName,
      course.lehrerIds, course.lehrerUids, course.lehrerEmails, course.lehrerInnen,
      course.admins, course.owners, course.members
    ];

    return fields.flatMap(v=>this.collectValues(v,[])).map(v=>this.norm(v)).filter(Boolean);
  },

  courseLabel(course){
    return String(course?.courseCode || course?.code || course?.kurs || course?.kursnummer || course?.id || course?.name || "").trim();
  },

  courseBelongsToTeacher(course){
    const values=this.ownershipValues(course);
    const identities=this.identityValues();
    const courseKeys=[this.courseLabel(course), course?.id, course?.name, course?.courseName, course?.courseCode, course?.kurs, course?.kursnummer]
      .map(v=>this.norm(v)).filter(Boolean);
    const assigned=this.courseAssignmentsFromTeacher();

    if(courseKeys.some(k=>assigned.includes(k))) return true;
    if(!values.length) return false;
    return values.some(v=>identities.includes(v));
  },

  isUnassigned(course){
    return !this.ownershipValues(course).length;
  }
};

const Courses = {
  lastScan: {total:0,matched:0,unassigned:0,queries:[],debug:""},

  database(){return TeacherEnv?.db?.() || null},

  resetDebug(){
    TeacherIdentity._cache=null;
    this.lastScan={total:0,matched:0,unassigned:0,queries:[],debug:TeacherIdentity.debugText()};
  },

  normalizeCourseDoc(d){
    const data=d.data ? d.data() : (d || {});
    const id=d.id || data.id || data.courseCode || data.name || "";
    return {id, __docId:id, ...data, id};
  },

  key(course){
    return TeacherIdentity.courseLabel(course) || course.__docId || course.id || course.name;
  },

  addCourse(map, course, source, allowUnassigned=false){
    if(!course) return;
    this.lastScan.total += 1;
    const isMine=TeacherIdentity.courseBelongsToTeacher(course);
    const unassigned=TeacherIdentity.isUnassigned(course);
    if(isMine || (allowUnassigned && unassigned)){
      const key=this.key(course);
      map.set(key,{...course,__courseKey:key,__unassigned:!isMine && unassigned,__source:source});
      if(isMine) this.lastScan.matched += 1;
      else this.lastScan.unassigned += 1;
    }
  },

  addSnapshotToMap(map,snap,source,allowUnassigned=false){
    if(!snap || !snap.docs) return;
    this.lastScan.queries.push(`${source}: ${snap.docs.length}`);
    snap.docs.forEach(d=>this.addCourse(map,this.normalizeCourseDoc(d),source,allowUnassigned));
  },

  async readTeacherAssignedCourses(map,database){
    const user=TeacherIdentity.user() || {};
    const ids=[user.uid, localStorage.getItem("SP_TEACHER_ID"), localStorage.getItem("SP_TEACHER_UID")].filter(Boolean);
    for(const tid of [...new Set(ids)]){
      try{
        const doc=await database.collection("teachers").doc(tid).get();
        if(doc && doc.exists){
          const data=doc.data() || {};
          const courseCodes=TeacherIdentity.collectValues([data.courses,data.kurse,data.courseCodes,data.assignedCourses,data.ownedCourses],[])
            .map(v=>String(v||"").trim()).filter(Boolean);
          this.lastScan.queries.push(`teachers/${tid} Kursliste: ${courseCodes.length}`);
          for(const code of [...new Set(courseCodes)]){
            try{
              const cdoc=await database.collection("courses").doc(code).get();
              if(cdoc && cdoc.exists) this.addCourse(map,this.normalizeCourseDoc(cdoc),`teachers/${tid}.courses`,true);
            }catch(e){}
          }
        }
      }catch(e){
        TeacherEnv?.note?.("Lehrerprofil konnte nicht für Kursliste gelesen werden", e);
      }
    }
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
    const email=TeacherIdentity.norm(user.email || localStorage.getItem("SP_TEACHER_EMAIL") || localStorage.getItem("SP_LOGIN_EMAIL"));
    const identities=TeacherIdentity.identityValues();
    const map=new Map();

    const eqQueries=[
      ["teacherUid",uid],["teacherId",uid],["teacherUID",uid],["teacher_id",uid],
      ["ownerUid",uid],["ownerId",uid],["createdByUid",uid],["createdById",uid],
      ["createdByTeacherUid",uid],["assignedTeacherId",uid],["assignedTeacherUid",uid],["lehrerId",uid],["lehrerUid",uid],
      ["teacherEmail",email],["ownerEmail",email],["createdByEmail",email],["createdByTeacherEmail",email],["assignedTeacherEmail",email],["lehrerEmail",email]
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
          // Feld nicht indexiert oder Array enthält Objekte. Fallback-Scan übernimmt das später, wenn Regeln es erlauben.
        }
      }
    }

    await this.readTeacherAssignedCourses(map,database);

    // Fallback: vollständiger Scan. Fremd zugewiesene Kurse bleiben verborgen; Kurse ohne Zuordnung werden angezeigt, damit alte eigene Kurse repariert werden können.
    try{
      this.addSnapshotToMap(map,await database.collection("courses").get(),"vollständiger Scan",true);
    }catch(e){
      TeacherEnv?.note?.("Kurse konnten nicht vollständig geladen werden. Prüfe Firestore-Regeln.", e);
    }

    const list=[...map.values()].sort((a,b)=>{
      const au=a.__unassigned?1:0, bu=b.__unassigned?1:0;
      if(au!==bu) return au-bu;
      const an=String(a.courseName||a.name||a.courseCode||a.id||"");
      const bn=String(b.courseName||b.name||b.courseCode||b.id||"");
      return an.localeCompare(bn,"de");
    });

    return list;
  },

  displayName(course){
    return String(course?.courseName || course?.name || course?.courseCode || course?.kurs || course?.kursnummer || course?.id || "Unbenannter Kurs");
  },

  code(course){
    return String(course?.courseCode || course?.code || course?.kurs || course?.kursnummer || course?.id || course?.name || "");
  },

  docId(course){
    return String(course?.__docId || course?.docId || course?.id || this.code(course) || "");
  },

  debugBox(){
    const d=this.lastScan || {};
    return `<div class="debug-box">
      <b>Keine eigenen Kurse gefunden.</b><br>
      <span>Gesucht wurde mit: ${TeacherEnv.safe(d.debug || TeacherIdentity.debugText())}</span><br>
      <span>Geprüfte Kurs-Treffer: ${TeacherEnv.safe(d.total || 0)} · passende Zuordnungen: ${TeacherEnv.safe(d.matched || 0)} · ohne Lehrer-Zuordnung: ${TeacherEnv.safe(d.unassigned || 0)}</span>
      ${Array.isArray(d.queries)&&d.queries.length?`<details><summary>Abfragen anzeigen</summary><div class="small">${d.queries.map(q=>TeacherEnv.safe(q)).join("<br>")}</div></details>`:""}
      <p class="small">Wenn ein eigener Kurs fehlt, hat das Kursdokument wahrscheinlich keine passende Lehrer-Zuordnung. Alte Kurse ohne Zuordnung werden jetzt angezeigt und können mit <b>Mir zuweisen</b> repariert werden.</p>
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
    const emailNorm=String(email||"").toLowerCase().trim();
    const displayName=user.displayName || teacher.name || teacher.fullName || `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`.trim() || email;

    await database.collection("courses").doc(name).set({
      name,
      courseName:name,
      courseCode:name,
      teacherUid:uid,
      teacherId:uid,
      ownerUid:uid,
      createdByUid:uid,
      createdByTeacherUid:uid,
      teacherEmail:emailNorm,
      ownerEmail:emailNorm,
      createdByEmail:emailNorm,
      createdByTeacherEmail:emailNorm,
      teacherName:displayName,
      teacherIds:[uid].filter(Boolean),
      teacherUids:[uid].filter(Boolean),
      teacherEmails:[emailNorm].filter(Boolean),
      teachers:[uid,emailNorm].filter(Boolean),
      assignedTeacherIds:[uid].filter(Boolean),
      assignedTeacherUids:[uid].filter(Boolean),
      assignedTeacherEmails:[emailNorm].filter(Boolean),
      assignedTeachers:[{uid,email:emailNorm,name:displayName}],
      enabledModules:{"Verben A1":true,"Wortschatz":true,"Fragen A1":true},
      enabledLessons:{},enabledTasks:{},enabledWords:{},enabledSets:{},enabledThemes:{},releases:{},
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    TeacherApp.render();
  },

  teacherAssignmentPayload(){
    const user=TeacherIdentity.user() || {};
    const teacher=TeacherIdentity.teacherProfile() || {};
    const uid=user.uid || teacher.uid || teacher.id || localStorage.getItem("SP_TEACHER_ID") || "";
    const email=(user.email || teacher.email || localStorage.getItem("SP_TEACHER_EMAIL") || "").toLowerCase().trim();
    const displayName=user.displayName || teacher.name || teacher.fullName || `${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`.trim() || email;
    return {
      teacherUid:uid, teacherId:uid, ownerUid:uid, createdByTeacherUid:uid,
      teacherEmail:email, ownerEmail:email, createdByTeacherEmail:email,
      teacherName:displayName,
      teacherIds:[uid].filter(Boolean), teacherUids:[uid].filter(Boolean), teacherEmails:[email].filter(Boolean),
      assignedTeacherIds:[uid].filter(Boolean), assignedTeacherUids:[uid].filter(Boolean), assignedTeacherEmails:[email].filter(Boolean),
      teachers:[uid,email].filter(Boolean), assignedTeachers:[{uid,email,name:displayName}],
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    };
  },

  async assignToMe(docId){
    const database=this.database();
    if(!database)return alert("Firebase ist nicht verbunden. Kurs kann nicht zugewiesen werden.");
    if(!docId)return alert("Kurs-ID fehlt.");
    if(!confirm(`Kurs ${docId} dir als Lehrerin zuweisen?`)) return;
    await database.collection("courses").doc(docId).set(this.teacherAssignmentPayload(),{merge:true});
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
