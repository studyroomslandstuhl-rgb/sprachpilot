(function(){
'use strict';
if(window.__SP_L8T3_WRITING_SUBJECT_CHECK_20260902_V1)return;window.__SP_L8T3_WRITING_SUBJECT_CHECK_20260902_V1=true;
const norm=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[“”„"'`´]/g,'').replace(/\s+/g,' ').trim();
const split=text=>String(text||'').split(/[.!?]+|\n+/).map(norm).filter(Boolean);
const has=(list,tests)=>list.some(s=>tests.every(t=>t instanceof RegExp?t.test(s):s.includes(norm(t))));
function missingSubjects(text){
 const ss=split(text),sub=/\b(elena|sie)\b/,missing=[];
 if(!has(ss,[sub,'homburg',/\bhat\b/,'gewohnt']))missing.push('Wohnort: Elena/sie + hat … gewohnt');
 if(!has(ss,[sub,'kellnerin','restaurant',/\bhat\b/,'gearbeitet']))missing.push('Arbeit: Elena/sie + hat … gearbeitet');
 if(!has(ss,[sub,/erfahrung/,/\bhatte\b/]))missing.push('Berufserfahrung: Elena/sie + hatte');
 if(!has(ss,[sub,'stress',/\bhatte\b/]))missing.push('Stress: Elena/sie + hatte');
 if(!has(ss,[sub,/spass/,/\bhatte\b/]))missing.push('Spaß: Elena/sie + hatte');
 if(!has(ss,[sub,'freunde',/\bhat\b/,'getroffen']))missing.push('Freunde: Elena/sie + hat … getroffen');
 if(!has(ss,[sub,'familie',/\bhat\b/,'besucht']))missing.push('Familie: Elena/sie + hat … besucht');
 return missing
}
document.addEventListener('click',e=>{
 const button=e.target?.closest?.('#spPwCheck');if(!button)return;
 const task=(window.L8_THEME?.tasks||[]).find(t=>t?.spL8T3PastWriting);if(!task)return;
 const text=String(document.getElementById('spPwText')?.value||'').trim();if(!text)return;
 const missing=missingSubjects(text);if(!missing.length)return;
 e.preventDefault();e.stopImmediatePropagation();
 try{window.L8S?.wrong?.(3,task.id,task.items.length,0,text)}catch(x){}
 const box=document.getElementById('spPwFeedback');if(box)box.innerHTML=`<div class="sp-pw-warn"><b>Subjekt prüfen.</b><br>Du darfst „Elena“ oder „sie“ benutzen und die Satzposition verändern. In diesen Inhalten fehlt aber ein grammatisch erkennbares Subjekt:<ul>${missing.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
},true);
window.L8T3WritingSubjectCheck20260902={missingSubjects};
})();
