const L6T1_CDN_CLEAN='https://sprachpilot.b-cdn.net/';
function l6t1CleanWords(){
  try{
    [window.BASE_WORDS,window.EXTRA_WORDS].filter(Array.isArray).forEach(list=>{
      for(let i=list.length-1;i>=0;i--){
        if(list[i]&&list[i].id==='unter_null')list.splice(i,1);
      }
      list.forEach(w=>{
        if(w&&w.id==='eis')w.image=L6T1_CDN_CLEAN+'eis.webp';
      });
    });
  }catch(e){}
}
function l6t1InstallCleanCss(){
  if(document.getElementById('l6t1-clean-css'))return;
  const s=document.createElement('style');
  s.id='l6t1-clean-css';
  s.textContent=`
    .topbar,#spHeader:empty{display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}
    .weather-card{overflow:hidden!important;padding:8px!important;background:#fff!important}
    .weather-img{width:100%!important;height:100%!important;object-fit:contain!important;display:block!important;border-radius:14px!important;background:#fff!important}
    .word-placeholder .weather-card{width:92px!important;height:72px!important;max-width:92px!important;margin:0!important;padding:5px!important}
    a[href="statistik.html"],button[data-href="statistik.html"]{display:none!important}
  `;
  document.head.appendChild(s);
}
l6t1CleanWords();
l6t1InstallCleanCss();