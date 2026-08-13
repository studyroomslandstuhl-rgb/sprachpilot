(function(){
'use strict';
if(window.__SP_L7T1_WIE_GUT_EMOJIS_1)return;
window.__SP_L7T1_WIE_GUT_EMOJIS_1=true;

const LEVEL_EMOJIS=Object.freeze({
 'gar nicht':'😭',
 'nicht so gut':'🙁',
 'gut':'🙂',
 'sehr gut':'🤩'
});
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
function convert(value){
 if(typeof value==='string')return starEmoji(value)||value;
 if(Array.isArray(value))return value.map(convert);
 if(!value||typeof value!=='object')return value;
 const out={...value};
 ['label','text','value','answer','word'].forEach(key=>{if(key in out)out[key]=convert(out[key])});
 if(Array.isArray(out.options))out.options=out.options.map(convert);
 if(Array.isArray(out.answers))out.answers=out.answers.map(convert);
 return out;
}
function polishTask(task){
 if(!task)return;
 task.description='Wähle das passende Emoji.';
 task.items=(task.items||[]).map(item=>convert(item));
 task.emojiScale={...LEVEL_EMOJIS};
}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const tasks=[...theme.tasks];
 const wieIndex=tasks.findIndex(task=>task?.id==='faehigkeiten-abstufen'||/^wie gut\??$/i.test(String(task?.title||'').trim()));
 const abilityIndex=tasks.findIndex(task=>task?.id==='faehigkeit-saetze-schreiben');
 if(wieIndex>=0){
  const wie=tasks[wieIndex];
  polishTask(wie);
  if(abilityIndex>=0){
   tasks.splice(wieIndex,1);
   const target=tasks.findIndex(task=>task?.id==='faehigkeit-saetze-schreiben');
   tasks.splice(Math.max(0,target),0,wie);
  }
 }
 tasks.forEach((task,index)=>{task.order=index+1});
 theme.tasks=tasks;
 theme.abilityEmojis={...LEVEL_EMOJIS};
 theme.wieGutEmojiRevision='l7t1-wie-gut-emojis-2026-08-13-v1';
 window.L7_THEME=theme;
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
