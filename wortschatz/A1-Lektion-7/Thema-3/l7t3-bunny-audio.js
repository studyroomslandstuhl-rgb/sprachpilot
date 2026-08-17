(function(){
'use strict';
if(window.__SP_L7T3_BUNNY_AUDIO_V1)return;
window.__SP_L7T3_BUNNY_AUDIO_V1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-3/'))return;

const BASE='https://sprachpilot.b-cdn.net/audio/';
const BUNNY=/^https:\/\/sprachpilot\.b-cdn\.net\/audio\//i;
let activeAudio=null,generation=0;
const PERFECT_TO_INFINITIVE=Object.freeze({
 gegangen:'gehen',gefahren:'fahren',gekommen:'kommen',geflogen:'fliegen',gewandert:'wandern',
 gelernt:'lernen',gemacht:'machen',geschrieben:'schreiben',gehört:'hören',gespielt:'spielen',gesehen:'sehen',gelesen:'lesen',gekauft:'kaufen',gesprochen:'sprechen',gearbeitet:'arbeiten',getroffen:'treffen',gefrühstückt:'frühstücken',geschlafen:'schlafen',gekocht:'kochen',gegessen:'essen',getrunken:'trinken',gesagt:'sagen',gelebt:'leben',gekostet:'kosten',gegrillt:'grillen',gesucht:'suchen',gewohnt:'wohnen'
});
function normalize(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.…,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ')}
function slug(value,separator='_'){return String(value||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'')}
function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function unique(values){return[...new Set(values.filter(Boolean))]}
function stop(){generation++;try{activeAudio?.pause()}catch(e){}if(activeAudio){try{activeAudio.src=''}catch(e){}activeAudio=null}try{window.speechSynthesis?.cancel?.()}catch(e){}document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'))}
function sourceText(button){const direct=button?.dataset?.audioFile||button?.dataset?.audioInfinitive||button?.dataset?.bunnyInfinitive||button?.dataset?.audio||button?.dataset?.text||'';if(direct)return String(direct).trim();const scope=button?.closest?.('.flip-face,.l7-learning,.l7-question-card,.question-card,.card')||document;return String(scope.querySelector('.flip-word,.word,h2,h3')?.textContent||'').trim()}
function infinitiveFor(value){const text=String(value||'').trim().toLowerCase().replace(/^(ich\s+)?(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\s+/,'').replace(/[.!?]+$/,'').trim();return PERFECT_TO_INFINITIVE[text]||''}
function candidates(value){
 const raw=String(value||'').trim(),file=basename(raw),stem=file.replace(/\.mp3$/i,'');
 const plain=raw.replace(/\.mp3$/i,'').replace(/^(ich\s+)?(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\s+/i,'').trim();
 const infinitive=infinitiveFor(raw)||infinitiveFor(stem);
 const names=unique([stem,slug(stem,'_'),slug(stem,'-'),plain,slug(plain,'_'),slug(plain,'-'),infinitive,slug(infinitive,'_'),slug(infinitive,'-'),slug(normalize(raw),'_')]);
 const urls=[];if(BUNNY.test(raw))urls.push(raw);if(file&&/\.mp3$/i.test(file))urls.push(BASE+encodeURIComponent(file));names.forEach(name=>{if(name)urls.push(BASE+encodeURIComponent(name)+'.mp3')});return unique(urls)
}
function errorBox(button){if(!button)return;const scope=button.closest('.l7-audio,.flip-face,.l7-learning,.l7-question-card,.question-card,.card')||button.parentElement;if(!scope)return;let box=scope.querySelector('.bunny-audio-error');if(!box){box=document.createElement('div');box.className='bunny-audio-error';box.setAttribute('role','status');box.textContent='Die B1-Deutsch-Audiodatei konnte nicht geladen werden.';scope.appendChild(box)}}
function clearError(button){const scope=button?.closest?.('.l7-audio,.flip-face,.l7-learning,.l7-question-card,.question-card,.card')||button?.parentElement;scope?.querySelector('.bunny-audio-error')?.remove()}
function play(value,button,done,fail){
 stop();clearError(button);const token=generation,urls=candidates(value);let index=0;
 function next(){
  if(token!==generation)return;
  if(index>=urls.length){button?.classList.remove('bunny-audio-playing');errorBox(button);fail?.();return}
  const audio=new Audio(urls[index++]);activeAudio=audio;audio.preload='auto';button?.classList.add('bunny-audio-playing');let failed=false;
  const bad=()=>{if(failed||token!==generation)return;failed=true;try{audio.pause();audio.src=''}catch(e){}if(activeAudio===audio)activeAudio=null;next()};
  audio.addEventListener('error',bad,{once:true});audio.addEventListener('ended',()=>{if(token!==generation)return;if(activeAudio===audio)activeAudio=null;button?.classList.remove('bunny-audio-playing');done?.()},{once:true});
  const promise=audio.play();if(promise&&typeof promise.catch==='function')promise.catch(bad)
 }
 next()
}
function install(){if(!window.L7S)return false;window.L7S.say=(text,fail)=>play(text,null,null,fail);window.L7S.__b1DeutschAudio=true;try{window.speechSynthesis?.cancel?.()}catch(e){}return true}
document.addEventListener('click',event=>{const button=event.target instanceof Element?event.target.closest('button[data-audio],button[data-audio-file],button[data-audio-infinitive],[data-action="card-audio"],#cardListenBtn,.card-listen-btn,.word-audio'):null;if(!button)return;const value=sourceText(button);if(!value)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();play(value,button)},true);
window.L7T3BunnyAudio={play,stop,candidates,base:BASE,install};window.addEventListener('beforeunload',stop);
})();
