import fs from 'node:fs';

const layer=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');
const login=fs.readFileSync(new URL('../login/index.html',import.meta.url),'utf8');
const register=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const accountSync=fs.readFileSync(new URL('../js/account-progress-sync.js',import.meta.url),'utf8');
const dashboard=fs.readFileSync(new URL('../student-dashboard/dashboard-bootstrap.js',import.meta.url),'utf8');
const firebaseConfig=JSON.parse(fs.readFileSync(new URL('../firebase.json',import.meta.url),'utf8'));
const indexes=JSON.parse(fs.readFileSync(new URL('../firestore.indexes.json',import.meta.url),'utf8'));

function ok(value,message){if(!value)throw new Error(message)}

ok(!login.includes('id="loginCourse"'),'student login must not ask for a course code');
ok(!login.includes('Passwort und Kurscode'),'login copy must not require password plus course code');
ok(login.includes('loginStudentWithEmailPassword'),'login UI must use email/password profile resolution');
ok(login.includes('MULTIPLE_STUDENT_PROFILES'),'multiple own profiles must be handled explicitly');
ok(login.includes('loginStudentProfileWithEmailPassword'),'profile choice must be validated through the secure login layer');

ok(layer.includes("where('authUid','==',String(uid))"),'student profile discovery must be scoped to the signed-in Firebase UID');
ok(layer.includes('getDocsFromServer'),'student profile discovery must use a fresh Firestore server query');
ok(layer.includes("throw new Error('STUDENT_NOT_FOUND')"),'unbound legacy accounts must fail closed instead of guessing a profile');
ok(layer.includes("throw new Error('STUDENT_AUTH_OWNERSHIP_MISMATCH')"),'selected profile must be revalidated against the signed-in UID');
ok(layer.includes("new Error('MULTIPLE_STUDENT_PROFILES')"),'ambiguous own profiles must require explicit selection');
ok(!layer.includes('loginStudent as legacyLoginStudent'),'normal bound-account login must not call the legacy login path that rewrites progress');
ok(layer.includes('persistBoundProfile'),'bound UID profile must be activated locally without a progress write');
ok(layer.includes("updateDoc(doc(db,'students',selected.id)"),'normal login may update only the small student document');
ok(!layer.includes("updateDoc(doc(db,'progress'"),'normal login layer must not update progress documents');

ok(accountSync.includes('alreadyCanonicalSecureProfile'),'account sync must recognize already canonical UID profiles');
ok(accountSync.includes('if(!alreadyCanonicalSecureProfile())'),'account sync must skip legacy identity writes for canonical UID profiles');
ok(dashboard.includes('alreadyCanonicalSecureProfile'),'dashboard must also skip legacy identity rewrites for canonical UID profiles');

ok(firebaseConfig?.firestore?.indexes==='firestore.indexes.json','firebase config must include the Firestore index exemption file');
const overrides=new Map((indexes.fieldOverrides||[]).map(row=>[row.fieldPath,row]));
for(const field of ['clientProgressStateV1','wortschatz','fragen','verben','perfekt','grammatik','metadata']){
  const row=overrides.get(field);
  ok(row&&row.collectionGroup==='progress',`missing progress index exemption for ${field}`);
  ok(Array.isArray(row.indexes)&&row.indexes.length===0,`${field} must have automatic indexing disabled`);
}

const registrationStart=layer.indexOf('export async function registerStudentV2');
const createPos=layer.indexOf('createSecureStudentCredential(email,password)',registrationStart);
const signInPos=layer.indexOf('signInSecureStudent(email,password)',registrationStart);
const legacyPos=layer.indexOf('legacyRegisterStudent({...payload,email,password})',registrationStart);
ok(registrationStart>=0&&createPos>registrationStart&&legacyPos>createPos,'registration must establish Firebase auth before legacy course validation');
ok(signInPos>createPos&&signInPos<legacyPos,'existing Firebase accounts must sign in before course validation');
ok(register.includes('registerStudentV2 as registerStudent'),'registration UI must use the strict-rules-compatible bootstrap');
ok(register.includes('mit E-Mail und Passwort ein'),'registration completion copy must no longer require a course code for normal login');

console.log('Student email/password login, index-limit hotfix and strict-rules registration contract passed.');
