(function(root){
  'use strict';
  if(root.StudentSecurityLookupDetails)return;

  function text(value){return String(value==null?'':value).trim()}
  function emailOf(student={}){return text(student.email||student.authEmail).toLowerCase()}
  function courseOf(student={}){return text(student.courseCode||student.kurs||student.kursnummer||student.courseDocId||student.course)}
  function nameOf(student={}){
    const direct=text(student.name||student.displayName);
    if(direct)return direct;
    return [student.vorname,student.nachname].map(text).filter(Boolean).join(' ')||'—';
  }
  function idOf(student={}){return text(student.__docId||student.canonicalStudentId||student.docId||student.studentId||student.userId||student.id)}
  function normalize(value){
    return text(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  }
  function tokens(value){return normalize(value).split(/\s+/).filter(token=>token&&token.length>1&&!/^\d+$/.test(token))}
  function nameTokens(student={}){
    const raw=nameOf(student);if(raw==='—')return[];
    return tokens(raw);
  }
  function identityValues(student={}){
    return [...new Set([idOf(student),student.canonicalStudentId,student.docId,student.studentId,student.userId,...(Array.isArray(student.aliasIds)?student.aliasIds:[])].map(text).filter(Boolean))];
  }
  function reasonText(item={}){
    if(item.reason==='EMAIL_MISSING')return 'E-Mail fehlt';
    if(item.reason==='COURSE_MISSING')return 'Kurs fehlt';
    if(item.key)return 'Lookup fehlt: '+text(item.key);
    return text(item.reason||'Lookup fehlt/ungültig');
  }
  function candidateEvidence(target={},candidate={}){
    const targetId=idOf(target),candidateId=idOf(candidate);
    if(!candidateId||candidateId===targetId)return null;
    const targetName=normalize(nameOf(target)==='—'?'':nameOf(target));
    const candidateName=normalize(nameOf(candidate)==='—'?'':nameOf(candidate));
    const targetNameTokens=nameTokens(target);
    const candidateHaystack=new Set([...nameTokens(candidate),...tokens(candidateId)]);
    const exactName=!!targetName&&!!candidateName&&targetName===candidateName;
    const structuralName=targetNameTokens.length>=2&&targetNameTokens.every(token=>candidateHaystack.has(token));
    if(!exactName&&!structuralName)return null;
    const sameCourse=!!courseOf(target)&&normalize(courseOf(target))===normalize(courseOf(candidate));
    const reasons=[];
    if(exactName)reasons.push('gleicher vollständiger Name');
    else if(structuralName)reasons.push('Name passt zur Kandidaten-ID');
    if(sameCourse)reasons.push('gleicher Kurs');
    if(emailOf(candidate))reasons.push('Kandidat hat E-Mail');
    const score=(exactName?100:60)+(sameCourse?20:0)+(emailOf(candidate)?10:0)+(text(candidate.authUid)?5:0);
    return{score,reasons};
  }
  function findCandidates(target={},students=[]){
    return (students||[]).map(candidate=>{
      const evidence=candidateEvidence(target,candidate);return evidence?{student:candidate,...evidence}:null;
    }).filter(Boolean).sort((a,b)=>b.score-a.score||idOf(a.student).localeCompare(idOf(b.student))).slice(0,8);
  }
  function progressRefsFor(student={},progress=[]){
    const identities=new Set(identityValues(student));
    if(!identities.size)return[];
    const ids=[];
    for(const row of progress||[]){
      const progressId=text(row.__docId||row.id);
      const refs=[progressId,row.canonicalStudentId,row.studentId,row.userId,row.docId].map(text).filter(Boolean);
      if(refs.some(ref=>identities.has(ref)))ids.push(progressId||'(ohne ID)');
    }
    return [...new Set(ids)].sort().slice(0,12);
  }
  function candidateLine(candidate={}){
    const student=candidate.student||{};
    return `    - ${idOf(student)||'—'} · ${nameOf(student)} · ${emailOf(student)||'E-Mail —'} · ${courseOf(student)||'Kurs —'} · UID ${text(student.authUid)?'GEBUNDEN':'nicht gebunden'} · ${candidate.reasons.join('; ')}`;
  }
  function formatRow(item={},student={},candidates=[],progressRefs=[]){
    const id=text(item.studentId||idOf(student))||'—';
    const identity=identityValues(student);
    const aliases=Array.isArray(student.aliasIds)?student.aliasIds.map(text).filter(Boolean):[];
    const candidateText=candidates.length?candidates.map(candidateLine).join('\n'):'    keine gleichnamigen/strukturell passenden Profile gefunden';
    return `${id}\n  Name: ${nameOf(student)}\n  E-Mail: ${emailOf(student)||'—'}\n  Kurs: ${courseOf(student)||'—'}\n  Firebase-UID: ${text(student.authUid)?'GEBUNDEN':'NICHT GEBUNDEN'}\n  Problem: ${reasonText(item)}\n  Identitätswerte: ${identity.length?identity.join(', '):'—'}\n  Aliase: ${aliases.length?aliases.join(', '):'—'}\n  Fortschrittsbezüge: ${progressRefs.length?progressRefs.join(', '):'—'}\n  Mögliche gleichnamige Profile (nur Diagnose, KEINE automatische Zuordnung):\n${candidateText}`;
  }
  function formatDetails(rows=[]){
    return rows.map((row,index)=>`${index+1}. ${formatRow(row.item,row.student,row.candidates||[],row.progressRefs||[])}`).join('\n\n');
  }

  async function enrichMissing(missing=[]){
    if(!Array.isArray(missing)||!missing.length)return[];
    let database=null;
    try{database=firebase.firestore()}catch(e){return missing.map(item=>({item,student:{},candidates:[],progressRefs:[]}))}
    try{
      const [studentsSnap,progressSnap]=await Promise.all([
        database.collection('students').get(),
        database.collection('progress').get()
      ]);
      const students=studentsSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}));
      const progress=progressSnap.docs.map(d=>({...(d.data()||{}),__docId:d.id}));
      const byId=new Map(students.map(student=>[idOf(student),student]));
      return missing.map(item=>{
        const id=text(item?.studentId),student=byId.get(id)||{__docId:id};
        return{item,student,candidates:findCandidates(student,students),progressRefs:progressRefsFor(student,progress)};
      });
    }catch(e){
      return Promise.all(missing.map(async item=>{
        const id=text(item?.studentId);if(!id)return{item,student:{},candidates:[],progressRefs:[]};
        try{
          const snap=await database.collection('students').doc(id).get();
          const student=snap.exists?{...(snap.data()||{}),__docId:snap.id}:{__docId:id};
          return{item,student,candidates:[],progressRefs:[]};
        }catch(inner){return{item,student:{__docId:id},candidates:[],progressRefs:[]}}
      }));
    }
  }

  async function appendFailureDetails(){
    const state=root.SP_STUDENT_LOOKUP_MIGRATION;
    if(!state||state.ok!==false||!Array.isArray(state.missing)||!state.missing.length)return;
    const rows=await enrichMissing(state.missing);
    const details=formatDetails(rows);
    const box=typeof document!=='undefined'?document.getElementById('sp-security-lookup-result'):null;
    if(!box||!details)return;
    const base=`Sicherheitsmigration NICHT bereit.\nFehler: ${state.error?.message||state.error||'LOOKUP_VERIFICATION_FAILED'}\nKollisionen: ${Array.isArray(state.collisions)?state.collisions.length:0}\nFehlend/ungültig: ${state.missing.length}\n\nDETAILS DER BETROFFENEN SCHÜLER:\n${details}\n\nHinweis: Kandidaten sind nur Lesediagnose. Es wurde nichts zusammengeführt, umgebunden oder gelöscht.\n\nEs wurde kein sicherer Cutover freigegeben.`;
    box.textContent=base;
  }

  function install(){
    const lookup=root.StudentSecurityLookup;
    if(!lookup||lookup.__missingDetailsV2)return false;
    const originalRunUi=lookup.runUi;
    if(typeof originalRunUi!=='function')return false;
    lookup.runUi=async function(...args){
      const result=await originalRunUi.apply(this,args);
      await appendFailureDetails();
      return result;
    };
    lookup.__missingDetailsV2=true;
    return true;
  }

  root.StudentSecurityLookupDetails={text,emailOf,courseOf,nameOf,idOf,normalize,tokens,nameTokens,identityValues,reasonText,candidateEvidence,findCandidates,progressRefsFor,candidateLine,formatRow,formatDetails,enrichMissing,appendFailureDetails,install};
  if(typeof document!=='undefined'){
    if(!install())setTimeout(install,0);
  }
})(typeof window!=='undefined'?window:globalThis);
