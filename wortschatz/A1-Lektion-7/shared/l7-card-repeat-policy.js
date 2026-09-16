(function(){
'use strict';
if(window.__SP_L7_CARD_REPEAT_POLICY_V3)return;window.__SP_L7_CARD_REPEAT_POLICY_V3=true;
if(!['karteikarten','cards'].includes(String(new URLSearchParams(location.search).get('task')||'').toLowerCase()))return;

/*
 Standardregel: Das normale Umdrehen einer Karte ist KEIN Fehler und darf die Karte
 nicht erneut in die Wiederholungsschlange setzen. Wiederholt werden nur Karten,
 bei denen tatsächlich eine falsche Antwort über die Aufgabenlogik registriert wurde.

 Die alte Version beobachtete jede Klasse "flipped" und setzte dabei hadWrong,
 wrongTries und cardRepeat. Dadurch konnte besonders die letzte Karte immer wieder
 neu eingereiht werden und die Aufgabe scheinbar bei einem Wort hängen bleiben.
*/
function cleanupLegacyRevealRepeat(){
 const S=window.L7S;
 const theme=Number(document.body.dataset.theme||0);
 const id=String(new URLSearchParams(location.search).get('task')||'');
 const t=S?.task?.(id);
 if(!S||!theme||!t)return false;
 const st=S.load(theme,t.id,t.items.length);
 const repeat=st.answers?.cardRepeat;
 const reasons=st.answers?.cardRepeatReason;
 if(!repeat||!reasons)return false;
 let changed=false;
 Object.keys(reasons).forEach(key=>{
  if(reasons[key]!=='card-revealed')return;
  if(Object.prototype.hasOwnProperty.call(repeat,key)){delete repeat[key];changed=true;}
  delete reasons[key];
 });
 if(changed){
  if(!Object.keys(repeat).length)delete st.answers.cardRepeat;
  if(!Object.keys(reasons).length)delete st.answers.cardRepeatReason;
  S.save(theme,t.id,st,false);
 }
 return changed;
}

function install(){
 if(!window.L7S)return false;
 cleanupLegacyRevealRepeat();
 window.__SP_L7_CARD_FLIP_IS_NEUTRAL=true;
 return true;
}
if(!install()){
 let tries=0;
 const timer=setInterval(()=>{if(install()||++tries>200)clearInterval(timer)},25);
}
})();