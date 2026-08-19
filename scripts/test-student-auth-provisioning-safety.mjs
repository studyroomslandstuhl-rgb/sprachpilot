import fs from 'node:fs';
const src=fs.readFileSync(new URL('../teacher/student-auth-provisioning.js',import.meta.url),'utf8');
function ok(v,m){if(!v)throw new Error(m)}
ok(src.includes("accounts:signUp"),'Firebase account creation endpoint missing');
ok(src.includes("requestType:'PASSWORD_RESET'"),'password setup mail path missing');
ok(src.includes("requestType:'VERIFY_EMAIL'"),'verification mail path missing');
ok(src.includes('core.strongRandomPassword()'),'account creation must use cryptographic random password');
ok(!src.includes("password:'123'"),'fixed 123 password must never be used');
ok(!src.includes('password:"123"'),'fixed 123 password must never be used');
ok(!src.includes('authProvisioningPassword'),'temporary password must never be stored in student data');
ok(!src.includes('localStorage'),'provisioning must not store passwords or tokens in localStorage');
ok(!src.includes('sessionStorage'),'provisioning must not store passwords or tokens in sessionStorage');
ok(src.includes('Das zufällige Startkennwort wird absichtlich weder angezeigt noch gespeichert.'),'temporary-password safety contract comment missing');
ok(src.includes("if(!currentOwner())throw new Error('OWNER_REQUIRED')"),'per-student provisioning must require verified owner');
console.log('Student auth provisioning safety contract passed.');
