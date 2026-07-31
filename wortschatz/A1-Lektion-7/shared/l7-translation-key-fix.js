(function(){
'use strict';
if(window.__SP_L7_TRANSLATION_KEY_FIX_1)return;
window.__SP_L7_TRANSLATION_KEY_FIX_1=true;

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss')
  .replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
}
function wordKey(item){
 return normalize(String(item?.full||item?.answer||item?.word||item?.term||'').replace(/^(der|die|das)\s+/i,''));
}
function install(){
 const api=window.L7TranslationStandard;
 if(!api||api.__normalizedKeyFix)return;
 api.__normalizedKeyFix=true;
 const originalExact=api.exactTranslation.bind(api);
 const normalizedLexicon=new Map(Object.entries(api.lexicon||{}).map(([key,value])=>[normalize(key),value]));
 function exact(item,code){
  const direct=originalExact(item,code);
  if(direct)return direct;
  return String(normalizedLexicon.get(wordKey(item))?.[code]||'').trim();
 }
 function native(item){const code=api.currentCode();return{code,label:api.name(code),text:exact(item,code)}}
 function grid(item){
  return `<div class="sp-translation-grid">${api.langs.map(([code,label])=>`<div><b>${api.escape(label)}:</b> <span>${api.escape(exact(item,code)||'—')}</span></div>`).join('')}</div>`;
 }
 function enrich(){
  const theme=window.L7_THEME;
  if(!theme||!Array.isArray(theme.tasks))return;
  theme.tasks.forEach(task=>(task.items||[]).forEach(item=>{
   if(!item||typeof item!=='object')return;
   const selected=native(item);
   item.translationLabel=selected.label;
   item.translationText=selected.text||'—';
   if(selected.text)item.meaning=selected.text;
  }));
 }
 api.exactTranslation=exact;
 api.translation=(item,code=api.currentCode())=>exact(item,code);
 api.native=native;
 api.grid=grid;
 api.enrich=enrich;
 Promise.resolve(window.L7_THEME_READY).then(enrich).catch(()=>{});
}

if(window.L7TranslationStandard)install();
else{
 let tries=0;
 const timer=setInterval(()=>{
  if(window.L7TranslationStandard||++tries>80){clearInterval(timer);install()}
 },25);
}
})();
