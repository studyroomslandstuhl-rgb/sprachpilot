(function(){
'use strict';
if(window.__SP_L8T4_OVERVIEW_COPY_20260903)return;
window.__SP_L8T4_OVERVIEW_COPY_20260903=true;
const previous=window.L8_CONTENT_READY;
window.L8_CONTENT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{},theme=all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null);
 if(!theme||!Array.isArray(theme.tasks))return themes;
 const short={
  'karteikarten':'Lerne die Wörter.',
  'l8t4-bild-wort':'Wähle das passende Wort.',
  'l8t4-hoeren-bild':'Höre und wähle das Bild.',
  'l8t4-bedeutung-wort':'Schreibe das passende Wort.',
  'l8t4-zeiten-s':'Schreibe die andere Form.',
  'l8t4-falsche-form-v2':'Finde die falsche Form.',
  'l8t4-stellenanzeigen-verstehen-v2':'Lies und entscheide: richtig oder falsch.',
  'l8t4-person-anzeige-v2':'Welche Stelle passt zur Person?',
  'l8t4-telefon-hoeren':'Höre und beantworte die Fragen.',
  'l8t4-telefon-saetze':'Wähle den passenden Satz.',
  'l8t4-telefon-dialoge-v2':'Ergänze die Telefongespräche.',
  'l8t4-schreiben-nachfrage':'Schreibe eine kurze Nachricht.',
  'pruefung':'Bearbeite die Prüfung.'
 };
 for(const task of theme.tasks){
  const id=String(task?.id||'');
  if(short[id])task.instruction=short[id];
  else if(task?.exam)task.instruction='Bearbeite die Prüfung.';
  else if(task?.spL8T4ListeningGroups)task.instruction='Höre und beantworte die Fragen.';
  else if(task?.spL8T4PersonAds)task.instruction='Welche Stelle passt zur Person?';
 }
 return themes;
});
})();