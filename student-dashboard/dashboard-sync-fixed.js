import { db, doc, getDoc, getDocFromServer, collection, query, where, getDocs, getDocsFromServer, limit } from '/js/firebase.js';
import { getActiveProfile, logout } from '/js/auth.js';
import '/shared/points-recalculator.js?v=1';

const $=id=>document.getElementById(id);
const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const DASH_CACHE='SP_STUDENT_DASHBOARD_CACHE_V2';
let progressDoc={},statsBusy=false,rankingBusy=false,refreshTimer=null,lastServerReadAt=0;

function readJSON(k,f=null){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
function esc(s){return String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function clamp(n){return Math.max(0,Math.min(100,Math.round(Number(n)||0)))}
function norm(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'')}
function cleanId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function profile(){return getActiveProfile()||readJSON('SP_USER_PROFILE',readJSON('SP_STUDENT_PROFILE',{}))||{}}
function courseCode(p=profile()){return p.courseCode||p.kurs||p.kursnummer||p.course||p.courseName||p.courseDocId||localStorage.getItem('SP_COURSE_CODE')||''}
function userName(p=profile()){return [p.firstName||p.vorname||p.name,p.lastName||p.nachname].filter(Boolean).join(' ')||p.displayName||p.studentName||p.email||'Schüler/in'}
function progressIds(p=profile()){const c=p.courseDocId||courseCode(p)||'kurs',mail=String(p.email||'').trim().toLowerCase(),fallback=cleanId(c+'_'+(mail||p.vorname||p.firstName||'student'));return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallback]).slice(0,7)}
function point(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0}
function storedPoints(r={}){return Math.max(point(r.ranking?.points),point(r.totals?.points),point(r.pointsTotal),point(r.lifetimePoints),point(r.punkteGesamt),point(r.points))}
function evidencePoints(r={}){try{return Math.max(0,Number(window.SPPointRecalculator?.calculate?.(r)?.total)||0)}catch(e){return 0}}
function totalPoints(r=progressDoc){return Math.max(storedPoints(r),evidencePoints(r),point(localStorage.getItem('SP_POINTS_TOTAL')))}
function isTopic(v){return !!(v&&typeof v==='object'&&!Array.isArray(v)&&(v.tasks||v.exam||v.current||v.lifetime||v.progressPercent!=null||v.title||v.lesson||v.theme))}
function taskPct(t={}){const total=Number(t.total||0),done=Array.isArray(t.done)?t.done.length:Number(t.done||0);return Math.max(clamp(t.percent??t.progress??0),t.completed?100:0,total>0?clamp(done/total*100):0)}
function mergeRuns(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=Math.max(point(a?.[k]),point(b?.[k]));return out}
function mergeTaskRunMaps(a={},b={}){const out={};for(const k of new Set([...Object.keys(a||{}),...Object.keys(b||{})]))out[k]=mergeRuns(a?.[k]||{},b?.[k]||{});return out}
function mergeTask(a={},b={}){const pa=taskPct(a),pb=taskPct(b),strong=pa>=pb?a:b,weak=strong===a?b:a;return{...weak,...strong,percent:Math.max(pa,pb),completed:!!(a.completed||b.completed||pa>=100||pb>=100),done:Math.max(Number(a.done||0),Number(b.done||0)),total:Math.max(Number(a.total||0),Number(b.total||0)),points:Math.max(Number(a.points||0),Number(b.points||0)),pointsByRun:mergeRuns(a.pointsByRun||{},b.pointsByRun||{})}}
function topicPct(t={}){const vals=Object.values(t.tasks||{}).filter(v=>v&&typeof v==='object');if(vals.length)return clamp(vals.reduce((s,x)=>s+taskPct(x),0)/vals.length);return Math.max(clamp(t.progressPercent??t.current?.percent??0),t.completed===true?100:0)}
function mergeTopic(a={},b={}){const pa=topicPct(a),pb=topicPct(b),strong=pa>=pb?a:b,weak=strong===a?b:a,out={...weak,...strong},tasks={...(weak.tasks||{})};for(const[k,v]of Object.entries(strong.tasks||{}))tasks[k]=mergeTask(tasks[k]||{},v||{});out.tasks=tasks;const pct=Math.max(pa,pb,topicPct(out));out.progressPercent=pct;out.current={...(weak.current||{}),...(strong.current||{}),percent:pct};const ae=a.exam||{},be=b.exam||{};out.exam={...be,...ae,bestPercent:Math.max(Number(ae.bestPercent||ae.percent||0),Number(be.bestPercent||be.percent||0)),percent:Math.max(Number(ae.percent||0),Number(be.percent||0)),stars:Math.max(Number(ae.stars||0),Number(be.stars||0)),attempted:!!(ae.attempted||be.attempted),completed:!!(ae.completed||be.completed)};const al=a.lifetime||{},bl=b.lifetime||{};out.lifetime={...bl,...al,points:Math.max(Number(al.points||0),Number(bl.points||0)),taskPointRuns:mergeTaskRunMaps(al.taskPointRuns||{},bl.taskPointRuns||{}),examPointRuns:mergeRuns(al.examPointRuns||{},bl.examPointRuns||{})};return out}
function mergeProgress(a={},b={}){const out={...b,...a};for(const m of MODULES){const mod={...(b[m]||{})};for(const[k,v]of Object.entries(a[m]||{})){if(isTopic(v))mod[k]=mergeTopic(v,mod[k]||{});else if(!(k in mod))mod[k]=v}out[m]=mod}out.metadata={...(b.metadata||{}),...(a.metadata||{})};out.ranking={...(b.ranking||{}),...(a.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};out.totals={...(b.totals||{}),...(a.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};out.pointsTotal=Math.max(point(a.pointsTotal),point(b.pointsTotal));out.lifetimePoints=Math.max(point(a.lifetimePoints),point(b.lifetimePoints));out.punkteGesamt=Math.max(point(a.punkteGesamt),point(b.punkteGesamt));return out}
function withTimeout(promise,ms,label='Zeitüberschreitung'){return Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error(label)),ms))])}
async function serverDoc(ref){try{return await getDocFromServer(ref)}catch(serverError){console.warn('Server-Lesen fehlgeschlagen, Firestore-Fallback wird versucht',serverError);return getDoc(ref)}}
async function serverDocs(q){try{return await getDocsFromServer(q)}catch(serverError){console.warn('Server-Abfrage fehlgeschlagen, Firestore-Fallback wird versucht',serverError);return getDocs(q)}}

async function readOwnProgress(){
 const p=profile(),jobs=progressIds(p).map(async id=>{try{const s=await serverDoc(doc(db,'progress',id));return s.exists()?s.data()||{}:null}catch(e){return null}});
 const mail=String(p.email||'').trim().toLowerCase();
 if(mail)jobs.push((async()=>{try{const s=await serverDocs(query(collection(db,'progress'),where('email','==',mail),limit(20)));let merged={};for(const d of s.docs)merged=mergeProgress(d.data()||{},merged);return merged}catch(e){return null}})());
 const rows=await withTimeout(Promise.all(jobs),12000,'Eigener Fortschritt lädt zu lange');
 let merged={};for(const row of rows)if(row)merged=mergeProgress(row,merged);lastServerReadAt=Date.now();return merged;
}
function topicSignature(key,t={}){const lesson=String(t.lesson||t.lektion||'').match(/\d+/)?.[0]||'',theme=String(t.theme||t.thema||'').match(/\d+/)?.[0]||'';if(lesson||theme)return `${lesson}|${theme}`;return cleanId(t.topicId||t.themeId||key)}
function wortschatzTopics(r={}){const map=new Map();for(const[k,t]of Object.entries(r.wortschatz||{})){if(!isTopic(t)||t.technicalRecovery===true)continue;const sig=topicSignature(k,t),old=map.get(sig);if(!old||topicPct(t)>topicPct(old))map.set(sig,t)}return [...map.values()]}
function allStars(r={}){let total=0;for(const m of MODULES){for(const t of Object.values(r[m]||{})){if(isTopic(t))total+=Math.max(0,Number(t.exam?.stars||0))}}return total}
function statsFrom(r={}){const topics=wortschatzTopics(r),started=topics.filter(t=>topicPct(t)>0||Object.keys(t.tasks||{}).length||t.exam?.attempted),avg=started.length?clamp(started.reduce((s,t)=>s+topicPct(t),0)/started.length):0,done=topics.filter(t=>topicPct(t)>=100).length;return{avg,done,totalThemes:topics.length,points:totalPoints(r),stars:allStars(r)}}
function renderStats(data,save=true,source='server'){const p=profile();$('userPill').textContent=userName(p)+(courseCode(p)?' · '+courseCode(p):'');$('totalCircle').style.setProperty('--p',data.avg||0);$('totalCircle').innerHTML='<span>'+Number(data.avg||0)+'%</span>';$('totalFill').style.width=Number(data.avg||0)+'%';$('summaryText').textContent=data.totalThemes?`${data.done} von ${data.totalThemes} Themen fertig`:'Noch kein Themenfortschritt gespeichert.';$('pointsTotal').textContent=Number(data.points||0);$('starsTotal').textContent=Number(data.stars||0);$('doneTotal').textContent=Number(data.done||0);$('lastUpdated').textContent=source==='cache'?'Letzter gespeicherter Stand – Server wird erneut versucht.':'Aktualisiert vom Server: '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});if(save){try{localStorage.setItem(DASH_CACHE,JSON.stringify(data));localStorage.setItem('SP_POINTS_TOTAL',String(data.points||0));localStorage.setItem('SP_DASHBOARD_LAST_SERVER',new Date().toISOString())}catch(e){}}}
async function refreshStats(){if(statsBusy)return;statsBusy=true;try{const r=await readOwnProgress();progressDoc=r&&Object.keys(r).length?r:{};renderStats(statsFrom(progressDoc),true,'server')}catch(error){console.warn('Dashboard-Lernstand konnte nicht aktualisiert werden',error);const cached=readJSON(DASH_CACHE,null);if(cached)renderStats(cached,false,'cache');else renderStats(statsFrom(progressDoc),false,'cache')}finally{statsBusy=false}}

function displayName(x={}){return [x.vorname||x.firstName||x.name,x.nachname||x.lastName].filter(Boolean).join(' ')||x.studentName||x.displayName||x.email||'Schüler/in'}
function identity(x={}){return String(x.email||'').trim().toLowerCase()||String(x.studentId||x.userId||x.uid||x.canonicalStudentId||x.id||displayName(x)).trim().toLowerCase()}
function mergePerson(a={},b={}){const out={...a,...b};out.studentName=a.studentName||b.studentName||displayName(out);out.email=a.email||b.email||'';out.ranking={...(a.ranking||{}),...(b.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};out.totals={...(a.totals||{}),...(b.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};out.pointsTotal=Math.max(point(a.pointsTotal),point(b.pointsTotal));out.lifetimePoints=Math.max(point(a.lifetimePoints),point(b.lifetimePoints));out.punkteGesamt=Math.max(point(a.punkteGesamt),point(b.punkteGesamt));return out}
function currentRow(){const p=profile(),c=courseCode(p);return{id:p.studentId||p.userId||p.email||'current',studentId:p.studentId||p.userId||'',userId:p.userId||p.studentId||'',studentName:userName(p),email:p.email||'',kurs:c,kursnummer:c,courseCode:c,pointsTotal:totalPoints(progressDoc),ranking:{points:totalPoints(progressDoc)}}}
function rankPoints(x={}){return storedPoints(x)}
function drawRanking(rows){const map=new Map();for(const row of rows.concat(currentRow())){if(!row)continue;const id=identity(row),old=map.get(id);map.set(id,old?mergePerson(old,row):row)}const list=[...map.values()].filter(x=>displayName(x)).sort((a,b)=>rankPoints(b)-rankPoints(a)||displayName(a).localeCompare(displayName(b),'de')).slice(0,50);$('leaderboard').innerHTML=list.length?list.map((x,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(displayName(x))}</b></div><div class="points"><b>${rankPoints(x)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Ranglistendaten vorhanden.</div>';$('rankingStatus').textContent='Serverstand '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}
async function queryCourse(field,value){if(!value)return[];try{const s=await serverDocs(query(collection(db,'progress'),where(field,'==',value),limit(100)));return s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){return[]}}
async function loadRanking(){if(rankingBusy)return;rankingBusy=true;$('rankingStatus').textContent='wird vom Server aktualisiert …';try{const c=courseCode();if(!c){drawRanking([]);return}const result=await withTimeout(Promise.all([queryCourse('kurs',c),queryCourse('courseCode',c),queryCourse('kursnummer',c)]),12000,'Rangliste lädt zu lange');drawRanking(result.flat())}catch(error){console.warn('Rangliste konnte nicht geladen werden',error);drawRanking([]);$('rankingStatus').textContent='Serververbindung langsam · erneut versuchen'}finally{rankingBusy=false}}
function scheduleRefresh(delay=120){clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{refreshStats();loadRanking()},delay)}
function refreshAll(){refreshStats();loadRanking()}
window.SP_DASHBOARD_REFRESH=refreshAll;

$('rankingBtn')?.addEventListener('click',loadRanking);
$('logoutBtn')?.addEventListener('click',()=>logout());
window.addEventListener('SP_ACCOUNT_PROGRESS_READY',()=>scheduleRefresh(150));
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>scheduleRefresh(150));
window.addEventListener('SP_POINT_DELTA_APPLIED',()=>scheduleRefresh(100));
window.addEventListener('pageshow',()=>scheduleRefresh(80));
window.addEventListener('online',()=>scheduleRefresh(100));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')scheduleRefresh(80)});

const cached=readJSON(DASH_CACHE,null);if(cached)renderStats(cached,false,'cache');else renderStats({avg:0,done:0,totalThemes:0,points:point(localStorage.getItem('SP_POINTS_TOTAL')),stars:0},false,'cache');
refreshStats();loadRanking();
setInterval(refreshStats,30000);
setInterval(loadRanking,60000);
