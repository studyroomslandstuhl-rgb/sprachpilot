import fs from 'node:fs';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,getDoc,setDoc,getDocs,collection} from 'firebase/firestore';

const projectId='demo-sprachpilot-excluded-legacy';
const rules=fs.readFileSync('firestore.rules','utf8');
const env=await initializeTestEnvironment({projectId,firestore:{rules}});
const OWNER={uid:'owner-uid',email:'studyroomslandstuhl@gmail.com'};
const STUDENT={uid:'student-uid',email:'student@example.com'};

function verified(user){
  return env.authenticatedContext(user.uid,{email:user.email,email_verified:true,firebase:{sign_in_provider:'password'}}).firestore();
}

try{
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'students','legacy-no-email'),{
      vorname:'Alt',nachname:'Profil',kurs:'ALT',email:'',authUid:'',
      securityLookupExcluded:true,securityLookupExcludedVersion:1,securityLookupExcludedReason:'legacy-no-email'
    });
    await setDoc(doc(db,'progress','legacy-no-email'),{
      canonicalStudentId:'legacy-no-email',points:1234,securityArchived:false
    });
  });

  const sdb=verified(STUDENT),odb=verified(OWNER);
  await assertFails(getDoc(doc(sdb,'students','legacy-no-email')));
  await assertFails(getDoc(doc(sdb,'progress','legacy-no-email')));
  await assertFails(getDocs(collection(sdb,'students')));
  await assertFails(getDocs(collection(sdb,'progress')));

  await assertSucceeds(getDoc(doc(odb,'students','legacy-no-email')));
  await assertSucceeds(getDoc(doc(odb,'progress','legacy-no-email')));

  console.log('Excluded legacy profiles remain teacher-only under strict rules.');
}finally{
  await env.cleanup();
}
