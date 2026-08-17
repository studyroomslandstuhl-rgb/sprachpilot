import { db, doc, getDoc, setDoc, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import '/shared/points-recalculator.js?v=1';

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function profile(){return getActiveProfile()||{} }
function ids(p=profile()){const course=p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||'kurs',mail=String(p.email||'').trim().toLowerCase(),fallback=norm(course+'_'+(mail||p.vorname||p.firstName||'student'));return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallback])}
function stored(p={}){return Math.max(num(p?.ranking?.points),num(p?.totals?.points),num(p?.pointsTotal),num(p?.lifetimePoints),num(p?.punkteGesamt),num(p?.points))}
function technicalFor(p={},module){let best=0;for(const topic of Object.values(p?.[module]||{})){if(topic&&typeof topic==='object'&&topic.technicalRecovery===true)best=Math.max(best,num(topic?.lifetime?.points))}if(module==='verben')best=Math.max(best,num(p?.metadata?.pointRecovery?.verbenApplied));return best}
function groupFor(p={},module){const key=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':'';if(!key)return 0;let total=0;for(const group of Object.values(p?.metadata?.[key]||{})){try{total+=num(window.SPPointRecalculator?.groupPoints?.(group)?.points)}catch(e){}}return total}
function evidence(p={}){let calc={breakdown:{}};try{calc=window.SPPointRecalculator?.calculate?.(p)||calc}catch(e){}let total=0;for(const module of MODULES){const base=num(calc.breakdown?.[module]),groups=groupFor(p,module),technical=technicalFor(p,module);total+=groups>0?Math.max(base,groups):base+technical}total+=num(calc.breakdown?.finnischVerben);return total}
async function collect(){const p=profile(),queue=ids(p).slice(),seen=new Set(),rows=[];while(queue.length){const id=queue.shift();if(!id||seen.has(id))continue;seen.add(id);try{const s=await getDoc(doc(db,'progress',id));if(!s.exists())continue;const data=s.data()||{};rows.push({id,data});uniq([...(data.aliasIds||[]),data.canonicalStudentId,data.studentId,data.userId,data.docId]).forEach(a=>{if(!seen.has(a))queue.push(a)})}catch(e){}}const mail=String(p.email||'').trim().toLowerCase();if(mail){try{const snap=await getDocs(query(collection(db,'progress'),where('email','==',mail),limit(20)));for(const d of snap.docs){if(seen.has(d.id))continue;seen.add(d.id);rows.push({id:d.id,data:d.data()||{}})}}catch(e){}}return rows}
export async function raiseOwnPointsFromEvidence(){
 const rows=await collect();if(!rows.length)return{ok:false,reason:'no-progress-docs'};
 let target=0;for(const row of rows)target=Math.max(target,stored(row.data),evidence(row.data));
 const raised=[];if(target>0){const nowIso=new Date().toISOString();for(const row of rows){const before=stored(row.data);if(before>=target)continue;const patch={ranking:{...(row.data.ranking||{}),points:target,updatedAt:nowIso},totals:{...(row.data.totals||{}),points:target,updatedAt:nowIso},pointsTotal:target,lifetimePoints:target,punkteGesamt:target,metadata:{...(row.data.metadata||{}),pointRecovery:{...(row.data.metadata?.pointRecovery||{}),version:8,lastRaisedAt:nowIso,raisedFrom:before,raisedTo:target,method:'student-raise-only-preserved-evidence'}}};try{await setDoc(doc(db,'progress',row.id),patch,{merge:true});raised.push({id:row.id,from:before,to:target})}catch(e){}}try{localStorage.setItem('SP_POINTS_TOTAL',String(Math.max(num(localStorage.getItem('SP_POINTS_TOTAL')),target)))}catch(e){}}
 const result={ok:true,target,raised,checked:rows.length,autoLowering:false};window.SP_STUDENT_POINT_RECOVERY=result;return result
}
