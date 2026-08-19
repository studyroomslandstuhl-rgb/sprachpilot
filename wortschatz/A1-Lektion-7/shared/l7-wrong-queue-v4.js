(function(){
'use strict';
if(window.__SP_L7_WRONG_QUEUE_V6)return;
window.__SP_L7_WRONG_QUEUE_V6=true;
let installed=false;
function isMemory(id){const t=window.L7S?.task?.(id);if(t?.spL7T2Memory===true||t?.spL7Memory===true||t?.memory===true)return true;const text=[id,t?.id,t?.title,t?.kind,t?.type].filter(Boolean).join(' ').toLowerCase();return text.includes('memory')||text.includes('mamory')}
function uniqueOpen(st,total,exclude=null){const done=new Set((st.done||[]).map(Number)),out=[];for(const value of Array.isArray(st.queue)?st.queue:[]){const i=Number(value);if(Number.isInteger(i)&&i>=0&&i<total&&!done.has(i)&&i!==exclude&&!out.includes(i))out.push(i)}for(let i=0;i<total;i++)if(!done.has(i)&&i!==exclude&&!out.includes(i))out.push(i);return out}
function flash(count){setTimeout(()=>{try{document.getElementById('spL7WrongFlash')?.remove();const box=document.createElement('div');box.id='spL7WrongFlash';box.textContent=count===1?'Noch nicht richtig. Die Frage kommt später noch einmal.':count===2?'Noch nicht richtig. Beim nächsten Durchgang bekommst du einen konkreten Hinweis.':'Noch nicht richtig. Beim nächsten Durchgang siehst du die Lösungshilfe.';box.style.cssText='position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:99999;max-width:min(92vw,620px);padding:11px 16px;border-radius:13px;background:#fff0f0;border:2px solid #c93d3d;color:#8b1f1f;font-weight:800;box-shadow:0 8px 24px rgba(0,0,0,.18);text-align:center';document.body.appendChild(box);setTimeout(()=>box.remove(),1100)}catch(e){}},0)}
function install(){
 const S=window.L7S;if(!S||installed)return !!S;
 const rawIndex=S.index.bind(S),rawWrong=S.wrong.bind(S),rawRight=S.right.bind(S);
 S.index=function(theme,id,total){const i=rawIndex(theme,id,total);if(i==null||isMemory(id))return i;const st=S.load(theme,id,total),remembered=Math.max(0,Number(st.wrongTries?.[i]||0));if(remembered>0&&(Number(st.tries||0)!==remembered||!st.hadWrong)){st.tries=remembered;st.hadWrong=true;S.save(theme,id,st,false)}return i};
 S.wrong=function(theme,id,total){
  if(isMemory(id))return rawWrong(theme,id,total);
  const st=S.load(theme,id,total),i=Number(st.current);if(!Number.isInteger(i)||i<0||i>=total)return 0;
  const previous=Math.max(Number(st.wrongTries?.[i]||0),st.hadWrong?Number(st.tries||0):0),count=previous+1;st.wrongTries=st.wrongTries||{};st.wrongTries[i]=count;
  const open=uniqueOpen(st,total,i).filter(x=>x!==i);if(!(st.done||[]).includes(i))open.push(i);const next=open.shift();st.queue=open;st.current=Number.isInteger(next)?next:null;
  const nextWrong=st.current==null?0:Math.max(0,Number(st.wrongTries?.[st.current]||0));st.tries=nextWrong;st.hadWrong=nextWrong>0;S.save(theme,id,st,true);flash(count);
  setTimeout(()=>{try{if(document.body.dataset.page!=='task')return;const active=new URLSearchParams(location.search).get('task');if(String(active||'')===String(id)&&window.L7?.renderTaskPage)window.L7.renderTaskPage(Number(theme),id)}catch(e){}},700);return count
 };
 S.right=function(theme,id,total,free=false){
  if(isMemory(id))return rawRight(theme,id,total,free);
  const st=S.load(theme,id,total),i=Number(st.current);if(!Number.isInteger(i)||i<0||i>=total){st.current=null;st.tries=0;st.hadWrong=false;S.save(theme,id,st,true);return}
  st.done=Array.isArray(st.done)?st.done:[];st.queue=(Array.isArray(st.queue)?st.queue:[]).filter(x=>Number(x)!==i);const hadError=!free&&(st.hadWrong||Number(st.tries||0)>0||Number(st.wrongTries?.[i]||0)>0);
  if(hadError){if(st.wrongTries)delete st.wrongTries[i];if(!st.done.includes(i))st.queue.push(i)}else{if(!st.done.includes(i))st.done.push(i);if(st.wrongTries)delete st.wrongTries[i]}
  st.current=null;st.tries=0;st.hadWrong=false;S.save(theme,id,st,true)
 };
 S.__spWrongQueueV6=true;installed=true;return true
}
window.SPL7WrongQueueV4=window.SPL7WrongQueueV5=window.SPL7WrongQueueV6={install,isMemory};if(!install()){let n=0;const timer=setInterval(()=>{if(install()||++n>200)clearInterval(timer)},25)}
})();