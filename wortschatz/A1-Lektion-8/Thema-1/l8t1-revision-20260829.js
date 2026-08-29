(function(){
'use strict';
if(window.__SP_L8T1_REV_20260829)return;window.__SP_L8T1_REV_20260829=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ');
const woArticle=v=>String(v||'').replace(/^(der|die|das)\s+/i,'').trim();
const img=name=>name?CDN+name:'';
const aud=name=>name?AUDIO+name:'';
const JOBS=[
 {m:'der Physiotherapeut',f:'die Physiotherapeutin',pm:'die Physiotherapeuten',pf:'die Physiotherapeutinnen',mi:'physiotherapeut.webp',fi:'physiotherapeutin.webp'},
 {m:'der Hausmeister',f:'die Hausmeisterin',pm:'die Hausmeister',pf:'die Hausmeisterinnen',mi:'hausmeister.webp',fi:'hausmeisterin.webp'},
 {m:'der Arzthelfer',f:'die Arzthelferin',pm:'die Arzthelfer',pf:'die Arzthelferinnen',mi:'arzthelfer.webp',fi:'arzthelferin.webp'},
 {m:'der Arzt',f:'die Ärztin',pm:'die Ärzte',pf:'die Ärztinnen',mi:'arzt.webp',fi:'aerztin.webp'},
 {m:'der Mechatroniker',f:'die Mechatronikerin',pm:'die Mechatroniker',pf:'die Mechatronikerinnen',mi:'mechatroniker.webp',fi:'mechatronikerin.webp'},
 {m:'der Polizist',f:'die Polizistin',pm:'die Polizisten',pf:'die Polizistinnen',mi:'polizist.webp',fi:'polizistin.webp'},
 {m:'der Krankenpfleger',f:'die Krankenpflegerin',pm:'die Krankenpfleger',pf:'die Krankenpflegerinnen',mi:'krankenpfleger.webp',fi:'krankenpflegerin.webp'},
 {m:'der Lehrer',f:'die Lehrerin',pm:'die Lehrer',pf:'die Lehrerinnen',mi:'lehrer.webp',fi:'lehrerin.webp'},
 {m:'der Schauspieler',f:'die Schauspielerin',pm:'die Schauspieler',pf:'die Schauspielerinnen',mi:'schauspieler.webp',fi:'schauspielerin.webp'},
 {m:'der Bäcker',f:'die Bäckerin',pm:'die Bäcker',pf:'die Bäckerinnen',mi:'baecker.webp',fi:'baeckerin.webp'},
 {m:'der Koch',f:'die Köchin',pm:'die Köche',pf:'die Köchinnen',mi:'koch.webp',fi:'koechin.webp'},
 {m:'der Friseur',f:'die Friseurin',pm:'die Friseure',pf:'die Friseurinnen',mi:'friseur.webp',fi:'friseurin.webp'},
 {m:'der Chef',f:'die Chefin',pm:'die Chefs',pf:'die Chefinnen',mi:'chef.webp',fi:'chefin.webp'},
 {m:'der Journalist',f:'die Journalistin',pm:'die Journalisten',pf:'die Journalistinnen',mi:'journalist.webp',fi:'journalistin.webp'},
 {m:'der Taxifahrer',f:'die Taxifahrerin',pm:'die Taxifahrer',pf:'die Taxifahrerinnen',mi:'taxifahrer.webp',fi:'taxifahrerin.webp'},
 {m:'der Praktikant',f:'die Praktikantin',pm:'die Praktikanten',pf:'die Praktikantinnen',mi:'praktikant.webp',fi:'praktikantin.webp'},
 {m:'der Hausmann',f:'die Hausfrau',pm:'die Hausmänner',pf:'die Hausfrauen',mi:'hausmann.webp',fi:'hausfrau.webp'}
];
const NOUNS=[
 {term:'der Beruf',plural:'die Berufe',image:'beruf.webp',example:'Was bist du von Beruf?'},
 {term:'der Job',plural:'die Jobs',image:'job.webp',example:'Ich habe einen Job.'},
 {term:'die Stelle',plural:'die Stellen',image:'stelle.webp',example:'Ich suche eine Stelle.'},
 {term:'die Ausbildung',plural:'die Ausbildungen',image:'ausbildung.webp',example:'Ich mache eine Ausbildung.'},
 {term:'das Krankenhaus',plural:'die Krankenhäuser',image:'krankenhaus.webp',example:'Das ist ein Krankenhaus.'},
 {term:'die Praxis',plural:'die Praxen',image:'praxis.webp',example:'Sie hat eine eigene Praxis.'},
 {term:'die Firma',plural:'die Firmen',image:'firma.webp',example:'Ich arbeite bei einer Firma.'},
 {term:'das Thema',plural:'die Themen',image:'thema.webp',example:'Das Thema ist Beruf und Arbeit.'},
 {term:'das Fernsehen',plural:'kein Plural',image:'das_fernsehen.webp',example:'Das Interview ist im Fernsehen.'},
 {term:'die Zeitung',plural:'die Zeitungen',image:'zeitung.webp',example:'Der Journalist arbeitet bei einer Zeitung.'},
 {term:'das Interview',plural:'die Interviews',image:'interview.webp',example:'Wir machen ein Interview.'},
 {term:'die Geschichte',plural:'die Geschichten',image:'geschichte.webp',example:'Das ist eine interessante Geschichte.'},
 {term:'die Arbeit',plural:'die Arbeiten',image:'arbeit.webp',example:'Die Arbeit ist interessant.'},
 {term:'das Praktikum',plural:'die Praktika',image:'praktikum.webp',example:'Ich mache ein Praktikum.'}
];
const EXTRA=[
 {term:'zurzeit',type:'adverb',image:'zurzeit.webp',example:'Zurzeit bin ich arbeitslos.'},
 {term:'arbeitslos',type:'adjective',image:'arbeitslos.webp',example:'Ich bin arbeitslos.'},
 {term:'berufstätig',type:'adjective',image:'berufstaetig.webp',example:'Sie ist berufstätig.'},
 {term:'angestellt',type:'adjective',image:'angestellt.webp',example:'Er ist bei einer Firma angestellt.'},
 {term:'selbstständig',type:'adjective',image:'selbststaendig.webp',example:'Sie ist selbstständig.'},
 {term:'beruflich',type:'adverb',image:'beruflich.webp',example:'Was machst du beruflich?'},
 {term:'studieren',type:'verb',image:'studieren.webp',example:'Mila studiert Medizin.'}
];
const QUESTIONS=['Was bist du von Beruf?','Was machst du beruflich?','Was sind Sie von Beruf?','Was machen Sie beruflich?'];
const family=p=>[p.m,p.f,p.pm,p.pf];
const translation=v=>window.L8T1TranslationLexicon?.find?.(v)||{};
function cardTask(theme){return (theme.tasks||[]).find(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(t?.title||''))}
function cardTerm(x){return String(x?.term||x?.full||x?.word||'').trim()}
function ensureCard(cards,def){
 if(!cards.items)cards.items=[];let item=cards.items.find(x=>norm(cardTerm(x))===norm(def.term));
 if(!item){item={term:def.term,type:def.type||'noun'};cards.items.push(item)}
 item.term=def.term;item.type=def.type||item.type||'noun';if(def.plural!==undefined)item.plural=def.plural;
 if(def.image)item.image=img(def.image);if(def.audio)item.audio=aud(def.audio);else if(def.image)item.audio=aud(def.image.replace(/\.webp$/i,'.mp3'));
 if(def.example)item.example=def.example;const tr=translation(def.term);if(tr&&Object.keys(tr).length)item.translations={...(item.translations||{}),...tr};return item;
}
function prepareCards(theme){
 let cards=cardTask(theme);if(!cards){cards={id:'karteikarten',kind:'cards',title:'Karteikarten',items:[]}}
 cards.id='karteikarten';cards.kind='cards';cards.title='Karteikarten';cards.icon='📚';cards.instruction='Lerne die Wörter.';delete cards.intro;
 JOBS.forEach(p=>{
  ensureCard(cards,{term:p.m,plural:p.pm,image:p.mi,example:`Ich arbeite als ${woArticle(p.m)}.`});
  ensureCard(cards,{term:p.f,plural:p.pf,image:p.fi,example:`Ich arbeite als ${woArticle(p.f)}.`});
 });
 NOUNS.forEach(x=>ensureCard(cards,x));EXTRA.forEach(x=>ensureCard(cards,x));
 for(const item of cards.items||[]){if(/\barbeite(?:n|t)?\s+in\b/i.test(String(item.example||'')))item.example='';}
 return cards;
}
function imageProfessionItems(){return JOBS.map((p,i)=>{const female=i%2===1,answer=female?p.f:p.m;return{type:'choice',image:img(female?p.fi:p.mi),prompt:'Welcher Beruf passt zum Bild?',options:family(p),answer,hint:'Achte genau auf Person, Artikel, Singular und Plural.'}})}
function genderPairItems(){return JOBS.map((p,i)=>{const sourceFemale=i%2===1;return{type:'choice',image:img(sourceFemale?p.fi:p.mi),prompt:sourceFemale?'Wähle die passende männliche Berufsbezeichnung.':'Wähle die passende weibliche Berufsbezeichnung.',options:family(p),answer:sourceFemale?p.m:p.f,hint:'Vergleiche nur die Formen dieses Berufs sehr genau.'}})}
function nounPluralItems(cards){
 const rows=[],seen=new Set();const add=(term,plural,image)=>{const key=norm(term);if(!term||seen.has(key)||!/^(der|die|das)\s+/i.test(term))return;seen.add(key);rows.push({type:'dualinput',image,prompt:'Schreibe Singular und Plural mit Artikel.',singular:term,plural:plural||'kein Plural',pluralAccepted:(plural&&plural!=='kein Plural')?[plural]:['kein Plural','-','—']})};
 JOBS.forEach(p=>{add(p.m,p.pm,img(p.mi));add(p.f,p.pf,img(p.fi))});NOUNS.forEach(x=>add(x.term,x.plural,img(x.image)));
 for(const item of cards.items||[])add(cardTerm(item),String(item.plural||''),String(item.image||item.img||''));return rows;
}
function articleItems(){return JOBS.map((p,i)=>{const female=i%2===1,target=female?p.f:p.m;return{type:'choice',image:img(female?p.fi:p.mi),prompt:`___ ${woArticle(target)}`,options:['der','die'],answer:female?'die':'der',hint:'Achte auf die Person auf dem Bild und die Berufsform.'}})}
function orderItems(){
 const s=['Was bist du von Beruf','Was machst du beruflich','Was sind Sie von Beruf','Was machen Sie beruflich','Ich arbeite als Ärztin','Ich arbeite als Mechatroniker','Ich arbeite als Journalistin','Ich arbeite als Koch','Ich arbeite bei Lidl','Ich arbeite bei einer Firma','Ich arbeite bei einer Zeitung','Ich arbeite bei der Polizei'];
 return s.map((text,i)=>({type:'order',prompt:i<4?'Bilde die richtige Berufsfrage.':'Bilde den richtigen Satz.',tokens:text.split(/\s+/),answer:[text,text+(i<4?'?':'.')],hint:i<4?'Achte auf die Frage: Was + Verb + du/Sie.':'Achte auf „arbeiten als“ für den Beruf und „arbeiten bei“ für Arbeitgeber oder Institution.'}));
}
function interviewItems(){return JOBS.map((p,i)=>{const q=QUESTIONS[i%4],female=i%2===1,target=female?p.f:p.m,job=woArticle(target);return{cue:q.includes('beruflich')?'beruflich':'von Beruf',register:q.includes('Sie')?'Sie':'du',question:q,job,image:img(female?p.fi:p.mi),preferred:`Ich arbeite als ${job}.`,answers:[`Ich arbeite als ${job}.`,`Ich bin ${job}.`,`Ich bin ${job} von Beruf.`,`Von Beruf bin ich ${job}.`],hintQuestion:q,hintAnswer:`Antworte mit dem Beruf auf dem Bild: Ich arbeite als ${job}.`}})}
const EIGEN_ROWS=[
 ['Das ist mein ___ Beruf.','eigener'],['Das ist meine ___ Firma.','eigene'],['Das ist dein ___ Job.','eigener'],['Das ist deine ___ Stelle.','eigene'],
 ['Ich habe ein ___ Büro.','eigenes'],['Du hast ein ___ Büro.','eigenes'],['Ich suche einen ___ Job.','eigenen'],['Du suchst einen ___ Arbeitsplatz.','eigenen'],
 ['Ich habe eine ___ Praxis.','eigene'],['Du hast eine ___ Firma.','eigene'],['Das ist mein ___ Thema.','eigenes'],['Das ist dein ___ Interview.','eigenes']
];
function eigenChoice(){return EIGEN_ROWS.map(([prompt,answer])=>({type:'choice',prompt,options:['eigener','eigene','eigenes','eigenen'],answer,hint:'Achte auf Artikel und Nomen.'}))}
function eigenInput(){return EIGEN_ROWS.map(([prompt,answer])=>({type:'input',prompt,answer:[answer],hint:'Achte auf Artikel und Nomen.'}))}
const LISTEN=[
 ['l8t1_hoeren_01.mp3','Ich arbeite als Physiotherapeut.','der Physiotherapeut',['der Physiotherapeut','die Physiotherapeutin','die Physiotherapeuten','die Physiotherapeutinnen']],
 ['l8t1_hoeren_02.mp3','Ich arbeite als Hausmeisterin.','die Hausmeisterin',['der Hausmeister','die Hausmeisterin','die Hausmeister','die Hausmeisterinnen']],
 ['l8t1_hoeren_03.mp3','Ich arbeite als Arzthelfer.','der Arzthelfer',['der Arzthelfer','die Arzthelferin','die Arzthelfer','die Arzthelferinnen']],
 ['l8t1_hoeren_04.mp3','Ich arbeite als Ärztin.','die Ärztin',['der Arzt','die Ärztin','die Ärzte','die Ärztinnen']],
 ['l8t1_hoeren_05.mp3','Ich arbeite als Mechatronikerin.','die Mechatronikerin',['der Mechatroniker','die Mechatronikerin','die Mechatroniker','die Mechatronikerinnen']],
 ['l8t1_hoeren_06.mp3','Ich arbeite als Polizist.','der Polizist',['der Polizist','die Polizistin','die Polizisten','die Polizistinnen']],
 ['l8t1_hoeren_07.mp3','Ich arbeite als Krankenpflegerin.','die Krankenpflegerin',['der Krankenpfleger','die Krankenpflegerin','die Krankenpfleger','die Krankenpflegerinnen']],
 ['l8t1_hoeren_08.mp3','Ich arbeite als Lehrer.','der Lehrer',['der Lehrer','die Lehrerin','die Lehrer','die Lehrerinnen']],
 ['l8t1_hoeren_09.mp3','Was bist du von Beruf?','Was bist du von Beruf?',QUESTIONS],
 ['l8t1_hoeren_10.mp3','Was machst du beruflich?','Was machst du beruflich?',QUESTIONS],
 ['l8t1_hoeren_11.mp3','Was sind Sie von Beruf?','Was sind Sie von Beruf?',QUESTIONS],
 ['l8t1_hoeren_12.mp3','Was machen Sie beruflich?','Was machen Sie beruflich?',QUESTIONS],
 ['l8t1_hoeren_13.mp3','Ich arbeite bei einer Firma.','Ich arbeite bei einer Firma.',['Ich arbeite bei einer Firma.','Ich arbeite als Firma.','Ich bin eine Firma.','Ich habe eine Firma.']],
 ['l8t1_hoeren_14.mp3','Ich arbeite bei einer Zeitung.','Ich arbeite bei einer Zeitung.',['Ich arbeite bei einer Zeitung.','Ich arbeite als Zeitung.','Ich bin eine Zeitung.','Ich habe eine Zeitung.']]
];
function listeningItems(){return LISTEN.map(([file,audio,answer,options])=>({type:'choice',audio,audioFile:file,prompt:audio.startsWith('Was ')?'Welche Frage hörst du?':audio.includes('bei einer')?'Welchen Satz hörst du?':'Welchen Beruf hörst du?',options,answer,hint:'Höre den Satz noch einmal und vergleiche die Antwortmöglichkeiten.'}))}
function matchingItems(){return[
 {type:'matching',prompt:'Ordne Beruf und Arbeitsplatz zu.',pairs:[['der Arzt','das Krankenhaus'],['der Journalist','die Zeitung'],['der Koch','die Küche'],['der Hausmeister','die Schule']]},
 {type:'matching',prompt:'Ordne Beruf und Arbeitsplatz zu.',pairs:[['der Physiotherapeut','die Praxis'],['der Mechatroniker','die Firma'],['der Polizist','die Polizei'],['der Bäcker','die Bäckerei']]},
 {type:'matching',prompt:'Ordne Beruf und Arbeitsplatz zu.',pairs:[['der Arzthelfer','die Praxis'],['der Schauspieler','das Fernsehen'],['der Friseur','der Friseursalon'],['der Taxifahrer','das Taxiunternehmen']]},
 {type:'matching',prompt:'Ordne Beruf und Arbeitsplatz zu.',pairs:[['der Krankenpfleger','das Krankenhaus'],['der Lehrer','die Schule'],['der Chef','die Firma'],['der Praktikant','das Büro']]}
]}
const DIALOGS=[
 ['A: Was machst du beruflich?\nB: Ich ___ Mechatronikerin.\nA: Interessant! Und wo arbeitest du?\nB: Bei Bosch.','arbeite als'],
 ['A: Wo arbeitest du?\nB: Ich ___ Lidl.\nA: Und was machst du dort?\nB: Ich bin Verkäuferin.','arbeite bei'],
 ['A: Was machen Sie beruflich?\nB: Ich ___ Ärztin.\nA: Danke. Und haben Sie eine eigene Praxis?\nB: Ja.','arbeite als'],
 ['A: Wo arbeiten Sie?\nB: Ich ___ einer Zeitung.\nA: Sind Sie Journalist?\nB: Ja.','arbeite bei'],
 ['A: Ist das deine Firma?\nB: Ja, das ist ___ Firma.\nA: Du bist also selbstständig?\nB: Genau.','meine eigene'],
 ['A: Ist das dein Arbeitsplatz?\nB: Ja, das ist ___ Arbeitsplatz.\nA: Gefällt er dir?\nB: Ja, sehr.','mein eigener'],
 ['A: Hast du ein Büro?\nB: Ja, ich habe ___ Büro.\nA: Ist es groß?\nB: Nein, aber schön.','ein eigenes'],
 ['A: Hast du eine Praxis?\nB: Ja, ich habe ___ Praxis.\nA: Arbeitest du allein?\nB: Nein.','eine eigene'],
 ['A: Ist das deine Stelle?\nB: Ja, das ist ___ Stelle.\nA: Seit wann hast du sie?\nB: Seit Mai.','meine eigene'],
 ['A: Ist das dein Job?\nB: Ja, das ist ___ Job.\nA: Bist du zufrieden?\nB: Ja.','mein eigener'],
 ['A: Was ist das Thema von deinem Interview?\nB: Das ist ___ Thema.\nA: Spannend!\nB: Danke.','mein eigenes'],
 ['A: Arbeitest du als Journalist?\nB: Ja. Ich ___ der Zeitung Morgen.\nA: Machst du viele Interviews?\nB: Ja.','arbeite bei']
];
function dialogItems(){return DIALOGS.map(([context,answer])=>({type:'input',context,prompt:'Schreibe die fehlende Form.',answer:[answer],hint:'Nutze nur arbeiten als, arbeiten bei oder eine passende Form von eigen-.'}))}
const CONTEXT=[
 ['___ bin ich arbeitslos.','zurzeit',['zurzeit','beruflich','angestellt','selbstständig']],
 ['Ich habe keinen Job. Ich bin ___.','arbeitslos',['arbeitslos','berufstätig','angestellt','selbstständig']],
 ['Sie arbeitet und hat einen Job. Sie ist ___.','berufstätig',['berufstätig','arbeitslos','beruflich','zurzeit']],
 ['Er hat einen Vertrag bei einer Firma. Er ist dort ___.','angestellt',['angestellt','arbeitslos','studieren','beruflich']],
 ['Sie hat eine eigene Praxis. Sie ist ___.','selbstständig',['selbstständig','angestellt','arbeitslos','zurzeit']],
 ['Was machst du ___?','beruflich',['beruflich','zurzeit','arbeitslos','angestellt']],
 ['Mila ist an der Universität. Sie will Medizin ___.','studieren',['studieren','arbeiten','Interview','Beruf']],
 ['Nach der Schule mache ich eine ___.','Ausbildung',['Ausbildung','Firma','Zeitung','Stelle']],
 ['Die Ärztin hat eine eigene ___.','Praxis',['Praxis','Zeitung','Geschichte','Stelle']],
 ['Ich arbeite bei einer ___.','Firma',['Firma','Ausbildung','Geschichte','Praxis']],
 ['Das heutige ___ ist Beruf und Arbeit.','Thema',['Thema','Interview','Fernsehen','Beruf']],
 ['Die Nachrichten sehe ich im ___.','Fernsehen',['Fernsehen','Interview','Krankenhaus','Beruf']],
 ['Der Journalist arbeitet bei einer ___.','Zeitung',['Zeitung','Praxis','Ausbildung','Geschichte']],
 ['Die Journalistin macht ein ___.','Interview',['Interview','Thema','Fernsehen','Beruf']],
 ['Er erzählt eine interessante ___.','Geschichte',['Geschichte','Stelle','Firma','Ausbildung']],
 ['Das ist ein großes ___.','Krankenhaus',['Krankenhaus','Interview','Beruf','Job']],
 ['Ich suche eine neue ___.','Stelle',['Stelle','Geschichte','Firma','Zeitung']],
 ['Ich habe einen neuen ___.','Job',['Job','Beruf','Thema','Interview']],
 ['Was bist du von ___?','Beruf',['Beruf','Job','Thema','Fernsehen']]
];
function contextChoice(){return CONTEXT.map(([prompt,answer,options])=>({type:'choice',prompt,options,answer,hint:'Lies den ganzen Satz und achte auf die Bedeutung.'}))}
function contextInput(){return CONTEXT.map(([prompt,answer])=>({type:'input',prompt,answer:[answer],hint:'Lies den ganzen Satz und schreibe genau das passende Wort.'}))}
function examItems(){return[
 {type:'choice',image:img('chef.webp'),prompt:'Wähle die passende weibliche Berufsform.',options:['die Chefin','die Chefinnen','der Chef','die Chefs'],answer:'die Chefin'},
 {type:'choice',image:img('aerztin.webp'),prompt:'Welcher Beruf passt?',options:['die Ärztin','der Arzt','die Ärztinnen','die Ärzte'],answer:'die Ärztin'},
 {type:'choice',prompt:'Plural von „der Arzt“',options:['die Ärzte','die Ärztinnen','die Arzt','die Arzten'],answer:'die Ärzte'},
 {type:'choice',prompt:'Plural von „die Journalistin“',options:['die Journalistinnen','die Journalisten','die Journalistin','der Journalist'],answer:'die Journalistinnen'},
 {type:'choice',prompt:'___ Mechatronikerin',options:['der','die'],answer:'die'},
 {type:'order',prompt:'Bilde die Frage.',tokens:['Was','machst','du','beruflich'],answer:['Was machst du beruflich','Was machst du beruflich?']},
 {type:'order',prompt:'Bilde die höfliche Frage.',tokens:['Was','sind','Sie','von','Beruf'],answer:['Was sind Sie von Beruf','Was sind Sie von Beruf?']},
 {type:'input',prompt:'Ich ___ Koch.',answer:['arbeite als']},
 {type:'input',prompt:'Ich ___ Lidl.',answer:['arbeite bei']},
 {type:'choice',prompt:'Das ist meine ___ Firma.',options:['eigener','eigene','eigenes','eigenen'],answer:'eigene'},
 {type:'choice',prompt:'Ich habe ein ___ Büro.',options:['eigener','eigene','eigenes','eigenen'],answer:'eigenes'},
 {type:'input',prompt:'Das ist mein ___ Job.',answer:['eigener']},
 {type:'input',prompt:'Ich suche einen ___ Job.',answer:['eigenen']},
 {type:'choice',prompt:'Ich habe keinen Job. Ich bin ___.',options:['arbeitslos','berufstätig','angestellt','beruflich'],answer:'arbeitslos'},
 {type:'choice',prompt:'Sie hat eine eigene Praxis. Sie ist ___.',options:['selbstständig','arbeitslos','zurzeit','beruflich'],answer:'selbstständig'},
 {type:'input',prompt:'Nach der Schule mache ich eine ___.',answer:['Ausbildung']},
 {type:'choice',prompt:'Der Journalist arbeitet bei einer ___.',options:['Zeitung','Praxis','Ausbildung','Geschichte'],answer:'Zeitung'},
 {type:'choice',prompt:'Was passt zusammen?',context:'der Arzt',options:['das Krankenhaus','die Zeitung','die Küche','die Schule'],answer:'das Krankenhaus'},
 {type:'choice',prompt:'Was passt zusammen?',context:'der Koch',options:['die Küche','die Praxis','die Zeitung','die Polizei'],answer:'die Küche'},
 {type:'choice',audio:'Was machen Sie beruflich?',audioFile:'l8t1_hoeren_12.mp3',prompt:'Welche Frage hörst du?',options:QUESTIONS,answer:'Was machen Sie beruflich?'}
]}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||{},theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null);if(!theme)return themes;
 const cards=prepareCards(theme);
 theme.number=1;theme.title='Berufe und Arbeit';theme.subtitle='Berufe, Berufsfragen, arbeiten als / bei und wichtige Wörter rund um Arbeit.';theme.chips=['Berufe','männlich / weiblich','Singular / Plural','Berufsfragen','eigen-','arbeiten als / bei'];
 theme.tasks=[
  cards,
  {id:'berufe-bild-v3',kind:'choice',title:'Bild und Beruf',icon:'🖼️',instruction:'Wähle den Beruf.',items:imageProfessionItems()},
  {id:'berufspaare-v3',kind:'choice',title:'Männlich und weiblich',icon:'🔁',instruction:'Wähle die passende Berufsform.',items:genderPairItems()},
  {id:'nomen-singular-plural-v3',kind:'dualinput',title:'Singular und Plural',icon:'✍️',instruction:'Schreibe Singular und Plural.',items:nounPluralItems(cards)},
  {id:'berufe-artikel-v3',kind:'choice',title:'Artikel der Berufe',icon:'✅',instruction:'Wähle der oder die.',items:articleItems()},
  {id:'beruf-saetze-ordnen-v3',kind:'order',title:'Fragen und Sätze ordnen',icon:'🧩',instruction:'Ordne die Wörter.',items:orderItems()},
  {id:'berufsfragen-antworten-v4',kind:'berufsinterview',title:'Berufsfrage und Antwort',icon:'💬',instruction:'Bilde die Frage und antworte.',items:interviewItems()},
  {id:'eigen-grammatik-v3',kind:'grammar',title:'eigener · eigene · eigenes · eigenen',icon:'🧲',instruction:'Wähle die richtige Form.',items:eigenChoice()},
  {id:'eigen-schreiben-v3',kind:'input',title:'eigen- selbst schreiben',icon:'✍️',instruction:'Schreibe die richtige Form.',items:eigenInput()},
  {id:'berufe-hoeren-v3',kind:'listen',title:'Hören: Beruf und Berufsfrage',icon:'🎧',instruction:'Höre und wähle.',items:listeningItems()},
  {id:'berufe-arbeitsorte-v3',kind:'matching',title:'Wer arbeitet wo?',icon:'🔗',instruction:'Ordne Beruf und Arbeitsplatz zu.',items:matchingItems()},
  {id:'berufe-dialoge-v3',kind:'dialog',title:'Dialoge: arbeiten als / bei und eigen-',icon:'💬',instruction:'Ergänze den Dialog.',items:dialogItems()},
  {id:'arbeit-wortschatz-v3',kind:'choice',title:'Wortschatz: Arbeit im Kontext',icon:'✅',instruction:'Wähle das passende Wort.',items:contextChoice()},
  {id:'arbeit-wortschatz-schreiben-v3',kind:'input',title:'Wortschatz selbst schreiben',icon:'✍️',instruction:'Schreibe das passende Wort.',items:contextInput()},
  {id:'pruefung-berufe-v3',kind:'exam',exam:true,title:'Prüfung',icon:'⭐',instruction:'Bearbeite die Prüfung.',items:examItems()}
 ];
 theme.tasks.forEach((task,index)=>task.order=index+1);theme.contentRevision='l8t1-20260829-rebuild2';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return themes;
});
})();