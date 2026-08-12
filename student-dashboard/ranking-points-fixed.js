import { db, doc, getDoc, collection, query, where, getDocs, limit } from '/js/firebase.js';
import { getActiveProfile } from '/js/auth.js';

const MODULES=['fragen','wortschatz','verben','perfekt','grammatik'];
const TECH=new Set(['state','progress','totals','metadata','profile','updatedAt','lastActive','lastPage','known','learned','unknown','unsure','activeVerbs','learnedVerbs']);
const num=v=>{const n=Number(v);return Number.isFinite(n)&&n>0?n:0};
const norm=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'');
const normId=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
const esc=s=>String(s||'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
function p(){return getActiveProfile()||{} }
function course(r=p()){return String(r.courseCode||r.kurs||r.kursnummer||r.course||r.courseDocId||localStorage.getItem('SP_COURSE_CODE')||'').trim()}
function name(r={}){return [r.vorname||r.firstName||r.name,r.nachname||r.lastName].filter(Boolean).join(' ')||r.studentName||r.displayName||r.email||''}
function courseVals(r={}){return [r.kurs,r.kursnummer,r.courseCode,r.course,r.courseName,r.courseDocId,r.className,r.group].filter(Boolean).map(v=>String(v).trim())}
function variants(){const x=p(),c=course(x);return uniq([c,x.kurs,x.kursnummer,x.courseCode,x.course,x.courseDocId,String(c).toUpperCase(),String(c).toLowerCase()])}
function sameCourse(r,c=course()){const targets=uniq([c,...variants()]).map(norm),vals=courseVals(r).map(norm);return !vals.length||vals.some(v=>targets.includes(v))}
function isTopic(k,v){return !TECH.has(k)&&!!(v&&typeof v==='object'&&!Array.isArray(v)&&(v.lifetime||v.tasks||v.exam||v.current||v.progressPercent!=null||v.pointsTotal!=null))}
function sig(module,key,t={}){if(t.technicalRecovery)return module+'|tech|'+normId(key);const explicit=t.topicId||t.themeId;if(explicit)return module+'|id|'+normId(explicit);const lesson=normId(t.lesson||t.lektion),theme=normId(t.theme||t.thema),level=normId(t.level);if(lesson||theme)return[module,level,lesson,theme].join('|');return module+'|key|'+normId(key)}
function rowAggregate(r={}){return Math.max(num(r.ranking?.points),num(r.totals?.points),num(r.pointsTotal),num(r.lifetimePoints),num(r.punkteGesamt),num(r.points))}
function identityKeys(r={}){const keys=[],mail=String(r.email||r.mail||r.userEmail||'').trim().toLowerCase(),n=norm(name(r)),c=courseVals(r).map(norm).find(Boolean)||norm(course());[r.studentId,r.userId,r.uid,r.canonicalStudentId,r.docId].filter(Boolean).forEach(v=>keys.push('id:'+norm(v)));if(mail)keys.push('mail:'+mail);if(n&&c)keys.push('namecourse:'+n+'|'+c);if(n&&mail)keys.push('namemail:'+n+'|'+mail);if(!keys.length&&r.id)keys.push('doc:'+norm(r.id));return uniq(keys)}
function teacher(r={}){const role=String(r.role||r.loginRole||r.type||'').toLowerCase();return role==='teacher'||role==='lehrer'||role==='admin'||r.isTeacher===true||r.teacherPreview===true}
function addPoints(group,row){group.aggregate=Math.max(group.aggregate,rowAggregate(row));for(const m of MODULES){for(const[k,t]of Object.entries(row[m]||{})){if(!isTopic(k,t))continue;const key=sig(m,k,t),pts=Math.max(num(t?.lifetime?.points),num(t?.pointsTotal),num(t?.points));group.topics.set(key,Math.max(group.topics.get(key)||0,pts))}}}
function mergeRows(rows){
 const groups=new Map(),aliases=new Map();
 for(const row of rows){const keys=identityKeys(row);let id=keys.map(k=>aliases.get(k)).find(Boolean)||keys[0]||('doc:'+norm(row.id||name(row)));let g=groups.get(id);if(!g){g={id,rows:[],topics:new Map(),aggregate:0,data:{}};groups.set(id,g)}g.rows.push(row);g.data={...g.data,...row};g.data.email=g.data.email||row.email||'';g.data.studentName=g.data.studentName||name(row);g.data.kurs=g.data.kurs||courseVals(row)[0]||'';addPoints(g,row);identityKeys(g.data).concat(keys).forEach(k=>aliases.set(k,id));}
 return [...groups.values()].map(g=>{const computed=[...g.topics.values()].reduce((a,b)=>a+b,0);return {...g.data,_rows:g.rows,computedPoints:computed,points:Math.max(computed,g.aggregate)}})
}
async function q(col,field,value){try{const s=await getDocs(query(collection(db,col),where(field,'==',value),limit(100)));return s.docs.map(d=>({id:d.id,docId:d.id,_source:col,...d.data()}))}catch(e){return[]}}
async function directCurrent(){const x=p(),ids=uniq([x.docId,x.studentId,x.userId,x.uid,x.id,localStorage.getItem('SP_STUDENT_ID')]);const out=[];for(const id of ids){for(const col of ['progress','students']){try{const s=await getDoc(doc(db,col,id));if(s.exists())out.push({id:s.id,docId:s.id,_source:col,...s.data()})}catch(e){}}}return out}
async function loadRows(){const fields=['kurs','kursnummer','courseCode','course','courseDocId'],jobs=[];for(const v of variants())for(const f of fields){jobs.push(q('progress',f,v));jobs.push(q('students',f,v))}const all=(await Promise.all(jobs)).flat();all.push(...await directCurrent());return all}
function render(list,c){const root=document.getElementById('leaderboard');if(!root)return;root.innerHTML=list.length?list.map((r,i)=>`<div class="rank"><div class="rankNo">${i+1}</div><div><b>${esc(name(r)||'Schüler/in')}</b><div class="small">${esc(courseVals(r)[0]||c)}</div></div><div class="points"><b>${r.points}</b> Punkte</div></div>`).join(''):'<div class="empty">Keine Teilnehmer gefunden.</div>'}
async function loadRankingFixed(){const root=document.getElementById('leaderboard');if(root)root.innerHTML='<div class="empty">Rangliste lädt …</div>';const c=course();const rows=await loadRows();let list=mergeRows(rows).filter(r=>!teacher(r)&&name(r)&&sameCourse(r,c));list.sort((a,b)=>b.points-a.points||name(a).localeCompare(name(b),'de'));render(list.slice(0,50),c);window.SP_RANKING_POINT_AUDIT={at:new Date().toISOString(),rows:rows.length,students:list.length,top:list.slice(0,50).map(r=>({name:name(r),points:r.points,computed:r.computedPoints,sources:r._rows?.length||0}))}}
function install(){const btn=document.getElementById('rankingBtn');if(!btn||btn.dataset.pointsFixed==='1')return;btn.dataset.pointsFixed='1';btn.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();loadRankingFixed().catch(error=>{console.warn('Ranglisten-Punkte konnten nicht geprüft werden',error);const root=document.getElementById('leaderboard');if(root)root.innerHTML='<div class="empty">Rangliste konnte nicht geladen werden.</div>'})},true)}
install();
export { loadRankingFixed };
