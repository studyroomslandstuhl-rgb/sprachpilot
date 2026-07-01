(function(){
  function norm(v){return String(v||'').trim().toLowerCase();}
  function unique(a){return Array.from(new Set((a||[]).filter(Boolean)));}
  function getEnv(){try{if(typeof TeacherEnv!=='undefined')return TeacherEnv}catch(e){}return null;}
  function getDraft(){try{if(typeof ReleaseDraft!=='undefined')return ReleaseDraft}catch(e){}return null;}
  function valuesForCourse(R){
    var out=[];
    [R.courseCode,R.courseName].forEach(function(v){
      v=String(v||'').trim();
      if(v)out.push(v,v.toLowerCase(),v.toUpperCase());
    });
    return unique(out);
  }
  function belongsToCourse(s,values){
    var set=new Set(values.map(norm));
    return ['kurs','kursnummer','courseCode','courseDocId','courseId'].some(function(k){return set.has(norm(s&&s[k]))});
  }
  async function syncStudentAssignments(){
    try{
      var E=getEnv(),R=getDraft();
      if(!E||!R||!R.data)return 0;
      var database=E.db&&E.db();
      if(!database)return 0;
      var values=valuesForCourse(R);
      if(!values.length)return 0;
      var payload=JSON.parse(JSON.stringify(R.data||{}));
      payload.courseCode=R.courseCode||payload.courseCode||'';
      payload.courseDocId=R.courseName||payload.courseDocId||'';
      payload.source='teacher-release-dashboard';
      payload.updatedAt=new Date().toISOString();
      var snap=await database.collection('students').get();
      var batch=database.batch();
      var count=0;
      snap.docs.forEach(function(d){
        var s=d.data()||{};
        if(!belongsToCourse(s,values))return;
        batch.set(d.ref,{
          assignments:payload,
          courseCode:s.courseCode||R.courseCode||'',
          kurs:s.kurs||R.courseCode||R.courseName||'',
          kursnummer:s.kursnummer||s.kurs||R.courseCode||R.courseName||'',
          courseDocId:s.courseDocId||R.courseName||'',
          updatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
        count++;
      });
      if(count)await batch.commit();
      console.log('[SprachPilot] Freigabe an Schülerprofile synchronisiert',count);
      return count;
    }catch(e){
      console.warn('[SprachPilot] Freigabe-Sync zu Schülerprofilen fehlgeschlagen',e);
      return 0;
    }
  }
  function install(){
    var R=getDraft();
    if(!R||R.__studentSyncV2Installed)return;
    R.__studentSyncV2Installed=true;
    var old=R.save&&R.save.bind(R);
    R.save=async function(){
      var res;
      if(old)res=await old();
      await syncStudentAssignments();
      return res;
    };
    R.syncStudentAssignments=syncStudentAssignments;
  }
  install();
  document.addEventListener('DOMContentLoaded',install);
  setTimeout(install,100);
  setTimeout(install,500);
  setTimeout(install,1000);
})();