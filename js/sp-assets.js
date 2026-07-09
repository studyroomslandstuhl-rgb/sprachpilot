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
function bunnyUrl(value){
  const name=fileNameFromPath(value);
  if(!name)return value;
  return SP_BUNNY_BASE+"/"+name;
}
function toBunny(value){return shouldUseBunny(value)?bunnyUrl(value):value}
window.SP_ASSET_URL=function(name){return SP_BUNNY_BASE+"/"+String(name||"").split("/").pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,".webp")};
window.SP_LOCAL_TO_CDN=toBunny;
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
  root.querySelectorAll&&root.querySelectorAll("img,source").forEach(rewriteElement);
}
const oldSetAttribute=Element.prototype.setAttribute;
Element.prototype.setAttribute=function(name,value){
  if((name==="src"||name==="data-src")&&this&&(this.tagName==="IMG"||this.tagName==="SOURCE"))value=toBunny(value);
  return oldSetAttribute.call(this,name,value);
};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>rewriteAll());else rewriteAll();
new MutationObserver(muts=>{
  muts.forEach(m=>m.addedNodes&&m.addedNodes.forEach(n=>{
    if(n.nodeType!==1)return;
    rewriteElement(n);
    rewriteAll(n);
  }));
}).observe(document.documentElement,{childList:true,subtree:true});