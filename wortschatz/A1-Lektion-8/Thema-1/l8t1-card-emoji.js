(function(){
'use strict';
if(window.__SP_L8T1_TASK_EMOJI_V5)return;
window.__SP_L8T1_TASK_EMOJI_V5=true;

const EMOJI_BY_ID={
 'karteikarten':'🃏',
 'berufe-bild-v3':'🖼️',
 'berufspaare-v3':'👥',
 'nomen-singular-plural-v3':'🔢',
 'berufe-artikel-v3':'🔤',
 'beruf-saetze-ordnen-v3':'🧩',
 'berufsfragen-antworten-v4':'💬',
 'eigen-grammatik-v3':'🧠',
 'eigen-schreiben-v3':'✍️',
 'berufe-hoeren-v3':'🎧',
 'berufe-arbeitsorte-v3':'🔗',
 'berufe-dialoge-v3':'🗨️',
 'arbeit-wortschatz-v3':'💼',
 'arbeit-wortschatz-schreiben-v3':'📝',
 'berufsfragen-status-v1':'❓',
 'pruefung-berufe-v3':'⭐'
};

const EMOJI_BY_KIND={
 cards:'🃏',
 choice:'✅',
 dualinput:'🔢',
 order:'🧩',
 'berufsinterview-v4':'💬',
 grammar:'🧠',
 input:'✍️',
 listen:'🎧',
 matching:'🔗',
 'inline-dialog':'🗨️',
 exam:'⭐'
};

let scheduled=false;

function getTheme(){
 return window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;
}

function emojiFor(task){
 if(!task)return '📘';
 if(task.exam)return '⭐';
 return EMOJI_BY_ID[task.id]||EMOJI_BY_KIND[task.kind]||task.icon||task.emoji||'📘';
}

function patchData(){
 const theme=getTheme();
 if(!theme?.tasks)return;
 theme.tasks.forEach(task=>{
  const emoji=emojiFor(task);
  task.icon=emoji;
  task.emoji=emoji;
 });
}

function setText(node,text){
 if(node&&String(node.textContent||'')!==text)node.textContent=text;
}

function patchDom(){
 patchData();
 const theme=getTheme();
 if(!theme?.tasks)return;

 theme.tasks.forEach(task=>{
  const emoji=emojiFor(task);
  const selector=`a.l8-task-card[href*="task=${CSS.escape(task.id)}"] .emoji`;
  document.querySelectorAll(selector).forEach(node=>setText(node,emoji));
 });

 const id=new URLSearchParams(location.search).get('task');
 if(!id)return;
 const task=theme.tasks.find(item=>String(item?.id||'')===id);
 if(!task)return;
 const line=document.querySelector('.l8-task-title-block p');
 if(line&&task.instruction){
  setText(line,`${emojiFor(task)} ${task.instruction}`);
 }
}

function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  patchDom();
 });
}

window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{
 patchData();
 return value;
});

const root=document.getElementById('app');
if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,80,250,700,1600].forEach(ms=>setTimeout(patchDom,ms));
})();