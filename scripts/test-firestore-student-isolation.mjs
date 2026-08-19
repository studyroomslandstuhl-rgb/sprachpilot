import fs from 'node:fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs
} from 'firebase/firestore';

const projectId='demo-sprachpilot-student-isolation';
const rules=fs.readFileSync('firestore.rules','utf8');
const env=await initializeTestEnvironment({projectId,firestore:{rules}});

const A={uid:'uid-a',email:'alice.student@example.com'};
const B={uid:'uid-b',email:'bob.student@example.com'};
const X={uid:'uid-x',email:A.email};
const O={uid:'uid-owner',email:'studyroomslandstuhl@gmail.com'};
const T={uid:'uid-teacher',email:'teacher@example.com'};
const M={uid:'uid-old-fake-teacher',email:'old-fake@example.com'};
const GENERATION='post-cutover-test-generation';
const LEGACY_ID='corrected-legacy-canonical-a';
const LOOKUP_ID='kurs-alt_alice-student-example-com';

function passwordVerified(user){
  return env.authenticatedContext(user.uid,{
    email:user.email,email_verified:true,
    firebase:{sign_in_provider:'password'}
  });
}
function passwordUnverified(user){
  return env.authenticatedContext(user.uid,{
    email:user.email,email_verified:false,
    firebase:{sign_in_provider:'password'}
  });
}
function federatedVerified(user){
  return env.authenticatedContext(user.uid,{
    email:user.email,email_verified:true,
    firebase:{sign_in_provider:'google.com'}
  });
}

try{
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'students','student-a'),{
      authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A',active:true,
      aliasIds:['alias-a','allowed-alias-new']
    });
    await setDoc(doc(db,'students','student-b'),{
      authUid:B.uid,authEmail:B.email,email:B.email,kurs:'KURS-B',active:true,
      aliasIds:[]
    });
    await setDoc(doc(db,'students',LEGACY_ID),{email:A.email,kurs:'KURS-ALT',courseCode:'KURS-ALT',active:true});
    await setDoc(doc(db,'studentLookups',LOOKUP_ID),{lookupVersion:1,canonicalStudentId:LEGACY_ID,studentId:LEGACY_ID,email:A.email,courseKeys:['KURS-ALT'],active:true});
    await setDoc(doc(db,'settings','studentSecurity'),{studentLookupReady:true,studentLookupVersion:1,studentLookupStudents:3});
    await setDoc(doc(db,'settings','teacherSecurity'),{teacherSecurityVersion:2,generation:GENERATION});

    await setDoc(doc(db,'progress','student-a'),{authUid:A.uid,authEmail:A.email,email:A.email,canonicalStudentId:'student-a',points:50});
    await setDoc(doc(db,'progress','student-b'),{authUid:B.uid,authEmail:B.email,email:B.email,canonicalStudentId:'student-b',points:80});
    await setDoc(doc(db,'progress','alias-a'),{canonicalStudentId:'student-a',points:35});
    await setDoc(doc(db,'progress','legacy-progress-a'),{email:A.email,points:20});
    await setDoc(doc(db,'courses','KURS-A'),{courseCode:'KURS-A',name:'Kurs A'});
    await setDoc(doc(db,'courses','KURS-ALT'),{courseCode:'KURS-ALT',name:'Alter Kurs'});

    await setDoc(doc(db,'teachers',T.uid),{
      email:T.email,role:'teacher',approved:true,active:true,
      securityApprovedV2:true,securityApprovalGeneration:GENERATION
    });
    await setDoc(doc(db,'teachers',M.uid),{
      email:M.email,role:'teacher',approved:true,isTeacher:true,admin:true,active:true
    });
  });

  const adb=passwordVerified(A).firestore();
  const bdb=passwordVerified(B).firestore();
  const xdb=federatedVerified(X).firestore();
  const odb=passwordVerified(O).firestore();
  const ofed=federatedVerified(O).firestore();
  const tdb=passwordVerified(T).firestore();
  const mdb=passwordVerified(M).firestore();
  const aub=passwordUnverified(A).firestore();
  const anon=env.unauthenticatedContext().firestore();

  // 1) UID-gebundene Schülerdaten: nur die exakte verifizierte Passwort-UID darf zugreifen.
  await assertSucceeds(getDoc(doc(adb,'students','student-a')));
  await assertFails(getDoc(doc(bdb,'students','student-a')));
  await assertFails(getDoc(doc(xdb,'students','student-a')));
  await assertSucceeds(getDoc(doc(bdb,'students','student-b')));
  await assertFails(getDoc(doc(adb,'students','student-b')));
  await assertFails(getDoc(doc(aub,'students','student-a')));

  // 2) Gebundene Identitätsfelder und Aliasliste sind für Schüler unveränderlich.
  await assertSucceeds(updateDoc(doc(adb,'students','student-a'),{vorname:'Alice'}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{authUid:B.uid}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{authEmail:B.email}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{email:B.email}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{canonicalStudentId:'student-b'}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{aliasIds:['alias-a','allowed-alias-new','forged-alias']}));
  await assertFails(deleteDoc(doc(adb,'students','student-a')));

  // 3) Direkter Sicherheits-Lookup ist nur für dieselbe verifizierte Passwort-E-Mail lesbar.
  await assertSucceeds(getDoc(doc(adb,'studentLookups',LOOKUP_ID)));
  await assertFails(getDoc(doc(bdb,'studentLookups',LOOKUP_ID)));
  await assertFails(getDoc(doc(xdb,'studentLookups',LOOKUP_ID)));
  await assertFails(getDocs(collection(adb,'studentLookups')));
  await assertFails(setDoc(doc(adb,'studentLookups','fake'),{email:A.email,canonicalStudentId:'student-b'}));
  await assertFails(updateDoc(doc(adb,'studentLookups',LOOKUP_ID),{canonicalStudentId:'student-b'}));
  await assertSucceeds(getDoc(doc(adb,'settings','studentSecurity')));
  await assertFails(getDoc(doc(anon,'settings','studentSecurity')));

  // 4) Korrigiertes Altprofil: enger einmaliger Claim nur durch dieselbe verifizierte Passwort-E-Mail.
  await assertSucceeds(getDoc(doc(adb,'students',LEGACY_ID)));
  await assertFails(getDoc(doc(bdb,'students',LEGACY_ID)));
  await assertFails(getDoc(doc(xdb,'students',LEGACY_ID)));
  await assertFails(getDoc(doc(aub,'students',LEGACY_ID)));
  await assertFails(updateDoc(doc(bdb,'students',LEGACY_ID),{authUid:B.uid,authEmail:B.email,authVersion:2,authLinkedAt:new Date()}));
  await assertFails(updateDoc(doc(adb,'students',LEGACY_ID),{authUid:A.uid,authEmail:A.email,authVersion:2,authLinkedAt:new Date(),kurs:'MANIPULIERT'}));
  await assertSucceeds(updateDoc(doc(adb,'students',LEGACY_ID),{authUid:A.uid,authEmail:A.email,authVersion:2,authLinkedAt:new Date()}));
  await assertSucceeds(updateDoc(doc(adb,'students',LEGACY_ID),{nachname:'Sicher'}));
  await assertFails(getDoc(doc(xdb,'students',LEGACY_ID)));

  // 5) Neue Profile nur für eigene verifizierte UID/E-Mail und ohne frei erfundene Alias-IDs.
  await assertSucceeds(setDoc(doc(adb,'students','student-a-new'),{authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A'}));
  await assertFails(setDoc(doc(adb,'students','forged-owner'),{authUid:B.uid,authEmail:A.email,email:A.email,kurs:'KURS-A'}));
  await assertFails(setDoc(doc(adb,'students','forged-email'),{authUid:A.uid,authEmail:A.email,email:B.email,kurs:'KURS-A'}));
  await assertFails(setDoc(doc(adb,'students','forged-alias-create'),{authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A',aliasIds:['victim-id']}));
  await assertFails(setDoc(doc(aub,'students','unverified-create'),{authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A'}));

  // 6) Fortschritt: nur kanonische eigene ID oder serverseitig gespeicherte Alias-ID.
  await assertSucceeds(getDoc(doc(adb,'progress','student-a')));
  await assertFails(getDoc(doc(bdb,'progress','student-a')));
  await assertFails(getDoc(doc(xdb,'progress','student-a')));
  await assertFails(getDoc(doc(adb,'progress','student-b')));
  await assertSucceeds(updateDoc(doc(adb,'progress','student-a'),{points:55}));
  await assertFails(updateDoc(doc(adb,'progress','student-a'),{authUid:B.uid}));
  await assertFails(updateDoc(doc(adb,'progress','student-a'),{authEmail:B.email}));
  await assertFails(updateDoc(doc(bdb,'progress','student-a'),{points:999}));
  await assertSucceeds(getDoc(doc(adb,'progress','alias-a')));
  await assertFails(getDoc(doc(bdb,'progress','alias-a')));
  await assertSucceeds(getDoc(doc(adb,'progress','legacy-progress-a')));
  await assertFails(getDoc(doc(bdb,'progress','legacy-progress-a')));
  await assertFails(getDoc(doc(xdb,'progress','legacy-progress-a')));
  await assertFails(setDoc(doc(adb,'progress','fake-b-alias'),{canonicalStudentId:'student-b',points:999}));
  await assertFails(setDoc(doc(adb,'progress','fake-authuid'),{authUid:B.uid,canonicalStudentId:'student-a',points:999}));
  await assertFails(setDoc(doc(adb,'progress','future-b-id'),{canonicalStudentId:'student-a',points:999}));
  await assertSucceeds(setDoc(doc(adb,'progress','allowed-alias-new'),{canonicalStudentId:'student-a',points:5}));
  await assertSucceeds(setDoc(doc(adb,'progress','student-a'),{authUid:A.uid,authEmail:A.email,canonicalStudentId:'student-a',points:56},{merge:true}));

  // 7) Private Collections: Studentensuche nur per eigener UID; progress wird nie aufgelistet.
  await assertSucceeds(getDocs(query(collection(adb,'students'),where('authUid','==',A.uid))));
  await assertFails(getDocs(collection(adb,'students')));
  await assertFails(getDocs(query(collection(adb,'students'),where('email','==',A.email))));
  await assertFails(getDocs(query(collection(bdb,'students'),where('email','==',A.email))));
  await assertFails(getDocs(query(collection(adb,'progress'),where('authUid','==',A.uid))));
  await assertFails(getDocs(query(collection(adb,'progress'),where('email','==',A.email))));
  await assertFails(getDocs(query(collection(bdb,'progress'),where('email','==',A.email))));

  // 8) Sichtbare Rangliste ist physisch getrennt und streng minimiert.
  const rankingA={studentId:'student-a',authUid:A.uid,displayName:'Alice A',courseKey:'KURS-A',points:55,version:1,updatedAt:new Date()};
  const rankingB={studentId:'student-b',authUid:B.uid,displayName:'Bob B',courseKey:'KURS-B',points:80,version:1,updatedAt:new Date()};
  await assertSucceeds(setDoc(doc(adb,'studentRankings','student-a'),rankingA));
  await assertFails(setDoc(doc(adb,'studentRankings','student-b'),{...rankingB,authUid:A.uid}));
  await assertFails(setDoc(doc(adb,'studentRankings','student-a'),{...rankingA,courseKey:'KURS-B'}));
  await assertFails(setDoc(doc(adb,'studentRankings','student-a'),{...rankingA,email:A.email}));
  await assertFails(setDoc(doc(adb,'studentRankings','student-a'),{...rankingA,progress:{task1:100}}));
  await assertFails(setDoc(doc(aub,'studentRankings','student-a'),rankingA));
  await assertSucceeds(setDoc(doc(bdb,'studentRankings','student-b'),rankingB));
  await assertSucceeds(getDocs(query(collection(adb,'studentRankings'),where('courseKey','==','KURS-A'))));
  await assertSucceeds(getDocs(query(collection(bdb,'studentRankings'),where('courseKey','==','KURS-B'))));
  await assertFails(getDoc(doc(anon,'studentRankings','student-a')));
  await assertFails(deleteDoc(doc(adb,'studentRankings','student-a')));

  // 9) Kursdaten: angemeldete Nutzer lesen, Schüler schreiben nicht.
  await assertSucceeds(getDoc(doc(adb,'courses','KURS-A')));
  await assertFails(updateDoc(doc(adb,'courses','KURS-A'),{name:'Manipuliert'}));
  await assertFails(getDoc(doc(anon,'courses','KURS-A')));

  // 10) Lehrer-Bypass ist Post-Cutover-vertrauensgebunden und ebenfalls Passwort+verifiziert.
  await assertSucceeds(getDoc(doc(tdb,'students','student-a')));
  await assertSucceeds(updateDoc(doc(tdb,'students','student-b'),{kurs:'KURS-B2'}));
  await assertSucceeds(updateDoc(doc(tdb,'progress','student-b'),{points:81}));
  await assertSucceeds(setDoc(doc(tdb,'studentRankings','student-b'),{...rankingB,courseKey:'KURS-B2'}));
  await assertSucceeds(setDoc(doc(tdb,'studentLookups','teacher-made'),{email:B.email,canonicalStudentId:'student-b'}));
  await assertSucceeds(updateDoc(doc(tdb,'settings','studentSecurity'),{studentLookupReady:false}));

  await assertSucceeds(getDoc(doc(mdb,'teachers',M.uid)));
  await assertFails(getDoc(doc(mdb,'students','student-a')));
  await assertFails(updateDoc(doc(mdb,'students','student-a'),{kurs:'ANGRIFF'}));
  await assertFails(setDoc(doc(mdb,'studentRankings','student-a'),rankingA));
  await assertFails(getDocs(collection(mdb,'teachers')));

  await assertFails(updateDoc(doc(tdb,'settings','teacherSecurity'),{generation:'attacker-generation'}));
  await assertFails(updateDoc(doc(tdb,'teachers',M.uid),{securityApprovedV2:true,securityApprovalGeneration:GENERATION}));
  await assertFails(getDocs(collection(tdb,'teachers')));

  // Gleiches Owner-E-Mail-Konto über einen anderen Provider erhält keine Owner-Rechte.
  await assertFails(getDocs(collection(ofed,'teachers')));
  await assertFails(updateDoc(doc(ofed,'settings','teacherSecurity'),{generation:'federated-owner-attack'}));

  // Verifizierter Passwort-Owner kann Vertrauensgeneration und Freigaben verwalten.
  await assertSucceeds(getDoc(doc(odb,'students','student-a')));
  await assertSucceeds(getDocs(collection(odb,'teachers')));
  await assertSucceeds(updateDoc(doc(odb,'settings','teacherSecurity'),{generation:'rotated-by-owner'}));
  await assertSucceeds(updateDoc(doc(odb,'teachers',M.uid),{securityApprovedV2:true,securityApprovalGeneration:'rotated-by-owner'}));

  console.log('Strict UID isolation, alias whitelist, password-only auth, sanitized ranking and teacher trust tests passed.');
} finally {
  await env.cleanup();
}
