(function(root){
  'use strict';
  if(root.OneTimeDuplicateIncidentUI)return;

  function render(message,ok=true){
    let box=document.getElementById('sp-one-time-duplicate-incident-result');
    if(!box){
      box=document.createElement('div');box.id='sp-one-time-duplicate-incident-result';
      box.style.cssText='position:fixed;left:10px;right:10px;top:5vh;z-index:100060;max-height:78vh;overflow:auto;padding:16px;border-radius:12px;background:#fff;border:3px solid #2e7d32;box-shadow:0 12px 40px rgba(0,0,0,.28);white-space:pre-wrap;font:14px/1.45 system-ui;color:#13293d';
      const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.style.cssText='float:right;margin:0 0 8px 12px;padding:8px 12px';close.onclick=()=>box.remove();box.appendChild(close);
      const textBox=document.createElement('div');textBox.id='sp-one-time-duplicate-incident-text';box.appendChild(textBox);document.body.appendChild(box);
    }
    box.style.borderColor=ok?'#2e7d32':'#b3261e';const textBox=box.querySelector('#sp-one-time-duplicate-incident-text');if(textBox)textBox.textContent=message;
  }

  async function runThenContinue(original,button){
    const yes=root.confirm('Doppelte Profile in diesem einmaligen Alt-Daten-Vorfall zusammenführen?\n\nFür Alona, Shilan und Vlad wird genau ein Profil behalten. Fortschritte werden zusammengeführt. Punktestände verschiedener Doppelprofile werden EINMALIG addiert. Alias-Kopien desselben Profils werden nicht doppelt gezählt. Vorher werden Sicherungen erstellt. Alte Fortschrittsdokumente werden archiviert, nicht gelöscht. Diese Sonderaktion kann wegen eines Versionsmarkers nicht ein zweites Mal Punkte addieren.');
    if(!yes)return;
    button.disabled=true;
    render('Vorhandene Schüler- und Fortschrittsdaten werden geprüft. Die einmalige Doppelprofil-Zusammenführung läuft …',true);
    try{
      const result=await root.OneTimeDuplicateIncident.runOnce();
      render(root.OneTimeDuplicateIncident.summary(result)+'\n\nAls Nächstes wird die normale Restbereinigung fortgesetzt.',true);
      button.disabled=false;
      if(typeof original==='function')await original();
    }catch(error){
      console.error('Einmalige Doppelprofil-Zusammenführung fehlgeschlagen',error);
      const done=Array.isArray(error?.incidentResults)?error.incidentResults.map(x=>x.name).join(', '):'';
      const phase=error?.incidentStage?`\nPhase: ${error.incidentStage}`:'';
      const protection=done
        ?'Bereits abgeschlossene Gruppen besitzen ihren Einmal-Marker und werden bei einem neuen Versuch nicht erneut addiert.'
        :'Es wurde in diesem Versuch keine Gruppe als abgeschlossen bestätigt; die Restbereinigung bleibt gesperrt.';
      render(`Einmalige Doppelprofil-Zusammenführung gestoppt.\nFehler: ${error?.message||error}${phase}${done?`\nBereits sicher abgeschlossene Gruppen: ${done}`:''}\n\n${protection}\nDie Restbereinigung und der Sicherheits-Cutover bleiben blockiert.`,false);
      button.disabled=false;
      throw error;
    }
  }

  function install(){
    if(typeof document==='undefined')return;
    if(!root.OneTimeDuplicateIncident||!root.LegacyProgressResolution){setTimeout(install,120);return}
    const button=document.getElementById('sp-legacy-progress-resolution-btn');
    if(!button){setTimeout(install,120);return}
    if(button.dataset.oneTimeDuplicateWrapped==='1')return;
    const original=button.onclick;
    button.dataset.oneTimeDuplicateWrapped='1';
    button.textContent='Altprofile einmalig zusammenführen & Rest bereinigen';
    button.onclick=()=>runThenContinue(original,button).catch(()=>{});
  }

  root.OneTimeDuplicateIncidentUI={render,runThenContinue,install};
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,400));
    else setTimeout(install,400);
  }
})(typeof window!=='undefined'?window:globalThis);
