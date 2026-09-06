(function(){
'use strict';
const theme=Number(document.body?.dataset?.theme||0);const D=theme===3?window.L9T3:theme===4?window.L9T4:null;if(!D)return;
const ids=a=>(a||[]).map(x=>x?.id).filter(Boolean);
function itemIds(taskId){const t=(D.tasks||[]).find(x=>x.id===taskId);if(!t)return[];switch(t.kind){
 case'cards':case'word-image':case'audio-write':case'meaning-choice':case'audio-image':case'meaning-word':return ids(D.cards);
 case'article-word':case'plural-write':return ids(D.nouns||D.cards?.filter(x=>x.type==='noun'));
 case'conjugation-table':return ids(D.forms);
 case'gap-two':return ids(D.gaps);
 case'build-sentence':return ids(D.builders);
 case'modal-choice':return ids(D.modalItems);
 case'dialog-modal':return D.dialogModal?.id?[D.dialogModal.id]:[];
 case'reading-rules':return (D.readings||[]).flatMap(r=>ids(r.questions));
 case'dialog-gap':return ids(D.dialogGaps);
 case'phrase-scramble':return ids(D.phraseScrambles);
 case'context-choice':return ids(D.contextChoices);
 case'context-write':return ids(D.contextWrites);
 case'dialog-complete':return ids(D.dialogComplete);
 case'error-correction':return ids(D.errorCorrections);
 case'listening-doc':return ids(D.listeningDocs);
 case'perfect-write':return ids(D.perfectItems);
 case'transform-text':return ids(D.transformTexts);
 case'exam':return Array.from({length:12},(_,i)=>`exam${i+1}`);
 default:return[];
}}
D.itemIds=itemIds;
})();