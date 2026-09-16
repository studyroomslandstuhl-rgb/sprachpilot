(function(){
'use strict';
window.SP_VOCAB_IMAGE_FILENAME_OVERRIDES=Object.assign({},window.SP_VOCAB_IMAGE_FILENAME_OVERRIDES||{}, {
  schluessel:'der_schluessel.webp',
  flugzeug:'das_flugzeug.webp'
});
window.SPResolveVocabImageFile=function(id,fallback){
  return window.SP_VOCAB_IMAGE_FILENAME_OVERRIDES?.[String(id||'')]||fallback||`${id}.webp`;
};
})();
