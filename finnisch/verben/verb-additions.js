(function(){
'use strict';
const ADDITIONS=[
 ['bieten','tarjota'],
 ['bitten','pyytää'],
 ['nennen','nimetä'],
 ['sitzen','istua'],
 ['treiben','harjoittaa'],
 ['binden','sitoa'],
 ['brennen','palaa'],
 ['erschrecken','säikähtää'],
 ['fliehen','paeta'],
 ['fließen','virrata'],
 ['frieren','palella'],
 ['gelingen','onnistua'],
 ['gelten','olla voimassa'],
 ['geschehen','tapahtua'],
 ['passieren','tapahtua'],
 ['gleichen','muistuttaa'],
 ['heben','nostaa'],
 ['klingen','kuulostaa'],
 ['leiden','kärsiä'],
 ['leihen','lainata'],
 ['meiden','välttää'],
 ['reiben','hieroa'],
 ['schaffen','saada aikaan'],
 ['scheiden','erota'],
 ['trennen','erottaa'],
 ['teilen','jakaa'],
 ['schauen','katsoa'],
 ['scheinen','paistaa'],
 ['schießen','ampua'],
 ['schmeißen','heittää'],
 ['senden','lähettää'],
 ['treten','potkaista'],
 ['verzeihen','antaa anteeksi'],
 ['weisen','osoittaa'],
 ['hinweisen','huomauttaa'],
 ['auffallen','erottua'],
 ['einfallen','tulla mieleen'],
 ['sich bewegen','liikkua'],
 ['sich konzentrieren','keskittyä'],
 ['sich kümmern','huolehtia'],
 ['sich interessieren','olla kiinnostunut'],
 ['wiegen','painaa'],
 ['zwingen','pakottaa'],
 ['sich erinnern','muistaa'],
 ['sich anziehen','pukeutua'],
 ['sich ausziehen','riisuutua'],
 ['sich umziehen','vaihtaa vaatteet'],
 ['sich duschen','käydä suihkussa'],
 ['sich freuen','iloita'],
 ['sich ärgern','ärsyyntyä'],
 ['sich beschweren','valittaa'],
 ['sich überlegen','harkita'],
 ['hinzufügen','lisätä'],
 ['spazieren gehen','käydä kävelyllä']
];
const fileName=v=>String(v).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^sich\s+/,'sich_').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
window.SP_FI_VERBS=Array.isArray(window.SP_FI_VERBS)?window.SP_FI_VERBS:[];
const known=new Set(window.SP_FI_VERBS.map(x=>x&&x.de).filter(Boolean));
ADDITIONS.forEach(([de,fi])=>{
 if(known.has(de))return;
 window.SP_FI_VERBS.push({de,fi,img:fileName(de)});
 known.add(de);
});
})();
