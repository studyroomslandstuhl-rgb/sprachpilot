(function(){
'use strict';
if(window.__SP_L10_FIREBASE_POINTS_BRIDGE_V1)return;
const theme=Number(document.body?.dataset?.theme||0);
if(theme!==1&&theme!==2)return;
window.__SP_L10_FIREBASE_POINTS_BRIDGE_V1=true;

const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const text=value=>String(value==null?'':value).trim();
let pendingPoints=0;
let pendingStudentId='';
let syncTimer=0;
let syncing=false;

function profile(){
 try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}
 catch(e){return{}}
}
function preview(){
 try{
  const p=profile();
  const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||'').toLowerCase();
  return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||
    sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1';
 }catch(e){return false}
}
function fallbackStudentId(){
 const p=profile();
 return text(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.id||localStorage.getItem('SP_STUDENT_ID'));
}
function stored(row={}){
 return Math.max(
  point(row.rankingPoints),point(row.pointsTotal),point(row.lifetimePoints),point(row.punkteGesamt),point(row.points),
  point(row.ranking?.points),point(row.totals?.points),point(row.preservedHistoricalFloor),point(row.finalPoints),point(row.reconciledPoints)
 );
}

async function mirrorNow(){
 if(preview()||syncing)return false;
 const studentId=text(pendingStudentId||fallbackStudentId());
 const requested=point(pendingPoints);
 if(!studentId||requested<=0)return false;
 syncing=true;
 try{
  const fb=await import('/js/firebase.js?v=20260914-l10-dashboard-points1');
  const fs=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
  const ref=fb.doc(fb.db,'students',studentId);
  let target=requested;
  let changed=false;
  await fs.runTransaction(fb.db,async tx=>{
   const snap=await tx.get(ref);
   if(!snap.exists())return;
   const data=snap.data()||{};
   target=Math.max(stored(data),requested);
   const completeMirror=
    point(data.rankingPoints)>=target&&point(data.pointsTotal)>=target&&point(data.lifetimePoints)>=target&&
    point(data.punkteGesamt)>=target&&point(data.points)>=target&&point(data.ranking?.points)>=target&&point(data.totals?.points)>=target;
   if(completeMirror)return;
   tx.set(ref,{
    rankingPoints:target,
    pointsTotal:target,
    lifetimePoints:target,
    punkteGesamt:target,
    points:target,
    ranking:{...(data.ranking||{}),points:target},
    totals:{...(data.totals||{}),points:target},
    updatedAt:fb.serverTimestamp()
   },{merge:true});
   changed=true;
  });
  if(changed){
   try{window.dispatchEvent(new CustomEvent('SP_L10_DASHBOARD_POINTS_SYNCED',{detail:{studentId,points:target,theme}}))}catch(e){}
  }
  return true;
 }catch(error){
  console.warn(`L10T${theme}: Punkte konnten noch nicht in den Dashboard-Teilnehmerstand gespiegelt werden`,error);
  return false;
 }finally{
  syncing=false;
 }
}
function scheduleMirror(studentId,points,delay=80){
 if(preview())return;
 const id=text(studentId||fallbackStudentId());
 const total=point(points);
 if(!id||total<=0)return;
 pendingStudentId=id;
 pendingPoints=Math.max(pendingPoints,total);
 clearTimeout(syncTimer);
 syncTimer=setTimeout(()=>{mirrorNow()},delay);
}

window.addEventListener('SP_PROGRESS_WRITE_CONFIRMED',event=>{
 const detail=event?.detail||{};
 scheduleMirror(detail.studentId,detail.points,40);
});
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',event=>{
 const detail=event?.detail||{};
 scheduleMirror(detail.studentId,detail.points,90);
});
window.addEventListener('online',()=>scheduleMirror(pendingStudentId,pendingPoints,120));

async function recoverExistingFirebasePoints(){
 if(preview())return;
 try{
  const mod=await import('/js/progress.js?v=20260831-central6');
  const api=window.SPProgress||mod;
  const data=await api.loadCurrentStudentProgress?.();
  if(!data||typeof data!=='object')return;
  scheduleMirror(data.canonicalStudentId||data.studentId||data.userId||fallbackStudentId(),stored(data),30);
 }catch(e){}
}

setTimeout(recoverExistingFirebasePoints,700);
setTimeout(recoverExistingFirebasePoints,1800);
window.SPL10FirebasePointsBridge={mirrorNow,scheduleMirror,recoverExistingFirebasePoints,theme};
})();
