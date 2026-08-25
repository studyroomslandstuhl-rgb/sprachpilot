(function(){
'use strict';
if(window.__SP_L5T4_KINO_AUDIO_1)return;
window.__SP_L5T4_KINO_AUDIO_1=true;
try{
 const kino=typeof WORDS!=='undefined'&&Array.isArray(WORDS)?WORDS.find(w=>w&&w.id==='kino'):null;
 if(kino)kino.audioFile='https://sprachpilot.b-cdn.net/audio/kino.mp3';
}catch(e){}
})();
