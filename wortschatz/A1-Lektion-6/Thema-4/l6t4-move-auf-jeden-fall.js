(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data||data.__aufJedenFallMovedToL7T1)return;
data.__aufJedenFallMovedToL7T1=true;
const phrase=/auf jeden fall/i;
const contains=value=>typeof value==='string'&&phrase.test(value);
const optionContains=option=>typeof option==='string'?contains(option):contains(option?.label)||contains(option?.word)||contains(option?.answer);

data.vocabulary=(data.vocabulary||[]).filter(item=>!contains(item?.word)&&!contains(item?.id));
(data.overviewGroups||[]).forEach(group=>{group.words=(group.words||[]).filter(word=>!contains(word))});

(data.tasks||[]).forEach(task=>{
 task.items=(task.items||[]).filter(item=>{
  if(contains(item?.word)||contains(item?.answer))return false;
  if((item?.answers||[]).some(contains))return false;
  return true
 }).map(item=>{
  if(Array.isArray(item.options))item.options=item.options.filter(option=>!optionContains(option));
  if(Array.isArray(item.tokens))item.tokens=item.tokens.filter(token=>!contains(token));
  return item
 }).filter(item=>!Array.isArray(item.options)||item.options.length>=2)
});
})();
