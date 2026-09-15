(function(){'use strict';
const D=window.L10T3||{},TOPIC='wortschatz-a1-lektion-10-thema-3';
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function owner(){const p=profile();return String(p.canonicalStudentId||p.docId||p.studentId||p.userId||p.authUid||p.uid||p.id||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').trim().toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function run(){return Math.max(1,Math.min(3,Number(localStorage.getItem('SP_SCORE_RUN_'+TOPIC)||1)||1))}
function pct(s){if(!s)return 0;if(Number.isFinite(Number(s.percent)))return Math.max(0,Math.min(100,Number(s.percent)));const total=Number(s.total||0),done=Array.isArray(s.done)?s.done.length:Number(s.done||0);return total?Math.max(0,Math.min(100,Math.round(done/total*100))):0}
const stores=[localStorage,sessionStorage];
for(const t of D.tasks||[]){const suffix='_T3_'+t.id,target='SP_L10_'+owner()+suffix;let best=null,bestPct=-1;for(const st of stores){for(let i=0;i<st.length;i++){const k=st.key(i);if(!k||!k.startsWith('SP_L10_')||!k.endsWith(suffix))continue;try{const s=JSON.parse(st.getItem(k)||'null');if(!s||Number(s._run||1)!==run())continue;const p=pct(s);if(p>bestPct){bestPct=p;best=s}}catch(e){}}}if(best){try{localStorage.setItem(target,JSON.stringify(best))}catch(e){}}}
})();