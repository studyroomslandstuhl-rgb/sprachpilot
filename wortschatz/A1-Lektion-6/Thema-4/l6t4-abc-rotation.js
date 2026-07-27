(function(){
'use strict';
const params=new URLSearchParams(location.search);
const taskId=params.get('task')||'';
if(!['dialog-abc','listen-abc'].includes(taskId))return;
const task=window.L6T4_DATA?.tasks?.find(item=>item.id===taskId);
if(!task||typeof window.l6t4Shuffle!=='function')return;
const originalShuffle=window.l6t4Shuffle;
const plans=new WeakMap();
const storageKey=`SP_L6_T4_ABC_OFFSET_${taskId}`;
let offset=0;
try{
 const previous=sessionStorage.getItem(storageKey);
 offset=previous===null?Math.floor(Math.random()*3):(Number(previous)+1)%3;
 sessionStorage.setItem(storageKey,String(offset));
}catch(e){offset=Math.floor(Math.random()*3)}
const simple=value=>String(value??'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"']/g,'').replace(/\s+/g,' ');
(task.items||[]).forEach((item,index)=>{
 const options=item?.options;
 if(!Array.isArray(options)||options.length!==3)return;
 const answerIndex=options.findIndex(option=>simple(option)===simple(item.answer));
 if(answerIndex<0)return;
 const answer=options[answerIndex];
 const distractors=originalShuffle(options.filter((_,optionIndex)=>optionIndex!==answerIndex));
 const correctPosition=(index+offset)%3;
 const arranged=[...distractors];
 arranged.splice(correctPosition,0,answer);
 plans.set(options,arranged);
});
window.l6t4Shuffle=function(list){
 const planned=list&&typeof list==='object'?plans.get(list):null;
 return planned?[...planned]:originalShuffle(list);
};
})();
