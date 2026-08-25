import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  signOut,
  EmailAuthProvider,
  linkWithCredential
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, authReady, functions, httpsCallable } from './firebase.js';

const REGISTER_BLOCK_KEY='SP_REGISTER_AUTH_BLOCK_V2';
const VERIFY_SENT_KEY='SP_REGISTER_VERIFY_SENT_V1';
const AUTH_DIAG_KEY='SP_REGISTER_AUTH_DIAG_V1';
const EMAIL_EXISTS_BLOCK_MS=120000;
const THROTTLE_BLOCK_MS=300000;
const VERIFY_COOLDOWN_MS=60000;
let immediateRegistrationFailure=null;

function normalizedEmail(value){return String(value||'').trim().toLowerCase()}
function now(){return Date.now()}
function readJson(key,fallback=null){try{return JSON.parse(sessionStorage.getItem(key)||'null')||fallback}catch(e){return fallback}}
function writeJson(key,value){try{sessionStorage.setItem(key,JSON.stringify(value))}catch(e){}}
function recordAuthEvent(stage,event,extra={}){
  const old=readJson(AUTH_DIAG_KEY,{credentialCalls:0,credentialFailures:0,verificationCalls:0,verificationFailures:0,anonymousUpgrades:0,last:null})||{};
  if(stage==='credential'&&event==='start')old.credentialCalls=Number(old.credentialCalls||0)+1;
  if(stage==='credential'&&event==='failure')old.credentialFailures=Number(old.credentialFailures||0)+1;
  if(stage==='verification'&&event==='start')old.verificationCalls=Number(old.verificationCalls||0)+1;
  if(stage==='verification'&&event==='failure')old.verificationFailures=Number(old.verificationFailures||0)+1;
  if(extra.anonymousUpgrade&&event==='success')old.anonymousUpgrades=Number(old.anonymousUpgrades||0)+1;
  old.last={stage,event,code:String(extra.code||''),transport:String(extra.transport||''),at:now()};writeJson(AUTH_DIAG_KEY,old);return old;
}
function readRegistrationBlock(){
  try{
    const value=JSON.parse(sessionStorage.getItem(REGISTER_BLOCK_KEY)||'null');
    if(!value||!value.email||!value.at)return null;
    const max=value.code==='auth/too-many-requests'?THROTTLE_BLOCK_MS:EMAIL_EXISTS_BLOCK_MS;
    if(now()-Number(value.at)>max){sessionStorage.removeItem(REGISTER_BLOCK_KEY);return null}
    return value;
  }catch(e){return null}
}
function writeRegistrationBlock(email,code,stage='credential'){
  const value={email:normalizedEmail(email),code:String(code||''),stage:String(stage||'credential'),at:now()};
  try{sessionStorage.setItem(REGISTER_BLOCK_KEY,JSON.stringify(value))}catch(e){}
  return value;
}
function clearRegistrationBlock(email=''){
  const wanted=normalizedEmail(email),value=readRegistrationBlock();
  if(!value||!wanted||value.email===wanted){try{sessionStorage.removeItem(REGISTER_BLOCK_KEY)}catch(e){}}
  if(!wanted||immediateRegistrationFailure?.email===wanted)immediateRegistrationFailure=null;
}
function semanticAccountExists(original,email){
  const error=new Error('STUDENT_AUTH_ACCOUNT_EXISTS');
  error.code='auth/email-already-in-use';error.authStage='credential';
  error.email=normalizedEmail(email);error.cause=original;error.spNoSecondCredentialAttempt=true;
  return error;
}
function semanticThrottle(original,email,stage='credential',retryAfterMs=0){
  const error=new Error('STUDENT_AUTH_THROTTLED');
  error.code='auth/too-many-requests';error.authStage=stage;
  error.email=normalizedEmail(email);error.cause=original;error.spNoSecondCredentialAttempt=true;
  error.retryAfterMs=Math.max(0,Number(retryAfterMs||0));
  return error;
}
function blockedRegistrationError(email){
  const wanted=normalizedEmail(email),block=readRegistrationBlock();
  if(!block||block.email!==wanted)return null;
  if(block.stage==='verification')return null;
  if(block.code==='auth/too-many-requests')return semanticThrottle(null,wanted,'credential');
  if(block.code==='auth/email-already-in-use')return semanticAccountExists(null,wanted);
  return null;
}
function verificationThrottleRemaining(user){
  const wanted=normalizedEmail(user?.email),block=readRegistrationBlock();
  if(!wanted||!block||block.email!==wanted||block.stage!=='verification'||block.code!=='auth/too-many-requests')return 0;
  return Math.max(0,THROTTLE_BLOCK_MS-(now()-Number(block.at||0)));
}
function normalizeCreateError(error,email){
  const code=String(error?.code||'');
  if(code==='auth/email-already-in-use'||code==='auth/credential-already-in-use'){
    const block=writeRegistrationBlock(email,'auth/email-already-in-use','credential');immediateRegistrationFailure=block;
    return semanticAccountExists(error,email);
  }
  if(code==='auth/too-many-requests'){
    const block=writeRegistrationBlock(email,'auth/too-many-requests','credential');immediateRegistrationFailure=block;
    return semanticThrottle(error,email,'credential');
  }
  try{error.authStage=error.authStage||'credential'}catch(e){}
  return error;
}
function verificationRecentlySent(user){
  const email=normalizedEmail(user?.email),uid=String(user?.uid||''),state=readJson(VERIFY_SENT_KEY,null);
  return !!(state&&state.email===email&&state.uid===uid&&now()-Number(state.at||0)<VERIFY_COOLDOWN_MS);
}
function rememberVerificationSent(user){writeJson(VERIFY_SENT_KEY,{email:normalizedEmail(user?.email),uid:String(user?.uid||''),at:now()})}
function callableUnavailable(error){
  const code=String(error?.code||'');
  return code==='functions/not-found'||code==='functions/unavailable'||code==='functions/internal'||code==='functions/deadline-exceeded'||code==='functions/unknown';
}
async function sendVerificationViaSprachPilot(user){
  if(!functions||typeof httpsCallable!=='function')throw Object.assign(new Error('SP_VERIFICATION_SERVICE_UNAVAILABLE'),{code:'functions/unavailable'});
  const call=httpsCallable(functions,'requestVerificationEmail');
  const result=await call({});
  if(result?.data?.ok!==true)throw Object.assign(new Error('SP_VERIFICATION_SERVICE_FAILED'),{code:'functions/internal'});
  return{sent:true,transport:'custom-smtp-v1',alreadyVerified:result?.data?.alreadyVerified===true};
}

async function settleInitialAuth(){
  try{await authReady}catch(e){}
  return auth.currentUser||null;
}

export function currentFirebaseUser(){return auth.currentUser||null}
export function registrationAuthFailureState(){return readRegistrationBlock()}
export function registrationAuthDiagnostics(){return readJson(AUTH_DIAG_KEY,{credentialCalls:0,credentialFailures:0,verificationCalls:0,verificationFailures:0,anonymousUpgrades:0,last:null})}
export function clearRegistrationAuthFailure(email=''){clearRegistrationBlock(email)}

export async function reloadFirebaseUser(user=auth.currentUser){
  await settleInitialAuth();user=user||auth.currentUser;if(!user)return null;await reload(user);return auth.currentUser||user;
}

export async function signInSecureStudent(email,password){
  await settleInitialAuth();
  const wanted=normalizedEmail(email);
  if(immediateRegistrationFailure?.email===wanted&&now()-Number(immediateRegistrationFailure.at||0)<15000){
    const code=immediateRegistrationFailure.code,stage=immediateRegistrationFailure.stage||'credential';immediateRegistrationFailure=null;
    if(code==='auth/too-many-requests')throw semanticThrottle(null,wanted,stage);
    throw semanticAccountExists(null,wanted);
  }
  const credential=await signInWithEmailAndPassword(auth,wanted,String(password||''));
  const user=await reloadFirebaseUser(credential.user);
  if(!user||user.isAnonymous||String(user.uid)!==String(credential.user.uid))throw new Error('SECURE_AUTH_RACE_DETECTED');
  return user;
}

export async function createSecureStudentCredential(email,password){
  await settleInitialAuth();
  const wanted=normalizedEmail(email),pwd=String(password||'');
  const current=auth.currentUser||null;

  if(current&&!current.isAnonymous){
    if(normalizedEmail(current.email)===wanted){clearRegistrationBlock(wanted);return current}
    const mismatch=new Error('SECURE_AUTH_EMAIL_MISMATCH');mismatch.code='sp/auth-email-mismatch';mismatch.authStage='credential';throw mismatch;
  }

  const blocked=blockedRegistrationError(wanted);if(blocked)throw blocked;

  recordAuthEvent('credential','start',{code:'started'});
  try{
    let credential,anonymousUpgrade=false;
    if(current?.isAnonymous){
      const emailCredential=EmailAuthProvider.credential(wanted,pwd);
      credential=await linkWithCredential(current,emailCredential);anonymousUpgrade=true;
    }else{
      credential=await createUserWithEmailAndPassword(auth,wanted,pwd);
    }
    const user=auth.currentUser||credential.user;
    if(!user||user.isAnonymous||String(user.uid)!==String(credential.user.uid))throw new Error('SECURE_AUTH_RACE_DETECTED');
    clearRegistrationBlock(wanted);recordAuthEvent('credential','success',{code:'success',anonymousUpgrade});return user;
  }catch(error){
    recordAuthEvent('credential','failure',{code:error?.code||error?.message});
    throw normalizeCreateError(error,wanted);
  }
}

export async function sendStudentVerification(user=auth.currentUser){
  await settleInitialAuth();user=user||auth.currentUser;
  if(!user||user.isAnonymous)throw new Error('SECURE_AUTH_USER_REQUIRED');
  if(user.emailVerified===true)return{skipped:true,reason:'already-verified'};
  const retryAfterMs=verificationThrottleRemaining(user);
  if(retryAfterMs>0)return{skipped:true,reason:'throttled-cooldown',retryAfterMs};
  if(verificationRecentlySent(user))return{skipped:true,reason:'cooldown'};
  recordAuthEvent('verification','start',{code:'started'});

  try{
    const result=await sendVerificationViaSprachPilot(user);
    rememberVerificationSent(user);recordAuthEvent('verification','success',{code:'success',transport:result.transport});return result;
  }catch(customError){
    if(!callableUnavailable(customError)){
      recordAuthEvent('verification','failure',{code:customError?.code||customError?.message,transport:'custom-smtp-v1'});
      try{customError.authStage='verification'}catch(e){}
      throw customError;
    }
    console.warn('[SprachPilot] eigener Bestätigungsmail-Dienst noch nicht erreichbar; Firebase-Mail wird als Übergang genutzt.',customError?.code||customError?.message||customError);
  }

  try{
    await sendEmailVerification(user);
    rememberVerificationSent(user);recordAuthEvent('verification','success',{code:'success',transport:'firebase-default'});return{sent:true,transport:'firebase-default'};
  }catch(error){
    recordAuthEvent('verification','failure',{code:error?.code||error?.message,transport:'firebase-default'});
    if(error?.code==='auth/too-many-requests'){
      writeRegistrationBlock(user.email,'auth/too-many-requests','verification');
      throw semanticThrottle(error,user.email,'verification',THROTTLE_BLOCK_MS);
    }
    try{error.authStage='verification'}catch(e){}
    throw error;
  }
}

export async function resetSecureStudentPassword(email){
  await settleInitialAuth();const preferredUrl=new URL('/login/',location.origin).href;
  try{await sendPasswordResetEmail(auth,normalizedEmail(email),{url:preferredUrl,handleCodeInApp:false})}
  catch(error){if(error?.code!=='auth/unauthorized-continue-uri')throw error;await sendPasswordResetEmail(auth,normalizedEmail(email))}
}

export async function secureStudentSignOut(){
  await settleInitialAuth();try{await signOut(auth)}catch(e){}if(auth.currentUser)throw new Error('SECURE_SIGNOUT_FAILED');
}

export function assertVerifiedStudentUser(user,email=''){
  const wanted=normalizedEmail(email);
  if(!user||user.isAnonymous||!user.uid)throw new Error('SECURE_AUTH_REQUIRED');
  if(wanted&&normalizedEmail(user.email)!==wanted)throw new Error('SECURE_AUTH_EMAIL_MISMATCH');
  if(user.emailVerified!==true)throw new Error('EMAIL_NOT_VERIFIED');
  return user;
}
