const SP_BUNNY_BASE="https://sprachpilot.b-cdn.net";
window.SP_ASSET_BASE=SP_BUNNY_BASE;
const IMG_RE=/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i;
function rawPath(value){return String(value||"").split("?")[0].split("#")[0]}
function fileNameFromPath(value){
  try{
    const raw=rawPath(value);
    const last=raw.substring(raw.lastIndexOf("/")+1);
    if(!last||!IMG_RE.test(last))return null;
    return last.replace(/\.(png|jpe?g|webp|gif|svg)$/i,".webp");
  }catch(e){return null}
}
function fileNameFromImageKey(value){
  const s=String(value||"").trim();
  if(!s)return null;
  if(/^https?:\/\//i.test(s)||s.includes("/")||IMG_RE.test(s))return fileNameFromPath(s);
  return s+".webp";
}
function isLogo(value){
  const s=String(value||"").toLowerCase();
  const name=rawPath(s).split("/").pop()||"";
  return s.includes("/assets/logo/")||name.includes("logo")||name.includes("sprachpilot-logo");
}
function canonicalBunny(value){
  if(isLogo(value))return value;
  const name=fileNameFromPath(value)||fileNameFromImageKey(value);
  return name?SP_BUNNY_BASE+"/"+name:value;
}
function shouldUseBunny(value){
  const s=String(value||"");
  if(!s||s.startsWith("data:")||s.startsWith("blob:"))return false;
  if(isLogo(s))return false;
  return IMG_RE.test(rawPath(s));
}
function bunnyFromName(name){return canonicalBunny(name)}
function bunnyUrl(value){return canonicalBunny(value)}
function toBunny(value){return shouldUseBunny(value)?canonicalBunny(value):value}
window.SP_ASSET_URL=function(name){return isLogo(name)?name:canonicalBunny(name)};
window.SP_LOCAL_TO_CDN=toBunny;
function connectObjectImages(obj){
  if(!obj||typeof obj!=="object")return;
  ["image","img","bild","src","url","poster"].forEach(k=>{
    if(!Object.prototype.hasOwnProperty.call(obj,k))return;
    const v=obj[k];
    if(typeof v!=="string"||!v)return;
    if(shouldUseBunny(v))obj[k]=toBunny(v);
    else if(!/^https?:\/\//i.test(v)&&!v.includes("/")&&!isLogo(v)){
      const name=fileNameFromImageKey(v);
      if(name)obj[k]=canonicalBunny(name);
    }
  });
  ["imageKey","imgKey","bildKey"].forEach(k=>{
    if(obj[k]&&!obj.image&&!isLogo(obj[k]))obj.image=canonicalBunny(fileNameFromImageKey(obj[k]));
  });
}
function deepConnect(v,seen=new Set()){
  if(!v||typeof v!=="object"||seen.has(v))return;
  seen.add(v);
  if(Array.isArray(v)){v.forEach(x=>deepConnect(x,seen));return}
  connectObjectImages(v);
  Object.keys(v).forEach(k=>deepConnect(v[k],seen));
}
function connectAssetObjects(){
  const seen=new Set();
  Object.keys(window).forEach(k=>{
    if(!/SP_|WORDS|WORT|VERB|VOCAB|BILD|IMAGE|DATA|ITEMS|CARDS|TASKS|COLORS|ADJECTIVES|FURNITURE|SENTENCES|WRITING/i.test(k))return;
    deepConnect(window[k],seen);
  });
}
window.SP_CONNECT_ASSET_OBJECTS=connectAssetObjects;
function rewriteCssText(txt){
  return String(txt||"").replace(/url\((['\"]?)([^)'\"]+)\1\)/gi,(m,q,u)=>{
    const next=toBunny(u.trim());
    return next===u?m:`url("${next}")`;
  });
}
function rewriteElement(el){
  if(!el||!el.getAttribute)return;
  ["src","data-src","href","poster"].forEach(attr=>{
    const v=el.getAttribute(attr);
    const next=toBunny(v);
    if(v&&next!==v)el.setAttribute(attr,next);
  });
  const ss=el.getAttribute("srcset");
  if(ss){
    const next=ss.split(",").map(part=>{
      const bits=part.trim().split(/\s+/);
      if(!bits[0])return part;
      bits[0]=toBunny(bits[0]);
      return bits.join(" ");
    }).join(", ");
    if(next!==ss)el.setAttribute("srcset",next);
  }
  const st=el.getAttribute("style");
  if(st){const ns=rewriteCssText(st);if(ns!==st)el.setAttribute("style",ns)}
}
function rewriteStyleSheets(){
  document.querySelectorAll("style").forEach(s=>{const n=rewriteCssText(s.textContent);if(n!==s.textContent)s.textContent=n});
  for(const sheet of Array.from(document.styleSheets||[])){
    try{for(const rule of Array.from(sheet.cssRules||[])){if(rule.style){["background","backgroundImage","borderImage","listStyleImage","content"].forEach(p=>{const v=rule.style[p]||rule.style.getPropertyValue(p);if(v){const n=rewriteCssText(v);if(n!==v)rule.style[p]=n}})}}}catch(e){}
  }
}
function rewriteAll(root=document){
  connectAssetObjects();
  root.querySelectorAll&&root.querySelectorAll("img,source,video,a,link,div,section,span,button").forEach(rewriteElement);
  rewriteStyleSheets();
}
const oldSetAttribute=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(name,value){
  if(["src","data-src","href","poster","srcset","style"].includes(name)){
    if(name==="style")value=rewriteCssText(value);
    else if(name==="srcset")value=String(value||"").split(",").map(part=>{const bits=part.trim().split(/\s+/);if(bits[0])bits[0]=toBunny(bits[0]);return bits.join(" ")}).join(", ");
    else value=toBunny(value);
  }
  return oldSetAttribute.call(this,name,value);
};
function patchProp(proto,prop){
  try{
    const d=Object.getOwnPropertyDescriptor(proto,prop);
    if(!d||!d.set)return;
    Object.defineProperty(proto,prop,{get:d.get,set:function(v){return d.set.call(this,toBunny(v))},configurable:true});
  }catch(e){}
}
[HTMLImageElement?.prototype,HTMLSourceElement?.prototype,HTMLVideoElement?.prototype,HTMLLinkElement?.prototype,HTMLAnchorElement?.prototype].filter(Boolean).forEach(p=>["src","href","poster"].forEach(x=>patchProp(p,x)));
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>rewriteAll());else rewriteAll();
window.addEventListener("load",()=>{rewriteAll();setTimeout(rewriteAll,100);setTimeout(rewriteAll,300);setTimeout(rewriteAll,800);setTimeout(rewriteAll,1800)});
setInterval(()=>{connectAssetObjects();rewriteAll()},1000);
new MutationObserver(muts=>{
  connectAssetObjects();
  muts.forEach(m=>m.addedNodes&&m.addedNodes.forEach(n=>{
    if(n.nodeType!==1)return;
    rewriteElement(n);
    rewriteAll(n);
  }));
}).observe(document.documentElement,{childList:true,subtree:true});