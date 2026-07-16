// Sätze für die neuen Verben vom 16.07.2026.
(function(){
  const SENTENCES={
    "klopfen":"Ich klopfe an die Tür.",
    "riechen":"Die Blumen riechen gut.",
    "stinken":"Der Müll stinkt.",
    "schauen":"Wir schauen aus dem Fenster.",
    "gucken":"Ich gucke einen Film.",
    "würfeln":"Das Kind würfelt.",
    "schweigen":"Er schweigt im Unterricht.",
    "vernichten":"Das Feuer vernichtet das Papier.",
    "erleben":"Wir erleben einen schönen Tag."
  };
  window.VERB_SENTENCES=window.VERB_SENTENCES||{};
  Object.assign(window.VERB_SENTENCES,SENTENCES);
  const old=window.sentenceForVerb;
  window.sentenceForVerb=function(v){
    return window.VERB_SENTENCES[v]||(typeof old==='function'?old(v):'Ich schreibe einen Satz.');
  };
  window.SP_VERB_SENTENCE_ADDITIONS_20260716=Object.keys(SENTENCES);
})();
