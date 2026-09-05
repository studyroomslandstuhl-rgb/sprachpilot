(function(){
'use strict';
const theme=window.L9_THEMES?.[2]||window.L9_THEMES?.['2'];
if(!theme)return;
const cards=(theme.coreVocabulary||[]).map(item=>({
 ...item,
 meaning:item.section||'',
 answers:[item.full,item.word].filter(Boolean)
}));
window.L9T2={
 title:theme.title||'Mach das bitte!',
 subtitle:theme.subtitle||'',
 cards,
 tasks:[{
  id:'karteikarten',
  kind:'cards',
  icon:'🃏',
  emoji:'🃏',
  title:'Karteikarten',
  instruction:'Lerne die Wörter.',
  items:cards
 }]
};
})();
