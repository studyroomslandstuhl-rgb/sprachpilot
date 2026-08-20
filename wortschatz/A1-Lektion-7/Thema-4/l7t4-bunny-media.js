(function(){
'use strict';
if(window.__SP_L7T4_BUNNY_MEDIA_V2)return;
window.__SP_L7T4_BUNNY_MEDIA_V2=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-4/'))return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const FORBIDDEN='sich entschuldigen';
const IMAGE_BY_WORD={
 klasse:'klasse.webp',
 eintritt:'eintritt.webp',
 unterricht:'unterricht.webp',
 leitung:'leitung.webp',
 losfahren:'losfahren.webp',
 bescheid_sagen:'bescheid_sagen.webp',
 gute_besserung:'gute_besserung.webp'
};
let active=null,generation=0;
function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function slug(value){return String(value||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function phrase(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim()}
function unique(values){return[...new Set(values.filter(Boolean))]}
function isForbiddenText(value){return phrase(value)===FORBIDDEN}
function isForbiddenRecord(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const direct=[value.word,value.full,value.term,value.label,value.front,value.answer,value.value];
 if(direct.some(isForbiddenText))return true;
 return phrase(value.prompt).includes(FORBIDDEN);
}
function cleanForbidden(value){
 if(Array.isArray(value))return value.filter(entry=>{
  if(typeof entry==='string')return !isForbiddenText(entry);
  return !isForbiddenRecord(entry);
 }).map(cleanForbidden);
 if(value&&typeof value==='object'){
  Object.keys(value).forEach(key=>{value[key]=cleanForbidden(value[key])});
 }
 return value;
}
function stop(){generation++;try{active?.pause()}catch(e){}if(active){try{active.src=''}catch(e){}active=null}try{window.speechSynthesis?.cancel?.()}catch(e){}document.querySelectorAll('.bunny-audio-playing').forEach(x=>x.classList.remove('bunny-audio-playing'))}
function candidates(value){
 const raw=String(value||'').trim(),file=basename(raw),stem=file.replace(/\.mp3$/i,''),plain=raw.replace(/\.mp3$/i,'').replace(/^(der|die|das)\s+/i,'').trim(),names=unique([stem,slug(stem),plain,slug(plain)]),out=[];
 if(/^https:\/\/sprachpilot\.b-cdn\.net\/audio\//i.test(raw))out.push(raw);
 if(file&&/\.mp3$/i.test(file))out.push(AUDIO+encodeURIComponent(file));
 names.forEach(name=>{if(name)out.push(AUDIO+encodeURIComponent(name)+'.mp3')});
 return unique(out)
}
function play(value,button,done,fail){
 stop();const token=generation,urls=candidates(value);let index=0;
 function next(){
  if(token!==generation)return;
  if(index>=urls.length){button?.classList.remove('bunny-audio-playing');fail?.();return}
  const audio=new Audio(urls[index++]);active=audio;audio.preload='auto';button?.classList.add('bunny-audio-playing');let failed=false;
  const bad=()=>{if(failed||token!==generation)return;failed=true;try{audio.pause();audio.src=''}catch(e){}if(active===audio)active=null;next()};
  audio.addEventListener('error',bad,{once:true});audio.addEventListener('ended',()=>{if(token!==generation)return;if(active===audio)active=null;button?.classList.remove('bunny-audio-playing');done?.()},{once:true});
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(bad)
 }
 next()
}
function source(button){const direct=button?.dataset?.audioFile||button?.dataset?.audio||button?.dataset?.text||'';if(direct)return direct;const scope=button?.closest?.('.flip-face,.l7-learning,.l7-question-card,.question-card,.card')||document;return scope.querySelector?.('.flip-word,.word,h2,h3')?.textContent||''}
function imageUrl(file){const name=basename(file);return name?CDN+encodeURIComponent(name):''}
function install(){
 if(!window.L7S)return false;
 window.L7S.say=(text,fail)=>play(text,null,null,fail);
 window.L7S.image=(file,alt='Bild')=>{const url=imageUrl(file);if(!url)return'';const e=window.L7S.esc||String;return`<div class="l7-image"><img src="${url}" alt="${e(alt)}" loading="eager" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="l7-image-fallback" hidden><strong>${e(alt)}</strong><span>Bild nicht verfügbar.</span></div></div>`};
 window.L7S.__l7t4BunnyMedia=true;try{window.speechSynthesis?.cancel?.()}catch(e){}return true
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(window.L7T4CardContent?.data)delete window.L7T4CardContent.data['sich entschuldigen'];
 cleanForbidden(theme);
 const cards=(theme?.tasks||[]).find(t=>t?.id==='karteikarten'||t?.kind==='cards'||/karteikarten/i.test(t?.title||''));
 (cards?.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const word=String(item.word||item.answer||item.full||item.prompt||'').trim();
  const key=slug(word);
  const current=String(item.image||item.img||'').trim();
  const mapped=IMAGE_BY_WORD[key]||'';
  const file=mapped||basename(current);
  if(file)item.image=CDN+encodeURIComponent(file);
  const basis=basename(item.image).replace(/\.(webp|png|jpe?g)$/i,'')||key;
  if(!item.audio&&basis)item.audio=AUDIO+encodeURIComponent(basis)+'.mp3';
 });
 theme.bunnyMediaRevision='l7t4-bunny-v2';window.L7_THEME=theme;return theme;
});
document.addEventListener('click',event=>{
 const button=event.target instanceof Element?event.target.closest('button[data-audio],button[data-audio-file],[data-action="card-audio"],#cardListenBtn,.card-listen-btn,.word-audio'):null;
 if(!button)return;const value=source(button);if(!value)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();play(value,button)
},true);
window.L7T4BunnyMedia={install,play,stop,candidates,base:CDN,audioBase:AUDIO,imageMap:IMAGE_BY_WORD};
window.addEventListener('beforeunload',stop);
})();