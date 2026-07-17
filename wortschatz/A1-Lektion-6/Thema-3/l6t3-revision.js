(function(){
'use strict';
const DATA=window.L6T3RevisionData;
if(!DATA||!window.L6T3)return;
const IMBISS_FILE='imbiss.html';
const TOPIC_ID='wortschatz-a1-lektion-6-thema-3';
const TOPIC_PATH='A1-Lektion-6/Thema-3';
const counts={
 'komposita-artikel.html':DATA.compoundArticle.length,
 'komposita-bauen.html':DATA.compoundBuild.length,
 'svo.html':DATA.svoItems.length,
 'nom-akk.html':DATA.nomAkkItems.length,
 'akkusativ-bestimmt.html':DATA.definiteItems.length,
 'akkusativ-unbestimmt.html':DATA.indefiniteItems.length,
 'meinen-deinen.html':DATA.possessiveItems.length,
 'bilddialoge.html':DATA.imageDialogs.length,
 [IMBISS_FILE]:12,
 'dialoge-planen.html':DATA.chatDialogs.reduce((n,x)=>n+x.qs.length,0),
 'nachrichten-rf.html':DATA.messageThreads.reduce((n,x)=>n+x.qs.length,0),
 'satz-bauen.html':DATA.sentencePrompts.length
};
if(Array.isArray(TASKS)&&!TASKS.some(t=>t[0]===IMBISS_FILE)){
 const taskIndex=TASKS.findIndex(t=>t[0]==='bilddialoge.html');
 TASKS.splice(taskIndex>=0?taskIndex+1:TASKS.length,0,[IMBISS_FILE,counts[IMBISS_FILE],'Im Imbiss']);
}
Object.assign(ICONS,{[IMBISS_FILE]:'🍔'});
if(!L6T3.__baseActiveTasks)L6T3.__baseActiveTasks=L6T3.activeTasks.bind(L6T3);
function activeTasks(){
 const tasks=L6T3.__baseActiveTasks().map(t=>[t[0],counts[t[0]]||t[1],t[2]]);
 if(!tasks.some(t=>t[0]===IMBISS_FILE)){
  const index=tasks.findIndex(t=>t[0]==='bilddialoge.html');
  tasks.splice(index>=0?index+1:tasks.length,0,[IMBISS_FILE,counts[IMBISS_FILE],'Im Imbiss']);
 }
 return tasks;
}
L6T3.activeTasks=activeTasks;
L6T3.nextFile=function(file){const files=activeTasks().map(t=>t[0]),i=files.indexOf(file);return files[i+1]||'index.html'};
L6T3.analysisItems=()=>DATA.nomAkkItems.slice();
L6T3.definiteItems=()=>DATA.definiteItems.slice();
L6T3.indefiniteItems=()=>DATA.indefiniteItems.slice();
L6T3.possessiveItems=()=>DATA.possessiveItems.slice();
L6T3.dialogItems=()=>DATA.imageDialogs.slice();
L6T3.reasonOptions=()=>{const out=[DATA.reasons.sub,DATA.reasons.obj,DATA.reasons.sein];if(L6T3.apEnabled())out.push('Akkusativpräposition');return out};
function cleanId(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function progressFiles(){
 const files=new Set(activeTasks().map(task=>task[0]));
 if(Array.isArray(TASKS))TASKS.forEach(task=>task&&task[0]&&files.add(task[0]));
 files.add('akkusativ-praepositionen.html');
 files.add(IMBISS_FILE);
 return files;
}
function genericProgressKeys(){
 const keys=new Set();
 progressFiles().forEach(file=>{
  const clean=cleanId(file);
  ['SP_TASK_STATE_','SP_TASK_PROGRESS_'].forEach(prefix=>{
   keys.add(prefix+file);
   keys.add(prefix+clean);
  });
 });
 return keys;
}
function isProgressKey(key,genericKeys){
 key=String(key||'');
 if(!key)return false;
 if(key.startsWith(CFG.key)||key.includes(CFG.key))return true;
 if(key.startsWith('SP_L6_T3')||key.includes(TOPIC_ID)||key.includes(TOPIC_PATH))return true;
 if(/SP_(?:TASK_)?(?:STATE|PROGRESS).*L6[_-]?T3/i.test(key))return true;
 if(/SP_(?:TASK_)?(?:STATE|PROGRESS).*A1[_-]?Lektion[_-]?6.*Thema[_-]?3/i.test(key))return true;
 return genericKeys.has(key);
}
function clearStorage(storage,genericKeys){
 const keys=[];
 for(let i=0;i<storage.length;i++){
  const key=storage.key(i);
  if(isProgressKey(key,genericKeys))keys.push(key);
 }
 keys.forEach(key=>storage.removeItem(key));
 return keys;
}
function clearProgress(){
 const genericKeys=genericProgressKeys();
 const localRemoved=clearStorage(localStorage,genericKeys);
 const sessionRemoved=clearStorage(sessionStorage,genericKeys);
 try{
  localStorage.setItem('SP_L6_T3_RESET_AT',String(Date.now()));
  sessionStorage.removeItem('SP_L6_T3_RESET_PENDING');
 }catch(e){}
 return {localRemoved,sessionRemoved,total:localRemoved.length+sessionRemoved.length};
}
window.resetThemeProgress=function(){
 if(!confirm('Fortschritte in Lektion 6 · Thema 3 löschen? Bereits verdiente Punkte bleiben erhalten.'))return false;
 const result=clearProgress();
 try{sessionStorage.setItem('SP_L6_T3_RESET_RESULT',JSON.stringify(result))}catch(e){}
 location.replace('index.html?resetDone='+Date.now()+'&v=l6t3-reset1');
 return true;
};
if(new URLSearchParams(location.search).has('reset'))clearProgress();
window.renderMenu=function(){
 const tasks=activeTasks(),circle=document.getElementById('totalCircle'),bar=document.getElementById('totalBar'),text=document.getElementById('totalText'),grid=document.getElementById('taskGrid');
 const avg=Math.round(tasks.reduce((sum,t)=>sum+pctFor(t[0],t[1]),0)/Math.max(1,tasks.length))||0;
 if(circle)circle.textContent=avg+'%';if(bar)bar.style.width=avg+'%';if(text)text.textContent=tasks.filter(t=>pctFor(t[0],t[1])>=100).length+' / '+tasks.length+' Aufgaben abgeschlossen';
 if(!grid)return;
 const descriptions={
  'komposita-artikel.html':'Große, realistische Komposita aus Lektion 3–5.',
  'komposita-bauen.html':'Andere Komposita selbst zusammensetzen.',
  'svo.html':'Subjekt, Verb und Objekt direkt im Satz markieren.',
  'nom-akk.html':'Kasus und Begründung gleichzeitig beantworten.',
  'akkusativ-bestimmt.html':'Artikel, Kasus und Begründung auf einem Bildschirm.',
  'akkusativ-unbestimmt.html':'Artikel, Kasus und Begründung auf einem Bildschirm.',
  'meinen-deinen.html':'Possessivartikel, Kasus und Begründung gemeinsam.',
  'bilddialoge.html':'Kleine Bildkarte direkt neben der Lücke.',
  [IMBISS_FILE]:'Einen Imbiss-Dialog mit Bildern sprechen und schreiben.',
  'dialoge-planen.html':'SMS-Dialoge mit Namen lesen.',
  'nachrichten-rf.html':'Längere Nachrichten verstehen.',
  'satz-bauen.html':'Mit Bildern selbst sprechen oder schreiben.'
 };
 grid.innerHTML='<div class="grid">'+tasks.map((t,i)=>{const p=pctFor(t[0],t[1]);return `<a class="module" href="${t[0]}?v=l6t3-reset1"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${ICONS[t[0]]||'▶'}</div><p class="small">${descriptions[t[0]]||'Akkusativ, Artikel, Restaurant und Planen üben.'}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')+'</div>';
};
window.L6T3Revision={data:DATA,counts,clearProgress,activeTasks,imbissFile:IMBISS_FILE,progressFiles,genericProgressKeys};
})();
