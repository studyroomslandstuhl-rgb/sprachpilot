(function(){
'use strict';
const original=Response.prototype.text;
let active=true;
const SPECIAL={
 'schreiben':'geschrieben','bieten':'geboten','bitten':'gebeten','nennen':'genannt','sitzen':'gesessen','treiben':'getrieben','binden':'gebunden','brennen':'gebrannt','erschrecken':'erschrocken','fliehen':'geflohen','fließen':'geflossen','frieren':'gefroren','gelingen':'gelungen','gelten':'gegolten','geschehen':'geschehen','passieren':'passiert','gleichen':'geglichen','heben':'gehoben','klingen':'geklungen','leiden':'gelitten','leihen':'geliehen','meiden':'gemieden','reiben':'gerieben','schaffen':'geschafft','scheiden':'geschieden','trennen':'getrennt','teilen':'geteilt','schauen':'geschaut','scheinen':'geschienen','schießen':'geschossen','schmeißen':'geschmissen','senden':'gesendet','treten':'getreten','verzeihen':'verziehen','weisen':'gewiesen','hinweisen':'hingewiesen','auffallen':'aufgefallen','einfallen':'eingefallen','wiegen':'gewogen','zwingen':'gezwungen','hinzufügen':'hinzugefügt','spazieren gehen':'spazieren gegangen',
 'sich bewegen':'bewegt','bewegen':'bewegt','sich konzentrieren':'konzentriert','konzentrieren':'konzentriert','sich kümmern':'gekümmert','kümmern':'gekümmert','sich interessieren':'interessiert','interessieren':'interessiert','sich erinnern':'erinnert','erinnern':'erinnert','sich anziehen':'angezogen','sich ausziehen':'ausgezogen','sich umziehen':'umgezogen','sich duschen':'geduscht','duschen':'geduscht','sich freuen':'gefreut','freuen':'gefreut','sich ärgern':'geärgert','ärgern':'geärgert','sich beschweren':'beschwert','beschweren':'beschwert','sich überlegen':'überlegt','überlegen':'überlegt'
};
const SEIN=['erschrecken','fliehen','fließen','gelingen','geschehen','passieren','auffallen','einfallen','spazieren gehen'];
function patch(text){
 let out=text;
 if(out.includes('const SPECIAL={')){
  const entries=Object.entries(SPECIAL).map(([k,v])=>JSON.stringify(k)+':'+JSON.stringify(v)).join(',');
  out=out.replace('const SPECIAL={','const SPECIAL={'+entries+',')
 }
 if(out.includes('function auxiliary(v){')){
  out=out.replace('function auxiliary(v){',`function auxiliary(v){if(${JSON.stringify(SEIN)}.includes(v))return'ist';`)
 }
 return out
}
Response.prototype.text=async function(){
 const text=await original.call(this);
 if(active&&text.includes('function participle(v)')&&text.includes('const SPECIAL={')){
  active=false;
  Response.prototype.text=original;
  return patch(text)
 }
 return text
};
setTimeout(()=>{if(active){active=false;Response.prototype.text=original}},12000)
})();