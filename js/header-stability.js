(function(){
  if(window.SP_HEADER_STABILITY_LOADED_V2)return;
  window.SP_HEADER_STABILITY_LOADED_V2=true;
  var css=`
    :root{--sp-header-logo:72px;--sp-header-gap:14px;--sp-header-radius:28px;--sp-header-min:332px;}
    html{overflow-y:scroll;}
    body{overflow-anchor:none;}
    .topbar,.hero,.sp-header-stable{box-sizing:border-box;contain:layout paint;transition:none!important;animation:none!important;}
    .topbar{min-height:var(--sp-header-min)!important;transition:none!important;animation:none!important;}
    .topbar:empty{display:block!important;min-height:var(--sp-header-min)!important;}
    .topbar:empty::before{content:"";display:block;height:100%;min-height:var(--sp-header-min)!important;border-radius:var(--sp-header-radius);background:rgba(255,255,255,.72);box-shadow:0 18px 44px rgba(8,30,45,.08);}
    .hero{min-height:190px;}
    .sp-fallback-header,.topbar-main,.sp-topbar-main,.teacher-top,.sp-account-row{display:flex;align-items:flex-start;gap:var(--sp-header-gap);min-height:92px!important;box-sizing:border-box;transition:none!important;}
    .brand,.sp-brand,.teacher-brand,.brand-logo,.sp-fallback-brand{display:grid!important;grid-template-columns:var(--sp-header-logo) minmax(0,1fr);align-items:center;gap:16px;min-height:92px!important;min-width:0;text-decoration:none;}
    .logo,.brand-logo,.sp-logo-wrap,.sp-fallback-logo{width:var(--sp-header-logo)!important;height:var(--sp-header-logo)!important;min-width:var(--sp-header-logo)!important;min-height:var(--sp-header-logo)!important;display:grid!important;place-items:center;overflow:hidden;box-sizing:border-box;}
    .logo img,.brand img,.sp-brand img,.sp-logo-img,.teacher-brand img,.logo-wrap img,.sp-fallback-logo img{width:var(--sp-header-logo)!important;height:var(--sp-header-logo)!important;max-width:var(--sp-header-logo)!important;max-height:var(--sp-header-logo)!important;object-fit:contain;display:block;aspect-ratio:1/1;}
    .topbar h1,.sp-brand-title,.brand h1,.sp-fallback-title{line-height:1.05;margin:0;min-height:1.05em;overflow-wrap:anywhere;transition:none!important;font-weight:800;}
    .subtitle,.sp-subtitle,.sp-fallback-subtitle{line-height:1.25;min-height:2.5em;overflow-wrap:anywhere;transition:none!important;}
    .account-tools,.sp-account,.teacher-actions,.sp-fallback-account{display:flex;flex-wrap:wrap;align-items:center;gap:10px;min-height:104px!important;box-sizing:border-box;transition:none!important;}
    .account-strip{min-height:0!important;contain:layout paint;transition:none!important;}
    .account-pill,.sp-pill,.sp-fallback-pill{display:inline-flex;align-items:center;min-height:46px!important;max-width:100%;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;}
    .nav,.sp-page-nav,.sp-nav,.actions,.sp-fallback-nav{display:flex;flex-wrap:wrap;align-items:center;gap:10px;box-sizing:border-box;transition:none!important;}
    .topbar .nav,.topbar .sp-page-nav,.topbar .sp-nav,.topbar .sp-fallback-nav{min-height:112px!important;padding-top:12px;align-content:flex-start;}
    .btn,.sp-btn,.account-link,.account-btn,.danger-btn,.secondary,button.btn,a.btn,.sp-fallback-btn{min-height:46px!important;box-sizing:border-box;line-height:1.15;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;text-align:center;transition:none!important;text-decoration:none;}
    .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn,.topbar .sp-fallback-btn{min-width:118px;}
    .progress-card,.card,.module{contain:layout paint;}
    .topbar *{transition:none!important;animation:none!important;}
    @media(max-width:760px){
      :root{--sp-header-logo:68px;--sp-header-gap:12px;--sp-header-radius:26px;--sp-header-min:384px;}
      .topbar,.topbar:empty,.topbar:empty::before{min-height:var(--sp-header-min)!important;}
      .sp-fallback-header,.topbar-main,.sp-topbar-main,.teacher-top,.sp-account-row{display:grid!important;grid-template-columns:1fr;min-height:92px!important;}
      .brand,.sp-brand,.teacher-brand,.brand-logo,.sp-fallback-brand{grid-template-columns:var(--sp-header-logo) minmax(0,1fr);width:100%;min-height:92px!important;}
      .account-tools,.sp-account,.teacher-actions,.sp-fallback-account,.nav,.sp-page-nav,.sp-nav,.sp-fallback-nav{width:100%;gap:9px;}
      .account-tools,.sp-account,.teacher-actions,.sp-fallback-account{min-height:104px!important;}
      .topbar .nav,.topbar .sp-page-nav,.topbar .sp-nav,.topbar .sp-fallback-nav{min-height:112px!important;}
      .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn,.topbar .sp-fallback-btn{min-width:0;min-height:46px!important;padding-left:16px;padding-right:16px;}
    }
    @media(max-width:420px){
      :root{--sp-header-logo:60px;--sp-header-min:404px;}
      .topbar,.topbar:empty,.topbar:empty::before{min-height:var(--sp-header-min)!important;}
      .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn,.topbar .sp-fallback-btn{font-size:15px;padding-left:12px;padding-right:12px;}
    }
  `;
  function safe(v){return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
  function read(k){try{return JSON.parse(localStorage.getItem(k)||sessionStorage.getItem(k)||'null')}catch(e){return null}}
  function profile(){return read('SP_STUDENT_PROFILE')||read('SP_USER_PROFILE')||read('SP_TEACHER_PROFILE')||{}}
  function pageTitle(){
    var h=document.querySelector('title');
    var t=h&&h.textContent?String(h.textContent).replace(/SprachPilot|·|–/g,'').trim():'';
    if(!t)t='Deutsch lernen';
    return t;
  }
  function fallbackHeader(el){
    if(!el||String(el.textContent||'').trim().length>8)return;
    var p=profile();
    var name=[p.vorname||p.firstName||p.name||'',p.nachname||p.lastName||''].join(' ').trim();
    var course=p.kurs||p.kursnummer||p.courseCode||'';
    var label=name?(name+(course?' · '+course:'')):'Schüler/in';
    el.classList.add('sp-header-stable','sp-fallback-rendered');
    el.innerHTML='<div class="sp-fallback-header"><a class="sp-fallback-brand" href="/index.html"><span class="sp-fallback-logo"><img src="/assets/logo/sprachpilot-logo.png" alt="SprachPilot Logo" width="72" height="72"></span><span><span class="sp-fallback-title">SprachPilot</span><span class="sp-fallback-subtitle">'+safe(pageTitle())+'</span></span></a><div class="sp-fallback-account"><span class="sp-fallback-pill">'+safe(label)+'</span><a class="sp-fallback-btn secondary" href="/student-dashboard/index.html">Dashboard</a><a class="sp-fallback-btn secondary" href="/profile/index.html">Profil</a><button class="sp-fallback-btn secondary" type="button" onclick="try{logout()}catch(e){location.href=\'/index.html\'}">Abmelden</button></div></div><nav class="sp-fallback-nav"><button class="sp-fallback-btn secondary" type="button" onclick="history.length>1?history.back():location.href=\'/student-dashboard/index.html\'">← Zurück</button><a class="sp-fallback-btn secondary" href="index.html">Übersicht</a></nav>';
  }
  function inject(){
    var old=document.getElementById('sp-header-stability-style');
    if(old)old.remove();
    var st=document.createElement('style');
    st.id='sp-header-stability-style';
    st.textContent=css;
    (document.head||document.documentElement).appendChild(st);
  }
  function reserve(){
    try{
      document.querySelectorAll('.topbar').forEach(function(el){
        el.classList.add('sp-header-stable');
        el.style.transition='none';
        el.style.animation='none';
      });
    }catch(e){}
  }
  function renderFallbacks(){try{document.querySelectorAll('.topbar').forEach(fallbackHeader)}catch(e){}}
  inject();reserve();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){reserve();setTimeout(renderFallbacks,120)},{once:true});else setTimeout(renderFallbacks,120);
  setTimeout(reserve,50);setTimeout(reserve,250);setTimeout(reserve,750);setTimeout(reserve,1600);
  setTimeout(renderFallbacks,350);setTimeout(renderFallbacks,900);setTimeout(renderFallbacks,1800);
  try{new MutationObserver(function(){reserve();setTimeout(renderFallbacks,80)}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();