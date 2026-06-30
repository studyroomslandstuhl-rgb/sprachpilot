// data/verbs-extra-2.js
// Ergänzt weitere A1-Verben: vergeben, verbringen.
(function(){
  const NEW_VERBS=[
    {v:"vergeben",img:"vergeben"},
    {v:"verbringen",img:"verbringen"}
  ];
  const SENTENCES={
    "vergeben":"Die Lehrerin vergibt Punkte.",
    "verbringen":"Wir verbringen den Abend zu Hause."
  };
  const EXTRA_TRANSLATIONS={
    "Englisch":{
      "vergeben":"to forgive / assign points",
      "verbringen":"to spend time"
    },
    "Russisch":{
      "vergeben":"прощать / присуждать баллы",
      "verbringen":"проводить время"
    },
    "Ukrainisch":{
      "vergeben":"прощати / присуджувати бали",
      "verbringen":"проводити час"
    },
    "Arabisch":{
      "vergeben":"يسامح / يمنح نقاطًا",
      "verbringen":"يقضي وقتًا"
    },
    "Türkisch":{
      "vergeben":"affetmek / puan vermek",
      "verbringen":"zaman geçirmek"
    },
    "Rumänisch":{
      "vergeben":"a ierta / a acorda puncte",
      "verbringen":"a petrece timp"
    },
    "Japanisch":{
      "vergeben":"許す / 点を与える",
      "verbringen":"時間を過ごす"
    }
  };
  function addNewVerbs(){
    if(!window.ALL_VERBS)return;
    const existing=new Set(window.ALL_VERBS.map(x=>x.v));
    NEW_VERBS.forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(item);existing.add(item.v);}});
  }
  function addSentences(){
    window.VERB_SENTENCES=window.VERB_SENTENCES||{};
    Object.assign(window.VERB_SENTENCES,SENTENCES);
    const old=window.sentenceForVerb;
    window.sentenceForVerb=function(v){return window.VERB_SENTENCES[v] || (typeof old==="function"?old(v):`Ich lerne ${v}.`);};
  }
  function addTranslations(){
    window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
    Object.keys(EXTRA_TRANSLATIONS).forEach(lang=>{
      window.VERB_TRANSLATIONS[lang]=window.VERB_TRANSLATIONS[lang]||{};
      Object.assign(window.VERB_TRANSLATIONS[lang],EXTRA_TRANSLATIONS[lang]);
    });
    if(typeof window.spEnsureUniqueVerbTranslations==="function")window.spEnsureUniqueVerbTranslations();
  }
  function patchConjugationData(){
    if(window.CONJ_EXAMPLES)Object.assign(window.CONJ_EXAMPLES,{
      "vergeben":"Punkte",
      "verbringen":"den Abend zu Hause"
    });
    if(window.FULL_FORMS)Object.assign(window.FULL_FORMS,{
      "vergeben":{"ich":"vergebe","du":"vergibst","er/sie/es":"vergibt","wir":"vergeben","ihr":"vergebt","sie/Sie":"vergeben"},
      "verbringen":{"ich":"verbringe","du":"verbringst","er/sie/es":"verbringt","wir":"verbringen","ihr":"verbringt","sie/Sie":"verbringen"}
    });
  }
  addNewVerbs();
  addSentences();
  addTranslations();
  patchConjugationData();
  window.SP_EXTRA_VERBS_2=NEW_VERBS.map(x=>x.v);
})();
