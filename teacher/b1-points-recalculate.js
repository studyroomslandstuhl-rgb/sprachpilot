(function(){
'use strict';
if(window.__SP_B1_POINTS_RECALCULATE_V2)return;
window.__SP_B1_POINTS_RECALCULATE_V2=true;

const COURSE='B174698';
const VERSION=2;
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik','dativverben'];
const COURSE_FIELDS=['courseCode','kurs','kursnummer','courseDocId','course'];
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const clamp=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));
const db=()=>window.db||window.firebase?.firestore?.();
const nowTs=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();
let running=false,automaticStarted=false,lastSummary=null;

function dashboardState(){return window.SPTeacherDashboard?.state||null}
function studentId(s={}){return text(s.canonicalStudentId||s.docId||s.studentId||s.userId||s.id||s.__docId)}
function studentCourse(s={}){return text(s.courseCode||s.kurs||s.kursnummer||s.courseDocId||s.course)}
function studentName(s={}){return text([s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))||text(s.name||s.displayName||s.studentName)||'Teilnehmer/in'}
function clean(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(String))]}
function candidateIds(s={}){
  const fallback=clean((s.courseDocId||studentCourse(s)||'kurs')+'_'+(norm(s.email)||s.vorname||s.firstName||'student'));
  return uniq([studentId(s),s.docId,s.studentId,s.userId,s.uid,s.id,s.__docId,s.canonicalStudentId,...(Array.isArray(s.aliasIds)?s.aliasIds:[]),fallback]);
}
function relatedIds(row={}){return uniq([row.id,row.__docId,row.docId,row.studentId,row.userId,row.uid,row.canonicalStudentId,...(Array.isArray(row.aliasIds)?row.aliasIds:[])])}
function topicRecord(value){return !!(value&&typeof value==='object'&&!Array.isArray(value)&&(value.tasks||value.lifetime||value.exam||value.current||value.progressPercent!=null||value.title||value.moduleTitle))}
function storedPoints(value={}){
  const audit=value?.metadata?.pointAudit||{},recovery=value?.metadata?.pointRecovery||{};
  return Math.max(
    point(value.rankingPoints),point(value?.ranking?.points),point(value?.totals?.points),point(value.pointsTotal),point(value.lifetimePoints),point(value.punkteGesamt),point(value.points),
    point(audit.preservedPoints),point(audit.preservedHistoricalFloor),point(audit.finalPoints),point(audit.reconciledPoints),
    point(recovery.points),point(recovery.total),point(recovery.preservedPoints)
  );
}
function mergeRuns(a={},b={}){const out={};for(const key of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[key]=Math.max(point(a?.[key]),point(b?.[key]));return out}
function mergeTaskRunMaps(a={},b={}){const out={};for(const key of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[key]=mergeRuns(a?.[key]||{},b?.[key]||{});return out}
function mergeTask(a={},b={}){
  const percent=Math.max(clamp(a.percent||a.progress||0),clamp(b.percent||b.progress||0));
  return {...a,...b,percent,completed:!!(a.completed||b.completed||percent>=100),done:Math.max(Number(a.done||0),Number(b.done||0)),total:Math.max(Number(a.total||0),Number(b.total||0)),points:Math.max(point(a.points),point(b.points)),pointsByRun:mergeRuns(a.pointsByRun||{},b.pointsByRun||{})};
}
function mergeTopic(a={},b={}){
  const out={...a,...b},tasks={...(a.tasks||{})};
  for(const [key,task] of Object.entries(b.tasks||{}))tasks[key]=mergeTask(tasks[key]||{},task||{});
  out.tasks=tasks;
  const al=a.lifetime||{},bl=b.lifetime||{};
  out.lifetime={...al,...bl,taskPointRuns:mergeTaskRunMaps(al.taskPointRuns||{},bl.taskPointRuns||{}),examPointRuns:mergeRuns(al.examPointRuns||{},bl.examPointRuns||{}),points:Math.max(point(al.points),point(bl.points)),resets:Math.max(Number(al.resets||0),Number(bl.resets||0)),finishedRuns:Math.max(Number(al.finishedRuns||0),Number(bl.finishedRuns||0))};
  const ae=a.exam||{},be=b.exam||{};
  out.exam={...ae,...be,bestPercent:Math.max(clamp(ae.bestPercent||ae.percent||0),clamp(be.bestPercent||be.percent||0)),percent:Math.max(clamp(ae.percent||0),clamp(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempts:Math.max(Number(ae.attempts||0),Number(be.attempts||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed)};
  out.progressPercent=Math.max(clamp(a.progressPercent||a.current?.percent||0),clamp(b.progressPercent||b.current?.percent||0));
  out.completedTasks=Math.max(Number(a.completedTasks||a.current?.completedTasks||0),Number(b.completedTasks||b.current?.completedTasks||0));
  out.totalTasks=Math.max(Number(a.totalTasks||a.current?.totalTasks||0),Number(b.totalTasks||b.current?.totalTasks||0),Object.keys(tasks).length);
  out.technicalRecovery=!!(a.technicalRecovery||b.technicalRecovery);
  return out;
}
function topicKey(module,key,topic={}){
  if(topic.topicId||topic.themeId)return module+'|id|'+clean(topic.topicId||topic.themeId);
  const lesson=clean(topic.lesson||topic.lektion),theme=clean(topic.theme||topic.thema),level=clean(topic.level);
  return lesson||theme?[module,level,lesson,theme].join('|'):module+'|key|'+clean(key);
}
function mergeGroupTask(a={},b={}){
  const doneA=Array.isArray(a.done)?a.done:[],doneB=Array.isArray(b.done)?b.done:[],done=uniq([...doneA,...doneB]),total=Math.max(Number(a.total||0),Number(b.total||0));
  return {...a,...b,done,total,completed:!!(a.completed||b.completed||(total>0&&done.length>=total))};
}
function mergeGroupRun(a={},b={}){
  const tasks={};for(const key of new Set([...Object.keys(a.tasks||{}),...Object.keys(b.tasks||{})]))tasks[key]=mergeGroupTask(a.tasks?.[key]||{},b.tasks?.[key]||{});
  const awardsA=a.awards||{},awardsB=b.awards||{},awardTasks={};for(const key of new Set([...Object.keys(awardsA.tasks||{}),...Object.keys(awardsB.tasks||{})]))awardTasks[key]=Math.max(point(awardsA.tasks?.[key]),point(awardsB.tasks?.[key]));
  const ae=a.exam||{},be=b.exam||{};
  return {...a,...b,tasks,awards:{...awardsA,...awardsB,tasks:awardTasks,examPoints:Math.max(point(awardsA.examPoints),point(awardsB.examPoints))},exam:{...ae,...be,bestPercent:Math.max(clamp(ae.bestPercent||ae.percent||0),clamp(be.bestPercent||be.percent||0)),percent:Math.max(clamp(ae.percent||0),clamp(be.percent||be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0))},completed:!!(a.completed||b.completed)};
}
function groupScore(group={}){try{return point(window.SPPointRecalculator?.groupPoints?.(group)?.points)}catch(e){return 0}}
function mergeGroup(a={},b={}){
  const sigA=text(a.signature),sigB=text(b.signature);
  if(sigA&&sigB&&sigA!==sigB)return groupScore(a)>=groupScore(b)?a:b;
  const runs={};for(const key of new Set([...Object.keys(a.runs||{}),...Object.keys(b.runs||{})]))runs[key]=mergeGroupRun(a.runs?.[key]||{},b.runs?.[key]||{});
  return {...a,...b,signature:sigB||sigA,verbs:uniq([...(a.verbs||[]),...(b.verbs||[])]),currentRun:Math.max(Number(a.currentRun||1),Number(b.currentRun||1)),runs};
}
function mergeGroupMaps(rows,key){
  const out={};
  for(const row of rows){for(const [id,group] of Object.entries(row?.metadata?.[key]||{}))out[id]=out[id]?mergeGroup(out[id],group||{}):group||{}}
  return out;
}
function mergeProgressDocs(rows=[]){
  const merged={metadata:{}};
  const maps=Object.fromEntries(MODULES.map(module=>[module,new Map()]));
  for(const row of rows){
    merged.metadata={...(merged.metadata||{}),...(row.metadata||{})};
    for(const module of MODULES){
      for(const [key,topic] of Object.entries(row[module]||{})){
        if(!topicRecord(topic))continue;
        const sig=topicKey(module,key,topic),old=maps[module].get(sig);
        maps[module].set(sig,{key:old?.key||key,topic:old?mergeTopic(old.topic,topic):topic});
      }
    }
  }
  for(const module of MODULES){merged[module]={};for(const item of maps[module].values())merged[module][item.key]=item.topic}
  merged.metadata={...(merged.metadata||{}),verbenGroups:mergeGroupMaps(rows,'verbenGroups'),perfektGroups:mergeGroupMaps(rows,'perfektGroups'),dativverbenGroups:mergeGroupMaps(rows,'dativverbenGroups')};
  return merged;
}
async function progressRows(student){
  const database=db(),map=new Map(),queue=candidateIds(student),seen=new Set();if(!database)return[];
  while(queue.length&&seen.size<100){
    const id=String(queue.shift()||'');if(!id||seen.has(id))continue;seen.add(id);
    try{
      const snap=await database.collection('progress').doc(id).get();if(!snap.exists)continue;
      const data={id:snap.id,...(snap.data()||{})};map.set(snap.id,data);for(const alias of relatedIds(data))if(!seen.has(alias))queue.push(alias);
    }catch(e){}
  }
  const email=norm(student.email);
  if(email){
    try{
      const snap=await database.collection('progress').where('email','==',email).get();
      for(const doc of snap.docs){
        const data={id:doc.id,...(doc.data()||{})},course=text(data.courseCode||data.kurs||data.kursnummer||data.courseDocId||data.course);
        if(course&&norm(course)!==norm(COURSE))continue;
        map.set(doc.id,data);
      }
    }catch(e){console.warn('Zusätzliche Fortschritts-Aliase konnten nicht über die E-Mail gesucht werden',email,e)}
  }
  return [...map.values()];
}
function dativGroupsFromRows(rows=[]){
  const map=new Map();
  function keep(level,group){if(!level||!group||typeof group!=='object')return;const score=groupScore(group),old=map.get(level);if(!old||score>old.score)map.set(level,{group,score})}
  for(const row of rows){
    for(const [key,group] of Object.entries(row?.metadata?.dativverbenGroups||{})){const level=String(group?.level||group?.signature||key||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0];keep(level,group)}
    for(const entry of Object.values(row?.clientProgressStateV1||{})){
      if(!entry||typeof entry!=='object'||!String(entry.key||'').startsWith('SP_DATIVVERBEN_V2_'))continue;
      let local=null;try{local=JSON.parse(String(entry.value||''))}catch(e){}
      for(const [signature,group] of Object.entries(local?.groups||{})){const level=String(group?.level||group?.signature||signature||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0];keep(level,group)}
    }
  }
  return map;
}
function structuredDativByLevel(progress={}){
  const map=new Map();
  for(const [key,topic] of Object.entries(progress.dativverben||{})){
    if(!topicRecord(topic)||topic.technicalRecovery)continue;
    const level=String(topic.level||key||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0]||clean(key);
    let score=0;try{score=point(window.SPPointRecalculator?.topicPoints?.(topic)?.points)}catch(e){}
    map.set(level,Math.max(map.get(level)||0,score));
  }
  return map;
}
function technicalRecoveryPoints(progress={}){
  let total=0;
  for(const module of MODULES){
    let groupEvidence=0;
    const groupKey=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':module==='dativverben'?'dativverbenGroups':'';
    if(groupKey)for(const group of Object.values(progress?.metadata?.[groupKey]||{}))groupEvidence+=groupScore(group);
    if(groupEvidence>0)continue;
    let maxRecovery=0;for(const topic of Object.values(progress[module]||{})){if(topicRecord(topic)&&topic.technicalRecovery===true)maxRecovery=Math.max(maxRecovery,point(topic?.lifetime?.points))}total+=maxRecovery;
  }
  return total;
}
function exactEvidence(progress,rawDativ){
  const calc=window.SPPointRecalculator;if(!calc)throw new Error('Punkterechner ist nicht geladen.');
  const base=calc.calculateWithoutDativverben?calc.calculateWithoutDativverben(progress):calc.calculate(progress);
  const structured=structuredDativByLevel(progress),levels=new Set([...structured.keys(),...rawDativ.keys()]);let dativ=0;
  for(const level of levels)dativ+=Math.max(structured.get(level)||0,rawDativ.get(level)?.score||0);
  const recovery=technicalRecoveryPoints(progress);
  return {total:point(base.total)+dativ+recovery,breakdown:{...(base.breakdown||{}),dativverben:dativ,technicalRecovery:recovery},dativ};
}
function historicalEvidence(student,rows=[]){
  const sources=[];
  const add=(type,id,value)=>{const points=storedPoints(value);if(points>0)sources.push({type,id:text(id),points})};
  add('students',studentId(student),student);
  for(const row of rows)add('progress',row.id,row);
  const highest=sources.reduce((best,item)=>Math.max(best,item.points),0);
  return{points:highest,sources:sources.sort((a,b)=>b.points-a.points)};
}
function allAliasIds(student,rows=[]){return uniq([...candidateIds(student),...rows.flatMap(row=>relatedIds(row))])}
function hasStructuredEvidence(progress,rows=[]){
  if(rows.some(row=>Object.values(row?.clientProgressStateV1||{}).some(entry=>entry?.key&&entry.value)))return true;
  if(MODULES.some(module=>Object.values(progress[module]||{}).some(topicRecord)))return true;
  return ['verbenGroups','perfektGroups','dativverbenGroups'].some(key=>Object.keys(progress?.metadata?.[key]||{}).length>0);
}
async function repairStudent(student,{force=false}={}){
  const database=db(),id=studentId(student);if(!database||!id)return{status:'failed',reason:'NO_ID'};
  const rows=await progressRows(student),canonical=rows.find(row=>row.id===id)||{};
  const oldVersion=Number(canonical?.metadata?.pointAudit?.reconciliationVersion||canonical?.metadata?.b1PointRecalculationVersion||0);
  if(!force&&oldVersion>=VERSION)return{status:'skipped',id,name:studentName(student),points:Math.max(storedPoints(canonical),storedPoints(student))};
  const merged=mergeProgressDocs(rows),rawDativ=dativGroupsFromRows(rows),historical=historicalEvidence(student,rows);
  const dativGroups={...(merged?.metadata?.dativverbenGroups||{})};for(const [level,item] of rawDativ.entries())dativGroups[level]=item.group;merged.metadata={...(merged.metadata||{}),dativverbenGroups:dativGroups};
  const structured=hasStructuredEvidence(merged,rows);
  let exact={total:0,breakdown:{},dativ:0};if(structured)exact=exactEvidence(merged,rawDativ);
  if(!structured&&historical.points<=0)return{status:'no-evidence',id,name:studentName(student)};
  const before=Math.max(storedPoints(canonical),storedPoints(student));
  const total=Math.max(exact.total,historical.points,before);
  const legacyUnattributed=Math.max(0,total-exact.total),aliases=allAliasIds(student,rows),at=new Date().toISOString();
  const audit={
    ...(merged.metadata?.pointAudit||{}),version:10,reconciliationVersion:VERSION,b1RecalculationVersion:VERSION,b1RecalculationCourse:COURSE,b1RecalculatedAt:at,
    autoLoweringDisabled:true,authoritativeExactDeprecated:true,reconstructedPoints:exact.total,preservedHistoricalFloor:Math.max(historical.points,before),finalPoints:total,reconciledPoints:total,
    legacyUnattributedPoints:legacyUnattributed,breakdown:exact.breakdown,
    sourceTotals:historical.sources.slice(0,30),aliasCount:aliases.length
  };
  const progressPayload={
    studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:aliases,
    authUid:text(student.authUid||canonical.authUid),authEmail:text(student.authEmail||canonical.authEmail),
    email:text(student.email||canonical.email),studentName:studentName(student),kurs:COURSE,kursnummer:COURSE,courseCode:COURSE,
    totals:{...(canonical.totals||{}),points:total},ranking:{...(canonical.ranking||{}),points:total},
    points:total,pointsTotal:total,lifetimePoints:total,punkteGesamt:total,
    metadata:{...(canonical.metadata||{}),...(merged.metadata||{}),pointAudit:audit,b1PointRecalculationVersion:VERSION},
    updatedAt:nowTs(),lastPointRecalculationAt:nowTs()
  };
  for(const module of MODULES)if(Object.keys(merged[module]||{}).length)progressPayload[module]=merged[module];
  await database.collection('progress').doc(id).set(progressPayload,{merge:true});
  await database.collection('students').doc(id).set({
    rankingPoints:total,pointsTotal:total,lifetimePoints:total,punkteGesamt:total,points:total,
    ranking:{...(student.ranking||{}),points:total},totals:{...(student.totals||{}),points:total},
    pointAuditVersion:VERSION,pointReconciliationVersion:VERSION,pointAuditUpdatedAt:nowTs(),updatedAt:nowTs()
  },{merge:true});
  await database.collection('studentRankings').doc(id).set({
    studentId:id,authUid:text(student.authUid),displayName:studentName(student),courseKey:COURSE,courseCode:COURSE,
    points:total,version:7,pointAuditVersion:VERSION,pointReconciliationVersion:VERSION,updatedAt:nowTs()
  },{merge:true});
  return{status:'updated',id,name:studentName(student),before,reconstructed:exact.total,historicalFloor:historical.points,points:total,difference:total-before,restored:Math.max(0,total-before),legacyUnattributed,dativ:exact.dativ,aliases:aliases.length};
}
function mergeStudentRows(rows=[]){
  const map=new Map();
  for(const row of rows){
    const id=studentId(row);if(!id)continue;const old=map.get(id)||{};
    map.set(id,{...old,...row,rankingPoints:Math.max(point(old.rankingPoints),point(row.rankingPoints)),pointsTotal:Math.max(point(old.pointsTotal),point(row.pointsTotal)),lifetimePoints:Math.max(point(old.lifetimePoints),point(row.lifetimePoints)),punkteGesamt:Math.max(point(old.punkteGesamt),point(row.punkteGesamt)),points:Math.max(point(old.points),point(row.points))});
  }
  return [...map.values()];
}
function usableStudent(row={}){const role=norm(row.role||row.loginRole||row.accountRole);return !['teacher','lehrer','admin','owner'].includes(role)&&row.securityArchived!==true&&row.securityLookupExcluded!==true&&studentId(row)}
async function loadCourseStudents(){
  const database=db(),state=dashboardState(),rows=[...(state?.students||[])];if(!database)return mergeStudentRows(rows.filter(usableStudent));
  for(const field of COURSE_FIELDS){
    try{const snap=await database.collection('students').where(field,'==',COURSE).get();for(const doc of snap.docs)rows.push({id:doc.id,__docId:doc.id,docId:doc.id,...(doc.data()||{})})}catch(e){}
  }
  return mergeStudentRows(rows.filter(row=>usableStudent(row)&&norm(studentCourse(row))===norm(COURSE)));
}
function showSummary(summary){
  lastSummary=summary;try{sessionStorage.setItem('SP_B1_POINT_RECALC_SUMMARY_V2',JSON.stringify(summary))}catch(e){}
  const status=document.getElementById('spStatus');if(status)status.textContent=`B1-Punkte geprüft: ${summary.processed} TN · ${summary.updated} gespeichert · ${summary.restoredStudents} mit wiederhergestellten Punkten · ${summary.skipped} bereits geprüft · ${summary.noEvidence} ohne sichere Punktquelle · ${summary.failed} Fehler.`;
  try{window.dispatchEvent(new CustomEvent('SP_B1_POINTS_RECALCULATED',{detail:summary}))}catch(e){}
}
async function run({force=false,refresh=true}={}){
  if(running)return lastSummary;
  const state=dashboardState(),database=db();if(!database||!state?.loadedAt||!state.isOwner)return null;
  const students=await loadCourseStudents();if(!students.length)return null;
  running=true;
  const summary={course:COURSE,version:VERSION,processed:students.length,updated:0,restoredStudents:0,restoredPoints:0,skipped:0,noEvidence:0,failed:0,changes:[],startedAt:new Date().toISOString(),autoLowering:false};
  const status=document.getElementById('spStatus');if(status)status.textContent=`Punkte für ${students.length} TN im Kurs ${COURSE} werden aus allen gespeicherten Fortschrittsständen abgeglichen …`;
  try{
    for(const student of students){
      try{
        const result=await repairStudent(student,{force});
        if(result.status==='updated'){summary.updated++;if(result.restored>0){summary.restoredStudents++;summary.restoredPoints+=result.restored}summary.changes.push(result)}
        else if(result.status==='skipped')summary.skipped++;
        else if(result.status==='no-evidence')summary.noEvidence++;
        else summary.failed++;
      }catch(error){summary.failed++;summary.changes.push({status:'failed',id:studentId(student),name:studentName(student),error:text(error?.message||error)});console.error('Punkte konnten nicht abgeglichen werden',studentId(student),error)}
    }
    summary.finishedAt=new Date().toISOString();showSummary(summary);
    if(refresh&&summary.updated>0)setTimeout(()=>window.SPTeacherDashboard?.refresh?.(),700);
    return summary;
  }finally{running=false}
}
function auto(){
  if(automaticStarted)return;const state=dashboardState();if(!state?.loadedAt||!state.isOwner){setTimeout(auto,500);return}
  automaticStarted=true;run({force:false,refresh:true}).catch(error=>console.error('Automatische B1-Punkteabgleich fehlgeschlagen',error));
}

window.SPB1PointRecalculation={run,repairStudent,loadCourseStudents,storedPoints,course:COURSE,version:VERSION,get lastSummary(){return lastSummary}};
setTimeout(auto,800);
})();