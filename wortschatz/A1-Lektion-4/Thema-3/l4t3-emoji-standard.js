(function(){
'use strict';
if(window.__SP_L4T3_EMOJI_STANDARD_V1)return;window.__SP_L4T3_EMOJI_STANDARD_V1=true;
const icons={'Karteikarten':'🃏','Hören':'🎧','Farben':'🎨','Gegenteile-Memory':'🧠','Gegenteile':'↔️','nicht / kein':'🚫','Reaktionen':'🙂','Gefallen':'💬','Farben kombinieren':'☀️🌙','Sätze bauen':'🧩','Schreiben':'✍️','Prüfung':'⭐'};
function apply(){document.querySelectorAll('.module').forEach(card=>{const title=(card.querySelector('.num')?.textContent||'').replace(/^\s*\d+\.\s*/,'').trim();const icon=icons[title],node=card.querySelector('.icon');if(icon&&node&&node.textContent!==icon)node.textContent=icon})}
apply();new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
