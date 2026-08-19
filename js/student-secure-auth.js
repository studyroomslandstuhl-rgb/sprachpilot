import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from './firebase.js';

function normalizedEmail(value){return String(value||'').trim().toLowerCase()}

export function currentFirebaseUser(){return auth.currentUser||null}

export async function reloadFirebaseUser(user=auth.currentUser){
  if(!user)return null;
  await reload(user);
  return auth.currentUser||user;
}

export async function signInSecureStudent(email,password){
  const credential=await signInWithEmailAndPassword(auth,normalizedEmail(email),String(password||''));
  const user=await reloadFirebaseUser(credential.user);
  return user;
}

export async function createSecureStudentCredential(email,password){
  const credential=await createUserWithEmailAndPassword(auth,normalizedEmail(email),String(password||''));
  return credential.user;
}

export async function sendStudentVerification(user=auth.currentUser){
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
  await sendPasswordResetEmail(auth,normalizedEmail(email));
}

export async function secureStudentSignOut(){
  try{await signOut(auth)}catch(e){}
}

export function assertVerifiedStudentUser(user,email=''){
  const wanted=normalizedEmail(email);
  if(!user||user.isAnonymous||!user.uid)throw new Error('SECURE_AUTH_REQUIRED');
  if(wanted&&normalizedEmail(user.email)!==wanted)throw new Error('SECURE_AUTH_EMAIL_MISMATCH');
  if(user.emailVerified!==true)throw new Error('EMAIL_NOT_VERIFIED');
  return user;
}
