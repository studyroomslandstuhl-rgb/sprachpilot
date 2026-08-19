import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {collection,doc,getDocs,getDoc,setDoc,deleteDoc,query,where} from 'firebase/firestore';

const rollbackRules=`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function reasonableSize() { return request.resource.data.size() < 200; }
    match /courses/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /students/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /progress/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if false; }
    match /teachers/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /teacherInvites/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /courseInvites/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /releases/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /assignments/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /settings/{id} { allow read: if signedIn(); allow create, update: if signedIn() && reasonableSize(); allow delete: if signedIn(); }
    match /diagnostics/{id} { allow read, create, update: if signedIn() && reasonableSize(); allow delete: if false; }
    match /{document=**} { allow read, write: if false; }
  }
}`;

const env=await initializeTestEnvironment({projectId:'demo-one-time-rollback',firestore:{rules:rollbackRules}});
try{
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'students','canonical'),{studentId:'canonical',email:'x@example.com',aliasIds:[]});
    await setDoc(doc(db,'students','duplicate'),{studentId:'duplicate',email:'x@example.com'});
    await setDoc(doc(db,'progress','canonical'),{studentId:'canonical',pointsTotal:100,fragen:{t:{tasks:{a:{completed:true}}}}});
    await setDoc(doc(db,'progress','duplicate'),{studentId:'duplicate',pointsTotal:50});
    await setDoc(doc(db,'settings','studentSecurity'),{progressAliasReady:false});
    await setDoc(doc(db,'diagnostics','old-backup'),{backupType:'student-collision-repair',snapshot:{pointsTotal:50}});
  });

  const db=env.authenticatedContext('teacher-uid',{email:'teacher@example.com'}).firestore();
  await assertSucceeds(getDocs(collection(db,'students')));
  await assertSucceeds(getDocs(collection(db,'progress')));
  await assertSucceeds(getDoc(doc(db,'settings','studentSecurity')));

  // Exakt der Produktionsfehler: diagnostics-Reads sind mit den alten Regeln nicht möglich.
  await assertFails(getDocs(query(collection(db,'diagnostics'),where('backupType','==','student-collision-repair'))));

  // Die korrigierte Aktion benötigt nur neue diagnostics-Writes, keine Reads.
  await assertSucceeds(setDoc(doc(db,'diagnostics','new-backup'),{
    backupType:'one-time-duplicate-incident',incidentVersion:1,kind:'progress',path:'progress/duplicate',snapshot:{pointsTotal:50}
  }));
  await assertSucceeds(setDoc(doc(db,'settings','studentSecurity'),{oneTimeDuplicateIncidentVersion:1,oneTimeDuplicateIncidentStatus:'running'},{merge:true}));
  await assertSucceeds(setDoc(doc(db,'progress','canonical'),{pointsTotal:150,oneTimeDuplicateIncidentVersion:1},{merge:true}));
  await assertSucceeds(setDoc(doc(db,'progress','duplicate'),{securityArchived:true,oneTimeDuplicateIncidentVersion:1},{merge:true}));
  await assertSucceeds(setDoc(doc(db,'students','canonical'),{aliasIds:['duplicate'],oneTimeDuplicateIncidentVersion:1},{merge:true}));
  await assertSucceeds(deleteDoc(doc(db,'students','duplicate')));

  console.log('One-time incident rollback-rules compatibility passed.');
} finally {
  await env.cleanup();
}
