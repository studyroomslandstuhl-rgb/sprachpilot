(function(){
'use strict';
if(window.__SP_L7T3_SEIN_ANSWER_FIX_V1)return;window.__SP_L7T3_SEIN_ANSWER_FIX_V1=true;
function install(){
 if(!window.L7||!window.L7S||window.L7.__spL7T3SeinAnswerFixV1)return false;
 const previous=window.L7.renderTaskPage.bind(window.L7);
 window.L7.renderTaskPage=function(theme,id){
  const t=window.L7S.task(id);
  if(t?.spL7T3Kind==='sein'&&Array.isArray(t.items)){
   t.items.forEach(item=>{const pronoun=String(item?.pronoun||'').trim().toLowerCase();if(pronoun==='du')item.form='bist';else if(pronoun==='er')item.form='ist'});
  }
  return previous(theme,id);
 };
 window.L7.__spL7T3SeinAnswerFixV1=true;return true;
}
window.L7T3SeinAnswerFix={install};
if(!install()){let n=0;const timer=setInterval(()=>{if(install()||++n>200)clearInterval(timer)},25)}
})();