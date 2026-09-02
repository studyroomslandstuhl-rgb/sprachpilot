(function(){
'use strict';
if(window.__SP_L8T2_BOOT_AFTER_TRANSLATIONS_V11)return;
window.__SP_L8T2_BOOT_AFTER_TRANSLATIONS_V11=true;

const READY_KEYS=[
 'L8_T2_TIME_REVIEW_READY','L8_T2_QUALITY_READY','L8_T2_CURRENT_READY','L8_T2_TRANSLATIONS_READY',
 'L8_T2_VOCAB_READY','L8_T2_EXTRA_TRANSLATIONS_READY','L8_T2_MEDIA_FIXES_READY','L8_T2_VOCAB_FINAL_READY',
 'L8_T2_TASK2_PLURAL_READY','L8_T2_TASK3_SEIT_VOR_READY','L8_T2_TASK4_6_READY','L8_T2_TASK6_SIMPLE_READY',
 'L8_T2_DIALOG_GRAMMAR_READY','L8_T2_TASK7_9_READY','L8_T2_TASK7_8_POLISH_READY','L8_T2_TASK10_BIOGRAFIE_TEXT_READY',
 'L8_T2_VOCAB_PRACTICE_READY'
];
const PENDING_KEYS=['L8_T2_TIME_REVIEW_PENDING','L8_T2_QUALITY_PENDING','L8_T2_VOCAB_PENDING','L8_T2_VOCAB_FINAL_PENDING'];
const TIMEOUT_MS=700;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function uniquePromises(){
 const seen=new Set(),out=[];
 const values=[window.L8_CONTENT_READY,...READY_KEYS.map(key=>window[key])];
 for(const value of values){
  if(!value||typeof value.then!=='function'||seen.has(value))continue;
  seen.add(value);out.push(Promise.resolve(value));
 }
 return out;
}
function currentTheme(){
 const all=window.L8_ALL_THEMES||{};
 return all[2]||all['2']||(Array.isArray(all)?all.find(theme=>Number(theme?.number)===2):null)||window.L8_THEME||null;
}
async function settleContent(){
 const promises=uniquePromises();
 if(!promises.length)return 'empty';
 const state=await Promise.race([
  Promise.allSettled(promises).then(()=> 'settled'),
  sleep(TIMEOUT_MS).then(()=> 'timeout')
 ]);
 if(state==='timeout'){
  const theme=currentTheme();
  if(theme){
   window.L8_THEME=theme;
   for(const key of PENDING_KEYS){
    if(window[key]){console.warn(`L8T2: ${key} war nach ${TIMEOUT_MS} ms noch aktiv und wird für den Start freigegeben.`);window[key]=false}
   }
  }
 }
 return state;
}
function installTaskUIs(){
 try{window.L8T2BiographyPairs?.install?.()}catch(error){console.error('Biografien-UI konnte nicht installiert werden',error)}
 try{window.L8T2BiographyWrite?.install?.()}catch(error){console.error('Biografie-Schreibprüfung konnte nicht installiert werden',error)}
}
function loadBoot(){
 if(window.__SP_L8T2_SHARED_BOOT_REQUESTED)return;
 window.__SP_L8T2_SHARED_BOOT_REQUESTED=true;
 installTaskUIs();
 const script=document.createElement('script');
 script.id='sp-l8t2-shared-boot';
 script.src='../shared/l8-boot.js?v=20260902-fast2';
 script.onerror=()=>{const root=document.getElementById('app');if(root)root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h2>Die Seite konnte nicht gestartet werden.</h2><p>Bitte lade die Seite neu.</p><button class="l8-btn" type="button" onclick="location.reload()">Neu laden</button></section></div>'};
 document.body.appendChild(script);
}

settleContent().catch(error=>console.error('L8T2 Startvorbereitung',error)).finally(loadBoot);
})();