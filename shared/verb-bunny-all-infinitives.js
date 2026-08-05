(function(){
'use strict';
if(window.__SP_VERB_BUNNY_MANIFEST_V2)return;
window.__SP_VERB_BUNNY_MANIFEST_V2=true;

const FILES=window.SP_VERB_AUDIO_FILES||Object.create(null);
const MISSING=new Set((window.SP_VERB_AUDIO_MISSING||[]).map(item=>normalize(item?.verb)));
const nativeSynth=window.speechSynthesis;
const nativeSpeak=nativeSynth&&typeof nativeSynth.speak==='function'?nativeSynth.speak.bind(nativeSynth):null;
const nativeCancel=nativeSynth&&typeof nativeSynth.cancel==='function'?nativeSynth.cancel.bind(nativeSynth):null;
let activeAudio=null;

function normalize(value){
 return String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
}
const unique=list=>[...new Set(list.filter(Boolean))];

function availableVerbs(){
 const engine=window.VerbGroupsEngine||{};
 return unique([...(engine.VERBS||[]),...(engine.ALL||[])]);
}

function resolveVerb(value){
 const wanted=normalize(value);
 if(!wanted)return'';
 return availableVerbs().find(verb=>normalize(verb)===wanted)||'';
}

function verbForButton(button){
 const direct=resolveVerb(button.dataset.text||button.dataset.bunnyInfinitive||'');
 if(direct)return direct;
 const scope=button.closest('.overview-verb-card,.task-page,.question-card')||document;
 const text=scope.querySelector('.flip-word,.overview-verb-text h3,h3')?.textContent||'';
 return resolveVerb(text);
}

function audioUrl(verb){
 return FILES[normalize(verb)]||'';
}

function clearPlaying(){
 document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'));
}

function clearError(button){
 const scope=button?.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button?.parentElement;
 scope?.querySelectorAll('.bunny-audio-error').forEach(error=>error.remove());
}

function showError(button,verb){
 clearPlaying();
 const scope=button?.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button?.parentElement;
 if(!scope)return;
 let error=scope.querySelector('.bunny-audio-error');
 if(!error){
  error=document.createElement('div');
  error.className='bunny-audio-error';
  scope.appendChild(error);
 }
 error.textContent=`Die Bunny-Audiodatei für „${verb}“ konnte nicht geladen werden.`;
}

function computerSpeak(verb,slow=false){
 if(!nativeSpeak)return false;
 try{nativeCancel?.()}catch(e){}
 try{
  const utterance=new SpeechSynthesisUtterance(String(verb||''));
  utterance.lang='de-DE';
  utterance.rate=slow?0.55:0.92;
  nativeSpeak(utterance);
  return true;
 }catch(e){
  return false;
 }
}

function play(verb,slow=false,button=null){
 const url=audioUrl(verb);
 if(!url)return false;
 try{activeAudio?.pause()}catch(e){}
 clearPlaying();
 clearError(button);
 const audio=new Audio(url);
 activeAudio=audio;
 audio.preload='auto';
 audio.playbackRate=slow?0.75:1;
 if(button)button.classList.add('bunny-audio-playing');
 audio.onended=()=>{if(activeAudio===audio)activeAudio=null;clearPlaying();};
 audio.onerror=()=>{if(activeAudio===audio)activeAudio=null;showError(button,verb);};
 audio.play().catch(()=>showError(button,verb));
 return true;
}

document.addEventListener('click',event=>{
 if(!location.pathname.startsWith('/verben/'))return;
 const button=event.target instanceof Element?event.target.closest('button'):null;
 if(!button||!button.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini'))return;
 const verb=verbForButton(button);
 if(!verb)return;
 const slow=button.dataset.action==='audio-slow'||button.dataset.bunnySlow==='1';
 const url=audioUrl(verb);
 const needsFallback=MISSING.has(normalize(verb));
 if(!url&&!needsFallback)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 if(url)play(verb,slow,button);
 else computerSpeak(verb,slow);
},true);

window.SPVerbBunnyAllInfinitives={
 resolveVerb,
 audioUrl,
 urls:verb=>{const url=audioUrl(verb);return url?[url]:[]},
 play,
 computerSpeak,
 audit:window.SP_VERB_AUDIO_AUDIT||null,
 missing:window.SP_VERB_AUDIO_MISSING||[]
};
})();
