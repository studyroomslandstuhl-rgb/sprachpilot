(function(){
'use strict';
if(window.__SP_L8T1_PEDAGOGY_REBUILD_V1)return;window.__SP_L8T1_PEDAGOGY_REBUILD_V1=true;
const clone=value=>JSON.parse(JSON.stringify(value));
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
const term=item=>String(item?.term||item?.full||item?.word||item?.answer||'').trim();
const PROFESSIONS=[
 {m:'der Physiotherapeut',f:'die Physiotherapeutin',pm:'die Physiotherapeuten',pf:'die Physiotherapeutinnen',place:'in einer Praxis'},
 {m:'der Hausmeister',f:'die Hausmeisterin',pm:'die Hausmeister',pf:'die Hausmeisterinnen',place:'in einer Schule'},
 {m:'der Arzthelfer',f:'die Arzthelferin',pm:'die Arzthelfer',pf:'die Arzthelferinnen',place:'in einer Praxis'},
 {m:'der Arzt',f:'die Ärztin',pm:'die Ärzte',pf:'die Ärztinnen',place:'in einem Krankenhaus'},
 {m:'der Mechatroniker',f:'die Mechatronikerin',pm:'die Mechatroniker',pf:'die Mechatronikerinnen',place:'bei einer Firma'},
 {m:'der Polizist',f:'die Polizistin',pm:'die Polizisten',pf:'die Polizistinnen',place:'bei der Polizei'},
 {m:'der Krankenpfleger',f:'die Krankenpflegerin',pm:'die Krankenpfleger',pf:'die Krankenpflegerinnen',place:'in einem Krankenhaus'},
 {m:'der Lehrer',f:'die Lehrerin',pm:'die Lehrer',pf:'die Lehrerinnen',place:'in einer Schule'},
 {m:'der Schauspieler',f:'die Schauspielerin',pm:'die Schauspieler',pf:'die Schauspielerinnen',place:'am Theater'},
 {m:'der Bäcker',f:'die Bäckerin',pm:'die Bäcker',pf:'die Bäckerinnen',place:'in einer Bäckerei'},
 {m:'der Koch',f:'die Köchin',pm:'die Köche',pf:'die Köchinnen',place:'in einem Restaurant'},
 {m:'der Friseur',f:'die Friseurin',pm:'die Friseure',pf:'die Friseurinnen',place:'in einem Salon'},
 {m:'der Chef',f:'die Chefin',pm:'die Chefs',pf:'die Chefinnen',place:'bei einer Firma'},
 {m:'der Journalist',f:'die Journalistin',pm:'die Journalisten',pf:'die Journalistinnen',place:'bei einer Zeitung'},
 {m:'der Taxifahrer',f:'die Taxifahrerin',pm:'die Taxifahrer',pf:'die Taxifahrerinnen',place:'bei einer Taxifirma'}
];
const QUESTION_FORMS=['Was bist du von Beruf?','Was machst du beruflich?','Was sind Sie von Beruf?','Was machen Sie beruflich?'];
function article(value){return String(value||'').trim().split(/\s+/)[0]||''}
function withoutArticle(value){return String(value||'').replace(/^(der|die|das)\s+/i,'').trim()}
function jobWord(value){return withoutArticle(value)}
function options(answer,pool,index,count=4){const out=[answer];for(let step=1;out.length<count&&step<pool.length+2;step++){const v=pool[(index+step*3)%pool.length];if(v&&!out.includes(v))out.push(v)}return out}
function cardTask(theme){return (theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''))}
function cardMap(cards){const map=new Map();for(const item of cards?.items||[]){const key=norm(term(item));if(key)map.set(key,item)}return map}
function imageFor(map,value){const exact=map.get(norm(value));if(exact?.image||exact?.img)return exact.image||exact.img;const noun=norm(withoutArticle(value));for(const [key,item] of map.entries())if(key===noun||key.endsWith(' '+noun)||noun.endsWith(' '+key))return item.image||item.img||'';return''}
function imageProfessionItems(map){
 const malePool=PROFESSIONS.map(x=>x.m),femalePool=PROFESSIONS.map(x=>x.f),items=[];
 PROFESSIONS.forEach((p,index)=>{
  const maleImage=imageFor(map,p.m),femaleImage=imageFor(map,p.f);
  items.push({type:'choice',image:maleImage,prompt:'Welcher Beruf passt?',options:options(p.m,malePool,index),answer:p.m,hint:`Achte auf Artikel und Berufsbezeichnung: ${p.m}.`});
  items.push({type:'choice',image:femaleImage,prompt:'Welcher Beruf passt?',options:options(p.f,femalePool,index),answer:p.f,hint:`Achte auf die feminine Form: ${p.f}.`});
 });
 return items;
}
function genderPairItems(){
 const allM=PROFESSIONS.map(x=>x.m),allF=PROFESSIONS.map(x=>x.f),items=[];
 PROFESSIONS.forEach((p,index)=>{
  if(index%2===0)items.push({type:'choice',context:p.m,prompt:'Wie heißt die feminine Form?',options:options(p.f,allF,index),answer:p.f,hint:'Viele feminine Berufsbezeichnungen enden auf -in. Achte auf besondere Formen wie Arzt → Ärztin und Koch → Köchin.'});
  else items.push({type:'choice',context:p.f,prompt:'Wie heißt die maskuline Form?',options:options(p.m,allM,index),answer:p.m,hint:'Suche die passende maskuline Berufsbezeichnung mit Artikel.'});
 });
 return items;
}
function pluralItems(){
 const male=PROFESSIONS.map(x=>x.pm),female=PROFESSIONS.map(x=>x.pf),items=[];
 PROFESSIONS.forEach((p,index)=>{
  items.push({type:'choice',context:p.m,prompt:'Wie lautet der Plural?',options:options(p.pm,male,index),answer:p.pm,hint:`Plural: ${p.pm}.`});
  items.push({type:'choice',context:p.f,prompt:'Wie lautet der Plural?',options:options(p.pf,female,index),answer:p.pf,hint:`Bei femininen Berufsbezeichnungen steht im Plural sehr oft -innen: ${p.pf}.`});
 });
 return items;
}
function articleItems(){
 const rows=[];PROFESSIONS.forEach((p,index)=>{
  rows.push({type:'choice',prompt:`___ ${withoutArticle(p.m)}`,options:['der','die','das'],answer:'der',hint:`Maskulin: ${p.m}.`});
  rows.push({type:'choice',prompt:`___ ${withoutArticle(p.f)}`,options:['der','die','das'],answer:'die',hint:`Feminin: ${p.f}.`});
 });return rows;
}
function questionFormItems(){
 const rows=[
  ['Du sprichst mit einem Freund. Du fragst direkt nach seinem Beruf.','Was bist du von Beruf?'],
  ['Du sprichst mit einer Freundin. Du fragst, was sie beruflich macht.','Was machst du beruflich?'],
  ['Du sprichst höflich mit einem neuen Kunden. Du fragst nach seinem Beruf.','Was sind Sie von Beruf?'],
  ['Du sprichst höflich mit einer neuen Kundin. Du fragst, was sie beruflich macht.','Was machen Sie beruflich?'],
  ['Du bist mit einem Kurskollegen per du. Frage nach dem Beruf.','Was bist du von Beruf?'],
  ['Du bist mit einer Bekannten per du. Frage nach ihrer beruflichen Tätigkeit.','Was machst du beruflich?'],
  ['Sie sprechen mit einer Person, die Sie nicht kennen. Frage nach dem Beruf.','Was sind Sie von Beruf?'],
  ['Sie sprechen formell im Büro. Frage nach der beruflichen Tätigkeit.','Was machen Sie beruflich?'],
  ['Ein Freund erzählt von seiner Arbeit. Welche Frage mit „du“ passt?','Was machst du beruflich?'],
  ['Bei einem offiziellen Gespräch möchten Sie den Beruf wissen.','Was sind Sie von Beruf?'],
  ['Du möchtest wissen: Koch, Lehrer oder Arzt?','Was bist du von Beruf?'],
  ['Sie möchten wissen, welche Arbeit eine Person macht.','Was machen Sie beruflich?'],
  ['Du fragst einen Freund nach seiner Tätigkeit.','Was machst du beruflich?'],
  ['Sie fragen eine neue Nachbarin höflich nach ihrem Beruf.','Was sind Sie von Beruf?'],
  ['Du fragst eine Freundin: Welchen Beruf hast du?','Was bist du von Beruf?'],
  ['Sie fragen im Interview höflich nach der Tätigkeit.','Was machen Sie beruflich?']
 ];
 return rows.map(([context,answer])=>({type:'choice',context,prompt:'Welche Frage passt?',options:QUESTION_FORMS,answer,hint:answer.includes('du')?'Bei „du“ benutzt du bist / machst.':'Bei „Sie“ benutzt du sind / machen und schreibst Sie groß.'}));
}
function questionAnswerItems(){
 const rows=[];PROFESSIONS.slice(0,8).forEach((p,index)=>{
  const form=index%4,job=form%2===0?p.m:p.f,word=jobWord(job);
  const q=QUESTION_FORMS[form];
  const answer=form===0||form===2?`Ich bin ${word}.`:`Ich arbeite als ${word}.`;
  const distractors=[`Ich arbeite bei ${word}.`,`Ich habe ${word}.`,`Ich bin bei ${word}.`];
  rows.push({type:'choice',context:q,prompt:'Welche Antwort passt am besten?',options:[answer,...distractors],answer,hint:form===0||form===2?'Auf „von Beruf“ passt sehr gut: Ich bin + Beruf.':'Auf „beruflich“ passt sehr gut: Ich arbeite als + Beruf.'});
 });
 const places=PROFESSIONS.slice(8,15);places.forEach((p,index)=>{
  const formal=index%2===0,q=formal?'Was machen Sie beruflich?':'Was machst du beruflich?',who=formal?'Ich':'Ich',answer=`${who} arbeite ${p.place}.`;
  rows.push({type:'choice',context:q,prompt:'Welche Antwort mit Arbeitsplatz / Arbeitgeber passt?',options:[answer,`Ich bin ${p.place}.`,`Ich arbeite als ${p.place}.`,`Ich habe ${p.place}.`],answer,hint:'Mit „bei / in“ nennst du den Arbeitgeber oder den Arbeitsplatz, nicht den Beruf.'});
 });return rows;
}
function orderItems(){
 const sentences=[
  'Was bist du von Beruf?','Was machst du beruflich?','Was sind Sie von Beruf?','Was machen Sie beruflich?',
  'Ich bin Ärztin.','Ich arbeite als Koch.','Ich arbeite bei einer Firma.','Ich arbeite in einem Krankenhaus.',
  'Mein Bruder ist Mechatroniker.','Meine Schwester ist Journalistin.','Das ist mein eigener Arbeitsplatz.','Sie hat eine eigene Firma.'
 ];
 return sentences.map(text=>({type:'order',prompt:'Bilde den richtigen Satz.',tokens:text.replace(/[?.!]/g,'').split(/\s+/).concat(/[?]$/.test(text)?['?']:[]),answer:text,hint:text.startsWith('Was')?'Bei der Frage steht das Verb vor dem Subjekt bzw. direkt nach dem Fragewort.':'Achte auf Verbposition 2 und die vollständige Berufsbezeichnung.'}));
}
function eigenItems(){
 const rows=[
  ['Das ist mein ___ Beruf.','eigener','mein eigener Beruf'],['Sie hat eine ___ Firma.','eigene','eine eigene Firma'],['Er hat ein ___ Büro.','eigenes','ein eigenes Büro'],['Ich habe einen ___ Arbeitsplatz.','eigenen','einen eigenen Arbeitsplatz'],
  ['Das ist sein ___ Job.','eigener','sein eigener Job'],['Das ist ihre ___ Stelle.','eigene','ihre eigene Stelle'],['Wir haben ein ___ Büro.','eigenes','ein eigenes Büro'],['Er sucht einen ___ Arbeitsplatz.','eigenen','einen eigenen Arbeitsplatz'],
  ['Mein Vater hat einen ___ Betrieb.','eigenen','einen eigenen Betrieb'],['Meine Mutter hat eine ___ Praxis.','eigene','eine eigene Praxis'],['Sie hat ihr ___ Büro.','eigenes','ihr eigenes Büro'],['Das ist unser ___ Chef.','eigener','unser eigener Chef'],
  ['Das ist unsere ___ Firma.','eigene','unsere eigene Firma'],['Wir haben unser ___ Team.','eigenes','unser eigenes Team'],['Ich habe meinen ___ Schreibtisch.','eigenen','meinen eigenen Schreibtisch'],['Sie haben einen ___ Arbeitsplatz.','eigenen','einen eigenen Arbeitsplatz']
 ];
 return rows.map(([prompt,answer,group])=>({type:'choice',prompt,options:['eigener','eigene','eigenes','eigenen'],answer,hint:`Lerne die ganze Gruppe: ${group}.`}));
}
function listeningItems(){
 const jobPool=[...PROFESSIONS.map(x=>x.m),...PROFESSIONS.map(x=>x.f)];
 const rows=[];
 PROFESSIONS.slice(0,8).forEach((p,index)=>{const job=index%2?p.f:p.m,word=jobWord(job);rows.push({type:'choice',audio:`Ich arbeite als ${word}.`,prompt:'Welchen Beruf hörst du?',options:options(job,jobPool,index),answer:job,hint:`Du hörst: Ich arbeite als ${word}.`})});
 QUESTION_FORMS.forEach((q,index)=>rows.push({type:'choice',audio:q,prompt:'Welche Berufsfrage hörst du?',options:QUESTION_FORMS,answer:q,hint:q.includes('Sie')?'Höre auf die höfliche Form „Sie“.':'Höre auf die Form mit „du“.'}));
 rows.push({type:'choice',audio:'Ich arbeite in einem Krankenhaus.',prompt:'Was hörst du?',options:['Ich arbeite in einem Krankenhaus.','Ich bin ein Krankenhaus.','Ich arbeite als Krankenhaus.','Ich habe ein Krankenhaus.'],answer:'Ich arbeite in einem Krankenhaus.',hint:'Mit „in“ wird hier der Arbeitsplatz genannt.'});
 rows.push({type:'choice',audio:'Ich arbeite bei einer Firma.',prompt:'Was hörst du?',options:['Ich arbeite bei einer Firma.','Ich bin eine Firma.','Ich arbeite als Firma.','Ich habe eine Firma.'],answer:'Ich arbeite bei einer Firma.',hint:'Mit „bei“ wird der Arbeitgeber genannt.'});
 return rows;
}
function readingItems(){
 const profiles=[
  ['Mila ist Ärztin. Sie arbeitet in einem Krankenhaus. Sie hat ein eigenes Büro.','Was ist Mila von Beruf?','Ärztin',['Ärztin','Lehrerin','Journalistin','Köchin']],
  ['Jonas ist Koch. Er arbeitet in einem Restaurant. Das Restaurant hat eine eigene Küche.','Was ist Jonas von Beruf?','Koch',['Koch','Bäcker','Friseur','Polizist']],
  ['Aylin arbeitet als Journalistin bei einer Zeitung. Sie hat einen eigenen Schreibtisch.','Was macht Aylin beruflich?','Sie arbeitet als Journalistin.',['Sie arbeitet als Journalistin.','Sie arbeitet als Ärztin.','Sie ist eine Zeitung.','Sie arbeitet als Schreibtisch.']],
  ['Tomas ist Mechatroniker. Er arbeitet bei einer Firma.','Wo arbeitet Tomas?','bei einer Firma',['bei einer Firma','als Firma','bei einem Beruf','als Mechatronikerin']],
  ['Sara ist Lehrerin. Ihre Schule hat ein eigenes Lehrerzimmer.','Welche Form ist im Text richtig?','ein eigenes Lehrerzimmer',['ein eigener Lehrerzimmer','eine eigene Lehrerzimmer','ein eigenes Lehrerzimmer','einen eigenen Lehrerzimmer']],
  ['Omar ist Physiotherapeut. Er arbeitet in einer Praxis.','Welche Berufsbezeichnung steht im Text?','Physiotherapeut',['Physiotherapeut','Physiotherapeutin','Arzthelfer','Hausmeister']],
  ['Nora ist Friseurin. Ihr Bruder ist Friseur.','Welche zwei Formen gehören zusammen?','der Friseur – die Friseurin',['der Friseur – die Friseurin','der Koch – die Friseurin','die Friseurin – die Köchin','der Friseur – die Lehrerin']],
  ['Ben und Paul sind Bäcker. Lea und Anna sind Bäckerinnen.','Welcher Plural ist feminin?','die Bäckerinnen',['die Bäcker','die Bäckerinnen','der Bäcker','die Bäckerin']],
  ['Herr Klein ist Hausmeister. Frau Klein ist Hausmeisterin.','Wie fragen Sie Herrn Klein höflich nach seinem Beruf?','Was sind Sie von Beruf?',QUESTION_FORMS],
  ['Du triffst Mia. Sie sagt: „Ich arbeite als Polizistin.“','Welche Frage mit „du“ passt gut?','Was machst du beruflich?',QUESTION_FORMS],
  ['Frau Sommer ist Chefin. Sie hat eine eigene Firma.','Welche Wortgruppe steht korrekt im Text?','eine eigene Firma',['ein eigener Firma','eine eigene Firma','ein eigenes Firma','einen eigenen Firma']],
  ['Ali ist Taxifahrer. Seine Schwester ist Taxifahrerin. Beide arbeiten bei einer Taxifirma.','Wie heißt der feminine Beruf?','Taxifahrerin',['Taxifahrer','Taxifahrerin','Taxifahrerinnen','Taxifirma']]
 ];
 return profiles.map(([context,prompt,answer,opts])=>({type:'choice',context,prompt,options:opts,answer,hint:'Lies den Text noch einmal und suche genau die Information zur Frage.'}));
}
function dialogItems(){
 const rows=[
  ['A: Hallo! ___\nB: Ich bin Koch.','Was bist du von Beruf?'],['A: Guten Tag. ___\nB: Ich bin Ärztin.','Was sind Sie von Beruf?'],['A: ___\nB: Ich arbeite als Journalistin.','Was machst du beruflich?'],['A: ___\nB: Ich arbeite als Physiotherapeut.','Was machen Sie beruflich?'],
  ['A: Was bist du von Beruf?\nB: ___','Ich bin Lehrer.'],['A: Was machen Sie beruflich?\nB: ___','Ich arbeite als Mechatronikerin.'],['A: Wo arbeiten Sie?\nB: ___','Ich arbeite in einem Krankenhaus.'],['A: Bei wem arbeitest du?\nB: ___','Ich arbeite bei einer Firma.'],
  ['A: Ist das deine Firma?\nB: Ja, das ist ___.','meine eigene Firma'],['A: Hast du ein Büro?\nB: Ja, ich habe ___.','ein eigenes Büro'],['A: Ist Frau Wolf Ärztin?\nB: Ja. Herr Wolf ist Arzt und Frau Wolf ist ___.','Ärztin'],['A: Ein Koch, zwei ___.','Köche']
 ];
 return rows.map(([context,answer],index)=>{let opts;if(QUESTION_FORMS.includes(answer))opts=QUESTION_FORMS;else{const distractors=['Ich bin Lehrer.','Ich arbeite als Mechatronikerin.','Ich arbeite in einem Krankenhaus.','Ich arbeite bei einer Firma.','meine eigene Firma','ein eigenes Büro','Ärztin','Köche'];opts=options(answer,distractors,index)}return{type:'choice',context,prompt:'Was passt in den Dialog?',options:opts,answer,hint:'Achte darauf, ob nach Beruf, Tätigkeit, Arbeitsplatz oder einer grammatischen Form gefragt wird.'}});
}
function interviewItems(){
 const rows=[
  ['Du sprichst mit einem neuen Freund. Frage nach dem Beruf und antworte selbst mit einem Beruf.','Benutze „Was bist du von Beruf?“ und „Ich bin …“.'],
  ['Du sprichst mit einer Freundin über Arbeit. Stelle eine Frage und antworte.','Benutze „Was machst du beruflich?“ und „Ich arbeite als …“.'],
  ['Sie sprechen höflich mit einem neuen Kollegen. Fragen Sie nach dem Beruf und antworten Sie.','Benutzen Sie „Was sind Sie von Beruf?“ und „Ich bin …“.'],
  ['Sie führen ein formelles Gespräch. Fragen Sie nach der Tätigkeit und antworten Sie.','Benutzen Sie „Was machen Sie beruflich?“ und „Ich arbeite als …“.'],
  ['Erzähle über einen Mann und eine Frau mit zwei verschiedenen Berufen.','Benutze eine maskuline und eine feminine Berufsform.'],
  ['Nenne zwei Personen im Plural.','Benutze einen maskulinen und einen femininen Plural, z. B. Lehrer / Lehrerinnen.'],
  ['Erzähle von deinem Arbeitsplatz.','Benutze „arbeiten bei“ oder „arbeiten in“.'],
  ['Erzähle von einem Beruf und einem eigenen Arbeitsplatz.','Benutze eine Form von eigen- mit Artikel oder Possessivwort.'],
  ['Spiele ein kurzes Bewerbungsgespräch.','Stelle eine höfliche Berufsfrage und gib eine vollständige Antwort.'],
  ['Fasse das Thema zusammen.','Schreibe zwei bis drei vollständige Sätze über Beruf, Arbeitsplatz und eine eigene Sache.']
 ];
 return rows.map(([context,starter])=>({type:'free',context,prompt:'Sprich oder schreibe.',starter,min:2}));
}
function examItems(){
 const items=[
  {type:'choice',prompt:'Wie heißt die feminine Form von „der Arzt“?',options:['die Ärztin','die Arztin','die Ärzte','die Arzthelferin'],answer:'die Ärztin',hint:'Achte auf die besondere Form.'},
  {type:'choice',prompt:'Wie heißt die maskuline Form von „die Köchin“?',options:['der Koch','der Köcher','die Köche','der Bäcker'],answer:'der Koch',hint:'Köchin gehört zu Koch.'},
  {type:'choice',prompt:'Plural von „die Polizistin“',options:['die Polizistinnen','die Polizisten','die Polizistin','die Polizists'],answer:'die Polizistinnen',hint:'Feminin Plural endet hier auf -innen.'},
  {type:'choice',prompt:'Plural von „der Arzt“',options:['die Ärzte','die Ärztinnen','die Arzte','die Arzt'],answer:'die Ärzte',hint:'Arzt hat im Plural Umlaut + -e.'},
  {type:'choice',prompt:'___ Journalistin',options:['der','die','das'],answer:'die',hint:'Journalistin ist feminin.'},
  {type:'choice',prompt:'Du fragst einen Freund direkt nach seinem Beruf.',options:QUESTION_FORMS,answer:'Was bist du von Beruf?',hint:'Freund → du.'},
  {type:'choice',prompt:'Sie fragen höflich nach der beruflichen Tätigkeit.',options:QUESTION_FORMS,answer:'Was machen Sie beruflich?',hint:'Höflich → Sie.'},
  {type:'choice',context:'Was machst du beruflich?',prompt:'Welche Antwort passt?',options:['Ich arbeite als Bäcker.','Ich bin bei Bäcker.','Ich habe Bäcker.','Ich arbeite Bäcker bei.'],answer:'Ich arbeite als Bäcker.',hint:'Beruf nach „als“.'},
  {type:'choice',context:'Was sind Sie von Beruf?',prompt:'Welche Antwort passt?',options:['Ich bin Ärztin.','Ich arbeite Ärztin bei.','Ich habe Ärztin.','Ich bin bei Ärztin.'],answer:'Ich bin Ärztin.',hint:'Auf „von Beruf“ passt: Ich bin + Beruf.'},
  {type:'choice',prompt:'Sie hat eine ___ Firma.',options:['eigener','eigene','eigenes','eigenen'],answer:'eigene',hint:'eine eigene Firma.'},
  {type:'choice',prompt:'Er hat ein ___ Büro.',options:['eigener','eigene','eigenes','eigenen'],answer:'eigenes',hint:'ein eigenes Büro.'},
  {type:'choice',prompt:'Ich habe einen ___ Arbeitsplatz.',options:['eigener','eigene','eigenes','eigenen'],answer:'eigenen',hint:'einen eigenen Arbeitsplatz.'},
  {type:'choice',audio:'Ich arbeite als Taxifahrerin.',prompt:'Welchen Beruf hörst du?',options:['die Taxifahrerin','der Taxifahrer','die Journalistin','die Lehrerin'],answer:'die Taxifahrerin',hint:'Höre auf -fahrerin.'},
  {type:'choice',audio:'Was machen Sie beruflich?',prompt:'Welche Frage hörst du?',options:QUESTION_FORMS,answer:'Was machen Sie beruflich?',hint:'Höre auf machen + Sie.'},
  {type:'choice',context:'Lina ist Friseurin. Sie arbeitet in einem Salon.',prompt:'Was ist Lina von Beruf?',options:['Friseurin','Lehrerin','Köchin','Ärztin'],answer:'Friseurin',hint:'Die Information steht im ersten Satz.'},
  {type:'order',prompt:'Bilde die Frage.',tokens:['Was','bist','du','von','Beruf','?'],answer:'Was bist du von Beruf?',hint:'Was + bist + du + von Beruf?'},
  {type:'order',prompt:'Bilde die höfliche Frage.',tokens:['Was','machen','Sie','beruflich','?'],answer:'Was machen Sie beruflich?',hint:'Was + machen + Sie + beruflich?'},
  {type:'input',prompt:'Schreibe die feminine Form: der Lehrer → die …',answer:['Lehrerin','die Lehrerin'],hint:'Feminine Form mit -in.'},
  {type:'input',prompt:'Schreibe den Plural: die Ärztin → die …',answer:['Ärztinnen','die Ärztinnen'],hint:'Feminin Plural mit -innen.'},
  {type:'input',prompt:'Ergänze: Ich arbeite ___ Koch.',answer:['als','als Koch'],hint:'Mit „als“ nennt man den Beruf.'}
 ];return items;
}
function fallbackCards(){
 const lex=window.L8T1TranslationLexicon;return PROFESSIONS.flatMap(p=>[p.m,p.f]).map(value=>({term:value,type:'noun',plural:'',translations:lex?.find?.(value)||{},detail:'Berufsbezeichnung',example:`Ich bin ${jobWord(value)}.`}));
}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||{},theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null);if(!theme)return themes;
 let cards=cardTask(theme);if(!cards){cards={id:'karteikarten',kind:'cards',title:'Karteikarten',instruction:'Lerne die Berufe und wichtigen Wörter.',items:fallbackCards()}}
 cards.id='karteikarten';cards.kind='cards';cards.title='Karteikarten';cards.instruction='Lerne die Berufe und wichtigen Wörter. Drehe die Karte um und sprich oder schreibe die Lösung selbst.';cards.intro='Beginne mit dem Wortschatz. Achte bei Berufen immer auf Artikel, feminine Form und Plural.';
 const map=cardMap(cards);
 theme.number=1;theme.title='Berufe und Arbeit';theme.subtitle='Berufe erkennen und benennen, höflich und informell nach dem Beruf fragen und eigene Arbeit beschreiben.';theme.chips=['Berufe','du / Sie','männlich / weiblich','Singular / Plural','eigen-','arbeiten als / bei'];
 theme.tasks=[
  cards,
  {id:'berufe-bild-v2',kind:'choice',title:'Bild und Beruf',instruction:'Erkenne die Berufsbezeichnung und wähle die richtige Form.',intro:'Wie in den Bild-Wort-Aufgaben der früheren Lektionen: Schau zuerst genau hin und achte danach auf Artikel und Endung.',items:imageProfessionItems(map)},
  {id:'berufspaare-v2',kind:'choice',title:'Männlich und weiblich',instruction:'Ordne maskuline und feminine Berufsbezeichnungen einander zu.',intro:'Viele feminine Berufsbezeichnungen enden auf -in. Einige Formen verändern sich stärker: der Arzt → die Ärztin, der Koch → die Köchin.',items:genderPairItems()},
  {id:'berufe-plural-v2',kind:'choice',title:'Singular und Plural',instruction:'Wähle zu jeder Berufsbezeichnung die richtige Pluralform.',intro:'Lerne Singular und Plural zusammen. Bei femininen Berufen endet der Plural sehr oft auf -innen.',items:pluralItems()},
  {id:'berufe-artikel-v2',kind:'choice',title:'Artikel der Berufe',instruction:'Wähle der oder die und erkenne dadurch maskuline und feminine Formen.',intro:'Der Artikel hilft dir sofort zu erkennen, ob die Berufsbezeichnung maskulin oder feminin ist.',items:articleItems()},
  {id:'berufsfragen-du-sie-v2',kind:'choice',title:'Berufsfragen: du oder Sie?',instruction:'Wähle die passende Frage für informelle und formelle Situationen.',intro:'du: „Was bist du von Beruf?“ / „Was machst du beruflich?“ · Sie: „Was sind Sie von Beruf?“ / „Was machen Sie beruflich?“',items:questionFormItems()},
  {id:'berufsfragen-antworten-v2',kind:'choice',title:'Frage und Antwort',instruction:'Ordne Berufsfragen den passenden Antworten zu.',intro:'„Ich bin …“ nennt direkt den Beruf. „Ich arbeite als …“ nennt die Tätigkeit. „Ich arbeite bei / in …“ nennt Arbeitgeber oder Arbeitsplatz.',items:questionAnswerItems()},
  {id:'beruf-saetze-ordnen-v2',kind:'order',title:'Fragen und Sätze ordnen',instruction:'Baue Berufsfragen und Antworten in der richtigen Wortstellung.',intro:'Nutze die Satzbau-Strategie aus den früheren Lektionen: zuerst Verbposition und Frageform erkennen, dann den Satz vollständig bauen.',items:orderItems()},
  {id:'eigen-grammatik-v2',kind:'grammar',title:'eigen- richtig benutzen',instruction:'Wähle eigener, eigene, eigenes oder eigenen in vollständigen Wortgruppen.',intro:'Lerne eigen- immer zusammen mit Artikel oder Possessivwort und Nomen: mein eigener Beruf · eine eigene Firma · ein eigenes Büro · einen eigenen Arbeitsplatz.',items:eigenItems()},
  {id:'berufe-hoeren-v2',kind:'listen',title:'Hören: Beruf und Berufsfrage',instruction:'Höre kurze Sätze und Fragen und wähle die passende Bedeutung.',intro:'Höre besonders auf -in / -innen sowie auf du / Sie.',items:listeningItems()},
  {id:'berufe-lesen-v2',kind:'reading',title:'Lesen: Wer arbeitet wo?',instruction:'Lies kurze berufliche Profile und beantworte die Fragen.',intro:'Suche im Text gezielt nach Beruf, Arbeitsplatz, Geschlecht, Plural und Formen von eigen-.',items:readingItems()},
  {id:'berufe-dialoge-v2',kind:'dialog',title:'Mini-Dialoge über Berufe',instruction:'Ergänze typische Gespräche über Beruf und Arbeitsplatz.',intro:'Die Dialoge verbinden die vier Berufsfragen mit „Ich bin …“, „Ich arbeite als …“ und „Ich arbeite bei / in …“.',items:dialogItems()},
  {id:'berufsinterview-v2',kind:'speaking',title:'Sprechen und Schreiben: Berufsinterview',instruction:'Formuliere selbst Fragen und vollständige Antworten.',intro:'Jetzt benutzt du den Wortschatz selbst. Sprich oder schreibe jeweils mindestens zwei vollständige Sätze.',items:interviewItems()},
  {id:'pruefung-berufe-v2',kind:'exam',exam:true,title:'Prüfung',instruction:'Bearbeite 20 gemischte Fragen zu Berufen, Berufsfragen, Singular/Plural und eigen-.',items:examItems()}
 ];
 theme.tasks.forEach((task,index)=>{task.order=index+1});theme.contentRevision='l8t1-pedagogy-20260825-v1';window.L8_THEME=theme;return themes;
});
})();