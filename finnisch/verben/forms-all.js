(function(){
'use strict';
if(window.SP_FI_ALL_FORMS)return;

const SPECIAL={
 'olla':['olen','olet','on','olemme','olette','ovat'],
 'tehdä':['teen','teet','tekee','teemme','teette','tekevät'],
 'nähdä':['näen','näet','näkee','näemme','näette','näkevät'],
 'juoda':['juon','juot','juo','juomme','juotte','juovat'],
 'syödä':['syön','syöt','syö','syömme','syötte','syövät'],
 'käydä':['käyn','käyt','käy','käymme','käytte','käyvät'],
 'tulla':['tulen','tulet','tulee','tulemme','tulette','tulevat'],
 'mennä':['menen','menet','menee','menemme','menette','menevät'],
 'purra':['puren','puret','puree','puremme','purette','purevat'],
 'pestä':['pesen','peset','pesee','pesemme','pesette','pesevät'],
 'juosta':['juoksen','juokset','juoksee','juoksemme','juoksette','juoksevat'],
 'nousta':['nousen','nouset','nousee','nousemme','nousette','nousevat'],
 'kuolla':['kuolen','kuolet','kuolee','kuolemme','kuolette','kuolevat'],
 'voida':['voin','voit','voi','voimme','voitte','voivat'],
 'saada':['saan','saat','saa','saamme','saatte','saavat'],
 'haluta':['haluan','haluat','haluaa','haluamme','haluatte','haluavat'],
 'tarvita':['tarvitsen','tarvitset','tarvitsee','tarvitsemme','tarvitsette','tarvitsevat'],
 'ajatella':['ajattelen','ajattelet','ajattelee','ajattelemme','ajattelette','ajattelevat'],
 'opiskella':['opiskelen','opiskelet','opiskelee','opiskelemme','opiskelette','opiskelevat'],
 'työskennellä':['työskentelen','työskentelet','työskentelee','työskentelemme','työskentelette','työskentelevät']
};

function type(w){
 w=String(w||'').toLocaleLowerCase('fi-FI');
 if(/(da|dä)$/.test(w))return 2;
 if(/(lla|llä|nna|nnä|rra|rrä|sta|stä)$/.test(w))return 3;
 if(/(ita|itä)$/.test(w))return 5;
 if(/(eta|etä)$/.test(w))return 6;
 if(/(ata|ätä|ota|ötä|uta|ytä)$/.test(w))return 4;
 return 1;
}
function wordForms(word){
 const w=String(word||'').trim().toLocaleLowerCase('fi-FI');
 if(!w)return null;
 if(SPECIAL[w])return SPECIAL[w].slice();
 const back=/[aou]/.test(w),vat=back?'vat':'vät',t=type(w);
 if(t===2){const s=w.slice(0,-2);return[s+'n',s+'t',s,s+'mme',s+'tte',s+vat]}
 if(t===3){let s=w.slice(0,-2);if(/ll|nn|rr|st$/.test(s))s=s.slice(0,-1);s+='e';return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat]}
 if(t===4){const s=w.slice(0,-2)+(back?'a':'ä');return[s+'n',s+'t',s,s+'mme',s+'tte',s+vat]}
 if(t===5){const s=w.slice(0,-2)+'tse';return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat]}
 if(t===6){const s=w.slice(0,-2)+'ne';return[s+'n',s+'t',s+'e',s+'mme',s+'tte',s+vat]}
 const s=w.slice(0,-1),last=s.slice(-1),third=/[aeiouyäö]$/.test(last)?s+last:s;
 return[s+'n',s+'t',third,s+'mme',s+'tte',s+vat];
}
function forms(value){
 const phrase=String(value||'').trim();if(!phrase)return null;
 const parts=phrase.split(/\s+/),first=parts.shift(),tail=parts.length?' '+parts.join(' '):'';
 const f=wordForms(first);return f?f.map(x=>x+tail):null;
}
window.SP_FI_ALL_FORMS=forms;
})();
