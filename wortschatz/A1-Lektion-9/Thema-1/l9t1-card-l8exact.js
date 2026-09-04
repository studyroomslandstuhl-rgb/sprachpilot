(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
if(window.__SP_L9T1_CARD_L8_EXACT)return;window.__SP_L9T1_CARD_L8_EXACT=true;
const LANG_LABEL={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
let scheduled=false;
function currentItem(img){
 const cards=window.L9T1?.cards||[];const src=String(img?.src||'');
 return cards.find(c=>src===String(c.image||'')||src.endsWith('/'+String(c.id||'')+'.webp')||src.includes('/'+String(c.id||'')+'.webp'))||null;
}
function add(n,...c){if(n)n.classList.add(...c)}
function build(){
 scheduled=false;
 const q=document.querySelector('#taskArea .question.card-learning');
 if(!q||q.dataset.l8Exact==='1')return;
 const imgBox=q.querySelector('.image-box'),img=imgBox?.querySelector('img'),item=currentItem(img);
 const oldMeaning=q.querySelector(':scope > .muted');
 const actions=q.querySelector(':scope > .actions');
 const listen=q.querySelector('#listen'),mic=q.querySelector('#mic'),reveal=q.querySelector('#reveal');
 const answerRow=q.querySelector(':scope > .answer-row');
 const back=q.querySelector('#back');
 const feedback=q.querySelector('#feedback'),technical=q.querySelector('#technical');
 if(!imgBox||!actions||!answerRow||!back||!mic||!reveal)return;
 q.dataset.l8Exact='1';
 document.body.classList.add('sp-l8t1-card-standard');
 const exercise=q.closest('.card');if(exercise){exercise.classList.add('l8-card-stage');exercise.classList.remove('l8-exercise');const ins=exercise.querySelector(':scope > .instruction');if(ins)ins.remove()}
 const translation=item?.translation||String(oldMeaning?.textContent||'').split(' · ')[0]||'';
 const lang=LANG_LABEL[window.L9T1Translations?.code]||'Übersetzung';
 if(oldMeaning)oldMeaning.remove();
 const wrap=document.createElement('div');wrap.className='l8-flip-wrap flip-wrap';
 const card=document.createElement('div');card.className='l8-flip-card flip-card';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Karte umdrehen');
 const front=document.createElement('div');front.className='l8-flip-face l8-flip-front flip-face flip-front';
 add(imgBox,'l8-card-visual','visual');imgBox.classList.remove('image-box');
 const frontTr=document.createElement('div');frontTr.className='l8-card-translation card-translation-box';frontTr.innerHTML='<span></span><strong></strong>';frontTr.querySelector('span').textContent=lang;frontTr.querySelector('strong').textContent=translation||'Wie heißt das auf Deutsch?';
 front.append(imgBox,frontTr);
 back.hidden=true;back.className='l8-flip-face l8-flip-back flip-face flip-back';
 const grid=document.createElement('div');grid.className='l8-flip-back-grid flip-back-grid';
 const backImg=document.createElement('div');backImg.className='l8-back-image flip-back-image';if(img){const visual=document.createElement('div');visual.className='visual small-visual pure-visual';const clone=img.cloneNode(true);clone.removeAttribute('id');visual.appendChild(clone);backImg.appendChild(visual)}
 const info=document.createElement('div');info.className='l8-back-info flip-back-info';
 const word=back.querySelector('.word-big');if(word){word.className='l8-flip-word flip-word';info.appendChild(word)}
 const backTr=frontTr.cloneNode(true);backTr.classList.add('back-translation');info.appendChild(backTr);
 const details=back.querySelector('.details');if(details){details.className='card-details';[...details.children].forEach(d=>{d.classList.add('l8-card-detail');d.classList.remove('detail')});info.appendChild(details)}
 if(listen){listen.className='l8-btn l8-audio l8-card-listen btn secondary card-listen-btn';listen.textContent='🔊 Anhören';info.appendChild(listen)}
 grid.append(backImg,info);back.appendChild(grid);
 card.append(front,back);wrap.appendChild(card);
 const newActions=document.createElement('div');newActions.className='l8-row l8-center-actions l8-card-actions actions card-actions';
 mic.className='l8-btn btn';mic.textContent='🎤 Sprechen';
 const write=document.createElement('button');write.type='button';write.id='cardWrite';write.className='l8-btn btn secondary';write.textContent='✍️ Schreiben';
 newActions.append(mic,write);
 const writeBox=document.createElement('div');writeBox.id='cardWriteBox';writeBox.className='l8-card-write l7-answer-box';writeBox.hidden=true;answerRow.classList.add('l8-answer-row');writeBox.appendChild(answerRow);
 const input=answerRow.querySelector('input');if(input)input.classList.add('l8-input');const check=answerRow.querySelector('button');if(check)check.classList.add('l8-btn','primary','btn');
 reveal.style.display='none';
 q.replaceChildren(wrap,newActions,writeBox,reveal,feedback||document.createElement('div'),technical||document.createElement('div'));
 const flip=()=>{if(card.classList.contains('flipped'))return;reveal.click();back.hidden=false;card.classList.add('flipped')};
 card.addEventListener('click',flip);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();flip()}});
 write.addEventListener('click',()=>{writeBox.hidden=false;input?.focus?.()});
 [listen,mic,write,input,check].filter(Boolean).forEach(n=>n.addEventListener('click',e=>e.stopPropagation()));
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(build)}
function start(){const root=document.getElementById('app');if(!root)return;new MutationObserver(schedule).observe(root,{childList:true,subtree:true});[0,40,120,350,900].forEach(ms=>setTimeout(build,ms))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();