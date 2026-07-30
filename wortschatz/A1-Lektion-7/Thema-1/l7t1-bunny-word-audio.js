(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const DIRS=[CDN+'audio/',CDN+'Audio/'];
let current=null;
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
 if(history.length>1){history.back();return;}
 location.href=fallbackHref||'index.html';
};
function headerTitle(existing){
 const text=String(existing?.querySelector('.subtitle')?.textContent||'').trim();
 return (text.split('· A1 Lektion 7')[0]||'Lektion 7 · Thema 1').trim();
}
function installHeader(){
 const h=document.querySelector('.topbar');
 if(!h||h.dataset.spL6t2Header==='1')return;
 const p=readProfile();
 const first=p.vorname||p.firstName||'';
 const last=p.nachname||p.lastName||'';
 const name=(`${first} ${last}`).trim()||'Schüler/in';
 const course=p.kurs||p.kursnummer||p.courseCode||'';
 const page=document.body?.dataset?.page||'';
 const back=page==='theme'?'../index.html':'index.html';
 const title=headerTitle(h);
 h.dataset.spL6t2Header='1';
 h.innerHTML=`<div class="topbar-main"><a class="brand" href="/index.html"><div class="logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>SprachPilot</h1><div class="subtitle">${esc(title)} · A1 Lektion 7 · Thema 1</div></div></a><div class="account-tools"><span class="account-pill">${esc(name)}${course?' · '+esc(course):''}</span><a class="account-link" href="${dashboardHref()}">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" type="button" onclick="spLogout()">Abmelden</button></div></div><nav class="nav"><button class="btn secondary" type="button" onclick="spGoBack('${back}')">← Zurück</button><a class="btn secondary" href="uebersicht.html?v=l7t1-bunny-audio3">Übersicht</a></nav>`;
}
function installHeaderStyle(){
 if(document.getElementById('l7-l6t2-header-style'))return;
 const style=document.createElement('style');
 style.id='l7-l6t2-header-style';
 style.textContent=`:root{--lesson-main:#8f6bc8;--lesson-main-dark:#4c1d95;--lesson-soft:#f4efff;--lesson-line:#cbb7f0;--lesson-bg:#f7f2ff}body.l7t1-l6t4{background:linear-gradient(180deg,var(--lesson-bg),#fff)!important}.topbar{background:#fff;border:2px solid var(--lesson-line);border-radius:24px;box-shadow:0 8px 22px rgba(76,29,149,.12)}.account-btn{cursor:pointer;font:inherit}`;
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
document.addEventListener('DOMContentLoaded',()=>{installHeaderStyle();installHeader()});
new MutationObserver(()=>{installHeaderStyle();installHeader()}).observe(document.documentElement,{childList:true,subtree:true});
window.L7T1BunnyWordAudio={play};
})();