(function(){
'use strict';
if(!window.SPWordOverviewStandard)return;
const items=window.L9_T5_WORDS||window.L9T5?.cards||window.L9_THEMES?.[5]?.coreVocabulary||[];
const tr=window.L9T5Translations||{};
window.SPWordOverviewStandard.render({root:'#app',items,title:'Wörter aus Thema 5',description:'Hier siehst und hörst du die Behörden, Unterlagen und festen Verbindungen aus diesem Thema.',translationLabel:tr.label||'Englisch',headerSubtitle:'Wortschatzübersicht · Welche Behörde brauche ich? · A1 Lektion 9 · Thema 5'});
})();