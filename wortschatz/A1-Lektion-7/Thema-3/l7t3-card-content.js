(function(){
'use strict';
if(window.__SP_L7T3_CARD_CONTENT_V1)return;
window.__SP_L7T3_CARD_CONTENT_V1=true;

const FORMS=[
 {v:'gehen',p:'gegangen',img:'gehen.webp',en:'went'},
 {v:'fahren',p:'gefahren',img:'fahren.webp',en:'went / traveled by vehicle'},
 {v:'kommen',p:'gekommen',img:'kommen.webp',en:'came'},
 {v:'fliegen',p:'geflogen',img:'fliegen.webp',en:'flew'},
 {v:'wandern',p:'gewandert',img:'wandern.webp',en:'hiked'}
];
const TRANSLATIONS={
 ru:{gehen:'пошёл / пошла',fahren:'поехал / поехала',kommen:'пришёл / пришла',fliegen:'полетел / полетела',wandern:'ходил / ходила в поход'},
 tr:{gehen:'gitti',fahren:'araçla gitti',kommen:'geldi',fliegen:'uçtu',wandern:'yürüyüş yaptı'},
 uk:{gehen:'пішов / пішла',fahren:'поїхав / поїхала',kommen:'прийшов / прийшла',fliegen:'полетів / полетіла',wandern:'ходив / ходила в похід'},
 ar:{gehen:'ذهب',fahren:'ذهب بالمركبة',kommen:'جاء',fliegen:'طار',wandern:'تنزّه مشيًا'},
 ja:{gehen:'行った',fahren:'乗り物で行った',kommen:'来た',fliegen:'飛んだ',wandern:'ハイキングした'},
 ro:{gehen:'a mers',fahren:'a mers cu un mijloc de transport',kommen:'a venit',fliegen:'a zburat',wandern:'a făcut drumeție'},
 pl:{gehen:'poszedł / poszła',fahren:'pojechał / pojechała',kommen:'przyszedł / przyszła',fliegen:'poleciał / poleciała',wandern:'wędrował / wędrowała'},
 ku:{gehen:'çû',fahren:'bi wesayitê çû',kommen:'hat',fliegen:'firî',wandern:'meşiya'}
};
function lang(){let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){}const raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/russ|^ru/.test(raw))return'ru';if(/türk|turk|^tr/.test(raw))return'tr';if(/ukrain|^uk|^ua/.test(raw))return'uk';if(/arab|^ar/.test(raw))return'ar';if(/japan|^ja/.test(raw))return'ja';if(/rum|roman|^ro/.test(raw))return'ro';if(/pol|^pl/.test(raw))return'pl';if(/kurd|kurm|^ku/.test(raw))return'ku';return'en'}
function translation(x){const l=lang();return l==='en'?x.en:(TRANSLATIONS[l]?.[x.v]||x.en)}
function task(theme){return (theme?.tasks||[]).find(t=>t?.id==='karteikarten'||t?.kind==='cards')||theme?.tasks?.[0]}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const cards=task(theme);
 if(cards){
  cards.id='karteikarten';
  cards.title='Karteikarten';
  cards.description='Lern die Wörter.';
  cards.kind='cards';
  cards.items=FORMS.map(x=>({
   kind:'cards',
   image:x.img,
   word:`ist ${x.p}`,
   answer:`ist ${x.p}`,
   answers:[`ist ${x.p}`],
   meaning:translation(x),
   example:`${x.v} – ist ${x.p}`,
   audio:`ist ${x.p}`,
   prompt:x.v,
   hint:'Nenne das Hilfsverb und das Partizip II.'
  }));
 }
 theme.contentRevision='l7t3-card-standard-20260817-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
