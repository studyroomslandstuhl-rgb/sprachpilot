(function(){
'use strict';
if(window.__SP_L8T4_EXAM_FINAL_20260903_V1)return;
window.__SP_L8T4_EXAM_FINAL_20260903_V1=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
const I=(prompt,answer,context='',hint='',extra={})=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint,...extra});
const C=(prompt,options,answer,context='',hint='',extra={})=>({type:'choice',prompt,options,answer,context,hint,...extra});
const F=(prompt,context,min=3)=>({type:'free',prompt,context,min});
function exam(){
 return {
  id:'pruefung',exam:true,spL8T4ExamFinal:true,title:'Prüfung',icon:'⭐',emoji:'⭐',kind:'mixed',
  instruction:'Bearbeite 15 Aufgaben. Schreibe die Antworten selbst. Bei zwei Aufgaben wählst du eine Antwort.',
  intro:'Nur Wörter und Inhalte aus Thema 4. Die Aufgaben kommen in zufälliger Reihenfolge.',
  items:[
   I('Schreibe das passende Wort.','befristet','Die Stelle ist nur für drei Monate.','Denke an: für drei Monate.',{sourceTask:'A1'}),
   I('Was ist das?',['die Stellenanzeige','Stellenanzeige'],'','Achte auf den Artikel.',{image:CDN+'stellenanzeige.webp',sourceTask:'A2'}),
   I('Höre das Wort und schreibe es.',['die Stellenanzeige','Stellenanzeige'],'','Schreibe das Wort mit Artikel.',{audio:'die Stellenanzeige',audioFile:AUDIO+'stellenanzeige.mp3',sourceTask:'A3'}),
   I('Schreibe das passende Wort.',['der Verdienst','Verdienst'],'Wie viel Geld bekommt man für die Arbeit?','Denke an Geld für die Arbeit.',{sourceTask:'A4'}),
   I('Schreibe die Alternative.','donnerstags','jeden Donnerstag → ___','Die Form endet mit -s.',{sourceTask:'A5'}),
   I('Schreibe die Alternative.','nachmittags','jeden Nachmittag → ___','Die Form endet mit -s.',{sourceTask:'A5'}),
   C('Welche Form ist falsch?',['morgens','jeden Morgen','jeder Morgen'],'jeder Morgen','Ich arbeite ___.','Setze jede Form in den Satz ein.',{sourceTask:'A6'}),
   I('Wie lange ist die Stelle?',['vier Monate','für vier Monate'],'Stellenanzeige: Aushilfe im Service. Teilzeit von 8 bis 12 Uhr, montags bis freitags. 14 Euro pro Stunde. Die Stelle ist für vier Monate befristet.','Suche die Information zur Dauer.',{sourceTask:'A7'}),
   I('Wann arbeitet man?',['von 8 bis 12 Uhr','8 bis 12 Uhr','vormittags'],'Stellenanzeige: Aushilfe im Service. Teilzeit von 8 bis 12 Uhr, montags bis freitags. 14 Euro pro Stunde. Die Stelle ist für vier Monate befristet.','Suche die Arbeitszeit.',{sourceTask:'A7'}),
   C('Welche Stelle passt Maria am besten?',['A','B','C','D'],'A','Maria sucht Teilzeit. Sie ist nachmittags frei.\n\nA · Service: Teilzeit, Montag bis Freitag, 14–19 Uhr.\nB · Nachhilfe: Teilzeit, Montag bis Freitag, 8–12 Uhr.\nC · Universität: Vollzeit, Montag bis Freitag, 8–16 Uhr.\nD · Aushilfe: Samstag und Sonntag, 9–13 Uhr.','Vergleiche Arbeitszeit und Stelle.',{sourceTask:'A8'}),
   I('Ist die Stelle befristet?',['nein','Nein'],'','Höre auf die Information zur Stelle.',{audio:'Frau: Guten Tag. Ich interessiere mich für die Stelle im Sekretariat. Ist sie befristet? Mann: Nein, die Stelle ist dauerhaft. Frau: Ist es Vollzeit? Mann: Ja, montags bis freitags.',audioFile:'l8t4_telefon_03.mp3',sourceTask:'A9'}),
   I('Wann ist der Termin?',['morgen um zehn Uhr','morgen 10 Uhr','um zehn Uhr','10 Uhr'],'','Höre auf die Uhrzeit.',{audio:'Mann: Guten Tag. Ich rufe wegen der Nachhilfe-Stelle an. Frau: Ja, gern. Mann: Können wir uns morgen treffen? Frau: Ja, um zehn Uhr.',audioFile:'l8t4_telefon_02.mp3',sourceTask:'A9'}),
   I('Schreibe eine passende Frage.',['Wie viel verdient man?','Wie viel verdient man pro Stunde?','Wie hoch ist der Verdienst?'],'Du möchtest den Verdienst wissen.','Frage nach dem Geld für die Arbeit.',{sourceTask:'A10'}),
   I('Schreibe einen passenden Satz.',['Ich rufe wegen Ihrer Stellenanzeige an.','Ich rufe wegen der Stellenanzeige an.'],'Du rufst wegen einer Stellenanzeige an.','Beginne das Telefongespräch.',{sourceTask:'A10'}),
   F('Schreibe 3–4 kurze Sätze. Frage nach der Arbeitszeit und dem Verdienst. Schreibe auch, wann du Zeit hast.','Stellenanzeige: Aushilfe im Service. Teilzeit. Die Stelle ist frei.',3)
  ]
 };
}
function apply(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const next=exam();
 const i=theme.tasks.findIndex(t=>t?.exam||String(t?.id||'')==='pruefung');
 if(i>=0)theme.tasks.splice(i,1,next);else theme.tasks.push(next);
 theme.contentRevision=String(theme.contentRevision||'')+'-exam-final-20260903-v1';
 if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;
 return theme;
}
const previous=window.L8_CONTENT_READY;
window.L8_T4_EXAM_FINAL_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes;}).catch(error=>{console.error('L8T4 Prüfung final',error);return window.L8_ALL_THEMES||{}});
window.L8_CONTENT_READY=window.L8_T4_EXAM_FINAL_READY;
window.L8T4ExamFinal20260903={apply,exam,version:1};
})();