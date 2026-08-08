(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_IMAGES_2)return;
window.__SP_L7T1_BUNNY_IMAGES_2=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const CDN='https://sprachpilot.b-cdn.net/';

// Exakte Dateien aus dem von der Lehrkraft hochgeladenen Bunny-Paket.
const UPLOADED=Object.freeze([
 'brief.webp','buch.webp','eintritt.webp','gitarre_spielen.webp','grundschule.webp',
 'junge.webp','kilometer.webp','klasse.webp','kommunikation.webp','leidtun.webp',
 'lied.webp','losfahren.webp','maedchen.webp','schade.webp','schwimmbad.webp',
 'ski_fahren.webp','tennis_spielen.webp','text.webp','ueben.webp','uebung.webp','unterricht.webp'
]);

// Pro Wort mehrere Bunny-Kandidaten. Der erste Eintrag ist immer die bevorzugte Datei.
// Bei älteren L7T1-Karten werden zusätzlich vorhandene SprachPilot-Bilder als Fallback versucht.
const MAP=Object.freeze({
 'brief':['brief.webp'], 'der brief':['brief.webp'],
 'buch':['buch.webp'], 'das buch':['buch.webp'],
 'eintritt':['eintritt.webp'], 'der eintritt':['eintritt.webp'],
 'gitarre':['gitarre_spielen.webp','gitarre.webp','spielen.webp'],
 'die gitarre':['gitarre_spielen.webp','gitarre.webp','spielen.webp'],
 'gitarre spielen':['gitarre_spielen.webp','spielen.webp'],
 'grundschule':['grundschule.webp'], 'die grundschule':['grundschule.webp'],
 'junge':['junge.webp'], 'der junge':['junge.webp'],
 'kilometer':['kilometer.webp'], 'der kilometer':['kilometer.webp'],
 'klasse':['klasse.webp'], 'die klasse':['klasse.webp'],
 'kommunikation':['kommunikation.webp'], 'die kommunikation':['kommunikation.webp'],
 'leidtun':['leidtun.webp'], 'leid tun':['leidtun.webp'], 'tut mir leid':['leidtun.webp'],
 'lied':['lied.webp'], 'das lied':['lied.webp'], 'lieder':['lied.webp'],
 'losfahren':['losfahren.webp'], 'fährt los':['losfahren.webp'], 'fahren los':['losfahren.webp'],
 'mädchen':['maedchen.webp'], 'maedchen':['maedchen.webp'],
 'das mädchen':['maedchen.webp'], 'das maedchen':['maedchen.webp'],
 'schade':['schade.webp'],
 'schwimmbad':['schwimmbad.webp'], 'das schwimmbad':['schwimmbad.webp'],
 'ski':['ski_fahren.webp','ski.webp','fahren.webp'], 'der ski':['ski_fahren.webp','ski.webp','fahren.webp'],
 'ski fahren':['ski_fahren.webp','fahren.webp'],
 'tennis':['tennis_spielen.webp','tennis.webp','spielen.webp'], 'das tennis':['tennis_spielen.webp','tennis.webp','spielen.webp'],
 'tennis spielen':['tennis_spielen.webp','spielen.webp'],
 'text':['text.webp'], 'der text':['text.webp'], 'texte':['text.webp'],
 'üben':['ueben.webp'], 'ueben':['ueben.webp'], 'grammatik üben':['ueben.webp'],
 'übung':['uebung.webp'], 'uebung':['uebung.webp'], 'die übung':['uebung.webp'], 'die uebung':['uebung.webp'],
 'übungen':['uebung.webp'], 'uebungen':['uebung.webp'],
 'unterricht':['unterricht.webp'], 'der unterricht':['unterricht.webp'],

 // Karten, deren alte Nomen-Datei auf Bunny teilweise nicht existiert.
 'spiel':['spiel.webp','spielen.webp','spiel_machen.webp'],
 'das spiel':['spiel.webp','spielen.webp','spiel_machen.webp'],
 'film':['film.webp','sehen.webp','fernsehen.webp'],
 'der film':['film.webp','sehen.webp','fernsehen.webp'],
 'grammatik':['grammatik.webp','ueben.webp'],
 'die grammatik':['grammatik.webp','ueben.webp'],
 'hausaufgabe':['hausaufgabe.webp','machen.webp','uebung.webp'],
 'die hausaufgabe':['hausaufgabe.webp','machen.webp','uebung.webp'],
 'fahrrad':['fahrrad.webp','fahrrad_fahren.webp','fahren.webp'],
 'das fahrrad':['fahrrad.webp','fahrrad_fahren.webp','fahren.webp'],
 'kuchen':['kuchen.webp','backen.webp'],
 'der kuchen':['kuchen.webp','backen.webp'],
 'freund':['freund.webp','freunde.webp','treffen.webp'],
 'der freund':['freund.webp','freunde.webp','treffen.webp'],
 'handstand':['handstand.webp','handstand_machen.webp','machen.webp'],
 'der handstand':['handstand.webp','handstand_machen.webp','machen.webp']
});

const ORDERED_KEYS=Object.keys(MAP).sort((a,b)=>b.length-a.length);
function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFC')
  .replace(/[„“”"'`´.,!?;:()]/g,' ')
  .replace(/\s+/g,' ').trim();
}
function basename(value){
 return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'';
}
function keyFromFile(value){
 return basename(value).replace(/\.(webp|png|jpe?g|gif|svg)$/i,'').replace(/_/g,' ')
  .replace(/ae/g,'ä').replace(/oe/g,'ö').replace(/ue/g,'ü');
}
function mappedList(value){
 const text=norm(value);
 if(!text)return[];
 if(MAP[text])return MAP[text].slice();
 const hit=ORDERED_KEYS.find(key=>text===key||text.includes(' '+key+' ')||text.startsWith(key+' ')||text.endsWith(' '+key));
 return hit?MAP[hit].slice():[];
}
function unique(list){
 const seen=new Set(),out=[];
 (list||[]).forEach(name=>{name=basename(name);if(name&&!seen.has(name)){seen.add(name);out.push(name)}});
 return out;
}
function candidates(file,alt='',context=''){
 const raw=basename(file);
 return unique([
  ...mappedList(alt),
  ...mappedList(context),
  ...mappedList(keyFromFile(raw)),
  raw
 ]);
}
function url(file){return CDN+encodeURIComponent(file)}
function escapeAttr(value){return String(value||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function contextText(img){
 const scope=img.closest(
  '.overview-card,.word-card,.vocab-card,.l7-overview-card,.l7-learning,.l7-question-card,.flip-card,.card,.l7-card,article'
 );
 const text=scope?.innerText||scope?.textContent||'';
 return String(text).slice(0,800);
}

function nextCandidate(img){
 let list=[];
 try{list=JSON.parse(img.dataset.l7t1Candidates||'[]')}catch{}
 let pos=Number(img.dataset.l7t1Pos||0)+1;
 if(pos<list.length){
  img.dataset.l7t1Pos=String(pos);
  img.hidden=false;
  img.src=url(list[pos]);
  return true;
 }
 return false;
}

function patchImage(img){
 if(!(img instanceof HTMLImageElement))return;
 if(!img.closest('#app'))return;
 // Logo/Bedienelemente nicht anfassen.
 if(img.closest('.l7-brand,.brand,.topbar,.l7-topbar'))return;
 const current=basename(img.currentSrc||img.src||'');
 const alt=img.getAttribute('alt')||'';
 const context=contextText(img);
 const list=candidates(current,alt,context);
 if(!list.length)return;
 const signature=list.join('|');
 if(img.dataset.l7t1Signature===signature){
  if(img.complete&&img.naturalWidth===0&&!img.dataset.l7t1Recovering){
   img.dataset.l7t1Recovering='1';
   if(!nextCandidate(img)){
    img.hidden=true;
    const fallback=img.nextElementSibling;
    if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback'))fallback.hidden=false;
   }
   setTimeout(()=>delete img.dataset.l7t1Recovering,0);
  }
  return;
 }
 img.dataset.l7t1Signature=signature;
 img.dataset.l7t1Candidates=JSON.stringify(list);
 const currentIndex=list.indexOf(current);
 // Wenn das aktuelle Bild schon erfolgreich geladen wurde, bleibt es bestehen.
 if(img.complete&&img.naturalWidth>0&&currentIndex>=0){
  img.dataset.l7t1Pos=String(currentIndex);
  return;
 }
 let start=0;
 // Bei einem bereits kaputten aktuellen Kandidaten direkt den nächsten versuchen.
 if(img.complete&&img.naturalWidth===0&&currentIndex>=0&&currentIndex<list.length-1)start=currentIndex+1;
 img.dataset.l7t1Pos=String(start);
 img.onerror=function(){
  if(nextCandidate(this))return;
  this.hidden=true;
  const fallback=this.nextElementSibling;
  if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback'))fallback.hidden=false;
 };
 img.onload=function(){
  this.hidden=false;
  const fallback=this.nextElementSibling;
  if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback'))fallback.hidden=true;
 };
 img.hidden=false;
 img.src=url(list[start]);
}

function patchAll(root=document){
 root.querySelectorAll?.('#app img').forEach(patchImage);
}

function patchTheme(theme){
 const seen=new Set();
 function walk(value){
  if(!value||typeof value!=='object'||seen.has(value))return;
  seen.add(value);
  if(Array.isArray(value)){value.forEach(walk);return}
  const semantic=[value.full,value.word,value.term,value.answer,value.prompt,value.context,value.meaning].filter(Boolean).join(' ');
  const mapped=mappedList(semantic)[0]||mappedList(keyFromFile(value.image||value.img||''))[0];
  if(mapped){
   if('image' in value||!('img' in value))value.image=mapped;
   if('img' in value)value.img=mapped;
  }
  Object.values(value).forEach(walk);
 }
 walk(theme);
 return theme;
}

// Daten korrigieren, bevor Übersicht/Aufgabe gerendert wird.
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const patched=patchTheme(theme);
 queueMicrotask(()=>patchAll(document));
 return patched;
});

window.L7T1BunnyImages={
 uploaded:UPLOADED.slice(),map:MAP,candidates,patchAll,patchImage,
 fail(img){if(!nextCandidate(img)){img.hidden=true}}
};

// Der gemeinsame L7-Renderer kann nach diesem Skript geladen werden. Sobald L7S da ist,
// verwendet auch S.image dieselbe Kandidatenlogik.
function installImageRenderer(){
 const S=window.L7S;
 if(!S||S.__l7t1BunnyImagesV2)return false;
 S.__l7t1BunnyImagesV2=true;
 S.image=function(file,alt='Bild'){
  if(!file)return'';
  const list=candidates(file,alt,alt);
  if(!list.length)return'';
  const encoded=escapeAttr(JSON.stringify(list));
  return `<div class="l7-image"><img src="${url(list[0])}" data-l7t1-signature="${escapeAttr(list.join('|'))}" data-l7t1-candidates="${encoded}" data-l7t1-pos="0" alt="${escapeAttr(alt)}" onerror="window.L7T1BunnyImages.fail(this)"><div class="l7-image-fallback" hidden><strong>${escapeAttr(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`;
 };
 return true;
}
if(!installImageRenderer()){
 let tries=0;
 const timer=setInterval(()=>{if(installImageRenderer()||++tries>300)clearInterval(timer)},20);
}

// Entscheidend für die Wortschatz-Übersicht: sie verwendet teilweise einen eigenen Renderer.
// Deshalb werden auch bereits erzeugte oder später eingefügte IMG-Elemente zentral repariert.
const observer=new MutationObserver(mutations=>{
 for(const mutation of mutations){
  mutation.addedNodes.forEach(node=>{
   if(node.nodeType!==1)return;
   if(node.matches?.('img'))patchImage(node);
   patchAll(node);
  });
 }
});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{patchAll(document);setTimeout(()=>patchAll(document),250);setTimeout(()=>patchAll(document),1000)});
patchAll(document);
})();
