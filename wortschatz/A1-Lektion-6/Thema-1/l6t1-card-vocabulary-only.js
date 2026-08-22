(function(){
'use strict';
if(window.__SP_L6T1_CARD_VOCAB_ONLY_V1)return;window.__SP_L6T1_CARD_VOCAB_ONLY_V1=true;
const FILE='karteikarten.html';
function itemMode(w){return w?.type==='verb'?'verb':(w?.type==='phrase'?'phrase':'noun')}
window.cardItems=function(){
 const list=typeof window.words==='function'?(window.words()||[]):[];
 return list.map(w=>({mode:itemMode(w),w}));
};
const rawLoad=typeof window.loadTask==='function'?window.loadTask.bind(window):null;
if(rawLoad){
 window.loadTask=function(file,total){
  if(String(file)===FILE){
   try{
    const key=typeof window.taskKey==='function'?window.taskKey(file):'';
    const raw=key?JSON.parse(localStorage.getItem(key)||'null'):null;
    if(raw&&Number(raw.total)!==Number(total)){
      if(key)localStorage.removeItem(key);
      localStorage.removeItem('SP_TASK_STATE_'+file);
      localStorage.removeItem('SP_TASK_STATE_'+String(file).replace(/\.html$/,''));
    }
   }catch(e){}
  }
  const st=rawLoad(file,total);
  if(String(file)!==FILE||!st)return st;
  const max=Math.max(0,Number(total)||0);
  st.total=max;
  st.done=[...new Set((Array.isArray(st.done)?st.done:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<max))];
  st.queue=[...new Set((Array.isArray(st.queue)?st.queue:[]).map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<max&&!st.done.includes(i)))];
  if(st.current!=null){const current=Number(st.current);if(!Number.isInteger(current)||current<0||current>=max||st.done.includes(current))st.current=null;}
  try{if(typeof window.saveTask==='function')window.saveTask(file,st)}catch(e){}
  return st;
 };
}
})();