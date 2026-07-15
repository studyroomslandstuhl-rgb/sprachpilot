(function(){
  'use strict';

  var VERSION='20260715-pattern-1';
  var PACKAGE_SIZE=20;
  var TASK_POINTS=[5,10,15];
  var EXAM_POINTS=[100,200,300];
  var BUNNY='https://sprachpilot.b-cdn.net/verben-A1/bilder/';
  var TASKS=[
    ['karteikarten','Karteikarten'],
    ['bild-verb','Bild -> Verb'],
    ['verb-bild','Verb -> Bild'],
    ['hoeren-schreiben','Hoeren -> Schreiben'],
    ['schreiben','Schreiben'],
    ['satz-bauen','Saetze bauen'],
    ['konjugieren','Konjugieren']
  ];
  var TASK_IDS=TASKS.map(function(t){return t[0];});
  var FALLBACK='lieben,kaufen,verstehen,brauchen,hoeren,lernen,wohnen,bringen,sein,schreiben,fotografieren,telefonieren,kochen,leben,kommen,buchstabieren,gehen,schwimmen,suchen,bestellen,weinen,reparieren,gewinnen,spielen,springen,verlieren,fragen,verkaufen,unterschreiben,reservieren,buchen,machen,malen,trinken,schicken,denken,winken,hassen,beissen,giessen,heissen,essen,lesen,sehen,sprechen,nehmen,geben,helfen,treffen,fahren,laufen,schlafen,aufstehen,anfangen,anrufen,einkaufen,fernsehen,sich vorstellen,sich kaemmen,sich rasieren,sich schminken,koennen,muessen,duerfen,wollen,sollen,moegen'.split(',');
  var MODALS=['koennen','können','muessen','müssen','duerfen','dürfen','wollen','sollen','moegen','mögen'];
  var IRREGULAR=['sein','haben','werden','wissen','tun','geben','nehmen','essen','sprechen','lesen','sehen','fahren','laufen','schlafen','helfen','treffen','tragen','waschen','fallen','fangen','halten','lassen','bringen','denken','kennen','nennen'];
  var PREFIXES=['ab','an','auf','aus','ein','mit','nach','vor','weg','zu','zurueck','zurück','fern'];
  var SPECIAL_IMAGES={'sich vorstellen':'sich_vorstellen.webp','sich kaemmen':'sich_kaemmen.webp','sich kämmen':'sich_kaemmen.webp','sich rasieren':'sich_rasieren.webp','sich schminken':'sich_schminken.webp','koennen':'koennen.webp','können':'koennen.webp','muessen':'muessen.webp','müssen':'muessen.webp','duerfen':'duerfen.webp','dürfen':'duerfen.webp'};
  var SPECIAL_ICH={sein:'bin',haben:'habe',werden:'werde',wissen:'weiss',koennen:'kann','können':'kann',muessen:'muss','müssen':'muss',duerfen:'darf','dürfen':'darf',wollen:'will',sollen:'soll',moegen:'mag','mögen':'mag',sehen:'sehe',lesen:'lese',sprechen:'spreche',essen:'esse',nehmen:'nehme',geben:'gebe',helfen:'helfe',treffen:'treffe',fahren:'fahre',laufen:'laufe',schlafen:'schlafe','aufstehen':'stehe auf','anfangen':'fange an','anrufen':'rufe an','einkaufen':'kaufe ein','fernsehen':'sehe fern','sich vorstellen':'stelle mich vor','sich kaemmen':'kaemme mich','sich kämmen':'kämme mich','sich rasieren':'rasiere mich','sich schminken':'schminke mich'};

  var app=document.getElementById('app');
  var topbar=document.getElementById('topbar');
  var catalog=[];
  var byVerb={};
  var state=null;
  var view='home';
  var params={};
  var query='';
  var filter='all';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function norm(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:"'`´]/g,'').replace(/\s+/g,' ');}
  function slug(v){return norm(v).replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');}
  function uniq(a){var seen={},out=[];(a||[]).forEach(function(v){v=String(v||'').trim();if(v&&!seen[v]){seen[v]=1;out.push(v);}});return out;}
  function shuffle(a){a=(a||[]).slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f;}catch(e){return f;}}
  function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function profile(){return read('SP_USER_PROFILE',null)||read('SP_STUDENT_PROFILE',null)||{vorname:'Test',nachname:'Schueler',kurs:'test',muttersprache:'Englisch',email:'test@sprachpilot.local'};}
  function key(){var p=profile();return 'SP_VERBEN_TEST_PATTERN_'+slug((p.email||p.vorname||'test')+'_'+(p.kurs||p.courseCode||'test'));}
  function trans(v){var p=profile(),lang=p.muttersprache||'Englisch',d=(typeof VERB_TRANSLATIONS!=='undefined'?VERB_TRANSLATIONS:{});return d[lang]&&d[lang][v]||d.Englisch&&d.Englisch[v]||'';}
  function sentence(v){var d=(typeof VERB_SENTENCES!=='undefined'?VERB_SENTENCES:{});return d[v]||('Ich '+ich(v)+'.');}
  function ich(v){if(SPECIAL_ICH[v])return SPECIAL_ICH[v];if(/eln$/.test(v))return v.slice(0,-3)+'le';if(/ern$/.test(v))return v.slice(0,-3)+'ere';if(/en$/.test(v))return v.slice(0,-2)+'e';return v;}
  function imageName(v){return SPECIAL_IMAGES[v]||SPECIAL_IMAGES[norm(v)]||(slug(v)+'.webp');}
  function img(v){return BUNNY+encodeURIComponent(imageName(v));}
  function answerEq(a,b){return norm(a)===norm(b);}
  function isModal(v){return MODALS.map(norm).indexOf(norm(v))>=0;}
  function isIrregular(v){return IRREGULAR.map(norm).indexOf(norm(v))>=0||isModal(v);}
  function tags(v){var low=norm(v),out=[];if(low.indexOf('sich ')==0)out.push('reflexive');if(isModal(v))out.push('modal');if(isIrregular(v))out.push('irregular');if(PREFIXES.some(function(p){return low.indexOf(p)===0&&low.length>p.length+3;}))out.push('separable');if(!out.length)out.push('regular');return out;}

  function buildCatalog(){
    var raw=(typeof ALL_VERBS!=='undefined'&&Array.isArray(ALL_VERBS))?ALL_VERBS:[];
    var names=raw.map(function(x){return x&&x.v||x&&x.verb||x;});
    if(!names.length)names=FALLBACK;
    catalog=uniq(names).map(function(v){var item={verb:v,translation:trans(v),sentence:sentence(v),ich:ich(v),image:img(v),tags:tags(v)};byVerb[v]=item;return item;});
  }
  function blankTaskState(){var o={};TASK_IDS.forEach(function(id){o[id]={total:0,done:[],queue:[],current:null,tries:0,hadWrong:false,pointsGiven:false};});return o;}
  function defaultState(){return {version:VERSION,learned:[],learnList:[],points:0,package:null,lastComplete:null};}
  function normalizePackage(p){
    if(!p)return null;
    p.verbs=uniq(p.verbs||[]).filter(function(v){return byVerb[v];}).slice(0,PACKAGE_SIZE);
    p.round=Math.max(1,Math.min(3,Number(p.round||1)));
    p.tasks=p.tasks&&typeof p.tasks==='object'?p.tasks:blankTaskState();
    TASK_IDS.forEach(function(id){p.tasks[id]=normalizeTask(p.tasks[id],p.verbs.length);});
    p.exam=p.exam&&typeof p.exam==='object'?p.exam:{best:0,pointsGiven:false,run:null};
    p.exam.best=Number(p.exam.best||0);
    p.points=Number(p.points||0);
    return p.verbs.length?p:null;
  }
  function normalizeTask(st,total){
    st=st&&typeof st==='object'?st:{};
    var done=uniq(st.done||[]).filter(function(v){return byVerb[v];});
    var current=st.current&&byVerb[st.current]&&done.indexOf(st.current)<0?st.current:null;
    var queue=uniq(st.queue||[]).filter(function(v){return byVerb[v]&&done.indexOf(v)<0&&v!==current;});
    return {total:total,done:done,queue:queue,current:current,tries:Number(st.tries||0),hadWrong:!!st.hadWrong,pointsGiven:!!st.pointsGiven};
  }
  function loadState(){state=read(key(),null)||defaultState();if(!state||state.version!==VERSION)state=defaultState();state.learned=uniq(state.learned);state.learnList=uniq(state.learnList);state.points=Number(state.points||0);state.package=normalizePackage(state.package);save();}
  function save(){write(key(),state);}
  function header(){
    var p=profile();
    var name=[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||p.email||'Teilnehmer';
    var kurs=p.kurs||p.kursnummer||p.courseCode||'test';
    topbar.innerHTML='<div class="topbar-main"><a class="brand" href="/index.html"><img src="/assets/logo/sprachpilot-logo.png" alt=""><div><h1>SprachPilot</h1><div class="subtitle">Verben Test</div></div></a><div class="account"><span class="pill">'+esc(name)+' · '+esc(kurs)+'</span><a class="btn secondary" href="/student-dashboard/index.html">Dashboard</a><a class="btn secondary" href="/profile/index.html">Profil</a></div></div><nav class="nav"><button class="secondary" data-go="home">← Zurueck</button><button class="secondary" data-go="overview">Aufgabenuebersicht</button><button class="danger" data-action="reset">Fortschritte loeschen</button></nav>';
  }

  function learnedMap(){var m={};state.learned.forEach(function(v){m[v]=1;});return m;}
  function activeMap(){var m={};if(state.package)state.package.verbs.forEach(function(v){m[v]=1;});return m;}
  function openVerbs(){var l=learnedMap(),a=activeMap();return catalog.map(function(x){return x.verb;}).filter(function(v){return !l[v]&&!a[v];});}
  function taskTitle(id){var t=TASKS.find(function(x){return x[0]===id;});return t?t[1]:id;}
  function pointForTask(){return TASK_POINTS[(state.package.round||1)-1]||0;}
  function pointForExam(){return EXAM_POINTS[(state.package.round||1)-1]||0;}
  function taskState(id){return state.package.tasks[id];}
  function taskPercent(id){var p=state.package;if(!p)return 0;var st=taskState(id),total=p.verbs.length||1;return Math.round((st.done.length*100)/total)||0;}
  function allTasksDone(){return !!state.package&&TASK_IDS.every(function(id){return taskPercent(id)>=100;});}
  function packageComplete(){return allTasksDone()&&state.package.exam.best>=100;}
  function taskProgress(id){var st=taskState(id),total=state.package.verbs.length,p=taskPercent(id);return '<div class="small">'+st.done.length+' richtig · '+(total-st.done.length)+' uebrig · '+p+'%</div><div class="progress"><div class="bar" style="width:'+p+'%"></div></div>';}
  function help3(tries,tip1,tip2,solution){if(tries===1)return '<div class="no">Noch nicht richtig.</div><div class="hint">'+esc(tip1)+'</div>';if(tries===2)return '<div class="no">Noch nicht richtig.</div><div class="hint">'+esc(tip2)+'</div>';return '<div class="no">Loesung: '+esc(solution)+'</div>';}

  function nextVerb(id){
    var st=taskState(id),verbs=state.package.verbs;
    if(st.current&&st.done.indexOf(st.current)<0)return st.current;
    if(!st.queue.length){
      st.queue=shuffle(verbs.filter(function(v){return st.done.indexOf(v)<0;}));
    }
    st.current=st.queue.shift()||null;
    st.tries=0;
    st.hadWrong=false;
    save();
    return st.current;
  }
  function markWrong(id){var st=taskState(id);st.tries++;st.hadWrong=true;save();return st.tries;}
  function markRight(id){
    var st=taskState(id),v=st.current;
    if(!v)return;
    if(st.hadWrong||st.tries>0){if(st.done.indexOf(v)<0&&st.queue.indexOf(v)<0)st.queue.push(v);}else if(st.done.indexOf(v)<0){st.done.push(v);}
    st.current=null;
    st.tries=0;
    st.hadWrong=false;
    if(taskPercent(id)>=100&&!st.pointsGiven){st.pointsGiven=true;state.package.points+=pointForTask();state.points+=pointForTask();}
    save();
  }

  function go(v,p){view=v||'home';params=p||{};render();}
  function render(){header();if(view==='choose')return renderChoose();if(view==='assess')return renderAssess();if(view==='overview')return renderOverview();if(view==='task')return renderTask(params.id);if(view==='exam')return renderExam();renderHome();}
  function renderHome(){var p=state.package;app.innerHTML='<section class="card hero"><h2>Was moechtest du machen?</h2><div class="actions"><button '+(p?'':'disabled')+' data-go="overview">Ueben</button><button data-go="assess">Verben einschaetzen</button><button data-go="choose">Verben waehlen</button></div><p class="notice">'+(p?'Aktuelles Paket: '+p.verbs.length+' Verben · Runde '+p.round:'Bitte zuerst Verben waehlen oder einschaetzen.')+'</p></section><section class="card"><div class="stats"><div class="stat"><b>'+catalog.length+'</b>moegliche Verben</div><div class="stat"><b>'+state.learned.length+'</b>gelernt</div><div class="stat"><b>'+(p?p.verbs.length:0)+'</b>im Paket</div><div class="stat"><b>'+state.points+'</b>Punkte</div></div></section>'+(state.lastComplete?'<section class="card finish"><h2>Gratulation!</h2><p>'+esc(state.lastComplete)+'</p><div class="actions"><button data-go="choose">Neue Verben waehlen</button><button class="secondary" data-go="assess">Verben einschaetzen</button></div></section>':'');}
  function renderChoose(){
    var verbs=state.learnList.concat(openVerbs().filter(function(v){return state.learnList.indexOf(v)<0;}));
    verbs=uniq(verbs).filter(function(v){var b=byVerb[v]||{},text=norm(v+' '+(b.translation||''));return (!query||text.indexOf(norm(query))>=0)&&(filter==='all'||b.tags.indexOf(filter)>=0);});
    var rows=verbs.slice(0,80).map(function(v){var b=byVerb[v]||{};return '<label class="verb-row" data-types="'+b.tags.join(', ')+'"><input type="checkbox" data-verb="'+esc(v)+'" '+(state.learnList.indexOf(v)>=0?'checked':'')+'><span><b>'+esc(v)+'</b><span class="translation">'+esc(b.translation||'')+'</span></span></label>';}).join('');
    app.innerHTML='<section class="card"><h2>Verben waehlen</h2><input class="search" data-search value="'+esc(query)+'" placeholder="Verb suchen"><div class="verb-filter-bar"><div class="filter-buttons">'+['all','regular','irregular','modal','separable','reflexive'].map(function(f){var label={all:'Alle',regular:'Regulaer',irregular:'Irregulaer',modal:'Modal',separable:'Trennbar',reflexive:'Reflexiv'}[f];return '<button class="filter-chip '+(filter===f?'active':'')+'" data-filter="'+f+'">'+label+'</button>';}).join('')+'</div><div class="choice-count">'+verbs.length+' gefunden</div></div><div class="actions"><button class="secondary" data-action="select-visible">Erste 20 auswaehlen</button><button class="secondary" data-action="clear-choice">Auswahl loeschen</button><button data-action="start-choice">Auswahl starten</button></div><div class="verb-list">'+(rows||'<p class="small">Keine Verben gefunden.</p>')+'</div></section>';
  }
  function renderAssess(){
    var taken={};state.learned.concat(state.learnList,state.package?state.package.verbs:[]).forEach(function(v){taken[v]=1;});
    var v=catalog.map(function(x){return x.verb;}).find(function(x){return !taken[x];});
    if(!v){go('choose');return;}
    var b=byVerb[v];
    app.innerHTML='<section class="card assessment">'+imgHtml(v)+'<div><h2>Verben einschaetzen</h2><div class="question">'+esc(v)+'</div><p>'+esc(b.translation||'')+'</p><div class="actions"><button data-assess="learn" data-verb="'+esc(v)+'">Lernen</button><button class="secondary" data-assess="known" data-verb="'+esc(v)+'">Kann ich schon</button><button class="secondary" data-go="home">Spaeter</button></div></div></section>';
  }
  function startPackage(list){
    list=uniq(list).filter(function(v){return byVerb[v]&&!learnedMap()[v];}).slice(0,PACKAGE_SIZE);
    if(!list.length){alert('Bitte mindestens ein Verb auswaehlen.');return;}
    state.package={verbs:list,round:1,tasks:blankTaskState(),exam:{best:0,pointsGiven:false,run:null},points:0};
    state.package=normalizePackage(state.package);
    state.learnList=state.learnList.filter(function(v){return list.indexOf(v)<0;});
    state.lastComplete=null;
    save();go('overview');
  }
  function renderOverview(){
    if(!state.package){go('choose');return;}
    var p=state.package;
    var cards=TASKS.map(function(t,i){var pr=taskPercent(t[0]);return '<button class="module" data-task="'+t[0]+'"><div class="icon">'+(i+1)+'</div><h3>'+(i+1)+'. '+esc(t[1])+'</h3><div class="progress"><div class="bar" style="width:'+pr+'%"></div></div><b>'+pr+'%</b></button>';}).join('');
    var exam='<button class="module '+(allTasksDone()?'':'locked')+'" data-go="exam"><div class="icon">⭐</div><h3>Pruefung</h3><b>'+(allTasksDone()?(p.exam.best||0)+'%':'gesperrt')+'</b></button>';
    app.innerHTML='<section class="card"><div class="task-head"><div><h2>Aufgabenuebersicht</h2><p>'+p.verbs.length+' Verben · Runde '+p.round+' · '+p.points+' Paketpunkte</p></div></div>'+(packageComplete()?'<p class="notice">Paket geschafft. Die Verben sind gelernt und du kannst neue waehlen.</p>':'')+'</section><section class="grid">'+cards+exam+'</section>';
  }

  function imgHtml(v){return '<div class="image-box"><img src="'+esc(img(v))+'" alt="'+esc(v)+'" loading="eager" decoding="async" onerror="this.parentNode.innerHTML=\'Bild fehlt\'"></div>';}
  function choiceHtml(list,asImage){return '<div class="choices">'+list.map(function(v){return '<button class="choice" data-answer="'+esc(v)+'">'+(asImage?'<img src="'+esc(img(v))+'" alt="'+esc(v)+'">':esc(v))+'</button>';}).join('')+'</div>';}
  function instruction(txt){return '<div class="notice"><b>'+esc(txt)+'</b></div>';}
  function taskShell(id,body,feedback){app.innerHTML='<section class="card"><div class="task-head"><div><h2>'+esc(taskTitle(id))+'</h2>'+taskProgress(id)+'</div><button class="secondary" data-go="overview">Aufgabenuebersicht</button></div>'+body+'<div class="feedback">'+(feedback||'')+'</div></section>';}
  function currentVerb(id){var v=nextVerb(id);if(!v){app.innerHTML='<section class="card finish"><h2>Gut gemacht</h2><p>Diese Aufgabe ist abgeschlossen.</p><button data-go="overview">Weiter</button></section>';return null;}return v;}
  function renderTask(id){if(!state.package){go('choose');return;}if(TASK_IDS.indexOf(id)<0){go('overview');return;}if(id==='karteikarten')return renderFlashcards();if(id==='bild-verb')return renderImageToVerb();if(id==='verb-bild')return renderVerbToImage();if(id==='hoeren-schreiben')return renderListenWrite();if(id==='schreiben')return renderWrite();if(id==='satz-bauen')return renderSentenceBuild();if(id==='konjugieren')return renderConjugation();}

  function renderFlashcards(feedback){
    var id='karteikarten',v=currentVerb(id);if(!v)return;var b=byVerb[v];
    var body=taskProgress(id)+instruction('Karte anklicken, drehen, dann sprechen oder schreiben.')+'<div class="flip-wrap"><div class="flip-card" role="button" tabindex="0" aria-label="Karte umdrehen" data-flip-card><div class="flip-face flip-front">'+imgHtml(v)+'</div><div class="flip-face flip-back"><div class="flip-word">'+esc(v)+'</div><div class="flip-note">'+esc(b.translation||'Loesung')+'</div><button type="button" class="btn secondary card-listen-btn" data-speak="'+esc(v)+'">Hoeren</button></div></div></div><div class="actions card-actions"><button data-mic="'+esc(v)+'">Sprechen</button><button class="secondary" data-show-input>Schreiben</button></div><div class="card-answer-box" hidden><input class="answer-input" data-input placeholder="Antwort schreiben"><div class="actions"><button data-check="'+esc(v)+'">Kontrollieren</button></div></div>';
    taskShell(id,body,feedback||'');
  }
  function renderImageToVerb(feedback){
    var id='bild-verb',v=currentVerb(id);if(!v)return;
    var opts=shuffle([v].concat(shuffle(state.package.verbs.filter(function(x){return x!==v;})).slice(0,3)));
    taskShell(id,instruction('Welches Verb passt zum Bild?')+imgHtml(v)+choiceHtml(opts,false),feedback||'');
  }
  function renderVerbToImage(feedback){
    var id='verb-bild',v=currentVerb(id);if(!v)return;
    var opts=shuffle([v].concat(shuffle(state.package.verbs.filter(function(x){return x!==v;})).slice(0,3)));
    taskShell(id,instruction('Welches Bild passt zum Verb?')+'<div class="question">'+esc(v)+'</div>'+choiceHtml(opts,true),feedback||'');
  }
  function renderListenWrite(feedback){
    var id='hoeren-schreiben',v=currentVerb(id);if(!v)return;
    var body=instruction('Hoere das deutsche Verb und schreibe es richtig.')+'<div class="actions"><button class="secondary" data-speak="'+esc(v)+'">Deutsch hoeren</button></div><input class="answer-input" data-input placeholder="Antwort schreiben"><div class="actions"><button data-check="'+esc(v)+'">Kontrollieren</button></div>';
    taskShell(id,body,feedback||'');
  }
  function renderWrite(feedback){
    var id='schreiben',v=currentVerb(id);if(!v)return;var b=byVerb[v];
    var body=instruction('Schreibe das Verb zum Bild.')+imgHtml(v)+'<div class="hint">Uebersetzung: <b>'+esc(b.translation||'')+'</b></div><input class="answer-input" data-input placeholder="Verb schreiben"><div class="actions"><button data-check="'+esc(v)+'">Kontrollieren</button></div>';
    taskShell(id,body,feedback||'');
  }
  function renderSentenceBuild(feedback){
    var id='satz-bauen',v=currentVerb(id);if(!v)return;var b=byVerb[v],parts=shuffle(String(b.sentence||('Ich '+b.ich+'.')).split(/\s+/));
    var body=instruction('Baue den Satz. Klicke die Woerter in der richtigen Reihenfolge.')+'<div class="puzzle-built" data-built></div><div class="puzzle-bank">'+parts.map(function(p){return '<button class="word-chip" data-pick="'+esc(p)+'">'+esc(p)+'</button>';}).join('')+'</div><div class="actions"><button data-sentence-check="'+esc(b.sentence)+'">Kontrollieren</button><button class="secondary" data-task="satz-bauen">Neu</button></div>';
    taskShell(id,body,feedback||'');
  }
  function renderConjugation(feedback){
    var id='konjugieren',v=currentVerb(id);if(!v)return;var b=byVerb[v];
    var body=instruction('Schreibe die Form mit ich.')+'<div class="question">ich + '+esc(v)+'</div><input class="answer-input" data-input placeholder="ich ..."><div class="actions"><button data-check="'+esc(b.ich)+'">Kontrollieren</button></div>';
    taskShell(id,body,feedback||'');
  }

  function wrongFeedback(id,solution){var st=taskState(id),b=byVerb[st.current]||{};var t=markWrong(id);return help3(t,b.translation?'Bedeutung: '+b.translation:'Bitte noch einmal versuchen.',b.sentence?'Beispiel: '+b.sentence:'Achte auf die Schreibweise.',solution);}
  function rightAndNext(id){markRight(id);setTimeout(function(){renderTask(id);},450);}
  function checkAnswer(id,value,solution){if(answerEq(value,solution)){rightAndNext(id);}else{renderTaskWithFeedback(id,wrongFeedback(id,solution));}}
  function renderTaskWithFeedback(id,feedback){if(id==='karteikarten')return renderFlashcards(feedback);if(id==='bild-verb')return renderImageToVerb(feedback);if(id==='verb-bild')return renderVerbToImage(feedback);if(id==='hoeren-schreiben')return renderListenWrite(feedback);if(id==='schreiben')return renderWrite(feedback);if(id==='satz-bauen')return renderSentenceBuild(feedback);if(id==='konjugieren')return renderConjugation(feedback);}

  function renderExam(){
    if(!state.package){go('choose');return;}
    if(!allTasksDone()){app.innerHTML='<section class="card locked-box"><h2>Pruefung gesperrt</h2><p>Bearbeite zuerst alle Aufgaben zu 100%.</p><button data-go="overview">Zurueck</button></section>';return;}
    var p=state.package;
    if(!p.exam.run)p.exam.run={index:0,answers:[],verbs:shuffle(p.verbs)};
    var run=p.exam.run,v=run.verbs[run.index];
    if(!v)return finishExam();
    app.innerHTML='<section class="card"><div class="task-head"><div><h2>⭐ Pruefung</h2><p>Frage '+(run.index+1)+' von '+run.verbs.length+'</p></div><button class="secondary" data-go="overview">Aufgabenuebersicht</button></div>'+imgHtml(v)+'<div class="question">Schreibe das Verb.</div><input class="answer-input" data-input placeholder="Verb schreiben"><div class="actions"><button data-exam-check="'+esc(v)+'">Kontrollieren</button></div><div class="feedback"></div></section>';
    save();
  }
  function finishExam(){
    var p=state.package,run=p.exam.run,right=run.answers.filter(function(a){return a.right;}).length,score=Math.round(right*100/p.verbs.length);
    p.exam.best=Math.max(p.exam.best||0,score);
    if(score>=100&&!p.exam.pointsGiven){p.exam.pointsGiven=true;p.points+=pointForExam();state.points+=pointForExam();}
    var learnedNow=[];
    if(score>=100){learnedNow=p.verbs.slice();state.learned=uniq(state.learned.concat(learnedNow));state.lastComplete=learnedNow.length+' Verben wurden als gelernt gespeichert.';state.package=null;save();app.innerHTML='<section class="card finish"><h2>Gratulation!</h2><p>Pruefung: 100%. Die Verben sind als gelernt gespeichert.</p><div class="actions"><button data-go="choose">Neue Verben waehlen</button><button class="secondary" data-go="assess">Verben einschaetzen</button></div></section>';return;}
    p.exam.run=null;save();app.innerHTML='<section class="card finish"><h2>Pruefung beendet</h2><p>'+score+'% richtig. Die Pruefung kann wiederholt werden.</p><div class="actions"><button data-go="exam">Pruefung wiederholen</button><button class="secondary" data-go="overview">Aufgabenuebersicht</button></div></section>';
  }
  function resetAll(){if(confirm('Fortschritte im Verben Test loeschen?')){state=defaultState();save();go('home');}}
  function startMic(answer){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){var f=document.querySelector('.feedback');if(f)f.innerHTML='<div class="no">Mikrofon wird hier nicht unterstuetzt. Bitte schreibe die Antwort.</div>';var box=document.querySelector('.card-answer-box');if(box)box.hidden=false;return;}
    var rec=new SR();rec.lang='de-DE';rec.interimResults=false;rec.maxAlternatives=1;
    rec.onresult=function(e){var text=e.results[0][0].transcript,input=document.querySelector('[data-input]');if(input)input.value=text;checkAnswer(params.id||'karteikarten',text,answer);};
    rec.onerror=function(){var f=document.querySelector('.feedback');if(f)f.innerHTML='<div class="no">Mikrofon hat nicht funktioniert. Bitte schreibe die Antwort.</div>';};
    rec.start();
  }
  function speak(text){try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.86;speechSynthesis.speak(u);}catch(e){}}

  document.addEventListener('input',function(e){if(e.target&&e.target.matches('[data-search]')){query=e.target.value;clearTimeout(window.__vtSearchTimer);window.__vtSearchTimer=setTimeout(renderChoose,120);}});
  document.addEventListener('keydown',function(e){var card=e.target.closest&&e.target.closest('[data-flip-card]');if(card&&(e.key==='Enter'||e.key===' ')){e.preventDefault();card.classList.add('flipped');markWrong('karteikarten');}});
  document.addEventListener('click',function(e){
    var flip=e.target.closest('[data-flip-card]');
    if(flip&&!e.target.closest('button')){flip.classList.add('flipped');markWrong('karteikarten');return;}
    var t=e.target.closest('[data-go],[data-action],[data-task],[data-filter],[data-assess],[data-answer],[data-check],[data-speak],[data-mic],[data-show-input],[data-pick],[data-sentence-check],[data-exam-check]');
    if(!t)return;
    if(t.dataset.go){go(t.dataset.go);return;}
    if(t.dataset.filter){filter=t.dataset.filter;renderChoose();return;}
    if(t.dataset.task){go('task',{id:t.dataset.task});return;}
    if(t.dataset.assess){var av=t.dataset.verb;if(t.dataset.assess==='known')state.learned=uniq(state.learned.concat([av]));else state.learnList=uniq(state.learnList.concat([av]));save();renderAssess();return;}
    if(t.dataset.action){
      if(t.dataset.action==='reset')resetAll();
      if(t.dataset.action==='select-visible'){var n=0;[].slice.call(document.querySelectorAll('.verb-row input')).forEach(function(i){if(n<PACKAGE_SIZE){i.checked=true;n++;}});}
      if(t.dataset.action==='clear-choice'){state.learnList=[];[].slice.call(document.querySelectorAll('input[data-verb]')).forEach(function(i){i.checked=false;});}
      if(t.dataset.action==='start-choice')startPackage([].slice.call(document.querySelectorAll('input[data-verb]:checked')).map(function(i){return i.dataset.verb;}));
      return;
    }
    if(t.dataset.showInput!==undefined){var box=document.querySelector('.card-answer-box');if(box)box.hidden=false;var input=document.querySelector('[data-input]');if(input)input.focus();return;}
    if(t.dataset.speak){speak(t.dataset.speak);return;}
    if(t.dataset.mic){startMic(t.dataset.mic);return;}
    if(t.dataset.answer){var id=params.id,cur=taskState(id).current;if(answerEq(t.dataset.answer,cur)){t.classList.add('ok');rightAndNext(id);}else{t.classList.add('no');renderTaskWithFeedback(id,wrongFeedback(id,cur));}return;}
    if(t.dataset.check){var val=(document.querySelector('[data-input]')||{}).value||'';checkAnswer(params.id,t.dataset.check?val:'',t.dataset.check);return;}
    if(t.dataset.pick){var built=document.querySelector('[data-built]');var word=t.dataset.pick;t.disabled=true;if(built)built.innerHTML+=(built.textContent.trim()?' ':'')+esc(word);return;}
    if(t.dataset.sentenceCheck){var builtText=(document.querySelector('[data-built]')||{}).textContent||'';checkAnswer('satz-bauen',builtText,t.dataset.sentenceCheck);return;}
    if(t.dataset.examCheck){var val2=(document.querySelector('[data-input]')||{}).value||'',ok=answerEq(val2,t.dataset.examCheck);state.package.exam.run.answers.push({verb:t.dataset.examCheck,given:val2,right:ok});state.package.exam.run.index++;save();renderExam();return;}
  });

  buildCatalog();loadState();render();
})();
