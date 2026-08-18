(function(){
'use strict';
if(window.__SP_L7T3_CARD_CONTENT_V5)return;
window.__SP_L7T3_CARD_CONTENT_V5=true;
const BUNNY_AUDIO='https://sprachpilot.b-cdn.net/audio/';
const FORMS=[
 {v:'gehen',p:'gegangen',aux:'ist',img:'gehen.webp',audio:'gehen.mp3',tr:{en:'went',ru:'пошёл / пошла',tr:'gitti',uk:'пішов / пішла',ar:'ذهب',ja:'行った',ro:'a mers',pl:'poszedł / poszła',ku:'çû'}},
 {v:'fahren',p:'gefahren',aux:'ist',img:'fahren.webp',audio:'fahren.mp3',tr:{en:'went / traveled by vehicle',ru:'поехал / поехала',tr:'araçla gitti',uk:'поїхав / поїхала',ar:'ذهب بالمركبة',ja:'乗り物で行った',ro:'a mers cu un mijloc de transport',pl:'pojechał / pojechała',ku:'bi wesayitê çû'}},
 {v:'kommen',p:'gekommen',aux:'ist',img:'kommen.webp',audio:'kommen.mp3',tr:{en:'came',ru:'пришёл / пришла',tr:'geldi',uk:'прийшов / прийшла',ar:'جاء',ja:'来た',ro:'a venit',pl:'przyszedł / przyszła',ku:'hat'}},
 {v:'fliegen',p:'geflogen',aux:'ist',img:'fliegen.webp',audio:'fliegen.mp3',tr:{en:'flew',ru:'полетел / полетела',tr:'uçtu',uk:'полетів / полетіла',ar:'طار',ja:'飛んだ',ro:'a zburat',pl:'poleciał / poleciała',ku:'firî'}},
 {v:'wandern',p:'gewandert',aux:'ist',img:'wandern.webp',audio:'wandern.mp3',tr:{en:'hiked',ru:'ходил / ходила в поход',tr:'yürüyüş yaptı',uk:'ходив / ходила в похід',ar:'تنزّه مشيًا',ja:'ハイキングした',ro:'a făcut drumeție',pl:'wędrował / wędrowała',ku:'meşiya'}},
 {v:'spazieren gehen',p:'spazieren gegangen',aux:'ist',img:'spazierengehen.webp',audio:'spazieren_gehen.mp3',perfectAudio:'spazieren_gegangen.mp3',tr:{en:'went for a walk',ru:'пошёл / пошла гулять',tr:'yürüyüşe çıktı',uk:'пішов / пішла гуляти',ar:'ذهب في نزهة',ja:'散歩に行った',ro:'a ieșit la plimbare',pl:'poszedł / poszła na spacer',ku:'çû gerê'}},
 {v:'bleiben',p:'geblieben',aux:'ist',img:'bleiben.webp',audio:'bleiben.mp3',tr:{en:'stayed',ru:'остался / осталась',tr:'kaldı',uk:'залишився / залишилася',ar:'بقي',ja:'残った',ro:'a rămas',pl:'został / została',ku:'ma'}},
 {v:'schwimmen',p:'geschwommen',aux:'ist',img:'schwimmen.webp',audio:'schwimmen.mp3',tr:{en:'swam',ru:'плавал / плавала',tr:'yüzdü',uk:'плавав / плавала',ar:'سبح',ja:'泳いだ',ro:'a înotat',pl:'pływał / pływała',ku:'avjenî kir'}},
 {v:'tanzen',p:'getanzt',aux:'hat',img:'tanzen.webp',audio:'tanzen.mp3',tr:{en:'danced',ru:'танцевал / танцевала',tr:'dans etti',uk:'танцював / танцювала',ar:'رقص',ja:'踊った',ro:'a dansat',pl:'tańczył / tańczyła',ku:'reqisî'}},
 {v:'backen',p:'gebacken',aux:'hat',img:'backen.webp',audio:'backen.mp3',tr:{en:'baked',ru:'испёк / испекла',tr:'pişirdi',uk:'спік / спекла',ar:'خبز',ja:'焼いた',ro:'a copt',pl:'upiekł / upiekła',ku:'pijand'}}
];
const LABELS={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
function language(){let p={};try{p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){}const raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en').toLowerCase();if(/russ|^ru/.test(raw))return'ru';if(/türk|turk|^tr/.test(raw))return'tr';if(/ukrain|^uk|^ua/.test(raw))return'uk';if(/arab|^ar/.test(raw))return'ar';if(/japan|^ja/.test(raw))return'ja';if(/rum|roman|^ro/.test(raw))return'ro';if(/pol|^pl/.test(raw))return'pl';if(/kurd|kurm|^ku/.test(raw))return'ku';return'en'}
function task(theme){return (theme?.tasks||[]).find(t=>t?.id==='karteikarten'||t?.kind==='cards')||theme?.tasks?.[0]}
window.L7T3_FORMS=FORMS;
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const cards=task(theme);
 if(cards){
  const lang=language();cards.id='karteikarten';cards.title='Karteikarten';cards.description='Lern die Wörter.';cards.kind='cards';
  cards.items=FORMS.map(x=>({kind:'cards',type:'verb',category:'verb',infinitive:x.v,perfect:`${x.aux} ${x.p}`,image:x.img,word:`${x.aux} ${x.p}`,answer:`${x.aux} ${x.p}`,answers:[`${x.aux} ${x.p}`],translations:{...x.tr},meaning:x.tr[lang]||x.tr.en,translationLabel:LABELS[lang]||LABELS.en,example:`${x.v} – ${x.aux} ${x.p}`,audio:x.perfectAudio?BUNNY_AUDIO+x.perfectAudio:`${x.aux} ${x.p}`,audioFile:x.audio,perfectAudioFile:x.perfectAudio||'',prompt:x.v,hint:'Nenne das Hilfsverb und das Partizip II.'}));
 }
 theme.contentRevision='l7t3-card-standard-20260818-v5';window.L7_THEME=theme;return theme;
});
})();
