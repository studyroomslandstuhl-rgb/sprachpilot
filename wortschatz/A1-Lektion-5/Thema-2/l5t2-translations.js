try{import('./l5t2-theme-open.js?v=1')}catch(e){}
function langKey(){return 'en'}
(function(){
  if(typeof WORDS==='undefined')return;
  WORDS.forEach(function(w){w.tr=w.tr||{en:w.word||w.full||w.id}});
})();