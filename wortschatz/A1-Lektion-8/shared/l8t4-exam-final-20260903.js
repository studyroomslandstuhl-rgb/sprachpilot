(function(){
'use strict';
if(window.__SP_L8T4_EXAM_FINAL_20260903_V4)return;
window.__SP_L8T4_EXAM_FINAL_20260903_V4=true;
const CDN='https://sprachpilot.b-cdn.net/';
const themeOf=all=>all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
const I=(prompt,answer,context='',hint='',extra={})=>({type:'input',prompt,answer:Array.isArray(answer)?answer:[answer],context,hint,...extra});
const C=(prompt,options,answer,context='',hint='',extra={})=>({type:'choice',prompt,options,answer,context,hint,...extra});
const F=(prompt,context,min=3)=>({type:'free',prompt,context,min});
function exam(){return{
 id:'pruefung',exam:true,spL8T4ExamFinal:true,title:'Prüfung',icon:'⭐',emoji:'⭐',kind:'mixed',
 instruction:'Bearbeite 15 Aufgaben. Schreibe die Antworten selbst. Nur bei einer Aufgabe wählst du eine Antwort.',
 intro:'Die Aufgaben kommen in zufälliger Reihenfolge. Es gibt keine neuen Wörter und keine Höraufgabe.',
 items:[
  I('Schreibe das passende Wort.','befristet','Die Stelle ist nur für drei Monate.','Die Stelle ist nicht für immer.',{sourceTask:'A1'}),
  I('Was ist das?',['die Stellenanzeige','Stellenanzeige'],'','Achte auf den Artikel.',{image:CDN+'stellenanzeige.webp',sourceTask:'A2'}),
  I('Was passt?',['Teilzeit','teilzeit'],'Die Person arbeitet nur 20 Stunden pro Woche.','Vollzeit oder Teilzeit?',{sourceTask:'A3'}),
  I('Schreibe das passende Wort.',['frei'],'Die Firma sucht noch eine Person. Die Stelle ist noch ___.','Denke an eine Stelle, die noch da ist.',{sourceTask:'A4'}),
  I('Schreibe die Alternative.','dienstags','jeden Dienstag → ___','Die Form endet mit -s.',{sourceTask:'A5'}),
  I('Schreibe die Alternative.','nachmittags','jeden Nachmittag → ___','Die Form endet mit -s.',{sourceTask:'A5'}),
  C('Welche Form ist falsch?',['morgens','jeden Morgen','jeder Morgen'],'jeder Morgen','Ich arbeite ___.','Setze jede Form in den Satz ein.',{sourceTask:'A6'}),
  I('Passt die Stelle für Maria? Schreibe ja oder nein.',['ja','Ja'],'Maria hat vormittags Deutschkurs und sucht Teilzeit.\n\nStellenanzeige: Aushilfe im Service. Montag bis Freitag von 14 bis 18 Uhr. Teilzeit. 15 Euro pro Stunde.','Vergleiche Marias Zeit mit der Arbeitszeit.',{sourceTask:'A7'}),
  I('Kann David diese Stelle bis zum Ende machen? Schreibe ja oder nein.',['ja','Ja'],'David hat bis Ende August Zeit. Im September beginnt sein Deutschkurs.\n\nStellenanzeige: Vollzeit von Juni bis August. Montag bis Freitag von 8 bis 16 Uhr.','Vergleiche die Monate.',{sourceTask:'A7'}),
  I('Welche Stelle passt zu Sofia? Schreibe A, B, C oder D.',['B','b'],'Sofia hat vormittags Zeit. Sie hat schon im Café gearbeitet und sucht Teilzeit. Am Wochenende möchte sie frei haben.\n\nA · Restaurant: Freitag und Samstag, 17–22 Uhr.\nB · Café: Montag bis Freitag, 7–12 Uhr, Teilzeit.\nC · Universität: Montag bis Freitag, 8–16 Uhr, Vollzeit.\nD · Nachhilfe: Montag, Mittwoch und Freitag, 15–18 Uhr.','Vergleiche Zeit, Erfahrung und Teilzeit.',{sourceTask:'A8'}),
  I('Passt die Arbeitszeit zur Frau? Schreibe ja oder nein.',['ja','Ja'],'Frau: Ich habe vormittags Deutschkurs und suche eine Arbeit am Nachmittag.\nMann: Wir suchen eine Aushilfe montags bis freitags von 14 bis 18 Uhr.','Vergleiche ihre freie Zeit mit der Arbeitszeit.',{sourceTask:'A9'}),
  I('Kann die Frau sich für die Stelle melden? Schreibe ja oder nein.',['ja','Ja'],'Frau: Ich habe noch nicht im Büro gearbeitet, aber ich kann gut mit dem Computer arbeiten.\nMann: Erfahrung im Büro ist gut, aber nicht nötig. Computerkenntnisse sind wichtig.','Was ist für die Stelle wirklich wichtig?',{sourceTask:'A9'}),
  I('Schreibe eine passende Frage für das Telefon.',['Ist die Stelle noch frei?','Ist Ihre Stelle noch frei?'],'Du hast eine Stellenanzeige gelesen. Du möchtest wissen: Gibt es die Stelle noch?','Frage nach der Stelle.',{sourceTask:'A10'}),
  I('Schreibe eine passende Frage.',['Wann arbeitet man?','Wie ist die Arbeitszeit?','Wann ist die Arbeitszeit?'],'Du möchtest die Arbeitszeit wissen.','Frage nach der Zeit.',{sourceTask:'A10'}),
  F('Schreibe eine kurze Nachricht mit mindestens 4 Sätzen. Schreibe, für welche Stelle du dich interessierst und wann du Zeit hast. Frage nach der Arbeitszeit und dem Verdienst.','Stellenanzeige: Aushilfe im Service. Teilzeit. Die Stelle ist frei.',4)
 ]
}}
function apply(theme){if(!theme||!Array.isArray(theme.tasks))return theme;const next=exam();const i=theme.tasks.findIndex(t=>t?.exam||String(t?.id||'')==='pruefung');if(i>=0)theme.tasks.splice(i,1,next);else theme.tasks.push(next);theme.contentRevision=String(theme.contentRevision||'')+'-exam-final-20260903-v4';if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;return theme}
const previous=window.L8_CONTENT_READY;window.L8_T4_EXAM_FINAL_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes}).catch(error=>{console.error('L8T4 Prüfung final',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T4_EXAM_FINAL_READY;window.L8T4ExamFinal20260903={apply,exam,version:4};
})();