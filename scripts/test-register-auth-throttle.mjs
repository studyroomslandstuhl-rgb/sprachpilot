import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const loginV2=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');
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
assert.match(html,/>Registrieren<\/button>/,'primary registration action must exist');
assert.match(html,/>Ich habe schon ein Konto<\/a>/,'existing accounts must be routed to login');

// Registration wrapper: delegate once, never fall back to a second password login.
const marker='export async function registerStudentV2';
const start=loginV2.indexOf(marker);
assert.ok(start>=0,'registerStudentV2 must exist');
const registrationBlock=loginV2.slice(start);
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a second Firebase credential itself');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform a password-login fallback');
assert.match(registrationBlock,/registerStudentOnce\(\{\.\.\.payload,email,password\},finishPendingStudentRegistration\)/,'registration wrapper must delegate to the single-attempt helper');

// Registration helper: exactly one credential mutation.
assert.equal((registration.match(/await createSecureStudentCredential\s*\(/g)||[]).length,1,'registration helper must perform exactly one credential creation call');
assert.doesNotMatch(registration,/signInSecureStudent\s*\(/,'account-exists must never trigger an automatic password login');

// Secure auth: upgrade the anonymous course-lookup session and block retries after failures.
assert.match(secureAuth,/linkWithCredential\(current,emailCredential\)/,'anonymous Firebase sessions must be upgraded in place');
assert.match(secureAuth,/REGISTER_BLOCK_KEY/,'failed credential attempts must have a session-level retry guard');
assert.match(secureAuth,/THROTTLE_BLOCK_MS/,'Firebase throttling must create a local cooldown');
assert.match(secureAuth,/spNoSecondCredentialAttempt=true/,'non-retry credential errors must be marked explicitly');

// Firebase startup: importing the shared module must not itself create an anonymous account.
assert.match(firebase,/export const authReady=initialAuthState;/,'authReady must only wait for restored auth state');
assert.doesNotMatch(firebase,/export const authReady=ensureAuth\(\);/,'firebase.js must not sign in anonymously as an import side effect');
assert.match(firebase,/async function waitAuthRequired\(\)[\s\S]*?await ensureAuth\(\)/,'Firestore access must still request auth explicitly when needed');

console.log('Registration auth guard passed: one credential attempt, no eager anonymous auth, local throttle protection.');
