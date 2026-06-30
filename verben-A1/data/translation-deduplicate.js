// data/translation-deduplicate.js
// Ergänzt letzte neue Verben, Niveau-Daten und sorgt dafür, dass Muttersprache-Übersetzungen eindeutig sind.
(function(){
  const LAST_VERBS=[
    {v:"vergeben",img:"vergeben",level:"A2"},
    {v:"verbringen",img:"verbringen",level:"A2"},
    {v:"kennenlernen",img:"kennenlernen",level:"A1"},
    {v:"bleiben",img:"bleiben",level:"A1"}
  ];
  const SENTENCES={
    "vergeben":"Die Lehrerin vergibt Punkte.",
    "verbringen":"Wir verbringen den Abend zu Hause.",
    "kennenlernen":"Ich lerne meine Nachbarin kennen.",
    "bleiben":"Wir bleiben heute zu Hause."
  };
  const EXTRA_TRANSLATIONS={
    "Englisch":{
      "vergeben":"to forgive / assign points",
      "verbringen":"to spend time",
      "kennenlernen":"to get to know / meet for the first time",
      "bleiben":"to stay / remain"
    },
    "Russisch":{
      "vergeben":"прощать / присуждать баллы",
      "verbringen":"проводить время",
      "kennenlernen":"знакомиться / узнавать человека",
      "bleiben":"оставаться"
    },
    "Ukrainisch":{
      "vergeben":"прощати / присуджувати бали",
      "verbringen":"проводити час",
      "kennenlernen":"знайомитися / пізнавати людину",
      "bleiben":"залишатися"
    },
    "Arabisch":{
      "vergeben":"يسامح / يمنح نقاطًا",
      "verbringen":"يقضي وقتًا",
      "kennenlernen":"يتعرف على شخص",
      "bleiben":"يبقى"
    },
    "Türkisch":{
      "vergeben":"affetmek / puan vermek",
      "verbringen":"zaman geçirmek",
      "kennenlernen":"tanışmak / birini tanımak",
      "bleiben":"kalmak"
    },
    "Rumänisch":{
      "vergeben":"a ierta / a acorda puncte",
      "verbringen":"a petrece timp",
      "kennenlernen":"a face cunoștință / a cunoaște pe cineva",
      "bleiben":"a rămâne"
    },
    "Japanisch":{
      "vergeben":"許す / 点を与える",
      "verbringen":"時間を過ごす",
      "kennenlernen":"知り合う / 初めて会う",
      "bleiben":"とどまる / 残る"
    }
  };
  const LEVEL_CATALOG={
    A1:[
      "sein","haben","kommen","gehen","wohnen","leben","lernen","hören","sprechen","lesen","schreiben","verstehen","fragen","antworten","sagen","heißen","buchstabieren","brauchen","kaufen","einkaufen","bezahlen","essen","trinken","kochen","machen","arbeiten","warten","suchen","finden","sehen","fernsehen","telefonieren","anrufen","öffnen","schließen","aufmachen","zumachen","bleiben","kennenlernen","nehmen","geben","bringen","mitnehmen","mitgeben","aufräumen","anfangen","beginnen","starten","enden","gefallen","fehlen","mieten","vermieten"
    ],
    A2:[
      "bekommen","bestellen","buchen","reservieren","empfehlen","erklären","erzählen","notieren","markieren","wiederholen","benutzen","probieren","versuchen","besuchen","gratulieren","verbringen","vergeben","vergessen","verlieren","gewinnen","treffen","helfen","tragen","halten","lassen","werden","wachsen","messen","rechnen","zeichnen","schneiden","putzen","waschen","backen","braten","reparieren","kontrollieren","funktionieren","schicken","zeigen","denken","glauben","hoffen"
    ],
    B1:[
      "beantragen","begründen","entscheiden","vergleichen","beschreiben","berichten","vereinbaren","ablehnen","zustimmen","teilnehmen","vorstellen","durchführen","organisieren","erreichen","vermeiden","verbessern","verschieben","absagen","kündigen","sich bewerben","unterschreiben","überweisen","erledigen","sich erinnern","sich beschweren","diskutieren","zerstören","aussterben","begraben","verbiegen","werben","bedeuten","befehlen"
    ]
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
    if(window.CONJ_EXAMPLES)Object.assign(window.CONJ_EXAMPLES,{"vergeben":"Punkte","verbringen":"den Abend zu Hause","kennenlernen":"meine Nachbarin","bleiben":"heute zu Hause"});
    if(window.SEPARABLE_VERBS)Object.assign(window.SEPARABLE_VERBS,{"kennenlernen":{base:"lernen",prefix:"kennen"}});
    if(window.FULL_FORMS)Object.assign(window.FULL_FORMS,{
      "vergeben":{"ich":"vergebe","du":"vergibst","er/sie/es":"vergibt","wir":"vergeben","ihr":"vergebt","sie/Sie":"vergeben"},
      "verbringen":{"ich":"verbringe","du":"verbringst","er/sie/es":"verbringt","wir":"verbringen","ihr":"verbringt","sie/Sie":"verbringen"},
      "bleiben":{"ich":"bleibe","du":"bleibst","er/sie/es":"bleibt","wir":"bleiben","ihr":"bleibt","sie/Sie":"bleiben"},
      "kennen":{"ich":"kenne","du":"kennst","er/sie/es":"kennt","wir":"kennen","ihr":"kennt","sie/Sie":"kennen"}
    });
  }
  function applyLevels(){
    const levels={};
    Object.keys(LEVEL_CATALOG).forEach(level=>LEVEL_CATALOG[level].forEach(v=>{if(!levels[v])levels[v]=level;}));
    (window.ALL_VERBS||[]).forEach(item=>{
      const level=item.level||levels[item.v]||"A1";
      item.level=level;
      levels[item.v]=level;
    });
    window.VERB_LEVELS=levels;
    window.VERB_LEVEL_CATALOG=LEVEL_CATALOG;
    window.verbsByLevel=function(level){return (window.ALL_VERBS||[]).filter(x=>(x.level||window.VERB_LEVELS[x.v]||"A1")===level).map(x=>x.v)};
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
  applyLevels();
  uniqueTranslations();
  window.spEnsureUniqueVerbTranslations=uniqueTranslations;
  window.SP_EXTRA_VERBS_2=LAST_VERBS.map(x=>x.v);
})();
