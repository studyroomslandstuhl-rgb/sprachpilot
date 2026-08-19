(function(root){
  'use strict';
  if(root.OneTimeDuplicateIncident)return;

  const SETTINGS='studentSecurity';
  function core(){return root.OneTimeDuplicateIncidentCore||null}
  function database(){try{return root.Students?.database?.()||firebase.firestore()}catch(e){return null}}
  function stamp(){return firebase.firestore.FieldValue.serverTimestamp()}
  function uid(){try{return String(firebase.auth().currentUser?.uid||'').trim()}catch(e){return''}}
  function text(v){return String(v==null?'':v).trim()}
  function mergeFn(a,b){
    if(typeof root.Students?.mergeProgressRows!=='function')throw new Error('INCIDENT_PROGRESS_MERGE_FUNCTION_MISSING');
    return root.Students.mergeProgressRows(a,b);
  }
  function recalculator(){return root.SPPointRecalculator||null}

  async function loadState(){
    const db=database(),c=core();
    if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!c)throw new Error('INCIDENT_CORE_MISSING');
    const [studentsSnap,progressSnap,backupSnap,settingsSnap]=await Promise.all([
      db.collection('students').get(),
      db.collection('progress').get(),
      db.collection('diagnostics').where('backupType','==','student-collision-repair').get(),
      db.collection('settings').doc(SETTINGS).get()
    ]);
    return{
      db,
      students:studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      progress:progressSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      backups:backupSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id})),
      settings:settingsSnap.exists?settingsSnap.data()||{}:{}
    };
  }

  async function saveBackup(db,kind,path,snapshot,groupKey){
    const ref=db.collection('diagnostics').doc();
    await ref.set({
      backupType:'one-time-duplicate-incident',
      incidentVersion:core().VERSION,
      groupKey,
      kind,path,
      snapshot:core().stripInternal(snapshot||{}),
      createdByUid:uid(),
      backedUpAt:stamp()
    });
    return ref.id;
  }

  async function backupPlan(state,plan){
    const c=core(),seen=new Set(),ids=[];
    async function save(kind,path,row){
      if(!row||seen.has(path))return;seen.add(path);
      ids.push(await saveBackup(state.db,kind,path,row,plan.group.key));
    }
    await save('student','students/'+plan.group.canonicalId,plan.canonicalStudent);
    for(const row of plan.duplicateStudents)await save('student','students/'+c.studentId(row),row);
    for(const row of plan.currentRows)await save('progress','progress/'+c.progressId(row),row);
    return ids;
  }

  function validateBindings(plan){
    const canonicalUid=text(plan.canonicalStudent?.authUid);
    for(const student of plan.duplicateStudents){
      const duplicateUid=text(student?.authUid);
      if(duplicateUid&&duplicateUid!==canonicalUid)throw new Error('INCIDENT_DUPLICATE_UID_CONFLICT:'+core().studentId(student));
    }
    for(const row of plan.currentRows){
      if(core().progressId(row)===plan.group.canonicalId)continue;
      const progressUid=text(row?.authUid);
      if(progressUid&&progressUid!==canonicalUid)throw new Error('INCIDENT_PROGRESS_UID_CONFLICT:'+core().progressId(row));
    }
  }

  async function setStatus(db,status,extra={}){
    await db.collection('settings').doc(SETTINGS).set({
      oneTimeDuplicateIncidentVersion:core().VERSION,
      oneTimeDuplicateIncidentStatus:status,
      oneTimeDuplicateIncidentUpdatedAt:stamp(),
      ...extra
    },{merge:true});
  }

  async function applyGroup(state,group){
    const c=core(),plan=c.buildGroupPlan({
      group,students:state.students,progressRows:state.progress,backups:state.backups,
      mergeFn,recalculator:recalculator()
    });
    if(plan.alreadyDone)return{groupKey:group.key,name:group.name,alreadyDone:true,points:Number(plan.currentCanonical?.oneTimeDuplicateIncidentPoints||c.storedPoints(plan.currentCanonical||{}))};
    validateBindings(plan);
    const backups=await backupPlan(state,plan);
    const batch=state.db.batch(),now=stamp(),currentIds=new Set(plan.currentRows.map(c.progressId));
    batch.set(state.db.collection('progress').doc(group.canonicalId),{
      ...plan.mergedProgress,
      oneTimeDuplicateIncidentCompletedAt:now,
      oneTimeDuplicateIncidentUpdatedAt:now,
      updatedAt:now
    },{merge:true});
    for(const oldId of plan.archiveIds){
      if(!currentIds.has(oldId))continue;
      batch.set(state.db.collection('progress').doc(oldId),{
        securityArchived:true,
        securityArchiveReason:'one-time-duplicate-profile-consolidated',
        securityResolutionType:'archived-duplicate-profile',
        oneTimeDuplicateIncidentVersion:c.VERSION,
        oneTimeDuplicateIncidentCanonicalId:group.canonicalId,
        oneTimeDuplicateIncidentUpdatedAt:now
      },{merge:true});
    }
    batch.set(state.db.collection('students').doc(group.canonicalId),{
      aliasIds:plan.aliasIds,
      oneTimeDuplicateIncidentVersion:c.VERSION,
      oneTimeDuplicateIncidentKey:group.key,
      oneTimeDuplicateIncidentUpdatedAt:now,
      updatedAt:now
    },{merge:true});
    for(const duplicate of plan.duplicateStudents){batch.delete(state.db.collection('students').doc(c.studentId(duplicate)))}
    await batch.commit();
    await verifyGroup(state.db,plan);
    return{
      groupKey:group.key,name:group.name,alreadyDone:false,points:plan.targetPoints,
      profilePoints:plan.breakdown,deltaAfterEarlierRepair:plan.postRepairDelta,
      backups:backups.length,archived:plan.archiveIds.filter(id=>currentIds.has(id)).length,
      deletedDuplicateStudents:plan.duplicateStudents.length
    };
  }

  async function verifyGroup(db,plan){
    const c=core();
    const canonicalProgress=await db.collection('progress').doc(plan.group.canonicalId).get();
    if(!canonicalProgress.exists)throw new Error('INCIDENT_CANONICAL_PROGRESS_MISSING:'+plan.group.key);
    const data=canonicalProgress.data()||{};
    if(Number(data.oneTimeDuplicateIncidentVersion||0)<c.VERSION)throw new Error('INCIDENT_MARKER_MISSING:'+plan.group.key);
    if(c.storedPoints(data)!==plan.targetPoints)throw new Error('INCIDENT_POINTS_VERIFY_FAILED:'+plan.group.key);
    if(data.securityArchived===true)throw new Error('INCIDENT_CANONICAL_ARCHIVED:'+plan.group.key);
    const aliases=new Set(Array.isArray((await db.collection('students').doc(plan.group.canonicalId).get()).data()?.aliasIds)?(await db.collection('students').doc(plan.group.canonicalId).get()).data().aliasIds:[]);
    for(const id of plan.group.duplicateStudentIds){if(!aliases.has(id))throw new Error('INCIDENT_ALIAS_MISSING:'+id)}
    for(const id of plan.archiveIds){
      if(!plan.currentRows.some(row=>c.progressId(row)===id))continue;
      const snap=await db.collection('progress').doc(id).get();
      if(!snap.exists||snap.data()?.securityArchived!==true)throw new Error('INCIDENT_OLD_PROGRESS_NOT_ARCHIVED:'+id);
    }
    for(const duplicate of plan.duplicateStudents){
      const snap=await db.collection('students').doc(c.studentId(duplicate)).get();
      if(snap.exists)throw new Error('INCIDENT_DUPLICATE_STUDENT_STILL_EXISTS:'+c.studentId(duplicate));
    }
    return true;
  }

  async function runOnce(){
    let state=await loadState(),c=core();
    if(Number(state.settings.oneTimeDuplicateIncidentVersion||0)>=c.VERSION&&state.settings.oneTimeDuplicateIncidentStatus==='complete'){
      return{ok:true,alreadyComplete:true,groups:[],version:c.VERSION};
    }
    await setStatus(state.db,'running',{oneTimeDuplicateIncidentComplete:false});
    const results=[];
    try{
      for(const group of c.GROUPS){
        state=await loadState();
        const result=await applyGroup(state,group);results.push(result);
      }
      const totalPoints=results.reduce((sum,r)=>sum+Number(r.points||0),0);
      await setStatus(state.db,'complete',{
        oneTimeDuplicateIncidentComplete:true,
        oneTimeDuplicateIncidentGroups:results.length,
        oneTimeDuplicateIncidentTotalCanonicalPoints:totalPoints,
        oneTimeDuplicateIncidentCompletedAt:stamp()
      });
      return{ok:true,alreadyComplete:false,groups:results,version:c.VERSION,totalCanonicalPoints:totalPoints};
    }catch(error){
      try{await setStatus(state.db,'failed',{oneTimeDuplicateIncidentComplete:false,oneTimeDuplicateIncidentError:String(error?.message||error).slice(0,180)})}catch(e){}
      error.incidentResults=results;
      throw error;
    }
  }

  function summary(result){
    if(result?.alreadyComplete)return'Einmalige Doppelprofil-Zusammenführung war bereits abgeschlossen; Punkte wurden NICHT erneut addiert.';
    const lines=['Einmalige Doppelprofil-Zusammenführung abgeschlossen.'];
    for(const item of result?.groups||[]){
      const detail=(item.profilePoints||[]).map(x=>`${x.profileId}: ${x.points}`).join(' + ');
      lines.push(`${item.name}: ${detail||'bereits erledigt'}${detail?' = '+item.points+' Punkte':''}`);
    }
    lines.push('Doppelte Punkteaktion kann wegen Versionsmarker nicht erneut ausgeführt werden.');
    lines.push('Alte Fortschrittsdokumente wurden archiviert, nicht gelöscht.');
    return lines.join('\n');
  }

  root.OneTimeDuplicateIncident={loadState,saveBackup,backupPlan,validateBindings,applyGroup,verifyGroup,runOnce,summary};
})(typeof window!=='undefined'?window:globalThis);
