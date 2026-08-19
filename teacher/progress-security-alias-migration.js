(function(){
  'use strict';
  if(window.ProgressSecurityAliasMigration)return;

  function db(){try{return Students?.database?.()||firebase.firestore()}catch(e){return null}}
  function core(){return window.ProgressSecurityAliasCore||null}
  function serverTimestamp(){return firebase.firestore.FieldValue.serverTimestamp()}

  async function markReady(ready,details={}){
    const database=db();if(!database)throw new Error('FIRESTORE_NOT_AVAILABLE');
    await database.collection('settings').doc('studentSecurity').set({
      progressAliasReady:ready===true,
      progressAliasVersion:1,
      progressAliasStudents:Number(details.students||0),
      progressAliasDocuments:Number(details.progress||0),
      progressAliasAssigned:Number(details.assigned||0),
      progressAliasFailures:Number(details.failures||0),
      progressAliasStatus:String(details.status||'').slice(0,80),
      progressAliasVerifiedAt:ready===true?serverTimestamp():null,
      progressAliasUpdatedAt:serverTimestamp()
    },{merge:true});
  }

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

  function collectErrorItems(error){
    const lists=[error?.verification?.failures,error?.indexErrors,error?.failures];
    const result=[],seen=new Set();
    for(const list of lists){
      if(!Array.isArray(list))continue;
      for(const item of list){
        const key=JSON.stringify(item||{});
        if(seen.has(key))continue;
        seen.add(key);result.push(item||{});
      }
    }
    return result;
  }

  function describeErrorItem(item={}){
    const type=String(item.type||item.reason||'unbekannter-fehler');
    const parts=[];
    if(item.alias)parts.push('Alias '+item.alias);
    if(item.studentId)parts.push('Schüler '+item.studentId);
    if(item.otherStudentId)parts.push('anderer Schüler '+item.otherStudentId);
    if(item.progressId)parts.push('Fortschritt '+item.progressId);
    if(item.authUid)parts.push('UID '+item.authUid);
    if(Array.isArray(item.candidates)&&item.candidates.length)parts.push('Kandidaten '+item.candidates.join(', '));
    return parts.length?`${type}: ${parts.join(' · ')}`:type;
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
    try{
      await markReady(false,{status:'progress-alias-running'});
      const backfillResult=await backfill();
      const verification=await verify();
      if(!verification.ok){
        const error=new Error('PROGRESS_ALIAS_VERIFICATION_FAILED');
        error.verification=verification;
        throw error;
      }
      await markReady(true,{
        students:verification.students,progress:verification.progress,
        assigned:verification.assigned,failures:0,status:'verified'
      });
      return{ok:true,backfill:backfillResult,verification};
    }catch(error){
      const failures=collectErrorItems(error);
      try{await markReady(false,{failures:failures.length,status:error?.message||'failed'})}catch(e){}
      throw error;
    }
  }

  function render(text,ok=true){
    let box=document.getElementById('sp-progress-alias-result');
    if(!box){
      box=document.createElement('div');box.id='sp-progress-alias-result';
      box.style.cssText='position:fixed;right:16px;bottom:16px;z-index:100001;max-width:600px;padding:14px;border-radius:12px;background:#fff;border:2px solid #2e7d32;box-shadow:0 8px 30px rgba(0,0,0,.18);white-space:pre-wrap;font:14px/1.4 system-ui';
      document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';box.textContent=text;
  }

  async function runUi(){
    render('Historische Fortschritts-IDs werden eindeutig geprüft …',true);
    try{
      const result=await backfillAndVerify();
      render(`Fortschritts-Sicherheit vollständig.\nSchüler: ${result.verification.students}\nFortschrittsdokumente: ${result.verification.progress}\nEindeutig zugeordnet: ${result.verification.assigned}\nFehler/Kollisionen: 0\nStatus: BEREIT`,true);
      window.SP_PROGRESS_ALIAS_MIGRATION=result;
      return result;
    }catch(error){
      const failures=collectErrorItems(error);
      const details=failures.slice(0,10).map((item,index)=>`${index+1}. ${describeErrorItem(item)}`).join('\n');
      const more=failures.length>10?`\n… plus ${failures.length-10} weitere`:'';
      render(`Fortschritts-Sicherheit NICHT bereit.\nFehler: ${error?.message||error}\nNicht eindeutige/ungültige Zuordnungen: ${failures.length}${details?`\n\nDetails:\n${details}${more}`:''}\n\nDer Sicherheits-Cutover wurde blockiert.`,false);
      window.SP_PROGRESS_ALIAS_MIGRATION={ok:false,error,failures};
      throw error;
    }
  }

  function wrapSecurityButtons(){
    if(!window.StudentSecurityLookup){setTimeout(wrapSecurityButtons,100);return}
    const lookup=document.getElementById('sp-security-lookup-btn');
    if(lookup&&!lookup.dataset.progressAliasWrapped){
      lookup.dataset.progressAliasWrapped='1';
      lookup.textContent='Schüler-Sicherheit vollständig prüfen';
      lookup.onclick=async()=>{
        try{await runUi();await window.StudentSecurityLookup.runUi()}
        catch(error){try{await window.StudentSecurityLookup.setReady(false,{status:'progress-alias-failed'})}catch(e){}}
      };
    }
    const cutover=document.getElementById('sp-security-cutover-btn');
    if(cutover&&!cutover.dataset.progressAliasWrapped){
      cutover.dataset.progressAliasWrapped='1';
      cutover.onclick=async()=>{
        try{await runUi();await window.StudentSecurityLookup.runCutoverUi()}
        catch(error){try{await window.StudentSecurityLookup.setReady(false,{status:'progress-alias-failed'})}catch(e){}}
      };
    }
  }

  window.ProgressSecurityAliasMigration={analyze,backfill,verify,backfillAndVerify,runUi,markReady,collectErrorItems,describeErrorItem};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(wrapSecurityButtons,0));
  else setTimeout(wrapSecurityButtons,0);
})();
