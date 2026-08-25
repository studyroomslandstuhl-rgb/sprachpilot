(function(){
'use strict';
if(window.__SP_L5T4_OVERVIEW_AUDIO_ONCE_V1)return;
window.__SP_L5T4_OVERVIEW_AUDIO_ONCE_V1=true;
const root=document.getElementById('wordList');
if(!root)return;
let lastIndex=-1,lastAt=0;
root.addEventListener('click',event=>{
 const button=event.target instanceof Element?event.target.closest('[data-word-index]'):null;
 if(!button||!root.contains(button))return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 const index=Number(button.dataset.wordIndex),now=Date.now();
 if(!Number.isInteger(index)||index<0)return;
 if(index===lastIndex&&now-lastAt<450)return;
 lastIndex=index;lastAt=now;
 const item=Array.isArray(window.WORDS)?window.WORDS[index]:(typeof WORDS!=='undefined'&&Array.isArray(WORDS)?WORDS[index]:null);
 if(item&&typeof window.spL5PlayWord==='function')window.spL5PlayWord(item,button);
},true);
})();