(function(){
'use strict';
if(window.__SP_L7T4_FINALIZE_V1)return;window.__SP_L7T4_FINALIZE_V1=true;
function norm(v){return String(v??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()\/…]+/g,' ').replace(/\s+/g,' ').trim()}
function rotateCorrect(value,counter){
 if(!value||typeof value!=='object'||!Array.isArray(value.options)||value.options.length<2||value.answer==null)return counter;
 if(!value.options.every(option=>typeof option==='string'||typeof option==='number'))return counter;
 const answerIndex=value.options.findIndex(option=>norm(option)===norm(value.answer));if(answerIndex<0)return counter;
 const len=value.options.length;
 const sequence=len===2?[1,0]:len===3?[1,2,0]:[1,2,3,0];
 const target=sequence[counter%sequence.length]%len;
 if(answerIndex!==target){const options=[...value.options],correct=options.splice(answerIndex,1)[0];options.splice(target,0,correct);value.options=options}
 return counter+1
}
function walk(value,state,seen=new Set()){
 if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);
 state.count=rotateCorrect(value,state.count);
 if(Array.isArray(value)){value.forEach(item=>walk(item,state,seen));return}
 Object.values(value).forEach(item=>walk(item,state,seen));
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme)return theme;
 walk(theme,{count:0});
 const exam=(theme.tasks||[]).find(t=>t?.exam);if(exam){exam.title='Prüfung';exam.description='Bearbeite die Prüfung.'}
 theme.contentRevision='l7t4-finalized-20260822-v1';window.L7_THEME=theme;return theme;
});
})();
