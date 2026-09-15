(function(){
'use strict';
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const WEATHER_SENTENCE_IDS=new Set(['sonne','regen','wind','wolke','schnee','gewitter','blitz','eis','donner','hagel','nebel','sturm']);
const taskMeta={
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
function ws(){try{return typeof words==='function'?words():[]}catch(e){return[]}}
function weatherSentenceWords(){return ws().filter(w=>WEATHER_SENTENCE_IDS.has(w.id)&&w.sentence)}
function patchMedia(){
 ws().forEach(w=>{
  w.wordAudio=AUDIO+String(w.id||'').toLowerCase()+'.mp3';
  w.sentenceAudio=AUDIO+'l6t1-satz-'+String(w.id||'').toLowerCase()+'.mp3';
  if(!w.image){
   const fallbackNames={unter_null:'unternull',eis:'das_eis',heiss:'heiss'};
   w.image=CDN+(fallbackNames[w.id]||String(w.id||'').toLowerCase())+'.webp';
  }
  if(w.sound){const name=String(w.sound).split('/').pop();w.sound=AUDIO+name}
 });
}
function fallbackSpeak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.lang='de-DE';u.rate=.86;speechSynthesis.speak(u)}catch(e){}}
function play(url,fallbackText,altUrl){
 const sources=[url,altUrl].filter(Boolean);let i=0;
 const next=()=>{if(i>=sources.length){fallbackSpeak(fallbackText);return}try{const a=new Audio(sources[i++]);let used=false;const fail=()=>{if(used)return;used=true;next()};a.onerror=fail;const p=a.play();if(p&&p.catch)p.catch(fail)}catch(e){next()}};next();
}
window.l6PlayWord=function(id){patchMedia();const w=ws().find(x=>x.id===id);if(!w)return;play(w.wordAudio,w.full||w.word,AUDIO+(w.word||'').toLowerCase().replace(/\s+/g,'_')+'.mp3')};
window.l6PlaySentence=function(id){patchMedia();const w=ws().find(x=>x.id===id);if(!w||!WEATHER_SENTENCE_IDS.has(w.id))return;play(w.sentenceAudio,w.sentence)};
window.say=function(text){patchMedia();const t=String(text||'').trim(),w=ws().find(x=>[x.word,x.full,x.sentence].concat(x.altSentences||[]).some(v=>String(v||'').trim()===t));if(w){if((t===w.sentence||(w.altSentences||[]).includes(t))&&WEATHER_SENTENCE_IDS.has(w.id))return window.l6PlaySentence(w.id);return window.l6PlayWord(w.id)}fallbackSpeak(t)};
const originalListen=window.listenItems;
window.listenItems=function(){const list=typeof originalListen==='function'?originalListen():[];return list.map((x,i)=>({...x,audio:AUDIO+(x.audioName||`a1-l6-t1-hoeren-${String(i+1).padStart(2,'0')}.mp3`)}))};
window.sentenceItems=function(){return weatherSentenceWords().map(w=>({w,sol:typeof sentenceSolutions==='function'?sentenceSolutions(w):[w.sentence]}))};
window.cardItems=function(){return ws().flatMap(w=>{const mode=w.type==='verb'?'verb':(w.type==='phrase'?'phrase':'noun');return WEATHER_SENTENCE_IDS.has(w.id)?[{mode,w},{mode:'sentence',w}]:[{mode,w}]})};
window.writingItems=function(){const pool=weatherSentenceWords(),res=[];let n=0;if(!pool.length)return res;while(res.length<20){const day=DAYS[n%DAYS.length],time=TIMES[n%TIMES.length],w=pool[n%pool.length];let rest=w.sentence;if(rest==='Die Sonne scheint.')rest='scheint die Sonne.';else{let m=rest.match(/^Es ist (.+)\.$/);if(m)rest=`ist es ${m[1]}.`;else{m=rest.match(/^Es sind (.+)\.$/);if(m)rest=`sind es ${m[1]}.`;else{m=rest.match(/^Es (.+)\.$/);if(m)rest=`${m[1]} es.`;else rest=rest.charAt(0).toLowerCase()+rest.slice(1)}}}res.push({short:day[0],day:day[1],time,w,sol:`Am ${day[1]} um ${time} ${rest}`});n++}return res};
window.renderOverview=function(target){patchMedia();const all=ws(),groups=['Im Buch','Nicht im Buch'];target.innerHTML=groups.map(g=>{const list=all.filter(w=>w.group===g);if(!list.length)return'';return `<section class="type-block l6-standard-block"><div class="type-title">${g}</div><div class="l6-vocab-grid">${list.map(w=>{const hasSentence=WEATHER_SENTENCE_IDS.has(w.id)&&w.sentence;const src=w.image||CDN+String(w.id||'').toLowerCase()+'.webp';return `<article class="l6-vocab-card"><div class="l6-vocab-image"><img src="${src}" alt="" loading="lazy"></div><div class="l6-vocab-main"><div class="l6-vocab-word">${full(w)}</div>${hasSentence?`<div class="l6-vocab-sentence">${w.sentence}${w.altSentences?.length?`<br>${w.altSentences.join('<br>')}`:''}</div>`:''}<div class="small">${tr(w)}</div><div class="l6-audio-row"><button class="btn secondary" type="button" onclick="l6PlayWord('${w.id}')">🔊 Wort</button>${hasSentence?`<button class="btn secondary" type="button" onclick="l6PlaySentence('${w.id}')">🔊 Satz</button>`:''}</div></div></article>`}).join('')}</div></section>`}).join('')};
window.renderTaskList=function(includeExam=true){const ts=taskTotals().filter(t=>includeExam||t[0]!=='pruefung.html'),practice=ts.filter(t=>t[0]!=='pruefung.html'),examOpen=practice.every(t=>pctFor(t[0],t[1])>=100);let n=0;const cards=[];ts.forEach(t=>{n++;const meta=taskMeta[t[0]]||['✅',t[2],'Bearbeite die Aufgabe.'],p=pctFor(t[0],t[1]);if(t[0]==='pruefung.html'&&!examOpen){cards.push(`<div class="l8-card l8-task-card locked exam-locked" aria-disabled="true"><div class="l8-task-number">${n}. ${meta[1]}</div><div class="emoji">⭐</div><p>Die Prüfung wird freigeschaltet, wenn alle Aufgaben 100% erreicht haben.</p><div class="l8-progress"><div style="width:0%"></div></div><div class="l8-small">gesperrt</div><div class="l8-task-start">Prüfung gesperrt</div></div>`)}else{cards.push(`<a class="l8-card l8-task-card ${p>=100?'done':''}" href="${t[0]}"><div class="l8-task-number">${n}. ${meta[1]}</div><div class="emoji">${meta[0]}</div><p>${meta[2]}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${p>=100?'Fertig':'Starten'}</div></a>`)}});return cards.join('')};
window.renderMenu=function(){patchMedia();const box=document.getElementById('teacherBox');if(box&&typeof isTeacher==='function'){box.innerHTML=isTeacher()?`<section class="l8-card teacher-box"><div class="toggle-row"><div><b>Lehreroption</b><br><span class="l8-small">Zusatzwortschatz Wetter aktivieren.</span></div><label class="switch"><input type="checkbox" ${extraOn()?'checked':''} onchange="setExtraWeather(this.checked)"> Nicht im Buch</label></div></section>`:''}const grid=document.getElementById('taskGrid');if(grid)grid.innerHTML=window.renderTaskList(true);const ts=taskTotals(),practice=ts.filter(t=>t[0]!=='pruefung.html'),avg=Math.round(practice.reduce((s,t)=>s+pctFor(t[0],t[1]),0)/Math.max(1,practice.length))||0,done=practice.filter(t=>pctFor(t[0],t[1])>=100).length;if(window.totalCircle)totalCircle.textContent=avg+'%';if(window.totalBar)totalBar.style.width=avg+'%';if(window.totalText)totalText.textContent=done+' / '+practice.length+' Aufgaben abgeschlossen'};
patchMedia();
})();
