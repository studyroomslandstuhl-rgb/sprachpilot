(function(){
  const additions=[
    {v:'steigen',img:'steigen'},
    {v:'sinken',img:'sinken'}
  ];
  if(Array.isArray(window.ALL_VERBS)){
    additions.forEach(a=>{
      const existing=ALL_VERBS.find(x=>x&&x.v===a.v);
      if(existing)Object.assign(existing,a);
      else ALL_VERBS.push(a);
    });
    window.ALL_VERBS=ALL_VERBS;
  }
  if(window.VERB_TRANSLATIONS){
    const tr={
      'Englisch':{steigen:'to rise',sinken:'to fall'},
      'Russisch':{steigen:'повышаться',sinken:'понижаться'},
      'Ukrainisch':{steigen:'підвищуватися',sinken:'знижуватися'},
      'Türkisch':{steigen:'yükselmek',sinken:'düşmek'},
      'Arabisch':{steigen:'يرتفع',sinken:'ينخفض'},
      'Rumänisch':{steigen:'a crește',sinken:'a scădea'},
      'Polnisch':{steigen:'rosnąć',sinken:'spadać'},
      'Japanisch':{steigen:'上がる',sinken:'下がる'},
      'Kurdisch':{steigen:'bilind bûn',sinken:'daketin'}
    };
    Object.entries(tr).forEach(([lang,map])=>{
      VERB_TRANSLATIONS[lang]=Object.assign({},VERB_TRANSLATIONS[lang]||{},map);
    });
  }
})();