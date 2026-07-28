(function(){
'use strict';
if(window.__SP_IRREGULAR_BUNNY_AUDIO_20260728B)return;
window.__SP_IRREGULAR_BUNNY_AUDIO_20260728B=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
let activeAudio=null;
const slug=value=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const synth=window.speechSynthesis;
const nativeSpeak=synth&&typeof synth.speak==='function'?synth.speak.bind(synth):null;
const nativeCancel=synth&&typeof synth.cancel==='function'?synth.cancel.bind(synth):null;
function showError(){
 const card=document.querySelector('.question-card,.task-page');
 if(!card)return;
 let box=card.querySelector('.bunny-audio-error');
 if(!box){box=document.createElement('div');box.className='feedback no bunny-audio-error';box.textContent='Das Audio konnte nicht abgespielt werden.';card.appendChild(box)}
 box.hidden=false;
}
function computerSpeak(value,slow=false){
 if(!nativeSpeak)return showError();
 try{nativeCancel?.()}catch(e){}
 try{
  const utterance=new SpeechSynthesisUtterance(String(value||''));
  utterance.lang='de-DE';
  utterance.rate=slow?0.55:0.9;
  nativeSpeak(utterance);
 }catch(e){showError()}
}
function play(value,slow=false){
 const file=slug(value)+'.mp3';
 if(file==='.mp3')return;
 try{activeAudio?.pause()}catch(e){}
 const audio=new Audio(BASE+encodeURIComponent(file));
 activeAudio=audio;
 audio.preload='auto';
 audio.playbackRate=slow?0.75:1;
 let fallbackUsed=false;
 const fallback=()=>{
  if(fallbackUsed)return;
  fallbackUsed=true;
  try{audio.pause()}catch(e){}
  if(activeAudio===audio)activeAudio=null;
  computerSpeak(value,slow);
 };
 audio.onerror=fallback;
 audio.onended=()=>{if(activeAudio===audio)activeAudio=null};
 const result=audio.play();
 if(result&&typeof result.catch==='function')result.catch(fallback);
}
if(synth&&typeof synth.speak==='function'){
 const replacement=utterance=>play(utterance?.text||'',Number(utterance?.rate||1)<0.8);
 try{Object.defineProperty(synth,'speak',{value:replacement,writable:true,configurable:true})}catch(e){try{synth.speak=replacement}catch(_){} }
 try{const proto=Object.getPrototypeOf(synth);if(proto)Object.defineProperty(proto,'speak',{value:replacement,writable:true,configurable:true})}catch(e){}
}
function addCardButton(){
 const back=document.querySelector('.task-page .flip-back');
 const verb=back?.querySelector('.flash-verb')?.textContent?.trim();
 if(!back||!verb||back.querySelector('[data-bunny-card-audio]'))return;
 const button=document.createElement('button');
 button.type='button';
 button.className='btn secondary card-listen';
 button.dataset.bunnyCardAudio=verb;
 button.textContent='🔊 Anhören';
 back.appendChild(button);
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-bunny-card-audio]');
 if(!button)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 play(button.dataset.bunnyCardAudio||'');
},true);
new MutationObserver(addCardButton).observe(document.documentElement,{childList:true,subtree:true});
addCardButton();
window.SPIrregularBunnyAudio={play};
})();
