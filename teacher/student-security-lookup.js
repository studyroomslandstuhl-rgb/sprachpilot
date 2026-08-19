(function(){
  'use strict';
  if(window.StudentSecurityLookup)return;

  const COLLECTION='studentLookups';
  const SETTINGS_COLLECTION='settings';
  const SETTINGS_DOC='studentSecurity';
  const VERSION=1;

  function clean(value){
    return String(value||'').trim().toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-|-$/g,'');
  }
  function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
  function emailOf(student={}){return String(student.email||'').trim().toLowerCase()}
  function courseValues(student={}){return uniq([student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course])}
  function lookupId(email,course){return `${clean(course)}_${clean(email)}`}
  function keysFor(student={}){
    const email=emailOf(student);if(!email)return[];
    return uniq(courseValues(student).map(course=>lookupId(email,course)).filter(id=>id&&id!=='_'));
  }
  function database(){try{return Students?.database?.()||firebase.firestore()}catch(e){return null}}
  async function existingLookup(db,key){
    const snap=await db.collection(COLLECTION).doc(key).get();
    return snap.exists?{id:snap.id,...(snap.data()||{})}:null;
  }
  async function setReady(ready,details={}){
    const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    await db.collection(SETTINGS_COLLECTION).doc(SETTINGS_DOC).set({
      studentLookupReady:ready===true,
      studentLookupVersion:VERSION,
      studentLookupStudents:Number(details.students||0),
      studentLookupMissing:Number(details.missing||0),
      studentLookupCollisions:Number(details.collisions||0),
      studentLookupStatus:String(details.status||'').slice(0,80),
      studentLookupVerifiedAt:ready===true?firebase.firestore.FieldValue.serverTimestamp():null,
      studentLookupUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
  }
  async function invalidateReady(status='changing-student-identity'){
    try{await setReady(false,{status})}catch(e){console.warn('Sicherheitsstatus konnte nicht invalidiert werden',e)}
  }

  async function writeKeysForStudent(student,{replaceOldKeys=[]}={}){
    const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    const canonical=String(student.__docId||student.docId||student.canonicalStudentId||student.studentId||student.userId||student.id||'').trim();
    const email=emailOf(student),keys=keysFor(student);
    if(!canonical)throw new Error('STUDENT_ID_MISSING');
    if(!email)throw new Error('STUDENT_EMAIL_MISSING');
    if(!keys.length)throw new Error('STUDENT_COURSE_MISSING');

    const collisions=[];
    for(const key of keys){
      const old=await existingLookup(db,key),mapped=String(old?.canonicalStudentId||old?.studentId||'').trim();
      if(old&&mapped&&mapped!==canonical)collisions.push({key,existingStudentId:mapped,studentId:canonical,email});
    }
    if(collisions.length){const error=new Error('STUDENT_LOOKUP_COLLISION');error.collisions=collisions;throw error}

    const batch=db.batch(),now=firebase.firestore.FieldValue.serverTimestamp();
    for(const key of keys){
      batch.set(db.collection(COLLECTION).doc(key),{
        lookupVersion:VERSION,canonicalStudentId:canonical,studentId:canonical,email,
        courseKeys:courseValues(student),active:student.active!==false,updatedAt:now
      },{merge:true});
    }
    const newSet=new Set(keys);
    for(const oldKey of uniq(replaceOldKeys)){
      if(!oldKey||newSet.has(oldKey))continue;
      const old=await existingLookup(db,oldKey),mapped=String(old?.canonicalStudentId||old?.studentId||'').trim();
      if(mapped===canonical)batch.delete(db.collection(COLLECTION).doc(oldKey));
    }
    await batch.commit();
    return{studentId:canonical,email,keys};
  }

  async function backfillAll(){
    const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    await invalidateReady('backfill-running');
    const snap=await db.collection('students').get();
    const students=snap.docs.map(d=>({...(d.data()||{}),__docId:d.id,docId:d.id}));
    const planned=new Map(),collisions=[],invalid=[];

    for(const student of students){
      const canonical=String(student.__docId||'').trim(),email=emailOf(student),keys=keysFor(student);
      if(!canonical||!email||!keys.length){invalid.push({studentId:canonical,email,reason:!email?'EMAIL_MISSING':'COURSE_MISSING'});continue}
      for(const key of keys){
        const prior=planned.get(key);
        if(prior&&prior.studentId!==canonical)collisions.push({key,studentId:canonical,otherStudentId:prior.studentId,email,otherEmail:prior.email});
        else planned.set(key,{studentId:canonical,email});
      }
    }
    if(collisions.length){
      await setReady(false,{students:students.length,missing:invalid.length,collisions:collisions.length,status:'collision'});
      const error=new Error('STUDENT_LOOKUP_COLLISION');error.collisions=collisions;error.invalid=invalid;throw error;
    }

    let written=0;
    for(const student of students){
      const canonical=String(student.__docId||'').trim();
      if(!canonical||!emailOf(student)||!keysFor(student).length)continue;
      await writeKeysForStudent(student);written++;
    }
    return{students:students.length,written,invalid,collisions:[]};
  }

  async function verifyAll(){
    const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    const snap=await db.collection('students').get(),missing=[],collisions=[];
    for(const d of snap.docs){
      const student={...(d.data()||{}),__docId:d.id,docId:d.id},keys=keysFor(student);
      if(!emailOf(student)||!keys.length){missing.push({studentId:d.id,reason:!emailOf(student)?'EMAIL_MISSING':'COURSE_MISSING'});continue}
      for(const key of keys){
        const lookup=await existingLookup(db,key);
        if(!lookup){missing.push({studentId:d.id,key});continue}
        const mapped=String(lookup.canonicalStudentId||lookup.studentId||'').trim();
        if(mapped!==d.id)collisions.push({studentId:d.id,key,mappedTo:mapped});
      }
    }
    return{ok:missing.length===0&&collisions.length===0,students:snap.size,missing,collisions};
  }

  async function verifyAndMarkReady(status='verified'){
    const verification=await verifyAll();
    await setReady(verification.ok,{
      students:verification.students,missing:verification.missing.length,
      collisions:verification.collisions.length,status:verification.ok?status:'verification-failed'
    });
    return verification;
  }

  function renderResult(text,ok=true){
    let box=document.getElementById('sp-security-lookup-result');
    if(!box){
      box=document.createElement('div');box.id='sp-security-lookup-result';
      box.style.cssText='position:fixed;right:16px;bottom:16px;z-index:99999;max-width:520px;padding:14px;border-radius:12px;background:#fff;border:2px solid '+(ok?'#2e7d32':'#b3261e')+';box-shadow:0 8px 30px rgba(0,0,0,.18);white-space:pre-wrap;font:14px/1.4 system-ui';
      document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';box.textContent=text;
  }
  async function runUi(){
    renderResult('Sicherheits-Lookup wird geprüft und aufgebaut …',true);
    try{
      const backfill=await backfillAll(),verification=await verifyAndMarkReady('teacher-verified');
      if(!verification.ok)throw Object.assign(new Error('LOOKUP_VERIFICATION_FAILED'),{verification});
      renderResult(`Sicherheits-Lookup vollständig.\nSchüler: ${verification.students}\nZuordnungen geprüft: ja\nFehlende Zuordnungen: 0\nKollisionen: 0\nSicherheitsstatus: BEREIT`,true);
      window.SP_STUDENT_LOOKUP_MIGRATION={ok:true,backfill,verification};
    }catch(error){
      console.error('Sicherheits-Lookup fehlgeschlagen',error);
      const collisions=error?.collisions||error?.verification?.collisions||[];
      const missing=error?.invalid||error?.verification?.missing||[];
      try{await setReady(false,{missing:missing.length,collisions:collisions.length,status:error?.message||'failed'})}catch(e){}
      renderResult(`Sicherheitsmigration NICHT bereit.\nFehler: ${error?.message||error}\nKollisionen: ${collisions.length}\nFehlend/ungültig: ${missing.length}\nEs wurde kein sicherer Cutover freigegeben.`,false);
      window.SP_STUDENT_LOOKUP_MIGRATION={ok:false,error,collisions,missing};
    }
  }
  function installButton(){
    const actions=document.querySelector('.teacher-actions');
    if(!actions||document.getElementById('sp-security-lookup-btn'))return;
    const btn=document.createElement('button');btn.id='sp-security-lookup-btn';btn.className='secondary';btn.textContent='Sicherheitsmigration prüfen';btn.onclick=runUi;actions.insertBefore(btn,actions.lastElementChild||null);
  }

  window.StudentSecurityLookup={lookupId,keysFor,writeKeysForStudent,backfillAll,verifyAll,verifyAndMarkReady,invalidateReady,setReady,runUi};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installButton);else installButton();
})();
