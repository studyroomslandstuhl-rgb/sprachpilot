(function(){
'use strict';
if(window.__SP_L8T1_CARD_FILTER_2)return;window.__SP_L8T1_CARD_FILTER_2=true;
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||item?.answer||item?.prompt||'').trim();
const blockedCards=new Set(['was bist du von beruf','was sind sie von beruf','was machst du beruflich','was machen sie beruflich','eigen','eigene','eigenes','arbeiten als','arbeiten bei']);
const requested=new Set(['eigen','eigene','eigenes','arbeiten als','arbeiten bei']);
const translations={
 eigen:{en:'own',ru:'собственный',tr:'kendi',uk:'власний',ar:'خاص / ذاتي',ja:'自分の',ro:'propriu',pl:'własny',ku:'xwe'},
 eigene:{en:'own (feminine form)',ru:'собственная',tr:'kendi (dişil isimle)',uk:'власна',ar:'خاصة',ja:'自分の（女性名詞と）',ro:'proprie',pl:'własna',ku:'ya xwe'},
 eigenes:{en:'own (neuter form)',ru:'собственное',tr:'kendi (nötr isimle)',uk:'власне',ar:'خاص',ja:'自分の（中性名詞と）',ro:'propriu',pl:'własne',ku:'ya xwe'},
 'arbeiten als':{en:'to work as',ru:'работать кем-то / в качестве',tr:'olarak çalışmak',uk:'працювати кимось / як',ar:'يعمل كـ',ja:'〜として働く',ro:'a lucra ca',pl:'pracować jako',ku:'wek ... kar kirin'},
 'arbeiten bei':{en:'to work at / for',ru:'работать в / у',tr:'bir yerde / şirkette çalışmak',uk:'працювати в / у',ar:'يعمل لدى / في',ja:'〜で／〜に勤める',ro:'a lucra la / pentru',pl:'pracować w / dla',ku:'li ... kar kirin'}
};
const overviewOnly=[
 {term:'eigen',type:'adjective',overviewNoImage:true,detail:'Grundform von eigen-. Vor einem Nomen bekommt das Wort eine Endung.',example:'Das ist mein eigener Arbeitsplatz.',translations:translations.eigen},
 {term:'eigene',type:'adjective',overviewNoImage:true,detail:'Form von eigen- z. B. bei einem femininen Nomen.',example:'Sie hat eine eigene Firma.',translations:translations.eigene},
 {term:'eigenes',type:'adjective',overviewNoImage:true,detail:'Form von eigen- z. B. bei einem neutralen Nomen.',example:'Er hat ein eigenes Büro.',translations:translations.eigenes},
 {term:'arbeiten als',type:'phrase',overviewNoImage:true,detail:'Mit „als“ nennt man den Beruf oder die Funktion.',example:'Ich arbeite als Koch.',translations:translations['arbeiten als']},
 {term:'arbeiten bei',type:'phrase',overviewNoImage:true,detail:'Mit „bei“ nennt man den Arbeitgeber, die Firma oder die Institution.',example:'Ich arbeite bei einer Firma.',translations:translations['arbeiten bei']}
];
function containsRequested(item){const values=[];const walk=value=>{if(value==null)return;if(typeof value==='string'){values.push(norm(value));return}if(Array.isArray(value)){value.forEach(walk);return}if(typeof value==='object')Object.values(value).forEach(walk)};walk(item);return values.some(v=>[...requested].some(word=>v===word||v.includes(` ${word} `)||v.startsWith(word+' ')||v.endsWith(' '+word)))}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||(Array.isArray(window.L8_ALL_THEMES)?window.L8_ALL_THEMES.find(t=>Number(t?.number)===1):null);if(!theme||!Array.isArray(theme.tasks))return themes;
 const cards=theme.tasks.find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));if(cards&&Array.isArray(cards.items))cards.items=cards.items.filter(item=>!blockedCards.has(norm(term(item))));
 const practice=theme.tasks.filter(task=>!task?.exam),task5=practice[4];if(task5&&Array.isArray(task5.items))task5.items=task5.items.filter(item=>!containsRequested(item));
 theme.overviewOnlyItems=overviewOnly;theme.contentRevision='l8t1-card-filter-20260825-v2';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return themes;
});
})();