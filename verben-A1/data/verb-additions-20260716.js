// Neue Verben vom 16.07.2026: gemeinsame Daten für Verben A1 und Verben Test.
(function(){
  const NEW_VERBS=[
    {v:"klopfen",img:"klopfen",level:"A1",type:"normal"},
    {v:"riechen",img:"riechen",level:"A1",type:"normal"},
    {v:"stinken",img:"stinken",level:"A1",type:"normal"},
    {v:"schauen",img:"schauen",level:"A1",type:"normal"},
    {v:"gucken",img:"gucken",level:"A1",type:"normal"},
    {v:"würfeln",img:"wuerfeln",level:"A1",type:"normal"},
    {v:"schweigen",img:"schweigen",level:"A2",type:"normal"},
    {v:"vernichten",img:"vernichten",level:"A2",type:"inseparable-prefix"},
    {v:"erleben",img:"erleben",level:"A2",type:"inseparable-prefix"}
  ];
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
  const EXAMPLES={
    "klopfen":"an die Tür",
    "riechen":"gut",
    "stinken":"der Müll",
    "schauen":"aus dem Fenster",
    "gucken":"einen Film",
    "würfeln":"mit dem Würfel",
    "schweigen":"im Unterricht",
    "vernichten":"das Papier",
    "erleben":"einen schönen Tag"
  };
  const FULL_FORMS_EXTRA={
    "riechen":{"ich":"rieche","du":"riechst","er/sie/es":"riecht","wir":"riechen","ihr":"riecht","sie/Sie":"riechen"},
    "würfeln":{"ich":"würfle","du":"würfelst","er/sie/es":"würfelt","wir":"würfeln","ihr":"würfelt","sie/Sie":"würfeln"},
    "schweigen":{"ich":"schweige","du":"schweigst","er/sie/es":"schweigt","wir":"schweigen","ihr":"schweigt","sie/Sie":"schweigen"}
  };
  const INSEPARABLE_VERBS=["vernichten","erleben"];
  const INSEPARABLE_PREFIX_RE=/^(be|emp|ent|er|ge|miss|ver|zer)/;

  function addVerbs(){
    window.ALL_VERBS=window.ALL_VERBS||[];
    const existing=new Set(window.ALL_VERBS.map(x=>x&&x.v).filter(Boolean));
    NEW_VERBS.forEach(item=>{
      if(existing.has(item.v))return;
      window.ALL_VERBS.push(Object.assign({},item));
      existing.add(item.v);
    });
  }

  function addSentences(){
    window.VERB_SENTENCES=window.VERB_SENTENCES||{};
    Object.assign(window.VERB_SENTENCES,SENTENCES);
    const old=window.sentenceForVerb;
    window.sentenceForVerb=function(v){
      return window.VERB_SENTENCES[v]||(typeof old==='function'?old(v):'Ich schreibe einen Satz.');
    };
  }

  function addGrammar(){
    if(window.CONJ_EXAMPLES)Object.assign(window.CONJ_EXAMPLES,EXAMPLES);
    if(window.FULL_FORMS)Object.assign(window.FULL_FORMS,FULL_FORMS_EXTRA);
  }

  function classify(){
    const levels=window.VERB_LEVELS||{};
    const meta=window.VERB_META||{};
    const locked=new Set([...(window.SP_DEFAULT_LOCKED_VERBS||[])]);
    const newLocked=new Set([...(window.SP_NEW_VERBS_LOCKED_BY_DEFAULT||[])]);
    const inseparable=new Set([...(window.SP_INSEPARABLE_PREFIX_VERBS||[]),...INSEPARABLE_VERBS]);
    NEW_VERBS.forEach(item=>{
      const isInsep=item.type==='inseparable-prefix'||INSEPARABLE_PREFIX_RE.test(item.v.replace(/^sich\s+/,''));
      const type=isInsep?'inseparable-prefix':(item.type||'normal');
      levels[item.v]=item.level||'A1';
      meta[item.v]={...(meta[item.v]||{}),level:levels[item.v],type,separable:false,reflexive:false,inseparablePrefix:isInsep,modal:false,irregular:false,strong:false,defaultLocked:true};
      const found=window.ALL_VERBS.find(x=>x&&x.v===item.v);
      if(found)Object.assign(found,{level:levels[item.v],type,separable:false,reflexive:false,inseparablePrefix:isInsep,irregular:false});
      if(isInsep)inseparable.add(item.v);
      locked.add(item.v);
      newLocked.add(item.v);
    });
    window.VERB_LEVELS=levels;
    window.VERB_META=meta;
    window.SP_INSEPARABLE_PREFIX_VERBS=[...inseparable];
    window.SP_DEFAULT_LOCKED_VERBS=[...locked];
    window.SP_NEW_VERBS_LOCKED_BY_DEFAULT=[...newLocked];
  }

  addVerbs();
  addSentences();
  addGrammar();
  classify();
  window.SP_VERB_ADDITIONS_20260716=NEW_VERBS.map(x=>x.v);
})();
