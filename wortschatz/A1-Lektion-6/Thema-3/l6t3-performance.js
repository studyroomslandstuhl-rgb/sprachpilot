(function(){
'use strict';
if(window.__L6T3_PERFORMANCE_FIX_V2)return;
window.__L6T3_PERFORMANCE_FIX_V2=true;

const originalLoad=typeof window.loadTask==='function'?window.loadTask.bind(window):null;
const originalSync=typeof window.syncTask==='function'?window.syncTask.bind(window):null;
const cache=new Map();
const pendingSync=new Map();
let syncTimer=0;
let flushing=false;

function cloneState(state){
 return state&&typeof state==='object'?{
  ...state,
  done:Array.isArray(state.done)?state.done.slice():[],
  queue:Array.isArray(state.queue)?state.queue.slice():[]
 }:state;
}

function cacheKey(file,total){return String(file||'')+'|'+String(total||0)}

window.loadTask=function(file,total){
 const key=cacheKey(file,total);
 if(cache.has(key))return cloneState(cache.get(key));
 const state=originalLoad?originalLoad(file,total):{total,done:[],queue:[...Array(total).keys()],current:null,tries:0,hadWrong:false};
 cache.set(key,cloneState(state));
 return cloneState(state);
};

function runIdle(callback){
 if(typeof requestIdleCallback==='function')requestIdleCallback(callback,{timeout:2500});
 else setTimeout(callback,80);
}

function scheduleSync(delay=3500){
 clearTimeout(syncTimer);
 syncTimer=setTimeout(flushSync,delay);
}

function flushSync(){
 clearTimeout(syncTimer);syncTimer=0;
 if(flushing||!pendingSync.size||document.hidden)return;
 flushing=true;
 const entries=[...pendingSync.entries()];
 pendingSync.clear();
 runIdle(async()=>{
  try{
   for(const [file,state] of entries){
    try{
     const currentSync=typeof window.syncTask==='function'?window.syncTask:originalSync;
     if(currentSync&&currentSync!==queueSync)await currentSync(file,cloneState(state));
     else if(originalSync)await originalSync(file,cloneState(state));
    }catch(error){console.warn('L6T3-Fortschritt konnte nicht synchronisiert werden:',error)}
   }
  }finally{
   flushing=false;
   if(pendingSync.size)scheduleSync(2500);
  }
 });
}

function queueSync(file,state){
 pendingSync.set(String(file||''),cloneState(state));
 const total=Number(state&&state.total)||0;
 const done=Array.isArray(state&&state.done)?state.done.length:Number(state&&state.done)||0;
 scheduleSync(total>0&&done>=total?700:5000);
 return state;
}

window.saveTask=function(file,state){
 const total=Number(state&&state.total)||0;
 const stored=cloneState(state);
 cache.set(cacheKey(file,total),stored);
 try{localStorage.setItem(window.taskKey(file),JSON.stringify(stored))}catch(error){console.warn('L6T3-Fortschritt konnte lokal nicht gespeichert werden:',error)}
 queueSync(file,stored);
 return state;
};

window.addEventListener('storage',event=>{
 if(!event.key||event.key.startsWith('SP_L6_T3'))cache.clear();
},{passive:true});
window.addEventListener('online',()=>scheduleSync(900),{passive:true});
window.addEventListener('pagehide',flushSync,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&pendingSync.size)scheduleSync(700)},{passive:true});
})();
