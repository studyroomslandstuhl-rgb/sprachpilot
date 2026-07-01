(function(){
  function norm(v){return String(v||'').trim().toLowerCase();}
  function uniq(a){return Array.from(new Set((a||[]).filter(Boolean)));}
  function codeValues(){
    var out=[];
    try{
      var c=ReleaseDraft.courseCode||'';
      var d=ReleaseDraft.courseName||'';
      [c,d].forEach(function(v){v=String(v||'').trim();if(v)out.push(v,v.toLowerCase(),v.toUpperCase())});
    }catch(e){}
    return uniq(out);
  }
  function sameCourse(student,values){
    var set=new Set(values.map(norm));
    return ['kurs','kursnummer','courseCode','courseDocId','courseId'].some(function(k){return set.has(norm(student&&student[k]))});
  }
  async function syncStudents(){
    try{
      if(!window.TeacherEnv||!window.ReleaseDraft)return 0;
      var database=TeacherEnv.db&&TeacherEnv.db();
      if(!database||!ReleaseDraft.data)return 0;
      var values=codeValues();
      if(!values.length)return 0;
      var payload=JSON.parse(JSON.stringify(ReleaseDraft.data||{}));
      payload.courseCode=ReleaseDraft.courseCode||payload.courseCode||'';
      payload.courseDocId=ReleaseDraft.courseName||payload.courseDocId||'';
      payload.updatedAt=new Date().toISOString();
      payload.source='teacher-release-dashboard';
      var snap=await database.collection('students').get();
      var batch=database.batch();
      var count=0;
      snap.docs.forEach(function(doc){
        var s=doc.data()||{};
        if(!sameCourse(s,values))return;
        batch.set(doc.ref,{
          assignments:payload,
          courseCode:s.courseCode||ReleaseDraft.courseCode||'',
          kurs:s.kurs||ReleaseDraft.courseCode||ReleaseDraft.courseName||'',
          kursnummer:s.kursnummer||s.kurs||ReleaseDraft.courseCode||ReleaseDraft.courseName||'',
          courseDocId:s.courseDocId||ReleaseDraft.courseName||'',
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
        count++;
      });
      if(count)await batch.commit();
      console.log('[SprachPilot] Kursfreigabe in Schülerprofile synchronisiert:',count);
      return count;
    }catch(e){
      console.warn('[SprachPilot] Schüler-Freigabe-Sync fehlgeschlagen',e);
      return 0;
    }
  }
  function install(){
    if(!window.ReleaseDraft||ReleaseDraft.__studentSyncInstalled)return;
    ReleaseDraft.__studentSyncInstalled=true;
    var oldSave=ReleaseDraft.save&&ReleaseDraft.save.bind(ReleaseDraft);
    ReleaseDraft.save=async function(){
      var result;
      if(oldSave)result=await oldSave();
      await syncStudents();
      return result;
    };
    ReleaseDraft.syncStudents=syncStudents;
  }
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
  setTimeout(install,500);
})();