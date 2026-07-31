(function(){
'use strict';
if(window.L7TranslationStandard)return;

const LANGS=[
 ['en','Englisch',['en','english','englisch']],
 ['ru','Russisch',['ru','russian','russisch']],
 ['tr','Türkisch',['tr','turkish','türkisch','tuerkisch']],
 ['uk','Ukrainisch',['uk','ua','ukrainian','ukrainisch']],
 ['ar','Arabisch',['ar','arabic','arabisch']],
 ['ja','Japanisch',['ja','japanese','japanisch']],
 ['ro','Rumänisch',['ro','romanian','rumänisch','rumaenisch']],
 ['pl','Polnisch',['pl','polish','polnisch']],
 ['ku','Kurdisch',['ku','kurdish','kurdisch']]
];
const NAME=Object.fromEntries(LANGS.map(([code,label])=>[code,label]));
const KEYS=Object.fromEntries(LANGS.map(([code,,keys])=>[code,keys]));

function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function normalize(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss')}
function codeFrom(value){
 const text=normalize(value);
 for(const [code,,keys] of LANGS){
  if(keys.some(key=>normalize(key)===text||text.includes(normalize(key))))return code;
 }
 return'en';
}
function currentCode(){
 const p=profile();
 return codeFrom(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'en');
}
function objects(item){
 return [item?.tr,item?.translations,item?.translation,item?.meanings,typeof item?.meaning==='object'?item.meaning:null].filter(value=>value&&typeof value==='object'&&!Array.isArray(value));
}
function objectValue(object,code){
 if(!object)return'';
 const candidates=[code,...(KEYS[code]||[])];
 for(const key of candidates){
  if(object[key]!=null&&String(object[key]).trim())return String(object[key]).trim();
  const found=Object.keys(object).find(existing=>normalize(existing)===normalize(key));
  if(found&&String(object[found]).trim())return String(object[found]).trim();
 }
 return'';
}
function exactTranslation(item,code){
 for(const object of objects(item)){
  const value=objectValue(object,code);
  if(value)return value;
 }
 if(code===currentCode()){
  if(typeof item?.meaning==='string'&&item.meaning.trim())return item.meaning.trim();
  if(typeof item?.translation==='string'&&item.translation.trim())return item.translation.trim();
 }
 return'';
}
function translation(item,code=currentCode()){
 const exact=exactTranslation(item,code);
 if(exact)return exact;
 if(code!==currentCode())return'';
 for(const fallback of['en','ru','uk','tr','ar']){
  for(const object of objects(item)){
   const value=objectValue(object,fallback);
   if(value)return value;
  }
 }
 return'';
}
function full(item){return String(item?.full||item?.answer||item?.word||'').trim()}
function type(item){
 const raw=normalize(item?.type||item?.wordType||item?.kind||item?.group||'');
 const word=full(item);
 if(/noun|nomen|substantiv/.test(raw)||/^(der|die|das)\s/i.test(word)||item?.article)return'noun';
 if(/verb/.test(raw))return'verb';
 if(/adjektiv|adjective/.test(raw))return'adjective';
 if(/adverb/.test(raw))return'adverb';
 if(/phrase|ausdruck|redewendung|satz/.test(raw)||/\s/.test(word))return'phrase';
 return'other';
}
function labelForType(value){return({noun:'Nomen',verb:'Verben',adjective:'Adjektive',adverb:'Adverbien',phrase:'Ausdrücke und Redewendungen',other:'Weitere Wörter'})[value]||'Weitere Wörter'}
function grid(item){
 return `<div class="sp-translation-grid">${LANGS.map(([code,label])=>`<div><b>${esc(label)}:</b> <span>${esc(exactTranslation(item,code)||'—')}</span></div>`).join('')}</div>`;
}
function native(item){const code=currentCode();return{code,label:NAME[code]||code.toUpperCase(),text:translation(item,code)}}
function enrich(){
 const theme=window.L7_THEME;
 if(!theme||!Array.isArray(theme.tasks))return;
 theme.tasks.forEach(task=>(task.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const selected=native(item);
  if(selected.text)item.meaning=selected.text;
  item.translationLabel=selected.label;
 }));
}

window.L7TranslationStandard={langs:LANGS,name:code=>NAME[code]||code,currentCode,translation,exactTranslation,native,grid,full,type,labelForType,enrich,escape:esc};
Promise.resolve(window.L7_THEME_READY).then(enrich).catch(()=>{});
})();
