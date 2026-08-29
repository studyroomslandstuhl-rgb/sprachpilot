import { repairDativPoints } from '/shared/dativ-points-direct-repair.js?v=1';

let timer=null,lastLocal='';
function currentRaw(){
 try{
  const key=window.SPDativDirectPointRepair?.stateKey?.();
  return key?String(localStorage.getItem(key)||''):'';
 }catch{return''}
}
function schedule(delay=80){
 clearTimeout(timer);
 timer=setTimeout(()=>repairDativPoints().catch(error=>console.warn('Dativ-Punkte konnten noch nicht direkt nachgetragen werden',error)),delay);
}
function watch(){
 const raw=currentRaw();
 if(raw&&raw!==lastLocal){lastLocal=raw;schedule(60)}
}

window.addEventListener('SP_DATIVVERBEN_FIREBASE_SYNCED',()=>schedule(20));
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>schedule(80));
window.addEventListener('focus',()=>schedule(80));
window.addEventListener('online',()=>schedule(80));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule(80)});
setTimeout(()=>{lastLocal=currentRaw();schedule(20)},120);
setInterval(watch,700);
