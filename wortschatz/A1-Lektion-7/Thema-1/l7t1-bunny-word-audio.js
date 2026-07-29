(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const DIRS=[CDN+'audio/',CDN+'Audio/'];
let current=null;
function simple(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[….,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return simple(value).replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'')}
function base(value){return String(value??'').split(/[?#]/)[0].split('/').filter(Boolean).pop()?.replace(/\.(webp|png|jpe?g|gif|svg|mp3)$/i,'')||''}
function urls(id,word,image){const names=[];[id,base(image),word].filter(Boolean).forEach(value=>[base(value),slug(value,'_'),slug(value,'-')].filter(Boolean).forEach(name=>{if(!names.includes(name))names.push(name)}));const out=[];DIRS.forEach(dir=>names.forEach(name=>out.push(dir+encodeURIComponent(name)+'.mp3')));return out}
function fallback(word){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word);u.lang='de-DE';u.rate=.88;speechSynthesis.speak(u)}catch(e){}}
function play(id,word,image){const list=urls(id,word,image);let index=0;if(current){try{current.pause()}catch(e){}}function next(){if(index>=list.length){fallback(word||id);return}const audio=new Audio(list[index++]);current=audio;audio.preload='auto';audio.onerror=next;const promise=audio.play();if(promise&&promise.catch)promise.catch(next)}next()}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-overview-audio],[data-action="card-audio"],.word-audio');
 if(!button)return;
 const id=button.dataset.overviewAudio||button.dataset.wordId||'';
 const card=button.closest('.flip-card,.overview-word,.word-card,.question-card')||document;
 const word=String(card.querySelector('.flip-word,h2,h3,.word')?.textContent||button.getAttribute('aria-label')||id).replace(/^Anhören:\s*/i,'').trim();
 const image=card.querySelector('img')?.getAttribute('src')||'';
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
 play(id,word,image);
},true);
window.L7T1BunnyWordAudio={play};
})();