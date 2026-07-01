// data/verb-default-locks.js
// Neue/zusätzlich eingebaute Verben bleiben gesperrt, bis die Lehrerin sie im Dashboard freigibt.
// Diese Datei wird sowohl im Verben-Modul als auch im Lehrerdashboard geladen.
(function(){
  const JULY_VERBS=[
    {v:'vorhaben',img:'vorhaben',level:'A1',type:'separable',irregular:true},
    {v:'planen',img:'planen',level:'A1',type:'normal'},
    {v:'aufgeben',img:'aufgeben',level:'A2',type:'separable',irregular:true},
    {v:'zuhören',img:'zuhoeren',level:'A1',type:'separable'},
    {v:'zusehen',img:'zusehen',level:'A2',type:'separable',irregular:true},
    {v:'gehören',img:'gehoeren',level:'A1',type:'inseparable-prefix'},
    {v:'abschreiben',img:'abschreiben',level:'A1',type:'separable',irregular:true},
    {v:'vorlesen',img:'vorlesen',level:'A1',type:'separable',irregular:true},
    {v:'verschlafen',img:'verschlafen',level:'A2',type:'inseparable-prefix',irregular:true}
  ];

  const SENTENCES={
    'vorhaben':'Ich habe heute viel vor.',
    'planen':'Wir planen einen Ausflug.',
    'aufgeben':'Bitte gib nicht auf.',
    'zuhören':'Die Schüler hören gut zu.',
    'zusehen':'Ich sehe beim Spiel zu.',
    'gehören':'Das Buch gehört mir.',
    'abschreiben':'Ich schreibe den Satz ab.',
    'vorlesen':'Die Lehrerin liest den Text vor.',
    'verschlafen':'Ich verschlafe den Termin.'
  };

  const EXAMPLES={
    'vorhaben':'heute viel',
    'planen':'einen Ausflug',
    'aufgeben':'nicht',
    'zuhören':'gut',
    'zusehen':'beim Spiel',
    'gehören':'mir',
    'abschreiben':'den Satz',
    'vorlesen':'den Text',
    'verschlafen':'den Termin'
  };

  const TRANSLATIONS={
    'Englisch':{'vorhaben':'to plan / intend to do','planen':'to plan','aufgeben':'to give up','zuhören':'to listen','zusehen':'to watch','gehören':'to belong','abschreiben':'to copy','vorlesen':'to read aloud','verschlafen':'to oversleep / miss by sleeping'},
    'Russisch':{'vorhaben':'планировать / намереваться','planen':'планировать','aufgeben':'сдаваться / бросать','zuhören':'слушать внимательно','zusehen':'смотреть / наблюдать','gehören':'принадлежать','abschreiben':'списывать / переписывать','vorlesen':'читать вслух','verschlafen':'проспать'},
    'Ukrainisch':{'vorhaben':'планувати / мати намір','planen':'планувати','aufgeben':'здаватися / кидати','zuhören':'уважно слухати','zusehen':'дивитися / спостерігати','gehören':'належати','abschreiben':'списувати / переписувати','vorlesen':'читати вголос','verschlafen':'проспати'},
    'Arabisch':{'vorhaben':'ينوي / يخطط','planen':'يخطط','aufgeben':'يستسلم / يترك','zuhören':'يصغي','zusehen':'يشاهد','gehören':'ينتمي / يخص','abschreiben':'ينسخ','vorlesen':'يقرأ بصوت عالٍ','verschlafen':'ينام ويفوّت الموعد'},
    'Türkisch':{'vorhaben':'niyet etmek / planlamak','planen':'planlamak','aufgeben':'vazgeçmek','zuhören':'dinlemek','zusehen':'izlemek','gehören':'ait olmak','abschreiben':'kopyalamak / geçirmek','vorlesen':'sesli okumak','verschlafen':'uyuyakalmak / kaçırmak'},
    'Rumänisch':{'vorhaben':'a avea de gând','planen':'a planifica','aufgeben':'a renunța','zuhören':'a asculta atent','zusehen':'a privi','gehören':'a aparține','abschreiben':'a copia','vorlesen':'a citi cu voce tare','verschlafen':'a dormi prea mult / a rata din somn'},
    'Japanisch':{'vorhaben':'予定している','planen':'計画する','aufgeben':'あきらめる','zuhören':'よく聞く','zusehen':'見物する','gehören':'属する / 所有である','abschreiben':'書き写す','vorlesen':'音読する','verschlafen':'寝過ごす'}
  };

  const SEPARABLE_MAP={
    'vorhaben':{base:'haben',prefix:'vor'},
    'aufgeben':{base:'geben',prefix:'auf'},
    'zuhören':{base:'hören',prefix:'zu'},
    'zusehen':{base:'sehen',prefix:'zu'},
    'abschreiben':{base:'schreiben',prefix:'ab'},
    'vorlesen':{base:'lesen',prefix:'vor'}
  };

  const FULL_FORMS_EXTRA={
    'haben':{'ich':'habe','du':'hast','er/sie/es':'hat','wir':'haben','ihr':'habt','sie/Sie':'haben'},
    'geben':{'ich':'gebe','du':'gibst','er/sie/es':'gibt','wir':'geben','ihr':'gebt','sie/Sie':'geben'},
    'hören':{'ich':'höre','du':'hörst','er/sie/es':'hört','wir':'hören','ihr':'hört','sie/Sie':'hören'},
    'sehen':{'ich':'sehe','du':'siehst','er/sie/es':'sieht','wir':'sehen','ihr':'seht','sie/Sie':'sehen'},
    'schreiben':{'ich':'schreibe','du':'schreibst','er/sie/es':'schreibt','wir':'schreiben','ihr':'schreibt','sie/Sie':'schreiben'},
    'lesen':{'ich':'lese','du':'liest','er/sie/es':'liest','wir':'lesen','ihr':'lest','sie/Sie':'lesen'},
    'verschlafen':{'ich':'verschlafe','du':'verschläfst','er/sie/es':'verschläft','wir':'verschlafen','ihr':'verschlaft','sie/Sie':'verschlafen'},
    'planen':{'ich':'plane','du':'planst','er/sie/es':'plant','wir':'planen','ihr':'plant','sie/Sie':'planen'},
    'gehören':{'ich':'gehöre','du':'gehörst','er/sie/es':'gehört','wir':'gehören','ihr':'gehört','sie/Sie':'gehören'}
  };

  const NEW_SEPARABLE=['vorhaben','aufgeben','zuhören','zusehen','abschreiben','vorlesen'];
  const NEW_INSEPARABLE=['gehören','verschlafen'];
  const NEW_IRREGULAR=['vorhaben','aufgeben','zusehen','abschreiben','vorlesen','verschlafen'];
  const INSEPARABLE_PREFIX_RE=/^(be|emp|ent|er|ge|miss|ver|zer)/;

  const LOCKED_BY_DEFAULT=[
    'aufräumen','einkaufen','anrufen','fernsehen','anfangen','beginnen','starten','enden','aussterben','aufmachen','zumachen','begraben','zerstören','verbiegen','mitgeben','mitnehmen',
    'vergeben','verbringen','kennenlernen','bleiben','einladen',
    'heißen','aufstehen','frühstücken','duschen','anziehen','ausziehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','holen','zahlen','ausfüllen','anmelden','mitkommen','zurückkommen','sitzen','liegen','hängen','stellen','legen','können','müssen','wollen','dürfen','sollen','möchten','mögen','biegen','abbiegen',
    ...JULY_VERBS.map(x=>x.v)
  ];

  function addVerbs(){
    window.ALL_VERBS=window.ALL_VERBS||[];
    const existing=new Set(window.ALL_VERBS.map(x=>x.v));
    JULY_VERBS.forEach(item=>{if(!existing.has(item.v)){window.ALL_VERBS.push(Object.assign({},item));existing.add(item.v);}});
  }
  function addTranslations(){
    window.VERB_TRANSLATIONS=window.VERB_TRANSLATIONS||{};
    Object.keys(TRANSLATIONS).forEach(lang=>{window.VERB_TRANSLATIONS[lang]=window.VERB_TRANSLATIONS[lang]||{};Object.assign(window.VERB_TRANSLATIONS[lang],TRANSLATIONS[lang]);});
  }
  function addSentences(){
    window.VERB_SENTENCES=window.VERB_SENTENCES||{};
    Object.assign(window.VERB_SENTENCES,SENTENCES);
    const old=window.sentenceForVerb;
    window.sentenceForVerb=function(v){return window.VERB_SENTENCES[v]||(typeof old==='function'?old(v):`Ich lerne ${v}.`);};
  }
  function addGrammar(){
    if(window.CONJ_EXAMPLES)Object.assign(window.CONJ_EXAMPLES,EXAMPLES);
    if(window.SEPARABLE_VERBS)Object.assign(window.SEPARABLE_VERBS,SEPARABLE_MAP);
    if(window.FULL_FORMS)Object.assign(window.FULL_FORMS,FULL_FORMS_EXTRA);
  }
  function classify(){
    const levels=window.VERB_LEVELS||{};
    const meta=window.VERB_META||{};
    JULY_VERBS.forEach(item=>{
      const separable=NEW_SEPARABLE.includes(item.v);
      const inseparable=NEW_INSEPARABLE.includes(item.v)||(!separable&&INSEPARABLE_PREFIX_RE.test(item.v));
      const irregular=NEW_IRREGULAR.includes(item.v)||item.irregular===true;
      const type=inseparable?'inseparable-prefix':(separable?'separable':item.type||'normal');
      levels[item.v]=item.level;
      meta[item.v]={level:item.level,type,separable,inseparablePrefix:inseparable,modal:false,reflexive:false,irregular,strong:irregular,defaultLocked:true};
      const found=(window.ALL_VERBS||[]).find(x=>x.v===item.v);if(found){found.level=item.level;found.type=type;found.irregular=irregular;found.separable=separable;found.inseparablePrefix=inseparable;}
    });
    window.VERB_LEVELS=levels;
    window.VERB_META=meta;
    window.SP_SEPARABLE_VERBS=[...new Set([...(window.SP_SEPARABLE_VERBS||[]),...NEW_SEPARABLE])];
    window.SP_INSEPARABLE_PREFIX_VERBS=[...new Set([...(window.SP_INSEPARABLE_PREFIX_VERBS||[]),...NEW_INSEPARABLE])];
    window.SP_IRREGULAR_VERBS=[...new Set([...(window.SP_IRREGULAR_VERBS||[]),...NEW_IRREGULAR])];
    if(typeof STRONG_IRREGULAR_VERBS!=='undefined')NEW_IRREGULAR.forEach(v=>STRONG_IRREGULAR_VERBS.add(v));
  }
  function lockDefaults(){
    const old=new Set(window.SP_DEFAULT_LOCKED_VERBS||[]);
    LOCKED_BY_DEFAULT.forEach(v=>old.add(v));
    window.SP_DEFAULT_LOCKED_VERBS=[...old];
    window.SP_NEW_VERBS_LOCKED_BY_DEFAULT=LOCKED_BY_DEFAULT.slice();
  }

  addVerbs();
  addTranslations();
  addSentences();
  addGrammar();
  classify();
  lockDefaults();
  window.SP_JULY_2026_VERBS=JULY_VERBS.map(x=>x.v);
})();