// wortschatz/shared/wortschatz-scoring-loader.js
// Lädt die zentrale Standard-Punkte-Logik für ältere Wortschatzseiten.
(function(){
  try{
    import('/js/scoring.js?v=3').catch(function(){});
    import('/js/progress.js?v=standard-20260630').catch(function(){});
  }catch(e){}
})();
