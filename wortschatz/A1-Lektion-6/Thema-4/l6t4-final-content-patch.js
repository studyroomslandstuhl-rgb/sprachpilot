(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;
const clean=value=>String(value||'').toLowerCase().trim();
if(!(data.vocabulary||[]).some(item=>clean(item.word)==='es macht spaß.')){
 data.vocabulary.push({id:'es-macht-spass',word:'Es macht Spaß.',meaning:'Etwas ist schön und man macht es gern.',image:'spass.webp',example:'Tanzen? Es macht Spaß.'});
}
const redemittel=(data.overviewGroups||[]).find(group=>group.title==='Redemittel');
if(redemittel&&!redemittel.words.includes('Es macht Spaß.'))redemittel.words.push('Es macht Spaß.');
const phrases=(data.tasks||[]).find(task=>task.id==='phrases');
(phrases?.items||[]).forEach(item=>{
 if(item.answer==='Das macht Spaß.')item.answer='Es macht Spaß.';
 item.options=(item.options||[]).map(option=>option==='Das macht Spaß.'?'Es macht Spaß.':option);
 if(Array.isArray(item.dialog))item.dialog.forEach(line=>{line.text=String(line.text||'').replace('Das macht Spaß.','Es macht Spaß.')});
});
})();