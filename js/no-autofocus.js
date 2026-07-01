(function(){
  if(window.__SP_NO_AUTOFUCUS_INSTALLED__)return;
  window.__SP_NO_AUTOFUCUS_INSTALLED__=true;
  const nativeFocus=HTMLElement.prototype.focus;
  HTMLElement.prototype.focus=function(){
    const tag=String(this.tagName||'').toLowerCase();
    const editable=this.isContentEditable;
    if(tag==='input'||tag==='textarea'||tag==='select'||editable){
      return;
    }
    return nativeFocus.apply(this,arguments);
  };
})();