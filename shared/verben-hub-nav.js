(function(){
'use strict';

const HUB='/verben-bereich/';
const section=location.pathname.startsWith('/perfekt/')?'perfekt':location.pathname.startsWith('/verben/')?'verben':'';
if(!section)return;

const HOME=`/${section}/`;
const sectionTitle=section==='perfekt'?'Perfekt':'Verben';
const nativePushState=history.pushState.bind(history);
const nativeReplaceState=history.replaceState.bind(history);

function normalizedUrl(value){
 try{const url=new URL(value||location.href,location.href);return url.pathname+url.search+url.hash}catch{return String(value||'')}
}

history.pushState=function(state,title,url){
 const target=normalizedUrl(url);
 const current=location.pathname+location.search+location.hash;
 if(target===current){nativeReplaceState(state,title,target);return}
 return nativePushState(state,title,target)
};

function groupUrl(group){
 const query=new URLSearchParams();
 if(group>0)query.set('group',String(group));
 return HOME+(query.toString()?`?${query.toString()}`:'')
}

function seedLocalHistory(){
 if(history.state?.spVerbNavigation===section)return;
 const params=new URLSearchParams(location.search);
 const group=Math.max(0,Number(params.get('group'))||0);
 const task=params.get('task')||'';
 const overview=params.get('view')==='overview';
 const original=location.pathname+location.search+location.hash;
 const deep=overview||group>0||!!task;
 if(!deep){nativeReplaceState({...(history.state||{}),spVerbNavigation:section,route:'home'},'',original);return}
 nativeReplaceState({spVerbNavigation:section,route:'home'},'',HOME);
 if(group>0)nativePushState({spVerbNavigation:section,route:'group',group},'',groupUrl(group));
 if(task)nativePushState({spVerbNavigation:section,route:'task',group,task},'',original);
 else if(overview)nativePushState({spVerbNavigation:section,route:'overview'},'',original)
}

function setLink(link,href,label){
 if(!(link instanceof HTMLAnchorElement))return;
 link.href=href;
 link.textContent=label
}

function apply(){
 const params=new URLSearchParams(location.search);
 const overview=params.get('view')==='overview';
 document.querySelectorAll('#topbar nav.topnav a[href]').forEach(link=>{
  const href=link.getAttribute('href')||'';
  const text=String(link.textContent||'').trim().toLowerCase();
  if(href==='/index.html'||href===HUB||text.includes('startseite')||text.includes('verben-bereich')||text==='← verben'){
   if(overview)setLink(link,HOME,`← ${sectionTitle}`);
   else setLink(link,HUB,'← Verben-Bereich')
  }
 });
 document.querySelectorAll('#app a[href]').forEach(link=>{
  const href=link.getAttribute('href')||'';
  const text=String(link.textContent||'').trim().toLowerCase();
  if(href==='/index.html'&&(text.includes('startseite')||text.includes('zurück')))setLink(link,HUB,'← Verben-Bereich')
 })
}

function renderCurrentRoute(){
 try{window.dispatchEvent(new PopStateEvent('popstate'))}
 catch{window.dispatchEvent(new Event('popstate'))}
}

document.addEventListener('click',event=>{
 const groupButton=event.target.closest('[data-action="group"]');
 if(groupButton){
  const current=new URLSearchParams(location.search);
  if(current.get('task')){
   const group=Math.max(0,Number(groupButton.dataset.group)||Number(current.get('group'))||0);
   event.preventDefault();
   event.stopImmediatePropagation();
   nativeReplaceState({spVerbNavigation:section,route:'group',group},'',groupUrl(group));
   renderCurrentRoute();
   return
  }
 }
 const hubLink=event.target.closest('a[href="/verben-bereich/"]');
 if(hubLink){event.preventDefault();location.assign(HUB);return}
 const moduleHome=event.target.closest(`a[href="${HOME}"]`);
 if(moduleHome){event.preventDefault();location.assign(HOME)}
},true);

seedLocalHistory();
apply();
new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('popstate',()=>setTimeout(apply,0));
})();