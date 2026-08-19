import '../teacher/one-time-duplicate-incident-core.js';

const c=globalThis.OneTimeDuplicateIncidentCore;
if(!c)throw new Error('OneTimeDuplicateIncidentCore not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}
function throws(fn,needle){let err=null;try{fn()}catch(e){err=e}ok(err&&String(err.message).includes(needle),'expected '+needle)}
const merge=(a,b)=>({...a,...b,fragen:{...(a.fragen||{}),...(b.fragen||{})},aliasIds:[...(a.aliasIds||[]),...(b.aliasIds||[])]});

// SHILAN: canonical profile has two Alias-Snapshots (100/120) -> only 120 counts.
// Das echte zweite Profil has 80 -> desired one-time total = 200, not 300.
const shilan=c.GROUPS.find(x=>x.key==='shilan-mohamad-b174698');
const shilanStudents=[{__docId:shilan.canonicalId,aliasIds:shilan.duplicateStudentIds}];
const shilanCurrent=[
  {__docId:shilan.canonicalId,pointsTotal:120,fragen:{a:{progressPercent:100}}},
  {__docId:'b174698-shilan-mohammad1010-gmail-com',pointsTotal:100},
  {__docId:'z-b-a1-07_shilan_mohamad_1999-01-24',pointsTotal:80}
];
const shilanBackups=[
  {backupType:'student-collision-repair',groupKey:shilan.backupGroupKey,kind:'progress',path:'progress/'+shilan.canonicalId,snapshot:{pointsTotal:120}},
  {backupType:'student-collision-repair',groupKey:shilan.backupGroupKey,kind:'progress',path:'progress/b174698-shilan-mohammad1010-gmail-com',snapshot:{pointsTotal:100}},
  {backupType:'student-collision-repair',groupKey:shilan.backupGroupKey,kind:'progress',path:'progress/z-b-a1-07_shilan_mohamad_1999-01-24',snapshot:{pointsTotal:80}}
];
let plan=c.buildGroupPlan({group:shilan,students:shilanStudents,progressRows:shilanCurrent,backups:shilanBackups,mergeFn:merge});
ok(plan.targetPoints===200,'Shilan alias snapshot was double-counted');
ok(plan.breakdown.find(x=>x.profileId===shilan.canonicalId).points===120,'Shilan canonical profile max wrong');
ok(plan.breakdown.find(x=>x.profileId==='z-b-a1-07_shilan_mohamad_1999-01-24').points===80,'Shilan duplicate points wrong');
ok(plan.mergedProgress.pointsTotal===200&&plan.mergedProgress.punkteGesamt===200,'Shilan total fields not overridden');

// Falls seit der früheren Reparatur 20 echte neue Punkte auf dem kanonischen Profil entstanden,
// werden diese zusätzlich erhalten, ohne die alte Max-Merge-Basis erneut zu addieren.
const shilanNew=shilanCurrent.map(x=>x.__docId===shilan.canonicalId?{...x,pointsTotal:140}:x);
plan=c.buildGroupPlan({group:shilan,students:shilanStudents,progressRows:shilanNew,backups:shilanBackups,mergeFn:merge});
ok(plan.postRepairDelta===20&&plan.targetPoints===220,'post-repair delta not preserved');

// VLAD: 350 + alias snapshot 280 belong to ONE profile -> max 350. Second profile 90 -> 440.
const vlad=c.GROUPS.find(x=>x.key==='vlad-nemohushchyi-b174698');
const vladStudents=[{__docId:vlad.canonicalId},{__docId:'b174698_vlad_nemohushchyi'}];
const vladProgress=[
  {__docId:vlad.canonicalId,pointsTotal:350},
  {__docId:'b174698-777vonychka777-gmail-com',pointsTotal:280},
  {__docId:'b174698_vlad_nemohushchyi',pointsTotal:90}
];
plan=c.buildGroupPlan({group:vlad,students:vladStudents,progressRows:vladProgress,backups:[],mergeFn:merge});
ok(plan.targetPoints===440,'Vlad alias snapshot was double-counted');
ok(plan.archiveIds.includes('b174698-777vonychka777-gmail-com')&&plan.archiveIds.includes('b174698_vlad_nemohushchyi'),'old Vlad progress not scheduled for archive');

// ALONA must use the historical backups. Current already-merged data is never accepted as original source.
const alona=c.GROUPS.find(x=>x.key==='alona-vakulenko-b174698');
const alonaStudents=[{__docId:alona.canonicalId}];
throws(()=>c.buildGroupPlan({group:alona,students:alonaStudents,progressRows:[{__docId:alona.canonicalId,pointsTotal:999}],backups:[],mergeFn:merge}),'INCIDENT_ORIGINAL_BACKUPS_MISSING');
const alonaBackups=[
  {backupType:'student-collision-repair',groupKey:alona.backupGroupKey,kind:'progress',path:'progress/a1_alona_vakulenko_1996-12-06',snapshot:{pointsTotal:50}},
  {backupType:'student-collision-repair',groupKey:alona.backupGroupKey,kind:'progress',path:'progress/kurs_student',snapshot:{pointsTotal:70}}
];
plan=c.buildGroupPlan({group:alona,students:alonaStudents,progressRows:[{__docId:alona.canonicalId,pointsTotal:70}],backups:alonaBackups,mergeFn:merge});
ok(plan.targetPoints===120,'Alona duplicate profile points must sum once');

// Einmalmarker: second execution must not recompute/add anything.
const marked=[{__docId:vlad.canonicalId,pointsTotal:440,oneTimeDuplicateIncidentVersion:1}];
plan=c.buildGroupPlan({group:vlad,students:vladStudents,progressRows:marked,backups:[],mergeFn:merge});
ok(plan.alreadyDone===true,'one-time marker did not block second addition');

console.log('One-time duplicate incident core tests passed.');
