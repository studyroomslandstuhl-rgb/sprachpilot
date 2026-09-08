(function(){
'use strict';
if(window.__SP_THEME_RELEASE_EDITOR_FIX_20260908)return;
window.__SP_THEME_RELEASE_EDITOR_FIX_20260908=true;

function install(){
  const draft=window.ReleaseDraft||globalThis.ReleaseDraft;
  if(!draft||draft.__themeReleaseFix20260908)return false;
  draft.__themeReleaseFix20260908=true;
  const oldSetTheme=typeof draft.setTheme==='function'?draft.setTheme.bind(draft):null;

  draft.setTheme=function(lessonKey,themeKey,value){
    if(oldSetTheme)oldSetTheme(lessonKey,themeKey,!!value);
    const on=!!value;
    this.setMany([
      ['enabledThemes',lessonKey+'/'+themeKey],
      ['enabledThemes','wortschatz/'+lessonKey+'/'+themeKey],
      ['enabledThemes','Wortschatz/'+lessonKey+'/'+themeKey],
      ['releases','wortschatz','lessons',lessonKey,'themes',themeKey,'enabled'],
      ['releases','Wortschatz','lessons',lessonKey,'themes',themeKey,'enabled']
    ],on);
    if(on&&typeof this.enableLesson==='function')this.enableLesson(lessonKey);
  };
  return true;
}

if(!install()){
  const timer=setInterval(()=>{
    if(install())clearInterval(timer);
  },500);
  window.addEventListener('beforeunload',()=>clearInterval(timer),{once:true});
}
})();
