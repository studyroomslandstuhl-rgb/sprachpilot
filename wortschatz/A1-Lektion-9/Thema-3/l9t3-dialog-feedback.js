(function(){
'use strict';
if(window.__SP_L9T3_DIALOG_FEEDBACK_V1)return;window.__SP_L9T3_DIALOG_FEEDBACK_V1=true;
const task=String(new URLSearchParams(location.search).get('task')||'');
if(task!=='dialog-modal')return;
const reasons=[
 'Hier ist es notwendig: Mia muss zur Behörde gehen, weil ihr Ausweis fertig ist. Deshalb passt „muss“.',
 'Lina bietet eine Möglichkeit an: Sie kann mitkommen. Deshalb passt „kann“.',
 'Mia spricht über ihren Plan bzw. Wunsch. Deshalb passt „will“.',
 'Am Automaten ist Kartenzahlung möglich. Deshalb passt „kann“.',
 'Laut telefonieren ist im Amt verboten. Bei einem Verbot benutzt man „darf“ zusammen mit „nicht“.',
 'Die Handys müssen ausgemacht werden. Das ist notwendig. Deshalb passt „müssen“.',
 'Nach dem Termin ist Kaffee trinken möglich. Deshalb passt „können“.',
 '„Unbedingt“ zeigt einen starken Wunsch bzw. Plan. Deshalb passt „will“.'
];
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function norm(v){return String(v??'').trim().toLowerCase();}
function clear(sel,row){
 sel.style.border='';sel.style.background='';sel.style.color='';
 const old=row.querySelector('.sp-l9t3-dialog-error');if(old)old.remove();
}
function mark(sel,row,line,i){
 clear(sel,row);
 if(norm(sel.value)===norm(line.answer))return;
 sel.style.border='2px solid #c62828';
 sel.style.background='#fff0f0';
 sel.style.color='#8b1d1d';
 const box=document.createElement('div');
 box.className='sp-l9t3-dialog-error';
 box.style.marginTop='8px';box.style.padding='9px 11px';box.style.borderLeft='4px solid #c62828';box.style.background='#fff0f0';box.style.color='#8b1d1d';box.style.borderRadius='6px';box.style.fontSize='.95rem';box.style.lineHeight='1.4';
 box.innerHTML='<strong>Falsch.</strong> '+esc(reasons[i]||('Richtig ist „'+line.answer+'“.'));
 row.appendChild(box);
}
document.addEventListener('click',function(e){
 const btn=e.target&&e.target.closest&&e.target.closest('#check');if(!btn)return;
 const item=window.L9T3&&window.L9T3.dialogModal;if(!item||!Array.isArray(item.lines))return;
 const rows=Array.from(document.querySelectorAll('.l9x-modal-dialog-row'));
 rows.forEach(function(row,i){const sel=row.querySelector('[data-line]');const line=item.lines[i];if(sel&&line)mark(sel,row,line,i);});
},true);
document.addEventListener('change',function(e){
 const sel=e.target;if(!sel||!sel.matches||!sel.matches('.l9x-modal-dialog-row [data-line]'))return;
 const row=sel.closest('.l9x-modal-dialog-row');const i=Number(sel.dataset.line);const line=window.L9T3&&window.L9T3.dialogModal&&window.L9T3.dialogModal.lines&&window.L9T3.dialogModal.lines[i];
 if(!row||!line)return;
 if(norm(sel.value)===norm(line.answer))clear(sel,row);
},true);
})();
