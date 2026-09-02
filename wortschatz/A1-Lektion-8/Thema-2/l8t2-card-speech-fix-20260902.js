(function(){
'use strict';
const taskId=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(taskId!=='karteikarten'&&taskId!=='cards')return;
if(window.__SP_L8T2_CARD_SPEECH_FIX_20260902_V1)return;window.__SP_L8T2_CARD_SPEECH_FIX_20260902_V1=true;
let active=null,scheduled=false;
function acceptedForCurrent(){
 const theme=window.L8_THEME,S=window.L8S;if(!theme||!S)return[];
 const task=(theme.tasks||[]).find(t=>String(t.id).toLowerCase()==='karteikarten'||String(t.id).toLowerCase()==='cards'||t.kind==='cards');if(!task)return[];
 const state=S.load(theme.number,task.id,task.items.length);const idx=Number(state?.current);const card=Number.isInteger(idx)&&idx>=0?task.items[idx]:null;if(!card)return[];
 return [card.term,card.full,card.word,...(card.answers||[]),...(card.accepted||[])].filter(Boolean)
}
function show(type,text){const box=document.getElementById('feedback');if(box)box.innerHTML=`<div class="l8-feedback ${type}">${String(text||'')}</div>`}
function bind(){
 scheduled=false;const btn=document.getElementById('cardMic'),input=document.getElementById('cardInput'),check=document.getElementById('cardCheck');if(!btn||btn.dataset.spSpeechFix==='1')return;
 btn.dataset.spSpeechFix='1';btn.onclick=()=>{
  if(active)return;
  const R=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!R){show('warn','Die Spracherkennung ist in diesem Browser nicht verfügbar. Bitte öffne SprachPilot in Chrome oder nutze Schreiben.');return}
  let r;try{r=new R()}catch(e){show('warn','Das Mikrofon konnte nicht gestartet werden.');return}
  active=r;btn.disabled=true;btn.textContent='🎤 Ich höre …';r.lang='de-DE';r.interimResults=false;r.continuous=false;r.maxAlternatives=8;
  r.onresult=e=>{
   const values=Array.from(e.results?.[0]||[]).map(x=>String(x.transcript||'').trim()).filter(Boolean),accepted=acceptedForCurrent();
   const best=values.find(v=>window.L8S?.equal?.(v,accepted))||values[0]||'';
   if(input&&best){input.value=best;input.dispatchEvent(new Event('input',{bubbles:true}));}
   active=null;btn.disabled=false;btn.textContent='🎤 Sprechen';if(best&&check)check.click();else show('warn','Ich konnte nichts erkennen. Versuch es noch einmal.');
  };
  r.onerror=e=>{active=null;btn.disabled=false;btn.textContent='🎤 Sprechen';const code=String(e?.error||'');show('warn',code==='not-allowed'?'Bitte erlaube den Mikrofonzugriff für SprachPilot.':'Das Mikrofon hat nicht funktioniert. Versuch es noch einmal.')};
  r.onend=()=>{if(active===r){active=null;btn.disabled=false;btn.textContent='🎤 Sprechen'}};
  try{r.start()}catch(e){active=null;btn.disabled=false;btn.textContent='🎤 Sprechen';show('warn','Das Mikrofon konnte nicht gestartet werden.')}
 };
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(bind)}
const root=document.getElementById('app');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
[0,80,250,600].forEach(ms=>setTimeout(bind,ms));
})();
