(function(){
  if(window.SP_HEADER_STABILITY_LOADED)return;
  window.SP_HEADER_STABILITY_LOADED=true;
  var css=`
    :root{--sp-header-logo:72px;--sp-header-gap:14px;--sp-header-radius:28px;}
    .topbar,.hero,.sp-header-stable{box-sizing:border-box;contain:layout paint;}
    .topbar{min-height:232px;transition:none!important;animation:none!important;}
    .topbar:empty{display:block;min-height:232px;}
    .topbar:empty::before{content:"";display:block;height:100%;min-height:232px;border-radius:var(--sp-header-radius);background:rgba(255,255,255,.68);box-shadow:0 18px 44px rgba(8,30,45,.08);}
    .topbar-main,.sp-topbar-main,.teacher-top,.sp-account-row{display:flex;align-items:flex-start;gap:var(--sp-header-gap);min-height:84px;box-sizing:border-box;}
    .brand,.sp-brand,.teacher-brand,.brand-logo{display:grid!important;grid-template-columns:var(--sp-header-logo) minmax(0,1fr);align-items:center;gap:16px;min-height:84px;min-width:0;text-decoration:none;}
    .logo,.brand-logo,.sp-logo-wrap{width:var(--sp-header-logo)!important;height:var(--sp-header-logo)!important;min-width:var(--sp-header-logo)!important;min-height:var(--sp-header-logo)!important;display:grid!important;place-items:center;overflow:hidden;box-sizing:border-box;}
    .logo img,.brand img,.sp-brand img,.sp-logo-img,.teacher-brand img,.logo-wrap img{width:var(--sp-header-logo)!important;height:var(--sp-header-logo)!important;max-width:var(--sp-header-logo)!important;max-height:var(--sp-header-logo)!important;object-fit:contain;display:block;aspect-ratio:1/1;}
    .topbar h1,.sp-brand-title,.brand h1{line-height:1.05;margin:0;min-height:1.05em;overflow-wrap:anywhere;}
    .subtitle,.sp-subtitle{line-height:1.25;min-height:1.25em;overflow-wrap:anywhere;}
    .account-tools,.sp-account,.teacher-actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;min-height:54px;box-sizing:border-box;}
    .account-strip{min-height:0;contain:layout paint;}
    .account-pill,.sp-pill{display:inline-flex;align-items:center;min-height:42px;max-width:100%;box-sizing:border-box;white-space:normal;overflow-wrap:anywhere;}
    .nav,.sp-page-nav,.sp-nav,.actions{display:flex;flex-wrap:wrap;align-items:center;gap:10px;box-sizing:border-box;}
    .topbar .nav,.topbar .sp-page-nav,.topbar .sp-nav{min-height:58px;padding-top:12px;}
    .btn,.sp-btn,.account-link,.account-btn,.danger-btn,.secondary,button.btn,a.btn{min-height:44px;box-sizing:border-box;line-height:1.15;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;text-align:center;}
    .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn{min-width:118px;}
    .progress-card,.card,.module{contain:layout paint;}
    body.sp-header-ready .topbar{min-height:auto;}
    @media(max-width:760px){
      :root{--sp-header-logo:68px;--sp-header-gap:12px;--sp-header-radius:26px;}
      .topbar{min-height:306px;}
      .topbar:empty,.topbar:empty::before{min-height:306px;}
      .topbar-main,.sp-topbar-main,.teacher-top,.sp-account-row{display:grid!important;grid-template-columns:1fr;min-height:84px;}
      .brand,.sp-brand,.teacher-brand,.brand-logo{grid-template-columns:var(--sp-header-logo) minmax(0,1fr);width:100%;}
      .account-tools,.sp-account,.teacher-actions,.nav,.sp-page-nav,.sp-nav{width:100%;gap:9px;}
      .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn{min-width:0;min-height:46px;padding-left:16px;padding-right:16px;}
      .account-pill,.sp-pill{min-height:46px;}
    }
    @media(max-width:420px){
      :root{--sp-header-logo:60px;}
      .topbar{min-height:330px;}
      .topbar:empty,.topbar:empty::before{min-height:330px;}
      .topbar .btn,.topbar .sp-btn,.topbar .account-link,.topbar button,.topbar a.btn{font-size:15px;padding-left:12px;padding-right:12px;}
    }
  `;
  function inject(){
    if(document.getElementById('sp-header-stability-style'))return;
    var st=document.createElement('style');
    st.id='sp-header-stability-style';
    st.textContent=css;
    (document.head||document.documentElement).appendChild(st);
  }
  function mark(){try{if(document.querySelector('.topbar:not(:empty),.sp-topbar-main,.topbar-main'))document.body.classList.add('sp-header-ready')}catch(e){}}
  inject();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});else mark();
  setTimeout(mark,80);setTimeout(mark,350);setTimeout(mark,900);
  try{new MutationObserver(function(){mark()}).observe(document.documentElement,{childList:true,subtree:true})}catch(e){}
})();