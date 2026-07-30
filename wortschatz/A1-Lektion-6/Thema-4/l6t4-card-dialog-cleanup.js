(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;

function normalize(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'…]/g,'').replace(/\s+/g,' ')}
const choice=(prompt,answer,options,hint='',extra={})=>({kind:'choice',prompt,answer,options,hint,...extra});
const dialog=(speaker,text,side='left')=>({speaker,text,side});

/* „besonders“: keine Bildkarte, sondern Bedeutungsstütze. */
const besonders=(data.vocabulary||[]).find(item=>normalize(item?.word)==='besonders');
if(besonders){
 besonders.image='';
 besonders.cardVisualText='speziell';
}

/* Die separate Audio-Dialogaufgabe bleibt aus dem Thema entfernt. */
if(Array.isArray(data.tasks))data.tasks=data.tasks.filter(task=>task?.id!=='dialog-abc');

/* Prüfung: exakt 15 kontrollierbare Aufgaben, vollständig ohne Audio und ohne Hörfelder. */
const exam=(data.tasks||[]).find(task=>task?.id==='exam');
if(exam){
 exam.title='Prüfung';
 exam.items=[
  choice('Was bedeutet „besonders“?','speziell',['speziell','nie','langweilig','zusammen'],'„Besonders“ bedeutet: mehr als andere.'),
  choice('___ Hobby','das',['der','die','das','kein Artikel'],'Hobby ist ein Neutrum.'),
  choice('Plural: der Beruf','die Berufe',['die Berufe','die Berufen','der Berufe','die Beruf'],'Achte auf Artikel und Pluralendung.'),
  choice('Was bedeutet „dabeihaben“?','etwas bei sich haben',['etwas bei sich haben','etwas vergessen','etwas suchen','etwas kaufen'],'Denke an: Hast du den Würfel dabei?'),
  choice('Ich ___ einen Tee.','nehme',['nehme','nimmt','nimmst','nehmt'],'Achte auf das Subjekt „ich“.'),
  choice('Was ___ du?','nimmst',['nimmst','nehme','nimmt','nehmen'],'Achte auf das Subjekt „du“.'),
  choice('Gitarre ___','spielen',['spielen','fahren','treffen','hören'],'Bilde die passende Nomen-Verb-Verbindung.'),
  choice('„Kein einziges Mal“ bedeutet:','nie',['nie','oft','manchmal','immer'],'Gesucht ist eine Häufigkeitsangabe.'),
  choice('Welche Reaktion passt?', 'Oh, wie dumm!',['Oh, wie dumm!','Na klar.','Ich weiß es nicht.','Stimmt.'],'Der Bus ist schon weg.',{dialog:[dialog('Anna','Der Bus ist schon weg.')]}),
  choice('Spielst du nicht gern Tennis?','Doch, sehr gern.',['Doch, sehr gern.','Nein, sehr gern.','Vielleicht nächste Woche.','Ich weiß es nicht.'],'Eine negative Frage wird hier positiv beantwortet.'),
  choice('Was bedeutet „Ich glaube …“?','Ich denke …',['Ich denke …','Ich weiß es sicher.','Ich frage …','Ich vergesse …'],'„Glauben“ drückt hier eine Vermutung aus.'),
  choice('Welche Bedeutung hat „finden“?', 'eine Meinung sagen',['eine Meinung sagen','suchen oder entdecken'],'Der Film wird bewertet.',{dialog:[dialog('Mara','Ich finde den Film toll.')]}),
  choice('Welche Antwort passt?', 'Mein Hobby ist Schwimmen.',['Mein Hobby ist Schwimmen.','Meine Hobbys ist Schwimmen.','Ich bin Schwimmen.','Mein Beruf ist Schwimmen.'],'Achte auf Singular: das Hobby.'),
  choice('Meine Hobbys ___ Lesen und Wandern.','sind',['sind','ist','bin','seid'],'Das Subjekt steht im Plural.'),
  choice('Welche Antwort passt?', 'Ich weiß es nicht.',['Ich weiß es nicht.','Na klar.','Oh, wie dumm!','Auf jeden Fall.'],'Die Person kennt die Uhrzeit nicht.',{dialog:[dialog('Tim','Wann beginnt der Film?')]})
 ];
}

function removeAndRenumber(list){
 if(!Array.isArray(list))return;
 for(let index=list.length-1;index>=0;index--)if(list[index]?.id==='dialog-abc')list.splice(index,1);
 list.forEach((item,index)=>{item.number=String(index+1)});
}
try{removeAndRenumber(L6T4_META)}catch(e){}
try{
 removeAndRenumber(L6T4_TASKS);
 const examMeta=L6T4_TASKS.find(item=>item?.id==='exam');
 if(examMeta&&exam)examMeta.total=15;
}catch(e){}

/* Einmaliger Neustart nur des laufenden Prüfungsstands. Punkte und abgeschlossene Runs bleiben erhalten. */
try{
 const releaseKey='SP_L6_T4_EXAM_WITHOUT_AUDIO_V5';
 if(localStorage.getItem(releaseKey)!=='1'){
  ['SP_L6_T4_V2_task-exam','SP_L6_T4_V1_task-exam','SP_L6_T4_PREVIEW_task-exam'].forEach(key=>{
   localStorage.removeItem(key);
   sessionStorage.removeItem(key);
  });
  [localStorage,sessionStorage].forEach(storage=>{
   const keys=[];
   for(let index=0;index<storage.length;index++){
    const key=String(storage.key(index)||'');
    if(/SP_L6_T4/i.test(key)&&/task-exam$/i.test(key))keys.push(key);
   }
   keys.forEach(key=>storage.removeItem(key));
  });
  localStorage.setItem(releaseKey,'1');
 }
}catch(e){}

function cleanAudioLabels(root=document){
 root.querySelectorAll('button').forEach(button=>{
  if(/bunny\s*storage|audio\s*aus\s*bunny/i.test(button.textContent||''))button.textContent='🔊 Anhören';
 });
}

function renderBesondersCard(root=document){
 root.querySelectorAll('.flip-card').forEach(card=>{
  const word=normalize(card.querySelector('.flip-word')?.textContent||'');
  if(word!=='besonders'||card.dataset.l6t4SpecialReady==='1')return;
  const front=card.querySelector('.flip-front');
  if(!front)return;
  card.dataset.l6t4SpecialReady='1';
  card.classList.add('special-word-card');
  front.querySelectorAll('.visual,.special-word-visual').forEach(element=>element.remove());
  const visual=document.createElement('div');
  visual.className='visual special-word-visual';
  visual.setAttribute('aria-label','speziell');
  visual.innerHTML='<span>speziell</span>';
  const translation=front.querySelector('.card-translation-box');
  front.insertBefore(visual,translation||front.firstChild);
 });
}

function fixImageFallbacks(root=document){
 root.querySelectorAll('.visual img,.word-placeholder img,.image-option img').forEach(img=>{
  if(img.dataset.l6t4FallbackReady==='1')return;
  img.dataset.l6t4FallbackReady='1';
  const fallback=img.nextElementSibling;
  const sync=()=>{
   if(!fallback||!fallback.classList.contains('image-fallback'))return;
   if(img.complete&&img.naturalWidth>0){fallback.hidden=true;fallback.style.display='none'}
  };
  sync();
  img.addEventListener('load',sync,{once:true});
 });
}

function apply(){cleanAudioLabels();renderBesondersCard();fixImageFallbacks()}
const style=document.createElement('style');
style.textContent=`
.special-word-card .flip-front{justify-content:flex-start!important;gap:12px!important;padding:16px!important}
.special-word-card .special-word-visual{display:flex!important;flex:1 1 auto!important;align-items:center!important;justify-content:center!important;width:100%!important;height:auto!important;min-height:0!important;margin:0!important;border:2px solid #d8e6f3!important;border-radius:20px!important;background:#f7fbff!important;color:#173f68!important;overflow:hidden!important}
.special-word-card .special-word-visual span{display:block;font-size:clamp(2.1rem,9vw,4rem);font-weight:900;line-height:1.05;overflow-wrap:anywhere;text-align:center;padding:18px}
.special-word-card .card-translation-box{flex:0 0 auto;width:100%;margin:0!important;padding:10px 12px!important}
.card-listen-btn,.sp-word-audio{width:auto!important;min-width:0!important;white-space:nowrap}
.image-fallback[hidden],.audio-load-error[hidden],.visual [hidden],[hidden]{display:none!important}
@media(max-width:640px){.special-word-card .flip-front{padding:12px!important;gap:10px!important}.special-word-card .special-word-visual span{font-size:clamp(2rem,12vw,3.4rem);padding:12px}.special-word-card .card-translation-box strong{font-size:18px}}
`;
document.head.appendChild(style);

if(new URLSearchParams(location.search).get('task')==='dialog-abc'){
 location.replace('index.html');
 return;
}
apply();
let scheduled=false;
const scheduleApply=()=>{
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  apply();
 });
};
const observer=new MutationObserver(scheduleApply);
observer.observe(document.documentElement,{childList:true,subtree:true});
})();