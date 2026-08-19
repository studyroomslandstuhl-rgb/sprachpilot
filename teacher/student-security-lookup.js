(function(){
  'use strict';
  if(window.StudentSecurityLookup)return;

  const COLLECTION='studentLookups';
  const SETTINGS_COLLECTION='settings';
  const SETTINGS_DOC='studentSecurity';
  const TEACHER_SECURITY_DOC='teacherSecurity';
  const VERSION=1;
  const TEACHER_SECURITY_VERSION=2;
  const OWNER_EMAILS=new Set(['studyroomslandstuhl@gmail.com','alicekrekoten@gmail.com','alisa.krekoten@gmail.com']);

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
  function authUser(){try{return firebase.auth().currentUser||null}catch(e){return null}}
  function isOwnerClient(){return OWNER_EMAILS.has(String(authUser()?.email||'').trim().toLowerCase())}
  function secureRandomGeneration(){
    if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();
    const bytes=new Uint8Array(32);globalThis.crypto.getRandomValues(bytes);
    return [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  function safe(value){return String(value||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

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

  async function currentTeacherGeneration(){
    const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    const snap=await db.collection(SETTINGS_COLLECTION).doc(TEACHER_SECURITY_DOC).get();
    if(!snap.exists)return'';
    const data=snap.data()||{};
    return Number(data.teacherSecurityVersion||0)>=TEACHER_SECURITY_VERSION?String(data.generation||'').trim():'';
  }

  // Diese Funktion MUSS erst nach Veröffentlichung der strikten Firestore-Regeln
  // ausgeführt werden. Sie erzeugt eine neue, vorher nicht bekannte Generation und
  // entzieht damit sämtlichen alten teacher-Dokumenten automatisch das Vertrauen.
  async function initializeTeacherTrust(){
    const db=database(),user=authUser();
    if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!user||!isOwnerClient())throw new Error('OWNER_REQUIRED_FOR_SECURITY_CUTOVER');
    const generation=secureRandomGeneration(),now=firebase.firestore.FieldValue.serverTimestamp();
    const batch=db.batch();
    batch.set(db.collection(SETTINGS_COLLECTION).doc(TEACHER_SECURITY_DOC),{
      teacherSecurityVersion:TEACHER_SECURITY_VERSION,
      generation,
      initializedByUid:user.uid,
      initializedByEmail:String(user.email||'').trim().toLowerCase(),
      initializedAt:now,
      updatedAt:now
    });
    batch.set(db.collection('teachers').doc(user.uid),{
      uid:user.uid,email:String(user.email||'').trim().toLowerCase(),role:'owner',owner:true,
      active:true,approved:true,status:'approved',
      securityApprovedV2:true,securityApprovalGeneration:generation,
      securityApprovedBy:user.uid,securityApprovedAt:now
    },{merge:true});
    await batch.commit();
    return generation;
  }

  async function approveTeacher(uid){
    const db=database(),owner=authUser();
    if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!owner||!isOwnerClient())throw new Error('OWNER_REQUIRED');
    const generation=await currentTeacherGeneration();if(!generation)throw new Error('TEACHER_SECURITY_NOT_INITIALIZED');
    const ref=db.collection('teachers').doc(String(uid||''));
    const snap=await ref.get();if(!snap.exists)throw new Error('TEACHER_NOT_FOUND');
    await ref.set({
      securityApprovedV2:true,securityApprovalGeneration:generation,
      securityApprovedBy:owner.uid,securityApprovedAt:firebase.firestore.FieldValue.serverTimestamp(),
      active:true,approved:true,status:'approved'
    },{merge:true});
    return true;
  }
  async function revokeTeacher(uid){
    const db=database(),owner=authUser();
    if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
    if(!owner||!isOwnerClient())throw new Error('OWNER_REQUIRED');
    if(String(uid||'')===String(owner.uid||''))throw new Error('OWNER_CANNOT_BE_REVOKED_HERE');
    await db.collection('teachers').doc(String(uid||'')).set({
      securityApprovedV2:false,securityApprovalGeneration:'',
      securityRevokedBy:owner.uid,securityRevokedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    return true;
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
      box.style.cssText='position:fixed;right:16px;bottom:16px;z-index:99999;max-width:560px;padding:14px;border-radius:12px;background:#fff;border:2px solid '+(ok?'#2e7d32':'#b3261e')+';box-shadow:0 8px 30px rgba(0,0,0,.18);white-space:pre-wrap;font:14px/1.4 system-ui';
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

  async function runCutoverUi(){
    if(!isOwnerClient()){renderResult('Nur ein Owner kann den Sicherheits-Cutover initialisieren.',false);return}
    const ok=window.confirm('Sicherheits-Cutover jetzt initialisieren?\n\nWichtig: Dies erzeugt eine neue Lehrer-Vertrauensgeneration. Alle normalen Lehrkräfte müssen danach vom Owner neu freigegeben werden. Alte Lehrer-Dokumente erhalten dadurch keinen Zugriff.');
    if(!ok)return;
    renderResult('Post-Cutover-Lehrervertrauen wird neu erzeugt …',true);
    try{
      const generation=await initializeTeacherTrust();
      const backfill=await backfillAll(),verification=await verifyAndMarkReady('post-cutover-owner-verified');
      if(!verification.ok)throw Object.assign(new Error('LOOKUP_VERIFICATION_FAILED'),{verification});
      renderResult(`Sicherheits-Cutover initialisiert.\nLehrer-Vertrauensgeneration: neu erzeugt\nOwner: freigegeben\nSchüler: ${verification.students}\nFehlende Lookups: 0\nKollisionen: 0\nSchüler-Sicherheitsstatus: BEREIT\n\nNormale Lehrkräfte müssen jetzt einzeln neu freigegeben werden.`,true);
      window.SP_SECURITY_CUTOVER={ok:true,generation,backfill,verification};
    }catch(error){
      console.error('Sicherheits-Cutover fehlgeschlagen',error);
      try{await setReady(false,{status:error?.message||'cutover-failed'})}catch(e){}
      renderResult(`Sicherheits-Cutover NICHT vollständig.\nFehler: ${error?.message||error}\nSchüler-Claims bleiben blockiert, bis die Prüfung vollständig grün ist.`,false);
      window.SP_SECURITY_CUTOVER={ok:false,error};
    }
  }

  async function showTeacherApprovals(){
    if(!isOwnerClient()){renderResult('Nur ein Owner kann Lehrer-Sicherheitsfreigaben verwalten.',false);return}
    const db=database();if(!db)return;
    const generation=await currentTeacherGeneration();
    if(!generation){renderResult('Lehrer-Sicherheit ist noch nicht initialisiert. Zuerst „Sicherheits-Cutover initialisieren“ ausführen.',false);return}
    const snap=await db.collection('teachers').get();
    let panel=document.getElementById('sp-teacher-security-panel');if(panel)panel.remove();
    panel=document.createElement('div');panel.id='sp-teacher-security-panel';
    panel.style.cssText='position:fixed;inset:5vh 5vw;z-index:100000;background:#fff;border:1px solid #bbb;border-radius:14px;box-shadow:0 16px 50px rgba(0,0,0,.3);padding:18px;overflow:auto;font:14px/1.4 system-ui';
    const rows=snap.docs.map(d=>{
      const x=d.data()||{},approved=x.securityApprovedV2===true&&String(x.securityApprovalGeneration||'')===generation;
      return `<tr><td>${safe(x.email||d.id)}</td><td>${safe(x.role||'')}</td><td><b>${approved?'FREIGEGEBEN':'NICHT FREIGEGEBEN'}</b></td><td>${approved?`<button data-revoke="${safe(d.id)}">Entziehen</button>`:`<button data-approve="${safe(d.id)}">Freigeben</button>`}</td></tr>`;
    }).join('');
    panel.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center"><h2>Lehrer-Sicherheitsfreigaben</h2><button id="sp-close-teacher-security">Schließen</button></div><p>Nur ausdrücklich geprüfte Lehrkräfte freigeben. Alte Flags wie <code>approved</code>, <code>admin</code> oder <code>isTeacher</code> reichen nicht mehr.</p><table style="width:100%;border-collapse:collapse"><thead><tr><th>E-Mail</th><th>Rolle</th><th>Sicherheitsstatus</th><th>Aktion</th></tr></thead><tbody>${rows||'<tr><td colspan="4">Keine Lehrer-Dokumente.</td></tr>'}</tbody></table>`;
    document.body.appendChild(panel);
    panel.querySelector('#sp-close-teacher-security').onclick=()=>panel.remove();
    panel.querySelectorAll('[data-approve]').forEach(btn=>btn.onclick=async()=>{try{await approveTeacher(btn.dataset.approve);await showTeacherApprovals()}catch(e){renderResult('Lehrer konnte nicht freigegeben werden: '+(e?.message||e),false)}});
    panel.querySelectorAll('[data-revoke]').forEach(btn=>btn.onclick=async()=>{try{await revokeTeacher(btn.dataset.revoke);await showTeacherApprovals()}catch(e){renderResult('Freigabe konnte nicht entzogen werden: '+(e?.message||e),false)}});
  }

  function installButtons(){
    const actions=document.querySelector('.teacher-actions');if(!actions)return;
    if(!document.getElementById('sp-security-cutover-btn')){
      const btn=document.createElement('button');btn.id='sp-security-cutover-btn';btn.className='secondary';btn.textContent='Sicherheits-Cutover initialisieren';btn.onclick=runCutoverUi;actions.insertBefore(btn,actions.lastElementChild||null);
    }
    if(!document.getElementById('sp-security-lookup-btn')){
      const btn=document.createElement('button');btn.id='sp-security-lookup-btn';btn.className='secondary';btn.textContent='Schüler-Sicherheit prüfen';btn.onclick=runUi;actions.insertBefore(btn,actions.lastElementChild||null);
    }
    if(!document.getElementById('sp-security-teachers-btn')){
      const btn=document.createElement('button');btn.id='sp-security-teachers-btn';btn.className='secondary';btn.textContent='Lehrer-Freigaben';btn.onclick=showTeacherApprovals;actions.insertBefore(btn,actions.lastElementChild||null);
    }
  }

  window.StudentSecurityLookup={
    lookupId,keysFor,writeKeysForStudent,backfillAll,verifyAll,verifyAndMarkReady,invalidateReady,setReady,
    currentTeacherGeneration,initializeTeacherTrust,approveTeacher,revokeTeacher,runUi,runCutoverUi,showTeacherApprovals
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installButtons);else installButtons();
})();
