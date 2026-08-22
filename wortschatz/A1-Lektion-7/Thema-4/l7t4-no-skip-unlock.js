(function(){
'use strict';
if(window.__SP_L7T4_NO_SKIP_UNLOCK_V1)return;window.__SP_L7T4_NO_SKIP_UNLOCK_V1=true;
function unlock(){
 if(document.body?.dataset?.page!=='task'||Number(document.body?.dataset?.theme)!==4)return;
 document.querySelectorAll('#app input,#app select,#app textarea').forEach(el=>{el.disabled=false});
 document.querySelectorAll('#app button').forEach(btn=>{
  if(btn.matches('.l7t4-token-bank button:disabled,.l7-tokens button:disabled,[data-token]:disabled'))return;
  btn.disabled=false
 });
 const input=document.querySelector('#app input:not([type="radio"]):not([type="checkbox"]),#app textarea,#app select');
 try{input?.focus?.({preventScroll:true})}catch(e){}
}
window.addEventListener('SP_L7_WRONG_ANSWER',()=>{setTimeout(unlock,35);setTimeout(unlock,170)});
})();