(function(){
'use strict';
if(window.__SP_L7T1_OVERVIEW_NATIVE_3)return;
window.__SP_L7T1_OVERVIEW_NATIVE_3=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const NOUNS=new Set([
 'team','fruhstuck','mathematik','test','schule','arzt','arztin','klavier','ski','tennis',
 'lied','text','ubung','brief','buch','spiel','film','grammatik','hausaufgabe','gitarre',
 'fahrrad','kuchen','freund','handstand','kilometer','kommunikation','madchen','junge',
 'klasse','schwimmbad','eintritt','grundschule','unterricht','franzosisch'
]);
const VERBS=new Set([
 'wecken','los sein','schreiben','konnen','backen','singen','reiten','malen','wollen','mochten',
 'uben','horen','machen','lesen','sehen','spielen','fahren','treffen','gehen','sprechen',
 'fotografieren','jonglieren','losfahren','leidtun','leid tun','fertig sein',
 'gitarre spielen','ski fahren','tennis spielen','klavier spielen'
]);
const ADJ_ADV=new Set([
 'prima','fertig','punktlich','krank','endlich','schade','gut','sehr gut','nicht gut',
 'nicht so gut','gar nicht','ein bisschen'
]);
const PHRASES=new Set([
 'auf keinen fall','auf jeden fall','nach hause'
]);

const EXTRA_TRANSLATIONS=Object.freeze({
 'konnen':{en:'can / to be able to',ru:'мочь',tr:'yapabilmek',uk:'могти',ar:'يستطيع',ja:'できる',ro:'a putea',pl:'móc',ku:'karîn'},
 'wollen':{en:'to want',ru:'хотеть',tr:'istemek',uk:'хотіти',ar:'يريد',ja:'～したい / 欲しい',ro:'a vrea',pl:'chcieć',ku:'xwestin'},
 'mochten':{en:'would like',ru:'хотелось бы',tr:'istemek (kibarca)',uk:'хотілося б',ar:'يودّ',ja:'～したいです',ro:'a dori',pl:'chciałby / chciałaby',ku:'xwestin (bi rêzdarî)'},
 'klavier':{en:'piano',ru:'пианино',tr:'piyano',uk:'піаніно',ar:'بيانو',ja:'ピアノ',ro:'pian',pl:'pianino',ku:'piyano'},
 'malen':{en:'to paint / draw',ru:'рисовать',tr:'resim yapmak',uk:'малювати',ar:'يرسم',ja:'絵を描く',ro:'a picta / desena',pl:'malować / rysować',ku:'wêne kişandin'},
 'ski':{en:'ski / skis',ru:'лыжа / лыжи',tr:'kayak',uk:'лижа / лижі',ar:'زلاجات',ja:'スキー板',ro:'schi',pl:'narty',ku:'skî'},
 'tennis':{en:'tennis',ru:'теннис',tr:'tenis',uk:'теніс',ar:'تنس',ja:'テニス',ro:'tenis',pl:'tenis',ku:'tenîs'},
 'fertig sein':{en:'to be ready / finished',ru:'быть готовым / закончить',tr:'hazır olmak / bitmiş olmak',uk:'бути готовим / закінчити',ar:'يكون جاهزًا / منتهيًا',ja:'準備ができている / 終わっている',ro:'a fi gata',pl:'być gotowym / skończyć',ku:'amade bûn / qediya bûn'},
 'gut':{en:'good / well',ru:'хорошо',tr:'iyi',uk:'добре',ar:'جيد',ja:'良い / 上手に',ro:'bine',pl:'dobrze',ku:'baş'},
 'sehr gut':{en:'very well',ru:'очень хорошо',tr:'çok iyi',uk:'дуже добре',ar:'جيد جدًا',ja:'とても上手に',ro:'foarte bine',pl:'bardzo dobrze',ku:'pir baş'},
 'nicht gut':{en:'not well',ru:'не очень хорошо',tr:'iyi değil',uk:'недобре',ar:'ليس جيدًا',ja:'上手ではない',ro:'nu prea bine',pl:'niedobrze',ku:'ne baş'},
 'nicht so gut':{en:'not so well',ru:'не так хорошо',tr:'o kadar iyi değil',uk:'не так добре',ar:'ليس جيدًا جدًا',ja:'あまり上手ではない',ro:'nu atât de bine',pl:'nie tak dobrze',ku:'ne ewqas baş'},
 'gar nicht':{en:'not at all',ru:'совсем не',tr:'hiç',uk:'зовсім не',ar:'على الإطلاق',ja:'まったく～ない',ro:'deloc',pl:'wcale nie',ku:'qet na'},
 'ein bisschen':{en:'a little',ru:'немного',tr:'biraz',uk:'трохи',ar:'قليلًا',ja:'少し',ro:'puțin',pl:'trochę',ku:'hinek'},
 'spiel':{en:'game',ru:'игра',tr:'oyun',uk:'гра',ar:'لعبة',ja:'ゲーム',ro:'joc',pl:'gra',ku:'lîstik'},
 'film':{en:'film / movie',ru:'фильм',tr:'film',uk:'фільм',ar:'فيلم',ja:'映画',ro:'film',pl:'film',ku:'fîlm'},
 'grammatik':{en:'grammar',ru:'грамматика',tr:'dil bilgisi',uk:'граматика',ar:'قواعد اللغة',ja:'文法',ro:'gramatică',pl:'gramatyka',ku:'rêziman'},
 'hausaufgabe':{en:'homework',ru:'домашнее задание',tr:'ödev',uk:'домашнє завдання',ar:'واجب منزلي',ja:'宿題',ro:'temă',pl:'praca domowa',ku:'karê malê'},
 'gitarre':{en:'guitar',ru:'гитара',tr:'gitar',uk:'гітара',ar:'غيتار',ja:'ギター',ro:'chitară',pl:'gitara',ku:'gîtar'},
 'fahrrad':{en:'bicycle',ru:'велосипед',tr:'bisiklet',uk:'велосипед',ar:'دراجة هوائية',ja:'自転車',ro:'bicicletă',pl:'rower',ku:'bisîklet'},
 'kuchen':{en:'cake',ru:'пирог',tr:'kek',uk:'пиріг',ar:'كعكة',ja:'ケーキ',ro:'prăjitură',pl:'ciasto',ku:'kek'},
 'freund':{en:'friend',ru:'друг',tr:'arkadaş',uk:'друг',ar:'صديق',ja:'友達',ro:'prieten',pl:'przyjaciel',ku:'heval'},
 'handstand':{en:'handstand',ru:'стойка на руках',tr:'amuda kalkma',uk:'стійка на руках',ar:'الوقوف على اليدين',ja:'逆立ち',ro:'stând în mâini',pl:'stanie na rękach',ku:'li ser destan rawestan'},
 'horen':{en:'to hear / listen',ru:'слушать',tr:'dinlemek',uk:'слухати',ar:'يسمع / يستمع',ja:'聞く',ro:'a asculta',pl:'słuchać',ku:'guhdarî kirin'},
 'machen':{en:'to do / make',ru:'делать',tr:'yapmak',uk:'робити',ar:'يفعل',ja:'する',ro:'a face',pl:'robić',ku:'kirin'},
 'lesen':{en:'to read',ru:'читать',tr:'okumak',uk:'читати',ar:'يقرأ',ja:'読む',ro:'a citi',pl:'czytać',ku:'xwendin'},
 'sehen':{en:'to see / watch',ru:'смотреть',tr:'görmek / izlemek',uk:'дивитися',ar:'يرى / يشاهد',ja:'見る',ro:'a vedea',pl:'widzieć / oglądać',ku:'dîtin'},
 'spielen':{en:'to play',ru:'играть',tr:'oynamak',uk:'грати',ar:'يلعب',ja:'遊ぶ / 演奏する',ro:'a juca',pl:'grać',ku:'lîstin'},
 'fahren':{en:'to go / drive / ride',ru:'ехать',tr:'gitmek / sürmek',uk:'їхати',ar:'يذهب بالمركبة',ja:'乗って行く',ro:'a merge cu',pl:'jechać',ku:'çûn bi wesayîtê'},
 'treffen':{en:'to meet',ru:'встречать / встречаться',tr:'buluşmak',uk:'зустрічати / зустрічатися',ar:'يقابل',ja:'会う',ro:'a întâlni',pl:'spotykać',ku:'hevdîtin'},
 'gehen':{en:'to go',ru:'идти',tr:'gitmek',uk:'йти',ar:'يذهب',ja:'行く',ro:'a merge',pl:'iść',ku:'çûn'},
 'sprechen':{en:'to speak',ru:'говорить',tr:'konuşmak',uk:'говорити',ar:'يتكلم',ja:'話す',ro:'a vorbi',pl:'mówić',ku:'axivîn'},
 'franzosisch':{en:'French',ru:'французский язык',tr:'Fransızca',uk:'французька мова',ar:'الفرنسية',ja:'フランス語',ro:'franceză',pl:'francuski',ku:'fransî'},
 'fotografieren':{en:'to take photos',ru:'фотографировать',tr:'fotoğraf çekmek',uk:'фотографувати',ar:'يصور',ja:'写真を撮る',ro:'a fotografia',pl:'fotografować',ku:'wêne kişandin'},
 'jonglieren':{en:'to juggle',ru:'жонглировать',tr:'jonglörlük yapmak',uk:'жонглювати',ar:'يمارس ألعاب الخفة',ja:'ジャグリングする',ro:'a jongla',pl:'żonglować',ku:'jonglêrî kirin'}
});

function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss')
  .replace(/[„“”"'`´.,!?;:()]/g,' ').replace(/\s+/g,' ').trim();
}
function wordKey(api,item){
 return norm(api.full(item)).replace(/^(der|die|das)\s+/,'');
}
function installCategories(api){
 const originalType=api.type.bind(api);
 api.type=item=>{
  const key=wordKey(api,item);
  if(NOUNS.has(key))return'noun';
  if(VERBS.has(key))return'verb';
  if(ADJ_ADV.has(key))return'adjective';
  if(PHRASES.has(key))return'phrase';
  const raw=originalType(item);
  if(raw==='adverb')return'adjective';
  return raw;
 };
 api.labelForType=value=>({
  noun:'Nomen',
  verb:'Verben',
  adjective:'Adjektive & Adverbien',
  adverb:'Adjektive & Adverbien',
  phrase:'Feste Ausdrücke / Redewendungen',
  other:'Weitere Wörter'
 })[value]||'Weitere Wörter';
}
function installStandardGrid(api){
 api.grid=item=>`<div class="sp-translation-grid">${api.langs.map(([code,label])=>`<div><b>${api.escape(label)}:</b> <span>${api.escape(api.exactTranslation(item,code)||'—')}</span></div>`).join('')}</div>`;
}
function completeTranslations(theme,api){
 const task=(theme?.tasks||[]).find(item=>item?.id==='karteikarten'||item?.kind==='cards'||/karteikarten/i.test(item?.title||''));
 const items=Array.isArray(task?.items)?task.items:[];
 const missing={};
 let filled=0;
 for(const item of items){
  if(!item||typeof item!=='object')continue;
  const key=wordKey(api,item);
  const extra=EXTRA_TRANSLATIONS[key]||{};
  const translations=(item.translations&&typeof item.translations==='object')?{...item.translations}:{};
  for(const [code] of api.langs){
   const current=String(api.exactTranslation(item,code)||'').trim();
   const value=current||String(extra[code]||'').trim();
   if(value){
    if(!String(translations[code]||'').trim())filled++;
    translations[code]=String(translations[code]||'').trim()||value;
   }else{
    (missing[api.full(item)]||(missing[api.full(item)]=[])).push(code);
   }
  }
  item.translations=translations;
 }
 window.L7T1TranslationReport={
  standardLanguages:api.langs.map(([code,label])=>({code,label})),
  words:items.length,
  filled,
  missing
 };
 return theme;
}

function install(){
 const api=window.L7TranslationStandard;
 if(!api)return false;
 installCategories(api);
 installStandardGrid(api);
 window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
  const completed=completeTranslations(theme,api);
  api.enrich?.();
  return completed;
 });
 return true;
}
if(!install()){
 let tries=0;
 const timer=setInterval(()=>{
  if(install()||++tries>80)clearInterval(timer);
 },25);
}
})();
