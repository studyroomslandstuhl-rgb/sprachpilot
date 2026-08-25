(function(){
'use strict';
if(window.__SP_L8T1_BUNNY_MEDIA_V1)return;window.__SP_L8T1_BUNNY_MEDIA_V1=true;
if(!location.pathname.includes('/wortschatz/A1-Lektion-8/Thema-1/'))return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
const term=item=>String(item?.term||item?.full||item?.word||item?.answer||item?.prompt||'').trim();
const slug=value=>String(value||'').trim().toLowerCase().replace(/^(der|die|das)\s+/i,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
const base=value=>String(value||'').split(/[?#]/)[0].split('/').filter(Boolean).pop()||'';
const IMAGE_BY_KEY={
 physiotherapeut:'physiotherapeut.webp',
 physiotherapeutin:'physiotherapeutin.webp',
 hausmeister:'hausmeister.webp',
 hausmeisterin:'hausmeisterin.webp',
 arzthelfer:'arzthelfer.webp',
 arzthelferin:'arzthelferin.webp',
 arzt:'arzt.webp',
 aerztin:'aerztin.webp',
 mechatroniker:'mechatroniker.webp',
 mechatronikerin:'mechatronikerin.webp',
 hausmann:'hausmann.webp',
 hausfrau:'hausfrau.webp',
 polizist:'polizist.webp',
 polizistin:'polizistin.webp',
 krankenpfleger:'krankenpfleger.webp',
 krankenpflegerin:'krankenpflegerin.webp',
 lehrer:'lehrer.webp',
 lehrerin:'lehrerin.webp',
 schauspieler:'schauspieler.webp',
 schauspielerin:'schauspielerin.webp',
 baecker:'baecker.webp',
 baeckerin:'baeckerin.webp',
 koch:'koch.webp',
 koechin:'koechin.webp',
 friseur:'friseur.webp',
 friseurin:'friseurin.webp',
 patient:'patient.webp',
 patientin:'patientin.webp',
 chef:'chef.webp',
 chefin:'chefin.webp',
 journalist:'journalist.webp',
 journalistin:'journalistin.webp',
 schueler:'schueler.webp',
 schuelerin:'schuelerin.webp',
 student:'student.webp',
 studentin:'studentin.webp',
 taxifahrer:'taxifahrer.webp',
 taxifahrerin:'taxifahrerin.webp',
 beruf:'beruf.webp',
 job:'job.webp',
 stelle:'stelle.webp',
 ausbildung:'ausbildung.webp',
 krankenhaus:'krankenhaus.webp',
 praxis:'praxis.webp',
 firma:'firma.webp',
 interview:'interview.webp',
 geschichte:'geschichte.webp',
 zeitung:'zeitung.webp',
 fernsehen:'das_fernsehen.webp',
 thema:'thema.webp',
 arbeit:'arbeit.webp',
 arbeiten:'arbeiten.webp',
 studieren:'studieren.webp',
 beruflich:'beruflich.webp',
 selbststaendig:'selbststaendig.webp',
 angestellt:'angestellt.webp',
 berufstaetig:'berufstaetig.webp',
 arbeitslos:'arbeitslos.webp',
 zurzeit:'zurzeit.webp',
 praktikum:'praktikum.webp',
 praktikant:'praktikant.webp',
 praktikantin:'praktikantin.webp',
 eine_ausbildung_machen:'ausbildung.webp',
 ausbildung_machen:'ausbildung.webp',
 einen_job_haben:'job.webp',
 job_haben:'job.webp',
 eine_stelle_haben:'stelle.webp',
 stelle_haben:'stelle.webp'
};
function audioName(item,key){
 const mapped=IMAGE_BY_KEY[key];
 if(mapped)return mapped.replace(/\.webp$/i,'');
 const current=base(item?.image||item?.img||'').replace(/\.(webp|png|jpe?g)$/i,'');
 return current||key;
}
function patchItem(item){
 if(!item||typeof item!=='object')return;
 if(item.overviewNoImage||item.__overviewOnly&&item.overviewNoImage)return;
 const key=slug(term(item));if(!key)return;
 const image=IMAGE_BY_KEY[key];
 if(image)item.image=CDN+image;
 const a=audioName(item,key);if(a)item.audio=AUDIO+a+'.mp3';
}
window.L8_CONTENT_READY=Promise.resolve(window.L8_CONTENT_READY).then(themes=>{
 const all=window.L8_ALL_THEMES||{},theme=all[1]||all['1']||(Array.isArray(all)?all.find(t=>Number(t?.number)===1):null);if(!theme)return themes;
 const cards=(theme.tasks||[]).find(task=>task?.kind==='cards'||task?.id==='karteikarten'||/karteikart/i.test(task?.title||''));
 (cards?.items||[]).forEach(patchItem);
 theme.bunnyMediaRevision='l8t1-bunny-media-v1';
 if(Number(document.body?.dataset?.theme)===1)window.L8_THEME=theme;
 return themes;
});
window.L8T1BunnyMedia={base:CDN,audioBase:AUDIO,imageMap:IMAGE_BY_KEY};
})();
