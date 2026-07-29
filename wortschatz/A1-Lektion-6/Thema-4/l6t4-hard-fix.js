(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;

const normalize=value=>String(value??'')
 .trim()
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'')
 .replace(/ß/g,'ss')
 .replace(/[.,!?;:“”"'…]/g,'')
 .replace(/\s+/g,' ');

/* „Ich glaube“ ausdrücklich mit und ohne Satzzeichen bzw. Auslassungspunkte akzeptieren. */
const cards=(data.tasks||[]).find(task=>task?.id==='cards'||task?.kind==='cards');
if(cards&&Array.isArray(cards.items)){
 const item=cards.items.find(entry=>normalize(entry?.word)==='ich glaube');
 if(item){
  item.answer='Ich glaube';
  item.answers=[...new Set([...(item.answers||[]),'Ich glaube','Ich glaube.','Ich glaube …','Ich glaube...','ich glaube'])];
 }
}

/* Dieselben Varianten auch in allen anderen geführten Aufgaben zulassen. */
(data.tasks||[]).forEach(task=>(task.items||[]).forEach(item=>{
 const candidates=[item?.answer,item?.word,...(item?.answers||[])];
 if(candidates.some(value=>normalize(value)==='ich glaube')){
  item.answers=[...new Set([...(item.answers||[]),'Ich glaube','Ich glaube.','Ich glaube …','Ich glaube...','ich glaube'])];
 }
}));

/* Robuste Vergleichsfunktion. */
window.l6t4Exact=function(value,solutions){
 const input=normalize(value);
 const list=Array.isArray(solutions)?solutions:[solutions];
 if(input==='ich glaube'&&list.some(solution=>normalize(solution)==='ich glaube'))return true;
 return list.some(solution=>normalize(solution)===input);
};

/* Veraltete Medienfelder niemals innerhalb der Prüfung anzeigen. */
function clean(){
 if(new URLSearchParams(location.search).get('task')!=='exam')return;
 document.querySelectorAll('audio,.audio-file-panel,.audio-panel,.audio-load-error,.image-fallback').forEach(node=>node.remove());
}
clean();
new MutationObserver(clean).observe(document.documentElement,{childList:true,subtree:true});
})();