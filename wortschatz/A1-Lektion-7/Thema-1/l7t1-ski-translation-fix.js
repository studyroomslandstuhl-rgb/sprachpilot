(function(){
'use strict';
const VALUES={
 en:'ski',
 ru:'лыжа',
 tr:'kayak',
 uk:'лижа',
 ar:'زَلَّاجَة',
 ja:'スキー板',
 ro:'schi',
 pl:'narta',
 ku:'skî'
};
function apply(){
 const standard=window.L7TranslationStandard;
 if(!standard?.lexicon)return;
 standard.lexicon.ski=VALUES;
 try{standard.enrich?.()}catch(e){}
}
apply();
Promise.resolve(window.L7_THEME_READY).then(apply).catch(()=>{});
})();