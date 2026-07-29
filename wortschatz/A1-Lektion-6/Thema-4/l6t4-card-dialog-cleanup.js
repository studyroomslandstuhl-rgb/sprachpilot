(function(){
'use strict';
const data=window.L6T4_DATA;
if(!data)return;

function normalize(value){return String(value??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'…]/g,'').replace(/\s+/g,' ')}

/* „besonders“: keine Bildkarte, sondern klare Bedeutungsstütze. */
const besonders=(data.vocabulary||[]).find(item=>normalize(item?.word)==='besonders');
if(besonders){
 besonders.image='';
 besonders.cardVisualText='speziell';
}

/* Die separate Audio-Dialogaufgabe bleibt aus dem Thema entfernt. */
if(Array.isArray(data.tasks))data.tasks=data.tasks.filter(task=>task?.id!=='dialog-abc');

/* Defekte alte Hörtexte aus der Prüfung entfernen und durch vorhandene Inhalte ersetzen. */
const exam=(data.tasks||[]).find(task=>task?.id==='exam');
if(exam&&Array.isArray(exam.items)){
 const base=exam.items.filter(item=>!item?.audioName&&normalize(item?.prompt)!=='was macht nina am freitag');
 const existingSound={
  kind:'audio-choice',
  prompt:'Welche Aktivität hörst du?',
  answer:'Musik hören',
  options:['Musik hören','telefonieren','staubsaugen'],
  audioFile:'l6t4-geraeusch-musik-hoeren.mp3',
  hint:'Achte auf das typische Geräusch.',
  abc:true
 };
 const besondersMeaning={
  kind:'choice',
  prompt:'Was bedeutet „besonders“?',
  answer:'speziell',
  options:['speziell','nie','langweilig','zusammen'],
  hint:'„Besonders“ bedeutet hier: mehr als andere.'
 };
 exam.items=[...base,existingSound,besondersMeaning].slice(0,15);
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
 if(examMeta&&exam)examMeta.total=exam.items.length;
}catch(e){}

/* Alte laufende Prüfung einmalig zurücksetzen, damit die defekte Audiofrage verschwindet. */
try{
 const releaseKey='SP_L6_T4_EXAM_AUDIO_REPLACED_V3';
 if(localStorage.getItem(releaseKey)!=='1'){
  const keys=[];
  for(let index=0;index<localStorage.length;index++){
   const key=String(localStorage.key(index)||'');
   if(/SP_L6_T4/i.test(key)&&/task-exam$/i.test(key))keys.push(key);
  }
  keys.forEach(key=>localStorage.removeItem(key));
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
  if(word!=='besonders')return;
  const front=card.querySelector('.flip-front');
  if(!front)return;
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
.audio-file-panel audio{width:100%;max-width:620px}
.image-fallback[hidden],.audio-load-error[hidden],.visual [hidden]{display:none!important}
@media(max-width:640px){.special-word-card .flip-front{padding:12px!important;gap:10px!important}.special-word-card .special-word-visual span{font-size:clamp(2rem,12vw,3.4rem);padding:12px}.special-word-card .card-translation-box strong{font-size:18px}}
`;
document.head.appendChild(style);

if(new URLSearchParams(location.search).get('task')==='dialog-abc'){
 location.replace('index.html');
 return;
}
apply();
const observer=new MutationObserver(apply);
observer.observe(document.documentElement,{childList:true,subtree:true});
})();