(function(root){
  'use strict';
  if(root.StudentCollisionRepairCore)return;

  const GROUPS=[
    {
      key:'alona-vakulenko-b174698',
      name:'Alona Vakulenko',
      email:'apazderina0@gmail.com',
      course:'B174698',
      canonicalId:'b174698_alona_vakulenko_1996-12-06',
      duplicateIds:['a1_alona_vakulenko_1996-12-06','kurs_student'],
      profileSourcePriority:['a1_alona_vakulenko_1996-12-06','kurs_student']
    },
    {
      key:'shilan-mohamad-b174698',
      name:'Shilan Mohamad',
      email:'shilan.mohammad1010@gmail.com',
      course:'B174698',
      canonicalId:'B174698_shilan_mohamad_1999-01-24',
      duplicateIds:['z-b-a1-07_shilan_mohamad_1999-01-24'],
      profileSourcePriority:['z-b-a1-07_shilan_mohamad_1999-01-24']
    }
  ];

  function text(value){return String(value==null?'':value).trim()}
  function lower(value){return text(value).toLowerCase()}
  function uniq(values){return [...new Set((values||[]).map(text).filter(Boolean))]}
  function stripInternal(data={}){const out={};for(const[k,v]of Object.entries(data||{})){if(!k.startsWith('__'))out[k]=v}return out}
  function studentId(data={}){return text(data.__docId||data.canonicalStudentId||data.docId||data.studentId||data.userId||data.id)}
  function progressId(data={}){return text(data.__docId||data.id)}
  function identityValues(data={}){return uniq([data.canonicalStudentId,data.docId,data.studentId,data.userId,data.id])}
  function courseValues(data={}){return uniq([data.courseDocId,data.courseCode,data.kurs,data.kursnummer,data.course])}
  function emailOf(data={}){return lower(data.email||data.authEmail)}
  function hasCourse(data={},course=''){const wanted=lower(course);return !!wanted&&courseValues(data).some(v=>lower(v)===wanted)}
  function isEmpty(value){
    if(value==null)return true;
    if(typeof value==='string')return value.trim()==='';
    if(Array.isArray(value))return value.length===0;
    return false;
  }

  function byStudentId(students=[]){return new Map((students||[]).map(s=>[studentId(s),s]).filter(([id])=>id))}

  function legacyIdsFor(records=[],canonicalId=''){
    return uniq(records.flatMap(s=>[
      studentId(s),
      ...(Array.isArray(s.aliasIds)?s.aliasIds:[]),
      ...identityValues(s)
    ])).filter(id=>id!==canonicalId);
  }

  function progressKeys(progress={}){
    return uniq([
      progressId(progress),
      ...(Array.isArray(progress.aliasIds)?progress.aliasIds:[]),
      ...identityValues(progress)
    ]);
  }

  function relatedProgress(progressDocs=[],records=[],config){
    const legacy=new Set(uniq([config.canonicalId,...legacyIdsFor(records,config.canonicalId)]));
    const result=[];
    for(const progress of progressDocs||[]){
      const direct=progressKeys(progress).some(key=>legacy.has(key));
      const sameEmail=emailOf(progress)===lower(config.email);
      const sameCourse=hasCourse(progress,config.course);
      if(direct||(sameEmail&&sameCourse))result.push(progress);
    }
    return result;
  }

  function acceptableIndexError(error={},groupIdSets=[]){
    if(error.type!=='duplicate-student-alias')return false;
    const a=text(error.studentId),b=text(error.otherStudentId);
    return groupIdSets.some(set=>set.has(a)&&set.has(b));
  }

  function preflight(students=[],progressDocs=[],resolver=null){
    const byId=byStudentId(students),groups=[],groupIdSets=[];
    for(const config of GROUPS){
      const canonical=byId.get(config.canonicalId);
      if(!canonical)throw new Error('COLLISION_CANONICAL_MISSING:'+config.canonicalId);
      const duplicateRecords=config.duplicateIds.map(id=>byId.get(id)).filter(Boolean);
      const allRecords=[canonical,...duplicateRecords];
      const ids=new Set([config.canonicalId,...config.duplicateIds]);
      groupIdSets.push(ids);

      for(const record of allRecords){
        if(text(record.authUid))throw new Error('COLLISION_AUTH_BOUND:'+studentId(record));
        const mail=emailOf(record);
        if(mail&&mail!==lower(config.email))throw new Error('COLLISION_EMAIL_MISMATCH:'+studentId(record));
        const rid=studentId(record);
        if(rid!==config.canonicalId&&rid!=='kurs_student'&&!hasCourse(record,config.course)){
          throw new Error('COLLISION_COURSE_MISMATCH:'+rid);
        }
      }

      const samePersonUnexpected=(students||[]).filter(record=>{
        const id=studentId(record);
        return !ids.has(id)&&emailOf(record)===lower(config.email)&&hasCourse(record,config.course);
      });
      if(samePersonUnexpected.length){
        throw new Error('COLLISION_UNEXPECTED_PROFILE:'+samePersonUnexpected.map(studentId).join(','));
      }

      const progress=relatedProgress(progressDocs,allRecords,config);
      groups.push({
        config,canonical,duplicateRecords,allRecords,progress,
        legacyIds:legacyIdsFor(allRecords,config.canonicalId)
      });
    }

    if(resolver?.resolveOwnership){
      const resolution=resolver.resolveOwnership(students,progressDocs);
      const unexpectedIndex=(resolution.indexErrors||[]).filter(error=>!acceptableIndexError(error,groupIdSets));
      if(unexpectedIndex.length)throw new Error('COLLISION_UNEXPECTED_INDEX_ERROR:'+JSON.stringify(unexpectedIndex[0]));
      if((resolution.failures||[]).length)throw new Error('COLLISION_UNEXPECTED_PROGRESS_ERROR:'+JSON.stringify(resolution.failures[0]));
    }

    return{groups,duplicateCount:groups.reduce((n,g)=>n+g.duplicateRecords.length,0)};
  }

  function mergeStudent(group){
    const config=group.config,canonical=stripInternal(group.canonical);
    const byId=new Map(group.allRecords.map(r=>[studentId(r),r]));
    const merged={...canonical};
    for(const id of config.profileSourcePriority){
      const source=stripInternal(byId.get(id)||{});
      for(const[k,v]of Object.entries(source)){
        if(isEmpty(merged[k])&&!isEmpty(v))merged[k]=v;
      }
    }
    const aliases=uniq([
      ...(Array.isArray(merged.aliasIds)?merged.aliasIds:[]),
      ...group.legacyIds,
      ...group.progress.map(progressId)
    ]).filter(id=>id!==config.canonicalId);

    merged.id=config.canonicalId;
    merged.canonicalStudentId=config.canonicalId;
    merged.docId=config.canonicalId;
    merged.studentId=config.canonicalId;
    merged.userId=config.canonicalId;
    merged.aliasIds=aliases;
    merged.email=lower(config.email);
    merged.kurs=config.course;
    merged.kursnummer=config.course;
    merged.courseCode=config.course;
    merged.active=true;
    merged.identityVersion=Math.max(2,Number(merged.identityVersion||0));
    merged.collisionRepairVersion=1;
    merged.collisionRepairKey=config.key;
    delete merged.__docId;
    delete merged.authUid;
    delete merged.authEmail;
    delete merged.authVersion;
    delete merged.authLinkedAt;
    return merged;
  }

  function plan(students=[],progressDocs=[],resolver=null){
    const checked=preflight(students,progressDocs,resolver);
    return{
      ...checked,
      groups:checked.groups.map(group=>({
        ...group,
        mergedStudent:mergeStudent(group),
        relatedProgressIds:group.progress.map(progressId)
      }))
    };
  }

  root.StudentCollisionRepairCore={
    GROUPS,text,lower,uniq,stripInternal,studentId,progressId,identityValues,courseValues,emailOf,hasCourse,
    legacyIdsFor,progressKeys,relatedProgress,acceptableIndexError,preflight,mergeStudent,plan
  };
})(typeof window!=='undefined'?window:globalThis);
