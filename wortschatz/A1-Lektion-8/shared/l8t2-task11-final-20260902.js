(function(){
'use strict';
if(window.__SP_L8T2_TASK11_FINAL_20260902_V1)return;
window.__SP_L8T2_TASK11_FINAL_20260902_V1=true;

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
  'Im Restaurant habe ich viel ___ gesammelt.',
  ['Berufserfahrung','Erfahrung'],
  'Beide Synonyme sind richtig: Berufserfahrung oder Erfahrung.'
 ));
 add(['das Praktikum','Praktikum'],input(
  'Nach der Ausbildung mache ich ein ___ in einem Hotel.',
  'Praktikum',
  'Das Wort wurde in den Karteikarten gelernt.'
 ));
 add(['das Diplom','Diplom'],input(
  'Das Dokument aus meiner Ausbildung heißt ___.',
  'Diplom',
  'Das Wort wurde in den Karteikarten gelernt.'
 ));
 add(['die Abteilung','Abteilung'],input(
  'Ich arbeite in einer kleinen ___ der Firma.',
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
  'Jetzt arbeite ich im Café. ___ möchte ich in einem Restaurant arbeiten.',
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
  'Hier bedeutet das Wort: anwesend.'
 ));
 add(['zur Verfügung stehen','zur Verfuegung stehen'],input(
  'Der Computer soll den Mitarbeitern ___.',
  ['zur Verfügung stehen','zur Verfuegung stehen'],
  'Schreibe die ganze Redewendung.'
 ));

 return items.filter(item=>{
  const text=norm(`${item.prompt} ${(item.answer||[]).join(' ')}`);
  return !FORBIDDEN.some(word=>text.includes(word));
 });
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const task=theme.tasks.find(t=>['biografien-luecken','wortschatz-im-kontext-v2','wortschatz-im-kontext-v3'].includes(String(t?.id||'')))
   || theme.tasks.find(t=>String(t?.title||'').toLowerCase()==='wörter im kontext');
 if(!task)return theme;
 const items=build(theme);
 task.id='wortschatz-im-kontext-v3';
 task.title='Wörter im Kontext';
 task.instruction='Ergänze nur Wörter, die du in den Karteikarten von Thema 2 gelernt hast.';
 task.kind='input';task.icon='✍️';task.emoji='✍️';delete task.intro;delete task.emailLayout;
 task.items=items;
 task.spVocabularySource='cards-only';
 task.forbiddenVocabulary=[...FORBIDDEN];
 theme.contentRevision=String(theme.contentRevision||'')+'-task11-final-cards-only-v1';
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
window.L8T2Task11Final20260902={apply,build,version:1};
})();
