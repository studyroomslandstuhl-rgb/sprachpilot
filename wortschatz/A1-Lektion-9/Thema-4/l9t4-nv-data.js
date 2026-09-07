(function(){
'use strict';
const D=window.L9T4;if(!D)return;
D.nounVerbPairs=[
 {id:'nv01',noun:'Geld',verb:'verdienen',full:'Geld verdienen'},
 {id:'nv02',noun:'eine Sprachschule',verb:'besuchen',full:'eine Sprachschule besuchen'},
 {id:'nv03',noun:'eine Reise',verb:'machen',full:'eine Reise machen'},
 {id:'nv04',noun:'ein Visum',verb:'beantragen',full:'ein Visum beantragen'},
 {id:'nv05',noun:'den Reisepass',verb:'mitbringen',full:'den Reisepass mitbringen'},
 {id:'nv06',noun:'eine Versicherung',verb:'abschließen',full:'eine Versicherung abschließen'},
 {id:'nv07',noun:'eine Auskunft',verb:'bekommen',full:'eine Auskunft bekommen'},
 {id:'nv08',noun:'eine Erlaubnis',verb:'brauchen',full:'eine Erlaubnis brauchen'},
 {id:'nv09',noun:'ein Dokument',verb:'unterschreiben',full:'ein Dokument unterschreiben'},
 {id:'nv10',noun:'einen Einkommensnachweis',verb:'vorlegen',full:'einen Einkommensnachweis vorlegen'}
];
const task={id:'nomen-verb-verbindungen',kind:'noun-verb-match',title:'Nomen-Verb-Verbindungen',description:'Ziehe die passenden Verben zu den Nomen.',instruction:'Ziehe die passenden Verben zu den Nomen.',icon:'🔗'};
D.tasks=(D.tasks||[]).filter(t=>t.id!==task.id);
const examIndex=D.tasks.findIndex(t=>t.exam||t.id==='pruefung');
if(examIndex>=0)D.tasks.splice(examIndex,0,task);else D.tasks.push(task);
if(window.L9_THEMES?.[4])window.L9_THEMES[4].tasks=D.tasks;
})();
