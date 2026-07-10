(function(){
  if(window.SP_HEADER_STABILITY_DISABLED_SAFE)return;
  window.SP_HEADER_STABILITY_DISABLED_SAFE=true;
  var css=`
    html{overflow-y:scroll;}
    body{overflow-anchor:none;}
    .topbar,.hero{box-sizing:border-box;transition:none!important;animation:none!important;}
    .topbar *,.hero *{transition:none!important;animation:none!important;}
    .topbar img,.hero img,.logo-wrap img,.sp-logo-img,.teacher-brand img{aspect-ratio:1/1;object-fit:contain;}
    .topbar .logo img,.topbar .brand img,.topbar .sp-brand img,.topbar .sp-logo-img,.topbar .teacher-brand img{width:72px;height:72px;max-width:72px;max-height:72px;}
    .topbar a,.topbar button,.hero a,.hero button{transition:none!important;animation:none!important;}
  `;
  var old=document.getElementById('sp-header-stability-style');
  if(old)old.remove();
  var st=document.createElement('style');
  st.id='sp-header-stability-style';
  st.textContent=css;
  (document.head||document.documentElement).appendChild(st);
})();