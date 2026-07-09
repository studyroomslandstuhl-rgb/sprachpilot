const SP_BUNNY_BASE="https://sprachpilot.b-cdn.net";
window.SP_ASSET_BASE=SP_BUNNY_BASE;
function fileNameFromPath(value){
  try{
    const raw=String(value||"").split("?")[0].split("#")[0];
    const last=raw.substring(raw.lastIndexOf("/")+1);
    if(!last||!/\.(png|jpe?g|webp|gif|svg)$/i.test(last))return null;
    return last.replace(/\.(png|jpe?g|webp|gif|svg)$/i,".webp");
  }catch(e){return null}
}
function fileNameFromImageKey(value){
  const s=String(value||"").trim();
  if(!s)return null;
  if(/^https?:\/\//i.test(s)||s.includes("/")||/\.(png|jpe?g|webp|gif|svg)$/i.test(s))return fileNameFromPath(s);
  return s+".webp";
}
function shouldUseBunny(value){
  const s=String(value||"");
  if(!s||s.startsWith("data:")||s.startsWith("blob:"))return false;
  if(s.includes("sprachpilot.b-cdn.net"))return false;
  if(s.includes("/assets/logo/"))return false;
  if(s.includes("/assets/img/"))return true;
  if(s.includes("/bilder/"))return true;
  if(s.includes("/images/"))return true;
  if(s.includes("/wortschatz/")&&/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(s))return true;
  if(s.includes("/verben-A1/")&&/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(s))return true;
  return false;
}
function bunnyFromName(name){return SP_BUNNY_BASE+"/"+String(name||"").split("/").pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,".webp")}
function bunnyUrl(value){
  const name=fileNameFromPath(value);
  if(!name)return value;
  return SP_BUNNY_BASE+"/"+name;
}
function toBunny(value){return shouldUseBunny(value)?bunnyUrl(value):value}
window.SP_ASSET_URL=function(name){return bunnyFromName(name)};
window.SP_LOCAL_TO_CDN=toBunny;
function connectObjectImages(obj){
  if(!obj||typeof obj!=="object")return;
  if(Object.prototype.hasOwnProperty.call(obj,"image")){
    if(obj.image&&shouldUseBunny(obj.image))obj.image=toBunny(obj.image);
    else if(!obj.image&&obj.img)obj.image=toBunny(obj.img);
    else if(obj.image&&typeof obj.image==="string"&&!/^https?:\/\//i.test(obj.image)&&!obj.image.includes("/"))obj.image=bunnyFromName(obj.image);
  }
  if(Object.prototype.hasOwnProperty.call(obj,"img")){
    if(obj.img&&shouldUseBunny(obj.img))obj.img=toBunny(obj.img);
    else if(obj.img&&typeof obj.img==="string"&&!/^https?:\/\//i.test(obj.img)&&!obj.img.includes("/"))obj.img=bunnyFromName(obj.img);
  }
  if(obj.bild&&typeof obj.bild==="string")obj.bild=shouldUseBunny(obj.bild)?toBunny(obj.bild):(/^https?:\/\//i.test(obj.bild)?obj.bild:bunnyFromName(fileNameFromImageKey(obj.bild)));
  if(obj.imageKey&&!obj.image)obj.image=bunnyFromName(fileNameFromImageKey(obj.imageKey));
  if(obj.imgKey&&!obj.img)obj.img=bunnyFromName(fileNameFromImageKey(obj.imgKey));
}
function connectAssetObjects(){
  const seen=new Set();
  Object.keys(window).forEach(k=>{
    if(!/SP_|WORDS|WORT|VERB|VOCAB|BILD|IMAGE/i.test(k))return;
    const v=window[k];
    if(!v||seen.has(v))return;
    seen.add(v);
    if(Array.isArray(v))v.forEach(connectObjectImages);
    else if(v&&typeof v==="object")Object.keys(v).forEach(x=>Array.isArray(v[x])?v[x].forEach(connectObjectImages):connectObjectImages(v[x]));
  });
}
window.SP_CONNECT_ASSET_OBJECTS=connectAssetObjects;
function rewriteElement(el){
  if(!el||!el.getAttribute)return;
  ["src","data-src"].forEach(attr=>{
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
}
function rewriteAll(root=document){
  connectAssetObjects();
  root.querySelectorAll&&root.querySelectorAll("img,source").forEach(rewriteElement);
}
const oldSetAttribute=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(name,value){
  if((name==="src"||name==="data-src")&&this&&(this.tagName==="IMG"||this.tagName==="SOURCE"))value=toBunny(value);
  return oldSetAttribute.call(this,name,value);
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>rewriteAll());else rewriteAll();
window.addEventListener("load",()=>{rewriteAll();setTimeout(rewriteAll,300);setTimeout(rewriteAll,1200)});
setInterval(connectAssetObjects,1500);
new MutationObserver(muts=>{
  connectAssetObjects();
  muts.forEach(m=>m.addedNodes&&m.addedNodes.forEach(n=>{
    if(n.nodeType!==1)return;
    rewriteElement(n);
    rewriteAll(n);
  }));
}).observe(document.documentElement,{childList:true,subtree:true});