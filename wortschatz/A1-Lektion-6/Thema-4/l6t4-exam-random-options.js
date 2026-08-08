(function(){
'use strict';
if(window.__L6T4_EXAM_RANDOM_OPTIONS_V1)return;
window.__L6T4_EXAM_RANDOM_OPTIONS_V1=true;

const area=document.getElementById('area');
if(!area)return;

function randomInt(max){
 if(max<=1)return 0;
 try{
  const buf=new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]%max;
 }catch{
  return Math.floor(Math.random()*max);
 }
}
function shuffleNodes(container){
 if(!container||container.dataset.examRandomized==='1')return;
 const nodes=[...container.children].filter(node=>node.matches('button,[data-exam-answer]'));
 if(nodes.length<2)return;
 for(let i=nodes.length-1;i>0;i--){
  const j=randomInt(i+1);
  [nodes[i],nodes[j]]=[nodes[j],nodes[i]];
 }
 nodes.forEach(node=>container.appendChild(node));
 container.dataset.examRandomized='1';

 // A/B/C-Buchstaben immer nach der NEUEN Position setzen.
 [...container.querySelectorAll('[data-exam-answer]')].forEach((button,index)=>{
  const letter=button.querySelector('.abc-letter');
  if(letter)letter.textContent=String.fromCharCode(65+index);
 });
}
function randomizeCurrentQuestion(){
 area.querySelectorAll('.option-grid,.meaning-choice-grid').forEach(shuffleNodes);
}

let scheduled=false;
function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  randomizeCurrentQuestion();
 });
}

new MutationObserver(schedule).observe(area,{childList:true,subtree:true});
schedule();
})();
