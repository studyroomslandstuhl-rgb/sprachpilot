header('Lesen');
const FILE='lesen.html';
const TOTAL=6;
const TEXT=`Vera ist 33 Jahre alt und lebt mit ihren zwei Kindern in Stuttgart. Tom ist vier Jahre alt und Luka ist zwei Jahre alt. Tom geht in die Kita, Luka geht in die Krippe. Vera arbeitet in einer Bibliothek. Sie steht jeden Morgen um sechs Uhr auf. Um sieben Uhr fünfzehn bringt sie die Kinder in die Kita und in die Krippe. Von acht Uhr bis sechzehn Uhr arbeitet Vera. Um siebzehn Uhr holt sie die Kinder ab. Um achtzehn Uhr essen sie zusammen. Am Abend spielt Vera noch mit Tom und Luka. Um halb acht bringt sie die Kinder ins Bett. Ihre Freundin ruft an und fragt: „Wann hast du denn mal Zeit?“ Vera antwortet: „Heute nicht. Ich bin total fertig.“`;
const STATEMENTS=[
{txt:'Vera lebt mit ihren zwei Kindern in Stuttgart.',ok:true,fix:''},
{txt:'Tom geht in die Krippe.',ok:false,fix:'Tom geht in die Kita.'},
{txt:'Luka geht in die Krippe.',ok:true,fix:''},
{txt:'Vera arbeitet in einem Geschäft.',ok:false,fix:'Vera arbeitet in einer Bibliothek.'},
{txt:'Vera holt die Kinder um siebzehn Uhr ab.',ok:true,fix:''},
{txt:'Am Abend ist Vera total fertig.',ok:true,fix:''}
];
let selected=new Set();
function show(){if(loadTask(FILE,TOTAL).done.length>=TOTAL){complete(area,FILE,'tv-programm.html');return}area.innerHTML=`${spProgressHtml(FILE,TOTAL)}${instruction('Lesen Sie den Text. Markieren Sie alle falschen Aussagen. Zwei Aussagen sind falsch.')}<div class="open-text"><h2>Veras Tag</h2><p>${TEXT}</p></div><div class="choice-grid">${STATEMENTS.map((s,i)=>`<button class="choice statement-choice" id="st${i}" onclick="toggle(${i})">${i+1}. ${s.txt}</button>`).join('')}</div><div class="actions"><button class="btn" onclick="check()">Kontrollieren</button></div><div id="fb" class="feedback"></div>`}
function toggle(i){if(selected.has(i)){selected.delete(i);document.getElementById('st'+i).classList.remove('selected')}else{selected.add(i);document.getElementById('st'+i).classList.add('selected')}}
function check(){const wrong=STATEMENTS.map((s,i)=>!s.ok?i:null).filter(i=>i!==null);const ok=wrong.length===selected.size&&wrong.every(i=>selected.has(i));if(ok){wrong.forEach(i=>document.getElementById('st'+i).classList.add('ok'));fb.innerHTML='<div class="ok">Richtig!</div><div class="feedback-lines">'+wrong.map(i=>'<div class="hint">'+STATEMENTS[i].fix+'</div>').join('')+'</div>';markTaskDone(FILE,TOTAL);setTimeout(show,1300)}else{STATEMENTS.forEach((s,i)=>{const b=document.getElementById('st'+i);if(selected.has(i)&&s.ok)b.classList.add('no')});const t=spMarkWrong(FILE,TOTAL);fb.innerHTML=help3(t,'Nicht ganz. Es gibt genau zwei falsche Aussagen.','Tipp: Prüfen Sie Kita/Krippe und den Arbeitsplatz.','Falsch sind: 2 und 4.')}}
show();
