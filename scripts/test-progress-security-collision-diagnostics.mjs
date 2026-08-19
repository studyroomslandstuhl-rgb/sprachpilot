import '../teacher/progress-security-collision-diagnostics.js';

const diag=globalThis.ProgressSecurityCollisionDiagnostics;
if(!diag)throw new Error('ProgressSecurityCollisionDiagnostics not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

const resolver={
  studentIdOf:s=>String(s.__docId||''),
  progressIdOf:p=>String(p.__docId||'')
};
const students=[
  {__docId:'student-a',vorname:'A',nachname:'Test',email:'a@example.com',kurs:'K-1',authUid:'uid-a-123456789',canonicalStudentId:'student-a',docId:'student-a',studentId:'student-a',userId:'student-a',aliasIds:['old-a'],active:true,identityVersion:2},
  {__docId:'old-a',vorname:'A',nachname:'Test',email:'a@example.com',kurs:'K-1',aliasIds:[],active:true,identityVersion:1},
  {__docId:'student-b',vorname:'Berta',nachname:'Muster',email:'berta@example.com',kurs:'K-2',aliasIds:['old-b'],active:true,identityVersion:2},
  {__docId:'k-3_nelia_test',vorname:'Nelia',nachname:'Test',email:'nelia@example.com',kurs:'K-3',aliasIds:[],active:true,identityVersion:1}
];
const progress=[
  {__docId:'student-a',studentId:'student-a',email:'a@example.com',kurs:'K-1'},
  {__docId:'old-a',email:'a@example.com',kurs:'K-1'},
  {__docId:'old-b',email:'berta@example.com',kurs:'K-2'},
  {__docId:'orphan_nelia_test',vorname:'Nelia',nachname:'Test',kurs:'K-3',fragen:{l1:{progressPercent:50}},pointsTotal:12}
];
const errors=[
  {type:'duplicate-student-alias',alias:'old-a',studentId:'old-a',otherStudentId:'student-a'},
  {reason:'orphan-progress',progressId:'orphan_nelia_test'}
];
const lookups=[{__docId:'lookup-a',canonicalStudentId:'student-a'}];

const groups=diag.connectedGroups(errors);
ok(groups.length===1&&groups[0].includes('student-a')&&groups[0].includes('old-a'),'collision group failed');
const summary=diag.summarizeStudent(students[0],progress,resolver,lookups);
ok(summary.authBound===true,'auth binding missing');
ok(summary.progressDirect.includes('student-a')&&summary.progressDirect.includes('old-a'),'related progress ids missing');
ok(summary.lookupKeys.includes('lookup-a'),'lookup mapping missing');

const orphanSummary=diag.summarizeProgress(progress[3],students,resolver);
ok(orphanSummary.modules.includes('fragen'),'orphan module summary missing');
ok(orphanSummary.points.includes('pointsTotal=12'),'orphan point hint missing');
ok(orphanSummary.candidates.some(c=>c.studentId==='k-3_nelia_test'),'orphan structural candidate hint missing');

const report=diag.buildReport({resolver,students,progress},errors,lookups);
ok(report.includes('READ-ONLY KONFLIKTANALYSE'),'read-only heading missing');
ok(report.includes('Firebase-UID: GEBUNDEN'),'auth status missing');
ok(report.includes('Student-Lookups → dieses Dokument: lookup-a'),'lookup detail missing');
ok(report.includes('Es wurde nichts gelöscht, zusammengeführt oder umgebunden.'),'safety statement missing');
ok(report.includes('FORTSCHRITTSPROBLEME: 1'),'orphan problem count missing');
ok(report.includes('Fortschritt: orphan_nelia_test'),'orphan progress id missing');
ok(report.includes('Problem: orphan-progress'),'orphan reason missing');
ok(report.includes('Module mit Daten: fragen'),'orphan module output missing');
ok(report.includes('Punkte-Hinweise: pointsTotal=12'),'orphan point output missing');
ok(report.includes('k-3_nelia_test'),'orphan candidate detail missing');

console.log('Progress collision diagnostic tests passed.');
