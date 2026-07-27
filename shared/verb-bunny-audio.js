(function(){
'use strict';
const AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
const ROWS=[
 ['sein','gewesen','ist'],['haben','gehabt','hat'],['werden','geworden','ist'],['tun','getan','hat'],['wissen','gewusst','hat'],
 ['kommen','gekommen','ist'],['gehen','gegangen','ist'],['bringen','gebracht','hat'],['denken','gedacht','hat'],['schreiben','geschrieben','hat'],
 ['verstehen','verstanden','hat'],['schwimmen','geschwommen','ist'],['gewinnen','gewonnen','hat'],['springen','gesprungen','ist'],['verlieren','verloren','hat'],
 ['unterschreiben','unterschrieben','hat'],['trinken','getrunken','hat'],['beißen','gebissen','hat'],['gießen','gegossen','hat'],['reißen','gerissen','hat'],
 ['genießen','genossen','hat'],['singen','gesungen','hat'],['schließen','geschlossen','hat'],['rennen','gerannt','ist'],['finden','gefunden','hat'],
 ['schneiden','geschnitten','hat'],['streiten','gestritten','hat'],['essen','gegessen','hat'],['sprechen','gesprochen','hat'],['fahren','gefahren','ist'],
 ['schlafen','geschlafen','hat'],['sehen','gesehen','hat'],['lesen','gelesen','hat'],['rufen','gerufen','hat'],['schreien','geschrien','hat'],
 ['schieben','geschoben','hat'],['ziehen','gezogen','hat'],['stehen','gestanden','hat'],['empfehlen','empfohlen','hat'],['geben','gegeben','hat'],
 ['backen','gebacken','hat'],['reiten','geritten','ist'],['greifen','gegriffen','hat'],['kennen','gekannt','hat'],['befehlen','befohlen','hat'],
 ['helfen','geholfen','hat'],['braten','gebraten','hat'],['waschen','gewaschen','hat'],['nehmen','genommen','hat'],['stehlen','gestohlen','hat'],
 ['tragen','getragen','hat'],['brechen','gebrochen','hat'],['laufen','gelaufen','ist'],['vergessen','vergessen','hat','hat_vergessen.mp3'],['messen','gemessen','hat'],
 ['fressen','gefressen','hat'],['graben','gegraben','hat'],['schlagen','geschlagen','hat'],['sterben','gestorben','ist'],['treffen','getroffen','hat'],
 ['werfen','geworfen','hat'],['fangen','gefangen','hat'],['blasen','geblasen','hat'],['fallen','gefallen','ist','ist_gefallen.mp3'],['saufen','gesoffen','hat'],
 ['halten','gehalten','hat'],['laden','geladen','hat'],['lassen','gelassen','hat'],['wachsen','gewachsen','ist'],['werben','geworben','hat'],
 ['raten','geraten','hat'],['stechen','gestochen','hat'],['gefallen','gefallen','hat','hat_gefallen.mp3'],['bleiben','geblieben','ist'],['verbiegen','verbogen','hat'],
 ['heißen','geheißen','hat'],['sitzen','gesessen','hat'],['liegen','gelegen','hat'],['hängen','gehangen','hat'],['können','gekonnt','hat'],
 ['müssen','gemusst','hat'],['wollen','gewollt','hat'],['dürfen','gedurft','hat'],['sollen','gesollt','hat'],['möchten','gemocht','hat'],
 ['mögen','gemocht','hat'],['biegen','gebogen','hat'],['lügen','gelogen','hat'],['versprechen','versprochen','hat'],['vergeben','vergeben','hat'],
 ['verbringen','verbracht','hat'],['entscheiden','entschieden','hat'],['sich benehmen','benommen','hat'],['benehmen','benommen','hat'],['riechen','gerochen','hat'],
 ['stinken','gestunken','hat'],['schweigen','geschwiegen','hat'],['steigen','gestiegen','ist'],['sinken','gesunken','ist'],
 ['bieten','geboten','hat'],['bitten','gebeten','hat'],['nennen','genannt','hat'],['treiben','getrieben','hat'],['binden','gebunden','hat'],
 ['brennen','gebrannt','hat'],['erschrecken','erschrocken','ist'],['fliehen','geflohen','ist'],['fließen','geflossen','ist'],['frieren','gefroren','hat'],
 ['gelingen','gelungen','ist'],['gelten','gegolten','hat'],['geschehen','geschehen','ist'],['gleichen','geglichen','hat'],['heben','gehoben','hat'],
 ['klingen','geklungen','hat'],['leiden','gelitten','hat'],['leihen','geliehen','hat'],['meiden','gemieden','hat'],['reiben','gerieben','hat'],
 ['scheiden','geschieden','hat'],['scheinen','geschienen','hat'],['schießen','geschossen','hat'],['schmeißen','geschmissen','hat'],['treten','getreten','hat'],
 ['verzeihen','verziehen','hat'],['weisen','gewiesen','hat'],['wiegen','gewogen','hat'],['zwingen','gezwungen','hat'],
 ['anrufen','angerufen','hat'],['fernsehen','ferngesehen','hat'],['anfangen','angefangen','hat'],['aussterben','ausgestorben','ist'],['mitgeben','mitgegeben','hat'],
 ['mitnehmen','mitgenommen','hat'],['aufstehen','aufgestanden','ist'],['anziehen','angezogen','hat'],['ausziehen','ausgezogen','hat'],['einsteigen','eingestiegen','ist'],
 ['aussteigen','ausgestiegen','ist'],['umsteigen','umgestiegen','ist'],['ankommen','angekommen','ist'],['abfahren','abgefahren','ist'],['mitkommen','mitgekommen','ist'],
 ['zurückkommen','zurückgekommen','ist'],['abbiegen','abgebogen','hat'],['ausleihen','ausgeliehen','hat'],['vorhaben','vorgehabt','hat'],['aufgeben','aufgegeben','hat'],
 ['zusehen','zugesehen','hat'],['abschreiben','abgeschrieben','hat'],['vorlesen','vorgelesen','hat'],['verschlafen','verschlafen','hat'],['ausfallen','ausgefallen','ist'],
 ['aufbacken','aufgebacken','hat'],['abraten','abgeraten','hat'],['beraten','beraten','hat'],['vorschlagen','vorgeschlagen','hat'],['losfahren','losgefahren','ist'],
 ['dabeihaben','dabeigehabt','hat'],['leidtun','leidgetan','hat'],['einladen','eingeladen','hat'],['hinweisen','hingewiesen','hat'],['auffallen','aufgefallen','ist'],
 ['einfallen','eingefallen','ist'],['sich anziehen','angezogen','hat'],['sich ausziehen','ausgezogen','hat'],['sich umziehen','umgezogen','hat']
];
const FORMS=Object.fromEntries(ROWS.map(([verb,part,aux,perfectFile])=>[verb,{part,aux,perfectFile}]));
const normalize=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”„"'`()]/g,'').replace(/\s+/g,' ');
const slug=value=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const keyByNormalized=new Map(Object.keys(FORMS).map(key=>[normalize(key),key]));
const fullPerfect=verb=>{const form=FORMS[verb];return form?`${form.aux} ${verb.startsWith('sich ')?'sich ':''}${form.part}`:''};
const perfectEntries=Object.keys(FORMS).map(verb=>({verb,text:normalize(fullPerfect(verb))})).sort((a,b)=>b.text.length-a.text.length);
const verbEntries=Object.keys(FORMS).map(verb=>({verb,text:normalize(verb)})).sort((a,b)=>b.text.length-a.text.length);
const infinitiveUrl=verb=>AUDIO_BASE+encodeURIComponent(slug(verb)+'.mp3');
const perfectUrl=verb=>{const form=FORMS[verb];if(!form)return'';return AUDIO_BASE+encodeURIComponent(form.perfectFile||slug(form.part)+'.mp3')};
function exactVerb(value){return keyByNormalized.get(normalize(value))||''}
function verbFromPerfectText(value){const text=normalize(value);return perfectEntries.find(item=>text===item.text||text.includes(item.text))?.verb||''}
function verbFromText(value){const text=normalize(value);const perfect=verbFromPerfectText(text);if(perfect)return perfect;return verbEntries.find(item=>text===item.text||text.startsWith(item.text+' ')||text.endsWith(' '+item.text)||text.includes(' '+item.text+' '))?.verb||''}
let activeAudio=null;
function clearPlaying(){document.querySelectorAll('.bunny-audio-playing').forEach(button=>button.classList.remove('bunny-audio-playing'))}
function showError(button){clearPlaying();const scope=button?.closest('.listen-box,.overview-verb-text,.flip-face,.question-card,.card')||button?.parentElement;if(!scope)return;let error=scope.querySelector('.bunny-audio-error');if(!error){error=document.createElement('div');error.className='bunny-audio-error';error.textContent='Die Audiodatei konnte nicht geladen werden.';scope.appendChild(error)}}
function play(url,slow,button){if(!url)return;try{activeAudio?.pause()}catch(e){}clearPlaying();const audio=new Audio(url);activeAudio=audio;audio.preload='auto';audio.playbackRate=slow?0.75:1;if(button)button.classList.add('bunny-audio-playing');audio.onended=()=>{if(activeAudio===audio)activeAudio=null;clearPlaying()};audio.onerror=()=>{if(activeAudio===audio)activeAudio=null;showError(button)};audio.play().catch(()=>showError(button))}
function stopOriginal(event){event.preventDefault();event.stopImmediatePropagation()}
function button(label,attribute,verb,extra=''){const element=document.createElement('button');element.type='button';element.className=extra||'btn secondary';element.setAttribute(attribute,verb);element.textContent=label;return element}
function presentVerbForButton(target){const direct=exactVerb(target.dataset.text||'');if(direct)return direct;const card=target.closest('.overview-verb-card,.task-page');if(!card)return'';return exactVerb(card.querySelector('.flip-word,h3')?.textContent||'')}
function perfektVerbForButton(target){const explicit=target.dataset.bunnyPerfect||target.dataset.bunnyInfinitive;if(explicit&&FORMS[explicit])return explicit;const fromFull=verbFromPerfectText(target.dataset.text||'');if(fromFull)return fromFull;const card=target.closest('.overview-verb-card,.task-page');return exactVerb(card?.querySelector('.card-translation b,.overview-verb-text h3')?.textContent||'')}
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
function enhanceOverview(){document.querySelectorAll('.overview-verb-card').forEach(card=>{const verb=exactVerb(card.querySelector('h3')?.textContent||'');if(!verb)return;const old=card.querySelector('.audio-mini');if(!old||old.dataset.bunnyPerfect)return;old.dataset.bunnyPerfect=verb;old.removeAttribute('data-action');old.removeAttribute('data-text');old.textContent='🔊 Perfekt';const infinitive=button('🔊 Infinitiv','data-bunny-infinitive',verb,'audio-mini');old.parentNode.insertBefore(infinitive,old)})}
function enhanceCard(){const old=document.querySelector('#cardListenBtn');if(!old||old.dataset.bunnyPerfect)return;const verb=exactVerb(document.querySelector('.card-translation b')?.textContent||'');if(!verb)return;old.dataset.bunnyPerfect=verb;old.textContent='🔊 Perfekt';const infinitive=button('🔊 Infinitiv','data-bunny-infinitive',verb,'btn secondary');old.parentNode.insertBefore(infinitive,old)}
function enhanceQuestion(){const card=document.querySelector('.question-card');if(!card||card.dataset.bunnyEnhanced==='1')return;const question=card.querySelector('.question')?.textContent||'';const recorded=card.querySelector('[data-action="audio"],[data-action="audio-slow"]')?.dataset.text||'';const verb=verbFromText(question)||verbFromPerfectText(recorded);if(!verb)return;card.dataset.bunnyEnhanced='1';const listen=card.querySelector('.listen-box');if(listen){const audio=listen.querySelector('[data-action="audio"]'),slow=listen.querySelector('[data-action="audio-slow"]');if(audio){audio.dataset.bunnyPerfect=verb;audio.removeAttribute('data-action');audio.removeAttribute('data-text');audio.textContent='🔊 Perfekt'}if(slow){slow.dataset.bunnyPerfect=verb;slow.dataset.bunnySlow='1';slow.removeAttribute('data-action');slow.removeAttribute('data-text');slow.textContent='Perfekt langsam'}listen.insertBefore(button('🔊 Infinitiv','data-bunny-infinitive',verb,'btn secondary'),listen.firstChild);return}const pair=document.createElement('div');pair.className='bunny-audio-pair';pair.append(button('🔊 Infinitiv','data-bunny-infinitive',verb,'btn secondary'),button('🔊 Perfekt','data-bunny-perfect',verb,'btn secondary'));card.insertBefore(pair,card.querySelector('.question'))}
let scheduled=false;
function enhance(){if(!location.pathname.startsWith('/perfekt/'))return;enhanceOverview();enhanceCard();enhanceQuestion()}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
schedule();
const style=document.createElement('style');style.textContent='.bunny-audio-pair{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:0 0 16px}.overview-verb-text .audio-mini{margin-right:6px;margin-top:6px}.bunny-audio-playing{outline:3px solid #0b7590!important}.bunny-audio-error{margin-top:8px;color:#9b1c1c;font-weight:700;font-size:.92rem}';document.head.appendChild(style);
window.SPVerbBunnyAudio={forms:FORMS,infinitiveUrl,perfectUrl,playInfinitive:(verb,slow=false)=>play(infinitiveUrl(exactVerb(verb)),slow),playPerfect:(verb,slow=false)=>play(perfectUrl(exactVerb(verb)),slow)};
})();
