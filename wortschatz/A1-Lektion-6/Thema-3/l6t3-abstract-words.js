(function(){
'use strict';
if(!Array.isArray(WORDS))return;
const mitbringen=WORDS.find(word=>word.id==='mitbringen');
if(mitbringen)mitbringen.image='mitbringen.webp';
const abstractWords=[
 {id:'endlich',group:'Zeit und Reihenfolge',type:'adverb',word:'endlich',full:'endlich',meaning:'nach langem Warten',sentence:'Endlich ist das Essen da.',tr:{en:'finally',ru:'наконец',uk:'нарешті',tr:'sonunda',ar:'أخيرًا',ja:'やっと',ro:'în sfârșit',pl:'wreszcie'}},
 {id:'zuerst',group:'Zeit und Reihenfolge',type:'adverb',word:'zuerst',full:'zuerst',meaning:'als Erstes',sentence:'Zuerst lese ich die Speisekarte.',tr:{en:'first',ru:'сначала',uk:'спочатку',tr:'önce',ar:'أولًا',ja:'まず',ro:'mai întâi',pl:'najpierw'}},
 {id:'dann',group:'Zeit und Reihenfolge',type:'adverb',word:'dann',full:'dann',meaning:'danach',sentence:'Dann nehme ich einen Hamburger.',tr:{en:'then',ru:'потом',uk:'потім',tr:'sonra',ar:'ثم',ja:'それから',ro:'apoi',pl:'potem'}},
 {id:'naemlich',group:'Zeit und Reihenfolge',type:'adverb',word:'nämlich',full:'nämlich',meaning:'genauer gesagt',sentence:'Ich nehme nur einen Saft, ich habe nämlich keinen Hunger.',tr:{en:'namely',ru:'а именно',uk:'а саме',tr:'yani',ar:'أي بالتحديد',ja:'つまり',ro:'și anume',pl:'mianowicie'}},
 {id:'gerade',group:'Zeit und Reihenfolge',type:'adverb',word:'gerade',full:'gerade',meaning:'jetzt',sentence:'Ich lese gerade die Speisekarte.',tr:{en:'right now',ru:'сейчас',uk:'зараз',tr:'şu anda',ar:'الآن',ja:'今',ro:'chiar acum',pl:'właśnie teraz'}},
 {id:'sofort',group:'Zeit und Reihenfolge',type:'adverb',word:'sofort',full:'sofort',meaning:'jetzt, nicht später',sentence:'Der Kellner kommt sofort.',tr:{en:'immediately',ru:'сразу',uk:'негайно',tr:'hemen',ar:'فورًا',ja:'すぐに',ro:'imediat',pl:'natychmiast'}}
];
abstractWords.forEach(word=>{if(!WORDS.some(existing=>existing.id===word.id))WORDS.push(word)});
const oldVisual=visual;
const oldMiniVisual=miniVisual;
visual=function(word){
 if(!word||!word.meaning)return oldVisual(word);
 return `<div class="task-img-box meaning-visual" style="display:flex;min-height:245px;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:28px;border:3px solid #bfe6ef;border-radius:24px;background:#f5fdff;text-align:center"><div style="font-size:15px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:#55717a">Bedeutung</div><div style="font-size:32px;font-weight:900;line-height:1.3;color:#0b5c73">${word.meaning}</div></div>`;
};
miniVisual=function(word){
 if(!word||!word.meaning)return oldMiniVisual(word);
 return `<div class="meaning-mini" style="display:flex;width:100%;min-height:92px;align-items:center;justify-content:center;padding:10px;border:2px solid #bfe6ef;border-radius:14px;background:#f5fdff;text-align:center;font-size:15px;font-weight:900;line-height:1.25;color:#0b5c73">${word.meaning}</div>`;
};
})();
