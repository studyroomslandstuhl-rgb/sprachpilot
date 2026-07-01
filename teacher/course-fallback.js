(function(){
  function codeFrom(row){
    return String(row?.kurs||row?.kursnummer||row?.courseCode||row?.courseId||row?.courseName||"").trim();
  }
  function virtualCourse(code,source){
    return {id:code,__docId:code,courseCode:code,code:code,kurs:code,kursnummer:code,name:code,courseName:code,__virtual:true,__unassigned:false,__source:source||"student-course-code"};
  }
  async function readCourseCodesFrom(collectionName,database,map){
    try{
      const snap=await database.collection(collectionName).get();
      snap.docs.forEach(doc=>{
        const data=doc.data()||{};
        const direct=codeFrom(data);
        if(direct&&!map.has(direct))map.set(direct,virtualCourse(direct,collectionName));
        const profile=data.profile||data.student||{};
        const nested=codeFrom(profile);
        if(nested&&!map.has(nested))map.set(nested,virtualCourse(nested,collectionName+" profile"));
      });
    }catch(e){
      try{TeacherEnv?.note?.("Kurse konnten nicht aus "+collectionName+" abgeleitet werden",e)}catch(_e){}
    }
  }
  function install(){
    if(!window.Courses||Courses.__studentFallbackInstalled)return;
    Courses.__studentFallbackInstalled=true;
    const oldList=Courses.list.bind(Courses);
    Courses.list=async function(){
      const existing=await oldList();
      if(existing&&existing.length)return existing;
      const database=this.database&&this.database();
      if(!database)return existing||[];
      const map=new Map();
      await readCourseCodesFrom("students",database,map);
      await readCourseCodesFrom("progress",database,map);
      const inferred=[...map.values()].sort((a,b)=>String(a.courseCode).localeCompare(String(b.courseCode),"de"));
      if(inferred.length){
        try{
          this.lastScan=this.lastScan||{};
          this.lastScan.matched=inferred.length;
          this.lastScan.queries=[...(this.lastScan.queries||[]),"Kurse aus Schüler-/Fortschrittsdaten: "+inferred.length];
          TeacherEnv?.note?.("Kurse wurden aus Schülerdaten abgeleitet, weil keine Kursdokumente gefunden wurden.");
        }catch(e){}
      }
      return inferred;
    };
  }
  install();
  document.addEventListener("DOMContentLoaded",install);
})();
