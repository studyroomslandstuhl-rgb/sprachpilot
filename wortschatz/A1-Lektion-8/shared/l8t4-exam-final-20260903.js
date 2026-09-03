(function(){
'use strict';
if(window.__SP_L8T4_EXAM_FINAL_20260903_V2)return;
window.__SP_L8T4_EXAM_FINAL_20260903_V2=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
const I=(prompt,answer,context='',hint='',extra={})=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint,...extra});
const C=(prompt,options,answer,context='',hint='',extra={})=>({type:'choice',prompt,options,answer,context,hint,...extra});
const F=(prompt,context,min=3)=>({type:'free',prompt,context,min});
function exam(){return{
 id:'pruefung',exam:true,spL8T4ExamFinal:true,title:'Prüfung',icon:'⭐',emoji:'⭐',kind:'mixed',
 instruction:'Bearbeite 15 Aufgaben. Schreibe die Antworten selbst. Nur bei zwei Aufgaben wählst du eine Antwort.',
 intro:'Die Aufgaben kommen in zufälliger Reihenfolge. Es gibt keine neuen Wörter.',
 items:[
  I('Schreibe das passende Wort.','befristet','Die Stelle ist nur für drei Monate.','Die Stelle ist nicht für immer.',{sourceTask:'A1'}),
  I('Was ist das?',['die Stellenanzeige','Stellenanzeige'],'','Achte auf den Artikel.',{image:CDN+'stellenanzeige.webp',sourceTask:'A2'}),
  I('Höre das Wort und schreibe es.',['Teilzeit','teilzeit'],'','Schreibe das gehörte Wort.',{audio:'Teilzeit',audioFile:AUDIO+'teilzeit.mp3',sourceTask:'A3'}),
  I('Schreibe das passende Wort.',['frei'],'Die Firma sucht noch eine Person. Die Stelle ist noch ___.','Denke an eine Stelle, die noch da ist.',{sourceTask:'A4'}),
  I('Schreibe die Alternative.','dienstags','jeden Dienstag → ___','Die Form endet mit -s.',{sourceTask:'A5'}),
  I('Schreibe die Alternative.','nachmittags','jeden Nachmittag → ___','Die Form endet mit -s.',{sourceTask:'A5'}),
  C('Welche Form ist falsch?',['morgens','jeden Morgen','jeder Morgen'],'jeder Morgen','Ich arbeite ___.','Setze jede Form in den Satz ein.',{sourceTask:'A6'}),
  I('Wann arbeitet man?',['nachmittags','am Nachmittag'],'Stellenanzeige: Teilzeit. Arbeitszeit von 14 bis 18 Uhr, montags bis freitags. Verdienst: 15 Euro pro Stunde.','Denke an die Tageszeit.',{sourceTask:'A7'}),
  I('Was passt zur Stelle?',['befristet'],'Stellenanzeige: Die Arbeit beginnt im Juni und endet im August.','Die Stelle ist nur für eine bestimmte Zeit.',{sourceTask:'A7'}),
  C('Welche Stelle passt Maria am besten?',['A','B','C','D'],'A','Maria sucht Teilzeit. Sie ist nachmittags frei.\n\nA · Service: Montag bis Freitag, 14–19 Uhr, Teilzeit.\nB · Nachhilfe: Montag bis Freitag, 8–12 Uhr, Teilzeit.\nC · Universität: Montag bis Freitag, 8–16 Uhr, Vollzeit.\nD · Aushilfe: Samstag und Sonntag, 9–13 Uhr.','Vergleiche die Arbeitszeit.',{sourceTask:'A8'}),
  I('Was muss die Frau für diese Arbeit gut können?',['am Computer arbeiten','mit dem Computer arbeiten','Computer'],'','Höre die Situation. Schreibe eine kurze Antwort.',{audio:'Frau: Guten Tag. Ich interessiere mich für die Stelle im Sekretariat. Ist sie befristet? Mann: Nein. Die Stelle ist nicht befristet. Frau: Ist es Vollzeit? Mann: Ja, montags bis freitags. Frau: Brauche ich Berufserfahrung? Mann: Erfahrung im Büro ist gut. Computerkenntnisse sind aber besonders wichtig.',audioFile:'l8t4_telefon_03.mp3',sourceTask:'A9'}),
  I('Kann die Frau die Stelle machen?',['ja','Ja'],'','Höre die Situation. Antworte mit ja oder nein.',{audio:'Frau: Guten Tag. Ich habe Ihre Anzeige für den Service gelesen. Ich habe noch nicht im Hotel gearbeitet. Kann ich mich trotzdem bewerben? Mann: Ja. Erfahrung ist nicht notwendig. Frau: Ich kann freitags und samstags ab siebzehn Uhr. Mann: Das passt sehr gut.',audioFile:'l8t4_telefon_05.mp3',sourceTask:'A9'}),
  I('Schreibe eine passende Frage.',['Ist die Stelle noch frei?','Ist Ihre Stelle noch frei?'],'Du möchtest wissen: Kann man sich noch bewerben?','Frage nach der Stelle.',{sourceTask:'A10'}),
  I('Schreibe eine passende Frage.',['Wann arbeitet man?','Wie ist die Arbeitszeit?','Wann ist die Arbeitszeit?'],'Du möchtest die Arbeitszeit wissen.','Frage nach der Zeit.',{sourceTask:'A10'}),
  F('Schreibe 3–4 kurze Sätze. Frage nach der Arbeitszeit und dem Verdienst. Schreibe auch, wann du Zeit hast.','Stellenanzeige: Aushilfe im Service. Teilzeit. Die Stelle ist frei.',3)
 ]
}}
function apply(theme){if(!theme||!Array.isArray(theme.tasks))return theme;const next=exam();const i=theme.tasks.findIndex(t=>t?.exam||String(t?.id||'')==='pruefung');if(i>=0)theme.tasks.splice(i,1,next);else theme.tasks.push(next);theme.contentRevision=String(theme.contentRevision||'')+'-exam-final-20260903-v2';if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;return theme}
const previous=window.L8_CONTENT_READY;window.L8_T4_EXAM_FINAL_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes}).catch(error=>{console.error('L8T4 Prüfung final',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T4_EXAM_FINAL_READY;window.L8T4ExamFinal20260903={apply,exam,version:2};
})();