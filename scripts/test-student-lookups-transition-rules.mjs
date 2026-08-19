import fs from 'node:fs';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {collection,doc,getDoc,getDocs,setDoc,updateDoc,deleteDoc} from 'firebase/firestore';

const projectId='demo-sprachpilot-student-lookups-transition';
const rules=fs.readFileSync('firestore.transition-student-lookups.rules','utf8');
const env=await initializeTestEnvironment({projectId,firestore:{rules}});

try {
  await env.withSecurityRulesDisabled(async ctx=>{
    const db=ctx.firestore();
    await setDoc(doc(db,'students','student-a'),{studentId:'student-a',email:'a@example.com',kurs:'KURS-A'});
    await setDoc(doc(db,'studentLookups','kurs-a_a-example-com'),{
      canonicalStudentId:'student-a',studentId:'student-a',email:'a@example.com',courseKeys:['KURS-A'],lookupVersion:1
    });
    await setDoc(doc(db,'settings','studentSecurity'),{studentLookupReady:false});
    await setDoc(doc(db,'progress','student-a'),{studentId:'student-a',pointsTotal:100});
  });

  const anon=env.unauthenticatedContext().firestore();
  const signed=env.authenticatedContext('teacher-transition',{email:'teacher@example.com'}).firestore();

  // Ohne Auth bleibt die neue Collection vollständig gesperrt.
  await assertFails(getDoc(doc(anon,'studentLookups','kurs-a_a-example-com')));
  await assertFails(getDocs(collection(anon,'studentLookups')));
  await assertFails(setDoc(doc(anon,'studentLookups','x'),{canonicalStudentId:'x'}));

  // Exakter Lookup-Lebenszyklus des Lehrer-Dashboards unter den Übergangsregeln.
  await assertSucceeds(getDoc(doc(signed,'studentLookups','kurs-a_a-example-com')));
  await assertSucceeds(getDocs(collection(signed,'studentLookups')));
  await assertSucceeds(setDoc(doc(signed,'studentLookups','kurs-b_b-example-com'),{
    lookupVersion:1,canonicalStudentId:'student-b',studentId:'student-b',email:'b@example.com',courseKeys:['KURS-B'],active:true
  }));
  await assertSucceeds(updateDoc(doc(signed,'studentLookups','kurs-b_b-example-com'),{active:false}));
  await assertSucceeds(deleteDoc(doc(signed,'studentLookups','kurs-b_b-example-com')));

  // Die bestehenden Kompatibilitätswege bleiben für die einmalige Migration nutzbar.
  await assertSucceeds(getDocs(collection(signed,'students')));
  await assertSucceeds(getDoc(doc(signed,'settings','studentSecurity')));
  await assertSucceeds(setDoc(doc(signed,'settings','studentSecurity'),{studentLookupReady:true},{merge:true}));

  // Keine unbeabsichtigte Erweiterung auf unbekannte Collections.
  await assertFails(getDocs(collection(signed,'unlistedCollection')));
  await assertFails(setDoc(doc(signed,'unlistedCollection','x'),{value:1}));

  // Bestehender Schutz der Übergangsregeln bleibt erhalten: progress-Löschung verboten.
  await assertFails(deleteDoc(doc(signed,'progress','student-a')));

  console.log('Temporary studentLookups transition rules passed.');
} finally {
  await env.cleanup();
}
