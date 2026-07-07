header('Lesen');
const FILE='lesen.html';
const ITEMS=[
['Bibliothek','Die Bibliothek ist von Montag bis Freitag geöffnet. Sie öffnet um 9 Uhr und schließt um 17 Uhr. Am Sonntag ist die Bibliothek geschlossen.','Die Bibliothek ist am Sonntag geöffnet.','Die Bibliothek ist am Sonntag geschlossen.','Die Bibliothek ist von Montag bis Freitag geöffnet.','Die Bibliothek schließt um 17 Uhr.'],
['Kino','Im Kino Luna läuft heute der Film Schönes Leben. Der Film fängt um 18:30 Uhr an. Eine Karte kostet 8 Euro.','Der Film fängt um 20:30 Uhr an.','Der Film fängt um 18:30 Uhr an.','Der Film heißt Schönes Leben.','Eine Karte kostet 8 Euro.'],
['Geschäft','Das Geschäft ist am Samstag von 10 Uhr bis 14 Uhr geöffnet. Am Montag ist es wieder geöffnet. An Feiertagen ist das Geschäft geschlossen.','Das Geschäft ist an Feiertagen geöffnet.','Das Geschäft ist an Feiertagen geschlossen.','Das Geschäft ist am Samstag bis 14 Uhr geöffnet.','Am Montag ist das Geschäft wieder geöffnet.'],
['Kita','Die Kita ist jeden Tag von 7:30 Uhr bis 17 Uhr geöffnet. Die Kinder essen am Mittag. Am Feiertag ist die Kita geschlossen.','Die Kita ist am Feiertag geöffnet.','Die Kita ist am Feiertag geschlossen.','Die Kita ist jeden Tag geöffnet.','Die Kinder essen am Mittag.'],
['Praxis','In der Praxis kann man am Vormittag einen Termin vereinbaren. Die Praxis öffnet um 8 Uhr. Um 16 Uhr ist sie geschlossen.','Die Praxis öffnet um 10 Uhr.','Die Praxis öffnet um 8 Uhr.','Man kann am Vormittag einen Termin vereinbaren.','Um 16 Uhr ist die Praxis geschlossen.']
];
let i=0;
function show(){
  if(loadTask(FILE,ITEMS.length).done.length>=ITEMS.length){complete(area,FILE,'jede-zeit.html');return}
  i=spNextIndex(FILE,ITEMS.length);
  const it=ITEMS[i],opts=shuffle([it[2],it[4],it[5]]);
  area.innerHTML=`${spProgressHtml(FILE,ITEMS.length)}${instruction('Lesen Sie den Text. Eine Aussage passt nicht. Markieren Sie diese Aussage.')}<div class="open-text"><h2>${it[0]}</h2><p>${it[1]}</p></div><div class="choice-grid">${opts.map(o=>`<button class="choice" onclick="check(this,'${encodeURIComponent(o)}')">${o}</button>`).join('')}</div><div id="fb" class="feedback"></div>`;
}
function check(btn,raw){
  const val=decodeURIComponent(raw),it=ITEMS[i];
  if(val===it[2]){
    btn.classList.add('ok');fb.innerHTML='<div class="ok">Richtig!</div><div class="hint">Richtig ist: '+it[3]+'</div>';spMarkRight(FILE,ITEMS.length);setTimeout(show,1000);
  }else{
    btn.classList.add('no');const t=spMarkWrong(FILE,ITEMS.length);fb.innerHTML=help3(t,'Diese Aussage passt zum Text. Lesen Sie noch einmal.','Tipp: Prüfen Sie Tag, Uhrzeit und geöffnet oder geschlossen.',it[3]);
  }
}
show();
