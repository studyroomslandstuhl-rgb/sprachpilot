(function(){
'use strict';
if(window.__SP_L10T1_BUNNY_MEDIA_V1)return;window.__SP_L10T1_BUNNY_MEDIA_V1=true;
const D=window.L10T1;if(!D)return;
const CDN='https://sprachpilot.b-cdn.net/';
const AUDIO=CDN+'audio/';
for(const item of D.cards||[]){
 if(!item||!item.id)continue;
 if(!item.image)item.image=CDN+item.id+'.webp';
 item.audio=AUDIO+item.id+'.mp3';
}
window.L10T1BunnyMedia={base:CDN,audioBase:AUDIO};
})();
