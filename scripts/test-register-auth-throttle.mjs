import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../register/index.html',import.meta.url),'utf8');
const loginV2=fs.readFileSync(new URL('../js/student-login-v2.js',import.meta.url),'utf8');

assert.match(html,/let registrationBusy=false;/,'registration must have an in-flight guard');
assert.match(html,/if\(registrationBusy\)return;/,'parallel registration attempts must be ignored');
assert.match(html,/registrationBusy=true;/,'guard must activate before the Firebase request');
assert.match(html,/finally\{registrationBusy=false;/,'guard must always be released');
assert.match(html,/code==="auth\/too-many-requests"/,'Firebase throttling must have a dedicated UI branch');
assert.match(html,/vorübergehend blockiert/,'technical throttling error must be translated for students');
assert.match(html,/Passwort vergessen/,'throttled existing accounts must be directed to password recovery');

const marker='export async function registerStudentV2';
const start=loginV2.indexOf(marker);
assert.ok(start>=0,'registerStudentV2 must exist');
const registrationBlock=loginV2.slice(start);
assert.doesNotMatch(registrationBlock,/createSecureStudentCredential\s*\(/,'registration wrapper must not create a Firebase credential before the canonical registration flow');
assert.doesNotMatch(registrationBlock,/signInSecureStudent\s*\(/,'registration wrapper must not perform a second Firebase sign-in before the canonical registration flow');
assert.match(registrationBlock,/return legacyRegisterStudent\(\{\.\.\.payload,email,password\}\);/,'registration wrapper must delegate the single auth flow to student-identity.js');
assert.doesNotMatch(loginV2,/\bcreateSecureStudentCredential\b/,'student-login-v2 must not import the duplicate registration credential creator');

console.log('Registration uses one Firebase auth flow and keeps throttling UI safeguards.');
