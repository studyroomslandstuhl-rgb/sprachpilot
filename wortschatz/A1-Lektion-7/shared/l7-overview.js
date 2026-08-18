(function(){
'use strict';
if(window.__SP_L7_OVERVIEW_STANDARD_3)return;
window.__SP_L7_OVERVIEW_STANDARD_3=true;

const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO_DIRS=[CDN+'audio/',CDN+'Audio/'];
let currentAudio=null;
let playGeneration=0;

function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function normalize(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function germanSlug(value){return String(value||'').trim().toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function base(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()?.replace(/\.(webp|png|jpe?g|gif|svg|mp3)$/i,'')||''}
function themeNumber(){return Number(document.body.dataset.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||1)}
function itemFull(item){return window.L7TranslationStandard?.full(item)||String(item?.full||item?.answer||item?.word||'').trim()}
function itemType(item){return window.L7TranslationStandard?.type(item)||'other'}
function typeLabel(type){return window.L7TranslationStandard?.labelForType(type)||'Weitere Wörter'}
function imageUrl(item){
 const value=String(item?.image||item?.img||'').trim();
 if(!value)return'';
 if(/^https?:\/\//i.test(value)||value.startsWith('/'))return value;
 return CDN+encodeURIComponent(value);
}
function infinitiveText(item){
 const direct=String(item?.infinitive||item?.prompt||'').trim();
 if(direct)return direct;
 const full=itemFull(item);
 return String(full.split(/\s+-\s+/)[0]||full).trim()
}
function participleText(item){
 const direct=String(item?.participle||item?.partizipII||'').trim();
 if(direct)return direct;
 let perfect=String(item?.perfect||item?.answer||item?.word||'').trim();
 if(!perfect){const full=itemFull(item),parts=full.split(/\s+-\s+/);perfect=parts.length>1?parts.slice(1).join(' - ').trim():''}
 return perfect.replace(/^(habe|hast|hat|haben|habt|bin|bist|ist|sind|seid)\s+/i,'').trim()
}
function addAudioValue(out,value){
 const raw=String(value||'').trim();if(!raw)return;
 if(/^https?:\/\//i.test(raw)){out.push(raw);return}
 const file=base(raw),slug=germanSlug(raw),norm=normalize(raw);
 if(/\.mp3(?:[?#].*)?$/i.test(raw)){
  const name=String(raw).split(/[?#]/)[0].split('/').pop();
  AUDIO_DIRS.forEach(dir=>out.push(dir+encodeURIComponent(name)));
  return
 }
 [file,slug,norm].filter(Boolean).forEach(name=>AUDIO_DIRS.forEach(dir=>out.push(dir+encodeURIComponent(name)+'.mp3')))
}
function audioCandidates(item,kind='default'){
 const out=[];
 if(kind==='infinitive'){
  addAudioValue(out,item?.infinitiveAudio||item?.infinitiveAudioFile||item?.audioFile);
  addAudioValue(out,infinitiveText(item));
  return [...new Set(out)]
 }
 if(kind==='participle'){
  addAudioValue(out,item?.participleAudio||item?.participleAudioFile||item?.perfectAudio||item?.perfectAudioFile);
  addAudioValue(out,participleText(item));
  return [...new Set(out)]
 }
 const names=[];
 [item?.audio,item?.id,item?.word,itemFull(item),base(item?.image)].filter(Boolean).forEach(value=>{
  const raw=base(value)||String(value||'');
  [raw,germanSlug(raw),normalize(raw),germanSlug(String(value).replace(/^(der|die|das)\s+/i,''))].filter(Boolean).forEach(name=>{if(!names.includes(name))names.push(name)});
 });
 const direct=String(item?.audio||'');
 if(/^https?:\/\//i.test(direct))out.push(direct);
 AUDIO_DIRS.forEach(dir=>names.forEach(name=>out.push(dir+encodeURIComponent(name)+'.mp3')));
 return [...new Set(out)]
}
function stopAudio(){
 playGeneration++;
 if(currentAudio){try{currentAudio.pause();currentAudio.src='';}catch(e){}currentAudio=null;}
 try{speechSynthesis.cancel()}catch(e){}
 document.querySelectorAll('audio').forEach(audio=>{try{audio.pause();audio.currentTime=0;}catch(e){}});
 document.querySelectorAll('.sp-overview-audio.playing').forEach(button=>button.classList.remove('playing'))
}
function fallbackSpeak(text,generation){
 if([2,3,4].includes(themeNumber()))return;
 if(generation!==playGeneration||!('speechSynthesis'in window))return;
 try{speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='de-DE';utterance.rate=.84;speechSynthesis.speak(utterance)}catch(e){}
}
function playItem(item,kind='default',button=null){
 stopAudio();
 const generation=playGeneration;
 const candidates=audioCandidates(item,kind);
 const spoken=kind==='infinitive'?infinitiveText(item):kind==='participle'?participleText(item):itemFull(item);
 let index=0;
 button?.classList.add('playing');
 function attempt(){
  if(generation!==playGeneration)return;
  if(index>=candidates.length){button?.classList.remove('playing');fallbackSpeak(spoken,generation);return;}
  const audio=new Audio(candidates[index++]);
  currentAudio=audio;
  audio.preload='auto';
  let advanced=false;
  const fail=()=>{
   if(advanced||generation!==playGeneration)return;
   advanced=true;
   try{audio.pause();audio.src='';}catch(e){}
   if(currentAudio===audio)currentAudio=null;
   attempt();
  };
  audio.addEventListener('error',fail,{once:true});
  audio.addEventListener('ended',()=>{if(generation!==playGeneration)return;if(currentAudio===audio)currentAudio=null;button?.classList.remove('playing')},{once:true});
  const promise=audio.play();
  if(promise&&typeof promise.catch==='function')promise.catch(fail);
 }
 attempt();
}
function pluralText(item){
 const plural=String(item?.plural||'').trim();
 if(!plural||/kein plural|nur singular/i.test(plural))return'kein Plural';
 return plural;
}
function translationHtml(item){
 if(window.L7TranslationStandard)return L7TranslationStandard.grid(item);
 return'';
}
function audioHtml(item,index,type){
 const dual=[2,3].includes(themeNumber())&&type==='verb';
 if(!dual)return`<button class="sp-overview-audio" type="button" data-audio-index="${index}" data-audio-kind="default" aria-label="${esc(itemFull(item))} anhören">🔊</button>`;
 return `<div class="sp-overview-audios">
   <button class="sp-overview-audio sp-overview-audio--text" type="button" data-audio-index="${index}" data-audio-kind="infinitive" aria-label="Infinitiv ${esc(infinitiveText(item))} anhören"><span>🔊</span><b>Infinitiv</b></button>
   <button class="sp-overview-audio sp-overview-audio--text" type="button" data-audio-index="${index}" data-audio-kind="participle" aria-label="Partizip II ${esc(participleText(item))} anhören"><span>🔊</span><b>Partizip II</b></button>
  </div>`
}
function wordRow(item,index){
 const source=imageUrl(item),word=itemFull(item),type=itemType(item);
 return `<article class="sp-overview-word ${[2,3].includes(themeNumber())&&type==='verb'?'sp-overview-word--dual-audio':''}" data-word-index="${index}">
  <div class="sp-overview-word__image">${source?`<img src="${esc(source)}" alt="${esc(word)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="sp-overview-word__fallback" hidden>${esc(word)}</div>`:`<div class="sp-overview-word__fallback">${esc(word)}</div>`}</div>
  <div class="sp-overview-word__content"><h3>${esc(word)}</h3>${type==='noun'?`<p class="sp-overview-word__plural">Plural: ${esc(pluralText(item))}</p>`:''}${translationHtml(item)}</div>
  ${audioHtml(item,index,type)}
 </article>`;
}
function render(){
 const root=document.getElementById('app');
 const theme=window.L7_THEME;
 if(!root||!theme)return;
 window.L7TranslationStandard?.enrich();
 const task=(theme.tasks||[]).find(item=>item.id==='karteikarten'||item.kind==='cards'||/karteikarten/i.test(item.title||''));
 const items=(task?.items||[]).filter(item=>item&&itemFull(item));
 const groups={};
 items.forEach((item,index)=>{item.__overviewIndex=index;const type=itemType(item);(groups[type]||(groups[type]=[])).push(item)});
 const order=['noun','verb','adjective','adverb','phrase','other'];
 const themeNo=themeNumber();
 root.innerHTML=`<div class="l7-page sp-overview-page">
  <section class="l7-card sp-overview-intro"><p class="eyebrow">WORTSCHATZÜBERSICHT</p><h1>Wörter aus Thema ${themeNo}</h1><p>Hier siehst und hörst du nur die einzelnen Wörter und Redewendungen aus diesem Thema.</p></section>
  ${order.filter(type=>groups[type]?.length).map(type=>`<section class="l7-card sp-overview-group"><div class="sp-overview-group__head"><h2>${esc(typeLabel(type))}</h2><span>${groups[type].length} Wörter</span></div><div class="sp-overview-list">${groups[type].map(item=>wordRow(item,item.__overviewIndex)).join('')}</div></section>`).join('')}
  <footer>© SprachPilot</footer>
 </div>`;
 root.onclick=event=>{
  const button=event.target.closest('[data-audio-index]');
  if(!button)return;
  event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
  const item=items[Number(button.dataset.audioIndex)];
  if(item)playItem(item,String(button.dataset.audioKind||'default'),button);
 };
 window.__SP_L7_OVERVIEW_ITEMS=items;
}
function resetTheme(){
 const number=themeNumber();
 if(!confirm(`Fortschritte in Lektion 7 · Thema ${number} löschen?`))return;
 const marker=`_T${number}_`,keys=[];
 for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(String(key||'').startsWith('SP_L7_')&&String(key).includes(marker))keys.push(key)}
 keys.forEach(key=>localStorage.removeItem(key));
 location.href='index.html?reset='+Date.now();
}
window.resetThemeProgress=resetTheme;
window.addEventListener('sp:reset-theme-progress',resetTheme);
window.addEventListener('beforeunload',stopAudio);

const style=document.createElement('style');
style.id='sp-l7-overview-standard-style';
style.textContent=`
.sp-overview-page{padding-top:10px}
.sp-overview-intro h1{margin:4px 0 18px;color:var(--dark);font-size:34px}.sp-overview-intro>p:last-child{font-size:20px;line-height:1.55;margin:0;max-width:820px}
.sp-overview-group__head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:18px}.sp-overview-group__head h2{margin:0;color:var(--dark);font-size:30px}.sp-overview-group__head span{padding:9px 14px;border:1px solid var(--line);border-radius:999px;background:var(--soft);color:var(--dark);font-weight:900}
.sp-overview-list{display:grid;gap:14px}.sp-overview-word{display:grid;grid-template-columns:140px minmax(0,1fr) 68px;gap:18px;align-items:center;padding:15px;border:2px solid var(--line);border-radius:22px;background:#fff}.sp-overview-word--dual-audio{grid-template-columns:140px minmax(0,1fr) 152px}.sp-overview-word__image{width:140px;height:140px;border-radius:18px;overflow:hidden;background:var(--soft);display:grid;place-items:center}.sp-overview-word__image img{width:100%;height:100%;object-fit:contain;display:block}.sp-overview-word__fallback{padding:10px;text-align:center;font-weight:900;color:var(--dark)}.sp-overview-word__content h3{margin:0 0 6px;color:var(--dark);font-size:25px}.sp-overview-word__plural{margin:0 0 10px;color:var(--muted);font-size:17px}.sp-overview-audio{width:58px;height:58px;border:3px solid var(--dark);border-radius:50%;background:#fff;font-size:25px;cursor:pointer}.sp-overview-audio:active{transform:scale(.96)}.sp-overview-audio.playing{background:var(--soft);border-color:var(--main)}.sp-overview-audios{display:grid;gap:8px}.sp-overview-audio--text{width:100%;height:auto;min-height:52px;border-radius:14px;padding:7px 9px;display:flex;align-items:center;justify-content:center;gap:7px;font-size:17px}.sp-overview-audio--text b{font-size:13px;line-height:1.1}
.sp-translation-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px 14px;padding-top:8px;border-top:1px solid var(--line);font-size:14px;line-height:1.35}.sp-translation-grid b{color:var(--dark)}.sp-translation-grid span{color:var(--text)}
@media(max-width:760px){.sp-overview-intro h1{font-size:29px}.sp-overview-intro>p:last-child{font-size:18px}.sp-overview-word,.sp-overview-word--dual-audio{grid-template-columns:112px minmax(0,1fr) 132px;gap:12px;padding:12px}.sp-overview-word__image{width:112px;height:112px}.sp-overview-word__content h3{font-size:21px}.sp-overview-audio{width:50px;height:50px}.sp-overview-audio--text{width:100%;min-height:48px}.sp-translation-grid{grid-template-columns:1fr}.sp-overview-group__head h2{font-size:27px}}
@media(max-width:560px){.sp-overview-word,.sp-overview-word--dual-audio{grid-template-columns:88px minmax(0,1fr);align-items:start}.sp-overview-word__image{width:88px;height:88px}.sp-overview-audio:not(.sp-overview-audio--text){grid-column:1/-1;width:100%;height:48px;border-radius:14px}.sp-overview-audios{grid-column:1/-1;grid-template-columns:1fr 1fr}.sp-overview-audio--text{width:100%}.sp-overview-group__head{align-items:flex-start}.sp-overview-group__head span{font-size:13px}}
`;
document.head.appendChild(style);

Promise.resolve(window.L7_THEME_READY).then(()=>{
 if(window.L7TranslationStandard)return render();
 const script=document.createElement('script');script.src='../shared/l7-translations.js?v=1';script.onload=render;document.head.appendChild(script);
}).catch(error=>{console.error(error);const root=document.getElementById('app');if(root)root.innerHTML='<div class="l7-page"><section class="l7-card"><h2>Die Übersicht konnte nicht geladen werden.</h2></section></div>'});
})();
