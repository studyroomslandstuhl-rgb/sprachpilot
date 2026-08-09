import{db,doc,setDoc,serverTimestamp}from'/js/firebase.js';
import{getActiveProfile,getActiveRole}from'/js/auth.js';

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function isPreview(){const role=String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();return role==='teacher'||role==='lehrer'||role==='admin'}
async function waitLock(){for(let i=0;i<30;i++){if(window.SP_STUDENT_VERB_ORDER_LOCK?.order?.length)return window.SP_STUDENT_VERB_ORDER_LOCK;await sleep(200)}return null}
async function sync(){
 if(isPreview())return;
 const lock=await waitLock();if(!lock?.order?.length)return;
 try{
  if(!window.SPProgress)await import('/js/progress.js?v=student-order-cloud1');
  const p=getActiveProfile()||{},ids=window.SPProgress?.idCandidates?.(p)||[],id=ids[0];if(!id)return;
  const progress=await window.SPProgress?.loadCurrentStudentProgress?.()||{};
  const metadata={...(progress.metadata||{}),verbCatalogOrder:lock.order.slice(),verbCatalogOrderSource:lock.source||'student-lock',verbCatalogOrderVersion:Number(lock.version)||2,verbCatalogOrderUpdatedAt:new Date().toISOString()};
  await setDoc(doc(db,'progress',id),{metadata,updatedAt:serverTimestamp(),lastActiveAt:new Date().toISOString()},{merge:true});
  window.SP_STUDENT_VERB_ORDER_CLOUD_SYNC={ok:true,at:new Date().toISOString(),count:lock.order.length}
 }catch(error){console.warn('Persönliche Verben-Gruppenreihenfolge konnte nicht in Firebase gesichert werden',error);window.SP_STUDENT_VERB_ORDER_CLOUD_SYNC={ok:false,error:String(error?.message||error)}}
}
window.addEventListener('load',()=>setTimeout(sync,1200));window.addEventListener('pageshow',()=>setTimeout(sync,800));setTimeout(sync,1800);
window.SPStudentVerbOrderCloudSync={sync};
