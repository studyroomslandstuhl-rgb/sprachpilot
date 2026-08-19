import { db, doc, getDoc, getDocFromServer, setDoc, collection, query, where, getDocs, getDocsFromServer, limit, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
import { logoutSecureStudent } from '/js/student-identity.js?v=identity5';
import { loadCourseRelease, themeOpen } from '/js/course-releases.js?v=release-core-20260701b';
import '/shared/points-recalculator.js?v=1';

const $=id=>document.getElementById(id);
const CACHE='SP_STUDENT_DASHBOARD_LITE_V3';
const POINT_MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const RANKING_COLLECTION='studentRankings';
const RANKING_VERSION=1;
let ownProgress={},roster=[],statsBusy=false,rankingBusy=false;
let releaseData=readJSON('SP_COURSE_RELEASES',null)||profile().assignments||{};

function readJSON(k,f=null){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
function point(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function clean(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function esc(s){return String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function withTimeout(p,ms){return Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))])}
function profile(){return getActiveProfile()||readJSON('SP_USER_PROFILE',readJSON('SP_STUDENT_PROFILE',{}))||{}}
function course(p=profile()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||p.courseDocId||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function courseKey(p=profile()){return String(p.courseDocId||p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function name(r=profile()){return [r.vorname||r.firstName||r.name,r.nachname||r.lastName].filter(Boolean).join(' ').trim()||r.studentName||r.displayName||r.email||'Schüler/in'}
function rankingName(r=profile()){return [r.vorname||r.firstName||r.name,r.nachname||r.lastName].filter(Boolean).join(' ').trim()||r.studentName||r.displayName||'Schüler/in'}
function ids(r=profile()){
 const c=course(r)||'kurs',mail=String(r.email||'').trim().toLowerCase(),fallback=clean(c+'_'+(mail||r.vorname||r.firstName||'student'));
 return uniq([r.canonicalStudentId,r.docId,r.studentId,r.userId,r.id,...(Array.isArray(r.aliasIds)?r.aliasIds:[]),localStorage.getItem('SP_STUDENT_ID'),fallback]);
}
function canonicalId(r=profile()){return String(r.canonicalStudentId||r.docId||r.studentId||r.userId||localStorage.getItem('SP_STUDENT_ID')||ids(r)[0]||'').trim()}
function storedPoints(r={}){return Math.max(point(r.rankingPoints),point(r.ranking?.points),point(r.totals?.points),point(r.pointsTotal),point(r.lifetimePoints),point(r.punkteGesamt),point(r.points))}
function technicalFor(r={},module){let best=0;for(const t of Object.values(r?.[module]||{})){if(t&&typeof t==='object'&&t.technicalRecovery===true)best=Math.max(best,point(t?.lifetime?.points))}if(module==='verben')best=Math.max(best,point(r?.metadata?.pointRecovery?.verbenApplied));return best}
function groupFor(r={},module){const key=module==='verben'?'verbenGroups':module==='perfekt'?'perfektGroups':'';if(!key)return 0;let total=0;for(const g of Object.values(r?.metadata?.[key]||{})){try{total+=point(window.SPPointRecalculator?.groupPoints?.(g)?.points)}catch(e){}}return total}
function evidencePoints(r={}){let calc={breakdown:{}};try{calc=window.SPPointRecalculator?.calculate?.(r)||calc}catch(e){}let total=0;for(const module of POINT_MODULES){const base=point(calc.breakdown?.[module]),groups=groupFor(r,module),technical=technicalFor(r,module);total+=groups>0?Math.max(base,groups):base+technical}total+=point(calc.breakdown?.finnischVerben);return total}
function recoverablePoints(r={}){return Math.max(storedPoints(r),evidencePoints(r))}
function taskPct(t={}){const total=Number(t.total||0),done=Array.isArray(t.done)?new Set(t.done.map(Number)).size:Number(t.done||0);return Math.max(clamp(t.percent??t.progress??0),t.completed?100:0,total>0?clamp(done/total*100):0)}
function topicPct(t={}){const tasks=Object.values(t.tasks||{}).filter(x=>x&&typeof x==='object');if(tasks.length)return clamp(tasks.reduce((s,x)=>s+taskPct(x),0)/tasks.length);return Math.max(clamp(t.progressPercent??t.current?.percent??0),t.completed===true?100:0)}
function isTopic(t){return !!(t&&typeof t==='object'&&!Array.isArray(t)&&(t.tasks||t.exam||t.current||t.lifetime||t.progressPercent!=null||t.lesson||t.theme||t.title))}
function topicRef(key,t={}){
 const lessonRaw=String(t.lesson??t.lektion??'');
 const themeRaw=String(t.theme??t.thema??'');
 const text=[key,t.topicId,t.themeId,t.title,lessonRaw,themeRaw].filter(Boolean).join(' ');
 const lm=lessonRaw.match(/\d+/)||text.match(/(?:a1[-_ ]*)?lektion[-_ ]*(\d+)/i)||text.match(/(?:^|[-_ ])l(\d+)(?=[-_ ]|$)/i);
 const tm=themeRaw.match(/\d+/)||text.match(/thema[-_ ]*(\d+)/i)||text.match(/(?:^|[-_ ])t(\d+)(?=[-_ ]|$)/i);
 const lesson=Number(Array.isArray(lm)?(lm[1]||lm[0]):0)||0;
 const theme=Number(Array.isArray(tm)?(tm[1]||tm[0]):0)||0;
 if(!lesson||!theme)return null;
 return{lesson:`A1-Lektion-${lesson}`,theme:`Thema-${theme}`,sig:`${lesson}|${theme}`,lessonNo:lesson,themeNo:theme};
}
function strongerTopic(a={},b={}){return topicPct(a)>=topicPct(b)?a:b}
function mergeRuns(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=Math.max(point(a?.[k]),point(b?.[k]));return out}
function mergeTaskRuns(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=mergeRuns(a?.[k]||{},b?.[k]||{});return out}
function mergeProgress(a={},b={}){
 const out={...b,...a},wa={...(b.wortschatz||{})};
 for(const[k,t]of Object.entries(a.wortschatz||{})){if(!isTopic(t)){if(!(k in wa))wa[k]=t;continue}const ref=topicRef(k,t),existingKey=ref?Object.keys(wa).find(x=>isTopic(wa[x])&&topicRef(x,wa[x])?.sig===ref.sig):null;if(existingKey){const weak=wa[existingKey]||{},strong=strongerTopic(t,weak),other=strong===t?weak:t,strongLife=strong.lifetime||{},otherLife=other.lifetime||{};wa[existingKey]={...other,...strong,lifetime:{...otherLife,...strongLife,taskPointRuns:mergeTaskRuns(otherLife.taskPointRuns||{},strongLife.taskPointRuns||{}),examPointRuns:mergeRuns(otherLife.examPointRuns||{},strongLife.examPointRuns||{}),points:Math.max(point(otherLife.points),point(strongLife.points))}}}else wa[k]=t}
 out.wortschatz=wa;out.metadata={...(b.metadata||{}),...(a.metadata||{})};for(const m of ['verben','perfekt','fragen','grammatik'])out[m]={...(b[m]||{}),...(a[m]||{})};out.ranking={...(b.ranking||{}),...(a.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};out.totals={...(b.totals||{}),...(a.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};out.pointsTotal=Math.max(point(a.pointsTotal),point(b.pointsTotal));out.lifetimePoints=Math.max(point(a.lifetimePoints),point(b.lifetimePoints));out.punkteGesamt=Math.max(point(a.punkteGesamt),point(b.punkteGesamt));return out
}
function hasReleaseData(d){return !!(d&&typeof d==='object'&&(d.enabledThemes||d.enabledTasks||d.releases||d.releaseMode||d.defaultLocked!==undefined))}
function parseReleaseKey(key){const text=String(key||'');const lm=text.match(/A1-Lektion-(\d+)/i),tm=text.match(/Thema-(\d+)/i);if(!lm||!tm)return null;return{lesson:`A1-Lektion-${Number(lm[1])}`,theme:`Thema-${Number(tm[1])}`,sig:`${Number(lm[1])}|${Number(tm[1])}`}}
function releasedThemeRefs(){const map=new Map();for(const[k,v]of Object.entries(releaseData?.enabledThemes||{})){if(v!==true)continue;const ref=parseReleaseKey(k);if(ref)map.set(ref.sig,ref)}for(const[k,v]of Object.entries(releaseData?.enabledTasks||{})){if(v!==true)continue;const ref=parseReleaseKey(k);if(ref)map.set(ref.sig,ref)}for(const alias of ['Wortschatz','wortschatz']){const lessons=releaseData?.releases?.[alias]?.lessons||{};for(const[lessonKey,lessonData]of Object.entries(lessons)){for(const[themeKey,themeData]of Object.entries(lessonData?.themes||{})){if(themeData?.enabled!==true)continue;const ref=parseReleaseKey(`${lessonKey}/${themeKey}`);if(ref)map.set(ref.sig,ref)}}}return map}
function progressThemeMap(r={}){const map=new Map();for(const[k,t]of Object.entries(r.wortschatz||{})){if(!isTopic(t)||t.technicalRecovery===true)continue;const ref=topicRef(k,t);if(!ref)continue;const old=map.get(ref.sig);map.set(ref.sig,{ref,topic:old?strongerTopic(t,old.topic):t})}return map}
function refIsReleased(ref){if(!ref)return false;if(!hasReleaseData(releaseData))return true;try{return themeOpen(releaseData,'Wortschatz',ref.lesson,ref.theme)}catch(e){return false}}
function learningTopics(r={}){const progress=progressThemeMap(r),released=releasedThemeRefs(),out=[];if(released.size){for(const ref of released.values())out.push({ref,topic:progress.get(ref.sig)?.topic||{}});return out}for(const item of progress.values())if(refIsReleased(item.ref))out.push(item);return out}
function starsTotal(r={}){let total=0;const seenW=new Set();for(const[k,t]of Object.entries(r.wortschatz||{})){if(!isTopic(t))continue;const ref=topicRef(k,t),sig=ref?.sig||clean(k);if(seenW.has(sig))continue;seenW.add(sig);total+=point(t.exam?.stars)}for(const mod of ['fragen','verben','perfekt','grammatik'])for(const t of Object.values(r[mod]||{}))if(isTopic(t))total+=point(t.exam?.stars);return total}
function stats(r={}){const list=learningTopics(r),avg=list.length?clamp(list.reduce((s,x)=>s+topicPct(x.topic),0)/list.length):0,done=list.filter(x=>topicPct(x.topic)>=100).length;return{avg,done,totalThemes:list.length,points:Math.max(recoverablePoints(r),point(localStorage.getItem('SP_POINTS_TOTAL'))),stars:starsTotal(r)}}
function renderStats(s,cache=true,source='server'){const p=profile();$('userPill').textContent=name(p)+(course(p)?' · '+course(p):'');$('totalCircle').style.setProperty('--p',s.avg||0);$('totalCircle').innerHTML='<span>'+Number(s.avg||0)+'%</span>';$('totalFill').style.width=Number(s.avg||0)+'%';$('summaryText').textContent=s.totalThemes?`${s.done} von ${s.totalThemes} freigegebenen Themen fertig`:'Noch keine Themen freigegeben.';$('pointsTotal').textContent=Number(s.points||0);$('starsTotal').textContent=Number(s.stars||0);$('doneTotal').textContent=Number(s.done||0);$('lastUpdated').textContent=source==='cache'?'Letzter lokaler Stand – Server wird erneut versucht.':'Serverstand: '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});if(cache){try{localStorage.setItem(CACHE,JSON.stringify(s));localStorage.setItem('SP_POINTS_TOTAL',String(s.points||0));localStorage.setItem('SP_DASHBOARD_LAST_SERVER',new Date().toISOString())}catch(e){}}}
async function serverDoc(ref){try{return await getDocFromServer(ref)}catch(e){return getDoc(ref)}}
async function serverDocs(ref){try{return await getDocsFromServer(ref)}catch(e){return getDocs(ref)}}
async function directProgress(id){try{const s=await serverDoc(doc(db,'progress',id));return s.exists()?s.data()||{}:null}catch(e){return null}}
async function ownLoad(){
 const candidates=ids(profile()).slice(0,30),first=await withTimeout(Promise.all(candidates.map(directProgress)),12000).catch(()=>[]);let merged={};
 for(const r of first)if(r)merged=mergeProgress(r,merged);
 return merged;
}
async function mirrorRanking(total){
 const p=profile(),id=canonicalId(p),uid=String(p.authUid||'').trim(),key=courseKey(p);
 if(!id||!uid||!key)return;
 const payload={studentId:id,authUid:uid,displayName:rankingName(p),courseKey:key,points:point(total),version:RANKING_VERSION,updatedAt:serverTimestamp()};
 try{await setDoc(doc(db,RANKING_COLLECTION,id),payload,{merge:true})}catch(e){console.warn('Eigene Ranglistenzeile konnte nicht aktualisiert werden',e)}
}
async function refreshOwn(){
 if(statsBusy)return;statsBusy=true;
 try{const r=await ownLoad();ownProgress=r&&Object.keys(r).length?r:{};const s=stats(ownProgress);renderStats(s,true,'server');await mirrorRanking(s.points)}
 catch(e){const cached=readJSON(CACHE,null);if(cached)renderStats(cached,false,'cache');else renderStats(stats(ownProgress),false,'cache')}
 finally{statsBusy=false}
}
function identity(r={}){return String(r.studentId||r.id||r.authUid||r.displayName||'').trim().toLowerCase()}
function mergeRanking(a={},b={}){return{...a,...b,studentId:a.studentId||b.studentId||a.id||b.id,displayName:a.displayName||b.displayName||'Schüler/in',points:Math.max(point(a.points),point(b.points))}}
function mergeRoster(rows){const map=new Map();for(const r of rows){const k=identity(r);if(!k)continue;map.set(k,map.has(k)?mergeRanking(map.get(k),r):r)}return [...map.values()]}
async function loadRoster(){
 const key=courseKey();if(!key)return[];
 try{const s=await withTimeout(serverDocs(query(collection(db,RANKING_COLLECTION),where('courseKey','==',key),limit(100))),10000);return mergeRoster(s.docs.map(d=>({...d.data(),id:d.id})))}catch(e){return[]}
}
function rankPoints(r={}){return point(r.points)}
function drawRoster(status=''){
 const p=profile(),current={studentId:canonicalId(p),authUid:p.authUid,displayName:rankingName(p),courseKey:courseKey(p),points:Math.max(recoverablePoints(ownProgress),point(localStorage.getItem('SP_POINTS_TOTAL')))};
 const rows=mergeRoster(roster.concat(current)).filter(r=>r.displayName).sort((a,b)=>rankPoints(b)-rankPoints(a)||String(a.displayName).localeCompare(String(b.displayName),'de')).slice(0,50);
 $('leaderboard').innerHTML=rows.length?rows.map((r,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(r.displayName||'Schüler/in')}</b></div><div class="points"><b>${rankPoints(r)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Teilnehmer gefunden.</div>';
 $('rankingStatus').textContent=status||('Serverstand '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}));
}
async function loadRanking(){if(rankingBusy)return;rankingBusy=true;try{$('rankingStatus').textContent='Rangliste wird vom Server geladen …';roster=await loadRoster();drawRoster()}catch(e){drawRoster('Serververbindung langsam · erneut versuchen')}finally{rankingBusy=false}}
function refresh(){refreshOwn();loadRanking()}
async function dashboardLogout(){
 const btn=$('logoutBtn');if(btn)btn.disabled=true;
 try{await logoutSecureStudent();location.href='/index.html'}catch(error){console.error('Sichere Abmeldung fehlgeschlagen',error);if(btn)btn.disabled=false;try{alert('Abmeldung konnte nicht vollständig abgeschlossen werden. Bitte erneut versuchen.')}catch(e){}}
}

$('rankingBtn')?.addEventListener('click',()=>loadRanking());
$('logoutBtn')?.addEventListener('click',dashboardLogout);
window.addEventListener('pageshow',()=>setTimeout(refresh,60));
window.addEventListener('online',()=>setTimeout(refresh,100));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(refresh,60)});
window.addEventListener('SP_POINT_DELTA_APPLIED',()=>setTimeout(refreshOwn,80));
const cached=readJSON(CACHE,null);if(cached)renderStats(cached,false,'cache');else renderStats({avg:0,done:0,totalThemes:0,points:point(localStorage.getItem('SP_POINTS_TOTAL')),stars:0},false,'cache');
refreshOwn();loadRanking();
loadCourseRelease(profile()).then(data=>{releaseData=data||releaseData;try{localStorage.setItem('SP_COURSE_RELEASES',JSON.stringify(releaseData||{}))}catch(e){};setTimeout(refreshOwn,50)}).catch(()=>{});
setInterval(refreshOwn,30000);
setInterval(loadRanking,60000);
