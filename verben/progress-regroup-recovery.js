(function(){
'use strict';
if(window.__SP_VERB_REGROUP_RECOVERY_V2)return;
window.__SP_VERB_REGROUP_RECOVERY_V2=true;
const E=window.VerbGroupsEngine;
if(!E)return;

const originalTotalPoints=E.totalPoints.bind(E);
function profile(){
 if(window.VerbGroupsProfile&&typeof window.VerbGroupsProfile==='object')return window.VerbGroupsProfile;
 for(const key of ['SP_USER_PROFILE','SP_STUDENT_PROFILE']){
  try{const value=JSON.parse(localStorage.getItem(key)||'null');if(value&&typeof value==='object')return value}catch{}
 }
 return{};
}
function userSlug(){const p=profile();return[p.email,p.courseCode,p.kurs,p.kursnummer,p.vorname,p.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student'}
function stateKey(){return`SP_VERB_GROUPS_PROGRESS_${userSlug()}`}
function floorKey(){return`SP_VERB_POINTS_FLOOR_${userSlug()}`}
function readState(){try{return JSON.parse(localStorage.getItem(stateKey())||'null')}catch{return null}}
function runPoints(run){return Object.values(run?.awards?.tasks||{}).reduce((sum,n)=>sum+(Number(n)||0),0)+(Number(run?.awards?.examPoints)||0)}
function groupPoints(gs){return Math.max(0,Number(gs?.legacyPoints)||0)+Object.values(gs?.runs||{}).reduce((sum,run)=>sum+runPoints(run),0)}
function localHistoricalPoints(state=readState()){return Object.values(state?.groups||{}).reduce((sum,gs)=>sum+groupPoints(gs),0)}
function pointFloor(){return Math.max(0,Number(localStorage.getItem(floorKey())||0)||0)}
function preserveFloor(value){const next=Math.max(pointFloor(),Math.max(0,Number(value)||0));try{localStorage.setItem(floorKey(),String(next))}catch{}return next}

// Die Gruppenreihenfolge kommt ausschließlich aus der Lehrer-/Kursfreigabe.
// Individueller Lernstand darf die Reihenfolge nicht mehr beeinflussen.
function historicalOrder(active){return Array.isArray(active)?active.slice():[]}
function restoreDone(){return 0}

E.totalPoints=function(){return Math.max(originalTotalPoints(),pointFloor())};
function cloudModulePoints(module){let total=0;for(const topic of Object.values(module||{})){if(topic&&typeof topic==='object'&&!Array.isArray(topic))total+=Math.max(0,Number(topic?.lifetime?.points)||0)}return total}
async function refreshCloudFloor(){
 try{
  if(!window.SPProgress)await import('/js/progress.js?v=verb-regroup-recovery2');
  const progress=await window.SPProgress?.loadCurrentStudentProgress?.();
  preserveFloor(cloudModulePoints(progress?.verben||progress?.Verben||{}));
 }catch(error){console.warn('Verben-Punkteuntergrenze konnte nicht aus der Cloud gelesen werden',error)}
}
const persistence=window.SPVerbProgressPersistence;
if(persistence?.restoreCloud&&!persistence.__regroupRecoveryWrappedV2){
 persistence.__regroupRecoveryWrappedV2=true;
 const originalRestore=persistence.restoreCloud.bind(persistence);
 persistence.restoreCloud=async function(){const result=await originalRestore();await refreshCloudFloor();preserveFloor(localHistoricalPoints());return result}
}
preserveFloor(localHistoricalPoints());
window.SPVerbRegroupRecovery={historicalOrder,restoreDone,pointFloor,preserveFloor,refreshCloudFloor};
})();
