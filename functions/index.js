'use strict';

const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {defineJsonSecret}=require('firebase-functions/params');
const {initializeApp}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore,FieldValue}=require('firebase-admin/firestore');
const nodemailer=require('nodemailer');
const core=require('./auth-mail-core');

initializeApp();

const REGION='europe-west1';
const SMTP_CONFIG=defineJsonSecret('SPRACHPILOT_SMTP');
const OWNER_EMAILS=new Set([
  'studyroomslandstuhl@gmail.com',
  'alicekrekoten@gmail.com',
  'alisa.krekoten@gmail.com'
]);
const RATE_COLLECTION='_systemMailRateLimits';
const RATE_WINDOW_MS=15*60*1000;
const RATE_MAX=3;

let transporterCache=null;
let transporterSignature='';

function smtpConfig(){
  const value=SMTP_CONFIG.value()||{};
  const host=core.text(value.host),user=core.text(value.user),pass=core.text(value.pass);
  const port=Number(value.port||0),secure=value.secure===true||String(value.secure).toLowerCase()==='true';
  const fromEmail=core.normalizeEmail(value.fromEmail||user),fromName=core.text(value.fromName||'SprachPilot');
  const replyTo=core.normalizeEmail(value.replyTo||'');
  if(!host||!port||!user||!pass||!core.validEmail(fromEmail))throw new Error('SMTP_CONFIG_INCOMPLETE');
  return{host,port,secure,user,pass,fromEmail,fromName,replyTo};
}
function mailTransport(){
  const cfg=smtpConfig(),signature=JSON.stringify([cfg.host,cfg.port,cfg.secure,cfg.user,cfg.fromEmail]);
  if(!transporterCache||transporterSignature!==signature){
    transporterCache=nodemailer.createTransport({host:cfg.host,port:cfg.port,secure:cfg.secure,auth:{user:cfg.user,pass:cfg.pass},pool:true,maxConnections:3,maxMessages:50});
    transporterSignature=signature;
  }
  return{transport:transporterCache,cfg};
}
async function sendBrandedMail(to,mail){
  const {transport,cfg}=mailTransport();
  const message={from:{name:cfg.fromName,address:cfg.fromEmail},to,subject:mail.subject,text:mail.text,html:mail.html};
  if(cfg.replyTo)message.replyTo=cfg.replyTo;
  const result=await transport.sendMail(message);
  return{messageId:String(result?.messageId||'')};
}
function tokenProvider(authContext){return core.text(authContext?.token?.firebase?.sign_in_provider)}
function tokenEmail(authContext){return core.normalizeEmail(authContext?.token?.email)}
function assertOwner(authContext){
  const email=tokenEmail(authContext);
  if(!authContext?.uid||authContext?.token?.email_verified!==true||tokenProvider(authContext)!=='password'||!OWNER_EMAILS.has(email))throw new HttpsError('permission-denied','OWNER_REQUIRED');
  return{uid:String(authContext.uid),email};
}
function assertPasswordUser(authContext){
  if(!authContext?.uid||tokenProvider(authContext)!=='password')throw new HttpsError('unauthenticated','PASSWORD_AUTH_REQUIRED');
  return{uid:String(authContext.uid),email:tokenEmail(authContext)};
}
function functionOptions(){return{region:REGION,secrets:[SMTP_CONFIG],timeoutSeconds:60,memory:'256MiB'} }

async function consumeRateLimit(scope,identity,{max=RATE_MAX,windowMs=RATE_WINDOW_MS}={}){
  const key=core.hashKey(`${scope}|${String(identity||'')}`),ref=getFirestore().collection(RATE_COLLECTION).doc(key),now=Date.now();
  return getFirestore().runTransaction(async transaction=>{
    const snap=await transaction.get(ref),data=snap.exists?(snap.data()||{}):{};
    const started=Number(data.windowStartedAtMs||0),sameWindow=started>0&&now-started<windowMs;
    const count=sameWindow?Number(data.count||0):0;
    if(count>=max)return false;
    transaction.set(ref,{scope,windowStartedAtMs:sameWindow?started:now,count:count+1,updatedAt:FieldValue.serverTimestamp(),expiresAtMs:now+windowMs},{merge:true});
    return true;
  });
}
function customResetLink(link){return core.toCustomActionUrl(link)}
function customVerifyLink(link){return core.toCustomActionUrl(link)}
async function authUserName(email){
  try{
    const user=await getAuth().getUserByEmail(email);
    return core.text(user.displayName);
  }catch(error){return''}
}
async function studentDisplayNameByEmail(email){
  try{
    const snap=await getFirestore().collection('students').where('email','==',email).limit(1).get();
    if(snap.empty)return'';
    return core.displayName(snap.docs[0].data()||{});
  }catch(error){return''}
}
async function bestDisplayName(email){return(await authUserName(email))||(await studentDisplayNameByEmail(email))||''}

exports.requestPasswordReset=onCall(functionOptions(),async request=>{
  const email=core.normalizeEmail(request.data?.email);
  if(!core.validEmail(email))throw new HttpsError('invalid-argument','INVALID_EMAIL');
  const allowed=await consumeRateLimit('password-reset',email);
  if(!allowed)return{ok:true};
  try{
    await getAuth().getUserByEmail(email);
    const firebaseLink=await getAuth().generatePasswordResetLink(email);
    const url=customResetLink(firebaseLink),name=await bestDisplayName(email);
    await sendBrandedMail(email,core.buildPasswordResetMail({name,url}));
  }catch(error){
    const code=String(error?.code||'');
    if(code!=='auth/user-not-found')console.error('requestPasswordReset failed',core.hashKey(email),code||error?.message||error);
  }
  // Absichtlich identische Antwort für vorhandene und nicht vorhandene Konten.
  return{ok:true};
});

exports.requestVerificationEmail=onCall(functionOptions(),async request=>{
  const caller=assertPasswordUser(request.auth),allowed=await consumeRateLimit('verification',caller.uid);
  if(!allowed)return{ok:true};
  const user=await getAuth().getUser(caller.uid);
  if(!user.email||!core.validEmail(user.email))throw new HttpsError('failed-precondition','AUTH_EMAIL_MISSING');
  if(user.emailVerified===true)return{ok:true,alreadyVerified:true};
  const firebaseLink=await getAuth().generateEmailVerificationLink(user.email);
  const url=customVerifyLink(firebaseLink),name=core.text(user.displayName)||await studentDisplayNameByEmail(core.normalizeEmail(user.email));
  await sendBrandedMail(user.email,core.buildVerificationMail({name,url}));
  return{ok:true};
});

exports.provisionStudentAccess=onCall(functionOptions(),async request=>{
  const owner=assertOwner(request.auth),studentId=core.text(request.data?.studentId);
  if(!studentId||studentId.length>180)throw new HttpsError('invalid-argument','STUDENT_ID_REQUIRED');
  const ref=getFirestore().collection('students').doc(studentId),snap=await ref.get();
  if(!snap.exists)throw new HttpsError('not-found','STUDENT_NOT_FOUND');
  const student=snap.data()||{},email=core.normalizeEmail(student.email),existingUid=core.text(student.authUid);
  if(student.securityLookupExcluded===true&&!email&&!existingUid)return{status:'excluded',studentId};
  if(!core.validEmail(email))return{status:'missing-email',studentId};

  let authUser=null,created=false;
  try{authUser=await getAuth().getUserByEmail(email)}catch(error){
    if(String(error?.code)!=='auth/user-not-found')throw error;
    authUser=await getAuth().createUser({email,password:core.strongRandomPassword(),emailVerified:false,displayName:core.displayName(student)||undefined,disabled:false});
    created=true;
  }
  if(!authUser?.uid)throw new HttpsError('internal','AUTH_USER_MISSING');
  if(existingUid&&existingUid!==authUser.uid)throw new HttpsError('failed-precondition','STUDENT_AUTH_OWNERSHIP_MISMATCH');

  await ref.set({
    authUid:authUser.uid,authEmail:email,authVersion:2,
    authProvisioningStatus:created?'account-created-server':'account-found-server',
    authProvisionedByOwnerUid:owner.uid,authProvisionedAt:FieldValue.serverTimestamp(),
    authProvisioningUpdatedAt:FieldValue.serverTimestamp()
  },{merge:true});

  const resetUrl=customResetLink(await getAuth().generatePasswordResetLink(email));
  let verifyUrl='';
  if(authUser.emailVerified!==true)verifyUrl=customVerifyLink(await getAuth().generateEmailVerificationLink(email));
  const name=core.displayName(student)||core.text(authUser.displayName);
  await sendBrandedMail(email,core.buildSetupMail({name,resetUrl,verifyUrl}));
  await ref.set({
    authProvisioningVersion:2,
    authProvisioningStatus:verifyUrl?'custom-setup-mail-sent':'custom-password-mail-sent',
    authProvisioningEmail:email,
    authSetupMailSentAt:FieldValue.serverTimestamp(),
    authVerificationMailSent:!!verifyUrl,
    authPasswordMailSent:true,
    authMailTransport:'custom-smtp-v1'
  },{merge:true});
  return{status:created?'created':'existing-account',studentId,uid:authUser.uid,email,verificationSent:!!verifyUrl,resetSent:true};
});

exports.__test={smtpConfig,assertOwner,assertPasswordUser,customResetLink,customVerifyLink};
