(function(){
'use strict';
if(window.__SP_L5_POINTS_READY_V6)return;
window.__SP_L5_POINTS_READY_V6=true;
window.__SP_L5_POINTS_READY=true;

const cfg=window.SP_L5_THEME||{};
const theme=String((cfg.id||'Thema-1').match(/\d+/)?.[0]||'1');
const themeKey=cfg.key||`SP_L5_T${theme}_V1`;
const topicTitle=cfg.sub||cfg.title||`A1 Lektion 5 · Thema ${theme}`;
const TASK_TITLES={
 'karteikarten.html':'Karteikarten','bild-wort.html':'Bild → Wort','wort-bild.html':'Wort → Bild','hoeren-schreiben.html':'Hören → Schreiben','trennbare-verben.html':'Trennbare Verben erkennen','trennbare-verben-im-satz.html':'Sätze bauen','marias-tag.html':'Marias Tag','was-machst-du-gern.html':'Was machst du gern?','ja-nein-fragen.html':'Ja-/Nein-Fragen','verb-passt.html':'Mini-Situationen','pruefung.html':'Prüfung',
 'hoeren.html':'Hören','sehen-schreiben.html':'Sehen → Schreiben','sprechen.html':'Sprechen','formell-informell.html':'formell ↔ informell','frage-antwort.html':'Frage / Antwort','uhrzeit-waehlen.html':'Uhrzeit wählen','schon-erst.html':'schon / erst','artikel.html':'Artikel der Zeitwörter','plural.html':'Plural der Zeitwörter',
 'sortieren.html':'Gruppen','um-am.html':'Präpositionen','hoeren-waehlen.html':'Hören','saetze-bauen.html':'Sätze bauen','plan-lesen.html':'Plan lesen','satzvarianten.html':'Satzvarianten','dialoge.html':'Dialoge','schreiben.html':'Schreiben'
};
let apiPromise=null,flushPromise=null,flushTimer=null;
const pending=new Map();
const queued=new Map();
function cleanId(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item'}
function topicId(){return cleanId(['wortschatz','A1','lektion','5','thema',theme].join('_'))}
function parse(raw){try{return JSON.parse(raw||'null')}catch(e){return null}}
function stateKey(file){return themeKey+'_'+file}
function stateFor(file){return parse(localStorage.getItem(stateKey(file)))}
function doneCount(st){return Array.isArray(st?.done)?st.done.length:0}
function totalCount(st){return Math.max(0,Number(st?.total||0))}
function percent(st){const total=totalCount(st);return total?Math.max(0,Math.min(100,Math.round(doneCount(st)/total*100))):0}
function signature(file,st){return [file,percent(st),doneCount(st),totalCount(st)].join(':')}
function signatureKey(file){return `SP_L5_POINTS_SIG_V3_${topicId()}_${file}`}
function committed(file){try{return localStorage.getItem(signatureKey(file))||''}catch(e){return''}}
function payload(file,st){const pct=percent(st);return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme,topicId:topicId(),title:topicTitle,file,taskKey:file,taskTitle:TASK_TITLES[file]||file.replace('.html',''),percent:pct,completed:pct>=100,total:totalCount(st),done:doneCount(st),countAttempt:false}}
async function progressApi(){
 if(window.SPProgress)return window.SPProgress;
 if(!apiPromise)apiPromise=import('/js/progress.js?v=points-preserve3').then(mod=>window.SPProgress||mod).catch(error=>{apiPromise=null;console.warn('SPProgress konnte nicht geladen werden',error);return null});
 return apiPromise;
}
function enqueue(file,st){
 if(!st||!totalCount(st)||percent(st)<=0)return;
 const sig=signature(file,st),method=file==='pruefung.html'?'recordExamResult':'recordTaskProgress',key=method+':'+file;
 if(committed(file)===sig||queued.get(key)===sig)return;
 queued.set(key,sig);pending.set(key,{key,file,method,payload:payload(file,st),sig});
 clearTimeout(flushTimer);flushTimer=setTimeout(flush,percent(st)>=100?60:450);
}
async function flush(){
 if(flushPromise)return flushPromise;
 if(!pending.size)return null;
 const batch=[...pending.values()];pending.clear();
 flushPromise=(async()=>{
  const api=await progressApi();if(!api){batch.forEach(item=>pending.set(item.key,item));return{ok:false,failed:batch.length}}
  let failed=0;
  for(const item of batch){
   try{
    const fn=api[item.method];if(typeof fn!=='function')throw new Error(item.method+' fehlt');
    const result=await fn(item.payload);if(result==null)throw new Error('Speichern nicht bestätigt');
    localStorage.setItem(signatureKey(item.file),item.sig);queued.delete(item.key);
   }catch(error){failed++;pending.set(item.key,item);console.warn('L5-Fortschritt wird erneut synchronisiert',item.file,error)}
  }
  if(failed){clearTimeout(flushTimer);flushTimer=setTimeout(flush,1600)}
  return{ok:failed===0,failed};
 })().finally(()=>{flushPromise=null});
 return flushPromise;
}
function resyncStoredStates(){
 try{
  const prefix=themeKey+'_';
  for(let i=0;i<localStorage.length;i++){
   const key=localStorage.key(i);if(!key||!key.startsWith(prefix))continue;
   const file=key.slice(prefix.length);if(!/\.html$/i.test(file))continue;
   const st=parse(localStorage.getItem(key));if(st&&Array.isArray(st.done)&&totalCount(st))enqueue(file,st);
  }
  if(pending.size)flush();
 }catch(error){console.warn('L5-Nachsynchronisierung fehlgeschlagen',error)}
}
const oldSave=window.saveTask;
if(typeof oldSave==='function')window.saveTask=function(file,st){oldSave(file,st);try{enqueue(file,st)}catch(e){console.warn('L5 save sync',e)}};
const oldMark=window.markTaskDone;
window.markTaskDone=function(file,total){
 if(typeof oldMark==='function'&&oldMark!==window.markTaskDone)oldMark(file,total);
 else{
  const st={total,done:[...Array(total).keys()],queue:[],current:null,tries:0,hadWrong:false};
  if(typeof window.saveTask==='function')window.saveTask(file,st);else localStorage.setItem(stateKey(file),JSON.stringify(st));
 }
 enqueue(file,stateFor(file));
};
window.syncExam=function(result){
 const pct=Math.max(0,Math.min(100,Math.round(Number(result?.percent)||0))),total=Math.max(1,Number(result?.maxScore||result?.total||100)),done=Math.round(total*pct/100),st={total,done:[...Array(done).keys()]};
 const p=payload('pruefung.html',st);p.score=Number(result?.score||done);p.maxScore=total;p.scorePercent=pct;p.stars=Number(result?.stars||(pct>=100?3:pct>=70?2:pct>=50?1:0));
 const sig=signature('pruefung.html',st),key='recordExamResult:pruefung.html';if(committed('pruefung.html')!==sig){queued.set(key,sig);pending.set(key,{key,file:'pruefung.html',method:'recordExamResult',payload:p,sig});flush()}
};
window.SP_L5_POINTS_FLUSH=flush;
window.SP_L5_POINTS_RESYNC=resyncStoredStates;
window.addEventListener('pageshow',()=>setTimeout(resyncStoredStates,180));
window.addEventListener('online',()=>setTimeout(resyncStoredStates,100));
window.addEventListener('SP_ACCOUNT_PROGRESS_READY',()=>setTimeout(resyncStoredStates,80));
window.addEventListener('SP_ACCOUNT_PROGRESS_SYNCED',()=>setTimeout(resyncStoredStates,80));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&pending.size)flush()});
window.addEventListener('pagehide',()=>{if(pending.size)flush()});
setTimeout(resyncStoredStates,400);
})();
