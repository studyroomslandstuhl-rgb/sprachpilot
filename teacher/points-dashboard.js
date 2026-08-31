(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_DASHBOARD_V6)return;
window.__SP_TEACHER_POINTS_DASHBOARD_V6=true;

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik','dativverben'];
const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const text=v=>String(v==null?'':v).trim();
const norm=v=>text(v).toLowerCase();
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
const db=()=>window.db||window.firebase?.firestore?.();
const state=()=>window.SPTeacherDashboard?.state||null;
let rankingById=new Map(),loading=false,lastLoad=0,decorateTimer=null,legacyMergeRunning=false,corePromise=null,autoScheduled=false;

function studentId(s={}){return text(s.canonicalStudentId||s.docId||s.studentId||s.userId||s.id||s.__docId)}
function studentCourse(s={}){return text(s.courseCode||s.kurs||s.kursnummer||s.courseDocId||s.course)}
function studentName(s={}){return text([s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))||text(s.studentName||s.displayName||s.name)||'Teilnehmer/in'}
function stored(row={}){return Math.max(point(row.rankingPoints),point(row.pointsTotal),point(row.lifetimePoints),point(row.punkteGesamt),point(row.points),point(row.ranking?.points),point(row.totals?.points),point(row.preservedHistoricalFloor),point(row.finalPoints),point(row.reconciledPoints),point(row.metadata?.legacyDeviceMergeV2?.preservedFloor),point(row.metadata?.legacyDeviceMergeV2?.finalPoints),point(row.metadata?.cloudReconciliationV3?.preservedHistoricalFloor),point(row.metadata?.cloudReconciliationV3?.finalPoints),point(row.metadata?.cloudReconciliationV4?.preservedHistoricalFloor),point(row.metadata?.cloudReconciliationV4?.finalPoints),point(row.metadata?.aliasRepair?.preservedPoints))}
function studentPoints(s={}){return Math.max(stored(s),point(rankingById.get(studentId(s))?.points))}
function findStudent(name,email,course){const rows=state()?.students||[],e=norm(email),n=norm(name),c=norm(course);return rows.find(s=>e&&norm(s.email)===e)||rows.find(s=>norm(studentName(s))===n&&norm(studentCourse(s))===c)||null}

async function loadRankings(force=false){
 const database=db(),s=state();if(!s?.loadedAt){decorate();return false}if(!database||loading){decorate();return false}if(!force&&Date.now()-lastLoad<15000){decorate();return true}
 loading=true;try{const snap=await database.collection('studentRankings').get(),map=new Map();snap.docs.forEach(d=>map.set(d.id,{id:d.id,...(d.data()||{})}));rankingById=map;lastLoad=Date.now();return true}catch(error){console.warn('Punktestände konnten nicht vollständig geladen werden',error);return false}finally{loading=false;decorate()}
}
function decorateStudentTable(){
 if(state()?.view!=='students')return;const table=document.querySelector('#studentTableHost .sp-table'),head=table?.querySelector('thead tr');if(!table||!head)return;
 if(!head.querySelector('[data-sp-points]')){const th=document.createElement('th');th.dataset.spPoints='1';th.textContent='Punkte';const access=[...head.children].find(c=>norm(c.textContent)==='zugang');head.insertBefore(th,access||head.lastElementChild)}
 table.querySelectorAll('tbody tr').forEach(row=>{if(row.querySelector('[data-sp-points]'))return;const cells=[...row.children],student=findStudent(cells[0]?.textContent,cells[1]?.textContent,cells[2]?.textContent);if(cells.length<4)return;const td=document.createElement('td');td.dataset.spPoints='1';td.innerHTML=student?`<strong>${studentPoints(student)}</strong><div style="font-size:11px;color:var(--sp-muted)">Punkte</div>`:'—';row.insertBefore(td,cells[3]||row.lastElementChild)})
}
function decorateOverview(){
 if(state()?.view!=='overview')return;const app=document.getElementById('app');if(!app)return;
 if(!app.querySelector('[data-sp-point-summary]')){const students=state()?.students||[],total=students.reduce((s,row)=>s+studentPoints(row),0),card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spPointSummary='1';card.innerHTML=`<h2>Punkte</h2><p><strong style="font-size:26px;color:var(--sp-text)">${total}</strong> Punkte bei ${students.length} Teilnehmenden. Neu berechnete Werte dürfen historische höhere Punktestände nur erhöhen, niemals senken.</p>`;(app.querySelector('.sp-grid')||app).appendChild(card)}
 if(!app.querySelector('[data-sp-legacy-device-merge]')){const card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spLegacyDeviceMerge='1';card.innerHTML='<h2>Globale Fortschritts- und Punkte-Zusammenführung</h2><p>Führt alle in Firebase bekannten Schüler-, Progress-, Ranking- und Geräte-Stände zusammen: Fragen, Wortschatz/Lektionen, Verben, Perfekt, Grammatik, Dativverben, Finnisch sowie L7/L8-Ledger. Anschließend werden die Punkte aus der zusammengeführten Evidenz neu berechnet. Der endgültige Wert ist immer der höhere Wert aus Neuberechnung und historischem Punktestand.</p><div class="sp-row-actions"><button type="button" class="sp-button" data-run-legacy-device-merge>Alle Stände und Punkte neu zusammenführen</button></div><p class="small" data-legacy-device-result>V4 wird einmalig automatisch geprüft; die Schaltfläche kann die Prüfung erneut starten.</p>';(app.querySelector('.sp-grid')||app).appendChild(card);card.querySelector('[data-run-legacy-device-merge]').onclick=()=>runLegacyDeviceMerge({confirmUser:true})}
}
function decorate(){clearTimeout(decorateTimer);decorateTimer=setTimeout(()=>{decorateStudentTable();decorateOverview()},30)}

async function ensureCore(){if(window.SPAccountProgressCloudCore)return window.SPAccountProgressCloudCore;if(!corePromise)corePromise=import('/js/account-progress-cloud-core.js?v=20260831-central4').then(()=>window.SPAccountProgressCloudCore);return corePromise}
function idsFor(s={}){return uniq([studentId(s),s.canonicalStudentId,s.docId,s.studentId,s.userId,s.uid,s.id,s.__docId,...(Array.isArray(s.aliasIds)?s.aliasIds:[])])}
function relatedIds(row={}){return uniq([row.id,row.canonicalStudentId,row.docId,row.studentId,row.userId,row.uid,...(Array.isArray(row.aliasIds)?row.aliasIds:[])])}
function sameCourse(row={},student={}){const a=norm(studentCourse(row)),b=norm(studentCourse(student));return !a||!b||a===b}
async function progressRows(student){
 const database=db(),map=new Map(),queue=idsFor(student),seen=new Set();if(!database)return[];
 while(queue.length&&seen.size<160){const id=text(queue.shift());if(!id||seen.has(id))continue;seen.add(id);try{const snap=await database.collection('progress').doc(id).get();if(!snap.exists)continue;const row={id:snap.id,...(snap.data()||{})};if(!sameCourse(row,student))continue;map.set(snap.id,row);relatedIds(row).forEach(x=>{if(!seen.has(x))queue.push(x)})}catch(e){}}
 const email=norm(student.email);if(email){try{const snap=await database.collection('progress').where('email','==',email).get();snap.docs.forEach(d=>{const row={id:d.id,...(d.data()||{})};if(sameCourse(row,student))map.set(d.id,row)})}catch(e){}}
 return [...map.values()]
}
function mergeStudentRows(a={},b={}){const out={...a,...b};out.aliasIds=uniq([...(a.aliasIds||[]),...(b.aliasIds||[]),a.__docId,b.__docId,a.id,b.id]);for(const key of ['rankingPoints','pointsTotal','lifetimePoints','punkteGesamt','points','preservedHistoricalFloor','finalPoints','reconciledPoints'])out[key]=Math.max(point(a[key]),point(b[key]));out.ranking={...(a.ranking||{}),...(b.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};out.totals={...(a.totals||{}),...(b.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};return out}
async function reconciliationStudents(){
 const database=db();if(!database)return state()?.students||[];
 try{const snap=await database.collection('students').get(),map=new Map();for(const d of snap.docs){const row={__docId:d.id,id:d.id,...(d.data()||{})},mail=norm(row.email),course=norm(studentCourse(row)),key=mail&&course?`${mail}|${course}`:text(row.canonicalStudentId||d.id);map.set(key,map.has(key)?mergeStudentRows(map.get(key),row):row)}return [...map.values()]}catch(error){console.warn('Alle Schüler für Reconciliation konnten nicht geladen werden',error);return state()?.students||[]}
}
function calc(row={}){try{return point(window.SPPointRecalculator?.calculate?.(row)?.total)}catch(e){return 0}}
function clientEntries(row={}){return Object.values(row.clientProgressStateV1||{}).filter(e=>e&&typeof e==='object'&&e.key&&e.value!=null).map(e=>({key:String(e.key),value:String(e.value),updatedAt:Number(e.updatedAt)||0}))}
function ledgerMatch(key=''){const m=String(key).match(/^SP_THEME_SCORE_A1_L([78])_T(\d+)_V(\d+)_(.+)$/i);return m?{lesson:Number(m[1]),theme:Number(m[2]),version:Number(m[3])||1,pid:m[4]}:null}
function cleanPid(v){return String(v||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_').replace(/^_+|_+$/g,'')||'student'}
function ledgerPoints(ledger={}){let total=0;for(const run of Object.values(ledger.runs||{})){for(const item of Object.values(run?.tasks||{}))total+=point(item?.points);total+=point(run?.examPoints)}return total}
function ledgerEvidence(ledger={}){const set=new Set();for(const [runId,run] of Object.entries(ledger.runs||{})){for(const [id,item] of Object.entries(run?.tasks||{}))if(item?.completed===true||point(item?.points)>0)set.add(`r${runId}:t:${id}`);if(point(run?.examPoints)>0||point(run?.examBestPercent)>0)set.add(`r${runId}:exam:${point(run?.examPoints)}:${point(run?.examBestPercent)}`)}return set}
function evidenceSignature(row){return `${[...row.evidence].sort().join('|')}#${row.points}`}
function subset(a,b){for(const x of a)if(!b.has(x))return false;return true}
function independentLedgerBranches(sources=[]){
 const byKey=new Map();for(const source of sources){const row={...source,evidence:ledgerEvidence(source.ledger),points:ledgerPoints(source.ledger)};if(!row.evidence.size&&!row.points)continue;const old=byKey.get(source.key);if(!old||row.evidence.size>old.evidence.size||row.points>old.points)byKey.set(source.key,row)}
 const rows=[...byKey.values()],keysByRow=new Map();for(const source of sources){if(!keysByRow.has(source.rowId))keysByRow.set(source.rowId,new Set());keysByRow.get(source.rowId).add(source.key)}
 const kept=[];for(const row of rows){const duplicate=kept.find(other=>evidenceSignature(other)===evidenceSignature(row));if(duplicate){const samePid=String(duplicate.pid)===String(row.pid),coexists=[...keysByRow.values()].some(keys=>keys.has(duplicate.key)&&keys.has(row.key));if(samePid||coexists)continue}kept.push(row)}
 return kept.filter((row,i)=>!kept.some((other,j)=>j!==i&&subset(row.evidence,other.evidence)&&other.evidence.size>row.evidence.size&&other.points>=row.points))
}
function topicId(lesson,theme){return`wortschatz-a1-lektion-${lesson}-thema-${theme}`}
function topicEvidence(row,lesson,theme){try{return point(window.SPPointRecalculator?.topicPoints?.(row?.wortschatz?.[topicId(lesson,theme)]||{})?.points)}catch(e){return 0}}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function taskDone(t={}){return Array.isArray(t.done)?t.done.length:Number(t.done)||0}
function topicRun(t={}){let run=Math.max(1,Number(t.currentRun)||0,Number(t.current?.run)||0,Number(t.exam?.run)||0,Math.min(3,(Number(t.lifetime?.resets)||0)+1));for(const task of Object.values(t.tasks||{}))run=Math.max(run,Number(task?.run)||0);return Math.max(1,Math.min(3,Math.round(run||1)))}
function taskCurrent(task={},topic={},run=1){const explicit=Number(task.run)||0;if(explicit)return explicit===run;if(topicRun(topic)!==run)return false;if(run>1&&topic.current?.resetAt&&clamp(topic.current?.percent||0)===0)return false;return true}
function examCurrent(topic={},run=1){const exam=topic.exam||{},explicit=Number(exam.run)||0;if(explicit)return explicit===run;if(topicRun(topic)!==run)return false;if(run>1&&topic.current?.resetAt&&clamp(topic.current?.percent||0)===0&&!exam.lastAttemptAt)return false;return true}
function maxRuns(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=Math.max(point(a?.[k]),point(b?.[k]));return out}
function maxTaskRuns(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=maxRuns(a?.[k]||{},b?.[k]||{});return out}
function taskStrength(t={}){return clamp(t.percent||0)*10000+(t.completed?1000000:0)+Math.max(0,taskDone(t))*100+Math.max(0,Number(t.total)||0)}
function mergeTask(a={},b={},run=1){const stronger=taskStrength(a)>=taskStrength(b)?a:b,weaker=stronger===a?b:a,pointsByRun=maxRuns(a.pointsByRun||{},b.pointsByRun||{});return{...weaker,...stronger,run,percent:Math.max(clamp(a.percent),clamp(b.percent)),completed:!!(a.completed||b.completed),done:Math.max(taskDone(a),taskDone(b)),total:Math.max(Number(a.total||0),Number(b.total||0)),points:Object.values(pointsByRun).reduce((s,v)=>s+point(v),0),pointsByRun}}
function mergeGeneric(a,b,key=''){
 if(a===undefined||a===null)return b;if(b===undefined||b===null)return a;
 if(Array.isArray(a)&&Array.isArray(b))return uniq([...a,...b].map(v=>typeof v==='string'?v:JSON.stringify(v))).map(v=>{try{return JSON.parse(v)}catch(e){return v}});
 if(typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){const out={...b,...a};for(const k of new Set([...Object.keys(a),...Object.keys(b)]))out[k]=mergeGeneric(a[k],b[k],k);return out}
 if(typeof a==='number'&&typeof b==='number'&&/(?:points?|score|stars?|percent|progress|attempt|count|total|done|learned|known|unknown|unsure|run|reset|revision|final|reconciled|floor)/i.test(key))return Math.max(a,b);
 if(typeof a==='boolean'&&typeof b==='boolean'&&/(?:done|completed|finished|passed|known|learned)/i.test(key))return a||b;
 return a;
}
function taskStrengthSummary(t={}){return Object.values(t.tasks||{}).reduce((s,x)=>s+taskStrength(x),0)+clamp(t.progressPercent||t.current?.percent||0)*100000+point(t.lifetime?.points)}
function mergeTopic(a={},b={}){
 const aRun=topicRun(a),bRun=topicRun(b),run=Math.max(aRun,bRun),stronger=aRun>bRun?a:bRun>aRun?b:taskStrengthSummary(a)>=taskStrengthSummary(b)?a:b,weaker=stronger===a?b:a,out={...weaker,...stronger,currentRun:run};const al=a.lifetime||{},bl=b.lifetime||{};
 out.lifetime={...al,...bl,points:Math.max(point(al.points),point(bl.points)),taskPointRuns:maxTaskRuns(al.taskPointRuns||{},bl.taskPointRuns||{}),examPointRuns:maxRuns(al.examPointRuns||{},bl.examPointRuns||{}),resets:Math.max(Number(al.resets||0),Number(bl.resets||0),run-1),finishedRuns:Math.max(Number(al.finishedRuns||0),Number(bl.finishedRuns||0)),bestExamPercent:Math.max(Number(al.bestExamPercent||0),Number(bl.bestExamPercent||0)),bestStars:Math.max(Number(al.bestStars||0),Number(bl.bestStars||0)),examAttempts:Math.max(Number(al.examAttempts||0),Number(bl.examAttempts||0))};
 const tasks={};for(const key of new Set([...Object.keys(a.tasks||{}),...Object.keys(b.tasks||{})])){const av=a.tasks?.[key],bv=b.tasks?.[key],ac=av&&taskCurrent(av,a,run),bc=bv&&taskCurrent(bv,b,run);if(ac&&bc)tasks[key]=mergeTask(av,bv,run);else if(ac)tasks[key]={...av,run};else if(bc)tasks[key]={...bv,run}}out.tasks=tasks;out.completedTasks=Object.values(tasks).filter(t=>t?.completed||clamp(t?.percent)>=100).length;out.totalTasks=Math.max(Number(a.totalTasks||a.current?.totalTasks||0),Number(b.totalTasks||b.current?.totalTasks||0),Object.keys(tasks).length);out.progressPercent=Object.keys(tasks).length?clamp(Object.values(tasks).reduce((s,t)=>s+clamp(t?.percent||0),0)/Math.max(1,out.totalTasks)):0;out.current={...(weaker.current||{}),...(stronger.current||{}),run,percent:out.progressPercent,completedTasks:out.completedTasks,totalTasks:out.totalTasks};
 const ae=examCurrent(a,run)?(a.exam||{}):{},be=examCurrent(b,run)?(b.exam||{}):{};out.exam={...be,...ae,run,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempts:Math.max(Number(ae.attempts||0),Number(be.attempts||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed),unlocked:!!(ae.unlocked||be.unlocked)};out.examUnlocked=!!(out.exam.unlocked||a.examUnlocked||b.examUnlocked);out.technicalRecovery=!!(a.technicalRecovery||b.technicalRecovery);try{if(!out.technicalRecovery)out.lifetime.points=Math.max(out.lifetime.points,point(window.SPPointRecalculator?.topicPoints?.(out)?.points))}catch(e){}return out
}
function mergeProgress(base={},incoming={}){
 const out={...base,...incoming};for(const m of MODULES){const mod={...(base[m]||{})};for(const[k,t]of Object.entries(incoming[m]||{})){if(t&&typeof t==='object'&&!Array.isArray(t)&&(t.tasks||t.current||t.lifetime||t.progressPercent!=null||t.exam))mod[k]=mergeTopic(mod[k]||{},t);else mod[k]=mergeGeneric(mod[k],t,k)}out[m]=mod}out.metadata=mergeGeneric(base.metadata||{},incoming.metadata||{},'metadata');if(base.finnischVerben||incoming.finnischVerben)out.finnischVerben=mergeGeneric(base.finnischVerben||{},incoming.finnischVerben||{},'finnischVerben');out.ranking={...(base.ranking||{}),...(incoming.ranking||{}),points:Math.max(point(base.ranking?.points),point(incoming.ranking?.points))};out.totals={...(base.totals||{}),...(incoming.totals||{}),points:Math.max(point(base.totals?.points),point(incoming.totals?.points))};out.pointsTotal=Math.max(point(base.pointsTotal),point(incoming.pointsTotal));out.lifetimePoints=Math.max(point(base.lifetimePoints),point(incoming.lifetimePoints));out.punkteGesamt=Math.max(point(base.punkteGesamt),point(incoming.punkteGesamt));out.aliasIds=uniq([...(base.aliasIds||[]),...(incoming.aliasIds||[]),base.id,incoming.id,base.studentId,incoming.studentId,base.userId,incoming.userId,base.docId,incoming.docId]);return out
}

async function mergeOneStudent(student){
 const database=db(),core=await ensureCore(),rows=await progressRows(student),canonical=text(student.canonicalStudentId)||studentId(student)||idsFor(student)[0];if(!database||!core||!canonical||!rows.length)return{ok:false,reason:'no-data'};
 if(rows.some(r=>Number(r.metadata?.cloudReconciliationV4?.version||0)>=4))return{ok:true,skipped:true,canonical,reason:'already-reconciled-v4'};
 let structured={};const entryMap=new Map(),ledgerGroups=new Map();
 for(const row of rows){structured=mergeProgress(structured,row);for(const entry of clientEntries(row)){const old=entryMap.get(entry.key);entryMap.set(entry.key,{key:entry.key,value:old?core.mergeValues(old.value,entry.value):entry.value,updatedAt:Math.max(old?.updatedAt||0,entry.updatedAt)});const match=ledgerMatch(entry.key);if(!match)continue;let ledger;try{ledger=JSON.parse(entry.value)}catch(e){continue}if(!ledger||typeof ledger!=='object')continue;const pair=`${match.lesson}:${match.theme}`;if(!ledgerGroups.has(pair))ledgerGroups.set(pair,[]);ledgerGroups.get(pair).push({rowId:row.id,key:entry.key,...match,ledger})}}
 const legacyThemes=[],canonicalPid=cleanPid(canonical);
 for(const [pair,sources] of ledgerGroups){
  const [lesson,theme]=pair.split(':').map(Number);let mergedRaw=null,maxCarried=0;for(const source of sources){maxCarried=Math.max(maxCarried,point(source.ledger?.carriedPoints));const raw=JSON.stringify(source.ledger);mergedRaw=mergedRaw==null?raw:core.mergeValues(mergedRaw,raw)}if(!mergedRaw)continue;let ledger;try{ledger=JSON.parse(mergedRaw)}catch(e){continue}
  const branches=independentLedgerBranches(sources),repeatBonus=0,mergedRunPoints=ledgerPoints(ledger),targetLifetime=maxCarried+mergedRunPoints;ledger.carriedPoints=Math.max(point(ledger.carriedPoints),maxCarried);ledger.lifetimePoints=Math.max(point(ledger.lifetimePoints),ledgerPoints(ledger)+point(ledger.carriedPoints));ledger.legacyDeviceMerge={version:4,branches:branches.length,sourceLedgers:sources.length,repeatBonus:0,targetLifetime,taskRepeatBonusRequiresActivityIds:true,examRunsNotAutoSummed:true,at:new Date().toISOString()};
  const version=Math.max(1,...sources.map(s=>s.version||1)),targetKey=`SP_THEME_SCORE_A1_L${lesson}_T${theme}_V${version}_${canonicalPid}`,targetRaw=JSON.stringify(ledger),old=entryMap.get(targetKey);entryMap.set(targetKey,{key:targetKey,value:old?core.mergeValues(old.value,targetRaw):targetRaw,updatedAt:Date.now()});const existing=topicEvidence(structured,lesson,theme);legacyThemes.push({lesson,theme,targetLifetime,existing,adjustment:Math.max(0,targetLifetime-existing),repeatBonus,branches:branches.length,sourceLedgers:sources.length})
 }
 const mergedMap=core.buildMap(entryMap),baseEvidence=calc(structured),adjustment=legacyThemes.reduce((s,t)=>s+t.adjustment,0),adjustedEvidence=baseEvidence+adjustment,aliases=uniq([...idsFor(student),...rows.flatMap(relatedIds)]),rankingFloor=Math.max(0,...aliases.map(id=>stored(rankingById.get(id)||{}))),floor=Math.max(stored(student),rankingFloor,...rows.map(stored),0),finalPoints=Math.max(floor,adjustedEvidence),stamp={version:4,at:new Date().toISOString(),sources:rows.map(r=>r.id),themes:legacyThemes,baseEvidence,adjustedEvidence,preservedHistoricalFloor:floor,finalPoints,cloudKnownOnly:true,structuredMerge:true,allClientProgressEntriesMerged:true,noAutomaticLowering:true,taskRepeatBonusRequiresActivityIds:true,examRunsNotAutoSummed:true};
 const ts=window.firebase.firestore.FieldValue.serverTimestamp(),metadata=mergeGeneric(structured.metadata||{},{cloudReconciliationV4:stamp},'metadata'),patch={clientProgressStateV1:mergedMap,clientProgressStateVersion:9,clientProgressNonDestructive:true,clientProgressAuthorityVersion:7,clientProgressAuthorityMode:'teacher-global-cloud-reconciliation-v4',clientProgressStateUpdatedAt:ts,canonicalStudentId:canonical,studentId:canonical,userId:canonical,docId:canonical,aliasIds:aliases,ranking:{...(structured.ranking||{}),points:finalPoints},totals:{...(structured.totals||{}),points:finalPoints},pointsTotal:finalPoints,lifetimePoints:finalPoints,punkteGesamt:finalPoints,preservedHistoricalFloor:floor,finalPoints,reconciledPoints:finalPoints,metadata,updatedAt:ts};
 for(const m of MODULES)if(structured[m]&&Object.keys(structured[m]).length)patch[m]=structured[m];if(structured.finnischVerben)patch.finnischVerben=structured.finnischVerben;
 await database.collection('progress').doc(canonical).set(patch,{merge:true});
 const ranking=rankingById.get(canonical)||{};await database.collection('students').doc(canonical).set({canonicalStudentId:canonical,studentId:canonical,userId:canonical,docId:canonical,aliasIds:aliases,rankingPoints:Math.max(point(student.rankingPoints),finalPoints),pointsTotal:Math.max(point(student.pointsTotal),finalPoints),lifetimePoints:Math.max(point(student.lifetimePoints),finalPoints),punkteGesamt:Math.max(point(student.punkteGesamt),finalPoints),points:Math.max(point(student.points),finalPoints),ranking:{...(student.ranking||{}),points:Math.max(point(student.ranking?.points),finalPoints)},totals:{...(student.totals||{}),points:Math.max(point(student.totals?.points),finalPoints)},preservedHistoricalFloor:Math.max(point(student.preservedHistoricalFloor),floor),reconciledPoints:Math.max(point(student.reconciledPoints),finalPoints),cloudReconciliationVersion:4,updatedAt:ts},{merge:true});
 await database.collection('studentRankings').doc(canonical).set({studentId:canonical,displayName:studentName(student),courseKey:studentCourse(student),courseCode:studentCourse(student),points:Math.max(point(ranking.points),finalPoints),preservedHistoricalFloor:Math.max(point(ranking.preservedHistoricalFloor),floor),reconciledPoints:Math.max(point(ranking.reconciledPoints),finalPoints),cloudReconciliationVersion:4,updatedAt:ts},{merge:true});
 return{ok:true,canonical,rows:rows.length,themes:legacyThemes.length,repeatBonus:0,before:floor,after:finalPoints,adjustedEvidence}
}
async function runLegacyDeviceMerge({confirmUser=false,automatic=false}={}){
 if(legacyMergeRunning)return;const button=document.querySelector('[data-run-legacy-device-merge]'),status=document.querySelector('[data-legacy-device-result]');await loadRankings(true);const students=await reconciliationStudents();if(!students.length){if(status)status.textContent='Keine Teilnehmenden in Firebase gefunden.';return}if(confirmUser&&!confirm(`Globale V4-Zusammenführung für ${students.length} Teilnehmende starten? Bestehende höhere Punkte werden niemals gesenkt und es werden keine Fortschritte gelöscht.`))return;
 legacyMergeRunning=true;if(button)button.disabled=true;if(status)status.textContent=automatic?'Automatische V4-Zusammenführung läuft …':'Zusammenführung läuft …';let done=0,changed=0,failed=0,skipped=0;
 try{
  for(const student of students){try{const r=await mergeOneStudent(student);done++;if(r?.skipped)skipped++;else if(r?.ok){if(r.after>r.before||r.rows>1||r.themes>0)changed++}else failed++}catch(error){failed++;console.warn('Cloud-Reconciliation fehlgeschlagen',studentName(student),error)}if(status)status.textContent=`${done}/${students.length} geprüft · ${changed} zusammengeführt/neu berechnet · ${skipped} bereits V4 · Fehler ${failed}`}
  await loadRankings(true);if(status)status.textContent=`Fertig: ${done} geprüft · ${changed} zusammengeführt/neu berechnet · ${skipped} bereits V4 · Fehler ${failed}. Historisch höhere Punkte wurden beibehalten. Rein lokale Daten, die noch nie Firebase erreicht haben, kommen beim nächsten Login des betreffenden Geräts dazu.`;
  try{window.dispatchEvent(new CustomEvent('SP_GLOBAL_POINTS_RECONCILED',{detail:{version:4,students:done,changed,skipped,failed,nonDestructive:true,noLowering:true}}))}catch(e){}
 }finally{legacyMergeRunning=false;if(button){button.disabled=false;button.textContent='Alle Stände und Punkte erneut prüfen'}}
}
function scheduleAutomaticV4(){
 if(autoScheduled)return;autoScheduled=true;
 const attempt=()=>{
  if(!state()?.loadedAt||!db()){setTimeout(attempt,900);return}
  try{if(sessionStorage.getItem('SP_TEACHER_GLOBAL_RECONCILIATION_V4_ATTEMPTED')==='1')return;sessionStorage.setItem('SP_TEACHER_GLOBAL_RECONCILIATION_V4_ATTEMPTED','1')}catch(e){}
  runLegacyDeviceMerge({confirmUser:false,automatic:true}).catch(error=>console.warn('Automatische globale V4-Reconciliation fehlgeschlagen',error));
 };
 setTimeout(attempt,2600);
}

const observer=new MutationObserver(()=>decorate());observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target?.closest?.('#refreshBtn,[onclick*="SPTeacherDashboard.refresh"]'))setTimeout(()=>loadRankings(true),450)});
window.addEventListener('SP_RANKING_ROSTER_BACKFILLED',()=>loadRankings(true));window.addEventListener('SP_B1_POINTS_RECALCULATED',()=>loadRankings(true));window.addEventListener('SP_GLOBAL_POINTS_RECONCILED',()=>loadRankings(true));
[250,600,1200,2200,4000].forEach(delay=>setTimeout(()=>{decorate();loadRankings(delay>=1200)},delay));scheduleAutomaticV4();
window.SPTeacherPointsDashboard={loadRankings,studentPoints,decorate,runLegacyDeviceMerge,mergeOneStudent,reconciliationStudents,version:6,reconciliationVersion:4};
})();
