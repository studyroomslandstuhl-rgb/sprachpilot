(function(){
'use strict';
if(window.__SP_L8T2_TASK11_FINAL_20260902_V3)return;
window.__SP_L8T2_TASK11_FINAL_20260902_V3=true;

const FORBIDDEN=['arbeitgeberin','lebenslauf','studium','anschreiben','zeugnis','zeugnisse'];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
const lexical=v=>norm(v).replace(/^(der|die|das)\s+/,'').split(' – ')[0].trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const input=(prompt,answer,hint='')=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],hint});

function cards(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function learned(theme){
 const set=new Set();
 for(const item of cards(theme)?.items||[]){
  const raw=term(item),n=lexical(raw);if(!n)continue;set.add(n);
  for(const a of item?.answers||[])set.add(lexical(a));
  for(const a of item?.accepted||[])set.add(lexical(a));
 }
 return set;
}
function has(set,...keys){return keys.some(k=>set.has(lexical(k)))}

function build(theme){
 const known=learned(theme),items=[];
 const add=(keys,item)=>{if(has(known,...keys))items.push(item)};

 add(['die Berufserfahrung','Berufserfahrung'],input(
  'Ich habe viel ___ gesammelt.',
  ['Berufserfahrung','Erfahrung'],
  'Beide Antworten sind richtig: Berufserfahrung oder Erfahrung.'
 ));
 add(['das Praktikum','Praktikum'],input(
  'Ich mache ein ___ bei einer Firma.',
  'Praktikum',
  'Das Wort wurde in den Karteikarten gelernt.'
 ));
 add(['das Diplom','Diplom'],input(
  'Nach der Ausbildung bekomme ich ein ___.',
  'Diplom',
  'Das Wort wurde in den Karteikarten gelernt.'
 ));
 add(['die Abteilung','Abteilung'],input(
  'Ich arbeite in einer ___ in der Firma.',
  'Abteilung',
  'Das Wort wurde in den Karteikarten gelernt.'
 ));
 add(['die Ausbildung','Ausbildung'],input(
  'Sie macht eine ___ als Köchin.',
  'Ausbildung',
  'Nomen aus den Karteikarten.'
 ));
 add(['die Stelle','Stelle'],input(
  'Maria sucht eine neue ___ als Kellnerin.',
  'Stelle',
  'Nomen aus den Karteikarten.'
 ));
 add(['die Firma','Firma'],input(
  'Er arbeitet seit zwei Jahren bei einer ___.',
  'Firma',
  'Nomen aus den Karteikarten.'
 ));
 add(['dauern'],input(
  'Wie lange soll die Ausbildung ___?',
  'dauern',
  'Grundform des Verbs.'
 ));
 add(['zeigen'],input(
  'Kannst du mir die Arbeit ___?',
  'zeigen',
  'Grundform des Verbs.'
 ));
 add(['gerade'],input(
  'Ich arbeite ___ in einem Café.',
  'gerade',
  'Alternative für „jetzt“.'
 ));
 add(['später'],input(
  'Jetzt arbeite ich im Café. ___ arbeite ich im Restaurant.',
  ['Später','später'],
  'Nicht jetzt, sondern später.'
 ));
 add(['eigentlich'],input(
  'Was machst du ___ beruflich?',
  'eigentlich',
  'Adverb aus den Karteikarten.'
 ));
 add(['heiraten'],input(
  'Möchtest du später ___?',
  'heiraten',
  'Grundform des Verbs.'
 ));
 add(['da'],input(
  'Ist dein Chef heute ___?',
  'da',
  'Das Wort aus den Karteikarten.'
 ));
 add(['zur Verfügung stehen','zur Verfuegung stehen'],input(
  'Der Computer soll mir ___.',
  ['zur Verfügung stehen','zur Verfuegung stehen'],
  'Schreibe die ganze Redewendung.'
 ));

 return items.filter(item=>{
  const text=norm(`${item.prompt} ${(item.answer||[]).join(' ')}`);
  return !FORBIDDEN.some(word=>text.includes(word));
 });
}

function visibleTask11(theme){
 const normalIndexes=[];
 theme.tasks.forEach((task,index)=>{if(!task?.exam)normalIndexes.push(index)});
 const index=normalIndexes[10];
 if(Number.isInteger(index))return{index,task:theme.tasks[index]};
 const fallbackIndex=theme.tasks.findIndex(t=>['bewerbung-lueckentext','biografien-luecken','wortschatz-im-kontext-v2','wortschatz-im-kontext-v3','wortschatz-im-kontext-v4','wortschatz-im-kontext-v5'].includes(String(t?.id||'')));
 return fallbackIndex>=0?{index:fallbackIndex,task:theme.tasks[fallbackIndex]}:null;
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const slot=visibleTask11(theme);if(!slot)return theme;
 const items=build(theme);
 const replacement={
  ...slot.task,
  id:'wortschatz-im-kontext-v5',
  title:'Wörter im Kontext',
  instruction:'Ergänze nur Wörter, die du in den Karteikarten von Thema 2 gelernt hast.',
  kind:'input',icon:'✍️',emoji:'✍️',
  items,
  spVocabularySource:'cards-only',
  forbiddenVocabulary:[...FORBIDDEN]
 };
 delete replacement.intro;delete replacement.emailLayout;delete replacement.sections;delete replacement.audio;delete replacement.audioFile;
 theme.tasks.splice(slot.index,1,replacement);
 theme.contentRevision=String(theme.contentRevision||'')+'-visible-task11-final-cards-only-v3';
 return theme;
}

const previous=window.L8_CONTENT_READY;
window.L8_T2_TASK11_FINAL_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 const theme=all[2]||all['2']||(Array.isArray(all)?all.find(t=>Number(t?.number)===2):null);
 apply(theme);
 if(Number(document.body?.dataset?.theme||0)===2&&theme)window.L8_THEME=theme;
 return themes;
});
window.L8_CONTENT_READY=window.L8_T2_TASK11_FINAL_READY;
window.L8T2Task11Final20260902={apply,build,visibleTask11,version:3};
})();
