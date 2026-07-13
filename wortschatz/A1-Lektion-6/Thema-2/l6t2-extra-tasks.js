const L6T2_EXTRA_TASKS=[
  ['kategorien-drag.html',words().length,'Kategorien · Drag & Drop'],
  ['praepositionen-drag.html',12,'Präpositionen · Drag & Drop'],
  ['fehler-finden.html',14,'Fehler finden']
];
const L6T2_ALL_TASKS=[
  ['karteikarten.html',words().length,'Karteikarten'],
  ['bild-wort.html',words().length,'Bild → Wort'],
  ['hoeren-schreiben.html',words().length,'Hören/Schreiben'],
  ['kategorien-drag.html',words().length,'Kategorien · Drag & Drop'],
  ['praepositionen.html',GRAMMAR.length,'Präpositionen'],
  ['praepositionen-drag.html',12,'Präpositionen · Drag & Drop'],
  ['fehler-finden.html',14,'Fehler finden'],
  ['saetze-bauen.html',SENTENCES.length,'Sätze bauen'],
  ['pruefung.html',10,'Prüfung']
];
const L6T2_TASK_ICONS={'karteikarten.html':'🃏','bild-wort.html':'🖼️','hoeren-schreiben.html':'🎧','kategorien-drag.html':'🧺','praepositionen.html':'📍','praepositionen-drag.html':'🧲','fehler-finden.html':'🛠️','saetze-bauen.html':'🧩','pruefung.html':'★'};
const PREP_DRAG_ITEMS=[
  {sentence:'___ Norden ist es kalt.',a:'Im',opts:['Im','In','Aus'],tip:'im Norden'},
  {sentence:'Der Wind kommt ___ Westen.',a:'aus dem',opts:['im','aus dem','in der'],tip:'aus dem Westen'},
  {sentence:'___ Süden ist es warm.',a:'Im',opts:['Im','Aus dem','In der'],tip:'im Süden'},
  {sentence:'___ Frühling scheint die Sonne.',a:'Im',opts:['Im','In','Aus'],tip:'im Frühling'},
  {sentence:'___ Winter schneit es.',a:'Im',opts:['Im','In der','Aus dem'],tip:'im Winter'},
  {sentence:'Ich wohne ___ Deutschland.',a:'in',opts:['in','in der','im'],tip:'in Deutschland'},
  {sentence:'Ich komme ___ Österreich.',a:'aus',opts:['aus','aus der','aus dem'],tip:'aus Österreich'},
  {sentence:'Ich wohne ___ Schweiz.',a:'in der',opts:['in','in der','aus der'],tip:'in der Schweiz'},
  {sentence:'Ich komme ___ Türkei.',a:'aus der',opts:['aus','aus der','in der'],tip:'aus der Türkei'},
  {sentence:'Ich wohne ___ Ukraine.',a:'in der',opts:['in','in der','aus der'],tip:'in der Ukraine'},
  {sentence:'___ Montag habe ich Deutschkurs.',a:'Am',opts:['Am','Um','Im'],tip:'am Montag'},
  {sentence:'___ acht Uhr beginnt der Kurs.',a:'Um',opts:['Um','Am','Im'],tip:'um acht Uhr'}
];
const PREP_ERROR_ITEMS=[
  {wrong:'Ich wohne im Deutschland.',right:'Ich wohne in Deutschland.',a:'in',tip:'Länder ohne Artikel: in Deutschland'},
  {wrong:'Ich komme aus der Deutschland.',right:'Ich komme aus Deutschland.',a:'aus',tip:'Länder ohne Artikel: aus Deutschland'},
  {wrong:'Ich wohne in Schweiz.',right:'Ich wohne in der Schweiz.',a:'in der',tip:'die Schweiz → in der Schweiz'},
  {wrong:'Ich komme aus Türkei.',right:'Ich komme aus der Türkei.',a:'aus der',tip:'die Türkei → aus der Türkei'},
  {wrong:'Ich wohne in Ukraine.',right:'Ich wohne in der Ukraine.',a:'in der',tip:'die Ukraine → in der Ukraine'},
  {wrong:'Der Wind kommt im Westen.',right:'Der Wind kommt aus dem Westen.',a:'aus dem',tip:'Wind kommt aus dem Westen'},
  {wrong:'In Norden ist es kalt.',right:'Im Norden ist es kalt.',a:'im',tip:'im Norden'},
  {wrong:'Aus dem Süden ist es warm.',right:'Im Süden ist es warm.',a:'im',tip:'im Süden'},
  {wrong:'In Sommer ist es heiß.',right:'Im Sommer ist es heiß.',a:'im',tip:'im Sommer'},
  {wrong:'Aus Winter schneit es.',right:'Im Winter schneit es.',a:'im',tip:'im Winter'},
  {wrong:'Um Montag habe ich frei.',right:'Am Montag habe ich frei.',a:'am',tip:'Tage: am Montag'},
  {wrong:'Am acht Uhr beginnt der Kurs.',right:'Um acht Uhr beginnt der Kurs.',a:'um',tip:'Uhrzeit: um acht Uhr'},
  {wrong:'In Morgen lerne ich Deutsch.',right:'Am Morgen lerne ich Deutsch.',a:'am',tip:'Tageszeiten: am Morgen'},
  {wrong:'Am Juli ist es warm.',right:'Im Juli ist es warm.',a:'im',tip:'Monate: im Juli'}
];
function l6t2AllTasks(){return L6T2_ALL_TASKS}
function renderMenu(){const tasks=l6t2AllTasks();const avg=Math.round(tasks.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/tasks.length)||0;totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';totalText.textContent=tasks.filter(t=>pctFor(t[0],t[1])>=100).length+' / '+tasks.length+' Aufgaben abgeschlossen';taskGrid.innerHTML=`<div class="grid">${tasks.map((t,i)=>{const p=pctFor(t[0],t[1]);return `<a class="module" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${L6T2_TASK_ICONS[t[0]]||'▶'}</div><p class="small">Himmelsrichtungen, Länder, Jahreszeiten und Präpositionen üben.</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')}</div>`}
(function(){const s=document.createElement('style');s.textContent='.drag-token{display:inline-flex;align-items:center;justify-content:center;border:2px solid var(--lesson-main-dark);background:#fff;border-radius:999px;padding:10px 16px;margin:6px;font-weight:900;cursor:grab;color:var(--lesson-main-dark)}.drop-zone{min-height:62px;border:3px dashed var(--lesson-line);border-radius:18px;padding:14px;margin:10px 0;background:#fffafd;font-weight:900}.drop-zone.active{background:var(--lesson-soft);border-color:var(--lesson-main-dark)}.drop-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}.drop-title{font-weight:900;color:var(--lesson-main-dark);margin-bottom:8px}.error-sentence{font-size:24px;font-weight:900;background:#fff1f2;border:2px solid #fecdd3;border-radius:18px;padding:16px;margin:16px 0;color:#9f1239}';document.head.appendChild(s)})();