import fs from 'node:fs';
import assert from 'node:assert/strict';

class MemoryStorage {
  constructor(){this.map=new Map();this.failQuarantine=false}
  get length(){return this.map.size}
  key(index){return [...this.map.keys()][index]??null}
  getItem(key){return this.map.has(String(key))?this.map.get(String(key)):null}
  setItem(key,value){
    key=String(key);
    if(this.failQuarantine&&key.startsWith('SP_ACCOUNT_PROGRESS_QUARANTINE_V1_'))throw new Error('quota');
    this.map.set(key,String(value));
  }
  removeItem(key){this.map.delete(String(key))}
  clear(){this.map.clear()}
}

let activeProfile={canonicalStudentId:'student-a',role:'student',loginRole:'student'};
globalThis.localStorage=new MemoryStorage();
globalThis.window={dispatchEvent(){}};
globalThis.CustomEvent=class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail}};
globalThis.btoa=value=>Buffer.from(String(value),'binary').toString('base64');

let source=fs.readFileSync(new URL('../js/account-progress-owner-isolation.js',import.meta.url),'utf8');
source=source.replace(
  /^import\s+\{\s*getActiveProfile,\s*getActiveRole\s*\}\s+from\s+['"][^'"]+['"];?\s*/,
  'const getActiveProfile=()=>globalThis.__SP_TEST_PROFILE; const getActiveRole=()=>"student";\n'
);
globalThis.__SP_TEST_PROFILE=activeProfile;
const moduleUrl='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const {isolateLocalProgressOwner}=await import(moduleUrl);

const OWNER='SP_ACCOUNT_PROGRESS_OWNER';
const TASK='SP_L5_T1_V1_task-1.html';
const POINTS='SP_POINTS_TOTAL';
const full=JSON.stringify({total:2,done:[0,1],queue:[],completed:true,percent:100});
const partial=JSON.stringify({total:2,done:[0],queue:[1],completed:false,percent:50});
const weak=JSON.stringify({total:2,done:[],queue:[0,1],completed:false,percent:10});

function setProfile(id){
  activeProfile={canonicalStudentId:id,docId:id,studentId:id,userId:id,role:'student',loginRole:'student'};
  globalThis.__SP_TEST_PROFILE=activeProfile;
}
function quarantineKeys(){
  const keys=[];
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(String(key).startsWith('SP_ACCOUNT_PROGRESS_QUARANTINE_V1_'))keys.push(key);
  }
  return keys;
}

setProfile('student-a');
localStorage.setItem(OWNER,'student-a');
localStorage.setItem(TASK,full);
localStorage.setItem(POINTS,'50');
let result=await isolateLocalProgressOwner();
assert.equal(result.blocked,false);
assert.equal(localStorage.getItem(OWNER),'student-a');
assert.equal(localStorage.getItem(TASK),full);

setProfile('student-b');
result=await isolateLocalProgressOwner();
assert.equal(result.switchedAccount,true);
assert.equal(result.blocked,false);
assert.equal(localStorage.getItem(OWNER),'student-b');
assert.equal(localStorage.getItem(TASK),null);
assert.equal(localStorage.getItem(POINTS),null);
assert.ok(quarantineKeys().length>=2);

localStorage.setItem(TASK,partial);
localStorage.setItem(POINTS,'10');
setProfile('student-a');
result=await isolateLocalProgressOwner();
assert.equal(result.blocked,false);
assert.equal(localStorage.getItem(OWNER),'student-a');
assert.equal(localStorage.getItem(TASK),full);
assert.equal(localStorage.getItem(POINTS),'50');

setProfile('student-b');
localStorage.setItem(OWNER,'student-b');
localStorage.setItem(TASK,weak);
localStorage.setItem(POINTS,'1');
result=await isolateLocalProgressOwner();
assert.equal(result.blocked,false);
assert.equal(localStorage.getItem(TASK),partial);
assert.equal(localStorage.getItem(POINTS),'10');

// Kann der alte Stand nicht dauerhaft archiviert werden, darf der Besitzer nicht wechseln.
globalThis.localStorage=new MemoryStorage();
setProfile('student-c');
localStorage.setItem(OWNER,'student-c');
localStorage.setItem(TASK,full);
localStorage.failQuarantine=true;
setProfile('student-d');
result=await isolateLocalProgressOwner();
assert.equal(result.blocked,true);
assert.equal(localStorage.getItem(OWNER),'student-c');
assert.equal(localStorage.getItem(TASK),full);

// Die übergeordnete Sync-Schicht muss sowohl bei fehlender UID-Übereinstimmung
// als auch bei blockierter lokaler Isolation vor jedem Cloud-Aufruf zurückkehren.
globalThis.localStorage=new MemoryStorage();
globalThis.sessionStorage=new MemoryStorage();
globalThis.location={pathname:'/student-dashboard/index.html',search:'',reload(){throw new Error('unexpected reload')}};
globalThis.__SP_SAFE_SYNC_CALLS=0;
globalThis.__SP_TEST_SYNC_PROFILE={secureAuth:true,authUid:'student-d'};
globalThis.__SP_TEST_FIREBASE_USER={uid:'student-d',isAnonymous:false,emailVerified:true};

let syncSource=fs.readFileSync(new URL('../js/account-progress-sync.js',import.meta.url),'utf8');
syncSource=syncSource
  .replace(/^import\s+['"]\/js\/(?:progress|point-delta-bridge|ranking-mirror)\.js[^'"]*['"];?\s*$/gm,'')
  .replace(/^import\s+\{\s*authReady\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,'const authReady=Promise.resolve();')
  .replace(/^import\s+\{\s*getActiveProfile\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,'const getActiveProfile=()=>globalThis.__SP_TEST_SYNC_PROFILE;')
  .replace(/^import\s+\{\s*currentFirebaseUser\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,'const currentFirebaseUser=()=>globalThis.__SP_TEST_FIREBASE_USER;')
  .replace(/^import\s+\{\s*normalizeStudentIdentity\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,'const normalizeStudentIdentity=async()=>globalThis.__SP_TEST_SYNC_PROFILE;')
  .replace(/^import\s+\{\s*isolateLocalProgressOwner\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,"const isolateLocalProgressOwner=async()=>({active:true,blocked:true,currentId:'student-d',oldOwner:'student-c'});")
  .replace(/^import\s+\{\s*accountProgressReady,\s*startAccountProgressSync\s+as\s+startSafeAccountProgressSync\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,'const accountProgressReady=Promise.resolve(); const startSafeAccountProgressSync=async()=>{globalThis.__SP_SAFE_SYNC_CALLS++;return {active:true}};');
const syncUrl='data:text/javascript;base64,'+Buffer.from(syncSource).toString('base64');
const syncModule=await import(syncUrl);

const blockedIsolation=await syncModule.startAccountProgressSync();
assert.equal(blockedIsolation.blocked,true);
assert.equal(blockedIsolation.reason,'LOCAL_OWNER_ISOLATION_BLOCKED');
assert.equal(globalThis.__SP_SAFE_SYNC_CALLS,0);

// Selbst ein korrekt aussehendes lokales Profil darf nicht synchronisieren,
// wenn die aktive Firebase-UID einem anderen Schüler gehört.
globalThis.__SP_TEST_FIREBASE_USER={uid:'student-x',isAnonymous:false,emailVerified:true};
const blockedUid=await syncModule.startAccountProgressSync();
assert.equal(blockedUid.blocked,true);
assert.equal(blockedUid.reason,'SECURE_STUDENT_AUTH_REQUIRED');
assert.equal(globalThis.__SP_SAFE_SYNC_CALLS,0);

console.log('Account progress owner isolation, UID gate and blocked-sync tests passed.');
