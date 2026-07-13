const L6T2_CATEGORY_GROUPS=['Himmelsrichtungen','Länder','Jahreszeiten'];
const L6T2_CATEGORY_WORDS=()=>words().filter(w=>L6T2_CATEGORY_GROUPS.includes(w.group));
const L6T2_PREP_OPTIONS=['in','in der','in den','im','um','am'];

const PREP_ONLY_ITEMS=[
  {prompt:'Ich wohne ___ Deutschland.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Wir leben ___ Japan.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Ali wohnt ___ Vietnam.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Meine Freundin lebt ___ Polen.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Sara wohnt ___ Bulgarien.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Paul lebt ___ Frankreich.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Meine Familie wohnt ___ Rumänien.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Ich bin ___ Schweiz.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Wir wohnen ___ Türkei.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Oksana lebt ___ Ukraine.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Meine Tante wohnt ___ USA.',a:'in den',hint:'Die USA stehen im Plural: in den USA.'},
  {prompt:'___ Norden ist es kalt.',a:'im',hint:'Himmelsrichtungen stehen mit im.'},
  {prompt:'___ Süden ist es warm.',a:'im',hint:'Himmelsrichtungen stehen mit im.'},
  {prompt:'___ Frühling scheint oft die Sonne.',a:'im',hint:'Jahreszeiten stehen mit im.'},
  {prompt:'___ Herbst regnet es oft.',a:'im',hint:'Jahreszeiten stehen mit im.'},
  {prompt:'Der Kurs beginnt ___ 10 Uhr.',a:'um',hint:'Vor einer Uhrzeit steht um.'},
  {prompt:'___ Montag habe ich Deutschkurs.',a:'am',hint:'Vor einem Wochentag steht am.'},
  {prompt:'___ Morgen höre ich den Wetterbericht.',a:'am',hint:'Vor einer Tageszeit steht am.'}
];

const PREP_IMAGE_ITEMS=[
  {id:'deutschland',a:'in',hint:'Land ohne Artikel'},
  {id:'japan',a:'in',hint:'Land ohne Artikel'},
  {id:'vietnam',a:'in',hint:'Land ohne Artikel'},
  {id:'polen',a:'in',hint:'Land ohne Artikel'},
  {id:'frankreich',a:'in',hint:'Land ohne Artikel'},
  {id:'rumaenien',a:'in',hint:'Land ohne Artikel'},
  {id:'schweiz',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'tuerkei',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'ukraine',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'usa',a:'in den',hint:'Land im Plural'},
  {id:'norden',a:'im',hint:'Himmelsrichtung'},
  {id:'sueden',a:'im',hint:'Himmelsrichtung'},
  {id:'fruehling',a:'im',hint:'Jahreszeit'},
  {id:'herbst',a:'im',hint:'Jahreszeit'}
];

const PREP_DRAG_ITEMS=[
  {word:'Japan',a:'in'},
  {word:'Deutschland',a:'in'},
  {word:'Vietnam',a:'in'},
  {word:'Polen',a:'in'},
  {word:'Frankreich',a:'in'},
  {word:'Rumänien',a:'in'},
  {word:'Schweiz',a:'in der'},
  {word:'Türkei',a:'in der'},
  {word:'Ukraine',a:'in der'},
  {word:'USA',a:'in den'},
  {word:'Montag',a:'am'},
  {word:'Morgen',a:'am'},
  {word:'Abend',a:'am'},
  {word:'10 Uhr',a:'um'},
  {word:'8 Uhr',a:'um'},
  {word:'Herbst',a:'im'},
  {word:'Norden',a:'im'},
  {word:'Winter',a:'im'}
];

const PREP_ERROR_ITEMS=[
  {tokens:['Ich','wohne','im','Japan.'],wrongIndex:2,right:'Ich wohne in Japan.',hint:'Japan ist ein Land ohne Artikel.'},
  {tokens:['In','Herbst','regnet','es','oft.'],wrongIndex:0,right:'Im Herbst regnet es oft.',hint:'Vor einer Jahreszeit steht im.'},
  {tokens:['Ich','leben','in','Deutschland.'],wrongIndex:1,right:'Ich lebe in Deutschland.',hint:'Das Subjekt ist ich.'},
  {tokens:['Am','zehn','Uhr','beginnt','der','Kurs.'],wrongIndex:0,right:'Um zehn Uhr beginnt der Kurs.',hint:'Vor einer Uhrzeit steht um.'},
  {tokens:['Im','Süden','ist','es','heis.'],wrongIndex:4,right:'Im Süden ist es heiß.',hint:'Achten Sie auf die Schreibweise mit ß.'},
  {tokens:['Die','Temperaturen','bleibt','angenehm.'],wrongIndex:2,right:'Die Temperaturen bleiben angenehm.',hint:'Das Subjekt steht im Plural.'},
  {tokens:['Ich','komme','aus','die','Türkei.'],wrongIndex:3,right:'Ich komme aus der Türkei.',hint:'Nach aus steht hier der Dativ.'},
  {tokens:['Wir','wohnen','in','den','Schweiz.'],wrongIndex:3,right:'Wir wohnen in der Schweiz.',hint:'Die Schweiz hat den Artikel die.'},
  {tokens:['Um','Montag','habe','ich','Deutschkurs.'],wrongIndex:0,right:'Am Montag habe ich Deutschkurs.',hint:'Vor einem Wochentag steht am.'},
  {tokens:['In','der','USA','wohnt','meine','Tante.'],wrongIndex:1,right:'In den USA wohnt meine Tante.',hint:'Die USA stehen im Plural.'},
  {tokens:['Der','Wind','kommen','aus','dem','Westen.'],wrongIndex:2,right:'Der Wind kommt aus dem Westen.',hint:'Das Subjekt der Wind steht im Singular.'},
  {tokens:['Im','Winter','schneien','es.'],wrongIndex:2,right:'Im Winter schneit es.',hint:'Das Verb zu es steht im Singular.'},
  {tokens:['Ich','wohne','in','der','Deutschland.'],wrongIndex:3,right:'Ich wohne in Deutschland.',hint:'Deutschland steht ohne Artikel.'},
  {tokens:['Die','Temperatur','sind','plus','zehn','Grad.'],wrongIndex:2,right:'Die Temperatur ist plus zehn Grad.',hint:'Die Temperatur steht im Singular.'},
  {tokens:['Ich','wohne','in','Rumanien.'],wrongIndex:3,right:'Ich wohne in Rumänien.',hint:'Achten Sie auf den Umlaut.'},
  {tokens:['Im','Norden','scheinen','die','Sonne.'],wrongIndex:2,right:'Im Norden scheint die Sonne.',hint:'Die Sonne steht im Singular.'},
  {tokens:['Heute','ist','das','Wetter','angenehme.'],wrongIndex:4,right:'Heute ist das Wetter angenehm.',hint:'Nach ist bleibt das Adjektiv ohne Endung.'},
  {tokens:['Ich','komme','aus','den','Ukraine.'],wrongIndex:3,right:'Ich komme aus der Ukraine.',hint:'Die Ukraine hat den Artikel die.'},
  {tokens:['Im','Frühling','ist','die','Tage','länger.'],wrongIndex:2,right:'Im Frühling sind die Tage länger.',hint:'Die Tage stehen im Plural.'},
  {tokens:['Im','Osten','scheint','der','Sonne.'],wrongIndex:3,right:'Im Osten scheint die Sonne.',hint:'Sonne hat den Artikel die.'}
];

const L6T2_ALL_TASKS=[
  ['karteikarten.html',words().length,'Karteikarten'],
  ['bild-wort.html',words().length,'Bild → Wort'],
  ['hoeren-bild.html',words().length,'Hören → Bild'],
  ['kategorien-drag.html',L6T2_CATEGORY_WORDS().length,'Kategorien · 2 Teile'],
  ['praepositionen.html',PREP_ONLY_ITEMS.length,'Richtige Präposition'],
  ['praepositionen-bild.html',PREP_IMAGE_ITEMS.length,'Bild → Präposition'],
  ['praepositionen-drag.html',PREP_DRAG_ITEMS.length,'Präpositionen zuordnen'],
  ['fehler-finden.html',PREP_ERROR_ITEMS.length,'Fehler finden und korrigieren'],
  ['postkarte.html',2,'Postkarten ergänzen'],
  ['saetze-bauen.html',SENTENCES.length,'Sätze bauen'],
  ['pruefung.html',10,'Prüfung']
];
const L6T2_TASK_ICONS={'karteikarten.html':'🃏','bild-wort.html':'🖼️','hoeren-bild.html':'🎧','kategorien-drag.html':'🧺','praepositionen.html':'📍','praepositionen-bild.html':'🖼️','praepositionen-drag.html':'🧲','fehler-finden.html':'🛠️','postkarte.html':'✉️','saetze-bauen.html':'🧩','pruefung.html':'⭐'};
function l6t2AllTasks(){return L6T2_ALL_TASKS}
function l6t2NonExamTasks(){return L6T2_ALL_TASKS.filter(t=>t[0]!=='pruefung.html')}
function l6t2ExamUnlocked(){return l6t2NonExamTasks().every(t=>pctFor(t[0],t[1])>=100)}
window.l6t2ExamUnlocked=l6t2ExamUnlocked;
function renderMenu(){
  const tasks=l6t2AllTasks();
  const unlocked=l6t2ExamUnlocked();
  if(unlocked)localStorage.setItem('SP_EXAM_UNLOCKED_L6_T2','1');
  else localStorage.removeItem('SP_EXAM_UNLOCKED_L6_T2');
  const avg=Math.round(tasks.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/tasks.length)||0;
  totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';
  totalText.textContent=tasks.filter(t=>pctFor(t[0],t[1])>=100).length+' / '+tasks.length+' Aufgaben abgeschlossen';
  taskGrid.innerHTML=`<div class="grid">${tasks.map((t,i)=>{
    const p=pctFor(t[0],t[1]);
    if(t[0]==='pruefung.html'&&!unlocked)return `<div class="module locked exam-locked"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">⭐</div><p class="small">Die Prüfung wird erst geöffnet, wenn alle Aufgaben 100% erreicht haben.</p><div class="progress"><div class="bar" style="width:0%"></div></div><div class="small">Prüfung gesperrt</div><div class="start">Gesperrt</div></div>`;
    return `<a class="module" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${L6T2_TASK_ICONS[t[0]]||'▶'}</div><p class="small">Himmelsrichtungen, Länder, Jahreszeiten und Zeitpräpositionen üben.</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`
  }).join('')}</div>`;
}
function renderOverview(target){const groups=[...new Set(WORDS.map(w=>w.group))];target.innerHTML=groups.map(g=>`<section class="type-block"><div class="type-title">${g}</div>${WORDS.filter(w=>w.group===g).map(w=>`<div class="word-row"><div class="word-placeholder">${miniVisual(w)}</div><div><b>${full(w)}</b><br><span class="small">${w.sentence}${w.from?' / '+w.from:''}</span><div class="small">Übersetzung (${LANGS[langKey()]||'EN'}): ${tr(w)}</div><span class="tag">${w.type}</span></div></div>`).join('')}</section>`).join('')+`<section class="type-block"><div class="type-title">Grammatik: Präpositionen</div><div class="grammar-rule"><b>in</b>: in Deutschland, in Japan, in Polen</div><div class="grammar-rule"><b>in der</b>: in der Schweiz, in der Türkei, in der Ukraine</div><div class="grammar-rule"><b>in den</b>: in den USA</div><div class="grammar-rule"><b>im</b>: im Norden, im Süden, im Frühling, im Herbst</div><div class="grammar-rule"><b>am</b>: am Montag, am Morgen</div><div class="grammar-rule"><b>um</b>: um zehn Uhr</div></section>`}
