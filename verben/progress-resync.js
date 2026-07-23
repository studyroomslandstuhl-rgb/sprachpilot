(function(){
'use strict';

const E=window.VerbGroupsEngine;
if(!E)return;

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const pad=value=>String(value).padStart(2,'0');
function hash(value){let result=2166136261;for(const char of String(value||'')){result^=char.charCodeAt(0);result=Math.imul(result,16777619)}return(result>>>0).toString(36)}
function profile(){return window.VerbGroupsProfile||{}}
function identity(){const p=profile();return clean(p.studentId||p.userId||p.docId||p.email||[p.kurs,p.vorname,p.nachname].filter(Boolean).join('_'))||'student'}
function topicId(groupId){return`verben-gruppe-${pad(groupId)}`}
function setRun(groupId,run){localStorage.setItem(`SP_SCORE_RUN_${topicId(groupId)}`,String(Math.max(1,Number(run)||1)))}
async function waitUntilReady(){for(let i=0;i<50;i++){if(window.VerbGroupsProfile&&document.querySelector('#topbar .topbar-main'))return true;await sleep(200)}return false}
async function api(){if(window.SPProgress)return window.SPProgress;try{await import('/js/progress.js?v=verb-points-1')}catch(error){console.warn('Verben-Punktesynchronisierung nicht verfügbar',error)}return window.SPProgress||null}
async function sync(){
 if(E.isPreview?.())return;
 if(!await waitUntilReady())return;
 const groups=E.GROUPS||[];
 if(!groups.length)return;
 const marker=`SP_VERBEN_CLOUD_SYNC_V2_${identity()}_${hash(groups.map(group=>group.signature).join('||'))}`;
 if(localStorage.getItem(marker)==='1')return;
 const progress=await api();
 if(!progress)return;
 try{
  for(const group of groups){
   const state=E.groupState(group.id);
   for(const [runId,run] of Object.entries(state?.runs||{})){
    setRun(group.id,runId);
    for(const task of E.LEARN||[]){
     const item=run?.tasks?.[task];
     const done=(item?.done||[]).length;
     const total=Number(item?.total)||group.verbs.length;
     if(!done&&!Number(run?.awards?.tasks?.[task]||0))continue;
     await progress.recordTaskProgress({
      module:'verben',moduleTitle:'Verben',level:'A1',lesson:`Gruppe ${group.id}`,theme:`Runde ${runId}`,
      topicId:topicId(group.id),title:`Verben · Gruppe ${group.id}`,file:task,taskKey:task,
      taskTitle:E.TASK_TITLE?.[task]||task,total,done,percent:total?Math.round(done/total*100):0,completed:total>0&&done>=total
     });
    }
    const exam=run?.exam||{};
    if(Number(exam.bestPercent||0)||Number(run?.awards?.examPoints||0)){
     await progress.recordExamResult({
      module:'verben',moduleTitle:'Verben',level:'A1',lesson:`Gruppe ${group.id}`,theme:`Runde ${runId}`,
      topicId:topicId(group.id),title:`Verben · Gruppe ${group.id}`,percent:Number(exam.bestPercent)||0,stars:Number(exam.stars)||0
     });
    }
   }
   setRun(group.id,state?.currentRun||1);
  }
  localStorage.setItem(marker,'1');
 }catch(error){console.warn('Vorhandene Verben-Punkte konnten nicht vollständig übertragen werden',error)}
}

sync();
})();