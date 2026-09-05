(function(){
'use strict';
if(window.SPWordOverviewStandard)return;
let currentAudio=null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaultLabels={noun:'Nomen',verb:'Verben',adjective:'Adjektive',adverb:'Weitere Wörter',phrase:'Redewendungen',other:'Weitere Wörter'};
function typeOf(item){const t=String(item?.type||'').toLowerCase();if(t==='noun')return'noun';if(t==='verb'||t==='modal')return'verb';if(t==='adjective')return'adjective';if(t==='adverb'||t==='pronoun'||t==='modalpartikel')return'adverb';if(t==='phrase')return'phrase';return'other'}
function term(item){return String(item?.full||item?.term||item?.word||'').trim()}
function stop(){
 if(currentAudio){
  const a=currentAudio;currentAudio=null;
  try{a.onended=null;a.onerror=null;a.pause();a.removeAttribute('src');a.load()}catch(e){}
 }
 try{speechSynthesis.cancel()}catch(e){}
}
function speak(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function play(item,button){
 stop();
 button?.classList.add('playing');
 const src=String(item?.audio||'').trim();
 /* Computerstimme nur wenn gar keine Audio-Datei hinterlegt ist. Sobald Bunny vorhanden ist, läuft ausschließlich Bunny. */
 if(!src){button?.classList.remove('playing');speak(term(item));return}
 const a=new Audio();currentAudio=a;
 a.preload='auto';
 a.onended=()=>{if(currentAudio===a)currentAudio=null;button?.classList.remove('playing')};
 a.onerror=()=>{if(currentAudio===a)currentAudio=null;button?.classList.remove('playing')};
 a.src=src;
 const p=a.play();
 if(p&&typeof p.catch==='function')p.catch(()=>{if(currentAudio===a)currentAudio=null;button?.classList.remove('playing')});
}
function detail(item){const bits=[];if(item?.plural)bits.push(`<div class="sp-vocab-meta"><b>Plural:</b> ${esc(item.plural)}</div>`);if(item?.perfect)bits.push(`<div class="sp-vocab-meta"><b>Perfekt:</b> ${esc(item.perfect)}</div>`);if(item?.example)bits.push(`<div class="sp-vocab-example">${esc(item.example)}</div>`);return bits.join('')}
function waitForHeader(timeout=6000){return new Promise(resolve=>{const started=Date.now();function check(){if(document.querySelector('.sp-header'))return resolve(true);if(Date.now()-started>=timeout)return resolve(false);requestAnimationFrame(check)}check()})}
async function render(config={}){
 const root=typeof config.root==='string'?document.querySelector(config.root):config.root||document.getElementById('app');if(!root)return;
 await waitForHeader(config.headerTimeout||6000);
 const items=(config.items||[]).filter(Boolean),labels={...defaultLabels,...(config.labels||{})},order=config.order||['noun','verb','adjective','adverb','phrase','other'],groups={};
 items.forEach((item,index)=>{item.__spOverviewIndex=index;const key=(config.typeOf||typeOf)(item);(groups[key]||(groups[key]=[])).push(item)});
 const translationLabel=String(config.translationLabel||'Muttersprache');
 const row=item=>{const word=term(item),image=String(item?.image||''),tr=String((config.translationOf?config.translationOf(item):item?.translation)||'');return `<article class="sp-vocab-word"><div class="sp-vocab-image">${image?`<img src="${esc(image)}" alt="${esc(word)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="sp-vocab-fallback" hidden>${esc(word)}</div>`:`<div class="sp-vocab-fallback">${esc(word)}</div>`}</div><div class="sp-vocab-content"><h3>${esc(word)}</h3>${detail(item)}<div class="sp-vocab-translation"><b>${esc(translationLabel)}:</b> ${tr?esc(tr):'<span>–</span>'}</div></div><button class="sp-vocab-audio" type="button" data-sp-vocab-audio="${item.__spOverviewIndex}" aria-label="${esc(word)} anhören">🔊 <span>Hören</span></button></article>`};
 root.innerHTML=`<div class="l8-wrap sp-vocab-overview"><section class="l8-card sp-vocab-intro"><div class="sp-vocab-eyebrow">${esc(config.eyebrow||'WORTSCHATZÜBERSICHT')}</div><h1>${esc(config.title||'Wortschatz')}</h1><p>${esc(config.description||'Hier siehst und hörst du die Wörter und Redewendungen aus diesem Thema.')}</p></section>${order.filter(k=>groups[k]?.length).map(k=>`<section class="l8-card sp-vocab-group"><div class="sp-vocab-group-head"><h2>${esc(labels[k]||k)}</h2><span>${groups[k].length} Wörter</span></div><div class="sp-vocab-list">${groups[k].map(row).join('')}</div></section>`).join('')}<footer>© SprachPilot</footer></div>`;
 root.addEventListener('click',e=>{const b=e.target.closest('[data-sp-vocab-audio]');if(!b)return;const item=items[Number(b.dataset.spVocabAudio)];if(item)play(item,b)});
 if(config.headerSubtitle){const setHeader=()=>{const subtitle=document.querySelector('.sp-header__subtitle');if(subtitle)subtitle.textContent=config.headerSubtitle};setHeader();[80,250,700].forEach(ms=>setTimeout(setHeader,ms))}
 window.addEventListener('beforeunload',stop,{once:true});
}
window.SPWordOverviewStandard={render,stop,typeOf,waitForHeader};
})();
