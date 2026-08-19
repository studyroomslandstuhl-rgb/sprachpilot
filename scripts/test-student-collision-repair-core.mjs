import '../teacher/progress-security-alias-core.js';
import '../teacher/student-collision-repair-core.js';

const core=globalThis.StudentCollisionRepairCore;
const resolver=globalThis.ProgressSecurityAliasCore;
if(!core||!resolver)throw new Error('repair core not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}
function clone(value){return JSON.parse(JSON.stringify(value))}

const students=[
  {
    __docId:'a1_alona_vakulenko_1996-12-06',vorname:'Alona',nachname:'Vakulenko',email:'apazderina0@gmail.com',kurs:'B174698',active:true,
    docId:'b174698_alona_vakulenko_1996-12-06',studentId:'b174698_alona_vakulenko_1996-12-06',userId:'b174698_alona_vakulenko_1996-12-06'
  },
  {
    __docId:'b174698_alona_vakulenko_1996-12-06',email:'apazderina0@gmail.com',kurs:'B174698',active:true,
    studentId:'b174698_alona_vakulenko_1996-12-06',userId:'b174698_alona_vakulenko_1996-12-06'
  },
  {
    __docId:'kurs_student',vorname:'Alona',nachname:'Vakulenko',email:'apazderina0@gmail.com',active:true,
    canonicalStudentId:'kurs_student',docId:'kurs_student',studentId:'kurs_student',userId:'kurs_student',
    aliasIds:['kurs_student','kurs-apazderina0-gmail-com','a1_alona_vakulenko_1996-12-06']
  },
  {
    __docId:'B174698_shilan_mohamad_1999-01-24',vorname:'Shilan',nachname:'Mohamad',email:'shilan.mohammad1010@gmail.com',kurs:'B174698',active:true,
    docId:'B174698_shilan_mohamad_1999-01-24',studentId:'B174698_shilan_mohamad_1999-01-24',userId:'B1748698_shilan_mohamad_1999-01-24'
  },
  {
    __docId:'z-b-a1-07_shilan_mohamad_1999-01-24',vorname:'Shilan',nachname:'Mohamad',email:'shilan.mohammad1010@gmail.com',kurs:'B174698',active:true,
    docId:'b174698_shilan_mohamad_1999-01-24',studentId:'B174698_shilan_mohamad_1999-01-24',userId:'B1748698_shilan_mohamad_1999-01-24'
  }
];

const progress=[
  {__docId:'a1_alona_vakulenko_1996-12-06',email:'apazderina0@gmail.com',kurs:'B174698',fragen:{t1:{progressPercent:60}}},
  {__docId:'kurs_student',email:'apazderina0@gmail.com',fragen:{t1:{progressPercent:80}}},
  {__docId:'B174698_shilan_mohamad_1999-01-24',email:'shilan.mohammad1010@gmail.com',kurs:'B174698',verben:{t1:{progressPercent:40}}},
  {__docId:'b174698-shilan-mohammad1010-gmail-com',email:'shilan.mohammad1010@gmail.com',kurs:'B174698',verben:{t1:{progressPercent:90}}},
  {__docId:'z-b-a1-07_shilan_mohamad_1999-01-24',email:'shilan.mohammad1010@gmail.com',kurs:'B174698',verben:{t1:{progressPercent:50}}}
];

const plan=core.plan(students,progress,resolver);
ok(plan.groups.length===2,'expected two repair groups');
ok(plan.duplicateCount===3,'expected three duplicate student documents');

const alona=plan.groups.find(g=>g.config.key==='alona-vakulenko-b174698');
ok(alona.config.canonicalId==='b174698_alona_vakulenko_1996-12-06','wrong Alona canonical id');
ok(alona.mergedStudent.vorname==='Alona'&&alona.mergedStudent.nachname==='Vakulenko','Alona profile fields not preserved');
ok(alona.mergedStudent.docId===alona.config.canonicalId&&alona.mergedStudent.studentId===alona.config.canonicalId&&alona.mergedStudent.userId===alona.config.canonicalId,'Alona identity fields not canonicalized');
ok(alona.mergedStudent.aliasIds.includes('a1_alona_vakulenko_1996-12-06'),'Alona a1 alias missing');
ok(alona.mergedStudent.aliasIds.includes('kurs_student'),'Alona kurs_student alias missing');
ok(alona.relatedProgressIds.includes('a1_alona_vakulenko_1996-12-06')&&alona.relatedProgressIds.includes('kurs_student'),'Alona progress rows not collected');

const shilan=plan.groups.find(g=>g.config.key==='shilan-mohamad-b174698');
ok(shilan.config.canonicalId==='B174698_shilan_mohamad_1999-01-24','wrong Shilan canonical id');
ok(shilan.mergedStudent.userId===shilan.config.canonicalId,'Shilan typo userId not corrected');
ok(shilan.mergedStudent.aliasIds.includes('B1748698_shilan_mohamad_1999-01-24'),'Shilan typo id must remain as legacy alias');
ok(shilan.mergedStudent.aliasIds.includes('z-b-a1-07_shilan_mohamad_1999-01-24'),'Shilan old document id missing as alias');
ok(shilan.relatedProgressIds.includes('b174698-shilan-mohammad1010-gmail-com'),'Shilan email-based progress id not collected');

{
  const bound=clone(progress);
  bound[0].authUid='already-bound-uid';
  let blocked=false;
  try{core.plan(students,bound,resolver)}catch(error){blocked=String(error.message).startsWith('COLLISION_PROGRESS_AUTH_BOUND:')}
  ok(blocked,'repair must stop when related progress already has authUid');
}

{
  const unexpected=clone(students);
  unexpected.push({__docId:'another-alona',email:'apazderina0@gmail.com',kurs:'B174698'});
  let blocked=false;
  try{core.plan(unexpected,progress,resolver)}catch(error){blocked=String(error.message).startsWith('COLLISION_UNEXPECTED_PROFILE:')}
  ok(blocked,'repair must stop for an unexpected same-email/same-course profile');
}

{
  const bound=clone(students);
  bound[1].authUid='uid-alona';
  let blocked=false;
  try{core.plan(bound,progress,resolver)}catch(error){blocked=String(error.message).startsWith('COLLISION_AUTH_BOUND:')}
  ok(blocked,'repair must stop when a student document already has authUid');
}

console.log('Targeted student collision repair core tests passed.');
