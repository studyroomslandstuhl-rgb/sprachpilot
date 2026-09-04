(function(){
'use strict';
function apply(){
 const n=Number(document.body?.dataset?.theme||location.pathname.match(/\/Thema-(\d+)\//i)?.[1]||0);if(!n)return;
 const theme=window.L9_THEMES?.[n]||window.L9_THEMES?.[String(n)];
 let title=theme?.title||`Thema ${n}`;
 const taskId=new URLSearchParams(location.search).get('task');
 if(n===1&&taskId&&window.L9T1?.tasks){const task=window.L9T1.tasks.find(x=>String(x.id)===String(taskId));if(task?.title)title=task.title}
 const subtitle=document.querySelector('.sp-header__subtitle');
 if(subtitle)subtitle.textContent=`${title} · A1 Lektion 9 · Thema ${n}`;
}
[0,80,250,700,1500].forEach(ms=>setTimeout(apply,ms));
})();
