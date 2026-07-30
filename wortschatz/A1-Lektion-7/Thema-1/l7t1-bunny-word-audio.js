(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const DIRS=[CDN+'audio/',CDN+'Audio/'];
const VERSION='l7t1-standardbar6';
let current=null;
let headerTimer=null;
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
window.spGoBack=function(fallbackHref){
 const fallback=fallbackHref||'index.html';
 try{
  const ref=document.referrer?new URL(document.referrer):null;
  const here=new URL(location.href);
  if(ref&&ref.origin===here.origin&&ref.href!==here.href&&history.length>1){history.back();return;}
 }catch(e){}
 location.href=fallback;
};
function pageTitle(){
 const old=document.querySelector('.topbar:not(.sp-standard-topbar) .subtitle')||document.querySelector('.topbar.sp-standard-topbar .subtitle');
 const oldText=String(old?.textContent||'').split('· A1 Lektion 7')[0].trim();
 if(oldText)return oldText;
 if(document.body?.dataset?.page==='overview')return'Übersicht';
 if(document.body?.dataset?.page==='task')return'Aufgabe';
 return'Lektion 7 · Thema 1';
}
function navBack(){return document.body?.dataset?.page==='theme'?'../index.html':'index.html'}
function resetVisible(){return typeof window.resetThemeProgress==='function'&&document.body?.dataset?.page!=='task'}
function headerKey(title){
 const p=readProfile();
 const name=[p.vorname||p.firstName||'',p.nachname||p.lastName||'',p.kurs||p.kursnummer||p.courseCode||'',localStorage.getItem('SP_LOGIN_ROLE')||'',document.body?.dataset?.page||'',resetVisible()?'reset':'no-reset'].join('|');
 return `${title}|${name}`;
}
function headerHtml(title){
 const p=readProfile();
 const first=p.vorname||p.firstName||'';
 const last=p.nachname||p.lastName||'';
 const name=(`${first} ${last}`).trim()||'Schüler/in';
 const course=p.kurs||p.kursnummer||p.courseCode||'';
 const dash=dashboardHref();
 const overview=`uebersicht.html?v=${VERSION}`;
 const reset=resetVisible();
 return `<div class="topbar-main"><a class="brand" href="/index.html" data-sp-href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${esc(title)} · A1 Lektion 7 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}${course?' · '+esc(course):''}</span><a class="account-link" href="${dash}" data-sp-href="${dash}">Dashboard</a><a class="account-link" href="/profile/index.html" data-sp-href="/profile/index.html">Profil</a><button class="account-link account-btn" type="button" data-sp-action="logout">Abmelden</button></div></div><nav class="nav"><button class="btn secondary" type="button" data-sp-action="back" data-sp-fallback="${navBack()}">← Zurück</button><a class="btn secondary" href="${overview}" data-sp-href="${overview}">Übersicht</a>${reset?'<button class="btn danger-btn" type="button" data-sp-action="reset">Fortschritte löschen</button>':''}</nav>`;
}
function installHeader(){
 const title=pageTitle();
 const key=headerKey(title);
 document.querySelectorAll('.topbar:not(.sp-standard-topbar)').forEach(h=>h.remove());
 const existing=document.querySelector('.topbar.sp-standard-topbar');
 if(existing){
  if(existing.dataset.renderKey===key)return;
  existing.innerHTML=headerHtml(title);
  existing.dataset.renderKey=key;
  return;
 }
 const container=document.querySelector('#app .container')||document.querySelector('.container')||document.getElementById('app')||document.body;
 const h=document.createElement('header');
 h.className='topbar sp-standard-topbar';
 h.dataset.standard='1';
 h.dataset.renderKey=key;
 h.innerHTML=headerHtml(title);
 if(container===document.body)document.body.prepend(h);else container.prepend(h);
}
function installHeaderStyle(){
 if(document.getElementById('l7-standard-header-style'))return;
 const style=document.createElement('style');
 style.id='l7-standard-header-style';
 style.textContent=`:root{--lesson-main:#7c3aed;--lesson-main-dark:#4c1d95;--lesson-soft:#f5f0ff;--lesson-line:#d8b4fe;--lesson-bg:#f7f2ff;--muted:#667085}html,body.l7t1-l6t4{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}body.l7t1-l6t4 .topbar.sp-standard-topbar{max-width:1120px!important;margin:18px auto!important;padding:16px!important;background:#fff!important;border:2px solid var(--lesson-line)!important;border-radius:24px!important;box-shadow:0 8px 22px rgba(76,29,149,.10)!important;color:#172033!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .topbar-main{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;flex-wrap:wrap!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .brand{display:flex!important;align-items:center!important;gap:12px!important;color:inherit!important;text-decoration:none!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .logo{width:auto!important;height:auto!important;background:transparent!important;border:0!important;border-radius:0!important;padding:0!important;box-shadow:none!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .logo img{width:54px!important;height:54px!important;object-fit:contain!important;border-radius:14px!important;background:#fff!important}body.l7t1-l6t4 .topbar.sp-standard-topbar h1{margin:0!important;font-size:26px!important;line-height:1.1!important;color:var(--lesson-main-dark)!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .subtitle{margin-top:2px!important;font-size:14px!important;font-weight:700!important;color:var(--muted)!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .account-tools{display:flex!important;gap:8px!important;flex-wrap:wrap!important;align-items:center!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .account-pill,body.l7t1-l6t4 .topbar.sp-standard-topbar .account-link{background:var(--lesson-soft)!important;border:1px solid var(--lesson-line)!important;border-radius:999px!important;padding:8px 12px!important;font-weight:800!important;font-size:15px!important;color:var(--lesson-main-dark)!important;text-decoration:none!important;box-shadow:none!important;line-height:1.2!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .nav{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:wrap!important;margin-top:14px!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .btn.secondary{display:inline-flex!important;align-items:center!important;justify-content:center!important;background:#fff!important;color:var(--lesson-main-dark)!important;border:2px solid var(--lesson-main-dark)!important;border-radius:999px!important;padding:10px 16px!important;font-size:15px!important;font-weight:900!important;line-height:1.2!important;text-decoration:none!important;box-shadow:none!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .danger-btn{background:#fff!important;color:#991b1b!important;border:2px solid #ef4444!important;border-radius:999px!important;padding:10px 16px!important;font-weight:900!important;box-shadow:none!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .account-btn{cursor:pointer!important;font:inherit!important}@media(max-width:700px){body.l7t1-l6t4 .topbar.sp-standard-topbar{margin:8px 6px 14px!important;padding:14px!important;border-radius:20px!important}body.l7t1-l6t4 .topbar.sp-standard-topbar h1{font-size:22px!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .logo img{width:48px!important;height:48px!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .account-tools{display:flex!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .nav{gap:8px!important}body.l7t1-l6t4 .topbar.sp-standard-topbar .btn.secondary,body.l7t1-l6t4 .topbar.sp-standard-topbar .danger-btn,body.l7t1-l6t4 .topbar.sp-standard-topbar .account-link{padding:9px 12px!important;font-size:14px!important}}`;
 document.head.appendChild(style);
}
document.addEventListener('click',event=>{
 const target=event.target.closest('.sp-standard-topbar [data-sp-action],.sp-standard-topbar [data-sp-href]');
 if(!target)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 const action=target.dataset.spAction||'';
 if(action==='back'){window.spGoBack(target.dataset.spFallback||navBack());return;}
 if(action==='logout'){window.spLogout();return;}
 if(action==='reset'){if(typeof window.resetThemeProgress==='function')window.resetThemeProgress();return;}
 const href=target.dataset.spHref||target.getAttribute('href');
 if(href)location.href=href;
},true);
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
function applyStandard(){
 installHeaderStyle();
 if(headerTimer)return;
 headerTimer=setTimeout(()=>{headerTimer=null;installHeader()},0);
}
document.addEventListener('DOMContentLoaded',applyStandard);
new MutationObserver(()=>applyStandard()).observe(document.documentElement,{childList:true,subtree:true});
window.L7T1BunnyWordAudio={play};
})();