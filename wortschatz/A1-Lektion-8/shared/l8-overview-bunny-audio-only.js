(function(){
'use strict';
if(window.__SP_L8_OVERVIEW_BUNNY_AUDIO_ONLY)return;window.__SP_L8_OVERVIEW_BUNNY_AUDIO_ONLY=true;
if(document.body?.dataset?.page!=='overview')return;
const synth=window.speechSynthesis;if(!synth)return;
try{synth.cancel()}catch(e){}
try{synth.speak=function(){};return}catch(e){}
try{const proto=Object.getPrototypeOf(synth);if(proto)Object.defineProperty(proto,'speak',{value:function(){},writable:true,configurable:true})}catch(e){}
})();
