header('Prüfung');
const FILE='pruefung.html';
const need=[['karteikarten.html',WORDS.length],['hoeren.html',6],['lesen.html',5],['jede-zeit.html',10]];
const ok=need.every(x=>pctFor(x[0],x[1])>=100);
const q=[['Der Film fängt um ___ an.','18:30 Uhr'],['Ich vereinbare einen ___.','Termin'],['jeden ___','Tag'],['jede ___','Woche'],['jedes ___','Wochenende'],['Ich möchte wieder ins ___.','Kino']];
let i=0,score=0;
if(!ok){area.innerHTML='<div class="question">Prüfung noch gesperrt</div><div class="hint">Bearbeiten Sie zuerst alle Aufgaben.</div><div class="actions"><a class="btn secondary" href="index.html">Zum Menü</a></div>'}else{show()}
function show(){if(i>=q.length){done();return}area.innerHTML='<div class="small">Aufgabe '+(i+1)+' / '+q.length+'</div><div class="question">'+q[i][0]+'</div><input id="ans" placeholder="Antwort"><div class="actions"><button class="btn" onclick="check()">Weiter</button></div>'}
function check(){if(simple(ans.value)===simple(q[i][1]))score++;i++;show()}
function done(){const percent=Math.round(score/q.length*100);markTaskDone(FILE,12);if(window.syncExam)syncExam({score:score,maxScore:q.length,percent:percent,stars:percent>=100?3:percent>=70?2:percent>=50?1:0});area.innerHTML='<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Prüfung fertig</div><div class="hint">Ergebnis: '+score+' / '+q.length+' = '+percent+'%</div><div class="actions"><a class="btn" href="index.html">Zum Thema</a></div></div>'}
