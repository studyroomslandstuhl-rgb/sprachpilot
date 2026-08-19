globalThis.window=globalThis;
globalThis.OwnerAuthReadiness={OWNER_EMAILS:new Set(['studyroomslandstuhl@gmail.com'])};

function makeUser(overrides={}){
  let sent=0,reloaded=0;
  const user={
    email:'studyroomslandstuhl@gmail.com',
    isAnonymous:false,
    emailVerified:false,
    providerData:[{providerId:'password'}],
    async reload(){reloaded++},
    async sendEmailVerification(){sent++},
    ...overrides
  };
  return{user,get sent(){return sent},get reloaded(){return reloaded}};
}

let holder=makeUser();
globalThis.firebase={auth:()=>({currentUser:holder.user})};
await import('../teacher/owner-verification-email.js');
const m=globalThis.OwnerVerificationEmail;
if(!m)throw new Error('OwnerVerificationEmail not loaded');
function ok(v,msg){if(!v)throw new Error(msg)}

let result=await m.send();
ok(result.sent===true,'verification email should be sent');
ok(holder.sent===1,'sendEmailVerification should be called exactly once');
ok(holder.reloaded===1,'user should be reloaded before sending');

holder=makeUser({emailVerified:true});
result=await m.send();
ok(result.alreadyVerified===true,'already verified account should not send again');
ok(holder.sent===0,'already verified account must not send another email');

holder=makeUser({email:'other@example.com'});
let blocked=false;try{await m.send()}catch(e){blocked=e.message==='OWNER_EMAIL_NOT_ALLOWED'}
ok(blocked,'non-owner email must be blocked');

holder=makeUser({providerData:[{providerId:'google.com'}]});
blocked=false;try{await m.send()}catch(e){blocked=e.message==='OWNER_PASSWORD_PROVIDER_MISSING'}
ok(blocked,'non-password account must be blocked');

console.log('Owner verification email tests passed.');
