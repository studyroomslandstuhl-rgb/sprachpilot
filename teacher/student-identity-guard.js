(function(){
  'use strict';

  function uniq(values){
    return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))];
  }
  function normEmail(value){return String(value||'').trim().toLowerCase()}

  function install(){
    if(typeof Students==='undefined'||!Students||Students.__stableIdentityGuardV2)return;
    const originalUpdate=Students.updateStudent.bind(Students);

    Students.updateStudent=async function(studentId,data={}){
      const current=(window.__SP_STUDENTS_BY_ID&&window.__SP_STUDENTS_BY_ID[studentId])||{};
      const oldEmail=normEmail(current.email),newEmail=normEmail(data.email!==undefined?data.email:current.email);

      // Sobald ein Schülerprofil an Firebase Auth gebunden ist, darf die Lehrkraft
      // die Login-E-Mail nicht nur in Firestore ändern. Sonst würden Profil und
      // echte Authentifizierungsidentität auseinanderlaufen.
      if(String(current.authUid||'').trim()&&oldEmail&&newEmail&&oldEmail!==newEmail){
        const error=new Error('BOUND_STUDENT_EMAIL_CHANGE_REQUIRES_AUTH_UPDATE');
        try{TeacherEnv?.note?.('E-Mail konnte nicht geändert werden: Dieses Schülerkonto ist bereits sicher an Firebase Auth gebunden. Die Auth-E-Mail muss gemeinsam mit dem Profil geändert werden.',error)}catch(e){}
        throw error;
      }

      const oldLookupKeys=window.StudentSecurityLookup?.keysFor?.({...current,__docId:studentId,docId:studentId})||[];
      const aliases=uniq([
        studentId,
        ...(Array.isArray(current.aliasIds)?current.aliasIds:[]),
        current.canonicalStudentId,current.docId,current.studentId,current.userId,current.uid,current.id,
        ...(Array.isArray(data.aliasIds)?data.aliasIds:[]),
        data.canonicalStudentId,data.docId,data.studentId,data.userId,data.uid,data.id
      ]);

      const safeData={
        ...data,
        canonicalStudentId:studentId,
        docId:studentId,
        studentId,
        userId:studentId,
        aliasIds:aliases,
        identityVersion:Math.max(1,Number(current.identityVersion||data.identityVersion||0))
      };

      const result=await originalUpdate(studentId,safeData);
      const merged={...current,...safeData,__docId:studentId,id:studentId};

      // Fortschritts-Metadaten folgen einer Lehrer-Korrektur sofort. Lernstände,
      // Aufgaben, Prüfungen und Punkte werden dabei nicht angefasst.
      try{
        const database=Students.database?.();
        if(database){
          const course=String(safeData.kurs||safeData.kursnummer||safeData.courseCode||current.kurs||current.kursnummer||current.courseCode||'').trim();
          const email=normEmail(safeData.email||current.email);
          const patch={
            canonicalStudentId:studentId,
            docId:studentId,
            studentId,
            userId:studentId,
            aliasIds:aliases,
            identityVersion:safeData.identityVersion,
            updatedAt:firebase.firestore.FieldValue.serverTimestamp()
          };
          if(email)patch.email=email;
          if(course){patch.kurs=course;patch.kursnummer=course;patch.courseCode=course;}
          if(current.authUid)patch.authUid=current.authUid;
          if(current.authEmail)patch.authEmail=current.authEmail;
          await database.collection('progress').doc(studentId).set(patch,{merge:true});
        }
      }catch(error){
        TeacherEnv?.note?.('Fortschritts-Metadaten konnten nach der Schülerkorrektur noch nicht aktualisiert werden',error);
      }

      // Der direkte Sicherheits-Lookup wird mit derselben Korrektur atomar aus Sicht
      // des Workflows aktualisiert. Alte Lookup-Schlüssel dieses Schülers werden entfernt,
      // damit eine alte E-Mail/Kurs-Kombination kein Profil mehr beanspruchen kann.
      try{
        if(window.StudentSecurityLookup){
          await window.StudentSecurityLookup.writeKeysForStudent(merged,{replaceOldKeys:oldLookupKeys});
        }
      }catch(error){
        TeacherEnv?.note?.('Sicherheits-Lookup konnte nach der Schülerkorrektur nicht aktualisiert werden. Vor dem strikten Sicherheits-Cutover muss die Sicherheitsmigration erneut geprüft werden.',error);
        throw error;
      }

      return result;
    };

    Students.__stableIdentityGuardV1=true;
    Students.__stableIdentityGuardV2=true;
  }

  install();
})();
