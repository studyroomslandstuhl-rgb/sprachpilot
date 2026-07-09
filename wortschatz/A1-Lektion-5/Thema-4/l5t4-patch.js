(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  function findWord(id){return WORDS.find(w=>w&&w.id===id)}
  function patch(id,data){const w=findWord(id);if(w)Object.assign(w,data)}
  function cleanName(name){return String(name||'').replace(/^\/+/, '').replace(/\.(webp|png|jpe?g)$/i,'')}
  function bunny(name){return CDN+cleanName(name)+'.webp'}
  function local(name){return '/assets/img/'+cleanName(name)+'.png'}
  function setImage(id,name,localName){patch(id,{image:bunny(name),imageBase:cleanName(name),localImage:local(localName||name)})}
  function enc(s){return encodeURIComponent(String(s||''))}
  function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function imgCandidates(w){
    if(!w)return [];
    const bases=[];
    if(w.imageBase)bases.push(w.imageBase);
    if(w.id)bases.push(w.id);
    if(w.image&&!/^https?:\/\//.test(w.image))bases.push(cleanName(String(w.image).split('/').pop()));
    const uniq=[...new Set(bases.filter(Boolean).map(cleanName))];
    const out=[];
    uniq.forEach(b=>out.push(CDN+b+'.webp',CDN+b+'.png',CDN+b+'.jpg',CDN+b+'.jpeg'));
    if(w.localImage)out.push(w.localImage);
    if(w.image&&!/^https?:\/\//.test(w.image))out.push(w.image);
    return [...new Set(out.filter(Boolean))];
  }
  window.l5t4ImgFallback=function(img){
    const raw=String(img.getAttribute('data-fallbacks')||'');
    const list=raw?raw.split('|').map(x=>decodeURIComponent(x)).filter(Boolean):[];
    if(list.length){img.setAttribute('data-fallbacks',list.slice(1).map(enc).join('|'));img.src=list[0];return}
    const ph=document.createElement('div');ph.className=img.classList.contains('task-img')?'placeholder-img':'word-placeholder';ph.textContent='Wort';img.replaceWith(ph);
  }
  function imgTag(w,cls){
    const c=imgCandidates(w);
    if(!c.length)return '';
    return `<img${cls?` class="${cls}"`:''} src="${esc(c[0])}" data-fallbacks="${c.slice(1).map(enc).join('|')}" onerror="l5t4ImgFallback(this)" alt="">`;
  }

  ['halb','kindergarten','jugendliche','ich_bin_fertig'].forEach(id=>{const idx=WORDS.findIndex(w=>w&&w.id===id);if(idx>=0)WORDS.splice(idx,1)})

  setImage('ist_geoeffnet','ist_geoeffnet')
  setImage('ist_geschlossen','ist_geschlossen')
  setImage('oeffnen','oeffnen')
  setImage('schliessen','schliessen')
  setImage('anfangen','anfangen')
  setImage('enden','enden')
  setImage('vereinbaren','vereinbaren')
  setImage('ausleihen','ausleihen')
  setImage('geschaeft','geschaeft')
  setImage('bibliothek','bibliothek')
  setImage('krippe','krippe')
  setImage('praxis','praxis')
  setImage('kino','kino')
  setImage('termin','termin')
  setImage('feiertag','feiertag')
  setImage('oeffnungszeiten','oeffnungszeiten')
  setImage('schild','schild')
  setImage('ganz','ganz')
  setImage('ganzen_tag','den_ganzen_tag')
  setImage('wieder','wieder')

  patch('zum_beispiel',{image:null,cue:'z.B.',word:'zum Beispiel',full:'zum Beispiel',sentence:'z.B. = zum Beispiel',aliases:['zum Beispiel']})
  patch('total',{image:null,cue:'Alternative für „absolut“',word:'total',full:'total',sentence:'total = Alternative für „absolut“',aliases:['total','absolut']})
  patch('kita',{image:bunny('kindergarten'),imageBase:'kindergarten',localImage:local('kindergarten'),full:'die Kita / der Kindergarten',word:'Kita / Kindergarten',plural:'die Kitas / die Kindergärten',pluralGroup:'Pl.',aliases:['die Kita','Kita','der Kindergarten','Kindergarten']})
  patch('jugend',{image:bunny('jugendliche'),imageBase:'jugendliche',localImage:local('jugendliche'),full:'die Jugend / die Jugendlichen',word:'Jugend / Jugendliche',plural:'die Jugendlichen',pluralGroup:'Pl.',aliases:['die Jugend','Jugend','die Jugendlichen','Jugendliche','Jugendlichen']})

  if(!findWord('ich_bin_total_fertig'))WORDS.push({id:'ich_bin_total_fertig',section:'Freizeit',word:'ich bin total fertig',article:'',full:'ich bin total fertig',plural:'',pluralGroup:'',type:'phrase',image:bunny('ich_bin_total_fertig'),imageBase:'ich_bin_total_fertig',localImage:local('ich_bin_total_fertig'),sentence:'Ich bin total fertig.',aliases:['ich bin total fertig'],tr:{en:'I am totally exhausted',ru:'я совсем устал(а)',tr:'çok yoruldum',uk:'я дуже втомився / втомилася',ar:'أنا متعب جدًا',ja:'とても疲れています',ro:'sunt foarte obosit(ă)',pl:'jestem totalnie zmęczony / zmęczona',ku:'ez pir westiyayî me'}})

  const oldDisplay=window.displayImage||displayImage;
  window.displayImage=displayImage=function(w){const c=imgCandidates(w);return c[0]||(w&&w.image?w.image:oldDisplay(w))}
  const oldBig=window.bigImgHtml||bigImgHtml;
  window.bigImgHtml=bigImgHtml=function(w){if(w&&w.cue)return `<div class="placeholder-img">${esc(w.cue)}</div>`;const tag=imgTag(w,'task-img');return tag||oldBig(w)}
  const oldSmall=window.imgHtml||imgHtml;
  window.imgHtml=imgHtml=function(w){if(w&&w.cue)return `<div class="word-placeholder">${esc(w.cue)}</div>`;const tag=imgTag(w,'');return tag||oldSmall(w)}
  window.l5t4Accepted=function(txt,w){const a=simple(txt);return !!(w&&Array.isArray(w.aliases)&&w.aliases.some(x=>simple(x)===a))}
})();