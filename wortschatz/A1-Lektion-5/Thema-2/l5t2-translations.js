function langKey(){return 'en'}
(function(){
  if(typeof WORDS==='undefined')return;
  WORDS.forEach(function(w){w.tr=w.tr||{en:w.word||w.full||w.id}});
})();