(function(){
'use strict';
if(window.__SP_L7_LISTEN_PARTICIPLE_BUNNY_FIX_V1)return;
window.__SP_L7_LISTEN_PARTICIPLE_BUNNY_FIX_V1=true;

function currentItem(){
 const S=window.L7S;
 if(!S)return null;
 const id=String(new URLSearchParams(location.search).get('task')||'');
 const task=S.task?.(id);
 if(!task||!task.spL7T2ListenParticiple||!Array.isArray(task.items))return null;
 const theme=Number(document.body.dataset.theme||0);
 const st=S.load(theme,task.id,task.items.length);
 let index=Number(st?.current);
 if(!Number.isInteger(index)||index<0||index>=task.items.length||st.done?.includes?.(index)){
  index=S.index(theme,task.id,task.items.length);
 }
 return {task,item:task.items[index],index};
}

function resolver(){
 const theme=Number(document.body.dataset.theme||0);
 if(theme===2)return window.L7T2BunnyAudio||null;
 if(theme===3)return window.L7T3BunnyAudio||null;
 return null;
}

function clearMessages(button){
 const scope=button?.closest?.('.l7-question-card,.card')||document;
 const old=scope.querySelector?.('.sp-audio-error');
 if(old)old.textContent='';
 scope.querySelectorAll?.('.bunny-audio-error').forEach(node=>node.remove());
}

function showError(button){
 const scope=button?.closest?.('.l7-question-card,.card')||document;
 const box=scope.querySelector?.('.sp-audio-error');
 if(box)box.textContent='Audio nicht verfügbar.';
}

document.addEventListener('click',event=>{
 const button=event.target instanceof Element?event.target.closest('#spListenWord'):null;
 if(!button)return;
 const current=currentItem();
 const audio=resolver();
 if(!current?.item||!audio?.play)return;
 event.preventDefault();
 event.stopPropagation();
 event.stopImmediatePropagation();
 clearMessages(button);
 const item=current.item;
 // Wichtig: zuerst den Infinitiv über den Bunny-Resolver auflösen. Dadurch werden
 // z. B. hören/hoeren und frühstücken/fruehstuecken automatisch als Kandidaten geprüft.
 const value=String(item.infinitive||item.prompt||item.audioFile||'').trim();
 if(!value){showError(button);return}
 audio.play(value,button,null,()=>showError(button));
},true);
})();
