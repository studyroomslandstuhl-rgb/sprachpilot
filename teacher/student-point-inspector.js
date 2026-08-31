(function(){
'use strict';
if(window.__SP_STUDENT_POINT_INSPECTOR_V2)return;
window.__SP_STUDENT_POINT_INSPECTOR_V2=true;

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik','dativverben'];
const norm=value=>String(value==null?'':value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const text=value=>String(value==null?'':value).trim();
const point=value=>{const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const esc=value=>text(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const uniq=values=>[...new Set((values||[]).filter(Boolean).map(String))];
const db=()=>window.db||window.firebase?.firestore?.();
const state=()=>window.SPTeacherDashboard?.state||null;
const studentId=s=>text(s?.canonicalStudentId||s?.docId||s?.studentId||s?.userId||s?.id||s?.__docId);
const course=s=>text(s?.courseCode||s?.kurs||s?.kursnummer||s?.courseDocId||s?.course);
const fullName=s=>text([s?.vorname||s?.firstName,s?.nachname||s?.lastName].filter(Boolean).join(' '))||text(s?.studentName||s?.displayName||s?.name)||'Teilnehmer/in';
const email=s=>text(s?.email).toLowerCase();
const stored=value=>Math.max(
 point(value?.rankingPoints),point(value?.pointsTotal),point(value?.lifetimePoints),point(value?.punkteGesamt),point(value?.points),
 point(value?.ranking?.points),point(value?.totals?.points),point(value?.preservedHistoricalFloor),point(value?.finalPoints),point(value?.reconciledPoints),
 point(value?.metadata?.pointAudit?.preservedPoints),point(value?.metadata?.pointAudit?.preservedHistoricalFloor),point(value?.metadata?.pointAudit?.finalPoints),point(value?.metadata?.pointAudit?.reconciledPoints),
 point(value?.metadata?.legacyDeviceMergeV2?.preservedFloor),point(value?.metadata?.legacyDeviceMergeV2?.finalPoints),
 point(value?.metadata?.cloudReconciliationV3?.preservedHistoricalFloor),point(value?.metadata?.cloudReconciliationV3?.finalPoints),
 point(value?.metadata?.cloudReconciliationV4?.preservedHistoricalFloor),point(value?.metadata?.cloudReconciliationV4?.finalPoints),
 point(value?.metadata?.aliasRepair?.preservedPoints)
);

function idsFor(s={}){return uniq([studentId(s),s.docId,s.studentId,s.userId,s.uid,s.id,s.__docId,s.canonicalStudentId,...(Array.isArray(s.aliasIds)?s.aliasIds:[])]);}
function relatedIds(row={}){return uniq([row.id,row.docId,row.studentId,row.userId,row.uid,row.canonicalStudentId,...(Array.isArray(row.aliasIds)?row.aliasIds:[])]);}
function compatibleCourse(a,b){const x=norm(course(a)),y=norm(course(b));return !x||!y||x===y;}
function mergeStudentRows(a={},b={}){
 const stronger=Object.keys(a).length>=Object.keys(b).length?a:b,weaker=stronger===a?b:a,out={...weaker,...stronger};
 out.aliasIds=uniq([...(a.aliasIds||[]),...(b.aliasIds||[]),...idsFor(a),...idsFor(b)]);
 for(const key of ['rankingPoints','pointsTotal','lifetimePoints','punkteGesamt','points','preservedHistoricalFloor','finalPoints','reconciledPoints','manualPointsTotal'])out[key]=Math.max(point(a[key]),point(b[key]));
 out.ranking={...(a.ranking||{}),...(b.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};
 out.totals={...(a.totals||{}),...(b.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};
 return out;
}
function studentKey(s={}){const mail=norm(email(s)),c=norm(course(s));if(mail&&c)return `mail:${mail}|${c}`;const id=studentId(s);if(id)return `id:${id}`;return `name:${norm(fullName(s))}|${c}`;}

async function loadUniverse(){
 const database=db();if(!database)return{students:[],progress:[],rankings:[]};
 const [studentSnap,progressSnap,rankingSnap]=await Promise.all([
  database.collection('students').get(),database.collection('progress').get(),database.collection('studentRankings').get()
 ]);
 const students=new Map();
 for(const s of state()?.students||[]){const row={...s};const key=studentKey(row);students.set(key,students.has(key)?mergeStudentRows(students.get(key),row):row);}
 for(const doc of studentSnap.docs){const row={id:doc.id,__docId:doc.id,docId:doc.id,...(doc.data()||{})},key=studentKey(row);students.set(key,students.has(key)?mergeStudentRows(students.get(key),row):row);}
 const progress=progressSnap.docs.map(doc=>({id:doc.id,...(doc.data()||{})}));
 const rankings=rankingSnap.docs.map(doc=>({id:doc.id,...(doc.data()||{})}));
 return{students:[...students.values()],progress,rankings};
}

function linkedRows(student,rows=[]){
 const known=new Set(idsFor(student)),selected=new Map();
 const sEmail=norm(email(student)),sName=norm(fullName(student)),sCourse=norm(course(student));
 let changed=true,loops=0;
 while(changed&&loops++<8){
  changed=false;
  for(const row of rows){
   if(selected.has(row.id))continue;
   const rowIds=relatedIds(row),idHit=rowIds.some(id=>known.has(id));
   const emailHit=sEmail&&norm(email(row))===sEmail&&compatibleCourse(row,student);
   const nameHit=sName&&norm(fullName(row))===sName&&(!sCourse||!norm(course(row))||norm(course(row))===sCourse);
   if(!idHit&&!emailHit&&!nameHit)continue;
   selected.set(row.id,row);for(const id of rowIds)if(!known.has(id)){known.add(id);changed=true;}
  }
 }
 return [...selected.values()];
}

function topicDetails(row={}){
 const api=window.SPPointRecalculator,items=[];
 for(const module of MODULES){
  for(const [key,topic] of Object.entries(row[module]||{})){
   if(!topic||typeof topic!=='object'||Array.isArray(topic))continue;
   if(!(topic.tasks||topic.lifetime||topic.exam||topic.current||topic.progressPercent!=null))continue;
   let audit={points:0,taskPoints:0,examPoints:0};try{audit=api?.topicPoints?.(topic)||audit}catch(e){}
   const tasks=Object.values(topic.tasks||{}),completed=tasks.filter(t=>t?.completed===true||Number(t?.percent||t?.progress||0)>=100).length;
   items.push({module,key,title:text(topic.title||topic.moduleTitle||key),lesson:text(topic.lesson||topic.lektion),theme:text(topic.theme||topic.thema),points:point(audit.points),taskPoints:point(audit.taskPoints),examPoints:point(audit.examPoints),tasks:tasks.length,completed,resets:Number(topic?.lifetime?.resets||0),finishedRuns:Number(topic?.lifetime?.finishedRuns||0),examBest:Number(topic?.exam?.bestPercent??topic?.exam?.percent??0)||0});
  }
 }
 return items;
}
function groupDetails(row={}){
 const api=window.SPPointRecalculator,out=[];
 for(const [kind,key] of [['Verben','verbenGroups'],['Perfekt','perfektGroups'],['Dativverben','dativverbenGroups']]){
  for(const [id,group] of Object.entries(row?.metadata?.[key]||{})){
   let audit={points:0};try{audit=api?.groupPoints?.(group)||audit}catch(e){}
   const runs=[];for(const [runId,run] of Object.entries(group?.runs||{})){const tasks=Object.values(run?.tasks||{}),completed=tasks.filter(t=>t?.completed===true||(Number(t?.total||0)>0&&(Array.isArray(t?.done)?t.done.length:Number(t?.done||0))>=Number(t?.total||0))).length;runs.push({run:Number(runId)||runId,tasks:tasks.length,completed,examPercent:Number(run?.exam?.bestPercent??run?.exam?.percent??0)||0,examAward:point(run?.awards?.examPoints)});}
   out.push({kind,id,signature:text(group?.signature),points:point(audit.points),currentRun:Number(group?.currentRun||1),runs});
  }
 }
 return out;
}
function rowAnalysis(row,index){
 let calc={total:0,breakdown:{}};try{calc=window.SPPointRecalculator?.calculate?.(row)||calc}catch(e){}
 const client=Object.values(row?.clientProgressStateV1||{}).filter(v=>v&&typeof v==='object'&&v.key).map(v=>String(v.key));
 return{label:`Progress ${index+1}`,id:row.id,canonical:!!(row.canonicalStudentId&&String(row.id)===String(row.canonicalStudentId)),stored:stored(row),manualPointsTotal:point(row.manualPointsTotal),calculated:point(calc.total),breakdown:calc.breakdown||{},pointFields:{points:point(row.points),pointsTotal:point(row.pointsTotal),lifetimePoints:point(row.lifetimePoints),punkteGesamt:point(row.punkteGesamt),ranking:point(row?.ranking?.points),totals:point(row?.totals?.points),finalPoints:point(row.finalPoints),reconciledPoints:point(row.reconciledPoints)},topics:topicDetails(row),groups:groupDetails(row),clientKeyCount:client.length,clientKeys:client.filter(k=>/^SP_(?:SCORE_RUN|THEME_SCORE|L\d|VERB|PERFEKT|DATIV|GRAMMATIK|FRAGEN)/i.test(k)).slice(0,120)};
}
function buildReport(student,progressRows,rankingRows){
 const rows=progressRows.map(rowAnalysis),historical=Math.max(stored(student),...rows.map(r=>r.stored),...rankingRows.map(stored),0),reconstructedMax=Math.max(...rows.map(r=>r.calculated),0),manualMax=Math.max(point(student.manualPointsTotal),...rows.map(r=>r.manualPointsTotal),0);
 const canonicalId=studentId(student),canonical=rows.find(r=>String(r.id)===String(canonicalId))||rows.find(r=>r.canonical)||rows[0]||null;
 const canonicalCalculated=point(canonical?.calculated),finalExpected=Math.max(historical,canonicalCalculated),flags=[];
 if(!rows.length)flags.push('kein Progress');
 if(rows.length>1)flags.push(`${rows.length} Progress-Speicher`);
 if(historical>canonicalCalculated)flags.push('historischer Höchststand bleibt erhalten');
 if(canonicalCalculated>historical)flags.push('Neuberechnung würde erhöhen');
 return{name:fullName(student),course:course(student),studentId:canonicalId,readOnly:true,studentStored:stored(student),historicalHighest:historical,reconstructedHighestSingleProgress:reconstructedMax,canonicalCalculated,finalExpected,manualPointsHighest:manualMax,rankingRows:rankingRows.map((r,i)=>({label:`Ranking ${i+1}`,points:point(r.points),course:course(r),auditVersion:point(r.pointAuditVersion),reconciliationVersion:point(r.pointReconciliationVersion)})),progressRows:rows,sourceCount:1+rows.length+rankingRows.length,flags,generatedAt:new Date().toISOString()};
}
function analyzeAll(universe){
 return universe.students.map(student=>buildReport(student,linkedRows(student,universe.progress),linkedRows(student,universe.rankings))).sort((a,b)=>a.name.localeCompare(b.name,'de'));
}

function breakdownHtml(breakdown={}){return Object.entries(breakdown).map(([k,v])=>`${esc(k)}: <strong>${point(v)}</strong>`).join(' · ')||'—';}
function detailHtml(report){
 const progressHtml=report.progressRows.map(r=>{
  const topicRows=r.topics.map(t=>`<tr><td>${esc(t.module)}</td><td>${esc(t.title||t.key)}</td><td>${esc([t.lesson&&'L'+t.lesson,t.theme&&'T'+t.theme].filter(Boolean).join(' / '))}</td><td>${t.completed}/${t.tasks}</td><td>${t.resets}</td><td>${t.finishedRuns}</td><td>${t.examBest}%</td><td><strong>${t.points}</strong></td></tr>`).join('');
  const groups=r.groups.map(g=>`<tr><td>${esc(g.kind)}</td><td>${esc(g.signature||g.id)}</td><td>${g.currentRun}</td><td>${esc(g.runs.map(x=>`R${x.run}: ${x.completed}/${x.tasks}, Prüfung ${x.examPercent}%`).join(' | '))}</td><td><strong>${g.points}</strong></td></tr>`).join('');
  return `<details style="margin:10px 0"><summary><strong>${r.label}</strong> · gespeichert ${r.stored} · berechnet ${r.calculated}${r.canonical?' · kanonisch':''}</summary><p>${breakdownHtml(r.breakdown)}</p><p style="font-size:12px">Punktefelder: ${esc(JSON.stringify(r.pointFields))}</p><p style="font-size:12px">Cloud-/LocalStorage-Schlüssel: ${r.clientKeyCount}; relevante Schlüssel: ${esc(r.clientKeys.join(', ')||'keine')}</p>${topicRows?`<div style="overflow:auto"><table class="sp-table"><thead><tr><th>Bereich</th><th>Thema</th><th>Lektion</th><th>Aufgaben</th><th>Resets</th><th>Runs fertig</th><th>Prüfung</th><th>Punkte</th></tr></thead><tbody>${topicRows}</tbody></table></div>`:'<p>Keine strukturierten Themen in diesem Speicher.</p>'}${groups?`<h3>Verb-/Perfekt-Gruppen</h3><div style="overflow:auto"><table class="sp-table"><thead><tr><th>Bereich</th><th>Gruppe</th><th>Aktueller Run</th><th>Runs</th><th>Punkte</th></tr></thead><tbody>${groups}</tbody></table></div>`:''}</details>`;
 }).join('');
 const ranking=report.rankingRows.map(r=>`${r.label}: <strong>${r.points}</strong>`).join(' · ')||'kein Ranking-Datensatz';
 return `<h3>${esc(report.name)} · ${esc(report.course||'ohne Kurs')}</h3><p>Schülerdatensatz: <strong>${report.studentStored}</strong> · ${ranking}</p><p>Historisch höchster Stand: <strong>${report.historicalHighest}</strong> · kanonisch neu berechnet: <strong>${report.canonicalCalculated}</strong> · nicht sinkender Zielwert: <strong>${report.finalExpected}</strong></p><p>Gefundene Quellen: <strong>${report.sourceCount}</strong> (${report.progressRows.length} Progress, ${report.rankingRows.length} Ranking). ${esc(report.flags.join(' · ')||'keine Auffälligkeit')}</p>${progressHtml}`;
}

let running=false,lastReports=[],selected=null;
function render(){
 const app=document.getElementById('app');if(!app)return;
 let card=document.querySelector('[data-student-point-inspector]');
 if(!card){card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.studentPointInspector='1';card.style.marginBottom='16px';const head=app.querySelector('.sp-page-head');if(head)head.insertAdjacentElement('afterend',card);else app.prepend(card);}
 const rows=lastReports.map((r,i)=>`<tr data-audit-row="${i}" style="cursor:pointer"><td><strong>${esc(r.name)}</strong></td><td>${esc(r.course||'—')}</td><td>${r.historicalHighest}</td><td>${r.canonicalCalculated}</td><td><strong>${r.finalExpected}</strong></td><td>${r.progressRows.length}/${r.rankingRows.length}</td><td>${esc(r.flags.join(' · ')||'OK')}</td></tr>`).join('');
 card.innerHTML=`<h2>Schüler-Punkteprüfung</h2><p><strong>Nur lesen:</strong> Jeder in Firebase vorhandene Schüler wird unabhängig vom Teilnehmer-Login geprüft. Es werden keine Punkte gesenkt und keine Fortschritte verändert.</p><div class="sp-row-actions"><input data-student-audit-search placeholder="Name oder Kurs suchen" style="min-width:260px;padding:9px 11px"><button type="button" class="sp-button" data-refresh-student-audit>Alle neu lesen</button><button type="button" class="sp-button secondary" data-copy-student-audit>Gesamtbericht kopieren</button></div><p>Geprüft: <strong>${lastReports.length}</strong> Schüler. Klicke eine Zeile für die Detailprüfung.</p><div style="overflow:auto"><table class="sp-table" data-student-audit-table><thead><tr><th>Name</th><th>Kurs</th><th>Historisch</th><th>Neu berechnet</th><th>Zielwert</th><th>Progress/Ranking</th><th>Hinweis</th></tr></thead><tbody>${rows}</tbody></table></div><div data-student-audit-detail>${selected?detailHtml(selected):'<p class="small">Noch kein Schüler ausgewählt.</p>'}</div>`;
 const input=card.querySelector('[data-student-audit-search]'),table=card.querySelector('[data-student-audit-table]');
 if(input)input.oninput=()=>{const q=norm(input.value);table?.querySelectorAll('tbody tr').forEach(tr=>{tr.style.display=!q||norm(tr.textContent).includes(q)?'':'none';});};
 card.querySelectorAll('[data-audit-row]').forEach(tr=>tr.onclick=()=>{selected=lastReports[Number(tr.dataset.auditRow)]||null;const detail=card.querySelector('[data-student-audit-detail]');if(detail)detail.innerHTML=selected?detailHtml(selected):'';});
 const refresh=card.querySelector('[data-refresh-student-audit]');if(refresh)refresh.onclick=()=>inspect(true);
 const copy=card.querySelector('[data-copy-student-audit]');if(copy)copy.onclick=async()=>{const safe=lastReports.map(r=>({name:r.name,course:r.course,studentStored:r.studentStored,historicalHighest:r.historicalHighest,canonicalCalculated:r.canonicalCalculated,finalExpected:r.finalExpected,sourceCount:r.sourceCount,progressCount:r.progressRows.length,rankingCount:r.rankingRows.length,flags:r.flags,breakdowns:r.progressRows.map(p=>({label:p.label,stored:p.stored,calculated:p.calculated,breakdown:p.breakdown}))}));try{await navigator.clipboard.writeText(JSON.stringify(safe,null,2));copy.textContent='Gesamtbericht kopiert';}catch(e){alert(JSON.stringify(safe,null,2));}};
}

async function inspect(force=false){
 if(running)return lastReports;running=true;
 try{
  const s=state();if(!s?.loadedAt||!s?.isOwner||!db())return lastReports;
  const universe=await loadUniverse();lastReports=analyzeAll(universe);window.SP_ALL_STUDENT_POINT_REPORTS=lastReports;render();return lastReports;
 }catch(error){console.error('Schüler-Punkteprüfung fehlgeschlagen',error);return lastReports}
 finally{running=false;}
}
function inspectStudent(name){const q=norm(name),report=lastReports.find(r=>norm(r.name)===q)||lastReports.find(r=>norm(r.name).includes(q));if(report){selected=report;render();}return report||null;}
function wait(){const s=state();if(s?.loadedAt&&s?.isOwner&&db()&&window.SPPointRecalculator){inspect().catch(()=>{});return;}setTimeout(wait,250);}
wait();
window.SPStudentPointInspector={inspect,inspectStudent,get reports(){return lastReports},get report(){return selected},readOnly:true,scope:'all-students'};
})();
