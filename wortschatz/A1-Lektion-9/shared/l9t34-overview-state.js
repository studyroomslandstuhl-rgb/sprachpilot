(function(){
'use strict';
const theme=Number(document.body?.dataset?.theme||0),D=theme===3?window.L9T3:theme===4?window.L9T4:null,T=window.L9_THEMES?.[theme];if(!D||!T)return;
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
const storage=preview()?sessionStorage:localStorage;
function progress(id){const total=D.itemIds?.(id)?.length||0;if(!total)return 0;let s={done:[],review:{}};try{s={...s,...JSON.parse(storage.getItem(`SP_L9_${pid()}_T${theme}_${id}`)||'{}')}}catch(e){}const done=[...new Set((s.done||[]).filter(x=>D.itemIds(id).includes(x)))].length;const pending=Object.keys(s.review||{}).some(x=>s.review[x]);const p=Math.round(done/total*100);return p>=100&&pending?99:p}
const tasks=(D.tasks||[]).map(t=>({...t,href:`task.html?task=${encodeURIComponent(t.id)}&v=20260906-t${theme}build1`,progress:progress(t.id),locked:false}));
const practice=tasks.filter(t=>!t.exam),ready=practice.every(t=>t.progress>=100);
for(const t of tasks)if(t.exam)t.locked=!preview()&&!ready;
T.tasks=tasks;window.L9_THEME=T;
})();