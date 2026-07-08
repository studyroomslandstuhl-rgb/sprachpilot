header(CFG.title,true);
const tasks=[
  ['karteikarten.html',WORDS.length,'Karteikarten','🃏','Wörter lernen.'],
  ['hoeren.html',10,'Hören: Öffnungszeiten','🎧','Längere Ansagen hören und die richtige Information wählen.'],
  ['schilder.html',8,'Schilder lesen','🪧','Öffnungszeiten lesen und eigene Sätze schreiben.'],
  ['lesen.html',6,'Lesen: Noras Tag','🔎','Text lesen und zwei falsche Aussagen markieren.'],
  ['tv-programm.html',6,'TV-Programm','📺','Fehler im Satz finden und den Satz richtig schreiben.'],
  ['jede-zeit.html',16,'jeden / jede / jedes','🧩','Zeitangaben in ganzen Sätzen üben.']
];
function card(t,n){
  const p=pctFor(t[0],t[1]);
  return '<a class="module" href="'+t[0]+'"><div class="num">'+n+'. '+t[2]+'</div><div class="icon">'+t[3]+'</div><p>'+t[4]+'</p><div class="progress"><div class="bar" style="width:'+p+'%"></div></div><div class="small">'+p+'%</div><div class="start">'+(p>=100?'Fertig':'Starten')+'</div></a>';
}
function examTile(n,open){
  const p=pctFor('pruefung.html',12);
  return open?'<a class="module" href="pruefung.html"><div class="num">'+n+'. Prüfung</div><div class="icon exam-icon">⭐</div><p>Gemischte Prüfung.</p><div class="progress"><div class="bar" style="width:'+p+'%"></div></div><div class="small">'+(p?p+'%':'offen')+'</div><div class="start">Starten</div></a>':'<div class="module locked exam-locked"><div class="num">'+n+'. Prüfung</div><div class="icon exam-icon">⭐</div><p>Prüfung wird erst freigeschaltet, wenn alle Aufgaben 100% erreicht haben.</p><div class="small">gesperrt</div><div class="start">Prüfung gesperrt</div></div>';
}
let n=1;
taskGrid.innerHTML=tasks.map(t=>card(t,n++)).join('');
const open=tasks.every(t=>pctFor(t[0],t[1])>=100);
taskGrid.innerHTML+=examTile(n,open);
const all=[...tasks,['pruefung.html',12]];
const avg=Math.round(all.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/all.length)||0;
const done=all.filter(t=>pctFor(t[0],t[1])>=100).length;
totalCircle.textContent=avg+'%';
totalBar.style.width=avg+'%';
totalText.textContent=done+' / '+all.length+' Aufgaben abgeschlossen';
setTimeout(()=>{const s=document.createElement('script');s.src='../Thema-1/points-hook.js?v=5';document.body.appendChild(s)},1400);
