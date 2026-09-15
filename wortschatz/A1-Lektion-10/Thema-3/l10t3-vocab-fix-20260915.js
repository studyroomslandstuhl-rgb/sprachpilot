(function(){
'use strict';
if(window.__SP_L10T3_VOCAB_FIX_20260915)return;
window.__SP_L10T3_VOCAB_FIX_20260915=true;
const D=window.L10T3;if(!D||!Array.isArray(D.cards))return;
const byId=id=>D.cards.find(x=>String(x?.id||'')===id);
const attest=byId('attest');
if(attest){
 attest.image='https://sprachpilot.b-cdn.net/attest.webp';
 attest.img=attest.image;
}
const kuehlen=byId('kuehlen');
if(kuehlen){
 kuehlen.type='verb';
 kuehlen.presentForm='kühlen';
 kuehlen.praesens='kühlen';
 kuehlen.perfectForm='hat gekühlt';
 kuehlen.perfektForm='hat gekühlt';
 kuehlen.perfekt='hat gekühlt';
}
const tabletten=byId('tabletten_nehmen');
if(tabletten){
 tabletten.type='nomen-verb-verbindung';
 tabletten.category='nomen-verb-verbindung';
 tabletten.wordType='Nomen-Verb-Verbindung';
 delete tabletten.presentForm;
 delete tabletten.praesens;
 delete tabletten.present;
 delete tabletten.perfectForm;
 delete tabletten.perfektForm;
 delete tabletten.perfekt;
 delete tabletten.perfect;
}
})();
