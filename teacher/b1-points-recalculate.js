(function(){
'use strict';
if(window.__SP_B1_POINTS_RECALCULATE_V1)return;
window.__SP_B1_POINTS_RECALCULATE_V1=true;

const COURSE='B174698';
const VERSION=1;
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik','dativverben'];
const text=value=>String(value==null?'':value).trim();
const norm=value=>text(value).toLowerCase();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const clamp=value=>Math.max(0,Math.min(100,Math.round(Number(value)||0)));
const db=()=>window.db||window.firebase?.firestore?.();
const nowTs=()=>window.firebase?.firestore?.FieldValue?.serverTimestamp?.()||new Date();
let running=false,automaticStarted=false,lastSummary=null;

function dashboardState(){return window.SPTeacherDashboard?.state||null}
function studentId(s={}){return text(s.canonicalStudentId||s.docId||s.studentId||s.userId||s.id||s.__docId)}
function studentCourse(s={}){return text(s.courseCode||s.kurs||s.kursnummer||s.courseDocId)}
function studentName(s={}){return text([s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))||text(s.name||s.displayName)||'Teilnehmer/in'}
function clean(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function candidateIds(s={}){
  const fallback=clean((s.courseDocId||studentCourse(s)||'kurs')+'_'+(norm(s.email)||s.vorname||s.firstName||'student'));
  return [...new Set([studentId(s),s.docId,s.studentId,s.userId,s.uid,s.id,s.__docId,s.canonicalStudentId,...(Array.isArray(s.aliasIds)?s.aliasIds:[]),fallback].filter(Boolean).map(String))];
}
function topicRecord(value){return !!(value&&typeof value==='object'&&!Array.isArray(value)&&(value.tasks||value.lifetime||value.exam||value.current||value.progressPercent!=null||value.title||value.moduleTitle))}
function mergeRuns(a={},b={}){const out={};for(const key of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[key]=Math.max(point(a?.[key]),point(b?.[key]));return out}
function mergeTaskRunMaps(a={},b={}){const out={};for(const key of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[key]=mergeRuns(a?.[key]||{},b?.[key]||{});return out}
function mergeTask(a={},b={}){
  const percent=Math.max(clamp(a.percent||a.progress||0),clamp(b.percent||b.progress||0));
  return {...a,...b,percent,completed:!!(a.completed||b.completed||percent>=100),done:Math.max(Number(a.done||0),Number(b.done||0)),total:Math.max(Number(a.total||0),Number(b.total||0)),pointsByRun:mergeRuns(a.pointsByRun||{},b.pointsByRun||{})};
}
function mergeTopic(a={},b={}){
  const out={...a,...b},tasks={...(a.tasks||{})};
  for(const [key,task] of Object.entries(b.tasks||{}))tasks[key]=mergeTask(tasks[key]||{},task||{});
  out.tasks=tasks;
  const al=a.lifetime||{},bl=b.lifetime||{};
  out.lifetime={...al,...bl,taskPointRuns:mergeTaskRunMaps(al.taskPointRuns||{},bl.taskPointRuns||{}),examPointRuns:mergeRuns(al.examPointRuns||{},bl.examPointRuns||{}),points:Math.max(point(al.points),point(bl.points))};
  const ae=a.exam||{},be=b.exam||{};
  out.exam={...ae,...be,bestPercent:Math.max(clamp(ae.bestPercent||ae.percent||0),clamp(be.bestPercent||be.percent||0)),percent:Math.max(clamp(ae.percent||0),clamp(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed)};
  out.progressPercent=Math.max(clamp(a.progressPercent||a.current?.percent||0),clamp(b.progressPercent||b.current?.percent||0));
  out.technicalRecovery=!!(a.technicalRecovery||b.technicalRecovery);
  return out;
}
function topicKey(module,key,topic={}){
  if(topic.topicId||topic.themeId)return module+'|id|'+clean(topic.topicId||topic.themeId);
  const lesson=clean(topic.lesson||topic.lektion),theme=clean(topic.theme||topic.thema),level=clean(topic.level);
  return lesson||theme?[module,level,lesson,theme].join('|'):module+'|key|'+clean(key);
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
        maps[module].set(sig,old?mergeTopic(old.topic,topic):{key,topic});
        if(old)maps[module].set(sig,{key:old.key||key,topic:mergeTopic(old.topic,topic)});
      }
    }
  }
  for(const module of MODULES){
    merged[module]={};for(const item of maps[module].values())merged[module][item.key]=item.topic;
  }
  return merged;
}
async function progressRows(student){
  const database=db(),map=new Map();if(!database)return[];
  for(const id of candidateIds(student)){
    try{const snap=await database.collection('progress').doc(id).get();if(snap.exists)map.set(snap.id,{id:snap.id,...(snap.data()||{})})}catch(e){}
  }
  const email=norm(student.email);
  if(email){
    try{
      const snap=await database.collection('progress').where('email','==',email).get();
      snap.docs.forEach(doc=>{const data=doc.data()||{},course=text(data.courseCode||data.kurs||data.kursnummer||data.courseDocId);if(!course||norm(course)===norm(COURSE))map.set(doc.id,{id:doc.id,...data})});
    }catch(e){console.warn('Zusätzliche Fortschritts-Aliase konnten nicht über die E-Mail gesucht werden',email,e)}
  }
  return [...map.values()];
}
function dativGroupsFromRows(rows=[]){
  const calc=window.SPPointRecalculator,map=new Map();
  function keep(level,group){
    if(!level||!group||typeof group!=='object')return;
    const score=point(calc?.groupPoints?.(group)?.points),old=map.get(level);
    if(!old||score>old.score)map.set(level,{group,score});
  }
  for(const row of rows){
    for(const [key,group] of Object.entries(row?.metadata?.dativverbenGroups||{})){
      const level=String(group?.level||group?.signature||key||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0];keep(level,group);
    }
    for(const entry of Object.values(row?.clientProgressStateV1||{})){
      if(!entry||typeof entry!=='object'||!String(entry.key||'').startsWith('SP_DATIVVERBEN_V2_'))continue;
      let local=null;try{local=JSON.parse(String(entry.value||''))}catch(e){}
      for(const [signature,group] of Object.entries(local?.groups||{})){
        const level=String(group?.level||group?.signature||signature||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0];keep(level,group);
      }
    }
  }
  return map;
}
function structuredDativByLevel(progress={}){
  const calc=window.SPPointRecalculator,map=new Map();
  for(const [key,topic] of Object.entries(progress.dativverben||{})){
    if(!topicRecord(topic)||topic.technicalRecovery)continue;
    const level=String(topic.level||key||'').toUpperCase().match(/A1|A2|B1|B2|C1/)?.[0]||clean(key);
    map.set(level,Math.max(map.get(level)||0,point(calc?.topicPoints?.(topic)?.points)));
  }
  return map;
}
function technicalRecoveryPoints(progress={}){
  const calc=window.SPPointRecalculator;let total=0;
  for(const module of MODULES){
    let groupEvidence=0;
    const groupKey=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':module==='dativverben'?'dativverbenGroups':'';
    if(groupKey)for(const group of Object.values(progress?.metadata?.[groupKey]||{}))groupEvidence+=point(calc?.groupPoints?.(group)?.points);
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
function hasEvidence(progress,rows){
  if(rows.some(row=>Object.values(row?.clientProgressStateV1||{}).some(entry=>entry?.key&&entry.value)))return true;
  return MODULES.some(module=>Object.values(progress[module]||{}).some(topicRecord));
}
async function repairStudent(student,{force=false}={}){
  const database=db(),id=studentId(student);if(!database||!id)return{status:'failed',reason:'NO_ID'};
  const rows=await progressRows(student),canonical=rows.find(row=>row.id===id)||{};
  const oldVersion=Number(canonical?.metadata?.b1PointRecalculationVersion||canonical?.metadata?.pointAudit?.authoritativeExactVersion||0);
  if(!force&&oldVersion>=VERSION)return{status:'skipped',id,name:studentName(student),points:point(canonical?.totals?.points||student.pointsTotal)};
  const merged=mergeProgressDocs(rows),rawDativ=dativGroupsFromRows(rows);
  if(!hasEvidence(merged,rows))return{status:'no-evidence',id,name:studentName(student)};
  const dativGroups={...(merged?.metadata?.dativverbenGroups||{})};
  for(const [level,item] of rawDativ.entries())dativGroups[level]=item.group;
  merged.metadata={...(merged.metadata||{}),dativverbenGroups:dativGroups};
  const exact=exactEvidence(merged,rawDativ),total=exact.total;
  const audit={...(merged.metadata?.pointAudit||{}),version:8,authoritativeExactVersion:VERSION,authoritativeExactPoints:total,b1RecalculationVersion:VERSION,b1RecalculationCourse:COURSE,b1RecalculatedAt:new Date().toISOString(),breakdown:exact.breakdown};
  const progressPayload={
    studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:candidateIds(student),
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
    pointAuditVersion:VERSION,pointAuditUpdatedAt:nowTs(),updatedAt:nowTs()
  },{merge:true});
  await database.collection('studentRankings').doc(id).set({
    studentId:id,authUid:text(student.authUid),displayName:studentName(student),courseKey:COURSE,courseCode:COURSE,
    points:total,version:6,pointAuditVersion:VERSION,updatedAt:nowTs()
  },{merge:true});
  const before=Math.max(point(canonical?.totals?.points),point(canonical?.pointsTotal),point(student.pointsTotal),point(student.rankingPoints));
  return{status:'updated',id,name:studentName(student),before,points:total,difference:total-before,dativ:exact.dativ};
}
function showSummary(summary){
  lastSummary=summary;try{sessionStorage.setItem('SP_B1_POINT_RECALC_SUMMARY',JSON.stringify(summary))}catch(e){}
  const status=document.getElementById('spStatus');if(status)status.textContent=`B1-Punkte geprüft: ${summary.processed} TN · ${summary.updated} korrigiert · ${summary.skipped} bereits aktuell · ${summary.noEvidence} ohne sichere Punktquelle · ${summary.failed} Fehler.`;
  try{window.dispatchEvent(new CustomEvent('SP_B1_POINTS_RECALCULATED',{detail:summary}))}catch(e){}
}
async function run({force=false,refresh=true}={}){
  if(running)return lastSummary;
  const state=dashboardState(),database=db();
  if(!database||!state?.loadedAt||!state.isOwner)return null;
  const students=(state.students||[]).filter(student=>norm(studentCourse(student))===norm(COURSE));
  if(!students.length)return null;
  running=true;
  const summary={course:COURSE,version:VERSION,processed:students.length,updated:0,skipped:0,noEvidence:0,failed:0,changes:[],startedAt:new Date().toISOString()};
  const status=document.getElementById('spStatus');if(status)status.textContent=`Punkte für ${students.length} TN im Kurs ${COURSE} werden aus Firebase neu berechnet …`;
  try{
    for(const student of students){
      try{
        const result=await repairStudent(student,{force});
        if(result.status==='updated'){summary.updated++;summary.changes.push(result)}
        else if(result.status==='skipped')summary.skipped++;
        else if(result.status==='no-evidence')summary.noEvidence++;
        else summary.failed++;
      }catch(error){summary.failed++;summary.changes.push({status:'failed',id:studentId(student),name:studentName(student),error:text(error?.message||error)});console.error('Punkte konnten nicht neu berechnet werden',studentId(student),error)}
    }
    summary.finishedAt=new Date().toISOString();showSummary(summary);
    if(refresh&&summary.updated>0)setTimeout(()=>window.SPTeacherDashboard?.refresh?.(),700);
    return summary;
  }finally{running=false}
}
function auto(){
  if(automaticStarted)return;const state=dashboardState();if(!state?.loadedAt||!state.isOwner){setTimeout(auto,500);return}
  automaticStarted=true;run({force:false,refresh:true}).catch(error=>console.error('Automatische B1-Punktekorrektur fehlgeschlagen',error));
}

window.SPB1PointRecalculation={run,repairStudent,course:COURSE,version:VERSION,get lastSummary(){return lastSummary}};
setTimeout(auto,800);
})();
