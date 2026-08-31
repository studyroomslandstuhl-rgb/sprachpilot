(function(){
'use strict';
if(window.__SP_L8_LISTENING_AUDIO_V2)return;
window.__SP_L8_LISTENING_AUDIO_V2=true;

const CDN='https://sprachpilot.b-cdn.net/audio/';
const n=Number(document.body?.dataset?.theme||0);
const isUrl=v=>/^https?:\/\//i.test(String(v||'').trim());
const isAudioRef=v=>{const s=String(v||'').trim();return !!s&&(isUrl(s)||/^audio\//i.test(s)||/\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(s));};
const natural=v=>{const s=String(v||'').trim();return !!s&&!isAudioRef(s)&&(/[\s.!?,;:äöüÄÖÜß]/.test(s)||s.length>24);};
function decodeFakeTranscript(value){
 const raw=String(value||'').trim();if(!/^https?:\/\/sprachpilot\.b-cdn\.net\/audio\//i.test(raw))return'';
 try{
  const name=decodeURIComponent(raw.split(/[?#]/)[0].split('/').pop()||'').replace(/\.(mp3|wav|ogg|m4a)$/i,'').trim();
  // Real audio filenames in SprachPilot are normally technical slugs like l8t1_hoeren_01.
  // A decoded value with spaces/punctuation is the old transcript that was wrongly converted to a URL.
  if(/[\s.!?,;:äöüÄÖÜß]/.test(name)&&!/^(?:l8|audio|hoeren|hören|listen)[_-]/i.test(name))return name;
 }catch(e){}
 return'';
}
function normalizeFile(value){
 const raw=String(value||'').trim();if(!raw)return'';
 if(isUrl(raw))return raw;
 return CDN+raw.replace(/^audio\//i,'');
}
function listeningTask(task){const s=`${task?.id||''} ${task?.title||''} ${task?.kind||''} ${task?.instruction||''}`.toLowerCase();return /hör|hoer|listen|audio/.test(s);}
function repairItem(item){
 if(!item||typeof item!=='object')return;
 const decoded=decodeFakeTranscript(item.audio);
 const explicitText=[item.audioText,item.listenText,item.spokenText,item.transcript,item.voiceText].find(natural)||'';
 let transcript=explicitText||decoded;
 let file='';
 for(const key of ['audioFile','audioSrc','audioUrl','file']){
  const value=item[key];if(isAudioRef(value)){file=normalizeFile(value);break;}
 }
 if(!file&&isAudioRef(item.audio)&&!decoded)file=normalizeFile(item.audio);
 if(!transcript&&natural(item.audio))transcript=String(item.audio).trim();
 if(transcript){item.audioText=transcript;item.audio=transcript;}
 else if(isAudioRef(item.audio)){item.audio='';}
 if(file){item.audioFile=file;item.audioSrc=file;}
}
function repairTheme(){
 const all=window.L8_ALL_THEMES||{},theme=all[n]||all[String(n)]||window.L8_THEME;if(!theme)return theme;
 for(const task of theme.tasks||[]){if(!listeningTask(task))continue;for(const item of task.items||[])repairItem(item);}
 if(window.L8_THEME&&Number(window.L8_THEME.number)===n)window.L8_THEME=theme;
 return theme;
}

const previousContent=window.L8_CONTENT_READY;
const previousT2=window.L8_T2_VOCAB_FINAL_READY;
const previousT3=window.L8_T3_VOCAB_READY;
const ready=Promise.all([Promise.resolve(previousContent),Promise.resolve(previousT2),Promise.resolve(previousT3)]).then(()=>repairTheme());
window.L8_CONTENT_READY=ready.then(()=>window.L8_ALL_THEMES);
if(n===2&&previousT2)window.L8_T2_VOCAB_FINAL_READY=ready.then(()=>repairTheme());
if(n===3&&previousT3)window.L8_T3_VOCAB_READY=ready.then(()=>repairTheme());

function patchSay(){
 const S=window.L8S;if(!S||typeof S.say!=='function'||S.say.__spListeningAudioV2)return false;
 const original=S.say.bind(S);
 const safe=function(text,audioFile){
  let spoken=String(text||'').trim(),file=String(audioFile||'').trim();
  const decoded=decodeFakeTranscript(spoken);
  if(decoded){spoken=decoded;if(!file)file='';}
  if(!file&&isAudioRef(spoken)&&!decoded){file=spoken;spoken='';}
  if(isAudioRef(spoken))spoken='';
  return original(spoken,file);
 };
 safe.__spListeningAudioV2=true;S.say=safe;return true;
}
if(!patchSay()){let tries=0;const timer=setInterval(()=>{if(patchSay()||++tries>100)clearInterval(timer)},20);}
window.L8ListeningAudioV2={repairTheme,repairItem,decodeFakeTranscript};
})();
