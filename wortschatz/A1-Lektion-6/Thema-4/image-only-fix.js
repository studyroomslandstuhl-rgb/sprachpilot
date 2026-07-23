(function(){
'use strict';
const task=new URLSearchParams(location.search).get('task');
if(!['word-image','listen-image'].includes(task))return;
const area=document.getElementById('area');
if(!area)return;
function clean(){area.querySelector('.question-card > .eyebrow')?.remove()}
clean();
new MutationObserver(clean).observe(area,{childList:true,subtree:true});
})();