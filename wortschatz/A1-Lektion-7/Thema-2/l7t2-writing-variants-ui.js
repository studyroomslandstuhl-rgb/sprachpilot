(function(){
'use strict';
if(window.__SP_L7T2_WRITING_VARIANTS_V1)return;
window.__SP_L7T2_WRITING_VARIANTS_V1=true;
function exact(a,b){return String(a||'').replace(/\s+/g,' ').trim()===String(b||'').replace(/\s+/g,' ').trim()}
document.addEventListener('click',event=>{
 const button=event.target instanceof Element?event.target.closest('#spSentenceCheck'):null;
 if(!button)return;
 const id=String(new URLSearchParams(location.search).get('task')||'');
 if(id!=='saetze-schreiben'||!window.L7S)return;
 const task=window.L7S.task?.(id);if(!task)return;
 const st=window.L7S.load(Number(document.body.dataset.theme||2),task.id,task.items.length);
 const index=Number.isInteger(st.current)?st.current:task.items.findIndex((item,i)=>!st.done.includes(i));
 if(index<0)return;
 const item=task.items[index],value=document.getElementById('spSentenceInput')?.value||'';
 const accepted=[item.answer,...(item.acceptedSentences||[])].filter(Boolean);
 const match=accepted.find(sentence=>exact(value,sentence));
 if(match)item.answer=match;
},true);
})();
