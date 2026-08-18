(function(){
'use strict';
if(window.__SP_TEACHER_PROGRESS_DOCID_FIX_V1)return;
window.__SP_TEACHER_PROGRESS_DOCID_FIX_V1=true;
if(!window.Students)return;
Students.list=async function(){
 const database=this.database();
 if(!database){TeacherEnv?.note?.('Schüler nicht geladen: Firestore ist nicht verbunden.');return []}
 try{
  const snap=await database.collection('students').get();
  return snap.docs.map(d=>({...(d.data()||{}),id:d.id,docId:d.id,__docId:d.id}));
 }catch(e){TeacherEnv?.note?.('Schüler konnten nicht geladen werden',e);return []}
};
Students.progressList=async function(){
 const database=this.database();
 if(!database){TeacherEnv?.note?.('Fortschritt nicht geladen: Firestore ist nicht verbunden.');return []}
 try{
  let snap;
  try{snap=await database.collection('progress').get({source:'server'})}
  catch(serverError){TeacherEnv?.note?.('Firestore-Serverdaten konnten nicht direkt geladen werden; Fallback wird verwendet.',serverError);snap=await database.collection('progress').get()}
  const rows=snap.docs.map(d=>({...(d.data()||{}),id:d.id,docId:d.id,__docId:d.id}));
  try{sessionStorage.removeItem('SP_TEACHER_PROGRESSLIST_CACHE');sessionStorage.setItem('SP_TEACHER_PROGRESS_LAST_SERVER',new Date().toISOString())}catch(e){}
  return rows;
 }catch(e){TeacherEnv?.note?.('Fortschritt konnte nicht geladen werden',e);return []}
};
})();