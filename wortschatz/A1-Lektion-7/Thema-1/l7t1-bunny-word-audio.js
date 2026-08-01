(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_AUDIO_5)return;
window.__SP_L7T1_BUNNY_AUDIO_5=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const BASES=['https://sprachpilot.b-cdn.net/audio/','https://sprachpilot.b-cdn.net/Audio/'];
let activeAudio=null;
let generation=0;

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.…,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
}
function slug(value,separator='_'){
 return String(value||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,separator).replace(new RegExp('^'+separator+'+|'+separator+'+$','g'),'');
}
function basename(value){
 return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'';
}
function unique(values){return[...new Set(values.filter(Boolean))]}
function stop(){
 generation++;
 try{activeAudio?.pause()}catch(error){}
 if(activeAudio){try{activeAudio.src=''}catch(error){}activeAudio=null}
 try{speechSynthesis.cancel()}catch(error){}
 document.querySelectorAll('audio').forEach(audio=>{try{audio.pause();audio.currentTime=0}catch(error){}});
 document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'));
}
function overviewItem(button){
 const index=Number(button.dataset.audioIndex);
 return Number.isInteger(index)?window.__SP_L7_OVERVIEW_ITEMS?.[index]:null;
}
function itemText(item){
 if(!item)return'';
 const direct=String(item.audio||'').trim();
 if(direct)return direct;
 const word=String(item.full||item.answer||item.word||'').trim();
 return word.replace(/^(der|die|das)\s+/i,'');
}
function sourceText(button){
 const overview=overviewItem(button);
 if(overview)return itemText(overview);
 const direct=button.dataset.audioInfinitive||button.dataset.bunnyInfinitive||button.dataset.audio||button.dataset.text||'';
 if(direct)return String(direct).trim();
 const scope=button.closest('.flip-face,.l7-learning,.l7-question-card,.question-card,.card')||document;
 return String(scope.querySelector('.flip-word,.word,h2,h3')?.textContent||'').trim();
}
function candidates(value){
 const raw=String(value||'').trim();
 const file=basename(raw);
 const stem=file.replace(/\.mp3$/i,'');
 const withoutArticle=stem.replace(/^(der|die|das)[-_\s]+/i,'');
 const names=unique([
  stem,
  withoutArticle,
  slug(stem,'_'),
  slug(stem,'-'),
  slug(withoutArticle,'_'),
  slug(withoutArticle,'-'),
  slug(raw,'_'),
  slug(raw,'-'),
  slug(normalize(raw),'_')
 ]);
 const urls=[];
 if(/^https?:\/\//i.test(raw))urls.push(raw);
 if(file&&/\.mp3$/i.test(file))BASES.forEach(base=>urls.push(base+encodeURIComponent(file)));
 BASES.forEach(base=>names.forEach(name=>urls.push(base+encodeURIComponent(name)+'.mp3')));
 return unique(urls);
}
function errorBox(button){
 const scope=button.closest('.l7-audio,.flip-face,.l7-learning,.l7-question-card,.question-card,.card,.sp-overview-word')||button.parentElement;
 if(!scope)return;
 let box=scope.querySelector('.bunny-audio-error');
 if(!box){
  box=document.createElement('div');
  box.className='bunny-audio-error';
  box.setAttribute('role','status');
  box.textContent='Die Audiodatei konnte nicht geladen werden.';
  scope.appendChild(box);
 }
}
function clearError(button){
 const scope=button.closest('.l7-audio,.flip-face,.l7-learning,.l7-question-card,.question-card,.card,.sp-overview-word')||button.parentElement;
 scope?.querySelector('.bunny-audio-error')?.remove();
}
function play(value,button){
 stop();
 clearError(button);
 const token=generation;
 const urls=candidates(value);
 let index=0;
 function next(){
  if(token!==generation)return;
  if(index>=urls.length){
   button.classList.remove('bunny-audio-playing');
   errorBox(button);
   return;
  }
  const audio=new Audio(urls[index++]);
  activeAudio=audio;
  audio.preload='auto';
  button.classList.add('bunny-audio-playing');
  let failed=false;
  const fail=()=>{
   if(failed||token!==generation)return;
   failed=true;
   try{audio.pause();audio.src=''}catch(error){}
   if(activeAudio===audio)activeAudio=null;
   next();
  };
  audio.addEventListener('error',fail,{once:true});
  audio.addEventListener('ended',()=>{
   if(token!==generation)return;
   if(activeAudio===audio)activeAudio=null;
   button.classList.remove('bunny-audio-playing');
  },{once:true});
  const promise=audio.play();
  if(promise&&typeof promise.catch==='function')promise.catch(fail);
 }
 next();
}

document.addEventListener('click',event=>{
 const button=event.target instanceof Element?event.target.closest('button[data-audio],button[data-audio-infinitive],[data-action="card-audio"],#cardListenBtn,.card-listen-btn,.word-audio,[data-audio-index]'):null;
 if(!button)return;
 const value=sourceText(button);
 if(!value)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 play(value,button);
},true);
window.addEventListener('beforeunload',stop);
window.L7T1BunnyAudio={play,stop,candidates};
})();
