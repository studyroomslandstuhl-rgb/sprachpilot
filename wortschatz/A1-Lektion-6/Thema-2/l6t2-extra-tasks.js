const L6T2_EXTRA_TASKS=[
  ['kategorien-drag.html',words().length,'Kategorien · Drag & Drop'],
  ['praepositionen-drag.html',14,'Präpositionen · Drag & Drop'],
  ['fehler-finden.html',14,'Fehler finden']
];
const L6T2_ALL_TASKS=[
  ['karteikarten.html',words().length,'Karteikarten'],
  ['bild-wort.html',words().length,'Bild → Wort'],
  ['hoeren-schreiben.html',words().length,'Hören/Schreiben'],
  ['kategorien-drag.html',words().length,'Kategorien · Drag & Drop'],
  ['praepositionen.html',14,'Präpositionen'],
  ['praepositionen-drag.html',14,'Präpositionen · Drag & Drop'],
  ['fehler-finden.html',14,'Fehler finden'],
  ['saetze-bauen.html',SENTENCES.length,'Sätze bauen'],
  ['pruefung.html',10,'Prüfung']
];
const L6T2_TASK_ICONS={'karteikarten.html':'🃏','bild-wort.html':'🖼️','hoeren-schreiben.html':'🎧','kategorien-drag.html':'🧺','praepositionen.html':'📍','praepositionen-drag.html':'🧲','fehler-finden.html':'🛠️','saetze-bauen.html':'🧩','pruefung.html':'★'};
const PREP_ONLY_ITEMS=[
  {rule:'Himmelsrichtungen: im + Richtung',prompt:'___ Norden ist es kalt.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Norden'},
  {rule:'Himmelsrichtungen: im + Richtung',prompt:'___ Süden ist es warm.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Süden'},
  {rule:'Himmelsrichtungen: im + Richtung',prompt:'___ Osten scheint die Sonne.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Osten'},
  {rule:'Jahreszeiten: im + Jahreszeit',prompt:'___ Frühling ist es warm.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Frühling'},
  {rule:'Jahreszeiten: im + Jahreszeit',prompt:'___ Sommer ist es heiß.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Sommer'},
  {rule:'Jahreszeiten: im + Jahreszeit',prompt:'___ Winter schneit es.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Winter'},
  {rule:'Monate: im + Monat',prompt:'___ Juli ist es warm.',a:'Im',opts:['Im','In','Um','Am'],tip:'im Juli'},
  {rule:'Länder: in + Land',prompt:'Ich wohne ___ Deutschland.',a:'in',opts:['in','im','um','am'],tip:'in Deutschland'},
  {rule:'Länder: in + Land',prompt:'Ich wohne ___ Österreich.',a:'in',opts:['in','im','um','am'],tip:'in Österreich'},
  {rule:'Länder: in + Land',prompt:'Ich wohne ___ Spanien.',a:'in',opts:['in','im','um','am'],tip:'in Spanien'},
  {rule:'Tage: am + Tag',prompt:'___ Montag habe ich Deutschkurs.',a:'Am',opts:['Am','Um','Im','In'],tip:'am Montag'},
  {rule:'Tageszeiten: am + Tageszeit',prompt:'___ Morgen lerne ich Deutsch.',a:'Am',opts:['Am','Um','Im','In'],tip:'am Morgen'},
  {rule:'Uhrzeit: um + Uhrzeit',prompt:'___ acht Uhr beginnt der Kurs.',a:'Um',opts:['Um','Am','Im','In'],tip:'um acht Uhr'},
  {rule:'Zeitraum: von … bis …',prompt:'Der Kurs geht ___ neun ___ zwölf Uhr.',a:'von … bis …',opts:['von … bis …','im … in …','am … um …','in … im …'],tip:'von neun bis zwölf Uhr'}
];
const PREP_DRAG_ITEMS=PREP_ONLY_ITEMS.map(x=>({sentence:x.prompt,a:x.a,opts:x.opts,tip:x.tip}));
const PREP_ERROR_ITEMS=[
  {wrong:'In Norden ist es kalt.',right:'Im Norden ist es kalt.',a:'im',tip:'Himmelsrichtungen: im Norden'},
  {wrong:'Am Süden ist es warm.',right:'Im Süden ist es warm.',a:'im',tip:'Himmelsrichtungen: im Süden'},
  {wrong:'Um Osten scheint die Sonne.',right:'Im Osten scheint die Sonne.',a:'im',tip:'Himmelsrichtungen: im Osten'},
  {wrong:'In Frühling ist es warm.',right:'Im Frühling ist es warm.',a:'im',tip:'Jahreszeiten: im Frühling'},
  {wrong:'Am Sommer ist es heiß.',right:'Im Sommer ist es heiß.',a:'im',tip:'Jahreszeiten: im Sommer'},
  {wrong:'Um Winter schneit es.',right:'Im Winter schneit es.',a:'im',tip:'Jahreszeiten: im Winter'},
  {wrong:'Am Juli ist es warm.',right:'Im Juli ist es warm.',a:'im',tip:'Monate: im Juli'},
  {wrong:'Ich wohne im Deutschland.',right:'Ich wohne in Deutschland.',a:'in',tip:'Länder: in Deutschland'},
  {wrong:'Ich wohne am Österreich.',right:'Ich wohne in Österreich.',a:'in',tip:'Länder: in Österreich'},
  {wrong:'Ich wohne um Spanien.',right:'Ich wohne in Spanien.',a:'in',tip:'Länder: in Spanien'},
  {wrong:'Um Montag habe ich Deutschkurs.',right:'Am Montag habe ich Deutschkurs.',a:'am',tip:'Tage: am Montag'},
  {wrong:'In Morgen lerne ich Deutsch.',right:'Am Morgen lerne ich Deutsch.',a:'am',tip:'Tageszeiten: am Morgen'},
  {wrong:'Am acht Uhr beginnt der Kurs.',right:'Um acht Uhr beginnt der Kurs.',a:'um',tip:'Uhrzeit: um acht Uhr'},
  {wrong:'Der Kurs geht um neun bis zwölf Uhr.',right:'Der Kurs geht von neun bis zwölf Uhr.',a:'von … bis …',tip:'Zeitraum: von neun bis zwölf Uhr'}
];
function l6t2AllTasks(){return L6T2_ALL_TASKS}
function renderMenu(){const tasks=l6t2AllTasks();const avg=Math.round(tasks.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/tasks.length)||0;totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';totalText.textContent=tasks.filter(t=>pctFor(t[0],t[1])>=100).length+' / '+tasks.length+' Aufgaben abgeschlossen';taskGrid.innerHTML=`<div class="grid">${tasks.map((t,i)=>{const p=pctFor(t[0],t[1]);return `<a class="module" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${L6T2_TASK_ICONS[t[0]]||'▶'}</div><p class="small">Kategorien und Präpositionen üben: im · in · um · am · von … bis …</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')}</div>`}
(function(){const s=document.createElement('style');s.textContent='.drag-token{display:inline-flex;align-items:center;justify-content:center;border:2px solid var(--lesson-main-dark);background:#fff;border-radius:999px;padding:10px 16px;margin:6px;font-weight:900;cursor:grab;color:var(--lesson-main-dark)}.drop-zone{min-height:62px;border:3px dashed var(--lesson-line);border-radius:18px;padding:14px;margin:10px 0;background:#fffafd;font-weight:900}.drop-zone.active{background:var(--lesson-soft);border-color:var(--lesson-main-dark)}.drop-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}.drop-title{font-weight:900;color:var(--lesson-main-dark);margin-bottom:8px}.error-sentence{font-size:24px;font-weight:900;background:#fff1f2;border:2px solid #fecdd3;border-radius:18px;padding:16px;margin:16px 0;color:#9f1239}';document.head.appendChild(s)})();