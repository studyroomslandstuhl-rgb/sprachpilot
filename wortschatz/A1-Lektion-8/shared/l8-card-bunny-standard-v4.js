(function(){
'use strict';
if(window.__SP_L8_CARD_BUNNY_STANDARD_V4)return;
window.__SP_L8_CARD_BUNNY_STANDARD_V4=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/^(der|die|das)\s+/i,'').replace(/\s+/g,' ').trim();
const term=i=>String(i?.term||i?.full||i?.word||i?.answer||'').trim();
const slug=v=>String(v||'').split('–')[0].trim().replace(/^(der|die|das)\s+/i,'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const base=v=>{try{return decodeURIComponent(String(v||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'')}catch(e){return String(v||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||''}};
const isUrl=v=>/^https?:\/\//i.test(String(v||'').trim());
const isAudio=v=>{const s=String(v||'').trim();return !!s&&(isUrl(s)||/^audio\//i.test(s)||/\.(mp3|wav|ogg|m4a)(?:[?#].*)?$/i.test(s));};
const IMAGE_SPECIAL={
 'spater':'spaet.webp',
 'erfahrung':'erfahrung.webp',
 'kollegin':'kollegin.webp',
 'spass haben':'spass.webp'
};
const AUDIO_SPECIAL={
 'senior':'senior1.mp3',
 'tagsuber':'tagsueber1.mp3'
};
function imageUrl(item){
 const raw=String(item?.image||item?.img||'').trim();
 if(/^https:\/\/sprachpilot\.b-cdn\.net\//i.test(raw))return raw;
 if(raw){const name=base(raw);if(name)return CDN+encodeURIComponent(name.replace(/\.(png|jpe?g|gif|svg|webp)$/i,''))+'.webp'}
 const key=norm(term(item));const special=IMAGE_SPECIAL[key];if(special)return CDN+special;
 const s=slug(term(item));return s?CDN+s+'.webp':'';
}
function audioUrl(item){
 const explicit=[item?.audioFile,item?.wordAudio,item?.audioSrc,item?.audioUrl,item?.audio].find(isAudio);
 if(explicit){
  const raw=String(explicit).trim();if(/^https:\/\/sprachpilot\.b-cdn\.net\/audio\//i.test(raw))return raw;
  const name=base(raw);if(name)return AUDIO+encodeURIComponent(name.replace(/\.(mp3|wav|ogg|m4a)$/i,''))+'.mp3';
 }
 const key=norm(term(item));const special=AUDIO_SPECIAL[key];if(special)return AUDIO+special;
 const s=slug(term(item));return s?AUDIO+s+'.mp3':'';
}
function cards(theme){return (theme?.tasks||[]).filter(t=>t?.kind==='cards'||t?.id==='karteikarten'||/karteikart/i.test(String(t?.title||'')));}
function patchCard(item){
 if(!item||typeof item!=='object'||!term(item))return;
 const img=imageUrl(item),audio=audioUrl(item);
 if(img){item.image=img;item.img=img;}
 if(audio){item.audio=audio;item.audioFile=audio;item.wordAudio=audio;}
}
function patchTheme(theme){
 if(!theme)return;
 for(const task of cards(theme))for(const item of task.items||[])patchCard(item);
 const main=cards(theme)[0];if(main)theme.vocabularyOverviewItems=main.items;
 theme.cardMediaRevision='l8-card-bunny-standard-v4';
}
const previous=window.L8_CONTENT_READY;
window.L8_CONTENT_READY=Promise.resolve(previous).then(themes=>{
 const all=window.L8_ALL_THEMES||themes||{};
 for(let n=1;n<=4;n++)patchTheme(all[n]||all[String(n)]||(Array.isArray(all)?all.find(t=>Number(t?.number)===n):null));
 const current=Number(document.body?.dataset?.theme||0);if(current&&(all[current]||all[String(current)]))window.L8_THEME=all[current]||all[String(current)];
 return themes;
});
window.L8CardBunnyStandardV4={patchTheme,patchCard,imageUrl,audioUrl};
})();
