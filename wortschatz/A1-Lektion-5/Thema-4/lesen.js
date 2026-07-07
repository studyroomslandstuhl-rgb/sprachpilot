header('Lesen');
const FILE='lesen.html';
const TOTAL=6;
const TEXT=`Nora ist 31 Jahre alt und lebt mit ihrem Sohn Emil in Mainz. Emil ist drei Jahre alt. Am Morgen bringt Nora Emil in die Kita. Die Kita ist von Montag bis Freitag von sieben Uhr dreißig bis siebzehn Uhr geöffnet. Danach fährt Nora zur Arbeit. Sie arbeitet in einem Geschäft in der Stadt. Das Geschäft öffnet um neun Uhr und schließt um achtzehn Uhr dreißig. Am Mittwoch ist das Geschäft nur bis dreizehn Uhr geöffnet. Am Mittag macht Nora eine Pause. Sie geht kurz in die Bibliothek und leiht ein Buch aus. Die Bibliothek ist am Samstag geöffnet, aber an Feiertagen geschlossen. Am Nachmittag holt Nora Emil von der Kita ab. Am Abend kochen sie zusammen. Später ruft eine Freundin an und fragt: „Hast du heute Zeit?“ Nora sagt: „Heute nicht. Ich bin fertig. Ich möchte nur noch lesen und schlafen.“`;
const STATEMENTS=[
{txt:'Nora lebt mit ihrem Sohn in Mainz.',ok:true,fix:''},
{txt:'Emil geht in die Krippe.',ok:false,fix:'Emil geht in die Kita.'},
{txt:'Die Kita ist von Montag bis Freitag geöffnet.',ok:true,fix:''},
{txt:'Nora arbeitet in einer Bibliothek.',ok:false,fix:'Nora arbeitet in einem Geschäft.'},
{txt:'Nora leiht ein Buch aus.',ok:true,fix:''},
{txt:'Am Abend ist Nora fertig.',ok:true,fix:''}
];
let selected=new Set();
function show(){if(loadTask(FILE,TOTAL).done.length>=TOTAL){complete(area,FILE,'tv-programm.html');return}area.innerHTML=`${spProgressHtml(FILE,TOTAL)}${instruction('Lesen Sie den Text. Markieren Sie alle falschen Aussagen. Zwei Aussagen sind falsch.')}<div class="open-text"><h2>Noras Tag</h2><p>${TEXT}</p></div><div class="choice-grid">${STATEMENTS.map((s,i)=>`<button class="choice statement-choice" id="st${i}" onclick="toggle(${i})">${i+1}. ${s.txt}</button>`).join('')}</div><div class="actions"><button class="btn" onclick="check()">Kontrollieren</button></div><div id="fb" class="feedback"></div>`}
function toggle(i){if(selected.has(i)){selected.delete(i);document.getElementById('st'+i).classList.remove('selected')}else{selected.add(i);document.getElementById('st'+i).classList.add('selected')}}
function check(){const wrong=STATEMENTS.map((s,i)=>!s.ok?i:null).filter(i=>i!==null);const ok=wrong.length===selected.size&&wrong.every(i=>selected.has(i));if(ok){wrong.forEach(i=>document.getElementById('st'+i).classList.add('ok'));fb.innerHTML='<div class="ok">Richtig!</div><div class="feedback-lines">'+wrong.map(i=>'<div class="hint">'+STATEMENTS[i].fix+'</div>').join('')+'</div>';markTaskDone(FILE,TOTAL);setTimeout(show,1300)}else{STATEMENTS.forEach((s,i)=>{const b=document.getElementById('st'+i);if(selected.has(i)&&s.ok)b.classList.add('no')});const t=spMarkWrong(FILE,TOTAL);fb.innerHTML=help3(t,'Nicht ganz. Es gibt genau zwei falsche Aussagen.','Tipp: Prüfen Sie Kita/Krippe und den Arbeitsplatz.','Falsch sind: 2 und 4.')}}
show();
