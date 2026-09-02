(function(){
'use strict';
if(window.__SP_L8T4_PHONE_WRITING_20260902_V1)return;window.__SP_L8T4_PHONE_WRITING_20260902_V1=true;
const gap=(kind,answer,options=[],hint='')=>({kind,answer:Array.isArray(answer)?answer:[answer],options,hint});
const line=(speaker,text)=>({speaker,text});
const dialog=(title,stage,lines,gaps)=>({title,stage,lines,gaps});
const PHONE_DIALOGUES=[
 dialog('Restaurant Milano','Wähle die passenden Wörter.',[
  line('Arbeitgeber','Guten Tag, Restaurant Milano.'),
  line('Bewerberin','Guten Tag, mein Name ist Lina Weber. Ich habe Ihre {{0}} gelesen. Sie suchen eine {{1}} im Service. Ist die {{2}} noch frei?'),
  line('Arbeitgeber','Ja, die Stelle ist noch frei.'),
  line('Bewerberin','Gut. Wie sind die {{3}}?'),
  line('Arbeitgeber','Halbtags, vormittags von 8 bis 12 Uhr.'),
  line('Bewerberin','Ja, {{4}}. Und wie ist der {{5}}?'),
  line('Arbeitgeber','Wir zahlen 15 Euro pro Stunde.'),
  line('Bewerberin','Gut, danke.'),
  line('Arbeitgeber','Dann kommen Sie doch einmal vorbei. Können Sie am Montag um 13 Uhr kommen?'),
  line('Bewerberin','Ja, das kann ich. Bis Montag. {{6}}.')
 ],[
  gap('choice','Stellenanzeige',['Nachfrage','Stellenanzeige','Arbeitszeit']),
  gap('choice','Aushilfe',['Stelle','Service','Aushilfe']),
  gap('choice','Stelle',['Stelle','Universität','Nachfrage']),
  gap('choice','Arbeitszeiten',['Verdienste','Arbeitszeiten','Stellenanzeigen']),
  gap('choice','das passt',['das passt','das Ausland','die Stelle']),
  gap('choice','Verdienst',['Arbeitsplatz','Verdienst','Service']),
  gap('choice','Auf Wiederhören',['Guten Morgen','Auf Wiederhören','Bis gestern'])
 ]),
 dialog('Café Sonnig','Wähle die passenden Wörter.',[
  line('Arbeitgeberin','Café Sonnig, guten Tag.'),
  line('Bewerber','Guten Tag, hier ist Karim Özdemir. Ich rufe wegen Ihrer {{0}} an. Sie suchen eine {{1}}. Ist die Stelle noch {{2}}?'),
  line('Arbeitgeberin','Ja, wir suchen noch jemanden.'),
  line('Bewerber','Wie sind die {{3}}?'),
  line('Arbeitgeberin','Teilzeit, nachmittags von 14 bis 18 Uhr.'),
  line('Bewerber','Das passt. Wie viel zahlen Sie {{4}}?'),
  line('Arbeitgeberin','14 Euro pro Stunde.'),
  line('Bewerber','Gut. Kann ich einmal {{5}}?'),
  line('Arbeitgeberin','Ja. Können Sie am Dienstag um 10 Uhr kommen?'),
  line('Bewerber','Ja, das kann ich. Dann bis Dienstag. {{6}}.')
 ],[
  gap('choice','Stellenanzeige',['Arbeitszeit','Stellenanzeige','Nachfrage']),
  gap('choice','Aushilfe',['Aushilfe','Verdienst','Arbeitsplatz']),
  gap('choice','frei',['befristet','frei','dringend']),
  gap('choice','Arbeitszeiten',['Stellen','Arbeitszeiten','Verdienste']),
  gap('choice','pro Stunde',['pro Stunde','halbtags','im Ausland']),
  gap('choice','vorbeikommen',['vorbeikommen','Vollzeit arbeiten','eine Nachfrage']),
  gap('choice','Auf Wiederhören',['Auf Wiederhören','Guten Tag','Bis gestern'])
 ]),
 dialog('Hotel Central','Wähle die passenden Wörter.',[
  line('Arbeitgeber','Hotel Central, guten Tag.'),
  line('Bewerberin','Guten Tag. Mein Name ist Elena Popa. Ich habe Ihre {{0}} gelesen. Sie suchen eine Aushilfe im {{1}}. Ist die Stelle noch frei?'),
  line('Arbeitgeber','Ja.'),
  line('Bewerberin','Und wie sind die {{2}}?'),
  line('Arbeitgeber','Freitags und samstags ab 17 Uhr, ungefähr bis 22 Uhr.'),
  line('Bewerberin','Sehr gut, {{3}}. Wie ist der {{4}} pro Stunde?'),
  line('Arbeitgeber','16 Euro pro Stunde.'),
  line('Bewerberin','Gut.'),
  line('Arbeitgeber','Dann kommen Sie doch am Mittwoch um 15 Uhr vorbei.'),
  line('Bewerberin','Ja, gern. Bis Mittwoch. {{5}}.')
 ],[
  gap('choice','Stellenanzeige',['Stellenanzeige','Arbeitsplatz','Nachfrage']),
  gap('choice','Service',['Nachhilfe','Service','Ausland']),
  gap('choice','Arbeitszeiten',['Arbeitszeiten','Verdienste','Stellenanzeigen']),
  gap('choice','das passt',['die Stelle','das passt','die Universität']),
  gap('choice','Verdienst',['Service','Verdienst','Arbeitsplatz']),
  gap('choice','Auf Wiederhören',['Bis gestern','Auf Wiederhören','Guten Morgen'])
 ]),
 dialog('Universität West','Wähle und schreibe.',[
  line('Arbeitgeber','Universität West, Sekretariat, guten Tag.'),
  line('Bewerberin','Guten Tag. Mein Name ist Marta Nowak. Ich habe Ihre {{0}} gelesen. Ist die {{1}} im Sekretariat noch frei?'),
  line('Arbeitgeber','Ja, die Stelle ist noch frei.'),
  line('Bewerberin','Wie sind die {{2}}?'),
  line('Arbeitgeber','Teilzeit, vormittags von 8 bis 12 Uhr.'),
  line('Bewerberin','Ja, {{3}}. Und wie ist der {{4}} pro Stunde?'),
  line('Arbeitgeber','17 Euro pro Stunde.'),
  line('Bewerberin','Gut. Kann ich einmal vorbeikommen?'),
  line('Arbeitgeber','Können Sie am Freitag um 9 Uhr kommen?'),
  line('Bewerberin','Ja, das kann ich. {{5}}.')
 ],[
  gap('input','Stellenanzeige',[], 'Das Wort beginnt mit Stellen-.'),
  gap('choice','Stelle',['Arbeitszeit','Stelle','Nachfrage']),
  gap('input','Arbeitszeiten',[],'Frage nach der Zeit: Wie sind die …?'),
  gap('choice','das passt',['das passt','die Stelle','Vollzeit']),
  gap('input','Verdienst',[],'Frage nach dem Geld.'),
  gap('choice','Auf Wiederhören',['Guten Morgen','Bis gestern','Auf Wiederhören'])
 ]),
 dialog('Seniorenhilfe','Wähle und schreibe.',[
  line('Arbeitgeberin','Seniorenhilfe Saar, guten Tag.'),
  line('Bewerber','Guten Tag. Ich heiße David Klein. Ich habe Ihre {{0}} gelesen. Sie suchen eine {{1}}. Ist die Stelle noch {{2}}?'),
  line('Arbeitgeberin','Ja.'),
  line('Bewerber','Wie sind die {{3}}?'),
  line('Arbeitgeberin','Samstags und sonntags, vormittags von 9 bis 13 Uhr.'),
  line('Bewerber','Ja, {{4}}. Und wie viel zahlen Sie {{5}}?'),
  line('Arbeitgeberin','15 Euro pro Stunde.'),
  line('Bewerber','Gut.'),
  line('Arbeitgeberin','Können Sie am Montag um 14 Uhr vorbeikommen?'),
  line('Bewerber','Ja, gern. Bis Montag. {{6}}.')
 ],[
  gap('input','Stellenanzeige'),
  gap('choice','Aushilfe',['Aushilfe','Nachfrage','Arbeitsplatz']),
  gap('choice','frei',['dringend','befristet','frei']),
  gap('input','Arbeitszeiten'),
  gap('input','das passt'),
  gap('choice','pro Stunde',['im Ausland','pro Stunde','halbtags']),
  gap('input','Auf Wiederhören')
 ]),
 dialog('Nachhilfe Plus','Wähle und schreibe.',[
  line('Arbeitgeber','Nachhilfe Plus, guten Tag.'),
  line('Bewerberin','Guten Tag. Mein Name ist Sofia Marin. Ich rufe wegen Ihrer {{0}} an. Ist die {{1}} noch frei?'),
  line('Arbeitgeber','Ja, wir suchen noch eine Aushilfe für die Nachhilfe.'),
  line('Bewerberin','Wie sind die {{2}}?'),
  line('Arbeitgeber','Dienstags und donnerstags von 16 bis 19 Uhr.'),
  line('Bewerberin','Das passt. Und wie ist der {{3}}?'),
  line('Arbeitgeber','18 Euro {{4}}.'),
  line('Bewerberin','Gut. Kann ich einmal vorbeikommen?'),
  line('Arbeitgeber','Ja. Können Sie am Donnerstag um 15 Uhr kommen?'),
  line('Bewerberin','Ja, das kann ich. {{5}}.')
 ],[
  gap('input','Stellenanzeige'),
  gap('input','Stelle'),
  gap('choice','Arbeitszeiten',['Verdienste','Arbeitszeiten','Stellen']),
  gap('input','Verdienst'),
  gap('choice','pro Stunde',['halbtags','pro Stunde','im Ausland']),
  gap('input','Auf Wiederhören')
 ]),
 dialog('Bistro Markt','Schreibe die wiederkehrenden Teile selbst.',[
  line('Arbeitgeberin','Bistro Markt, guten Tag.'),
  line('Bewerber','Guten Tag. Mein Name ist Omar Hassan. Ich habe Ihre {{0}} gelesen. Ist die {{1}} noch {{2}}?'),
  line('Arbeitgeberin','Ja, wir suchen noch eine Aushilfe im Service.'),
  line('Bewerber','Wie sind die {{3}}?'),
  line('Arbeitgeberin','Halbtags, nachmittags von 13 bis 17 Uhr.'),
  line('Bewerber','Ja, {{4}}. Und wie ist der {{5}} {{6}}?'),
  line('Arbeitgeberin','15 Euro pro Stunde.'),
  line('Bewerber','Gut. Kann ich einmal vorbeikommen?'),
  line('Arbeitgeberin','Können Sie am Mittwoch um 11 Uhr kommen?'),
  line('Bewerber','Ja, gern. Bis Mittwoch. {{7}}.')
 ],[
  gap('input','Stellenanzeige'),gap('input','Stelle'),gap('input','frei'),gap('input','Arbeitszeiten'),gap('input','das passt'),gap('input','Verdienst'),gap('input','pro Stunde'),gap('input','Auf Wiederhören')
 ]),
 dialog('Büro Aktiv','Schreibe die wiederkehrenden Teile selbst.',[
  line('Arbeitgeber','Büro Aktiv, guten Tag.'),
  line('Bewerberin','Guten Tag. Hier ist Nina Fischer. Ich rufe wegen Ihrer {{0}} an. Sie suchen eine Sekretärin. Ist die {{1}} noch {{2}}?'),
  line('Arbeitgeber','Ja.'),
  line('Bewerberin','Gut. Wie sind die {{3}}?'),
  line('Arbeitgeber','Vollzeit, montags bis freitags von 8 bis 16 Uhr.'),
  line('Bewerberin','Ja, {{4}}. Wie ist der {{5}} {{6}}?'),
  line('Arbeitgeber','20 Euro pro Stunde.'),
  line('Bewerberin','Gut. Kann ich einmal {{7}}?'),
  line('Arbeitgeber','Können Sie am Mittwoch um 10 Uhr kommen?'),
  line('Bewerberin','Ja, das kann ich. {{8}}.')
 ],[
  gap('input','Stellenanzeige'),gap('input','Stelle'),gap('input','frei'),gap('input','Arbeitszeiten'),gap('input','das passt'),gap('input','Verdienst'),gap('input','pro Stunde'),gap('input','vorbeikommen'),gap('input','Auf Wiederhören')
 ]),
 dialog('Café Rosen','Schreibe den Dialog fast vollständig selbst.',[
  line('Arbeitgeberin','Café Rosen, guten Tag.'),
  line('Bewerber','Guten Tag. Mein Name ist Luis Romero. Ich habe Ihre {{0}} gelesen. Sie suchen eine {{1}}. Ist die {{2}} noch {{3}}?'),
  line('Arbeitgeberin','Ja, die Stelle ist noch frei.'),
  line('Bewerber','Wie sind die {{4}}?'),
  line('Arbeitgeberin','Teilzeit, abends von 17 bis 21 Uhr.'),
  line('Bewerber','Ja, {{5}}. Und wie ist der {{6}} {{7}}?'),
  line('Arbeitgeberin','16 Euro pro Stunde.'),
  line('Bewerber','Gut. Kann ich einmal {{8}}?'),
  line('Arbeitgeberin','Können Sie am Dienstag um 12 Uhr kommen?'),
  line('Bewerber','Ja, gern. Bis Dienstag. {{9}}.')
 ],[
  gap('input','Stellenanzeige'),gap('input','Aushilfe'),gap('input','Stelle'),gap('input','frei'),gap('input','Arbeitszeiten'),gap('input','das passt'),gap('input','Verdienst'),gap('input','pro Stunde'),gap('input','vorbeikommen'),gap('input','Auf Wiederhören')
 ]),
 dialog('Restaurant am Park','Schreibe den Dialog selbst.',[
  line('Arbeitgeber','Restaurant am Park, guten Tag.'),
  line('Bewerberin','Guten Tag. Mein Name ist Aylin Demir. Ich habe Ihre {{0}} gelesen. Sie suchen eine {{1}} im {{2}}. Ist die {{3}} noch {{4}}?'),
  line('Arbeitgeber','Ja, wir suchen noch jemanden.'),
  line('Bewerberin','Gut. Wie sind die {{5}}?'),
  line('Arbeitgeber','Halbtags, vormittags von 9 bis 13 Uhr.'),
  line('Bewerberin','Ja, {{6}}. Und wie ist der {{7}} {{8}}?'),
  line('Arbeitgeber','20 Euro pro Stunde.'),
  line('Bewerberin','Gut. Kann ich einmal {{9}}?'),
  line('Arbeitgeber','Können Sie am Montag um 13 Uhr kommen?'),
  line('Bewerberin','Ja, das kann ich. Dann bis Montag. {{10}}.')
 ],[
  gap('input','Stellenanzeige'),gap('input','Aushilfe'),gap('input','Service'),gap('input','Stelle'),gap('input','frei'),gap('input','Arbeitszeiten'),gap('input','das passt'),gap('input','Verdienst'),gap('input','pro Stunde'),gap('input','vorbeikommen'),gap('input','Auf Wiederhören')
 ])
];
function phoneTask(){return{id:'l8t4-telefon-dialoge-v1',title:'Telefon: Stellenanzeige',kind:'phone-dialog-progressive',icon:'☎️',emoji:'☎️',spL8T4PhoneDialog:true,instruction:'Ergänze den Dialog am Telefon.',items:PHONE_DIALOGUES}}
const EXAMPLE='Krankenpflegerin sucht Stelle\nIch suche eine Stelle als Krankenpflegerin. Ich möchte halbtags arbeiten, am besten vormittags. Ich suche eine unbefristete Stelle. Ich kann ab sofort anfangen.';
const WRITING_ITEMS=[
 {title:'Anzeige 1',facts:['Beruf: Krankenpflegerin','Arbeitszeit: halbtags','Dauer: unbefristet','Zeit: vormittags','Start: ab sofort'],required:[['krankenpflegerin'],['halbtags','halbtag'],['unbefristet'],['vormittags','vormittag'],['stelle','arbeit']]},
 {title:'Anzeige 2',facts:['Beruf: Sekretärin','Arbeitszeit: Teilzeit','Dauer: unbefristet','Zeit: vormittags'],required:[['sekretärin','sekretaerin'],['teilzeit'],['unbefristet'],['vormittags','vormittag'],['stelle','arbeit']]},
 {title:'Anzeige 3',facts:['Beruf: Aushilfe im Service','Arbeitszeit: abends','Dauer: für drei Monate'],required:[['aushilfe'],['service'],['abends','abend'],['drei monate','3 monate'],['stelle','arbeit']]},
 {title:'Anzeige 4',facts:['Arbeit: Nachhilfe','Zeit: dienstags und donnerstags','Tageszeit: nachmittags','Arbeitszeit: Teilzeit'],required:[['nachhilfe'],['dienstags','dienstag'],['donnerstags','donnerstag'],['nachmittags','nachmittag'],['teilzeit'],['stelle','arbeit']]},
 {title:'Anzeige 5',facts:['Beruf: Sekretär','Arbeitszeit: Vollzeit','Zeit: tagsüber','Dauer: unbefristet'],required:[['sekretär','sekretaer'],['vollzeit'],['tagsüber','tagsueber'],['unbefristet'],['stelle','arbeit']]},
 {title:'Anzeige 6',facts:['Arbeit: Aushilfe','Zeit: samstags und sonntags','Arbeitszeit: halbtags','Dauer: für zwei Monate'],required:[['aushilfe'],['samstags','samstag'],['sonntags','sonntag'],['halbtags','halbtag'],['zwei monate','2 monate'],['stelle','arbeit']]}
];
function writingTask(){return{id:'l8t4-schreiben-stellengesuch-v1',title:'Schreiben: Anzeige',kind:'job-ad-writing',icon:'✍️',emoji:'✍️',spL8T4JobAdWriting:true,instruction:'Du suchst eine Stelle. Schreibe eine kurze Anzeige.',example:EXAMPLE,items:WRITING_ITEMS}}
function themeOf(all){return all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null)}
function replace(theme,ids,next){const i=(theme.tasks||[]).findIndex(t=>ids.includes(String(t?.id||'')));if(i>=0)theme.tasks.splice(i,1,next);return i}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const phone=phoneTask(),writing=writingTask();
 let p=replace(theme,['l8t4-telefon-saetze','l8t4-telefon-dialoge-v1'],phone);
 if(p<0){const exam=theme.tasks.findIndex(t=>t?.exam);theme.tasks.splice(exam>=0?exam:theme.tasks.length,0,phone)}
 let w=replace(theme,['l8t4-schreiben-nachfrage','l8t4-schreiben-stellengesuch-v1'],writing);
 if(w<0){const exam=theme.tasks.findIndex(t=>t?.exam);theme.tasks.splice(exam>=0?exam:theme.tasks.length,0,writing)}
 theme.contentRevision='l8t4-phone-writing-20260902-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme
}
const previous=window.L8_CONTENT_READY;window.L8_T4_PHONE_WRITING_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes}).catch(error=>{console.error('L8T4 Telefon-/Schreibaufgaben',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T4_PHONE_WRITING_READY;window.L8T4PhoneWriting20260902={apply,version:1};
})();
