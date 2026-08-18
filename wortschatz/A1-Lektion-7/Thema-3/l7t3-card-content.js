(function(){
'use strict';
if(window.__SP_L7T3_CARD_CONTENT_V2)return;
window.__SP_L7T3_CARD_CONTENT_V2=true;

const FORMS=[
 {v:'gehen',p:'gegangen',img:'gehen.webp',tr:{en:'went',ru:'пошёл / пошла',tr:'gitti',uk:'пішов / пішла',ar:'ذهب',ja:'行った',ro:'a mers',pl:'poszedł / poszła',ku:'çû'}},
 {v:'fahren',p:'gefahren',img:'fahren.webp',tr:{en:'went / traveled by vehicle',ru:'поехал / поехала',tr:'araçla gitti',uk:'поїхав / поїхала',ar:'ذهب بالمركبة',ja:'乗り物で行った',ro:'a mers cu un mijloc de transport',pl:'pojechał / pojechała',ku:'bi wesayitê çû'}},
 {v:'kommen',p:'gekommen',img:'kommen.webp',tr:{en:'came',ru:'пришёл / пришла',tr:'geldi',uk:'прийшов / прийшла',ar:'جاء',ja:'来た',ro:'a venit',pl:'przyszedł / przyszła',ku:'hat'}},
 {v:'fliegen',p:'geflogen',img:'fliegen.webp',tr:{en:'flew',ru:'полетел / полетела',tr:'uçtu',uk:'полетів / полетіла',ar:'طار',ja:'飛んだ',ro:'a zburat',pl:'poleciał / poleciała',ku:'firî'}},
 {v:'wandern',p:'gewandert',img:'wandern.webp',tr:{en:'hiked',ru:'ходил / ходила в поход',tr:'yürüyüş yaptı',uk:'ходив / ходила в похід',ar:'تنزّه مشيًا',ja:'ハイキングした',ro:'a făcut drumeție',pl:'wędrował / wędrowała',ku:'meşiya'}}
];
const LABELS={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
function language(){let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){}const raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/russ|^ru/.test(raw))return'ru';if(/türk|turk|^tr/.test(raw))return'tr';if(/ukrain|^uk|^ua/.test(raw))return'uk';if(/arab|^ar/.test(raw))return'ar';if(/japan|^ja/.test(raw))return'ja';if(/rum|roman|^ro/.test(raw))return'ro';if(/pol|^pl/.test(raw))return'pl';if(/kurd|kurm|^ku/.test(raw))return'ku';return'en'}
function task(theme){return (theme?.tasks||[]).find(t=>t?.id==='karteikarten'||t?.kind==='cards')||theme?.tasks?.[0]}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const cards=task(theme);
 if(cards){
  const lang=language();
  cards.id='karteikarten';
  cards.title='Karteikarten';
  cards.description='Lern die Wörter.';
  cards.kind='cards';
  cards.items=FORMS.map(x=>({
   kind:'cards',
   type:'verb',
   category:'verb',
   infinitive:x.v,
   perfect:`ist ${x.p}`,
   image:x.img,
   word:`ist ${x.p}`,
   answer:`ist ${x.p}`,
   answers:[`ist ${x.p}`],
   translations:{...x.tr},
   meaning:x.tr[lang]||x.tr.en,
   translationLabel:LABELS[lang]||LABELS.en,
   example:`${x.v} – ist ${x.p}`,
   audio:`ist ${x.p}`,
   prompt:x.v,
   hint:'Nenne das Hilfsverb und das Partizip II.'
  }));
 }
 theme.contentRevision='l7t3-card-standard-20260818-v2';
 window.L7_THEME=theme;
 return theme;
});
})();
