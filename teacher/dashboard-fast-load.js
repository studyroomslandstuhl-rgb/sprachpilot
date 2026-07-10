(function(){
  function norm(v){return String(v||'').trim().toLowerCase()}
  function uniquePairs(pairs){const seen=new Set();return pairs.filter(([f,v])=>{if(!f||!v)return false;const k=f+'|'+v;if(seen.has(k))return false;seen.add(k);return true})}
  async function getQuery(database,field,value){
    try{return await database.collection('courses').where(field,'==',value).get()}catch(e){return null}
  }
  async function getArrayQuery(database,field,value){
    try{return await database.collection('courses').where(field,'array-contains',value).get()}catch(e){return null}
  }
  function readCached(key){try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch(e){return null}}
  function writeCached(key,value){try{sessionStorage.setItem(key,JSON.stringify({t:Date.now(),value}))}catch(e){}}
  function fresh(cache,ms=120000){return cache&&cache.t&&Date.now()-cache.t<ms}

  if(window.Courses&&typeof Courses.list==='function'){
    const original=Courses.list.bind(Courses);
    Courses.list=async function(){
      const database=this.database();
      this.resetDebug();
      if(!database){TeacherEnv?.note?.('Kurse nicht geladen: Firestore ist nicht verbunden.');return []}
      const cache=readCached('SP_TEACHER_COURSES_FAST');
      if(fresh(cache))return cache.value||[];

      const user=TeacherIdentity.user()||{};
      const uid=norm(user.uid||localStorage.getItem('SP_TEACHER_ID')||localStorage.getItem('SP_TEACHER_UID'));
      const email=norm(user.email||localStorage.getItem('SP_TEACHER_EMAIL')||localStorage.getItem('SP_LOGIN_EMAIL'));
      const map=new Map();

      const directPairs=uniquePairs([
        ['teacherUid',uid],['teacherId',uid],['ownerUid',uid],['createdByUid',uid],['assignedTeacherUid',uid],['lehrerUid',uid],
        ['teacherEmail',email],['ownerEmail',email],['createdByEmail',email],['assignedTeacherEmail',email],['lehrerEmail',email]
      ]);
      const arrayPairs=uniquePairs([
        ['teacherIds',uid],['teacherUids',uid],['teacherEmails',email],['teachers',uid],['teachers',email],
        ['assignedTeacherIds',uid],['assignedTeacherUids',uid],['assignedTeacherEmails',email],['lehrerIds',uid],['lehrerUids',uid],['lehrerEmails',email]
      ]);

      const snaps=await Promise.allSettled([
        ...directPairs.map(([f,v])=>getQuery(database,f,v).then(s=>({snap:s,source:f+' == '+v}))),
        ...arrayPairs.map(([f,v])=>getArrayQuery(database,f,v).then(s=>({snap:s,source:f+' enthält '+v})))
      ]);
      snaps.forEach(r=>{if(r.status==='fulfilled'&&r.value&&r.value.snap)this.addSnapshotToMap(map,r.value.snap,r.value.source,false)});

      try{await this.readTeacherAssignedCourses(map,database)}catch(e){TeacherEnv?.note?.('Kursliste im Lehrerprofil konnte nicht schnell geladen werden',e)}

      if(!map.size){
        try{this.addSnapshotToMap(map,await database.collection('courses').get(),'Fallback-Scan',true)}catch(e){TeacherEnv?.note?.('Kurse konnten nicht vollständig geladen werden. Prüfe Firestore-Regeln.',e)}
      }

      const list=[...map.values()].sort((a,b)=>{
        const au=a.__unassigned?1:0,bu=b.__unassigned?1:0;if(au!==bu)return au-bu;
        const an=String(a.courseName||a.name||a.courseCode||a.id||'');
        const bn=String(b.courseName||b.name||b.courseCode||b.id||'');
        return an.localeCompare(bn,'de');
      });
      writeCached('SP_TEACHER_COURSES_FAST',list);
      return list;
    };
  }

  if(window.Students){
    ['list','progressList'].forEach(name=>{
      if(typeof Students[name]!=='function')return;
      const old=Students[name].bind(Students);
      Students[name]=async function(){
        const key='SP_TEACHER_'+name.toUpperCase()+'_CACHE';
        const cache=readCached(key);
        if(fresh(cache,60000))return cache.value||[];
        const value=await old();
        writeCached(key,value||[]);
        return value||[];
      };
    });
  }
})();