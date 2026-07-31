(function(){
'use strict';
const theme=Number(document.body.dataset.theme);
const page=document.body.dataset.page||'theme';
const root=document.getElementById('app');
const version='l7-theme-standard1';

function load(src){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=reject;
    document.body.appendChild(script);
  });
}

Promise.resolve(window.L7_THEME_READY)
 .then(()=>load(`../shared/l7-state.js?v=${version}`))
 .then(()=>{
   if(page==='theme'){
     return load(`../shared/l7-theme-standard.js?v=${version}`)
       .then(()=>window.L7ThemeStandard.render(theme));
   }
   if(window.L7S)window.L7S.header=()=>'';
   return load(`../shared/l7-ui.js?v=${version}`)
     .then(()=>load('../shared/l7-external-links.js?v=1'))
     .then(()=>window.L7.renderTaskPage(theme,new URLSearchParams(location.search).get('task')));
 })
 .catch(error=>{
   console.error(error);
   if(root)root.innerHTML='<section class="card"><h2>Die Inhalte konnten nicht geladen werden.</h2><p>Bitte lade die Seite neu oder aktualisiere deinen Browser.</p><button class="btn" onclick="location.reload()">Neu laden</button></section>';
 });
})();
