(function(){
'use strict';
if(window.__SP_L8T1_CARD_FILTER_5)return;window.__SP_L8T1_CARD_FILTER_5=true;
const norm=value=>String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,' ').trim();
const term=item=>String(item?.term||item?.full||item?.word||item?.answer||item?.prompt||'').trim();
const blockedCards=new Set(['was bist du von beruf','was sind sie von beruf','was machst du beruflich','was machen sie beruflich','eigen','eigener','eigene','eigenes','eigenen','arbeiten als','arbeiten bei']);
const requested=new Set(['eigen','eigener','eigene','eigenes','eigenen','arbeiten als','arbeiten bei']);
const translations={
 eigener:{en:'own (masculine nominative)',ru:'собственный',tr:'kendi',uk:'власний',ar:'خاص / ذاتي',ja:'自分の',ro:'propriu',pl:'własny',ku:'xwe'},
 eigene:{en:'own (feminine form)',ru:'собственная',tr:'kendi',uk:'власна',ar:'خاصة',ja:'自分の',ro:'proprie',pl:'własna',ku:'ya xwe'},
 eigenes:{en:'own (neuter form)',ru:'собственное',tr:'kendi',uk:'власне',ar:'خاص',ja:'自分の',ro:'propriu',pl:'własne',ku:'ya xwe'},
 eigenen:{en:'own (masculine accusative)',ru:'собственный',tr:'kendi',uk:'власний',ar:'خاص / ذاتي',ja:'自分の',ro:'propriu',pl:'własny',ku:'xwe'},
 'arbeiten als':{en:'to work as',ru:'работать кем-то / в качестве',tr:'olarak çalışmak',uk:'працювати кимось / як',ar:'يعمل كـ',ja:'〜として働く',ro:'a lucra ca',pl:'pracować jako',ku:'wek ... kar kirin'},
 'arbeiten bei':{en:'to work at / for',ru:'работать в / у',tr:'bir yerde / şirkette çalışmak',uk:'працювати в / у',ar:'يعمل لدى / في',ja:'〜で／〜に勤める',ro:'a lucra la / pentru',pl:'pracować w / dla',ku:'li ... kar kirin'}
};
const overviewOnly=[
 {term:'eigener',type:'adjective',overviewNoImage:true,detail:'Maskulin, Nominativ: ein eigener / mein eigener + Nomen.',example:'Das ist mein eigener Arbeitsplatz.',translations:translations.eigener},
 {term:'eigene',type:'adjective',overviewNoImage:true,detail:'Feminin: eine eigene / meine eigene + Nomen.',example:'Sie hat eine eigene Firma.',translations:translations.eigene},
 {term:'eigenes',type:'adjective',overviewNoImage:true,detail:'Neutral: ein eigenes / mein eigenes + Nomen.',example:'Er hat ein eigenes Büro.',translations:translations.eigenes},
 {term:'eigenen',type:'adjective',overviewNoImage:true,detail:'Maskulin, Akkusativ: einen eigenen / meinen eigenen + Nomen.',example:'Ich habe einen eigenen Arbeitsplatz.',translations:translations.eigenen},
 {term:'arbeiten als',type:'phrase',overviewNoImage:true,overviewNoAudio:true,detail:'Mit „als“ nennt man den Beruf oder die Funktion.',example:'Ich arbeite als Koch.',translations:translations['arbeiten als']},
 {term:'arbeiten bei',type:'phrase',overviewNoImage:true,overviewNoAudio:true,detail:'Mit „bei“ nennt man den Arbeitgeber, die Firma oder die Institution.',example:'Ich arbeite bei einer Firma.',translations:translations['arbeiten bei']}
];
function containsRequested(item){const values=[];const walk=value=>{if(value==null)return;if(typeof value==='string'){values.push(norm(value));return}if(Array.isArray(value)){value.forEach(walk);return}if(typeof value==='object')Object.values(value).forEach(walk)};walk(item);return values.some(v=>[...requested].some(word=>v===word||v.includes(` ${word} `)||v.startsWith(word+' ')||v.endsWith(' '+word)))}
function l7Icon(task){
 const text=norm(`${task?.id||''} ${task?.title||''} ${task?.kind||''} ${task?.instruction||''}`);
 const types=new Set((Array.isArray(task?.items)?task.items:[]).map(item=>String(item?.type||'').toLowerCase()));
 const hasAudio=(Array.isArray(task?.items)?task.items:[]).some(item=>item?.audio||item?.audioFile);
 if(task?.exam||/prufung|exam/.test(text))return'⭐';
 if(/karte|card/.test(text)||task?.kind==='cards')return'📚';
 if(/memory/.test(text))return'🧠';
 if(/hor|listen|audio/.test(text)||hasAudio)return'🎧';
 if(/lesen|reading|text versteh|leseversteh/.test(text))return'📖';
 if(/dialog|gesprach|gespraech/.test(text))return'💬';
 if(/sprech|mundlich|muendlich|interview/.test(text))return'🎤';
 if(/grammatik|grammar|satzteil/.test(text))return'🧲';
 if(/konjug|(^| )sein( |$)|(^| )haben( |$)/.test(text))return'🔤';
 if(/endung|gruppe|sort|zuord/.test(text))return'📦';
 if(/ordnen|order|reihenfolge|redemittel/.test(text)||types.has('order'))return'🧩';
 if(/schreib|write|lucke|luecke|text|brief|information|markier|plural/.test(text)||types.has('input')||types.has('free'))return'✍️';
 if(/wahl|choice|artikel|richtig|falsch|uberschrift|ueberschrift|fehler/.test(text)||types.has('choice'))return'✅';
 return'✅';
}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const theme=window.L8_ALL_THEMES?.[1]||window.L8_ALL_THEMES?.['1']||(Array.isArray(window.L8_ALL_THEMES)?window.L8_ALL_THEMES.find(t=>Number(t?.number)===1):null);if(!theme||!Array.isArray(theme.tasks))return themes;
 const cards=theme.tasks.find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));if(cards&&Array.isArray(cards.items))cards.items=cards.items.filter(item=>!blockedCards.has(norm(term(item))));
 const practice=theme.tasks.filter(task=>!task?.exam),task5=practice[4];if(task5&&Array.isArray(task5.items))task5.items=task5.items.filter(item=>!containsRequested(item));
 theme.tasks.forEach(task=>{task.icon=l7Icon(task)});
 theme.overviewOnlyItems=overviewOnly;theme.contentRevision='l8t1-card-filter-20260825-v5';theme.iconRevision='l8t1-semantic-icons-v2';if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;return themes;
});
})();