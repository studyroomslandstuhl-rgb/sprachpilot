import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const loginV2=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');

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
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a Firebase credential before the canonical registration flow');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform a second Firebase sign-in before the canonical registration flow');
assert.match(registrationBlock,/return legacyRegisterStudent\(\{\.\.\.payload,email,password\}\);/,'registration wrapper must delegate the single auth flow to student-identity.js');
assert.doesNotMatch(loginV2,/\bcreateSecureStudentCredential\b/,'student-login-v2 must not import the duplicate registration credential creator');

console.log('Registration uses normal wording, automatic email-verification completion, and one Firebase auth flow.');
