(function(){
'use strict';
if(window.__SP_L7_STATE_SAFETY_V1)return;
window.__SP_L7_STATE_SAFETY_V1=true;
function json(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(e){return null}}
function clean(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')}
const profile=json('SP_USER_PROFILE')||json('SP_STUDENT_PROFILE')||{};
const secure=profile.secureAuth===true||!!String(profile.authUid||profile.canonicalStudentId||'').trim();
const identity=clean(profile.authUid||profile.canonicalStudentId||profile.docId||profile.studentId||profile.userId||profile.uid||profile.id||profile.email||'');
if(!secure||!identity||identity==='student')return;
const stampKey=`SP_L7_GENERIC_STATE_QUARANTINED_V1_${identity}`;
if(localStorage.getItem(stampKey)==='1')return;
const keys=[];
for(let i=0;i<localStorage.length;i++){
 const key=String(localStorage.key(i)||'');
 if(/^SP_L7_student_T[1-4]_/i.test(key))keys.push(key);
}
for(const key of keys){
 try{
  const value=localStorage.getItem(key);if(value==null)continue;
  const safeKey=`SP_L7_LEGACY_QUARANTINE_V1_${identity}_${key.replace(/[^a-z0-9_-]+/gi,'_')}`;
  if(localStorage.getItem(safeKey)==null)localStorage.setItem(safeKey,value);
  localStorage.removeItem(key);
 }catch(e){console.warn('L7 generischer Altstand konnte nicht isoliert werden',key,e)}
}
try{localStorage.setItem(stampKey,'1')}catch(e){}
})();