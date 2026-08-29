(function(){
'use strict';
if(window.__SP_L8T1_CONTENT_RULES_V1)return;window.__SP_L8T1_CONTENT_RULES_V1=true;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const nonProfessions=['patient','patientin','schuler','schulerin','student','studentin'];
const isNonProfession=v=>nonProfessions.some(x=>norm(v).includes(x));
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;if(!theme)return value;
 const byId=id=>(theme.tasks||[]).find(t=>t.id===id);
 for(const id of ['berufe-bild-v3','berufspaare-v3']){const t=byId(id);if(t)t.items=(t.items||[]).filter(item=>!isNonProfession(item.answer))}
 const article=byId('berufe-artikel-v3');if(article)article.items=(article.items||[]).filter(item=>!isNonProfession(item.prompt));
 const interview=byId('berufsfragen-antworten-v4');if(interview)interview.items=(interview.items||[]).filter(item=>!isNonProfession(item.job));
 const cards=byId('karteikarten');if(cards){cards.items=(cards.items||[]).filter(item=>!/praktikant/i.test(String(item.term||item.word||item.full||'')));const studieren=cards.items.find(item=>norm(item.term||item.word||item.full)==='studieren');if(studieren)studieren.example='Ich studiere.'}
 for(const task of theme.tasks||[])for(const item of task.items||[]){for(const key of ['prompt','context','audio'])if(typeof item[key]==='string'){item[key]=item[key].replace(/Ich studiere Medizin\./g,'Ich studiere.').replace(/Ich bin Student\. Ich ___ Medizin\./g,'Ich bin Student. Ich ___.')}}
 theme.contentRulesRevision='l8t1-content-rules-v1';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return value;
});
})();