(function(){
'use strict';
if(window.__SP_L10T2_CARD_TRANSLATION_PATCH)return;window.__SP_L10T2_CARD_TRANSLATION_PATCH=true;
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
function patch(){
 const box=document.querySelector('.l8-flip-front .l8-card-translation');
 const word=String(document.querySelector('.l8-flip-word')?.textContent||'').trim();
 if(!box||!word)return;
 const item=(window.L10T2?.cards||[]).find(x=>String(x.full||x.word||'').trim()===word);
 if(!item)return;
 const label=box.querySelector('span'),value=box.querySelector('strong');
 if(label)label.textContent=window.L10T2Translations?.label||'Übersetzung';
 if(value)value.textContent=item.translation||'–';
}
const root=document.getElementById('app')||document.body;
new MutationObserver(()=>requestAnimationFrame(patch)).observe(root,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',patch);
setTimeout(patch,100);
})();