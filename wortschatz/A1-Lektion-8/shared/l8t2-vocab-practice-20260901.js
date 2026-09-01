(function(){
'use strict';
if(window.__SP_L8T2_VOCAB_PRACTICE_20260901)return;
window.__SP_L8T2_VOCAB_PRACTICE_20260901=true;

const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const img=item=>String(item?.image||item?.img||'').trim();
const audio=item=>String(item?.audioFile||item?.audio||'').trim();
const hasMeaning=item=>{
 const bags=[item?.translations,item?.tr,item?.translation,item?.i18n];
 return bags.some(x=>typeof x==='string'?x.trim():x&&typeof x==='object'&&Object.values(x).some(v=>typeof v==='string'&&v.trim()));
};
const cloneCard=item=>({
 term:term(item),
 image:img(item),
 audio:audio(item),
 audioFile:audio(item),
 translations:item?.translations&&typeof item.translations==='object'?{...item.translations}:item?.translations,
 tr:item?.tr&&typeof item.tr==='object'?{...item.tr}:item?.tr,
 translation:item?.translation&&typeof item.translation==='object'?{...item.translation}:item?.translation,
 i18n:item?.i18n&&typeof item.i18n==='object'?{...item.i18n}:item?.i18n
});

const PRIORITY=[
 'die bewerbung','das praktikum','die abteilung','der leiter','die leiterin','die wirtschaft','das diplom','das buro','die information','der gruss','die anrede','die stelle','die ausbildung','die berufserfahrung','der arbeitgeber','die arbeitgeberin','die firma','der lebenslauf','das anschreiben','das bewerbungsfoto','das bewerbungsgesprach','der berufliche werdegang','das zeugnis','der abschluss','die berufsschule','das studium','dauern hat gedauert','heiraten hat geheiratet','zeigen hat gezeigt','zur verfugung stehen','gerade','spater','eigentlich'
];
const rank=item=>{const n=norm(term(item));const i=PRIORITY.findIndex(x=>n===x||n.startsWith(x+' '));return i<0?999:i};
function candidates(theme){
 const cards=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
 const raw=(cards?.items||[]).filter(x=>term(x)&&img(x)&&audio(x));
 const seen=new Set();
 return raw.filter(x=>{const k=norm(term(x));if(!k||seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>rank(a)-rank(b));
}
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
 const selected=pool.filter(hasMeaning).slice(0,Math.min(10,pool.filter(hasMeaning).length));
 return {
  id:'wortschatz-memory-bedeutung',
  title:'Wortschatz-Memory',
  instruction:'Finde die Paare: Wort und Bedeutung.',
  kind:'vocab-memory',icon:'🧠',emoji:'🧠',
  items:[{type:'vocab-memory',pairs:selected.map(cloneCard)}]
 };
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 theme.tasks=theme.tasks.filter(t=>!['wortschatz-hoeren-bild','wortschatz-memory-bedeutung'].includes(String(t?.id||'')));
 const pool=candidates(theme);
 if(pool.length<4)return theme;
 const listening=buildListening(pool),memory=buildMemory(pool);
 const insert=[listening];if(memory.items[0].pairs.length>=4)insert.push(memory);
 const examAt=theme.tasks.findIndex(t=>t?.exam);
 if(examAt>=0)theme.tasks.splice(examAt,0,...insert);else theme.tasks.push(...insert);
 theme.contentRevision='l8t2-vocab-practice-20260901-v1';
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