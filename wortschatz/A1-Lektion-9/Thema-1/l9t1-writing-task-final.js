(function(){
'use strict';
const D=window.L9T1;if(!D)return;

/* Zielreihenfolge: Aufgabe 12 Hören, Aufgabe 13 Schreiben, Aufgabe 14 Lückentexte. */
const writingTask=(D.tasks||[]).find(t=>t.kind==='writing'||t.id==='anleitung-schreiben');
const clozeTask=(D.tasks||[]).find(t=>t.kind==='cloze'||t.id==='lueckentexte');
if(writingTask&&clozeTask){
  D.tasks=D.tasks.filter(t=>t!==writingTask&&t!==clozeTask);
  const seqIndex=D.tasks.findIndex(t=>t.kind==='sequences'||t.id==='anweisungen-hoeren');
  const insertAt=seqIndex>=0?seqIndex+1:Math.min(12,D.tasks.length);
  D.tasks.splice(insertAt,0,writingTask,clozeTask);
  writingTask.title='Anleitung schreiben';
  writingTask.description='Schreibe die Anleitung.';
}

const seq=id=>(D.sequences||[]).find(x=>x.id===id);
const make=(id,title,sequenceId,answer)=>{
  const s=seq(sequenceId)||{steps:[]};
  return {
    id,title,
    images:(s.steps||[]).map(x=>x.image),
    labels:(s.steps||[]).map(x=>x.text),
    answer,
    hint:(s.steps||[]).map(x=>x.text).join(' – ')
  };
};

/* Aufgabe 13 enthält genau dieselben vier Abläufe wie Aufgabe 12. */
D.writing=[
  make('w-fahrkarte','Fahrkarte kaufen','fahrkarte-kaufen','Zuerst muss man das Ziel wählen. Danach muss man Erwachsener oder Kind auswählen. Dann muss man das Ticket bezahlen. Zum Schluss muss man das Ticket nehmen.'),
  make('w-antrag','Antrag stellen','antrag-stellen','Zuerst muss man zum Amt gehen. Danach muss man die Formulare ausfüllen. Dann muss man die Unterlagen abgeben. Zum Schluss muss man den Antrag unterschreiben.'),
  make('w-auto','Auto mieten','auto-mieten','Zuerst muss man zur Autovermietung gehen. Danach muss man den Führerschein zeigen. Dann muss man den Vertrag lesen und unterschreiben. Zum Schluss muss man das Auto abholen.'),
  make('w-dokument','Dokument beim Amt abholen','dokument-abholen','Zuerst muss man zum Amt gehen. Danach muss man am Schalter nach dem Ausweis fragen. Dann muss man warten. Zum Schluss muss man das Dokument kontrollieren und abholen.')
];

/* Schreibhilfen direkt unter den Bildern, ohne die Bilder selbst zu beschriften. */
const style=document.createElement('style');
style.textContent=`
.sp-writing-step{min-width:0;display:flex;flex-direction:column;gap:7px;align-items:stretch}
.sp-writing-step .l9-writing-image{width:100%;aspect-ratio:1}
.sp-writing-step-label{text-align:center;font-weight:850;line-height:1.25;color:var(--lesson-main-dark);font-size:15px;padding:0 3px;min-height:38px;display:flex;align-items:flex-start;justify-content:center}
@media(max-width:520px){.sp-writing-step-label{font-size:13px;min-height:34px}}
`;
document.head.appendChild(style);

function addLabels(){
  if(String(new URLSearchParams(location.search).get('task')||'')!=='anleitung-schreiben')return;
  const area=document.getElementById('taskArea');if(!area)return;
  const title=String(area.querySelector('.l9-writing-single h3')?.textContent||'').trim();
  const item=(D.writing||[]).find(x=>x.title===title);if(!item)return;
  const grid=area.querySelector('.l9-writing-images');if(!grid||grid.dataset.spStepLabels==='1')return;
  const boxes=[...grid.children].filter(x=>x.classList?.contains('l9-writing-image'));
  boxes.forEach((box,i)=>{
    const wrap=document.createElement('div');wrap.className='sp-writing-step';
    grid.insertBefore(wrap,box);wrap.appendChild(box);
    const label=document.createElement('div');label.className='sp-writing-step-label';label.textContent=item.labels?.[i]||'';
    wrap.appendChild(label);
  });
  grid.dataset.spStepLabels='1';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addLabels,{once:true});else addLabels();
const root=document.getElementById('app');
if(root)new MutationObserver(()=>addLabels()).observe(root,{childList:true,subtree:true});
window.L9T1WritingTaskFinal={version:'20260906-1',addLabels};
})();
