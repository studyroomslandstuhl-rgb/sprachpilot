import '../teacher/progress-security-alias-core.js';

const c=globalThis.ProgressSecurityAliasCore;
if(!c)throw new Error('ProgressSecurityAliasCore not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

const students=[{__docId:'student-a',email:'a@example.com',kurs:'KURS-A',aliasIds:['old-a']}];
const cleanProgress=[
  {__docId:'student-a',canonicalStudentId:'student-a'},
  {__docId:'old-a'},
  {__docId:'unassigned-test',securityArchived:true,studentId:'unassigned-test'}
];
const clean=c.resolveOwnership(students,cleanProgress);
ok(clean.ok===true,'archived orphan must not block migration');
ok(clean.failures.length===0,'archived orphan must not be a failure');
ok(clean.archived.includes('unassigned-test'),'archived id must be reported');
ok(clean.assignments.length===2,'only real progress should be assigned');

const unsafe=c.resolveOwnership(students,[...cleanProgress,{__docId:'unassigned-real',studentId:'unassigned-real'}]);
ok(unsafe.ok===false,'non-archived orphan must still block migration');
ok(unsafe.failures.some(x=>x.progressId==='unassigned-real'&&x.reason==='orphan-progress'),'orphan failure missing');

console.log('Archived progress resolver tests passed.');
