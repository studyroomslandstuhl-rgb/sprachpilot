(function(){
'use strict';
if(window.__SP_TEACHER_AUTH_LEGACY_FIX_V1)return;window.__SP_TEACHER_AUTH_LEGACY_FIX_V1=true;
if(!window.TeacherAuth)return;
const raw=window.TeacherAuth.getApprovedTeacher.bind(window.TeacherAuth);
function norm(v){return String(v||'').trim().toLowerCase()}
function roleValue(data={}){return norm(data.role||data.rolle||data.typ||data.type||data.accountType||data.accountRole||data.userRole||data.lehrerrolle||data.zugang||data.accessRole||data.position||data.job||'')}
function explicitStudent(data={}){return /^(student|schueler|schüler|learner|teilnehmer|teilnehmerin|tn|pupil)$/.test(roleValue(data))}
function roleOk(data={}){
 if(data.owner===true||data.admin===true||data.isAdmin===true||data.isTeacher===true||data.teacher===true||data.lehrer===true||data.lehrerin===true||data.lehrkraft===true||data.kursleitung===true)return true;
 const role=roleValue(data);if(!role)return true;if(explicitStudent(data))return false;
 return ['owner','admin','teacher','lehrer','lehrerin','lehrkraft','lehrer/in','superadmin','kursleitung','kursleiter','kursleiterin','dozent','dozentin','trainer','trainerin'].includes(role)||/lehr|teacher|dozent|kursleit|admin|owner|trainer/.test(role)
}
function pending(data={}){const s=norm(data.status||data.state||data.accessStatus||'');return data.pending===true||data.approved===false||['pending','wartet','beantragt','requested','waiting','submitted'].includes(s)}
function blocked(data={}){const s=norm(data.status||data.state||data.accessStatus||'');return data.active===false||data.disabled===true||data.blocked===true||['inactive','disabled','blocked','gesperrt','deaktiviert'].includes(s)}
function valid(data){return !!data&&!blocked(data)&&!pending(data)&&roleOk(data)}
async function doc(id){
 if(!id||!window.db)return null;
 try{const s=await db.collection('teachers').doc(String(id)).get();return s.exists?{id:s.id,docId:s.id,...(s.data()||{})}:null}catch(e){return null}
}
async function first(field,value){
 if(!field||!value||!window.db)return null;
 try{const s=await db.collection('teachers').where(field,'==',value).limit(1).get();if(s.empty)return null;const d=s.docs[0];return {id:d.id,docId:d.id,...(d.data()||{})}}catch(e){return null}
}
function ids(user){
 const out=[user?.uid,String(user?.email||'').trim(),norm(user?.email)];
 try{
  const p=JSON.parse(localStorage.getItem('SP_TEACHER_PROFILE')||'{}')||{};
  if(!p.email||norm(p.email)===norm(user?.email)||String(p.uid||'')===String(user?.uid||''))out.push(localStorage.getItem('SP_TEACHER_ID'),localStorage.getItem('SP_TEACHER_UID'),p.id,p.docId,p.uid)
 }catch(e){}
 return [...new Set(out.map(v=>String(v||'').trim()).filter(Boolean))]
}
async function legacy(user){
 for(const id of ids(user)){const x=await doc(id);if(valid(x))return x}
 const rawEmail=String(user?.email||'').trim(),email=norm(rawEmail);
 const checks=[['email',rawEmail],['email',email],['emailLower',email],['teacherEmail',rawEmail],['teacherEmail',email],['teacherEmailLower',email],['mail',rawEmail],['mail',email],['loginEmail',rawEmail],['loginEmail',email]];
 for(const [field,value] of checks){const x=await first(field,value);if(valid(x))return x}
 return null
}
window.TeacherAuth.getApprovedTeacher=async function(user){
 const normal=await raw(user);
 if(valid(normal)||normal?.pending===true||blocked(normal))return normal;
 const found=await legacy(user);
 return found||normal;
};
})();
