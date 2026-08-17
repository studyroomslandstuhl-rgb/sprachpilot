import { db, doc, getDoc, setDoc, collection, query, where, getDocs, limit, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, logout } from '/js/auth.js';

const $=id=>document.getElementById(id);
const CACHE='SP_STUDENT_DASHBOARD_LITE_V1';
const VERIFIED_VERSION=1;
let ownProgress={}, roster=[], statsBusy=false, rankingBusy=false, hydrateBusy=false;

function readJSON(k,f=null){try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}}
function point(v){const n=Number(v);return Number.isFinite(n)?Math.max(0,n):0}
function clamp(v){return Math.max(0,Math.min(100,Math.round(Number(v)||0)))}
function clean(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function uniq(a){return [...new Set((a||[]).filter(Boolean).map(String))]}
function esc(s){return String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function withTimeout(p,ms){return Promise.race([p,new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),ms))])}
function profile(){return getActiveProfile()||readJSON('SP_USER_PROFILE',readJSON('SP_STUDENT_PROFILE',{}))||{}}
function course(p=profile()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||p.courseDocId||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function name(r=profile()){return [r.vorname||r.firstName||r.name,r.nachname||r.lastName].filter(Boolean).join(' ').trim()||r.studentName||r.displayName||r.email||'Schüler/in'}
function ids(r=profile()){const c=course(r)||'kurs',mail=String(r.email||'').trim().toLowerCase(),fallback=clean(c+'_'+(mail||r.vorname||r.firstName||'student'));return uniq([localStorage.getItem('SP_STUDENT_ID'),r.docId,r.studentId,r.userId,r.uid,r.id,fallback])}
function storedPoints(r={}){return Math.max(point(r.rankingPoints),point(r.ranking?.points),point(r.totals?.points),point(r.pointsTotal),point(r.lifetimePoints),point(r.punkteGesamt),point(r.points))}
function taskPct(t={}){const total=Number(t.total||0),done=Array.isArray(t.done)?t.done.length:Number(t.done||0);return Math.max(clamp(t.percent??t.progress??0),t.completed?100:0,total>0?clamp(done/total*100):0)}
function topicPct(t={}){const tasks=Object.values(t.tasks||{}).filter(x=>x&&typeof x==='object');if(tasks.length)return clamp(tasks.reduce((s,x)=>s+taskPct(x),0)/tasks.length);return Math.max(clamp(t.progressPercent??t.current?.percent??0),t.completed===true?100:0)}
function isTopic(t){return !!(t&&typeof t==='object'&&!Array.isArray(t)&&(t.tasks||t.exam||t.current||t.lifetime||t.progressPercent!=null||t.lesson||t.theme||t.title))}
function topicKey(key,t={}){const l=String(t.lesson||t.lektion||'').match(/\d+/)?.[0]||'',th=String(t.theme||t.thema||'').match(/\d+/)?.[0]||'';return l||th?`${l}|${th}`:clean(t.topicId||t.themeId||key)}
function strongerTopic(a={},b={}){return topicPct(a)>=topicPct(b)?a:b}
function mergeProgress(a={},b={}){const out={...b,...a},wa={...(b.wortschatz||{})};for(const[k,t]of Object.entries(a.wortschatz||{})){if(!isTopic(t)){if(!(k in wa))wa[k]=t;continue}const sig=topicKey(k,t),existingKey=Object.keys(wa).find(x=>isTopic(wa[x])&&topicKey(x,wa[x])===sig);if(existingKey)wa[existingKey]=strongerTopic(t,wa[existingKey]);else wa[k]=t}out.wortschatz=wa;out.ranking={...(b.ranking||{}),...(a.ranking||{}),points:Math.max(point(a.ranking?.points),point(b.ranking?.points))};out.totals={...(b.totals||{}),...(a.totals||{}),points:Math.max(point(a.totals?.points),point(b.totals?.points))};out.pointsTotal=Math.max(point(a.pointsTotal),point(b.pointsTotal));out.lifetimePoints=Math.max(point(a.lifetimePoints),point(b.lifetimePoints));out.punkteGesamt=Math.max(point(a.punkteGesamt),point(b.punkteGesamt));return out}
function stats(r={}){const topics=new Map();for(const[k,t]of Object.entries(r.wortschatz||{})){if(!isTopic(t)||t.technicalRecovery===true)continue;const sig=topicKey(k,t),old=topics.get(sig);topics.set(sig,old?strongerTopic(t,old):t)}const list=[...topics.values()],started=list.filter(t=>topicPct(t)>0||Object.keys(t.tasks||{}).length||t.exam?.attempted),avg=started.length?clamp(started.reduce((s,t)=>s+topicPct(t),0)/started.length):0,done=list.filter(t=>topicPct(t)>=100).length;let stars=0;for(const mod of ['wortschatz','fragen','verben','perfekt','grammatik'])for(const t of Object.values(r[mod]||{}))if(isTopic(t))stars+=point(t.exam?.stars);return{avg,done,totalThemes:list.length,points:Math.max(storedPoints(r),point(localStorage.getItem('SP_POINTS_TOTAL'))),stars}}
function renderStats(s,cache=true){const p=profile();$('userPill').textContent=name(p)+(course(p)?' · '+course(p):'');$('totalCircle').style.setProperty('--p',s.avg||0);$('totalCircle').innerHTML='<span>'+Number(s.avg||0)+'%</span>';$('totalFill').style.width=Number(s.avg||0)+'%';$('summaryText').textContent=s.totalThemes?`${s.done} von ${s.totalThemes} Themen fertig`:'Noch kein Themenfortschritt gespeichert.';$('pointsTotal').textContent=Number(s.points||0);$('starsTotal').textContent=Number(s.stars||0);$('doneTotal').textContent=Number(s.done||0);$('lastUpdated').textContent='Aktualisiert: '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'});if(cache){try{localStorage.setItem(CACHE,JSON.stringify(s));localStorage.setItem('SP_POINTS_TOTAL',String(s.points||0))}catch(e){}}}

async function directProgress(id){try{const s=await getDoc(doc(db,'progress',id));return s.exists()?s.data()||{}:null}catch(e){return null}}
async function ownLoad(){
 const p=profile(),candidates=ids(p).slice(0,2);let merged={};
 const first=await withTimeout(Promise.all(candidates.map(directProgress)),6500).catch(()=>[]);for(const r of first)if(r)merged=mergeProgress(r,merged);
 if((!Object.keys(merged).length||storedPoints(merged)===0||!Object.keys(merged.wortschatz||{}).length)&&p.email){
   try{const s=await withTimeout(getDocs(query(collection(db,'progress'),where('email','==',String(p.email).trim().toLowerCase()),limit(8))),6500);for(const d of s.docs)merged=mergeProgress(d.data()||{},merged)}catch(e){}
 }
 return merged;
}
async function mirrorStudent(row,total,studentDocId=null){const id=studentDocId||row.docId||row.id||row.studentId||row.userId;if(!id||!total)return;const c=course(row)||course();try{await setDoc(doc(db,'students',String(id)),{studentId:row.studentId||row.userId||id,userId:row.userId||row.studentId||id,studentName:name(row),email:row.email||'',kurs:c,kursnummer:c,courseCode:c,rankingPoints:total,pointsTotal:total,rankingMirrorVersion:VERIFIED_VERSION,rankingUpdatedAt:serverTimestamp()},{merge:true})}catch(e){}}
async function refreshOwn(){if(statsBusy)return;statsBusy=true;try{const r=await ownLoad();if(Object.keys(r||{}).length)ownProgress=r;const s=stats(ownProgress);renderStats(s);if(s.points>0)mirrorStudent(profile(),s.points,profile().docId||profile().studentId||profile().userId||ids()[0])}catch(e){const cached=readJSON(CACHE,null);if(cached)renderStats(cached,false);$('lastUpdated').textContent='Letzter gespeicherter Stand'}finally{statsBusy=false}}

function identity(r={}){return String(r.email||'').trim().toLowerCase()||String(r.studentId||r.userId||r.uid||r.id||r.docId||name(r)).trim().toLowerCase()}
function mergeStudent(a={},b={}){const out={...a,...b};out.id=a.id||b.id;out.docId=a.docId||b.docId||out.id;out.studentName=a.studentName||b.studentName||name(out);out.email=a.email||b.email||'';out.rankingPoints=Math.max(storedPoints(a),storedPoints(b));out.rankingMirrorVersion=Math.max(Number(a.rankingMirrorVersion||0),Number(b.rankingMirrorVersion||0));return out}
function mergeRoster(rows){const map=new Map();for(const r of rows){const k=identity(r);if(!k)continue;map.set(k,map.has(k)?mergeStudent(map.get(k),r):r)}return [...map.values()]}
async function rosterQuery(field,value){if(!value)return[];try{const s=await getDocs(query(collection(db,'students'),where(field,'==',value),limit(100)));return s.docs.map(d=>({id:d.id,docId:d.id,...d.data()}))}catch(e){return[]}}
async function loadRoster(){const c=course();if(!c)return[];const rows=await withTimeout(Promise.all(['kurs','kursnummer','courseCode','course','courseDocId'].map(f=>rosterQuery(f,c))),6500).catch(()=>[]);return mergeRoster(rows.flat())}
function rankPoints(r={}){return Math.max(point(r.rankingPoints),storedPoints(r))}
function drawRoster(status=''){const current={...profile(),rankingPoints:Math.max(storedPoints(ownProgress),point(localStorage.getItem('SP_POINTS_TOTAL'))),rankingMirrorVersion:VERIFIED_VERSION};const rows=mergeRoster(roster.concat(current)).filter(r=>name(r)&&!['teacher','lehrer','admin'].includes(String(r.role||r.loginRole||'').toLowerCase())).sort((a,b)=>rankPoints(b)-rankPoints(a)||name(a).localeCompare(name(b),'de')).slice(0,50);$('leaderboard').innerHTML=rows.length?rows.map((r,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(name(r))}</b></div><div class="points"><b>${rankPoints(r)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Teilnehmer gefunden.</div>';$('rankingStatus').textContent=status||('aktualisiert '+new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'}))}
async function loadRanking(){if(rankingBusy)return;rankingBusy=true;try{$('rankingStatus').textContent='Teilnehmer werden geladen …';const rows=await loadRoster();if(rows.length)roster=rows;drawRoster();setTimeout(hydrateRanking,350)}finally{rankingBusy=false}}
async function bestProgressForStudent(r){let best=0;const candidates=uniq([r.docId,r.id,r.studentId,r.userId,r.uid,r.canonicalStudentId]).slice(0,3);for(const id of candidates){const x=await directProgress(id);best=Math.max(best,storedPoints(x||{}));if(best>0)break}if(best===0&&r.email){try{const s=await getDocs(query(collection(db,'progress'),where('email','==',String(r.email).trim().toLowerCase()),limit(8)));for(const d of s.docs)best=Math.max(best,storedPoints(d.data()||{}))}catch(e){}}return best}
async function hydrateRanking(){if(hydrateBusy||!roster.length)return;hydrateBusy=true;try{const todo=roster.filter(r=>Number(r.rankingMirrorVersion||0)<VERIFIED_VERSION||rankPoints(r)===0).slice(0,40);let done=0;for(const row of todo){$('rankingStatus').textContent=`Punkte werden ergänzt ${done}/${todo.length}`;const p=await bestProgressForStudent(row);if(p>rankPoints(row)){row.rankingPoints=p;await mirrorStudent(row,p,row.docId||row.id)}else if(p>0&&Number(row.rankingMirrorVersion||0)<VERIFIED_VERSION){row.rankingPoints=p;await mirrorStudent(row,p,row.docId||row.id)}row.rankingMirrorVersion=p>0?VERIFIED_VERSION:Number(row.rankingMirrorVersion||0);done++;drawRoster(`Punkte geprüft ${done}/${todo.length}`);await new Promise(r=>setTimeout(r,60))}drawRoster()}finally{hydrateBusy=false}}
function refresh(){refreshOwn();loadRanking()}

$('rankingBtn')?.addEventListener('click',()=>{loadRanking()});
$('logoutBtn')?.addEventListener('click',()=>logout());
window.addEventListener('pageshow',()=>setTimeout(refresh,60));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(refresh,60)});
window.addEventListener('SP_POINT_DELTA_APPLIED',()=>setTimeout(refreshOwn,80));
const cached=readJSON(CACHE,null);if(cached)renderStats(cached,false);else renderStats({avg:0,done:0,totalThemes:0,points:point(localStorage.getItem('SP_POINTS_TOTAL')),stars:0},false);
refreshOwn();loadRanking();
setInterval(refreshOwn,45000);
setInterval(loadRanking,90000);
