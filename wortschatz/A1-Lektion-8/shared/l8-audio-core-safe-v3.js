(function(){
'use strict';
if(window.__SP_L8_AUDIO_CORE_SAFE_V3)return;
window.__SP_L8_AUDIO_CORE_SAFE_V3=true;
const CDN='https://sprachpilot.b-cdn.net/audio/';
const isUrl=v=>/^https?:\/\//i.test(String(v||'').trim());
const isAudio=v=>{const s=String(v||'').trim();return !!s&&(isUrl(s)||/^audio\//i.test(s)||/\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(s));};
const audioUrl=v=>{const s=String(v||'').trim();if(!s)return'';if(isUrl(s))return s;return CDN+s.replace(/^audio\//i,'');};
let active=null;
function stop(){if(active){try{active.pause();active.currentTime=0}catch(e){}active=null}try{speechSynthesis.cancel()}catch(e){}}
function speak(text){const s=String(text||'').trim();if(!s||isAudio(s)||!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function install(){
 const S=window.L8S;if(!S)return false;
 const safe=function(text,audioFile){
  stop();
  let spoken=String(text||'').trim();
  let file=String(audioFile||'').trim();
  if(!isAudio(file))file='';
  if(!file&&isAudio(spoken)){file=spoken;spoken='';}
  if(isAudio(spoken))spoken='';
  if(file){
   const a=new Audio(audioUrl(file));active=a;let failed=false;
   const fail=()=>{if(failed)return;failed=true;if(active===a)active=null;try{a.pause();a.src=''}catch(e){};speak(spoken)};
   a.addEventListener('error',fail,{once:true});
   a.addEventListener('ended',()=>{if(active===a)active=null},{once:true});
   try{const p=a.play();if(p&&typeof p.catch==='function')p.catch(fail)}catch(e){fail()}
   return;
  }
  speak(spoken);
 };
 safe.__spAudioCoreSafeV3=true;
 S.say=safe;
 return true;
}
if(!install()){
 let tries=0;const timer=setInterval(()=>{if(install()||++tries>150)clearInterval(timer)},20);
}
window.L8AudioCoreSafeV3={install,isAudio,audioUrl};
})();
