globalThis.window=globalThis;
await import('../js/account-progress-cloud-core.js');
const core=globalThis.SPAccountProgressCloudCore;
if(!core)throw new Error('SPAccountProgressCloudCore not loaded');
function ok(value,message){if(!value)throw new Error(message)}

const cloudStrong={value:JSON.stringify({done:[0,1,2],percent:100}),updatedAt:200};
const pendingWeak={value:JSON.stringify({done:[0],percent:30}),updatedAt:300};
let chosen=core.chooseCloudOrPending(cloudStrong,pendingWeak);
ok(chosen.source==='cloud','stronger Firebase state must beat stale local pending state');

const equalCloud={value:JSON.stringify({done:[0,1],percent:60}),updatedAt:500};
const equalPending={value:JSON.stringify({done:[0,1],percent:60}),updatedAt:400};
chosen=core.chooseCloudOrPending(equalCloud,equalPending);
ok(chosen.source==='cloud','newer Firebase state must win when progress strength is equal');

const pendingStrong={value:JSON.stringify({done:[0,1,2,3],percent:100}),updatedAt:600};
chosen=core.chooseCloudOrPending(equalCloud,pendingStrong);
ok(chosen.source==='pending','genuine unsynced stronger progress must survive until uploaded');

const own=core.validJournal({ownerUid:'uid-a',studentId:'student-a',entries:{SP_L8_T1_TASK:{value:'{"done":[0]}',updatedAt:1}}},'uid-a','student-a');
ok(Object.keys(own.entries).length===1,'own pending journal should be accepted');
const foreign=core.validJournal({ownerUid:'uid-a',studentId:'student-a',entries:{SP_L8_T1_TASK:{value:'{"done":[0]}',updatedAt:1}}},'uid-b','student-b');
ok(Object.keys(foreign.entries).length===0,'foreign-account journal must never be reused');

ok(core.denied('SP_USER_PROFILE')===true,'profile data must not be treated as progress');
ok(core.denied('SP_ACCOUNT_PROGRESS_PENDING_V1_x')===true,'internal pending journal must never sync as lesson progress');
ok(core.eligible('SP_L8_T1_TASK','{"done":[0],"percent":50}')===true,'lesson progress key should be eligible');

const remote=new Map();
core.mergeRemote(remote,new Map([['k',{key:'k',value:'{"percent":80}',updatedAt:10}]]));
core.mergeRemote(remote,new Map([['k',{key:'k',value:'{"percent":20}',updatedAt:20}]]));
ok(JSON.parse(remote.get('k').value).percent===80,'remote alias merge must remain non-destructive');

console.log('Cloud-authoritative progress core tests passed.');
