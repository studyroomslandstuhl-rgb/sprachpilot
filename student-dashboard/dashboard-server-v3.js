import { db, doc, getDocFromServer, setDoc, collection, query, where, getDocsFromServer, limit, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { logoutSecureStudent } from '/js/student-identity.js?v=identity5';
import { loadCourseRelease, themeOpen } from '/js/course-releases.js?v=release-core-20260701b';
import '/shared/points-recalculator.js?v=1';

const $=id=>document.getElementById(id);
const RANKING_COLLECTION='studentRankings';
const RANKING_VERSION=4;
let releaseData=null,statsBusy=false,rankingBusy=false,lastServerStats=null;

function profile(){return getActiveProfile?.()||{} }
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
function point(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function esc(v){return String(v||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]))}
function canonicalId(p=profile()){return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||'').trim()}
function aliasIds(p=profile()){const canonical=canonicalId(p);return uniq([...(Array.isArray(p.aliasIds)?p.aliasIds:[]),p.docId,p.studentId,p.userId]).filter(id=>id&&id!==canonical)}
function keyVariants(value){const raw=String(value||'').trim();return raw?[raw,raw.toLowerCase(),raw.toUpperCase()]:[]}
function courseKeys(p=profile()){
  return uniq([
    ...keyVariants(p.courseDocId),...keyVariants(p.courseCode),...keyVariants(p.kurs),...keyVariants(p.kursnummer),...keyVariants(p.course),
    ...keyVariants(localStorage.getItem('SP_COURSE_CODE'))
  ]);
}
function primaryCourseKey(p=profile()){return String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function displayName(p=profile()){return [p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ').trim()||p.studentName||p.displayName||p.email||'Schüler/in'}
function profilePoints(p=profile()){return Math.max(point(p.rankingPoints),point(p.pointsTotal),point(p.lifetimePoints),point(p.punkteGesamt),point(p.points),point(p.ranking?.points),point(p.totals?.points))}
function topicPct(topic={}){
  const tasks=Object.values(topic.tasks||{}).filter(t=>t&&typeof t==='object');
  if(tasks.length){
    const values=tasks.map(task=>Math.max(clamp(task.percent??task.progress??0),task.completed===true?100:0));
    return clamp(values.reduce((sum,v)=>sum+v,0)/values.length);
  }
  return Math.max(clamp(topic.progressPercent??topic.current?.percent??0),topic.completed===true?100:0);
}
function topicRef(key,topic={}){
  const lessonRaw=String(topic.lesson??topic.lektion??''),themeRaw=String(topic.theme??topic.thema??'');
  const text=[key,topic.topicId,topic.themeId,topic.title,lessonRaw,themeRaw].filter(Boolean).join(' ');
  const lesson=Number((lessonRaw.match(/\d+/)||text.match(/(?:a1[-_ ]*)?lektion[-_ ]*(\d+)/i)||text.match(/(?:^|[-_ ])l(\d+)(?=[-_ ]|$)/i)||[])[1]||lessonRaw.match(/\d+/)?.[0]||0)||0;
  const theme=Number((themeRaw.match(/\d+/)||text.match(/thema[-_ ]*(\d+)/i)||text.match(/(?:^|[-_ ])t(\d+)(?=[-_ ]|$)/i)||[])[1]||themeRaw.match(/\d+/)?.[0]||0)||0;
  if(!lesson||!theme)return null;
  return{lesson:`A1-Lektion-${lesson}`,theme:`Thema-${theme}`,sig:`${lesson}|${theme}`};
}
function topicLike(topic){return !!(topic&&typeof topic==='object'&&!Array.isArray(topic)&&(topic.tasks||topic.exam||topic.current||topic.lifetime||topic.progressPercent!=null||topic.lesson||topic.theme||topic.title))}
function releaseConfigured(data){return !!(data&&typeof data==='object'&&(data.enabledThemes||data.enabledTasks||data.releases||data.releaseMode||data.defaultLocked!==undefined))}
function released(ref){if(!ref)return false;if(!releaseConfigured(releaseData))return true;try{return themeOpen(releaseData,'Wortschatz',ref.lesson,ref.theme)}catch(e){return true}}
function storedPoints(data={}){return Math.max(point(data.ranking?.points),point(data.totals?.points),point(data.pointsTotal),point(data.lifetimePoints),point(data.punkteGesamt),point(data.points))}
function calculatedPoints(data={}){try{return Math.max(0,Number(window.SPPointRecalculator?.calculate?.(data)?.total)||0)}catch(e){return 0}}
function topicSignature(module,key,topic={}){const ref=topicRef(key,topic);return `${module}|${ref?.sig||String(key)}`}

async function readProgressRows(){
  const p=profile(),canonical=canonicalId(p);if(!canonical)throw new Error('STUDENT_ID_MISSING');
  const rows=[];
  const canonicalSnap=await getDocFromServer(doc(db,'progress',canonical));
  if(canonicalSnap.exists())rows.push({id:canonical,data:canonicalSnap.data()||{}});
  for(const id of aliasIds(p).slice(0,25)){
    try{const snap=await getDocFromServer(doc(db,'progress',id));if(snap.exists())rows.push({id,data:snap.data()||{}})}catch(error){console.warn('Historischer Fortschritts-Alias im Dashboard übersprungen',id,error)}
  }
  if(!rows.length)throw new Error('CANONICAL_PROGRESS_MISSING');
  return rows;
}
function statsFromRows(rows){
  const topics=new Map(),stars=new Map();let points=0;
  for(const row of rows){
    const data=row.data||{};points=Math.max(points,storedPoints(data),calculatedPoints(data));
    for(const [key,topic] of Object.entries(data.wortschatz||{})){
      if(!topicLike(topic))continue;const ref=topicRef(key,topic);if(!ref||!released(ref))continue;
      const pct=topicPct(topic),old=topics.get(ref.sig);if(!old||pct>old.pct)topics.set(ref.sig,{pct,ref});
    }
    for(const module of ['wortschatz','fragen','verben','perfekt','grammatik']){
      for(const [key,topic] of Object.entries(data[module]||{})){
        if(!topicLike(topic))continue;const sig=topicSignature(module,key,topic),value=point(topic.exam?.stars);
        stars.set(sig,Math.max(stars.get(sig)||0,value));
      }
    }
  }
  const list=[...topics.values()],avg=list.length?clamp(list.reduce((sum,item)=>sum+item.pct,0)/list.length):0;
  return{avg,done:list.filter(item=>item.pct>=100).length,totalThemes:list.length,points,stars:[...stars.values()].reduce((sum,v)=>sum+v,0)};
}
function renderStats(stats){
  const p=profile(),key=primaryCourseKey(p);$('userPill').textContent=displayName(p)+(key?' · '+key:'');
  $('totalCircle').style.setProperty('--p',stats.avg||0);$('totalCircle').innerHTML='<span>'+Number(stats.avg||0)+'%</span>';
  $('totalFill').style.width=Number(stats.avg||0)+'%';
  $('summaryText').textContent=stats.totalThemes?`${stats.done} von ${stats.totalThemes} freigegebenen Themen fertig`:'Noch keine freigegebenen Themen mit Fortschritt.';
  $('pointsTotal').textContent=Number(stats.points||0);$('starsTotal').textContent=Number(stats.stars||0);$('doneTotal').textContent=Number(stats.done||0);
  $('lastUpdated').textContent='Firebase-Serverstand: '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});
}
async function mirrorRanking(points){
  const p=profile(),id=canonicalId(p),uid=String(p.authUid||'').trim(),key=primaryCourseKey(p);if(!id||!uid||!key)return false;
  let existingPoints=0;
  try{const snap=await getDocFromServer(doc(db,RANKING_COLLECTION,id));if(snap.exists())existingPoints=point(snap.data()?.points)}catch(e){}
  const payload={studentId:id,authUid:uid,displayName:displayName(p),courseKey:key,points:Math.max(point(points),profilePoints(p),existingPoints),version:RANKING_VERSION,updatedAt:serverTimestamp()};
  try{await setDoc(doc(db,RANKING_COLLECTION,id),payload,{merge:true});return true}catch(error){console.warn('Eigene Ranglistenzeile konnte nicht aktualisiert werden',error);return false}
}
async function refreshOwn(){
  if(statsBusy)return lastServerStats;statsBusy=true;
  try{
    const rows=await readProgressRows(),stats=statsFromRows(rows);lastServerStats=stats;renderStats(stats);await mirrorRanking(stats.points);return stats;
  }catch(error){
    console.error('Dashboard-Fortschritt konnte nicht vom Firebase-Server geladen werden',error);
    $('lastUpdated').textContent='Firebase-Serverstand konnte nicht geladen werden. Bitte erneut versuchen.';
    throw error;
  }finally{statsBusy=false}
}
async function loadRoster(){
  const keys=courseKeys();if(!keys.length)return[];
  const rows=[];
  for(const key of keys.slice(0,18)){
    try{
      const snap=await getDocsFromServer(query(collection(db,RANKING_COLLECTION),where('courseKey','==',key),limit(250)));
      snap.docs.forEach(d=>rows.push({...(d.data()||{}),id:d.id}));
    }catch(error){console.warn('Ranglisten-Abfrage für Kurskennung fehlgeschlagen',key,error)}
  }
  const byId=new Map();
  for(const row of rows){
    const id=String(row.studentId||row.id||row.authUid||'');if(!id)continue;
    const old=byId.get(id);
    if(!old||point(row.points)>point(old.points)||(!old.displayName&&row.displayName))byId.set(id,row);
  }
  return [...byId.values()];
}
function drawRoster(rows,status=''){
  const p=profile(),current={studentId:canonicalId(p),authUid:p.authUid,displayName:displayName(p),courseKey:primaryCourseKey(p),points:Math.max(point(lastServerStats?.points),profilePoints(p))};
  const map=new Map();for(const row of rows.concat(current)){const id=String(row.studentId||row.id||row.authUid||'');if(!id)continue;const old=map.get(id);if(!old||point(row.points)>point(old.points)||(!old.displayName&&row.displayName))map.set(id,row)}
  const sorted=[...map.values()].filter(r=>r.displayName).sort((a,b)=>point(b.points)-point(a.points)||String(a.displayName).localeCompare(String(b.displayName),'de')).slice(0,250);
  $('leaderboard').innerHTML=sorted.length?sorted.map((r,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(r.displayName)}</b></div><div class="points"><b>${point(r.points)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Teilnehmer gefunden.</div>';
  $('rankingStatus').textContent=status||(`${sorted.length} Teilnehmer · Firebase-Serverstand ${new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}`);
}
async function loadRanking(){
  if(rankingBusy)return;rankingBusy=true;$('rankingStatus').textContent='Rangliste wird vom Server geladen …';
  try{const rows=await loadRoster();drawRoster(rows,rows.length?`${rows.length} Teilnehmer geladen`:'Noch keine weiteren Ranglisteneinträge im Kurs')}
  catch(error){console.error('Rangliste konnte nicht vom Firebase-Server geladen werden',error);$('rankingStatus').textContent='Serverstand konnte nicht geladen werden'}
  finally{rankingBusy=false}
}
async function retryAll(){
  $('rankingStatus').textContent='Aktualisierung läuft …';
  const results=await Promise.allSettled([refreshOwn(),loadRanking()]);
  return results.every(r=>r.status==='fulfilled');
}
async function dashboardLogout(){
  const btn=$('logoutBtn');if(btn)btn.disabled=true;
  try{await logoutSecureStudent();location.href='/index.html'}catch(error){console.error('Sichere Abmeldung fehlgeschlagen',error);if(btn)btn.disabled=false}
}
async function init(){
  const key=primaryCourseKey();$('userPill').textContent=displayName(profile())+(key?` · ${key}`:'');
  $('rankingBtn')?.addEventListener('click',retryAll);$('logoutBtn')?.addEventListener('click',dashboardLogout);
  try{releaseData=await loadCourseRelease(profile())}catch(error){console.warn('Kursfreigaben konnten nicht geladen werden',error);releaseData=profile().assignments||null}
  await mirrorRanking(profilePoints(profile()));
  await Promise.allSettled([refreshOwn(),loadRanking()]);
  window.addEventListener('online',retryAll);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')retryAll()});
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>setTimeout(refreshOwn,100));
  setInterval(refreshOwn,45000);setInterval(loadRanking,60000);
}

window.SP_DASHBOARD_RETRY=retryAll;
await init();
