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

assert.match(loginV2,/if\(error\?\.code!==['"]auth\/email-already-in-use['"]\)throw error;/,'only email-already-in-use may fall back from create to sign-in');
assert.match(loginV2,/await signInSecureStudent\(email,password\);/,'existing Firebase accounts must still require their real password');

console.log('Registration throttling guard and error handling passed.');
