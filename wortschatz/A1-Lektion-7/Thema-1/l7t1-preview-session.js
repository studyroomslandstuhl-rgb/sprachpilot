(function(){
'use strict';
if(window.__L7T1_PREVIEW_SESSION)return;
window.__L7T1_PREVIEW_SESSION=true;
if(typeof Storage==='undefined')return;
const nativeSet=Storage.prototype.setItem;
const nativeRemove=Storage.prototype.removeItem;
Storage.prototype.setItem=function(key,value){
 const name=String(key||'');
 if(this===window.localStorage&&name.startsWith('SP_L7_PREVIEW')){
  return nativeSet.call(window.sessionStorage,name,String(value));
 }
 return nativeSet.call(this,name,String(value));
};
Storage.prototype.removeItem=function(key){
 const name=String(key||'');
 if(this===window.localStorage&&name.startsWith('SP_L7_PREVIEW')){
  nativeRemove.call(window.sessionStorage,name);
  return nativeRemove.call(this,name);
 }
 return nativeRemove.call(this,name);
};
})();