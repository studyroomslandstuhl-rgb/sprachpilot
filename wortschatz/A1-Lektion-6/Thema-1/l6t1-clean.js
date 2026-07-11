const L6T1_CDN_CLEAN='https://sprachpilot.b-cdn.net/';
function l6t1CleanWords(){
  try{
    if(Array.isArray(window.BASE_WORDS)&&!BASE_WORDS.some(w=>w&&w.id==='unter_null')){
      BASE_WORDS.push({id:'unter_null',group:'Im Buch',type:'phrase',article:'',word:'unter Null',full:'unter Null',sentence:'Es sind drei Grad unter Null.',symbol:'➖',image:L6T1_CDN_CLEAN+'unternull.webp',tr:{en:'below zero',ru:'ниже нуля',tr:'sıfırın altında',uk:'нижче нуля',ar:'تحت الصفر',ja:'氷点下',ro:'sub zero',pl:'poniżej zera',ku:'bin sifirê'}});
    }
    [window.BASE_WORDS,window.EXTRA_WORDS].filter(Array.isArray).forEach(list=>{
      list.forEach(w=>{
        if(w&&w.id==='eis')w.image=L6T1_CDN_CLEAN+'das_eis.webp';
        if(w&&w.id==='unter_null')w.image=L6T1_CDN_CLEAN+'unternull.webp';
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
setTimeout(()=>{try{l6t1CleanWords();if(document.getElementById('wordList')&&typeof renderOverview==='function')renderOverview(document.getElementById('wordList'));if(document.getElementById('taskGrid')&&typeof renderMenu==='function')renderMenu();}catch(e){}},100);