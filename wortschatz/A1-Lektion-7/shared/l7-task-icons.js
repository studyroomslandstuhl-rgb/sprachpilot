(function(){
'use strict';
if(window.__SP_L7_TASK_ICONS_V1)return;
window.__SP_L7_TASK_ICONS_V1=true;
const T3={
 'karteikarten':'📚','t3-partizip-finden-v2':'✅','t3-memory-v2':'🧠','t3-partizip-bauen-v2':'🧩','t3-endungen-v2':'📦','t3-partizip-schreiben-v2':'✍️','t3-hoeren-partizip-v2':'🎧','t3-sein-v2':'🔤','t3-grammatik-v2':'🧲','t3-saetze-v2':'🧩','t3-saetze-schreiben-v2':'✍️','t3-haben-sein-v2':'⚖️','t3-text-umschreiben-v2':'✍️','t3-fehler-korrigieren-v2':'✅','t3-lesen-v2':'📖','t3-lueckentext-v2':'✍️','t3-pruefung-v2':'⭐'
};
function byMeaning(task){
 const id=String(task?.id||'').toLowerCase(),title=String(task?.title||'').toLowerCase(),kind=String(task?.kind||'').toLowerCase(),text=`${id} ${title} ${kind}`;
 if(task?.exam||/prüfung|pruefung|exam/.test(text))return'⭐';
 if(/karte|card/.test(text))return'📚';
 if(/memory/.test(text))return'🧠';
 if(/hör|hoer|listen|audio/.test(text))return'🎧';
 if(/lesen|reading|text.*versteh/.test(text))return'📖';
 if(/grammatik|grammar|satzteil/.test(text))return'🧲';
 if(/konjug|\bsein\b|\bhaben\b/.test(text))return'🔤';
 if(/endung|gruppe|sort|zuord/.test(text))return'📦';
 if(/ordnen|order|reihenfolge|redemittel/.test(text))return'🧩';
 if(/schreib|write|lücke|luecke|text|brief|information|markier|plural/.test(text))return'✍️';
 if(/wahl|choice|artikel|richtig|falsch|überschrift|ueberschrift|fehler/.test(text))return'✅';
 return'✅';
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const number=Number(document.body.dataset.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||0);
 theme.tasks.forEach(task=>{task.icon=number===3?(T3[task.id]||byMeaning(task)):byMeaning(task)});
 theme.iconRevision='l7-task-icons-t3t4-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
