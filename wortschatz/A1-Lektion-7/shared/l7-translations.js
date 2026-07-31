(function(){
'use strict';
if(window.L7TranslationStandard)return;

const LANGS=[
 ['en','Englisch',['en','english','englisch']],
 ['ru','Russisch',['ru','russian','russisch']],
 ['tr','Türkisch',['tr','turkish','türkisch','tuerkisch']],
 ['uk','Ukrainisch',['uk','ua','ukrainian','ukrainisch']],
 ['ar','Arabisch',['ar','arabic','arabisch']],
 ['ja','Japanisch',['ja','japanese','japanisch']],
 ['ro','Rumänisch',['ro','romanian','rumänisch','rumaenisch']],
 ['pl','Polnisch',['pl','polish','polnisch']],
 ['ku','Kurdisch',['ku','kurdish','kurdisch','kurmancî','kurmanci']]
];
const NAME=Object.fromEntries(LANGS.map(([code,label])=>[code,label]));
const KEYS=Object.fromEntries(LANGS.map(([code,,keys])=>[code,keys]));

const LEXICON={
 'prima':{en:'great',ru:'отлично',tr:'harika',uk:'чудово',ar:'رائع',ja:'すばらしい',ro:'grozav',pl:'świetnie',ku:'pir baş'},
 'team':{en:'team',ru:'команда',tr:'takım',uk:'команда',ar:'فريق',ja:'チーム',ro:'echipă',pl:'zespół',ku:'tîm'},
 'wecken':{en:'to wake someone up',ru:'будить',tr:'uyandırmak',uk:'будити',ar:'يوقظ',ja:'起こす',ro:'a trezi',pl:'budzić',ku:'şiyar kirin'},
 'frühstück':{en:'breakfast',ru:'завтрак',tr:'kahvaltı',uk:'сніданок',ar:'فطور',ja:'朝食',ro:'mic dejun',pl:'śniadanie',ku:'taşt'},
 'fertig':{en:'ready / finished',ru:'готово',tr:'hazır / bitti',uk:'готово',ar:'جاهز / انتهى',ja:'準備ができた / 終わった',ro:'gata',pl:'gotowe',ku:'amade / qediya'},
 'los sein':{en:'to be happening',ru:'происходить',tr:'olmak / gerçekleşmek',uk:'відбуватися',ar:'يحدث',ja:'起こっている',ro:'a se întâmpla',pl:'dziać się',ku:'qewimîn'},
 'schreiben':{en:'to write',ru:'писать',tr:'yazmak',uk:'писати',ar:'يكتب',ja:'書く',ro:'a scrie',pl:'pisać',ku:'nivîsîn'},
 'mathematik':{en:'mathematics',ru:'математика',tr:'matematik',uk:'математика',ar:'الرياضيات',ja:'数学',ro:'matematică',pl:'matematyka',ku:'matematîk'},
 'test':{en:'test',ru:'тест',tr:'test',uk:'тест',ar:'اختبار',ja:'テスト',ro:'test',pl:'test',ku:'test'},
 'pünktlich':{en:'on time / punctual',ru:'вовремя',tr:'zamanında',uk:'вчасно',ar:'في الموعد',ja:'時間どおりに',ro:'la timp',pl:'punktualnie',ku:'di wextê xwe de'},
 'auf keinen fall':{en:'under no circumstances',ru:'ни в коем случае',tr:'kesinlikle hayır',uk:'у жодному разі',ar:'بأي حال من الأحوال',ja:'絶対に〜ない',ro:'în niciun caz',pl:'w żadnym wypadku',ku:'bi tu awayî na'},
 'auf jeden fall':{en:'definitely / in any case',ru:'в любом случае',tr:'kesinlikle',uk:'у будь-якому разі',ar:'على أي حال / بالتأكيد',ja:'必ず / とにかく',ro:'în orice caz',pl:'w każdym razie',ku:'di her halî de'},
 'schmecken':{en:'to taste',ru:'быть вкусным',tr:'tadı olmak',uk:'смакувати',ar:'طعمه لذيذ',ja:'味がする',ro:'a avea gust',pl:'smakować',ku:'tam kirin'},
 'nach hause':{en:'home / to home',ru:'домой',tr:'eve',uk:'додому',ar:'إلى المنزل',ja:'家へ',ro:'acasă',pl:'do domu',ku:'ber bi malê ve'},
 'schule':{en:'school',ru:'школа',tr:'okul',uk:'школа',ar:'مدرسة',ja:'学校',ro:'școală',pl:'szkoła',ku:'dibistan'},
 'krank':{en:'ill / sick',ru:'больной',tr:'hasta',uk:'хворий',ar:'مريض',ja:'病気の',ro:'bolnav',pl:'chory',ku:'nexweş'},
 'arzt':{en:'doctor',ru:'врач',tr:'doktor',uk:'лікар',ar:'طبيب',ja:'医師',ro:'medic',pl:'lekarz',ku:'bijîşk'},
 'ärztin':{en:'female doctor',ru:'врач',tr:'kadın doktor',uk:'лікарка',ar:'طبيبة',ja:'女性医師',ro:'doctoriță',pl:'lekarka',ku:'bijîşka jin'},
 'backen':{en:'to bake',ru:'печь',tr:'pişirmek',uk:'пекти',ar:'يخبز',ja:'焼く',ro:'a coace',pl:'piec',ku:'nan pijandin'},
 'singen':{en:'to sing',ru:'петь',tr:'şarkı söylemek',uk:'співати',ar:'يغني',ja:'歌う',ro:'a cânta',pl:'śpiewać',ku:'stran gotin'},
 'reiten':{en:'to ride a horse',ru:'ездить верхом',tr:'ata binmek',uk:'їздити верхи',ar:'يركب الخيل',ja:'馬に乗る',ro:'a călări',pl:'jeździć konno',ku:'siwarbûn'},
 'klavier spielen':{en:'to play the piano',ru:'играть на пианино',tr:'piyano çalmak',uk:'грати на піаніно',ar:'يعزف البيانو',ja:'ピアノを弾く',ro:'a cânta la pian',pl:'grać na pianinie',ku:'piyano lêdan'},
 'ski fahren':{en:'to ski',ru:'кататься на лыжах',tr:'kayak yapmak',uk:'кататися на лижах',ar:'يتزلج',ja:'スキーをする',ro:'a schia',pl:'jeździć na nartach',ku:'skî kirin'},
 'tennis spielen':{en:'to play tennis',ru:'играть в теннис',tr:'tenis oynamak',uk:'грати в теніс',ar:'يلعب التنس',ja:'テニスをする',ro:'a juca tenis',pl:'grać w tenisa',ku:'tenîs lîstin'},
 'lied':{en:'song',ru:'песня',tr:'şarkı',uk:'пісня',ar:'أغنية',ja:'歌',ro:'cântec',pl:'piosenka',ku:'stran'},
 'üben':{en:'to practise',ru:'упражняться',tr:'pratik yapmak',uk:'тренуватися',ar:'يتدرّب',ja:'練習する',ro:'a exersa',pl:'ćwiczyć',ku:'pratîk kirin'},
 'text':{en:'text',ru:'текст',tr:'metin',uk:'текст',ar:'نص',ja:'文章',ro:'text',pl:'tekst',ku:'metn'},
 'übung':{en:'exercise',ru:'упражнение',tr:'alıştırma',uk:'вправа',ar:'تمرين',ja:'練習問題',ro:'exercițiu',pl:'ćwiczenie',ku:'rahênan'},
 'brief':{en:'letter',ru:'письмо',tr:'mektup',uk:'лист',ar:'رسالة',ja:'手紙',ro:'scrisoare',pl:'list',ku:'name'},
 'diktat':{en:'dictation',ru:'диктант',tr:'dikte',uk:'диктант',ar:'إملاء',ja:'書き取り',ro:'dictare',pl:'dyktando',ku:'dîkte'},
 'buch':{en:'book',ru:'книга',tr:'kitap',uk:'книга',ar:'كتاب',ja:'本',ro:'carte',pl:'książka',ku:'pirtûk'},
 'schade':{en:'what a pity',ru:'жаль',tr:'yazık',uk:'шкода',ar:'يا للأسف',ja:'残念',ro:'păcat',pl:'szkoda',ku:'mixabin'},
 'kilometer':{en:'kilometre',ru:'километр',tr:'kilometre',uk:'кілометр',ar:'كيلومتر',ja:'キロメートル',ro:'kilometru',pl:'kilometr',ku:'kîlometre'},
 'kommunikation':{en:'communication',ru:'общение',tr:'iletişim',uk:'спілкування',ar:'تواصل',ja:'コミュニケーション',ro:'comunicare',pl:'komunikacja',ku:'ragihandin'},
 'mädchen':{en:'girl',ru:'девочка',tr:'kız',uk:'дівчина',ar:'فتاة',ja:'女の子',ro:'fată',pl:'dziewczynka',ku:'keç'},
 'junge':{en:'boy',ru:'мальчик',tr:'erkek çocuk',uk:'хлопець',ar:'ولد',ja:'男の子',ro:'băiat',pl:'chłopiec',ku:'kur'},
 'klasse':{en:'class',ru:'класс',tr:'sınıf',uk:'клас',ar:'صف',ja:'クラス',ro:'clasă',pl:'klasa',ku:'pol'},
 'schwimmbad':{en:'swimming pool',ru:'бассейн',tr:'yüzme havuzu',uk:'басейн',ar:'مسبح',ja:'プール',ro:'piscină',pl:'basen',ku:'hewza avjeniyê'},
 'eintritt':{en:'admission / entrance fee',ru:'вход / входной билет',tr:'giriş ücreti',uk:'вхід / вхідний квиток',ar:'دخول / رسم الدخول',ja:'入場料',ro:'intrare / bilet de intrare',pl:'wstęp / opłata za wstęp',ku:'pereyê ketinê'},
 'losfahren':{en:'to set off / depart',ru:'отправляться',tr:'yola çıkmak',uk:'вирушати',ar:'ينطلق',ja:'出発する',ro:'a porni',pl:'wyruszać',ku:'rê ketin'},
 'grundschule':{en:'primary school',ru:'начальная школа',tr:'ilkokul',uk:'початкова школа',ar:'مدرسة ابتدائية',ja:'小学校',ro:'școală primară',pl:'szkoła podstawowa',ku:'dibistana seretayî'},
 'unterricht':{en:'lesson / class',ru:'урок / занятия',tr:'ders',uk:'урок / заняття',ar:'درس',ja:'授業',ro:'lecție / curs',pl:'lekcja / zajęcia',ku:'ders'},
 'leidtun':{en:'to be sorry',ru:'сожалеть',tr:'üzgün olmak',uk:'шкодувати',ar:'يؤسف',ja:'申し訳なく思う',ro:'a-i părea rău',pl:'być przykro',ku:'poşman bûn'},
 'gitarre spielen':{en:'to play the guitar',ru:'играть на гитаре',tr:'gitar çalmak',uk:'грати на гітарі',ar:'يعزف الغيتار',ja:'ギターを弾く',ro:'a cânta la chitară',pl:'grać na gitarze',ku:'gîtar lêdan'}
};

function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function profile(){try{return JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'null')||{}}catch(e){return{}}}
function normalize(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ')}
function wordKey(item){return normalize(String(item?.full||item?.answer||item?.word||item?.term||'').replace(/^(der|die|das)\s+/i,''))}
function codeFrom(value){
 const text=normalize(value);
 for(const [code,,keys] of LANGS){if(keys.some(key=>normalize(key)===text||text.includes(normalize(key))))return code}
 return'en';
}
function currentCode(){
 const p=profile();
 return codeFrom(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.mother_language||p.language||localStorage.getItem('SP_MOTHER_LANGUAGE')||localStorage.getItem('motherLanguage')||'en');
}
function directValue(object,code){
 if(!object||typeof object!=='object')return'';
 for(const key of[code,...(KEYS[code]||[])]){
  if(object[key]!=null&&typeof object[key]!=='object'&&String(object[key]).trim())return String(object[key]).trim();
  const found=Object.keys(object).find(existing=>normalize(existing)===normalize(key));
  if(found&&object[found]!=null&&typeof object[found]!=='object'&&String(object[found]).trim())return String(object[found]).trim();
 }
 return'';
}
function recursiveValue(value,code,depth=0,seen=new Set()){
 if(!value||typeof value!=='object'||depth>5||seen.has(value))return'';
 seen.add(value);
 const direct=directValue(value,code);if(direct)return direct;
 for(const [key,nested] of Object.entries(value)){
  if(/^(image|img|audio|file|src|url|example|sentence|prompt|hint|context)$/i.test(key))continue;
  if(nested&&typeof nested==='object'){
   const result=recursiveValue(nested,code,depth+1,seen);if(result)return result;
  }
 }
 return'';
}
function exactTranslation(item,code){
 const found=recursiveValue(item,code);if(found)return found;
 const fallback=LEXICON[wordKey(item)]?.[code];
 return fallback||'';
}
function translation(item,code=currentCode()){return exactTranslation(item,code)}
function full(item){return String(item?.full||item?.answer||item?.word||'').trim()}
function type(item){
 const raw=normalize(item?.type||item?.wordType||item?.kind||item?.group||'');
 const word=full(item);
 if(/noun|nomen|substantiv/.test(raw)||/^(der|die|das)\s/i.test(word)||item?.article)return'noun';
 if(/verb/.test(raw))return'verb';
 if(/adjektiv|adjective/.test(raw))return'adjective';
 if(/adverb/.test(raw))return'adverb';
 if(/phrase|ausdruck|redewendung|satz/.test(raw)||/\s/.test(word))return'phrase';
 return'other';
}
function labelForType(value){return({noun:'Nomen',verb:'Verben',adjective:'Adjektive',adverb:'Adverbien',phrase:'Ausdrücke und Redewendungen',other:'Weitere Wörter'})[value]||'Weitere Wörter'}
function grid(item){return `<div class="sp-translation-grid">${LANGS.map(([code,label])=>`<div><b>${esc(label)}:</b> <span>${esc(exactTranslation(item,code)||'—')}</span></div>`).join('')}</div>`}
function native(item){const code=currentCode();return{code,label:NAME[code]||code.toUpperCase(),text:translation(item,code)}}
function enrich(){
 const theme=window.L7_THEME;
 if(!theme||!Array.isArray(theme.tasks))return;
 theme.tasks.forEach(task=>(task.items||[]).forEach(item=>{
  if(!item||typeof item!=='object')return;
  const selected=native(item);
  item.translationLabel=selected.label;
  item.translationText=selected.text||'—';
  if(selected.text)item.meaning=selected.text;
 }));
}

window.L7TranslationStandard={langs:LANGS,name:code=>NAME[code]||code,currentCode,translation,exactTranslation,native,grid,full,type,labelForType,enrich,escape:esc,lexicon:LEXICON};
Promise.resolve(window.L7_THEME_READY).then(enrich).catch(()=>{});
})();
