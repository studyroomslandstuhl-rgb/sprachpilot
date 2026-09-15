(function(){
'use strict';
const D=window.L10T3;if(!D||!Array.isArray(D.tasks))return;
D.tasks=D.tasks.filter(t=>t&&t.id!=='arzt-arbeit-dialoge-hoeren');
})();
