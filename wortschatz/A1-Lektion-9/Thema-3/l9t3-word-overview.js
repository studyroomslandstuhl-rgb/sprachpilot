(function(){
'use strict';
if(!window.SPWordOverviewStandard)return;
const items=window.L9_T3_WORDS||window.L9_THEMES?.[3]?.coreVocabulary||[];
const LANGS={
 en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci']
};
const LABEL={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch'};
const T={
 moment:{en:'moment',ru:'момент',tr:'an',uk:'момент',ar:'لحظة',ja:'瞬間',ro:'moment',pl:'chwila',ku:'dem'},
 beantragen:{en:'to apply for',ru:'подавать заявление на',tr:'başvurmak',uk:'подавати заяву на',ar:'يتقدم بطلب',ja:'申請する',ro:'a solicita',pl:'wnioskować o',ku:'daxwaz kirin'},
 duerfen:{en:'may / to be allowed to',ru:'мочь / иметь разрешение',tr:'izinli olmak',uk:'мати дозвіл',ar:'يُسمح له',ja:'〜してもよい',ro:'a avea voie',pl:'móc / mieć pozwolenie',ku:'destûr hebûn'},
 achtung:{en:'Attention!',ru:'Внимание!',tr:'Dikkat!',uk:'Увага!',ar:'انتبه!',ja:'注意！',ro:'Atenție!',pl:'Uwaga!',ku:'Baldarî!'},
 zigarette:{en:'cigarette',ru:'сигарета',tr:'sigara',uk:'сигарета',ar:'سيجارة',ja:'たばこ',ro:'țigară',pl:'papieros',ku:'cixar'},
 rauchen:{en:'to smoke',ru:'курить',tr:'sigara içmek',uk:'курити',ar:'يدخن',ja:'喫煙する',ro:'a fuma',pl:'palić',ku:'cixar kişandin'},
 langsam:{en:'slowly / slow',ru:'медленно',tr:'yavaş',uk:'повільно',ar:'ببطء',ja:'ゆっくり',ro:'încet',pl:'powoli',ku:'hêdî'},
 parkplatz:{en:'parking space',ru:'парковочное место',tr:'park yeri',uk:'паркувальне місце',ar:'موقف سيارات',ja:'駐車場',ro:'loc de parcare',pl:'miejsce parkingowe',ku:'cihê parkê'},
 parken:{en:'to park',ru:'парковаться',tr:'park etmek',uk:'паркуватися',ar:'يركن السيارة',ja:'駐車する',ro:'a parca',pl:'parkować',ku:'park kirin'},
 erlaubt:{en:'allowed',ru:'разрешено',tr:'izinli',uk:'дозволено',ar:'مسموح',ja:'許可されている',ro:'permis',pl:'dozwolone',ku:'destûrdayî'},
 verboten:{en:'forbidden',ru:'запрещено',tr:'yasak',uk:'заборонено',ar:'ممنوع',ja:'禁止されている',ro:'interzis',pl:'zabronione',ku:' qedexe'},
 gepaeck:{en:'luggage',ru:'багаж',tr:'bagaj',uk:'багаж',ar:'أمتعة',ja:'荷物',ro:'bagaj',pl:'bagaż',ku:'bar'},
 abgeben:{en:'to hand in / drop off',ru:'сдавать / отдавать',tr:'teslim etmek',uk:'здавати / віддавати',ar:'يسلّم',ja:'提出する / 預ける',ro:'a preda',pl:'oddać / złożyć',ku:'teslîm kirin'},
 mitnehmen:{en:'to take along',ru:'брать с собой',tr:'yanına almak',uk:'брати з собою',ar:'يأخذ معه',ja:'持っていく',ro:'a lua cu sine',pl:'zabrać ze sobą',ku:'bi xwe re birin'},
 laptop:{en:'laptop',ru:'ноутбук',tr:'dizüstü bilgisayar',uk:'ноутбук',ar:'حاسوب محمول',ja:'ノートパソコン',ro:'laptop',pl:'laptop',ku:'laptop'},
 regel:{en:'rule',ru:'правило',tr:'kural',uk:'правило',ar:'قاعدة',ja:'規則',ro:'regulă',pl:'zasada',ku:'rêzik'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code();
const rendered=items.map(item=>({...item,translation:T[item.id]?.[c]||T[item.id]?.en||''}));
window.SPWordOverviewStandard.render({root:'#app',items:rendered,title:'Wörter aus Thema 3',description:'Hier siehst und hörst du die Wörter und Redewendungen aus diesem Thema.',translationLabel:LABEL[c]||'Englisch',headerSubtitle:'Wortschatzübersicht · Was darf man? · A1 Lektion 9 · Thema 3'});
})();