import { db, doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const TECH=new Set(['state','progress','totals','metadata','profile','updatedAt','lastActive','lastPage','known','learned','unknown','unsure','activeVerbs','learnedVerbs']);
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function profile(){return getActiveProfile()||{} }
function course(p=profile()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||p.courseDocId||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function mail(p=profile()){return String(p.email||'').trim().toLowerCase()}
function fallbackId(p=profile()){const c=norm(p.courseDocId||course(p)||'kurs'),person=norm(mail(p)||p.vorname||p.firstName||p.name||'student');return c&&person?c+'_'+person:''}
function baseIds(p=profile()){
 const explicit=uniq([p.docId,p.studentId,p.userId,p.uid,p.id,fallbackId(p)]).filter(id=>id&&id!=='guest');
 const local=String(localStorage.getItem('SP_STUDENT_ID')||'').trim();
 if(local&&(!explicit.length||explicit.includes(local)))explicit.push(local);
 return uniq(explicit);
}
function isStudent(){const r=String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'student').toLowerCase();return r!=='teacher'&&r!=='lehrer'&&r!=='admin'}
function isTopic(key,value){return !TECH.has(key)&&!!(value&&typeof value==='object'&&!Array.isArray(value)&&(value.lifetime||value.tasks||value.exam||value.current||value.progressPercent!=null||value.pointsTotal!=null))}
function maxMap(a={},b={}){const out={...(a||{})};for(const[k,v]of Object.entries(b||{}))out[k]=Math.max(num(out[k]),num(v));return out}
function mergeTask(a={},b={}){return {...a,...b,percent:Math.max(clamp(a.percent),clamp(b.percent)),completed:!!(a.completed||b.completed),done:Math.max(Number(a.done||0),Number(b.done||0)),total:Math.max(Number(a.total||0),Number(b.total||0)),points:Math.max(num(a.points),num(b.points)),pointsByRun:maxMap(a.pointsByRun,b.pointsByRun)}}
function mergeTopic(a={},b={}){
 const out={...a,...b};
 const tasks={...(a.tasks||{})};for(const[k,v]of Object.entries(b.tasks||{}))tasks[k]=mergeTask(tasks[k]||{},v||{});out.tasks=tasks;
 const al=a.lifetime||{},bl=b.lifetime||{};
 const taskRuns={...(al.taskPointRuns||{})};for(const[k,v]of Object.entries(bl.taskPointRuns||{}))taskRuns[k]=maxMap(taskRuns[k],v);
 out.lifetime={...al,...bl,points:Math.max(num(al.points),num(bl.points),num(a.pointsTotal),num(b.pointsTotal),num(a.points),num(b.points)),taskPointRuns:taskRuns,examPointRuns:maxMap(al.examPointRuns,bl.examPointRuns),resets:Math.max(Number(al.resets||0),Number(bl.resets||0)),finishedRuns:Math.max(Number(al.finishedRuns||0),Number(bl.finishedRuns||0)),bestExamPercent:Math.max(Number(al.bestExamPercent||0),Number(bl.bestExamPercent||0)),bestStars:Math.max(Number(al.bestStars||0),Number(bl.bestStars||0))};
 const ae=a.exam||{},be=b.exam||{};out.exam={...ae,...be,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempts:Math.max(Number(ae.attempts||0),Number(be.attempts||0)),completed:!!(ae.completed||be.completed),attempted:!!(ae.attempted||be.attempted)};
 const vals=Object.values(tasks);out.completedTasks=Math.max(Number(a.completedTasks||0),Number(b.completedTasks||0),vals.filter(t=>t&&t.completed).length);out.totalTasks=Math.max(Number(a.totalTasks||0),Number(b.totalTasks||0),vals.length);out.progressPercent=Math.max(clamp(a.progressPercent||a.current?.percent||0),clamp(b.progressPercent||b.current?.percent||0));out.current={...(a.current||{}),...(b.current||{}),percent:out.progressPercent,completedTasks:out.completedTasks,totalTasks:out.totalTasks};
 return out;
}
function topicSig(module,key,t={}){
 if(t.technicalRecovery)return module+'|tech|'+norm(key);
 const explicit=t.topicId||t.themeId;if(explicit)return module+'|id|'+norm(explicit);
 const lesson=norm(t.lesson||t.lektion),theme=norm(t.theme||t.thema),level=norm(t.level);if(lesson||theme)return [module,level,lesson,theme].join('|');
 return module+'|key|'+norm(key);
}
function mergeModule(base={},incoming={},module){
 const out={...(base||{})},bySig=new Map();
 for(const[k,v]of Object.entries(out)){if(isTopic(k,v))bySig.set(topicSig(module,k,v),k)}
 for(const[k,v]of Object.entries(incoming||{})){
  if(!isTopic(k,v)){if(!(k in out))out[k]=v;continue}
  const sig=topicSig(module,k,v),oldKey=bySig.get(sig);
  if(oldKey){out[oldKey]=mergeTopic(out[oldKey]||{},v||{})}
  else{out[k]=mergeTopic({},v||{});bySig.set(sig,k)}
 }
 return out;
}
function mergeProgress(base={},incoming={}){
 const out={...base,...incoming};
 for(const m of MODULES)out[m]=mergeModule(base[m]||{},incoming[m]||{},m);
 out.ranking={...(base.ranking||{}),...(incoming.ranking||{}),points:Math.max(num(base.ranking?.points),num(incoming.ranking?.points))};
 out.totals={...(base.totals||{}),...(incoming.totals||{}),points:Math.max(num(base.totals?.points),num(incoming.totals?.points))};
 out.pointsTotal=Math.max(num(base.pointsTotal),num(incoming.pointsTotal));out.lifetimePoints=Math.max(num(base.lifetimePoints),num(incoming.lifetimePoints));out.punkteGesamt=Math.max(num(base.punkteGesamt),num(incoming.punkteGesamt));
 out.metadata={...(base.metadata||{}),...(incoming.metadata||{})};
 return out;
}
function aggregatePoints(r={}){return Math.max(num(r.ranking?.points),num(r.totals?.points),num(r.pointsTotal),num(r.lifetimePoints),num(r.punkteGesamt),num(r.points))}
function localFloor(ids){const localId=String(localStorage.getItem('SP_STUDENT_ID')||'');if(!localId||!ids.includes(localId))return 0;return num(localStorage.getItem('SP_POINTS_TOTAL'))}
async function collectDocs(p){
 const queue=baseIds(p).slice(),seen=new Set(),rows=[];
 while(queue.length){const id=queue.shift();if(!id||seen.has(id))continue;seen.add(id);try{const s=await getDoc(doc(db,'progress',id));if(!s.exists())continue;const data=s.data()||{};rows.push({id,data});uniq(data.aliasIds||[]).forEach(a=>{if(!seen.has(a))queue.push(a)})}catch(e){}}
 const emails=uniq([mail(p),String(p.email||'').trim()]).filter(Boolean);
 for(const e of emails){try{const s=await getDocs(query(collection(db,'progress'),where('email','==',e),limit(20)));for(const d of s.docs){if(seen.has(d.id))continue;seen.add(d.id);const data=d.data()||{};rows.push({id:d.id,data});uniq(data.aliasIds||[]).forEach(a=>{if(!seen.has(a))queue.push(a)})}}catch(err){}}
 while(queue.length){const id=queue.shift();if(!id||seen.has(id))continue;seen.add(id);try{const s=await getDoc(doc(db,'progress',id));if(s.exists())rows.push({id,data:s.data()||{}})}catch(e){}}
 return rows;
}
export async function repairDashboardPoints(){
 if(!isStudent())return {ok:false,reason:'preview'};
 const p=profile(),ids=baseIds(p),canonical=ids[0]||fallbackId(p);if(!canonical)return {ok:false,reason:'no-id'};
 const rows=await collectDocs(p);let merged={};const aliases=new Set(ids);let aggregate=0;
 for(const row of rows){aliases.add(row.id);uniq(row.data.aliasIds||[]).forEach(x=>aliases.add(x));aggregate=Math.max(aggregate,aggregatePoints(row.data));merged=mergeProgress(merged,row.data)}
 const breakdown={};for(const m of MODULES){breakdown[m]=0;for(const[k,t]of Object.entries(merged[m]||{})){if(isTopic(k,t))breakdown[m]+=Math.max(num(t?.lifetime?.points),num(t?.pointsTotal),num(t?.points))}}
 const computed=Object.values(breakdown).reduce((a,b)=>a+b,0),corrected=Math.max(computed,aggregate,localFloor(ids));
 const nowIso=new Date().toISOString();
 const patch={};for(const m of MODULES)if(merged[m]&&Object.keys(merged[m]).length)patch[m]=merged[m];
 patch.ranking={...(merged.ranking||{}),points:corrected,updatedAt:nowIso};patch.totals={...(merged.totals||{}),points:corrected,updatedAt:nowIso};patch.pointsTotal=corrected;patch.lifetimePoints=corrected;patch.punkteGesamt=corrected;patch.studentId=canonical;patch.userId=canonical;patch.docId=canonical;patch.canonicalStudentId=canonical;patch.aliasIds=[...aliases];patch.email=p.email||merged.email||'';patch.kurs=course(p)||merged.kurs||'';patch.kursnummer=course(p)||merged.kursnummer||'';patch.courseCode=course(p)||merged.courseCode||'';patch.updatedAt=serverTimestamp();patch.lastActive=serverTimestamp();patch.metadata={...(merged.metadata||{}),pointAudit:{...(merged.metadata?.pointAudit||{}),version:3,lastRepairAt:nowIso,sourceIds:rows.map(r=>r.id),computedPoints:computed,aggregateFloor:aggregate,correctedPoints:corrected,breakdown}};
 try{await setDoc(doc(db,'progress',canonical),patch,{merge:true});localStorage.setItem('SP_STUDENT_ID',canonical);localStorage.setItem('SP_POINTS_OWNER_ID',canonical);localStorage.setItem('SP_POINTS_TOTAL',String(corrected));localStorage.setItem('SP_POINTS_AUDIT_LAST',JSON.stringify({at:nowIso,corrected,computed,aggregate,sources:rows.map(r=>r.id),breakdown}));window.SP_POINTS_AUDIT={ok:true,corrected,computed,aggregate,sources:rows.map(r=>r.id),breakdown};return window.SP_POINTS_AUDIT}catch(error){window.SP_POINTS_AUDIT={ok:false,error:String(error?.message||error),corrected,computed,aggregate,breakdown};return window.SP_POINTS_AUDIT}
}
