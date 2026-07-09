(function(){
  const CDN='https://sprachpilot.b-cdn.net/Neu/';
  function safe(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function cleanName(name){return String(name||'').split('?')[0].split('#')[0].split('/').pop().replace(/\.(webp|png|jpe?g|gif|svg)$/i,'')}
  function bunny(name){const n=cleanName(name);return n?CDN+n+'.webp':''}
  function findWord(id){return WORDS.find(w=>w&&w.id===id)}
  function patch(id,data){const w=findWord(id);if(w)Object.assign(w,data)}
  function forceImage(w,name){if(!w)return;const n=cleanName(name||w.imageBase||w.id||w.image);if(!n)return;w.imageBase=n;w.image=bunny(n);w.localImage=''}

  ['halb'].forEach(id=>{const idx=WORDS.findIndex(w=>w&&w.id===id);if(idx>=0)WORDS.splice(idx,1)});
  if(Array.isArray(WORDS)) WORDS.forEach(w=>forceImage(w));

  patch('ist_geoeffnet',{imageBase:'ist_geoeffnet',image:bunny('ist_geoeffnet'),aliases:['ist geöffnet','geöffnet']});
  patch('ist_geschlossen',{imageBase:'ist_geschlossen',image:bunny('ist_geschlossen'),aliases:['ist geschlossen','geschlossen']});
  patch('oeffnen',{imageBase:'oeffnen',image:bunny('oeffnen')});
  patch('schliessen',{imageBase:'schliessen',image:bunny('schliessen')});
  patch('anfangen',{imageBase:'anfangen',image:bunny('anfangen')});
  patch('enden',{imageBase:'enden',image:bunny('enden')});
  patch('vereinbaren',{imageBase:'vereinbaren',image:bunny('vereinbaren')});
  patch('ausleihen',{imageBase:'ausleihen',image:bunny('ausleihen')});
  patch('geschaeft',{imageBase:'geschaeft',image:bunny('geschaeft')});
  patch('bibliothek',{imageBase:'bibliothek',image:bunny('bibliothek')});
  patch('kita',{imageBase:'kindergarten',image:bunny('kindergarten'),full:'die Kita',word:'Kita',aliases:['die Kita','Kita','der Kindergarten','Kindergarten']});
  patch('krippe',{imageBase:'krippe',image:bunny('krippe')});
  patch('kindergarten',{imageBase:'kindergarten',image:bunny('kindergarten')});
  patch('praxis',{imageBase:'praxis',image:bunny('praxis')});
  patch('kino',{imageBase:'kino',image:bunny('kino')});
  patch('termin',{imageBase:'termin',image:bunny('termin')});
  patch('feiertag',{imageBase:'feiertag',image:bunny('feiertag')});
  patch('oeffnungszeiten',{imageBase:'oeffnungszeiten',image:bunny('oeffnungszeiten')});
  patch('schild',{imageBase:'schild',image:bunny('schild')});
  patch('ganz',{imageBase:'ganz',image:bunny('ganz')});
  patch('ganzen_tag',{imageBase:'den_ganzen_tag',image:bunny('den_ganzen_tag')});
  patch('zum_beispiel',{imageBase:'zum_beispiel',image:bunny('zum_beispiel'),cue:null,aliases:['zum Beispiel']});
  patch('wieder',{imageBase:'wieder',image:bunny('wieder')});
  patch('total',{imageBase:'ich_bin_total_fertig',image:bunny('ich_bin_total_fertig'),cue:null,aliases:['total','absolut']});
  patch('ich_bin_fertig',{imageBase:'ich_bin_total_fertig',image:bunny('ich_bin_total_fertig')});
  patch('jugend',{imageBase:'jugendliche',image:bunny('jugendliche')});
  patch('jugendliche',{imageBase:'jugendliche',image:bunny('jugendliche')});

  if(!findWord('ich_bin_total_fertig'))WORDS.push({id:'ich_bin_total_fertig',section:'Freizeit',word:'ich bin total fertig',article:'',full:'ich bin total fertig',plural:'',pluralGroup:'',type:'phrase',image:bunny('ich_bin_total_fertig'),imageBase:'ich_bin_total_fertig',sentence:'Ich bin total fertig.',aliases:['ich bin total fertig'],tr:{en:'I am totally exhausted',ru:'я совсем устал(а)',tr:'çok yoruldum',uk:'я дуже втомився / втомилася',ar:'أنا متعب جدًا',ja:'とても疲れています',ro:'sunt foarte obosit(ă)',pl:'jestem totalnie zmęczony / zmęczona',ku:'ez pir westiyayî me'}})

  window.displayImage=displayImage=function(w){return w?bunny(w.imageBase||w.id||w.image):''}
  window.bigImgHtml=bigImgHtml=function(w){const src=displayImage(w);return src?`<img class="task-img" src="${safe(src)}" alt="${safe(w&&w.word||'')}" style="display:block!important;visibility:visible!important;opacity:1!important;max-width:260px;width:100%;height:180px;object-fit:contain;margin:12px auto;background:#fff;border:2px solid var(--lesson-line);border-radius:18px;">`:`<div class="placeholder-img">${safe(w&&w.word||'Bild')}</div>`}
  window.imgHtml=imgHtml=function(w){const src=displayImage(w);return src?`<img src="${safe(src)}" alt="${safe(w&&w.word||'')}" style="display:block!important;visibility:visible!important;opacity:1!important;width:76px;height:76px;object-fit:contain;border-radius:12px;background:#fff;border:1px solid var(--lesson-line);">`:`<div class="word-placeholder">${safe(w&&w.word||'Wort')}</div>`}
  window.l5t4Accepted=function(txt,w){const a=simple(txt);return !!(w&&Array.isArray(w.aliases)&&w.aliases.some(x=>simple(x)===a))}
})();