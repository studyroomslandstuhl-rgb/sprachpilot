(function(){'use strict';
const D=window.L11T2||{cards:[]};
const items=[...(D.cards||[]),...(D.prepositionCards||[])].map(w=>({id:w.id,term:w.full,full:w.full,plural:w.plural||'',type:w.type||'noun',image:w.image,audio:w.audio,audioFile:(w.audio||'').split('/').pop()||'',translations:w.translations||{}}));
window.L8_THEME={number:2,title:'Unterwegs mit Verkehrsmitteln',tasks:[{id:'karteikarten',kind:'cards',title:'Karteikarten',items}]};
window.L8_OVERVIEW_CONTEXT={lesson:11,subtitle:'Wortschatzübersicht · Unterwegs mit Verkehrsmitteln · A1 Lektion 11 · Thema 2'};
window.L8_CONTENT_READY=Promise.resolve(window.L8_THEME);
})();