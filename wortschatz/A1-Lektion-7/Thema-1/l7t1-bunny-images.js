(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_IMAGES_4)return;
window.__SP_L7T1_BUNNY_IMAGES_4=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const CDN='https://sprachpilot.b-cdn.net/';

const UPLOADED=Object.freeze([
 'brief.webp','buch.webp','eintritt.webp','gitarre_spielen.webp','grundschule.webp',
 'junge.webp','kilometer.webp','klasse.webp','kommunikation.webp','leidtun.webp',
 'lied.webp','losfahren.webp','maedchen.webp','schade.webp','schwimmbad.webp',
 'ski_fahren.webp','tennis_spielen.webp','text.webp','ueben.webp','uebung.webp','unterricht.webp',
 'auf_jeden_fall.webp','auf_keinen_fall.webp','nach_hause.webp','los_sein.webp',
 'franzoesisch.webp','mathematik.webp','puenktlich.webp','jonglieren.webp','endlich.webp',
 'fertig.webp','prima.webp','test.webp'
]);

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

 'auf jeden fall':['auf_jeden_fall.webp'],
 'auf keinen fall':['auf_keinen_fall.webp'],
 'nach hause':['nach_hause.webp'],
 'los sein':['los_sein.webp'],
 'französisch':['franzoesisch.webp'], 'franzoesisch':['franzoesisch.webp'],
 'mathematik':['mathematik.webp'], 'die mathematik':['mathematik.webp'],
 'pünktlich':['puenktlich.webp'], 'puenktlich':['puenktlich.webp'],
 'jonglieren':['jonglieren.webp'],
 'endlich':['endlich.webp'],
 'fertig':['fertig.webp'], 'fertig sein':['fertig.webp'],
 'prima':['prima.webp'],
 'test':['test.webp'], 'der test':['test.webp'],

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
  .replace(/[„“”"'`´.,!?;:()\[\]{}]/g,' ')
  .replace(/\s+/g,' ').trim();
}
function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function keyFromFile(value){
 return basename(value).replace(/\.(webp|png|jpe?g|gif|svg)$/i,'').replace(/_/g,' ')
  .replace(/ae/g,'ä').replace(/oe/g,'ö').replace(/ue/g,'ü');
}
function mappedList(value){
 const text=norm(value);
 if(!text)return[];
 if(MAP[text])return MAP[text].slice();
 const padded=' '+text+' ';
 const hit=ORDERED_KEYS.find(key=>padded.includes(' '+key+' '));
 return hit?MAP[hit].slice():[];
}
function unique(list){
 const seen=new Set(),out=[];
 (list||[]).forEach(name=>{name=basename(name);if(name&&!seen.has(name)){seen.add(name);out.push(name)}});
 return out;
}
function itemSemantic(item){
 if(!item||typeof item!=='object')return'';
 const article=String(item.article||'').trim();
 const word=String(item.word||'').trim();
 const full=article&&word&&!/^(der|die|das)\s/i.test(word)?`${article} ${word}`:word;
 return [item.full,full,item.term,item.answer,item.prompt,item.context,item.meaning,item.label,item.solution]
  .filter(Boolean).join(' ');
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
function resolveFile(file,alt='',context=''){
 const list=candidates(file,alt,context);
 return list[0]||basename(file);
}
function resolveItem(item){
 const current=basename(item?.image||item?.img||'');
 const semantic=itemSemantic(item);
 return mappedList(semantic)[0]||mappedList(keyFromFile(current))[0]||current;
}
function url(file){return CDN+encodeURIComponent(basename(file))}
function escapeAttr(value){return String(value||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function contextText(img){
 const scope=img.closest('.sp-overview-word,.overview-card,.word-card,.vocab-card,.l7-overview-card,.l7-learning,.l7-question-card,.flip-card,.card,.l7-card,article');
 const text=scope?.innerText||scope?.textContent||'';
 return String(text).slice(0,1000);
}
function nextCandidate(img){
 let list=[];
 try{list=JSON.parse(img.dataset.l7t1Candidates||'[]')}catch{}
 const pos=Number(img.dataset.l7t1Pos||0)+1;
 if(pos<list.length){
  img.dataset.l7t1Pos=String(pos);
  img.hidden=false;
  img.src=url(list[pos]);
  return true;
 }
 return false;
}
function patchImage(img){
 if(!(img instanceof HTMLImageElement)||!img.closest('#app'))return;
 if(img.closest('.l7-brand,.brand,.topbar,.l7-topbar,.sp-header'))return;
 const current=basename(img.currentSrc||img.src||'');
 const alt=img.getAttribute('alt')||'';
 const list=candidates(current,alt,contextText(img));
 if(!list.length)return;
 const signature=list.join('|');
 if(img.dataset.l7t1Signature===signature)return;
 img.dataset.l7t1Signature=signature;
 img.dataset.l7t1Candidates=JSON.stringify(list);
 img.dataset.l7t1Pos='0';
 img.onerror=function(){
  if(nextCandidate(this))return;
  this.hidden=true;
  const fallback=this.nextElementSibling;
  if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback')||fallback?.classList?.contains('sp-overview-word__fallback'))fallback.hidden=false;
 };
 img.onload=function(){
  this.hidden=false;
  const fallback=this.nextElementSibling;
  if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback')||fallback?.classList?.contains('sp-overview-word__fallback'))fallback.hidden=true;
 };
 const wanted=url(list[0]);
 if(img.src!==wanted)img.src=wanted;
}
function patchAll(root=document){root.querySelectorAll?.('#app img').forEach(patchImage)}
function patchTheme(theme){
 const seen=new Set();
 function walk(value){
  if(!value||typeof value!=='object'||seen.has(value))return;
  seen.add(value);
  if(Array.isArray(value)){value.forEach(walk);return}
  const mapped=resolveItem(value);
  const hasSemantic=!!itemSemantic(value);
  if(mapped&&hasSemantic){
   if('image' in value||!('img' in value))value.image=mapped;
   if('img' in value)value.img=mapped;
  }
  Object.values(value).forEach(walk);
 }
 walk(theme);
 return theme;
}
function imageHtml(file,alt='Bild'){
 if(!file)return'';
 const list=candidates(file,alt,alt);
 if(!list.length)return'';
 const encoded=escapeAttr(JSON.stringify(list));
 return `<div class="l7-image"><img src="${url(list[0])}" data-l7t1-signature="${escapeAttr(list.join('|'))}" data-l7t1-candidates="${encoded}" data-l7t1-pos="0" alt="${escapeAttr(alt)}" onerror="window.L7T1BunnyImages.fail(this)"><div class="l7-image-fallback" hidden><strong>${escapeAttr(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`;
}
function installRenderer(){
 const S=window.L7S;
 if(!S)return false;
 S.image=imageHtml;
 S.__l7t1BunnyImagesV4=true;
 return true;
}

window.L7T1BunnyImages={
 uploaded:UPLOADED.slice(),map:MAP,candidates,resolveFile,resolveItem,patchAll,patchImage,patchTheme,imageHtml,installRenderer,
 fail(img){if(!nextCandidate(img))img.hidden=true}
};

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const patched=patchTheme(theme);
 queueMicrotask(()=>patchAll(document));
 return patched;
});

if(!installRenderer()){
 let tries=0;
 const timer=setInterval(()=>{if(installRenderer()||++tries>300)clearInterval(timer)},20);
}

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
window.addEventListener('load',()=>{installRenderer();patchAll(document);setTimeout(()=>patchAll(document),250);setTimeout(()=>patchAll(document),1000)});
patchAll(document);
})();
