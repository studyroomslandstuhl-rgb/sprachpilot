(function(){
'use strict';
if(window.__SP_L7T1_BUNNY_IMAGES_6)return;
window.__SP_L7T1_BUNNY_IMAGES_6=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-7/Thema-1/'))return;

const CDN='https://sprachpilot.b-cdn.net/';

const MAP=Object.freeze({
 'prima':'prima.webp',
 'das team':'team.webp','team':'team.webp',
 'wecken':'wecken.webp',
 'das frühstück':'fruehstueck.webp','frühstück':'fruehstueck.webp','fruehstueck':'fruehstueck.webp',
 'fertig':'fertig.webp','fertig sein':'fertig.webp',
 'los sein':'los_sein.webp',
 'schreiben':'schreiben.webp',
 'mathematik':'mathematik.webp','die mathematik':'mathematik.webp',
 'der test':'test.webp','test':'test.webp',
 'pünktlich':'puenktlich.webp','puenktlich':'puenktlich.webp',
 'auf keinen fall':'auf_keinen_fall.webp',
 'auf jeden fall':'auf_jeden_fall.webp',
 'schmecken':'schmecken.webp',
 'nach hause':'nach_hause.webp',
 'die schule':'schule.webp','schule':'schule.webp',
 'krank':'krank.webp',
 'der arzt':'arzt.webp','arzt':'arzt.webp',
 'die ärztin':'aerztin.webp','ärztin':'aerztin.webp','aerztin':'aerztin.webp',
 'backen':'backen.webp',
 'singen':'singen.webp',
 'reiten':'reiten.webp',
 'das klavier':'klavier.webp','klavier':'klavier.webp',
 'klavier spielen':'klavier_spielen.webp',
 'malen':'malen.webp',
 'der ski':'ski.webp','ski':'ski.webp',
 'ski fahren':'ski_fahren.webp',
 'tennis':'tennis.webp','das tennis':'tennis.webp',
 'tennis spielen':'tennis_spielen.webp',
 'endlich':'endlich.webp',
 'das lied':'lied.webp','lied':'lied.webp','lieder':'lied.webp',
 'üben':'ueben.webp','ueben':'ueben.webp',
 'der text':'text.webp','text':'text.webp','texte':'text.webp',
 'die übung':'uebung.webp','übung':'uebung.webp','uebung':'uebung.webp','übungen':'uebung.webp','uebungen':'uebung.webp',
 'der brief':'brief.webp','brief':'brief.webp',
 'das diktat':'diktat.webp','diktat':'diktat.webp',
 'das buch':'buch.webp','buch':'buch.webp',
 'gitarre spielen':'gitarre_spielen.webp','gitarre':'gitarre_spielen.webp','die gitarre':'gitarre_spielen.webp',
 'freunde treffen':'freunde_treffen.webp','freund':'freund.webp','der freund':'freund.webp',
 'fahrrad fahren':'fahrrad_fahren.webp','fahrrad':'fahrrad.webp','das fahrrad':'fahrrad.webp',
 'tanzen':'tanzen.webp',
 'wandern':'wandern.webp',
 'schwimmen':'schwimmen.webp',
 'stricken':'stricken.webp',
 'grillen':'grillen.webp',
 'im internet surfen':'internet_surfen.webp',
 'der junge':'junge.webp','junge':'junge.webp',
 'das mädchen':'maedchen.webp','mädchen':'maedchen.webp','maedchen':'maedchen.webp',
 'der kilometer':'kilometer.webp','kilometer':'kilometer.webp',
 'die klasse':'klasse.webp','klasse':'klasse.webp',
 'die kommunikation':'kommunikation.webp','kommunikation':'kommunikation.webp',
 'leidtun':'leidtun.webp','leid tun':'leidtun.webp','tut mir leid':'leidtun.webp',
 'losfahren':'losfahren.webp','fährt los':'losfahren.webp','fahren los':'losfahren.webp',
 'das schwimmbad':'schwimmbad.webp','schwimmbad':'schwimmbad.webp',
 'der unterricht':'unterricht.webp','unterricht':'unterricht.webp',
 'französisch':'franzoesisch.webp','franzoesisch':'franzoesisch.webp',
 'jonglieren':'jonglieren.webp',
 'der eintritt':'eintritt.webp','eintritt':'eintritt.webp',
 'die grundschule':'grundschule.webp','grundschule':'grundschule.webp',
 'schade':'schade.webp',
 'der handstand':'handstand.webp','handstand':'handstand.webp'
});

const UPLOADED=Object.freeze([...new Set(Object.values(MAP))]);
const ORDERED_KEYS=Object.keys(MAP).sort((a,b)=>b.length-a.length);

function norm(value){
 return String(value||'').trim().toLowerCase().normalize('NFC')
  .replace(/[„“”"'`´.,!?;:()\[\]{}]/g,' ')
  .replace(/\s+/g,' ').trim();
}
function basename(value){return String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}
function slugFile(value){
 let text=String(value||'').trim().replace(/^(der|die|das)\s+/i,'').toLowerCase();
 if(!text)return'';
 text=text.replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
 return text?text+'.webp':'';
}
function exact(value){return MAP[norm(value)]||''}
function semanticHit(value){
 const text=norm(value);if(!text)return'';
 if(MAP[text])return MAP[text];
 const padded=' '+text+' ';
 const key=ORDERED_KEYS.find(k=>padded.includes(' '+k+' '));
 return key?MAP[key]:'';
}
function itemWord(item){
 if(!item||typeof item!=='object')return'';
 const article=String(item.article||'').trim();
 const word=String(item.full||item.word||item.term||item.singularAnswer||'').trim();
 if(article&&word&&!/^(der|die|das)\s/i.test(word))return `${article} ${word}`;
 return word;
}
function itemSemantic(item){
 if(!item||typeof item!=='object')return'';
 return [item.full,item.word,item.term,item.answer,item.solution,item.label,item.meaning,item.prompt,item.context]
  .filter(Boolean).join(' ');
}
function resolveItem(item){
 const word=itemWord(item);
 const current=basename(item?.image||item?.img||'');
 return exact(word)||semanticHit(word)||current||semanticHit(itemSemantic(item))||slugFile(word);
}
function unique(list){const seen=new Set();return (list||[]).filter(x=>{x=basename(x);if(!x||seen.has(x))return false;seen.add(x);return true}).map(basename)}
function candidates(file,alt='',context=''){
 const raw=basename(file);
 const fromAlt=exact(alt)||semanticHit(alt);
 return unique([fromAlt,raw,slugFile(alt),semanticHit(context)]);
}
function resolveFile(file,alt='',context=''){return candidates(file,alt,context)[0]||basename(file)}
function url(file){return CDN+encodeURIComponent(basename(file))}
function escapeAttr(value){return String(value||'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function contextText(img){
 const scope=img.closest('.sp-overview-word,.overview-card,.word-card,.vocab-card,.l7-overview-card,.l7-learning,.l7-question-card,.flip-card,.card,.l7-card,article');
 return String(scope?.innerText||scope?.textContent||'').slice(0,1000);
}
function preferredDomWord(img){
 const scope=img.closest('.sp-overview-word,.overview-card,.word-card,.vocab-card,.l7-overview-card,.l7-learning,.l7-question-card,.flip-card,.card,.l7-card,article');
 const values=[
  scope?.querySelector?.('.flip-word')?.textContent,
  scope?.querySelector?.('[data-word]')?.getAttribute?.('data-word'),
  scope?.querySelector?.('.word')?.textContent,
  img.getAttribute('alt')
 ];
 for(const value of values){const hit=exact(value);if(hit)return hit}
 return'';
}
function nextCandidate(img){
 let list=[];try{list=JSON.parse(img.dataset.l7t1Candidates||'[]')}catch{}
 const pos=Number(img.dataset.l7t1Pos||0)+1;
 if(pos<list.length){img.dataset.l7t1Pos=String(pos);img.hidden=false;img.src=url(list[pos]);return true}
 return false;
}
function showFallback(img){
 img.hidden=true;
 const fallback=img.nextElementSibling;
 if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback')||fallback?.classList?.contains('sp-overview-word__fallback'))fallback.hidden=false;
}
function patchImage(img){
 if(!(img instanceof HTMLImageElement)||!img.closest('#app'))return;
 if(img.closest('.l7-brand,.brand,.topbar,.l7-topbar,.sp-header'))return;
 const current=basename(img.currentSrc||img.src||'');
 const alt=img.getAttribute('alt')||'';
 const direct=preferredDomWord(img);
 const list=unique([direct,...candidates(current,alt,contextText(img))]);
 if(!list.length)return;
 const signature=list.join('|');
 if(img.dataset.l7t1Signature===signature)return;
 img.dataset.l7t1Signature=signature;
 img.dataset.l7t1Candidates=JSON.stringify(list);
 img.dataset.l7t1Pos='0';
 img.onerror=function(){if(!nextCandidate(this))showFallback(this)};
 img.onload=function(){this.hidden=false;const fallback=this.nextElementSibling;if(fallback?.classList?.contains('l7-image-fallback')||fallback?.classList?.contains('image-fallback')||fallback?.classList?.contains('sp-overview-word__fallback'))fallback.hidden=true};
 const wanted=url(list[0]);if(img.src!==wanted)img.src=wanted;
}
function patchAll(root=document){root.querySelectorAll?.('#app img').forEach(patchImage)}
function patchTheme(theme){
 const seen=new Set();
 function walk(value){
  if(!value||typeof value!=='object'||seen.has(value))return;
  seen.add(value);
  if(Array.isArray(value)){value.forEach(walk);return}
  const mapped=resolveItem(value);
  const hasSlot=('image' in value)||('img' in value);
  const vocab=!!itemWord(value)&&('meaning' in value||'plural' in value||'article' in value||value.kind==='noun-plural');
  if(mapped&&(hasSlot||vocab)){
   if('image' in value||!('img' in value))value.image=mapped;
   if('img' in value)value.img=mapped;
  }
  Object.values(value).forEach(walk);
 }
 walk(theme);return theme;
}
function imageHtml(file,alt='Bild'){
 if(!file)return'';
 const list=candidates(file,alt,alt);if(!list.length)return'';
 const encoded=escapeAttr(JSON.stringify(list));
 return `<div class="l7-image"><img src="${url(list[0])}" data-l7t1-signature="${escapeAttr(list.join('|'))}" data-l7t1-candidates="${encoded}" data-l7t1-pos="0" alt="${escapeAttr(alt)}" onerror="window.L7T1BunnyImages.fail(this)"><div class="l7-image-fallback" hidden><strong>${escapeAttr(alt)}</strong><span>Nutze die Erklärung.</span></div></div>`;
}
function installRenderer(){const S=window.L7S;if(!S)return false;S.image=imageHtml;S.__l7t1BunnyImagesV6=true;return true}

window.L7T1BunnyImages={uploaded:UPLOADED.slice(),map:MAP,candidates,resolveFile,resolveItem,patchAll,patchImage,patchTheme,imageHtml,installRenderer,fail(img){if(!nextCandidate(img))showFallback(img)}};
window.L7_THEME_READY=Promise.resolve(window.L7_THEME_READY).then(theme=>{const patched=patchTheme(theme);queueMicrotask(()=>patchAll(document));return patched});
if(!installRenderer()){let tries=0;const timer=setInterval(()=>{if(installRenderer()||++tries>300)clearInterval(timer)},20)}
const observer=new MutationObserver(mutations=>{for(const mutation of mutations){for(const node of mutation.addedNodes){if(node.nodeType!==1)continue;if(node.matches?.('img'))patchImage(node);patchAll(node)}}});
observer.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{installRenderer();patchAll(document);setTimeout(()=>patchAll(document),250);setTimeout(()=>patchAll(document),1000)});
patchAll(document);
})();