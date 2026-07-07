header('Prüfung');
const FILE='pruefung.html';
const need=[['karteikarten.html',WORDS.length],['hoeren.html',6],['lesen.html',5],['jede-zeit.html',10]];
const ok=need.every(x=>pctFor(x[0],x[1])>=100);
if(!ok){
  area.innerHTML='<div class="question">Prüfung noch gesperrt</div><div class="hint">Bearbeiten Sie zuerst alle Aufgaben.</div><div class="actions"><a class="btn secondary" href="index.html">Zum Menü</a></div>';
}else{
  area.innerHTML='<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Prüfung</div><div class="hint">Sie können die Prüfung starten.</div><div class="actions"><button class="btn" onclick="startExam()">Starten</button></div></div>';
}
function startExam(){area.innerHTML='<div class="question">Was passt?</div><input id="ans" placeholder="Antwort"><div class="actions"><button class="btn" onclick="finishExam()">Abgeben</button></div>'}
function finishExam(){markTaskDone(FILE,12);if(window.syncExam)syncExam({score:12,maxScore:12,percent:100,stars:3});area.innerHTML='<div class="finish-box"><div class="finish-icon">✓</div><div class="question">Prüfung fertig</div><div class="actions"><a class="btn" href="index.html">Zum Thema</a></div></div>'}
