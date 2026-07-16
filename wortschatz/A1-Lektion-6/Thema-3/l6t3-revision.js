(function(){
'use strict';
const DATA=window.L6T3RevisionData;
if(!DATA||!window.L6T3)return;
const counts={
 'komposita-artikel.html':DATA.compoundArticle.length,
 'komposita-bauen.html':DATA.compoundBuild.length,
 'svo.html':DATA.svoItems.length,
 'nom-akk.html':DATA.nomAkkItems.length,
 'akkusativ-bestimmt.html':DATA.definiteItems.length,
 'akkusativ-unbestimmt.html':DATA.indefiniteItems.length,
 'meinen-deinen.html':DATA.possessiveItems.length,
 'bilddialoge.html':DATA.imageDialogs.length,
 'dialoge-planen.html':DATA.chatDialogs.reduce((n,x)=>n+x.qs.length,0),
 'nachrichten-rf.html':DATA.messageThreads.reduce((n,x)=>n+x.qs.length,0),
 'satz-bauen.html':DATA.sentencePrompts.length
};
if(!L6T3.__baseActiveTasks)L6T3.__baseActiveTasks=L6T3.activeTasks.bind(L6T3);
function activeTasks(){return L6T3.__baseActiveTasks().map(t=>[t[0],counts[t[0]]||t[1],t[2]])}
L6T3.activeTasks=activeTasks;
L6T3.nextFile=function(file){const files=activeTasks().map(t=>t[0]),i=files.indexOf(file);return files[i+1]||'index.html'};
L6T3.analysisItems=()=>DATA.nomAkkItems.slice();
L6T3.definiteItems=()=>DATA.definiteItems.slice();
L6T3.indefiniteItems=()=>DATA.indefiniteItems.slice();
L6T3.possessiveItems=()=>DATA.possessiveItems.slice();
L6T3.dialogItems=()=>DATA.imageDialogs.slice();
L6T3.reasonOptions=()=>{const out=[DATA.reasons.sub,DATA.reasons.obj,DATA.reasons.sein];if(L6T3.apEnabled())out.push('Akkusativpräposition');return out};
function isProgressKey(key){
 key=String(key||'');
 if(key.startsWith(CFG.key))return true;
 return (key.startsWith('SP_TASK_STATE_')||key.startsWith('SP_TASK_PROGRESS_'))&&/L6[_-]?T3|L6.*THEMA.?3/i.test(key);
}
function clearStorage(storage){const keys=[];for(let i=0;i<storage.length;i++){const key=storage.key(i);if(isProgressKey(key))keys.push(key)}keys.forEach(key=>storage.removeItem(key));return keys.length}
function clearProgress(){const removed=clearStorage(localStorage)+clearStorage(sessionStorage);try{localStorage.setItem('SP_L6_T3_RESET_AT',String(Date.now()))}catch(e){}return removed}
window.resetThemeProgress=function(){
 if(!confirm('Fortschritte in Lektion 6 · Thema 3 löschen? Bereits verdiente Punkte bleiben erhalten.'))return false;
 clearProgress();
 location.href='index.html?reset='+Date.now()+'&v=l6t3-revision2';
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
  'dialoge-planen.html':'SMS-Dialoge mit Namen lesen.',
  'nachrichten-rf.html':'Längere Nachrichten verstehen.',
  'satz-bauen.html':'Mit Bildern selbst sprechen oder schreiben.'
 };
 grid.innerHTML='<div class="grid">'+tasks.map((t,i)=>{const p=pctFor(t[0],t[1]);return `<a class="module" href="${t[0]}?v=l6t3-revision2"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${ICONS[t[0]]||'▶'}</div><p class="small">${descriptions[t[0]]||'Akkusativ, Artikel, Restaurant und Planen üben.'}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')+'</div>';
};
window.L6T3Revision={data:DATA,counts,clearProgress,activeTasks};
})();