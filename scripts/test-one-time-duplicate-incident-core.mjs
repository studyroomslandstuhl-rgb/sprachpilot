import '../teacher/one-time-duplicate-incident-core.js';

const c=globalThis.OneTimeDuplicateIncidentCore;
if(!c)throw new Error('OneTimeDuplicateIncidentCore not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}
const merge=(a,b)=>({...a,...b,fragen:{...(a.fragen||{}),...(b.fragen||{})},aliasIds:[...(a.aliasIds||[]),...(b.aliasIds||[])]});

// SHILAN: zwei Alias-Snapshots (120/100) gehören zum selben Profil -> nur 120.
// Das echte zweite Profil hat 80 -> einmalige Summe 200.
const shilan=c.GROUPS.find(x=>x.key==='shilan-mohamad-b174698');
const shilanStudents=[{__docId:shilan.canonicalId,aliasIds:shilan.duplicateStudentIds}];
const shilanProgress=[
  {__docId:shilan.canonicalId,pointsTotal:120,fragen:{a:{progressPercent:100}}},
  {__docId:'b174698-shilan-mohammad1010-gmail-com',pointsTotal:100},
  {__docId:'z-b-a1-07_shilan_mohamad_1999-01-24',pointsTotal:80}
];
let plan=c.buildGroupPlan({group:shilan,students:shilanStudents,progressRows:shilanProgress,mergeFn:merge});
ok(plan.targetPoints===200,'Shilan alias snapshot was double-counted');
ok(plan.breakdown.find(x=>x.profileId===shilan.canonicalId).points===120,'Shilan canonical max wrong');
ok(plan.breakdown.find(x=>x.profileId==='z-b-a1-07_shilan_mohamad_1999-01-24').points===80,'Shilan duplicate points wrong');
ok(plan.mergedProgress.pointsTotal===200&&plan.mergedProgress.punkteGesamt===200,'Shilan total fields not overridden');

// VLAD: 350 + Alias 280 = ein Profil -> 350; zweites Profil 90 -> 440.
const vlad=c.GROUPS.find(x=>x.key==='vlad-nemohushchyi-b174698');
const vladStudents=[{__docId:vlad.canonicalId},{__docId:'b174698_vlad_nemohushchyi'}];
const vladProgress=[
  {__docId:vlad.canonicalId,pointsTotal:350},
  {__docId:'b174698-777vonychka777-gmail-com',pointsTotal:280},
  {__docId:'b174698_vlad_nemohushchyi',pointsTotal:90}
];
plan=c.buildGroupPlan({group:vlad,students:vladStudents,progressRows:vladProgress,mergeFn:merge});
ok(plan.targetPoints===440,'Vlad alias snapshot was double-counted');
ok(plan.archiveIds.includes('b174698-777vonychka777-gmail-com')&&plan.archiveIds.includes('b174698_vlad_nemohushchyi'),'old Vlad progress not scheduled for archive');

// ALONA: das kanonische progress-Dokument wurde erst bei der vorherigen Reparatur erzeugt.
// Es darf deshalb nicht als drittes Profil nochmals Punkte beitragen. Nur a1 + kurs_student.
const alona=c.GROUPS.find(x=>x.key==='alona-vakulenko-b174698');
const alonaStudents=[{__docId:alona.canonicalId}];
const alonaProgress=[
  {__docId:alona.canonicalId,pointsTotal:70},
  {__docId:'a1_alona_vakulenko_1996-12-06',pointsTotal:50},
  {__docId:'kurs_student',pointsTotal:70}
];
plan=c.buildGroupPlan({group:alona,students:alonaStudents,progressRows:alonaProgress,mergeFn:merge});
ok(plan.targetPoints===120,'Alona synthetic canonical progress was double-counted');
ok(plan.breakdown.find(x=>x.profileId===alona.canonicalId).points===0,'Alona synthetic canonical must contribute zero points');

// Einmalmarker: zweiter Lauf darf nicht neu rechnen/addieren.
const marked=[{__docId:vlad.canonicalId,pointsTotal:440,oneTimeDuplicateIncidentVersion:1}];
plan=c.buildGroupPlan({group:vlad,students:vladStudents,progressRows:marked,mergeFn:merge});
ok(plan.alreadyDone===true,'one-time marker did not block second addition');

console.log('One-time duplicate incident core tests passed.');
