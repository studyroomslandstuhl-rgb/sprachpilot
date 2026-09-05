(function(){
'use strict';
if(window.__SP_TEACHER_EXAM_READER_V2)return;
window.__SP_TEACHER_EXAM_READER_V2=true;

/*
 * SprachPilot Lehrer-Pruefungsansicht Standard V2
 * Referenz: A1 Lektion 8 · Thema 3 · ?task=pruefung-l8t3-inhalte-v3&teacherExamRead=1
 * Gilt fuer jede Lektion, jedes Thema und jede Pruefung.
 * Lehrkraefte sehen alle Pruefungsinhalte + Soll-Loesungen und koennen die Pruefung testen.
 * Die Lehreransicht schreibt keine Teilnehmerpunkte und keinen Teilnehmerfortschritt.
 */

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parse=raw=>{try{return JSON.parse(raw||'null')||{}}catch(e){return{}}};
const pathInfo=()=>{const m=String(location.pathname||'').match(/\/wortschatz\/A\d-Lektion-(\d+)\/Thema-(\d+)\//i);return m?{lesson:Number(m[1]),themeNo:Number(m[2])}:null};

function teacher(){
 const roles=['teacher','lehrer','admin','owner','superadmin'];
 const values=['SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE','SP_LOGIN_CONTEXT'].map(k=>String(localStorage.getItem(k)||'').trim().toLowerCase());
 if(values.some(v=>roles.includes(v)||v.startsWith('teacher')))return true;
 const access=String(window.SP_SECURE_ACCESS?.type||'').toLowerCase();
 if(access==='teacher'||access==='teacher-preview')return true;
 if(window.spTeacherCanSeeAll===true||window.spIsTeacherUnrestricted?.()===true)return true;
 const profiles=[parse(localStorage.getItem('SP_TEACHER_PROFILE')),parse(localStorage.getItem('SP_USER_PROFILE'))];
 return profiles.some(p=>p?.isTeacher===true||p?.teacher===true||p?.admin===true||p?.owner===true||roles.includes(String(p?.role||p?.loginRole||p?.type||p?.accountType||'').toLowerCase()));
}

function themeNumberOf(value){return Number(value?.number??value?.themeNumber??value?.theme??value?.id??0)||0}
function hasTasks(value){return !!(value&&typeof value==='object'&&Array.isArray(value.tasks))}
function fromCollection(value,themeNo){
 if(!value)return null;
 if(hasTasks(value)&&(!themeNumberOf(value)||themeNumberOf(value)===themeNo))return value;
 if(Array.isArray(value))return value.find(v=>hasTasks(v)&&(!themeNumberOf(v)||themeNumberOf(v)===themeNo))||value[themeNo]||value[themeNo-1]||null;
 if(typeof value==='object'){
  const direct=value[themeNo]??value[String(themeNo)];if(hasTasks(direct))return direct;
  for(const v of Object.values(value)){if(hasTasks(v)&&themeNumberOf(v)===themeNo)return v}
 }
 return null;
}
function model(){
 const p=pathInfo();if(!p)return null;
 const L=p.lesson,T=p.themeNo;
 const explicit=[
  window[`L${L}_THEME`],window[`L${L}T${T}`],window[`L${L}_THEMES`],window[`L${L}_ALL_THEMES`],
  window.SP_THEME,window.SP_CURRENT_THEME,window.THEME
 ];
 for(const source of explicit){const theme=fromCollection(source,T);if(hasTasks(theme))return{lesson:L,themeNo:T,theme,system:`l${L}`}}
 try{
  const rx=new RegExp(`^L${L}(?:_|T|$)`,'i');
  for(const key of Object.keys(window)){
   if(!rx.test(key))continue;
   let value;try{value=window[key]}catch(e){continue}
   const theme=fromCollection(value,T);if(hasTasks(theme))return{lesson:L,themeNo:T,theme,system:`l${L}`};
  }
 }catch(e){}
 return null;
}

function isExam(task){
 if(!task)return false;
 if(task.exam===true||task.isExam===true)return true;
 const kind=String(task.kind||task.type||'').toLowerCase();
 if(kind==='exam'||kind.includes('exam'))return true;
 return /pruefung|prüfung|exam/i.test(`${task.id||''} ${task.title||''}`);
}
function examsOf(m){return (m?.theme?.tasks||[]).filter(isExam)}
function itemsOf(exam){
 const candidates=[exam?.items,exam?.questions,exam?.exercises,exam?.aufgaben];
 for(const value of candidates)if(Array.isArray(value))return value;
 return [];
}
function readHref(id){const u=new URL('task.html',location.href);u.searchParams.set('task',id);u.searchParams.set('teacherExamRead','1');return u.pathname+u.search}
function testHref(id){const u=new URL('task.html',location.href);u.searchParams.set('task',id);u.searchParams.delete('teacherExamRead');return u.pathname+u.search}
function hrefTask(link){try{return new URL(link.getAttribute('href')||'',location.href).searchParams.get('task')}catch(e){return null}}
function examCard(id,index){
 const links=[...document.querySelectorAll('a[href]')];
 const exact=links.find(a=>String(hrefTask(a))===String(id));if(exact)return exact;
 const escaped=window.CSS?.escape?CSS.escape(String(id)):String(id).replace(/[^a-zA-Z0-9_-]/g,'');
 const byId=document.getElementById('task-'+String(id))||document.querySelector(`[data-task-id="${escaped}"],[data-task="${escaped}"]`);if(byId)return byId.closest('a,button')||byId;
 const grids=document.querySelectorAll('.l8-grid,.l7-grid,.task-grid,.modules,.grid');
 for(const grid of grids){const child=grid.children?.[index];if(child)return child.closest?.('a,button')||child}
 return null;
}
function patchOverview(){
 if(!teacher())return false;
 const m=model();if(!m)return false;
 const exams=examsOf(m);if(!exams.length)return false;
 try{window.spTeacherCanSeeAll=true}catch(e){}
 exams.forEach(exam=>{
  const index=m.theme.tasks.findIndex(t=>t===exam||String(t?.id)===String(exam.id));
  let card=examCard(exam.id,index);if(!card)return;
  card.classList?.remove('locked','exam-locked','done');
  card.removeAttribute?.('aria-disabled');card.style&&(card.style.pointerEvents='',card.style.opacity='');
  if(card.tagName==='A')card.href=readHref(exam.id);
  else{
   card.setAttribute?.('role','link');card.tabIndex=0;
   card.onclick=()=>{location.href=readHref(exam.id)};
   card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();location.href=readHref(exam.id)}};
  }
  card.dataset&&(card.dataset.teacherExam='1');
  const start=card.querySelector?.('.l8-task-start,.l7-module-bottom strong,.start,.task-start');if(start)start.textContent='Prüfung lesen';
  const status=card.querySelector?.('.l8-small,.l7-module-bottom span,.status,.task-status');if(status)status.textContent='Lehreransicht · vollständig freigeschaltet';
  const lock=card.querySelector?.('.l7-module-top b,.lock,.icon');if(lock&&/🔒/.test(lock.textContent||''))lock.textContent='⭐';
 });
 return true;
}

function valueText(value){
 if(value==null)return'';
 if(Array.isArray(value))return value.filter(v=>v!=null&&v!=='').map(valueText).filter(Boolean).join(' / ');
 if(typeof value==='object'){try{return JSON.stringify(value)}catch(e){return String(value)}}
 return String(value);
}
function answer(item){
 if(item?.correctIndex!=null&&Array.isArray(item.options))return valueText(item.options[Number(item.correctIndex)]);
 const fields=['answer','answers','correctAnswer','correct','solution','solutions','expected','accepted','word','form'];
 for(const field of fields){const raw=item?.[field];if(raw!=null&&valueText(raw))return valueText(raw)}
 return'';
}
function itemHtml(item,n){
 const type=String(item?.type||item?.kind||'').trim();
 const label=String(item?.label||item?.title||'').trim();
 const context=String(item?.context||item?.reading||item?.dialog||'').trim();
 const prompt=String(item?.prompt||item?.question||item?.sentence||item?.meaning||item?.instruction||'').trim();
 const options=Array.isArray(item?.options)?item.options:[];
 const tokens=Array.isArray(item?.tokens)?item.tokens:[];
 const solution=answer(item);
 const hint=String(item?.hint||'').trim();
 const transcript=String(item?.transcript||item?.audioText||'').trim();
 const audio=String(item?.audio||'').trim();
 const audioFile=String(item?.audioFile||item?.audioSrc||'').trim();
 const audioIsText=!transcript&&audio&&!/^https?:\/\//i.test(audio)&&!/^audio\//i.test(audio)&&!/^\S+\.mp3(?:\?|$)/i.test(audio);
 const image=String(item?.image||item?.img||item?.imageUrl||'').trim();
 const audioText=transcript||(audioIsText?audio:'');
 return `<article class="sp-ter-item"><div class="sp-ter-no">${n}</div><div class="sp-ter-body"><div class="sp-ter-meta">${type?`<span>${esc(type)}</span>`:''}${label?`<strong>${esc(label)}</strong>`:''}</div>${context?`<div class="sp-ter-context">${esc(context).replace(/\n/g,'<br>')}</div>`:''}${image?`<div class="sp-ter-image"><img src="${esc(image)}" alt="Prüfungsbild" onerror="this.closest('.sp-ter-image').hidden=true"></div>`:''}${audioText?`<div class="sp-ter-audio"><strong>🎧 Hörtext / Transkript</strong><p>${esc(audioText).replace(/\n/g,'<br>')}</p></div>`:(audio||audioFile)?`<div class="sp-ter-audio"><strong>🎧 Audio vorhanden</strong><p>${esc(audioFile||audio)}</p></div>`:''}${prompt?`<h3>${esc(prompt).replace(/\n/g,'<br>')}</h3>`:''}${options.length?`<ol class="sp-ter-options" type="A">${options.map(o=>`<li>${esc(valueText(o))}</li>`).join('')}</ol>`:''}${tokens.length?`<div class="sp-ter-tokens"><strong>Satzteile:</strong> ${tokens.map(v=>esc(valueText(v))).join(' · ')}</div>`:''}${hint?`<div class="sp-ter-hint"><strong>Hinweis:</strong> ${esc(hint)}</div>`:''}<div class="sp-ter-solution"><strong>Soll-Lösung:</strong> ${solution?esc(solution):'<span>freie / offene Antwort</span>'}</div></div></article>`;
}
function renderReader(){
 if(!teacher())return false;
 const qs=new URLSearchParams(location.search);if(qs.get('teacherExamRead')!=='1')return false;
 const m=model();if(!m)return false;
 const id=qs.get('task');const exam=examsOf(m).find(t=>String(t.id)===String(id));if(!exam)return false;
 const root=document.getElementById('app');if(!root)return false;
 const items=itemsOf(exam),renderKey=`${m.lesson}:${m.themeNo}:${exam.id}:${items.length}`;
 if(root.dataset.spTeacherExamReader===renderKey)return true;
 root.dataset.spTeacherExamReader=renderKey;
 const missing=!items.length?'<section class="sp-ter-note warn">Diese Prüfung hat noch keinen standardisierten <code>items</code>- bzw. Fragen-Datensatz. Für eine vollständige Lehreransicht müssen Aufgaben und Soll-Lösungen als strukturierte Prüfungsdaten vorliegen.</section>':'';
 root.innerHTML=`<div class="sp-ter-wrap"><section class="sp-ter-head"><div><div class="sp-ter-kicker">Lehreransicht · Lektion ${m.lesson} · Thema ${m.themeNo}</div><h1>⭐ ${esc(exam.title||'Prüfung')}</h1><p>${esc(exam.instruction||exam.description||'Vollständige Prüfungsansicht')}</p></div><div class="sp-ter-actions"><a class="sp-ter-btn" href="index.html">← Themenübersicht</a><a class="sp-ter-btn primary" href="${esc(testHref(exam.id))}">Prüfung testen</a></div></section><section class="sp-ter-note">Alle ${items.length} Prüfungsfragen und die hinterlegten Soll-Lösungen sind sichtbar. Diese Ansicht verändert keine Teilnehmerpunkte und keinen Teilnehmerfortschritt.</section>${missing}<section class="sp-ter-list">${items.map((item,i)=>itemHtml(item,i+1)).join('')}</section></div>`;
 document.title=`Lehreransicht · ${exam.title||'Prüfung'}`;
 return true;
}
function run(){
 if(!teacher())return false;
 try{window.spTeacherCanSeeAll=true}catch(e){}
 const read=new URLSearchParams(location.search).get('teacherExamRead')==='1';
 if(read&&renderReader())return true;
 return patchOverview();
}

const style=document.createElement('style');style.id='sp-teacher-exam-reader-style';style.textContent=`
.sp-ter-wrap{max-width:1100px;margin:0 auto;padding:24px 16px 60px;font-family:inherit}.sp-ter-head,.sp-ter-note,.sp-ter-item{background:#fff;border:1px solid #ddd;border-radius:18px}.sp-ter-head{padding:22px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.sp-ter-kicker{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:#666}.sp-ter-head h1{margin:6px 0 8px}.sp-ter-head p{margin:0;color:#555}.sp-ter-actions{display:flex;gap:8px;flex-wrap:wrap}.sp-ter-btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:11px;border:1px solid #bbb;text-decoration:none;color:#222;background:#fff;font-weight:800}.sp-ter-btn.primary{background:#2f2f37;color:#fff;border-color:#2f2f37}.sp-ter-note{padding:14px 16px;margin:14px 0;font-weight:750}.sp-ter-note.warn{background:#fff8dc;border-color:#eadb97}.sp-ter-list{display:grid;gap:14px}.sp-ter-item{display:grid;grid-template-columns:48px 1fr;gap:14px;padding:18px}.sp-ter-no{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#f0f0f4;font-weight:950}.sp-ter-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px}.sp-ter-meta span{font-size:12px;padding:3px 7px;border-radius:999px;background:#eee;color:#555;font-weight:800}.sp-ter-body h3{margin:10px 0 12px;font-size:20px}.sp-ter-context,.sp-ter-audio,.sp-ter-hint{padding:12px 14px;border-radius:12px;background:#f6f6f8;line-height:1.5;margin-bottom:10px}.sp-ter-audio p{margin:6px 0 0}.sp-ter-hint{background:#fff8dc}.sp-ter-options{margin:8px 0 12px;padding-left:30px}.sp-ter-options li{padding:4px 0}.sp-ter-solution{margin-top:12px;padding:11px 13px;border-radius:11px;background:#eef8ef}.sp-ter-tokens{margin-top:10px}.sp-ter-image img{max-width:280px;max-height:220px;object-fit:contain;border-radius:12px}.sp-ter-image{margin:10px 0}@media(max-width:700px){.sp-ter-head{flex-direction:column}.sp-ter-actions{width:100%}.sp-ter-btn{flex:1}.sp-ter-item{grid-template-columns:1fr}.sp-ter-no{width:34px;height:34px}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));else setTimeout(run,0);
window.addEventListener('load',()=>setTimeout(run,0));
[80,200,500,900,1500,3000,5000].forEach(t=>setTimeout(run,t));
window.addEventListener('SP_SECURE_ACCESS_CONFIRMED',()=>setTimeout(run,0));
window.addEventListener('SP_PROFILE_SYNCED',()=>setTimeout(run,0));
try{let timer=null;new MutationObserver(()=>{if(!teacher())return;clearTimeout(timer);timer=setTimeout(run,40)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
window.SPTeacherExamReader={version:2,run,patchOverview,renderReader,isTeacher:teacher,model,isExam};
})();
