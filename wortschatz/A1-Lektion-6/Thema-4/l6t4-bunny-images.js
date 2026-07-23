(function(){
'use strict';
const BASE='https://sprachpilot.b-cdn.net/';

function encodePath(value){
 return String(value||'').split('/').filter(Boolean).map(part=>encodeURIComponent(decodeURIComponent(part))).join('/');
}
function url(file){
 const value=String(file||'').trim();
 if(!value)return'';
 if(/^https?:\/\//i.test(value))return value;
 return BASE+encodePath(value.replace(/^\/+/,''));
}
function clean(value){
 return String(value||'').toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.…!?,;:„“"']/g,'').replace(/\s+/g,' ');
}
function vocabularyItem(word){
 const target=clean(word);
 return (window.L6T4_DATA?.vocabulary||[]).find(item=>clean(item.word)===target||clean(item.id)===target)||null;
}
function originalFile(img){
 const explicit=img.dataset.bunnyFile;
 if(explicit)return explicit;
 const source=String(img.getAttribute('src')||'').trim();
 if(!source||source.startsWith('data:')||source.startsWith('blob:')||source.includes('/assets/logo/'))return'';
 if(source.startsWith(BASE))return'';
 try{
  if(/^https?:\/\//i.test(source))return new URL(source).pathname.replace(/^\/+/, '');
 }catch(e){}
 return source.replace(/^\.\//,'').replace(/^\/+/, '');
}
function enforce(root){
 if(!root||typeof root.querySelectorAll!=='function')return;
 root.querySelectorAll('img').forEach(img=>{
  const file=originalFile(img);
  if(!file)return;
  img.dataset.bunnyFile=file;
  img.src=url(file);
 });
}
function observe(target){
 if(!target)return;
 enforce(target);
 new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
  if(node.nodeType!==1)return;
  if(node.matches?.('img'))enforce(node.parentElement||target);
  else enforce(node);
 }))).observe(target,{childList:true,subtree:true});
}
function install(){
 observe(document.getElementById('area'));
 observe(document.getElementById('wordList'));
}
window.L6T4Bunny={base:BASE,url,vocabularyItem,enforce};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();