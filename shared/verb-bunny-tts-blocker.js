(function(){
'use strict';
if(window.__SP_VERB_BUNNY_TTS_BLOCKER)return;
window.__SP_VERB_BUNNY_TTS_BLOCKER=true;
const api=window.SPVerbBunnyAudio;
const synth=window.speechSynthesis;
if(!api||!api.forms||!synth||typeof synth.speak!=='function')return;
const nativeSpeak=synth.speak.bind(synth);
const normalize=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
const entries=Object.entries(api.forms).map(([verb,form])=>({
 verb,
 infinitive:normalize(verb),
 perfect:normalize(`${form.aux} ${verb.startsWith('sich ')?'sich ':''}${form.part}`)
})).sort((a,b)=>Math.max(b.infinitive.length,b.perfect.length)-Math.max(a.infinitive.length,a.perfect.length));
function resolveInfinitive(text){const value=normalize(text);return entries.find(item=>value===item.infinitive)?.verb||''}
function resolvePerfect(text){const value=normalize(text);return entries.find(item=>value===item.perfect||value.includes(item.perfect))?.verb||''}
try{
 synth.speak=function(utterance){
  const text=String(utterance?.text||'');
  const slow=Number(utterance?.rate||1)<0.8;
  if(location.pathname.startsWith('/verben/')){
   const verb=resolveInfinitive(text);
   if(verb){api.playInfinitive(verb,slow);return}
  }
  if(location.pathname.startsWith('/perfekt/')){
   const verb=resolvePerfect(text);
   if(verb){api.playPerfect(verb,slow);return}
  }
  return nativeSpeak(utterance)
 };
}catch(e){}
})();
