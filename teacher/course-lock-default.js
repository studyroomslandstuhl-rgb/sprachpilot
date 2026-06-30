(function(){
  function install(){
    if(typeof Courses==="undefined"||Courses.__lockedDefaultCreate)return;
    Courses.__lockedDefaultCreate=true;
    Courses.create=async function(name){
      name=String(name||"").trim();
      if(!name)return alert("Bitte Kursnamen eingeben, z. B. GLK-68.");
      const database=this.database();
      if(!database)return alert("Firebase ist nicht verbunden. Kurs kann nicht gespeichert werden.");
      const user=TeacherIdentity.user()||{};
      const teacher=TeacherIdentity.teacherProfile()||{};
      const uid=user.uid||teacher.uid||teacher.id||localStorage.getItem("SP_TEACHER_ID")||"";
      const email=user.email||teacher.email||localStorage.getItem("SP_TEACHER_EMAIL")||"";
      const emailNorm=String(email||"").toLowerCase().trim();
      const displayName=user.displayName||teacher.name||teacher.fullName||`${teacher.vorname||teacher.firstName||""} ${teacher.nachname||teacher.lastName||""}`.trim()||email;
      await database.collection("courses").doc(name).set({
        name,courseName:name,courseCode:name,
        teacherUid:uid,teacherId:uid,ownerUid:uid,createdByUid:uid,createdByTeacherUid:uid,
        teacherEmail:emailNorm,ownerEmail:emailNorm,createdByEmail:emailNorm,createdByTeacherEmail:emailNorm,teacherName:displayName,
        teacherIds:[uid].filter(Boolean),teacherUids:[uid].filter(Boolean),teacherEmails:[emailNorm].filter(Boolean),teachers:[uid,emailNorm].filter(Boolean),
        assignedTeacherIds:[uid].filter(Boolean),assignedTeacherUids:[uid].filter(Boolean),assignedTeacherEmails:[emailNorm].filter(Boolean),assignedTeachers:[{uid,email:emailNorm,name:displayName}],
        releaseMode:"locked",defaultLocked:true,
        enabledModules:{"Verben A1":false,"Wortschatz":false,"Fragen A1":false},
        enabledLessons:{},enabledTasks:{},enabledWords:{},enabledSets:{},enabledThemes:{},releases:{},
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp()
      },{merge:true});
      TeacherApp.render();
    };
  }
  install();document.addEventListener("DOMContentLoaded",install);setTimeout(install,250);
})();
