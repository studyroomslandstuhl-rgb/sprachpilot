globalThis.window=globalThis;
globalThis.StudentSecurityLookupExclusions={safelyExcluded:s=>s.securityLookupExcluded===true&&Number(s.securityLookupExcludedVersion||0)>=1&&!String(s.email||'').trim()&&!String(s.authUid||'').trim()};
await import('../teacher/legacy-lookup-resolution.js');
const r=globalThis.LegacyLookupResolution;
if(!r)throw new Error('LegacyLookupResolution not loaded');
function ok(value,message){if(!value)throw new Error(message)}

const neliaOld={__docId:'a-1_nelia_roiko_1995-04-30',vorname:'Nelia',nachname:'Roiko',kurs:'A-1'};
const neliaNew={__docId:'b174698_rojkonela-gmail-com',vorname:'Nelia',nachname:'Roiko',email:'rojkonela@gmail.com',kurs:'B174698'};
const neliaCandidates=r.exactNameCandidates(neliaOld,[neliaOld,neliaNew]);
ok(neliaCandidates.length===1&&r.studentId(neliaCandidates[0])===r.studentId(neliaNew),'exact full-name candidate should be shown');
ok(r.sameCourse(neliaOld,neliaNew)===false,'different courses must remain distinct');

const mohammed={__docId:'glk-68_mohammed_mohammed',vorname:'Mohammed',nachname:'Mohammed',kurs:'GLK-68'};
const almomni={__docId:'glk-68_mohammed_almomni',vorname:'Mohammed',nachname:'Almomni',email:'asmarmahmod19@gmail.com',kurs:'GLK-68'};
ok(r.exactNameCandidates(mohammed,[mohammed,almomni]).length===0,'different surname must not be treated as exact identity');

const lidiiaOld={__docId:r.LIDIIA_OLD,vorname:'Lidiia',nachname:'Akbarova',kurs:'B174698'};
const lidiiaTarget={__docId:r.LIDIIA_TARGET,vorname:'Lidiia',nachname:'Akbarova',email:'akbarovalidiia@gmail.com',kurs:'B174698',aliasIds:['b174698-akbarovalidiia-gmail-com']};
const progress=[
  {__docId:r.LIDIIA_OLD,points:300},
  {__docId:r.LIDIIA_TARGET,points:500},
  {__docId:'b174698-akbarovalidiia-gmail-com',canonicalStudentId:r.LIDIIA_TARGET,points:450}
];
const group=r.buildLidiiaGroup([lidiiaOld,lidiiaTarget],progress);
ok(group.canonicalId===r.LIDIIA_TARGET,'email-bearing Lidiia profile must be canonical');
ok(group.duplicateStudentIds.includes(r.LIDIIA_OLD),'old Lidiia profile must be duplicate');
ok(group.profiles[0].memberProgressIds.includes(r.LIDIIA_TARGET),'canonical progress must be included');
ok(group.profiles[0].memberProgressIds.includes('b174698-akbarovalidiia-gmail-com'),'canonical alias progress must be included');
ok(group.profiles[1].memberProgressIds.length===1&&group.profiles[1].memberProgressIds[0]===r.LIDIIA_OLD,'old profile progress must stay a separate point source');

const excluded={__docId:'b174698_anicuta_baciu',email:'',authUid:'',securityLookupExcluded:true,securityLookupExcludedVersion:1};
ok(r.unresolvedStudent(excluded)===false,'explicit safely excluded profile must not stay unresolved');
ok(r.unresolvedStudent({__docId:'b174698_anicuta_baciu',email:'',authUid:''})===true,'unresolved legacy profile should be shown');

const hints=r.emailHints({__docId:'glk-68_emmad_abo-hjazi_1982-01-02',aliasIds:['glk-68_emmad']},[
  {__docId:'glk-68_emmad',email:'emmad@example.com'}
],[]);
ok(hints.includes('emmad@example.com'),'progress email hint should be surfaced without auto-applying it');

console.log('Legacy lookup resolution tests passed.');
