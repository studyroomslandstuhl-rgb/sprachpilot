(function(){
'use strict';
if(window.SPTaskRuntimeStandard)return;
const path=location.pathname.match(/A1-Lektion-(\d+)\/Thema-(\d+)/i);
const taskId=String(new URLSearchParams(location.search).get('task')||'').trim();
if(!path||!taskId)return;
const lesson=Number(path[1]),theme=Number(path[2]);
const topicId=`wortschatz-a1-lektion-${lesson}-thema-${theme}`;
const topicTitle=`A1 Lektion ${lesson} · Thema ${theme}`;
let lastMetric='',justCompleted=false,metricInitialized=false;

function isPreview(){try{const role=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return ['teacher','lehrer','admin','owner','superadmin'].includes(role)||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'}catch(e){return false}}
function dataObject(){return window[`L${lesson}T${theme}`]||null}
function taskDef(){const d=dataObject();return (d?.tasks||[]).find(t=>String(t.id)===taskId)||null}
function taskTitle(){return taskDef()?.title||document.querySelector('.l8-task-title-block h1')?.textContent?.trim()||taskId.replace(/[-_]/g,' ')}
function idsFor(t){const d=dataObject();if(!d||!t)return[];switch(t.kind){case'cards':return (d.cards||[]).map(x=>x.id??x);case'listen':return (d.listen||[]).map(x=>x.id??x);case'defs':return (d.defs||[]).map(x=>x.id??x);case'speak':return (d.speak||[]).map(x=>x.id??x);case'forms':return (d.forms||[]).map(x=>x.id??x);case'gaps':return (d.gaps||[]).map(x=>x.id??x);case'modals':return (d.modals||[]).map(x=>x.id??x);case'sequences':return (d.sequences||[]).map(x=>x.id??x);case'writing':return (d.writing||[]).map(x=>x.id??x);case'cloze':return (d.cloze||[]).flatMap((_,i)=>[`csel-${i}`,`ctype-${i}`]);case'noun-article':return(d.articleNouns||[]).map(x=>x.id??x);case'noun-plural':return(d.pluralNouns||[]).map(x=>x.id??x);case'noun-dialog':return(d.nounDialogs||[]).map(x=>x.id??x);case'case-article':return(d.caseArticles||[]).map(x=>x.id??x);case'exam':return (d.exam||[]).map(x=>x.id??x);default:return[]}}
function derivedTotal(state={}){const n=Number(state.total)||0;if(n>0)return n;const t=taskDef(),ids=idsFor(t);if(ids.length)return ids.length;const d=dataObject();if(/^(karteikarten|cards)$/i.test(taskId)&&Array.isArray(d?.cards))return d.cards.length;return 0}
function metric(state={}){const total=derivedTotal(state),done=Array.isArray(state.done)?state.done.length:Math.max(0,Number(state.done)||0),percent=total?Math.min(100,Math.round(done/total*100)):0;return{total,done,percent}}
function matchesKey(key){const k=String(key||'');if(!k.startsWith(`SP_L${lesson}`))return false;const themeNeedle=`_T${theme}_`;if(!k.includes(themeNeedle))return false;return k.toLowerCase().includes(taskId.toLowerCase())}
function queue(method,payload){if(isPreview())return;try{if(window.SPProgress&&typeof window.SPProgress[method]==='function'){window.SPProgress[method](payload);return}window.SP_PROGRESS_QUEUE=window.SP_PROGRESS_QUEUE||[];window.SP_PROGRESS_QUEUE.push({method,payload});import('/js/progress.js?v=20260831-central6').catch(()=>{})}catch(e){}}
function syncState(state){if(isPreview()||/^(pruefung|exam)$/i.test(taskId))return;const m=metric(state);if(!m.total)return;const sig=`${m.done}/${m.total}/${m.percent}`;if(sig===lastMetric)return;const previous=lastMetric;lastMetric=sig;if(metricInitialized&&m.percent>=100&&previous&&!/\/100$/.test(previous))justCompleted=true;metricInitialized=true;queue('recordTaskProgress',{module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson,theme,topicId,title:topicTitle,file:`task.html?task=${taskId}`,taskKey:taskId,taskTitle:taskTitle(),total:m.total,done:m.done,percent:m.percent,completed:m.percent>=100})}
function readBestState(){let best=null,bestDone=-1;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!matchesKey(k))continue;let s;try{s=JSON.parse(localStorage.getItem(k)||'null')}catch(e){continue}if(!s||typeof s!=='object')continue;const m=metric(s);if(m.done>bestDone){best=s;bestDone=m.done}}}catch(e){}return best}

const originalSetItem=Storage.prototype.setItem;
if(!window.__SP_TASK_RUNTIME_STORAGE_PATCHED){window.__SP_TASK_RUNTIME_STORAGE_PATCHED=true;Storage.prototype.setItem=function(key,value){const out=originalSetItem.apply(this,arguments);try{if(this===localStorage&&matchesKey(key)){const state=JSON.parse(String(value||'null'));if(state&&typeof state==='object')setTimeout(()=>syncState(state),0)}}catch(e){}return out}}

function run(){const api=window.SPProgress;return Number(api?.currentRun?.(topicId)||localStorage.getItem(`SP_SCORE_RUN_${topicId}`)||1)||1}
function taskPoints(){const r=run(),api=window.SPProgress;return Number(api?.taskPointsForRun?.(r)||(r===1?5:r===2?10:15))||0}
function showFinishPoints(){const box=document.querySelector('.l8-finish');if(!box||box.dataset.spPointsShown==='1')return;box.dataset.spPointsShown='1';let text='';if(/^(pruefung|exam)$/i.test(taskId)){const st=readBestState()||{},total=derivedTotal(st),correct=Array.isArray(st.firstCorrect)?st.firstCorrect.length:0,percent=total?Math.round(correct/total*100):0,max=run()===1?100:run()===2?200:300,earned=Math.round(max*percent/100);text=`${earned} / ${max} Punkte`}else{text=justCompleted?`+${taskPoints()} Punkte`:'Punkte sind gespeichert.'}const node=document.createElement('div');node.className='l8-score-total sp-task-earned-points';node.textContent=text;const p=box.querySelector('p');(p||box.firstElementChild)?.insertAdjacentElement?.('afterend',node);if(!node.isConnected)box.appendChild(node)}

// Diese Datei synchronisiert Fortschritt/Punkte. Sie scrollt nicht selbst.
// Das einzige Scroll-System innerhalb einer Aufgabe ist SPTaskAutoScroll.
function scrollToActive(){return window.SPTaskAutoScroll?.schedule?.(0,'auto')||false}
const root=document.getElementById('app');
if(root)new MutationObserver(()=>showFinishPoints()).observe(root,{childList:true,subtree:true});
window.addEventListener('load',()=>{setTimeout(()=>{const st=readBestState();if(st)syncState(st);showFinishPoints()},120)});
setTimeout(()=>{const st=readBestState();if(st)syncState(st);showFinishPoints()},350);
window.SPTaskRuntimeStandard={version:'1.2',syncState,scrollToActive,showFinishPoints,topicId,lesson,theme,taskId};
})();
