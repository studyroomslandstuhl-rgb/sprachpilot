(function(){
'use strict';
if(!window.VerbGroupsEngine)return;
const fileName=v=>String(v).toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^sich\s+/,'sich_').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
VerbGroupsEngine.imageUrl=v=>'https://sprachpilot.b-cdn.net/'+encodeURIComponent(fileName(v)+'.webp');
})();
