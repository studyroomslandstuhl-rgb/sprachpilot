(function(){
  'use strict';
  if(window.ProgressSecurityAliasMigration)return;

  function db(){try{return Students?.database?.()||firebase.firestore()}catch(e){return null}}
  function core(){return window.ProgressSecurityAliasCore||null}
  function serverTimestamp(){return firebase.firestore.FieldValue.serverTimestamp()}

  async function loadState(){
    const database=db(),resolver=core();
    if(!database)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!resolver)throw new Error('PROGRESS_ALIAS_CORE_MISSING');
    const [studentsSnap,progressSnap]=await Promise.all([
      database.collection('students').get(),
      database.collection('progress').get()
    ]);
    const students=studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}));
    const progress=progressSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}));
    return{database,resolver,students,progress};
  }

  async function analyze(){
    const state=await loadState();
    const resolution=state.resolver.resolveOwnership(state.students,state.progress);
    const aliasPlan=state.resolver.buildAliasPlan(state.students,resolution.assignments||[]);
    return{...state,resolution,aliasPlan};
  }

  function migrationError(analysis){
    const error=new Error('PROGRESS_ALIAS_MIGRATION_BLOCKED');
    error.indexErrors=analysis?.resolution?.indexErrors||[];
    error.failures=analysis?.resolution?.failures||[];
    error.analysis=analysis;
    return error;
  }

  async function commitOperations(database,operations,batchSize=350){
    let written=0;
    for(let i=0;i<operations.length;i+=batchSize){
      const batch=database.batch();
      for(const op of operations.slice(i,i+batchSize))op(batch);
      await batch.commit();
      written+=Math.min(batchSize,operations.length-i);
    }
    return written;
  }

  async function backfill(){
    const analysis=await analyze();
    if(!analysis.resolution.ok)throw migrationError(analysis);

    const operations=[],now=serverTimestamp();
    for(const student of analysis.students){
      const id=analysis.resolver.studentIdOf(student);if(!id)continue;
      const aliases=analysis.aliasPlan.get(id)||[];
      const current=analysis.resolver.uniq(Array.isArray(student.aliasIds)?student.aliasIds:[]).sort();
      if(JSON.stringify(current)!==JSON.stringify(aliases)){
        const ref=analysis.database.collection('students').doc(id);
        operations.push(batch=>batch.set(ref,{aliasIds:aliases,progressAliasVersion:1,progressAliasUpdatedAt:now},{merge:true}));
      }
    }

    const byProgress=new Map((analysis.resolution.assignments||[]).map(x=>[x.progressId,x]));
    for(const progress of analysis.progress){
      const progressId=analysis.resolver.progressIdOf(progress),assignment=byProgress.get(progressId);
      if(!assignment)continue;
      const aliases=analysis.aliasPlan.get(assignment.studentId)||[];
      const patch={
        canonicalStudentId:assignment.studentId,
        aliasIds:aliases,
        progressAliasVersion:1,
        progressAliasUpdatedAt:now
      };
      const sameCanonical=String(progress.canonicalStudentId||'').trim()===assignment.studentId;
      const currentAliases=analysis.resolver.uniq(Array.isArray(progress.aliasIds)?progress.aliasIds:[]).sort();
      const sameAliases=JSON.stringify(currentAliases)===JSON.stringify(aliases);
      if(!sameCanonical||!sameAliases||Number(progress.progressAliasVersion||0)<1){
        const ref=analysis.database.collection('progress').doc(progressId);
        operations.push(batch=>batch.set(ref,patch,{merge:true}));
      }
    }

    const written=await commitOperations(analysis.database,operations);
    return{
      students:analysis.students.length,
      progress:analysis.progress.length,
      assigned:analysis.resolution.assignments.length,
      operations:operations.length,
      written
    };
  }

  async function verify(){
    const analysis=await analyze();
    const failures=[...(analysis.resolution.indexErrors||[]),...(analysis.resolution.failures||[])];
    if(!analysis.resolution.ok)return{ok:false,failures,assigned:analysis.resolution.assignments.length,students:analysis.students.length,progress:analysis.progress.length};

    const byStudent=new Map(analysis.students.map(s=>[analysis.resolver.studentIdOf(s),s]));
    for(const assignment of analysis.resolution.assignments){
      const student=byStudent.get(assignment.studentId),aliases=new Set(Array.isArray(student?.aliasIds)?student.aliasIds:[]);
      if(assignment.progressId!==assignment.studentId&&!aliases.has(assignment.progressId)){
        failures.push({type:'progress-alias-not-whitelisted',studentId:assignment.studentId,progressId:assignment.progressId});
      }
    }
    return{
      ok:failures.length===0,
      failures,
      assigned:analysis.resolution.assignments.length,
      students:analysis.students.length,
      progress:analysis.progress.length
    };
  }

  async function backfillAndVerify(){
    const backfillResult=await backfill();
    const verification=await verify();
    if(!verification.ok){
      const error=new Error('PROGRESS_ALIAS_VERIFICATION_FAILED');
      error.verification=verification;
      throw error;
    }
    return{ok:true,backfill:backfillResult,verification};
  }

  window.ProgressSecurityAliasMigration={analyze,backfill,verify,backfillAndVerify};
})();
