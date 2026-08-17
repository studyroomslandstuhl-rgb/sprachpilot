import { db, doc, getDoc, setDoc, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function norm(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function profile(){return getActiveProfile()||{} }
function ids(p=profile()){
 const course=p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||'kurs';
 const mail=String(p.email||'').trim().toLowerCase();
 const fallback=norm(course+'_'+(mail||p.vorname||p.firstName||'student'));
 return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallback]);
}
function taskStrength(t={}){return clamp(t.percent||0)*10000+(t.completed?1000000:0)+Math.max(0,Number(t.done)||0)*100+Math.max(0,Number(t.total)||0)}
function mergeTask(a={},b={}){const stronger=taskStrength(a)>=taskStrength(b)?a:b,weaker=stronger===a?b:a;return{...weaker,...stronger,percent:Math.max(clamp(a.percent),clamp(b.percent)),completed:!!(a.completed||b.completed),done:Math.max(Number(a.done||0),Number(b.done||0)),total:Math.max(Number(a.total||0),Number(b.total||0)),pointsByRun:{...(a.pointsByRun||{}),...(b.pointsByRun||{})}}}
function topicStrength(t={}){const tasks=Object.values(t.tasks||{});return clamp(t.progressPercent||t.current?.percent||0)*100000+tasks.reduce((s,x)=>s+taskStrength(x),0)+(t.exam?.attempted?50000:0)+Math.max(0,Number(t.exam?.bestPercent||t.exam?.percent||0))*1000}
function mergeTopic(a={},b={}){
 const stronger=topicStrength(a)>=topicStrength(b)?a:b,weaker=stronger===a?b:a,out={...weaker,...stronger};
 const tasks={...(weaker.tasks||{})};for(const[k,v]of Object.entries(stronger.tasks||{}))tasks[k]=mergeTask(tasks[k]||{},v||{});out.tasks=tasks;
 out.progressPercent=Math.max(clamp(a.progressPercent||a.current?.percent||0),clamp(b.progressPercent||b.current?.percent||0));
 out.completedTasks=Math.max(Number(a.completedTasks||a.current?.completedTasks||0),Number(b.completedTasks||b.current?.completedTasks||0),Object.values(tasks).filter(t=>t?.completed||clamp(t?.percent)>=100).length);
 out.totalTasks=Math.max(Number(a.totalTasks||a.current?.totalTasks||0),Number(b.totalTasks||b.current?.totalTasks||0),Object.keys(tasks).length);
 out.current={...(weaker.current||{}),...(stronger.current||{}),percent:out.progressPercent,completedTasks:out.completedTasks,totalTasks:out.totalTasks};
 const ae=a.exam||{},be=b.exam||{};out.exam={...ae,...be,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed)};
 out.lifetime={...(a.lifetime||{}),...(b.lifetime||{})};
 return out;
}
function mergeProgress(base={},incoming={}){
 const out={...base,...incoming};
 for(const m of MODULES){const mod={...(base[m]||{})};for(const[k,t]of Object.entries(incoming[m]||{})){if(t&&typeof t==='object'&&!Array.isArray(t)&&(t.tasks||t.current||t.lifetime||t.progressPercent!=null||t.exam))mod[k]=mergeTopic(mod[k]||{},t);else if(!(k in mod))mod[k]=t}out[m]=mod}
 if(base.finnischVerben||incoming.finnischVerben)out.finnischVerben={...(base.finnischVerben||{}),...(incoming.finnischVerben||{})};
 return out;
}
async function collect(){const p=profile(),queue=ids(p).slice(),seen=new Set(),rows=[];while(queue.length){const id=queue.shift();if(!id||seen.has(id))continue;seen.add(id);try{const s=await getDoc(doc(db,'progress',id));if(!s.exists())continue;const data=s.data()||{};rows.push({id,data});uniq(data.aliasIds||[]).forEach(a=>{if(!seen.has(a))queue.push(a)})}catch(e){}}
 const mail=String(p.email||'').trim().toLowerCase();if(mail){try{const s=await getDocs(query(collection(db,'progress'),where('email','==',mail),limit(20)));for(const d of s.docs){if(seen.has(d.id))continue;seen.add(d.id);rows.push({id:d.id,data:d.data()||{}})}}catch(e){}}
 return rows}
export async function unifyProgressAliases(){
 const rows=await collect();if(!rows.length)return{ok:false,reason:'no-progress-docs'};
 let merged={};const allIds=new Set(ids());for(const row of rows){allIds.add(row.id);uniq(row.data.aliasIds||[]).forEach(x=>allIds.add(x));merged=mergeProgress(merged,row.data)}
 const patch={};for(const m of MODULES)if(merged[m]&&Object.keys(merged[m]).length)patch[m]=merged[m];if(merged.finnischVerben)patch.finnischVerben=merged.finnischVerben;
 if(!Object.keys(patch).length)return{ok:false,reason:'no-progress-content'};
 patch.aliasIds=[...allIds];
 await Promise.all([...allIds].map(id=>setDoc(doc(db,'progress',id),patch,{merge:true}).catch(()=>null)));
 window.SP_PROGRESS_ALIAS_UNIFIER={ok:true,docs:rows.map(r=>r.id),aliases:[...allIds]};
 return window.SP_PROGRESS_ALIAS_UNIFIER;
}
