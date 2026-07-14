function ensureTaskRuntime(taskId){
  const pkg=activePackage();if(!pkg)return null;
  pkg.taskRuntime[taskId]=pkg.taskRuntime[taskId]&&typeof pkg.taskRuntime[taskId]==='object'?pkg.taskRuntime[taskId]:{queue:[],current:null,tries:0};
  const rt=pkg.taskRuntime[taskId],done=new Set(taskDoneList(taskId));
  rt.queue=uniq(rt.queue).filter(v=>pkg.verbs.includes(v)&&!done.has(v)&&v!==rt.current);
  if(rt.current&&!pkg.verbs.includes(rt.current))rt.current=null;
  if(!rt.current){if(!rt.queue.length)rt.queue=shuffle(pkg.verbs.filter(v=>!done.has(v)),hash(pkg.id+taskId+done.size));rt.current=rt.queue.shift()||null;rt.tries=0}
  return rt;
}
function currentTaskVerb(taskId){return ensureTaskRuntime(taskId)?.current||null}
function taskFeedback(tries,solution,hint='Achte auf das Verb und die Schreibweise.'){if(tries===1)return'<div class="no">Noch nicht richtig.</div>';if(tries===2)return`<div class="hint">Tipp: ${esc(hint)}</div>`;return `<div class="no">Lösung: ${esc(solution)}</div><div class="actions"><button class="secondary" id="repeatLaterBtn">Später noch einmal</button></div>`}
function wrongTask(taskId,solution,hint){const rt=ensureTaskRuntime(taskId);rt.tries=(rt.tries||0)+1;persistLocal();const fb=document.getElementById('feedback');if(fb)fb.innerHTML=taskFeedback(rt.tries,solution,hint);if(rt.tries>=3)document.getElementById('repeatLaterBtn')?.addEventListener('click',()=>{rt.queue.push(rt.current);rt.current=null;rt.tries=0;persistLocal();renderTask(taskId)})}
function correctTask(taskId){
  const pkg=activePackage(),rt=ensureTaskRuntime(taskId),verb=rt.current;pkg.taskProgress[taskId]=uniq([...pkg.taskProgress[taskId],verb]);rt.current=null;rt.tries=0;persistLocal();
  const fb=document.getElementById('feedback');if(fb)fb.innerHTML='<div class="ok">Richtig!</div>';
  const task=TASKS.find(t=>t.id===taskId);if(taskPercent(taskId)>=100)syncTaskPoints(task);setTimeout(()=>renderTask(taskId),450);
}
function taskShell(task,body){const pct=taskPercent(task.id);app.innerHTML=`<section class="card"><div class="task-head"><div><h2>${task.icon} ${esc(task.title)}</h2><div class="small">${taskDoneList(task.id).length} / ${packageVerbs().length} Verben · ${pct}%</div></div><button class="secondary" data-route="home">Zur Aufgabenübersicht</button></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div>${body}<div class="feedback" id="feedback"></div></section>`;bindRouteButtons()}
function completedTaskPage(task){taskShell(task,`<div class="finish"><h2>Aufgabe geschafft</h2><p>Alle ${packageVerbs().length} Paketverben wurden richtig bearbeitet.</p><div class="stars">★★★★★</div><p><b>5 Punkte</b></p><button data-route="home">Zur Aufgabenübersicht</button></div>`);bindRouteButtons();syncTaskPoints(task)}
function renderTask(taskId){
  if(!activePackage()){goHome();return}
  if(taskId==='pruefung'){renderExam();return}
  const task=TASKS.find(t=>t.id===taskId);if(!task){goHome();return}
  if(taskPercent(task.id)>=100){completedTaskPage(task);return}
  if(task.id==='memory'){renderMemory(task);return}
  const verb=currentTaskVerb(task.id);if(!verb){completedTaskPage(task);return}
  if(task.id==='karteikarten')renderFlashcard(task,verb);
  else if(task.id==='bild-verb')renderImageVerb(task,verb);
  else if(task.id==='verb-bild')renderVerbImage(task,verb);
  else if(task.id==='schreiben')renderWriting(task,verb);
  else if(task.id==='hoeren-schreiben')renderListeningWriting(task,verb);
  else if(task.id==='hoeren-sprechen')renderSpeaking(task,verb,true);
  else if(task.id==='bild-sprechen')renderSpeaking(task,verb,false);
  else if(task.id==='satz-puzzle')renderPuzzle(task,verb);
  else if(task.id==='konjugieren')renderConjugation(task,verb);
}
function bindTextAnswer(taskId,answer,hint){const input=document.getElementById('answerInput'),btn=document.getElementById('checkAnswer');const run=()=>{if(!input.value.trim())return;if(exact(input.value,answer))correctTask(taskId);else wrongTask(taskId,answer,hint)};btn?.addEventListener('click',run);input?.addEventListener('keydown',e=>{if(e.key==='Enter')run()});input?.focus()}
function renderFlashcard(task,verb){taskShell(task,`${imageBox(verb)}<div class="question">Welches Verb ist das?</div><input class="answer-input" id="answerInput" autocomplete="off" placeholder="Verb schreiben"><div class="actions"><button id="checkAnswer">Kontrollieren</button><button class="secondary" id="showSolution">Lösung zeigen</button></div>`);bindTextAnswer(task.id,verb,'Achte auf das Bild und schreibe den Infinitiv.');document.getElementById('showSolution').addEventListener('click',()=>wrongTask(task.id,verb,'Achte auf das Bild und schreibe den Infinitiv.'))}
function distractors(verb,count=3){return shuffle(packageVerbs().filter(v=>v!==verb),hash(activePackage().id+verb+count)).slice(0,count)}
function renderImageVerb(task,verb){const options=shuffle([verb,...distractors(verb)],hash(verb+task.id));taskShell(task,`${imageBox(verb)}<div class="question">Welches Verb passt zum Bild?</div><div class="choices">${options.map(v=>`<button class="choice" data-answer="${esc(v)}">${esc(v)}</button>`).join('')}</div>`);document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.answer===verb){btn.classList.add('ok');correctTask(task.id)}else{btn.classList.add('no');wrongTask(task.id,verb,'Vergleiche das Bild mit den Verben aus deinem 20er-Paket.')}}))}
function renderVerbImage(task,verb){const options=shuffle([verb,...distractors(verb)],hash(task.id+verb));taskShell(task,`<div class="question">${esc(verb)}</div><div class="choices">${options.map(v=>`<button class="choice" data-answer="${esc(v)}">${imageHtml(v,v)}</button>`).join('')}</div>`);document.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{if(btn.dataset.answer===verb){btn.classList.add('ok');correctTask(task.id)}else{btn.classList.add('no');wrongTask(task.id,verb,'Alle Bilder gehören zu deinem aktiven Paket.')}}))}
function renderWriting(task,verb){taskShell(task,`<div class="question">${esc(translationFor(verb))}</div><p class="small" style="text-align:center">Schreibe das deutsche Verb im Infinitiv.</p><input class="answer-input" id="answerInput" autocomplete="off" placeholder="Deutsches Verb"><div class="actions"><button id="checkAnswer">Kontrollieren</button></div>`);bindTextAnswer(task.id,verb,'Nutze die Übersetzung und schreibe den deutschen Infinitiv.')}
function speak(text){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;window.speechSynthesis.speak(u)}
function renderListeningWriting(task,verb){taskShell(task,`<div class="question">Höre das Verb.</div><div class="actions"><button id="listenBtn">🔊 Anhören</button></div><input class="answer-input" id="answerInput" autocomplete="off" placeholder="Verb schreiben"><div class="actions"><button id="checkAnswer">Kontrollieren</button></div>`);document.getElementById('listenBtn').addEventListener('click',()=>speak(verb));bindTextAnswer(task.id,verb,'Höre das Verb noch einmal.')}
function startRecognition(callback){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){document.getElementById('speechStatus').textContent='Spracherkennung wird hier nicht unterstützt. Nutze das Textfeld.';return}const rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.maxAlternatives=1;document.getElementById('speechStatus').textContent='Ich höre zu …';rec.onresult=e=>callback(e.results[0][0].transcript);rec.onerror=()=>{document.getElementById('speechStatus').textContent='Mikrofon hat nicht funktioniert. Nutze das Textfeld.'};rec.start()}
function renderSpeaking(task,verb,listenFirst){taskShell(task,`${listenFirst?'<div class="question">Höre und sprich das Verb.</div>':imageBox(verb)+'<div class="question">Sprich das Verb zum Bild.</div>'}<div class="actions">${listenFirst?'<button id="listenBtn">🔊 Anhören</button>':''}<button id="micBtn">🎤 Sprechen</button></div><div class="small" id="speechStatus" style="text-align:center"></div><input class="answer-input" id="answerInput" autocomplete="off" placeholder="Alternativ hier schreiben"><div class="actions"><button id="checkAnswer">Kontrollieren</button></div>`);document.getElementById('listenBtn')?.addEventListener('click',()=>speak(verb));document.getElementById('micBtn').addEventListener('click',()=>startRecognition(text=>{document.getElementById('answerInput').value=text;if(exact(text,verb))correctTask(task.id);else wrongTask(task.id,verb,'Sprich den vollständigen Infinitiv.')}));bindTextAnswer(task.id,verb,'Sprich oder schreibe den vollständigen Infinitiv.')}
function renderPuzzle(task,verb){const sentence=sentenceFor(verb),parts=shuffle(sentence.replace(/([.!?])/g,' $1').split(/\s+/).filter(Boolean),hash(activePackage().id+task.id+verb));let built=[];const draw=()=>{taskShell(task,`${imageBox(verb)}<div class="question">Baue den Beispielsatz.</div><div class="puzzle-built" id="puzzleBuilt">${built.map((w,i)=>`<button class="word-chip" data-built="${i}">${esc(w)}</button>`).join('')||'<span class="small">Tippe die Wörter in der richtigen Reihenfolge an.</span>'}</div><div class="puzzle-bank" id="puzzleBank">${parts.map((w,i)=>built.includes(`§${i}`)?'':`<button class="word-chip" data-part="${i}">${esc(w)}</button>`).join('')}</div><div class="actions"><button id="checkPuzzle">Kontrollieren</button><button class="secondary" id="resetPuzzle">Neu</button></div>`);document.querySelectorAll('[data-part]').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.part);built.push(`§${i}`);draw()}));document.querySelectorAll('[data-built]').forEach(btn=>btn.addEventListener('click',()=>{built.splice(Number(btn.dataset.built),1);draw()}));document.getElementById('resetPuzzle').addEventListener('click',()=>{built=[];draw()});document.getElementById('checkPuzzle').addEventListener('click',()=>{const value=built.map(token=>parts[Number(token.slice(1))]).join(' ').replace(/\s+([.!?])/g,'$1');if(exact(value,sentence))correctTask(task.id);else wrongTask(task.id,sentence,'Achte auf Verbposition, Großschreibung und Satzzeichen.')})};draw()}
function renderConjugation(task,verb){const answer=ichForm(verb);taskShell(task,`<div class="question">${esc(verb)}</div><p style="text-align:center"><b>Ich __________.</b></p><input class="answer-input" id="answerInput" autocomplete="off" placeholder="Ich-Form ohne „Ich“"><div class="actions"><button id="checkAnswer">Kontrollieren</button></div><p class="small" style="text-align:center">Bei trennbaren und reflexiven Verben bitte die vollständige Form schreiben.</p>`);bindTextAnswer(task.id,answer,'Bilde die Ich-Form. Bei reflexiven Verben gehört „mich“ dazu.')}

function renderMemory(task){
  const remaining=packageVerbs().filter(v=>!taskDoneList(task.id).includes(v));
  if(!remaining.length){completedTaskPage(task);return}
  const batch=remaining.slice(0,Math.min(5,remaining.length));
  if(!memoryUi||memoryUi.task!==task.id||memoryUi.batch.join('|')!==batch.join('|')){
    const cards=shuffle(batch.flatMap(v=>[{key:v+'|image',verb:v,type:'image'},{key:v+'|word',verb:v,type:'word'}]),hash(activePackage().id+task.id+taskDoneList(task.id).length));
    memoryUi={task:task.id,batch, cards, open:[],matched:[]};
  }
  taskShell(task,`<div class="question">Finde Bild und Verb.</div><div class="memory-grid">${memoryUi.cards.map(card=>`<button class="memory-card ${memoryUi.open.includes(card.key)?'':'hidden-face'} ${memoryUi.matched.includes(card.verb)?'matched':''}" data-memory-key="${esc(card.key)}" ${memoryUi.matched.includes(card.verb)?'disabled':''}>${card.type==='image'?imageHtml(card.verb):`<span class="word">${esc(card.verb)}</span>`}</button>`).join('')}</div>`);
  document.querySelectorAll('[data-memory-key]').forEach(btn=>btn.addEventListener('click',()=>memoryClick(btn.dataset.memoryKey,task)));
}
function memoryClick(key,task){
  if(memoryUi.open.includes(key)||memoryUi.open.length>=2)return;memoryUi.open.push(key);renderMemory(task);
  if(memoryUi.open.length===2){const [a,b]=memoryUi.open.map(k=>memoryUi.cards.find(c=>c.key===k));if(a.verb===b.verb&&a.type!==b.type){memoryUi.matched.push(a.verb);const pkg=activePackage();pkg.taskProgress[task.id]=uniq([...pkg.taskProgress[task.id],a.verb]);persistLocal();memoryUi.open=[];if(taskPercent(task.id)>=100)syncTaskPoints(task);setTimeout(()=>renderMemory(task),350)}else{setTimeout(()=>{memoryUi.open=[];renderMemory(task)},700)}}
}

function examQuestionFor(verb,index){const type=['image-write','translation-write','sentence-choice','conjugation'][index%4];if(type==='image-write')return{verb,type,prompt:'Welches Verb passt zum Bild?',answer:verb};if(type==='translation-write')return{verb,type,prompt:`Schreibe das deutsche Verb: ${translationFor(verb)}`,answer:verb};if(type==='sentence-choice')return{verb,type,prompt:sentenceGap(verb),answer:verb,options:shuffle([verb,...distractors(verb)],hash(verb+'exam'))};return{verb,type,prompt:`Ich __________. (${verb})`,answer:ichForm(verb)}}
function startExam(){const pkg=activePackage(),verbs=shuffle(pkg.verbs,now());pkg.examRun={id:`exam-${now()}`,questions:verbs.map(examQuestionFor),index:0,score:0,answers:[],startedAt:now()};persistLocal()}
function renderExam(){
  if(!allTasksComplete()){app.innerHTML=`<section class="card locked-box"><h2>Prüfung gesperrt</h2><p>Bearbeite zuerst alle zehn Aufgaben zu 100 %.</p><button data-route="home">Zur Aufgabenübersicht</button></section>`;bindRouteButtons();return}
  const pkg=activePackage();if(!pkg.examRun||pkg.examRun.index>=pkg.examRun.questions.length){if(pkg.examRun&&pkg.examRun.index>=pkg.examRun.questions.length){renderExamResult();return}startExam()}
  const run=pkg.examRun,q=run.questions[run.index],pct=Math.round(run.index/run.questions.length*100);let body='';
  if(q.type==='image-write')body=`${imageBox(q.verb)}<input class="answer-input" id="examInput" autocomplete="off" placeholder="Verb schreiben"><div class="actions"><button id="examNext">Weiter</button></div>`;
  else if(q.type==='translation-write'||q.type==='conjugation')body=`<input class="answer-input" id="examInput" autocomplete="off" placeholder="Antwort schreiben"><div class="actions"><button id="examNext">Weiter</button></div>`;
  else body=`<div class="choices">${q.options.map(v=>`<button class="choice" data-exam-choice="${esc(v)}">${esc(v)}</button>`).join('')}</div>`;
  app.innerHTML=`<section class="card"><div class="task-head"><div><h2>⭐ Prüfung</h2><div class="small">Aufgabe ${run.index+1} / ${run.questions.length} · bisher bestes Ergebnis ${pkg.examBest}%</div></div><button class="secondary" data-route="home">Prüfung pausieren</button></div><div class="progress"><div class="bar" style="width:${pct}%"></div></div><div class="question">${esc(q.prompt)}</div>${body}</section>`;
  const submit=value=>submitExamAnswer(q,value);document.getElementById('examNext')?.addEventListener('click',()=>{const input=document.getElementById('examInput');if(input.value.trim())submit(input.value)});document.getElementById('examInput')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())submit(e.target.value)});document.querySelectorAll('[data-exam-choice]').forEach(btn=>btn.addEventListener('click',()=>submit(btn.dataset.examChoice)));bindRouteButtons();document.getElementById('examInput')?.focus();
}
function submitExamAnswer(q,value){const run=activePackage().examRun,correct=exact(value,q.answer);if(correct)run.score++;run.answers.push({number:run.index+1,verb:q.verb,type:q.type,prompt:q.prompt,userAnswer:String(value),correctAnswer:q.answer,correct});run.index++;persistLocal();renderExam()}
function renderExamResult(){
  const pkg=activePackage(),run=pkg.examRun,total=run.questions.length,percent=Math.round(run.score/total*100);pkg.examAttempts++;pkg.examBest=Math.max(pkg.examBest,percent);const wrong=run.answers.filter(a=>!a.correct);pkg.examRun=null;persistLocal();syncExam(percent);
  app.innerHTML=`<section class="card finish"><h2>Prüfung fertig</h2><div class="stars">${'★'.repeat(percent>=100?3:percent>=70?2:percent>=50?1:0)}${'☆'.repeat(3-(percent>=100?3:percent>=70?2:percent>=50?1:0))}</div><p><b>${run.score} / ${total} = ${percent}%</b></p><p>Bestes Ergebnis: <b>${pkg.examBest}/100 Punkte</b></p>${wrong.length?`<div class="exam-review"><h3>Was war falsch?</h3>${wrong.map(a=>`<div class="review-row"><b>Aufgabe ${a.number}: ${esc(a.prompt)}</b><div class="wrong">Deine Antwort: ${esc(a.userAnswer)||'—'}</div><div class="right">Richtig: ${esc(a.correctAnswer)}</div></div>`).join('')}</div>`:'<div class="feedback"><div class="ok">Alle Antworten waren richtig.</div></div>'}<div class="actions"><button id="repeatExam">Neue zufällige Prüfung</button><button class="secondary" data-route="home">Zur Aufgabenübersicht</button></div></section>`;
  document.getElementById('repeatExam').addEventListener('click',()=>{startExam();renderExam()});bindRouteButtons();
}

async function init(){
  profile=getActiveProfile();
  if(!profile&&currentRole()!=='teacher'){errorPage('Bitte zuerst einloggen.');return}
  if(!profile&&isTeacher())profile={vorname:'Lehrer',role:'teacher',teacherPreview:true,assignments:{releaseMode:'all',defaultLocked:false}};
  try{assignments=await loadCourseRelease(profile)}catch(e){assignments=profile?.assignments||{}}
  if(!moduleOpen(assignments,MODULE_TITLE)){header();lockedPage();return}
  normalizeCatalog();if(!catalog.length){errorPage('Der Verben-Katalog ist leer.');return}
  state=loadLocal();renderRoute();restoreRemoteIfNeeded();
}

document.addEventListener('click',e=>{const button=e.target.closest('[data-route="home"]');if(button){e.preventDefault();navigate({})}},true);
window.addEventListener('popstate',renderRoute);
window.addEventListener('pagehide',()=>{try{if(state){const text=JSON.stringify(normalizeState(state));localStorage.setItem(storageKey(),text);localStorage.setItem(backupKey(),text)}}catch(e){}});
window.VT_START=()=>init().catch(e=>errorPage(e?.message||String(e)));
