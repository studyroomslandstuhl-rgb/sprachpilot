(function(){
  'use strict';

  function uniq(values){
    return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))];
  }

  function install(){
    if(typeof Students==='undefined' || !Students || Students.__stableIdentityGuardV1)return;
    const originalUpdate=Students.updateStudent.bind(Students);

    Students.updateStudent=async function(studentId,data={}){
      const current=(window.__SP_STUDENTS_BY_ID&&window.__SP_STUDENTS_BY_ID[studentId])||{};
      const aliases=uniq([
        studentId,
        ...(Array.isArray(current.aliasIds)?current.aliasIds:[]),
        current.canonicalStudentId,current.docId,current.studentId,current.userId,current.uid,current.id,
        ...(Array.isArray(data.aliasIds)?data.aliasIds:[]),
        data.canonicalStudentId,data.docId,data.studentId,data.userId,data.uid,data.id
      ]);

      // Der Firestore-Dokumentname ist die unveränderliche technische Identität.
      // E-Mail, Kurs, Name und Muttersprache dürfen geändert werden, die ID niemals.
      const safeData={
        ...data,
        canonicalStudentId:studentId,
        docId:studentId,
        studentId,
        userId:studentId,
        aliasIds:aliases,
        identityVersion:1
      };

      const result=await originalUpdate(studentId,safeData);

      // Fortschritts-Metadaten folgen einer Lehrer-Korrektur sofort. Lernstände,
      // Aufgaben, Prüfungen und Punkte werden dabei nicht angefasst.
      try{
        const database=Students.database?.();
        if(database){
          const course=String(safeData.kurs||safeData.kursnummer||safeData.courseCode||current.kurs||current.kursnummer||current.courseCode||'').trim();
          const email=String(safeData.email||current.email||'').trim().toLowerCase();
          const patch={
            canonicalStudentId:studentId,
            docId:studentId,
            studentId,
            userId:studentId,
            aliasIds:aliases,
            identityVersion:1,
            updatedAt:firebase.firestore.FieldValue.serverTimestamp()
          };
          if(email)patch.email=email;
          if(course){patch.kurs=course;patch.kursnummer=course;patch.courseCode=course;}
          await database.collection('progress').doc(studentId).set(patch,{merge:true});
        }
      }catch(error){
        TeacherEnv?.note?.('Fortschritts-Metadaten konnten nach der Schülerkorrektur noch nicht aktualisiert werden',error);
      }

      return result;
    };

    Students.__stableIdentityGuardV1=true;
  }

  install();
})();
