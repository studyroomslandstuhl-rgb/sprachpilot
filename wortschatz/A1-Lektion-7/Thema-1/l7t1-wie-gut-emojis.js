(function(){
'use strict';
if(window.__SP_L7T1_WIE_GUT_EMOJIS_5)return;
window.__SP_L7T1_WIE_GUT_EMOJIS_5=true;

const LEVEL_EMOJIS=Object.freeze({
 'gar nicht':'😭',
 'nicht so gut':'🙁',
 'gut':'🙂',
 'sehr gut':'🤩'
});
const EMOJI_LEVELS=Object.freeze(Object.fromEntries(Object.entries(LEVEL_EMOJIS).map(([level,emoji])=>[emoji,level])));
const ORDERED=['😭','🙁','🙂','🤩'];

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
function resolveEmoji(item){
 const direct=[item?.emoji,item?.level,item?.rating,item?.score,item?.stars,item?.value,item?.text,item?.label];
 for(const value of direct){
  const result=starEmoji(value);
  if(result)return result;
 }
 const prompt=String(item?.prompt||'');
 const promptEmoji=ORDERED.find(emoji=>prompt.includes(emoji));
 if(promptEmoji)return promptEmoji;
 const parts=prompt.split('/').map(value=>value.trim()).filter(Boolean);
 return starEmoji(parts[2]||'');
}
function sentenceCandidate(item){
 const values=[item?.answer,...(Array.isArray(item?.answers)?item.answers:[]),item?.solution,item?.sentence,item?.text];
 const sentence=values.map(value=>String(value||'').trim()).find(value=>/\b(?:kann|kannst|können|könnt)\b/i.test(value)&&value.split(/\s+/).length>=4);
 return sentence||'';
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
function cueParts(item){
 const prompt=String(item?.prompt||'').trim();
 const parts=prompt.split('/').map(value=>value.trim()).filter(Boolean);
 const subject=String(item?.subject||parts[0]||'').trim();
 const activity=String(item?.activity||parts[1]||'').trim();
 const emoji=resolveEmoji(item)||'';
 const level=String(item?.level||EMOJI_LEVELS[emoji]||'').trim();
 return{subject,activity,emoji,level};
}
function buildSentence(item){
 const{subject,activity,level}=cueParts(item);
 if(subject&&activity&&level)return`${subject} ${modalFor(subject)} ${level} ${activity}.`;
 const existing=sentenceCandidate(item);
 return existing||String(item?.answer||'').trim();
}
function cleanAnswers(answer){
 return [...new Set([answer,answer.replace(/[.!?]+$/,'')].map(value=>String(value||'').trim()).filter(Boolean))];
}
function polishTask(task){
 if(!task)return;
 task.kind='input';
 task.title='Wie gut?';
 task.description='Schreibe einen vollständigen Satz mit „können“.';
 task.items=(task.items||[]).map(original=>{
  const item={...original};
  const{subject,activity,emoji,level}=cueParts(item);
  const answer=buildSentence(item);
  const prompt=[subject,activity,emoji].filter(Boolean).join(' / ')||String(item.prompt||'').trim();
  const output={
   ...item,
   kind:'input',
   prompt,
   subject,
   activity,
   emoji,
   level,
   answer,
   answers:cleanAnswers(answer),
   hint:`Baue den Satz so: Person + richtige Form von „können“ + ${level||'Abstufung'} + Aktivität.`,
   noAudio:true
  };
  delete output.options;
  delete output.noHelp;
  return output;
 });
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
 theme.wieGutEmojiRevision='l7t1-wie-gut-emojis-only-2026-08-17-v5';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
