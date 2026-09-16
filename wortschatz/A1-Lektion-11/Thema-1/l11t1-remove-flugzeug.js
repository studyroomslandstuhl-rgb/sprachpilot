(function(){
'use strict';
if(window.__SP_L11T1_REMOVE_FLUGZEUG_1)return;window.__SP_L11T1_REMOVE_FLUGZEUG_1=true;
const D=window.L11T1;if(!D)return;
D.cards=(D.cards||[]).filter(card=>String(card?.id||'').toLowerCase()!=='flugzeug'&&!/^das\s+flugzeug$/i.test(String(card?.full||'').trim()));
})();
