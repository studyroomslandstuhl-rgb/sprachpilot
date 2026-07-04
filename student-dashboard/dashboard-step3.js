import { db, doc, getDoc, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile, getActiveRole, logout } from '/js/auth.js';
import { loadCourseRelease, moduleOpen, themeOpen, taskOpen } from '/js/course-releases.js?v=release-core-20260701b';
import { startGlobalSync, refreshActiveProfileFromCloud, idCandidates } from '/js/global-sync.js?v=1';

const $=id=>document.getElementById(id);
const CATALOG=[
 {id:'wortschatz-a1-lektion-4-thema-1',module:'wortschatz',moduleTitle:'Wortschatz',lesson:'A1-Lektion-4',theme:'Thema-1',title:'A1 Lektion 4 · Thema 1',href:'/wortschatz/A1-Lektion-4/Thema-1/',key:'SP_L4_T1_V2',tasks:['karteikarten.html','hoeren.html','artikel-klick.html','artikel.html','plural.html','bild-wort.html','wort-bild.html','wo-ist.html','ist-hier.html','pruefung.html']},
 {id:'wortschatz-a1-lektion-4-thema-2',module:'wortschatz',moduleTitle:'Wortschatz',lesson:'A1-Lektion-4',theme:'Thema-2',title:'A1 Lektion 4 · Thema 2',href:'/wortschatz/A1-Lektion-4/Thema-2/',key:'SP_L4_T2_FINAL_V3',tasks:['karteikarten.html','hoeren.html','artikel-klick.html','artikel.html','plural.html','bild-wort.html','wort-bild.html','kategorien.html','dialoge.html','pruefung.html']},
 {id:'wortschatz-a1-lektion-4-thema-3',module:'wortschatz',moduleTitle:'Wortschatz',lesson:'A1-Lektion-4',theme:'Thema-3',title:'A1 Lektion 4 · Thema 3',href:'/wortschatz/A1-Lektion-4/Thema-3/',key:'SP_L4_T3_V2',tasks:['karteikarten.html','hoeren.html','farben.html','memory.html','gegenteile.html','kein.html','reaktionen.html','gefallen.html','saetze-bauen.html','schreiben.html','pruefung.html']},
 {id:'wortschatz-a1-lektion-5-thema-1',module:'wortschatz',moduleTitle:'Wortschatz',lesson:'A1-Lektion-5',theme:'Thema-1',title:'A1 Lektion 5 · Thema 1',href:'/wortschatz/A1-Lektion-5/Thema-1/',key:'SP_L5_T1_V1',tasks:['karteikarten.html','bild-wort.html','wort-bild.html','hoeren-schreiben.html','trennbare-verben.html','trennbare-verben-im-satz.html','marias-tag.html','was-machst-du-gern.html','ja-nein-fragen.html','verb-passt.html','pruefung.html']},
 {id:'wortschatz-a1-lektion-5-thema-2',module:'wortschatz',moduleTitle:'Wortschatz',lesson:'A1-Lektion-5',theme:'Thema-2',title:'A1 Lektion 5 · Thema 2',href:'/wortschatz/A1-Lektion-5/Thema-2/',key:'SP_L5_T2_V1',tasks:['karteikarten.html','artikel.html','plural.html','sehen-schreiben.html','hoeren-schreiben.html','sprechen.html','formell-informell.html','frage-antwort.html','schon-erst.html','pruefung.html']},
 {id:'fragen-a1',module:'fragen',moduleTitle:'Fragen',title:'Fragen A1',href:'/fragen-A1/',tasks:[]},
 {id:'verben-a1',module:'verben',moduleTitle:'Verben',title:'Verben A1',href:'/verben-A1/',tasks:[]}
];
let progressDoc={},releaseData={},dashboardItems=[];
function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
function esc(s){return String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function clamp(n){return Math.max(0,Math.min(100,Math.round(Number(n)||0)))}
function profile(){return getActiveProfile()||readJSON('SP_USER_PROFILE',readJSON('SP_STUDENT_PROFILE',null))||{}}
function courseCode(p=profile()){return p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'Kurs'}
function userName(p=profile()){return [p.firstName||p.vorname||p.name,p.lastName||p.nachname].filter(Boolean).join(' ')||p.displayName||p.email||'Schüler/in'}
function totalPoints(p=progressDoc){return Math.max(Number(p.totals?.points||0),Number(p.pointsTotal||0),Number(p.lifetimePoints||0),Number(p.punkteGesamt||0),Number(localStorage.getItem('SP_POINTS_TOTAL')||0))}
function topicKey(id){return String(id||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function hasReleaseData(d){return !!(d&&typeof d==='object'&&(d.enabledModules||d.enabledLessons||d.enabledThemes||d.enabledTasks||d.enabledWords||d.enabledSets||d.releases||d.releaseMode||d.defaultLocked!==undefined||d.verbenA1AssessmentEnabled!==undefined))}
function findCatalog(id){const k=topicKey(id);return CATALOG.find(x=>x.id===k||topicKey(x.title)===k)}
function progressTopic(item){return progressDoc[item.module]?.[item.id]||progressDoc[item.module]?.[topicKey(item.title)]||progressDoc[item.module]?.[item.title]||{} }
function isTopicRecord(v){return v&&typeof v==='object'&&!Array.isArray(v)&&(v.tasks||v.exam||v.current||v.lifetime||v.progressPercent||v.title)}
function releasedTaskFiles(item){if(!item.tasks?.length)return [];return item.tasks.filter(file=>{try{return taskOpen(releaseData,item.moduleTitle||item.module,item.lesson,item.theme,file)}catch(e){return false}})}
function isReleased(item){
  if(!hasReleaseData(releaseData))return false;
  if(item.module==='verben')return moduleOpen(releaseData,'Verben A1')||Object.keys(releaseData.enabledWords||{}).some(k=>releaseData.enabledWords[k]===true);
  if(item.module==='fragen')return moduleOpen(releaseData,'Fragen A1');
  try{return themeOpen(releaseData,item.moduleTitle||item.module,item.lesson,item.theme)}catch(e){return false}
}
function readTaskState(key,file){try{return JSON.parse(localStorage.getItem(key+'_'+file)||'null')}catch(e){return null}}
function localProgress(item){const files=releasedTaskFiles(item);if(!item.key||!files.length)return null;let sum=0,done=0,started=false;for(const file of files){const st=readTaskState(item.key,file);let pct=0;if(st&&Array.isArray(st.done)){started=true;const total=Number(st.total||0)||1;pct=clamp(st.done.length/total*100)}sum+=pct;if(pct>=100)done++}return started?{percent:clamp(sum/files.length),completedTasks:done,totalTasks:files.length,started:true}:null}
function taskAverageFromProgress(topic,files){
  const tasks=topic.tasks||{};
  const useFiles=(files&&files.length)?files:Object.keys(tasks);
  const vals=useFiles.map(f=>tasks[f]).filter(x=>x&&typeof x==='object');
  if(!useFiles.length||!vals.length)return null;
  const sum=useFiles.reduce((s,f)=>{const t=tasks[f]||{};return s+clamp(t.percent||(t.completed?100:0))},0);
  return {percent:clamp(sum/useFiles.length),completedTasks:useFiles.filter(f=>{const t=tasks[f]||{};return t.completed||Number(t.percent)>=100}).length,totalTasks:useFiles.length,started:vals.some(t=>t.started||Number(t.percent)>0)};
}
function repetitionNumber(topic,it){
  const lifetime=topic?.lifetime||it?.lifetime||{};
  const resets=Number(lifetime.resets||0);
  const finished=Number(lifetime.finishedRuns||lifetime.completedRuns||0);
  const run=Number(topic?.run||it?.run||lifetime.currentRun||resets+1||1)||1;
  return Math.max(1,finished,run);
}
function isMaxFinished(topic,it){
  const lifetime=topic?.lifetime||it?.lifetime||{};
  return lifetime.maxPointsCollected===true||Number(lifetime.finishedRuns||lifetime.completedRuns||0)>=3||repetitionNumber(topic,it)>=3;
}
function topicProgress(item){
  if(item.module==='verben')return verbProgress();
  const topic=progressTopic(item),files=releasedTaskFiles(item),local=localProgress(item);
  if(local)return {...item,...local,source:'local',exam:topic.exam||{},run:repetitionNumber(topic),lifetime:topic.lifetime||{},lastActiveAt:topic.lastActiveAt||topic.current?.updatedAt||topic.updatedAt||''};
  const fromTasks=taskAverageFromProgress(topic,files);
  let percent=clamp(topic.progressPercent||topic.current?.percent||topic.percent||0),completed=Number(topic.completedTasks||topic.current?.completedTasks||0)||0,total=files.length||Number(topic.totalTasks||topic.current?.totalTasks||0)||0;
  if(fromTasks){percent=fromTasks.percent;completed=fromTasks.completedTasks;total=fromTasks.totalTasks}
  else if(total&&completed&&percent>=100&&completed<total){percent=clamp(completed/total*100)}
  const exam=topic.exam||{};
  const started=percent>0||completed>0||!!topic.startedAt||!!topic.lastActiveAt||!!exam.attempted;
  return {...item,percent,completedTasks:completed,totalTasks:total,exam,started,lastActiveAt:topic.lastActiveAt||topic.current?.updatedAt||topic.updatedAt||'',run:repetitionNumber(topic),lifetime:topic.lifetime||{}};
}
function verbProgress(){const v=progressDoc.verben||{},st=v.state||{};const active=(v.activeVerbs||st.active||[]).length,known=(v.known||st.known||[]).length,unsure=(v.unsure||st.unsure||[]).length,unknown=(v.unknown||st.unknown||[]).length,assessed=(v.assessed||st.assessed||[]).length;const released=Object.keys(releaseData.enabledWords||{}).filter(k=>releaseData.enabledWords[k]===true).length;const percent=clamp(v.progress||v.progressPercent||0);const newVerbs=Math.max(0,released-assessed);return {...CATALOG.find(x=>x.id==='verben-a1'),percent,active,known,unsure,unknown,assessed,released,newVerbs,started:percent>0||active>0||known>0||assessed>0,lastActiveAt:v.updatedAt||'',completedTasks:known,totalTasks:Math.max(released,active+known+unsure+unknown),run:repetitionNumber(v),lifetime:v.lifetime||{}}}
function itemStatus(it){
  const examPct=clamp(it.exam?.bestPercent||it.exam?.percent||it.exam?.lastPercent||0);
  const examDone=it.module==='verben'?it.percent>=100:(examPct>=100||it.exam?.completed===true);
  const complete=it.percent>=100&&examDone;
  if(it.module==='verben'&&it.newVerbs>0)return {key:'neu',label:'Neue Verben',action:'Verben einschätzen',order:0};
  if(complete&&isMaxFinished(null,it))return {key:'done',label:'fertig',action:'Öffnen',order:4};
  if(complete){const n=Math.min(2,repetitionNumber(null,it));return {key:'repeat',label:n+'. Wiederholung',action:n+'. Wiederholung',order:3};}
  if(!it.started&&it.percent===0)return {key:'neu',label:'neu',action:'Starten',order:0};
  return {key:'active',label:'aktiv',action:'Weiterlernen',order:1};
}
function extractReleaseItems(map){Object.keys(releaseData.enabledThemes||{}).forEach(k=>{if(releaseData.enabledThemes[k]!==true)return;const m=String(k).match(/(A\d[- ]Lektion[- ]\d+)\/(Thema[- ]\d+)/i);if(!m)return;const lesson=m[1].replace(/ /g,'-'),theme=m[2].replace(/ /g,'-');const id=topicKey('wortschatz-'+lesson+'-'+theme);if(!map.has(id))map.set(id,{id,module:'wortschatz',moduleTitle:'Wortschatz',lesson,theme,title:lesson.replace(/-/g,' ')+' · '+theme.replace(/-/g,' '),href:'/wortschatz/'+lesson+'/'+theme+'/',tasks:[]})});const rel=releaseData.releases||{};Object.keys(rel).forEach(modKey=>{const mod=rel[modKey]||{};Object.keys(mod.lessons||{}).forEach(lesson=>{Object.keys(mod.lessons[lesson].themes||{}).forEach(theme=>{if(mod.lessons[lesson].themes[theme]?.enabled===false)return;const id=topicKey('wortschatz-'+lesson+'-'+theme);if(!map.has(id))map.set(id,{id,module:'wortschatz',moduleTitle:'Wortschatz',lesson,theme,title:String(lesson).replace(/-/g,' ')+' · '+String(theme).replace(/-/g,' '),href:'/wortschatz/'+lesson+'/'+theme+'/',tasks:[]})})})})}
function buildDashboardItems(){const map=new Map();CATALOG.forEach(item=>{if(isReleased(item))map.set(item.id,item)});Object.entries(progressDoc.wortschatz||{}).forEach(([id,t])=>{if(!isTopicRecord(t))return;const cat=findCatalog(id)||findCatalog(t.title);if(cat&&isReleased(cat))map.set(cat.id,cat);});extractReleaseItems(map);let items=[...map.values()].filter(isReleased).map(topicProgress);items=items.map(it=>({...it,status:itemStatus(it)}));items.sort((a,b)=>a.status.order-b.status.order||(a.status.key==='active'?String(b.lastActiveAt||'').localeCompare(String(a.lastActiveAt||'')):0)||a.title.localeCompare(b.title,'de'));return items}
function render(){dashboardItems=buildDashboardItems();const avg=dashboardItems.length?clamp(dashboardItems.reduce((s,x)=>s+x.percent,0)/dashboardItems.length):0,done=dashboardItems.filter(x=>x.status.key==='done').length;$('userPill').textContent=userName()+' · '+courseCode();$('totalCircle').style.setProperty('--p',avg);$('totalCircle').innerHTML='<span>'+avg+'%</span>';$('totalFill').style.width=avg+'%';$('summaryText').textContent=dashboardItems.length?done+' von '+dashboardItems.length+' freigegebenen Inhalten fertig':'Keine freigegebenen Inhalte gefunden.';$('pointsTotal').textContent=totalPoints();$('starsTotal').textContent=dashboardItems.reduce((s,x)=>s+Number(x.exam?.stars||0),0);$('doneTotal').textContent=done;$('contentCount').textContent=dashboardItems.length+' Inhalte';$('contentGrid').innerHTML=dashboardItems.length?dashboardItems.map(cardHtml).join(''):'<div class="empty">Noch keine freigegebenen Inhalte gefunden.</div>'}
function cardHtml(x){const cls=x.status.key==='done'?'done':x.status.key==='repeat'?'repeat':x.status.key==='neu'?'neu':'active';const sub=x.module==='verben'?`${x.active||0} aktiv · ${x.known||0} sicher · ${x.unsure||0} unsicher`:`${x.completedTasks||0}/${x.totalTasks||0} freigegebene Aufgaben`;return `<a class="topic ${cls}" href="${esc(x.href)}"><div class="topline"><div><h3>${esc(x.title)}</h3><div class="small">${esc(x.moduleTitle)} · ${esc(sub)}</div></div><div class="percent">${clamp(x.percent)}%</div></div><div class="bar"><div class="fill" style="width:${clamp(x.percent)}%"></div></div><div class="meta"><span class="badge">${esc(x.status.label)}</span>${x.exam?.attempted?`<span class="chip">Prüfung ${clamp(x.exam.bestPercent||x.exam.percent||x.exam.lastPercent)}%</span>`:''}</div><span class="openBtn">${esc(x.status.action)}</span></a>`}
async function loadProgress(){if(getActiveRole()==='student'){await startGlobalSync();await refreshActiveProfileFromCloud()}let snap=null;for(const id of idCandidates(profile())){try{const s=await getDoc(doc(db,'progress',id));if(s.exists()){snap=s;break}}catch(e){}}progressDoc=snap?snap.data()||{}:{};if(progressDoc.totals)localStorage.setItem('SP_POINTS_TOTAL',Number(progressDoc.totals.points||0));releaseData=await loadCourseRelease(profile()).catch(()=>readJSON('SP_COURSE_RELEASES',{}));render()}
function displayName(x){return [x.vorname||x.firstName||x.name,x.nachname||x.lastName].filter(Boolean).join(' ')||x.studentName||x.displayName||x.email||''}
function rankPoints(x){return Math.max(Number(x.ranking?.points||0),Number(x.totals?.points||0),Number(x.pointsTotal||0),Number(x.lifetimePoints||0),Number(x.punkteGesamt||0))}
function hasActivity(x){return rankPoints(x)>0||Number(x.verben?.progress||x.verben?.progressPercent||0)>0||Object.values(x.wortschatz||{}).some(isTopicRecord)||Object.values(x.fragen||{}).some(isTopicRecord)}
function realStudent(x){const name=String(displayName(x)||'').trim(),role=String(x.role||x.loginRole||'').toLowerCase();if(role==='teacher'||x.isTeacher===true||x.teacherPreview===true)return false;if(!name&&!x.email)return false;if(/^sch(ü|ue)ler\/?in$/i.test(name)||/^student$/i.test(name))return false;return hasActivity(x)}
async function queryRows(field,value){try{const s=await getDocs(query(collection(db,'progress'),where(field,'==',value),limit(60)));return s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){return []}}
async function loadRanking(){$('leaderboard').innerHTML='<div class="empty">Rangliste lädt …</div>';const c=courseCode();const rows=[...(await queryRows('kurs',c)),...(await queryRows('courseCode',c)),...(await queryRows('kursnummer',c))];const seen=new Map();rows.forEach(x=>{if(!seen.has(x.id))seen.set(x.id,x)});const list=[...seen.values()].filter(realStudent).sort((a,b)=>rankPoints(b)-rankPoints(a)).slice(0,20);$('leaderboard').innerHTML=list.length?list.map((x,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(displayName(x))}</b><div class="small">${esc(x.kurs||x.courseCode||x.kursnummer||c)}</div></div><div class="points"><b>${rankPoints(x)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Rangliste mit echten Schülern und Fortschritt.</div>'}
$('rankingBtn').addEventListener('click',loadRanking);$('logoutBtn').addEventListener('click',()=>logout());window.addEventListener('SP_PROFILE_SYNCED',()=>loadProgress());window.addEventListener('SP_PROGRESS_SYNCED',()=>loadProgress());await loadProgress();setTimeout(loadRanking,350);
