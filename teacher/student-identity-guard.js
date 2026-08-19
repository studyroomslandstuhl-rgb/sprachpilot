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
      return originalUpdate(studentId,safeData);
    };

    Students.__stableIdentityGuardV1=true;
  }

  install();
})();
