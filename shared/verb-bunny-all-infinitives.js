(function(){
'use strict';
if(window.__SP_VERB_BUNNY_MANIFEST_V4)return;
window.__SP_VERB_BUNNY_MANIFEST_V4=true;

const FILES=window.SP_VERB_AUDIO_FILES||Object.create(null);
const nativeSynth=window.speechSynthesis;
const nativeSpeak=nativeSynth&&typeof nativeSynth.speak==='function'?nativeSynth.speak.bind(nativeSynth):null;
const nativeCancel=nativeSynth&&typeof nativeSynth.cancel==='function'?nativeSynth.cancel.bind(nativeSynth):null;
let activeAudio=null;

function normalize(value){return String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ')}
const unique=list=>[...new Set(list.filter(Boolean))];
function availableVerbs(){const engine=window.VerbGroupsEngine||{};return unique([...(engine.VERBS||[]),...(engine.ALL||[])])}
function resolveVerb(value){const wanted=normalize(value);if(!wanted)return'';return availableVerbs().find(verb=>normalize(verb)===wanted)||''}
function verbForButton(button){const direct=resolveVerb(button.dataset.text||button.dataset.bunnyInfinitive||'');if(direct)return direct;const scope=button.closest('.overview-verb-card,.task-page,.question-card')||document;const text=scope.querySelector('.flip-word,.overview-verb-text h3,h3')?.textContent||'';return resolveVerb(text)}
function audioUrl(verb){return FILES[normalize(verb)]||''}
function clearPlaying(){document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'))}
function clearError(button){const scope=button?.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button?.parentElement;scope?.querySelectorAll('.bunny-audio-error').forEach(error=>error.remove())}
function showError(button,verb){clearPlaying();const scope=button?.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button?.parentElement;if(!scope)return;let error=scope.querySelector('.bunny-audio-error');if(!error){error=document.createElement('div');error.className='bunny-audio-error';scope.appendChild(error)}error.textContent=`Audio für „${verb}“ ist auf diesem Gerät nicht verfügbar.`}
function computerSpeak(verb,slow=false){if(!nativeSpeak)return false;try{nativeCancel?.()}catch(e){}try{const utterance=new SpeechSynthesisUtterance(String(verb||''));utterance.lang='de-DE';utterance.rate=slow?0.55:0.92;nativeSpeak(utterance);return true}catch(e){return false}}
function play(verb,slow=false,button=null){
 const url=audioUrl(verb);
 if(!url)return computerSpeak(verb,slow);
 try{activeAudio?.pause()}catch(e){}
 clearPlaying();clearError(button);
 const audio=new Audio(url);activeAudio=audio;audio.preload='auto';audio.playbackRate=slow?0.75:1;if(button)button.classList.add('bunny-audio-playing');
 let finished=false;
 const fallback=()=>{if(finished)return;finished=true;if(activeAudio===audio)activeAudio=null;clearPlaying();if(!computerSpeak(verb,slow))showError(button,verb)};
 audio.onended=()=>{finished=true;if(activeAudio===audio)activeAudio=null;clearPlaying()};audio.onerror=fallback;
 try{const result=audio.play();if(result?.catch)result.catch(fallback)}catch(e){fallback()}
 return true;
}

document.addEventListener('click',event=>{
 if(!location.pathname.startsWith('/verben/'))return;
 const button=event.target instanceof Element?event.target.closest('button'):null;
 if(!button||!button.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini'))return;
 const verb=verbForButton(button);if(!verb)return;
 const slow=button.dataset.action==='audio-slow'||button.dataset.bunnySlow==='1';
 event.preventDefault();event.stopImmediatePropagation();play(verb,slow,button);
},true);

window.SPVerbBunnyAllInfinitives={resolveVerb,audioUrl,urls:verb=>{const url=audioUrl(verb);return url?[url]:[]},play,computerSpeak,audit:window.SP_VERB_AUDIO_AUDIT||null,missing:window.SP_VERB_AUDIO_MISSING||[]};
})();
