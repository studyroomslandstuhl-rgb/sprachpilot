(function(){
'use strict';
if(window.__SP_IRREGULAR_BUNNY_AUDIO_20260728)return;
window.__SP_IRREGULAR_BUNNY_AUDIO_20260728=true;
const BASE='https://sprachpilot.b-cdn.net/audio/';
let activeAudio=null;
const slug=value=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
function showError(){
 const card=document.querySelector('.question-card,.task-page');
 if(!card)return;
 let box=card.querySelector('.bunny-audio-error');
 if(!box){box=document.createElement('div');box.className='feedback no bunny-audio-error';box.textContent='Die Audiodatei konnte nicht geladen werden.';card.appendChild(box)}
 box.hidden=false;
}
function play(value,slow=false){
 const file=slug(value)+'.mp3';
 if(file==='.mp3')return;
 try{activeAudio?.pause()}catch(e){}
 const audio=new Audio(BASE+encodeURIComponent(file));
 activeAudio=audio;
 audio.preload='auto';
 audio.playbackRate=slow?0.75:1;
 audio.onerror=showError;
 audio.play().catch(showError);
}
const synth=window.speechSynthesis;
if(synth&&typeof synth.speak==='function'){
 const replacement=utterance=>play(utterance?.text||'',Number(utterance?.rate||1)<0.8);
 try{Object.defineProperty(synth,'speak',{value:replacement,writable:true,configurable:true})}catch(e){try{synth.speak=replacement}catch(_){} }
 try{const proto=Object.getPrototypeOf(synth);if(proto)Object.defineProperty(proto,'speak',{value:replacement,writable:true,configurable:true})}catch(e){}
}
function addCardButton(){
 const actions=document.querySelector('.task-page .actions');
 const verb=document.querySelector('.task-page .flash-verb')?.textContent?.trim();
 if(!actions||!verb||actions.querySelector('[data-bunny-card-audio]'))return;
 const button=document.createElement('button');
 button.type='button';
 button.className='btn secondary';
 button.dataset.bunnyCardAudio=verb;
 button.textContent='🔊 Anhören';
 actions.insertBefore(button,actions.firstChild);
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
