(function(){
'use strict';
if(window.__SP_L8T2_TASK_EMOJIS_20260901)return;
window.__SP_L8T2_TASK_EMOJIS_20260901=true;

function pick(task){
 const id=String(task?.id||'').toLowerCase(),title=String(task?.title||'').toLowerCase(),kind=String(task?.kind||'').toLowerCase(),text=`${id} ${title} ${kind}`;
 if(task?.exam)return'⭐';
 if(kind==='cards'||/karteikart/.test(text))return'🃏';
 if(/memory/.test(text))return'🧠';
 if(/wortschatz hören|wortschatz-hoeren|vocab-listen-image/.test(text))return'👂';
 if(/plural|zeitwörter/.test(text))return'🔢';
 if(/seit und vor|seit-vor|zeitangab|dialog-grammar/.test(text))return'⏳';
 if(/fragen und antworten/.test(text))return'💬';
 if(/sätze ordnen|satze ordnen|order/.test(text))return'🔀';
 if(/biografien verstehen/.test(text))return'📖';
 if(/bewerbung-hoeren-gesamt|zwei bewerbungsgespräche|zwei bewerbungsgespraeche|listening-two/.test(text))return'☎️';
 if(/bewerbung.*e-mail|bewerbung-lueckentext|email/.test(text))return'📧';
 if(/biografien ergänzen|biografien erganzen|biografien-luecken/.test(text))return'🧾';
 if(/biografie schreiben|biografie-schreiben/.test(text))return'✍️';
 if(/lesen|verstehen/.test(text))return'👀';
 if(/lücke|lucke/.test(text))return'📝';
 return task?.emoji||task?.icon||'✅';
}
function theme(){const n=Number(document.body?.dataset?.theme||0),all=window.L8_ALL_THEMES||{};return all[n]||all[String(n)]||window.L8_THEME||null}
function patchData(){const t=theme();if(!t?.tasks)return;for(const task of t.tasks){const e=pick(task);task.emoji=e;task.icon=e}}
function patchDom(){
 patchData();const t=theme();if(!t?.tasks)return;
 document.querySelectorAll('.l8-task-card').forEach((card,index)=>{const task=t.tasks[index],node=card.querySelector('.emoji');if(task&&node)node.textContent=pick(task)});
 const currentId=new URLSearchParams(location.search).get('task')||'',current=t.tasks.find(t=>String(t?.id||'')===currentId),line=document.querySelector('.l8-task-title-block p');
 if(current&&line&&current.instruction)line.textContent=`${pick(current)} ${current.instruction}`;
}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{patchData();return value});
const root=document.getElementById('app');if(root)new MutationObserver(()=>requestAnimationFrame(patchDom)).observe(root,{childList:true,subtree:true});
[0,80,250,700,1500].forEach(ms=>setTimeout(patchDom,ms));
window.L8T2TaskEmojis={patch:patchDom,pick};
})();