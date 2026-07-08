header('TV-Programm');
const FILE='tv-programm.html';
const PROGRAM=[['Das Erste','18:30','Nachrichten für Kinder'],['Das Erste','19:05','Lotto am Samstag'],['Das Erste','20:00','Tagesschau'],['ZDF','19:25','Herzensbrecher'],['ZDF','20:15','Fußball live'],['ZDF','22:00','Heute Journal'],['RTL','19:05','Boulevardmagazin'],['RTL','20:15','Film: Schönes Leben'],['RTL','22:30','Actionfilm']];
const ITEMS=[
{wrong:'Die Tagesschau fängt um halb neun an.',right:'Die Tagesschau fängt um 20:00 Uhr an.',alts:['Die Tagesschau fängt um 20:00 Uhr an.','Die Tagesschau fängt um 20 Uhr an.','Die Tagesschau fängt um zwanzig Uhr an.'],must:[['tagesschau'],['20','zwanzig']]},
{wrong:'Der Film „Schönes Leben“ fängt um 18:30 Uhr an.',right:'Der Film „Schönes Leben“ fängt um 20:15 Uhr an.',alts:['Der Film Schönes Leben fängt um 20:15 Uhr an.','Der Film Schönes Leben fängt um 20 Uhr 15 an.'],must:[['film'],['schones leben'],['20'],['15']]},
{wrong:'Lotto am Samstag kommt um kurz nach acht.',right:'Lotto am Samstag kommt um kurz nach sieben.',alts:['Lotto am Samstag kommt um kurz nach sieben.','Lotto am Samstag kommt um 19:05 Uhr.'],must:[['lotto'],['kurz nach sieben','19','05']]},
{wrong:'Fußball live kommt im ZDF um 19:25 Uhr.',right:'Fußball live kommt im ZDF um 20:15 Uhr.',alts:['Fußball live kommt im ZDF um 20:15 Uhr.','Fußball live kommt um 20:15 Uhr im ZDF.'],must:[['fussball'],['zdf'],['20'],['15']]},
{wrong:'Der Actionfilm fängt um 22:00 Uhr an.',right:'Der Actionfilm fängt um 22:30 Uhr an.',alts:['Der Actionfilm fängt um 22:30 Uhr an.','Der Actionfilm fängt um halb elf an.'],must:[['actionfilm'],['22','halb elf'],['30','halb elf']]},
{wrong:'Herzensbrecher kommt auf RTL.',right:'Herzensbrecher kommt im ZDF.',alts:['Herzensbrecher kommt im ZDF.'],must:[['herzensbrecher'],['zdf']]}
];
let i=0;
function prog(){return '<table class="plan-table"><tr><th>Sender</th><th>Uhrzeit</th><th>Sendung</th></tr>'+PROGRAM.map(r=>'<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')+'</table>'}
function norm(x){return simple(x).replace(/ß/g,'ss').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ä/g,'a').replace(/:/g,' ')}
function show(){if(loadTask(FILE,ITEMS.length).done.length>=ITEMS.length){complete(area,FILE,'zuordnen.html');return}i=spNextIndex(FILE,ITEMS.length);const it=ITEMS[i];area.innerHTML=`${spProgressHtml(FILE,ITEMS.length)}${instruction('Lesen Sie das TV-Programm. Der Satz ist falsch. Schreiben Sie den Satz richtig.')}<div class="open-text"><h2>TV-Programm heute</h2>${prog()}</div><div class="sentence-box">${it.wrong}</div><textarea id="ans" rows="3" placeholder="Schreiben Sie den Satz richtig."></textarea><div class="actions"><button class="btn" onclick="check()">Kontrollieren</button></div><div id="fb" class="feedback"></div>`}
function okByMust(a,it){return it.must.every(group=>group.some(m=>a.includes(norm(m))))}
function check(){const it=ITEMS[i],a=norm(ans.value);if(!a){fb.innerHTML='<div class="no">Bitte schreiben Sie den Satz richtig.</div>';return}const ok=it.alts.some(x=>norm(x)===a)||okByMust(a,it);if(ok){ans.classList.add('is-ok');fb.innerHTML='<div class="ok">Richtig!</div>';spMarkRight(FILE,ITEMS.length);setTimeout(show,900)}else{ans.classList.add('is-no');const t=spMarkWrong(FILE,ITEMS.length);fb.innerHTML=help3(t,'Prüfen Sie Sender und Uhrzeit im Programm.','Tipp: Schreiben Sie einen ganzen Satz.',it.right)}}
show();
