(function(){
'use strict';
if(window.__SP_L7_READING_QUEUE_FIX_V1)return;
window.__SP_L7_READING_QUEUE_FIX_V1=true;

function install(){
 if(!window.L7||!window.L7S||window.L7.__spReadingQueueFixV1)return false;
 const S=window.L7S,raw=window.L7.renderTaskPage.bind(window.L7),esc=S.esc;
 function selected(st,key){return String(st.answers?.[key]??'')}
 function saveChoice(theme,t,key,value){
  const st=S.load(theme,t.id,t.items.length);st.answers=st.answers||{};st.answers[key]=value;S.save(theme,t.id,st,false)
 }
 function progress(theme,t){
  const st=S.load(theme,t.id,t.items.length),total=Math.max(1,t.items.length),p=Math.min(100,Math.round((st.done?.length||0)/total*100));
  return`<div class="l7-progress-row"><span>${st.done?.length||0} von ${t.items.length} fertig</span><strong>${p}%</strong></div><div class="l7-progress"><span style="width:${p}%"></span></div>`
 }
 function shell(theme,t,body){return`<div class="l7-page">${S.header(theme,t.title)}<section class="l7-card">${progress(theme,t)}<div class="l7-instruction">Lies den Text und antworte.</div>${body}</section><footer>© SprachPilot</footer></div>`}
 function complete(theme,t,index){
  const st=S.load(theme,t.id,t.items.length),item=t.items[index];let q=0;
  for(const [text,answer] of (item.tf||[])){if(selected(st,`read:${index}:${q++}`)==='')return false}
  for(const [text,options,answer] of (item.abc||[])){if(selected(st,`read:${index}:${q++}`)==='')return false}
  return true
 }
 function render(theme,t){
  const total=t.items.length,first=S.load(theme,t.id,total);
  if((first.done?.length||0)>=total)return raw(theme,t.id);
  const index=S.index(theme,t.id,total);
  if(index==null)return raw(theme,t.id);
  const st=S.load(theme,t.id,total),item=t.items[index];if(!item)return raw(theme,t.id);
  let q=0;
  const tf=(item.tf||[]).map(([text,answer])=>{const key=`read:${index}:${q++}`,v=selected(st,key);return`<div class="sp-read-q"><strong>${esc(text)}</strong><div class="sp-choice-row"><button type="button" data-read-key="${key}" data-read-value="true" class="${v==='true'?'selected':''}">Richtig</button><button type="button" data-read-key="${key}" data-read-value="false" class="${v==='false'?'selected':''}">Falsch</button></div></div>`}).join('');
  const abc=(item.abc||[]).map(([text,options,answer])=>{const key=`read:${index}:${q++}`,v=selected(st,key);return`<div class="sp-read-q"><strong>${esc(text)}</strong><div class="sp-choice-row">${(options||[]).map(x=>`<button type="button" data-read-key="${key}" data-read-value="${esc(x)}" class="${v===x?'selected':''}">${esc(x)}</button>`).join('')}</div></div>`}).join('');
  const root=document.getElementById('app');if(!root)return;
  root.innerHTML=shell(theme,t,`<div class="l7-question-card"><div class="sp-text-frame">${esc(item.text||'')}</div><div class="sp-question-list">${tf}${abc}</div><button type="button" class="l7-btn sp-full" id="spReadCheck">Prüfen</button><div id="spFeedback"></div></div>`);
  root.querySelectorAll('[data-read-key]').forEach(btn=>btn.addEventListener('click',()=>{saveChoice(theme,t,btn.dataset.readKey,btn.dataset.readValue);render(theme,t)}));
  const check=root.querySelector('#spReadCheck');
  check?.addEventListener('pointerdown',()=>{
   if(complete(theme,t,index))return;
   const box=document.getElementById('spFeedback');if(box)box.innerHTML='<div class="l7-hint">Beantworte zuerst alle Fragen zu diesem Text.</div>'
  });
 }
 window.L7.renderTaskPage=function(theme,id){const t=S.task(id);if(t?.kind==='reading-sets')return render(Number(theme),t);return raw(theme,id)};
 window.L7.__spReadingQueueFixV1=true;
 return true
}
window.L7ReadingQueueFix={install};
})();
