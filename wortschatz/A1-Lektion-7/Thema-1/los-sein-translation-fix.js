(function(){
'use strict';

const FIX=Object.freeze({
 en:'to get going',
 ru:'отправляться / трогаться',
 tr:'yola koyulmak / harekete geçmek',
 uk:'вирушати / рушати',
 ar:'الانطلاق / البدء بالتحرك',
 ja:'出発する / 動き始める',
 ro:'a porni / a pleca',
 pl:'ruszać / wyruszać',
 ku:'rê ketin / dest bi hereketê kirin'
});

const ALIASES={
 en:['en','english','englisch'],
 ru:['ru','russian','russisch'],
 tr:['tr','turkish','türkisch','tuerkisch'],
 uk:['uk','ua','ukrainian','ukrainisch'],
 ar:['ar','arabic','arabisch'],
 ja:['ja','japanese','japanisch'],
 ro:['ro','romanian','rumänisch','rumaenisch'],
 pl:['pl','polish','polnisch'],
 ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']
};

function normalize(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
}
function itemKey(item){
 return normalize(String(item?.full||item?.answer||item?.word||item?.term||'').replace(/^(der|die|das)\s+/i,''));
}
function codeForKey(key){
 const n=normalize(key);
 for(const [code,names] of Object.entries(ALIASES))if(names.some(name=>normalize(name)===n))return code;
 return'';
}
function patchTranslations(value,seen=new Set()){
 if(!value||typeof value!=='object'||seen.has(value))return;
 seen.add(value);
 for(const key of Object.keys(value)){
  const code=codeForKey(key);
  if(code){value[key]=FIX[code];continue;}
  if(value[key]&&typeof value[key]==='object')patchTranslations(value[key],seen);
 }
}
function currentCode(){
 try{return window.L7TranslationStandard?.currentCode?.()||'en'}catch{return'en'}
}
function apply(){
 const theme=window.L7_THEME;
 if(!theme||!Array.isArray(theme.tasks))return;
 const code=currentCode();
 theme.tasks.forEach(task=>(task.items||[]).forEach(item=>{
  if(!item||typeof item!=='object'||itemKey(item)!=='los sein')return;
  patchTranslations(item);
  item.tr={...(item.tr&&typeof item.tr==='object'?item.tr:{}),...FIX};
  item.translations={...(item.translations&&typeof item.translations==='object'?item.translations:{}),...FIX};
  if(item.translation&&typeof item.translation==='object')item.translation={...item.translation,...FIX};
  if(item.meanings&&typeof item.meanings==='object')item.meanings={...item.meanings,...FIX};
  if(item.meaning&&typeof item.meaning==='object')item.meaning={...item.meaning,...FIX};
  item.meaning=FIX[code]||FIX.en;
  item.translationText=FIX[code]||FIX.en;
  if(item.sentence==='Was ist los?')item.sentence='Wir sind um acht Uhr los.';
  if(item.example==='Was ist los?')item.example='Wir sind um acht Uhr los.';
 }));
}

Promise.resolve(window.L7_THEME_READY).then(apply).catch(()=>{});
window.SP_L7T1_LOS_SEIN_TRANSLATIONS=FIX;
})();
