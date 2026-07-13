const L6T2_POST_WORDS=[
  {id:'wetterbericht',group:'Postkarte/Wetterbericht',type:'noun',article:'der',word:'Wetterbericht',full:'der Wetterbericht',image:'wetterbericht.webp',sentence:'Der Wetterbericht ist neu.',tr:{en:'weather report',ru:'прогноз погоды',uk:'прогноз погоди',tr:'hava durumu raporu',ar:'تقرير الطقس',ja:'天気予報',ro:'buletin meteo',pl:'prognoza pogody',ku:'rapora hewayê'}},
  {id:'mitte',group:'Postkarte/Wetterbericht',type:'noun',article:'die',word:'Mitte',full:'die Mitte',image:'mitte.webp',sentence:'In der Mitte ist es angenehm.',tr:{en:'middle',ru:'середина',uk:'середина',tr:'orta',ar:'الوسط',ja:'中央',ro:'mijloc',pl:'środek',ku:'navîn'}},
  {id:'ueberall',group:'Postkarte/Wetterbericht',type:'adverb',article:'',word:'überall',full:'überall',image:'ueberall.webp',sentence:'Überall ist das Wetter schön.',tr:{en:'everywhere',ru:'везде',uk:'усюди',tr:'her yerde',ar:'في كل مكان',ja:'どこでも',ro:'peste tot',pl:'wszędzie',ku:'li her derê'}},
  {id:'temperatur',group:'Postkarte/Wetterbericht',type:'noun',article:'die',word:'Temperatur',full:'die Temperatur',image:'temperatur.webp',sentence:'Die Temperatur ist angenehm.',tr:{en:'temperature',ru:'температура',uk:'температура',tr:'sıcaklık',ar:'درجة الحرارة',ja:'気温',ro:'temperatură',pl:'temperatura',ku:'pileya germê'}},
  {id:'leicht',group:'Postkarte/Wetterbericht',type:'adjective',article:'',word:'leicht',full:'leicht',image:'leicht.webp',sentence:'Es ist leicht windig.',tr:{en:'light/slight',ru:'лёгкий',uk:'легкий',tr:'hafif',ar:'خفيف',ja:'軽い',ro:'ușor',pl:'lekki',ku:'sivik'}},
  {id:'bleiben',group:'Postkarte/Wetterbericht',type:'verb',article:'',word:'bleiben',full:'bleiben',image:'bleiben.webp',sentence:'Die Temperaturen bleiben angenehm.',tr:{en:'to stay',ru:'оставаться',uk:'залишатися',tr:'kalmak',ar:'يبقى',ja:'残る',ro:'a rămâne',pl:'zostawać',ku:'man'}},
  {id:'plus',group:'Postkarte/Wetterbericht',type:'word',article:'',word:'plus',full:'plus',image:'plus.webp',sentence:'Es sind plus zehn Grad.',tr:{en:'plus',ru:'плюс',uk:'плюс',tr:'artı',ar:'زائد',ja:'プラス',ro:'plus',pl:'plus',ku:'zêde'}},
  {id:'minus',group:'Postkarte/Wetterbericht',type:'word',article:'',word:'minus',full:'minus',image:'minus.webp',sentence:'Es sind minus zwei Grad.',tr:{en:'minus',ru:'минус',uk:'мінус',tr:'eksi',ar:'ناقص',ja:'マイナス',ro:'minus',pl:'minus',ku:'kêm'}},
  {id:'radio',group:'Postkarte/Wetterbericht',type:'noun',article:'das',word:'Radio',full:'das Radio',image:'radio.webp',sentence:'Das Radio läuft.',tr:{en:'radio',ru:'радио',uk:'радіо',tr:'radyo',ar:'الراديو',ja:'ラジオ',ro:'radio',pl:'radio',ku:'radyo'}},
  {id:'internet',group:'Postkarte/Wetterbericht',type:'noun',article:'das',word:'Internet',full:'das Internet',image:'internet.webp',sentence:'Das Internet funktioniert.',tr:{en:'internet',ru:'интернет',uk:'інтернет',tr:'internet',ar:'الإنترنت',ja:'インターネット',ro:'internet',pl:'internet',ku:'înternet'}},
  {id:'angenehm',group:'Postkarte/Wetterbericht',type:'adjective',article:'',word:'angenehm',full:'angenehm',image:'angenehm.webp',sentence:'Das Wetter ist angenehm.',tr:{en:'pleasant',ru:'приятный',uk:'приємний',tr:'hoş',ar:'ممتع',ja:'快適な',ro:'plăcut',pl:'przyjemny',ku:'xweş'}}
];
function l6t2RemoveSchlecht(){let i;while((i=WORDS.findIndex(w=>w&&w.id==='schlecht'))>=0)WORDS.splice(i,1)}
function l6t2ApplyCountryUsage(){WORDS.filter(w=>w&&w.group==='Länder').forEach(w=>{w.sentence=String(w.sentence||'').replace(/\bwohne\b/g,'lebe').replace(/\bwohnt\b/g,'lebt').replace(/\bwohnen\b/g,'leben')})}
function l6t2AddPostWords(){l6t2RemoveSchlecht();l6t2ApplyCountryUsage();L6T2_POST_WORDS.forEach(w=>{const e=WORDS.find(x=>x.id===w.id);if(e)Object.assign(e,w);else WORDS.push(w)})}
l6t2AddPostWords();
function l6t2MigrateRemovedSchlecht(){
  try{
    const marker=CFG.key+'_removed_schlecht_v1';
    if(localStorage.getItem(marker)==='1')return;
    const removedIndex=WORDS.findIndex(w=>w.id==='angenehm');
    const newTotal=WORDS.length,oldTotal=newTotal+1;
    const files=['karteikarten.html','bild-wort.html','hoeren-bild.html','hoeren-schreiben.html'];
    const mapIndex=i=>i===removedIndex?null:(i>removedIndex?i-1:i);
    files.forEach(file=>{
      const key=CFG.key+'_'+file;
      const st=JSON.parse(localStorage.getItem(key)||'null');
      if(!st||st.total!==oldTotal)return;
      const mapList=list=>[...new Set((Array.isArray(list)?list:[]).map(mapIndex).filter(i=>Number.isInteger(i)&&i>=0&&i<newTotal))];
      const done=mapList(st.done),queue=mapList(st.queue).filter(i=>!done.includes(i));
      const mappedCurrent=Number.isInteger(st.current)?mapIndex(st.current):null;
      const current=Number.isInteger(mappedCurrent)&&mappedCurrent>=0&&mappedCurrent<newTotal&&!done.includes(mappedCurrent)?mappedCurrent:null;
      localStorage.setItem(key,JSON.stringify({total:newTotal,done,queue:queue.filter(i=>i!==current),current,tries:Number(st.tries||0),hadWrong:!!st.hadWrong}));
    });
    localStorage.setItem(marker,'1');
  }catch(e){}
}
l6t2MigrateRemovedSchlecht();
const oldWordsPost=window.words;
window.words=words=function(){l6t2AddPostWords();const list=typeof oldWordsPost==='function'?oldWordsPost():WORDS;const seen=new Set();return list.filter(w=>w&&w.id&&w.id!=='schlecht'&&!seen.has(w.id)&&seen.add(w.id))};

const POSTCARD_IMAGE_GAPS=[
  {id:'deutschland',file:'deutschland.webp',a:'Deutschland'},
  {id:'wetterbericht',file:'wetterbericht.webp',a:'Wetterbericht'},
  {id:'sueden',file:'sueden.webp',a:'Süden'},
  {id:'angenehm',file:'angenehm.webp',a:'angenehm'},
  {id:'temperatur',file:'temperatur.webp',a:'Temperatur'},
  {id:'plus',file:'plus.webp',a:'plus'},
  {id:'ueberall',file:'ueberall.webp',a:'überall'},
  {id:'bleiben',file:'bleiben.webp',a:'bleiben'}
];
const POSTCARD_GRAMMAR_GAPS=[
  {a:'in Japan'},
  {a:'Im Frühling'},
  {a:'Am Morgen'},
  {a:'am Abend'},
  {a:'plus fünfzehn Grad'},
  {a:'im Norden'}
];
const oldRenderOverviewPost=window.renderOverview;
window.renderOverview=renderOverview=function(target){l6t2AddPostWords();if(typeof oldRenderOverviewPost==='function')oldRenderOverviewPost(target);else if(target)target.innerHTML='';if(target&&!document.getElementById('postcard-rule-box')){target.innerHTML+=`<section class="type-block" id="postcard-rule-box"><div class="type-title">Postkarte: Wetter und Land</div><div class="grammar-rule">Neue Wörter: der Wetterbericht · die Mitte · überall · die Temperatur · leicht · bleiben · plus · minus · das Radio · das Internet · angenehm</div><div class="grammar-rule">Beispiel: Ich lebe in Deutschland. Das Wetter ist angenehm. Es sind plus zwölf Grad.</div></section>`}}