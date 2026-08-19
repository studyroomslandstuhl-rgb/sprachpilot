import fs from 'node:fs';
import assert from 'node:assert/strict';

class MemoryStorage{
  constructor(){this.map=new Map()}
  get length(){return this.map.size}
  key(i){return [...this.map.keys()][i]??null}
  getItem(k){return this.map.has(String(k))?this.map.get(String(k)):null}
  setItem(k,v){this.map.set(String(k),String(v))}
  removeItem(k){this.map.delete(String(k))}
  clear(){this.map.clear()}
}

globalThis.localStorage=new MemoryStorage();
globalThis.sessionStorage=new MemoryStorage();
globalThis.window={dispatchEvent(){}};
globalThis.CustomEvent=class CustomEvent{constructor(type,init={}){this.type=type;this.detail=init.detail}};
globalThis.document={documentElement:{dataset:{},style:{removeProperty(){}}}};
globalThis.location={pathname:'/student-dashboard/',search:'',hash:'',replaced:'',replace(value){this.replaced=value},set href(value){this.replaced=value}};

globalThis.__SP_TEST_PROFILE={};
globalThis.__SP_TEST_ROLE='';
globalThis.__SP_TEST_FIREBASE_USER=null;

let source=fs.readFileSync(new URL('../js/secure-access-gate.js',import.meta.url),'utf8');
source=source
  .replace(/^import\s+\{\s*auth,\s*authReady\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,
    'const auth={get currentUser(){return globalThis.__SP_TEST_FIREBASE_USER}}; const authReady=Promise.resolve(null);')
  .replace(/^import\s+\{\s*getActiveProfile,\s*getActiveRole\s*\}\s+from\s+['"][^'"]+['"];?\s*$/m,
    'const getActiveProfile=()=>globalThis.__SP_TEST_PROFILE; const getActiveRole=()=>globalThis.__SP_TEST_ROLE;');
const moduleUrl='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const {verifySecureAccess}=await import(moduleUrl);

function setStudent(id,userId=id,{verified=true}={}){
  const profile={canonicalStudentId:id,studentId:id,docId:id,userId:id,authUid:id,authEmail:`${id}@example.com`,email:`${id}@example.com`,authVersion:2,secureAuth:true,role:'student',loginRole:'student'};
  globalThis.__SP_TEST_PROFILE=profile;
  globalThis.__SP_TEST_ROLE='student';
  globalThis.__SP_TEST_FIREBASE_USER={uid:userId,email:`${userId}@example.com`,emailVerified:verified,isAnonymous:false};
  localStorage.setItem('SP_USER_PROFILE',JSON.stringify(profile));
  localStorage.setItem('SP_STUDENT_PROFILE',JSON.stringify(profile));
  localStorage.setItem('SP_STUDENT_ID',id);
  localStorage.setItem('SP_STUDENT_AUTH_UID',id);
  localStorage.setItem('SP_LOGIN_ROLE','student');
  localStorage.setItem('SP_ACTIVE_ROLE','student');
  location.replaced='';
  document.documentElement.dataset={};
  return profile;
}

// Exakte UID + bestätigte E-Mail: Zugriff erlaubt.
setStudent('student-a','student-a');
let result=await verifySecureAccess({allowTeacher:false,redirect:true,mark:true});
assert.equal(result.ok,true);
assert.equal(result.uid,'student-a');
assert.equal(document.documentElement.dataset.spSecureAuth,'ok');
assert.equal(location.replaced,'');
assert.ok(localStorage.getItem('SP_USER_PROFILE'));

// Lokales Profil A, aber aktive Firebase-UID B: strikt blockiert und aktive
// lokale Sitzung entfernt. Die Seite wird nicht sichtbar gemacht.
setStudent('student-a','student-b');
result=await verifySecureAccess({allowTeacher:false,redirect:true,mark:true});
assert.equal(result.ok,false);
assert.equal(result.reason,'STUDENT_UID_MISMATCH');
assert.equal(localStorage.getItem('SP_USER_PROFILE'),null);
assert.equal(localStorage.getItem('SP_STUDENT_PROFILE'),null);
assert.equal(localStorage.getItem('SP_STUDENT_ID'),null);
assert.ok(location.replaced.startsWith('/login/?redirect='));
assert.notEqual(document.documentElement.dataset.spSecureAuth,'ok');

// Anonyme oder unbestätigte Firebase-Sitzungen dürfen kein sicheres lokales Profil öffnen.
setStudent('student-a','student-a');
globalThis.__SP_TEST_FIREBASE_USER={uid:'anon',email:null,emailVerified:false,isAnonymous:true};
result=await verifySecureAccess({allowTeacher:false,redirect:false,mark:true});
assert.equal(result.ok,false);
assert.equal(result.reason,'VERIFIED_FIREBASE_STUDENT_REQUIRED');
assert.equal(localStorage.getItem('SP_USER_PROFILE'),null);

setStudent('student-a','student-a',{verified:false});
result=await verifySecureAccess({allowTeacher:false,redirect:false,mark:true});
assert.equal(result.ok,false);
assert.equal(result.reason,'VERIFIED_FIREBASE_STUDENT_REQUIRED');

// Lehrer dürfen Lerninhalte nur mit echter, nicht-anonymer Firebase-Sitzung öffnen.
globalThis.__SP_TEST_PROFILE={role:'teacher',loginRole:'teacher',isTeacher:true};
globalThis.__SP_TEST_ROLE='teacher';
globalThis.__SP_TEST_FIREBASE_USER={uid:'teacher-uid',email:'teacher@example.com',emailVerified:true,isAnonymous:false};
result=await verifySecureAccess({allowTeacher:true,redirect:false,mark:true});
assert.equal(result.ok,true);
assert.equal(result.type,'teacher');

console.log('Secure access gate UID visibility tests passed.');
