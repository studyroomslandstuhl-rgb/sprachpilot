(function(){
'use strict';
if(window.__SP_L7_OPTIONAL_ELLIPSIS_V1)return;
window.__SP_L7_OPTIONAL_ELLIPSIS_V1=true;

const S=window.L7S;
if(!S)return;

S.norm=value=>String(value??'')
 .normalize('NFC')
 .trim()
 .toLowerCase()
 .replace(/[.,!?;:…“”"'`´()]/gu,'')
 .replace(/\s+/g,' ')
 .trim();

window.SP_L7_OPTIONAL_ELLIPSIS={
 version:1,
 examples:[
  'Ich glaube',
  'Ich glaube...',
  'Ich glaube ...',
  'Ich glaube …'
 ]
};
})();
