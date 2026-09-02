(function(){
'use strict';
if(window.__SP_TEACHER_EXAM_READER_V1)return;
window.__SP_TEACHER_EXAM_READER_V1=true;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parse=raw=>{try{return JSON.parse(raw||'null')||{}}catch(e){return{}}};
function teacher(){
 const roles=['teacher','lehrer','admin','owner','superadmin'];
 const values=['SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE'].map(k=>String(localStorage.getItem(k)||'').trim().toLowerCase());
 if(values.some(v=>roles.includes(v)))return true;
 const access=String(window.SP_SECURE_ACCESS?.type||'').toLowerCase();
 if(access==='teacher'||access==='teacher-preview')return true;
 if(window.spTeacherCanSeeAll===true||window.spIsTeacherUnrestricted?.()===true)return true;
 const profiles=[parse(localStorage.getItem('SP_TEACHER_PROFILE')),parse(localStorage.getItem('SP_USER_PROFILE'))];
 return profiles.some(p=>p?.isTeacher===true||p?.teacher===true||p?.admin===true||p?.owner===true||roles.includes(String(p?.role||p?.loginRole||p?.type||p?.accountType||'').toLowerCase()));
}
function model(){
 if(window.L8_THEME&&Array.isArray(window.L8_THEME.tasks))return{lesson:8,theme:window.L8_THEME,system:'l8'};
 if(window.L7_THEME&&Array.isArray(window.L7_THEME.tasks))return{lesson:7,theme:window.L7_THEME,system:'l7'};
 return null;
}
function readHref(id){const u=new URL('task.html',location.href);u.searchParams.set('task',id);u.searchParams.set('teacherExamRead','1');return u.pathname+u.search}
function testHref(id){const u=new URL('task.html',location.href);u.searchParams.set('task',id);return u.pathname+u.search}
function patchOverview(){
 if(!teacher())return false;
 const m=model();if(!m)return false;
 const exams=m.theme.tasks.filter(t=>t?.exam);if(!exams.length)return false;
 for(const exam of exams){
  const index=m.theme.tasks.findIndex(t=>t===exam||String(t?.id)===String(exam.id));
  let card=null;
  if(m.system==='l8')card=document.querySelector('.l8-grid')?.children?.[index]||null;
  else card=document.getElementById('task-'+exam.id)||document.querySelector('.l7-grid')?.children?.[index]||null;
  if(!card)continue;
  let link=card;
  if(card.tagName!=='A'){
   link=document.createElement('a');
   link.className=card.className;
   link.innerHTML=card.innerHTML;
   card.replaceWith(link);
  }
  link.classList.remove('locked','exam-locked');
  link.removeAttribute('aria-disabled');link.removeAttribute('onclick');
  link.style.pointerEvents='';link.style.opacity='';
  link.href=readHref(exam.id);
  link.dataset.teacherExam='1';
  const start=link.querySelector('.l8-task-start,.l7-module-bottom strong,.start');
  if(start)start.textContent='Prüfung lesen';
  const status=link.querySelector('.l8-small,.l7-module-bottom span');
  if(status)status.textContent='Lehreransicht · vollständig freigeschaltet';
  const lock=link.querySelector('.l7-module-top b');if(lock&&/🔒/.test(lock.textContent||''))lock.textContent='⭐';
 }
 return true
}
function answer(item){
 const raw=item?.answer??item?.answers??item?.accepted??item?.word??item?.form??'';
 if(Array.isArray(raw))return raw.filter(Boolean).join(' / ');
 return String(raw||'');
}
function itemHtml(item,n){
 const context=String(item?.context||'').trim();
 const prompt=String(item?.prompt||item?.question||item?.sentence||item?.meaning||'').trim();
 const options=Array.isArray(item?.options)?item.options:[];
 const tokens=Array.isArray(item?.tokens)?item.tokens:[];
 const solution=answer(item);
 const audio=String(item?.audio||'').trim();
 const audioFile=String(item?.audioFile||'').trim();
 const audioIsText=audio&&!/^https?:\/\//i.test(audio)&&!/^audio\//i.test(audio)&&!/^\S+\.mp3(?:\?|$)/i.test(audio);
 const image=String(item?.image||item?.img||'').trim();
 return `<article class="sp-ter-item"><div class="sp-ter-no">${n}</div><div class="sp-ter-body">${context?`<div class="sp-ter-context">${esc(context).replace(/\n/g,'<br>')}</div>`:''}${image?`<div class="sp-ter-image"><img src="${esc(image)}" alt="Prüfungsbild" onerror="this.closest('.sp-ter-image').hidden=true"></div>`:''}${audioIsText?`<div class="sp-ter-audio"><strong>🎧 Hörtext / Transkript</strong><p>${esc(audio)}</p></div>`:(audio||audioFile)?`<div class="sp-ter-audio"><strong>🎧 Audio vorhanden</strong><p>Für diese Frage ist eine Audiodatei hinterlegt.</p></div>`:''}${prompt?`<h3>${esc(prompt)}</h3>`:''}${options.length?`<ol class="sp-ter-options" type="A">${options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol>`:''}${tokens.length?`<div class="sp-ter-tokens"><strong>Satzteile:</strong> ${tokens.map(esc).join(' · ')}</div>`:''}<div class="sp-ter-solution"><strong>Soll-Lösung:</strong> ${solution?esc(solution):'<span>freie / offene Antwort</span>'}</div></div></article>`
}
function renderReader(){
 if(!teacher())return false;
 const qs=new URLSearchParams(location.search);if(qs.get('teacherExamRead')!=='1')return false;
 const m=model();if(!m)return false;
 const id=qs.get('task');const exam=m.theme.tasks.find(t=>t?.exam&&String(t.id)===String(id));if(!exam)return false;
 const root=document.getElementById('app');if(!root)return false;
 const items=Array.isArray(exam.items)?exam.items:[];
 root.innerHTML=`<div class="sp-ter-wrap"><section class="sp-ter-head"><div><div class="sp-ter-kicker">Lehreransicht · Lektion ${m.lesson} · Thema ${esc(m.theme.number||'')}</div><h1>⭐ ${esc(exam.title||'Prüfung')}</h1><p>${esc(exam.instruction||exam.description||'Vollständige Prüfungsansicht')}</p></div><div class="sp-ter-actions"><a class="sp-ter-btn" href="index.html">← Themenübersicht</a><a class="sp-ter-btn primary" href="${esc(testHref(exam.id))}">Prüfung testen</a></div></section><section class="sp-ter-note">Alle ${items.length} Prüfungsfragen sind hier sichtbar. Diese Ansicht verändert keine Teilnehmerpunkte und keinen Teilnehmerfortschritt.</section><section class="sp-ter-list">${items.map((item,i)=>itemHtml(item,i+1)).join('')}</section></div>`;
 document.title=`Lehreransicht · ${exam.title||'Prüfung'}`;
 return true
}
function run(){if(!teacher())return;const read=new URLSearchParams(location.search).get('teacherExamRead')==='1';if(read&&renderReader())return;patchOverview()}
const style=document.createElement('style');style.id='sp-teacher-exam-reader-style';style.textContent=`
.sp-ter-wrap{max-width:1100px;margin:0 auto;padding:24px 16px 60px;font-family:inherit}.sp-ter-head,.sp-ter-note,.sp-ter-item{background:#fff;border:1px solid #ddd;border-radius:18px}.sp-ter-head{padding:22px;display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.sp-ter-kicker{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:#666}.sp-ter-head h1{margin:6px 0 8px}.sp-ter-head p{margin:0;color:#555}.sp-ter-actions{display:flex;gap:8px;flex-wrap:wrap}.sp-ter-btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:11px;border:1px solid #bbb;text-decoration:none;color:#222;background:#fff;font-weight:800}.sp-ter-btn.primary{background:#2f2f37;color:#fff;border-color:#2f2f37}.sp-ter-note{padding:14px 16px;margin:14px 0;font-weight:750}.sp-ter-list{display:grid;gap:14px}.sp-ter-item{display:grid;grid-template-columns:48px 1fr;gap:14px;padding:18px}.sp-ter-no{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#f0f0f4;font-weight:950}.sp-ter-body h3{margin:10px 0 12px;font-size:20px}.sp-ter-context,.sp-ter-audio{padding:12px 14px;border-radius:12px;background:#f6f6f8;line-height:1.5;margin-bottom:10px}.sp-ter-audio p{margin:6px 0 0}.sp-ter-options{margin:8px 0 12px;padding-left:30px}.sp-ter-options li{padding:4px 0}.sp-ter-solution{margin-top:12px;padding:11px 13px;border-radius:11px;background:#eef8ef}.sp-ter-tokens{margin-top:10px}.sp-ter-image img{max-width:280px;max-height:220px;object-fit:contain;border-radius:12px}.sp-ter-image{margin:10px 0}@media(max-width:700px){.sp-ter-head{flex-direction:column}.sp-ter-actions{width:100%}.sp-ter-btn{flex:1}.sp-ter-item{grid-template-columns:1fr}.sp-ter-no{width:34px;height:34px}}
`;if(!document.getElementById(style.id))document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0));else setTimeout(run,0);
window.addEventListener('load',()=>setTimeout(run,0));
[100,350,800,1500,3000].forEach(t=>setTimeout(run,t));
window.addEventListener('SP_SECURE_ACCESS_CONFIRMED',()=>setTimeout(run,0));
try{new MutationObserver(()=>{if(teacher())setTimeout(run,30)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
window.SPTeacherExamReader={run,patchOverview,renderReader,isTeacher:teacher};
})();
