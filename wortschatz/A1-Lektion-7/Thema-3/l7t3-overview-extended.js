(function(){
'use strict';
if(window.__SP_L7T3_OVERVIEW_EXTENDED_V1)return;window.__SP_L7T3_OVERVIEW_EXTENDED_V1=true;
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 const forms=window.L7T3_FORMS||[],cards=(theme?.tasks||[]).find(t=>t?.id==='karteikarten'||t?.kind==='cards');if(!cards)return theme;
 (cards.items||[]).forEach((item,index)=>{const form=forms[index]||forms.find(x=>String(item?.infinitive||item?.prompt||'').toLowerCase()===x.v.toLowerCase());if(!form)return;item.infinitive=form.v;item.perfect=`${form.aux} ${form.p}`;item.full=`${form.v} - ${form.aux} ${form.p}`;item.type='verb';item.category='verb';item.translations={...(item.translations||{}),...(form.tr||{})};item.audio=form.audio||item.audio;});
 theme.perfectOverviewRevision='l7t3-ten-verbs-20260818-v1';return theme;
});
})();
