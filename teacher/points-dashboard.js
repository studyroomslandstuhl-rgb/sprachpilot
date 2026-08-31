(function(){
'use strict';
if(window.__SP_TEACHER_POINTS_DASHBOARD_V4)return;
window.__SP_TEACHER_POINTS_DASHBOARD_V4=true;

const point=v=>{const n=Number(v);return Number.isFinite(n)?Math.max(0,Math.round(n)):0};
const text=v=>String(v==null?'':v).trim();
const norm=v=>text(v).toLowerCase();
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
const db=()=>window.db||window.firebase?.firestore?.();
const state=()=>window.SPTeacherDashboard?.state||null;
let rankingById=new Map(),loading=false,lastLoad=0,decorateTimer=null,legacyMergeRunning=false,corePromise=null;

function studentId(s={}){return text(s.canonicalStudentId||s.docId||s.studentId||s.userId||s.id||s.__docId)}
function studentCourse(s={}){return text(s.courseCode||s.kurs||s.kursnummer||s.courseDocId||s.course)}
function studentName(s={}){return text([s.vorname||s.firstName,s.nachname||s.lastName].filter(Boolean).join(' '))||text(s.studentName||s.displayName||s.name)||'Teilnehmer/in'}
function stored(row={}){return Math.max(point(row.rankingPoints),point(row.pointsTotal),point(row.lifetimePoints),point(row.punkteGesamt),point(row.points),point(row.ranking?.points),point(row.totals?.points))}
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
 if(!app.querySelector('[data-sp-point-summary]')){const students=state()?.students||[],total=students.reduce((s,row)=>s+studentPoints(row),0),card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spPointSummary='1';card.innerHTML=`<h2>Punkte</h2><p><strong style="font-size:26px;color:var(--sp-text)">${total}</strong> Punkte bei ${students.length} Teilnehmenden. Ein niedrigerer Spiegelwert ersetzt keinen höheren historischen Stand.</p>`;(app.querySelector('.sp-grid')||app).appendChild(card)}
 if(!app.querySelector('[data-sp-legacy-device-merge]')){const card=document.createElement('section');card.className='sp-card sp-wide';card.dataset.spLegacyDeviceMerge='1';card.innerHTML='<h2>Einmalige Altgeräte-Zusammenführung</h2><p>Führt bereits in Firebase vorhandene alte Handy-, Tablet- und Browserstände je Teilnehmer zusammen. Unterschiedliche Aufgaben werden vereinigt. Eine doppelte Aufgabe wird nur dann zusätzlich als Wiederholung gezählt, wenn zwei wirklich auseinandergegangene Geräte-Zweige erkennbar sind. Reine Spiegelkopien werden nicht doppelt gezählt. Historisch höhere Punkte werden nie gesenkt.</p><div class="sp-row-actions"><button type="button" class="sp-button" data-run-legacy-device-merge>Jetzt einmalig zusammenführen</button></div><p class="small" data-legacy-device-result>Noch nicht ausgeführt.</p>';(app.querySelector('.sp-grid')||app).appendChild(card);card.querySelector('[data-run-legacy-device-merge]').onclick=()=>runLegacyDeviceMerge()}
}
function decorate(){clearTimeout(decorateTimer);decorateTimer=setTimeout(()=>{decorateStudentTable();decorateOverview()},30)}

async function ensureCore(){if(window.SPAccountProgressCloudCore)return window.SPAccountProgressCloudCore;if(!corePromise)corePromise=import('/js/account-progress-cloud-core.js?v=20260831-central3').then(()=>window.SPAccountProgressCloudCore);return corePromise}
function idsFor(s={}){return uniq([studentId(s),s.canonicalStudentId,s.docId,s.studentId,s.userId,s.uid,s.id,s.__docId,...(Array.isArray(s.aliasIds)?s.aliasIds:[])])}
function relatedIds(row={}){return uniq([row.id,row.canonicalStudentId,row.docId,row.studentId,row.userId,row.uid,...(Array.isArray(row.aliasIds)?row.aliasIds:[])])}
function sameCourse(row={},student={}){const a=norm(studentCourse(row)),b=norm(studentCourse(student));return !a||!b||a===b}
async function progressRows(student){
 const database=db(),map=new Map(),queue=idsFor(student),seen=new Set();if(!database)return[];
 while(queue.length&&seen.size<120){const id=text(queue.shift());if(!id||seen.has(id))continue;seen.add(id);try{const snap=await database.collection('progress').doc(id).get();if(!snap.exists)continue;const row={id:snap.id,...(snap.data()||{})};if(!sameCourse(row,student))continue;map.set(snap.id,row);relatedIds(row).forEach(x=>{if(!seen.has(x))queue.push(x)})}catch(e){}}
 const email=norm(student.email);if(email){try{const snap=await database.collection('progress').where('email','==',email).get();snap.docs.forEach(d=>{const row={id:d.id,...(d.data()||{})};if(sameCourse(row,student))map.set(d.id,row)})}catch(e){}}
 return [...map.values()]
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
 const unique=new Map();for(const source of sources){const row={...source,evidence:ledgerEvidence(source.ledger),points:ledgerPoints(source.ledger)};if(!row.evidence.size&&!row.points)continue;const sig=evidenceSignature(row);if(!unique.has(sig))unique.set(sig,row)}
 const rows=[...unique.values()];
 return rows.filter((row,i)=>!rows.some((other,j)=>j!==i&&subset(row.evidence,other.evidence)&&(other.evidence.size>row.evidence.size||other.points>row.points)))
}
function topicId(lesson,theme){return`wortschatz-a1-lektion-${lesson}-thema-${theme}`}
function topicEvidence(row,lesson,theme){try{return point(window.SPPointRecalculator?.topicPoints?.(row?.wortschatz?.[topicId(lesson,theme)]||{})?.points)}catch(e){return 0}}

async function mergeOneStudent(student){
 const database=db(),core=await ensureCore(),rows=await progressRows(student),canonical=studentId(student)||idsFor(student)[0];if(!database||!core||!canonical||!rows.length)return{ok:false,reason:'no-data'};
 const entryMap=new Map(),ledgerGroups=new Map();
 for(const row of rows){for(const entry of clientEntries(row)){const old=entryMap.get(entry.key);entryMap.set(entry.key,{key:entry.key,value:old?core.mergeValues(old.value,entry.value):entry.value,updatedAt:Math.max(old?.updatedAt||0,entry.updatedAt)});const match=ledgerMatch(entry.key);if(!match)continue;let ledger;try{ledger=JSON.parse(entry.value)}catch(e){continue}if(!ledger||typeof ledger!=='object')continue;const pair=`${match.lesson}:${match.theme}`;if(!ledgerGroups.has(pair))ledgerGroups.set(pair,[]);ledgerGroups.get(pair).push({rowId:row.id,key:entry.key,...match,ledger})}}
 const legacyThemes=[],canonicalPid=cleanPid(canonical);
 for(const [pair,sources] of ledgerGroups){
  const [lesson,theme]=pair.split(':').map(Number);let mergedRaw=null,maxCarried=0;
  for(const source of sources){maxCarried=Math.max(maxCarried,point(source.ledger?.carriedPoints));const raw=JSON.stringify(source.ledger);mergedRaw=mergedRaw==null?raw:core.mergeValues(mergedRaw,raw)}
  if(!mergedRaw)continue;let ledger;try{ledger=JSON.parse(mergedRaw)}catch(e){continue}
  const branches=independentLedgerBranches(sources),mergedRunPoints=ledgerPoints(ledger),branchRunPoints=branches.reduce((s,b)=>s+b.points,0),targetRunPoints=Math.max(mergedRunPoints,branchRunPoints),repeatBonus=Math.max(0,targetRunPoints-mergedRunPoints),targetLifetime=maxCarried+targetRunPoints;
  ledger.carriedPoints=Math.max(point(ledger.carriedPoints),maxCarried)+repeatBonus;ledger.lifetimePoints=Math.max(point(ledger.lifetimePoints),ledgerPoints(ledger)+point(ledger.carriedPoints));ledger.legacyDeviceMerge={version:2,branches:branches.length,sourceLedgers:sources.length,repeatBonus,targetLifetime,at:new Date().toISOString()};
  const version=Math.max(1,...sources.map(s=>s.version||1)),targetKey=`SP_THEME_SCORE_A1_L${lesson}_T${theme}_V${version}_${canonicalPid}`,targetRaw=JSON.stringify(ledger),old=entryMap.get(targetKey);entryMap.set(targetKey,{key:targetKey,value:old?core.mergeValues(old.value,targetRaw):targetRaw,updatedAt:Date.now()});
  const existing=Math.max(0,...rows.map(r=>topicEvidence(r,lesson,theme)));legacyThemes.push({lesson,theme,targetLifetime,existing,adjustment:Math.max(0,targetLifetime-existing),repeatBonus,branches:branches.length,sourceLedgers:sources.length})
 }
 const mergedMap=core.buildMap(entryMap),baseEvidence=Math.max(0,...rows.map(calc)),adjustment=legacyThemes.reduce((s,t)=>s+t.adjustment,0),adjustedEvidence=baseEvidence+adjustment,ranking=rankingById.get(canonical)||{},floor=Math.max(studentPoints(student),stored(ranking),...rows.map(stored),0),finalPoints=Math.max(floor,adjustedEvidence),aliases=uniq([...idsFor(student),...rows.flatMap(relatedIds)]),stamp={version:2,at:new Date().toISOString(),sources:rows.map(r=>r.id),themes:legacyThemes,baseEvidence,adjustedEvidence,preservedFloor:floor,finalPoints,cloudKnownOnly:true};
 const ts=window.firebase.firestore.FieldValue.serverTimestamp();
 await database.collection('progress').doc(canonical).set({clientProgressStateV1:mergedMap,clientProgressStateVersion:9,clientProgressNonDestructive:true,clientProgressAuthorityVersion:5,clientProgressAuthorityMode:'teacher-one-time-legacy-device-merge-v2',clientProgressStateUpdatedAt:ts,canonicalStudentId:canonical,studentId:canonical,userId:canonical,docId:canonical,aliasIds:aliases,ranking:{points:finalPoints},totals:{points:finalPoints},pointsTotal:finalPoints,lifetimePoints:finalPoints,punkteGesamt:finalPoints,metadata:{legacyDeviceMergeV2:stamp},updatedAt:ts},{merge:true});
 await database.collection('students').doc(canonical).set({canonicalStudentId:canonical,studentId:canonical,userId:canonical,docId:canonical,aliasIds:aliases,rankingPoints:Math.max(point(student.rankingPoints),finalPoints),pointsTotal:Math.max(point(student.pointsTotal),finalPoints),lifetimePoints:Math.max(point(student.lifetimePoints),finalPoints),punkteGesamt:Math.max(point(student.punkteGesamt),finalPoints),points:Math.max(point(student.points),finalPoints),ranking:{...(student.ranking||{}),points:Math.max(point(student.ranking?.points),finalPoints)},totals:{...(student.totals||{}),points:Math.max(point(student.totals?.points),finalPoints)},legacyDeviceMergeVersion:2,updatedAt:ts},{merge:true});
 await database.collection('studentRankings').doc(canonical).set({studentId:canonical,displayName:studentName(student),courseKey:studentCourse(student),courseCode:studentCourse(student),points:Math.max(point(ranking.points),finalPoints),legacyDeviceMergeVersion:2,updatedAt:ts},{merge:true});
 return{ok:true,canonical,rows:rows.length,themes:legacyThemes.length,repeatBonus:legacyThemes.reduce((s,t)=>s+t.repeatBonus,0),before:floor,after:finalPoints,adjustedEvidence}
}
async function runLegacyDeviceMerge(){
 if(legacyMergeRunning)return;const button=document.querySelector('[data-run-legacy-device-merge]'),status=document.querySelector('[data-legacy-device-result]'),students=state()?.students||[];if(!students.length){if(status)status.textContent='Keine Teilnehmenden geladen.';return}if(!confirm(`Einmalige Altgeräte-Zusammenführung für ${students.length} Teilnehmende starten? Es werden keine Punkte gesenkt.`))return;
 legacyMergeRunning=true;if(button)button.disabled=true;if(status)status.textContent='Zusammenführung läuft …';let done=0,changed=0,failed=0,bonus=0;
 try{for(const student of students){try{const r=await mergeOneStudent(student);done++;if(r?.ok){if(r.after>r.before||r.themes>0)changed++;bonus+=point(r.repeatBonus)}else failed++}catch(error){failed++;console.warn('Altgeräte-Zusammenführung fehlgeschlagen',studentName(student),error)}if(status)status.textContent=`${done}/${students.length} geprüft · ${changed} mit zusammengeführten Cloud-Ständen · Fehler ${failed}`};await loadRankings(true);if(status)status.textContent=`Fertig: ${done} geprüft · ${changed} mit zusammengeführten Cloud-Ständen · erkennbare Wiederholungs-Zusatzpunkte ${bonus} · Fehler ${failed}. Nur bereits in Firebase vorhandene Altstände konnten berücksichtigt werden.`}finally{legacyMergeRunning=false;if(button){button.disabled=false;button.textContent='Einmalige Zusammenführung erneut prüfen'}}
}

const observer=new MutationObserver(()=>decorate());observer.observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',e=>{if(e.target?.closest?.('#refreshBtn,[onclick*="SPTeacherDashboard.refresh"]'))setTimeout(()=>loadRankings(true),450)});
window.addEventListener('SP_RANKING_ROSTER_BACKFILLED',()=>loadRankings(true));window.addEventListener('SP_B1_POINTS_RECALCULATED',()=>loadRankings(true));
[250,600,1200,2200,4000].forEach(delay=>setTimeout(()=>{decorate();loadRankings(delay>=1200)},delay));
window.SPTeacherPointsDashboard={loadRankings,studentPoints,decorate,runLegacyDeviceMerge,mergeOneStudent};
})();