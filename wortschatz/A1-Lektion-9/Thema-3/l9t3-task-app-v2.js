(function(){
'use strict';

var D=window.L9T3;
var root=document.getElementById('app');
if(!root)return;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(v){return String(v==null?'':v).trim().toLowerCase().replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');}
function shuffle(list){var a=(list||[]).slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function label(x){return String(x&&((x.full||x.word))||'').trim();}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{};}catch(e){return {};}}
function pid(){var p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_');}
function preview(){var r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].indexOf(r)>=0||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1';}
function storage(){return preview()?sessionStorage:localStorage;}
var TOPIC='wortschatz-a1-lektion-9-thema-3',syncTimers={},importingProgress=false;
function run(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1));}
function queueProgress(method,payload){
 if(preview())return;
 if(window.SPProgress&&typeof window.SPProgress[method]==='function'){try{var p=window.SPProgress[method](payload);if(p&&p.catch)p.catch(function(){});}catch(e){}return;}
 window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:method,payload:payload});
 if(!importingProgress){importingProgress=true;import('/js/progress.js?v=20260831-central6').catch(function(){}).finally(function(){importingProgress=false;});}
}

if(!D||!Array.isArray(D.tasks)){
 root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Aufgabendaten fehlen.</h2><p>Lektion 9 · Thema 3 konnte nicht vollständig geladen werden.</p><button class="l8-btn primary" type="button" onclick="location.reload()">Neu laden</button></section></div>';
 return;
}

var params=new URLSearchParams(location.search);
var taskId=String(params.get('task')||'karteikarten');
var task=D.tasks.find(function(t){return t.id===taskId;});
if(!task){
 root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Aufgabe nicht gefunden.</h2><p>'+esc(taskId)+'</p><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></section></div>';
 return;
}

var nouns=Array.isArray(D.nouns)?D.nouns:(D.cards||[]).filter(function(x){return x.type==='noun';});
function ids(list){return (list||[]).map(function(x){return x&&x.id;}).filter(Boolean);}
function itemIds(id){
 var t=D.tasks.find(function(x){return x.id===id;});
 if(!t)return [];
 switch(t.kind){
  case 'cards': case 'word-image': case 'audio-write': case 'meaning-choice': return ids(D.cards);
  case 'article-word': case 'plural-write': return ids(nouns);
  case 'conjugation-table': return ids(D.forms);
  case 'gap-two': return ids(D.gaps);
  case 'build-sentence': return ids(D.builders);
  case 'modal-choice': return ids(D.modalItems);
  case 'dialog-modal': return D.dialogModal&&D.dialogModal.id?[D.dialogModal.id]:[];
  case 'reading-rules':
   var out=[];(D.readings||[]).forEach(function(r){out=out.concat(ids(r.questions));});return out;
  case 'exam': return Array.from({length:12},function(_,i){return 'exam'+(i+1);});
  default:return [];
 }
}
function fixedOrder(t){return ['conjugation-table','dialog-modal','reading-rules','exam'].indexOf(t.kind)>=0;}
function stateKey(id){return 'SP_L9_'+pid()+'_T3_'+id;}
function freshState(id){var all=itemIds(id);return {done:[],review:{},wrong:{},mistakes:[],answers:{},order:fixedOrder(D.tasks.find(function(x){return x.id===id;})||{})?all.slice():shuffle(all)};}
function load(id){
 id=id||taskId;var all=itemIds(id),s=freshState(id);
 try{var raw=JSON.parse(storage().getItem(stateKey(id))||'null');if(raw&&typeof raw==='object')s=Object.assign(s,raw);}catch(e){}
 s.done=Array.from(new Set((s.done||[]).filter(function(x){return all.indexOf(x)>=0;})));
 s.review=s.review&&typeof s.review==='object'?s.review:{};
 s.wrong=s.wrong&&typeof s.wrong==='object'?s.wrong:{};
 s.mistakes=Array.from(new Set((s.mistakes||[]).filter(function(x){return all.indexOf(x)>=0;})));
 s.answers=s.answers&&typeof s.answers==='object'?s.answers:{};
 if(fixedOrder(D.tasks.find(function(x){return x.id===id;})||{}))s.order=all.slice();
 else{
  s.order=Array.isArray(s.order)?s.order.filter(function(x){return all.indexOf(x)>=0;}):[];
  var missing=all.filter(function(x){return s.order.indexOf(x)<0;});
  if(missing.length)s.order=s.order.concat(shuffle(missing));
 }
 save(id,s,false);return s;
}
function syncProgress(id,s){
 if(preview())return;
 var t=D.tasks.find(function(x){return x.id===id;}),all=itemIds(id),total=all.length;
 if(!t||!total)return;
 var done=(s.done||[]).filter(function(x){return all.indexOf(x)>=0;}).length;
 var pct=Math.max(0,Math.min(100,Math.round(done/total*100)));
 clearTimeout(syncTimers[id]);
 syncTimers[id]=setTimeout(function(){
  if(t.exam){
   if(pct<100)return;
   var mistakes=(s.mistakes||[]).filter(function(x){return all.indexOf(x)>=0;}).length;
   var correct=Math.max(0,total-mistakes),scorePct=Math.round(correct/total*100);
   var signature='R'+run()+':'+scorePct+':'+total,signatureKey=stateKey(id)+'_EXAM_SYNC';
   if(storage().getItem(signatureKey)===signature)return;
   storage().setItem(signatureKey,signature);
   queueProgress('recordExamResult',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:9,theme:3,topicId:TOPIC,title:'A1 Lektion 9 · Thema 3',file:'task.html?task='+id,run:run(),score:correct,maxScore:total,percent:scorePct,scorePercent:scorePct,stars:scorePct>=100?3:scorePct>=70?2:scorePct>=50?1:0});
  }else if(pct>0)queueProgress('recordTaskProgress',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:9,theme:3,topicId:TOPIC,title:'A1 Lektion 9 · Thema 3',file:'task.html?task='+id,taskKey:id,taskTitle:t.title||id,run:run(),total:total,done:done,percent:pct,completed:pct>=100});
 },120);
}
function save(id,s,emit){
 try{storage().setItem(stateKey(id),JSON.stringify(s));}catch(e){}
 if(emit!==false){syncProgress(id,s);try{window.dispatchEvent(new CustomEvent('sprachpilot-progress',{detail:{lesson:9,theme:3,task:id,state:s}}));}catch(e){}}
}
function pending(id){var s=load(id),all=itemIds(id);return all.filter(function(x){return !!s.review[x];});}
function percent(id){id=id||taskId;var all=itemIds(id);if(!all.length)return 0;var s=load(id),p=Math.round(s.done.length/all.length*100);return p>=100&&pending(id).length?99:p;}
function firstOpen(){var s=load(taskId),i;for(i=0;i<s.order.length;i++)if(s.done.indexOf(s.order[i])<0)return s.order[i];for(i=0;i<s.order.length;i++)if(s.review[s.order[i]])return s.order[i];return null;}
function wrong(id){var s=load(taskId);s.wrong[id]=(Number(s.wrong[id])||0)+1;if(s.mistakes.indexOf(id)<0)s.mistakes.push(id);s.review[id]=true;save(taskId,s,true);return s.wrong[id];}
function correct(id){var s=load(taskId);if(s.done.indexOf(id)>=0&&s.review[id])delete s.review[id];else if(s.done.indexOf(id)<0)s.done.push(id);delete s.wrong[id];delete s.answers[id];save(taskId,s,true);return s;}
function remember(id,val){var s=load(taskId);s.answers[id]=val;save(taskId,s,false);}
function taskNo(){return D.tasks.findIndex(function(x){return x.id===taskId;})+1;}
function head(){var s=load(taskId),all=itemIds(taskId),r=pending(taskId).length,p=percent(taskId);return '<section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe '+taskNo()+'</span><h1>'+esc(task.title)+'</h1><p>'+esc(task.icon||'✅')+' '+esc(task.description||'')+'</p></div><div class="l8-progress-row"><span>'+s.done.length+' von '+all.length+' fertig'+(r?' · '+r+' Wiederholung'+(r===1?'':'en'):'')+'</span><strong>'+p+'%</strong></div><div class="l8-progress"><div style="width:'+p+'%"></div></div></section>';}
function shell(){root.innerHTML='<div class="l8-wrap">'+(preview()?'<div class="sp-teacher-preview-note">Lehrer-Vorschau: Teilnehmerfortschritt wird nicht gespeichert.</div>':'')+head()+'<section class="l8-card l8-exercise"><div id="taskArea"></div></section><footer>© SprachPilot</footer></div>';}
function area(){return document.getElementById('taskArea');}
function showFeedback(type,text){var el=document.getElementById('feedback');if(el)el.innerHTML='<div class="l8-feedback '+type+'">'+text+'</div>';}
function help(solution,n,hint){if(n===1)return '<div class="l8-feedback bad">Noch nicht richtig. Korrigiere deine Antwort.</div>';if(n===2)return '<div class="l8-feedback warn"><strong>Hinweis:</strong> '+esc(hint||'Lies noch einmal genau.')+'</div>';return '<div class="l8-feedback warn"><strong>Lösung:</strong> '+esc(solution)+'<br>Gib die richtige Antwort jetzt selbst ein.</div>';}
function setHelp(solution,n,hint){var el=document.getElementById('feedback');if(el)el.innerHTML=help(solution,n,hint);}
function refreshHead(){var h=document.querySelector('.l8-task-head');if(h)h.outerHTML=head();}
function scrollTask(){setTimeout(function(){try{if(window.SPTaskAutoScroll&&window.SPTaskAutoScroll.schedule)window.SPTaskAutoScroll.schedule(0,'render');else document.querySelector('.l8-exercise').scrollIntoView({block:'start'});}catch(e){}},30);}
function nextTask(){var i=D.tasks.findIndex(function(x){return x.id===taskId;});return i>=0?D.tasks[i+1]:null;}
function finish(){var n=nextTask();root.innerHTML='<div class="l8-wrap">'+head()+'<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><p>Du hast diese Aufgabe abgeschlossen.</p><div class="l8-row l8-center-actions"><a class="l8-btn" href="index.html">Zur Übersicht</a>'+(n?'<a class="l8-btn primary" href="task.html?task='+encodeURIComponent(n.id)+'&v=20260908-t3content2">Weiter</a>':'')+'</div></section></div>';}
function advance(draw,delay){setTimeout(function(){if(percent(taskId)>=100)finish();else{refreshHead();safeDraw(draw);scrollTask();}},delay==null?350:delay);}
function image(src,alt,cls){if(!src)return '';return '<div class="'+esc(cls||'l9x-main-image')+'"><img src="'+esc(src)+'" alt="'+esc(alt||'Bild')+'" loading="eager" decoding="async" onerror="this.style.visibility=\'hidden\'"></div>';}
function speak(text){try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.84;speechSynthesis.speak(u);}catch(e){}}
function play(src,text){if(!src){speak(text);return;}try{var a=new Audio(src);a.preload='none';a.onerror=function(){speak(text);};var p=a.play();if(p&&p.catch)p.catch(function(){speak(text);});}catch(e){speak(text);}}
function cardBy(id){return (D.cards||[]).find(function(x){return x.id===id;});}
function nounBy(id){return nouns.find(function(x){return x.id===id;});}
function current(list){var id=firstOpen();return (list||[]).find(function(x){return x.id===id;});}
function distract(pool,target,n){return shuffle((pool||[]).filter(function(x){return x.id!==target.id;})).slice(0,n||3);}
function checkInput(id,value,answer,alternatives,draw,hint){if(!String(value||'').trim())return;var possible=[answer].concat(alternatives||[]).filter(Boolean),ok=possible.some(function(x){return norm(x)===norm(value);});if(ok){var s=load(taskId),reviewed=s.done.indexOf(id)>=0&&s.review[id];correct(id);showFeedback('good',reviewed?'Richtig! Wiederholung erledigt.':'Richtig!');advance(draw);}else setHelp(answer,wrong(id),hint);}

function drawCards(){var id=firstOpen();if(!id)return finish();var c=cardBy(id);if(!c){correct(id);return drawCards();}var s=load(taskId),shown=!!(s.answers[id]&&s.answers[id].shown);area().innerHTML='<div class="l9x-card-stage"><div class="l9x-flash">'+image(c.image,label(c))+(shown?'<div class="l9x-flash-word">'+esc(label(c))+'</div><div class="l9x-card-details">'+(c.plural?'<div class="l9x-detail"><strong>Plural:</strong> '+esc(c.plural)+'</div>':'')+(c.perfect?'<div class="l9x-detail"><strong>Perfekt:</strong> '+esc(c.perfect)+'</div>':'')+(c.example?'<div class="l9x-detail">'+esc(c.example)+'</div>':'')+'</div>':'<div class="l8-small">Wie heißt das auf Deutsch?</div>')+'<div class="l8-row l8-center-actions"><button class="l8-btn" id="listen" type="button">🔊 Anhören</button>'+(shown?'<button class="l8-btn primary" id="next" type="button">Weiter</button>':'<button class="l8-btn primary" id="show" type="button">Lösung zeigen</button>')+'</div></div><div class="l9x-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div><div id="feedback"></div></div>';
 document.getElementById('listen').onclick=function(){play(c.audio,label(c));};var input=document.getElementById('answer');document.getElementById('check').onclick=function(){checkInput(id,input.value,label(c),[],drawCards,c.meaning||c.example);};input.onkeydown=function(e){if(e.key==='Enter')document.getElementById('check').click();};if(shown)document.getElementById('next').onclick=function(){correct(id);safeDraw(drawCards);scrollTask();};else document.getElementById('show').onclick=function(){var st=load(taskId);st.answers[id]={shown:true};st.review[id]=true;st.wrong[id]=(Number(st.wrong[id])||0)+1;save(taskId,st,true);safeDraw(drawCards);};}
function drawWordImage(){var id=firstOpen();if(!id)return finish();var target=cardBy(id);if(!target){correct(id);return drawWordImage();}var opts=shuffle([target].concat(distract(D.cards,target,3)));area().innerHTML='<div class="l9x-big">'+esc(label(target))+'</div><div class="l9x-image-grid">'+opts.map(function(x){return '<button class="l9x-image-choice" data-choice="'+esc(x.id)+'" type="button">'+image(x.image,label(x),'')+'</button>';}).join('')+'</div><div id="feedback"></div>';area().querySelectorAll('[data-choice]').forEach(function(b){b.onclick=function(){if(b.dataset.choice===id){correct(id);showFeedback('good','Richtig!');advance(drawWordImage);}else setHelp(label(target),wrong(id),target.meaning);};});}
function drawAudioWrite(){var id=firstOpen();if(!id)return finish();var c=cardBy(id);if(!c){correct(id);return drawAudioWrite();}area().innerHTML='<div class="l9x-center"><button class="l8-btn primary l9x-audio-big" id="listen" type="button">🔊 Wort anhören</button></div><div class="l9x-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Wort schreiben"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div><div id="feedback"></div>';document.getElementById('listen').onclick=function(){play(c.audio,label(c));};var input=document.getElementById('answer');document.getElementById('check').onclick=function(){checkInput(id,input.value,label(c),[],drawAudioWrite,c.meaning);};input.onkeydown=function(e){if(e.key==='Enter')document.getElementById('check').click();};}
function drawMeaning(){var id=firstOpen();if(!id)return finish();var target=cardBy(id);if(!target){correct(id);return drawMeaning();}var pool=(D.cards||[]).filter(function(x){return x.meaning;}),opts=shuffle([target].concat(distract(pool,target,3)));area().innerHTML='<div class="l9x-big">'+esc(label(target))+'</div><div class="l9x-option-grid">'+opts.map(function(x){return '<button class="l8-option" data-choice="'+esc(x.id)+'" type="button">'+esc(x.meaning)+'</button>';}).join('')+'</div><div id="feedback"></div>';area().querySelectorAll('[data-choice]').forEach(function(b){b.onclick=function(){if(b.dataset.choice===id){correct(id);showFeedback('good','Richtig!');advance(drawMeaning);}else setHelp(target.meaning,wrong(id),target.example);};});}
function drawArticle(){var id=firstOpen();if(!id)return finish();var n=nounBy(id);if(!n){correct(id);return drawArticle();}area().innerHTML=image(n.image,label(n))+'<div class="l9x-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Artikel + Wort"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div><div id="feedback"></div>';var input=document.getElementById('answer');document.getElementById('check').onclick=function(){checkInput(id,input.value,label(n),[],drawArticle,'Schreibe den bestimmten Artikel und das Nomen.');};input.onkeydown=function(e){if(e.key==='Enter')document.getElementById('check').click();};}
function pluralAnswer(n){return /^kein plural$/i.test(n.plural||'')?'kein Plural':String(n.plural||'').replace(/^die\s+/i,'');}
function drawPlural(){var id=firstOpen();if(!id)return finish();var n=nounBy(id);if(!n){correct(id);return drawPlural();}var ans=pluralAnswer(n);area().innerHTML='<div class="l9x-big">'+esc(label(n))+'</div><div class="l9x-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Pluralform"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div><div id="feedback"></div>';var input=document.getElementById('answer');document.getElementById('check').onclick=function(){checkInput(id,input.value,ans,[],drawPlural,'Achte auf Umlaut und Endung.');};input.onkeydown=function(e){if(e.key==='Enter')document.getElementById('check').click();};}
function drawConjugation(){var s=load(taskId),rows=D.forms||[];area().innerHTML='<div class="l9x-table-wrap"><table class="l9x-table"><thead><tr><th>Pronomen</th><th>dürfen</th></tr></thead><tbody>'+rows.map(function(r){var active=s.done.indexOf(r.id)<0||s.review[r.id];return '<tr><td><strong>'+esc(r.pronoun)+'</strong></td><td><input class="l8-input" data-form="'+esc(r.id)+'" value="'+esc(s.answers[r.id]||'')+'" '+(active?'':'disabled')+'><div id="fb-'+esc(r.id)+'"></div></td></tr>';}).join('')+'</tbody></table></div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="checkAll" type="button">Tabelle prüfen</button></div>';area().querySelectorAll('[data-form]').forEach(function(input){input.oninput=function(){remember(input.dataset.form,input.value);};});document.getElementById('checkAll').onclick=function(){rows.forEach(function(r){var st=load(taskId),active=st.done.indexOf(r.id)<0||st.review[r.id];if(!active)return;var input=area().querySelector('[data-form="'+r.id+'"]'),fb=document.getElementById('fb-'+r.id);if(norm(input.value)===norm(r.answer)){correct(r.id);fb.innerHTML='<div class="l8-feedback good">Richtig!</div>';}else fb.innerHTML=help(r.answer,wrong(r.id),'Vergleiche Pronomen und Verbform.');});refreshHead();if(percent(taskId)>=100)setTimeout(finish,400);else setTimeout(function(){safeDraw(drawConjugation);},450);};}
function drawGap(){var item=current(D.gaps);if(!item)return finish();area().innerHTML=image(item.image,'Bild')+'<div class="l9x-big">'+esc(item.left)+' <input class="l8-input" id="modal" style="width:130px;display:inline-block"> '+esc(item.middle)+' <input class="l8-input" id="verb" style="width:150px;display:inline-block">.</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div><div id="feedback"></div>';document.getElementById('check').onclick=function(){var a=document.getElementById('modal').value,b=document.getElementById('verb').value;if(norm(a)===norm(item.modal)&&norm(b)===norm(item.verb)){correct(item.id);showFeedback('good','Richtig!');advance(drawGap);}else setHelp(item.modal+' / '+item.verb,wrong(item.id),item.hint);};}
function drawBuilder(){var item=current(D.builders);if(!item)return finish();area().innerHTML='<div class="l9x-builder">'+shuffle(item.chunks).map(function(x){return '<span class="l9x-chip">'+esc(x)+'</span>';}).join('')+'</div><div class="l9x-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Satz schreiben"><button class="l8-btn primary" id="check" type="button">Prüfen</button></div><div id="feedback"></div>';var input=document.getElementById('answer');document.getElementById('check').onclick=function(){checkInput(item.id,input.value,item.answer,[],drawBuilder,'Achte auf Position 2 und den Infinitiv am Ende.');};input.onkeydown=function(e){if(e.key==='Enter')document.getElementById('check').click();};}
function modalOptions(answer){var sets=[['kann','will','möchte','mag','muss','darf'],['kannst','willst','möchtest','magst','musst','darfst'],['könnt','wollt','möchtet','mögt','müsst','dürft'],['können','wollen','möchten','mögen','müssen','dürfen']];for(var i=0;i<sets.length;i++)if(sets[i].indexOf(answer)>=0)return sets[i];return Array.from(new Set((D.modalItems||[]).map(function(x){return x.answer;})));}
function drawModal(){var item=current(D.modalItems);if(!item)return finish();area().innerHTML='<div class="l9x-question">'+esc(item.prompt)+'</div><div class="l9x-option-grid">'+shuffle(modalOptions(item.answer)).map(function(x){return '<button class="l8-option" data-value="'+esc(x)+'" type="button">'+esc(x)+'</button>';}).join('')+'</div><div id="feedback"></div>';area().querySelectorAll('[data-value]').forEach(function(b){b.onclick=function(){if(norm(b.dataset.value)===norm(item.answer)){correct(item.id);showFeedback('good','Richtig!');advance(drawModal);}else setHelp(item.answer,wrong(item.id),item.hint);};});}
function drawDialog(){var item=D.dialogModal;if(!item)return finish();var s=load(taskId),saved=s.answers[item.id]||{};area().innerHTML='<div class="l9x-dialog"><h3>'+esc(item.title)+'</h3>'+item.lines.map(function(l,i){var parts=l.text.split('___');return '<div class="l9x-modal-dialog-row"><strong>'+esc(l.speaker)+'</strong><div>'+esc(parts[0])+'<select class="l9x-select" data-line="'+i+'"><option value="">—</option>'+shuffle(l.options).map(function(o){return '<option value="'+esc(o)+'" '+(saved[i]===o?'selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>'+esc(parts[1]||'')+'</div></div>';}).join('')+'</div><div class="l8-row l8-center-actions"><button class="l8-btn primary" id="check" type="button">Dialog prüfen</button></div><div id="feedback"></div>';area().querySelectorAll('[data-line]').forEach(function(sel){sel.onchange=function(){var st=load(taskId),v=st.answers[item.id]||{};v[sel.dataset.line]=sel.value;st.answers[item.id]=v;save(taskId,st,false);};});document.getElementById('check').onclick=function(){var v=load(taskId).answers[item.id]||{},ok=item.lines.every(function(l,i){return norm(v[i])===norm(l.answer);});if(ok){correct(item.id);showFeedback('good','Richtig!');advance(drawDialog);}else setHelp('Korrigiere die Modalverben.',wrong(item.id),'Achte auf notwendig, erlaubt, Plan oder Möglichkeit.');};}
function findReading(id){var readings=D.readings||[];for(var i=0;i<readings.length;i++){var q=(readings[i].questions||[]).find(function(x){return x.id===id;});if(q)return {reading:readings[i],question:q};}return null;}
function drawReading(){var id=firstOpen();if(!id)return finish();var ctx=findReading(id);if(!ctx){correct(id);return drawReading();}var r=ctx.reading,q=ctx.question;area().innerHTML='<div class="l9x-reading"><h3>'+esc(r.title)+'</h3><div class="l9x-reading-text">'+esc(r.text)+'</div><div class="l9x-question">'+esc(q.prompt)+'</div><div class="l9x-option-grid">'+shuffle(q.options).map(function(x){return '<button class="l8-option" data-value="'+esc(x)+'" type="button">'+esc(x)+'</button>';}).join('')+'</div><div id="feedback"></div></div>';area().querySelectorAll('[data-value]').forEach(function(b){b.onclick=function(){if(b.dataset.value===q.answer){correct(q.id);showFeedback('good','Richtig!');advance(drawReading);}else setHelp(q.answer,wrong(q.id),'Suche die Information im Text.');};});}
function allPracticeDone(){return D.tasks.filter(function(x){return !x.exam;}).every(function(x){return percent(x.id)>=100;});}
function examData(){var ns=nouns,cs=D.cards||[],g=D.gaps||[],b=D.builders||[],m=D.modalItems||[];return [
 {type:'input',prompt:'Artikel + Wort zum Bild',image:ns[0]&&ns[0].image,answer:label(ns[0])},
 {type:'input',prompt:'Plural: '+label(ns[1]),answer:ns[1]?pluralAnswer(ns[1]):''},
 {type:'input',prompt:'dürfen: du ___',answer:'darfst'},
 {type:'input',prompt:'dürfen: ihr ___',answer:'dürft'},
 {type:'input',prompt:'Bilde den Satz: '+((b[2]&&b[2].chunks)||[]).join(' / '),answer:b[2]&&b[2].answer},
 {type:'input',prompt:'Bilde den Satz: '+((b[8]&&b[8].chunks)||[]).join(' / '),answer:b[8]&&b[8].answer},
 {type:'input',prompt:(g[0]?g[0].left:'')+' ___ '+(g[0]?g[0].middle:'')+' ___.',answer:g[0]?g[0].modal+' / '+g[0].verb:''},
 {type:'choice',prompt:m[1]&&m[1].prompt,answer:m[1]&&m[1].answer,options:m[1]?modalOptions(m[1].answer):[]},
 {type:'audio',prompt:'Höre und schreibe das Wort.',audio:cs[5]&&cs[5].audio,spoken:label(cs[5]),answer:label(cs[5])},
 {type:'input',prompt:cs[8]&&cs[8].meaning,answer:label(cs[8])},
 {type:'choice',prompt:'Darf man in der Bibliothek rauchen?',answer:'Nein',options:['Ja','Nein']},
 {type:'input',prompt:'Bilde den Satz: '+((b[15]&&b[15].chunks)||[]).join(' / '),answer:b[15]&&b[15].answer}
 ];}
function drawExam(){if(!preview()&&!allPracticeDone()){location.href='index.html';return;}var id=firstOpen();if(!id)return finish();var index=Number(id.replace('exam',''))-1,item=examData()[index];if(!item)return finish();var body='';if(item.type==='choice')body='<div class="l9x-question">'+esc(item.prompt)+'</div><div class="l9x-option-grid">'+shuffle(item.options).map(function(x){return '<button class="l8-option" data-exam="'+esc(x)+'" type="button">'+esc(x)+'</button>';}).join('')+'</div>';else body=(item.image?image(item.image,'Prüfungsbild'):'')+'<div class="l9x-question">'+esc(item.prompt||'')+'</div>'+(item.type==='audio'?'<div class="l8-row l8-center-actions"><button class="l8-btn" id="examListen" type="button">🔊 Anhören</button></div>':'')+'<div class="l9x-answer-row"><input class="l8-input" id="answer" autocomplete="off" placeholder="Antwort"><button class="l8-btn primary" id="checkExam" type="button">Prüfen</button></div>';area().innerHTML='<div class="l9x-exam-note">Prüfungsfrage '+(index+1)+' von 12</div>'+body+'<div id="feedback"></div>';if(document.getElementById('examListen'))document.getElementById('examListen').onclick=function(){play(item.audio,item.spoken);};function judge(v){if(norm(v)===norm(item.answer)){correct(id);showFeedback('good','Richtig!');advance(drawExam);}else setHelp(item.answer,wrong(id),'Prüfe deine Antwort noch einmal.');}area().querySelectorAll('[data-exam]').forEach(function(b){b.onclick=function(){judge(b.dataset.exam);};});if(document.getElementById('checkExam'))document.getElementById('checkExam').onclick=function(){judge(document.getElementById('answer').value);};}

function draw(){switch(task.kind){case 'cards':drawCards();break;case 'word-image':drawWordImage();break;case 'audio-write':drawAudioWrite();break;case 'meaning-choice':drawMeaning();break;case 'article-word':drawArticle();break;case 'plural-write':drawPlural();break;case 'conjugation-table':drawConjugation();break;case 'gap-two':drawGap();break;case 'build-sentence':drawBuilder();break;case 'modal-choice':drawModal();break;case 'dialog-modal':drawDialog();break;case 'reading-rules':drawReading();break;case 'exam':drawExam();break;default:throw new Error('Unbekannter Aufgabentyp: '+task.kind);}}
function safeDraw(fn){try{(fn||draw)();}catch(error){console.error('L9T3 task render failed',error);var a=area()||root;a.innerHTML='<div class="l8-feedback bad"><strong>Die Aufgabe konnte nicht dargestellt werden.</strong><br>'+esc(error&&error.message||String(error))+'<br><button class="l8-btn" type="button" id="retryTask">Neu laden</button></div>';var b=document.getElementById('retryTask');if(b)b.onclick=function(){location.reload();};}}

try{shell();safeDraw();scrollTask();}catch(error){console.error('L9T3 startup failed',error);root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Aufgabe konnte nicht geladen werden.</h2><p>'+esc(error&&error.message||String(error))+'</p><button class="l8-btn primary" type="button" onclick="location.reload()">Neu laden</button></section></div>';}
})();
