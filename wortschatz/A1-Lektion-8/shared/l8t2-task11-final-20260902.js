(function(){
'use strict';
if(window.__SP_L8T2_TASK11_EMAIL_FINAL_20260902_V4)return;
window.__SP_L8T2_TASK11_EMAIL_FINAL_20260902_V4=true;

const FORBIDDEN=['arbeitgeberin','lebenslauf','studium','anschreiben','zeugnis','zeugnisse'];
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').toLowerCase().replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
const lexical=v=>norm(v).replace(/^(der|die|das)\s+/,'').split(' – ')[0].trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const blank=answers=>({answers:Array.isArray(answers)?answers:[answers]});

function cards(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function learned(theme){
 const set=new Set();
 for(const item of cards(theme)?.items||[]){
  const raw=term(item),n=lexical(raw);if(n)set.add(n);
  for(const a of item?.answers||[])set.add(lexical(a));
  for(const a of item?.accepted||[])set.add(lexical(a));
 }
 return set;
}
function has(set,...keys){return keys.some(k=>set.has(lexical(k)))}
function validEmail(item){
 const text=norm(`${(item.lines||[]).join(' ')} ${(item.blanks||[]).flatMap(b=>b.answers||[]).join(' ')}`);
 return !FORBIDDEN.some(word=>text.includes(word));
}

function build(theme){
 const known=learned(theme);
 const canPraktikum=has(known,'das Praktikum','Praktikum');
 const canDiplom=has(known,'das Diplom','Diplom');
 const canAbteilung=has(known,'die Abteilung','Abteilung');
 const canErfahrung=has(known,'die Berufserfahrung','Berufserfahrung');
 if(!(canPraktikum&&canDiplom&&canAbteilung&&canErfahrung))return [];

 const items=[
  {
   type:'dialog-blanks',
   wordBank:['Abteilung','Praktikum','Berufserfahrung / Erfahrung'],
   lines:[
    'An: personal@restaurant-mitte.de',
    'Von: maria@email.de',
    'Betreff: Arbeit im Restaurant',
    '',
    'Sehr geehrte Frau Klein,',
    '',
    'ich möchte gern bei Ihnen arbeiten.',
    'Ich habe ein {{0}} in einem Restaurant gemacht.',
    'Dort habe ich viel {{1}} gesammelt.',
    'Ich möchte gern in Ihrer {{2}} arbeiten.',
    '',
    'Mit freundlichen Grüßen',
    'Maria Petrenko'
   ],
   blanks:[
    blank('Praktikum'),
    blank(['Berufserfahrung','Erfahrung']),
    blank('Abteilung')
   ]
  },
  {
   type:'dialog-blanks',
   wordBank:['Diplom','Berufserfahrung / Erfahrung','Praktikum'],
   lines:[
    'An: personal@hotel-stadt.de',
    'Von: emre@email.de',
    'Betreff: Arbeit im Hotel',
    '',
    'Sehr geehrter Herr Weber,',
    '',
    'ich interessiere mich für die Arbeit in Ihrem Hotel.',
    'Nach meiner Ausbildung habe ich ein {{0}} bekommen.',
    'Danach habe ich ein {{1}} in einem Hotel gemacht.',
    'Dort habe ich viel {{2}} gesammelt.',
    '',
    'Mit freundlichen Grüßen',
    'Emre Kaya'
   ],
   blanks:[
    blank('Diplom'),
    blank('Praktikum'),
    blank(['Berufserfahrung','Erfahrung'])
   ]
  },
  {
   type:'dialog-blanks',
   wordBank:['Berufserfahrung / Erfahrung','Abteilung','Diplom'],
   lines:[
    'An: personal@firma-koeln.de',
    'Von: olena@email.de',
    'Betreff: Arbeit in Ihrer Firma',
    '',
    'Sehr geehrte Frau Berger,',
    '',
    'ich möchte gern bei Ihnen arbeiten.',
    'Ich arbeite jetzt in einer {{0}} einer Firma.',
    'Nach meiner Ausbildung habe ich mein {{1}} bekommen.',
    'Ich habe schon viel {{2}} gesammelt.',
    '',
    'Mit freundlichen Grüßen',
    'Olena Bondar'
   ],
   blanks:[
    blank('Abteilung'),
    blank('Diplom'),
    blank(['Berufserfahrung','Erfahrung'])
   ]
  }
 ];
 return items.filter(validEmail);
}

function visibleTask11(theme){
 const normalIndexes=[];
 theme.tasks.forEach((task,index)=>{if(!task?.exam)normalIndexes.push(index)});
 const index=normalIndexes[10];
 if(Number.isInteger(index))return{index,task:theme.tasks[index]};
 return null;
}

function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const slot=visibleTask11(theme);if(!slot)return theme;
 const items=build(theme);if(!items.length)return theme;
 const replacement={
  ...slot.task,
  id:'bewerbung-email-luecken-v2',
  title:'E-Mails ergänzen',
  instruction:'Ergänze die E-Mails nur mit Wörtern aus den Karteikarten von Thema 2.',
  kind:'dialog-blanks',icon:'📧',emoji:'📧',emailLayout:true,
  items,
  spVocabularySource:'cards-only',
  forbiddenVocabulary:[...FORBIDDEN]
 };
 delete replacement.intro;delete replacement.sections;delete replacement.audio;delete replacement.audioFile;
 theme.tasks.splice(slot.index,1,replacement);
 theme.contentRevision=String(theme.contentRevision||'')+'-visible-task11-email-cards-only-v4';
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
window.L8T2Task11Final20260902={apply,build,visibleTask11,version:4};
})();
