(function(){
'use strict';
if(window.__SP_L7T2_A15_RANDOM_V1)return;window.__SP_L7T2_A15_RANDOM_V1=true;
function shuffle(a){const out=[...a];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function rebalanceContainer(obj,counter){
 if(!obj||typeof obj!=='object')return counter;
 if(Array.isArray(obj.options)&&obj.options.length>=2&&obj.answer!=null){
  const old=[...obj.options],letter=/^[abc]$/i.test(String(obj.answer).trim())?String(obj.answer).trim().toLowerCase():null;
  const correct=letter?old['abc'.indexOf(letter)]:obj.answer;
  const others=shuffle(old.filter(x=>String(x)!==String(correct)));
  const target=counter%old.length;
  const next=[];let oi=0;for(let i=0;i<old.length;i++)next.push(i===target?correct:others[oi++]);
  obj.options=next;
  if(letter)obj.answer='abc'[target]||obj.answer;
  counter++;
 }
 for(const value of Object.values(obj)){
  if(Array.isArray(value))for(const entry of value)counter=rebalanceContainer(entry,counter);
  else if(value&&typeof value==='object')counter=rebalanceContainer(value,counter);
 }
 return counter;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const learning=(theme?.tasks||[]).filter(t=>!t?.exam);const task=learning[14];if(!task)return theme;
 rebalanceContainer(task,1);task.spAnswerPositionRevision='balanced-abc-v1';theme.contentRevision='l7t2-a15-balanced-20260819-v1';window.L7_THEME=theme;return theme;
});
})();
