(function(){
'use strict';
if(window.__SP_L8T2_TASK4_PLURAL_UI_20260903)return;
window.__SP_L8T2_TASK4_PLURAL_UI_20260903=true;

const TASK_ID='zeitwoerter-artikel-plural';
const AUDIO=[
 'https://sprachpilot.b-cdn.net/audio/sekunde.mp3',
 'https://sprachpilot.b-cdn.net/audio/minute.mp3',
 'https://sprachpilot.b-cdn.net/audio/stunde.mp3',
 'https://sprachpilot.b-cdn.net/audio/tag.mp3',
 'https://sprachpilot.b-cdn.net/audio/woche.mp3',
 'https://sprachpilot.b-cdn.net/audio/monat.mp3',
 'https://sprachpilot.b-cdn.net/audio/jahr.mp3'
];
const base=window.L8UI;
if(!base||typeof base.taskPage!=='function')return;
const originalTaskPage=base.taskPage;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S=()=>window.L8S;
const T=()=>window.L8_THEME;

function currentTask(){
 const id=new URLSearchParams(location.search).get('task');
 return (T()?.tasks||[]).find(task=>String(task?.id)===String(id))||null;
}
function taskNumber(task){
 const i=(T()?.tasks||[]).findIndex(x=>String(x?.id)===String(task?.id));
 return i>=0?i+1:'';
}
function feedback(type,text){
 const box=document.getElementById('feedback');
 if(box)box.innerHTML=`<div class="l8-feedback ${type}">${esc(text)}</div>`;
}
function finish(root){
 root.innerHTML='<div class="l8-wrap"><section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle Pluralformen richtig geschrieben.</p><div class="l8-row l8-center-actions"><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></div></section></div>';
}
function audioFor(item,index){
 const raw=String(item?.audioFile||item?.audio||'').trim();
 if(/^https?:\/\//i.test(raw)||/\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(raw))return raw;
 return AUDIO[index%AUDIO.length];
}
function render(task,root){
 const total=task.items.length;
 let state=S().load(T().number,task.id,total),idx=S().nextIndex(T().number,task.id,total);
 if(idx==null||idx<0)return finish(root);
 state=S().load(T().number,task.id,total);
 const item=task.items[idx],done=state.done?.length||0,pct=Math.round(done/Math.max(1,total)*100),audio=audioFor(item,idx);
 root.innerHTML=`<div class="l8-wrap"><section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe ${taskNumber(task)}</span><h1>${esc(task.title||'Zeitwörter: Plural')}</h1><p>🎧 ${esc(task.instruction||'Höre das Wort. Schreibe den Plural immer mit Artikel.')}</p></div><div class="l8-progress-row"><span>${done} von ${total} fertig</span><strong>${pct}%</strong></div><div class="l8-progress"><div style="width:${pct}%"></div></div></section><section class="l8-card l8-exercise sp-l8t2-a4"><div class="sp-l8t2-a4-listen"><button class="l8-btn l8-audio" id="spL8T2A4Listen" type="button">🔊 Hör zu</button></div><div class="l8-prompt">${esc(item.prompt||'Schreibe den Plural mit Artikel.')}</div><div class="l8-answer-row"><input class="l8-input" id="spL8T2A4Answer" autocomplete="off" placeholder="z. B. die Minuten"><button class="l8-btn primary" id="spL8T2A4Check" type="button">Prüfen</button></div><div id="feedback"></div></section></div>`;
 const input=document.getElementById('spL8T2A4Answer');
 const checkBtn=document.getElementById('spL8T2A4Check');
 const listenBtn=document.getElementById('spL8T2A4Listen');
 listenBtn.onclick=()=>S().say('',audio);
 const check=()=>{
  const value=String(input.value||'').trim();
  if(!value){feedback('warn','Schreibe zuerst den Plural mit Artikel.');return}
  if(S().equal(value,item.answer)){
   const result=S().right(T().number,task.id,total,idx,value);
   feedback('good',result.needsReview?'Richtig. Dieses Wort kommt am Ende noch einmal.':'Richtig!');
   setTimeout(()=>render(task,root),500);
  }else{
   const result=S().wrong(T().number,task.id,total,idx,value),tries=result.tries||1;
   if(tries===1)feedback('bad','Noch nicht richtig. Hör noch einmal.');
   else if(tries===2)feedback('warn',item.hint||'Der Plural beginnt mit „die“.');
   else feedback('warn',`Lösung: ${esc(Array.isArray(item.answer)?item.answer[0]:item.answer)}. Gib sie jetzt selbst richtig ein.`);
   input.select();input.focus();
  }
 };
 checkBtn.onclick=check;
 input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();check()}};
 setTimeout(()=>input.focus(),0);
}
function patchedTaskPage(){
 const task=currentTask(),root=document.getElementById('app');
 if(task?.id===TASK_ID&&root){
  window.resetThemeProgress=()=>S().reset(T().number);
  return render(task,root);
 }
 return originalTaskPage();
}
window.L8UI={...base,taskPage:patchedTaskPage};
const style=document.createElement('style');
style.id='sp-l8t2-task4-plural-ui-20260903';
style.textContent='.sp-l8t2-a4{max-width:780px;margin-inline:auto}.sp-l8t2-a4-listen{display:flex!important;justify-content:center!important;margin:0 0 18px!important}.sp-l8t2-a4-listen .l8-audio{display:inline-flex!important;visibility:visible!important;opacity:1!important;align-items:center!important;justify-content:center!important;min-width:150px!important;min-height:48px!important}';
document.head.appendChild(style);
})();
