(function(){
'use strict';
if(window.__SP_L7_STABLE_HELP_FLOW_34_V1)return;
window.__SP_L7_STABLE_HELP_FLOW_34_V1=true;

const THEMES=new Set([3,4]);
let tries=0,timer=null;

function isMemoryTask(id){
 const S=window.L7S,t=S?.task?.(id);
 if(t?.spL7T2Memory===true||t?.spL7Memory===true||t?.memory===true)return true;
 const text=[id,t?.id,t?.title,t?.kind,t?.type].filter(Boolean).join(' ').toLowerCase();
 return text.includes('memory')||text.includes('mamory');
}

function install(){
 const S=window.L7S,theme=Number(document.body.dataset.theme||0);
 if(!S||!THEMES.has(theme))return false;
 if(S.__spStableHelpFlow34)return true;
 const rawWrong=typeof S.wrong==='function'?S.wrong.bind(S):null;
 const rawRight=typeof S.right==='function'?S.right.bind(S):null;

 S.wrong=function(th,id,total){
  if(!THEMES.has(Number(th))||isMemoryTask(id))return rawWrong?rawWrong(th,id,total):0;
  const st=S.load(th,id,total),index=st.current;
  if(index==null)return 0;
  const previous=Math.max(Number(st.wrongTries?.[index]||0),st.hadWrong?Number(st.tries||0):0);
  const count=previous+1;
  st.wrongTries=st.wrongTries||{};
  st.wrongTries[index]=count;
  st.tries=count;
  st.hadWrong=true;
  // L7T3/L7T4: Eine falsche Antwort bleibt sichtbar.
  // Kein automatisches Weiterspringen; Hilfe/Lösung bleibt stehen,
  // bis die richtige Antwort selbst eingegeben oder gewählt wurde.
  S.save(th,id,st,true);
  return count;
 };

 S.right=function(th,id,total,free=false){
  if(!THEMES.has(Number(th))||isMemoryTask(id))return rawRight?rawRight(th,id,total,free):undefined;
  const st=S.load(th,id,total),index=st.current;
  if(index!=null){
   st.wrongTries=st.wrongTries||{};
   if(free){
    if(!st.done.includes(index))st.done.push(index);
   }else if(st.hadWrong||Number(st.tries||0)>0){
    if(!st.done.includes(index)&&!st.queue.includes(index))st.queue.push(index);
   }else if(!st.done.includes(index)){
    st.done.push(index);
   }
   // Bei der späteren Wiederholung beginnt die Hilfestufe wieder bei Versuch 1.
   delete st.wrongTries[index];
  }
  st.current=null;
  st.tries=0;
  st.hadWrong=false;
  S.save(th,id,st,true);
 };

 S.__spStableHelpFlow34=true;
 return true;
}

function start(){
 if(install()){if(timer)clearInterval(timer);timer=null;return}
 if(timer)return;
 timer=setInterval(()=>{
  tries++;
  if(install()||tries>240){clearInterval(timer);timer=null}
 },25);
}

start();
document.addEventListener('DOMContentLoaded',start);
window.addEventListener('load',start);
window.SP_L7_STABLE_HELP_FLOW_34={install,isMemoryTask};
})();
