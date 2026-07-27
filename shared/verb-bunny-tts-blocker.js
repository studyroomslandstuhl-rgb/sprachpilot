(function(){
'use strict';
if(window.__SP_VERB_BUNNY_TTS_BLOCKER_V2)return;
window.__SP_VERB_BUNNY_TTS_BLOCKER_V2=true;
const api=window.SPVerbBunnyAudio;
const nativeSynth=window.speechSynthesis;
if(!api||!api.forms||!nativeSynth)return;
const normalize=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
const entries=Object.entries(api.forms).map(([verb,form])=>({
 verb,
 infinitive:normalize(verb),
 perfect:normalize(`${form.aux} ${verb.startsWith('sich ')?'sich ':''}${form.part}`)
})).sort((a,b)=>Math.max(b.infinitive.length,b.perfect.length)-Math.max(a.infinitive.length,a.perfect.length));
function resolveInfinitive(text){const value=normalize(text);return entries.find(item=>value===item.infinitive)?.verb||''}
function resolvePerfect(text){const value=normalize(text);return entries.find(item=>value===item.perfect||value.includes(item.perfect))?.verb||''}
const originalSpeak=typeof nativeSynth.speak==='function'?nativeSynth.speak.bind(nativeSynth):null;
function recordedSpeak(utterance){
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
 if(originalSpeak)return originalSpeak(utterance)
}
try{Object.defineProperty(nativeSynth,'speak',{value:recordedSpeak,writable:true,configurable:true})}catch(e){try{nativeSynth.speak=recordedSpeak}catch(_){} }
try{
 const proto=Object.getPrototypeOf(nativeSynth);
 if(proto)Object.defineProperty(proto,'speak',{value:recordedSpeak,writable:true,configurable:true});
}catch(e){}
try{
 const proxy=new Proxy(nativeSynth,{get(target,property){if(property==='speak')return recordedSpeak;const value=Reflect.get(target,property,target);return typeof value==='function'?value.bind(target):value}});
 Object.defineProperty(window,'speechSynthesis',{get:()=>proxy,configurable:true});
}catch(e){}
document.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(!button)return;
 const slow=button.dataset.action==='audio-slow'||button.dataset.bunnySlow==='1';
 if(location.pathname.startsWith('/verben/')&&button.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini')){
  const text=button.dataset.text||button.closest('.overview-verb-card,.task-page')?.querySelector('.flip-word,h3')?.textContent||'';
  const verb=resolveInfinitive(text);
  if(verb){event.preventDefault();event.stopImmediatePropagation();api.playInfinitive(verb,slow)}
 }
 if(location.pathname.startsWith('/perfekt/')&&button.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini')){
  const text=button.dataset.text||button.closest('.overview-verb-card,.task-page')?.querySelector('.card-translation b,.overview-verb-text h3,.flip-word')?.textContent||'';
  const verb=resolvePerfect(text)||resolveInfinitive(text);
  if(verb){event.preventDefault();event.stopImmediatePropagation();api.playPerfect(verb,slow)}
 }
},true);
})();
