import '../teacher/progress-security-alias-core.js';

const core=globalThis.ProgressSecurityAliasCore;
if(!core)throw new Error('ProgressSecurityAliasCore not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

const students=[
  {__docId:'student-a',email:'alice@example.com',kurs:'KURS-A',authUid:'uid-a',aliasIds:['old-a']},
  {__docId:'student-b',email:'bob@example.com',kurs:'KURS-B',authUid:'uid-b',aliasIds:[]},
  {__docId:'legacy-corrected',email:'shared@example.com',kurs:'KURS-X',aliasIds:['legacy-old-id']},
  {__docId:'legacy-shared-2',email:'shared@example.com',kurs:'KURS-Y',aliasIds:[]}
];

{
  const r=core.resolveOwnership(students,[{__docId:'student-a',points:1}]);
  ok(r.ok&&r.assignments[0].studentId==='student-a','canonical path mapping failed');
}
{
  const r=core.resolveOwnership(students,[{__docId:'old-a',points:1}]);
  ok(r.ok&&r.assignments[0].studentId==='student-a','stored alias mapping failed');
}
{
  const r=core.resolveOwnership(students,[{__docId:'legacy-progress-x',email:'shared@example.com',kurs:'KURS-X'}]);
  ok(r.ok&&r.assignments[0].studentId==='legacy-corrected','email+course mapping failed');
}
{
  const r=core.resolveOwnership(students,[{__docId:'legacy-old-id',email:'shared@example.com',kurs:'KURS-X'}]);
  ok(r.ok&&r.assignments[0].studentId==='legacy-corrected','corrected shared-email mapping failed');
}
{
  const r=core.resolveOwnership(students,[{__docId:'ambiguous',email:'shared@example.com'}]);
  ok(!r.ok&&r.failures[0].reason==='ambiguous-email','ambiguous email must fail');
}
{
  const r=core.resolveOwnership(students,[{__docId:'old-a',email:'bob@example.com',kurs:'KURS-B'}]);
  ok(!r.ok&&r.failures[0].reason==='progress-owner-collision','conflicting identity/email evidence must fail');
}
{
  const r=core.resolveOwnership(students,[{__docId:'student-a',authUid:'uid-b'}]);
  ok(!r.ok&&r.failures[0].reason==='progress-owner-collision','wrong authUid must fail');
}
{
  const duplicated=[...students,{__docId:'student-c',email:'c@example.com',kurs:'KURS-C',aliasIds:['old-a']}];
  const r=core.resolveOwnership(duplicated,[]);
  ok(!r.ok&&r.indexErrors.some(e=>e.type==='duplicate-student-alias'),'duplicate student alias must fail');
}
{
  const r=core.resolveOwnership(students,[{__docId:'historic-a',email:'alice@example.com',kurs:'KURS-A'}]);
  ok(r.ok,'historic A should resolve');
  const plan=core.buildAliasPlan(students,r.assignments);
  ok(plan.get('student-a').includes('historic-a'),'historic progress id must be added to alias plan');
}

console.log('Progress security alias resolver tests passed.');
