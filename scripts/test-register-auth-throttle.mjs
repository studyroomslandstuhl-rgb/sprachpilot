import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const registerEntry=fs.readFileSync(new URL('../js/student-register-entry-v2.js',import.meta.url),'utf8');
const registration=fs.readFileSync(new URL('../js/student-registration-v3.js',import.meta.url),'utf8');
const secureAuth=fs.readFileSync(new URL('../js/student-secure-auth.js',import.meta.url),'utf8');
const firebase=fs.readFileSync(new URL('../js/firebase.js',import.meta.url),'utf8');

// UI: one click at a time and a clear throttle path.
assert.match(html,/registrationBusy=false/,'registration must have an in-flight guard');
assert.match(html,/if\(registrationBusy\)return;/,'parallel registration attempts must be ignored');
assert.match(html,/registrationBusy=true;/,'guard must activate before registration');
assert.match(html,/registrationBusy=false;/,'guard must be released after registration');
assert.match(html,/auth\/too-many-requests/,'Firebase throttling must have a dedicated UI branch');
assert.match(html,/Zu viele Versuche/,'throttling must be translated for students');
assert.match(html,/student-register-entry-v2\.js\?v=20260824-register2/,'registration page must load the repaired cache-busted entry');
assert.match(html,/>Registrieren<\/button>/,'primary registration action must exist');
assert.match(html,/>Ich habe schon ein Konto<\/a>/,'existing accounts must be routed to login');

// Registration wrapper: delegate once, never fall back to a password-login retry.
const marker='export async function registerStudentV2';
const start=registerEntry.indexOf(marker);
assert.ok(start>=0,'registerStudentV2 must exist');
const registrationBlock=registerEntry.slice(start);
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a second Firebase credential itself');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform a password-login fallback');
assert.match(registrationBlock,/registerStudentOnce\(\{\.\.\.payload,email,password\},finishPendingStudentRegistration\)/,'registration wrapper must delegate to the single-attempt helper');

// Registration helper: create exactly one secure credential BEFORE any Firestore course lookup.
assert.doesNotMatch(registration,/ensureCourseLookupAuth/,'registration must not create an anonymous auth preflight');
assert.doesNotMatch(registration,/COURSE_AUTH_BLOCK_KEY/,'registration must not keep an anonymous course-auth throttle cache');
assert.equal((registration.match(/await createSecureStudentCredential\s*\(/g)||[]).length,1,'registration helper must perform exactly one credential creation call');
assert.match(registration,/const user=await createSecureStudentCredential\(pending\.email,password\);[\s\S]*?courseLoaded=await loadAllowedCourse\(pending\.kurs\);/,'secure credential must exist before Firestore course lookup begins');
assert.match(registration,/await rollbackCredential\(user,createdThisAttempt\)/,'invalid course codes must roll back accounts created by that attempt');
assert.match(registration,/deleteUser\(user\)/,'rollback must delete the just-created Firebase account');
assert.doesNotMatch(registration,/signInSecureStudent\s*\(/,'account-exists must never trigger an automatic password login');

// Secure auth: only one credential mutation and no automatic password-login retry.
assert.match(secureAuth,/REGISTER_BLOCK_KEY/,'failed credential attempts must have a session-level guard');
assert.match(secureAuth,/spNoSecondCredentialAttempt=true/,'non-retry credential errors must be marked explicitly');
assert.doesNotMatch(registrationBlock,/signInWithEmailAndPassword/,'registration wrapper must not retry by password login');

// Firebase startup: importing the shared module must not itself create an anonymous account.
assert.match(firebase,/export const authReady=initialAuthState;/,'authReady must only wait for restored auth state');
assert.doesNotMatch(firebase,/export const authReady=ensureAuth\(\);/,'firebase.js must not sign in anonymously as an import side effect');
assert.match(firebase,/async function waitAuthRequired\(\)[\s\S]*?await ensureAuth\(\)/,'Firestore access may request auth for normal application reads after a user exists');

console.log('Registration auth guard passed: secure credential first, no anonymous preflight, no automatic retry loop.');
