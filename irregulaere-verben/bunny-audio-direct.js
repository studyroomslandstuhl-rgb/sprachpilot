(function(){
'use strict';
if(window.__SP_IRREGULAR_BUNNY_AUDIO_20260730)return;
window.__SP_IRREGULAR_BUNNY_AUDIO_20260730=true;

const BASES=['https://sprachpilot.b-cdn.net/audio/','https://sprachpilot.b-cdn.net/Audio/'];
const DATA=(window.IRREGULAR_VERB_DAYS||[]).flatMap(day=>day.verbs||[]);
const SHARED=window.SPVerbBunnyAudio||{};
let activeAudio=null;

const normalize=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
const slug=(value,separator='_')=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'');
const unique=list=>[...new Set(list.filter(Boolean))];
const verbsByName=new Map(DATA.map(item=>[normalize(item.v),item.v]));

function resolveVerb(value){
 const key=normalize(value);
 if(!key)return'';
 return verbsByName.get(key)||Object.keys(SHARED.forms||{}).find(verb=>normalize(verb)===key)||'';
}

function audioCandidates(value){
 const verb=resolveVerb(value)||String(value||'').trim();
 if(!verb)return[];
 const names=unique([slug(verb,'_'),slug(verb,'-')]);
 const urls=[];
 if(SHARED.forms?.[verb]&&typeof SHARED.infinitiveUrl==='function')urls.push(SHARED.infinitiveUrl(verb));
 BASES.forEach(base=>names.forEach(name=>urls.push(base+encodeURIComponent(name)+'.mp3')));
 return unique(urls);
}

function clearError(scope=document){
 scope.querySelectorAll('.bunny-audio-error').forEach(box=>box.remove());
}

function showError(button,value){
 const scope=button?.closest('.flip-face,.question-card,.task-page')||document.querySelector('.question-card,.task-page');
 if(!scope)return;
 let box=scope.querySelector('.bunny-audio-error');
 if(!box){
  box=document.createElement('div');
  box.className='feedback no bunny-audio-error';
  scope.appendChild(box);
 }
 box.textContent=`Für „${String(value||'dieses Verb')}“ wurde keine Bunny-Audiodatei gefunden.`;
 box.hidden=false;
}

function play(value,slow=false,button=null){
 const verb=resolveVerb(value)||String(value||'').trim();
 const list=audioCandidates(verb);
 if(!list.length){showError(button,verb);return;}
 let index=0;
 try{activeAudio?.pause()}catch(e){}
 clearError(button?.closest('.task-page')||document);
 const next=()=>{
  if(index>=list.length){
   if(activeAudio)activeAudio=null;
   showError(button,verb);
   return;
  }
  const audio=new Audio(list[index++]);
  activeAudio=audio;
  audio.preload='auto';
  audio.playbackRate=slow?0.75:1;
  audio.onerror=next;
  audio.onended=()=>{if(activeAudio===audio)activeAudio=null;};
  const result=audio.play();
  if(result&&typeof result.catch==='function')result.catch(next);
 };
 next();
}

const synth=window.speechSynthesis;
if(synth&&typeof synth.speak==='function'){
 const replacement=utterance=>play(utterance?.text||'',Number(utterance?.rate||1)<0.8);
 try{Object.defineProperty(synth,'speak',{value:replacement,writable:true,configurable:true});}
 catch(e){try{synth.speak=replacement;}catch(_){} }
 try{
  const proto=Object.getPrototypeOf(synth);
  if(proto)Object.defineProperty(proto,'speak',{value:replacement,writable:true,configurable:true});
 }catch(e){}
}

function addCardButton(){
 const back=document.querySelector('.task-page .flip-back');
 const verb=back?.querySelector('.flash-verb')?.textContent?.trim();
 if(!back||!verb||back.querySelector('[data-bunny-card-audio]'))return;
 const button=document.createElement('button');
 button.type='button';
 button.className='btn secondary card-listen';
 button.dataset.bunnyCardAudio=resolveVerb(verb)||verb;
 button.textContent='🔊 Anhören';
 back.appendChild(button);
}

document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target.closest('[data-bunny-card-audio]'):null;
 if(!target)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 play(target.dataset.bunnyCardAudio||'',false,target);
},true);

new MutationObserver(addCardButton).observe(document.documentElement,{childList:true,subtree:true});
addCardButton();
window.SPIrregularBunnyAudio={verbs:DATA.map(item=>item.v),resolveVerb,audioCandidates,play};
})();