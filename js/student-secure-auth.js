import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth, authReady } from './firebase.js';

function normalizedEmail(value){return String(value||'').trim().toLowerCase()}

async function settleInitialAuth(){
  // firebase.js stellt für alte Seiten zunächst die bestehende/ggf. anonyme Sitzung her.
  // Sichere Schüleranmeldung startet erst danach, damit kein noch laufender
  // anonymer Login eine gerade gesetzte UID wieder überschreiben kann.
  try{await authReady}catch(e){}
  return auth.currentUser||null;
}

export function currentFirebaseUser(){return auth.currentUser||null}

export async function reloadFirebaseUser(user=auth.currentUser){
  await settleInitialAuth();
  user=user||auth.currentUser;
  if(!user)return null;
  await reload(user);
  return auth.currentUser||user;
}

export async function signInSecureStudent(email,password){
  await settleInitialAuth();
  const credential=await signInWithEmailAndPassword(auth,normalizedEmail(email),String(password||''));
  const user=await reloadFirebaseUser(credential.user);
  if(!user||user.isAnonymous||String(user.uid)!==String(credential.user.uid))throw new Error('SECURE_AUTH_RACE_DETECTED');
  return user;
}

export async function createSecureStudentCredential(email,password){
  await settleInitialAuth();
  const credential=await createUserWithEmailAndPassword(auth,normalizedEmail(email),String(password||''));
  const user=auth.currentUser||credential.user;
  if(!user||user.isAnonymous||String(user.uid)!==String(credential.user.uid))throw new Error('SECURE_AUTH_RACE_DETECTED');
  return user;
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
  await sendPasswordResetEmail(auth,normalizedEmail(email));
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
