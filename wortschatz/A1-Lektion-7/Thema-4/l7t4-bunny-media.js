(function(){
'use strict';
if(window.__SP_L7T4_BUNNY_MEDIA_V1)return;
window.__SP_L7T4_BUNNY_MEDIA_V1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-4/'))return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
let active=null,generation=0;
function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function slug(value){return String(value||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function unique(values){return[...new Set(values.filter(Boolean))]}
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
 const cards=(theme?.tasks||[]).find(t=>t?.id==='karteikarten'||t?.kind==='cards'||/karteikarten/i.test(t?.title||''));
 (cards?.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const word=String(item.word||item.answer||item.full||item.prompt||'').trim();
  const image=String(item.image||item.img||'').trim();
  const basis=basename(image).replace(/\.(webp|png|jpe?g)$/i,'')||slug(word);
  if(!item.audio&&basis)item.audio=AUDIO+encodeURIComponent(basis)+'.mp3';
  if(image&&!/^https?:\/\//i.test(image))item.image=basename(image);
 });
 theme.bunnyMediaRevision='l7t4-bunny-v1';window.L7_THEME=theme;return theme;
});
document.addEventListener('click',event=>{
 const button=event.target instanceof Element?event.target.closest('button[data-audio],button[data-audio-file],[data-action="card-audio"],#cardListenBtn,.card-listen-btn,.word-audio'):null;
 if(!button)return;const value=source(button);if(!value)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();play(value,button)
},true);
window.L7T4BunnyMedia={install,play,stop,candidates,base:CDN,audioBase:AUDIO};
window.addEventListener('beforeunload',stop);
})();
