(function(){
'use strict';

const HUB='/verben-bereich/';
const section=location.pathname.startsWith('/perfekt/')?'perfekt':location.pathname.startsWith('/verben/')?'verben':'';
if(!section)return;

function setHubLink(link){
 if(!(link instanceof HTMLAnchorElement))return;
 link.href=HUB;
 link.textContent='← Verben';
}

function apply(){
 document.querySelectorAll('#topbar nav.topnav a[href]').forEach(link=>{
  const href=link.getAttribute('href')||'';
  const text=String(link.textContent||'').trim().toLowerCase();
  if(href==='/index.html'||text.includes('startseite')||text==='← verben')setHubLink(link)
 });
 document.querySelectorAll('#app a[href]').forEach(link=>{
  const href=link.getAttribute('href')||'';
  const text=String(link.textContent||'').trim().toLowerCase();
  if(href==='/index.html'&&(text.includes('startseite')||text.includes('zurück')))setHubLink(link)
 });
}

function groupUrl(group){
 const query=new URLSearchParams();
 if(group>0)query.set('group',String(group));
 return `/${section}/`+(query.toString()?`?${query.toString()}`:'')
}

document.addEventListener('click',event=>{
 const button=event.target.closest('[data-action="group"]');
 if(!button)return;
 const current=new URLSearchParams(location.search);
 if(!current.get('task'))return;
 const group=Math.max(0,Number(button.dataset.group)||Number(current.get('group'))||0);
 event.preventDefault();
 event.stopImmediatePropagation();
 history.replaceState(null,'',groupUrl(group));
 try{window.dispatchEvent(new PopStateEvent('popstate'))}
 catch{window.dispatchEvent(new Event('popstate'))}
},true);

apply();
new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();