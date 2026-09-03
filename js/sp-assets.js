const SP_BUNNY_BASE="https://sprachpilot.b-cdn.net";
window.SP_ASSET_BASE=SP_BUNNY_BASE;
const IMG_RE=/\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i;
function rawPath(value){return String(value||"").split("?")[0].split("#")[0]}
function fileNameFromPath(value){try{const raw=rawPath(value),last=raw.substring(raw.lastIndexOf("/")+1);if(!last||!IMG_RE.test(last))return null;return last.replace(/\.(png|jpe?g|webp|gif|svg)$/i,".webp")}catch(e){return null}}
function fileNameFromImageKey(value){const s=String(value||"").trim();if(!s)return null;if(/^https?:\/\//i.test(s)||s.includes("/")||IMG_RE.test(s))return fileNameFromPath(s);return s+".webp"}
function isLogo(value){const s=String(value||"").toLowerCase(),name=rawPath(s).split("/").pop()||"";return s.includes("/assets/logo/")||name.includes("logo")||name.includes("sprachpilot-logo")}
function shouldUseBunny(value){const s=String(value||"");if(!s||s.startsWith("data:")||s.startsWith("blob:")||s.includes("sprachpilot.b-cdn.net")||isLogo(s))return false;return IMG_RE.test(rawPath(s))}
function bunnyFromName(name){const n=String(name||"").split("/").pop().replace(/\.(png|jpe?g|webp|gif|svg)$/i,".webp");return n?SP_BUNNY_BASE+"/"+n:name}
function bunnyUrl(value){const name=fileNameFromPath(value);return name?SP_BUNNY_BASE+"/"+name:value}
function toBunny(value){return shouldUseBunny(value)?bunnyUrl(value):value}
window.SP_ASSET_URL=function(name){return isLogo(name)?name:bunnyFromName(name)};
window.SP_LOCAL_TO_CDN=toBunny;
function connectObjectImages(obj){if(!obj||typeof obj!=="object")return;["image","img","bild","src","url","poster"].forEach(k=>{if(!Object.prototype.hasOwnProperty.call(obj,k))return;const v=obj[k];if(typeof v!=="string"||!v)return;if(shouldUseBunny(v))obj[k]=toBunny(v);else if(!/^https?:\/\//i.test(v)&&!v.includes("/")&&!isLogo(v)){const name=fileNameFromImageKey(v);if(name)obj[k]=bunnyFromName(name)}});["imageKey","imgKey","bildKey"].forEach(k=>{if(obj[k]&&!obj.image&&!isLogo(obj[k]))obj.image=bunnyFromName(fileNameFromImageKey(obj[k]))})}
function deepConnect(v,seen=new Set()){if(!v||typeof v!=="object"||seen.has(v))return;seen.add(v);if(Array.isArray(v)){v.forEach(x=>deepConnect(x,seen));return}connectObjectImages(v);Object.keys(v).forEach(k=>deepConnect(v[k],seen))}
function connectAssetObjects(){const seen=new Set();Object.keys(window).forEach(k=>{if(!/SP_|WORDS|WORT|VERB|VOCAB|BILD|IMAGE|DATA|ITEMS|CARDS|TASKS/i.test(k))return;deepConnect(window[k],seen)})}
window.SP_CONNECT_ASSET_OBJECTS=connectAssetObjects;
function rewriteCssText(txt){return String(txt||"").replace(/url\((['\"]?)([^)'\"]+)\1\)/gi,(m,q,u)=>{const next=toBunny(u.trim());return next===u?m:`url("${next}")`})}
function rewriteElement(el){if(!el||!el.getAttribute)return;["src","data-src","poster"].forEach(attr=>{const v=el.getAttribute(attr),next=toBunny(v);if(v&&next!==v)el.setAttribute(attr,next)});const ss=el.getAttribute("srcset");if(ss){const next=ss.split(",").map(part=>{const bits=part.trim().split(/\s+/);if(bits[0])bits[0]=toBunny(bits[0]);return bits.join(" ")}).join(", ");if(next!==ss)el.setAttribute("srcset",next)}const st=el.getAttribute("style");if(st){const ns=rewriteCssText(st);if(ns!==st)el.setAttribute("style",ns)}}
function rewriteSubtree(root=document){if(root?.nodeType===1)rewriteElement(root);root?.querySelectorAll?.("img,source,video,div,section,span,button")?.forEach(rewriteElement)}
window.SP_REWRITE_ASSET_SUBTREE=rewriteSubtree;
let queued=false;const pending=new Set();
function queueRoot(root){if(!root||root.nodeType!==1)return;pending.add(root);if(queued)return;queued=true;const run=()=>{queued=false;const roots=[...pending];pending.clear();roots.forEach(rewriteSubtree)};if(typeof requestAnimationFrame==='function')requestAnimationFrame(run);else setTimeout(run,0)}
function start(){rewriteSubtree(document);const idle=window.requestIdleCallback||((fn)=>setTimeout(fn,250));idle(()=>connectAssetObjects());const mo=new MutationObserver(muts=>{for(const m of muts)for(const n of m.addedNodes||[])queueRoot(n)});mo.observe(document.documentElement,{childList:true,subtree:true});window.__SP_ASSET_OBSERVER=mo;setTimeout(()=>rewriteSubtree(document),500)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
