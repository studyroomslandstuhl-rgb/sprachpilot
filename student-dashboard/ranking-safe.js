import { db, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
const $=id=>document.getElementById(id);let loading=false,lastLoad=0;
function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
function profile(){return getActiveProfile()||readJSON('SP_USER_PROFILE',readJSON('SP_STUDENT_PROFILE',null))||{}}
function courseCode(p=profile()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function variants(c){return [...new Set([c,String(c).toUpperCase(),String(c).toLowerCase()].filter(Boolean))]}
function esc(s){return String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function displayName(x){return [x.vorname||x.firstName||x.name,x.nachname||x.lastName].filter(Boolean).join(' ')||x.studentName||x.displayName||x.email||''}
function points(x){return Math.max(Number(x.ranking?.points||0),Number(x.totals?.points||0),Number(x.pointsTotal||0),Number(x.lifetimePoints||0),Number(x.punkteGesamt||0),Number(x.points||0))}
function realStudent(x){const name=String(displayName(x)||'').trim(),role=String(x.role||x.loginRole||'').toLowerCase();if(role==='teacher'||x.isTeacher===true||x.teacherPreview===true)return false;if(!name&&!x.email)return false;if(/^sch(ü|ue)ler\/?in$/i.test(name)||/^student$/i.test(name))return false;return true}
async function queryRows(col,field,value){if(!value)return [];try{const s=await getDocs(query(collection(db,col),where(field,'==',value),limit(80)));return s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){return []}}
async function loadRankingSafe(force=false){
 const box=$('leaderboard');if(!box)return;const now=Date.now();if(loading)return;if(!force&&now-lastLoad<10000)return;loading=true;lastLoad=now;box.style.display='grid';box.hidden=false;box.removeAttribute('hidden');box.innerHTML='<div class="empty">Rangliste lädt …</div>';
 const c=courseCode();if(!c){box.innerHTML='<div class="empty">Rangliste: Kurs noch nicht erkannt.</div>';loading=false;return}
 const jobs=[];for(const val of variants(c)){for(const field of ['kurs','courseCode','kursnummer']){jobs.push(queryRows('progress',field,val));jobs.push(queryRows('students',field,val));}}
 const rows=(await Promise.all(jobs)).flat();
 const seen=new Map();rows.forEach(x=>{const id=x.studentId||x.userId||x.id||x.email||displayName(x);if(!id)return;const old=seen.get(id)||{};seen.set(id,{...old,...x})});
 const list=[...seen.values()].filter(realStudent).sort((a,b)=>points(b)-points(a)||displayName(a).localeCompare(displayName(b),'de')).slice(0,30);
 box.innerHTML=list.length?list.map((x,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(displayName(x))}</b><div class="small">${esc(x.kurs||x.courseCode||x.kursnummer||c)}</div></div><div class="points"><b>${points(x)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Teilnehmer im Kurs gefunden.</div>';
 loading=false;
}
function openRanking(){const box=$('leaderboard');if(box){box.style.display='grid';box.hidden=false;box.removeAttribute('hidden')}loadRankingSafe(true)}
window.loadRankingSafe=loadRankingSafe;window.openRanking=openRanking;
function bind(){const btn=$('rankingBtn');if(btn&&!btn.dataset.rankingSafe){btn.dataset.rankingSafe='1';btn.type='button';btn.onclick=e=>{e.preventDefault();openRanking()}}}
bind();document.addEventListener('DOMContentLoaded',bind);setTimeout(bind,200);