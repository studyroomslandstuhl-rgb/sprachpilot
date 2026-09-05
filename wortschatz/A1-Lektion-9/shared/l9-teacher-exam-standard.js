(function(){
'use strict';
if(window.__SP_L9_TEACHER_EXAM_STANDARD_V1)return;
window.__SP_L9_TEACHER_EXAM_STANDARD_V1=true;

const themeNo=()=>Number(document.body?.dataset?.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||0);
const isExam=t=>!!(t&&(t.exam===true||t.isExam===true||String(t.kind||t.type||'').toLowerCase().includes('exam')||/pruefung|prüfung|exam/i.test(`${t.id||''} ${t.title||''}`))));
const examItemsOf=D=>{
 for(const value of [D?.exam,D?.examItems,D?.questions,D?.pruefung,D?.prüfung])if(Array.isArray(value))return value;
 return [];
};

function source(){const n=themeNo();return window[`L9T${n}`]||window[`L9_T${n}`]||null}
function registerDirect(spec){
 window.SP_EXAM_REGISTRY=window.SP_EXAM_REGISTRY&&typeof window.SP_EXAM_REGISTRY==='object'?window.SP_EXAM_REGISTRY:{};
 const key=`9-${spec.theme}:${spec.id}`;
 window.SP_EXAM_REGISTRY[key]={...spec,lesson:9,exam:true};
}
function normalize(){
 const n=themeNo(),D=source();if(!n||!D||!Array.isArray(D.tasks))return false;
 const task=D.tasks.find(isExam);if(!task)return false;
 const items=Array.isArray(task.items)&&task.items.length?task.items:examItemsOf(D);
 if(items.length)task.items=items;
 task.exam=true;task.kind=task.kind||'exam';task.title=task.title||'Prüfung';
 const spec={lesson:9,theme:n,id:String(task.id||'pruefung'),title:task.title,description:task.description||task.instruction||'',instruction:task.instruction||task.description||'',items:task.items||[],testHref:`task.html?task=${encodeURIComponent(task.id||'pruefung')}`};
 if(window.SPExamRegistry?.register)window.SPExamRegistry.register(spec);else registerDirect(spec);
 return true;
}
function run(){
 normalize();
 import('/js/sp-teacher-exam-reader.js?v=20260905-global3').then(()=>{normalize();window.SPTeacherExamReader?.run?.()}).catch(()=>{});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
[60,180,450,900,1600].forEach(ms=>setTimeout(run,ms));
window.addEventListener('SP_SECURE_ACCESS_CONFIRMED',()=>setTimeout(run,0));
window.SP_L9_TEACHER_EXAM_STANDARD={version:1,normalize,run};
})();
