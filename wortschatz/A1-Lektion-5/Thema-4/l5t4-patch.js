(function(){
  function findWord(id){return WORDS.find(w=>w&&w.id===id)}
  function patch(id,data){const w=findWord(id);if(w)Object.assign(w,data)}
  ['halb','kindergarten','jugendliche'].forEach(id=>{const idx=WORDS.findIndex(w=>w&&w.id===id);if(idx>=0)WORDS.splice(idx,1)})
  patch('ist_geoeffnet',{image:null})
  patch('ist_geschlossen',{image:null})
  patch('zum_beispiel',{word:'z.B.',full:'z.B.',sentence:'z.B.: Die Kita ist geöffnet.'})
  patch('total',{image:null,word:'total',full:'total',sentence:'total = absolut',aliases:['total','absolut']})
  patch('kita',{full:'die Kita / der Kindergarten',word:'Kita / Kindergarten',plural:'die Kitas / die Kindergärten',pluralGroup:'Pl.',aliases:['die Kita','Kita','der Kindergarten','Kindergarten']})
  patch('jugend',{full:'die Jugend / die Jugendlichen',word:'Jugend / Jugendliche',plural:'die Jugendlichen',pluralGroup:'Pl.',aliases:['die Jugend','Jugend','die Jugendlichen','Jugendliche','Jugendlichen']})
  window.l5t4Accepted=function(txt,w){const a=simple(txt);return !!(w&&Array.isArray(w.aliases)&&w.aliases.some(x=>simple(x)===a))}
})();
