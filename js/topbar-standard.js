import { getEffectiveProfile, dashboardHref, logout, safeText } from '/js/auth.js';

function injectTopbarCss(){
  if(document.getElementById('sp-topbar-standard-css'))return;
  const style=document.createElement('style');
  style.id='sp-topbar-standard-css';
  style.textContent=`
    header.topbar{width:100%!important;background:rgba(255,255,255,.96)!important;border:1px solid var(--lesson-line,var(--sp-line,#D9EEF7))!important;border-radius:24px!important;padding:16px 18px!important;margin:0 0 18px 0!important;box-shadow:var(--lesson-shadow,var(--sp-shadow,0 14px 34px rgba(18,48,71,.12)))!important;display:flex!important;flex-direction:column!important;gap:14px!important;}
    header.topbar .topbar-main,header.topbar .sp-account-row{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:14px!important;flex-wrap:wrap!important;}
    header.topbar .brand{display:flex!important;align-items:center!important;gap:14px!important;text-decoration:none!important;color:var(--lesson-text,var(--sp-dark,#123047))!important;min-width:0!important;}
    header.topbar .brand h1{font-size:30px!important;line-height:1.05!important;margin:0!important;color:var(--lesson-text,var(--sp-dark,#123047))!important;font-weight:900!important;}
    header.topbar .brand .subtitle{font-size:15px!important;color:var(--lesson-muted,var(--sp-muted,#5F7180))!important;line-height:1.35!important;margin-top:3px!important;}
    header.topbar .sp-standard-logo,header.topbar .brand .sp-standard-logo,header.topbar .brand .logo{width:58px!important;height:58px!important;min-width:58px!important;max-width:58px!important;min-height:58px!important;max-height:58px!important;flex:0 0 58px!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:16px!important;background:white!important;border:2px solid var(--lesson-line,var(--sp-line,#D9EEF7))!important;box-shadow:0 8px 18px rgba(18,48,71,.10)!important;}
    header.topbar .sp-standard-logo img,header.topbar .brand .sp-standard-logo img,header.topbar .brand .logo img,header.topbar img[src*="sprachpilot-logo"]{width:52px!important;height:52px!important;min-width:52px!important;max-width:52px!important;min-height:52px!important;max-height:52px!important;object-fit:contain!important;display:block!important;}
    header.topbar .account-tools{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;flex-wrap:wrap!important;}
    header.topbar .account-pill{background:var(--lesson-soft,#EFFAFF)!important;border:2px solid var(--lesson-line,var(--sp-line,#D9EEF7))!important;border-radius:999px!important;padding:8px 12px!important;color:var(--lesson-main-dark,var(--sp-blue-dark,#2F7F96))!important;font-weight:900!important;line-height:1.2!important;}
    header.topbar .account-link,header.topbar .account-btn,header.topbar .btn,header.topbar .sp-page-nav a,header.topbar .sp-page-nav button{border:2px solid var(--lesson-line,var(--sp-line,#D9EEF7))!important;background:#fff!important;color:var(--lesson-main-dark,var(--sp-blue-dark,#2F7F96))!important;border-radius:14px!important;padding:10px 14px!important;font-size:15px!important;font-weight:900!important;text-decoration:none!important;cursor:pointer!important;font-family:Arial,Helvetica,sans-serif!important;box-shadow:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;min-height:42px!important;width:auto!important;}
    header.topbar .account-link:hover,header.topbar .account-btn:hover,header.topbar .btn:hover,header.topbar .sp-page-nav a:hover,header.topbar .sp-page-nav button:hover{transform:translateY(-1px)!important;box-shadow:0 6px 14px rgba(18,48,71,.10)!important;}
    header.topbar .nav,header.topbar .sp-page-nav{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:wrap!important;border-top:1px solid var(--lesson-line,var(--sp-line,#D9EEF7))!important;padding-top:12px!important;margin-top:0!important;}
    #accountStrip.sp-hidden-by-topbar,.account-strip.sp-hidden-by-topbar{display:none!important;height:0!important;min-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:0!important;}
    @media(max-width:700px){header.topbar .topbar-main,header.topbar .sp-account-row{align-items:flex-start!important;}header.topbar .account-tools{justify-content:flex-start!important;}header.topbar .brand h1{font-size:24px!important;}header.topbar .sp-page-nav a,header.topbar .sp-page-nav button,header.topbar .account-link,header.topbar .account-btn{width:auto!important;}}
  `;
  document.head.appendChild(style);
}
function profileName(){const p=getEffectiveProfile()||{};const name=[p.vorname||p.firstName||'',p.nachname||p.lastName||''].join(' ').trim();const course=p.kurs||p.kursnummer||p.courseCode||'';return (name||'Schüler/in')+(course?' · '+course:'')}
function path(){return location.pathname}
function isTeacherPage(){return /\/teacher\//.test(path())}
function isDashboardPage(){return /\/student-dashboard\//.test(path())}
function isWortschatzRoot(){return /^\/wortschatz\/?(?:index\.html)?$/i.test(path())}
function isWortschatzPage(){return /\/wortschatz\/A\d-Lektion-\d+\//.test(path())}
function isWortschatzLessonPage(){return /\/wortschatz\/A\d-Lektion-\d+\/?(?:index\.html)?$/.test(path())}
function isThemePage(){return /\/wortschatz\/A\d-Lektion-\d+\/Thema-\d+\//.test(path())}
function isTaskPage(){return isThemePage()&&!/\/index\.html$/.test(path())&&!/\/Thema-\d+\/$/.test(path())}
function isVerbenPage(){return /\/verben-A1\//.test(path())}
function isFragenPage(){return /\/fragen-A1\//.test(path())||/\/fragen\//.test(path())}
function pageInfo(header){
  if(isWortschatzRoot())return {title:'Wortschatz',subtitle:'Schritte Plus Neu - A1, A2 und B1'};
  const oldTitle=header?.querySelector('h1')?.textContent?.trim()||document.querySelector('.hero h1')?.textContent?.trim()||'SprachPilot';
  const oldSub=header?.querySelector('.subtitle,.sp-subtitle,.sub')?.textContent?.trim()||document.querySelector('.hero .subtitle,.hero .sub')?.textContent?.trim()||document.title||'';
  return {title:oldTitle,subtitle:oldSub};
}
function backHref(){if(isDashboardPage())return '/index.html';if(isWortschatzRoot())return '/index.html';if(isTaskPage())return 'index.html';if(isThemePage())return '../index.html';if(isWortschatzLessonPage())return '../index.html';if(isVerbenPage()||isFragenPage())return '/index.html';return 'javascript:history.back()'}
function normLabel(s){return String(s||'').replace(/[←↩🔙📊👤🚪]/g,'').replace(/\s+/g,' ').trim().toLowerCase()}
function normalizeBackText(el){if(el&&/zurück/i.test(el.textContent||''))el.textContent='← Zurück'}
function hideLegacyAccountStrip(){document.querySelectorAll('#accountStrip,.account-strip').forEach(el=>{if(el.closest('header.topbar'))return;el.innerHTML='';el.classList.add('sp-hidden-by-topbar');el.style.display='none';el.style.height='0';el.style.overflow='hidden';})}
function removeDuplicateBackButtons(){document.querySelectorAll('.container > .actions,.page > .actions,.actions,.wrap > .actions').forEach(box=>{if(box.closest('.topbar'))return;const links=[...box.querySelectorAll('a,button')];const text=(box.textContent||'').replace(/\s+/g,' ').trim();if(links.length===1&&/zurück/i.test(text))box.remove()});document.querySelectorAll('a,button').forEach(normalizeBackText)}
function removeDuplicateModuleHero(){if(!isWortschatzRoot())return;document.querySelectorAll('.container > .hero').forEach(hero=>hero.remove())}
function removeGeneratedLegacyTopbars(keep){document.querySelectorAll('.hero > .topbar,.hero header.topbar').forEach(h=>{if(h!==keep&&h.dataset.spStandardTopbar!=='1')h.remove()})}
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
function mergeNavItems(existing,fallback){const out=[];const seen=new Set();[{type:'a',text:'← Zurück',href:backHref()},...existing,...fallback].forEach(item=>{const key=normLabel(item.text);if(!key||seen.has(key))return;seen.add(key);out.push(item)});return out}
function navHtml(items){return items.map(item=>item.type==='button'?'<button class="btn secondary" type="button" onclick="'+safeText(item.onclick||'')+'">'+safeText(item.text)+'</button>':'<a class="btn secondary" href="'+safeText(item.href||'#')+'">'+safeText(item.text)+'</a>').join('')}
function findLegacyHeader(){return document.querySelector('header.top, header.sp-shell, header:has(.sp-head), header:has(.sp-brand), header:has(.teacher-top), #spHeader.topbar, header.topbar')}
function ensureHeader(){let legacy=findLegacyHeader();if(legacy){legacy.classList.add('topbar');return legacy}const container=document.querySelector('.container')||document.querySelector('.wrap')||document.querySelector('.page')||document.body;if(!container)return null;const header=document.createElement('header');header.className='topbar';container.insertBefore(header,container.firstChild);return header}
function removeLegacyHeaders(keep){document.querySelectorAll('header.top, header.sp-shell, header, #spHeader').forEach(h=>{if(h===keep)return;if(h.dataset.spStandardTopbar==='1')return;if(h.classList.contains('top')||h.classList.contains('sp-shell')||h.querySelector('.sp-head')||h.querySelector('.sp-brand')||h.id==='spHeader'||h.classList.contains('topbar'))h.remove()})}
function renderTopbar(){
  injectTopbarCss();
  if(document.body.classList.contains('teacher-dashboard')||isTeacherPage())return;
  if(document.readyState==='loading'&&!document.querySelector('.container,.wrap,.page'))return;
  hideLegacyAccountStrip();
  const header=ensureHeader();
  if(!header)return;
  const info=pageInfo(header);
  const navItems=mergeNavItems(existingNavLinks(header),pageNavFallback());
  header.className='topbar';
  header.innerHTML='<div class="topbar-main sp-account-row"><a class="brand" href="/index.html"><div class="logo sp-standard-logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot"></div><div><h1>'+safeText(info.title)+'</h1><div class="subtitle">'+safeText(info.subtitle)+'</div></div></a><div class="account-tools"><span class="account-pill">'+safeText(profileName())+'</span><span id="userPill" style="display:none">'+safeText(profileName())+'</span><a class="account-link" href="'+safeText(dashboardHref())+'">Dashboard</a><a class="account-link" href="/profile/index.html">Profil</a><button class="account-link account-btn" type="button" id="spGlobalLogout">Abmelden</button></div></div><nav class="nav sp-page-nav">'+navHtml(navItems)+'</nav>';
  header.dataset.spStandardTopbar='1';
  const btn=header.querySelector('#spGlobalLogout');
  if(btn)btn.addEventListener('click',logout);
  removeLegacyHeaders(header);
  removeGeneratedLegacyTopbars(header);
  removeDuplicateModuleHero();
  removeDuplicateBackButtons();
}
function run(){try{renderTopbar()}catch(e){console.warn('topbar standard failed',e)}}
run();document.addEventListener('DOMContentLoaded',run);setTimeout(run,100);setTimeout(run,500);setTimeout(run,1200);setTimeout(run,2500);