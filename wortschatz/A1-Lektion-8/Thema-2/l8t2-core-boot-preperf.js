(function(){
'use strict';
if(window.__SP_L8T2_CORE_LIGHT_BOOT_20260902_V1)return;
window.__SP_L8T2_CORE_LIGHT_BOOT_20260902_V1=true;
let started=false;
function readJson(key){try{return JSON.parse(localStorage.getItem(key)||'null')||{}}catch(e){return{}}}
function teacherAccess(){
 const roles=['teacher','lehrer','admin','owner','superadmin'];
 const stored=['SP_LOGIN_ROLE','SP_ACTIVE_ROLE','SP_USER_ROLE','SP_AUTH_ROLE'].map(key=>String(localStorage.getItem(key)||'').trim().toLowerCase());
 if(stored.some(v=>roles.includes(v)))return true;
 const access=String(window.SP_SECURE_ACCESS?.type||'').toLowerCase();if(access==='teacher'||access==='teacher-preview'||window.spTeacherCanSeeAll===true)return true;
 return [readJson('SP_TEACHER_PROFILE'),readJson('SP_USER_PROFILE')].some(p=>p?.isTeacher===true||p?.teacher===true||p?.admin===true||p?.owner===true||roles.includes(String(p?.role||p?.loginRole||p?.type||p?.accountType||'').toLowerCase()))
}
function installTeacherAccess(){if(!teacherAccess()||!window.L8S)return;try{window.L8S.preview=()=>true;window.L8S.allDone=()=>true;window.spTeacherCanSeeAll=true}catch(e){}}
function theme(){const all=window.L8_ALL_THEMES||{},t=all[2]||all['2']||(Array.isArray(all)?all.find(x=>Number(x?.number)===2):null)||window.L8_THEME;if(t){t.number=2;window.L8_THEME=t}return t||null}
function showError(text){const root=document.getElementById('app');if(root)root.innerHTML=`<div class="l8-wrap"><section class="l8-card"><h2>Die Aufgabe konnte nicht geladen werden.</h2><p>${text}</p><button class="l8-btn" type="button" onclick="location.reload()">Neu laden</button></section></div>`}
async function waitContent(){const ready=window.L8_CONTENT_READY;if(!ready||typeof ready.then!=='function')return;await Promise.race([Promise.resolve(ready).catch(()=>{}),new Promise(resolve=>setTimeout(resolve,1200))])}
async function start(){
 if(started)return;started=true;
 await waitContent();
 const t=theme();
 if(!t||!window.L8S||!window.L8UI){showError('Lerninhalte oder Fortschrittssystem sind nicht bereit.');return}
 installTeacherAccess();
 try{window.L8CardBunnyStandardV4?.patchTheme?.(t)}catch(e){}
 try{window.L8AudioCoreSafeV3?.install?.()}catch(e){}
 try{if(document.body.dataset.page==='theme')window.L8UI.themeOverview();else window.L8UI.taskPage()}catch(error){console.error('L8T2 Renderfehler',error);showError('Beim Anzeigen der Aufgabe ist ein Fehler aufgetreten.');return}
 if(teacherAccess())import('/js/sp-teacher-exam-reader.js?v=20260902-1').then(()=>window.SPTeacherExamReader?.run?.()).catch(()=>{});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
