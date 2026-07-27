(function(){
'use strict';
const area=document.getElementById('area');
const data=window.L6T4_DATA;
const scoreApi=window.L6T4ThemeScoreV3;
if(!area||!data||!scoreApi)return;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const task=id=>(data.tasks||[]).find(item=>item.id===id);
const bunny=file=>window.L6T4Bunny?.url(file)||`https://sprachpilot.b-cdn.net/${String(file||'').split('/').map(encodeURIComponent).join('/')}`;
const image=(file,alt='Bild')=>file?`<div class="visual"><img src="${esc(bunny(file))}" alt="${esc(alt)}" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="image-fallback blank" hidden>Bild nicht verfügbar</div></div>`:'';
const audio=file=>file?`<div class="audio-file-panel"><audio controls preload="metadata" src="${esc(bunny(file))}"></audio></div>`:'';
const shuffle=list=>{const copy=[...(list||[])];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}return copy};
const exact=(value,solutions)=>typeof window.l6t4Exact==='function'?window.l6t4Exact(value,solutions):[...(Array.isArray(solutions)?solutions:[solutions])].some(solution=>String(solution).trim().toLowerCase()===String(value).trim().toLowerCase());
const starsFor=percent=>percent>=100?3:percent>=70?2:percent>=50?1:0;
const starsHtml=count=>`<div class="stars">${[0,1,2].map(index=>index<count?'⭐':'☆').join(' ')}</div>`;
let current=0,answered=false,selected='',inputValue='',results=[];
let abcOffset=Math.floor(Math.random()*3);

function choiceFrom(item,title,extra={}){return{type:'choice',title,prompt:item?.prompt||'',answer:item?.answer||'',answers:item?.answers||[],options:[...(item?.options||[])],dialog:item?.dialog||null,image:item?.image||'',audioFile:item?.audioFile||'',...extra}}
function makeTasks(){
 const wordImage=task('word-image')?.items?.[0]||{};
 const meaningWord=task('image-word')?.items?.[1]||task('image-word')?.items?.[0]||{};
 const article=task('article')?.items?.find(item=>String(item.prompt||'').includes('Hobby'))||task('article')?.items?.[0]||{};
 const nounVerb=task('noun-verb')?.items?.[0]||{};
 const nehmen=task('nehmen')?.items?.[0]||{};
 const yesNo=task('yes-no-doch')?.items?.[1]||task('yes-no-doch')?.items?.[0]||{};
 const doch=task('doch-answer')?.items?.[0]||{};
 const dialog=task('dialogs')?.items?.[0]||{};
 const gap=task('gaps')?.items?.[0]||{};
 const listening=task('listen-abc')?.items?.[0]||{};
 const finden=task('finden')?.items?.[1]||task('finden')?.items?.[0]||{};
 const questions=task('questions')?.items?.[0]||{};
 const hobby=task('singular-plural')?.items?.[1]||task('singular-plural')?.items?.[0]||{};
 const list=[
  choiceFrom(wordImage,'Bild erkennen'),
  choiceFrom(meaningWord,'Bedeutung und Wort'),
  choiceFrom(article,'Artikel'),
  {type:'choice',title:'Plural',prompt:'Plural: das Fahrrad',answer:'die Fahrräder',options:['die Fahrräder','die Fahrrade','der Fahrräder']},
  choiceFrom(nounVerb,'Nomen-Verb-Verbindung'),
  choiceFrom(nehmen,'Verb „nehmen“'),
  choiceFrom(yesNo,'Ja, Nein oder Doch'),
  {type:'input',title:'Mit „doch“ widersprechen',prompt:doch.prompt||'Maria spielt nicht gern Tennis. – ___',answer:doch.answer||'Doch, Maria spielt gern Tennis.',answers:doch.answers||['Doch, sie spielt gern Tennis.']},
  {type:'choice',title:'Dialog: richtig oder falsch',prompt:dialog.trueFalsePrompt||'',answer:dialog.trueFalseAnswer||'Richtig',options:['Richtig','Falsch'],dialog:dialog.dialog||[]},
  {type:'choice',title:'Dialog verstehen',prompt:dialog.abcPrompt||'',answer:dialog.abcAnswer||'',options:[...(dialog.abcOptions||[])],dialog:dialog.dialog||[],abc:true},
  choiceFrom(gap,'Dialog ergänzen'),
  choiceFrom(listening,'Hören und Verstehen',{abc:true}),
  {type:'image-choice',title:'Bedeutung von „finden“',prompt:finden.prompt||'',answer:finden.answer||'',options:[...(finden.options||[]) ]},
  choiceFrom(questions,'Frage und Antwort',{abc:true}),
  choiceFrom(hobby,'Hobby: Singular und Plural')
 ];
 return shuffle(list)
}
const examTasks=makeTasks();
function accepted(item){return[item.answer,...(item.answers||[])].filter(Boolean)}
function dialogHtml(lines){if(!Array.isArray(lines)||!lines.length)return'';const speakers=[];return`<div class="chat-window">${lines.map(line=>{let index=speakers.indexOf(line.speaker);if(index<0){speakers.push(line.speaker);index=speakers.length-1}const side=line.side==='right'?'right':'left';return`<div class="chat-row ${side} speaker-${index%2}"><div class="chat-name">${esc(line.speaker)}</div><div class="chat-bubble">${esc(line.text)}</div></div>`}).join('')}</div>`}
function arrangedOptions(item,index){
 const options=[...(item.options||[])];
 if(options.length!==3)return shuffle(options);
 const correctIndex=options.findIndex(option=>exact(option,item.answer));if(correctIndex<0)return shuffle(options);
 const answer=options[correctIndex],wrong=shuffle(options.filter((_,i)=>i!==correctIndex)),position=(index+abcOffset)%3,arranged=[...wrong];arranged.splice(position,0,answer);return arranged
}
function optionHtml(item,index){const options=arrangedOptions(item,index),abc=options.length===3||item.abc;return`<div class="option-grid compact-options ${abc?'abc-list':''}">${options.map((option,position)=>`<button type="button" class="option ${selected===String(option)?'exam-answer-selected':''}" data-exam-answer="${esc(option)}">${abc?`<span class="abc-letter">${String.fromCharCode(65+position)}</span>`:''}<span>${esc(option)}</span></button>`).join('')}</div>`}
function imageChoiceHtml(item){return`<div class="meaning-choice-grid">${(item.options||[]).map(option=>`<button type="button" class="image-option ${selected===String(option.label)?'exam-answer-selected':''}" data-exam-answer="${esc(option.label)}">${image(option.image,option.label)}<span class="meaning-label">${esc(option.label)}</span></button>`).join('')}</div>`}
function reason(item,user){if(!String(user||'').trim())return'Es wurde keine Antwort ausgewählt oder geschrieben.';if(item.type==='input')return'Die Aussage wurde nicht vollständig mit „doch“ korrigiert.';if(item.audioFile)return'Die gehörte Information passt nicht zur gewählten Antwort.';if(item.dialog)return'Die Antwort passt nicht zum Sinn des Dialogs.';return'Die gewählte Antwort ist nicht richtig.'}
function responseBody(item,index){const media=`${item.dialog?dialogHtml(item.dialog):''}${item.image?image(item.image,item.prompt):''}${item.audioFile?audio(item.audioFile):''}`;if(item.type==='input')return`${media}<h2 class="question">${esc(item.prompt)}</h2><div class="answer-area"><label for="examInput">Deine Antwort</label><input id="examInput" autocomplete="off" value="${esc(inputValue)}"></div>`;if(item.type==='image-choice')return`${media}<h2 class="question">${esc(item.prompt)}</h2>${imageChoiceHtml(item)}`;return`${media}<h2 class="question">${esc(item.prompt)}</h2>${optionHtml(item,index)}`}
function render(){
 if(!window.l6t4ExamUnlocked?.()){
  l6t4Header('Prüfung');area.innerHTML='<div class="finish-box"><div class="finish-icon">🔒</div><h2>Prüfung gesperrt</h2><p>Schließe zuerst alle Lernaufgaben mit 100 % ab.</p><a class="btn" href="index.html">Zur Themenübersicht</a></div>';return
 }
 if(current>=examTasks.length)return finish();
 const item=examTasks[current],summary=scoreApi.summary();answered=false;selected='';inputValue='';l6t4Header('Prüfung');document.title='Prüfung · Lektion 6 · Thema 4';
 area.innerHTML=`<div class="exam-page-title"><span class="star">⭐</span><div><span class="task-number">${esc(summary.label)}</span><h1>Prüfung</h1></div></div><div class="exam-question-count"><span>${current+1} von ${examTasks.length}</span><strong>${Math.round(current/examTasks.length*100)} %</strong></div><div class="progress"><div class="bar" style="width:${Math.round(current/examTasks.length*100)}%"></div></div><div class="question-card"><p class="eyebrow">${esc(item.title)}</p>${responseBody(item,current)}<div class="actions centered"><button class="btn" id="examCheck" type="button">Kontrollieren</button></div><div id="examFeedback" class="feedback"></div></div>`;
 document.getElementById('examInput')?.addEventListener('input',event=>inputValue=event.target.value);
 document.getElementById('examInput')?.addEventListener('keydown',event=>{if(event.key==='Enter')check()});
 document.querySelectorAll('[data-exam-answer]').forEach(button=>button.addEventListener('click',()=>{selected=button.dataset.examAnswer||'';document.querySelectorAll('[data-exam-answer]').forEach(item=>item.classList.toggle('exam-answer-selected',item===button))}));
 document.getElementById('examCheck')?.addEventListener('click',check)
}
function check(){
 if(answered)return;const item=examTasks[current],user=item.type==='input'?inputValue:selected;if(!String(user||'').trim())return;
 answered=true;const correct=exact(user,accepted(item));results.push({title:item.title,prompt:item.prompt,user,answer:item.answer,correct});
 document.querySelectorAll('.question-card button,.question-card input').forEach(element=>element.disabled=true);
 const feedback=document.getElementById('examFeedback');
 feedback.innerHTML=correct?'<div class="exam-feedback-box correct"><b>Richtig.</b></div><div class="actions"><button class="btn" id="examNext">Weiter</button></div>':`<div class="exam-feedback-box wrong"><b>Falsch.</b><br><b>Deine Antwort:</b> ${esc(user)}<br><b>Richtige Lösung:</b> ${esc(item.answer)}<br><b>Hinweis:</b> ${esc(reason(item,user))}</div><div class="actions"><button class="btn" id="examNext">Weiter</button></div>`;
 document.getElementById('examNext')?.addEventListener('click',()=>{current++;render()})
}
function finish(){
 const correct=results.filter(item=>item.correct).length,percent=Math.round(correct/examTasks.length*100),stars=starsFor(percent),before=scoreApi.summary();
 scoreApi.recordExam({percent,stars,score:correct,maxScore:examTasks.length,date:new Date().toISOString()});
 const after=scoreApi.summary(),historyKey=`SP_L6_T4_EXAM_ATTEMPTS_R${before.currentRun}`,history=(()=>{try{return JSON.parse(localStorage.getItem(historyKey)||'[]')}catch(e){return[]}})();
 history.push({date:new Date().toISOString(),percent,correct,total:examTasks.length,results});localStorage.setItem(historyKey,JSON.stringify(history.slice(-50)));
 const nextLabel=percent===100&&before.currentRun<3?`Zurück zum Thema – Wiederholung ${before.currentRun+1} von 3 starten`:'Zurück zum Thema';
 area.innerHTML=`<div class="finish-box"><div class="finish-icon">✓</div><h1>Prüfung beendet</h1><div class="big">${percent} %</div>${starsHtml(stars)}<div class="exam-summary-grid"><div class="exam-summary-tile">Richtig<br>${correct}/${examTasks.length}</div><div class="exam-summary-tile">Bestes Ergebnis<br>${after.examBestPercent} %</div><div class="exam-summary-tile">Prüfungspunkte<br>${after.runExamPoints}/${scoreApi.examMax(before.currentRun)}</div></div><div class="exam-review"><h2>Deine Rückmeldung</h2>${results.map((item,index)=>`<article class="exam-review-item ${item.correct?'correct':'wrong'}"><h3>${index+1}. ${esc(item.title)} – ${item.correct?'Richtig':'Falsch'}</h3><p><b>Frage:</b> ${esc(item.prompt||'Bild- oder Höraufgabe')}</p><p><b>Deine Antwort:</b> ${esc(item.user||'–')}</p>${item.correct?'':`<p><b>Richtige Lösung:</b> ${esc(item.answer)}</p>`}</article>`).join('')}</div><div class="actions finish-actions"><button class="btn" type="button" onclick="location.reload()">Prüfung wiederholen</button><a class="btn secondary" href="index.html?v=l6t4-central3">${esc(nextLabel)}</a></div></div>`
}
render();
})();
