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
  front.querySelectorAll('.visual,.image-fallback').forEach(element=>element.remove());
  if(!front.querySelector('.special-word-visual')){
   const visual=document.createElement('div');
   visual.className='special-word-visual';
   visual.textContent='speziell';
   front.insertBefore(visual,front.firstChild);
  }
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
style.textContent='.special-word-visual{display:flex;align-items:center;justify-content:center;min-height:260px;margin:0 0 18px;border:2px solid #d8e6f3;border-radius:20px;background:#f7fbff;color:#173f68;font-size:clamp(2rem,7vw,4rem);font-weight:900;letter-spacing:.01em}.card-listen-btn,.sp-word-audio{width:auto!important;min-width:0!important;white-space:nowrap}.audio-file-panel audio{width:100%;max-width:620px}.image-fallback[hidden],.audio-load-error[hidden],.visual [hidden]{display:none!important}';
document.head.appendChild(style);

if(new URLSearchParams(location.search).get('task')==='dialog-abc'){
 location.replace('index.html');
 return;
}
apply();
const observer=new MutationObserver(apply);
observer.observe(document.documentElement,{childList:true,subtree:true});
})();