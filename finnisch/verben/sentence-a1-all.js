import {getActiveProfile} from '/js/auth.js?v=login-main-4';
const profile=getActiveProfile()||{};
const userSlug=()=>[profile?.email,profile?.courseCode,profile?.kurs,profile?.kursnummer,profile?.vorname,profile?.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
const key=()=>`SP_FI_VERB_GROUPS_PROGRESS_${userSlug()}`;
const norm=v=>String(v||'').trim().toLocaleLowerCase('fi-FI').normalize('NFC').replace(/[.,!?;:“”"'`´()…]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const wait=()=>new Promise(resolve=>requestAnimationFrame(resolve));
function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||''}}
function state(){try{return JSON.parse(localStorage.getItem(key())||'{}')||{}}catch{return{}}}
function saveState(s){try{localStorage.setItem(key(),JSON.stringify(s))}catch{}}
function sentenceState(group){const s=state(),g=s[String(group)]||s[group];if(!g)return null;const run=g.runs?.[String(g.currentRun||1)];return run?.tasks?.sentence||null}
function currentDe(group){return sentenceState(group)?.current||''}
function currentTries(group){return Number(sentenceState(group)?.tries)||0}
function currentVerb(group){const de=currentDe(group);return (window.SP_FI_VERBS||[]).find(v=>v.de===de)||null}
function markWrong(group){const s=state(),g=s[String(group)]||s[group];if(!g)return 1;const run=g.runs?.[String(g.currentRun||1)],task=run?.tasks?.sentence;if(!task)return 1;task.tries=(Number(task.tries)||0)+1;task.hadWrong=true;saveState(s);return task.tries}

function originalParts(original){const bank=()=>original.querySelector('#bank');const pronouns=new Set(['minä','sinä','hän','me','te','he']);const buttonWhere=test=>[...(bank()?.querySelectorAll('[data-src]')||[])].find(b=>test((b.textContent||'').trim()));return{pronouns,buttonWhere}}
async function clickOriginalSolution(original){const {pronouns,buttonWhere}=originalParts(original);buttonWhere(t=>pronouns.has(t.toLowerCase()))?.click();await wait();buttonWhere(t=>!pronouns.has(t.toLowerCase())&&t.toLowerCase()!=='nyt'&&t!=='.')?.click();await wait();buttonWhere(t=>t.toLowerCase()==='nyt')?.click();await wait();buttonWhere(t=>t==='.')?.click()}

const A1_SENTENCES={
 lieben:'Maria rakastaa musiikkia.',
 kaufen:'Minä ostan leipää.',
 verstehen:'Maria ymmärtää kysymyksen.',
 brauchen:'Minä tarvitsen apua.',
 hören:'Maria kuulee musiikkia.',
 lernen:'Minä opin suomea.',
 wohnen:'Maria asuu Helsingissä.',
 bringen:'Minä tuon vettä.',
 sein:'Maria on kotona.',
 schreiben:'Minä kirjoitan viestin.',
 fotografieren:'Maria valokuvaa luontoa.',
 telefonieren:'Maria soittaa ystävälle.',
 kochen:'Minä kokkaan keittoa.',
 leben:'Maria elää Suomessa.',
 kommen:'Minä tulen kotiin.',
 buchstabieren:'Minä tavaan nimeni.',
 gehen:'Maria menee kouluun.',
 schwimmen:'Minä uin uimahallissa.',
 suchen:'Maria etsii avaimia.',
 bestellen:'Minä tilaan kahvin.',
 weinen:'Maria itkee kotona.',
 reparieren:'Minä korjaan pyörän.',
 gewinnen:'Maria voittaa pelin.',
 spielen:'Minä pelaan jalkapalloa.',
 springen:'Maria hyppää korkealle.',
 verlieren:'Minä häviän pelin.',
 fragen:'Maria kysyy nimeä.',
 verkaufen:'Minä myyn auton.',
 unterschreiben:'Maria allekirjoittaa paperin.',
 reservieren:'Minä varaan pöydän.',
 buchen:'Maria varaa hotellin.',
 machen:'Minä teen ruokaa.',
 malen:'Maria maalaa kuvan.',
 trinken:'Minä juon vettä.',
 schicken:'Maria lähettää viestin.',
 denken:'Minä ajattelen asiaa.',
 winken:'Maria vilkuttaa ystävälle.',
 hassen:'Minä vihaan melua.'
};
function targetSentence(group,v){
 if(A1_SENTENCES[v.de])return A1_SENTENCES[v.de];
 const forms=window.SP_FI_ALL_FORMS?.(v.fi);
 if(!forms)return `Maria ${v.fi}.`;
 const idx=Math.max(0,(window.SP_FI_VERBS||[]).findIndex(x=>x.de===v.de));
 return idx%2===0?`Maria ${forms[2]} tänään.`:`Minä ${forms[0]} tänään.`;
}
window.SP_FI_SENTENCE_FOR_VERB=(v,group=0)=>targetSentence(group,v);
function tokens(sentence){return sentence.match(/[A-Za-zÅÄÖåäöŠŽšž]+(?:['’-][A-Za-zÅÄÖåäöŠŽšž]+)*|\d+(?::\d+)?|[^\sA-Za-zÅÄÖåäöŠŽšž\d]/g)||[]}
function speakSentence(sentence){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(sentence);u.lang='fi-FI';u.rate=.86;speechSynthesis.speak(u)}catch{}}

function enhance(){
 const r=route();if(r.task!=='sentence'||!r.group)return;
 const original=document.querySelector('.sentence-block-builder');if(!original||original.dataset.a1All==='2')return;
 const v=currentVerb(r.group);if(!v)return;
 original.dataset.a1All='2';original.style.display='none';
 const sentence=targetSentence(r.group,v);
 const question=document.querySelector('.question-card .question');if(question)question.textContent='Bringe die Wörter in die richtige Reihenfolge.';
 const source=shuffle(tokens(sentence).map((text,i)=>({id:i,text})));
 const wrap=document.createElement('div');wrap.className='sentence-block-builder fi-a1-sentence-builder';
 wrap.innerHTML='<div class="sentence-help"><button type="button" class="btn secondary" id="fiSentenceListen">🔊 Satz hören</button><span class="small">Hilfe</span></div><div class="sentence-built"><span class="small">Baue den Satz.</span></div><div class="sentence-bank"></div><div class="sentence-block-actions"><button type="button" class="btn" id="fiSentenceCheck">Kontrollieren</button><button type="button" class="btn secondary" id="fiSentenceReset">Zurücksetzen</button></div><div class="sentence-block-feedback"></div>';
 original.before(wrap);
 const built=wrap.querySelector('.sentence-built'),bank=wrap.querySelector('.sentence-bank'),feedback=wrap.querySelector('.sentence-block-feedback');let chosen=[];
 function draw(){
  built.innerHTML=chosen.length?chosen.map((t,i)=>`<button type="button" class="sentence-token chosen" data-chosen="${i}">${t.text}</button>`).join(''):'<span class="small">Baue den Satz.</span>';
  bank.innerHTML=source.filter(t=>!chosen.includes(t)).map(t=>`<button type="button" class="sentence-token" data-token="${t.id}">${t.text}</button>`).join('');
  built.querySelectorAll('[data-chosen]').forEach(b=>b.onclick=()=>{chosen.splice(Number(b.dataset.chosen),1);draw()});
  bank.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{const t=source.find(x=>x.id===Number(b.dataset.token));if(t){chosen.push(t);draw()}});
 }
 const value=()=>chosen.map(x=>x.text).join(' ').replace(/\s+([.,!?;:])/g,'$1').trim();
 wrap.querySelector('#fiSentenceListen').onclick=()=>speakSentence(sentence);
 wrap.querySelector('#fiSentenceCheck').onclick=async()=>{
  const val=value();
  if(accepted.some(x=>norm(x)===norm(val))){
   feedback.className='sentence-block-feedback feedback ok';feedback.textContent='Richtig!';
   await clickOriginalSolution(original);
   return;
  }
  const n=markWrong(r.group);feedback.className='sentence-block-feedback feedback no';feedback.innerHTML=n===1?'Da ist noch ein Fehler.':n===2?'Tipp: Höre den Satz und prüfe die Reihenfolge.':`Lösung: <strong>${sentence}</strong>`;chosen=[];draw();
 };
 wrap.querySelector('#fiSentenceReset').onclick=()=>{chosen=[];draw()};
 draw();
}
let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('popstate',schedule);schedule();
const style=document.createElement('style');style.textContent='.fi-a1-sentence-builder{display:grid;gap:14px;margin-top:16px}.fi-a1-sentence-builder .sentence-help{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap}.fi-a1-sentence-builder .sentence-block-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.fi-a1-sentence-builder .sentence-block-feedback{text-align:center}';document.head.appendChild(style);
