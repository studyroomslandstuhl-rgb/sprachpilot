(function(){
'use strict';
if(window.__SP_L8T2_VOCAB_PRACTICE_LIGHT_20260902_V3)return;
window.__SP_L8T2_VOCAB_PRACTICE_LIGHT_20260902_V3=true;

const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const slug=v=>String(v||'').split('–')[0].trim().replace(/^(der|die|das)\s+/i,'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const IMAGE_SPECIAL={'spater':'spaet.webp','erfahrung':'erfahrung.webp','kollegin':'kollegin.webp','spass haben':'spass.webp'};
const imageFor=item=>{const raw=String(item?.image||item?.img||'').trim();if(raw)return raw;const special=IMAGE_SPECIAL[norm(term(item)).replace(/^(der|die|das)\s+/,'')];if(special)return CDN+special;const s=slug(term(item));return s?CDN+s+'.webp':''};
const audioFor=item=>{const raw=String(item?.audioFile||item?.audio||'').trim();if(raw)return raw;const s=slug(term(item));return s?AUDIO+s+'.mp3':''};
const cloneCard=item=>({term:term(item),image:imageFor(item),audio:audioFor(item),audioFile:audioFor(item)});
function cardTask(theme){return (theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function sourceItems(theme){
 const overview=Array.isArray(theme?.vocabularyOverviewItems)&&theme.vocabularyOverviewItems.length?theme.vocabularyOverviewItems:null;
 return overview||(cardTask(theme)?.items||[]);
}
function pool(theme){
 const out=[],seen=new Set();
 for(const item of sourceItems(theme)){const k=norm(term(item));if(!k||seen.has(k))continue;const card=cloneCard(item);if(!card.image)continue;seen.add(k);out.push(card)}
 return out;
}
function listeningPool(theme){return pool(theme).filter(x=>x.audioFile||x.audio)}
function optionSet(items,index){const target=items[index],out=[target];for(const off of [5,11,3,7,13,17]){if(out.length>=4)break;const c=items[(index+off)%items.length];if(c&&!out.some(x=>norm(x.term)===norm(c.term)))out.push(c)}for(const c of items){if(out.length>=4)break;if(!out.some(x=>norm(x.term)===norm(c.term)))out.push(c)}return out.map(cloneCard)}
function buildListening(items){const selected=items.slice(0,Math.min(20,items.length));return{id:'wortschatz-hoeren-bild',title:'Wortschatz hören',instruction:'Höre das Wort und wähle das passende Bild.',kind:'vocab-listen-image',icon:'👂',emoji:'👂',items:selected.map((card,i)=>({type:'vocab-listen-image',term:card.term,audio:card.audioFile||card.audio,audioFile:card.audioFile||card.audio,answer:card.term,options:optionSet(items,i)}))}}
function buildMemory(items){return{id:'wortschatz-memory-bild-wort-v2',title:'Wortschatz-Memory',instruction:'Finde die Paare: Bild und Wort.',kind:'vocab-memory-v2',icon:'🧠',emoji:'🧠',items:items.slice(0,20).map(card=>({type:'vocab-memory-pair',...cloneCard(card)}))}}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const removeIds=new Set(['wortschatz-hoeren-bild','wortschatz-memory-bedeutung','wortschatz-memory-bild-wort','wortschatz-memory-bild-wort-v2']);
 theme.tasks=theme.tasks.filter(t=>!removeIds.has(String(t?.id||'')));
 const memPool=pool(theme),listenPool=listeningPool(theme);
 const cardsIndex=theme.tasks.findIndex(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
 const insertAt=cardsIndex>=0?cardsIndex+1:0,insert=[];
 if(memPool.length>=2)insert.push(buildMemory(memPool));
 if(listenPool.length>=4)insert.push(buildListening(listenPool));
 if(insert.length)theme.tasks.splice(insertAt,0,...insert);
 theme.contentRevision='l8t2-vocab-practice-overview-only-20260902-v3';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_VOCAB_PRACTICE_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);apply(theme);if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;return themes});
window.L8_CONTENT_READY=window.L8_T2_VOCAB_PRACTICE_READY;
window.L8T2VocabPractice={apply,version:3};
})();
