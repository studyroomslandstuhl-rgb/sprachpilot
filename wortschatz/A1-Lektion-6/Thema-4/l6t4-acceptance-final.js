(function(){
'use strict';
if(window.__L6T4_ACCEPTANCE_FINAL_V2)return;
window.__L6T4_ACCEPTANCE_FINAL_V2=true;

const normalize=value=>String(value??'')
 .trim()
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'')
 .replace(/ß/g,'ss')
 .replace(/[.,!?;:“”„"'…‥]/g,'')
 .replace(/\s+/g,' ');

/* Die sichtbare Form bleibt „Ich glaube …“. Bei der Eingabe sind die Punkte optional. */
const data=window.L6T4_DATA;
if(data){
 const variants=['Ich glaube …','Ich glaube...','Ich glaube','Ich glaube.','ich glaube'];
 for(const task of data.tasks||[]){
  for(const item of task?.items||[]){
   const candidates=[item?.word,item?.answer,...(item?.answers||[])];
   if(!candidates.some(value=>normalize(value)==='ich glaube'))continue;
   if(Object.prototype.hasOwnProperty.call(item,'word'))item.word='Ich glaube …';
   item.answer='Ich glaube …';
   item.answers=[...new Set([...(item.answers||[]),...variants])];
  }
 }
 const vocabulary=data.vocabulary||data.words||[];
 for(const item of vocabulary){if(normalize(item?.word)==='ich glaube')item.word='Ich glaube …'}
}

/* app.js hatte eine zweite, ältere Vergleichsfunktion. Diese ist jetzt maßgeblich. */
window.l6t4Simple=normalize;
window.l6t4Exact=function(value,solutions){
 const input=normalize(value);
 const list=Array.isArray(solutions)?solutions:[solutions];
 return list.some(solution=>normalize(solution)===input);
};

/* Eine richtige Korrektur beendet den Eintrag. Ein früherer Fehler darf ihn nicht endlos neu einreihen. */
if(typeof window.l6t4Load==='function'&&typeof window.l6t4Save==='function'){
 window.l6t4Right=function(file,total){
  const state=window.l6t4Load(file,total),current=state.current;
  if(current!==null&&current!==undefined&&!state.done.includes(current))state.done.push(current);
  state.queue=(state.queue||[]).filter(index=>index!==current);
  state.current=null;
  state.tries=0;
  state.hadWrong=false;
  window.l6t4Save(file,state);
 };
}

/* Die alte Oberfläche behauptete nach einer richtigen Korrektur noch, der Eintrag käme wieder. */
function cleanFeedback(){
 document.querySelectorAll('.feedback .ok').forEach(box=>{
  if(/Der Dialog kommt am Ende noch einmal/i.test(box.textContent||''))box.textContent='Richtig. Korrektur akzeptiert.';
 });
}
new MutationObserver(cleanFeedback).observe(document.documentElement,{childList:true,subtree:true});
cleanFeedback();

window.L6T4AcceptanceFinal={normalize};
})();
