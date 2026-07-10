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
function rewriteElement(el){
  if(!el||!el.getAttribute)return;
  ["src","data-src","poster"].forEach(attr=>{
    const v=el.getAttribute(attr);
    const next=toBunny(v);
    if(v&&next!==v)el.setAttribute(attr,next);
  });
}
function rewriteAll(root=document){
  connectAssetObjects();
  root.querySelectorAll&&root.querySelectorAll("img,source,video").forEach(rewriteElement);
}
// Safe one-time asset connection only. No global MutationObserver, no setInterval,
// no Element.prototype patching and no stylesheet rewrites: those caused layout/render loops.
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>rewriteAll(),{once:true});else rewriteAll();
window.addEventListener("load",()=>setTimeout(()=>rewriteAll(),50),{once:true});