import fs from 'node:fs';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,getDoc,setDoc,updateDoc} from 'firebase/firestore';

const projectId='demo-sprachpilot-archived-progress';
const rules=fs.readFileSync('firestore.rules','utf8');
const env=await initializeTestEnvironment({projectId,firestore:{rules}});
const A={uid:'uid-a',email:'alice.student@example.com'};
const O={uid:'uid-owner',email:'studyroomslandstuhl@gmail.com'};
function verified(user){return env.authenticatedContext(user.uid,{email:user.email,email_verified:true,firebase:{sign_in_provider:'password'}})}

try{
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'students','student-a'),{
      authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A',active:true,
      aliasIds:['normal-a','archived-a','new-archive-a']
    });
    await setDoc(doc(db,'progress','normal-a'),{canonicalStudentId:'student-a',points:10});
    await setDoc(doc(db,'progress','archived-a'),{
      authUid:A.uid,authEmail:A.email,email:A.email,canonicalStudentId:'student-a',points:999,
      securityArchived:true,securityArchiveReason:'legacy-test'
    });
  });

  const adb=verified(A).firestore();
  const odb=verified(O).firestore();

  await assertSucceeds(getDoc(doc(adb,'progress','normal-a')));
  await assertFails(getDoc(doc(adb,'progress','archived-a')));
  await assertFails(updateDoc(doc(adb,'progress','archived-a'),{points:1000}));
  await assertFails(setDoc(doc(adb,'progress','new-archive-a'),{
    canonicalStudentId:'student-a',securityArchived:true,points:1
  }));

  await assertSucceeds(getDoc(doc(odb,'progress','archived-a')));
  await assertSucceeds(updateDoc(doc(odb,'progress','archived-a'),{securityArchiveReason:'owner-reviewed'}));

  console.log('Archived progress Firestore isolation tests passed.');
}finally{
  await env.cleanup();
}
