(function(){
'use strict';
if(window.__SP_L7T4_ANSWER_MIX_V1)return;window.__SP_L7T4_ANSWER_MIX_V1=true;
const norm=v=>String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim();
const optionValue=o=>typeof o==='string'||typeof o==='number'?String(o):String(o?.value??o?.answer??o?.label??o?.text??'');
function place(options,answer,target){
 if(!Array.isArray(options)||options.length<2||answer==null)return options;
 const wanted=norm(answer),index=options.findIndex(o=>norm(optionValue(o))===wanted);if(index<0)return options;
 const out=options.slice(),correct=out.splice(index,1)[0],pos=Math.max(0,Math.min(out.length,Number(target)||0));out.splice(pos,0,correct);return out;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 let counter=0;
 const mixNode=node=>{
  if(!node||typeof node!=='object')return;
  if(Array.isArray(node.options)&&node.answer!=null){
   const len=node.options.length,target=len?counter%len:0;counter++;
   node.options=place(node.options,node.answer,target);
   node.preserveOrder=true;
  }
  if(Array.isArray(node.questions))node.questions.forEach(mixNode);
  if(Array.isArray(node.blanks))node.blanks.forEach(mixNode);
  if(Array.isArray(node.parts))node.parts.forEach(mixNode);
 };
 theme.tasks.forEach(task=>{
  if(!task||task.exam)return;
  (task.items||[]).forEach(mixNode);
 });
 theme.uiRules={...(theme.uiRules||{}),multipleChoiceMixed:true};
 theme.answerMixRevision='l7t4-balanced-abc-v1';
 window.L7_THEME=theme;return theme;
});
})();
