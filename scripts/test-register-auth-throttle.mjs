import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const loginV2=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');
const registration=fs.readFileSync(new URL('../js/student-registration-v3.js',import.meta.url),'utf8');
const secureAuth=fs.readFileSync(new URL('../js/student-secure-auth.js',import.meta.url),'utf8');
const firebase=fs.readFileSync(new URL('../js/firebase.js',import.meta.url),'utf8');

assert.match(html,/let registrationBusy=false;/,'registration must have an in-flight guard');
assert.match(html,/if\(registrationBusy\)return;/,'parallel registration attempts must be ignored');
assert.match(html,/registrationBusy=true;/,'guard must activate before the Firebase request');
assert.match(html,/registrationBusy=false;/,'guard must always be released');
assert.match(html,/code==="auth\/too-many-requests"/,'Firebase throttling must have a dedicated UI branch');
assert.match(html,/Zu viele Versuche/,'technical throttling error must be translated for students');
assert.match(html,/Passwort vergessen/,'existing accounts must be directed to password recovery');

assert.match(html,/>Registrieren<\/button>/,'primary action must use normal registration wording');
assert.match(html,/>Ich habe schon ein Konto<\/a>/,'secondary action must use normal account wording');
assert.doesNotMatch(html,/Sicheres Konto einrichten/,'old secure-account wording must not be shown');
assert.doesNotMatch(html,/Ich habe schon ein sicheres Konto/,'old secure-account login wording must not be shown');
assert.doesNotMatch(html,/Nach E-Mail-Bestätigung abschließen/,'manual finish button must not return');
assert.doesNotMatch(html,/id="finishBtn"/,'manual verification finish button must not exist');
assert.match(html,/finishRegistrationAutomatically/,'verification completion must happen automatically');
assert.match(html,/verificationReturn.*verify.*1/s,'verification return must trigger automatic completion');
assert.match(html,/window\.addEventListener\('focus'/,'returning to the registration tab must re-check verification');
assert.match(html,/visibilitychange/,'returning to a visible tab must re-check verification');

const marker='export async function registerStudentV2';
const start=loginV2.indexOf(marker);
assert.ok(start>=0,'registerStudentV2 must exist');
const registrationBlock=loginV2.slice(start);
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a second Firebase credential itself');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform a Firebase password sign-in');
assert.match(registrationBlock,/return registerStudentOnce\(\{\.\.\.payload,email,password\},finishPendingStudentRegistration\);/,'registration wrapper must delegate to the single-attempt registration helper');
assert.doesNotMatch(registrationBlock,/legacyRegisterStudent/,'legacy registration flow must not be used');

assert.match(registration,/const user=await createSecureStudentCredential\(pending\.email,password\);/,'registration helper must perform a credential call');
assert.equal((registration.match(/await createSecureStudentCredential\s*\(/g)||[]).length,1,'registration helper must perform exactly one credential creation call');
assert.doesNotMatch(registration,/signInSecureStudent\s*\(/,'registration helper must never convert account-exists into a password login attempt');
assert.match(secureAuth,/linkWithCredential\(current,emailCredential\)/,'an existing anonymous Firebase session must be upgraded instead of discarded and recreated');
assert.match(secureAuth,/current\?\.isAnonymous/,'secure auth must explicitly handle the anonymous registration session');
assert.match(secureAuth,/immediateRegistrationFailure/,'secure auth must remember an immediate registration credential failure');
assert.match(secureAuth,/spNoSecondCredentialAttempt=true/,'registration account-exists/throttle errors must be marked as non-retry errors');
assert.match(secureAuth,/REGISTER_BLOCK_KEY/,'repeated registration credential attempts must have a session-level guard');
assert.match(secureAuth,/THROTTLE_BLOCK_MS/,'Firebase throttling must block repeated local credential calls for a cooldown');
assert.match(html,/resetStaleRegistrationSession\(targetEmail=''/,'registration session cleanup must distinguish the target e-mail');
assert.match(html,/user&&!user\.isAnonymous/,'the registration page must keep the Firebase anonymous session instead of signing it out unconditionally');
assert.doesNotMatch(html,/await resetStaleRegistrationSession\(\);clearTeacherSessionMarkers\(\)/,'a fresh registration must not blindly sign out the Firebase session before the course lookup');

assert.match(firebase,/export const authReady=initialAuthState;/,'importing firebase.js must only wait for the restored auth state');
assert.doesNotMatch(firebase,/export const authReady=ensureAuth\(\);/,'importing firebase.js must never create an anonymous Firebase account eagerly');
assert.match(firebase,/async function waitAuthRequired\(\)[\s\S]*await ensureAuth\(\)/,'Firestore operations must still request anonymous auth explicitly when needed');

console.log('Registration performs one credential attempt, avoids eager anonymous auth, blocks duplicate failed attempts, and keeps automatic verification completion.');
