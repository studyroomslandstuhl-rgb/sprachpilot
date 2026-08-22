(function(){
'use strict';
if(window.__SP_L7T4_MAEDCHEN_IMAGE_FIX_V1)return;
window.__SP_L7T4_MAEDCHEN_IMAGE_FIX_V1=true;
const URL='https://sprachpilot.b-cdn.net/maedchen1.webp';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/^(der|die|das)\s+/,'').replace(/[^a-z0-9]+/g,' ').trim();
const isGirl=v=>norm(v)==='madchen'||norm(v)==='maedchen';
function patchNode(node){
 if(!node||typeof node!=='object')return;
 if(Array.isArray(node)){node.forEach(patchNode);return;}
 const labels=[node.word,node.full,node.term,node.label,node.front,node.answer,node.value,node.prompt].filter(Boolean);
 const girl=labels.some(isGirl);
 if(girl){
  if('image' in node||'img' in node||node.word||node.term||node.answer){node.image=URL;if('img' in node)node.img=URL;}
 }
 for(const [key,value] of Object.entries(node)){
  if((key==='image'||key==='img')&&/maedchen(?:1)?\.webp(?:$|[?#])/i.test(String(value||'')))node[key]=URL;
  else if(value&&typeof value==='object')patchNode(value);
 }
}
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{
 patchNode(theme);
 try{
  if(window.L7T4BunnyMedia?.imageMap)window.L7T4BunnyMedia.imageMap.maedchen=URL;
  if(window.L7T4CardContent?.data?.['mädchen'])window.L7T4CardContent.data['mädchen'].image=URL;
 }catch(e){}
 theme.maedchenImageRevision='maedchen1-20260822-v1';
 window.L7_THEME=theme;
 return theme;
});
})();
