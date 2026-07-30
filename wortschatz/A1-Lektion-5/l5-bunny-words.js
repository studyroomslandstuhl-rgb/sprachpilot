(function(){
'use strict';
if(window.__SP_L5_BUNNY_AUDIO_ALL3)return;
window.__SP_L5_BUNNY_AUDIO_ALL3=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO_DIRS=[CDN+'audio/',CDN+'Audio/'];
const synth=window.speechSynthesis;
const nativeSpeak=synth&&typeof synth.speak==='function'?synth.speak.bind(synth):null;
const nativeCancel=synth&&typeof synth.cancel==='function'?synth.cancel.bind(synth):null;
let activeAudio=null;
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function simple(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[….,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return simple(value).replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'')}
function basename(value){return String(value??'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function unique(list){return [...new Set(list.filter(Boolean))]}
function themeNumber(){const id=String(window.SP_L5_THEME?.id||'');return id.match(/(\d+)/)?.[1]||''}
function words(){try{return typeof WORDS!=='undefined'&&Array.isArray(WORDS)?WORDS:[]}catch(e){return[]}}
function fullWord(item){try{if(typeof full==='function')return full(item)}catch(e){}return item?.full||`${item?.article?item.article+' ':''}${item?.word||''}`.trim()}
function candidateNames(itemOrWord){
 const item=typeof itemOrWord==='object'&&itemOrWord?itemOrWord:null;
 const values=[item?.audioFile,item?.audio,item?.src,item?.id,item?.full,fullWord(item),item?.word,item?.label,typeof itemOrWord==='string'?itemOrWord:''].filter(Boolean);
 const baseNames=[];
 values.forEach(value=>{
  if(/^https?:\/\//i.test(String(value))&&/\.mp3(?:[?#]|$)/i.test(String(value)))baseNames.push(String(value));
  const base=basename(value).replace(/\.mp3$/i,'');
  [base,slug(value,'_'),slug(value,'-'),slug(String(value).replace(/^(der|die|das)\s+/i,''),'_'),slug(String(value).replace(/^(der|die|das)\s+/i,''),'-')].filter(Boolean).forEach(name=>baseNames.push(name));
 });
 const n=themeNumber(),expanded=[];
 unique(baseNames).forEach(name=>{
  if(/^https?:\/\//i.test(name)){expanded.push(name);return}
  expanded.push(name);
  if(n&&!/^a1[-_]l5[-_]t\d/i.test(name)){
   expanded.push(`a1-l5-t${n}-${name}`);
   expanded.push(`a1_l5_t${n}_${name.replace(/-/g,'_')}`);
   expanded.push(`a1-l5-t${n}-hoeren-${name}`);
  }
 });
 return unique(expanded);
}
function candidates(itemOrWord){
 const urls=[];
 candidateNames(itemOrWord).forEach(name=>{
  if(/^https?:\/\//i.test(name)){urls.push(name);return}
  AUDIO_DIRS.forEach(dir=>urls.push(dir+encodeURIComponent(name)+'.mp3'));
 });
 return unique(urls);
}
function fallbackSpeak(text,slow=false){
 if(!nativeSpeak)return;
 try{nativeCancel?.()}catch(e){}
 try{const utterance=new SpeechSynthesisUtterance(String(text||''));utterance.lang='de-DE';utterance.rate=slow?.62:.88;nativeSpeak(utterance)}catch(e){}
}
function showMissing(text){
 const scope=document.querySelector('.audio-panel,.audio-box,.question-card,.card');if(!scope)return;
 let box=scope.querySelector('.sp-l5-audio-missing');
 if(!box){box=document.createElement('div');box.className='hint sp-l5-audio-missing';scope.appendChild(box)}
 box.textContent=`Für „${String(text||'diese Aufgabe')}“ wurde keine Bunny-Audiodatei gefunden.`;
}
function play(itemOrWord,button=null,options={}){
 const urls=candidates(itemOrWord);let index=0;
 if(activeAudio){try{activeAudio.pause()}catch(e){}activeAudio=null}
 const text=typeof itemOrWord==='string'?itemOrWord:fullWord(itemOrWord)||itemOrWord?.label||itemOrWord?.id||'';
 function failed(){
  if(typeof options.fallback==='function'){options.fallback();return}
  if(options.noSpeech){showMissing(text);return}
  fallbackSpeak(text,!!options.slow);
 }
 function next(){
  if(index>=urls.length){failed();return}
  const audio=new Audio(urls[index++]);activeAudio=audio;audio.preload='auto';audio.playbackRate=options.slow?0.75:1;
  audio.onerror=next;audio.onended=()=>{if(activeAudio===audio)activeAudio=null};
  const promise=audio.play();if(promise&&typeof promise.catch==='function')promise.catch(next);
 }
 next();
}
function playDialog(item,fallback){play(item,null,{fallback,noSpeech:true})}
function localAudioSource(audio){const source=audio.querySelector('source[src]');return source?.getAttribute('src')||audio.getAttribute('src')||''}
function enhanceAudioElement(audio){
 if(!audio||audio.dataset.l5BunnyReady==='1')return;
 const original=localAudioSource(audio);if(!original||/^https:\/\/sprachpilot\.b-cdn\.net\//i.test(original))return;
 const list=candidates({audio:original,id:basename(original).replace(/\.mp3$/i,'')});if(!list.length)return;
 audio.dataset.l5BunnyReady='1';let index=0;
 const next=()=>{if(index<list.length){audio.src=list[index++];audio.load();return}audio.onerror=null;audio.src=original;audio.load()};
 audio.onerror=next;next();
}
function enhanceAudioElements(root=document){root.querySelectorAll('audio').forEach(enhanceAudioElement)}
function imageUrl(item){
 try{if(typeof displayImage==='function')return displayImage(item)}catch(e){}
 try{if(typeof cdnImg==='function')return cdnImg(item)}catch(e){}
 const raw=item?.image||item?.id&&item.id+'.webp'||'';
 if(!raw)return'';if(/^https?:/i.test(raw))return raw;
 return CDN+encodeURIComponent(basename(raw).replace(/\.(png|jpe?g|gif|svg)$/i,'.webp'));
}
function translation(item){try{if(typeof tr==='function')return tr(item)}catch(e){}const t=item?.tr||{};return t.en||t.de||''}
function typeName(type){const key=String(type||'').toLowerCase();return({noun:'Nomen',nomen:'Nomen',verb:'Verben',verben:'Verben',adjective:'Adjektive',adjektiv:'Adjektive',adverb:'Adverbien',phrase:'Redewendungen',ausdruck:'Redewendungen',time:'Zeitangaben',tag:'Wochentage',tageszeit:'Tageszeiten',uhrzeit:'Uhrzeiten',zeitraum:'Zeiträume'})[key]||String(type||'Weitere Wörter')}
function renderOverview(root){
 if(!root)return;const list=words();const groups=new Map();
 list.forEach(item=>{const label=typeName(item?.type);if(!groups.has(label))groups.set(label,[]);groups.get(label).push(item)});
 root.innerHTML=[...groups.entries()].map(([label,items])=>`<section class="type-block"><div class="type-title">${esc(label)}</div>${items.map(item=>{const image=imageUrl(item),word=fullWord(item);return `<div class="word-row">${image?`<img src="${esc(image)}" alt="${esc(word)}" loading="lazy" onerror="this.hidden=true">`:'<div class="word-placeholder">Wort</div>'}<div class="word-main"><b>${esc(word)}</b>${item?.plural?`<br><span class="small">Plural: ${esc(item.plural)}</span>`:''}${translation(item)?`<div class="small">${esc(translation(item))}</div>`:''}${item?.sentence?`<div class="small">${esc(item.sentence)}</div>`:''}<button type="button" class="btn secondary sp-word-audio" data-word-index="${list.indexOf(item)}">🔊 Anhören</button></div></div>`}).join('')}</section>`).join('');
 root.addEventListener('click',event=>{const button=event.target.closest('[data-word-index]');if(!button)return;play(list[Number(button.dataset.wordIndex)],button)});
}
function enhanceExistingOverview(root=document){
 const list=words();root.querySelectorAll('.word-row').forEach((row,index)=>{if(row.querySelector('.sp-word-audio'))return;const item=list[index];if(!item)return;const button=document.createElement('button');button.type='button';button.className='btn secondary sp-word-audio';button.textContent='🔊 Anhören';button.addEventListener('click',()=>play(item,button));(row.querySelector('div:last-child')||row).appendChild(button)});
}
window.spL5PlayWord=play;
window.spL5PlayAudio=play;
window.spL5PlayDialog=playDialog;
window.spL5RenderCardOverview=renderOverview;
window.spL5EnhanceOverview=enhanceExistingOverview;
window.sayGerman=function(text){const item=words().find(word=>simple(fullWord(word))===simple(text)||simple(word.word)===simple(text));play(item||text)};
const observer=new MutationObserver(()=>enhanceAudioElements(document));observer.observe(document.documentElement,{childList:true,subtree:true});enhanceAudioElements(document);
const style=document.createElement('style');style.textContent='.sp-word-audio{display:inline-flex!important;align-items:center;justify-content:center;width:auto!important;min-width:0!important;min-height:40px;margin-top:9px;padding:7px 12px;font-size:14px;white-space:nowrap}.word-main{min-width:0}.sp-l5-audio-missing{margin-top:10px}';document.head.appendChild(style);
})();