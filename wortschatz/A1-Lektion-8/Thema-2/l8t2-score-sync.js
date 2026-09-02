(function(){
'use strict';
if(window.__SP_L8T2_SCORE_SYNC_20260902)return;
window.__SP_L8T2_SCORE_SYNC_20260902=true;
const THEME=2;
let timer=null;
function syncNow(){
 const score=window.L8ThemeScore;
 if(!score||typeof score.syncFirebase!=='function'||window.L8S?.preview?.())return Promise.resolve(false);
 const body=document.body,previous=body.dataset.page;
 body.dataset.page='theme';
 let result;
 try{result=score.syncFirebase(THEME)}catch(error){console.warn('L8T2 Punkte-Synchronisierung',error);result=false}
 if(previous===undefined)delete body.dataset.page;else body.dataset.page=previous;
 return Promise.resolve(result).catch(error=>{console.warn('L8T2 Punkte-Synchronisierung',error);return false});
}
function schedule(delay=120){clearTimeout(timer);timer=setTimeout(syncNow,delay)}
function install(){
 const score=window.L8ThemeScore;
 if(!score||typeof score.recordState!=='function'){setTimeout(install,40);return}
 if(score.__spL8t2DirectSync)return;
 score.__spL8t2DirectSync=true;
 const originalRecord=score.recordState.bind(score);
 score.recordState=function(theme,id,state){
  const result=originalRecord(theme,id,state);
  if(Number(theme)===THEME)schedule(80);
  return result;
 };
 [180,1200,4000].forEach(ms=>setTimeout(syncNow,ms));
 window.addEventListener('online',()=>schedule(50));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(50)});
}
install();
})();
