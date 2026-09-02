(function(){
'use strict';
if(window.__SP_L8T4_RESTORE_OVERVIEW_SOURCE_20260902_V2)return;
window.__SP_L8T4_RESTORE_OVERVIEW_SOURCE_20260902_V2=true;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const clone=v=>{try{return structuredClone(v)}catch(e){return JSON.parse(JSON.stringify(v))}};
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[„“”"'`´.,!?;:()]/g,'').replace(/^(der|die|das)\s+/i,'').replace(/\s+/g,' ').trim();
const term=item=>String(item?.term||item?.word||item?.full||'').trim();
function themeOf(all){return all?.[4]||all?.['4']||(Array.isArray(all)?all.find(t=>Number(t?.number)===4):null)}
function cardsOf(theme){return (theme?.tasks||[]).find(t=>t?.kind==='cards'||String(t?.id)==='karteikarten'||/karteikart/i.test(String(t?.title||'')))}
function slug(value){return norm(value).replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')}
function media(item){const out=clone(item||{}),n=norm(term(out)),s=slug(term(out));if(!out.image&&s)out.image=CDN+s+'.webp';if(!out.audioFile&&!out.audio&&s){const file=n==='tagsuber'?'tagsueber1':n==='senior'?'senior1':s;out.audioFile=AUDIO+file+'.mp3';out.audio=out.audioFile;out.wordAudio=out.audioFile}if(out.audioFile&&!out.audio)out.audio=out.audioFile;return out}
function mergeAccepted(theme){const snap=window.L8_T4_ACCEPTED_VOCAB_SNAPSHOT?.items||[];if(!snap.length)return[];const current=cardsOf(theme)?.items||[],byCurrent=new Map(current.map(x=>[norm(term(x)),x]));return snap.map(old=>{const newer=byCurrent.get(norm(term(old)))||{},merged={...clone(newer),...clone(old)};merged.translations={...(newer.translations||newer.tr||{}),...(old.translations||old.tr||{})};merged.tr={...merged.translations};if(!merged.image&&newer.image)merged.image=newer.image;if(!merged.audioFile&&(newer.audioFile||newer.audio)){merged.audioFile=newer.audioFile||newer.audio;merged.audio=merged.audioFile}return media(merged)})}
function four(pool,target,index){const out=[target],seen=new Set([norm(term(target))]);for(let step=1;out.length<4&&step<=pool.length*2;step++){const c=pool[(index*7+step)%pool.length],n=norm(term(c));if(!c||seen.has(n))continue;seen.add(n);out.push(c)}return out.slice(0,4)}
function imageTask(items){const pool=items.filter(x=>term(x)&&x.image);return{id:'l8t4-bild-wort-v2',title:'Bild → Wort',kind:'t4-image',icon:'🖼️',emoji:'🖼️',spL8T4Image:true,instruction:'Sieh das Bild. Wähle das Wort.',items:pool.map((target,i)=>({image:target.image,prompt:'Was passt?',options:four(pool,target,i).map(term),answer:[term(target)]}))}}
function listenImageTask(items){const pool=items.filter(x=>term(x)&&x.image&&(x.audioFile||x.audio));return{id:'l8t4-hoeren-bild-v2',title:'Hören → Bild',kind:'t4-listen-image',icon:'👂',emoji:'👂',spL8T4ListenImage:true,instruction:'Höre das Wort. Wähle das Bild.',items:pool.map((target,i)=>({audioText:term(target),audioFile:target.audioFile||target.audio,answer:[term(target)],options:four(pool,target,i+3).map(x=>({term:term(x),image:x.image}))}))}}
function replace(theme,ids,next){const i=theme.tasks.findIndex(t=>ids.includes(String(t?.id||'')));if(i>=0)theme.tasks.splice(i,1,next);return i}
function filterMeaning(theme,allowed){const task=theme.tasks.find(t=>String(t?.id||'')==='l8t4-bedeutung-wort');if(!task?.items)return;task.items=task.items.filter(item=>{const answers=Array.isArray(item.answer)?item.answer:[item.answer];return answers.some(a=>allowed.has(norm(a)))})}
function acceptedVariant(answer,allowed){const n=norm(answer);if(allowed.has(n))return true;const aliases={arbeitszeiten:'arbeitszeit',stellen:'stelle',verdienste:'verdienst',aushilfen:'aushilfe',senioren:'senior'};return !!(aliases[n]&&allowed.has(aliases[n]))}
function fixPhone(theme,allowed){
 const task=theme.tasks.find(t=>String(t?.id||'')==='l8t4-telefon-dialoge-v2');if(!task?.items)return;
 for(const item of task.items){
  const oldGaps=Array.isArray(item.gaps)?item.gaps:[],mapping=new Map(),next=[];
  oldGaps.forEach((gap,oldIndex)=>{
   const answer=String((Array.isArray(gap.answer)?gap.answer:[gap.answer])[0]||''),n=norm(answer);
   if(n==='stellenanzeige'){mapping.set(oldIndex,{literal:'Anzeige'});return}
   const copy=clone(gap);
   if(n==='pro stunde'&&allowed.has('pro')){copy.answer=['pro'];copy.options=(copy.options||[]).map(v=>norm(v)==='pro stunde'?'pro':v);const ni=next.length;next.push(copy);mapping.set(oldIndex,{index:ni,suffix:' Stunde'});return}
   if(!acceptedVariant(answer,allowed)){mapping.set(oldIndex,{literal:answer});return}
   if(copy.kind==='choice'){
    let opts=(copy.options||[]).filter(v=>norm(v)!=='stellenanzeige'&&norm(v)!=='pro stunde'&&acceptedVariant(v,allowed));
    if(!opts.some(v=>norm(v)===n))opts.unshift(answer);
    const sources=window.L8_T4_ACCEPTED_VOCAB_SNAPSHOT?.items||[];
    for(const source of sources){if(opts.length>=3)break;const value=term(source);if(!opts.some(v=>norm(v)===norm(value)))opts.push(value)}
    copy.options=opts.slice(0,3);
   }
   const ni=next.length;next.push(copy);mapping.set(oldIndex,{index:ni});
  });
  item.lines=(item.lines||[]).map(row=>{let text=String(row.text||'');text=text.replace(/\{\{(\d+)\}\}/g,(m,num)=>{const info=mapping.get(Number(num));if(!info)return'';if(Object.prototype.hasOwnProperty.call(info,'literal'))return info.literal;return`{{${info.index}}}${info.suffix||''}`});return{...row,text}});
  item.gaps=next;
 }
}
function apply(theme){if(!theme||!Array.isArray(theme.tasks))return theme;const items=mergeAccepted(theme);if(!items.length)return theme;const cards=cardsOf(theme);if(cards){cards.items=items.map(clone);cards.id='karteikarten';cards.kind='cards';cards.title='Karteikarten';cards.instruction='Lerne die Wörter.'}theme.vocabularyOverviewItems=items.map(clone);theme.overviewOnlyItems=items.map(clone);const allowed=new Set(items.map(x=>norm(term(x))).filter(Boolean));replace(theme,['l8t4-bild-wort','l8t4-bild-wort-v2'],imageTask(items));replace(theme,['l8t4-hoeren-bild','l8t4-hoeren-bild-v2'],listenImageTask(items));filterMeaning(theme,allowed);fixPhone(theme,allowed);theme.acceptedVocabularyTerms=items.map(term);theme.contentRevision=String(theme.contentRevision||'')+'-accepted-vocab-restored-v2';if(Number(document.body?.dataset?.theme||0)===4)window.L8_THEME=theme;return theme}
const previous=window.L8_CONTENT_READY;window.L8_T4_RESTORE_OVERVIEW_SOURCE_READY=Promise.resolve(previous).then(themes=>{const all=window.L8_ALL_THEMES||themes||{},theme=themeOf(all);apply(theme);return themes}).catch(error=>{console.error('L8T4 alte Wortübersicht wiederherstellen',error);return window.L8_ALL_THEMES||{}});window.L8_CONTENT_READY=window.L8_T4_RESTORE_OVERVIEW_SOURCE_READY;window.L8T4RestoreOverviewSource20260902={apply,version:2};
})();
