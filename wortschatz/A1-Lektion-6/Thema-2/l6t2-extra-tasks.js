const L6T2_CATEGORY_GROUPS=['Himmelsrichtungen','Länder','Jahreszeiten'];
const L6T2_CATEGORY_WORDS=()=>words().filter(w=>L6T2_CATEGORY_GROUPS.includes(w.group));
const L6T2_PREP_OPTIONS=['in','in der','in den','im','um','am'];

const PREP_ONLY_ITEMS=[
  {prompt:'Ich lebe ___ Deutschland.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Wir leben ___ Japan.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Ali lebt ___ Vietnam.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Meine Freundin lebt ___ Polen.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Sara lebt ___ Bulgarien.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Paul lebt ___ Frankreich.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Meine Familie lebt ___ Rumänien.',a:'in',hint:'Länder ohne Artikel stehen mit in.'},
  {prompt:'Ich lebe ___ Schweiz.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Wir leben ___ Türkei.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Oksana lebt ___ Ukraine.',a:'in der',hint:'Länder mit dem Artikel die stehen mit in der.'},
  {prompt:'Meine Tante lebt ___ USA.',a:'in den',hint:'Die USA stehen im Plural: in den USA.'},
  {prompt:'___ Norden ist es kalt.',a:'im',hint:'Himmelsrichtungen stehen mit im.'},
  {prompt:'___ Süden ist es warm.',a:'im',hint:'Himmelsrichtungen stehen mit im.'},
  {prompt:'___ Frühling scheint oft die Sonne.',a:'im',hint:'Jahreszeiten stehen mit im.'},
  {prompt:'___ Herbst regnet es oft.',a:'im',hint:'Jahreszeiten stehen mit im.'},
  {prompt:'Der Kurs beginnt ___ 10 Uhr.',a:'um',hint:'Vor einer Uhrzeit steht um.'},
  {prompt:'___ Montag habe ich Deutschkurs.',a:'am',hint:'Vor einem Wochentag steht am.'},
  {prompt:'___ Morgen höre ich den Wetterbericht.',a:'am',hint:'Vor einer Tageszeit steht am.'}
];

const PREP_IMAGE_ITEMS=[
  {id:'norden',a:'im',hint:'Himmelsrichtung'},
  {id:'japan',a:'in',hint:'Land ohne Artikel'},
  {id:'sommer',a:'im',hint:'Jahreszeit'},
  {id:'schweiz',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'osten',a:'im',hint:'Himmelsrichtung'},
  {id:'deutschland',a:'in',hint:'Land ohne Artikel'},
  {id:'winter',a:'im',hint:'Jahreszeit'},
  {id:'usa',a:'in den',hint:'Land im Plural'},
  {id:'sueden',a:'im',hint:'Himmelsrichtung'},
  {id:'vietnam',a:'in',hint:'Land ohne Artikel'},
  {id:'fruehling',a:'im',hint:'Jahreszeit'},
  {id:'tuerkei',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'westen',a:'im',hint:'Himmelsrichtung'},
  {id:'polen',a:'in',hint:'Land ohne Artikel'},
  {id:'herbst',a:'im',hint:'Jahreszeit'},
  {id:'ukraine',a:'in der',hint:'Land mit dem Artikel die'},
  {id:'oesterreich',a:'in',hint:'Land ohne Artikel'},
  {id:'bulgarien',a:'in',hint:'Land ohne Artikel'},
  {id:'spanien',a:'in',hint:'Land ohne Artikel'},
  {id:'frankreich',a:'in',hint:'Land ohne Artikel'},
  {id:'rumaenien',a:'in',hint:'Land ohne Artikel'}
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
  {tokens:['Ich','lebe','im','Japan.'],wrongIndex:2,answer:'in',errorType:'Präposition'},
  {tokens:['In','Herbst','regnet','es','oft.'],wrongIndex:0,answer:'Im',errorType:'Präposition'},
  {tokens:['Ich','leben','in','Deutschland.'],wrongIndex:1,answer:'lebe',errorType:'Konjugation'},
  {tokens:['Am','zehn','Uhr','beginnt','der','Kurs.'],wrongIndex:0,answer:'Um',errorType:'Präposition'},
  {tokens:['Im','Süden','ist','es','heis.'],wrongIndex:4,answer:'heiß',errorType:'Rechtschreibung'},
  {tokens:['Die','Temperaturen','bleibt','angenehm.'],wrongIndex:2,answer:'bleiben',errorType:'Konjugation'},
  {tokens:['Ich','komme','aus','die','Türkei.'],wrongIndex:3,answer:'der',errorType:'Artikel'},
  {tokens:['Wir','leben','in','den','Schweiz.'],wrongIndex:3,answer:'der',errorType:'Artikel'},
  {tokens:['Um','Montag','habe','ich','Deutschkurs.'],wrongIndex:0,answer:'Am',errorType:'Präposition'},
  {tokens:['In','der','USA','lebt','meine','Tante.'],wrongIndex:1,answer:'den',errorType:'Artikel'},
  {tokens:['Der','Wind','kommen','aus','dem','Westen.'],wrongIndex:2,answer:'kommt',errorType:'Konjugation'},
  {tokens:['Im','Winter','schneien','es.'],wrongIndex:2,answer:'schneit',errorType:'Konjugation'},
  {tokens:['Ich','lebe','im','Deutschland.'],wrongIndex:2,answer:'in',errorType:'Präposition'},
  {tokens:['Die','Temperatur','sind','plus','zehn','Grad.'],wrongIndex:2,answer:'ist',errorType:'Konjugation'},
  {tokens:['Ich','lebe','in','Rumanien.'],wrongIndex:3,answer:'Rumänien',errorType:'Rechtschreibung'},
  {tokens:['Im','Norden','scheinen','die','Sonne.'],wrongIndex:2,answer:'scheint',errorType:'Konjugation'},
  {tokens:['Heute','ist','das','Wetter','angenehme.'],wrongIndex:4,answer:'angenehm',errorType:'Adjektivendung'},
  {tokens:['Ich','komme','aus','den','Ukraine.'],wrongIndex:3,answer:'der',errorType:'Artikel'},
  {tokens:['Im','Frühling','ist','die','Tage','länger.'],wrongIndex:2,answer:'sind',errorType:'Konjugation'},
  {tokens:['Im','Osten','scheint','der','Sonne.'],wrongIndex:3,answer:'die',errorType:'Artikel'}
];

const L6T2_ALL_TASKS=[
  ['karteikarten.html',words().length,'Karteikarten'],
  ['bild-wort.html',words().length,'Bild → Wort'],
  ['hoeren-bild.html',words().length,'Hören → Bild'],
  ['kategorien-drag.html',L6T2_CATEGORY_WORDS().length,'Kategorien · 2 Teile'],
  ['praepositionen.html',PREP_ONLY_ITEMS.length,'Richtige Präposition'],
  ['praepositionen-bild.html',PREP_IMAGE_ITEMS.length,'Bild → Präposition'],
  ['praepositionen-drag.html',PREP_DRAG_ITEMS.length,'Präpositionen zuordnen · 2 Teile'],
  ['fehler-finden.html',PREP_ERROR_ITEMS.length,'Fehler finden und korrigieren'],
  ['postkarte.html',2,'Postkarten ergänzen'],
  ['saetze-bauen.html',SENTENCES.length,'Sätze bauen'],
  ['pruefung.html',20,'Prüfung']
];
const L6T2_TASK_ICONS={'karteikarten.html':'🃏','bild-wort.html':'🖼️','hoeren-bild.html':'🎧','kategorien-drag.html':'🧺','praepositionen.html':'📍','praepositionen-bild.html':'🖼️','praepositionen-drag.html':'🧲','fehler-finden.html':'🛠️','postkarte.html':'✉️','saetze-bauen.html':'🧩','pruefung.html':'⭐'};
function l6t2AllTasks(){return L6T2_ALL_TASKS}
function l6t2NonExamTasks(){return L6T2_ALL_TASKS.filter(t=>t[0]!=='pruefung.html')}
function l6t2ExamUnlocked(){return l6t2NonExamTasks().every(t=>pctFor(t[0],t[1])>=100)}
function l6t2TopicComplete(){return L6T2_ALL_TASKS.every(t=>pctFor(t[0],t[1])>=100)}
window.l6t2ExamUnlocked=l6t2ExamUnlocked;
function l6t2RepeatScope(){return 'wortschatz-a1-lektion-6-thema-2'}
function l6t2CurrentRun(){return Math.max(1,Math.round(Number(localStorage.getItem('SP_SCORE_RUN_'+l6t2RepeatScope())||1)||1)}
function l6t2TaskPoints(){const run=l6t2CurrentRun();if(run===1)return 5;if(run===2)return 10;if(run===3)return 15;return 0}
function l6t2RepeatBannerHtml(){
  if(!l6t2TopicComplete())return '';
  const run=l6t2CurrentRun();
  if(run>=3)return `<section class="card repeat-card done"><h2>Du bist fertig!</h2><p class="small">Du hast dieses Thema dreimal vollständig geschafft. Fortschritte löschen bleibt weiterhin möglich.</p></section>`;
  const nextPoints=run===1?10:15;
  return `<section class="card repeat-card"><h2>Wiederhole alle Aufgaben und bekomme mehr Punkte!</h2><p class="small">Nächste Runde: ${nextPoints} Punkte pro Aufgabe.</p><div class="actions"><button class="btn" onclick="startRepeatRound()">Wiederholen</button></div></section>`;
}
function startRepeatRound(){
  if(!l6t2TopicComplete())return;
  const run=l6t2CurrentRun();
  if(run>=3)return;
  if(!confirm('Alle Aufgaben in diesem Thema auf 0 setzen und die nächste Wiederholungsrunde starten?'))return;
  try{
    const payload={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:2,topicId:l6t2RepeatScope(),title:'A1 Lektion 6 · Thema 2'};
    if(window.SPProgress&&SPProgress.recordThemeReset)SPProgress.recordThemeReset(payload);
    else import('/js/progress.js?v=l6t2-repeat2').then(m=>m.recordThemeReset&&m.recordThemeReset(payload)).catch(()=>{});
  }catch(e){localStorage.setItem('SP_SCORE_RUN_'+l6t2RepeatScope(),String(run+1))}
  L6T2_ALL_TASKS.forEach(t=>localStorage.removeItem(taskKey(t[0])));
  localStorage.removeItem('SP_L6_T2_EXAM_CURRENT_SCORE');
  localStorage.removeItem('SP_L6_T2_EXAM_CURRENT_PERCENT');
  setTimeout(()=>location.reload(),100);
}
window.startRepeatRound=startRepeatRound;
function renderMenu(){
  const tasks=l6t2AllTasks();
  const unlocked=l6t2ExamUnlocked();
  if(unlocked)localStorage.setItem('SP_EXAM_UNLOCKED_L6_T2','1');
  else localStorage.removeItem('SP_EXAM_UNLOCKED_L6_T2');
  const avg=Math.round(tasks.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/tasks.length)||0;
  totalCircle.textContent=avg+'%';totalBar.style.width=avg+'%';
  totalText.textContent=tasks.filter(t=>pctFor(t[0],t[1])>=100).length+' / '+tasks.length+' Aufgaben abgeschlossen';
  taskGrid.innerHTML=l6t2RepeatBannerHtml()+`<div class="grid">${tasks.map((t,i)=>{
    const p=pctFor(t[0],t[1]);
    if(t[0]==='pruefung.html'&&!unlocked)return `<div class="module locked exam-locked"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">⭐</div><p class="small">Die Prüfung wird erst geöffnet, wenn alle Aufgaben 100% erreicht haben.</p><div class="progress"><div class="bar" style="width:0%"></div></div><div class="small">Prüfung gesperrt</div><div class="start">Gesperrt</div></div>`;
    return `<a class="module" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="big-icon">${L6T2_TASK_ICONS[t[0]]||'▶'}</div><p class="small">Himmelsrichtungen, Länder, Jahreszeiten und Zeitpräpositionen üben.</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}% · Runde ${l6t2CurrentRun()} · ${l6t2TaskPoints()} Punkte</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`
  }).join('')}</div>`;
}
function renderOverview(target){const groups=[...new Set(WORDS.map(w=>w.group))];target.innerHTML=groups.map(g=>`<section class="type-block"><div class="type-title">${g}</div>${WORDS.filter(w=>w.group===g).map(w=>`<div class="word-row"><div class="word-placeholder">${miniVisual(w)}</div><div><b>${full(w)}</b><br><span class="small">${w.sentence}${w.from?' / '+w.from:''}</span><div class="small">Übersetzung (${LANGS[langKey()]||'EN'}): ${tr(w)}</div><span class="tag">${w.type}</span></div></div>`).join('')}</section>`).join('')+`<section class="type-block"><div class="type-title">Grammatik: Präpositionen</div><div class="grammar-rule"><b>in</b>: in Deutschland, in Japan, in Polen</div><div class="grammar-rule"><b>in der</b>: in der Schweiz, in der Türkei, in der Ukraine</div><div class="grammar-rule"><b>in den</b>: in den USA</div><div class="grammar-rule"><b>im</b>: im Norden, im Süden, im Frühling, im Herbst</div><div class="grammar-rule"><b>am</b>: am Montag, am Morgen</div><div class="grammar-rule"><b>um</b>: um zehn Uhr</div></section>`}