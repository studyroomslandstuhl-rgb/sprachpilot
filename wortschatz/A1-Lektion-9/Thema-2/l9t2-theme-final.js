(function(){
'use strict';
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function pid(){const p=profile();return String(p.canonicalStudentId||p.studentId||p.uid||p.email||localStorage.getItem('SP_STUDENT_ID')||'student').toLowerCase().replace(/[^a-z0-9äöüß@._-]+/gi,'_')}
function preview(){const r=String(localStorage.getItem('SP_LOGIN_ROLE')||localStorage.getItem('SP_ACTIVE_ROLE')||'').toLowerCase();return['teacher','lehrer','admin','owner','superadmin'].includes(r)||localStorage.getItem('SP_TEACHER_PREVIEW')==='1'||sessionStorage.getItem('SP_TEACHER_PREVIEW')==='1'}
function store(){return preview()?sessionStorage:localStorage}
function progress(id){const D=window.L9T2,all=D?.itemIds?.(id)||[];if(!all.length)return 0;let s={done:[],review:{}};try{s={...s,...JSON.parse(store().getItem(`SP_L9_${pid()}_T2_${id}`)||'{}')}}catch(e){}const done=[...new Set((s.done||[]).filter(x=>all.includes(x)))],reviews=Object.keys(s.review||{}).filter(x=>s.review[x]&&all.includes(x));const p=Math.round(done.length/all.length*100);return p>=100&&reviews.length?99:p}
function apply(){const D=window.L9T2,theme=window.L9_THEMES?.[2];if(!D||!theme)return;window.L9_THEME=theme;theme.coreVocabulary=D.cards||theme.coreVocabulary;theme.grammarExtras=D.grammarExtras||[];const practice=(D.tasks||[]).filter(t=>!t.exam),allDone=practice.every(t=>progress(t.id)>=100);theme.tasks=(D.tasks||[]).map(t=>({...t,progress:progress(t.id),locked:t.exam?!(allDone||preview()):false,href:`task.html?task=${encodeURIComponent(t.id)}&v=20260906-l9t2scope1`}));}
window.L9T2ThemeFinal={apply,progress};apply();
})();