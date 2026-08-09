(function(){
'use strict';
if(window.SPStudentVerbOrderLock)return;

const GROUP_SIZE=20;
const clean=value=>String(value||'').trim().toLowerCase().normalize('NFC').replace(/\s+/g,' ');
const uniq=list=>{const seen=new Set(),out=[];for(const raw of list||[]){const value=String(raw||'').trim(),key=clean(value);if(value&&key&&!seen.has(key)){seen.add(key);out.push(value)}}return out};
function slug(profile={}){return[profile.studentId,profile.userId,profile.docId,profile.email,profile.courseCode,profile.kurs,profile.kursnummer,profile.vorname,profile.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function lockKey(profile){return`SP_STUDENT_VERB_ORDER_LOCK_V1_${slug(profile)}`}
function read(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function write(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}
function verbsFromSignature(signature){const parts=String(signature||'').split('|').map(v=>v.trim()).filter(Boolean);if(['regular','strong','middle','separable','mixed','release'].includes(parts[0]))parts.shift();return uniq(parts)}
function groupVerbs(group,key=''){return uniq(group?.verbs||verbsFromSignature(group?.signature||key))}
function taskEvidence(run){let score=0;for(const task of Object.values(run?.tasks||{})){const done=Array.isArray(task?.done)?task.done.length:Number(task?.done||0);score+=done*4;if(task?.completed===true)score+=20}const exam=Number(run?.exam?.bestPercent||run?.exam?.percent||0);score+=exam;if(run?.completed===true)score+=120;return score}
function groupEvidence(group){let score=0;for(const run of Object.values(group?.runs||{}))score+=taskEvidence(run);score+=Math.max(0,(Number(group?.currentRun)||1)-1)*10;return score}
function candidateFromGroups(name,groups){if(!groups||typeof groups!=='object')return null;const entries=Object.entries(groups);if(!entries.length)return null;entries.sort((a,b)=>{const na=Number(String(a[0]).replace(/\D/g,'')),nb=Number(String(b[0]).replace(/\D/g,''));if(Number.isFinite(na)&&Number.isFinite(nb)&&na!==nb)return na-nb;return 0});const order=[],seen=new Set();let evidence=0,groupsWithEvidence=0;for(const [key,group] of entries){const verbs=groupVerbs(group,key);if(!verbs.length)continue;for(const verb of verbs){const k=clean(verb);if(!seen.has(k)){seen.add(k);order.push(verb)}}const ev=groupEvidence(group);evidence+=ev;if(ev>0)groupsWithEvidence++}if(!order.length)return null;return{name,order,evidence,groupsWithEvidence}}
function localCandidates(profile){const s=slug(profile),out=[];
 const verbState=read(`SP_VERB_GROUPS_PROGRESS_${s}`);const verbBackup=read(`SP_VERB_PROGRESS_EVIDENCE_V3_${s}`);
 const perfektState=read(`SP_PERFEKT_STABLE_${s}`);const perfektBackup=read(`SP_PERFEKT_PROGRESS_EVIDENCE_V4_${s}`);
 for(const [name,state] of [['verb-local',verbState],['verb-backup',verbBackup],['perfekt-local',perfektState],['perfekt-backup',perfektBackup]]){const c=candidateFromGroups(name,state?.groups);if(c)out.push(c)}
 return out
}
function cloudCandidates(progress){const out=[];const meta=progress?.metadata||{};
 const frozen=uniq(meta.verbCatalogOrder||meta.studentVerbOrder||[]);if(frozen.length)out.push({name:'cloud-frozen',order:frozen,evidence:1e9,groupsWithEvidence:999});
 for(const [name,groups] of [['cloud-verben',meta.verbenGroups],['cloud-perfekt',meta.perfektGroups]]){const c=candidateFromGroups(name,groups);if(c)out.push(c)}
 return out
}
function overlap(order,activeSet){let n=0;for(const verb of order||[])if(activeSet.has(clean(verb)))n++;return n}
function rankCandidate(candidate,active){const activeSet=new Set(active.map(clean)),hit=overlap(candidate.order,activeSet);if(!hit)return-1;const coverage=hit/Math.max(1,Math.min(active.length,candidate.order.length));if(candidate.order.length>=GROUP_SIZE&&coverage<.5)return-1;return candidate.evidence*1000+candidate.groupsWithEvidence*100+hit}
async function progress(){try{if(window.SPProgress?.loadCurrentStudentProgress)return await window.SPProgress.loadCurrentStudentProgress()||{};await import('/js/progress.js?v=student-order-lock1');return await window.SPProgress?.loadCurrentStudentProgress?.()||{}}catch{return{}}}
async function resolve({profile={},active=[]}={}){
 const released=uniq(active);if(!released.length)return released;
 const activeMap=new Map(released.map(v=>[clean(v),v])),activeSet=new Set(activeMap.keys());
 const existing=read(lockKey(profile));
 let master=uniq(existing?.order||existing||[]),source=existing?.source||'local-lock';
 if(!master.length){
  const cloud=await progress(),candidates=[...cloudCandidates(cloud),...localCandidates(profile)];
  let best=null,bestRank=-1;
  for(const candidate of candidates){const rank=rankCandidate(candidate,released);if(rank>bestRank){best=candidate;bestRank=rank}}
  if(best){master=uniq(best.order);source=best.name}else{master=released.slice();source='course-order'}
 }
 const seen=new Set(master.map(clean));for(const verb of released){const key=clean(verb);if(!seen.has(key)){seen.add(key);master.push(verb)}}
 const visible=[];for(const verb of master){const key=clean(verb);if(activeSet.has(key)){visible.push(activeMap.get(key));activeSet.delete(key)}}for(const verb of released){const key=clean(verb);if(activeSet.has(key)){visible.push(verb);activeSet.delete(key)}}
 const record={version:1,order:master,source,updatedAt:new Date().toISOString()};write(lockKey(profile),record);
 window.SP_STUDENT_VERB_ORDER_LOCK={...record,visible:visible.slice(),groupSize:GROUP_SIZE};
 return visible
}
function current(){return window.SP_STUDENT_VERB_ORDER_LOCK||null}
window.SPStudentVerbOrderLock={resolve,current,lockKey,slug};
})();
