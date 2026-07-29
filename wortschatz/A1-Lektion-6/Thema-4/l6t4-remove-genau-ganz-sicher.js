(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;

const simple=value=>String(value??'')
 .toLowerCase()
 .trim()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'')
 .replace(/ß/g,'ss')
 .replace(/[.,!?;:“”"'…]/g,'')
 .replace(/\s+/g,' ');

const removed=new Set(['genau','ganz sicher']);
const removeItem=item=>{
 if(!item||typeof item!=='object')return false;
 if(['genau','ganz-sicher'].includes(String(item.id||'').toLowerCase()))return true;
 return removed.has(simple(item.word))||removed.has(simple(item.answer));
};

function cleanText(value){
 let text=String(value);
 text=text.replace(/Ja,\s*genau\.?/gi,'Ja, das stimmt.');
 text=text.replace(/Bilde genau die Verbindung/gi,'Bilde die Verbindung');
 text=text.replace(/Sieh dir das Bild genau an/gi,'Sieh dir das Bild gut an');
 text=text.replace(/\bganz sicher\b/gi,'bestimmt');
 text=text.replace(/\bgenau\b/gi,'richtig');
 return text;
}

function cleanObject(value){
 if(Array.isArray(value)){
  const cleaned=value.map(cleanObject);
  return cleaned.filter((entry,index,array)=>typeof entry!=='string'||array.indexOf(entry)===index);
 }
 if(!value||typeof value!=='object')return typeof value==='string'?cleanText(value):value;
 for(const key of Object.keys(value))value[key]=cleanObject(value[key]);
 return value;
}

function migrateCards(task,removedIndexes,oldTotal){
 if(!removedIndexes.length||!task)return;
 const newTotal=task.items.length;
 const mapIndex=index=>{
  index=Number(index);
  if(!Number.isInteger(index)||removedIndexes.includes(index))return null;
  return index-removedIndexes.filter(removedIndex=>removedIndex<index).length;
 };
 for(const storage of[localStorage,sessionStorage]){
  const keys=[];
  for(let i=0;i<storage.length;i++){
   const key=String(storage.key(i)||'');
   if(key.includes('SP_L6_T4')&&key.endsWith('task-cards'))keys.push(key);
  }
  keys.forEach(key=>{
   try{
    const state=JSON.parse(storage.getItem(key)||'null');
    if(!state||Number(state.total)!==oldTotal)return;
    state.total=newTotal;
    state.done=(state.done||[]).map(mapIndex).filter(Number.isInteger);
    state.queue=(state.queue||[]).map(mapIndex).filter(Number.isInteger);
    state.firstSeen=(state.firstSeen||[]).map(mapIndex).filter(Number.isInteger);
    state.current=mapIndex(state.current);
    state.firstCorrect=Math.min(Number(state.firstCorrect||0),newTotal);
    storage.setItem(key,JSON.stringify(state));
   }catch(e){}
  });
 }
}

if(Array.isArray(data.vocabulary))data.vocabulary=data.vocabulary.filter(item=>!removeItem(item));
if(Array.isArray(data.overviewGroups)){
 data.overviewGroups.forEach(group=>{
  group.words=(group.words||[]).filter(word=>!removed.has(simple(word))).map(cleanText);
 });
}
if(Array.isArray(data.tasks)){
 data.tasks.forEach(task=>{
  if(!Array.isArray(task.items))return;
  const oldItems=[...task.items];
  const removedIndexes=[];
  oldItems.forEach((item,index)=>{if(removeItem(item))removedIndexes.push(index)});
  task.items=oldItems.filter(item=>!removeItem(item)).map(cleanObject);
  if(task.id==='cards')migrateCards(task,removedIndexes,oldItems.length);
 });
}
cleanObject(data);

function installAnswerNormalization(){
 window.l6t4Simple=simple;
 window.l6t4Exact=function(value,solutions){
  const normalized=simple(value);
  return(Array.isArray(solutions)?solutions:[solutions]).some(solution=>simple(solution)===normalized);
 };
}
installAnswerNormalization();
document.addEventListener('DOMContentLoaded',installAnswerNormalization,{once:true});
setTimeout(installAnswerNormalization,0);
})();