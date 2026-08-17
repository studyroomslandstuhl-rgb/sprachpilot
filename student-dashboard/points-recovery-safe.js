import { db, doc, getDoc, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { repairDashboardPoints } from './points-recovery.js?v=3';

function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function norm(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function profile(){return getActiveProfile()||{} }
function ids(p=profile()){
 const course=p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||'kurs';
 const mail=String(p.email||'').trim().toLowerCase();
 const fallback=norm(course+'_'+(mail||p.vorname||p.firstName||'student'));
 return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallback]);
}
async function hasProgressDocument(){
 const p=profile();let successful=0;
 for(const id of ids(p)){
  try{const snap=await getDoc(doc(db,'progress',id));successful++;if(snap.exists())return true}catch(e){}
 }
 const mail=String(p.email||'').trim().toLowerCase();
 if(mail){
  try{const snap=await getDocs(query(collection(db,'progress'),where('email','==',mail),limit(5)));successful++;if(!snap.empty)return true}catch(e){}
 }
 return successful>0?false:null;
}
export async function repairDashboardPointsSafe(){
 const has=await hasProgressDocument();
 if(has!==true){
  const result={ok:false,skipped:true,reason:has===null?'cloud-not-readable':'no-existing-progress'};
  window.SP_POINTS_AUDIT=result;
  return result;
 }
 return repairDashboardPoints();
}
