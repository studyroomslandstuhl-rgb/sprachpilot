(function(){
'use strict';
if(window.__SP_L8T2_VOCAB_FINAL_20260831)return;window.__SP_L8T2_VOCAB_FINAL_20260831=true;
window.L8_T2_VOCAB_FINAL_PENDING=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const DATA={
 dauern:{term:'dauern – hat gedauert',answer:'dauern',type:'verb',stem:'dauern',tr:{en:'to last / take time',ru:'длиться',tr:'sürmek',uk:'тривати',ar:'يستغرق',ja:'かかる / 続く',ro:'a dura',pl:'trwać',ku:'dom kirin',fa:'طول کشیدن',fr:'durer',es:'durar',it:'durare'}},
 heiraten:{term:'heiraten – hat geheiratet',answer:'heiraten',type:'verb',stem:'heiraten',tr:{en:'to marry / get married',ru:'жениться / выходить замуж',tr:'evlenmek',uk:'одружуватися',ar:'يتزوج',ja:'結婚する',ro:'a se căsători',pl:'brać ślub',ku:'zewicîn',fa:'ازدواج کردن',fr:'se marier',es:'casarse',it:'sposarsi'}},
 zeigen:{term:'zeigen – hat gezeigt',answer:'zeigen',type:'verb',stem:'zeigen',tr:{en:'to show',ru:'показывать',tr:'göstermek',uk:'показувати',ar:'يُري',ja:'見せる',ro:'a arăta',pl:'pokazywać',ku:'nîşan dan',fa:'نشان دادن',fr:'montrer',es:'mostrar',it:'mostrare'}},
 stehen:{term:'zur Verfügung stehen',answer:'zur Verfügung stehen',type:'phrase',stem:'zur_verfuegung_stehen',tr:{en:'to be available / at someone’s disposal',ru:'быть в распоряжении / быть доступным',tr:'hazır bulunmak / kullanımda olmak',uk:'бути в розпорядженні / бути доступним',ar:'يكون متاحًا / يكون تحت التصرّف',ja:'利用できる / 用意されている',ro:'a fi la dispoziție / a fi disponibil',pl:'być do dyspozycji / być dostępny',ku:'berdest bûn',fa:'در دسترس بودن',fr:'être à disposition / être disponible',es:'estar a disposición / estar disponible',it:'essere a disposizione / essere disponibile'}}
};
const ANREDE={term:'die Anrede',type:'noun',plural:'die Anreden',image:CDN+'anrede.webp',audio:AUDIO+'anrede.mp3',audioFile:AUDIO+'anrede.mp3',translations:{en:'form of address / salutation',ru:'обращение',tr:'hitap',uk:'звертання',ar:'صيغة المخاطبة / التحية',ja:'呼びかけ / 敬称',ro:'formulă de adresare',pl:'forma zwrotu / zwrot grzecznościowy',ku:'bangkirin / awayê axaftin',fa:'خطاب / شیوه خطاب',fr:'formule d’adresse',es:'tratamiento / fórmula de saludo',it:'formula di apertura / appellativo'},tr:{en:'form of address / salutation',ru:'обращение',tr:'hitap',uk:'звертання',ar:'صيغة المخاطبة / التحية',ja:'呼びかけ / 敬称',ro:'formulă de adresare',pl:'forma zwrotu / zwrot grzecznościowy',ku:'bangkirin / awayê axaftin',fa:'خطاب / شیوه خطاب',fr:'formule d’adresse',es:'tratamiento / fórmula de saludo',it:'formula di apertura / appellativo'}};
const SIMPLE={
 gerade:{term:'gerade',type:'adverb',stem:'gerade'},
 spater:{term:'später',type:'adverb',stem:'spaeter'},
 eigentlich:{term:'eigentlich',type:'adverb',stem:'eigentlich'}
};
function keyFor(item){
 const n=norm(term(item));
 if(!n)return'';
 if(n==='zur verfugung stellen'||n==='zur verfuegung stellen')return'remove';
 if(n==='zur verfugung stehen'||n==='zur verfuegung stehen')return'stehen';
 if(n==='dauern'||n==='hat gedauert'||n==='dauern hat gedauert'||n==='hat gedauert dauern')return'dauern';
 if(n==='heiraten'||n==='hat geheiratet'||n==='heiraten hat geheiratet'||n==='hat geheiratet heiraten')return'heiraten';
 if(n==='zeigen'||n==='hat gezeigt'||n==='zeigen hat gezeigt'||n==='hat gezeigt zeigen')return'zeigen';
 return'';
}
function canonical(key,base={}){
 const d=DATA[key];
 const oldAnswers=Array.isArray(base.answers)?base.answers:[],oldAccepted=Array.isArray(base.accepted)?base.accepted:[];
 const item={...base,term:d.term,type:d.type,answers:[...new Set([d.answer,...oldAnswers])],accepted:[...new Set([d.answer,...oldAccepted])]};
 delete item.full;delete item.word;delete item.detail;
 item.image=CDN+d.stem+'.webp';item.audio=AUDIO+d.stem+'.mp3';item.audioFile=AUDIO+d.stem+'.mp3';
 item.translations={...(base.translations&&typeof base.translations==='object'?base.translations:{}),...d.tr};
 item.tr={...(base.tr&&typeof base.tr==='object'?base.tr:{}),...d.tr};
 return item;
}
function fixSimple(item){
 const n=norm(term(item)),d=SIMPLE[n];if(!d)return item;
 item.term=d.term;item.type=d.type;item.image=CDN+d.stem+'.webp';item.audio=AUDIO+d.stem+'.mp3';item.audioFile=AUDIO+d.stem+'.mp3';return item;
}
function ensureSimple(list,key){
 const d=SIMPLE[key],found=list.find(x=>norm(term(x))===key);if(found){fixSimple(found);return}
 list.push({term:d.term,type:d.type,image:CDN+d.stem+'.webp',audio:AUDIO+d.stem+'.mp3',audioFile:AUDIO+d.stem+'.mp3'});
}
function ensureAnrede(list){
 const items=Array.isArray(list)?list:[];
 const found=items.find(x=>norm(term(x))==='die anrede'||norm(term(x))==='anrede');
 if(found){Object.assign(found,{...ANREDE,translations:{...ANREDE.translations},tr:{...ANREDE.tr}});return items}
 const entry={...ANREDE,translations:{...ANREDE.translations},tr:{...ANREDE.tr}};
 const grussIndex=items.findIndex(x=>/^(der )?gru(ss|ß)$/i.test(term(x)));
 if(grussIndex>=0)items.splice(grussIndex+1,0,entry);else items.push(entry);
 return items;
}
function cleanList(list,ensure=false){
 const out=[],seen=new Set();
 for(const original of Array.isArray(list)?list:[]){
  const key=keyFor(original);
  if(key==='remove')continue;
  if(key&&DATA[key]){if(seen.has(key))continue;seen.add(key);out.push(canonical(key,original));continue}
  out.push(fixSimple(original));
 }
 if(ensure){for(const key of ['dauern','heiraten','zeigen','stehen'])if(!seen.has(key))out.push(canonical(key));for(const key of ['gerade','spater','eigentlich'])ensureSimple(out,key);ensureAnrede(out)}
 return out;
}
window.L8_T2_VOCAB_FINAL_READY=Promise.resolve(window.L8_T2_MEDIA_FIXES_READY||window.L8_T2_EXTRA_TRANSLATIONS_READY||window.L8_T2_VOCAB_READY||window.L8_T2_TRANSLATIONS_READY||window.L8_T2_CURRENT_READY||window.L8_CONTENT_READY).then(()=>{
 const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];if(!theme)return theme;
 theme.number=2;
 const cards=(theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));
 if(cards)cards.items=cleanList(cards.items,true);
 if(Array.isArray(theme.overviewOnlyItems))theme.overviewOnlyItems=cleanList(theme.overviewOnlyItems,false);
 if(Number(document.body?.dataset?.theme)===2)window.L8_THEME=theme;
 window.L8_T2_VOCAB_FINAL_PENDING=false;return theme;
}).catch(error=>{window.L8_T2_VOCAB_FINAL_PENDING=false;console.error('L8T2 finale Wortschatzkorrektur',error);throw error});
})();