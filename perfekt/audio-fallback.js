(function(){
'use strict';
if(window.__SP_PERFEKT_AUDIO_FALLBACK_V1)return;
window.__SP_PERFEKT_AUDIO_FALLBACK_V1=true;

const FILES=window.SP_PERFEKT_AUDIO_FILES||Object.create(null);
let activeUtterance=null;
let retryTimer=0;

function normalize(value){
 return String(value||'')
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/ß/g,'ss')
  .replace(/[.,!?;:"'`´()]/g,'')
  .replace(/\s+/g,' ');
}

function recordedFile(text){
 return FILES[normalize(text)]||'';
}

function audioText(button){
 const direct=String(button?.dataset?.text||'').trim();
 if(direct)return direct;
 const scope=button?.closest('.flip-face,.question-card,.task-page,.overview-verb-card')||document;
 return String(scope.querySelector('.flip-word,.overview-verb-text strong')?.textContent||'').trim();
}

function showError(button,text){
 const scope=button?.closest('.listen-box,.flip-face,.question-card,.task-page,.overview-verb-card')||button?.parentElement;
 if(!scope)return;
 let box=scope.querySelector('.perfekt-audio-fallback-error');
 if(!box){
  box=document.createElement('div');
  box.className='feedback no perfekt-audio-fallback-error';
  scope.appendChild(box);
 }
 box.textContent=`Die Aussprache für „${text}“ konnte auf diesem Gerät nicht gestartet werden.`;
}

function clearError(button){
 const scope=button?.closest('.listen-box,.flip-face,.question-card,.task-page,.overview-verb-card')||button?.parentElement;
 scope?.querySelectorAll('.perfekt-audio-fallback-error').forEach(box=>box.remove());
}

function germanVoice(synth){
 const voices=typeof synth.getVoices==='function'?synth.getVoices():[];
 return voices.find(voice=>/^de-DE$/i.test(voice.lang))
  ||voices.find(voice=>/^de([_-]|$)/i.test(voice.lang))
  ||null;
}

function speakWithDevice(text,slow,button,attempt=0){
 const synth=window.speechSynthesis;
 if(!synth||typeof window.SpeechSynthesisUtterance!=='function'){
  showError(button,text);
  return false;
 }

 clearTimeout(retryTimer);
 try{synth.cancel()}catch(error){}
 clearError(button);

 const run=()=>{
  let started=false;
  const utterance=new SpeechSynthesisUtterance(text);
  activeUtterance=utterance;
  utterance.lang='de-DE';
  utterance.rate=slow?0.58:0.9;
  utterance.pitch=1;
  utterance.volume=1;
  const voice=germanVoice(synth);
  if(voice)utterance.voice=voice;
  utterance.onstart=()=>{started=true;clearTimeout(retryTimer)};
  utterance.onend=()=>{if(activeUtterance===utterance)activeUtterance=null;clearTimeout(retryTimer)};
  utterance.onerror=()=>{
   if(activeUtterance===utterance)activeUtterance=null;
   if(attempt<1)setTimeout(()=>speakWithDevice(text,slow,button,attempt+1),180);
   else showError(button,text);
  };
  try{synth.resume()}catch(error){}
  try{synth.speak(utterance)}catch(error){
   if(attempt<1)setTimeout(()=>speakWithDevice(text,slow,button,attempt+1),180);
   else showError(button,text);
   return;
  }
  retryTimer=setTimeout(()=>{
   if(started)return;
   if(attempt<1)speakWithDevice(text,slow,button,attempt+1);
   else showError(button,text);
  },1200);
 };

 // Android/Chrome kann direktes speak() unmittelbar nach cancel() verschlucken.
 setTimeout(run,attempt?120:60);
 return true;
}

document.addEventListener('click',event=>{
 if(!location.pathname.startsWith('/perfekt/'))return;
 const button=event.target instanceof Element?event.target.closest('button'):null;
 if(!button||!button.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini'))return;
 const text=audioText(button);
 if(!text||recordedFile(text))return;
 event.preventDefault();
 event.stopImmediatePropagation();
 const slow=button.dataset.action==='audio-slow';
 speakWithDevice(text,slow,button);
},true);

window.SPPerfektAudioFallback={recordedFile,speakWithDevice};
})();
