(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
document.documentElement.setAttribute('data-sp-card-lesson','8');
const old=document.querySelector('link[href^="/css/sp-card-standard-colors.css"]');
if(old)old.href='/css/sp-card-standard-colors.css?v=20260826-l8';
else{const link=document.createElement('link');link.rel='stylesheet';link.href='/css/sp-card-standard-colors.css?v=20260826-l8';document.head.appendChild(link)}
})();