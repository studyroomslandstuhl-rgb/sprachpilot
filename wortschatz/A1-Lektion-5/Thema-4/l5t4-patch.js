(function(){
  function findWord(id){return WORDS.find(w=>w&&w.id===id)}
  function patch(id,data){const w=findWord(id);if(w)Object.assign(w,data)}
  ['halb','kindergarten','jugendliche'].forEach(id=>{const idx=WORDS.findIndex(w=>w&&w.id===id);if(idx>=0)WORDS.splice(idx,1)})

  patch('ist_geoeffnet',{image:'/assets/img/ist_geoeffnet.png'})
  patch('ist_geschlossen',{image:'/assets/img/ist_geschlossen.png'})
  patch('vereinbaren',{image:'/assets/img/vereinbaren.png'})
  patch('ausleihen',{image:'/assets/img/ausleihen.png'})
  patch('bibliothek',{image:'/assets/img/bibliothek.png'})
  patch('krippe',{image:'/assets/img/krippe.png'})
  patch('praxis',{image:'/assets/img/praxis.png'})
  patch('kino',{image:'/assets/img/kino.png'})
  patch('termin',{image:'/assets/img/termin.png'})
  patch('feiertag',{image:'/assets/img/feiertag.png'})
  patch('oeffnungszeiten',{image:'/assets/img/oeffnungszeiten.png'})
  patch('schild',{image:'/assets/img/schild.png'})
  patch('ganz',{image:'/assets/img/ganz.png'})
  patch('ganzen_tag',{image:'/assets/img/den_ganzen_tag.png'})
  patch('wieder',{image:'/assets/img/wieder.png'})

  patch('zum_beispiel',{image:null,cue:'z.B.',word:'zum Beispiel',full:'zum Beispiel',sentence:'Zum Beispiel: Die Kita ist geöffnet.',aliases:['zum Beispiel']})
  patch('total',{image:null,word:'total',full:'total',sentence:'total = absolut',aliases:['total','absolut']})
  patch('kita',{image:'/assets/img/kindergarten.png',full:'die Kita / der Kindergarten',word:'Kita / Kindergarten',plural:'die Kitas / die Kindergärten',pluralGroup:'Pl.',aliases:['die Kita','Kita','der Kindergarten','Kindergarten']})
  patch('jugend',{image:'/assets/img/jugendliche.png',full:'die Jugend / die Jugendlichen',word:'Jugend / Jugendliche',plural:'die Jugendlichen',pluralGroup:'Pl.',aliases:['die Jugend','Jugend','die Jugendlichen','Jugendliche','Jugendlichen']})

  const oldBig=window.bigImgHtml||bigImgHtml;
  window.bigImgHtml=bigImgHtml=function(w){if(w&&w.cue)return `<div class="placeholder-img">${w.cue}</div>`;return oldBig(w)}
  window.l5t4Accepted=function(txt,w){const a=simple(txt);return !!(w&&Array.isArray(w.aliases)&&w.aliases.some(x=>simple(x)===a))}
})();
