import { db, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';
const $=id=>document.getElementById(id);
let loading=false,lastLoad=0;
function readJSON(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
function profile(){return getActiveProfile()||readJSON('SP_USER_PROFILE',readJSON('SP_STUDENT_PROFILE',null))||{}}
function courseCode(p=profile()){return String(p.courseCode||p.kurs||p.kursnummer||p.course||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function esc(s){return String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function displayName(x){return [x.vorname||x.firstName||x.name,x.nachname||x.lastName].filter(Boolean).join(' ')||x.studentName||x.displayName||x.email||''}
function points(x){return Math.max(Number(x.ranking?.points||0),Number(x.totals?.points||0),Number(x.pointsTotal||0),Number(x.lifetimePoints||0),Number(x.punkteGesamt||0))}
function isTopicRecord(v){return v&&typeof v==='object'&&!Array.isArray(v)&&(v.tasks||v.exam||v.current||v.lifetime||v.progressPercent||v.title)}
function hasActivity(x){return points(x)>0||Number(x.verben?.progress||x.verben?.progressPercent||0)>0||Object.values(x.wortschatz||{}).some(isTopicRecord)||Object.values(x.fragen||{}).some(isTopicRecord)}
function realStudent(x){const name=String(displayName(x)||'').trim(),role=String(x.role||x.loginRole||'').toLowerCase();if(role==='teacher'||x.isTeacher===true||x.teacherPreview===true)return false;if(!name&&!x.email)return false;if(/^sch(ü|ue)ler\/?in$/i.test(name)||/^student$/i.test(name))return false;return hasActivity(x)}
async function queryRows(field,value){if(!value)return [];try{const s=await getDocs(query(collection(db,'progress'),where(field,'==',value),limit(80)));return s.docs.map(d=>({id:d.id,...d.data()}))}catch(e){console.warn('Ranking query failed',field,value,e);return []}}
async function loadRankingSafe(force=false){
  const box=$('leaderboard');if(!box)return;
  const now=Date.now();if(loading)return;if(!force&&now-lastLoad<30000)return;loading=true;lastLoad=now;
  box.style.display='grid';box.innerHTML='<div class="empty">Rangliste lädt …</div>';
  const c=courseCode();if(!c){box.innerHTML='<div class="empty">Rangliste: Kurs noch nicht erkannt.</div>';loading=false;return}
  const rows=[...(await queryRows('kurs',c)),...(await queryRows('courseCode',c)),...(await queryRows('kursnummer',c))];
  const seen=new Map();rows.forEach(x=>{if(!seen.has(x.id))seen.set(x.id,x)});
  const list=[...seen.values()].filter(realStudent).sort((a,b)=>points(b)-points(a)).slice(0,20);
  box.innerHTML=list.length?list.map((x,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(displayName(x))}</b><div class="small">${esc(x.kurs||x.courseCode||x.kursnummer||c)}</div></div><div class="points"><b>${points(x)}</b> Punkte</div></div>`).join(''):'<div class="empty">Noch keine Rangliste mit echten Schülern und Fortschritt.</div>';
  loading=false;
}
window.loadRankingSafe=loadRankingSafe;
const btn=$('rankingBtn');if(btn)btn.addEventListener('click',()=>loadRankingSafe(true));
setTimeout(()=>loadRankingSafe(true),1800);
window.addEventListener('SP_PROGRESS_SYNCED',()=>loadRankingSafe(false));
