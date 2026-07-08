header('Sätze bauen');
const FILE='saetze-bauen.html';
const ITEMS=[
{cue:'Nora – jeden Morgen – um 6:15 Uhr – aufstehen',ans:['Nora steht jeden Morgen um 6:15 Uhr auf.','Nora steht jeden Morgen um 6.15 Uhr auf.']},
{cue:'Nora – Emil – um 7:30 Uhr – in die Kita / in den Kindergarten – bringen',ans:['Nora bringt Emil um 7:30 Uhr in die Kita.','Nora bringt Emil um 7.30 Uhr in die Kita.','Nora bringt Emil um 7:30 Uhr in den Kindergarten.','Nora bringt Emil um 7.30 Uhr in den Kindergarten.']},
{cue:'die Kita / der Kindergarten – von Montag bis Freitag – geöffnet sein',ans:['Die Kita ist von Montag bis Freitag geöffnet.','Der Kindergarten ist von Montag bis Freitag geöffnet.']},
{cue:'das Geschäft – am Mittwoch – um 13:00 Uhr – schließen',ans:['Das Geschäft schließt am Mittwoch um 13:00 Uhr.','Das Geschäft schließt am Mittwoch um 13 Uhr.']},
{cue:'Nora – in der Bibliothek – ein Buch – ausleihen',ans:['Nora leiht in der Bibliothek ein Buch aus.']},
{cue:'ich – einen Termin – vereinbaren',ans:['Ich vereinbare einen Termin.']},
{cue:'die Bibliothek – an Feiertagen – geschlossen sein',ans:['Die Bibliothek ist an Feiertagen geschlossen.']},
{cue:'Nora – am Abend – fertig sein',ans:['Nora ist am Abend fertig.']}
];
let i=0;
function show(){if(loadTask(FILE,ITEMS.length).done.length>=ITEMS.length){complete(area,FILE,'mini-dialoge.html');return}i=spNextIndex(FILE,ITEMS.length);const it=ITEMS[i];area.innerHTML=`${spProgressHtml(FILE,ITEMS.length)}${instruction('Bauen Sie einen ganzen Satz.')}<div class="sentence-box">${it.cue}</div><textarea id="ans" rows="3" placeholder="Schreiben Sie den Satz."></textarea><div class="actions"><button class="btn" onclick="check()">Kontrollieren</button></div><div id="fb" class="feedback"></div>`}
function check(){const it=ITEMS[i],a=ans.value;if(!a.trim()){fb.innerHTML='<div class="no">Bitte schreiben Sie einen ganzen Satz.</div>';return}if(it.ans.some(x=>simple(x)===simple(a))){ans.classList.add('is-ok');fb.innerHTML='<div class="ok">Richtig!</div>';spMarkRight(FILE,ITEMS.length);setTimeout(show,900)}else{ans.classList.add('is-no');const t=spMarkWrong(FILE,ITEMS.length);fb.innerHTML=help3(t,'Der Satz ist noch nicht richtig.','Tipp: Das Verb steht auf Position 2.',it.ans[0])}}
show();