(function(){
'use strict';
if(window.__SP_L10T3_ATTEST_FINAL_FIX_20260915)return;
window.__SP_L10T3_ATTEST_FINAL_FIX_20260915=true;
const IMG='https://sprachpilot.b-cdn.net/attest.webp';
const SYN={en:'medical certificate',ru:'медицинская справка',tr:'sağlık raporu',uk:'медична довідка',ar:'شهادة طبية',ja:'診断書 / 医療証明書',ro:'certificat medical',pl:'zaświadczenie lekarskie',ku:'belgeya bijîjkî',fa:'گواهی پزشکی',fr:'certificat médical',es:'certificado médico',it:'certificato medico'};
const D=window.L10T3;
function card(id){return D?.cards?.find?.(x=>String(x?.id||'')===id)}
function lang(){let raw='en';try{const p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||localStorage.getItem('SP_STUDENT_PROFILE')||'{}')||{};raw=String(p.motherLanguageCode||p.muttersprache||p.motherLanguage||p.language||'en').toLowerCase()}catch(e){}const pairs=[['uk',['uk','ua','ukrain']],['ru',['ru','russ']],['tr',['tr','türk','turk']],['ar',['ar','arab']],['ja',['ja','japan']],['ro',['ro','rumän','ruman','roman']],['pl',['pl','pol']],['ku',['ku','kurd']],['fa',['fa','farsi','pers']],['fr',['fr','franz','french']],['es',['es','span','spanish']],['it',['it','ital','italian']]];for(const [code,keys] of pairs)if(keys.some(k=>raw===k||raw.includes(k)))return code;return'en'}
function applyData(){const attest=card('attest'),arzt=card('arztbescheinigung'),code=lang(),tr=SYN[code]||SYN.en;if(attest){attest.image=IMG;attest.img=IMG;attest.imageUrl=IMG;attest.imageURL=IMG;attest.translations={...SYN};attest.translation=tr;attest.synonym='die Arztbescheinigung'}if(arzt){arzt.translations={...SYN};arzt.translation=tr;arzt.synonym='das Attest'}}
function forceBox(box){if(!box)return;box.style.backgroundImage=`url("${IMG}")`;box.style.backgroundSize='contain';box.style.backgroundPosition='center';box.style.backgroundRepeat='no-repeat';box.style.backgroundColor='#fff'}
function forceImg(img){if(!img)return;img.hidden=false;img.style.display='block';img.style.visibility='visible';img.style.opacity='1';if(img.getAttribute('src')!==IMG)img.setAttribute('src',IMG);img.removeAttribute('onerror')}
function patchOverview(){document.querySelectorAll('.l8-overview-word').forEach(row=>{const word=String(row.querySelector('h3')?.textContent||'').trim().toLowerCase();if(word!=='das attest'&&word!=='attest')return;const box=row.querySelector('.l8-overview-image');forceBox(box);let img=box?.querySelector('img');if(!img&&box){img=document.createElement('img');img.alt='das Attest';box.prepend(img)}forceImg(img);box?.querySelectorAll('.l8-overview-fallback').forEach(x=>x.hidden=true)})}
function patchCards(){const word=String(document.querySelector('.l8-flip-back .l8-flip-word,.flip-back .flip-word')?.textContent||'').trim().toLowerCase();if(word!=='das attest'&&word!=='attest')return;document.querySelectorAll('.l8-card-visual,.l8-back-image,.sp-visual').forEach(forceBox);document.querySelectorAll('.l8-flip-front img,.l8-flip-back img,.sp-visual img').forEach(forceImg);document.querySelectorAll('.sp-fallback').forEach(x=>x.style.display='none')}
function run(){applyData();patchOverview();patchCards()}
run();new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});[0,50,150,400,900,1800].forEach(ms=>setTimeout(run,ms));
})();
