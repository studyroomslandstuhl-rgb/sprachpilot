(function(){
'use strict';
if(window.__SP_L8T2_CURRENT_20260829)return;window.__SP_L8T2_CURRENT_20260829=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||'').trim();
const slug=value=>String(value||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const GRAMMAR_CARD=/(arbeiten\s+(als|bei)|\b(als|bei)\b.*\barbeiten\b|ausbildung.*machen|machen.*ausbildung|^seit$|^vor$)/i;
const GRAMMAR_TASK=/(seit|\bvor\b|arbeiten\s+als|arbeiten\s+bei|ausbildung.*machen|machen.*ausbildung|präposition|praeposition)/i;

function basename(raw){try{return decodeURIComponent(String(raw||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'')}catch(e){return String(raw||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}}
function imageUrl(raw,fallback=''){
 const name=basename(raw)||fallback;if(!name)return'';
 const stem=name.replace(/\.(png|jpe?g|gif|svg|webp)$/i,'');return CDN+encodeURIComponent(stem)+'.webp';
}
function audioUrl(raw,fallback=''){
 const name=basename(raw)||fallback;if(!name)return'';
 const stem=name.replace(/\.mp3$/i,'');return AUDIO+encodeURIComponent(stem)+'.mp3';
}
function mediaStem(item){return slug(item?.id||term(item)||item?.answer||item?.prompt||'')}
function lexicalCard(item){const t=term(item);return !!(t&&!GRAMMAR_CARD.test(t))}
function taskText(task){return `${task?.id||''} ${task?.title||''} ${task?.instruction||''} ${task?.intro||''}`}
function itemText(item){return `${item?.term||''} ${item?.prompt||''} ${item?.context||''} ${item?.example||''} ${Array.isArray(item?.answer)?item.answer.join(' '):item?.answer||''}`}
function stripImages(obj){if(!obj||typeof obj!=='object')return;if(Array.isArray(obj)){obj.forEach(stripImages);return}for(const key of Object.keys(obj)){if(/^(image|img|imageUrl|picture)$/i.test(key)){delete obj[key];continue}stripImages(obj[key])}}
function bunnyWalk(obj){
 if(!obj||typeof obj!=='object')return;
 if(Array.isArray(obj)){obj.forEach(bunnyWalk);return}
 for(const [key,value] of Object.entries(obj)){
  if(value&&typeof value==='object'){bunnyWalk(value);continue}
  if(typeof value!=='string')continue;
  if(/^(image|img|imageUrl|picture)$/i.test(key)&&value)obj[key]=imageUrl(value);
  else if(/^(audio|audioFile|wordAudio|audio_file|audioSrc)$/i.test(key)&&value)obj[key]=audioUrl(value);
 }
}
function mainCards(theme){return (theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(String(task?.title||'')))}
function normalizeCards(theme){
 const task=mainCards(theme);if(!task)return;
 task.emoji='🃏';task.icon='🃏';task.items=(task.items||[]).filter(lexicalCard);
 const seen=new Set(task.items.map(item=>norm(term(item))));
 for(const source of window.L8_T2_TIME_WORDS||[]){const key=norm(term(source));if(!key||seen.has(key))continue;task.items.push({...source});seen.add(key)}
 for(const item of task.items){
  const stem=mediaStem(item);if(!stem)continue;
  item.image=imageUrl(item.image,stem+'.webp');
  item.audio=audioUrl(item.audio,stem+'.mp3');
 }
}
function timeWord(id){return (window.L8_T2_TIME_WORDS||[]).find(item=>String(item.id)===id)||{}}
function q(type,prompt,options,answer,id,hint){const w=timeWord(id);return{type,prompt,options,answer,hint,image:w.image||imageUrl('',id+'.webp'),audio:w.audio||audioUrl('',id+'.mp3')}}
function formsTask(){return{
 id:'zeitwoerter-artikel-plural',title:'Zeitwörter: Artikel und Plural',emoji:'🔤',icon:'🔤',kind:'choice',
 instruction:'Wähle den richtigen Artikel oder die richtige Pluralform.',
 intro:'Wiederholung aus Lektion 5. Diese Formen brauchst du gleich bei seit und vor.',
 items:[
  q('choice','___ Sekunde',['der','die','das'],'die','sekunde','die Sekunde'),q('choice','Plural von „die Sekunde“',['die Sekunden','die Sekunde','die Sekundes'],'die Sekunden','sekunde','die Sekunden'),
  q('choice','___ Minute',['der','die','das'],'die','minute','die Minute'),q('choice','Plural von „die Minute“',['die Minuten','die Minute','die Minuter'],'die Minuten','minute','die Minuten'),
  q('choice','___ Stunde',['der','die','das'],'die','stunde','die Stunde'),q('choice','Plural von „die Stunde“',['die Stunden','die Stunde','die Stünde'],'die Stunden','stunde','die Stunden'),
  q('choice','___ Tag',['der','die','das'],'der','tag','der Tag'),q('choice','Plural von „der Tag“',['die Tage','die Tagen','die Tags'],'die Tage','tag','die Tage'),
  q('choice','___ Woche',['der','die','das'],'die','woche','die Woche'),q('choice','Plural von „die Woche“',['die Wochen','die Woche','die Wöchen'],'die Wochen','woche','die Wochen'),
  q('choice','___ Monat',['der','die','das'],'der','monat','der Monat'),q('choice','Plural von „der Monat“',['die Monate','die Monaten','die Monats'],'die Monate','monat','die Monate'),
  q('choice','___ Jahr',['der','die','das'],'das','jahr','das Jahr'),q('choice','Plural von „das Jahr“',['die Jahre','die Jahren','die Jähre'],'die Jahre','jahr','die Jahre')
 ]
}}
function useTask(){return{
 id:'zeitwoerter-seit-vor',title:'seit und vor',emoji:'⏳',icon:'⏳',kind:'input',
 instruction:'Schreibe die richtige Zeitangabe mit seit oder vor.',
 intro:'seit und vor stehen mit Dativ. Singular: seit/vor einer Sekunde, einer Minute, einer Stunde, einer Woche; seit/vor einem Tag, einem Monat, einem Jahr. Bei mehreren Zeitangaben heißt es z. B. seit zwei Tagen, vor drei Wochen, seit fünf Monaten oder vor vier Jahren.',
 items:[
  {type:'input',prompt:'seit + 1 + Sekunde',answer:['seit einer Sekunde'],hint:'die Sekunde → einer Sekunde'},
  {type:'input',prompt:'vor + 2 + Sekunde',answer:['vor zwei Sekunden','vor 2 Sekunden'],hint:'Plural: Sekunden'},
  {type:'input',prompt:'vor + 1 + Minute',answer:['vor einer Minute'],hint:'die Minute → einer Minute'},
  {type:'input',prompt:'seit + 3 + Minute',answer:['seit drei Minuten','seit 3 Minuten'],hint:'Plural: Minuten'},
  {type:'input',prompt:'seit + 1 + Stunde',answer:['seit einer Stunde'],hint:'die Stunde → einer Stunde'},
  {type:'input',prompt:'vor + 4 + Stunde',answer:['vor vier Stunden','vor 4 Stunden'],hint:'Plural: Stunden'},
  {type:'input',prompt:'vor + 1 + Tag',answer:['vor einem Tag'],hint:'der Tag → einem Tag'},
  {type:'input',prompt:'seit + 2 + Tag',answer:['seit zwei Tagen','seit 2 Tagen'],hint:'Dativ Plural: Tagen'},
  {type:'input',prompt:'seit + 1 + Woche',answer:['seit einer Woche'],hint:'die Woche → einer Woche'},
  {type:'input',prompt:'vor + 3 + Woche',answer:['vor drei Wochen','vor 3 Wochen'],hint:'Plural: Wochen'},
  {type:'input',prompt:'vor + 1 + Monat',answer:['vor einem Monat'],hint:'der Monat → einem Monat'},
  {type:'input',prompt:'seit + 5 + Monat',answer:['seit fünf Monaten','seit 5 Monaten'],hint:'Dativ Plural: Monaten'},
  {type:'input',prompt:'seit + 1 + Jahr',answer:['seit einem Jahr'],hint:'das Jahr → einem Jahr'},
  {type:'input',prompt:'vor + 3 + Jahr',answer:['vor drei Jahren','vor 3 Jahren'],hint:'Dativ Plural: Jahren'}
 ]
}}
function installTimeTasks(theme){
 theme.tasks=theme.tasks.filter(task=>!['zeitwoerter-artikel-plural','zeitwoerter-seit-vor','zeitwoerter-wiederholung'].includes(task?.id));
 const cards=mainCards(theme),idx=Math.max(0,theme.tasks.indexOf(cards));
 theme.tasks.splice(idx+1,0,formsTask(),useTask());
}
function cleanGrammarMedia(theme){
 for(const task of theme.tasks||[]){
  const wholeTask=GRAMMAR_TASK.test(taskText(task))&&task.id!=='zeitwoerter-artikel-plural';
  if(wholeTask)stripImages(task);
  else for(const item of task.items||[])if(GRAMMAR_TASK.test(itemText(item)))stripImages(item);
  bunnyWalk(task);
 }
}

window.L8_T2_CURRENT_READY=(async()=>{
 await window.L8_CONTENT_READY;
 if(window.L8_T2_TIME_REVIEW_READY)await window.L8_T2_TIME_REVIEW_READY;
 if(window.L8_T2_QUALITY_READY)await window.L8_T2_QUALITY_READY;
 const all=window.L8_ALL_THEMES||{},theme=all[2]||all['2'];if(!theme||!Array.isArray(theme.tasks))return theme;
 normalizeCards(theme);installTimeTasks(theme);cleanGrammarMedia(theme);
 theme.grammarOverview=[
  {title:'seit + Dativ',text:'Etwas hat in der Vergangenheit begonnen und dauert noch an.',example:'Ich arbeite seit einem Jahr bei der Firma.'},
  {title:'vor + Dativ',text:'Etwas ist zu einem Zeitpunkt in der Vergangenheit passiert.',example:'Ich habe vor einem Jahr eine Ausbildung gemacht.'},
  {title:'eine Ausbildung als + Beruf machen',text:'Nach als steht der Beruf hier ohne Artikel.',example:'Ich mache eine Ausbildung als Koch.'},
  {title:'arbeiten als + Beruf',text:'Mit als nennen wir den Beruf. Der Beruf steht ohne Artikel.',example:'Ich arbeite als Ärztin.'},
  {title:'arbeiten bei + Arbeitgeber',text:'Mit bei nennen wir die Firma oder den Arbeitgeber. Bei steht mit Dativ.',example:'Ich arbeite bei einer Firma.'}
 ];
 if(window.L8_THEME&&Number(window.L8_THEME.number)===2)window.L8_THEME=theme;
 return theme;
})().catch(error=>{console.error('L8T2 aktuelle Überarbeitung',error);throw error});
})();
