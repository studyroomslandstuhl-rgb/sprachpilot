(function(){
'use strict';
if(window.__SP_L7_PERFECT_OVERVIEW_1)return;
window.__SP_L7_PERFECT_OVERVIEW_1=true;
const LANGS=['en','ru','tr','uk','ar','ja','ro','pl','ku'];
const DATA={
2:[
['lernen','hat gelernt',['to learn','учиться','öğrenmek','вчитися','يتعلم','学ぶ','a învăța','uczyć się','hîn bûn']],
['machen','hat gemacht',['to do / make','делать','yapmak','робити','يفعل','する','a face','robić','kirin']],
['hören','hat gehört',['to listen / hear','слушать','dinlemek','слухати','يستمع','聞く','a asculta','słuchać','guhdarî kirin']],
['spielen','hat gespielt',['to play','играть','oynamak','грати','يلعب','遊ぶ','a se juca','grać','lîstin']],
['kaufen','hat gekauft',['to buy','покупать','satın almak','купувати','يشتري','買う','a cumpăra','kupować','kirîn']],
['arbeiten','hat gearbeitet',['to work','работать','çalışmak','працювати','يعمل','働く','a lucra','pracować','xebitîn']],
['frühstücken','hat gefrühstückt',['to have breakfast','завтракать','kahvaltı yapmak','снідати','يتناول الفطور','朝食をとる','a lua micul dejun','jeść śniadanie','taşt xwarin']],
['kochen','hat gekocht',['to cook','готовить','yemek pişirmek','готувати','يطبخ','料理する','a găti','gotować','xwarin pijandin']],
['sagen','hat gesagt',['to say','говорить','söylemek','казати','يقول','言う','a spune','mówić','gotin']],
['leben','hat gelebt',['to live','жить','yaşamak','жити','يعيش','生きる','a trăi','żyć','jiyan kirin']],
['kosten','hat gekostet',['to cost','стоить','mal olmak','коштувати','يكلّف','値段がする','a costa','kosztować','biha bûn']],
['grillen','hat gegrillt',['to grill / barbecue','жарить на гриле','mangal yapmak','смажити на грилі','يشوي','グリルで焼く','a face grătar','grillować','barbekû kirin']],
['suchen','hat gesucht',['to look for','искать','aramak','шукати','يبحث عن','探す','a căuta','szukać','lêgerîn']],
['wohnen','hat gewohnt',['to live / reside','жить','oturmak','мешкати','يسكن','住む','a locui','mieszkać','rûniştin']],
['schreiben','hat geschrieben',['to write','писать','yazmak','писати','يكتب','書く','a scrie','pisać','nivîsîn']],
['sehen','hat gesehen',['to see / watch','видеть / смотреть','görmek / izlemek','бачити / дивитися','يرى / يشاهد','見る','a vedea','widzieć / oglądać','dîtin']],
['lesen','hat gelesen',['to read','читать','okumak','читати','يقرأ','読む','a citi','czytać','xwendin']],
['sprechen','hat gesprochen',['to speak','говорить','konuşmak','говорити','يتكلم','話す','a vorbi','mówić','axivîn']],
['treffen','hat getroffen',['to meet','встречаться','buluşmak','зустрічатися','يقابل','会う','a întâlni','spotykać','hevdîtin']],
['schlafen','hat geschlafen',['to sleep','спать','uyumak','спати','ينام','寝る','a dormi','spać','razan']],
['essen','hat gegessen',['to eat','есть','yemek','їсти','يأكل','食べる','a mânca','jeść','xwarin']],
['trinken','hat getrunken',['to drink','пить','içmek','пити','يشرب','飲む','a bea','pić','vexwarin']]
],
3:[
['gehen','ist gegangen',['to go / walk','идти','gitmek','йти','يذهب','行く','a merge','iść','çûn']],
['fahren','ist gefahren',['to go / drive / ride','ехать','gitmek / sürmek','їхати','يذهب بالمركبة','乗って行く','a merge cu','jechać','çûn bi wesayîtê']],
['kommen','ist gekommen',['to come','приходить','gelmek','приходити','يأتي','来る','a veni','przychodzić','hatin']],
['fliegen','ist geflogen',['to fly','лететь','uçmak','летіти','يطير','飛ぶ','a zbura','lecieć','firîn']],
['wandern','ist gewandert',['to hike','ходить в поход','yürüyüş yapmak','ходити в похід','يتنزه سيرًا','ハイキングする','a face drumeții','wędrować','geriyan']]
]
};
function norm(value){return String(value||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/\s+/g,' ')}
function rowTranslations(values){return Object.fromEntries(LANGS.map((code,index)=>[code,values[index]||'']))}
function cardTask(theme){return(theme.tasks||[]).find(task=>task?.id==='karteikarten'||task?.kind==='cards'||/karteikarten/i.test(task?.title||''))}
function itemText(item){return String(window.L7TranslationStandard?.full?.(item)||item?.infinitive||item?.full||item?.word||item?.answer||item?.term||item?.front||item?.label||'').trim()}
function transform(theme){
 if(!theme||!Array.isArray(theme.tasks))return theme;
 const number=Number(document.body.dataset.theme||location.pathname.match(/Thema-(\d+)/i)?.[1]||0);
 const rows=DATA[number];if(!rows)return theme;
 const task=cardTask(theme);if(!task||!Array.isArray(task.items))return theme;
 const rowByKey=new Map(rows.map(row=>[norm(row[0]),row]));
 task.items.forEach((item,index)=>{
  if(!item||typeof item!=='object')return;
  const candidates=[itemText(item),item.infinitive,item.word,item.full,item.answer,item.term,item.front,item.label].map(norm).filter(Boolean);
  let row=null;
  for(const candidate of candidates){row=rowByKey.get(candidate)||rows.find(entry=>candidate===norm(entry[0])||candidate.startsWith(norm(entry[0])+' '));if(row)break}
  if(!row&&task.items.length===rows.length)row=rows[index];
  if(!row)return;
  const[infinitive,perfect,translations]=row;
  item.infinitive=infinitive;
  item.perfect=perfect;
  item.overviewLabel=`${infinitive} - ${perfect}`;
  item.type='verb';
  item.category='verb';
  item.translations={...(item.translations&&typeof item.translations==='object'?item.translations:{}),...rowTranslations(translations)};
 });
 theme.perfectOverviewRevision='l7-perfect-overview-2026-08-13-v1';
 window.L7_THEME=theme;
 return theme;
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(transform);
})();
