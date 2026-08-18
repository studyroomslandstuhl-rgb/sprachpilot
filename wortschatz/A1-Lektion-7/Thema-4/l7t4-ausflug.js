(function(){
'use strict';
if(window.__SP_L7T4_AUSFLUG_V1)return;
window.__SP_L7T4_AUSFLUG_V1=true;

const replaceText=value=>String(value)
 .replace(/Schulausflüge/g,'Ausflüge')
 .replace(/Schulausflug/g,'Ausflug')
 .replace(/schulausflüge/g,'Ausflüge')
 .replace(/schulausflug/g,'Ausflug');

function walk(value,seen=new Set()){
 if(typeof value==='string')return replaceText(value);
 if(!value||typeof value!=='object'||seen.has(value))return value;
 seen.add(value);
 if(Array.isArray(value)){
  for(let i=0;i<value.length;i++)value[i]=walk(value[i],seen);
  return value;
 }
 for(const key of Object.keys(value))value[key]=walk(value[key],seen);
 return value;
}

const TR={
 en:'trip / excursion',
 ru:'экскурсия / поездка',
 tr:'gezi',
 uk:'екскурсія / поїздка',
 ar:'رحلة',
 ja:'遠足 / 旅行',
 ro:'excursie',
 pl:'wycieczka',
 ku:'ger / sefer'
};

function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim()}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 walk(theme);
 const cards=(theme?.tasks||[]).find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''));
 for(const item of cards?.items||[]){
  const candidates=[item?.full,item?.word,item?.answer,item?.term,item?.prompt,item?.label,item?.front].filter(Boolean).map(norm);
  if(!candidates.some(value=>value==='ausflug'))continue;
  item.type='noun';item.category='noun';item.translations={...(item.translations||{}),...TR};item.plural='die Ausflüge';item.example='Der Ausflug ist am Freitag.';
  if(item.full)item.full=replaceText(item.full);
  if(item.word)item.word=replaceText(item.word);
  if(item.answer)item.answer=replaceText(item.answer);
  if(Array.isArray(item.answers))item.answers=item.answers.map(replaceText);
 }
 theme.contentRevision='l7t4-ausflug-20260818-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
