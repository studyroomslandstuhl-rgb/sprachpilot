(function(){
'use strict';
if(!window.L7||!window.L7S)return;
const original=window.L7.renderTheme;
window.L7.renderTheme=function(theme){
 original(theme);
 (window.L7S.T?.tasks||[]).forEach(task=>{
  if(!task.external)return;
  const link=document.getElementById(`task-${task.id}`);
  if(link&&!link.classList.contains('locked'))link.href=task.external;
 });
};
})();
