import { db, doc, setDoc, serverTimestamp } from '/js/firebase.js';
import { getActiveProfile, getActiveRole } from '/js/auth.js';
import '/shared/points-recalculator.js?v=1';

const E=window.VerbGroupsEngine;
let syncing=false,timer=0;
const cleanId=s=>String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'item';
const uniq=a=>[...new Set((a||[]).filter(Boolean).map(String))];
function profile(){return getActiveProfile()||window.VerbGroupsProfile||{}}
function course(p=profile()){return p.kurs||p.kursnummer||p.courseCode||p.course||localStorage.getItem('SP_COURSE_CODE')||''}
function fallbackId(p=profile()){return cleanId((p.courseDocId||course(p)||'kurs')+'_'+(String(p.email||'').trim().toLowerCase()||p.vorname||p.firstName||'student'))}
function ids(p=profile()){const api=window.SPProgress;if(api?.idCandidates){try{const list=api.idCandidates(p);if(Array.isArray(list)&&list.length)return uniq(list)}catch{}}return uniq([p.docId,p.studentId,p.userId,p.uid,p.id,localStorage.getItem('SP_STUDENT_ID'),fallbackId(p)])}
function isPreview(){const role=String(getActiveRole()||localStorage.getItem('SP_LOGIN_ROLE')||'').toLowerCase();return ['teacher','lehrer','admin'].includes(role)||E?.isPreview?.()===true}
function displayName(p){return[p.vorname||p.firstName||p.name,p.nachname||p.lastName].filter(Boolean).join(' ')||p.displayName||p.email||'Schüler/in'}
async function getProgress(){if(!window.SPProgress){try{await import('/js/progress.js?v=point-audit1')}catch{}}try{return await window.SPProgress?.loadCurrentStudentProgress?.()||{}}catch{return{}}}
function groupMetadata(){const out={};for(const group of E?.GROUPS||[]){const gs=E.groupState?.(group.id),runs={};for(const[runId,run]of Object.entries(gs?.runs||{})){const tasks={};for(const task of E.LEARN||[])tasks[task]={done:(run?.tasks?.[task]?.done||[]).slice(),total:Number(run?.tasks?.[task]?.total)||group.verbs.length,completed:(run?.tasks?.[task]?.done||[]).length>=group.verbs.length};runs[runId]={tasks,exam:{bestPercent:Number(run?.exam?.bestPercent)||0,stars:Number(run?.exam?.stars)||0},completed:!!run?.completed}}out[String(group.id).padStart(2,'0')]={signature:group.signature,verbs:group.verbs.slice(),currentRun:Number(gs?.currentRun)||1,runs}}return out}
async function sync(){
 if(syncing||isPreview()||!E?.GROUPS?.length)return;syncing=true;
 try{const p=profile(),progress=await getProgress(),id=ids(p)[0];if(!id)return;const nowIso=new Date().toISOString(),metadata={...(progress.metadata||{}),verbenGroups:groupMetadata()},next={...progress,metadata},rankingPoints=Number(window.SPPointRecalculator?.calculate?.(next)?.total)||0,c=course(p),patch={metadata,ranking:{...(progress.ranking||{}),points:rankingPoints,updatedAt:nowIso},totals:{...(progress.totals||{}),points:rankingPoints,updatedAt:nowIso},lifetimePoints:rankingPoints,pointsTotal:rankingPoints,punkteGesamt:rankingPoints,studentId:id,userId:id,docId:id,canonicalStudentId:id,aliasIds:ids(p),studentName:displayName(p),email:p.email||progress.email||'',kurs:c||progress.kurs||'',kursnummer:c||progress.kursnummer||'',courseCode:c||progress.courseCode||'',lastActive:serverTimestamp(),updatedAt:serverTimestamp(),lastActiveAt:nowIso,lastPage:location.pathname};await setDoc(doc(db,'progress',id),patch,{merge:true});try{localStorage.setItem('SP_POINTS_TOTAL',String(rankingPoints));localStorage.setItem('SP_VERBEN_FIREBASE_POINTS_SYNC',nowIso)}catch{}window.SP_VERBEN_FIREBASE_SYNC={ok:true,rankingPoints,at:nowIso}}
 catch(error){console.warn('Verben-Punkte konnten nicht mit Firebase/Rangliste synchronisiert werden',error);window.SP_VERBEN_FIREBASE_SYNC={ok:false,error:String(error?.message||error),at:new Date().toISOString()}}
 finally{syncing=false}
}
function schedule(delay=700){clearTimeout(timer);timer=setTimeout(sync,delay)}
window.addEventListener('load',()=>schedule(800));window.addEventListener('pageshow',()=>schedule(500));window.addEventListener('pagehide',()=>schedule(0));document.addEventListener('click',()=>schedule(900));document.addEventListener('keydown',e=>{if(e.key==='Enter')schedule(900)});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')schedule(0)});new MutationObserver(()=>schedule(1000)).observe(document.documentElement,{childList:true,subtree:true});setTimeout(()=>schedule(0),1400);
window.SPVerbFirebaseRankingSync={sync,schedule};
