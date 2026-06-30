// data/translation-deduplicate.js
// Sorgt dafür, dass innerhalb einer Muttersprache keine zwei Verben exakt gleich angezeigt werden.
(function(){
  function hasVerbMarker(text,verb){return String(text||"").toLowerCase().includes(String(verb||"").toLowerCase());}
  function uniqueTranslations(){
    const all=window.VERB_TRANSLATIONS||{};
    Object.keys(all).forEach(lang=>{
      const map=all[lang]||{};
      const reverse={};
      Object.keys(map).forEach(verb=>{
        const value=String(map[verb]||"").trim();
        if(!value)return;
        const key=value.toLowerCase();
        reverse[key]=reverse[key]||[];
        reverse[key].push(verb);
      });
      Object.keys(reverse).forEach(key=>{
        const verbs=reverse[key];
        if(verbs.length<2)return;
        verbs.forEach(verb=>{
          if(!hasVerbMarker(map[verb],verb))map[verb]=`${map[verb]} (${verb})`;
        });
      });
    });
  }
  uniqueTranslations();
  window.spEnsureUniqueVerbTranslations=uniqueTranslations;
})();
