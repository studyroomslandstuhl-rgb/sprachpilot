globalThis.window=globalThis;
await import('../teacher/student-security-lookup-details.js');

const d=globalThis.StudentSecurityLookupDetails;
if(!d)throw new Error('StudentSecurityLookupDetails not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

const emailRow=d.formatRow(
  {studentId:'student-a',reason:'EMAIL_MISSING'},
  {__docId:'student-a',vorname:'Anna',nachname:'Beispiel',kurs:'A1'}
);
ok(emailRow.includes('student-a'),'student id missing');
ok(emailRow.includes('Anna Beispiel'),'student name missing');
ok(emailRow.includes('E-Mail: —'),'missing email must be explicit');
ok(emailRow.includes('Kurs: A1'),'course missing from row');
ok(emailRow.includes('Problem: E-Mail fehlt'),'email reason not translated');

const courseRow=d.formatRow(
  {studentId:'student-b',reason:'COURSE_MISSING'},
  {__docId:'student-b',name:'Berta Test',email:'berta@example.com'}
);
ok(courseRow.includes('Berta Test'),'direct name missing');
ok(courseRow.includes('berta@example.com'),'email missing from row');
ok(courseRow.includes('Problem: Kurs fehlt'),'course reason not translated');

const lookupRow=d.formatRow(
  {studentId:'student-c',key:'a1_student-c-example-com'},
  {__docId:'student-c',vorname:'Clara',nachname:'Muster',email:'clara@example.com',courseCode:'A1'}
);
ok(lookupRow.includes('Lookup fehlt: a1_student-c-example-com'),'lookup key missing');

const details=d.formatDetails([
  {item:{studentId:'student-a',reason:'EMAIL_MISSING'},student:{__docId:'student-a',vorname:'Anna',nachname:'Beispiel',kurs:'A1'}},
  {item:{studentId:'student-b',reason:'COURSE_MISSING'},student:{__docId:'student-b',name:'Berta Test',email:'berta@example.com'}}
]);
ok(details.startsWith('1. student-a'),'detail numbering wrong');
ok(details.includes('2. student-b'),'second detail missing');

console.log('Student security lookup detail tests passed.');
