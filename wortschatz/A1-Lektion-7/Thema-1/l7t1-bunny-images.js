(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_IMAGES_1)return;
window.__SP_L7T1_BUNNY_IMAGES_1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const CDN='https://sprachpilot.b-cdn.net/';
const FILES=Object.freeze([
 'brief.webp','buch.webp','eintritt.webp','gitarre_spielen.webp','grundschule.webp','junge.webp','kilometer.webp','klasse.webp','kommunikation.webp','leidtun.webp','lied.webp','losfahren.webp','maedchen.webp','schade.webp','schwimmbad.webp','ski_fahren.webp','tennis_spielen.webp','text.webp','ueben.webp','uebung.webp','unterricht.webp'
]);
const FILE_SET=new Set(FILES);
const MAP=Object.freeze({
 'brief':'brief.webp','der brief':'brief.webp',
 'buch':'buch.webp','das buch':'buch.webp',
 'eintritt':'eintritt.webp','der eintritt':'eintritt.webp',
 'gitarre':'gitarre_spielen.webp','die gitarre':'gitarre_spielen.webp','gitarre spielen':'gitarre_spielen.webp',
 'grundschule':'grundschule.webp','die grundschule':'grundschule.webp',
 'junge':'junge.webp','der junge':'junge.webp',
 'kilometer':'kilometer.webp','der kilometer':'kilometer.webp',
 'klasse':'klasse.webp','die klasse':'klasse.webp',
 'kommunikation':'kommunikation.webp','die kommunikation':'kommunikation.webp',
 'leidtun':'leidtun.webp','leid tun':'leidtun.webp','tut mir leid':'leidtun.webp',
 'lied':'lied.webp','das lied':'lied.webp','lieder':'lied.webp',
 'losfahren':'losfahren.webp','fährt los':'losfahren.webp','fahren los':'losfahren.webp',
 'mädchen':'maedchen.webp','maedchen':'maedchen.webp','das mädchen':'maedchen.webp','das maedchen':'maedchen.webp',
 'schade':'schade.webp',
 'schwimmbad':'schwimmbad.webp','das schwimmbad':'schwimmbad.webp',
 'ski':'ski_fahren.webp','der ski':'ski_fahren.webp','ski fahren':'ski_fahren.webp',
 'tennis':'tennis_spielen.webp','das tennis':'tennis_spielen.webp','tennis spielen':'tennis_spielen.webp',
 'text':'text.webp','der text':'text.webp','texte':'text.webp',
 'üben':'ueben.webp','ueben':'ueben.webp','grammatik üben':'ueben.webp',
 'übung':'uebung.webp','uebung':'uebung.webp','die übung':'uebung.webp','die uebung':'uebung.webp','übungen':'uebung.webp','uebungen':'uebung.webp',
 'unterricht':'unterricht.webp','der unterricht':'unterricht.webp'
});

function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFC')
  .replace(/[„“”"'`´.,!?;:()]/g,' ')
  .replace(/\s+/g,' ').trim();
}
function basename(value){
 return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'';
}
function keyFromFile(value){
 return basename(value).replace(/\.webp$/i,'').replace(/_/g,' ')
  .replace(/ae/g,'ä').replace(/oe/g,'ö').replace(/ue/g,'ü');
}
function mapped(value){
 const text=norm(value);
 if(!text)return'';
 if(MAP[text])return MAP[text];
 const ordered=Object.keys(MAP).sort((a,b)=>b.length-a.length);
 const hit=ordered.find(key=>text===key||text.includes(' '+key+' ')||text.startsWith(key+' ')||text.endsWith(' '+key));
 return hit?MAP[hit]:'';
}
function candidates(file,alt){
 const out=[];
 const add=name=>{name=basename(name);if(name&&!out.includes(name))out.push(name)};
 add(mapped(alt));
 add(mapped(keyFromFile(file)));
 const raw=basename(file);
 if(FILE_SET.has(raw))add(raw);
 add(raw);
 return out;
}
function url(file){return CDN+encodeURIComponent(file)}
function escapeAttr(value){return String(value||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function patchTheme(theme){
 const seen=new Set();
 function walk(value){
  if(!value||typeof value!=='object'||seen.has(value))return;
  seen.add(value);
  if(Array.isArray(value)){value.forEach(walk);return}
  const semantic=[value.full,value.word,value.term,value.answer,value.prompt,value.context,value.meaning].filter(Boolean).join(' ');
  const exact=mapped(semantic)||mapped(keyFromFile(value.image||value.img||''));
  if(exact){
   if('image' in value||!('img' in value))value.image=exact;
   if('img' in value)value.img=exact;
  }
  Object.values(value).forEach(walk);
 }
 walk(theme);
 return theme;
}

window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(patchTheme);

window.L7T1BunnyImages={
 files:FILES.slice(),map:MAP,candidates,
 fail(img){
  let list=[];try{list=JSON.parse(img.dataset.l7t1Candidates||'[]')}catch{}
  let pos=Number(img.dataset.l7t1Pos||0)+1;
  if(pos<list.length){img.dataset.l7t1Pos=String(pos);img.src=url(list[pos]);return}
  img.hidden=true;
  const fallback=img.nextElementSibling;if(fallback)fallback.hidden=false;
 }
};

function installImageRenderer(){
 const S=window.L7S;
 if(!S||S.__l7t1BunnyImages)return false;
 S.__l7t1BunnyImages=true;
 S.image=function(file,alt='Bild'){
  if(!file)return'';
  const list=candidates(file,alt);
  if(!list.length)return'';
  const encoded=escapeAttr(JSON.stringify(list));
  return `<div class="l7-image"><img src="${url(list[0])}" data-l7t1-candidates="${encoded}" data-l7t1-pos="0" alt="${escapeAttr(alt)}" onerror="window.L7T1BunnyImages.fail(this)"><div class="l7-image-fallback" hidden><strong>${escapeAttr(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`;
 };
 return true;
}
if(!installImageRenderer()){
 let tries=0;
 const timer=setInterval(()=>{if(installImageRenderer()||++tries>200)clearInterval(timer)},20);
}
})();
