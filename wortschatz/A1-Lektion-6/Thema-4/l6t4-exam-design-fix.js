(function(){
'use strict';
const params=new URLSearchParams(location.search);
if(params.get('task')!=='exam')return;

document.body.classList.add('l6t4-exam-page');

function cleanExam(){
 const area=document.getElementById('area');
 if(!area)return;

 /* In der Prüfung darf kein Audioelement und kein technischer Ersatzblock erscheinen. */
 area.querySelectorAll('audio,.audio-file-panel,.audio-panel,.audio-load-error').forEach(element=>element.remove());
 area.querySelectorAll('.image-fallback').forEach(element=>element.remove());

 area.querySelectorAll('.visual img,.image-option img').forEach(img=>{
  const visual=img.closest('.visual');
  if(visual)visual.classList.add('exam-image-ready');
  const mark=()=>{
   if(img.naturalWidth>0&&visual){
    visual.classList.add('exam-image-ready');
    visual.querySelectorAll('.image-fallback').forEach(element=>element.remove());
   }
  };
  mark();
  img.addEventListener('load',mark,{once:true});
 });

 /* Alte zwischengespeicherte Überschriften aus früheren Hörprüfungen entfernen. */
 area.querySelectorAll('.eyebrow,.task-kicker,.question-type').forEach(element=>{
  if(/hören|audio|bild erkennen/i.test(element.textContent||''))element.remove();
 });
}

const style=document.createElement('style');
style.textContent=`
.l6t4-exam-page{-webkit-tap-highlight-color:transparent}
.l6t4-exam-page #area{overflow:hidden}
.l6t4-exam-page .question-card{width:min(760px,100%);max-width:760px;margin:18px auto;padding:22px;border:2px solid var(--lesson-line);border-radius:24px;box-shadow:none;overflow:hidden}
.l6t4-exam-page .task-title-block{margin-bottom:10px}
.l6t4-exam-page .task-title-block h1{font-size:clamp(30px,7vw,48px);line-height:1.05}
.l6t4-exam-page .task-instruction{max-width:760px;margin:14px auto 18px;padding:12px 15px}
.l6t4-exam-page .question{margin:14px auto 18px;max-width:680px;font-size:clamp(22px,5vw,32px);line-height:1.25;overflow-wrap:anywhere}
.l6t4-exam-page .option-grid{width:100%;max-width:660px;margin:18px auto 0;gap:11px}
.l6t4-exam-page .option{width:100%;min-height:62px;padding:13px 16px;border:2px solid var(--lesson-line);border-radius:18px;background:#fff;box-shadow:none;outline:none;-webkit-appearance:none;appearance:none;overflow:hidden}
.l6t4-exam-page .option:focus,.l6t4-exam-page .option:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(138,58,79,.18)}
.l6t4-exam-page .option:active{transform:none;background:var(--lesson-soft)}
.l6t4-exam-page .option.selected{background:#e9f7fb!important;border-color:#16809a!important;color:var(--text)!important;box-shadow:inset 0 0 0 1px #16809a!important}
.l6t4-exam-page .abc-list .option{grid-template-columns:38px minmax(0,1fr);text-align:left}
.l6t4-exam-page .abc-letter{flex:0 0 auto}
.l6t4-exam-page .visual{width:min(440px,100%);height:auto!important;min-height:0!important;margin:0 auto 18px;border:2px solid var(--lesson-line);border-radius:20px;background:#fff;overflow:hidden}
.l6t4-exam-page .visual.exam-image-ready{display:block!important}
.l6t4-exam-page .visual img{display:block;width:100%;height:auto!important;max-height:420px;object-fit:contain;background:#fff}
.l6t4-exam-page .image-fallback,.l6t4-exam-page audio,.l6t4-exam-page .audio-file-panel,.l6t4-exam-page .audio-panel,.l6t4-exam-page .audio-load-error{display:none!important}
.l6t4-exam-page .meaning-choice-grid{gap:12px;align-items:start}
.l6t4-exam-page .meaning-choice-grid .image-option{overflow:hidden;padding:10px;border-radius:18px}
.l6t4-exam-page .meaning-choice-grid .visual{margin:0;width:100%}
.l6t4-exam-page .chat-window{max-width:680px;margin:12px auto 18px}
.l6t4-exam-page .feedback{max-width:680px;margin-left:auto;margin-right:auto}
@media(max-width:640px){
 .l6t4-exam-page .container{width:calc(100% - 10px)}
 .l6t4-exam-page .card{padding:14px}
 .l6t4-exam-page .question-card{padding:16px 12px;border-radius:22px}
 .l6t4-exam-page .task-title-block h1{font-size:36px}
 .l6t4-exam-page .question{font-size:25px}
 .l6t4-exam-page .option-grid,.l6t4-exam-page .compact-options{grid-template-columns:1fr!important}
 .l6t4-exam-page .option{min-height:60px;font-size:17px;padding:12px 13px}
 .l6t4-exam-page .visual img{max-height:330px}
 .l6t4-exam-page .meaning-choice-grid{grid-template-columns:1fr!important}
}
`;
document.head.appendChild(style);

cleanExam();
new MutationObserver(cleanExam).observe(document.getElementById('area')||document.body,{childList:true,subtree:true});
})();