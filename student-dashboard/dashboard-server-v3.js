import { db, doc, getDocFromServer, setDoc, collection, query, where, getDocsFromServer, limit, serverTimestamp, onSnapshot } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { logoutSecureStudent } from '/js/student-identity.js?v=identity5';
import { loadCourseRelease, themeOpen, taskOpen } from '/js/course-releases.js?v=release-core-20260824a';
import '/shared/points-recalculator.js?v=20260822-dashboard5';
import '/shared/release-catalog-a1-l3-l7.js?v=1';

const $=id=>document.getElementById(id);
const RANKING_COLLECTION='studentRankings';
const RANKING_VERSION=6;
let releaseData=null,statsBusy=false,rankingBusy=false,lastServerStats=null,releaseUnsubscribe=null,releaseWatchId='';

function profile(){return getActiveProfile?.()||{} }
function uniq(values){return [...new Set((values||[]).filter(Boolean).map(v=>String(v).trim()).filter(Boolean))]}
function point(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function esc(v){return String(v||'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]))}
function canonicalId(p=profile()){return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||'').trim()}
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
function taskPct(task={}){return Math.max(clamp(task.percent??task.progress??0),task.completed===true?100:0)}
function topicPct(topic={}){
  const direct=Math.max(clamp(topic.progressPercent??topic.current?.percent??0),topic.completed===true?100:0);
  const tasks=Object.values(topic.tasks||{}).filter(t=>t&&typeof t==='object');
  if(!tasks.length)return direct;
  const average=clamp(tasks.reduce((sum,task)=>sum+taskPct(task),0)/tasks.length);
  return Math.max(direct,average);
}
function examWasCompleted(topic={}){
  const exam=topic.exam||{};
  return exam.completed===true||point(exam.attempts)>0||point(exam.bestPercent)>0||point(exam.percent)>0||point(exam.scorePercent)>0||point(exam.stars)>0;
}
function topicFinished(topic={}){
  const tasks=Object.values(topic.tasks||{}).filter(t=>t&&typeof t==='object');
  if(!tasks.length||!tasks.every(task=>task.completed===true||taskPct(task)>=100))return false;
  if(topicPct(topic)<100)return false;
  return examWasCompleted(topic);
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
function released(ref){if(!ref)return false;if(!releaseConfigured(releaseData))return false;try{return themeOpen(releaseData,'Wortschatz',ref.lesson,ref.theme)}catch(e){return false}}
function storedPoints(data={}){return Math.max(point(data.ranking?.points),point(data.totals?.points),point(data.pointsTotal),point(data.lifetimePoints),point(data.punkteGesamt),point(data.points))}
function calculatedPoints(data={}){try{return Math.max(0,Number(window.SPPointRecalculator?.calculate?.(data)?.total)||0)}catch(e){return 0}}
function topicSignature(module,key,topic={}){const ref=topicRef(key,topic);return `${module}|${ref?.sig||String(key)}`}
function canonicalTaskFile(value){
 const raw=String(value||'').trim();if(!raw)return'';
 try{const u=new URL(raw,'https://sprachpilot.invalid/'),base=decodeURIComponent(u.pathname.split('/').filter(Boolean).pop()||'');if(base.toLowerCase()==='task.html'&&u.searchParams.get('task'))return`task.html?task=${encodeURIComponent(u.searchParams.get('task'))}`;return base}catch(e){return raw.split('/').pop()||raw}
}
function taskMeta(entry){if(Array.isArray(entry))return{file:String(entry[0]||''),title:String(entry[1]||''),extra:entry[2]||{}};return{file:String(entry?.file||''),title:String(entry?.title||''),extra:entry||{}}}
function catalogThemes(){
 const lessons=window.SP_A1_RELEASE_CATALOG_L3_L7?.lessons||[],out=[];
 for(const lesson of lessons)for(const theme of lesson.themes||[])out.push({lesson:lesson.key,theme:theme.key,sig:`${Number(lesson.key.match(/\d+/)?.[0]||0)}|${Number(theme.key.match(/\d+/)?.[0]||0)}`,title:theme.title,tasks:theme.tasks||[]});
 return out
}
function explicitReleasedRefs(){
 const out=new Map();const add=(lesson,theme)=>{const l=String(lesson||''),t=String(theme||'');if(!/^A1-Lektion-\d+$/i.test(l)||!/^Thema-\d+$/i.test(t))return;const sig=`${Number(l.match(/\d+/)?.[0]||0)}|${Number(t.match(/\d+/)?.[0]||0)}`;out.set(sig,{lesson:l,theme:t,sig,title:`${l.replace('A1-','')} · ${t}`,tasks:[]})};
 for(const [key,value] of Object.entries(releaseData?.enabledThemes||{})){if(value!==true)continue;const m=String(key).match(/(A1-Lektion-\d+)\/(Thema-\d+)/i);if(m)add(m[1],m[2])}
 for(const moduleKey of ['wortschatz','Wortschatz'])for(const [lessonKey,lesson] of Object.entries(releaseData?.releases?.[moduleKey]?.lessons||{}))for(const [themeKey,theme] of Object.entries(lesson?.themes||{}))if(theme?.enabled===true)add(lessonKey,themeKey);
 return out
}
function releasedThemeCatalog(){
 const map=explicitReleasedRefs();
 for(const item of catalogThemes())if(released(item))map.set(item.sig,item);
 return [...map.values()].filter(item=>released(item))
}
function progressTopicMap(rows){
 const map=new Map();
 for(const row of rows)for(const [key,topic] of Object.entries(row.data?.wortschatz||{})){if(!topicLike(topic))continue;const ref=topicRef(key,topic);if(!ref)continue;const old=map.get(ref.sig);if(!old||topicPct(topic)>topicPct(old))map.set(ref.sig,topic)}
 return map
}
function taskRecord(topic,file){
 const canonical=canonicalTaskFile(file),tasks=topic?.tasks||{};
 if(tasks[file])return tasks[file];if(tasks[canonical])return tasks[canonical];
 for(const [key,value] of Object.entries(tasks))if(canonicalTaskFile(key)===canonical)return value;
 return null
}
function isExamMeta(meta){return meta.file==='__exam__'||meta.extra?.exam===true||/(pruefung|prüfung|exam)/i.test(meta.file)||/^Prüfung$/i.test(meta.title)}
function releasedTaskMetas(ref){
 const tasks=(ref.tasks||[]).map(taskMeta),practice=[];let examRequired=false;
 for(const meta of tasks){
  if(isExamMeta(meta)){
   const key=meta.file==='__exam__'?'__exam__':meta.file;
   try{if(taskOpen(releaseData,'Wortschatz',ref.lesson,ref.theme,key))examRequired=true}catch(e){examRequired=true}
   continue
  }
  let open=true;try{open=taskOpen(releaseData,'Wortschatz',ref.lesson,ref.theme,meta.file)}catch(e){}
  if(open)practice.push(meta)
 }
 return{practice,examRequired}
}
function strictThemeState(ref,topic){
 const {practice,examRequired}=releasedTaskMetas(ref);
 if(!topic){return{pct:0,finished:false}}
 if(!practice.length){const pct=topicPct(topic);return{pct,finished:pct>=100&&(!examRequired||examWasCompleted(topic))}}
 const values=practice.map(meta=>taskPct(taskRecord(topic,meta.file)||{}));
 const pct=clamp(values.reduce((sum,value)=>sum+value,0)/values.length);
 const finished=values.every(value=>value>=100)&&(!examRequired||examWasCompleted(topic));
 return{pct,finished}
}

async function readProgressRows(){
  const canonical=canonicalId();if(!canonical)throw new Error('STUDENT_ID_MISSING');
  const canonicalSnap=await getDocFromServer(doc(db,'progress',canonical));
  if(!canonicalSnap.exists())throw new Error('CANONICAL_PROGRESS_MISSING');
  return[{id:canonical,data:canonicalSnap.data()||{}}];
}
function statsFromRows(rows){
  const stars=new Map();let points=0;
  for(const row of rows){
    const data=row.data||{};points=Math.max(points,storedPoints(data),calculatedPoints(data));
    for(const module of ['wortschatz','fragen','verben','perfekt','grammatik']){
      for(const [key,topic] of Object.entries(data[module]||{})){
        if(!topicLike(topic))continue;const sig=topicSignature(module,key,topic),value=point(topic.exam?.stars);
        stars.set(sig,Math.max(stars.get(sig)||0,value));
      }
    }
  }
  const topics=progressTopicMap(rows),releasedThemes=releasedThemeCatalog();
  const states=releasedThemes.map(ref=>strictThemeState(ref,topics.get(ref.sig)||null));
  const avg=states.length?clamp(states.reduce((sum,item)=>sum+item.pct,0)/states.length):0;
  return{avg,done:states.filter(item=>item.finished).length,totalThemes:releasedThemes.length,activeThemes:[...topics.keys()].length,points,stars:[...stars.values()].reduce((sum,v)=>sum+v,0)};
}
function renderStats(stats){
  const p=profile(),key=primaryCourseKey(p);$('userPill').textContent=displayName(p)+(key?' · '+key:'');
  $('totalCircle').style.setProperty('--p',stats.avg||0);$('totalCircle').innerHTML='<span>'+Number(stats.avg||0)+'%</span>';
  $('totalFill').style.width=Number(stats.avg||0)+'%';
  $('summaryText').textContent=stats.totalThemes?`${stats.done} von ${stats.totalThemes} freigegebenen Themen fertig`:'Für diesen Kurs sind noch keine Themen freigegeben.';
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
async function refreshReleaseData(){
 try{const fresh=await loadCourseRelease(profile());if(fresh&&typeof fresh==='object')releaseData=fresh;installReleaseWatch();return releaseData}catch(error){console.warn('Kursfreigaben konnten nicht aktualisiert werden',error);return releaseData}
}
function installReleaseWatch(){
 const id=String(releaseData?.id||releaseData?.courseDocId||profile().courseDocId||'').trim();if(!id||id===releaseWatchId)return;
 try{releaseUnsubscribe?.()}catch(e){}releaseWatchId=id;
 try{
  releaseUnsubscribe=onSnapshot(doc(db,'courses',id),snap=>{
   if(!snap.exists())return;releaseData={...(snap.data()||{}),id:snap.id};
   try{localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(releaseData));localStorage.setItem('SP_RELEASE_SYNC_AT',String(Date.now()))}catch(e){}
   setTimeout(refreshOwn,30);
  },error=>console.warn('Live-Freigaben konnten nicht beobachtet werden',error));
 }catch(error){console.warn('Live-Freigabe-Verbindung konnte nicht gestartet werden',error)}
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
  await refreshReleaseData();
  const results=await Promise.allSettled([refreshOwn(),loadRanking()]);
  return results.every(r=>r.status==='fulfilled');
}
async function dashboardLogout(){
  const btn=$('logoutBtn');if(btn)btn.disabled=true;
  try{try{releaseUnsubscribe?.()}catch(e){}await logoutSecureStudent();location.href='/index.html'}catch(error){console.error('Sichere Abmeldung fehlgeschlagen',error);if(btn)btn.disabled=false}
}
async function init(){
  const key=primaryCourseKey();$('userPill').textContent=displayName(profile())+(key?` · ${key}`:'');
  $('rankingBtn')?.addEventListener('click',retryAll);$('logoutBtn')?.addEventListener('click',dashboardLogout);
  try{releaseData=await loadCourseRelease(profile())}catch(error){console.warn('Kursfreigaben konnten nicht geladen werden',error);releaseData=profile().assignments||null}
  installReleaseWatch();
  await mirrorRanking(profilePoints(profile()));
  await Promise.allSettled([refreshOwn(),loadRanking()]);
  window.addEventListener('online',retryAll);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')retryAll()});
  window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>setTimeout(refreshOwn,100));
  window.addEventListener('SP_L7_LIVE_SCORE_SYNCED',()=>setTimeout(retryAll,120));
  window.addEventListener('SP_SERVER_PROGRESS_RESET_APPLIED',()=>setTimeout(retryAll,120));
  window.addEventListener('SP_RELEASES_UPDATED',()=>setTimeout(retryAll,80));
  setInterval(refreshOwn,45000);setInterval(loadRanking,60000);setInterval(refreshReleaseData,90000);
}

window.SP_DASHBOARD_RETRY=retryAll;
await init();
