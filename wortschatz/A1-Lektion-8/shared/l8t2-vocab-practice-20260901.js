(function(){
'use strict';
if(window.__SP_L8T2_VOCAB_PRACTICE_20260901)return;
window.__SP_L8T2_VOCAB_PRACTICE_20260901=true;

const CDN='https://sprachpilot.b-cdn.net/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const slug=v=>String(v||'').split('–')[0].trim().replace(/^(der|die|das)\s+/i,'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const IMAGE_SPECIAL={'spater':'spaet.webp','erfahrung':'erfahrung.webp','kollegin':'kollegin.webp','spass haben':'spass.webp'};
const imageFor=item=>{
 const raw=String(item?.image||item?.img||'').trim();
 if(raw)return raw;
 const special=IMAGE_SPECIAL[norm(term(item)).replace(/^(der|die|das)\s+/,'')];
 if(special)return CDN+special;
 const s=slug(term(item));return s?CDN+s+'.webp':'';
};
const audio=item=>String(item?.audioFile||item?.audio||'').trim();
const cloneCard=item=>({term:term(item),image:imageFor(item),audio:audio(item),audioFile:audio(item)});

const PRIORITY=[
 'die bewerbung','das praktikum','die abteilung','der leiter','die leiterin','die wirtschaft','das diplom','das buro','die information','der gruss','die anrede','die stelle','die ausbildung','die berufserfahrung','der arbeitgeber','die arbeitgeberin','die firma','der lebenslauf','das anschreiben','das bewerbungsfoto','das bewerbungsgesprach','der berufliche werdegang','das zeugnis','der abschluss','die berufsschule','das studium','dauern hat gedauert','heiraten hat geheiratet','zeigen hat gezeigt','zur verfugung stehen','gerade','spater','eigentlich'
];
const rank=item=>{const n=norm(term(item));const i=PRIORITY.findIndex(x=>n===x||n.startsWith(x+' '));return i<0?999:i};
function cardTask(theme){return (theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function uniqueCards(items,requireAudio=false){
 const seen=new Set();
 return (items||[]).filter(x=>{
  const k=norm(term(x));
  if(!k||!imageFor(x)||(requireAudio&&!audio(x))||seen.has(k))return false;
  seen.add(k);return true;
 }).sort((a,b)=>rank(a)-rank(b));
}
function memoryPool(theme){return uniqueCards(cardTask(theme)?.items||[],false)}
function listeningPool(theme){return uniqueCards(cardTask(theme)?.items||[],true)}
function optionSet(pool,index){
 const target=pool[index],out=[target];
 const offsets=[5,11,17,23,3,7,13,19];
 for(const off of offsets){
  if(out.length>=4)break;
  const c=pool[(index+off)%pool.length];
  if(c&&!out.some(x=>norm(term(x))===norm(term(c))))out.push(c);
 }
 for(const c of pool){if(out.length>=4)break;if(!out.some(x=>norm(term(x))===norm(term(c))))out.push(c)}
 return out.map(cloneCard);
}
function buildListening(pool){
 const selected=pool.slice(0,Math.min(20,pool.length));
 return {
  id:'wortschatz-hoeren-bild',
  title:'Wortschatz hören',
  instruction:'Höre das Wort und wähle das passende Bild.',
  kind:'vocab-listen-image',icon:'🎧',emoji:'🎧',
  items:selected.map((card,i)=>({type:'vocab-listen-image',term:term(card),audio:audio(card),audioFile:audio(card),answer:term(card),options:optionSet(pool,i)}))
 };
}
function buildMemory(pool){
 return {
  id:'wortschatz-memory-bild-wort',
  title:'Wortschatz-Memory',
  instruction:'Finde die Paare: Bild und Wort.',
  kind:'vocab-memory',icon:'🧠',emoji:'🧠',
  items:[{type:'vocab-memory',pairs:pool.map(cloneCard)}]
 };
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const removeIds=new Set(['wortschatz-hoeren-bild','wortschatz-memory-bedeutung','wortschatz-memory-bild-wort']);
 theme.tasks=theme.tasks.filter(t=>!removeIds.has(String(t?.id||'')));
 const memPool=memoryPool(theme),listenPool=listeningPool(theme);
 if(memPool.length>=2){
  const memory=buildMemory(memPool);
  const cardsIndex=theme.tasks.findIndex(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
  const insertAt=cardsIndex>=0?cardsIndex+1:0;
  theme.tasks.splice(insertAt,0,memory);
 }
 if(listenPool.length>=4){
  const listening=buildListening(listenPool);
  const examAt=theme.tasks.findIndex(t=>t?.exam);
  if(examAt>=0)theme.tasks.splice(examAt,0,listening);else theme.tasks.push(listening);
 }
 theme.contentRevision='l8t2-vocab-practice-20260901-v3';
 return theme;
}

window.L8_T2_VOCAB_PRACTICE_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_VOCAB_PRACTICE_READY;
window.L8T2VocabPractice={apply};
})();