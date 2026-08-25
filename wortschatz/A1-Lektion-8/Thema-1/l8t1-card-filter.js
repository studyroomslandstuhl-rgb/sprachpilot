(function(){
'use strict';
if(window.__SP_L8T1_CARD_FILTER_1)return;
window.__SP_L8T1_CARD_FILTER_1=true;
const blocked=new Set([
 'was bist du von beruf',
 'was sind sie von beruf',
 'was machst du beruflich',
 'was machen sie beruflich'
]);
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||item?.answer||item?.prompt||'').trim();
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||(Array.isArray(window.L8_ALL_THEMES)?window.L8_ALL_THEMES.find(t=>Number(t?.number)===1):null);
 if(!theme||!Array.isArray(theme.tasks))return themes;
 const cards=theme.tasks.find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));
 if(cards&&Array.isArray(cards.items))cards.items=cards.items.filter(item=>!blocked.has(norm(term(item))));
 return themes;
});
})();
