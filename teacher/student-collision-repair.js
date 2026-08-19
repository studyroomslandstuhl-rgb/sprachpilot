(function(root){
  'use strict';
  if(root.StudentCollisionRepair)return;

  const REPAIR_VERSION=1;
  const SETTINGS_DOC='studentSecurity';

  function core(){return root.StudentCollisionRepairCore||null}
  function resolver(){return root.ProgressSecurityAliasCore||null}
  function database(){try{return Students?.database?.()||firebase.firestore()}catch(e){return null}}
  function now(){return firebase.firestore.FieldValue.serverTimestamp()}
  function text(value){return String(value==null?'':value).trim()}

  function hash(value){
    let h=2166136261>>>0;
    for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)>>>0}
    return h.toString(16).padStart(8,'0');
  }

  function backupId(kind,path){return `student-collision-v${REPAIR_VERSION}-${kind}-${hash(path)}`}

  async function readState(){
    const db=database(),c=core();
    if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!c)throw new Error('COLLISION_REPAIR_CORE_MISSING');
    const [studentsSnap,progressSnap,settingsSnap]=await Promise.all([
      db.collection('students').get(),
      db.collection('progress').get(),
      db.collection('settings').doc(SETTINGS_DOC).get()
    ]);
    return{
      db,
      students:studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      progress:progressSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      settings:settingsSnap.exists?settingsSnap.data()||{}:null,
      settingsExists:settingsSnap.exists
    };
  }

  async function saveBackup(db,{kind,path,groupKey='',canonicalId='',snapshot=null,exists=true}){
    const ref=db.collection('diagnostics').doc(backupId(kind,path));
    const old=await ref.get();
    if(!old.exists){
      await ref.set({
        backupType:'student-collision-repair',repairVersion:REPAIR_VERSION,kind,path,groupKey,canonicalId,
        sourceExists:exists===true,snapshot:snapshot||null,backedUpAt:now()
      });
    }else{
      const data=old.data()||{};
      if(data.backupType!=='student-collision-repair'||Number(data.repairVersion||0)!==REPAIR_VERSION||text(data.path)!==path){
        throw new Error('COLLISION_BACKUP_ID_CONFLICT:'+path);
      }
    }
    const verify=await ref.get();
    if(!verify.exists)throw new Error('COLLISION_BACKUP_VERIFY_FAILED:'+path);
    return ref.id;
  }

  async function backupPlan(state,plan){
    const c=core(),seen=new Set(),backupIds=[];
    for(const group of plan.groups){
      for(const student of group.allRecords){
        const id=c.studentId(student),path=`students/${id}`;
        if(seen.has(path))continue;seen.add(path);
        backupIds.push(await saveBackup(state.db,{kind:'student',path,groupKey:group.config.key,canonicalId:group.config.canonicalId,snapshot:c.stripInternal(student),exists:true}));
      }
      for(const row of group.progress){
        const id=c.progressId(row),path=`progress/${id}`;
        if(seen.has(path))continue;seen.add(path);
        backupIds.push(await saveBackup(state.db,{kind:'progress',path,groupKey:group.config.key,canonicalId:group.config.canonicalId,snapshot:c.stripInternal(row),exists:true}));
      }
    }
    if(!seen.has(`settings/${SETTINGS_DOC}`)){
      backupIds.push(await saveBackup(state.db,{kind:'settings',path:`settings/${SETTINGS_DOC}`,snapshot:state.settings,exists:state.settingsExists}));
    }
    return backupIds;
  }

  function mergedProgress(group){
    const c=core();
    if(typeof Students==='undefined'||typeof Students.mergeProgressRows!=='function')throw new Error('PROGRESS_MERGE_FUNCTION_MISSING');
    let merged={};
    for(const row of group.progress){
      const data={...c.stripInternal(row),id:c.progressId(row)};
      merged=Students.mergeProgressRows(merged,data);
    }
    merged=c.stripInternal(merged);
    const aliases=c.uniq([
      ...(Array.isArray(merged.aliasIds)?merged.aliasIds:[]),
      ...(Array.isArray(group.mergedStudent.aliasIds)?group.mergedStudent.aliasIds:[]),
      ...group.relatedProgressIds
    ]).filter(id=>id!==group.config.canonicalId);
    merged.canonicalStudentId=group.config.canonicalId;
    merged.docId=group.config.canonicalId;
    merged.studentId=group.config.canonicalId;
    merged.userId=group.config.canonicalId;
    merged.aliasIds=aliases;
    merged.email=group.config.email;
    merged.kurs=group.config.course;
    merged.kursnummer=group.config.course;
    merged.courseCode=group.config.course;
    merged.identityVersion=Math.max(2,Number(merged.identityVersion||0));
    merged.progressAliasVersion=Math.max(1,Number(merged.progressAliasVersion||0));
    merged.collisionRepairVersion=REPAIR_VERSION;
    merged.collisionRepairKey=group.config.key;
    merged.collisionMergedFrom=c.uniq(group.relatedProgressIds);
    delete merged.id;
    delete merged.__docId;
    delete merged.authUid;
    delete merged.authEmail;
    delete merged.authVersion;
    delete merged.authLinkedAt;
    return merged;
  }

  async function setStatus(db,status,details={}){
    await db.collection('settings').doc(SETTINGS_DOC).set({
      studentLookupReady:false,
      progressAliasReady:false,
      historicalCollisionRepairVersion:REPAIR_VERSION,
      historicalCollisionRepairStatus:String(status||'').slice(0,80),
      historicalCollisionRepairGroups:Number(details.groups||0),
      historicalCollisionRepairDuplicates:Number(details.duplicates||0),
      historicalCollisionRepairUpdatedAt:now()
    },{merge:true});
  }

  async function applyStudentIdentityBatch(state,plan){
    const batch=state.db.batch(),stamp=now();
    for(const group of plan.groups){
      const canonicalRef=state.db.collection('students').doc(group.config.canonicalId);
      batch.set(canonicalRef,{...group.mergedStudent,collisionRepairAt:stamp,updatedAt:stamp});
      for(const duplicate of group.duplicateRecords){
        batch.delete(state.db.collection('students').doc(core().studentId(duplicate)));
      }
    }
    await batch.commit();
  }

  async function rollbackStudents(state,plan){
    const batch=state.db.batch();
    for(const group of plan.groups){
      for(const original of group.allRecords){
        const id=core().studentId(original);
        batch.set(state.db.collection('students').doc(id),core().stripInternal(original));
      }
    }
    await batch.commit();
  }

  async function verifyStudentIdentityRepair(state,plan){
    const c=core(),canonicalChecks=[];
    for(const group of plan.groups){
      const canonicalSnap=await state.db.collection('students').doc(group.config.canonicalId).get();
      if(!canonicalSnap.exists)throw new Error('COLLISION_CANONICAL_WRITE_MISSING:'+group.config.canonicalId);
      const data=canonicalSnap.data()||{},aliases=new Set(Array.isArray(data.aliasIds)?data.aliasIds:[]);
      if(text(data.canonicalStudentId)!==group.config.canonicalId||text(data.docId)!==group.config.canonicalId||text(data.studentId)!==group.config.canonicalId||text(data.userId)!==group.config.canonicalId){
        throw new Error('COLLISION_CANONICAL_FIELDS_INVALID:'+group.config.canonicalId);
      }
      for(const duplicate of group.duplicateRecords){
        const id=c.studentId(duplicate),snap=await state.db.collection('students').doc(id).get();
        if(snap.exists)throw new Error('COLLISION_DUPLICATE_STILL_EXISTS:'+id);
        if(!aliases.has(id))throw new Error('COLLISION_ALIAS_MISSING:'+id);
      }
      canonicalChecks.push({id:group.config.canonicalId,aliases:[...aliases]});
    }
    const studentsSnap=await state.db.collection('students').get();
    const students=studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}));
    const index=resolver()?.indexStudents?.(students);
    if(index?.errors?.length)throw new Error('COLLISION_INDEX_STILL_INVALID:'+JSON.stringify(index.errors[0]));
    return canonicalChecks;
  }

  async function writeMergedProgress(state,plan){
    const batch=state.db.batch(),stamp=now(),written=[];
    for(const group of plan.groups){
      const data=mergedProgress(group);
      batch.set(state.db.collection('progress').doc(group.config.canonicalId),{
        ...data,collisionProgressMergedAt:stamp,updatedAt:stamp
      },{merge:true});
      written.push({canonicalId:group.config.canonicalId,from:group.relatedProgressIds});
    }
    await batch.commit();
    for(const item of written){
      const snap=await state.db.collection('progress').doc(item.canonicalId).get();
      if(!snap.exists)throw new Error('COLLISION_PROGRESS_CANONICAL_MISSING:'+item.canonicalId);
      const data=snap.data()||{},from=new Set(Array.isArray(data.collisionMergedFrom)?data.collisionMergedFrom:[]);
      for(const id of item.from){if(!from.has(id))throw new Error('COLLISION_PROGRESS_MERGE_VERIFY_FAILED:'+id)}
    }
    return written;
  }

  async function remainingSecurityCheck(){
    try{
      if(!root.ProgressSecurityAliasMigration?.backfillAndVerify)return{ok:false,error:'PROGRESS_ALIAS_MIGRATION_MISSING'};
      const result=await root.ProgressSecurityAliasMigration.backfillAndVerify();
      return{ok:true,result};
    }catch(error){
      return{ok:false,error:error?.message||String(error),details:root.ProgressSecurityAliasMigration?.collectErrorItems?.(error)||[]};
    }
  }

  async function repair(){
    const state=await readState(),c=core(),r=resolver();
    const plan=c.plan(state.students,state.progress,r);
    if(plan.duplicateCount===0){
      const security=await remainingSecurityCheck();
      return{ok:true,alreadyRepaired:true,groups:plan.groups.length,duplicates:0,security};
    }

    await setStatus(state.db,'backup-running',{groups:plan.groups.length,duplicates:plan.duplicateCount});
    const backups=await backupPlan(state,plan);
    await setStatus(state.db,'identity-repair-running',{groups:plan.groups.length,duplicates:plan.duplicateCount});

    try{
      await applyStudentIdentityBatch(state,plan);
      await verifyStudentIdentityRepair(state,plan);
    }catch(error){
      try{await rollbackStudents(state,plan)}catch(rollbackError){error.rollbackError=rollbackError}
      try{await setStatus(state.db,'identity-repair-failed',{groups:plan.groups.length,duplicates:plan.duplicateCount})}catch(e){}
      throw error;
    }

    await setStatus(state.db,'progress-merge-running',{groups:plan.groups.length,duplicates:plan.duplicateCount});
    const progress=await writeMergedProgress(state,plan);
    const security=await remainingSecurityCheck();
    await state.db.collection('settings').doc(SETTINGS_DOC).set({
      historicalCollisionRepairVersion:REPAIR_VERSION,
      historicalCollisionRepairStatus:'complete',
      historicalCollisionRepairComplete:true,
      historicalCollisionRepairGroups:plan.groups.length,
      historicalCollisionRepairDuplicates:plan.duplicateCount,
      historicalCollisionRepairBackups:backups.length,
      historicalCollisionRepairCompletedAt:now(),
      historicalCollisionRepairUpdatedAt:now()
    },{merge:true});
    return{ok:true,groups:plan.groups.length,duplicates:plan.duplicateCount,backups,progress,security};
  }

  function render(message,ok=true){
    let box=document.getElementById('sp-student-collision-repair-result');
    if(!box){
      box=document.createElement('div');box.id='sp-student-collision-repair-result';
      box.style.cssText='position:fixed;left:10px;right:10px;bottom:10px;z-index:100020;max-height:62vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #2e7d32;box-shadow:0 12px 40px rgba(0,0,0,.28);white-space:pre-wrap;font:14px/1.45 system-ui;color:#13293d';
      document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';box.textContent=message;
  }

  async function runUi(){
    const ok=root.confirm('Die zwei historischen Doppelprofile von Alona Vakulenko und Shilan Mohamad sicher reparieren?\n\nVor jeder Änderung werden unveränderliche Sicherungskopien in Firestore/diagnostics angelegt. Alte Fortschrittsdokumente werden NICHT gelöscht.');
    if(!ok)return;
    const button=document.getElementById('sp-student-collision-repair-btn');if(button)button.disabled=true;
    render('Sicherung und Reparatur werden geprüft …',true);
    try{
      const result=await repair();
      const security=result.security?.ok
        ?'Fortschritts-Aliasmigration: erfolgreich.'
        :`Fortschritts-Aliasmigration: noch blockiert (${result.security?.error||'unbekannt'}).`;
      render(`Historische Doppelprofile sicher repariert.\n\nGruppen: ${result.groups}\nEntfernte doppelte Schülerdokumente: ${result.duplicates}\nSicherungskopien: ${result.backups?.length||0}\nAlte Fortschrittsdokumente gelöscht: 0\n${security}\n\nJetzt „Schüler-Sicherheit vollständig prüfen“ erneut ausführen.`,true);
      if(button)button.style.display='none';
      root.SP_STUDENT_COLLISION_REPAIR=result;
      return result;
    }catch(error){
      console.error('Historische Doppelprofil-Reparatur fehlgeschlagen',error);
      render(`Reparatur gestoppt.\nFehler: ${error?.message||error}\n\nEs wird kein Sicherheits-Cutover freigegeben. Vorhandene Sicherungen bleiben erhalten.`,false);
      root.SP_STUDENT_COLLISION_REPAIR={ok:false,error};
      throw error;
    }finally{if(button)button.disabled=false}
  }

  async function duplicatesPresent(){
    const db=database(),c=core();if(!db||!c)return false;
    try{
      for(const group of c.GROUPS){
        for(const id of group.duplicateIds){const snap=await db.collection('students').doc(id).get();if(snap.exists)return true}
      }
    }catch(e){return false}
    return false;
  }

  async function install(){
    if(typeof document==='undefined')return;
    if(!core()||typeof Students==='undefined'){setTimeout(install,150);return}
    const anchor=document.getElementById('sp-security-lookup-btn');if(!anchor){setTimeout(install,150);return}
    if(document.getElementById('sp-student-collision-repair-btn'))return;
    if(!await duplicatesPresent())return;
    const button=document.createElement('button');
    button.id='sp-student-collision-repair-btn';button.type='button';button.className=anchor.className;
    button.textContent='2 historische Doppelprofile sicher reparieren';
    button.onclick=()=>runUi().catch(()=>{});
    anchor.insertAdjacentElement('afterend',button);
  }

  root.StudentCollisionRepair={repair,runUi,readState,backupPlan,mergedProgress,verifyStudentIdentityRepair,writeMergedProgress,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,250));
    else setTimeout(install,250);
  }
})(typeof window!=='undefined'?window:globalThis);
