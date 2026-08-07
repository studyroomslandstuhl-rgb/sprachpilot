import {getActiveProfile} from '/js/auth.js?v=login-main-4';

const FORMS={
 rakastaa:['rakastan','rakastat','rakastaa','rakastamme','rakastatte','rakastavat'],
 ostaa:['ostan','ostat','ostaa','ostamme','ostatte','ostavat'],
 ymmärtää:['ymmärrän','ymmärrät','ymmärtää','ymmärrämme','ymmärrätte','ymmärtävät'],
 tarvita:['tarvitsen','tarvitset','tarvitsee','tarvitsemme','tarvitsette','tarvitsevat'],
 kuulla:['kuulen','kuulet','kuulee','kuulemme','kuulette','kuulevat'],
 oppia:['opin','opit','oppii','opimme','opitte','oppivat'],
 asua:['asun','asut','asuu','asumme','asutte','asuvat'],
 tuoda:['tuon','tuot','tuo','tuomme','tuotte','tuovat'],
 olla:['olen','olet','on','olemme','olette','ovat'],
 kirjoittaa:['kirjoitan','kirjoitat','kirjoittaa','kirjoitamme','kirjoitatte','kirjoittavat'],
 valokuvata:['valokuvaan','valokuvaat','valokuvaa','valokuvaamme','valokuvaatte','valokuvaavat'],
 soittaa:['soitan','soitat','soittaa','soitamme','soitatte','soittavat'],
 kokata:['kokkaan','kokkaat','kokkaa','kokkaamme','kokkaatte','kokkaavat'],
 elää:['elän','elät','elää','elämme','elätte','elävät'],
 tulla:['tulen','tulet','tulee','tulemme','tulette','tulevat'],
 tavata:['tapaan','tapaat','tapaa','tapaamme','tapaatte','tapaavat'],
 mennä:['menen','menet','menee','menemme','menette','menevät'],
 uida:['uin','uit','ui','uimme','uitte','uivat'],
 etsiä:['etsin','etsit','etsii','etsimme','etsitte','etsivät'],
 tilata:['tilaan','tilaat','tilaa','tilaamme','tilaatte','tilaavat'],
 tehdä:['teen','teet','tekee','teemme','teette','tekevät'],
 nähdä:['näen','näet','näkee','näemme','näette','näkevät']
};
const profile=getActiveProfile()||{};
const userSlug=()=>[profile?.email,profile?.courseCode,profile?.kurs,profile?.kursnummer,profile?.vorname,profile?.nachname].filter(Boolean).join('_').toLowerCase().replace(/[^a-z0-9äöüß]+/gi,'_')||'student';
const key=()=>`SP_FI_VERB_GROUPS_PROGRESS_${userSlug()}`;
const norm=v=>String(v||'').trim().toLocaleLowerCase('fi-FI').normalize('NFC').replace(/[.,!?;:“”"'`´()…]/g,'').replace(/\s+/g,' ');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const wait=()=>new Promise(resolve=>requestAnimationFrame(()=>resolve()));

function route(){const q=new URLSearchParams(location.search);return{group:Number(q.get('group'))||0,task:q.get('task')||''}}
function state(){try{return JSON.parse(localStorage.getItem(key())||'{}')||{}}catch{return{}}}
function sentenceState(group){const s=state(),g=s[String(group)]||s[group];if(!g)return null;const run=g.runs?.[String(g.currentRun||1)];return run?.tasks?.sentence||null}
function currentDe(group){return sentenceState(group)?.current||''}
function currentTries(group){return Number(sentenceState(group)?.tries)||0}
function currentVerb(group){const de=currentDe(group);return (window.SP_FI_VERBS||[]).find(v=>v.de===de)||null}

function originalParts(original){
 const bank=()=>original.querySelector('#bank');
 const pronouns=new Set(['minä','sinä','hän','me','te','he']);
 const buttonWhere=test=>[...(bank()?.querySelectorAll('[data-src]')||[])].find(b=>test((b.textContent||'').trim()));
 return{bank,pronouns,buttonWhere};
}
async function clickOriginalSolution(original){
 const {pronouns,buttonWhere}=originalParts(original);
 buttonWhere(t=>pronouns.has(t.toLowerCase()))?.click();await wait();
 buttonWhere(t=>!pronouns.has(t.toLowerCase())&&t.toLowerCase()!=='nyt'&&t!=='.')?.click();await wait();
 buttonWhere(t=>t.toLowerCase()==='nyt')?.click();await wait();
 buttonWhere(t=>t==='.')?.click();
}
async function clickOriginalWrong(original){
 const {pronouns,buttonWhere}=originalParts(original);
 // Absichtlich falsche Reihenfolge. Dadurch nutzt die Originalaufgabe ihre eigene Fehler-/Wiederholungslogik.
 buttonWhere(t=>t.toLowerCase()==='nyt')?.click();await wait();
 buttonWhere(t=>pronouns.has(t.toLowerCase()))?.click();await wait();
 buttonWhere(t=>!pronouns.has(t.toLowerCase())&&t.toLowerCase()!=='nyt'&&t!=='.')?.click();await wait();
 buttonWhere(t=>t==='.')?.click();await wait();
}

function enhance(){
 const r=route();if(r.task!=='sentence'||!r.group)return;
 const original=document.querySelector('.sentence-block-builder');
 if(!original||original.dataset.a1Replaced==='1')return;
 const v=currentVerb(r.group),forms=FORMS[v?.fi];if(!v||!forms)return;
 original.dataset.a1Replaced='1';original.style.display='none';
 const question=document.querySelector('.question-card .question');if(question)question.textContent='Baue einen ganzen Satz. Du kannst minä oder hän benutzen.';
 const accepted=[`minä ${forms[0]} nyt.`,`hän ${forms[2]} nyt.`];
 const tokens=shuffle([
  {id:'mina',text:'Minä'},{id:'han',text:'Hän'},
  {id:'f1',text:forms[0]},{id:'f3',text:forms[2]},
  {id:'nyt',text:'nyt'},{id:'dot',text:'.'}
 ]);
 const wrap=document.createElement('div');wrap.className='sentence-block-builder fi-a1-sentence-builder';
 wrap.innerHTML='<div class="sentence-built"><span class="small">Baue den Satz.</span></div><div class="sentence-bank"></div><div class="sentence-block-actions"><button type="button" class="btn" id="fiSentenceCheck">Kontrollieren</button><button type="button" class="btn secondary" id="fiSentenceReset">Zurücksetzen</button></div><div class="sentence-block-feedback"></div>';
 original.before(wrap);
 const built=wrap.querySelector('.sentence-built'),bank=wrap.querySelector('.sentence-bank'),feedback=wrap.querySelector('.sentence-block-feedback');let chosen=[];
 function draw(){
  built.innerHTML=chosen.length?chosen.map((t,i)=>`<button type="button" class="sentence-token chosen" data-chosen="${i}">${t.text}</button>`).join(''):'<span class="small">Baue den Satz.</span>';
  bank.innerHTML=tokens.filter(t=>!chosen.includes(t)).map(t=>`<button type="button" class="sentence-token" data-token="${t.id}">${t.text}</button>`).join('');
  built.querySelectorAll('[data-chosen]').forEach(b=>b.onclick=()=>{chosen.splice(Number(b.dataset.chosen),1);draw()});
  bank.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{const t=tokens.find(x=>x.id===b.dataset.token);if(t&&chosen.length<4){chosen.push(t);draw()}});
 }
 const value=()=>chosen.map(x=>x.text).join(' ').replace(/\s+([.,!?])/g,'$1').trim();
 wrap.querySelector('#fiSentenceCheck').onclick=async()=>{
  const val=value();
  if(accepted.some(x=>norm(x)===norm(val))){
   feedback.className='sentence-block-feedback feedback ok';feedback.textContent='Richtig!';
   await clickOriginalSolution(original);
   return;
  }
  await clickOriginalWrong(original);
  const n=currentTries(r.group);
  feedback.className='sentence-block-feedback feedback no';
  feedback.innerHTML=n===1?'Da ist noch ein Fehler.':n===2?'Tipp: Subjekt – Verb – nyt – Punkt.':`Lösung zum Beispiel: <strong>${accepted[0]}</strong>`;
  chosen=[];draw();
 };
 wrap.querySelector('#fiSentenceReset').onclick=()=>{chosen=[];feedback.textContent='';feedback.className='sentence-block-feedback';draw()};
 draw();
}

let scheduled=false;function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;enhance()})}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',schedule);schedule();

const style=document.createElement('style');
style.textContent='.fi-a1-sentence-builder{display:grid;gap:14px;margin-top:16px}.fi-a1-sentence-builder .sentence-block-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.fi-a1-sentence-builder .sentence-block-feedback{text-align:center}';
document.head.appendChild(style);
