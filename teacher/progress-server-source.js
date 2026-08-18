(function(){
'use strict';
if(window.__SP_TEACHER_PROGRESS_SERVER_SOURCE_V1)return;
window.__SP_TEACHER_PROGRESS_SERVER_SOURCE_V1=true;
if(!window.Students)return;

const Students=window.Students;
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const maxRuns=(a={},b={})=>{const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=Math.max(num(a?.[k]),num(b?.[k]));return out};
const mergeTaskRunMaps=(a={},b={})=>{const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=maxRuns(a?.[k]||{},b?.[k]||{});return out};
const uniq=a=>[...new Set((a||[]).filter(v=>v!==undefined&&v!==null).map(String))];

const rawTopic=typeof Students.mergeProgressTopic==='function'?Students.mergeProgressTopic.bind(Students):null;
Students.mergeProgressTopic=function(a={},b={}){
 const out=rawTopic?rawTopic(a,b):{...b,...a};
 const tasks={};
 for(const key of new Set([...Object.keys(a?.tasks||{}),...Object.keys(b?.tasks||{}),...Object.keys(out?.tasks||{})])){
  const at=a?.tasks?.[key]||{},bt=b?.tasks?.[key]||{},ot=out?.tasks?.[key]||{};
  const pointsByRun=maxRuns(at.pointsByRun||{},bt.pointsByRun||{});
  tasks[key]={...bt,...at,...ot,percent:Math.max(Number(at.percent||0),Number(bt.percent||0),Number(ot.percent||0)),done:Math.max(Number(at.done||0),Number(bt.done||0),Number(ot.done||0)),total:Math.max(Number(at.total||0),Number(bt.total||0),Number(ot.total||0)),completed:!!(at.completed||bt.completed||ot.completed||Math.max(Number(at.percent||0),Number(bt.percent||0),Number(ot.percent||0))>=100),pointsByRun,points:Object.values(pointsByRun).reduce((s,v)=>s+num(v),0)};
 }
 out.tasks=tasks;
 const al=a?.lifetime||{},bl=b?.lifetime||{},ol=out?.lifetime||{};
 out.lifetime={...bl,...al,...ol,taskPointRuns:mergeTaskRunMaps(al.taskPointRuns||{},bl.taskPointRuns||{}),examPointRuns:maxRuns(al.examPointRuns||{},bl.examPointRuns||{}),resets:Math.max(Number(al.resets||0),Number(bl.resets||0),Number(ol.resets||0)),finishedRuns:Math.max(Number(al.finishedRuns||0),Number(bl.finishedRuns||0),Number(ol.finishedRuns||0)),bestExamPercent:Math.max(Number(al.bestExamPercent||0),Number(bl.bestExamPercent||0),Number(ol.bestExamPercent||0)),bestStars:Math.max(Number(al.bestStars||0),Number(bl.bestStars||0),Number(ol.bestStars||0))};
 if(out.technicalRecovery)out.lifetime.points=Math.max(num(al.points),num(bl.points),num(ol.points));
 else try{out.lifetime.points=num(window.SPPointRecalculator?.topicPoints?.(out)?.points)}catch(e){out.lifetime.points=Math.max(num(al.points),num(bl.points),num(ol.points))}
 return out;
};

function mergeGroupTask(a={},b={}){
 const done=uniq([...(Array.isArray(a.done)?a.done:[]),...(Array.isArray(b.done)?b.done:[])]),total=Math.max(Number(a.total||0),Number(b.total||0));
 return{...a,...b,done,total,completed:!!(a.completed||b.completed||(total>0&&done.length>=total))};
}
function mergeGroupRun(a={},b={}){
 const tasks={};for(const key of new Set([...Object.keys(a.tasks||{}),...Object.keys(b.tasks||{})]))tasks[key]=mergeGroupTask(a.tasks?.[key]||{},b.tasks?.[key]||{});
 const aa=a.awards||{},ba=b.awards||{},awardTasks={};for(const key of new Set([...Object.keys(aa.tasks||{}),...Object.keys(ba.tasks||{})]))awardTasks[key]=Math.max(num(aa.tasks?.[key]),num(ba.tasks?.[key]));
 const ae=a.exam||{},be=b.exam||{};
 return{...a,...b,tasks,awards:{...aa,...ba,tasks:awardTasks,examPoints:Math.max(num(aa.examPoints),num(ba.examPoints))},exam:{...ae,...be,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0))},completed:!!(a.completed||b.completed)};
}
function sameGroup(a={},b={}){
 const as=String(a.signature||''),bs=String(b.signature||'');if(as&&bs)return as===bs;
 const av=(a.verbs||[]).map(String).join('|'),bv=(b.verbs||[]).map(String).join('|');return !av||!bv||av===bv;
}
function mergeGroup(a={},b={}){
 if(!sameGroup(a,b)){
  const ap=num(window.SPPointRecalculator?.groupPoints?.(a)?.points),bp=num(window.SPPointRecalculator?.groupPoints?.(b)?.points);return ap>=bp?a:b;
 }
 const runs={};for(const key of new Set([...Object.keys(a.runs||{}),...Object.keys(b.runs||{})]))runs[key]=mergeGroupRun(a.runs?.[key]||{},b.runs?.[key]||{});
 return{...a,...b,signature:b.signature||a.signature||'',verbs:uniq([...(a.verbs||[]),...(b.verbs||[])]),currentRun:Math.max(Number(a.currentRun||1),Number(b.currentRun||1)),runs};
}
function mergeGroupMaps(a={},b={}){
 const out={};for(const[id,g]of Object.entries(a||{}))out[id]=g||{};for(const[id,g]of Object.entries(b||{}))out[id]=out[id]?mergeGroup(out[id],g||{}):g||{};
 return out;
}
function mergePointRecovery(a={},b={}){
 const out={...a};for(const[k,v]of Object.entries(b||{})){if(typeof v==='number')out[k]=Math.max(Number(out[k]||0),v);else if(!(k in out))out[k]=v}return out;
}
const rawRows=typeof Students.mergeProgressRows==='function'?Students.mergeProgressRows.bind(Students):null;
Students.mergeProgressRows=function(a={},b={}){
 const out=rawRows?rawRows(a,b):{...a,...b};
 const am=a.metadata||{},bm=b.metadata||{},om=out.metadata||{};
 out.metadata={...am,...bm,...om,verbenGroups:mergeGroupMaps(am.verbenGroups||{},bm.verbenGroups||{}),perfektGroups:mergeGroupMaps(am.perfektGroups||{},bm.perfektGroups||{}),pointRecovery:mergePointRecovery(am.pointRecovery||{},bm.pointRecovery||{})};
 return out;
};

Students.progressList=async function(){
 const database=this.database();
 if(!database){TeacherEnv?.note?.('Fortschritt nicht geladen: Firestore ist nicht verbunden.');return []}
 try{
  let snap;
  try{snap=await database.collection('progress').get({source:'server'})}
  catch(serverError){TeacherEnv?.note?.('Firestore-Serverdaten konnten nicht direkt geladen werden; Fallback wird verwendet.',serverError);snap=await database.collection('progress').get()}
  const rows=snap.docs.map(d=>({id:d.id,...d.data()}));
  try{sessionStorage.removeItem('SP_TEACHER_PROGRESSLIST_CACHE');sessionStorage.setItem('SP_TEACHER_PROGRESS_LAST_SERVER',new Date().toISOString())}catch(e){}
  return rows;
 }catch(e){TeacherEnv?.note?.('Fortschritt konnte nicht geladen werden',e);return []}
};

window.SPTeacherProgressServerSource={version:1,mergeTaskRunMaps,mergeGroupMaps};
})();
