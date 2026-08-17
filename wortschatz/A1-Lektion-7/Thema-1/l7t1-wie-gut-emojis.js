(function(){
'use strict';
if(window.__SP_L7T1_WIE_GUT_EMOJIS_6)return;
window.__SP_L7T1_WIE_GUT_EMOJIS_6=true;

const LEVEL_EMOJIS=Object.freeze({
 'gar nicht':'😭',
 'nicht so gut':'🙁',
 'gut':'🙂',
 'sehr gut':'🤩'
});
const EMOJI_LEVELS=Object.freeze(Object.fromEntries(Object.entries(LEVEL_EMOJIS).map(([level,emoji])=>[emoji,level])));
const ORDERED=['😭','🙁','🙂','🤩'];

const UNIQUE_ROWS=Object.freeze([
 ['Lena','backen','gut'],
 ['Tom','singen','sehr gut'],
 ['Mia','reiten','nicht so gut'],
 ['Paul','Klavier spielen','gar nicht'],
 ['Anna','malen','sehr gut'],
 ['Du','Ski fahren','gut'],
 ['Wir','Tennis spielen','nicht so gut'],
 ['Ihr','Gitarre spielen','sehr gut'],
 ['Omar','jonglieren','gar nicht'],
 ['Die Kinder','Fahrrad fahren','gut'],
 ['Sofia','fotografieren','sehr gut'],
 ['Ich','Französisch sprechen','nicht so gut'],
 ['Jonas','einen Handstand machen','gar nicht'],
 ['Nina','lesen','gut'],
 ['Amir','schreiben','sehr gut']
]);

function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/\s+/g,' ');
}
function starEmoji(value){
 const text=String(value??'').trim();
 if(!text)return null;
 if(ORDERED.includes(text))return text;
 const named=LEVEL_EMOJIS[norm(text)];
 if(named)return named;
 const numeric=text.match(/^([1-4])\s*(?:stern|sterne|star|stars)?$/i);
 if(numeric)return ORDERED[Number(numeric[1])-1];
 if(!/^[★⭐☆\s]+$/u.test(text))return null;
 const filled=(text.match(/[★⭐]/gu)||[]).length;
 const empty=(text.match(/☆/gu)||[]).length;
 if(empty){
  if(filled<=0)return ORDERED[0];
  if(filled===1)return ORDERED[1];
  if(filled===2)return ORDERED[2];
  return ORDERED[3];
 }
 if(filled>=1&&filled<=4)return ORDERED[filled-1];
 return null;
}
function modalFor(subject){
 const value=norm(subject);
 if(value==='ich')return'kann';
 if(value==='du')return'kannst';
 if(value==='wir'||value==='sie'||value==='sie / sie')return'können';
 if(value==='ihr')return'könnt';
 if(/^die\s+(?:kinder|schuler|schueler|freunde|eltern|leute|personen)\b/.test(value))return'können';
 return'kann';
}
function cleanAnswers(answer){
 return [...new Set([answer,answer.replace(/[.!?]+$/,'')].map(value=>String(value||'').trim()).filter(Boolean))];
}
function buildUniqueItems(){
 return UNIQUE_ROWS.map(([subject,activity,level])=>{
  const emoji=LEVEL_EMOJIS[level];
  const answer=`${subject} ${modalFor(subject)} ${level} ${activity}.`;
  return{
   kind:'input',
   subject,
   activity,
   level,
   emoji,
   prompt:`${subject} / ${activity} / ${emoji}`,
   answer,
   answers:cleanAnswers(answer),
   hint:`Baue den Satz so: Person + richtige Form von „können“ + ${level} + Aktivität.`,
   noAudio:true
  };
 });
}
function polishTask(task){
 if(!task)return;
 task.kind='input';
 task.title='Wie gut?';
 task.description='Schreibe einen vollständigen Satz mit „können“.';
 task.items=buildUniqueItems();
 task.emojiScale={...LEVEL_EMOJIS};
 task.emojiOnly=false;
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const tasks=[...theme.tasks];
 const wieIndex=tasks.findIndex(task=>task?.id==='faehigkeiten-abstufen'||/^wie gut\??$/i.test(String(task?.title||'').trim()));
 if(wieIndex>=0){
  const wie=tasks[wieIndex];
  polishTask(wie);
  const abilityIndex=tasks.findIndex(task=>task?.id==='faehigkeit-saetze-schreiben');
  if(abilityIndex>=0){
   tasks.splice(wieIndex,1);
   const target=tasks.findIndex(task=>task?.id==='faehigkeit-saetze-schreiben');
   tasks.splice(Math.max(0,target),0,wie);
  }
 }
 tasks.forEach((task,index)=>{task.order=index+1});
 theme.tasks=tasks;
 theme.abilityEmojis={...LEVEL_EMOJIS};
 theme.wieGutEmojiRevision='l7t1-wie-gut-unique-2026-08-17-v6';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
