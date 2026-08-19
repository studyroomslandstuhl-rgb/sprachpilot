globalThis.window=globalThis;
await import('../teacher/student-auth-provisioning-core.js');
const c=globalThis.StudentAuthProvisioningCore;
if(!c)throw new Error('StudentAuthProvisioningCore not loaded');
function ok(v,m){if(!v)throw new Error(m)}

ok(c.classify({securityLookupExcluded:true,email:'',authUid:''}).kind==='excluded','safe excluded legacy profile not recognized');
ok(c.classify({email:'',authUid:''}).kind==='missing-email','missing email profile misclassified');
ok(c.classify({email:'Test@Example.com',authUid:'uid-1'}).kind==='bound-existing','bound account misclassified');
ok(c.classify({email:'Test@Example.com',authUid:''}).kind==='unbound','unbound account misclassified');
ok(c.classify({email:'Test@Example.com',authUid:'uid-1',authProvisioningVersion:1}).kind==='prepared','prepared account not idempotent');
ok(c.shouldBulkProcess({email:'a@example.com',authUid:''})===true,'pending profile should be bulk processed');
ok(c.shouldBulkProcess({email:'a@example.com',authProvisioningVersion:1})===false,'prepared profile must not be bulk processed again');
ok(c.shouldBulkProcess({securityLookupExcluded:true,email:'',authUid:''})===false,'excluded legacy profile must never be bulk provisioned');

let seed=0;
const cryptoMock={getRandomValues(bytes){for(let i=0;i<bytes.length;i++)bytes[i]=(seed++*37+11)%256;return bytes}};
const pw=c.strongRandomPassword(cryptoMock);
ok(pw.length===32,'temporary random password must be exactly 32 characters');
ok(/[a-z]/.test(pw),'temporary password needs lowercase');
ok(/[A-Z]/.test(pw),'temporary password needs uppercase');
ok(/[0-9]/.test(pw),'temporary password needs number');
ok(/[!@#$%&*?]/.test(pw),'temporary password needs special character');
ok(pw!=='123'&&pw!=='123456','shared weak password must never be produced');
console.log('Student auth provisioning core tests passed.');
