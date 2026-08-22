(function(){
'use strict';
if(window.__SP_L7_CARD_REPEAT_POLICY_V1)return;window.__SP_L7_CARD_REPEAT_POLICY_V1=true;
if(!['karteikarten','cards'].includes(String(new URLSearchParams(location.search).get('task')||'').toLowerCase()))return;
const app=document.getElementById('app');if(!app)return;
function mark(card){
 if(!card?.classList?.contains('flipped')||card.dataset.spRepeatMarked==='1')return;
 const S=window.L7S,theme=Number(document.body.dataset.theme||0),id=String(new URLSearchParams(location.search).get('task')||'');
 const t=S?.task?.(id);if(!S||!theme||!t)return;
 const st=S.load(theme,t.id,t.items.length),i=Number(st.current);if(!Number.isInteger(i)||i<0||i>=t.items.length)return;
 card.dataset.spRepeatMarked='1';
 if(typeof S.markRepeat==='function')S.markRepeat(theme,t.id,t.items.length,i,'card-revealed');
 else{
  st.answers=st.answers||{};st.answers.cardRepeat=st.answers.cardRepeat||{};st.answers.cardRepeat[i]='card-revealed';S.save(theme,t.id,st,false)
 }
 const box=document.getElementById('feedback')||document.querySelector('.feedback');
 if(box)box.innerHTML='<div class="l7-hint"><strong>Wiederholen.</strong> Du hast die Lösung gesehen. Sprich oder schreibe das Wort jetzt richtig. Danach kommt diese Karte am Ende noch einmal.</div>'
}
function scan(){document.querySelectorAll('#verbFlipCard.flipped,#flipCard.flipped').forEach(mark)}
const obs=new MutationObserver(records=>{for(const record of records){if(record.type==='attributes'&&record.attributeName==='class')mark(record.target)}scan()});
obs.observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
scan();
})();