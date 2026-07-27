(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;
const removed=new Set(['nachste woche','nachstes wochenende','nachsten samstag']);
const clean=value=>String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.…!?,;:„“"']/g,'').replace(/\s+/g,' ');
const isRemoved=value=>removed.has(clean(value));
const cards=(data.tasks||[]).find(item=>item.id==='cards');
const oldCardItems=[...(cards?.items||data.vocabulary||[])];
const keptOldIndexes=[];
oldCardItems.forEach((item,index)=>{if(!isRemoved(item?.word)&&!isRemoved(item?.id))keptOldIndexes.push(index)});
const oldToNew=new Map(keptOldIndexes.map((oldIndex,newIndex)=>[oldIndex,newIndex]));
const newTotal=keptOldIndexes.length;
const remapList=list=>[...new Set((Array.isArray(list)?list:[]).map(index=>oldToNew.get(Number(index))).filter(index=>Number.isInteger(index)))];
function migrateCardProgress(storage){
 if(!storage||typeof storage.length!=='number')return;
 const keys=[];
 for(let index=0;index<storage.length;index++){
  const key=storage.key(index);
  if(key&&/L6_T4/i.test(key)&&/task-cards$/i.test(key))keys.push(key);
 }
 keys.forEach(key=>{
  try{
   const state=JSON.parse(storage.getItem(key)||'null');
   if(!state||Number(state.total)!==oldCardItems.length)return;
   state.total=newTotal;
   state.done=remapList(state.done);
   state.queue=remapList(state.queue).filter(index=>!state.done.includes(index));
   const mappedCurrent=oldToNew.get(Number(state.current));
   state.current=Number.isInteger(mappedCurrent)&&!state.done.includes(mappedCurrent)?mappedCurrent:null;
   state.firstSeen=remapList(state.firstSeen);
   state.firstCorrect=Math.min(Number(state.firstCorrect)||0,state.firstSeen.length,newTotal);
   storage.setItem(key,JSON.stringify(state));
  }catch(e){}
 });
}
migrateCardProgress(localStorage);
migrateCardProgress(sessionStorage);
data.vocabulary=(data.vocabulary||[]).filter(item=>!isRemoved(item.word)&&!isRemoved(item.id));
if(cards)cards.items=(cards.items||[]).filter(item=>!isRemoved(item.word)&&!isRemoved(item.id));
(data.overviewGroups||[]).forEach(group=>{group.words=(group.words||[]).filter(word=>!isRemoved(word))});
data.imageItems=(data.imageItems||[]).filter(item=>!isRemoved(item.word));
if(data.imageFile&&typeof data.imageFile==='object')Object.keys(data.imageFile).forEach(word=>{if(isRemoved(word))delete data.imageFile[word]});
})();
