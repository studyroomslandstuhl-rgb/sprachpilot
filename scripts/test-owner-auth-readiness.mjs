globalThis.window=globalThis;
await import('../teacher/owner-auth-readiness.js');

const d=globalThis.OwnerAuthReadiness;
if(!d)throw new Error('OwnerAuthReadiness not loaded');
function ok(condition,message){if(!condition)throw new Error(message)}

const ready=d.evaluate({
  userPresent:true,
  email:'studyroomslandstuhl@gmail.com',
  isAnonymous:false,
  userEmailVerified:true,
  tokenEmailVerified:true,
  signInProvider:'password',
  reloadOk:true,
  tokenRefreshOk:true,
  linkedProviders:['password']
});
ok(ready.ready===true,'valid owner password account should be ready');
ok(d.resultText(ready).includes('OWNER-KONTO BEREIT'),'ready summary missing');

const unverified=d.evaluate({...ready,userEmailVerified:false});
ok(unverified.ready===false,'unverified user must not be ready');

const tokenUnverified=d.evaluate({...ready,tokenEmailVerified:false});
ok(tokenUnverified.ready===false,'unverified token must not be ready');

const google=d.evaluate({...ready,signInProvider:'google.com'});
ok(google.ready===false,'non-password sign-in provider must not be ready');

const wrongEmail=d.evaluate({...ready,email:'other@example.com'});
ok(wrongEmail.ready===false,'non-owner email must not be ready');

const staleDisabledLike=d.evaluate({...ready,tokenRefreshOk:false});
ok(staleDisabledLike.ready===false,'failed forced token refresh must block readiness');

const anon=d.evaluate({...ready,isAnonymous:true});
ok(anon.ready===false,'anonymous account must not be ready');

const none=d.evaluate({userPresent:false});
ok(none.ready===false,'missing user must not be ready');
ok(d.resultText(none).includes('kein Firebase-Benutzer'),'missing-user summary missing');

console.log('Owner auth readiness tests passed.');
