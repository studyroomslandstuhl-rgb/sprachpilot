(function(){
'use strict';
if(window.__SP_L10T3_ATTEST_FINAL_FIX_20260915_V4)return;
window.__SP_L10T3_ATTEST_FINAL_FIX_20260915_V4=true;
const ATTEST_IMG='https://sprachpilot.b-cdn.net/attest.webp';
const ARZT_IMG='https://sprachpilot.b-cdn.net/arztbescheinigung.webp';
const SYN={en:"doctor's certificate / medical certificate",ru:'справка от врача / медицинская справка',tr:'doktor raporu / sağlık raporu',uk:'довідка від лікаря / медична довідка',ar:'شهادة من الطبيب / شهادة طبية',ja:'医師の証明書 / 診断書',ro:'adeverință medicală / certificat medical',pl:'zaświadczenie od lekarza / zaświadczenie lekarskie',ku:'belgeya ji bijîjk / belgeya bijîjkî',fa:'گواهی پزشک / گواهی پزشکی',fr:'attestation du médecin / certificat médical',es:'certificado del médico / certificado médico',it:'certificato del medico / certificato medico'};
const D=window.L10T3;
function card(id){return D?.cards?.find?.(x=>String(x?.id||'')===id)}
function lang(){let raw='en';try{const p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{};raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||'en').toLowerCase()}catch(e){}const pairs=[['uk',['uk','ua','ukrain']],['ru',['ru','russ']],['tr',['tr','türk','turk']],['ar',['ar','arab']],['ja',['ja','japan']],['ro',['ro','rumän','ruman','roman']],['pl',['pl','pol']],['ku',['ku','kurd']],['fa',['fa','farsi','pers']],['fr',['fr','franz','french']],['es',['es','span','spanish']],['it',['it','ital','italian']]];for(const [code,keys] of pairs)if(keys.some(k=>raw===k||raw.includes(k)))return code;return'en'}
function setImage(x,src){if(!x)return;x.image=src;x.img=src;x.imageUrl=src;x.imageURL=src}
function applyData(){const attest=card('attest'),arzt=card('arztbescheinigung'),code=lang(),tr=SYN[code]||SYN.en;setImage(attest,ATTEST_IMG);setImage(arzt,ARZT_IMG);for(const x of [attest,arzt].filter(Boolean)){x.translations={...SYN};x.translation=tr}if(attest){attest.synonym='die Arztbescheinigung';attest.detail='Synonym: die Arztbescheinigung'}if(arzt){arzt.synonym='das Attest';arzt.detail='Synonym: das Attest'}}
function forceBox(box,src){if(!box)return;box.style.backgroundImage=`url("${src}")`;box.style.backgroundSize='contain';box.style.backgroundPosition='center';box.style.backgroundRepeat='no-repeat';box.style.backgroundColor='#fff'}
function forceImg(img,src){if(!img)return;img.hidden=false;img.style.display='block';img.style.visibility='visible';img.style.opacity='1';if(img.getAttribute('src')!==src)img.setAttribute('src',src);img.removeAttribute('onerror')}
function info(word){const w=String(word||'').trim().toLowerCase();if(w==='das attest'||w==='attest')return{src:ATTEST_IMG,alt:'das Attest'};if(w==='die arztbescheinigung'||w==='arztbescheinigung')return{src:ARZT_IMG,alt:'die Arztbescheinigung'};return null}
function patchOverview(){document.querySelectorAll('.l8-overview-word').forEach(row=>{const meta=info(row.querySelector('h3')?.textContent||'');if(!meta)return;const box=row.querySelector('.l8-overview-image');forceBox(box,meta.src);let img=box?.querySelector('img');if(!img&&box){img=document.createElement('img');img.alt=meta.alt;box.prepend(img)}forceImg(img,meta.src);box?.querySelectorAll('.l8-overview-fallback').forEach(x=>x.hidden=true)})}
function patchCards(){const meta=info(document.querySelector('.l8-flip-back .l8-flip-word,.flip-back .flip-word')?.textContent||'');if(!meta)return;document.querySelectorAll('.l8-card-visual,.l8-back-image,.sp-visual').forEach(x=>forceBox(x,meta.src));document.querySelectorAll('.l8-flip-front img,.l8-flip-back img,.sp-visual img').forEach(x=>forceImg(x,meta.src));document.querySelectorAll('.sp-fallback').forEach(x=>x.style.display='none')}
function run(){applyData();patchOverview();patchCards()}
run();new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});[0,50,150,400,900,1800].forEach(ms=>setTimeout(run,ms));
})();
