(function(){
'use strict';
if(window.__SP_L7_RELEASE_CATALOG_FIX_20260916)return;
window.__SP_L7_RELEASE_CATALOG_FIX_20260916=true;

const DATA={
 'Thema-1':{title:'Thema 1 · können, wollen und möchten',tasks:['karteikarten','bild-erklaerung-wort','artikel-plural','koennen-formen','wollen-formen','verbform-waehlen','aussagen-ordnen','ja-nein-fragen','w-fragen','faehigkeiten-abstufen','bildimpulse','fragen-antworten','partnerinterview','wollen-moechten','dialoge-ergaenzen','hoeren-wuensche','eigene-faehigkeiten','eigene-plaene','pruefung']},
 'Thema-2':{title:'Thema 2 · Perfekt mit haben',tasks:['karteikarten','infinitiv-partizip','memory','endung-sortieren','endung-markieren','silben-ordnen','partizip-waehlen','partizip-schreiben','hoeren-partizip','fehler-korrigieren','haben-konjugieren','satzklammer','saetze-ordnen','saetze-bilden','zeitangaben','dialogluecken','fragen-antworten','lesen-tagesrueckblick','hoeren-rueckblick','eigene-saetze','pruefung']},
 'Thema-3':{title:'Thema 3 · Perfekt mit sein und Bewegungsverben',tasks:['karteikarten','infinitiv-partizip','sein-konjugieren','hilfsverb-sein','partizip-waehlen','saetze-ordnen','bild-satz','bildimpulse','saetze-bilden','ja-nein-fragen','w-fragen','dialoge','hoeren-bewegung','haben-sein-sortieren','hilfsverb-waehlen','hilfsverb-schreiben','gemischte-saetze','fehler-korrigieren','lesen-wochenende','hoeren-was-passiert','eigene-saetze','pruefung']},
 'Thema-4':{title:'Thema 4 · Kommunikation in der Schule',tasks:['karteikarten','artikel','plural-sprechen','wort-bedeutung','redemittel-ordnen','lesen-richtig-falsch','lesen-abc','informationen-markieren','ueberschrift','rechtschreibung','informationen-schreiben','hoeren-sekretariat','hoerdialog-ordnen','telefonluecken','telefonat-sprechen','dialog-deutschkurs','dialog-schulausflug','dialog-treffpunkt','entschuldigung-schule','nachricht-deutschkurs','entschuldigung-pruefen','eigener-dialog','pruefung']}
};
function label(id){return id==='pruefung'?'Prüfung':id.replace(/-/g,' ').replace(/^./,c=>c.toUpperCase())}
function patch(){
 if(typeof RELEASE_CATALOG==='undefined'||!Array.isArray(RELEASE_CATALOG.lessons))return false;
 const lesson=RELEASE_CATALOG.lessons.find(x=>x&&x.key==='A1-Lektion-7');
 if(!lesson)return false;
 lesson.title='A1 Lektion 7';
 lesson.themes=lesson.themes||[];
 Object.entries(DATA).forEach(([key,cfg])=>{
   let th=lesson.themes.find(x=>x&&x.key===key);
   if(!th){th={key,title:cfg.title,tasks:[],sets:[]};lesson.themes.push(th)}
   th.title=cfg.title;
   th.tasks=cfg.tasks.map(id=>['task.html?task='+id,label(id)]);
 });
 window.__SP_L7_RELEASE_CATALOG_READY=true;
 return true;
}
if(!patch()){
 let n=0;const timer=setInterval(()=>{n++;if(patch()||n>100)clearInterval(timer)},100);
 window.addEventListener('beforeunload',()=>clearInterval(timer),{once:true});
}
})();
