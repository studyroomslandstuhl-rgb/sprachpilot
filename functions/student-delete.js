'use strict';

const {onCall,HttpsError}=require('firebase-functions/v2/https');
const {getAuth}=require('firebase-admin/auth');
const {getFirestore}=require('firebase-admin/firestore');
const core=require('./auth-mail-core');

const REGION='europe-west1';
const OWNER_EMAILS=new Set([
  'studyroomslandstuhl@gmail.com',
  'alicekrekoten@gmail.com',
  'alisa.krekoten@gmail.com'
]);
const MAX_LINKED_IDS=120;

function tokenProvider(authContext){return core.text(authContext?.token?.firebase?.sign_in_provider)}
function tokenEmail(authContext){return core.normalizeEmail(authContext?.token?.email)}
function functionOptions(){return{region:REGION,timeoutSeconds:60,memory:'256MiB'}}
function clean(value,max=180){return core.text(value).slice(0,max)}
function uniq(values){return [...new Set((values||[]).map(core.text).filter(Boolean))]}
function courseValues(student={}){
  return uniq([student.courseCode,student.kurs,student.kursnummer,student.courseDocId,student.course]);
}
function courseKey(value){return core.text(value).toLowerCase()}
function studentIdentityIds(id,student={}){
  return uniq([
    id,student.canonicalStudentId,student.docId,student.studentId,student.userId,student.id,
    ...(Array.isArray(student.aliasIds)?student.aliasIds:[])
  ]).slice(0,MAX_LINKED_IDS);
}
function refKey(ref){return String(ref?.path||'')}
function addRef(map,ref){if(ref?.path)map.set(ref.path,ref)}

async function assertTeacherAdmin(authContext){
  const email=tokenEmail(authContext),uid=core.text(authContext?.uid);
  if(!uid||authContext?.token?.email_verified!==true||tokenProvider(authContext)!=='password'){
    throw new HttpsError('permission-denied','TEACHER_REQUIRED');
  }
  if(OWNER_EMAILS.has(email))return{uid,email,owner:true};

  const database=getFirestore();
  const [teacherSnap,securitySnap]=await Promise.all([
    database.collection('teachers').doc(uid).get(),
    database.collection('settings').doc('teacherSecurity').get()
  ]);
  if(!teacherSnap.exists||!securitySnap.exists)throw new HttpsError('permission-denied','TEACHER_REQUIRED');
  const teacher=teacherSnap.data()||{},security=securitySnap.data()||{};
  const generation=core.text(security.generation);
  if(
    teacher.active===false||teacher.blocked===true||teacher.securityApprovedV2!==true||
    Number(security.teacherSecurityVersion||0)<2||!generation||
    core.text(teacher.securityApprovalGeneration)!==generation
  )throw new HttpsError('permission-denied','TEACHER_REQUIRED');
  return{uid,email,owner:false,teacher};
}

async function teacherCourseKeys(admin){
  if(admin.owner)return null;
  const database=getFirestore(),rows=new Map();
  const specs=[
    ['teacherUid','==',admin.uid],
    ['ownerUid','==',admin.uid],
    ['createdByUid','==',admin.uid],
    ['teacherEmail','==',admin.email],
    ['teacherUids','array-contains',admin.uid]
  ];
  await Promise.all(specs.map(async([field,op,value])=>{
    try{
      const snap=await database.collection('courses').where(field,op,value).get();
      snap.docs.forEach(doc=>rows.set(doc.id,{id:doc.id,...(doc.data()||{})}));
    }catch(error){console.warn('teacher course lookup skipped',field,String(error?.code||error?.message||error))}
  }));
  const keys=new Set();
  for(const course of rows.values()){
    [course.id,course.courseCode,course.code,course.kurs,course.kursnummer,course.name].map(courseKey).filter(Boolean).forEach(value=>keys.add(value));
  }
  return keys;
}
function profileAllowedForTeacher(profile,allowed){
  if(!allowed)return true;
  if(profile.securityArchived===true||profile.securityLookupExcluded===true)return true;
  return courseValues(profile).some(value=>allowed.has(courseKey(value)));
}

async function collectProfiles(database,studentId,target){
  const profiles=new Map();
  const add=doc=>{if(doc?.exists)profiles.set(doc.id,{id:doc.id,ref:doc.ref,data:doc.data()||{}})};
  profiles.set(studentId,{id:studentId,ref:database.collection('students').doc(studentId),data:target});
  const canonical=core.text(target.canonicalStudentId)||studentId;
  if(canonical!==studentId){
    const snap=await database.collection('students').doc(canonical).get();add(snap);
  }
  const authUid=core.text(target.authUid);
  const jobs=[];
  if(authUid)jobs.push(database.collection('students').where('authUid','==',authUid).get());
  if(canonical)jobs.push(database.collection('students').where('canonicalStudentId','==',canonical).get());
  const snapshots=await Promise.all(jobs);
  snapshots.forEach(snap=>snap.docs.forEach(add));
  return{profiles,canonical,authUid};
}

async function protectTeacherAuth(database,admin,authUid){
  if(!authUid)return{exists:false,user:null};
  if(authUid===admin.uid)throw new HttpsError('failed-precondition','STUDENT_AUTH_IS_TEACHER');
  const [teacherSnap,pendingSnap]=await Promise.all([
    database.collection('teachers').doc(authUid).get(),
    database.collection('teachers_pending').doc(authUid).get()
  ]);
  if(teacherSnap.exists||pendingSnap.exists)throw new HttpsError('failed-precondition','STUDENT_AUTH_IS_TEACHER');
  try{
    const user=await getAuth().getUser(authUid);
    if(OWNER_EMAILS.has(core.normalizeEmail(user.email)))throw new HttpsError('failed-precondition','STUDENT_AUTH_IS_TEACHER');
    return{exists:true,user};
  }catch(error){
    if(String(error?.code)==='auth/user-not-found')return{exists:false,user:null};
    throw error;
  }
}

async function addQueryRefs(map,query){
  const snap=await query.get();
  snap.docs.forEach(doc=>addRef(map,doc.ref));
  return snap.size;
}
async function collectDeletionRefs(database,profiles,authUid){
  const studentRefs=new Map(),otherRefs=new Map(),ids=new Set();
  for(const row of profiles.values()){
    addRef(studentRefs,row.ref);
    studentIdentityIds(row.id,row.data).forEach(id=>ids.add(id));
  }

  for(const id of [...ids].slice(0,MAX_LINKED_IDS)){
    addRef(otherRefs,database.collection('progress').doc(id));
    addRef(otherRefs,database.collection('studentRankings').doc(id));
  }
  if(authUid){
    await Promise.all([
      addQueryRefs(otherRefs,database.collection('progress').where('authUid','==',authUid)),
      addQueryRefs(otherRefs,database.collection('studentRankings').where('authUid','==',authUid))
    ]);
  }

  const profileIds=[...profiles.keys()];
  const lookupJobs=[];
  for(const id of profileIds){
    lookupJobs.push(addQueryRefs(otherRefs,database.collection('studentLookups').where('canonicalStudentId','==',id)));
    lookupJobs.push(addQueryRefs(otherRefs,database.collection('studentLookups').where('studentId','==',id)));
  }
  await Promise.all(lookupJobs);

  return{studentRefs,otherRefs,ids:[...ids]};
}
async function deleteRefs(database,refs){
  const unique=new Map();
  for(const ref of refs)addRef(unique,ref);
  const rows=[...unique.values()];
  let deleted=0;
  for(let offset=0;offset<rows.length;offset+=400){
    const batch=database.batch(),chunk=rows.slice(offset,offset+400);
    chunk.forEach(ref=>batch.delete(ref));
    await batch.commit();deleted+=chunk.length;
  }
  return deleted;
}

exports.deleteStudentAccount=onCall(functionOptions(),async request=>{
  const admin=await assertTeacherAdmin(request.auth);
  const studentId=clean(request.data?.studentId,180);
  const confirmation=core.text(request.data?.confirmation);
  if(!studentId)throw new HttpsError('invalid-argument','STUDENT_ID_REQUIRED');
  if(confirmation!=='DELETE_STUDENT')throw new HttpsError('failed-precondition','DELETE_CONFIRMATION_REQUIRED');

  const database=getFirestore(),targetRef=database.collection('students').doc(studentId),targetSnap=await targetRef.get();
  if(!targetSnap.exists)throw new HttpsError('not-found','STUDENT_NOT_FOUND');
  const target=targetSnap.data()||{};
  const {profiles,authUid}=await collectProfiles(database,studentId,target);

  const allowed=await teacherCourseKeys(admin);
  if(!admin.owner){
    const targetAllowed=profileAllowedForTeacher(target,allowed);
    const allAllowed=[...profiles.values()].every(row=>profileAllowedForTeacher(row.data,allowed));
    if(!targetAllowed||!allAllowed)throw new HttpsError('permission-denied','STUDENT_OUTSIDE_TEACHER_COURSES');
  }

  const protectedAuth=await protectTeacherAuth(database,admin,authUid);
  const {studentRefs,otherRefs,ids}=await collectDeletionRefs(database,profiles,authUid);

  let authDeleted=false,authAlreadyMissing=false;
  if(authUid){
    try{
      if(protectedAuth.exists){
        try{await getAuth().revokeRefreshTokens(authUid)}catch(error){console.warn('student revoke before delete skipped',studentId,String(error?.code||error?.message||error))}
        await getAuth().deleteUser(authUid);authDeleted=true;
      }else authAlreadyMissing=true;
    }catch(error){
      if(String(error?.code)==='auth/user-not-found')authAlreadyMissing=true;
      else{
        console.error('deleteStudentAccount auth deletion failed',studentId,String(error?.code||error?.message||error));
        throw new HttpsError('internal','STUDENT_AUTH_DELETE_FAILED');
      }
    }
  }

  try{
    // Abhängige Daten zuerst löschen. Die students-Dokumente bleiben bis zum
    // letzten Commit erhalten, damit ein abgebrochener Lauf sicher wiederholt
    // werden kann, auch wenn das Auth-Konto bereits gelöscht wurde.
    const relatedDeleted=await deleteRefs(database,otherRefs.values());
    const studentsDeleted=await deleteRefs(database,studentRefs.values());
    return{
      ok:true,studentId,authUid,
      authDeleted,authAlreadyMissing,authLinked:!!authUid,
      deletedStudentIds:[...profiles.keys()],linkedIds:ids,
      studentProfilesDeleted:studentsDeleted,
      relatedDocumentsDeleted:relatedDeleted,
      totalDocumentsDeleted:studentsDeleted+relatedDeleted
    };
  }catch(error){
    console.error('deleteStudentAccount firestore deletion failed',studentId,String(error?.code||error?.message||error));
    throw new HttpsError('internal','STUDENT_DATA_DELETE_FAILED');
  }
});

exports.__test={assertTeacherAdmin,courseValues,studentIdentityIds,profileAllowedForTeacher,teacherCourseKeys};
