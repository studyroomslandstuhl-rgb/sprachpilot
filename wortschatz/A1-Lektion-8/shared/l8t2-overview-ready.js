(function(){
'use strict';
if(window.__SP_L8T2_OVERVIEW_READY_V1)return;window.__SP_L8T2_OVERVIEW_READY_V1=true;
const base=window.L8_CONTENT_READY;
const final=window.L8_T2_CURRENT_READY;
window.L8_CONTENT_READY=Promise.all([Promise.resolve(base),Promise.resolve(final)]).then(()=>window.L8_ALL_THEMES);
})();
