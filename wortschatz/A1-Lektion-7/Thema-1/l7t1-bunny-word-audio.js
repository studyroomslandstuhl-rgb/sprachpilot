(function(){
'use strict';
if(window.__SP_L7T1_AUDIO_STANDARD_2)return;
window.__SP_L7T1_AUDIO_STANDARD_2=true;

const CDN='https://sprachpilot.b-cdn.net/';
const DIRS=[CDN+'audio/',CDN+'Audio/'];
let currentAudio=null;
let generation=0;

function simple(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[….,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return simple(value).replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'')}
function base(value){return String(value??'').split(/[?#]/)[0].split('/').filter(Boolean).pop()?.replace(/\.(webp|png|jpe?g|gif|svg|mp3)$/i,'')||''}
function candidates(id,word,image,audio){
 const names=[];
 [id,base(image),word,base(audio)].filter(Boolean).forEach(value=>[base(value),slug(value,'_'),slug(value,'-')].filter(Boolean).forEach(name=>{if(!names.includes(name))names.push(name)}));
 const out=[];
 if(/^https?:\/\//i.test(String(audio||'')))out.push(String(audio));
 DIRS.forEach(dir=>names.forEach(name=>out.push(dir+encodeURIComponent(name)+'.mp3')));
 return [...new Set(out)];
}
function stop(){
 generation++;
 if(currentAudio){try{currentAudio.pause();currentAudio.src='';}catch(e){}currentAudio=null;}
 document.querySelectorAll('audio').forEach(audio=>{try{audio.pause();audio.currentTime=0;}catch(e){}});
 try{speechSynthesis.cancel()}catch(e){}
}
function fallback(word,token){
 if(token!==generation||!('speechSynthesis'in window))return;
 try{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(word);utterance.lang='de-DE';utterance.rate=.84;speechSynthesis.speak(utterance)}catch(e){}
}
function play(id,word,image,audioSource){
 stop();
 const token=generation;
 const list=candidates(id,word,image,audioSource);
 let index=0;
 function next(){
  if(token!==generation)return;
  if(index>=list.length){fallback(word||id,token);return;}
  const audio=new Audio(list[index++]);
  currentAudio=audio;
  audio.preload='auto';
  let failed=false;
  const fail=()=>{
   if(failed||token!==generation)return;
   failed=true;
   try{audio.pause();audio.src='';}catch(e){}
   if(currentAudio===audio)currentAudio=null;
   next();
  };
  audio.addEventListener('error',fail,{once:true});
  const promise=audio.play();
  if(promise&&typeof promise.catch==='function')promise.catch(fail);
 }
 next();
}
function buttonData(button){
 const card=button.closest('.flip-card,.overview-word,.word-card,.question-card,.sp-overview-word')||document;
 const id=button.dataset.overviewAudio||button.dataset.wordId||button.dataset.audioId||'';
 const word=String(card.querySelector('.flip-word,h2,h3,.word,.sp-overview-word__content h3')?.textContent||button.getAttribute('aria-label')||id).replace(/^Anhören:\s*/i,'').replace(/\s+anhören$/i,'').trim();
 const image=card.querySelector('img')?.getAttribute('src')||'';
 const audio=button.dataset.audio||button.dataset.audioSrc||'';
 return{id,word,image,audio};
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-overview-audio],[data-action="card-audio"],.word-audio');
 if(!button)return;
 event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
 const data=buttonData(button);
 play(data.id,data.word,data.image,data.audio);
},true);
window.addEventListener('beforeunload',stop);
window.L7T1BunnyWordAudio={play,stop};
})();
