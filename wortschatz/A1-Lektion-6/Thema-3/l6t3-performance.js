(function(){
'use strict';
if(window.__L6T3_PERFORMANCE_FIX)return;
window.__L6T3_PERFORMANCE_FIX=true;

const originalSync=typeof window.syncTask==='function'?window.syncTask.bind(window):null;
const pending=new Map();
let timer=0;
let flushing=false;

function runIdle(callback){
 if(typeof requestIdleCallback==='function')requestIdleCallback(callback,{timeout:1800});
 else setTimeout(callback,40);
}

function flush(){
 clearTimeout(timer);timer=0;
 if(flushing||!pending.size||document.hidden)return;
 flushing=true;
 const entries=[...pending.entries()];
 pending.clear();
 runIdle(async()=>{
  try{
   for(const [file,state] of entries){
    try{if(originalSync)await originalSync(file,state)}catch(error){console.warn('L6T3-Fortschritt konnte nicht synchronisiert werden:',error)}
   }
  }finally{
   flushing=false;
   if(pending.size)schedule(1200);
  }
 });
}

function schedule(delay=1400){
 clearTimeout(timer);
 timer=setTimeout(flush,delay);
}

window.syncTask=function(file,state){
 pending.set(String(file||''),state);
 const total=Number(state&&state.total)||0;
 const done=Array.isArray(state&&state.done)?state.done.length:Number(state&&state.done)||0;
 schedule(total>0&&done>=total?250:1400);
 return state;
};

window.saveTask=function(file,state){
 try{localStorage.setItem(window.taskKey(file),JSON.stringify(state))}catch(error){console.warn('L6T3-Fortschritt konnte lokal nicht gespeichert werden:',error)}
 window.syncTask(file,state);
 return state;
};

window.addEventListener('online',()=>schedule(500),{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&pending.size)schedule(400)},{passive:true});
})();
