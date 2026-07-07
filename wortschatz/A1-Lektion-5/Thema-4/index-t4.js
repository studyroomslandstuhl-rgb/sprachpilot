header(CFG.title,true);
const tasks=[
  ['karteikarten.html',WORDS.length,'Karteikarten','🃏','Wörter lernen.'],
  ['hoeren.html',6,'Hören','🎧','Zeitangaben hören.'],
  ['lesen.html',5,'Lesen','🔎','Texte und Aussagen lesen.'],
  ['jede-zeit.html',10,'jeden / jede / jedes','🧩','Zeitwörter üben.'],
  ['pruefung.html',12,'Prüfung','⭐','Alles prüfen.']
];
function card(t,n){
  const p=pctFor(t[0],t[1]);
  return '<a class="module" href="'+t[0]+'"><div class="num">'+n+'. '+t[2]+'</div><div class="icon">'+t[3]+'</div><p>'+t[4]+'</p><div class="progress"><div class="bar" style="width:'+p+'%"></div></div><div class="small">'+p+'%</div><div class="start">'+(p>=100?'Fertig':'Starten')+'</div></a>';
}
taskGrid.innerHTML=tasks.map((t,i)=>card(t,i+1)).join('');
const avg=Math.round(tasks.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/tasks.length)||0;
const done=tasks.filter(t=>pctFor(t[0],t[1])>=100).length;
totalCircle.textContent=avg+'%';
totalBar.style.width=avg+'%';
totalText.textContent=done+' / '+tasks.length+' Aufgaben abgeschlossen';
setTimeout(()=>{const s=document.createElement('script');s.src='../Thema-1/points-hook.js?v=5';document.body.appendChild(s)},1400);
