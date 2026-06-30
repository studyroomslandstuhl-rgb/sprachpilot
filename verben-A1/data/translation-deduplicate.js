// data/translation-deduplicate.js
// Ergänzt letzte neue Verben und sorgt dafür, dass Muttersprache-Übersetzungen eindeutig sind.
(function(){
  const LAST_VERBS=[
    {v:"vergeben",img:"vergeben"},
    {v:"verbringen",img:"verbringen"}
  ];
  const SENTENCES={
    "vergeben":"Die Lehrerin vergibt Punkte.",
    "verbringen":"Wir verbringen den Abend zu Hause."
  };
  const EXTRA_TRANSLATIONS={
    "Englisch":{"vergeben":"to forgive / assign points","verbringen":"to spend time"},
    "Russisch":{"vergeben":"прощать / присуждать баллы","verbringen":"проводить время"},
    "Ukrainisch":{"vergeben":"прощати / присуджувати бали","verbringen":"проводити час"},
    "Arabisch":{"vergeben":"يسامح / يمنح نقاطًا","verbringen":"يقضي وقتًا"},
    "Türkisch":{"vergeben":"affetmek / puan vermek","verbringen":"zaman geçirmek"},
    "Rumänisch":{"vergeben":"a ierta / a acorda puncte","verbringen":"a petrece timp"},
    "Japanisch":{"vergeben":"許す / 点を与える","verbringen":"時間を過ごす"}
  };
  function addLastVerbs(){
    if(window.ALL_VERBS){
      const existing=new Set(window.ALL_VERBS.map(x=>x.v));
      LAST_VERBS.forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(item);existing.add(item.v);}});
    }
    window.VERB_SENTENCES=window.VERB_SENTENCES||{};
    Object.assign(window.VERB_SENTENCES,SENTENCES);
    const old=window.sentenceForVerb;
    window.sentenceForVerb=function(v){return window.VERB_SENTENCES[v] || (typeof old==="function"?old(v):`Ich lerne ${v}.`);};
    window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
    Object.keys(EXTRA_TRANSLATIONS).forEach(lang=>{
      window.VERB_TRANSLATIONS[lang]=window.VERB_TRANSLATIONS[lang]||{};
      Object.assign(window.VERB_TRANSLATIONS[lang],EXTRA_TRANSLATIONS[lang]);
    });
    if(window.CONJ_EXAMPLES)Object.assign(window.CONJ_EXAMPLES,{"vergeben":"Punkte","verbringen":"den Abend zu Hause"});
    if(window.FULL_FORMS)Object.assign(window.FULL_FORMS,{
      "vergeben":{"ich":"vergebe","du":"vergibst","er/sie/es":"vergibt","wir":"vergeben","ihr":"vergebt","sie/Sie":"vergeben"},
      "verbringen":{"ich":"verbringe","du":"verbringst","er/sie/es":"verbringt","wir":"verbringen","ihr":"verbringt","sie/Sie":"verbringen"}
    });
  }
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
  addLastVerbs();
  uniqueTranslations();
  window.spEnsureUniqueVerbTranslations=uniqueTranslations;
  window.SP_EXTRA_VERBS_2=LAST_VERBS.map(x=>x.v);
})();
