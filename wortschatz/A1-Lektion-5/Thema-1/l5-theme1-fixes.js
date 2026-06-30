(function(){
const cfg=window.SP_L5_THEME||{id:'Thema-1',key:'SP_L5_T1_V1'};
const words=()=>window.WORDS||[];
const good=w=>!!(w&&w.image&&!(new Set(['einkaufen','spazieren_gehen'])).has(w.id));
const themeNo=()=>{const m=String(cfg.id||'1').match(/(\d+)/);return m?m[1]:'1'};
function total(file){const ws=words();const map={'karteikarten.html':ws.length,'bild-wort.html':ws.filter(good).length,'wort-bild.html':ws.filter(good).length,'hoeren-schreiben.html':ws.length,'trennbare-verben.html':ws.filter(w=>w.type==='verb').length,'trennbare-verben-im-satz.html':12,'marias-tag.html':11,'was-machst-du-gern.html':5,'ja-nein-fragen.html':6,'verb-passt.html':8,'pruefung.html':20};return map[file]||1}
function base(){const t=themeNo();return{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:'5',theme:t,title:`A1 Lektion 5 · Thema ${t}`}}
function q(method,payload){if(window.SPProgress&&typeof window.SPProgress[method]==='function'){window.SPProgress[method](payload);return}window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method,payload});import('/js/progress.js').catch(()=>{})}
function syncTask(file,st){try{const all=Number(st&&st.total||total(file));const done=Array.isArray(st&&st.done)?st.done.length:0;const percent=Math.round(done/all*100)||0;const titles={'trennbare-verben-im-satz.html':'Sätze bauen','verb-passt.html':'Mini-Situationen','marias-tag.html':'Marias Tag'};q('recordTaskProgress',{...base(),file,taskKey:file,taskTitle:titles[file]||String(file||'Aufgabe').replace('.html',''),total:all,done,percent,completed:percent>=100,wrongItems:st&&st.wrongItems||[]})}catch(e){}}
function syncReset(){try{q('recordThemeReset',base())}catch(e){}}
window.syncExam=function(r){try{q('recordExamResult',{...base(),score:r.score,maxScore:r.maxScore,percent:r.percent,stars:r.stars})}catch(e){}};
const oldSave=window.saveTask;
if(typeof oldSave==='function')window.saveTask=function(file,st){oldSave(file,st);syncTask(file,st)};
const oldComplete=window.complete;
if(typeof oldComplete==='function')window.complete=function(area,file,next){try{syncTask(file,window.loadTask(file,total(file)))}catch(e){}return oldComplete(area,file,next)};
window.markTaskDone=function(file,all){let st=window.loadTask(file,all);st.done=[...Array(all).keys()];st.queue=[];st.current=null;st.tries=0;st.hadWrong=false;window.saveTask(file,st)};
window.spNextSequentialIndex=function(file,all){let st=window.loadTask(file,all);if(st.done.length>=all)return null;if(st.current===null||st.current===undefined){st.current=st.done.length;st.tries=0;st.hadWrong=false;window.saveTask(file,st)}return st.current};
window.shuffle=function(a){return[...a].sort(()=>Math.random()-.5)};
window.exactAnswer=function(ans,sol){if(Array.isArray(sol))return sol.some(s=>window.exactAnswer(ans,s));return window.simple(ans)===window.simple(sol)};
window.instruction=function(text){return `<div class="task-instruction">${text}</div>`};
window.exampleBox=function(html){return `<div class="example-box"><b>Beispiel:</b><br>${html}</div>`};
const oldHeader=window.header;
if(typeof oldHeader==='function')window.header=function(title,showReset){oldHeader(title,showReset);const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();let href='index.html';if(showReset||page==='index.html')href='../index.html';if(page==='statistik.html')href='uebersicht.html';if(page==='uebersicht.html')href='index.html';const back=document.querySelector('.sp-page-nav a.btn.secondary,.nav a.btn.secondary');if(back)back.href=href};
const oldReset=window.resetThemeProgress;
window.resetThemeProgress=function(){if(!confirm('Fortschritte in diesem Thema löschen?'))return;Object.keys(localStorage).filter(k=>k.startsWith(cfg.key)).forEach(k=>localStorage.removeItem(k));syncReset();location.reload()};
})();