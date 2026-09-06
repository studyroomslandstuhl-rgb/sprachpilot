(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='pruefung'&&task!=='exam')return;
const root=document.getElementById('app');if(!root)return;
function apply(){
 const prompt=document.querySelector('#taskArea .l8-prompt');
 if(!prompt)return;
 const text=String(prompt.textContent||'').trim();
 const item=(window.L9T1?.exam||[]).find(x=>String(x.prompt||'').trim()===text);
 const old=document.querySelector('#taskArea .l9-exam-image');
 if(!item?.image){if(old)old.remove();return}
 if(old&&old.dataset.src===item.image)return;
 if(old)old.remove();
 const box=document.createElement('div');box.className='l9-main-image l9-exam-image';box.dataset.src=item.image;
 const image=document.createElement('img');image.src=item.image;image.alt='Bild zur Prüfungsfrage';image.loading='eager';image.decoding='async';image.onerror=()=>box.remove();
 box.appendChild(image);prompt.insertAdjacentElement('beforebegin',box);
}
new MutationObserver(apply).observe(root,{childList:true,subtree:true});
[0,50,150,400].forEach(ms=>setTimeout(apply,ms));
})();
