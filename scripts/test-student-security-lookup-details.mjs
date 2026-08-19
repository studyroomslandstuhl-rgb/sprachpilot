globalThis.window=globalThis;
await import('../teacher/student-security-lookup-details.js');

const d=globalThis.StudentSecurityLookupDetails;
if(!d)throw new Error('StudentSecurityLookupDetails not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

const emailRow=d.formatRow(
  {studentId:'student-a',reason:'EMAIL_MISSING'},
  {__docId:'student-a',vorname:'Anna',nachname:'Beispiel',kurs:'A1'},[],[]
);
ok(emailRow.includes('student-a'),'student id missing');
ok(emailRow.includes('Anna Beispiel'),'student name missing');
ok(emailRow.includes('E-Mail: —'),'missing email must be explicit');
ok(emailRow.includes('Kurs: A1'),'course missing from row');
ok(emailRow.includes('Problem: E-Mail fehlt'),'email reason not translated');
ok(emailRow.includes('Firebase-UID: NICHT GEBUNDEN'),'uid status missing');

const students=[
  {__docId:'legacy_lidiia',vorname:'Lidiia',nachname:'Akbarova',kurs:'B174698'},
  {__docId:'b174698_akbarovalidiia-gmail-com',vorname:'Lidiia',nachname:'Akbarova',email:'akbarovalidiia@gmail.com',kurs:'B174698',authUid:'uid-l'},
  {__docId:'other_nelia',vorname:'Nelia',nachname:'Roiko',email:'nelia@example.com',kurs:'B174698'},
  {__docId:'unrelated',vorname:'Anna',nachname:'Akbarova',email:'anna@example.com',kurs:'B174698'}
];
const candidates=d.findCandidates(students[0],students);
ok(candidates.length===1,'only exact Lidiia candidate expected');
ok(d.idOf(candidates[0].student)==='b174698_akbarovalidiia-gmail-com','wrong candidate');
ok(candidates[0].reasons.includes('gleicher vollständiger Name'),'exact-name reason missing');
ok(candidates[0].reasons.includes('gleicher Kurs'),'same-course reason missing');
ok(candidates[0].reasons.includes('Kandidat hat E-Mail'),'email evidence missing');

const progress=[
  {__docId:'legacy_lidiia',studentId:'legacy_lidiia'},
  {__docId:'mail-alias',canonicalStudentId:'legacy_lidiia'},
  {__docId:'other',studentId:'someone-else'}
];
const refs=d.progressRefsFor(students[0],progress);
ok(refs.includes('legacy_lidiia'),'direct progress missing');
ok(refs.includes('mail-alias'),'canonical progress reference missing');
ok(!refs.includes('other'),'unrelated progress leaked');

const formatted=d.formatRow(
  {studentId:'legacy_lidiia',reason:'EMAIL_MISSING'},students[0],candidates,refs
);
ok(formatted.includes('b174698_akbarovalidiia-gmail-com'),'candidate id missing from output');
ok(formatted.includes('akbarovalidiia@gmail.com'),'candidate email missing from output');
ok(formatted.includes('UID GEBUNDEN'),'candidate uid status missing');
ok(formatted.includes('Fortschrittsbezüge: legacy_lidiia, mail-alias'),'progress references missing');
ok(formatted.includes('nur Diagnose, KEINE automatische Zuordnung'),'safety wording missing');

const synthetic={__docId:'kurs-student'};
ok(d.findCandidates(synthetic,students).length===0,'synthetic nameless profile must not get guessed candidates');

console.log('Student security lookup detail/candidate tests passed.');
