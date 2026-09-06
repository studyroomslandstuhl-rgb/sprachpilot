(function(){
'use strict';
const D=window.L9T4;if(!D||!Array.isArray(D.cards))return;
const CDN='https://sprachpilot.b-cdn.net/',AUDIO=CDN+'audio/';
const code=String(window.L9T4Translations?.code||'en');
const TR={
 sprachschule:{en:'language school',ru:'языковая школа',tr:'dil okulu',uk:'мовна школа',ar:'مدرسة لغات',ja:'語学学校',ro:'școală de limbi',pl:'szkoła językowa',ku:'dibistana ziman'},
 besuchen:{en:'to visit / attend',ru:'посещать',tr:'ziyaret etmek / devam etmek',uk:'відвідувати',ar:'يزور / يرتاد',ja:'訪れる / 通う',ro:'a vizita / a frecventa',pl:'odwiedzać / uczęszczać',ku:'serdan kirin / çûn'}
};
const sprachschule={
 id:'sprachschule',article:'die',word:'Sprachschule',full:'die Sprachschule',plural:'die Sprachschulen',type:'noun',
 meaning:'Eine Schule, in der man eine Sprache lernt.',example:'Ich lerne Deutsch in einer Sprachschule.',
 image:`${CDN}sprachschule.webp`,audio:`${AUDIO}sprachschule.mp3`,translation:TR.sprachschule[code]||TR.sprachschule.en
};
const besuchen={
 id:'besuchen',word:'besuchen',full:'besuchen',article:'',plural:'',perfect:'hat besucht',type:'verb',
 meaning:'Zu einem Ort oder zu einer Person gehen und dort Zeit verbringen.',example:'Ich besuche eine Sprachschule.',
 image:`${CDN}sprachschule_besuchen.webp`,audio:'',translation:TR.besuchen[code]||TR.besuchen.en
};
const oldIndex=D.cards.findIndex(x=>x?.id==='sprachschule_besuchen'||String(x?.full||x?.word||'').trim().toLowerCase()==='die sprachschule besuchen');
D.cards=D.cards.filter(x=>x?.id!=='sprachschule_besuchen'&&String(x?.full||x?.word||'').trim().toLowerCase()!=='die sprachschule besuchen');
if(!D.cards.some(x=>x?.id==='sprachschule'))D.cards.splice(oldIndex>=0?oldIndex:Math.min(14,D.cards.length),0,sprachschule);
if(!D.cards.some(x=>x?.id==='besuchen')){
 const i=D.cards.findIndex(x=>x?.id==='sprachschule');
 D.cards.splice(i>=0?i+1:D.cards.length,0,besuchen);
}
const audioFiles={
 erlaubnis:'die_erlaubnis.mp3',
 angehoerige:'die_angehoerige.mp3',
 angehoeriger:'der_angehoerige.mp3'
};
for(const item of D.cards){
 const file=audioFiles[item?.id];
 if(file)item.audio=`${AUDIO}${file}`;
}
window.L9_T4_WORDS=D.cards;
if(window.L9_THEMES?.[4])window.L9_THEMES[4].coreVocabulary=D.cards;
if(Array.isArray(D.perfectItems)&&!D.perfectItems.some(x=>String(x?.verb||'').toLowerCase()==='besuchen'))D.perfectItems.push({id:'pf-4-besuchen',verb:'besuchen',answer:'hat besucht'});
})();
