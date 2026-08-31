(function(){
'use strict';
if(window.__SP_L8_AUDIO_SAFE_V1)return;
window.__SP_L8_AUDIO_SAFE_V1=true;

const S=window.L8S;
if(!S||typeof S.say!=='function')return;
const originalSay=S.say.bind(S);

function isAudioReference(value){
 const raw=String(value||'').trim();
 if(!raw)return false;
 return /^https?:\/\//i.test(raw)
  || /^audio\//i.test(raw)
  || /\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(raw)
  || /sprachpilot\.b-cdn\.net\/audio\//i.test(raw);
}

S.say=function(text,audioFile){
 let spoken=String(text||'').trim();
 let file=String(audioFile||'').trim();

 // Legacy L8 listening items often store the MP3 URL in item.audio and
 // have no separate item.audioFile. Never send that URL to TTS.
 if(!file&&isAudioReference(spoken)){
  file=spoken;
  spoken='';
 }
 if(isAudioReference(spoken))spoken='';

 return originalSay(spoken,file);
};

window.L8AudioSafe={isAudioReference};
})();
