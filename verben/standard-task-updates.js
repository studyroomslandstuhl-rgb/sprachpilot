(function(){
'use strict';
if(window.__SP_VERB_STANDARD_TASK_UPDATES_V3)return;
window.__SP_VERB_STANDARD_TASK_UPDATES_V3=true;
const E=window.VerbGroupsEngine;
if(!E)return;
const MEANINGS=window.SP_VERB_A1_MEANINGS||{};
const clue=v=>MEANINGS[v]||'die Handlung auf dem Bild';
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function uniqueOptions(answer,pool,count=4){const seen=new Set([String(answer)]),rest=[];shuffle(pool).forEach(x=>{const k=String(x);if(!seen.has(k)){seen.add(k);rest.push(x)}});return shuffle([answer,...rest.slice(0,count-1)])}
function groupFor(id){return E.GROUPS.find(g=>Number(g.id)===Number(id))||E.GROUPS[Number(id)-1]}

// Die frühere Aufgabe „Lesen → Verb“ ist komplett entfernt.
const oldTaskIndex=E.TASKS.findIndex(t=>t[0]==='read-sentence');
if(oldTaskIndex>=0)E.TASKS.splice(oldTaskIndex,1);
const oldLearnIndex=E.LEARN.indexOf('read-sentence');
if(oldLearnIndex>=0)E.LEARN.splice(oldLearnIndex,1);
delete E.TASK_TITLE['read-sentence'];

// Hör-Aufgaben bleiben als Bildaufgaben erhalten.
const listen=E.TASKS.find(t=>t[0]==='listen');
if(listen){listen[1]='🔊→▣';listen[2]='Hören → Bild'}
const change=E.TASKS.find(t=>t[0]==='change');
if(change){change[1]='▣→🔊';change[2]='Bild → Hören'}
E.TASK_TITLE.listen='Hören → Bild';
E.TASK_TITLE.change='Bild → Hören';

const previous=E.question.bind(E);
E.question=function(groupId,task,v,personOverride=null){
 const group=groupFor(groupId),verbs=group?.verbs||[];
 if(task==='meaning-to-verb')return{kind:'mc',prompt:clue(v),answer:v,options:uniqueOptions(v,verbs),image:v};
 if(task==='verb-to-meaning')return{kind:'mc',prompt:`Was bedeutet „${v}“?`,answer:clue(v),options:uniqueOptions(clue(v),verbs.map(clue)),image:v};
 if(task==='listen')return{kind:'images',prompt:'Höre das Verb und wähle das richtige Bild.',answer:v,options:uniqueOptions(v,verbs),audio:v};
 if(task==='change')return{kind:'mc',prompt:'Welches gehörte Verb passt zum Bild?',answer:v,options:uniqueOptions(v,verbs),image:v,audioChoices:true};
 return previous(groupId,task,v,personOverride);
};
window.SPVerbSemanticClue=clue;
})();
