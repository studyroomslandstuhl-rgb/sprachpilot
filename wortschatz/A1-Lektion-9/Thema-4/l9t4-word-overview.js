(function(){
'use strict';
if(!window.SPWordOverviewStandard)return;
const items=window.L9_T4_WORDS||window.L9T4?.cards||window.L9_THEMES?.[4]?.coreVocabulary||[];
const tr=window.L9T4Translations||{};
window.SPWordOverviewStandard.render({root:'#app',items,title:'Wörter aus Thema 4',description:'Hier siehst und hörst du die Wörter aus diesem Thema.',translationLabel:tr.label||'Englisch',headerSubtitle:'Wortschatzübersicht · Bei der Behörde · A1 Lektion 9 · Thema 4'});
})();