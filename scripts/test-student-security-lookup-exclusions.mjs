globalThis.window=globalThis;
await import('../teacher/student-security-lookup-exclusions.js');
const x=globalThis.StudentSecurityLookupExclusions;
if(!x)throw new Error('StudentSecurityLookupExclusions not loaded');
function ok(value,message){if(!value)throw new Error(message)}

ok(x.safelyExcluded({securityLookupExcluded:true,securityLookupExcludedVersion:1,email:'',authUid:''})===true,'explicit unbound legacy profile should be excluded');
ok(x.safelyExcluded({securityLookupExcluded:true,securityLookupExcludedVersion:0,email:'',authUid:''})===false,'version marker required');
ok(x.safelyExcluded({securityLookupExcluded:true,securityLookupExcludedVersion:1,email:'a@example.com',authUid:''})===false,'profile with email must not be skipped');
ok(x.safelyExcluded({securityLookupExcluded:true,securityLookupExcludedVersion:1,email:'',authUid:'uid-a'})===false,'UID-bound profile must not be skipped');
ok(x.safelyExcluded({securityLookupExcluded:false,securityLookupExcludedVersion:1,email:'',authUid:''})===false,'explicit exclusion flag required');

console.log('Student security lookup exclusion tests passed.');
