import fs from 'node:fs';

const layer=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');
const login=fs.readFileSync(new URL('../login/index.html',import.meta.url),'utf8');
const register=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');

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

const registrationStart=layer.indexOf('export async function registerStudentV2');
const createPos=layer.indexOf('createSecureStudentCredential(email,password)',registrationStart);
const signInPos=layer.indexOf('signInSecureStudent(email,password)',registrationStart);
const legacyPos=layer.indexOf('legacyRegisterStudent({...payload,email,password})',registrationStart);
ok(registrationStart>=0&&createPos>registrationStart&&legacyPos>createPos,'registration must establish Firebase auth before legacy course validation');
ok(signInPos>createPos&&signInPos<legacyPos,'existing Firebase accounts must sign in before course validation');
ok(register.includes('registerStudentV2 as registerStudent'),'registration UI must use the strict-rules-compatible bootstrap');
ok(register.includes('mit E-Mail und Passwort ein'),'registration completion copy must no longer require a course code for normal login');

console.log('Student email/password login and strict-rules registration contract passed.');
