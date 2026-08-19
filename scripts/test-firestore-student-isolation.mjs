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
const T={uid:'uid-teacher',email:'teacher@example.com'};
const LEGACY_ID='corrected-legacy-canonical-a';
const LOOKUP_ID='kurs-alt_alice-student-example-com';

function verified(user){return env.authenticatedContext(user.uid,{email:user.email,email_verified:true})}
function unverified(user){return env.authenticatedContext(user.uid,{email:user.email,email_verified:false})}

try{
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'students','student-a'),{authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A',active:true});
    await setDoc(doc(db,'students','student-b'),{authUid:B.uid,authEmail:B.email,email:B.email,kurs:'KURS-B',active:true});
    // Korrigiertes Altprofil: Dokument-ID ist absichtlich NICHT mehr aus aktueller E-Mail/Kurs ableitbar.
    await setDoc(doc(db,'students',LEGACY_ID),{email:A.email,kurs:'KURS-ALT',courseCode:'KURS-ALT',active:true});
    await setDoc(doc(db,'studentLookups',LOOKUP_ID),{lookupVersion:1,canonicalStudentId:LEGACY_ID,studentId:LEGACY_ID,email:A.email,courseKeys:['KURS-ALT'],active:true});
    await setDoc(doc(db,'settings','studentSecurity'),{studentLookupReady:true,studentLookupVersion:1,studentLookupStudents:3});

    await setDoc(doc(db,'progress','student-a'),{authUid:A.uid,authEmail:A.email,email:A.email,canonicalStudentId:'student-a',points:50});
    await setDoc(doc(db,'progress','student-b'),{authUid:B.uid,authEmail:B.email,email:B.email,canonicalStudentId:'student-b',points:80});
    await setDoc(doc(db,'progress','alias-a'),{canonicalStudentId:'student-a',points:35});
    await setDoc(doc(db,'progress','legacy-progress-a'),{email:A.email,points:20});
    await setDoc(doc(db,'courses','KURS-A'),{courseCode:'KURS-A',name:'Kurs A'});
    await setDoc(doc(db,'courses','KURS-ALT'),{courseCode:'KURS-ALT',name:'Alter Kurs'});
    await setDoc(doc(db,'teachers',T.uid),{email:T.email,role:'teacher',approved:true,active:true});
  });

  const adb=verified(A).firestore();
  const bdb=verified(B).firestore();
  const xdb=verified(X).firestore();
  const tdb=verified(T).firestore();
  const aub=unverified(A).firestore();
  const anon=env.unauthenticatedContext().firestore();

  // 1) UID-gebundene Schülerdaten: nur die exakte UID darf zugreifen.
  await assertSucceeds(getDoc(doc(adb,'students','student-a')));
  await assertFails(getDoc(doc(bdb,'students','student-a')));
  await assertFails(getDoc(doc(xdb,'students','student-a')));
  await assertSucceeds(getDoc(doc(bdb,'students','student-b')));
  await assertFails(getDoc(doc(adb,'students','student-b')));
  await assertFails(getDoc(doc(aub,'students','student-a')));

  // 2) Identitätsfelder eines gebundenen Profils sind clientseitig unveränderlich.
  await assertSucceeds(updateDoc(doc(adb,'students','student-a'),{vorname:'Alice'}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{authUid:B.uid}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{authEmail:B.email}));
  await assertFails(updateDoc(doc(adb,'students','student-a'),{email:B.email}));
  await assertFails(deleteDoc(doc(adb,'students','student-a')));

  // 3) Direkter Sicherheits-Lookup: A kann den bekannten eigenen Schlüssel lesen,
  // B nicht. Schüler können Lookup-Dokumente weder auflisten noch manipulieren.
  await assertSucceeds(getDoc(doc(adb,'studentLookups',LOOKUP_ID)));
  await assertFails(getDoc(doc(bdb,'studentLookups',LOOKUP_ID)));
  await assertFails(getDocs(collection(adb,'studentLookups')));
  await assertFails(setDoc(doc(adb,'studentLookups','fake'),{email:A.email,canonicalStudentId:'student-b'}));
  await assertFails(updateDoc(doc(adb,'studentLookups',LOOKUP_ID),{canonicalStudentId:'student-b'}));
  await assertSucceeds(getDoc(doc(adb,'settings','studentSecurity')));
  await assertFails(getDoc(doc(anon,'settings','studentSecurity')));

  // 4) Korrigiertes ungebundenes Altprofil wird nach direktem Lookup direkt gelesen
  // und darf nur in einem engen Einzelschritt an die verifizierte UID gebunden werden.
  await assertSucceeds(getDoc(doc(adb,'students',LEGACY_ID)));
  await assertFails(getDoc(doc(bdb,'students',LEGACY_ID)));
  await assertFails(getDoc(doc(aub,'students',LEGACY_ID)));
  await assertFails(updateDoc(doc(bdb,'students',LEGACY_ID),{authUid:B.uid,authEmail:B.email,authVersion:2,authLinkedAt:new Date()}));
  await assertFails(updateDoc(doc(adb,'students',LEGACY_ID),{authUid:A.uid,authEmail:A.email,authVersion:2,authLinkedAt:new Date(),kurs:'MANIPULIERT'}));
  await assertSucceeds(updateDoc(doc(adb,'students',LEGACY_ID),{authUid:A.uid,authEmail:A.email,authVersion:2,authLinkedAt:new Date()}));
  await assertSucceeds(updateDoc(doc(adb,'students',LEGACY_ID),{nachname:'Sicher'}));
  // Nach der ersten Bindung entscheidet ausschließlich die UID, auch bei identischem E-Mail-Claim.
  await assertFails(getDoc(doc(xdb,'students',LEGACY_ID)));
  await assertFails(updateDoc(doc(xdb,'students',LEGACY_ID),{nachname:'Angriff'}));

  // 5) Neue Profile können nur für eigene verifizierte UID und E-Mail erstellt werden.
  await assertSucceeds(setDoc(doc(adb,'students','student-a-new'),{authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A'}));
  await assertFails(setDoc(doc(adb,'students','forged-owner'),{authUid:B.uid,authEmail:A.email,email:A.email,kurs:'KURS-A'}));
  await assertFails(setDoc(doc(adb,'students','forged-email'),{authUid:A.uid,authEmail:A.email,email:B.email,kurs:'KURS-A'}));
  await assertFails(setDoc(doc(aub,'students','unverified-create'),{authUid:A.uid,authEmail:A.email,email:A.email,kurs:'KURS-A'}));

  // 6) Fortschritt: direkte kanonische/Alias-Zugriffe sind eigentümergebunden.
  await assertSucceeds(getDoc(doc(adb,'progress','student-a')));
  await assertFails(getDoc(doc(bdb,'progress','student-a')));
  await assertFails(getDoc(doc(xdb,'progress','student-a')));
  await assertFails(getDoc(doc(adb,'progress','student-b')));
  await assertSucceeds(updateDoc(doc(adb,'progress','student-a'),{points:55}));
  await assertFails(updateDoc(doc(adb,'progress','student-a'),{authUid:B.uid}));
  await assertFails(updateDoc(doc(adb,'progress','student-a'),{authEmail:B.email}));
  await assertFails(updateDoc(doc(bdb,'progress','student-a'),{points:999}));
  await assertFails(updateDoc(doc(xdb,'progress','student-a'),{points:999}));
  await assertSucceeds(getDoc(doc(adb,'progress','alias-a')));
  await assertFails(getDoc(doc(bdb,'progress','alias-a')));
  await assertFails(getDoc(doc(xdb,'progress','alias-a')));
  await assertSucceeds(getDoc(doc(adb,'progress','legacy-progress-a')));
  await assertFails(getDoc(doc(bdb,'progress','legacy-progress-a')));
  await assertFails(setDoc(doc(adb,'progress','fake-b-alias'),{canonicalStudentId:'student-b',points:999}));
  await assertFails(setDoc(doc(adb,'progress','fake-authuid'),{authUid:B.uid,canonicalStudentId:'student-a',points:999}));
  await assertSucceeds(setDoc(doc(adb,'progress','new-a-alias'),{canonicalStudentId:'student-a',points:5}));
  await assertSucceeds(setDoc(doc(adb,'progress','new-a-bound'),{authUid:A.uid,authEmail:A.email,canonicalStudentId:'student-a',points:6}));

  // 7) Collection-Queries: Schüler dürfen nach der eigenen UID abfragen. Jede
  // E-Mail-basierte Schüler-/Fortschritts-Collection-Suche wird serverseitig abgelehnt.
  await assertSucceeds(getDocs(query(collection(adb,'students'),where('authUid','==',A.uid))));
  await assertFails(getDocs(collection(adb,'students')));
  await assertFails(getDocs(query(collection(adb,'students'),where('email','==',A.email))));
  await assertFails(getDocs(query(collection(bdb,'students'),where('email','==',A.email))));
  await assertFails(getDocs(query(collection(xdb,'students'),where('email','==',A.email))));
  await assertSucceeds(getDocs(query(collection(adb,'progress'),where('authUid','==',A.uid))));
  await assertFails(getDocs(query(collection(adb,'progress'),where('email','==',A.email))));
  await assertFails(getDocs(query(collection(bdb,'progress'),where('email','==',A.email))));

  // 8) Kursdaten sind lesbar für angemeldete Nutzer, nicht änderbar durch Schüler.
  await assertSucceeds(getDoc(doc(adb,'courses','KURS-A')));
  await assertFails(updateDoc(doc(adb,'courses','KURS-A'),{name:'Manipuliert'}));
  await assertFails(getDoc(doc(anon,'courses','KURS-A')));

  // 9) Genehmigte Lehrkraft bleibt privilegiert und verwaltet Profile, Fortschritt,
  // Lookup und Sicherheitsstatus.
  await assertSucceeds(getDoc(doc(tdb,'students','student-a')));
  await assertSucceeds(getDoc(doc(tdb,'students','student-b')));
  await assertSucceeds(updateDoc(doc(tdb,'students','student-b'),{kurs:'KURS-B2'}));
  await assertSucceeds(updateDoc(doc(tdb,'progress','student-b'),{points:81}));
  await assertSucceeds(updateDoc(doc(tdb,'courses','KURS-A'),{name:'Kurs A neu'}));
  await assertSucceeds(setDoc(doc(tdb,'studentLookups','teacher-made'),{email:B.email,canonicalStudentId:'student-b'}));
  await assertSucceeds(updateDoc(doc(tdb,'settings','studentSecurity'),{studentLookupReady:false}));

  console.log('Firestore strict UID isolation and direct legacy lookup tests passed.');
} finally {
  await env.cleanup();
}
