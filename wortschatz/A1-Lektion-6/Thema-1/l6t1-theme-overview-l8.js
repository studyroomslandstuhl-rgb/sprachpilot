(function(){
'use strict';
const SCOPE='wortschatz-a1-lektion-6-thema-1';
const META={
 'karteikarten.html':['📚','Karteikarten','Lerne die Wörter und ihre Bedeutung.'],
 'artikel.html':['🔤','Artikel','Wähle den richtigen Artikel.'],
 'hoeren-schreiben.html':['🎧','Hören und schreiben','Höre das Wort und schreibe es richtig.'],
 'hoeren-bild.html':['🖼️','Hören und Bild','Höre und wähle das passende Bild.'],
 'nomen-satz-a.html':['🔗','Wort → Satz','Verbinde das Wetterwort mit dem passenden Satz.'],
 'nomen-satz-b.html':['💬','Satz → Wort','Finde zum Wettersatz das passende Wetterwort.'],
 'geraeusche.html':['🔊','Wettergeräusche','Höre das Geräusch und wähle das Wetterwort.'],
 'geraeusche-satz.html':['🌦️','Geräusch → Satz','Höre und wähle den passenden Wettersatz.'],
 'wetter-saetze.html':['✍️','Wettersätze','Schreibe vollständige Wettersätze.'],
 'hoeren.html':['🎙️','Wetterbericht hören','Höre den Wetterbericht und beantworte die Frage.'],
 'pruefung.html':['⭐','Prüfung','Prüfe das ganze Thema.']
};
function runNo(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+SCOPE)||1)||1))}
function taskPoints(run){return run===1?5:run===2?10:15}
function examMax(run){return run===1?100:run===2?200:300}
function refreshScore(ts){
 const run=runNo(),practice=ts.filter(t=>t[0]!=='pruefung.html'),done=practice.filter(t=>pctFor(t[0],t[1])>=100).length;
 const taskScore=done*taskPoints(run),exam=ts.find(t=>t[0]==='pruefung.html'),examPct=exam?pctFor(exam[0],exam[1]):0,examScore=Math.round(examMax(run)*examPct/100),total=taskScore+examScore;
 const label=document.getElementById('l6RunLabel'),points=document.getElementById('l6Points'),detail=document.getElementById('l6ScoreDetail');
 if(label)label.textContent=run===1?'Versuch 1 von 3':`Wiederholung ${run} von 3`;
 if(points)points.textContent=`${total} Punkte`;
 if(detail)detail.textContent=`Aufgaben: ${taskScore} · Prüfung: ${examScore}`;
}
window.renderTaskList=function(includeExam=true){
 const ts=taskTotals().filter(t=>includeExam||t[0]!=='pruefung.html'),practice=ts.filter(t=>t[0]!=='pruefung.html'),examOpen=practice.every(t=>pctFor(t[0],t[1])>=100);
 const cards=[`<a class="l8-card l8-task-card" href="uebersicht.html"><div class="l8-task-number">Übersicht</div><div class="emoji">📚</div><p>Sieh alle neuen Wörter, Bilder, Übersetzungen und Hörbeispiele.</p><div class="l8-task-start">Öffnen</div></a>`];
 ts.forEach((t,i)=>{const meta=META[t[0]]||['✅',t[2],'Bearbeite die Aufgabe.'],pct=pctFor(t[0],t[1]),exam=t[0]==='pruefung.html';if(exam&&!examOpen){cards.push(`<div class="l8-card l8-task-card locked" aria-disabled="true"><div class="l8-task-number">${i+1}. ${meta[1]}</div><div class="emoji">⭐</div><p>Die Prüfung wird freigeschaltet, wenn alle Aufgaben 100% erreicht haben.</p><div class="l8-progress"><div style="width:0%"></div></div><div class="l8-small">gesperrt</div><div class="l8-task-start">Prüfung gesperrt</div></div>`)}else{cards.push(`<a class="l8-card l8-task-card ${pct>=100?'done':''}" href="${t[0]}"><div class="l8-task-number">${i+1}. ${meta[1]}</div><div class="emoji">${meta[0]}</div><p>${meta[2]}</p><div class="l8-progress"><div style="width:${pct}%"></div></div><div class="l8-small">${pct}%</div><div class="l8-task-start">${pct>=100?'Fertig':'Starten'}</div></a>`)}});
 return cards.join('');
};
window.renderMenu=function(){
 if(typeof patchMedia==='function')patchMedia();
 const box=document.getElementById('teacherBox');if(box&&typeof isTeacher==='function')box.innerHTML=isTeacher()?`<section class="l8-card teacher-box"><div class="toggle-row"><div><b>Lehreroption</b><br><span class="l8-small">Zusatzwortschatz Wetter aktivieren.</span></div><label class="switch"><input type="checkbox" ${extraOn()?'checked':''} onchange="setExtraWeather(this.checked)"> Nicht im Buch</label></div></section>`:'';
 const grid=document.getElementById('taskGrid');if(grid)grid.innerHTML=window.renderTaskList(true);
 const ts=taskTotals(),practice=ts.filter(t=>t[0]!=='pruefung.html'),avg=Math.round(practice.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/Math.max(1,practice.length))||0,done=practice.filter(t=>pctFor(t[0],t[1])>=100).length;
 const circle=document.getElementById('totalCircle'),bar=document.getElementById('totalBar'),text=document.getElementById('totalText');if(circle)circle.textContent=avg+'%';if(bar)bar.style.width=avg+'%';if(text)text.textContent=done+' / '+practice.length+' Aufgaben abgeschlossen';refreshScore(ts);
};
})();