(function(){
'use strict';
if(window.__SP_L8T1_RANDOMIZE_V1)return;window.__SP_L8T1_RANDOMIZE_V1=true;
const shuffle=list=>{const a=[...(list||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>String(x)===String(b[i]));
function shuffledDifferent(list,canonical){let out=shuffle(list);for(let n=0;n<5&&canonical&&same(out,canonical);n++)out=shuffle(list);return out}
function patchItem(item){
 if(!item||typeof item!=='object')return;
 if(Array.isArray(item.options)&&item.options.length>1)item.options=shuffle(item.options);
 if(Array.isArray(item.choiceOptions)&&item.choiceOptions.length>1)item.choiceOptions=shuffle(item.choiceOptions);
 if(Array.isArray(item.tokens)&&item.tokens.length>1){
  const canonical=Array.isArray(item.answer)?String(item.answer[0]||'').split(/\s+/):null;
  item.tokens=shuffledDifferent(item.tokens,canonical);
 }
 if(Array.isArray(item.pairs)&&item.pairs.length>1)item.pairs=shuffle(item.pairs);
}
function patchTheme(){
 const all=window.L8_ALL_THEMES||{},theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null)||window.L8_THEME;
 if(!theme||!Array.isArray(theme.tasks))return false;
 for(const task of theme.tasks)for(const item of task.items||[])patchItem(item);
 theme.randomizationRevision='l8t1-random-v1';
 if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;
 return true;
}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{patchTheme();return value});
function installQuestionRandomizer(){
 const S=window.L8S,H=window.L8T1ProgressHub;
 if(!S||!H||S.__spL8T1QuestionRandomizer)return false;
 const rawNext=S.nextIndex.bind(S);
 S.nextIndex=function(theme,task,total){
  if(Number(theme)===1){
   try{
    const st=H.taskState(String(task),total),done=new Set((st.done||[]).map(Number)),cur=Number(st.current);
    const hasCurrent=Number.isInteger(cur)&&cur>=0&&cur<Number(total)&&!done.has(cur);
    if(!hasCurrent){
     st.queue=shuffle((st.queue||[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<Number(total)&&!done.has(i)));
     st.reviewQueue=shuffle((st.reviewQueue||[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<Number(total)&&!done.has(i)));
     H.saveTask(String(task),st);
    }
   }catch(e){console.warn('L8T1: Fragen-Reihenfolge konnte nicht neu gemischt werden',e)}
  }
  return rawNext(theme,task,total);
 };
 S.__spL8T1QuestionRandomizer=true;
 return true;
}
if(!installQuestionRandomizer()){let n=0;const timer=setInterval(()=>{if(installQuestionRandomizer()||++n>300)clearInterval(timer)},20)}
window.L8T1Randomize={shuffle,patchTheme,installQuestionRandomizer};
})();
