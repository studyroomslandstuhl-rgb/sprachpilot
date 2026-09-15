(function(){
'use strict';
const D=window.L11T1||{cards:[],phrases:[]};
const sourceLabel=s=>s==='both'?'Buch + Unterricht':s==='book'?'Buch':'Unterricht';
const verbIds=new Set(['fliegen','abbiegen']);
const adverbIds=new Set(['geradeaus','links','rechts','in_der_naehe']);
const adjectiveIds=new Set(['fremd']);
const phraseIds=new Set(['erste_strasse','zweite_strasse','dritte_strasse','vierte_strasse']);
const items=(D.cards||[]).map(w=>({
 id:w.id,
 term:w.full,
 full:w.full,
 plural:w.plural||'',
 type:w.article?'noun':verbIds.has(w.id)?'verb':adjectiveIds.has(w.id)?'adjective':adverbIds.has(w.id)?'adverb':phraseIds.has(w.id)?'phrase':'other',
 detail:sourceLabel(w.source),
 image:w.image,
 audio:w.audio,
 audioFile:(w.audio||'').split('/').pop()||'',
 translations:w.translations||{}
}));
(D.phrases||[]).forEach((p,i)=>items.push({
 id:'redemittel_'+(i+1),
 term:p,
 full:p,
 type:'phrase',
 detail:'Redemittel',
 image:'',
 audio:'',
 translations:{}
}));
window.L8_THEME={number:1,title:'In der Stadt unterwegs',tasks:[{id:'karteikarten',kind:'cards',title:'Karteikarten',items}]};
window.L8_OVERVIEW_CONTEXT={lesson:11,subtitle:'Wortschatzübersicht · In der Stadt unterwegs · A1 Lektion 11 · Thema 1'};
window.L8_CONTENT_READY=Promise.resolve(window.L8_THEME);
})();
