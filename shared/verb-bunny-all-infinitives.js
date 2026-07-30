(function(){
'use strict';
if(window.__SP_VERB_BUNNY_ALL_INFINITIVES)return;
window.__SP_VERB_BUNNY_ALL_INFINITIVES=true;

const BASES=['https://sprachpilot.b-cdn.net/audio/','https://sprachpilot.b-cdn.net/Audio/'];
let activeAudio=null;

const normalize=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
const slug=(value,separator='_')=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'');
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

function urls(verb){
 const names=unique([slug(verb,'_'),slug(verb,'-')]);
 return unique(BASES.flatMap(base=>names.map(name=>base+encodeURIComponent(name)+'.mp3')));
}

function clearPlaying(){
 document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'));
}

function showError(button){
 clearPlaying();
 const scope=button.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button.parentElement;
 if(!scope)return;
 let error=scope.querySelector('.bunny-audio-error');
 if(!error){
  error=document.createElement('div');
  error.className='bunny-audio-error';
  error.textContent='Die Audiodatei konnte nicht geladen werden.';
  scope.appendChild(error);
 }
}

function play(verb,slow=false,button=null){
 const list=urls(verb);
 let index=0;
 try{activeAudio?.pause()}catch(e){}
 clearPlaying();
 const next=()=>{
  if(index>=list.length){showError(button);return;}
  const audio=new Audio(list[index++]);
  activeAudio=audio;
  audio.preload='auto';
  audio.playbackRate=slow?0.75:1;
  if(button)button.classList.add('bunny-audio-playing');
  audio.onended=()=>{if(activeAudio===audio)activeAudio=null;clearPlaying();};
  audio.onerror=next;
  audio.play().catch(next);
 };
 next();
}

document.addEventListener('click',event=>{
 if(!location.pathname.startsWith('/verben/'))return;
 const button=event.target instanceof Element?event.target.closest('button'):null;
 if(!button||!button.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini'))return;
 const verb=verbForButton(button);
 if(!verb)return;
 event.preventDefault();
 event.stopImmediatePropagation();
 play(verb,button.dataset.action==='audio-slow'||button.dataset.bunnySlow==='1',button);
},true);

window.SPVerbBunnyAllInfinitives={resolveVerb,urls,play};
})();
