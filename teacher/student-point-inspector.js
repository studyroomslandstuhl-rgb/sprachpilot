(function(){
'use strict';
if(window.__SP_STUDENT_POINT_INSPECTOR_V1)return;
window.__SP_STUDENT_POINT_INSPECTOR_V1=true;

const TARGET='abeer blurfan';
const COURSE='B174698';
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik','dativverben'];
const norm=value=>String(value==null?'':value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const text=value=>String(value==null?'':value).trim();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const esc=value=>text(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const db=()=>window.db||window.firebase?.firestore?.();
const state=()=>window.SPTeacherDashboard?.state||null;
const studentId=s=>text(s?.canonicalStudentId||s?.docId||s?.studentId||s?.userId||s?.id||s?.__docId);
const course=s=>text(s?.courseCode||s?.kurs||s?.kursnummer||s?.courseDocId||s?.course);
const fullName=s=>text([s?.vorname||s?.firstName,s?.nachname||s?.lastName].filter(Boolean).join(' '))||text(s?.studentName||s?.displayName||s?.name);
const uniq=values=>[...new Set((values||[]).filter(Boolean).map(String))];
const stored=value=>Math.max(
 point(value?.rankingPoints),point(value?.pointsTotal),point(value?.lifetimePoints),point(value?.punkteGesamt),point(value?.points),
 point(value?.ranking?.points),point(value?.totals?.points),point(value?.metadata?.pointAudit?.preservedPoints),
 point(value?.metadata?.pointAudit?.preservedHistoricalFloor),point(value?.metadata?.pointAudit?.finalPoints),point(value?.metadata?.pointAudit?.reconciledPoints)
);

function idsFor(s={}){
 return uniq([studentId(s),s.docId,s.studentId,s.userId,s.uid,s.id,s.__docId,s.canonicalStudentId,...(Array.isArray(s.aliasIds)?s.aliasIds:[])]);
}
function relatedIds(row={}){
 return uniq([row.id,row.docId,row.studentId,row.userId,row.uid,row.canonicalStudentId,...(Array.isArray(row.aliasIds)?row.aliasIds:[])]);
}
function exactTarget(row={}){return norm(fullName(row))===TARGET}

async function findStudents(){
 const database=db();if(!database)return[];
 const map=new Map();
 for(const s of state()?.students||[]){if(exactTarget(s))map.set(studentId(s)||Math.random(),s)}
 const queries=[
  ['studentName','Abeer Blurfan'],['displayName','Abeer Blurfan'],['name','Abeer Blurfan'],['vorname','Abeer'],['firstName','Abeer']
 ];
 for(const [field,value] of queries){
  try{
   const snap=await database.collection('students').where(field,'==',value).get();
   snap.docs.forEach(doc=>{const row={id:doc.id,__docId:doc.id,docId:doc.id,...(doc.data()||{})};if(exactTarget(row))map.set(doc.id,row)});
  }catch(e){}
 }
 return [...map.values()].sort((a,b)=>{
  const ac=norm(course(a))===norm(COURSE)?0:1,bc=norm(course(b))===norm(COURSE)?0:1;return ac-bc;
 });
}

async function progressRows(student){
 const database=db(),map=new Map(),queue=idsFor(student),seen=new Set();if(!database)return[];
 while(queue.length&&seen.size<120){
  const id=text(queue.shift());if(!id||seen.has(id))continue;seen.add(id);
  try{
   const snap=await database.collection('progress').doc(id).get();
   if(!snap.exists)continue;
   const row={id:snap.id,...(snap.data()||{})};map.set(snap.id,row);for(const alias of relatedIds(row))if(!seen.has(alias))queue.push(alias);
  }catch(e){}
 }
 const email=text(student.email).toLowerCase();
 if(email){
  try{
   const snap=await database.collection('progress').where('email','==',email).get();
   snap.docs.forEach(doc=>{const row={id:doc.id,...(doc.data()||{})};const c=course(row);if(!c||norm(c)===norm(course(student))||norm(c)===norm(COURSE))map.set(doc.id,row)});
  }catch(e){}
 }
 for(const field of ['studentName','displayName','name']){
  try{
   const snap=await database.collection('progress').where(field,'==','Abeer Blurfan').get();
   snap.docs.forEach(doc=>{const row={id:doc.id,...(doc.data()||{})};const c=course(row);if(!c||norm(c)===norm(course(student))||norm(c)===norm(COURSE))map.set(doc.id,row)});
  }catch(e){}
 }
 return [...map.values()];
}

async function rankingRows(student){
 const database=db(),map=new Map();if(!database)return[];
 for(const id of idsFor(student)){
  try{const snap=await database.collection('studentRankings').doc(id).get();if(snap.exists)map.set(snap.id,{id:snap.id,...(snap.data()||{})})}catch(e){}
 }
 for(const field of ['displayName','studentName']){
  try{const snap=await database.collection('studentRankings').where(field,'==','Abeer Blurfan').get();snap.docs.forEach(doc=>map.set(doc.id,{id:doc.id,...(doc.data()||{})}))}catch(e){}
 }
 return [...map.values()];
}

function topicDetails(row={}){
 const api=window.SPPointRecalculator,items=[];
 for(const module of MODULES){
  for(const [key,topic] of Object.entries(row[module]||{})){
   if(!topic||typeof topic!=='object'||Array.isArray(topic))continue;
   if(!(topic.tasks||topic.lifetime||topic.exam||topic.current||topic.progressPercent!=null))continue;
   let audit={points:0,taskPoints:0,examPoints:0};try{audit=api?.topicPoints?.(topic)||audit}catch(e){}
   const tasks=Object.values(topic.tasks||{}),completed=tasks.filter(t=>t?.completed===true||Number(t?.percent||t?.progress||0)>=100).length;
   items.push({
    module,key,title:text(topic.title||topic.moduleTitle||key),lesson:text(topic.lesson||topic.lektion),theme:text(topic.theme||topic.thema),
    points:point(audit.points),taskPoints:point(audit.taskPoints),examPoints:point(audit.examPoints),tasks:tasks.length,completed,
    resets:Number(topic?.lifetime?.resets||0),finishedRuns:Number(topic?.lifetime?.finishedRuns||0),
    taskPointRuns:topic?.lifetime?.taskPointRuns||{},examPointRuns:topic?.lifetime?.examPointRuns||{},
    examBest:Number(topic?.exam?.bestPercent??topic?.exam?.percent??0)||0
   });
  }
 }
 return items;
}

function groupDetails(row={}){
 const api=window.SPPointRecalculator,out=[];
 for(const [kind,key] of [['Verben','verbenGroups'],['Perfekt','perfektGroups'],['Dativverben','dativverbenGroups']]){
  for(const [id,group] of Object.entries(row?.metadata?.[key]||{})){
   let audit={points:0};try{audit=api?.groupPoints?.(group)||audit}catch(e){}
   const runs=[];
   for(const [runId,run] of Object.entries(group?.runs||{})){
    const tasks=Object.values(run?.tasks||{}),completed=tasks.filter(t=>t?.completed===true||(Number(t?.total||0)>0&&(Array.isArray(t?.done)?t.done.length:Number(t?.done||0))>=Number(t?.total||0))).length;
    runs.push({run:Number(runId)||runId,tasks:tasks.length,completed,examPercent:Number(run?.exam?.bestPercent??run?.exam?.percent??0)||0,examAward:point(run?.awards?.examPoints)});
   }
   out.push({kind,id,signature:text(group?.signature),points:point(audit.points),currentRun:Number(group?.currentRun||1),runs});
  }
 }
 return out;
}

function rowAnalysis(row,index){
 let calc={total:0,breakdown:{}};try{calc=window.SPPointRecalculator?.calculate?.(row)||calc}catch(e){}
 const client=Object.values(row?.clientProgressStateV1||{}).filter(v=>v&&typeof v==='object'&&v.key).map(v=>String(v.key));
 return{
  label:`Progress ${index+1}`,
  id:row.id,
  stored:stored(row),
  manualPointsTotal:point(row.manualPointsTotal),
  calculated:point(calc.total),
  breakdown:calc.breakdown||{},
  pointFields:{points:point(row.points),pointsTotal:point(row.pointsTotal),lifetimePoints:point(row.lifetimePoints),punkteGesamt:point(row.punkteGesamt),ranking:point(row?.ranking?.points),totals:point(row?.totals?.points)},
  audit:row?.metadata?.pointAudit||{},
  topics:topicDetails(row),
  groups:groupDetails(row),
  clientKeyCount:client.length,
  clientKeys:client.filter(k=>/^SP_(?:SCORE_RUN|THEME_SCORE|L\d|VERB|PERFEKT|DATIV|GRAMMATIK|FRAGEN)/i.test(k)).slice(0,120)
 };
}

function buildReport(student,progress,rankings){
 const rows=progress.map(rowAnalysis),historical=Math.max(stored(student),...rows.map(r=>r.stored),...rankings.map(stored),0),reconstructedMax=Math.max(...rows.map(r=>r.calculated),0),manualMax=Math.max(point(student.manualPointsTotal),...rows.map(r=>r.manualPointsTotal),0);
 return{
  target:'Abeer Blurfan',readOnly:true,course:course(student),studentStored:stored(student),studentPointFields:{rankingPoints:point(student.rankingPoints),pointsTotal:point(student.pointsTotal),lifetimePoints:point(student.lifetimePoints),punkteGesamt:point(student.punkteGesamt),points:point(student.points),ranking:point(student?.ranking?.points),totals:point(student?.totals?.points),manualPointsTotal:point(student.manualPointsTotal)},
  rankingRows:rankings.map((r,i)=>({label:`Ranking ${i+1}`,points:point(r.points),course:course(r),auditVersion:point(r.pointAuditVersion),reconciliationVersion:point(r.pointReconciliationVersion)})),
  progressRows:rows,
  sourceCount:1+rows.length+rankings.length,
  historicalHighest:historical,
  reconstructedHighestSingleProgress:reconstructedMax,
  manualPointsHighest:manualMax,
  warning:rows.length>1?'Mehrere Progress-Speicher gefunden. Die Punkte müssen über diese Speicher hinweg geprüft werden; der höchste Einzel-Rechenwert ist nicht automatisch die Gesamtsumme.':'',
  generatedAt:new Date().toISOString()
 };
}

function breakdownHtml(breakdown={}){return Object.entries(breakdown).map(([k,v])=>`${esc(k)}: <strong>${point(v)}</strong>`).join(' · ')||'—'}
function render(report,students){
 const app=document.getElementById('app');if(!app)return;
 let card=document.querySelector('[data-student-point-inspector]');
 if(!card){card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.studentPointInspector='1';card.style.marginBottom='16px';const head=app.querySelector('.sp-page-head');if(head)head.insertAdjacentElement('afterend',card);else app.prepend(card)}
 if(!report){card.innerHTML=`<h2>Abeer Blurfan · Einzelprüfung</h2><p><strong>Kein eindeutig zuordenbarer Schülerdatensatz gefunden.</strong> Gefundene Namens-Treffer: ${students.length}.</p><p>Es wurde nichts geschrieben oder verändert.</p>`;return}
 const progressHtml=report.progressRows.map(r=>{
  const topicRows=r.topics.map(t=>`<tr><td>${esc(t.module)}</td><td>${esc(t.title||t.key)}</td><td>${esc([t.lesson&&'L'+t.lesson,t.theme&&'T'+t.theme].filter(Boolean).join(' / '))}</td><td>${t.completed}/${t.tasks}</td><td>${t.resets}</td><td>${t.finishedRuns}</td><td>${t.examBest}%</td><td><strong>${t.points}</strong></td></tr>`).join('');
  const groups=r.groups.map(g=>`<tr><td>${esc(g.kind)}</td><td>${esc(g.signature||g.id)}</td><td>${g.currentRun}</td><td>${esc(g.runs.map(x=>`R${x.run}: ${x.completed}/${x.tasks}, Prüfung ${x.examPercent}%`).join(' | '))}</td><td><strong>${g.points}</strong></td></tr>`).join('');
  return `<details style="margin:10px 0"><summary><strong>${r.label}</strong> · gespeichert ${r.stored} · aus diesem Speicher berechnet ${r.calculated} · manuell ${r.manualPointsTotal}</summary><p>${breakdownHtml(r.breakdown)}</p><p style="font-size:12px">Punktefelder: ${esc(JSON.stringify(r.pointFields))}</p><p style="font-size:12px">Cloud-/LocalStorage-Schlüssel: ${r.clientKeyCount}; relevante Schlüssel: ${esc(r.clientKeys.join(', ')||'keine')}</p>${topicRows?`<div style="overflow:auto"><table class="sp-table"><thead><tr><th>Bereich</th><th>Thema</th><th>Lektion</th><th>Aufgaben</th><th>Resets</th><th>Runs fertig</th><th>Prüfung</th><th>Punkte</th></tr></thead><tbody>${topicRows}</tbody></table></div>`:'<p>Keine strukturierten Themen in diesem Speicher.</p>'}${groups?`<h3>Verb-/Perfekt-Gruppen</h3><div style="overflow:auto"><table class="sp-table"><thead><tr><th>Bereich</th><th>Gruppe</th><th>Aktueller Run</th><th>Runs</th><th>Punkte</th></tr></thead><tbody>${groups}</tbody></table></div>`:''}</details>`;
 }).join('');
 const ranking=report.rankingRows.map(r=>`${r.label}: <strong>${r.points}</strong>`).join(' · ')||'kein Ranking-Datensatz';
 card.innerHTML=`<h2>Abeer Blurfan · Einzelprüfung</h2><p><strong>Nur lesen:</strong> Diese Prüfung verändert keine Punkte und keine Fortschritte.</p><p>Kurs: <strong>${esc(report.course||'—')}</strong> · Schülerdatensatz: <strong>${report.studentStored}</strong> Punkte · ${ranking}</p><p>Höchster noch gespeicherter Punktestand: <strong>${report.historicalHighest}</strong> · höchster aus einem einzelnen Progress-Speicher rekonstruierter Stand: <strong>${report.reconstructedHighestSingleProgress}</strong> · manuelle Zusatzpunkte: <strong>${report.manualPointsHighest}</strong></p>${report.warning?`<p class="sp-status error">${esc(report.warning)}</p>`:''}<p>Gefundene Quellen: <strong>${report.sourceCount}</strong> (${report.progressRows.length} Progress-Speicher, ${report.rankingRows.length} Ranking-Speicher).</p>${progressHtml}<div class="sp-row-actions"><button type="button" class="sp-button" data-copy-abeer-report>Bericht für Chat kopieren</button><button type="button" class="sp-button secondary" data-refresh-abeer-report>Nur Abeer neu lesen</button></div>`;
 const copy=card.querySelector('[data-copy-abeer-report]');if(copy)copy.onclick=async()=>{const safe={...report,progressRows:report.progressRows.map(r=>({...r,id:undefined,audit:undefined})),generatedAt:report.generatedAt};try{await navigator.clipboard.writeText(JSON.stringify(safe,null,2));copy.textContent='Bericht kopiert'}catch(e){alert(JSON.stringify(safe,null,2))}};
 const refresh=card.querySelector('[data-refresh-abeer-report]');if(refresh)refresh.onclick=()=>inspect(true);
}

let running=false,last=null;
async function inspect(force=false){
 if(running)return last;running=true;
 try{
  const s=state();if(!s?.loadedAt||!s?.isOwner||!db())return null;
  const students=await findStudents();
  const chosen=students.find(x=>norm(course(x))===norm(COURSE))||students[0]||null;
  if(!chosen){render(null,students);return null}
  const [progress,rankings]=await Promise.all([progressRows(chosen),rankingRows(chosen)]);
  last=buildReport(chosen,progress,rankings);window.SP_ABEER_POINT_REPORT=last;render(last,students);return last;
 }catch(error){console.error('Abeer-Einzelprüfung fehlgeschlagen',error);const app=document.getElementById('app');if(app){let card=document.querySelector('[data-student-point-inspector]');if(!card){card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.studentPointInspector='1';app.prepend(card)}card.innerHTML=`<h2>Abeer Blurfan · Einzelprüfung</h2><p class="sp-status error">Fehler beim Lesen: ${esc(error?.message||error)}</p><p>Es wurde nichts verändert.</p>`}return null}
 finally{running=false}
}
function wait(){const s=state();if(s?.loadedAt&&s?.isOwner&&db()&&window.SPPointRecalculator){inspect().catch(()=>{});return}setTimeout(wait,250)}
wait();
window.SPStudentPointInspector={inspect,get report(){return last},target:'Abeer Blurfan',readOnly:true};
})();