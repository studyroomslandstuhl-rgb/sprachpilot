(function(){
'use strict';
if(window.__SP_L8T1_CONTENT_RULES_V2)return;window.__SP_L8T1_CONTENT_RULES_V2=true;
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const nonProfessions=['patient','patientin','schuler','schulerin','student','studentin'];
const isNonProfession=v=>nonProfessions.some(x=>norm(v).includes(x));
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(value=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||window.L8_THEME;if(!theme)return value;
 const byId=id=>(theme.tasks||[]).find(t=>t.id===id);
 for(const id of ['berufe-bild-v3','berufspaare-v3']){const t=byId(id);if(t)t.items=(t.items||[]).filter(item=>!isNonProfession(item.answer))}
 const article=byId('berufe-artikel-v3');if(article)article.items=(article.items||[]).filter(item=>!isNonProfession(item.prompt));
 const interview=byId('berufsfragen-antworten-v4');if(interview)interview.items=(interview.items||[]).filter(item=>!isNonProfession(item.job));
 const order=byId('beruf-saetze-ordnen-v3');if(order)for(const item of order.items||[]){const answer=Array.isArray(item.answer)?String(item.answer[0]||''):String(item.answer||'');if(/ich studiere medizin/i.test(answer)){item.tokens=['Ich','studiere.'];item.answer=['Ich studiere.'];item.prompt='Bilde den richtigen Satz.'}}
 const cards=byId('karteikarten');if(cards){cards.items=(cards.items||[]).filter(item=>!/praktikant/i.test(String(item.term||item.word||item.full||'')));const studieren=cards.items.find(item=>norm(item.term||item.word||item.full)==='studieren');if(studieren)studieren.example='Ich studiere.'}
 for(const task of theme.tasks||[])for(const item of task.items||[]){for(const key of ['prompt','context','audio'])if(typeof item[key]==='string'){item[key]=item[key].replace(/Ich studiere Medizin\./g,'Ich studiere.').replace(/Ich bin Student\. Ich ___ Medizin\./g,'Ich bin Student. Ich ___.')}}
 theme.contentRulesRevision='l8t1-content-rules-v2';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return value;
});
})();