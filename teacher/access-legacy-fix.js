(function(){
'use strict';
if(window.__SP_TEACHER_ACCESS_LEGACY_FIX_V1)return;window.__SP_TEACHER_ACCESS_LEGACY_FIX_V1=true;
if(typeof TeacherAccess==='undefined')return;
const rawResolve=TeacherAccess.resolve.bind(TeacherAccess);
function norm(v){return String(v||'').trim().toLowerCase()}
function storedIds(user){
 const out=[user?.uid,String(user?.email||'').trim(),norm(user?.email)];
 try{
  const p=JSON.parse(localStorage.getItem('SP_TEACHER_PROFILE')||'{}')||{};
  const sameEmail=!p.email||norm(p.email)===norm(user?.email);
  const sameUid=!p.uid||String(p.uid)===String(user?.uid);
  if(sameEmail||sameUid){out.push(localStorage.getItem('SP_TEACHER_ID'),localStorage.getItem('SP_TEACHER_UID'),p.id,p.docId,p.uid)}
 }catch(e){}
 return [...new Set(out.map(v=>String(v||'').trim()).filter(Boolean))]
}
function valid(data){return !!data&&!TeacherAccess.isBlocked(data)&&!TeacherAccess.isPending(data)&&TeacherAccess.roleOk(data)}
async function legacyTeacher(db,user){
 if(!db||!user)return null;
 for(const id of storedIds(user)){
  const found=await TeacherAccess.getDocById(db,'teachers',id);
  if(valid(found))return found;
 }
 const emailRaw=String(user.email||'').trim(),email=norm(emailRaw);
 const checks=[
  ['email',emailRaw],['email',email],['emailLower',email],['teacherEmail',emailRaw],['teacherEmail',email],
  ['teacherEmailLower',email],['mail',emailRaw],['mail',email],['loginEmail',emailRaw],['loginEmail',email]
 ];
 for(const [field,value] of checks){
  if(!value)continue;
  const found=await TeacherAccess.firstByField(db,'teachers',field,value);
  if(valid(found))return found;
 }
 return null
}
TeacherAccess.resolve=async function(db,user){
 const normal=await rawResolve(db,user);
 if(normal?.ok||normal?.blocked||normal?.pending)return normal;
 try{
  const legacy=await legacyTeacher(db,user);
  if(legacy)return {ok:true,data:legacy,source:'teachers-legacy-compatible'};
 }catch(error){try{TeacherEnv.note('Älterer Lehrer-Datensatz konnte nicht geprüft werden',error)}catch(e){}}
 return normal;
};
})();
