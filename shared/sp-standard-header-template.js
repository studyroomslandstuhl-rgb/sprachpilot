/*
  SprachPilot Standard-Header Muster
  Stand: 2026-07-30

  Zweck:
  - Diese Datei ist eine Vorlage fuer neue/umgebaute Themen.
  - Nicht direkt global einbinden, bevor eine Seite bewusst migriert wurde.
  - Design und Funktionen sollen unveraendert bleiben.

  Pflicht-HTML:
  <body class="sp-standard-page" data-page="theme" data-lesson="7" data-theme="1">
  <div id="app"></div>
  <script src="/shared/sp-standard-header-template.js?v=YYYYMMDD"></script>

  data-page:
  - lesson   = Lektionsuebersicht
  - theme    = Themenuebersicht
  - overview = Wort-/Aufgabenuebersicht
  - task     = einzelne Aufgabe
*/
(function(){
'use strict';

const SP_HEADER_VERSION='sp-header-template-20260730';
let headerTimer=null;

const DEFAULTS={
  lessonTitle:'SprachPilot',
  subtitle:'Deutsch lernen',
  lessonColor:'#7c3aed',
  lessonDark:'#4c1d95',
  lessonSoft:'#f5f0ff',
  lessonLine:'#d8b4fe',
  lessonBg:'#f7f2ff',
  logo:'/assets/logo/sprachpilot-logo.png',
  homeHref:'/index.html',
  profileHref:'/profile/index.html',
  dashboardStudentHref:'/student-dashboard/index.html',
  dashboardTeacherHref:'/teacher/index.html'
};

function safe(value){
  return String(value||'')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

function readJson(key){
  try{return JSON.parse(localStorage.getItem(key)||sessionStorage.getItem(key)||'null')||null;}
  catch(e){return null;}
}

function loginRole(){
  return localStorage.getItem('SP_LOGIN_ROLE')||sessionStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_USER_ROLE')||'';
}

function activeProfile(){
  const role=loginRole();
  if(role==='teacher')return readJson('SP_TEACHER_PROFILE')||readJson('SP_USER_PROFILE')||{};
  return readJson('SP_STUDENT_PROFILE')||readJson('SP_USER_PROFILE')||readJson('SP_TEACHER_PROFILE')||{};
}

function dashboardHref(config){
  return loginRole()==='teacher'?config.dashboardTeacherHref:config.dashboardStudentHref;
}

function logout(){
  [
    'SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_USER_PROFILE','SP_STUDENT_PROFILE',
    'SP_TEACHER_PROFILE','SP_KEEP_LOGGED_IN','SP_TEACHER_EMAIL','SP_TEACHER_ID','SP_TEACHER_UID',
    'SP_TEACHER_PREVIEW','SP_TEACHER_PREVIEW_COURSE','SP_PREVIEW_COURSE','SP_PREVIEW_MODE','SP_TEACHER_MODE'
  ].forEach(function(key){localStorage.removeItem(key);sessionStorage.removeItem(key);});
  location.href='/index.html';
}

function goBack(fallbackHref){
  const fallback=fallbackHref||'/index.html';
  try{
    const ref=document.referrer?new URL(document.referrer):null;
    const here=new URL(location.href);
    if(ref&&ref.origin===here.origin&&ref.href!==here.href&&history.length>1){history.back();return;}
  }catch(e){}
  location.href=fallback;
}

function pageKind(){return document.body?.dataset?.page||'theme';}

function defaultBackHref(){
  const kind=pageKind();
  if(kind==='lesson')return '/wortschatz/index.html';
  if(kind==='theme')return '../index.html';
  return 'index.html';
}

function headerConfig(){
  const custom=window.SP_STANDARD_HEADER||{};
  return Object.assign({},DEFAULTS,custom);
}

function resetVisible(){
  return typeof window.resetThemeProgress==='function'&&pageKind()!=='task';
}

function headerKey(config){
  const p=activeProfile();
  return [
    config.lessonTitle,config.subtitle,config.lessonColor,config.lessonDark,config.overviewHref||'',
    pageKind(),resetVisible()?'reset':'no-reset',loginRole(),p.vorname||p.firstName||'',
    p.nachname||p.lastName||'',p.kurs||p.kursnummer||p.courseCode||''
  ].join('|');
}

function headerHtml(config){
  const p=activeProfile();
  const first=p.vorname||p.firstName||'';
  const last=p.nachname||p.lastName||'';
  const name=(`${first} ${last}`).trim()||(loginRole()==='teacher'?'Lehrer/in':'Schueler/in');
  const course=p.kurs||p.kursnummer||p.courseCode||'';
  const dash=dashboardHref(config);
  const back=config.backHref||defaultBackHref();
  const overview=config.overviewHref||'';
  const reset=resetVisible();
  return `<div class="sp-standard-topbar-main">
    <a class="sp-standard-brand" href="${safe(config.homeHref)}" data-sp-href="${safe(config.homeHref)}">
      <img class="sp-standard-logo" src="${safe(config.logo)}" alt="SprachPilot">
      <div><h1>SprachPilot</h1><div class="sp-standard-subtitle">${safe(config.lessonTitle)} · ${safe(config.subtitle)}</div></div>
    </a>
    <div class="sp-standard-account">
      <span class="sp-standard-pill">${safe(name)}${course?' · '+safe(course):''}</span>
      <a class="sp-standard-btn" href="${safe(dash)}" data-sp-href="${safe(dash)}">Dashboard</a>
      <a class="sp-standard-btn" href="${safe(config.profileHref)}" data-sp-href="${safe(config.profileHref)}">Profil</a>
      <button class="sp-standard-btn" type="button" data-sp-action="logout">Abmelden</button>
    </div>
  </div>
  <nav class="sp-standard-nav">
    <button class="sp-standard-btn" type="button" data-sp-action="back" data-sp-fallback="${safe(back)}">← Zurück</button>
    ${overview?`<a class="sp-standard-btn" href="${safe(overview)}" data-sp-href="${safe(overview)}">Übersicht</a>`:''}
    ${reset?'<button class="sp-standard-btn sp-standard-danger" type="button" data-sp-action="reset">Fortschritte löschen</button>':''}
  </nav>`;
}

function installStyle(config){
  if(document.getElementById('sp-standard-header-template-style'))return;
  const style=document.createElement('style');
  style.id='sp-standard-header-template-style';
  style.textContent=`:root{--sp-lesson-main:${config.lessonColor};--sp-lesson-dark:${config.lessonDark};--sp-lesson-soft:${config.lessonSoft};--sp-lesson-line:${config.lessonLine};--sp-lesson-bg:${config.lessonBg};--sp-muted:#667085}html,body.sp-standard-page{background:linear-gradient(180deg,var(--sp-lesson-bg),#fff)!important}.sp-standard-topbar{max-width:1120px!important;margin:18px auto!important;padding:16px!important;background:#fff!important;border:2px solid var(--sp-lesson-line)!important;border-radius:24px!important;box-shadow:0 8px 22px rgba(76,29,149,.10)!important;color:#172033!important}.sp-standard-topbar-main{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;flex-wrap:wrap!important}.sp-standard-brand{display:flex!important;align-items:center!important;gap:12px!important;color:inherit!important;text-decoration:none!important}.sp-standard-logo{width:54px!important;height:54px!important;object-fit:contain!important;border-radius:14px!important;background:#fff!important}.sp-standard-topbar h1{margin:0!important;font-size:26px!important;line-height:1.1!important;color:var(--sp-lesson-dark)!important}.sp-standard-subtitle{margin-top:2px!important;font-size:14px!important;font-weight:700!important;color:var(--sp-muted)!important}.sp-standard-account{display:flex!important;gap:8px!important;flex-wrap:wrap!important;align-items:center!important}.sp-standard-pill,.sp-standard-btn{background:var(--sp-lesson-soft)!important;border:1px solid var(--sp-lesson-line)!important;border-radius:999px!important;padding:8px 12px!important;font-weight:800!important;font-size:15px!important;color:var(--sp-lesson-dark)!important;text-decoration:none!important;box-shadow:none!important;line-height:1.2!important;cursor:pointer!important;font-family:inherit!important}.sp-standard-nav{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:wrap!important;margin-top:14px!important}.sp-standard-nav .sp-standard-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;background:#fff!important;border:2px solid var(--sp-lesson-dark)!important;padding:10px 16px!important;font-weight:900!important}.sp-standard-danger{color:#991b1b!important;border-color:#ef4444!important}@media(max-width:700px){.sp-standard-topbar{margin:8px 6px 14px!important;padding:14px!important;border-radius:20px!important}.sp-standard-topbar h1{font-size:22px!important}.sp-standard-logo{width:48px!important;height:48px!important}.sp-standard-nav{gap:8px!important}.sp-standard-btn,.sp-standard-pill{padding:9px 12px!important;font-size:14px!important}}`;
  document.head.appendChild(style);
}

function installHeader(){
  const config=headerConfig();
  installStyle(config);
  document.querySelectorAll('.topbar:not(.sp-standard-topbar),.sp-old-header,.old-header').forEach(function(el){el.remove();});
  const key=headerKey(config);
  let header=document.querySelector('.sp-standard-topbar');
  if(header){
    if(header.dataset.renderKey===key)return;
    header.innerHTML=headerHtml(config);
    header.dataset.renderKey=key;
    return;
  }
  header=document.createElement('header');
  header.className='sp-standard-topbar';
  header.dataset.version=SP_HEADER_VERSION;
  header.dataset.renderKey=key;
  header.innerHTML=headerHtml(config);
  const container=document.querySelector('#app .container')||document.querySelector('.container')||document.getElementById('app')||document.body;
  if(container===document.body)document.body.prepend(header);else container.prepend(header);
}

function scheduleHeader(){
  if(headerTimer)return;
  headerTimer=setTimeout(function(){headerTimer=null;installHeader();},0);
}

document.addEventListener('click',function(event){
  const target=event.target.closest('.sp-standard-topbar [data-sp-action],.sp-standard-topbar [data-sp-href]');
  if(!target)return;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  const action=target.dataset.spAction||'';
  if(action==='back'){goBack(target.dataset.spFallback||defaultBackHref());return;}
  if(action==='logout'){logout();return;}
  if(action==='reset'){if(typeof window.resetThemeProgress==='function')window.resetThemeProgress();return;}
  const href=target.dataset.spHref||target.getAttribute('href');
  if(href)location.href=href;
},true);

document.addEventListener('DOMContentLoaded',scheduleHeader);
new MutationObserver(scheduleHeader).observe(document.documentElement,{childList:true,subtree:true});

window.SprachPilotStandardHeader={install:installHeader,goBack:goBack,logout:logout,version:SP_HEADER_VERSION};
})();
