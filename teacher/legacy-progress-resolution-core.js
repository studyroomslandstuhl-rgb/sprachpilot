(function(root){
  'use strict';
  if(root.LegacyProgressResolutionCore)return;

  const SAFE_MAPPINGS=[
    {progressId:'a-1_nelia',studentId:'a-1_nelia_roiko_1995-04-30',expectedName:'nelia roiko',expectedCourse:'a-1'},
    {progressId:'b174698_alisa_krekoten',studentId:'b174698_studyroomslandstuhl-gmail-com',expectedName:'alisa krekoten',expectedEmail:'studyroomslandstuhl@gmail.com',expectedCourse:'b174698'},
    {progressId:'b174698_nataliia_diukova',studentId:'174698_nataliia_diukova_1990-11-24',expectedName:'nataliia diukova',expectedCourse:'b174698'},
    {progressId:'b174698_studyroomslandstuhl_gmail_com_studyroomslandstuhl_gmail_com_b174698',studentId:'b174698_studyroomslandstuhl-gmail-com',expectedName:'alisa krekoten',expectedEmail:'studyroomslandstuhl@gmail.com',expectedCourse:'b174698'},
    {progressId:'glk-68_alisa_feldbusch',studentId:'glk-68_alicekrekoten-gmail-com',expectedName:'alisa krekoten',expectedEmail:'alicekrekoten@gmail.com',expectedCourse:'glk-68'},
    {progressId:'glk-68_studyroomslandstuhl-gmail-com',studentId:'glk-68_alicekrekoten-gmail-com',expectedName:'alisa krekoten',expectedEmail:'alicekrekoten@gmail.com',expectedCourse:'glk-68'},
    {progressId:'glk-68_emmad',studentId:'glk-68_emmad_abo-hjazi_1982-01-02',expectedName:'emmad abo hjazi',expectedCourse:'glk-68'}
  ];

  const ARCHIVE_IDS=[
    'student',
    'test1_mariamustermann-gmail-com',
    'test_bogdan-feldbusch-gmail-com',
    'test_maria_mustermann',
    'zlk-1_maria_mustermann'
  ];

  const VLAD={
    canonicalId:'b174698_777vonychka777-gmail-com',
    duplicateId:'b174698_vlad_nemohushchyi',
    expectedEmail:'777vonychka777@gmail.com',
    expectedCourse:'b174698'
  };

  const MANUAL={
    shaza:{
      progressId:'a1_shaza_alshikh_1975-05-17',
      label:'Shaza Alshikh · alter A1-Fortschritt',
      options:[
        {value:'b174698_shazaalshikh2-gmail-com',label:'Shaza Alshikh · shazaalshikh2@gmail.com · B174698'},
        {value:'archive',label:'Nicht sicher: Fortschritt archivieren und erhalten'}
      ]
    },
    tetiana:{
      progressId:'b174698_tetiana_lavrynenko_1979-04-07',
      label:'Tetiana Lavrynenko · 07.04.1979',
      options:[
        {value:'b174698_galbon1951-gmail-com',label:'Tetiana Lavrynenko · galbon1951@gmail.com · B174698'},
        {value:'b174698_tetiana_lavrynenko',label:'Tetiana Lavrynenko · bondylove1@gmail.com · B174698'},
        {value:'archive',label:'Nicht sicher: Fortschritt archivieren und erhalten'}
      ]
    }
  };

  function text(value){return String(value==null?'':value).trim()}
  function lower(value){return text(value).toLowerCase()}
  function uniq(values){return [...new Set((values||[]).map(text).filter(Boolean))]}
  function studentId(row={}){return text(row.__docId||row.canonicalStudentId||row.docId||row.studentId||row.userId||row.id)}
  function progressId(row={}){return text(row.__docId||row.id)}
  function nameOf(row={}){return lower([row.vorname,row.nachname].map(text).filter(Boolean).join(' '))}
  function emailOf(row={}){return lower(row.email||row.authEmail)}
  function courses(row={}){return uniq([row.courseDocId,row.courseCode,row.kurs,row.kursnummer,row.course]).map(lower)}
  function identityValues(row={}){return uniq([row.canonicalStudentId,row.docId,row.studentId,row.userId,row.id])}
  function stripInternal(data={}){const out={};for(const[k,v]of Object.entries(data||{})){if(!k.startsWith('__'))out[k]=v}return out}

  function indexRows(rows=[],idFn){return new Map((rows||[]).map(row=>[idFn(row),row]).filter(([id])=>id))}

  function validateTarget(student,mapping){
    if(!student)throw new Error('LEGACY_TARGET_STUDENT_MISSING:'+mapping.studentId);
    if(text(student.authUid))throw new Error('LEGACY_TARGET_ALREADY_AUTH_BOUND:'+mapping.studentId);
    if(mapping.expectedName&&nameOf(student)!==mapping.expectedName)throw new Error('LEGACY_TARGET_NAME_MISMATCH:'+mapping.studentId);
    if(mapping.expectedEmail&&emailOf(student)!==mapping.expectedEmail)throw new Error('LEGACY_TARGET_EMAIL_MISMATCH:'+mapping.studentId);
    if(mapping.expectedCourse&&!courses(student).includes(mapping.expectedCourse))throw new Error('LEGACY_TARGET_COURSE_MISMATCH:'+mapping.studentId);
    return true;
  }

  function validateProgress(progress,id){
    if(!progress)throw new Error('LEGACY_PROGRESS_MISSING:'+id);
    if(text(progress.authUid))throw new Error('LEGACY_PROGRESS_ALREADY_AUTH_BOUND:'+id);
    return true;
  }

  function mergeVlad(canonical,duplicate){
    if(!canonical)throw new Error('VLAD_CANONICAL_MISSING');
    if(!duplicate)return null;
    if(text(canonical.authUid)||text(duplicate.authUid))throw new Error('VLAD_AUTH_BOUND');
    if(emailOf(canonical)!==VLAD.expectedEmail||emailOf(duplicate)!==VLAD.expectedEmail)throw new Error('VLAD_EMAIL_MISMATCH');
    if(!courses(canonical).includes(VLAD.expectedCourse)||!courses(duplicate).includes(VLAD.expectedCourse))throw new Error('VLAD_COURSE_MISMATCH');
    const merged={...stripInternal(canonical)};
    const source=stripInternal(duplicate);
    for(const[k,v]of Object.entries(source)){
      if((merged[k]==null||merged[k]===''||(Array.isArray(merged[k])&&merged[k].length===0))&&v!=null&&v!=='')merged[k]=v;
    }
    merged.id=VLAD.canonicalId;
    merged.canonicalStudentId=VLAD.canonicalId;
    merged.docId=VLAD.canonicalId;
    merged.studentId=VLAD.canonicalId;
    merged.userId=VLAD.canonicalId;
    merged.aliasIds=uniq([
      ...(Array.isArray(canonical.aliasIds)?canonical.aliasIds:[]),
      ...(Array.isArray(duplicate.aliasIds)?duplicate.aliasIds:[]),
      VLAD.duplicateId,
      ...identityValues(duplicate)
    ]).filter(id=>id!==VLAD.canonicalId);
    merged.identityVersion=Math.max(2,Number(merged.identityVersion||0));
    merged.legacyResolutionVersion=1;
    merged.legacyResolutionKey='vlad-b174698';
    delete merged.authUid;
    delete merged.authEmail;
    delete merged.authVersion;
    delete merged.authLinkedAt;
    return merged;
  }

  function buildPlan(students=[],progress=[]){
    const byStudent=indexRows(students,studentId),byProgress=indexRows(progress,progressId);
    const mappings=[];
    for(const mapping of SAFE_MAPPINGS){
      const row=byProgress.get(mapping.progressId);
      if(!row)continue;
      validateProgress(row,mapping.progressId);
      const target=byStudent.get(mapping.studentId);
      validateTarget(target,mapping);
      mappings.push({mapping,progress:row,target});
    }

    const archives=[];
    for(const id of ARCHIVE_IDS){
      const row=byProgress.get(id);if(!row)continue;
      validateProgress(row,id);
      archives.push({id,progress:row});
    }

    const canonical=byStudent.get(VLAD.canonicalId),duplicate=byStudent.get(VLAD.duplicateId);
    const mergedVlad=mergeVlad(canonical,duplicate);

    const manual={};
    for(const [key,item] of Object.entries(MANUAL)){
      const row=byProgress.get(item.progressId);
      if(row)validateProgress(row,item.progressId);
      manual[key]={...item,progress:row||null};
      for(const option of item.options){
        if(option.value==='archive')continue;
        const target=byStudent.get(option.value);
        if(!target)throw new Error('MANUAL_TARGET_MISSING:'+option.value);
        if(text(target.authUid))throw new Error('MANUAL_TARGET_AUTH_BOUND:'+option.value);
      }
    }

    return{mappings,archives,vlad:{canonical,duplicate,merged:mergedVlad},manual};
  }

  function mappingPatch(studentId){
    return{canonicalStudentId:studentId,securityArchived:false,securityResolutionVersion:1,securityResolutionType:'mapped'};
  }
  function archivePatch(reason='legacy-unassigned'){
    return{securityArchived:true,securityArchiveReason:reason,securityResolutionVersion:1,securityResolutionType:'archived'};
  }

  root.LegacyProgressResolutionCore={
    SAFE_MAPPINGS,ARCHIVE_IDS,VLAD,MANUAL,text,lower,uniq,studentId,progressId,nameOf,emailOf,courses,identityValues,stripInternal,
    validateTarget,validateProgress,mergeVlad,buildPlan,mappingPatch,archivePatch
  };
})(typeof window!=='undefined'?window:globalThis);
