(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO_DIRS=[CDN+'audio/',CDN+'Audio/'];
let activeAudio=null;
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function simple(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[….,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return simple(value).replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'')}
function basename(value){return String(value??'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function words(){try{return typeof WORDS!=='undefined'&&Array.isArray(WORDS)?WORDS:[]}catch(e){return[]}}
function fullWord(item){try{if(typeof full==='function')return full(item)}catch(e){}return item?.full||`${item?.article?item.article+' ':''}${item?.word||''}`.trim()}
function candidates(itemOrWord){
 const item=typeof itemOrWord==='object'&&itemOrWord?itemOrWord:null;
 const values=[item?.audioFile,item?.audio,item?.id,item?.full,fullWord(item),item?.word,typeof itemOrWord==='string'?itemOrWord:''].filter(Boolean);
 const names=[];
 values.forEach(value=>{
  const base=basename(value).replace(/\.mp3$/i,'');
  [base,slug(value,'_'),slug(value,'-'),slug(String(value).replace(/^(der|die|das)\s+/i,''),'_'),slug(String(value).replace(/^(der|die|das)\s+/i,''),'-')].filter(Boolean).forEach(name=>{if(!names.includes(name))names.push(name)})
 });
 const urls=[];
 AUDIO_DIRS.forEach(dir=>names.forEach(name=>urls.push(dir+encodeURIComponent(name)+'.mp3')));
 return urls;
}
function fallbackSpeak(text){
 if(!('speechSynthesis'in window))return;
 try{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='de-DE';utterance.rate=.88;speechSynthesis.speak(utterance)}catch(e){}
}
function play(itemOrWord){
 const urls=candidates(itemOrWord);let index=0;
 if(activeAudio){try{activeAudio.pause()}catch(e){}activeAudio=null}
 function next(){
  if(index>=urls.length){fallbackSpeak(typeof itemOrWord==='string'?itemOrWord:fullWord(itemOrWord));return}
  const audio=new Audio(urls[index++]);activeAudio=audio;audio.preload='auto';audio.onerror=next;
  const promise=audio.play();if(promise&&typeof promise.catch==='function')promise.catch(next);
 }
 next();
}
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
 root.addEventListener('click',event=>{const button=event.target.closest('[data-word-index]');if(!button)return;play(list[Number(button.dataset.wordIndex)])});
}
function enhanceExistingOverview(root=document){
 const list=words();root.querySelectorAll('.word-row').forEach((row,index)=>{if(row.querySelector('.sp-word-audio'))return;const item=list[index];if(!item)return;const button=document.createElement('button');button.type='button';button.className='btn secondary sp-word-audio';button.textContent='🔊 Anhören';button.addEventListener('click',()=>play(item));(row.querySelector('div:last-child')||row).appendChild(button)});
}
window.spL5PlayWord=play;
window.spL5RenderCardOverview=renderOverview;
window.spL5EnhanceOverview=enhanceExistingOverview;
window.sayGerman=function(text){const item=words().find(word=>simple(fullWord(word))===simple(text)||simple(word.word)===simple(text));play(item||text)};
const style=document.createElement('style');style.textContent='.sp-word-audio{display:inline-flex!important;align-items:center;justify-content:center;width:auto!important;min-width:0!important;min-height:40px;margin-top:9px;padding:7px 12px;font-size:14px;white-space:nowrap}.word-main{min-width:0}';document.head.appendChild(style);
})();