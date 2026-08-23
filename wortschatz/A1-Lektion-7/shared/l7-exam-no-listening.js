(function(){
'use strict';
if(window.__SP_L7_EXAM_NO_LISTENING_V1)return;
window.__SP_L7_EXAM_NO_LISTENING_V1=true;

const MEDIA_KEY=/(?:audio|sound|listen|hoer|hör)/i;
const TEXT_KEY=/(?:task|source|kind|type|mode|title|prompt|instruction|description|hint)/i;
const LISTENING_TEXT=/(?:^|[\s_\/-])(?:audio|listen(?:ing)?|hoer(?:e|en)?|hör(?:e|en)?)(?:$|[\s_\/-])/i;
const MEDIA_FILE=/\.(?:mp3|wav|ogg|m4a)(?:[?#].*)?$/i;

function hasContent(value){
 if(typeof value==='string')return value.trim().length>0;
 if(Array.isArray(value))return value.length>0;
 if(value&&typeof value==='object')return Object.keys(value).length>0;
 return Boolean(value);
}

function requiresListening(value,key='',seen=new WeakSet()){
 if(value==null)return false;
 const keyText=String(key||'');
 if(MEDIA_KEY.test(keyText)&&hasContent(value))return true;
 if(typeof value==='string'){
  const text=value.trim();
  if(MEDIA_FILE.test(text))return true;
  if(TEXT_KEY.test(keyText)&&LISTENING_TEXT.test(text))return true;
  return false;
 }
 if(typeof value!=='object')return false;
 if(seen.has(value))return false;
 seen.add(value);
 if(Array.isArray(value))return value.some(item=>requiresListening(item,keyText,seen));
 return Object.entries(value).some(([childKey,childValue])=>requiresListening(childValue,childKey,seen));
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const themeNumber=document.body?.dataset?.theme||'x';
 const revision=`l7t${themeNumber}-exam-no-listening-20260823-v1`;
 for(const exam of theme.tasks.filter(task=>task?.exam)){
  if(!Array.isArray(exam.items))continue;
  exam.items=exam.items.filter(item=>!requiresListening(item));
  exam.contentVersion=revision;
 }
 theme.examRevision=revision;
 window.L7_THEME=theme;
 return theme;
});
})();
