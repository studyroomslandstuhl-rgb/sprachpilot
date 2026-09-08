(function(){
'use strict';
const D=window.L10T1;if(!D||!Array.isArray(D.tasks))return;
const additions=[
 {id:'artikel-sortieren',kind:'cards',title:'der · die · das',icon:'🧲',text:'Ziehe jedes Wort in die richtige Artikel-Spalte.'},
 {id:'gesicht-koerper',kind:'cards',title:'Gesicht oder Körper',icon:'🙂',text:'Ziehe jedes Wort zu „das Gesicht“ oder „der Körper“.'}
];
const examIndex=Math.max(0,D.tasks.findIndex(t=>t.exam));
for(const task of additions){
 if(D.tasks.some(t=>t.id===task.id))continue;
 const i=D.tasks.findIndex(t=>t.exam);
 D.tasks.splice(i<0?D.tasks.length:i,0,task);
}
D.dragGroups={
 face:new Set(['mund','ohr','auge','zahn','nase','gesicht','haar','augenbraue','stirn','wimper','zunge','backe','lippe','kinn','augenlid','schnurrbart','bart'])
};
})();
