import { getEffectiveProfile, dashboardHref, logout, safeText } from '/js/auth.js';

function injectTopbarCss(){
  if(document.getElementById('sp-topbar-standard-css'))return;
  const style=document.createElement('style');
  style.id='sp-topbar-standard-css';
  style.textContent=`
    header.topbar .sp-standard-logo,header.topbar .brand .sp-standard-logo,header.topbar .brand .logo{width:58px!important;height:58px!important;min-width:58px!important;max-width:58px!important;min-height:58px!important;max-height:58px!important;flex:0 0 58px!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:16px!important;}
    header.topbar .sp-standard-logo img,header.topbar .brand .sp-standard-logo img,header.topbar .brand .logo img,header.topbar img[src*="sprachpilot-logo"]{width:52px!important;height:52px!important;min-width:52px!important;max-width:52px!important;min-height:52px!important;max-height:52px!important;object-fit:contain!important;display:block!important;}
    header.topbar .brand{display:flex!important;align-items:center!important;gap:14px!important;}
    header.topbar{width:100%!important;}
  `;
  document.head.appendChild(style);
}
function profileName(){const p=getEffectiveProfile()||{};const name=[p.vorname||p.firstName||'',p.nachname||p.lastName||''].join(' ').trim();const course=p.kurs||p.kursnummer||p.courseCode||'';return (name||'Schüler/in')+(course?' · '+course:'')}
function pageInfo(header){const oldTitle=header?.querySelector('h1')?.textContent?.trim()||'SprachPilot';const oldSub=header?.querySelector('.subtitle,.sp-subtitle')?.textContent?.trim()||document.title||'';return {title:oldTitle,subtitle:oldSub}}
function path(){return location.pathname}
function isTeacherPage(){return /\/teacher\//.test(path())}
function isWortschatzPage(){return /\/wortschatz\/A\d-Lektion-\d+\//.test(path())}
function isWortschatzLessonPage(){return /\/wortschatz\/A\d-Lektion-\d+\/?(?:index\.html)?$/.test(path())}
function isThemePage(){return /\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\//.test(path())}
function isTaskPage(){return isThemePage()&&!/\/index\.html$/.test(path())&&!/\/Thema-\d+\/$/.test(path())}
function isVerbenPage(){return /\/verben-A1\//.test(path())}
function isFragenPage(){return /\/fragen-A1\//.test(path())||/\/fragen\//.test(path())}
function backHref(){if(isTaskPage())return 'index.html';if(isThemePage())return '../index.html';if(isWortschatzLessonPage())return '../index.html';if(isVerbenPage()||isFragenPage())return '/index.html';return 'javascript:history.back()'}
function normLabel(s){return String(s||'').replace(/[←↩🔙📊👤🚪]/g,'').replace(/\s+/g,' ').trim().toLowerCase()}
function normalizeBackText(el){if(el&&/zurück/i.test(el.textContent||''))el.textContent='← Zurück'}
function removeDuplicateBackButtons(){document.querySelectorAll('.container > .actions,.page > .actions,.actions').forEach(box=>{if(box.closest('.topbar'))return;const links=[...box.querySelectorAll('a,button')];const text=(box.textContent||'').replace(/\s+/g,' ').trim();if(links.length===1&&/zurück/i.test(text))box.remove()});document.querySelectorAll('a,button').forEach(normalizeBackText)}
function existingNavLinks(header){const nav=header?.querySelector('nav,.nav,.lesson-nav');const items=[];if(nav){[...nav.querySelectorAll('a,button')].forEach(el=>{const txt=(el.textContent||'').trim();if(!txt)return;if(/dashboard|profil|abmelden/i.test(txt))return;if(/zurück/i.test(txt))return;if(el.tagName==='A')items.push({type:'a',text:txt,href:el.getAttribute('href')||'#'});else items.push({type:'button',text:txt,onclick:el.getAttribute('onclick')||''})})}return items}
function pageNavFallback(){
  const list=[];
  if(isWortschatzPage()){
    list.push({type:'a',text:'Übersicht',href:'uebersicht.html'});
    list.push({type:'a',text:'Statistik',href:'statistik.html'});
    if(isThemePage())list.push({type:'button',text:'Fortschritte löschen',onclick:'resetThemeProgress()'});
  }
  if(isVerbenPage()){
    list.push({type:'a',text:'Übersicht',href:'index.html'});
    list.push({type:'button',text:'Fortschritte löschen',onclick:'resetCurrentPackage()'});
  }
  if(isFragenPage()){
    list.push({type:'a',text:'Übersicht',href:'index.html'});
    list.push({type:'button',text:'Fortschritte löschen',onclick:'resetEverything()'});
  }
  return list;
}
function mergeNavItems(existing,fallback){
  const out=[];
  const seen=new Set();
  [{type:'a',text:'← Zurück',href:backHref()},...existing,...fallback].forEach(item=>{
    const key=normLabel(item.text);
    if(!key||seen.has(key))return;
    seen.add(key);
    out.push(item);
  });
  return out;
}
function navHtml(items){return items.map(item=>item.type==='button'?'<button class="btn secondary" type="button" onclick="'+safeText(item.onclick||'')+'">'+safeText(item.text)+'</button>':'<a class="btn secondary" href="'+safeText(item.href||'#')+'">'+safeText(item.text)+'</a>').join('')}
function findLegacyHeader(){return document.querySelector('header.sp-shell, header:has(.sp-head), header:has(.sp-brand), header:has(.teacher-top), #spHeader.topbar, header.topbar')}
function ensureHeader(){let legacy=findLegacyHeader();if(legacy){legacy.classList.add('topbar');return legacy}const container=document.querySelector('.container')||document.querySelector('.page')||document.body;const header=document.createElement('header');header.className='topbar';container.insertBefore(header,container.firstChild);return header}
function removeLegacyHeaders(keep){document.querySelectorAll('header.sp-shell, header, #spHeader').forEach(h=>{if(h===keep)return;if(h.dataset.spStandardTopbar==='1')return;if(h.classList.contains('sp-shell')||h.querySelector('.sp-head')||h.querySelector('.sp-brand')||h.id==='spHeader'||h.classList.contains('topbar'))h.remove()})}
function renderTopbar(){injectTopbarCss();if(document.body.classList.contains('teacher-dashboard')||isTeacherPage())return;const header=ensureHeader();const info=pageInfo(header);const navItems=mergeNavItems(existingNavLinks(header),pageNavFallback());header.className='topbar';header.innerHTML='<div class="topbar-main sp-account-row"><a class="brand" href="/index.html"><div class="logo sp-standard-logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>'+safeText(info.title)+'</h1><div class="subtitle">'+safeText(info.subtitle)+'</div></div></a><div class="account-tools"><span class="account-pill">'+safeText(profileName())+'</span><a class="account-link" href="'+safeText(dashboardHref())+'">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" type="button" id="spGlobalLogout">Abmelden</button></div></div><nav class="nav sp-page-nav">'+navHtml(navItems)+'</nav>';header.dataset.spStandardTopbar='1';const btn=header.querySelector('#spGlobalLogout');if(btn)btn.addEventListener('click',logout);removeLegacyHeaders(header);removeDuplicateBackButtons()}
function run(){try{renderTopbar()}catch(e){console.warn('topbar standard failed',e)}}
run();document.addEventListener('DOMContentLoaded',run);setTimeout(run,100);setTimeout(run,500);setTimeout(run,1200);setTimeout(run,2500);
