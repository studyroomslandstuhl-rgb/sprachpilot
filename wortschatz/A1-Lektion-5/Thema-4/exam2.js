header('Prüfung');
const FILE='pruefung.html';
const need=[['karteikarten.html',WORDS.length],['artikel.html',12],['hoeren-schreiben.html',12],['hoeren-bild.html',12],['bild-wort.html',14],['hoeren.html',13],['schilder.html',10],['lesen.html',6],['tv-programm.html',6],['zuordnen.html',10],['saetze-bauen.html',8],['mini-dialoge.html',8],['jede-zeit.html',16]];
const ok=need.every(x=>pctFor(x[0],x[1])>=100);
const q=[
['Der Film fängt um ___ an.',['20:15 Uhr','20 Uhr 15']],
['Die Kita ist von Montag bis Freitag ___.',['geöffnet']],
['Ich vereinbare einen ___.',['Termin']],
['Die Bibliothek ist an Feiertagen ___.',['geschlossen']],
['z.B. = ___.',['zum Beispiel']],
['jeden ___',['Tag']],
['jede ___',['Woche']],
['jedes ___',['Wochenende']],
['Ich möchte ein Buch ___.',['ausleihen']],
['Emil geht in die / in den ___.',['Kita','Kindergarten']],
['Die Öffnungszeiten stehen auf dem ___.',['Schild']],
['Das Geschäft ist den ganzen ___ geöffnet.',['Tag']]
];
let i=0,score=0;
if(!ok){area.innerHTML='<div class="question">Prüfung noch gesperrt</div><div class="hint">Bearbeiten Sie zuerst alle Aufgaben.</div><div class="exam-lock">'+need.map(x=>'<a href="'+x[0]+'">'+x[0].replace('.html','')+': '+pctFor(x[0],x[1])+'%</a>').join('')+'</div><div class="actions"><a class="btn secondary" href="index.html">Zum Menü</a></div>'}else{show()}
function show(){if(i>=q.length){done();return}area.innerHTML='<div class="small">Aufgabe '+(i+1)+' / '+q.length+'</div><div class="question">'+q[i][0]+'</div><input id="ans" placeholder="Antwort"><div class="actions"><button class="btn" onclick="check()">Weiter</button></div>'}
function check(){const sols=Array.isArray(q[i][1])?q[i][1]:[q[i][1]];if(sols.some(s=>simple(ans.value)===simple(s)))score++;i++;show()}
function done(){const percent=Math.round(score/q.length*100);markTaskDone(FILE,12);if(window.syncExam)syncExam({score:score,maxScore:q.length,percent:percent,stars:percent>=100?3:percent>=70?2:percent>=50?1:0});area.innerHTML='<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Prüfung fertig</div><div class="hint">Ergebnis: '+score+' / '+q.length+' = '+percent+'%</div><div class="actions"><a class="btn" href="index.html">Zum Thema</a></div></div>'}
