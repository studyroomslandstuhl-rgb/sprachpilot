(function(){
'use strict';
if(window.L9T1SequenceAudioPlayer)return;
const D=window.L9T1;
if(!D)return;

const style=document.createElement('style');
style.textContent=`
.l9-sequence-player{max-width:680px;margin:14px auto 18px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center}
.l9-sequence-player audio{display:block;width:min(100%,560px);min-width:0;height:48px}
.l9-sequence-stop{min-height:44px;padding:9px 16px;border:2px solid var(--lesson-line);border-radius:13px;background:#fff;color:var(--lesson-main-dark);font:inherit;font-weight:850;cursor:pointer;touch-action:manipulation}
.l9-sequence-stop:active{transform:translateY(1px)}
@media(max-width:620px){.l9-sequence-player{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}.l9-sequence-player audio{width:100%}.l9-sequence-stop{padding:8px 12px}}
@media(max-width:390px){.l9-sequence-player{grid-template-columns:1fr}.l9-sequence-stop{width:100%}}
`;
document.head.appendChild(style);

function sequenceFromScreen(){
 const area=document.getElementById('taskArea');
 if(!area)return null;
 const title=String(area.querySelector('.l8-prompt')?.textContent||'').trim();
 return (D.sequences||[]).find(x=>String(x.title||'').trim()===title)||null;
}
function install(){
 if(String(new URLSearchParams(location.search).get('task')||'')!=='anweisungen-hoeren')return;
 const area=document.getElementById('taskArea');
 if(!area)return;
 const old=area.querySelector('#listen');
 if(!old||area.querySelector('.l9-sequence-player'))return;
 const item=sequenceFromScreen();
 if(!item?.audio)return;
 const row=old.closest('.l8-row')||old.parentElement;
 if(!row)return;
 const wrap=document.createElement('div');
 wrap.className='l9-sequence-player';
 const audio=document.createElement('audio');
 audio.controls=true;
 audio.preload='metadata';
 audio.src=item.audio;
 audio.setAttribute('controlsList','nodownload');
 audio.setAttribute('aria-label',`Audio: ${item.title}`);
 const stop=document.createElement('button');
 stop.type='button';
 stop.className='l9-sequence-stop';
 stop.textContent='⏹ Stop';
 stop.addEventListener('click',()=>{
   audio.pause();
   try{audio.currentTime=0}catch(e){}
 });
 wrap.append(audio,stop);
 row.replaceWith(wrap);
}

const root=document.getElementById('app');
if(root)new MutationObserver(install).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.L9T1SequenceAudioPlayer={version:'20260906-1',install};
})();
