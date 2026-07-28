import{requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout}from'/js/auth.js?v=login-main-4';
import{loadCourseRelease,moduleOpen,releasedVerbs}from'/js/course-releases.js?v=verb-groups-2';

const RELEASE='20260728a';
const sourceUrl=new URL(`./app-stable.js?release=${RELEASE}`,import.meta.url);
let source=await fetch(sourceUrl,{cache:'no-store'}).then(response=>{
 if(!response.ok)throw new Error(`Perfekt-Quelldatei konnte nicht geladen werden: ${response.status}`);
 return response.text();
});

source=source.replace(/^import\{[^;]+\};\s*import\{[^;]+\};\s*/, '');
source=source.replaceAll("'schaffen':'geschafft'","'schaffen':'geschaffen'");
source=source.replaceAll("['schaffen','trennen'","['trennen'");
source=source.replace("'ankommen','abfahren','mitkommen'","'ankommen','abfahren','abbiegen','mitkommen'");

const oldParticiple="function participle(v){if(SPECIAL[v])return SPECIAL[v];const b=bare(v);if(SPECIAL[b])return SPECIAL[b];if(b.endsWith('ieren'))return regularPart(b,false);if(INSEP.test(b)||NO_GE.has(v)||NO_GE.has(b)||/^(über|unter)/.test(b))return regularPart(b,false);return regularPart(b,true)}";
const newParticiple=`const SEPARABLE_PARTICIPLES={
 'aufräumen':'aufgeräumt','einkaufen':'eingekauft','anrufen':'angerufen','fernsehen':'ferngesehen','anfangen':'angefangen',
 'aussterben':'ausgestorben','aufmachen':'aufgemacht','zumachen':'zugemacht','mitgeben':'mitgegeben','mitnehmen':'mitgenommen',
 'aufstehen':'aufgestanden','anziehen':'angezogen','ausziehen':'ausgezogen','einsteigen':'eingestiegen','aussteigen':'ausgestiegen',
 'umsteigen':'umgestiegen','ankommen':'angekommen','abfahren':'abgefahren','ausfüllen':'ausgefüllt','anmelden':'angemeldet',
 'mitkommen':'mitgekommen','zurückkommen':'zurückgekommen','abbiegen':'abgebogen','abholen':'abgeholt','ausleihen':'ausgeliehen',
 'vorhaben':'vorgehabt','aufgeben':'aufgegeben','zuhören':'zugehört','zusehen':'zugesehen','abschreiben':'abgeschrieben',
 'vorlesen':'vorgelesen','ausfallen':'ausgefallen','aufbacken':'aufgebacken','austauschen':'ausgetauscht','ablenken':'abgelenkt',
 'absagen':'abgesagt','abraten':'abgeraten','vorschlagen':'vorgeschlagen','aussuchen':'ausgesucht','vorstellen':'vorgestellt',
 'losfahren':'losgefahren','dabeihaben':'dabeigehabt','leidtun':'leidgetan','kennenlernen':'kennengelernt','einladen':'eingeladen',
 'hinweisen':'hingewiesen','auffallen':'aufgefallen','einfallen':'eingefallen','hinzufügen':'hinzugefügt','umziehen':'umgezogen',
 'spazieren gehen':'spazieren gegangen'
};
const SEPARABLE_PREFIXES=['spazieren ','zurück','zusammen','dabei','kennen','hinzu','heraus','hinein','herüber','hinüber','weiter','wieder','vorbei','fest','statt','teil','fern','auf','aus','ein','an','ab','mit','vor','zu','um','los','hin','her','weg','über','unter','durch','leid'];
function baseParticiple(v){if(SPECIAL[v])return SPECIAL[v];if(v.endsWith('ieren'))return regularPart(v,false);if(INSEP.test(v)||NO_GE.has(v)||/^(über|unter)/.test(v))return regularPart(v,false);return regularPart(v,true)}
function participle(v){
 if(SPECIAL[v])return SPECIAL[v];
 const b=bare(v);
 if(SPECIAL[b])return SPECIAL[b];
 if(SEPARABLE_PARTICIPLES[b])return SEPARABLE_PARTICIPLES[b];
 const label=BASE?.groupLabel?.(v)||BASE?.groupLabel?.(b);
 if(SEP.has(v)||SEP.has(b)||label==='Trennbar'){
  const prefix=SEPARABLE_PREFIXES.find(part=>b.startsWith(part)&&b.length>part.length);
  if(prefix)return prefix+baseParticiple(b.slice(prefix.length))
 }
 return baseParticiple(b)
}`;
if(!source.includes('const SEPARABLE_PARTICIPLES='))source=source.replace(oldParticiple,newParticiple);

source=source.replace("const CATEGORY_ORDER=[['reflexive','Reflexive Verben'],['separable','Trennbare Verben'],['strong','Starke / unregelmäßige Verben'],['ieren','Verben auf -ieren'],['inseparable','Nicht trennbare Verben'],['weak','Regelmäßige Verben']];","const CATEGORY_ORDER=[];");
const oldGroups="function category(v){if(v.startsWith('sich '))return'reflexive';const label=BASE?.groupLabel?.(v);if(SEP.has(v)||label==='Trennbar')return'separable';if(bare(v).endsWith('ieren')&&v!=='verlieren')return'ieren';if(label==='Unregelmäßig'||SPECIAL[v]&&['trennen','teilen','schauen','senden','passieren'].indexOf(v)<0)return'strong';if(INSEP.test(bare(v))||NO_GE.has(v))return'inseparable';return'weak'}\nfunction rebuildGroups(){GROUPS=[];let id=1;for(const [key,title]of CATEGORY_ORDER){const list=VERBS.filter(v=>category(v)===key);for(let i=0;i<list.length;i+=20)GROUPS.push({id:id++,category:key,title,verbs:list.slice(i,i+20),signature:key+'|'+list.slice(i,i+20).join('|')})}}";
const newGroups=`function category(v){
 const b=bare(v),label=BASE?.groupLabel?.(v);
 if(SEP.has(v)||SEP.has(b)||label==='Trennbar')return'separable';
 if((b.endsWith('ieren')&&b!=='verlieren')||INSEP.test(b)||NO_GE.has(v)||NO_GE.has(b))return'middle';
 if(label==='Unregelmäßig'||SPECIAL[v]&&['trennen','teilen','schauen','senden','passieren'].indexOf(v)<0||SPECIAL[b]&&['trennen','teilen','schauen','senden','passieren'].indexOf(b)<0)return'strong';
 return'regular'
}
function perfektBuckets(){
 const buckets={regular:[],strong:[],middle:[],separable:[]};
 for(const v of VERBS)buckets[category(v)].push(v);
 return buckets
}
function orderedPerfektVerbs(){
 const buckets=perfektBuckets();
 return buckets.regular.concat(buckets.strong,buckets.middle,buckets.separable)
}
function rebuildGroups(){
 GROUPS=[];
 const buckets=perfektBuckets();
 const titles={regular:'Regelmäßige Verben',strong:'Starke / unregelmäßige Verben',middle:'Nicht trennbare Verben / Verben auf -ieren',separable:'Trennbare Verben'};
 for(const key of ['regular','strong','middle','separable']){
  const list=buckets[key];
  for(let i=0;i<list.length;i+=20){
   const verbs=list.slice(i,i+20),number=GROUPS.length+1;
   GROUPS.push({id:number,category:key,title:titles[key],verbs,signature:key+'|'+verbs.join('|')})
  }
 }
}`;
if(!source.includes('function perfektBuckets()'))source=source.replace(oldGroups,newGroups);

const oldSpeak="function speak(text,slow=false){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=slow?.55:.92;speechSynthesis.speak(u)}";
const newSpeak=`const RECORDED_AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
const RECORDED_AUDIO_SPECIAL={'hat gefallen':'hat_gefallen.mp3','ist gefallen':'ist_gefallen.mp3','hat vergessen':'hat_vergessen.mp3'};
let recordedAudio=null;
const recordedSlug=value=>String(value||'').toLowerCase().trim().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
function speak(text,slow=false){
 const raw=String(text||'').trim(),key=norm(raw);
 let file=RECORDED_AUDIO_SPECIAL[key];
 if(!file){
  const verb=VERBS.find(item=>norm(perfect(item))===key);
  const spoken=verb?participle(verb):raw.replace(/^(hat|ist)\\s+(sich\\s+)?/i,'');
  file=recordedSlug(spoken)+'.mp3'
 }
 if(!file||file==='.mp3')return;
 try{recordedAudio?.pause()}catch{}
 const audio=new Audio(RECORDED_AUDIO_BASE+encodeURIComponent(file));
 recordedAudio=audio;
 audio.preload='auto';
 audio.playbackRate=slow?0.75:1;
 audio.onerror=()=>{const target=document.querySelector('#feedback,.question-card,.task-page');if(target){let box=target.querySelector('.recorded-audio-error');if(!box){box=document.createElement('div');box.className='feedback no recorded-audio-error';box.textContent='Die Audiodatei konnte nicht geladen werden.';target.appendChild(box)}}};
 audio.play().catch(()=>audio.onerror?.())
}`;
source=source.replace(oldSpeak,newSpeak);

const execute=new Function('requireLogin','getActiveProfile','getActiveRole','dashboardHref','logout','loadCourseRelease','moduleOpen','releasedVerbs',`${source}\n//# sourceURL=perfekt-app-release-${RELEASE}.js`);
execute(requireLogin,getActiveProfile,getActiveRole,dashboardHref,logout,loadCourseRelease,moduleOpen,releasedVerbs);

document.documentElement.dataset.perfektRelease=RELEASE;
const AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';
let extraAudio=null;
const infSlug=value=>String(value||'').toLowerCase().trim().replace(/^sich\s+/,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
function playInfinitive(value){
 const file=infSlug(value)+'.mp3';
 if(file==='.mp3')return;
 try{extraAudio?.pause()}catch{}
 extraAudio=new Audio(AUDIO_BASE+encodeURIComponent(file));
 extraAudio.preload='auto';
 extraAudio.play().catch(()=>{})
}
function enhanceAudioButtons(){
 document.querySelectorAll('.overview-verb-card').forEach(card=>{
  const verb=card.querySelector('h3')?.textContent?.trim(),old=card.querySelector('.audio-mini');
  if(!verb||!old||card.querySelector('[data-recorded-infinitive]'))return;
  old.textContent='🔊 Perfekt';
  const button=document.createElement('button');button.type='button';button.className='audio-mini';button.dataset.recordedInfinitive=verb;button.textContent='🔊 Infinitiv';old.parentNode.insertBefore(button,old)
 });
 const cardButton=document.querySelector('#cardListenBtn'),verb=document.querySelector('.card-translation b')?.textContent?.trim();
 if(cardButton&&verb&&!document.querySelector('#cardInfinitiveBtn')){
  cardButton.textContent='🔊 Perfekt';
  const button=document.createElement('button');button.type='button';button.id='cardInfinitiveBtn';button.className='btn secondary';button.dataset.recordedInfinitive=verb;button.textContent='🔊 Infinitiv';cardButton.parentNode.insertBefore(button,cardButton)
 }
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-recorded-infinitive]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();playInfinitive(button.dataset.recordedInfinitive||'')},true);
new MutationObserver(enhanceAudioButtons).observe(document.documentElement,{childList:true,subtree:true});
enhanceAudioButtons();
