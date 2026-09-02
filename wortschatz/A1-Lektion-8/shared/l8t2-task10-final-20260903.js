(function(){
'use strict';
if(window.__SP_L8T2_TASK10_FINAL_20260903_V1)return;
window.__SP_L8T2_TASK10_FINAL_20260903_V1=true;

const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
const lexical=v=>norm(v).replace(/^(der|die|das)\s+/,'').split(' – ')[0].trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
function cards(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function learned(theme){
 const set=new Set();
 for(const item of cards(theme)?.items||[]){
  const values=[term(item),...(item?.answers||[]),...(item?.accepted||[])];
  for(const value of values){const key=lexical(value);if(key)set.add(key)}
 }
 return set;
}
function hasAll(set,keys){return keys.every(k=>set.has(lexical(k)))}
const choice=(prompt,options,answer)=>({type:'choice',prompt,options:[...options],answer});

const SPECS=[
 {keys:['Praktikum','Diplom','Abteilung'],item:choice('Ich mache ein ___ in einem Hotel.',['Praktikum','Diplom','Abteilung'],'Praktikum')},
 {keys:['Diplom','Praktikum','Stelle'],item:choice('Nach der Ausbildung bekomme ich ein ___.',['Diplom','Praktikum','Stelle'],'Diplom')},
 {keys:['Abteilung','Praktikum','Diplom'],item:choice('Ich arbeite in einer ___ der Firma.',['Abteilung','Praktikum','Diplom'],'Abteilung')},
 {keys:['Berufserfahrung','Praktikum','Diplom'],item:choice('Im Restaurant habe ich viel ___ gesammelt.',['Berufserfahrung','Praktikum','Diplom'],'Berufserfahrung')},
 {keys:['dauern','zeigen','heiraten'],item:choice('Wie lange soll der Kurs ___?',['dauern','zeigen','heiraten'],'dauern')},
 {keys:['zeigen','dauern','heiraten'],item:choice('Kannst du mir die Arbeit ___?',['zeigen','dauern','heiraten'],'zeigen')},
 {keys:['heiraten','zeigen','dauern'],item:choice('Möchtest du später ___?',['heiraten','zeigen','dauern'],'heiraten')},
 {keys:['gerade','später','da'],item:choice('Ich arbeite genau jetzt, also ___, in einem Café.',['gerade','später','da'],'gerade')},
 {keys:['später','gerade','da'],item:choice('Nicht jetzt. Ich mache das ___.',['später','gerade','da'],'später')},
 {keys:['da','gerade','später'],item:choice('Ist dein Chef heute ___?',['da','gerade','später'],'da')},
 {keys:['zur Verfügung stehen','zeigen','dauern'],item:choice('Der Computer soll mir ___.',['zur Verfügung stehen','zeigen','dauern'],'zur Verfügung stehen')}
];

function build(theme){
 const known=learned(theme);
 return SPECS.filter(spec=>hasAll(known,spec.keys)).map(spec=>({...spec.item,options:[...spec.item.options]}));
}
function visibleTask10(theme){
 const normalIndexes=[];
 theme.tasks.forEach((task,index)=>{if(!task?.exam)normalIndexes.push(index)});
 const index=normalIndexes[9];
 return Number.isInteger(index)?{index,task:theme.tasks[index]}:null;
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const slot=visibleTask10(theme);if(!slot)return theme;
 const replacement={
  ...slot.task,
  id:'l8t2-wortschatz-auswahl-v1',
  title:'Wortschatz auswählen',
  instruction:'Wähle das passende Wort. Alle drei Wörter kennst du aus den Karteikarten.',
  kind:'choice',icon:'✅',emoji:'✅',
  items:build(theme),
  spVocabularySource:'cards-only'
 };
 delete replacement.intro;delete replacement.emailLayout;delete replacement.sections;delete replacement.audio;delete replacement.audioFile;delete replacement.formFields;delete replacement.scrambledHelp;
 theme.tasks.splice(slot.index,1,replacement);
 theme.contentRevision=String(theme.contentRevision||'')+'-visible-task10-choice-cards-only-v1';
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T2_TASK10_FINAL_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK10_FINAL_READY;
window.L8T2Task10Final20260903={apply,build,visibleTask10,version:1};
})();
