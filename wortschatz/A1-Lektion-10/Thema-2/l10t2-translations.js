(function(){
'use strict';
if(window.L10T2Translations)return;
const LANGS={
 en:['en','english','englisch'],ru:['ru','russian','russisch'],tr:['tr','turkish','türkisch','tuerkisch'],uk:['uk','ua','ukrainian','ukrainisch'],ar:['ar','arabic','arabisch'],ja:['ja','japanese','japanisch'],ro:['ro','romanian','rumänisch','rumaenisch'],pl:['pl','polish','polnisch'],ku:['ku','kurdish','kurdisch','kurmancî','kurmanci'],fa:['fa','farsi','persisch'],fr:['fr','french','französisch','franzoesisch'],es:['es','spanish','spanisch'],it:['it','italian','italienisch']
};
const LABELS={en:'Englisch',ru:'Russisch',tr:'Türkisch',uk:'Ukrainisch',ar:'Arabisch',ja:'Japanisch',ro:'Rumänisch',pl:'Polnisch',ku:'Kurdisch',fa:'Persisch',fr:'Französisch',es:'Spanisch',it:'Italienisch'};
const T={
 klub:{en:'club',ru:'клуб',tr:'kulüp',uk:'клуб',ar:'نادٍ',ja:'クラブ',ro:'club',pl:'klub',ku:'klûb',fa:'باشگاه',fr:'club',es:'club',it:'club'},
 notaufnahme:{en:'emergency room',ru:'приёмное отделение',tr:'acil servis',uk:'приймальне відділення',ar:'قسم الطوارئ',ja:'救急外来',ro:'camera de gardă',pl:'izba przyjęć',ku:'beşa acîl',fa:'اورژانس بیمارستان',fr:'service des urgences',es:'urgencias',it:'pronto soccorso'},
 bereich:{en:'area / section',ru:'область / зона',tr:'alan / bölüm',uk:'область / зона',ar:'منطقة / قسم',ja:'エリア / 分野',ro:'zonă / domeniu',pl:'obszar / dział',ku:'qad / beş',fa:'بخش / حوزه',fr:'zone / domaine',es:'área / sección',it:'area / settore'},
 tablette:{en:'tablet / pill',ru:'таблетка',tr:'tablet / hap',uk:'таблетка',ar:'قرص دواء',ja:'錠剤',ro:'comprimat / pastilă',pl:'tabletka',ku:'heb',fa:'قرص',fr:'comprimé',es:'pastilla / tableta',it:'compressa'},
 wehtun:{en:'to hurt',ru:'болеть',tr:'acımak / ağrımak',uk:'боліти',ar:'يؤلم',ja:'痛む',ro:'a durea',pl:'boleć',ku:'êş kirin',fa:'درد کردن',fr:'faire mal',es:'doler',it:'fare male'},
 unfall:{en:'accident',ru:'несчастный случай / авария',tr:'kaza',uk:'нещасний випадок / аварія',ar:'حادث',ja:'事故',ro:'accident',pl:'wypadek',ku:'qezayî',fa:'حادثه / تصادف',fr:'accident',es:'accidente',it:'incidente'},
 schmerz:{en:'pain',ru:'боль',tr:'ağrı',uk:'біль',ar:'ألم',ja:'痛み',ro:'durere',pl:'ból',ku:'êş',fa:'درد',fr:'douleur',es:'dolor',it:'dolore'},
 beide:{en:'both',ru:'оба / обе',tr:'ikisi de',uk:'обидва / обидві',ar:'كلاهما',ja:'両方',ro:'amândoi / ambele',pl:'oboje / obaj',ku:'her du',fa:'هر دو',fr:'les deux',es:'ambos / ambas',it:'entrambi / entrambe'},
 lustig:{en:'funny',ru:'смешной / весёлый',tr:'komik / eğlenceli',uk:'смішний / веселий',ar:'مضحك',ja:'面白い / おかしい',ro:'amuzant',pl:'zabawny',ku:'pêkenok',fa:'خنده‌دار / بامزه',fr:'drôle',es:'divertido / gracioso',it:'divertente'},
 schlimm:{en:'bad / serious',ru:'плохой / серьёзный',tr:'kötü / ciddi',uk:'поганий / серйозний',ar:'سيئ / خطير',ja:'ひどい / 深刻な',ro:'rău / grav',pl:'zły / poważny',ku:'xerab / giran',fa:'بد / شدید',fr:'grave / mauvais',es:'malo / grave',it:'brutto / grave'},
 idee:{en:'idea',ru:'идея',tr:'fikir',uk:'ідея',ar:'فكرة',ja:'アイデア',ro:'idee',pl:'pomysł',ku:'raman',fa:'ایده',fr:'idée',es:'idea',it:'idea'},
 informieren:{en:'to inform',ru:'информировать / сообщать',tr:'bilgilendirmek',uk:'інформувати / повідомляти',ar:'يُبلِغ / يُخبِر',ja:'知らせる / 情報を伝える',ro:'a informa',pl:'informować',ku:'agahdar kirin',fa:'اطلاع دادن',fr:'informer',es:'informar',it:'informare'},
 ausfallen:{en:'to be cancelled',ru:'отменяться',tr:'iptal olmak',uk:'скасовуватися',ar:'يُلغى',ja:'中止になる / 休講になる',ro:'a se anula',pl:'zostać odwołanym',ku:'betal bûn',fa:'لغو شدن',fr:'être annulé',es:'cancelarse',it:'essere annullato'},
 nachricht:{en:'message',ru:'сообщение',tr:'mesaj',uk:'повідомлення',ar:'رسالة',ja:'メッセージ',ro:'mesaj',pl:'wiadomość',ku:'peyam',fa:'پیام',fr:'message',es:'mensaje',it:'messaggio'},
 kuss:{en:'kiss',ru:'поцелуй',tr:'öpücük',uk:'поцілунок',ar:'قبلة',ja:'キス',ro:'sărut',pl:'pocałunek',ku:'ramûsan',fa:'بوسه',fr:'baiser / bisou',es:'beso',it:'bacio'},
 gesund:{en:'healthy',ru:'здоровый',tr:'sağlıklı',uk:'здоровий',ar:'صحي / سليم',ja:'健康な',ro:'sănătos',pl:'zdrowy',ku:'tendurist',fa:'سالم',fr:'en bonne santé',es:'sano',it:'sano'},
 hoffentlich:{en:'hopefully',ru:'надеюсь / будем надеяться',tr:'umarım',uk:'сподіваюся',ar:'نأمل / إن شاء الله',ja:'願わくは / 〜だといい',ro:'sperăm / sper',pl:'miejmy nadzieję',ku:'hêvî dikim',fa:'امیدوارم',fr:'espérons / j’espère',es:'ojalá / espero que',it:'speriamo / spero'},
 bekannter:{en:'male acquaintance',ru:'знакомый',tr:'erkek tanıdık',uk:'знайомий',ar:'مَعرِفة / شخص معروف',ja:'男性の知り合い',ro:'cunoscut',pl:'znajomy',ku:'nasê mêr',fa:'آشنای مرد',fr:'une connaissance (homme)',es:'un conocido',it:'un conoscente'},
 bekannte:{en:'female acquaintance',ru:'знакомая',tr:'kadın tanıdık',uk:'знайома',ar:'مَعرِفة / امرأة معروفة',ja:'女性の知り合い',ro:'cunoscută',pl:'znajoma',ku:'nasiya jin',fa:'آشنای زن',fr:'une connaissance (femme)',es:'una conocida',it:'una conoscente'},
 lied:{en:'song',ru:'песня',tr:'şarkı',uk:'пісня',ar:'أغنية',ja:'歌 / 曲',ro:'cântec',pl:'piosenka',ku:'stran',fa:'آهنگ',fr:'chanson',es:'canción',it:'canzone'},
 schatz:{en:'treasure',ru:'сокровище',tr:'hazine',uk:'скарб',ar:'كنز',ja:'宝物',ro:'comoară',pl:'skarb',ku:'xezîne',fa:'گنج',fr:'trésor',es:'tesoro',it:'tesoro'}
};
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{}}catch(e){return{}}}
function normal(v){return String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function code(){const p=profile(),raw=normal(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'en');for(const[c,names]of Object.entries(LANGS))if(names.some(x=>raw===normal(x)||raw.includes(normal(x))))return c;return'en'}
const c=code(),B='https://sprachpilot.b-cdn.net/',AUDIO=B+'audio/';
for(const item of window.L10T2?.cards||[]){const tr=T[item.id]?.[c]||T[item.id]?.en||'';item.translation=tr;item.translations=T[item.id]||{};item.image=B+item.id+'.webp?v=20260911-l8';item.audio=AUDIO+item.id+'.mp3?v=20260911-l8'}
window.L10T2Translations={code:c,label:LABELS[c]||'Englisch',lexicon:T};
})();
