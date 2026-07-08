(function(){
  function findWord(id){return WORDS.find(w=>w&&w.id===id)}
  function patch(id,data){const w=findWord(id);if(w)Object.assign(w,data)}
  ['halb','kindergarten','jugendliche','ich_bin_fertig'].forEach(id=>{const idx=WORDS.findIndex(w=>w&&w.id===id);if(idx>=0)WORDS.splice(idx,1)})

  patch('ist_geoeffnet',{image:'/assets/img/ist_geoeffnet.png'})
  patch('ist_geschlossen',{image:'/assets/img/ist_geschlossen.png'})
  patch('anfangen',{image:'/assets/img/anfangen.png'})
  patch('enden',{image:'/assets/img/enden.png'})
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

  patch('zum_beispiel',{image:null,cue:'z.B.',word:'zum Beispiel',full:'zum Beispiel',sentence:'z.B. = zum Beispiel',aliases:['zum Beispiel']})
  patch('total',{image:null,cue:'Alternative für „absolut“',word:'total',full:'total',sentence:'total = Alternative für „absolut“',aliases:['total','absolut']})
  patch('kita',{image:'/assets/img/kindergarten.png',full:'die Kita / der Kindergarten',word:'Kita / Kindergarten',plural:'die Kitas / die Kindergärten',pluralGroup:'Pl.',aliases:['die Kita','Kita','der Kindergarten','Kindergarten']})
  patch('jugend',{image:'/assets/img/jugendliche.png',full:'die Jugend / die Jugendlichen',word:'Jugend / Jugendliche',plural:'die Jugendlichen',pluralGroup:'Pl.',aliases:['die Jugend','Jugend','die Jugendlichen','Jugendliche','Jugendlichen']})

  if(!findWord('ich_bin_total_fertig'))WORDS.push({id:'ich_bin_total_fertig',section:'Freizeit',word:'ich bin total fertig',article:'',full:'ich bin total fertig',plural:'',pluralGroup:'',type:'phrase',image:'/assets/img/ich_bin_total_fertig.png',sentence:'Ich bin total fertig.',aliases:['ich bin total fertig'],tr:{en:'I am totally exhausted',ru:'я совсем устал(а)',tr:'çok yoruldum',uk:'я дуже втомився / втомилася',ar:'أنا متعب جدًا',ja:'とても疲れています',ro:'sunt foarte obosit(ă)',pl:'jestem totalnie zmęczony / zmęczona',ku:'ez pir westiyayî me'}})

  const oldDisplay=window.displayImage||displayImage;
  window.displayImage=displayImage=function(w){return w&&w.image?w.image:oldDisplay(w)}
  const oldBig=window.bigImgHtml||bigImgHtml;
  window.bigImgHtml=bigImgHtml=function(w){if(w&&w.cue)return `<div class="placeholder-img">${w.cue}</div>`;return oldBig(w)}
  const oldSmall=window.imgHtml||imgHtml;
  window.imgHtml=imgHtml=function(w){if(w&&w.cue)return `<div class="word-placeholder">${w.cue}</div>`;return oldSmall(w)}
  window.l5t4Accepted=function(txt,w){const a=simple(txt);return !!(w&&Array.isArray(w.aliases)&&w.aliases.some(x=>simple(x)===a))}
})();
