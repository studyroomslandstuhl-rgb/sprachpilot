'use strict';

const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {defineJsonSecret}=require('firebase-functions/params');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
const nodemailer=require('nodemailer');
const core=require('./auth-mail-core');

const REGION='europe-west1';
const SMTP_CONFIG=defineJsonSecret('SPRACHPILOT_SMTP');
const OWNER_EMAILS=new Set([
  'studyroomslandstuhl@gmail.com',
  'alicekrekoten@gmail.com',
  'alisa.krekoten@gmail.com'
]);

function tokenProvider(authContext){return core.text(authContext?.token?.firebase?.sign_in_provider)}
function tokenEmail(authContext){return core.normalizeEmail(authContext?.token?.email)}
function assertOwner(authContext){
  const email=tokenEmail(authContext);
  if(!authContext?.uid||authContext?.token?.email_verified!==true||tokenProvider(authContext)!=='password'||!OWNER_EMAILS.has(email)){
    throw new HttpsError('permission-denied','OWNER_REQUIRED');
  }
  return{uid:String(authContext.uid),email};
}
function functionOptions(){return{region:REGION,secrets:[SMTP_CONFIG],timeoutSeconds:60,memory:'256MiB'}}
function clean(value,max=180){return core.text(value).slice(0,max)}
function lookupClean(value){
  return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function courseValues(student={}){
  return [...new Set([student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course].map(core.text).filter(Boolean))];
}
function lookupKeys(email,courses=[]){
  const mail=core.normalizeEmail(email);
  if(!mail)return[];
  return [...new Set(courses.map(course=>`${lookupClean(course)}_${lookupClean(mail)}`).filter(key=>key!=='_'))];
}
function smtpConfig(){
  const value=SMTP_CONFIG.value()||{};
  const host=core.text(value.host),user=core.text(value.user),pass=core.text(value.pass);
  const port=Number(value.port||0),secure=value.secure===true||String(value.secure).toLowerCase()==='true';
  const fromEmail=core.normalizeEmail(value.fromEmail||user),fromName=core.text(value.fromName||'SprachPilot');
  const replyTo=core.normalizeEmail(value.replyTo||'');
  if(!host||!port||!user||!pass||!core.validEmail(fromEmail))throw new Error('SMTP_CONFIG_INCOMPLETE');
  return{host,port,secure,user,pass,fromEmail,fromName,replyTo};
}
async function sendVerification(to,name,url){
  const cfg=smtpConfig();
  const transport=nodemailer.createTransport({host:cfg.host,port:cfg.port,secure:cfg.secure,auth:{user:cfg.user,pass:cfg.pass}});
  const templateSnap=await getFirestore().collection('settings').doc('authMailTemplates').get();
  const template=core.templateFor('verification',templateSnap.exists?(templateSnap.data()?.verification||{}):{});
  const mail=core.buildVerificationMail({name,url,template});
  const message={from:{name:cfg.fromName,address:cfg.fromEmail},to,subject:mail.subject,text:mail.text,html:mail.html};
  if(cfg.replyTo)message.replyTo=cfg.replyTo;
  await transport.sendMail(message);
}
async function findAuthEmailConflict(email,allowedUid=''){
  try{
    const found=await getAuth().getUserByEmail(email);
    if(found.uid!==allowedUid)throw new HttpsError('already-exists','EMAIL_ALREADY_IN_USE');
    return found;
  }catch(error){
    if(String(error?.code)==='auth/user-not-found')return null;
    throw error;
  }
}

exports.updateStudentAccount=onCall(functionOptions(),async request=>{
  const owner=assertOwner(request.auth);
  const studentId=clean(request.data?.studentId,180);
  const email=core.normalizeEmail(request.data?.email);
  const firstName=clean(request.data?.firstName,120);
  const lastName=clean(request.data?.lastName,120);
  const courseCode=clean(request.data?.courseCode,180);
  if(!studentId)throw new HttpsError('invalid-argument','STUDENT_ID_REQUIRED');
  if(!core.validEmail(email))throw new HttpsError('invalid-argument','INVALID_EMAIL');

  const database=getFirestore(),ref=database.collection('students').doc(studentId),snap=await ref.get();
  if(!snap.exists)throw new HttpsError('not-found','STUDENT_NOT_FOUND');
  const student=snap.data()||{};
  const canonical=core.text(student.canonicalStudentId)||studentId;
  if(canonical!==studentId)throw new HttpsError('failed-precondition','CANONICAL_STUDENT_ID_REQUIRED');

  const authUid=core.text(student.authUid);
  const oldEmail=core.normalizeEmail(student.email||student.authEmail);
  const oldCourses=courseValues(student);
  const newCourses=courseCode?[courseCode]:[];
  const oldKeys=lookupKeys(oldEmail,oldCourses),newKeys=lookupKeys(email,newCourses);

  for(const key of newKeys){
    const lookup=await database.collection('studentLookups').doc(key).get();
    if(!lookup.exists)continue;
    const mapped=core.text(lookup.data()?.canonicalStudentId||lookup.data()?.studentId);
    if(mapped&&mapped!==studentId)throw new HttpsError('already-exists','STUDENT_LOOKUP_ALREADY_IN_USE');
  }

  let authUser=null,authChanged=false,oldAuthEmail='',oldVerified=false;
  if(authUid){
    authUser=await getAuth().getUser(authUid);
    oldAuthEmail=core.normalizeEmail(authUser.email||student.authEmail||oldEmail);
    oldVerified=authUser.emailVerified===true;
    await findAuthEmailConflict(email,authUid);
  }else{
    await findAuthEmailConflict(email,'');
  }

  try{
    if(authUid&&email!==oldAuthEmail){
      await getAuth().updateUser(authUid,{email,emailVerified:false});
      authChanged=true;
      const firebaseLink=await getAuth().generateEmailVerificationLink(email);
      const url=core.toCustomActionUrl(firebaseLink);
      const name=core.displayName({vorname:firstName||student.vorname||student.firstName,nachname:lastName||student.nachname||student.lastName});
      await sendVerification(email,name,url);
    }

    const batch=database.batch();
    const studentUpdate={
      vorname:firstName,
      nachname:lastName,
      email,
      emailLower:email,
      kurs:courseCode,
      kursnummer:courseCode,
      courseCode,
      updatedAt:FieldValue.serverTimestamp(),
      emailUpdatedByOwnerUid:owner.uid,
      emailUpdatedAt:FieldValue.serverTimestamp()
    };
    if(authUid){
      studentUpdate.authEmail=email;
      studentUpdate.authEmailLower=email;
      studentUpdate.authEmailVerified=authChanged?false:(authUser?.emailVerified===true);
      studentUpdate.authProvisioningEmail=email;
    }
    batch.set(ref,studentUpdate,{merge:true});

    for(const key of newKeys){
      batch.set(database.collection('studentLookups').doc(key),{
        lookupVersion:1,canonicalStudentId:studentId,studentId,email,
        courseKeys:newCourses,active:student.active!==false,updatedAt:FieldValue.serverTimestamp()
      },{merge:true});
    }
    for(const key of oldKeys.filter(key=>!newKeys.includes(key))){
      const oldLookup=await database.collection('studentLookups').doc(key).get();
      if(!oldLookup.exists)continue;
      const mapped=core.text(oldLookup.data()?.canonicalStudentId||oldLookup.data()?.studentId);
      if(mapped===studentId)batch.delete(oldLookup.ref);
    }
    await batch.commit();
    if(authChanged&&authUid)await getAuth().revokeRefreshTokens(authUid);

    return{
      ok:true,studentId,email,authUid,
      authEmail:authUid?email:'',
      emailChanged:email!==oldEmail,
      verificationSent:authChanged,
      emailVerified:authUid?(authChanged?false:(authUser?.emailVerified===true)):false
    };
  }catch(error){
    if(authChanged&&authUid&&oldAuthEmail){
      try{await getAuth().updateUser(authUid,{email:oldAuthEmail,emailVerified:oldVerified})}
      catch(rollbackError){console.error('Student email rollback failed',studentId,String(rollbackError?.code||rollbackError?.message||rollbackError))}
    }
    if(error instanceof HttpsError)throw error;
    console.error('updateStudentAccount failed',studentId,String(error?.code||error?.message||error));
    throw new HttpsError('internal','STUDENT_ACCOUNT_UPDATE_FAILED');
  }
});

exports.__test={assertOwner,lookupClean,lookupKeys,courseValues};
