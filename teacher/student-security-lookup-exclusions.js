(function(root){
  'use strict';
  if(root.StudentSecurityLookupExclusions)return;

  const VERSION=1;
  function text(v){return String(v==null?'':v).trim()}
  function emailOf(student={}){return text(student.email).toLowerCase()}
  function safelyExcluded(student={}){
    return student.securityLookupExcluded===true &&
      Number(student.securityLookupExcludedVersion||0)>=VERSION &&
      !emailOf(student) &&
      !text(student.authUid);
  }
  function database(){try{return firebase.firestore()}catch(e){return null}}
  function render(message,ok=true){
    let box=document.getElementById('sp-security-lookup-result');
    if(!box){
      box=document.createElement('div');box.id='sp-security-lookup-result';
      box.style.cssText='position:fixed;right:16px;bottom:16px;z-index:99999;max-width:620px;padding:14px;border-radius:12px;background:#fff;border:2px solid #2e7d32;box-shadow:0 8px 30px rgba(0,0,0,.18);white-space:pre-wrap;font:14px/1.4 system-ui';
      document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';box.textContent=message;
  }
  async function existingLookup(db,key){
    const snap=await db.collection('studentLookups').doc(key).get();
    return snap.exists?{id:snap.id,...(snap.data()||{})}:null;
  }

  function install(){
    const lookup=root.StudentSecurityLookup;
    if(!lookup)return false;
    if(lookup.__legacyExclusionsV1)return true;

    async function backfillAll(){
      const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
      await lookup.invalidateReady('backfill-running');
      const snap=await db.collection('students').get();
      const students=snap.docs.map(d=>({...(d.data()||{}),__docId:d.id,docId:d.id}));
      const planned=new Map(),collisions=[],invalid=[],excluded=[];
      for(const student of students){
        const canonical=text(student.__docId),email=emailOf(student),keys=lookup.keysFor(student);
        if(safelyExcluded(student)){excluded.push({studentId:canonical});continue}
        if(!canonical||!email||!keys.length){invalid.push({studentId:canonical,email,reason:!email?'EMAIL_MISSING':'COURSE_MISSING'});continue}
        for(const key of keys){
          const prior=planned.get(key);
          if(prior&&prior.studentId!==canonical)collisions.push({key,studentId:canonical,otherStudentId:prior.studentId,email,otherEmail:prior.email});
          else planned.set(key,{studentId:canonical,email});
        }
      }
      if(collisions.length){
        await lookup.setReady(false,{students:students.length,missing:invalid.length,collisions:collisions.length,status:'collision'});
        const error=new Error('STUDENT_LOOKUP_COLLISION');error.collisions=collisions;error.invalid=invalid;error.excluded=excluded;throw error;
      }
      let written=0;
      for(const student of students){
        if(safelyExcluded(student))continue;
        const canonical=text(student.__docId);
        if(!canonical||!emailOf(student)||!lookup.keysFor(student).length)continue;
        await lookup.writeKeysForStudent(student);written++;
      }
      return{students:students.length,written,invalid,collisions:[],excluded};
    }

    async function verifyAll(){
      const db=database();if(!db)throw new Error('FIRESTORE_NOT_AVAILABLE');
      const snap=await db.collection('students').get(),missing=[],collisions=[],excluded=[];
      for(const d of snap.docs){
        const student={...(d.data()||{}),__docId:d.id,docId:d.id};
        if(safelyExcluded(student)){excluded.push({studentId:d.id});continue}
        const keys=lookup.keysFor(student);
        if(!emailOf(student)||!keys.length){missing.push({studentId:d.id,reason:!emailOf(student)?'EMAIL_MISSING':'COURSE_MISSING'});continue}
        for(const key of keys){
          const found=await existingLookup(db,key);
          if(!found){missing.push({studentId:d.id,key});continue}
          const mapped=text(found.canonicalStudentId||found.studentId);
          if(mapped!==d.id)collisions.push({studentId:d.id,key,mappedTo:mapped});
        }
      }
      return{ok:missing.length===0&&collisions.length===0,students:snap.size,missing,collisions,excluded};
    }

    async function verifyAndMarkReady(status='verified'){
      const verification=await verifyAll();
      await lookup.setReady(verification.ok,{
        students:verification.students,missing:verification.missing.length,
        collisions:verification.collisions.length,status:verification.ok?status:'verification-failed'
      });
      try{
        await database().collection('settings').doc('studentSecurity').set({
          studentLookupExcludedLegacy:Number(verification.excluded?.length||0),
          studentLookupExcludedLegacyVersion:VERSION,
          studentLookupExcludedLegacyUpdatedAt:firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});
      }catch(e){}
      return verification;
    }

    async function runUi(){
      render('Sicherheits-Lookup wird geprüft und aufgebaut …',true);
      try{
        const backfill=await backfillAll(),verification=await verifyAndMarkReady('teacher-verified');
        if(!verification.ok)throw Object.assign(new Error('LOOKUP_VERIFICATION_FAILED'),{verification});
        render(`Sicherheits-Lookup vollständig.\nSchüler: ${verification.students}\nZuordnungen geprüft: ja\nAltprofile ohne Login: ${verification.excluded.length}\nFehlende Zuordnungen: 0\nKollisionen: 0\nSicherheitsstatus: BEREIT\n\nAltprofile ohne Login bleiben vollständig erhalten und sind nicht gelöscht.`,true);
        root.SP_STUDENT_LOOKUP_MIGRATION={ok:true,backfill,verification};
        return{ok:true,backfill,verification};
      }catch(error){
        console.error('Sicherheits-Lookup fehlgeschlagen',error);
        const collisions=error?.collisions||error?.verification?.collisions||[];
        const missing=error?.invalid||error?.verification?.missing||[];
        try{await lookup.setReady(false,{missing:missing.length,collisions:collisions.length,status:error?.message||'failed'})}catch(e){}
        render(`Sicherheitsmigration NICHT bereit.\nFehler: ${error?.message||error}\nKollisionen: ${collisions.length}\nFehlend/ungültig: ${missing.length}\nEs wurde kein sicherer Cutover freigegeben.`,false);
        root.SP_STUDENT_LOOKUP_MIGRATION={ok:false,error,collisions,missing};
        throw error;
      }
    }

    async function runCutoverUi(){
      const ok=root.confirm('Sicherheits-Cutover jetzt initialisieren?\n\nWichtig: Dies erzeugt eine neue Lehrer-Vertrauensgeneration. Alle normalen Lehrkräfte müssen danach vom Owner neu freigegeben werden. Alte Lehrer-Dokumente erhalten dadurch keinen Zugriff.');
      if(!ok)return;
      render('Post-Cutover-Lehrervertrauen wird neu erzeugt …',true);
      try{
        const generation=await lookup.initializeTeacherTrust();
        const backfill=await backfillAll(),verification=await verifyAndMarkReady('post-cutover-owner-verified');
        if(!verification.ok)throw Object.assign(new Error('LOOKUP_VERIFICATION_FAILED'),{verification});
        render(`Sicherheits-Cutover initialisiert.\nLehrer-Vertrauensgeneration: neu erzeugt\nOwner: freigegeben\nSchüler: ${verification.students}\nAltprofile ohne Login: ${verification.excluded.length}\nFehlende Lookups: 0\nKollisionen: 0\nSchüler-Sicherheitsstatus: BEREIT\n\nNormale Lehrkräfte müssen jetzt einzeln neu freigegeben werden.`,true);
        root.SP_SECURITY_CUTOVER={ok:true,generation,backfill,verification};
        return root.SP_SECURITY_CUTOVER;
      }catch(error){
        console.error('Sicherheits-Cutover fehlgeschlagen',error);
        try{await lookup.setReady(false,{status:error?.message||'cutover-failed'})}catch(e){}
        render(`Sicherheits-Cutover NICHT vollständig.\nFehler: ${error?.message||error}\nSchüler-Claims bleiben blockiert, bis die Prüfung vollständig grün ist.`,false);
        root.SP_SECURITY_CUTOVER={ok:false,error};
        throw error;
      }
    }

    lookup.backfillAll=backfillAll;
    lookup.verifyAll=verifyAll;
    lookup.verifyAndMarkReady=verifyAndMarkReady;
    lookup.runUi=runUi;
    lookup.runCutoverUi=runCutoverUi;
    lookup.__legacyExclusionsV1=true;
    return true;
  }

  root.StudentSecurityLookupExclusions={VERSION,text,emailOf,safelyExcluded,install};
  if(typeof document!=='undefined'){
    if(!install())setTimeout(install,0);
  }
})(typeof window!=='undefined'?window:globalThis);
