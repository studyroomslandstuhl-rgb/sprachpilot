import '../teacher/legacy-progress-resolution-core.js';

const c=globalThis.LegacyProgressResolutionCore;
if(!c)throw new Error('LegacyProgressResolutionCore not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}
function throws(fn,needle){let err=null;try{fn()}catch(e){err=e}ok(err&&String(err.message).includes(needle),'expected '+needle)}

const students=[
  {__docId:'a-1_nelia_roiko_1995-04-30',vorname:'Nelia',nachname:'Roiko',kurs:'A-1'},
  {__docId:'b174698_studyroomslandstuhl-gmail-com',vorname:'Alisa',nachname:'Krekoten',email:'studyroomslandstuhl@gmail.com',kurs:'B174698',authUid:'uid-owner'},
  {__docId:'174698_nataliia_diukova_1990-11-24',vorname:'Nataliia',nachname:'Diukova',kurs:'B174698'},
  {__docId:'glk-68_alicekrekoten-gmail-com',vorname:'Alisa',nachname:'Krekoten',email:'alicekrekoten@gmail.com',kurs:'GLK-68',authUid:'uid-owner-2'},
  {__docId:'glk-68_emmad_abo-hjazi_1982-01-02',vorname:'Emmad',nachname:'Abo Hjazi',kurs:'GLK-68'},
  {__docId:'b174698_shazaalshikh2-gmail-com',vorname:'Shaza',nachname:'Alshikh',email:'shazaalshikh2@gmail.com',kurs:'B174698'},
  {__docId:'b174698_galbon1951-gmail-com',vorname:'Tetiana',nachname:'Lavrynenko',email:'galbon1951@gmail.com',kurs:'B174698'},
  {__docId:'b174698_tetiana_lavrynenko',vorname:'Tetiana',nachname:'Lavrynenko',email:'bondylove1@gmail.com',kurs:'B174698'},
  {__docId:'b174698_777vonychka777-gmail-com',vorname:'Vlad',nachname:'Nemogushchyi',email:'777vonychka777@gmail.com',kurs:'B174698',canonicalStudentId:'b174698_777vonychka777-gmail-com',aliasIds:['b174698-777vonychka777-gmail-com']},
  {__docId:'b174698_vlad_nemohushchyi',vorname:'Vlad',nachname:'Nemohushchyi',email:'777vonychka777@gmail.com',kurs:'B174698',studentId:'b174698_vlad_nemohushchyi'}
];
const progressIds=[
  ...c.SAFE_MAPPINGS.map(x=>x.progressId),
  ...c.ARCHIVE_IDS,
  c.MANUAL.shaza.progressId,
  c.MANUAL.tetiana.progressId
];
const progress=progressIds.map(id=>({__docId:id,studentId:id}));

const plan=c.buildPlan(students,progress);
ok(plan.mappings.length===c.SAFE_MAPPINGS.length,'safe mapping count');
ok(plan.archives.length===c.ARCHIVE_IDS.length,'archive count');
ok(plan.vlad.merged,'Vlad merge plan missing');
ok(plan.vlad.merged.canonicalStudentId===c.VLAD.canonicalId,'Vlad canonical wrong');
ok(plan.vlad.merged.aliasIds.includes(c.VLAD.duplicateId),'Vlad duplicate alias missing');
ok(plan.manual.shaza.progress&&plan.manual.tetiana.progress,'manual rows missing');
ok(c.mappingPatch('student-a').securityArchived===false,'mapping must unarchive');
ok(c.archivePatch().securityArchived===true,'archive flag missing');

// Ein bereits UID-gebundenes Zielprofil ist erlaubt: die Zuordnung geht an das existierende Profil,
// nicht an eine vom Altfortschritt behauptete UID.
ok(plan.mappings.some(x=>x.mapping.studentId==='b174698_studyroomslandstuhl-gmail-com'),'bound target must remain eligible');

const badProgress=progress.map(x=>x.__docId==='a-1_nelia'?{...x,authUid:'unexpected'}:x);
throws(()=>c.buildPlan(students,badProgress),'LEGACY_PROGRESS_ALREADY_AUTH_BOUND:a-1_nelia');

const conflictingStudents=students.map(x=>x.__docId===c.VLAD.duplicateId?{...x,authUid:'uid-other'}:x);
throws(()=>c.buildPlan(conflictingStudents,progress),'VLAD_AUTH_BINDING_CONFLICT');

console.log('Legacy progress resolution core tests passed.');
