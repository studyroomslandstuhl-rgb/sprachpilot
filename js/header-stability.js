(function(){
  if(window.SP_HEADER_STABILITY_LOADED_V2)return;
  window.SP_HEADER_STABILITY_LOADED_V2=true;
  var css=`
    :root{
      --sp-header-logo:72px;
      --sp-header-gap:14px;
      --sp-header-radius:28px;
      --sp-header-min:332px;
      --sp-header-min-small:354px;
    }
    html{overflow-y:scroll;}
    body{overflow-anchor:none;}
    .topbar,.hero,.sp-header-stable{box-sizing:border-box;contain:layout paint;transition:none!important;animation:none!important;}
    .topbar{min-height:var(--sp-header-min)!important;transition:none!important;animation:none!important;}
    .topbar:empty{display:block!important;min-height:var(--sp-header-min)!important;}
    .topbar:empty::before{content:"";display:block;height:100%;min-height:var(--sp-header-min)!important;border-radius:var(--sp-header-radius);background:rgba(255,255,255,.70);box-shadow:0 18px 44px rgba(8,30,45,.08);}
    .hero{min-height:190px;}
    .topbar-main,.sp-topbar-main,.teacher-top,.sp-account-row{display:flex;align-items:flex-start;gap:var(--sp-header-gap);min-height:92px!important;box-sizing:border-box;transition:none!important;}
    .brand,.sp-brand,.teacher-brand,.brand-logo{display:grid!important;grid-template-columns:var(--sp-header-logo) minmax(0,1fr);align-items:center;gap:16px;min-height:92px!important;min-width:0;text-decoration:none;transition:none!important;}
    .logo,.brand-logo,.sp-logo-wrap{width:var(--sp-header-logo)!important;height:var(--sp-header-logo)!important;min-width:var(--sp-header-logo)!important;min-height:var(--sp-header-logo)!important;display:grid!important;place-items:center;overflow:hidden;box-sizing:border-box;}
    .logo img,.brand img,.sp-brand img,.sp-logo-img,.teacher-brand img,.logo-wrap img{width:var(--sp-header-logo)!important;height:var(--sp-header-logo)!important;max-width:var(--sp-header-logo)!important;max-height:var(--sp-header-logo)!important;object-fit:contain;display:block;aspect-ratio:1/1;}
    .topbar h1,.sp-brand-title,.brand h1{line-height:1.05;margin:0;min-height:1.05em;overflow-wrap:anywhere;transition:none!important;}
    .subtitle,.sp-subtitle{line-height:1.25;min-height:2.5em;overflow-wrap:anywhere;transition:none!important;}
    .account-tools,.sp-account,.teacher-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;min-height:104px!important;box-sizing:border-box;transition:none!important;}
    .account-strip{min-height:0!important;contain:layout paint;transition:none!important;}
    .account-pill,.sp-pill{display:inline-flex;align-items:center;min-height:46px!important;max-width:100%;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;transition:none!important;}
    .nav,.sp-page-nav,.sp-nav,.actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;box-sizing:border-box;transition:none!important;}
    .topbar .nav,.topbar .sp-page-nav,.topbar .sp-nav{min-height:112px!important;padding-top:12px;align-content:flex-start;}
    .btn,.sp-btn,.account-link,.account-btn,.danger-btn,.secondary,button.btn,a.btn{min-height:46px!important;box-sizing:border-box;line-height:1.15;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;text-align:center;transition:none!important;}
    .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn{min-width:118px;}
    .progress-card,.card,.module{contain:layout paint;}
    .topbar *{transition:none!important;animation:none!important;}
    @media(max-width:760px){
      :root{--sp-header-logo:68px;--sp-header-gap:12px;--sp-header-radius:26px;--sp-header-min:384px;--sp-header-min-small:408px;}
      .topbar{min-height:var(--sp-header-min)!important;}
      .topbar:empty,.topbar:empty::before{min-height:var(--sp-header-min)!important;}
      .topbar-main,.sp-topbar-main,.teacher-top,.sp-account-row{display:grid!important;grid-template-columns:1fr;min-height:92px!important;}
      .brand,.sp-brand,.teacher-brand,.brand-logo{grid-template-columns:var(--sp-header-logo) minmax(0,1fr);width:100%;min-height:92px!important;}
      .account-tools,.sp-account,.teacher-actions,.nav,.sp-page-nav,.sp-nav{width:100%;gap:9px;}
      .account-tools,.sp-account,.teacher-actions{min-height:104px!important;}
      .topbar .nav,.topbar .sp-page-nav,.topbar .sp-nav{min-height:112px!important;}
      .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn{min-width:0;min-height:46px!important;padding-left:16px;padding-right:16px;}
      .account-pill,.sp-pill{min-height:46px!important;}
    }
    @media(max-width:420px){
      :root{--sp-header-logo:60px;--sp-header-min:404px;--sp-header-min-small:426px;}
      .topbar{min-height:var(--sp-header-min)!important;}
      .topbar:empty,.topbar:empty::before{min-height:var(--sp-header-min)!important;}
      .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn{font-size:15px;padding-left:12px;padding-right:12px;}
    }
  `;
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
  inject();reserve();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reserve,{once:true});else reserve();
  setTimeout(reserve,50);setTimeout(reserve,250);setTimeout(reserve,750);setTimeout(reserve,1600);
  try{new MutationObserver(reserve).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();