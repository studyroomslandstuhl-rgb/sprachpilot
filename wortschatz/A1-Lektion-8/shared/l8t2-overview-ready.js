(function(){
'use strict';
if(window.__SP_L8T2_OVERVIEW_READY_V4)return;window.__SP_L8T2_OVERVIEW_READY_V4=true;
const base=window.L8_CONTENT_READY;
const final=window.L8_T2_CURRENT_READY;
const translations=window.L8_T2_TRANSLATIONS_READY;
const vocab=window.L8_T2_VOCAB_READY;
const extraTranslations=window.L8_T2_EXTRA_TRANSLATIONS_READY;
const config=window.L8_T2_OVERVIEW_CONFIG_READY;
window.L8_CONTENT_READY=Promise.all([Promise.resolve(base),Promise.resolve(final),Promise.resolve(translations),Promise.resolve(vocab),Promise.resolve(extraTranslations),Promise.resolve(config)]).then(()=>window.L8_ALL_THEMES);
})();
