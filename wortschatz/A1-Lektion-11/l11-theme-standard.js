import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';
const C=window.L11THEME||{};const root=document.getElementById('app');const CDN='https://sprachpilot.b-cdn.net/';const AUDIO=CDN+'audio/';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9äöü]+/g,' ').trim();
const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const LANGS=[['en','Englisch'],['ru','Russisch'],['tr','Türkisch'],['uk','Ukrainisch'],['ar','Arabisch'],['ja','Japanisch'],['ro','Rumänisch'],['pl','Polnisch'],['ku','Kurdisch'],['fa','Persisch'],['fr','Französisch'],['es','Spanisch'],['it','Italienisch']];
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch{return{}}}
function lang(){const p=profile(),r=norm(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||'en');const alias={english:'en',englisch:'en',russian:'ru',russisch:'ru',turkish:'tr',türkisch:'tr',tuerkisch:'tr',ukrainian:'uk',ukrainisch:'uk',arabic:'ar',arabisch:'ar',japanese:'ja',japanisch:'ja',romanian:'ro',rumänisch:'ro',rumaenisch:'ro',polish:'pl',polnisch:'pl',kurdish:'ku',kurdisch:'ku',farsi:'fa',persisch:'fa',french:'fr',französisch:'fr',franzoesisch:'fr',spanish:'es',spanisch:'es',italian:'it',italienisch:'it'};const code=LANGS.some(x=>x[0]===r)?r:(alias[r]||'en');return{code,label:LANGS.find(x=>x[0]===code)?.[1]||'Englisch'}}
function trans(w){const l=lang();return w.translations?.[l.code]||w.translations?.en||''}
function speak(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u)}catch{}}
function play(url,text,btn){if(btn)btn.disabled=true;const end=()=>{if(btn)btn.disabled=false};try{const a=new Audio(url);a.addEventListener('ended',end,{once:true});a.addEventListener('error',()=>{end();speak(text)},{once:true});a.play().catch(()=>{end();speak(text)})}catch{end();speak(text)}}
function header(sub){return renderSpHeader({subtitle:sub,color:{main:'#F6D78B',dark:'#A88633',soft:'#FDF8EC',line:'#F3E2B7'}})}
function bindOverview(){bindSpHeader(root);document.querySelectorAll('.sp-header__nav-link').forEach(a=>{if(String(a.textContent||'').trim()==='Übersicht')a.href='uebersicht.html'})}
const key=id=>`SP_L11_T${C.theme}_${id}`;const pct=id=>Number(localStorage.getItem(key(id))||0)||0;
function preview(){const p=profile(),r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||p.role||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].includes(r)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
async function sync(task,score,total){if(preview())return;try{await import('/js/progress.js?v=20260831-central6');const api=window.SPProgress;const common={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:11,theme:C.theme,topic:C.topic,topicId:C.topic,title:`A1 Lektion 11 · Thema ${C.theme}`,file:`task.html?task=${task.id}`,taskKey:task.id,taskTitle:task.title,run:1};if(task.exam)await api?.recordExamResult?.({...common,score,maxScore:total,percent:Math.round(score/Math.max(1,total)*100),scorePercent:Math.round(score/Math.max(1,total)*100),stars:score===total?3:score/total>=.7?2:score/total>=.5?1:0});else await api?.recordTaskProgress?.({...common,done:total,total,percent:100,completed:true})}catch(e){console.warn('L11 progress sync',e)}}
function complete(task,score,total){if(score===total){localStorage.setItem(key(task.id),'100');sync(task,score,total)}}
function themePage(){const practice=C.tasks.filter(t=>!t.exam),exam=C.tasks.find(t=>t.exam),done=practice.filter(t=>pct(t.id)>=100).length,avg=Math.round(practice.reduce((s,t)=>s+pct(t.id),0)/Math.max(1,practice.length)),open=practice.every(t=>pct(t.id)>=100);const card=(t,i)=>{const p=pct(t.id),locked=t.exam&&!open;if(locked)return `<div class="l8-card l8-task-card locked"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${t.icon}</div><p>${esc(t.cardText)}</p><div class="l8-small">gesperrt</div><div class="l8-task-start">Prüfung gesperrt</div></div>`;return `<a class="l8-card l8-task-card ${p>=100?'done':''}" href="task.html?task=${encodeURIComponent(t.id)}"><div class="l8-task-number">${i+1}. ${esc(t.title)}</div><div class="emoji">${t.icon}</div><p>${esc(t.cardText)}</p><div class="l8-progress"><div style="width:${p}%"></div></div><div class="l8-small">${p}%</div><div class="l8-task-start">${p>=100?'Fertig':'Starten'}</div></a>`};root.innerHTML=`<div class="l10-theme-page">${header(C.subtitle)}<div class="l8-wrap"><section class="l8-card l8-progress-card"><div class="l8-progress-circle">${avg}%</div><div class="l8-progress-main"><h2>Dein Fortschritt</h2><p class="l8-small">${done} / ${practice.length} Aufgaben abgeschlossen</p><div class="l8-progress"><div style="width:${avg}%"></div></div><div class="l8-tags">${C.chips.map(x=>`<span class="l8-tag">${esc(x)}</span>`).join('')}</div></div></section><section class="l8-grid">${practice.map(card).join('')}</section>${exam?`<section class="l8-grid l8-exam-grid">${card(exam,practice.length)}</section>`:''}<footer>© SprachPilot</footer></div></div>`;bindOverview()}
function overview(){const l=lang();root.innerHTML=`<div class="l10-theme-page">${header('Übersicht · '+C.subtitle)}<div class="l8-wrap"><section class="l8-card"><h1>Übersicht</h1><p>Neue Wörter · Bild · ${esc(l.label)} · Hören</p></section><section class="spv-grid">${C.cards.map(w=>`<article class="l8-card spv-word"><img src="${esc(w.image)}" alt="" loading="lazy"><div><h3>${esc(w.full)}</h3>${w.plural?`<p>Plural: <b>${esc(w.plural)}</b></p>`:''}${w.present?`<p>Präsens: <b>${esc(w.present)}</b></p>`:''}${w.perfect?`<p>Perfekt: <b>${esc(w.perfect)}</b></p>`:''}<p class="spv-translation">${esc(trans(w)||'–')}</p><button class="l11-btn" data-audio="${esc(w.audio)}" data-text="${esc(w.full)}">🔊 Hören</button></div></article>`).join('')}</section></div></div>`;bindOverview();document.querySelectorAll('[data-audio]').forEach(b=>b.onclick=()=>play(b.dataset.audio,b.dataset.text,b))}
function taskFrame(task){const i=C.tasks.findIndex(t=>t.id===task.id);root.innerHTML=`<div class="l10-theme-page">${header(task.title+' · A1 Lektion 11 · Thema '+C.theme)}<div class="l8-wrap"><section class="l8-card l8-task-head"><span class="l8-task-kicker">Aufgabe ${i+1}</span><h1>${esc(task.title)}</h1><p>${task.icon} ${esc(task.cardText)}</p><div class="l8-progress"><div id="pbar" style="width:0%"></div></div><div id="ptxt" class="l8-small">0%</div></section><div id="exercise"></div></div></div>`;bindOverview()}
function progress(n,total){const p=Math.round(n/Math.max(1,total)*100);document.querySelector('#pbar').style.width=p+'%';document.querySelector('#ptxt').textContent=p+'%'}
function finished(task,score,total){complete(task,score,total);document.querySelector('#exercise').innerHTML=`<section class="l8-card l8-card-stage"><h2>${score===total?'Gut gemacht!':'Fertig'}</h2><p>${score} / ${total} richtig</p><div class="l11-controls"><a class="l11-btn primary" href="index.html">Zur Themenübersicht</a><button class="l11-btn" onclick="location.reload()">Noch einmal</button></div></section>`;progress(total,total)}
function taskNumber(task){return Math.max(1,C.tasks.findIndex(t=>t.id===task.id)+1)}
function adaptiveExcluded(task){return task?.id==='memory'||taskNumber(task)===6}
function helpText(it,tries){
 if(tries===1)return 'Hilfe 1: Schau dir Frage und Antwortmöglichkeiten noch einmal genau an.';
 if(tries===2)return 'Hilfe 2: '+(it.hint||'Achte auf das Schlüsselwort und die Bedeutung.');
 return 'Hilfe 3: Die richtige Antwort ist: '+(it.label||it.a);
}
function choiceQuiz(task,items,render){
 if(adaptiveExcluded(task)){
  let pos=0,score=0;taskFrame(task);
  const draw=()=>{if(pos>=items.length)return finished(task,score,items.length);progress(pos,items.length);const it=items[pos];document.querySelector('#exercise').innerHTML=render(it);document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);const ok=b.dataset.choice===String(it.a);b.classList.add(ok?'correct':'wrong');if(ok)score++;else document.querySelectorAll('[data-choice]').forEach(x=>{if(x.dataset.choice===String(it.a))x.classList.add('correct')});document.querySelector('#fb').textContent=ok?'Richtig!':'Richtig ist: '+(it.label||it.a);setTimeout(()=>{pos++;draw()},650)});const ab=document.querySelector('#audioBtn');if(ab)ab.onclick=()=>play(it.audio||AUDIO+(it.audioId||'')+'.mp3',it.audioText||it.label,ab)};draw();return;
 }
 const total=items.length,queue=items.map((it,i)=>({it,key:i,original:true}));let originalDone=0;
 taskFrame(task);
 const draw=()=>{
  if(!queue.length)return finished(task,total,total);
  progress(originalDone===total?Math.max(0,total-1):originalDone,total);
  const current=queue[0],it=current.it;let tries=0,hadError=false;
  document.querySelector('#exercise').innerHTML=render(it);
  const wire=()=>{
   document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.choice===String(it.a),fb=document.querySelector('#fb');
    if(ok){
     b.classList.add('correct');document.querySelectorAll('[data-choice]').forEach(x=>x.disabled=true);fb.textContent=hadError?'Richtig! Diese Frage kommt am Ende noch einmal.':'Richtig!';
     if(current.original)originalDone++;
     queue.shift();
     if(hadError)queue.push({it,key:current.key,original:false});
     setTimeout(draw,550);return;
    }
    hadError=true;tries++;b.classList.add('wrong');fb.textContent=helpText(it,tries);
    if(tries>=3)document.querySelectorAll('[data-choice]').forEach(x=>{if(x.dataset.choice===String(it.a))x.classList.add('correct')});
   });
   const ab=document.querySelector('#audioBtn');if(ab)ab.onclick=()=>play(it.audio||AUDIO+(it.audioId||'')+'.mp3',it.audioText||it.label,ab);
  };
  wire();
 };
 draw();
}
function buttons(opts){return `<div class="l11-options">${opts.map(o=>`<button class="l11-option" data-choice="${esc(o.value)}">${esc(o.label)}</button>`).join('')}</div><div class="l11-feedback" id="fb"></div>`}
function flashcards(task){const a=shuffle(C.cards),l=lang();let i=0;taskFrame(task);const draw=()=>{const w=a[i];progress(i,a.length);document.querySelector('#exercise').innerHTML=`<section class="l8-card l8-card-stage"><div class="sp-flash"><img src="${esc(w.image)}" alt=""><h2>${esc(w.full)}</h2><p>${esc(trans(w)||'–')} <small>(${esc(l.label)})</small></p>${w.plural?`<p>Plural: <b>${esc(w.plural)}</b></p>`:''}${w.present?`<p>Präsens: <b>${esc(w.present)}</b></p>`:''}${w.perfect?`<p>Perfekt: <b>${esc(w.perfect)}</b></p>`:''}<button class="l11-btn" id="audioBtn">🔊 Hören</button><button class="l11-btn primary" id="next">${i===a.length-1?'Fertig':'Weiter'}</button></div></section>`;document.querySelector('#audioBtn').onclick=()=>play(w.audio,w.full,document.querySelector('#audioBtn'));document.querySelector('#next').onclick=()=>{if(i===a.length-1)finished(task,a.length,a.length);else{i++;draw()}}};draw()}
function imageWord(task,listen=false){const pool=C.cards.filter(w=>w.image),sel=shuffle(pool).slice(0,Math.min(20,pool.length)),items=sel.map(w=>{const os=shuffle([w,...shuffle(pool.filter(x=>x.id!==w.id)).slice(0,3)]);return{a:w.id,label:w.full,hint:'Der Artikel und das Bild helfen dir.',image:w.image,audio:w.audio,audioText:w.full,opts:os.map(x=>({value:x.id,label:x.full}))}});choiceQuiz(task,items,it=>`<section class="l8-card l8-card-stage">${listen?`<button class="l11-btn primary" id="audioBtn">🔊 Hören</button>`:`<img class="l11-card-image" src="${esc(it.image)}" alt="">`}<div class="l11-question">${listen?'Welches Wort hast du gehört?':'Welches Wort passt?'}</div>${buttons(it.opts)}</section>`)}
function wordImage(task){const pool=C.cards.filter(w=>w.image),sel=shuffle(pool).slice(0,Math.min(20,pool.length)),items=sel.map(w=>{const os=shuffle([w,...shuffle(pool.filter(x=>x.id!==w.id)).slice(0,3)]);return{a:w.id,label:w.full,hint:'Suche das Bild zum Wort.',word:w.full,opts:os}});choiceQuiz(task,items,it=>`<section class="l8-card l8-card-stage"><div class="l11-question">${esc(it.word)}</div><div class="l11-image-options">${it.opts.map(x=>`<button class="l11-image-choice" data-choice="${x.id}"><img src="${x.image}" alt=""></button>`).join('')}</div><div class="l11-feedback" id="fb"></div></section>`)}
function customChoice(task,data){choiceQuiz(task,shuffle(data).slice(0,20),it=>`<section class="l8-card l8-card-stage">${it.audio?`<button class="l11-btn primary" id="audioBtn">🔊 Hören</button>`:''}<div class="l11-question">${esc(it.q)}</div>${buttons(shuffle(it.options.map(x=>({value:x,label:x}))))}</section>`)}
function writeTask(task,data){
 if(adaptiveExcluded(task)){
  let pos=0,score=0;taskFrame(task);const draw=()=>{if(pos>=data.length)return finished(task,score,data.length);progress(pos,data.length);const it=data[pos];document.querySelector('#exercise').innerHTML=`<section class="l8-card l8-card-stage"><div class="l11-question">${esc(it.q)}</div><input class="l8-input" id="answer" autocomplete="off"><button class="l11-btn primary" id="check">Prüfen</button><div class="l11-feedback" id="fb"></div></section>`;document.querySelector('#check').onclick=()=>{const ok=(it.answers||[it.a]).some(a=>norm(a)===norm(document.querySelector('#answer').value));if(ok)score++;document.querySelector('#fb').textContent=ok?'Richtig!':'Richtig: '+it.a;setTimeout(()=>{pos++;draw()},700)}};draw();return;
 }
 const total=data.length,queue=data.map((it,i)=>({it,key:i,original:true}));let originalDone=0;taskFrame(task);
 const draw=()=>{
  if(!queue.length)return finished(task,total,total);
  progress(originalDone===total?Math.max(0,total-1):originalDone,total);
  const current=queue[0],it=current.it;let tries=0,hadError=false;
  document.querySelector('#exercise').innerHTML=`<section class="l8-card l8-card-stage"><div class="l11-question">${esc(it.q)}</div><input class="l8-input" id="answer" autocomplete="off"><button class="l11-btn primary" id="check">Prüfen</button><div class="l11-feedback" id="fb"></div></section>`;
  const check=()=>{const input=document.querySelector('#answer'),ok=(it.answers||[it.a]).some(a=>norm(a)===norm(input.value)),fb=document.querySelector('#fb');if(ok){fb.textContent=hadError?'Richtig! Diese Frage kommt am Ende noch einmal.':'Richtig!';if(current.original)originalDone++;queue.shift();if(hadError)queue.push({it,key:current.key,original:false});setTimeout(draw,500);return}hadError=true;tries++;fb.textContent=helpText(it,tries);if(tries>=3)input.placeholder=String(it.a||'')};
  document.querySelector('#check').onclick=check;document.querySelector('#answer').onkeydown=e=>{if(e.key==='Enter')check()};
 };
 draw();
}
function taskPage(){const id=String(new URLSearchParams(location.search).get('task')||'karteikarten').toLowerCase(),task=C.tasks.find(t=>t.id===id)||C.tasks[0];if(task.exam){const practice=C.tasks.filter(t=>!t.exam);if(!practice.every(t=>pct(t.id)>=100)&&!preview()){location.href='index.html';return}}if(id==='karteikarten')return flashcards(task);if(id==='bild-wort')return imageWord(task);if(id==='wort-bild')return wordImage(task);if(id==='hoeren-bild')return imageWord(task,true);if(C.choiceTasks?.[id])return customChoice(task,C.choiceTasks[id]);if(C.writeTasks?.[id])return writeTask(task,C.writeTasks[id]);return imageWord(task)}
const page=document.body.dataset.page;if(page==='theme')themePage();else if(page==='overview')overview();else taskPage();