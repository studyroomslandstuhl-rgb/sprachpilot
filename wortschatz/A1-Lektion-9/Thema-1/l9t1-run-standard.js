(function(){
'use strict';
const TOPIC='wortschatz-a1-lektion-9-thema-1';
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function clearAll(){
 try{if(window.L9T1ProgressPersistence?.clearLocal){window.L9T1ProgressPersistence.clearLocal();return}}catch(e){}
 const prefix=`SP_L9_${pid()}_T1_`,keys=[];for(let i=0;i<localStorage.length;i++){const k=String(localStorage.key(i)||'');if(k.startsWith(prefix))keys.push(k)}keys.forEach(k=>localStorage.removeItem(k))
}
function clearExam(){
 try{const owner=window.L9T1ProgressPersistence?.canonicalOwner?.();if(owner)localStorage.removeItem(`SP_L9_${owner}_T1_pruefung`)}catch(e){}
 localStorage.removeItem(`SP_L9_${pid()}_T1_pruefung`)
}
function install(p){if(!p||p.__l9t1RunStandard)return;p.__l9t1RunStandard=true;const oldExam=p.recordExamResult?.bind(p);if(oldExam)p.recordExamResult=async payload=>{const run=Number(p.currentRun?.(TOPIC)||1),result=await oldExam(payload);if(Number(payload?.percent)>=100&&run<3){try{await p.recordThemeReset?.({module:'wortschatz',moduleTitle:'Wortschatz',level:'A1',lesson:9,theme:1,topicId:TOPIC,title:'A1 Lektion 9 · Thema 1'});clearAll()}catch(e){console.warn('L9T1 Durchlaufwechsel',e)}}return result};
 const observer=new MutationObserver(()=>{const h=[...document.querySelectorAll('h2')].find(x=>/Prüfung abgeschlossen/i.test(x.textContent||''));if(!h||document.getElementById('l9RetryExam'))return;const m=(h.parentElement?.textContent||'').match(/(\d+)%/),percent=Number(m?.[1]||0),run=Number(p.currentRun?.(TOPIC)||1);if(percent>=100||run>=3)return;const a=document.createElement('button');a.id='l9RetryExam';a.className='btn';a.textContent='Prüfung wiederholen';a.onclick=()=>{clearExam();location.href='task.html?task=pruefung&retry='+Date.now()};h.parentElement?.querySelector('.actions')?.appendChild(a)||h.parentElement?.appendChild(a)});observer.observe(document.documentElement,{childList:true,subtree:true})}
window.L9T1RunStandard={install};
})();