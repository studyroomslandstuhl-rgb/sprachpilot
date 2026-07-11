(function(){
  const CDN='https://sprachpilot.b-cdn.net/';
  const AUDIO=CDN+'audio/';
  const TOPIC_ID='wortschatz-a1-lektion-6-thema-1';
  const PAYLOAD={module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:6,theme:1,title:'A1 Lektion 6 · Thema 1 Wetter',topicId:TOPIC_ID};
  const IMG={wetter:'wetter.webp',sonne:'sonne.webp',regen:'regen.webp',wind:'wind.webp',wolke:'wolke.webp',schnee:'schnee.webp',waerme:'warm.webp',warm:'warm.webp',kaelte:'kalt.webp',kalt:'kalt.webp',hitze:'heiss.webp',heiss:'heiss.webp',grad:'grad.webp',unter_null:'eis.webp',gewitter:'gewitter.webp',blitz:'blitz.webp',eis:'eis.webp',donner:'donner.webp',hagel:'hagel.webp',nebel:'nebel.webp',sturm:'sturm.webp'};
  const AUDIO_FILES={regen:'a1-l6-t1-sound-regen.mp3',wind:'a1-l6-t1-sound-wind.mp3',schnee:'a1-l6-t1-sound-schnee.mp3',gewitter:'a1-l6-t1-sound-gewitter.mp3',blitz:'a1-l6-t1-sound-blitz.mp3',eis:'a1-l6-t1-sound-eis.mp3',donner:'a1-l6-t1-sound-donner.mp3',hagel:'a1-l6-t1-sound-hagel.mp3'};
  function url(file){return /^https?:\/\//i.test(String(file||''))?file:CDN+file}
  function audioUrl(file){return /^https?:\/\//i.test(String(file||''))?file:AUDIO+file}
  function allWords(){try{return BASE_WORDS.concat(EXTRA_WORDS)}catch(e){return[]}}
  function patchContent(){
    allWords().forEach(w=>{
      if(!w||!w.id)return;
      if(w.id==='warm'){w.type='noun';w.article='die';w.word='Wärme';w.full='die Wärme';w.sentence='Es ist warm.';w.symbol='🌤️';w.image=url(IMG.waerme)}
      if(w.id==='kalt'){w.type='noun';w.article='die';w.word='Kälte';w.full='die Kälte';w.sentence='Es ist kalt.';w.symbol='🥶';w.image=url(IMG.kaelte)}
      if(w.id==='heiss'){w.type='noun';w.article='die';w.word='Hitze';w.full='die Hitze';w.sentence='Es ist heiß.';w.symbol='🔥';w.image=url(IMG.hitze)}
      if(IMG[w.id])w.image=url(IMG[w.id]);
      if(AUDIO_FILES[w.id])w.sound=audioUrl(AUDIO_FILES[w.id]);
    });
  }
  patchContent();
  const oldBookOn=window.bookOn||(()=>true), oldExtraOn=window.extraOn||(()=>false);
  window.bookOn=bookOn=function(){try{return oldBookOn()}catch(e){return true}};
  window.extraOn=extraOn=function(){try{return oldExtraOn()}catch(e){return localStorage.getItem('SP_L6_T1_EXTRA_WEATHER')==='1'}};
  window.words=words=function(){patchContent();return (bookOn()?BASE_WORDS:[]).concat(extraOn()?EXTRA_WORDS:[])};
  window.nouns=nouns=function(){return words().filter(w=>w.type==='noun')};
  window.wordItems=wordItems=function(){return words()};
  window.soundWords=soundWords=function(){return words().filter(w=>w.sound)};
  window.cardItems=cardItems=function(){return words().flatMap(w=>[{mode:'noun',w},{mode:'sentence',w}])};
  window.sentenceItems=sentenceItems=function(){return nouns().filter(w=>w.sentence).map(w=>({w,sol:sentenceSolutions(w)}))};
  window.listenItems=listenItems=function(){
    const data=[
      ['a1-l6-t1-hoeren-01.mp3','Wie ist das Wetter am Montagvormittag in Berlin?','sonnig',['sonnig','windig','verschneit'],'Guten Morgen. Hier ist der Wetterbericht für Berlin. Am Montagvormittag scheint die Sonne. Es ist warm.'],
      ['a1-l6-t1-hoeren-02.mp3','Wann regnet es in Hamburg?','am Dienstag um 8 Uhr',['am Montag um 8 Uhr','am Dienstag um 8 Uhr','am Dienstag um 18 Uhr'],'In Hamburg regnet es am Dienstag um 8 Uhr. Am Abend ist es trocken.'],
      ['a1-l6-t1-hoeren-03.mp3','Wo schneit es?','in München',['in München','in Berlin','in Köln'],'In München schneit es heute. In Berlin ist es kalt, aber trocken.'],
      ['a1-l6-t1-hoeren-04.mp3','Wie ist das Wetter am Wochenende?','kalt und bewölkt',['warm und sonnig','kalt und bewölkt','windig und heiß'],'Am Wochenende ist es kalt und bewölkt. Die Sonne scheint nicht.'],
      ['a1-l6-t1-hoeren-05.mp3','Wie viel Grad sind es?','sieben Grad',['fünf Grad','sieben Grad','zwanzig Grad'],'Heute ist es kalt. Es sind sieben Grad.'],
      ['a1-l6-t1-hoeren-06.mp3','Was passiert am Freitag?','Es schneit.',['Es schneit.','Es regnet.','Die Sonne scheint.'],'Am Freitag schneit es. Bitte fahren Sie vorsichtig.'],
      ['a1-l6-t1-hoeren-07.mp3','Wann ist es windig?','am Abend',['am Morgen','am Mittag','am Abend'],'Am Morgen ist es ruhig. Am Mittag ist es warm. Am Abend ist es windig.'],
      ['a1-l6-t1-hoeren-08.mp3','Wie ist das Wetter morgen?','nicht so schön',['sehr schön','nicht so schön','heiß'],'Das Wetter morgen ist nicht so schön. Es regnet und es ist kalt.'],
      ['a1-l6-t1-hoeren-09.mp3','Was hört man?','der Regen',['der Regen','der Wind','der Schnee'],'Hören Sie genau. Man hört den Regen.'],
      ['a1-l6-t1-hoeren-10.mp3','Was ist richtig?','Am Sonntag scheint die Sonne.',['Am Sonntag regnet es.','Am Sonntag scheint die Sonne.','Am Sonntag schneit es.'],'Am Sonntag scheint die Sonne. Es ist warm und schön.']
    ];
    return data.map(x=>({audio:audioUrl(x[0]),audioName:x[0],q:x[1],a:x[2],opts:x[3],transcript:x[4]}));
  };
  function afterAmUmFinal(w){const s=w.sentence;if(s==='Die Sonne scheint.')return 'scheint die Sonne.';let m=s.match(/^Es ist (.+)\.$/);if(m)return `ist es ${m[1]}.`;m=s.match(/^Es sind (.+)\.$/);if(m)return `sind es ${m[1]}.`;m=s.match(/^Es (.+)\.$/);if(m)return `${m[1]} es.`;return s.charAt(0).toLowerCase()+s.slice(1)}
  window.writingItems=writingItems=function(){const pool=words().filter(w=>w.sentence&&!['wetter','grad','unter_null'].includes(w.id));const res=[];let n=0;while(res.length<20&&pool.length){const day=DAYS[n%DAYS.length],time=TIMES[n%TIMES.length],w=pool[n%pool.length];res.push({short:day[0],day:day[1],time,w,sol:`Am ${day[1]} um ${time} ${afterAmUmFinal(w)}`});n++}return res};
  window.visual=visual=function(w,small=false){patchContent();const img=w&&w.image||'';const alt=String((w&&w.full)||(w&&w.word)||'Wetterbild').replace(/"/g,'&quot;');const fallback=w&&w.symbol||'•';return `<div class="weather-card ${small?'small-card':''}" aria-label="${alt}">${img?`<img class="weather-img" src="${img}" alt="${alt}" loading="lazy" onerror="this.remove();this.parentElement.textContent='${fallback}'">`:fallback}</div>`};
  window.renderOverview=renderOverview=function(target){patchContent();target.innerHTML=['Im Buch','Nicht im Buch'].map(g=>{const visible=g==='Im Buch'?bookOn():extraOn();const list=(g==='Im Buch'?BASE_WORDS:EXTRA_WORDS);if(!visible&&!isTeacher())return '';if(!visible)return `<section class="type-block locked-set"><div class="type-title">${g} 🔒</div><p class="small">Diese Wortschatzliste ist für deinen Kurs noch nicht freigegeben.</p></section>`;return `<section class="type-block"><div class="type-title">${g}</div>${list.map(w=>`<div class="word-row"><div class="word-placeholder">${visual(w,true)}</div><div><b>${full(w)}</b><br><span class="small">${w.sentence}${w.altSentences?' / '+w.altSentences.join(' / '):''}</span><div class="small">Übersetzung (${LANGS[langKey()]||'EN'}): ${tr(w)}</div><span class="tag">${w.type}</span></div></div>`).join('')}</section>`}).join('')};
  window.renderTaskList=renderTaskList=function(includeExam=true){const ts=taskTotals().filter(t=>includeExam||t[0]!=='pruefung.html');return `<div class="grid task-grid">${ts.map((t,i)=>{const p=pctFor(t[0],t[1]);const icon=L6_T1_TASK_ICONS[t[0]]||'▶';const exam=t[0]==='pruefung.html';return `<a class="module task-card ${exam?'exam-gray':''}" href="${t[0]}"><div class="num">${i+1}. ${t[2]}</div><div class="icon big-icon">${icon}</div><p>${exam?'Teste dein Wissen.':'Wetter und Sätze üben.'}</p><div class="progress"><div class="bar" style="width:${p}%"></div></div><div class="small">${p}%</div><div class="start">${p>=100?'Fertig':'Starten'}</div></a>`}).join('')}</div>`};
  const oldSave=window.saveTask;
  function syncTask(file,st){
    if(!file||!st)return;
    const done=Array.isArray(st.done)?st.done.length:0,total=Number(st.total||0)||0,percent=total?Math.round(done/total*100):0;
    const payload={...PAYLOAD,file,taskTitle:file.replace(/\.html$/,''),percent,done,total,completed:percent>=100};
    try{
      if(window.SPProgress&&SPProgress.recordTaskProgress)SPProgress.recordTaskProgress(payload);
      else{window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method:'recordTaskProgress',payload});import('/js/progress.js?v=restore-20260710').catch(()=>{})}
    }catch(e){}
  }
  window.saveTask=saveTask=function(file,st){if(typeof oldSave==='function')oldSave(file,st);else localStorage.setItem(taskKey(file),JSON.stringify(st));syncTask(file,st)};
  const oldMarkTaskDone=window.markTaskDone;
  window.markTaskDone=markTaskDone=function(file,total){if(typeof oldMarkTaskDone==='function')oldMarkTaskDone(file,total);else saveTask(file,{total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false});syncTask(file,loadTask(file,total))};
  async function restoreFirebaseProgress(){
    try{
      await import('/js/progress.js?v=restore-20260710');
      if(!window.SPProgress||!SPProgress.loadCurrentStudentProgress)return;
      const data=await SPProgress.loadCurrentStudentProgress();
      const topic=data&&data.wortschatz&&data.wortschatz[TOPIC_ID];
      if(!topic||!topic.tasks)return;
      Object.values(topic.tasks).forEach(t=>{
        const file=t.file||t.key;if(!file)return;
        const total=Number(t.total||0)||0,done=Number(t.done||0)||0;if(!total||!done)return;
        const key=taskKey(file);let local=null;try{local=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}
        if(!local||!Array.isArray(local.done)||local.done.length<done){
          localStorage.setItem(key,JSON.stringify({total,done:[...Array(Math.min(done,total)).keys()],queue:[...Array(total).keys()].slice(done),current:null,tries:0,hadWrong:false}));
        }
      });
      if(document.getElementById('wordList'))renderOverview(document.getElementById('wordList'));
      if(document.getElementById('stats'))renderStats(document.getElementById('stats'));
      if(document.getElementById('taskGrid'))renderMenu();
    }catch(e){console.warn('L6T1 Firebase restore failed',e)}
  }
  setTimeout(restoreFirebaseProgress,250);
  const css=document.createElement('style');
  css.textContent='.card-mode-marker{margin:14px auto 0;display:inline-flex;border-radius:999px;padding:8px 14px;background:#fff3f8;border:2px solid var(--lesson-line);font-weight:900;color:#7b123d}.exam-gray{background:#f1f5f9!important;border-color:#cbd5e1!important;color:#64748b!important}.exam-gray .num,.exam-gray .big-icon{color:#64748b!important}.exam-gray .start{background:#e2e8f0!important;border-color:#cbd5e1!important;color:#475569!important}.weather-card .weather-img{object-fit:cover}';
  document.head.appendChild(css);
})();