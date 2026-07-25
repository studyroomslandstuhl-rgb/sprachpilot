(function(){
'use strict';

const HUB='/verben-bereich/';
const HOME='/perfekt/';

function currentParams(){
 return new URLSearchParams(location.search)
}

function renderCurrentRoute(){
 try{window.dispatchEvent(new PopStateEvent('popstate'))}
 catch{window.dispatchEvent(new Event('popstate'))}
}

function openInsidePerfekt(url){
 history.replaceState(null,'',url);
 renderCurrentRoute()
}

function groupUrl(group){
 const query=new URLSearchParams();
 if(group>0)query.set('group',String(group));
 return HOME+(query.toString()?`?${query.toString()}`:'')
}

function setBackLink(link,target,label){
 if(!(link instanceof HTMLAnchorElement))return;
 link.href=target==='home'?HOME:HUB;
 link.textContent=label;
 link.dataset.perfektBack=target
}

function apply(){
 const overview=currentParams().get('view')==='overview';
 const nav=document.querySelector('#topbar nav.topnav');
 const firstLink=nav?.querySelector('a[href]');
 if(firstLink){
  if(overview)setBackLink(firstLink,'home','← Perfekt');
  else setBackLink(firstLink,'hub','← Verben-Bereich')
 }
 document.querySelectorAll('#app a[href="/index.html"]').forEach(link=>{
  const text=String(link.textContent||'').toLowerCase();
  if(text.includes('startseite')||text.includes('zurück'))setBackLink(link,'hub','← Verben-Bereich')
 })
}

document.addEventListener('click',event=>{
 const back=event.target.closest('a[data-perfekt-back]');
 if(back){
  event.preventDefault();
  event.stopImmediatePropagation();
  if(back.dataset.perfektBack==='home')openInsidePerfekt(HOME);
  else location.assign(HUB);
  return
 }

 const groupButton=event.target.closest('[data-action="group"]');
 if(groupButton&&currentParams().get('task')){
  const group=Math.max(0,Number(groupButton.dataset.group)||Number(currentParams().get('group'))||0);
  event.preventDefault();
  event.stopImmediatePropagation();
  openInsidePerfekt(groupUrl(group))
 }
},true);

apply();
new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(apply,0));
})();
