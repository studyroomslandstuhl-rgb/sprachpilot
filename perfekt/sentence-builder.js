(function(){
'use strict';
if(window.__SP_PERFEKT_SENTENCE_BUILDER_V1)return;
window.__SP_PERFEKT_SENTENCE_BUILDER_V1=true;

const E=window.VerbGroupsEngine;
if(!E)return;

const SPECIAL={
 'sein':'gewesen','haben':'gehabt','beginnen':'begonnen','bekommen':'bekommen','begraben':'begraben','werden':'geworden','tun':'getan','wissen':'gewusst','kommen':'gekommen','gehen':'gegangen','bringen':'gebracht','denken':'gedacht','schreiben':'geschrieben','verstehen':'verstanden','schwimmen':'geschwommen','gewinnen':'gewonnen','springen':'gesprungen','verlieren':'verloren','unterschreiben':'unterschrieben','trinken':'getrunken','beißen':'gebissen','gießen':'gegossen','reißen':'gerissen','genießen':'genossen','singen':'gesungen','schließen':'geschlossen','rennen':'gerannt','finden':'gefunden','wiederholen':'wiederholt','schneiden':'geschnitten','streiten':'gestritten','essen':'gegessen','sprechen':'gesprochen','fahren':'gefahren','schlafen':'geschlafen','sehen':'gesehen','lesen':'gelesen','rufen':'gerufen','schreien':'geschrien','schieben':'geschoben','ziehen':'gezogen','stehen':'gestanden','empfehlen':'empfohlen','geben':'gegeben','backen':'gebacken','reiten':'geritten','greifen':'gegriffen','kennen':'gekannt','befehlen':'befohlen','helfen':'geholfen','braten':'gebraten','waschen':'gewaschen','nehmen':'genommen','stehlen':'gestohlen','tragen':'getragen','brechen':'gebrochen','laufen':'gelaufen','vergessen':'vergessen','messen':'gemessen','fressen':'gefressen','graben':'gegraben','schlagen':'geschlagen','sterben':'gestorben','treffen':'getroffen','werfen':'geworfen','fangen':'gefangen','blasen':'geblasen','fallen':'gefallen','saufen':'gesoffen','halten':'gehalten','laden':'geladen','lassen':'gelassen','wachsen':'gewachsen','werben':'geworben','raten':'geraten','stechen':'gestochen','gefallen':'gefallen','bleiben':'geblieben','verbiegen':'verbogen','heißen':'geheißen','sitzen':'gesessen','liegen':'gelegen','hängen':'gehangen','können':'gekonnt','müssen':'gemusst','wollen':'gewollt','dürfen':'gedurft','sollen':'gesollt','möchten':'gemocht','mögen':'gemocht','biegen':'gebogen','lügen':'gelogen','versprechen':'versprochen','vergeben':'vergeben','verbringen':'verbracht','entscheiden':'entschieden','sich benehmen':'benommen','benehmen':'benommen','riechen':'gerochen','stinken':'gestunken','schweigen':'geschwiegen','steigen':'gestiegen','sinken':'gesunken',
 'aufräumen':'aufgeräumt','einkaufen':'eingekauft','anrufen':'angerufen','fernsehen':'ferngesehen','anfangen':'angefangen','aussterben':'ausgestorben','mitgeben':'mitgegeben','mitnehmen':'mitgenommen','aufstehen':'aufgestanden','anziehen':'angezogen','ausziehen':'ausgezogen','einsteigen':'eingestiegen','aussteigen':'ausgestiegen','umsteigen':'umgestiegen','ankommen':'angekommen','abfahren':'abgefahren','mitkommen':'mitgekommen','zurückkommen':'zurückgekommen','abbiegen':'abgebogen','ausleihen':'ausgeliehen','vorhaben':'vorgehabt','aufgeben':'aufgegeben','zusehen':'zugesehen','abschreiben':'abgeschrieben','vorlesen':'vorgelesen','verschlafen':'verschlafen','kennenlernen':'kennengelernt','einladen':'eingeladen','ausfallen':'ausgefallen','aufbacken':'aufgebacken','abraten':'abgeraten','beraten':'beraten','vorschlagen':'vorgeschlagen','losfahren':'losgefahren','dabeihaben':'dabeigehabt','leidtun':'leidgetan',
 'bieten':'geboten','bitten':'gebeten','nennen':'genannt','treiben':'getrieben','binden':'gebunden','brennen':'gebrannt','erschrecken':'erschrocken','fliehen':'geflohen','fließen':'geflossen','frieren':'gefroren','gelingen':'gelungen','gelten':'gegolten','geschehen':'geschehen','passieren':'passiert','gleichen':'geglichen','heben':'gehoben','klingen':'geklungen','leiden':'gelitten','leihen':'geliehen','meiden':'gemieden','reiben':'gerieben','schaffen':'geschaffen','scheiden':'geschieden','scheinen':'geschienen','schießen':'geschossen','schmeißen':'geschmissen','treten':'getreten','verzeihen':'verziehen','weisen':'gewiesen','hinweisen':'hingewiesen','auffallen':'aufgefallen','einfallen':'eingefallen','wiegen':'gewogen','zwingen':'gezwungen','hinzufügen':'hinzugefügt','spazieren gehen':'spazieren gegangen',
 'sich bewegen':'bewegt','sich konzentrieren':'konzentriert','sich kümmern':'gekümmert','sich interessieren':'interessiert','sich erinnern':'erinnert','sich anziehen':'angezogen','sich ausziehen':'ausgezogen','sich umziehen':'umgezogen','sich duschen':'geduscht','sich freuen':'gefreut','sich ärgern':'geärgert','sich beschweren':'beschwert','sich überlegen':'überlegt'
};
const SEP=new Set(['aufräumen','einkaufen','anrufen','fernsehen','anfangen','aussterben','aufmachen','zumachen','mitgeben','mitnehmen','aufstehen','anziehen','ausziehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','ausfüllen','anmelden','mitkommen','zurückkommen','abbiegen','abholen','ausleihen','vorhaben','aufgeben','zuhören','zusehen','abschreiben','vorlesen','ausfallen','aufbacken','austauschen','ablenken','absagen','abraten','vorschlagen','aussuchen','sich vorstellen','losfahren','dabeihaben','leidtun','kennenlernen','einladen','hinweisen','auffallen','einfallen','hinzufügen','sich anziehen','sich ausziehen','sich umziehen','spazieren gehen']);
const SEIN=new Set(['sein','werden','kommen','gehen','schwimmen','springen','reisen','fahren','laufen','reiten','rennen','sterben','fallen','wachsen','bleiben','aussterben','aufstehen','einsteigen','aussteigen','umsteigen','ankommen','abfahren','abbiegen','mitkommen','zurückkommen','ausfallen','steigen','sinken','wandern','losfahren','fliehen','fließen','gelingen','geschehen','passieren','auffallen','einfallen','erschrecken','spazieren gehen']);
const NO_GE=new Set(['unterschreiben','wiederholen','überqueren','sich überlegen']);
const INSEP=/^(be|emp|ent|er|ge|miss|ver|zer)/;
const SEPARABLE_PARTICIPLES={
 'aufräumen':'aufgeräumt','einkaufen':'eingekauft','anrufen':'angerufen','fernsehen':'ferngesehen','anfangen':'angefangen','aussterben':'ausgestorben','aufmachen':'aufgemacht','zumachen':'zugemacht','mitgeben':'mitgegeben','mitnehmen':'mitgenommen','aufstehen':'aufgestanden','anziehen':'angezogen','ausziehen':'ausgezogen','einsteigen':'eingestiegen','aussteigen':'ausgestiegen','umsteigen':'umgestiegen','ankommen':'angekommen','abfahren':'abgefahren','ausfüllen':'ausgefüllt','anmelden':'angemeldet','mitkommen':'mitgekommen','zurückkommen':'zurückgekommen','abbiegen':'abgebogen','abholen':'abgeholt','ausleihen':'ausgeliehen','vorhaben':'vorgehabt','aufgeben':'aufgegeben','zuhören':'zugehört','zusehen':'zugesehen','abschreiben':'abgeschrieben','vorlesen':'vorgelesen','ausfallen':'ausgefallen','aufbacken':'aufgebacken','austauschen':'ausgetauscht','ablenken':'abgelenkt','absagen':'abgesagt','abraten':'abgeraten','vorschlagen':'vorgeschlagen','aussuchen':'ausgesucht','vorstellen':'vorgestellt','losfahren':'losgefahren','dabeihaben':'dabeigehabt','leidtun':'leidgetan','kennenlernen':'kennengelernt','einladen':'eingeladen','hinweisen':'hingewiesen','auffallen':'aufgefallen','einfallen':'eingefallen','hinzufügen':'hinzugefügt','umziehen':'umgezogen','spazieren gehen':'spazieren gegangen'
};
const PREFIXES=['spazieren ','zurück','zusammen','dabei','kennen','hinzu','heraus','hinein','herüber','hinüber','weiter','wieder','vorbei','fest','statt','teil','fern','auf','aus','ein','an','ab','mit','vor','zu','um','los','hin','her','weg','über','unter','durch','leid'];
const HABEN=['habe','hast','hat','haben','habt','haben'];
const SEIN_FORMS=['bin','bist','ist','sind','seid','sind'];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const bare=v=>String(v||'').replace(/^sich\s+/,''),stem=v=>v.endsWith('en')?v.slice(0,-2):v.endsWith('n')?v.slice(0,-1):v;
function regularPart(v,withGe=true){const s=stem(v),e=/[td]$|chn$|ffn$|gn$|tm$/.test(s),part=s+(e?'et':'t');return(withGe?'ge':'')+part}
function basePart(v){if(SPECIAL[v])return SPECIAL[v];if(v.endsWith('ieren'))return regularPart(v,false);if(INSEP.test(v)||NO_GE.has(v)||/^(über|unter)/.test(v))return regularPart(v,false);return regularPart(v,true)}
function participle(v){if(SPECIAL[v])return SPECIAL[v];const b=bare(v);if(SPECIAL[b])return SPECIAL[b];if(SEPARABLE_PARTICIPLES[b])return SEPARABLE_PARTICIPLES[b];if(SEP.has(v)||SEP.has(b)||E.groupLabel?.(v)==='Trennbar'){const prefix=PREFIXES.find(p=>b.startsWith(p)&&b.length>p.length);if(prefix)return prefix+basePart(b.slice(prefix.length))}return basePart(b)}
function appAnswer(v){return`${SEIN.has(v)?'ist':'hat'} ${v.startsWith('sich ')?'sich ':''}${participle(v)}`}
function personAndFinite(v,sentence){
 const lower=norm(sentence);
 for(let pi=0;pi<6;pi++){
  const display=String(E.displayForm?.(v,pi)||'').trim();
  const finite=display.split(/\s+/)[0];if(!finite)continue;
  const rx=new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${finite.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Za-zÄÖÜäöüß]|$)`,'i');
  if(rx.test(sentence))return{pi,finite,display}
 }
 return null
}
function preserveCase(replacement,original){return /^[A-ZÄÖÜ]/.test(original)?replacement.charAt(0).toUpperCase()+replacement.slice(1):replacement}
function removeStandalone(text,word){if(!word)return text;const rx=new RegExp(`\\s+${word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}(?=\\s*[.!?;,]|$)`,'i');return text.replace(rx,'')}
function fullSentence(v){
 let source=String(E.sentence?.(v)||window.SP_VERB_SENTENCES?.[v]||window.VERB_SENTENCES?.[v]||'').trim();
 if(!source||/Ich lerne das Verb/i.test(source)||/Ich schreibe einen Satz/i.test(source))source='Ich mache das heute.';
 const found=personAndFinite(v,source),part=participle(v);
 if(!found){const aux=SEIN.has(v)?'bin':'habe',ref=v.startsWith('sich ')?' mich':'';return`Ich ${aux}${ref} gestern ${part}.`}
 const auxForms=SEIN.has(v)?SEIN_FORMS:HABEN,aux=auxForms[found.pi]||auxForms[0];
 const rx=new RegExp(found.finite.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i');
 const match=source.match(rx)?.[0]||found.finite;
 let out=source.replace(rx,preserveCase(aux,match));
 const bits=found.display.split(/\s+/);
 if(bits.length>1){const maybePrefix=bits[bits.length-1];if(SEP.has(v)||E.groupLabel?.(v)==='Trennbar')out=removeStandalone(out,maybePrefix)}
 const punct=(out.match(/[.!?]$/)||['.'])[0];out=out.replace(/[.!?]$/,'').trim();
 return`${out} ${part}${punct}`.replace(/\s+/g,' ')
}
function tokens(sentence){return sentence.match(/[A-Za-zÄÖÜäöüßÀ-ÿ0-9'-]+|[.,!?;:]/g)||[]}
function shuffled(items){const a=items.map((text,id)=>({text,id}));for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}if(a.length>2&&a.every((x,i)=>x.id===i)){[a[0],a[1]]=[a[1],a[0]]}return a}
function currentVerb(){
 const q=document.querySelector('.task-page .question');if(!q)return'';
 const m=(q.textContent||'').match(/\(([^()]+)\)\s*$/);return m?m[1].trim():''
}
function sameOrder(selected,target){return selected.length===target.length&&selected.every((x,i)=>x.text===target[i])}
function renderBuilder(){
 const heading=[...document.querySelectorAll('.task-page h2')].find(h=>/Satz im Perfekt/i.test(h.textContent||''));if(!heading)return;
 const card=document.querySelector('.task-page .question-card');if(!card||card.dataset.perfektBuilder==='1')return;
 const v=currentVerb();if(!v)return;
 const sentence=fullSentence(v),target=tokens(sentence),pool=shuffled(target),answer=appAnswer(v);
 card.dataset.perfektBuilder='1';card.dataset.tries='0';
 card.innerHTML=`<div class="sp-perfekt-builder"><div class="sp-builder-instruction">Bringe die Wörter in die richtige Reihenfolge.</div><div class="sp-builder-help"><button type="button" class="btn secondary" data-action="audio" data-text="${esc(sentence)}">🔊 Satz hören</button><span>Hilfe</span></div><div class="sp-builder-target" id="spPerfektTarget"><span>Baue den Satz.</span></div><div class="sp-builder-pool" id="spPerfektPool"></div><button type="button" class="btn sp-builder-check" id="spPerfektCheck">Kontrollieren</button><input id="answerInput" type="hidden"><button type="button" data-action="check-input" id="spPerfektNativeCheck" hidden></button><div id="feedback"></div></div>`;
 const targetBox=card.querySelector('#spPerfektTarget'),poolBox=card.querySelector('#spPerfektPool'),selected=[];
 function paint(){
  targetBox.innerHTML=selected.length?selected.map(item=>`<button type="button" class="sp-word-chip selected" data-selected-id="${item.id}">${esc(item.text)}</button>`).join(''):'<span>Baue den Satz.</span>';
  poolBox.innerHTML=pool.filter(item=>!selected.some(s=>s.id===item.id)).map(item=>`<button type="button" class="sp-word-chip" data-pool-id="${item.id}">${esc(item.text)}</button>`).join('')
 }
 poolBox.addEventListener('click',e=>{const b=e.target.closest('[data-pool-id]');if(!b)return;const item=pool.find(x=>x.id===Number(b.dataset.poolId));if(item){selected.push(item);paint()}});
 targetBox.addEventListener('click',e=>{const b=e.target.closest('[data-selected-id]');if(!b)return;const ix=selected.findIndex(x=>x.id===Number(b.dataset.selectedId));if(ix>=0){selected.splice(ix,1);paint()}});
 card.querySelector('#spPerfektCheck').addEventListener('click',()=>{
  if(sameOrder(selected,target)){
   card.querySelector('#answerInput').value=answer;
   card.querySelector('#spPerfektNativeCheck').click();
   return
  }
  const tries=Number(card.dataset.tries||0)+1;card.dataset.tries=String(tries);
  card.querySelector('#answerInput').value='__falsch__';card.querySelector('#spPerfektNativeCheck').click();
  const fb=card.querySelector('#feedback');if(fb){fb.className='feedback no';fb.innerHTML=tries>=3?`Lösung: <strong>${esc(sentence)}</strong>`:tries===2?'Noch nicht richtig. Achte auf die Position von Hilfsverb und Partizip II.':'Noch nicht richtig.'}
 });
 paint()
}

const style=document.createElement('style');style.textContent=`
.sp-perfekt-builder{display:grid;gap:20px}.sp-builder-instruction{text-align:center;font-size:clamp(25px,5vw,38px);font-weight:900;line-height:1.08;color:#17324a}.sp-builder-help{display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap}.sp-builder-help span{color:#718096;font-size:18px}.sp-builder-target,.sp-builder-pool{min-height:112px;border:3px solid #c8edf4;border-radius:24px;background:#f8fcfd;padding:18px;display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap}.sp-builder-target>span{color:#718096;font-size:22px}.sp-builder-pool{min-height:132px;background:#fff}.sp-word-chip{appearance:none;border:3px solid #c6e9f0;border-radius:18px;background:#fff;color:#17324a;padding:12px 16px;font:inherit;font-size:22px;font-weight:800;line-height:1.1}.sp-word-chip.selected{background:#eefafd;border-color:#7fcddd}.sp-builder-check{justify-self:center;width:min(100%,360px);font-size:22px}.sp-perfekt-builder .feedback{margin-top:0}@media(max-width:520px){.sp-perfekt-builder{gap:14px}.sp-builder-instruction{font-size:28px}.sp-builder-target,.sp-builder-pool{min-height:92px;padding:14px;border-radius:20px}.sp-word-chip{font-size:19px;padding:10px 13px;border-width:2px}.sp-builder-help .btn{padding:11px 16px}.sp-builder-help span{font-size:16px}}
`;document.head.appendChild(style);
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderBuilder()})};
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('popstate',schedule);schedule();
window.SPPerfektSentenceBuilder={fullSentence,appAnswer};
})();