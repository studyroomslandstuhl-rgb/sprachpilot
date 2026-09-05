(function(){
'use strict';
const task=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
if(task!=='karteikarten'&&task!=='cards')return;
if(window.SPCardImagePerformance)return;
const CDN='https://sprachpilot.b-cdn.net/';
const primed=new Set();
const holders=[];

function safeUrl(value){
 const raw=String(value||'').trim();
 if(!raw)return'';
 try{return new URL(raw,location.href).href}catch(e){return raw}
}
function prime(value,high=false){
 const url=safeUrl(value);if(!url||primed.has(url))return;
 primed.add(url);
 const img=new Image();
 img.decoding='async';
 img.loading='eager';
 try{img.fetchPriority=high?'high':'low'}catch(e){}
 img.src=url;
 holders.push(img);
 if(holders.length>8)holders.splice(0,holders.length-8);
}
function pathKey(value){
 try{return decodeURIComponent(new URL(value,location.href).pathname).replace(/^\/+/, '')}catch(e){return String(value||'').replace(/^\/+/, '')}
}
function cards(){
 return window.L9T1?.cards||window.L9T2?.cards||window.L8_THEME?.cards||[];
}
function storedDone(){
 const done=new Set();
 try{
  for(let i=0;i<localStorage.length;i++){
   const key=String(localStorage.key(i)||'');
   if(!/_T\d+_karteikarten(?:_STD\d+)?$/i.test(key)&&!/_T\d+_cards(?:_STD\d+)?$/i.test(key))continue;
   try{const s=JSON.parse(localStorage.getItem(key)||'{}');(s.done||[]).forEach(x=>done.add(String(x)))}catch(e){}
  }
 }catch(e){}
 return done;
}
function primeInitial(){
 const list=cards();if(!list.length)return;
 const done=storedDone();let idx=list.findIndex(x=>!done.has(String(x.id)));
 if(idx<0)idx=0;
 for(let n=0;n<3&&n<list.length;n++)prime(list[(idx+n)%list.length]?.image,n===0);
}
function prioritizeVisible(){
 const imgs=[...document.querySelectorAll('.l8-flip-front .l8-card-visual img,.l8-flip-back .l8-back-image img,.flip-card img')];
 if(!imgs.length)return false;
 imgs.forEach((img,i)=>{
  img.loading='eager';img.decoding='async';
  try{img.fetchPriority=i===0?'high':'auto'}catch(e){}
  if(img.src)prime(img.currentSrc||img.src,i===0);
 });
 const current=imgs[0];if(!current)return true;
 const key=pathKey(current.currentSrc||current.src),list=cards();
 const idx=list.findIndex(x=>pathKey(x.image)===key||pathKey(x.image).endsWith('/'+key)||key.endsWith('/'+pathKey(x.image)));
 if(idx>=0){for(let n=1;n<=2&&n<list.length;n++)prime(list[(idx+n)%list.length]?.image,false)}
 return true;
}
function installConnectionHints(){
 if(!document.querySelector('link[data-sp-bunny-preconnect]')){
  const link=document.createElement('link');link.rel='preconnect';link.href=CDN;link.dataset.spBunnyPreconnect='1';document.head.appendChild(link);
 }
 if(!document.querySelector('link[data-sp-bunny-dns]')){
  const link=document.createElement('link');link.rel='dns-prefetch';link.href='//sprachpilot.b-cdn.net';link.dataset.spBunnyDns='1';document.head.appendChild(link);
 }
}
installConnectionHints();
primeInitial();
const root=document.getElementById('app')||document.body;
if(root)new MutationObserver(()=>prioritizeVisible()).observe(root,{childList:true,subtree:true});
[0,30,100,250,600].forEach(ms=>setTimeout(()=>{primeInitial();prioritizeVisible()},ms));
window.SPCardImagePerformance={version:'1.0',prime,primeInitial,prioritizeVisible};
})();
