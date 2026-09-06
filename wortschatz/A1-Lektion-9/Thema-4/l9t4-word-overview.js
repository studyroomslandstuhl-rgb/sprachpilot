(function(){
'use strict';
if(!window.SPWordOverviewStandard)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const items=window.L9_T4_WORDS||window.L9_THEMES?.[4]?.coreVocabulary||[];
const LANGS={
 en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']
};
const LABEL={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
const T={
 allein:{en:'alone',ru:'один / одна',tr:'yalnız',uk:'сам / сама',ar:'وحده',ja:'一人で',ro:'singur / singură',pl:'sam / sama',ku:'bi tenê'},
 behoerde:{en:'authority / public office',ru:'ведомство / государственный орган',tr:'resmî kurum',uk:'державний орган / установа',ar:'جهة رسمية',ja:'官庁 / 公的機関',ro:'autoritate / instituție publică',pl:'urząd / organ administracji',ku:'dezgehê fermî'},
 meldebehoerde:{en:'registration authority',ru:'регистрационное ведомство',tr:'ikamet kayıt kurumu',uk:'орган реєстрації місця проживання',ar:'دائرة تسجيل السكن',ja:'住民登録局',ro:'autoritatea de înregistrare a domiciliului',pl:'urząd meldunkowy',ku:'dezgeha qeydkirina niştecîhê'},
 anmeldung_behoerde:{en:'registration',ru:'регистрация',tr:'kayıt',uk:'реєстрація',ar:'تسجيل',ja:'登録',ro:'înregistrare',pl:'rejestracja / meldunek',ku:'qeydkirin'},
 person:{en:'person',ru:'человек / лицо',tr:'kişi',uk:'особа / людина',ar:'شخص',ja:'人',ro:'persoană',pl:'osoba',ku:'kes'},
 geburtsname:{en:'birth name / maiden name',ru:'фамилия при рождении',tr:'doğum soyadı',uk:'прізвище при народженні',ar:'اسم العائلة عند الولادة',ja:'出生時の姓',ro:'nume la naștere',pl:'nazwisko rodowe',ku:'navê malbatê yê jidayikbûnê'},
 geschlecht:{en:'sex / gender',ru:'пол',tr:'cinsiyet',uk:'стать',ar:'الجنس',ja:'性別',ro:'sex / gen',pl:'płeć',ku:'zayend'}
};
/* Explizite Bunny-Zuordnung. Anmeldung verwendet das bereits vorhandene T2-Asset
   anmeldung.webp / audio/anmeldung.mp3 und nicht den internen T4-Schlüssel anmeldung_behoerde. */
const ASSETS={
 allein:'allein',
 behoerde:'behoerde',
 meldebehoerde:'meldebehoerde',
 anmeldung_behoerde:'anmeldung',
 person:'person',
 geburtsname:'geburtsname',
 geschlecht:'geschlecht'
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code();
const rendered=items.map(item=>{
 const asset=ASSETS[item.id]||item.id;
 return {...item,image:`${CDN}${asset}.webp`,audio:`${AUDIO}${asset}.mp3`,translation:T[item.id]?.[c]||T[item.id]?.en||''};
});
window.SPWordOverviewStandard.render({root:'#app',items:rendered,title:'Wörter aus Thema 4',description:'Hier siehst und hörst du die Wörter und Redewendungen aus diesem Thema.',translationLabel:LABEL[c]||'Englisch',headerSubtitle:'Wortschatzübersicht · Bei der Behörde · A1 Lektion 9 · Thema 4'});
})();