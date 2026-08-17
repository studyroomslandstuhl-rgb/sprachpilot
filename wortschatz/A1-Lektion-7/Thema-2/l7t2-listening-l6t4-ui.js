(function(){
'use strict';
if(window.__SP_L7T2_LISTENING_L6T4_V2)return;
window.__SP_L7T2_LISTENING_L6T4_V2=true;

const AUDIO_BASE='https://sprachpilot.b-cdn.net/audio/';

function install(){
  if(!window.L7||!window.L7S||window.L7.__l7t2ListeningL6T4V2)return false;
  const S=window.L7S;
  const raw=window.L7.renderTaskPage.bind(window.L7);
  const esc=S.esc;

  function taskById(id){return S.task(id)}
  function taskNumber(task){const i=(S.T.tasks||[]).findIndex(x=>x.id===task.id);return i>=0?i+1:''}
  function key(index,q){return`l6t4listen:${index}:${q}`}
  function load(theme,task){const st=S.load(theme,task.id,task.items.length);st.answers=st.answers||{};return st}
  function saveChoice(theme,task,index,q,value){const st=load(theme,task);st.answers[key(index,q)]=value;S.save(theme,task.id,st,false)}
  function clearChoices(theme,task,index){const st=load(theme,task);for(let q=0;q<3;q++)delete st.answers[key(index,q)];S.save(theme,task.id,st,false)}
  function current(theme,task){const st=load(theme,task);if(st.done.length>=task.items.length)return null;return S.index(theme,task.id,task.items.length)}
  function nextTask(task){const tasks=S.T.tasks||[];return tasks[tasks.findIndex(x=>x.id===task.id)+1]||null}
  function progress(theme,task){const st=load(theme,task),p=Math.round(st.done.length/Math.max(1,task.items.length)*100);return`<div class="task-progress-row sp-listen-progress"><span>${st.done.length} fehlerfrei · ${task.items.length-st.done.length} übrig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`}
  function feedback(theme,task,index){
    const st=load(theme,task),tries=Number(st.tries||0),item=task.items[index];
    if(tries===1)return'<div class="l7-no">Noch nicht richtig. Höre den Tagesrückblick noch einmal und prüfe alle drei Antworten.</div>';
    if(tries===2)return'<div class="l7-hint"><strong>Hinweis:</strong> Achte genau auf Personen, Zeiten und Aktivitäten.</div>';
    if(tries>=3)return`<div class="l7-no"><strong>Lösungen:</strong>${item.questions.map((q,i)=>`<br>${i+1}. ${esc(q[2])}`).join('')}<br>Dieser Tagesrückblick kommt später noch einmal.</div>`;
    return'';
  }
  function question(theme,task,index,item,qIndex){
    const st=load(theme,task),q=item.questions[qIndex],selected=String(st.answers[key(index,qIndex)]||'');
    return`<section class="sp-l6t4-listen-question"><h2>${qIndex+1}. ${esc(q[0])}</h2><div class="sp-l6t4-listen-options">${q[1].map((option,i)=>`<button type="button" class="sp-l6t4-listen-option ${selected===option?'selected':''}" data-listen-q="${qIndex}" data-listen-value="${esc(option)}"><span class="sp-l6t4-abc">${String.fromCharCode(65+i)}</span><span>${esc(option)}</span></button>`).join('')}</div></section>`
  }
  function finish(theme,task){
    const root=document.getElementById('app'),next=nextTask(task);
    root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card l7-finish"><div>✓</div><h2>Aufgabe abgeschlossen</h2><p>Du hast alle fünf Tagesrückblicke fehlerfrei bearbeitet.</p><div class="l7-actions"><a class="l7-btn secondary" href="index.html#task-${esc(task.id)}">Zur Übersicht</a>${next&&!next.exam?`<a class="l7-btn" href="task.html?task=${encodeURIComponent(next.id)}">Nächste Aufgabe</a>`:''}</div></section><footer>© SprachPilot</footer></div>`
  }
  function render(theme,id){
    const task=taskById(id);
    if(!task?.spL7T2Listening)return raw(theme,id);
    const index=current(theme,task);
    if(index==null)return finish(theme,task);
    const item=task.items[index];
    const st=load(theme,task);
    const allSelected=item.questions.every((q,i)=>String(st.answers[key(index,i)]||'').trim());
    const audio=AUDIO_BASE+encodeURIComponent(item.audioFile);
    const root=document.getElementById('app');
    root.innerHTML=`<div class="l7-page">${S.header(theme,task.title)}<section class="l7-card sp-l6t4-listen-release"><div class="task-title-block"><span class="task-number">Aufgabe ${taskNumber(task)}</span><h1>Hören</h1></div>${progress(theme,task)}<div class="l7-instruction">Höre kurze Tagesrückblicke und antworte.</div><div class="sp-l6t4-audio"><audio controls playsinline preload="metadata"><source src="${esc(audio)}" type="audio/mpeg">Dein Browser unterstützt diese Audiodatei nicht.</audio><div class="sp-l6t4-audio-status" hidden></div></div>${item.questions.map((q,i)=>question(theme,task,index,item,i)).join('')}<div class="sp-l6t4-actions"><button type="button" class="l7-btn" id="spL6T4ListenCheck" ${allSelected?'':'disabled'}>Kontrollieren</button></div><div id="spL6T4Feedback">${feedback(theme,task,index)}</div></section><footer>© SprachPilot</footer></div>`;

    const audioEl=root.querySelector('audio'),status=root.querySelector('.sp-l6t4-audio-status');
    audioEl?.addEventListener('loadedmetadata',()=>{if(status)status.hidden=true},{once:true});
    audioEl?.addEventListener('error',()=>{if(status){status.hidden=false;status.classList.add('error');status.textContent='Die B1-Deutsch-Audiodatei konnte nicht geladen werden.'}},{once:true});

    root.querySelectorAll('[data-listen-q]').forEach(button=>button.addEventListener('click',()=>{
      const q=Number(button.dataset.listenQ);
      saveChoice(theme,task,index,q,button.dataset.listenValue);
      render(theme,task.id);
    }));
    document.getElementById('spL6T4ListenCheck')?.addEventListener('click',()=>check(theme,task,index));
  }
  function check(theme,task,index){
    const item=task.items[index],st=load(theme,task);
    if(!item||!item.questions.every((q,i)=>String(st.answers[key(index,i)]||'').trim()))return;
    const correct=item.questions.every((q,i)=>S.norm(st.answers[key(index,i)])===S.norm(q[2]));
    S.attempt(theme,task.id,task.items.length,index,correct);
    if(!correct){
      S.wrong(theme,task.id,task.items.length);
      clearChoices(theme,task,index);
      return render(theme,task.id);
    }
    clearChoices(theme,task,index);
    S.right(theme,task.id,task.items.length);
    setTimeout(()=>render(theme,task.id),350);
  }

  if(!document.getElementById('sp-l7t2-listening-l6t4-style')){
    const style=document.createElement('style');
    style.id='sp-l7t2-listening-l6t4-style';
    style.textContent=`
      .sp-l6t4-listen-release{max-width:980px;margin:0 auto}.sp-l6t4-listen-release .task-title-block{margin-bottom:16px}.sp-listen-progress{display:flex;justify-content:space-between;gap:12px;margin:12px 0 8px}.sp-l6t4-audio{margin:16px 0 18px}.sp-l6t4-audio audio{display:block;width:100%}.sp-l6t4-audio-status{margin-top:10px;padding:10px 12px;border-radius:12px;background:var(--lesson-soft,#f4effb);font-weight:800}.sp-l6t4-audio-status.error{background:#fde0dc;color:#a62618}.sp-l6t4-listen-question{margin:18px 0;padding:18px;border:2px solid var(--lesson-line,#d9ccef);border-radius:18px;background:#fff}.sp-l6t4-listen-question h2{margin:0 0 14px;font-size:1.15rem}.sp-l6t4-listen-options{display:grid;gap:10px}.sp-l6t4-listen-option{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:2px solid var(--lesson-line,#d9ccef);background:#fff;border-radius:14px;padding:11px 13px;font:inherit;font-weight:800;cursor:pointer}.sp-l6t4-listen-option.selected{outline:3px solid rgba(91,61,135,.20);border-color:var(--lesson-main-dark,#5b3d87);background:var(--lesson-soft,#f4effb)}.sp-l6t4-abc{display:inline-flex;align-items:center;justify-content:center;min-width:34px;height:34px;border-radius:50%;background:var(--lesson-main,#b397e1);font-weight:950}.sp-l6t4-actions{display:flex;justify-content:center;margin-top:22px}.sp-l6t4-actions .l7-btn{min-width:180px}.sp-l6t4-actions .l7-btn:disabled{opacity:.45;cursor:not-allowed}@media(max-width:600px){.sp-l6t4-listen-question{padding:14px}.sp-l6t4-listen-option{padding:11px}.sp-listen-progress{font-size:14px}}
    `;
    document.head.appendChild(style);
  }

  window.L7.renderTaskPage=function(theme,id){const task=taskById(id);if(task?.spL7T2Listening)return render(Number(theme),id);return raw(theme,id)};
  window.L7.__l7t2ListeningL6T4V2=true;
  return true;
}

window.L7T2ListeningL6T4UI={install};
})();
