(function(){
'use strict';
const D=window.L11T1||{cards:[]};
const M=window.L11T1SourceMode;
const selected=M?.activeCards?.()||D.cards||[];
const items=selected.map(w=>({
 id:w.id,
 term:w.full,
 full:w.full,
 plural:w.plural||'',
 type:'other',
 detail:w.source==='book'?'Buch':'Unterricht',
 source:w.source,
 image:w.image,
 audio:w.audio,
 audioFile:(w.audio||'').split('/').pop()||'',
 translations:w.translations||{}
}));
window.L8_THEME={number:1,title:'In der Stadt unterwegs',tasks:[{id:'karteikarten',kind:'cards',title:'Karteikarten',items}]};
window.L8_OVERVIEW_CONTEXT={lesson:11,subtitle:'Wortschatzübersicht · In der Stadt unterwegs · A1 Lektion 11 · Thema 1'};
window.L8_CONTENT_READY=Promise.resolve(window.L8_THEME);
})();