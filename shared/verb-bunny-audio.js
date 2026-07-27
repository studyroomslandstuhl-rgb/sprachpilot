(function(){
'use strict';
const AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
const FORMS={
 'sein':{part:'gewesen',aux:'ist'},'haben':{part:'gehabt',aux:'hat'},'werden':{part:'geworden',aux:'ist'},'tun':{part:'getan',aux:'hat'},'wissen':{part:'gewusst',aux:'hat'},
 'kommen':{part:'gekommen',aux:'ist'},'gehen':{part:'gegangen',aux:'ist'},'bringen':{part:'gebracht',aux:'hat'},'denken':{part:'gedacht',aux:'hat'},'gewinnen':{part:'gewonnen',aux:'hat'},
 'springen':{part:'gesprungen',aux:'ist'},'verlieren':{part:'verloren',aux:'hat'},'beißen':{part:'gebissen',aux:'hat'},'gießen':{part:'gegossen',aux:'hat'},'reißen':{part:'gerissen',aux:'hat'},
 'genießen':{part:'genossen',aux:'hat'},'singen':{part:'gesungen',aux:'hat'},'schließen':{part:'geschlossen',aux:'hat'},'rennen':{part:'gerannt',aux:'ist'},'finden':{part:'gefunden',aux:'hat'},
 'schneiden':{part:'geschnitten',aux:'hat'},'streiten':{part:'gestritten',aux:'hat'},'essen':{part:'gegessen',aux:'hat'},'sprechen':{part:'gesprochen',aux:'hat'},'fahren':{part:'gefahren',aux:'ist'},
 'schlafen':{part:'geschlafen',aux:'hat'},'sehen':{part:'gesehen',aux:'hat'},'lesen':{part:'gelesen',aux:'hat'},'rufen':{part:'gerufen',aux:'hat'},'schreien':{part:'geschrien',aux:'hat'},
 'schieben':{part:'geschoben',aux:'hat'},'ziehen':{part:'gezogen',aux:'hat'},'empfehlen':{part:'empfohlen',aux:'hat'},'geben':{part:'gegeben',aux:'hat'},'befehlen':{part:'befohlen',aux:'hat'},
 'helfen':{part:'geholfen',aux:'hat'},'braten':{part:'gebraten',aux:'hat'},'waschen':{part:'gewaschen',aux:'hat'},'nehmen':{part:'genommen',aux:'hat'},'stehlen':{part:'gestohlen',aux:'hat'},
 'tragen':{part:'getragen',aux:'hat'},'brechen':{part:'gebrochen',aux:'hat'},'laufen':{part:'gelaufen',aux:'ist'},'vergessen':{part:'vergessen',aux:'hat',perfectFile:'hat_vergessen.mp3'},'messen':{part:'gemessen',aux:'hat'},
 'fressen':{part:'gefressen',aux:'hat'},'graben':{part:'gegraben',aux:'hat'},'schlagen':{part:'geschlagen',aux:'hat'},'sterben':{part:'gestorben',aux:'ist'},'treffen':{part:'getroffen',aux:'hat'},
 'werfen':{part:'geworfen',aux:'hat'},'fangen':{part:'gefangen',aux:'hat'},'blasen':{part:'geblasen',aux:'hat'},'fallen':{part:'gefallen',aux:'ist',perfectFile:'ist_gefallen.mp3'},'saufen':{part:'gesoffen',aux:'hat'},
 'halten':{part:'gehalten',aux:'hat'},'laden':{part:'geladen',aux:'hat'},'lassen':{part:'gelassen',aux:'hat'},'wachsen':{part:'gewachsen',aux:'ist'},'werben':{part:'geworben',aux:'hat'},
 'raten':{part:'geraten',aux:'hat'},'stechen':{part:'gestochen',aux:'hat'},'gefallen':{part:'gefallen',aux:'hat',perfectFile:'hat_gefallen.mp3'},'bleiben':{part:'geblieben',aux:'ist'},'einladen':{part:'eingeladen',aux:'hat'},
 'aufgeben':{part:'aufgegeben',aux:'hat'},'zusehen':{part:'zugesehen',aux:'hat'},'abschreiben':{part:'abgeschrieben',aux:'hat'},'vorlesen':{part:'vorgelesen',aux:'hat'},'verschlafen':{part:'verschlafen',aux:'hat'},
 'anfangen':{part:'angefangen',aux:'hat'},'versprechen':{part:'versprochen',aux:'hat'},'lügen':{part:'gelogen',aux:'hat'},'sich benehmen':{part:'benommen',aux:'hat'},'ausfallen':{part:'ausgefallen',aux:'ist'},
 'aufbacken':{part:'aufgebacken',aux:'hat'},'abraten':{part:'abgeraten',aux:'hat'},'beraten':{part:'beraten',aux:'hat'},'vorschlagen':{part:'vorgeschlagen',aux:'hat'},'losfahren':{part:'losgefahren',aux:'ist'},
 'dabeihaben':{part:'dabeigehabt',aux:'hat'},'leidtun':{part:'leidgetan',aux:'hat'}
};
const normalize=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
const slug=value=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const keyByNormalized=new Map(Object.keys(FORMS).map(key=>[normalize(key),key]));
const fullPerfect=v=>{const form=FORMS[v];return form?`${form.aux} ${v.startsWith('sich ')?'sich ':''}${form.part}`:''};
const perfectEntries=Object.keys(FORMS).map(v=>({verb:v,text:normalize(fullPerfect(v))})).sort((a,b)=>b.text.length-a.text.length);
const verbEntries=Object.keys(FORMS).map(v=>({verb:v,text:normalize(v)})).sort((a,b)=>b.text.length-a.text.length);
const infinitiveUrl=v=>AUDIO_BASE+encodeURIComponent(slug(v)+'.mp3');
const perfectUrl=v=>{const form=FORMS[v];if(!form)return'';return AUDIO_BASE+encodeURIComponent(form.perfectFile||slug(form.part)+'.mp3')};
function exactVerb(value){return keyByNormalized.get(normalize(value))||''}
function verbFromPerfectText(value){const text=normalize(value);return perfectEntries.find(item=>text===item.text||text.includes(item.text))?.verb||''}
function verbFromText(value){const text=normalize(value);const perfect=verbFromPerfectText(text);if(perfect)return perfect;return verbEntries.find(item=>text===item.text||text.startsWith(item.text+' ')||text.endsWith(' '+item.text)||text.includes(' '+item.text+' '))?.verb||''}
let activeAudio=null;
function clearPlaying(){document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'))}
function showError(button){clearPlaying();const scope=button?.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button?.parentElement;if(!scope)return;let error=scope.querySelector('.bunny-audio-error');if(!error){error=document.createElement('div');error.className='bunny-audio-error';error.textContent='Die Audiodatei konnte nicht geladen werden.';scope.appendChild(error)}}
function play(url,slow,button){if(!url)return;try{activeAudio?.pause()}catch(e){}clearPlaying();const audio=new Audio(url);activeAudio=audio;audio.preload='auto';audio.playbackRate=slow?0.75:1;if(button)button.classList.add('bunny-audio-playing');audio.onended=()=>{if(activeAudio===audio)activeAudio=null;clearPlaying()};audio.onerror=()=>{if(activeAudio===audio)activeAudio=null;showError(button)};audio.play().catch(()=>showError(button))}
function stopOriginal(event){event.preventDefault();event.stopImmediatePropagation()}
function button(label,attribute,verb,extra=''){const el=document.createElement('button');el.type='button';el.className=extra||'btn secondary';el.setAttribute(attribute,verb);el.textContent=label;return el}
function presentVerbForButton(target){const direct=exactVerb(target.dataset.text||'');if(direct)return direct;const card=target.closest('.overview-verb-card,.task-page');if(!card)return'';return exactVerb(card.querySelector('.flip-word,h3')?.textContent||'')}
function perfektVerbForButton(target){const explicit=target.dataset.bunnyPerfect||target.dataset.bunnyInfinitive;if(explicit&&FORMS[explicit])return explicit;const fromFull=verbFromPerfectText(target.dataset.text||'');if(fromFull)return fromFull;const card=target.closest('.overview-verb-card,.task-page');const infinitive=card?.querySelector('.card-translation b,.overview-verb-text h3')?.textContent||'';return exactVerb(infinitive)}
document.addEventListener('click',event=>{
 const target=event.target.closest('button');if(!target)return;
 const slow=target.dataset.bunnySlow==='1'||target.dataset.action==='audio-slow';
 if(target.dataset.bunnyInfinitive){const verb=exactVerb(target.dataset.bunnyInfinitive);if(verb){stopOriginal(event);play(infinitiveUrl(verb),slow,target)}return}
 if(target.dataset.bunnyPerfect){const verb=exactVerb(target.dataset.bunnyPerfect);if(verb){stopOriginal(event);play(perfectUrl(verb),slow,target)}return}
 const path=location.pathname;
 if(path.startsWith('/verben/')){
  if(!target.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini'))return;
  const verb=presentVerbForButton(target);if(!verb)return;stopOriginal(event);play(infinitiveUrl(verb),slow,target);return
 }
 if(path.startsWith('/perfekt/')){
  if(!target.matches('[data-action="audio"],[data-action="audio-slow"],#cardListenBtn,.audio-mini'))return;
  const verb=perfektVerbForButton(target);if(!verb)return;stopOriginal(event);play(perfectUrl(verb),slow,target)
 }
},true);
function enhanceOverview(){document.querySelectorAll('.overview-verb-card').forEach(card=>{const verb=exactVerb(card.querySelector('h3')?.textContent||'');if(!verb)return;const old=card.querySelector('.audio-mini');if(!old||old.dataset.bunnyPerfect)return;old.dataset.bunnyPerfect=verb;old.removeAttribute('data-action');old.removeAttribute('data-text');old.textContent='🔊 Perfekt';const inf=button('🔊 Infinitiv','data-bunny-infinitive',verb,'audio-mini');old.parentNode.insertBefore(inf,old)})}
function enhanceCard(){const old=document.querySelector('#cardListenBtn');if(!old||old.dataset.bunnyPerfect)return;const verb=exactVerb(document.querySelector('.card-translation b')?.textContent||'');if(!verb)return;old.dataset.bunnyPerfect=verb;old.textContent='🔊 Perfekt';const inf=button('🔊 Infinitiv','data-bunny-infinitive',verb,'btn secondary');old.parentNode.insertBefore(inf,old)}
function enhanceQuestion(){const card=document.querySelector('.question-card');if(!card||card.dataset.bunnyEnhanced==='1')return;const question=card.querySelector('.question')?.textContent||'';const verb=verbFromText(question);if(!verb)return;card.dataset.bunnyEnhanced='1';const listen=card.querySelector('.listen-box');if(listen){const audio=listen.querySelector('[data-action="audio"]'),slow=listen.querySelector('[data-action="audio-slow"]');if(audio){audio.dataset.bunnyPerfect=verb;audio.removeAttribute('data-action');audio.removeAttribute('data-text');audio.textContent='🔊 Perfekt'}if(slow){slow.dataset.bunnyPerfect=verb;slow.dataset.bunnySlow='1';slow.removeAttribute('data-action');slow.removeAttribute('data-text');slow.textContent='Perfekt langsam'}listen.insertBefore(button('🔊 Infinitiv','data-bunny-infinitive',verb,'btn secondary'),listen.firstChild);return}const pair=document.createElement('div');pair.className='bunny-audio-pair';pair.append(button('🔊 Infinitiv','data-bunny-infinitive',verb,'btn secondary'),button('🔊 Perfekt','data-bunny-perfect',verb,'btn secondary'));card.insertBefore(pair,card.querySelector('.question'))}
let scheduled=false;
function enhance(){if(!location.pathname.startsWith('/perfekt/'))return;enhanceOverview();enhanceCard();enhanceQuestion()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
schedule();
const style=document.createElement('style');style.textContent='.bunny-audio-pair{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:0 0 16px}.overview-verb-text .audio-mini{margin-right:6px;margin-top:6px}.bunny-audio-playing{outline:3px solid #0b7590!important}.bunny-audio-error{margin-top:8px;color:#9b1c1c;font-weight:700;font-size:.92rem}';document.head.appendChild(style);
window.SPVerbBunnyAudio={forms:FORMS,infinitiveUrl,perfectUrl,playInfinitive:(v,slow=false)=>play(infinitiveUrl(exactVerb(v)),slow),playPerfect:(v,slow=false)=>play(perfectUrl(exactVerb(v)),slow)};
})();
