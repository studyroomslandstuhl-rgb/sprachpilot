(function(){
'use strict';
if(window.__SP_L8_WORD_OVERVIEW_V1)return;
window.__SP_L8_WORD_OVERVIEW_V1=true;

const CDN='https://sprachpilot.b-cdn.net/';
let currentAudio=null;

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const slug=value=>String(value||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const themeNumber=()=>Number(document.body.dataset.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||1);

function profile(){
 try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}
}

const LANGS=[
 ['en','Englisch',['en','english','englisch']],['ru','Russisch',['ru','russian','russisch']],['tr','Türkisch',['tr','turkish','türkisch','tuerkisch']],['uk','Ukrainisch',['uk','ua','ukrainian','ukrainisch']],['ar','Arabisch',['ar','arabic','arabisch']],['ja','Japanisch',['ja','japanese','japanisch']],['ro','Rumänisch',['ro','romanian','rumänisch','rumaenisch']],['pl','Polnisch',['pl','polish','polnisch']],['ku','Kurdisch',['ku','kurdish','kurdisch','kurmanci']],['fa','Persisch',['fa','farsi','persisch']],['fr','Französisch',['fr','french','französisch','franzoesisch']],['es','Spanisch',['es','spanish','spanisch']],['it','Italienisch',['it','italian','italienisch']]
];
function language(){
 const p=profile();
 const raw=normalize(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'en');
 for(const [code,label,keys] of LANGS){if(keys.some(k=>raw===normalize(k)||raw.includes(normalize(k))))return{code,label,keys}}
 return{code:'en',label:'Englisch',keys:['en','english','englisch']}
}
function translation(item){
 const lang=language();
 const aliases=[lang.code,...lang.keys].map(normalize);
 const direct=[item?.translation,item?.uebersetzung,item?.übersetzung,item?.motherLanguageTranslation].find(v=>typeof v==='string'&&v.trim());
 if(direct)return direct.trim();
 const seen=new Set();
 function walk(value,depth=0){
  if(value==null||depth>5)return'';
  if(typeof value==='string')return'';
  if(typeof value!=='object'||seen.has(value))return'';
  seen.add(value);
  for(const [key,val] of Object.entries(value)){
   const nk=normalize(key);
   if(aliases.includes(nk)&&typeof val==='string'&&val.trim())return val.trim();
  }
  const priority=['translations','translation','uebersetzungen','übersetzungen','i18n','languages','language','meaning','meanings'];
  for(const key of priority){if(value[key]!=null){const found=walk(value[key],depth+1);if(found)return found}}
  for(const val of Object.values(value)){const found=walk(val,depth+1);if(found)return found}
  return'';
 }
 return walk(item)||'';
}
function term(item){return String(item?.term||item?.full||item?.word||item?.answer||item?.prompt||'').trim()}
function typeOf(item){
 const text=normalize(`${item?.type||''} ${item?.detail||''} ${item?.category||''}`),word=term(item).toLowerCase();
 if(/\bnomen\b|\bsubstantiv\b/.test(text)||/^(der|die|das)\s+/.test(word))return'noun';
 if(/\bverb\b/.test(text))return'verb';
 if(/adjektiv/.test(text))return'adjective';
 if(/adverb/.test(text))return'adverb';
 if(/redemittel|redewendung|phrase|satz/.test(text))return'phrase';
 return'other';
}
const TYPE_LABELS={noun:'Nomen',verb:'Verben',adjective:'Adjektive',adverb:'Adverbien',phrase:'Redewendungen',other:'Weitere Wörter'};
function mediaUrl(value,folder=''){
 const raw=String(value||'').trim();if(!raw)return'';
 if(/^https?:\/\//i.test(raw))return raw;
 const clean=raw.replace(/^\/+/,''),parts=clean.split('/').filter(Boolean).map(encodeURIComponent).join('/');
 return CDN+(folder&&!clean.includes('/')?folder:'')+parts;
}
function imageUrl(item){return mediaUrl(item?.image||item?.img||'')}
function stopAudio(){if(currentAudio){try{currentAudio.pause();currentAudio.src=''}catch(e){}currentAudio=null}try{speechSynthesis.cancel()}catch(e){}}
function audioCandidates(item){
 const out=[];
 for(const value of[item?.audioFile,item?.audio,item?.wordAudio,item?.audio_file]){
  const raw=String(value||'').trim();if(!raw)continue;
  if(/^https?:\/\//i.test(raw))out.push(raw);
  else if(raw.includes('/'))out.push(mediaUrl(raw));
  else out.push(mediaUrl(raw,'audio/'));
 }
 const wordSlug=slug(term(item));if(wordSlug)out.push(CDN+'audio/'+encodeURIComponent(wordSlug)+'.mp3');
 const img=String(item?.image||'').split('/').pop()?.replace(/\.[^.]+$/,'');if(img)out.push(CDN+'audio/'+encodeURIComponent(img)+'.mp3');
 return [...new Set(out)];
}
function speak(text){if(!('speechSynthesis'in window))return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch(e){}}
function play(item,button){
 stopAudio();button?.classList.add('playing');const list=audioCandidates(item);let i=0;
 const next=()=>{
  if(i>=list.length){button?.classList.remove('playing');speak(term(item));return}
  const audio=new Audio(list[i++]);currentAudio=audio;let failed=false;
  const fail=()=>{if(failed)return;failed=true;try{audio.pause();audio.src=''}catch(e){}if(currentAudio===audio)currentAudio=null;next()};
  audio.addEventListener('error',fail,{once:true});audio.addEventListener('ended',()=>{if(currentAudio===audio)currentAudio=null;button?.classList.remove('playing')},{once:true});
  const p=audio.play();if(p&&typeof p.catch==='function')p.catch(fail);
 };
 next();
}
function detailHtml(item){
 const bits=[];
 if(item?.detail)bits.push(`<div class="l8-overview-detail">${esc(item.detail)}</div>`);
 if(item?.plural)bits.push(`<div class="l8-overview-meta"><b>Plural:</b> ${esc(item.plural)}</div>`);
 if(item?.example)bits.push(`<div class="l8-overview-example">${esc(item.example)}</div>`);
 return bits.join('');
}
function row(item,index){
 const word=term(item),img=imageUrl(item),tr=translation(item),lang=language();
 return `<article class="l8-overview-word">
  <div class="l8-overview-image">${img?`<img src="${esc(img)}" alt="${esc(word)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="l8-overview-fallback" hidden>${esc(word)}</div>`:`<div class="l8-overview-fallback">${esc(word)}</div>`}</div>
  <div class="l8-overview-content"><h3>${esc(word)}</h3>${detailHtml(item)}<div class="l8-overview-translation"><b>${esc(lang.label)}:</b> ${tr?esc(tr):'<span>–</span>'}</div></div>
  <button class="l8-overview-audio" type="button" data-audio-index="${index}" aria-label="${esc(word)} anhören">🔊 <span>Hören</span></button>
 </article>`;
}
function setHeader(theme){
 const subtitle=document.querySelector('.sp-header__subtitle');if(subtitle)subtitle.textContent=`Wortschatzübersicht · ${theme.title} · A1 Lektion 8 · Thema ${theme.number}`;
 document.querySelectorAll('.sp-header__nav-link').forEach(link=>{const txt=String(link.textContent||'').trim();if(txt==='Übersicht'&&link.tagName==='A')link.setAttribute('href','uebersicht.html')});
}
function installReset(){
 window.resetThemeProgress=()=>{if(window.L8S?.reset)return window.L8S.reset(themeNumber());location.href='index.html'};
}
function render(){
 const root=document.getElementById('app'),n=themeNumber();const theme=window.L8_THEME||window.L8_ALL_THEMES?.[n]||window.L8_ALL_THEMES?.[String(n)];
 if(!root||!theme)throw new Error('Thema konnte nicht geladen werden.');
 const task=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(t?.title||''));
 const items=(task?.items||[]).filter(item=>item&&term(item));
 const groups={};items.forEach((item,index)=>{item.__l8OverviewIndex=index;const type=typeOf(item);(groups[type]||(groups[type]=[])).push(item)});
 const order=['noun','verb','adjective','adverb','phrase','other'];
 root.innerHTML=`<div class="l8-wrap l8-overview-page">
  <section class="l8-card l8-overview-intro"><div class="l8-overview-eyebrow">WORTSCHATZÜBERSICHT</div><h1>Wörter aus Thema ${n}</h1><p>Hier siehst und hörst du die Wörter und Redewendungen aus diesem Thema.</p></section>
  ${items.length?order.filter(type=>groups[type]?.length).map(type=>`<section class="l8-card l8-overview-group"><div class="l8-overview-group-head"><h2>${TYPE_LABELS[type]}</h2><span>${groups[type].length} Wörter</span></div><div class="l8-overview-list">${groups[type].map(item=>row(item,item.__l8OverviewIndex)).join('')}</div></section>`).join(''):`<section class="l8-card"><h2>Noch keine Wörter hinterlegt</h2><p>Für dieses Thema sind aktuell keine Karteikarten-Wörter vorhanden.</p></section>`}
  <footer>© SprachPilot</footer></div>`;
 root.addEventListener('click',event=>{const button=event.target.closest('[data-audio-index]');if(!button)return;const item=items[Number(button.dataset.audioIndex)];if(item)play(item,button)});
 setHeader(theme);installReset();[80,300,900].forEach(ms=>setTimeout(()=>setHeader(theme),ms));
}

const style=document.createElement('style');style.id='sp-l8-word-overview-style';style.textContent=`
.l8-overview-page{padding-top:10px}.l8-overview-intro h1{margin:4px 0 14px;color:var(--lesson-main-dark);font-size:34px}.l8-overview-intro p{font-size:19px;line-height:1.5;margin:0}.l8-overview-eyebrow{font-size:13px;font-weight:950;letter-spacing:.08em;color:var(--lesson-main-dark)}
.l8-overview-group-head{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:18px}.l8-overview-group-head h2{margin:0;color:var(--lesson-main-dark);font-size:29px}.l8-overview-group-head span{padding:8px 13px;border:1px solid var(--lesson-line);border-radius:999px;background:var(--lesson-soft);color:var(--lesson-main-dark);font-weight:900}
.l8-overview-list{display:grid;gap:14px}.l8-overview-word{display:grid;grid-template-columns:140px minmax(0,1fr) 110px;gap:18px;align-items:center;padding:15px;border:2px solid var(--lesson-line);border-radius:22px;background:#fff}.l8-overview-image{width:140px;height:140px;border-radius:18px;overflow:hidden;background:var(--lesson-soft);display:grid;place-items:center}.l8-overview-image img{width:100%;height:100%;object-fit:cover;display:block}.l8-overview-fallback{padding:10px;text-align:center;font-weight:900;color:var(--lesson-main-dark)}.l8-overview-content h3{margin:0 0 7px;color:var(--lesson-main-dark);font-size:25px}.l8-overview-detail,.l8-overview-meta,.l8-overview-example{margin:4px 0;line-height:1.4}.l8-overview-example{font-style:italic;color:var(--lesson-muted)}.l8-overview-translation{margin-top:10px;padding-top:9px;border-top:1px solid var(--lesson-line);font-size:15px}.l8-overview-translation b{color:var(--lesson-main-dark)}.l8-overview-translation span{color:var(--lesson-muted)}.l8-overview-audio{min-height:54px;border:3px solid var(--lesson-main-dark);border-radius:16px;background:#fff;color:var(--lesson-main-dark);font-size:20px;font-weight:900;cursor:pointer}.l8-overview-audio span{display:block;font-size:13px;margin-top:2px}.l8-overview-audio.playing{background:var(--lesson-soft);border-color:var(--lesson-main)}
@media(max-width:720px){.l8-overview-word{grid-template-columns:105px minmax(0,1fr);gap:12px;padding:12px}.l8-overview-image{width:105px;height:105px}.l8-overview-audio{grid-column:1/-1;width:100%}.l8-overview-content h3{font-size:21px}.l8-overview-group-head h2{font-size:25px}}
@media(max-width:480px){.l8-overview-word{grid-template-columns:82px minmax(0,1fr)}.l8-overview-image{width:82px;height:82px}.l8-overview-intro h1{font-size:29px}.l8-overview-group-head{align-items:flex-start}.l8-overview-group-head span{font-size:12px}}
`;document.head.appendChild(style);

Promise.resolve(window.L8_CONTENT_READY).then(render).catch(error=>{console.error(error);const root=document.getElementById('app');if(root)root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Die Übersicht konnte nicht geladen werden.</h2><p>Bitte lade die Seite neu.</p><button class="l8-btn" onclick="location.reload()">Neu laden</button></section></div>'});
window.addEventListener('beforeunload',stopAudio);
})();
