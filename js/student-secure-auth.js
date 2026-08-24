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
import { auth, authReady } from './firebase.js';

const REGISTER_BLOCK_KEY='SP_REGISTER_AUTH_BLOCK_V2';
const EMAIL_EXISTS_BLOCK_MS=120000;
const THROTTLE_BLOCK_MS=300000;
let immediateRegistrationFailure=null;

function normalizedEmail(value){return String(value||'').trim().toLowerCase()}
function now(){return Date.now()}
function readRegistrationBlock(){
  try{
    const value=JSON.parse(sessionStorage.getItem(REGISTER_BLOCK_KEY)||'null');
    if(!value||!value.email||!value.at)return null;
    const max=value.code==='auth/too-many-requests'?THROTTLE_BLOCK_MS:EMAIL_EXISTS_BLOCK_MS;
    if(now()-Number(value.at)>max){sessionStorage.removeItem(REGISTER_BLOCK_KEY);return null}
    return value;
  }catch(e){return null}
}
function writeRegistrationBlock(email,code){
  const value={email:normalizedEmail(email),code:String(code||''),at:now()};
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
  error.code='auth/email-already-in-use';
  error.email=normalizedEmail(email);
  error.cause=original;
  error.spNoSecondCredentialAttempt=true;
  return error;
}
function semanticThrottle(original,email){
  const error=new Error('STUDENT_AUTH_THROTTLED');
  error.code='auth/too-many-requests';
  error.email=normalizedEmail(email);
  error.cause=original;
  error.spNoSecondCredentialAttempt=true;
  return error;
}
function blockedRegistrationError(email){
  const wanted=normalizedEmail(email),block=readRegistrationBlock();
  if(!block||block.email!==wanted)return null;
  if(block.code==='auth/too-many-requests')return semanticThrottle(null,wanted);
  if(block.code==='auth/email-already-in-use')return semanticAccountExists(null,wanted);
  return null;
}
function normalizeCreateError(error,email){
  const code=String(error?.code||'');
  if(code==='auth/email-already-in-use'||code==='auth/credential-already-in-use'){
    const block=writeRegistrationBlock(email,'auth/email-already-in-use');
    immediateRegistrationFailure=block;
    return semanticAccountExists(error,email);
  }
  if(code==='auth/too-many-requests'){
    const block=writeRegistrationBlock(email,'auth/too-many-requests');
    immediateRegistrationFailure=block;
    return semanticThrottle(error,email);
  }
  return error;
}

async function settleInitialAuth(){
  // firebase.js darf für Firestore-Lesezugriffe zunächst eine anonyme Sitzung
  // herstellen. Bei der Registrierung behalten wir diese Sitzung und wandeln
  // sie in das E-Mail/Passwort-Konto um, statt sie vorher ab- und erneut
  // anzumelden. Dadurch entsteht pro Registrierung nur ein Credential-Versuch.
  try{await authReady}catch(e){}
  return auth.currentUser||null;
}

export function currentFirebaseUser(){return auth.currentUser||null}

export function registrationAuthFailureState(){return readRegistrationBlock()}
export function clearRegistrationAuthFailure(email=''){clearRegistrationBlock(email)}

export async function reloadFirebaseUser(user=auth.currentUser){
  await settleInitialAuth();
  user=user||auth.currentUser;
  if(!user)return null;
  await reload(user);
  return auth.currentUser||user;
}

export async function signInSecureStudent(email,password){
  await settleInitialAuth();
  const wanted=normalizedEmail(email);
  // student-identity.js hatte historisch nach "email-already-in-use" sofort
  // noch einen Passwort-Login ausgelöst. Genau dieser zweite Credential-Aufruf
  // erzeugte bei falschem/neuem Passwort zusätzliche Firebase-Fehlversuche.
  // Wir blockieren nur diesen unmittelbar folgenden Registrierungs-Fallback.
  if(immediateRegistrationFailure?.email===wanted&&now()-Number(immediateRegistrationFailure.at||0)<15000){
    const code=immediateRegistrationFailure.code;
    immediateRegistrationFailure=null;
    if(code==='auth/too-many-requests')throw semanticThrottle(null,wanted);
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
  const blocked=blockedRegistrationError(wanted);if(blocked)throw blocked;
  const current=auth.currentUser||null;

  // Eine bereits laufende Registrierung derselben E-Mail darf das bestehende
  // nicht-anonyme Konto wiederverwenden, ohne einen weiteren Auth-Versuch.
  if(current&&!current.isAnonymous){
    if(normalizedEmail(current.email)===wanted){clearRegistrationBlock(wanted);return current}
    const mismatch=new Error('SECURE_AUTH_EMAIL_MISMATCH');mismatch.code='sp/auth-email-mismatch';throw mismatch;
  }

  try{
    let credential;
    if(current?.isAnonymous){
      // Firestore hat bereits eine anonyme Sitzung angelegt. Diese wird direkt
      // zum permanenten Schülerkonto hochgestuft. Kein signOut -> anonymous
      // signIn -> createUser Dreifachlauf mehr.
      const emailCredential=EmailAuthProvider.credential(wanted,pwd);
      credential=await linkWithCredential(current,emailCredential);
    }else{
      credential=await createUserWithEmailAndPassword(auth,wanted,pwd);
    }
    const user=auth.currentUser||credential.user;
    if(!user||user.isAnonymous||String(user.uid)!==String(credential.user.uid))throw new Error('SECURE_AUTH_RACE_DETECTED');
    clearRegistrationBlock(wanted);
    return user;
  }catch(error){
    throw normalizeCreateError(error,wanted);
  }
}

export async function sendStudentVerification(user=auth.currentUser){
  await settleInitialAuth();
  user=user||auth.currentUser;
  if(!user||user.isAnonymous)throw new Error('SECURE_AUTH_USER_REQUIRED');
  const preferredUrl=new URL('/register/?verify=1',location.origin).href;
  try{
    await sendEmailVerification(user,{url:preferredUrl,handleCodeInApp:false});
  }catch(error){
    if(error?.code!=='auth/unauthorized-continue-uri')throw error;
    await sendEmailVerification(user);
  }
}

export async function resetSecureStudentPassword(email){
  await settleInitialAuth();
  const preferredUrl=new URL('/login/',location.origin).href;
  try{
    await sendPasswordResetEmail(auth,normalizedEmail(email),{url:preferredUrl,handleCodeInApp:false});
  }catch(error){
    if(error?.code!=='auth/unauthorized-continue-uri')throw error;
    await sendPasswordResetEmail(auth,normalizedEmail(email));
  }
}

export async function secureStudentSignOut(){
  await settleInitialAuth();
  try{await signOut(auth)}catch(e){}
  if(auth.currentUser)throw new Error('SECURE_SIGNOUT_FAILED');
}

export function assertVerifiedStudentUser(user,email=''){
  const wanted=normalizedEmail(email);
  if(!user||user.isAnonymous||!user.uid)throw new Error('SECURE_AUTH_REQUIRED');
  if(wanted&&normalizedEmail(user.email)!==wanted)throw new Error('SECURE_AUTH_EMAIL_MISMATCH');
  if(user.emailVerified!==true)throw new Error('EMAIL_NOT_VERIFIED');
  return user;
}
