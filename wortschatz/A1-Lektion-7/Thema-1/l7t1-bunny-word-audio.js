(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const DIRS=[CDN+'audio/',CDN+'Audio/'];
let current=null;
let installingHeader=false;
function simple(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[….,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return simple(value).replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'')}
function base(value){return String(value??'').split(/[?#]/)[0].split('/').filter(Boolean).pop()?.replace(/\.(webp|png|jpe?g|gif|svg|mp3)$/i,'')||''}
function esc(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}
function readProfile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return {}}}
function dashboardHref(){return localStorage.getItem('SP_LOGIN_ROLE')==='teacher'?'/teacher/index.html':'/student-dashboard/index.html'}
function urls(id,word,image){const names=[];[id,base(image),word].filter(Boolean).forEach(value=>[base(value),slug(value,'_'),slug(value,'-')].filter(Boolean).forEach(name=>{if(!names.includes(name))names.push(name)}));const out=[];DIRS.forEach(dir=>names.forEach(name=>out.push(dir+encodeURIComponent(name)+'.mp3')));return out}
function fallback(word){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='de-DE';u.rate=.88;speechSynthesis.speak(u)}catch(e){}}
function play(id,word,image){const list=urls(id,word,image);let index=0;if(current){try{current.pause()}catch(e){}}function next(){if(index>=list.length){fallback(word||id);return}const audio=new Audio(list[index++]);current=audio;audio.preload='auto';audio.onerror=next;const promise=audio.play();if(promise&&promise.catch)promise.catch(next)}next()}
window.spLogout=function(){
 localStorage.removeItem('SP_LOGIN_ROLE');
 localStorage.removeItem('SP_ACTIVE_ROLE');
 localStorage.removeItem('SP_USER_PROFILE');
 localStorage.removeItem('SP_STUDENT_PROFILE');
 localStorage.removeItem('SP_TEACHER_PREVIEW');
 location.href='/index.html';
};
window.spGoBack=function(fallbackHref){location.href=fallbackHref||'index.html'};
function pageTitle(){
 const old=document.querySelector('.topbar .subtitle');
 const oldText=String(old?.textContent||'').split('· A1 Lektion 7')[0].trim();
 if(oldText)return oldText;
 if(document.body?.dataset?.page==='overview')return'Übersicht';
 if(document.body?.dataset?.page==='task')return'Aufgabe';
 return'Lektion 7 · Thema 1';
}
function navBack(){return document.body?.dataset?.page==='theme'?'../index.html':'index.html'}
function headerHtml(){
 const p=readProfile();
 const first=p.vorname||p.firstName||'';
 const last=p.nachname||p.lastName||'';
 const name=(`${first} ${last}`).trim()||'Schüler/in';
 const course=p.kurs||p.kursnummer||p.courseCode||'';
 const reset=typeof window.resetThemeProgress==='function'&&document.body?.dataset?.page!=='task';
 return `<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${esc(pageTitle())} · A1 Lektion 7 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}${course?' · '+esc(course):''}</span><a class="account-link" href="${dashboardHref()}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" type="button" onclick="spLogout()">Abmelden</button></div></div><nav class="nav"><button class="btn secondary" type="button" onclick="spGoBack('${navBack()}')">← Zurück</button><a class="btn secondary" href="uebersicht.html?v=l7t1-standardbar1">Übersicht</a>${reset?'<button class="btn danger-btn" type="button" onclick="resetThemeProgress()">Fortschritte löschen</button>':''}</nav>`;
}
function installHeader(){
 if(installingHeader)return;
 installingHeader=true;
 try{
  const title=pageTitle();
  document.querySelectorAll('.topbar').forEach(h=>h.remove());
  const container=document.querySelector('#app .container')||document.querySelector('.container')||document.getElementById('app')||document.body;
  const h=document.createElement('header');
  h.className='topbar sp-standard-topbar';
  h.dataset.standard='1';
  h.innerHTML=headerHtml().replace('>'+esc(pageTitle())+' · A1 Lektion 7 · Thema 1<','>'+esc(title)+' · A1 Lektion 7 · Thema 1<');
  if(container===document.body)document.body.prepend(h);else container.prepend(h);
 }finally{installingHeader=false;}
}
function installHeaderStyle(){
 if(document.getElementById('l7-standard-header-style'))return;
 const style=document.createElement('style');
 style.id='l7-standard-header-style';
 style.textContent=`:root{--lesson-main:#6d28d9;--lesson-main-dark:#3b0764;--lesson-soft:#f5f0ff;--lesson-line:#d8b4fe;--lesson-bg:#f7f2ff}html,body.l7t1-l6t4{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}body.l7t1-l6t4 .topbar.sp-standard-topbar{background:linear-gradient(135deg,#4c1d95,#7c3aed)!important;border:0!important;border-radius:0 0 24px 24px!important;box-shadow:0 8px 22px rgba(76,29,149,.18)!important;color:#fff!important;margin:0 0 18px!important;padding:18px 24px!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .brand,body.l7t1-l6t4 .topbar.sp-standard-topbar .brand h1,body.l7t1-l6t4 .topbar.sp-standard-topbar .subtitle{color:#fff!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .account-pill,body.l7t1-l6t4 .topbar.sp-standard-topbar .account-link,body.l7t1-l6t4 .topbar.sp-standard-topbar .btn.secondary{background:#fff!important;color:#3b0764!important;border:2px solid #e9d5ff!important;border-radius:18px!important;box-shadow:none!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .danger-btn{background:#fff!important;color:#991b1b!important;border:2px solid #ef4444!important}.account-btn{cursor:pointer;font:inherit}`;
 document.head.appendChild(style);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-overview-audio],[data-action="card-audio"],.word-audio');
 if(!button)return;
 const id=button.dataset.overviewAudio||button.dataset.wordId||'';
 const card=button.closest('.flip-card,.overview-word,.word-card,.question-card')||document;
 const word=String(card.querySelector('.flip-word,h2,h3,.word')?.textContent||button.getAttribute('aria-label')||id).replace(/^Anhören:\s*/i,'').trim();
 const image=card.querySelector('img')?.getAttribute('src')||'';
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
 play(id,word,image);
},true);
function applyStandard(){installHeaderStyle();installHeader()}
document.addEventListener('DOMContentLoaded',applyStandard);
new MutationObserver(()=>applyStandard()).observe(document.documentElement,{childList:true,subtree:true});
window.L7T1BunnyWordAudio={play};
})();