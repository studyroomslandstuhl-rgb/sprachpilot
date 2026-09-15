import {renderSpHeader,bindSpHeader} from '/js/sp-header.js?v=theme-standard4';

const D=window.L10T3||{};
const root=document.getElementById('app');
const taskId=String(new URLSearchParams(location.search).get('task')||'').toLowerCase();
const task=(D.tasks||[]).find(function(t){return t.id===taskId;})||{title:'Briefteile',text:'Bearbeite die Aufgabe.'};
const key='SP_L10T3_BRIEF_'+taskId;

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(v){return String(v==null?'':v).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[.,!?;:“”"'`´()]/g,'').replace(/\s+/g,' ');}
function shuffle(a){var b=(a||[]).slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=b[i];b[i]=b[j];b[j]=x;}return b;}
function loadState(){var s={done:[],wrong:{}};try{var old=JSON.parse(localStorage.getItem(key)||'null');if(old&&typeof old==='object')Object.assign(s,old);}catch(e){}return s;}
var st=loadState();
function save(){try{localStorage.setItem(key,JSON.stringify(st));}catch(e){}}
function shell(body){var h=renderSpHeader({subtitle:'Arzt, Arbeit und Krankmeldung · A1 Lektion 10 · Thema 3'});var n=(D.tasks||[]).findIndex(function(t){return t.id===taskId;})+1;root.innerHTML='<div class="l10-theme-page">'+h+'<div class="l8-wrap"><section class="l8-card l8-task-head"><div class="l8-task-title-block"><span class="l8-task-kicker">Aufgabe '+n+'</span><h1>'+esc(task.title)+'</h1><p>'+esc(task.text||'')+'</p></div></section>'+body+'</div></div>';bindSpHeader(root);}
function feedback(type,text){var e=document.getElementById('fb');if(e)e.innerHTML='<div class="l8-feedback '+type+'">'+text+'</div>';}
function finish(){shell('<section class="l8-card l8-finish"><div class="l8-finish-icon">✓</div><h2>Gut gemacht!</h2><a class="l8-btn primary" href="index.html">Zur Themenübersicht</a></section>');}

function labelParts(){
 var raw=Array.isArray(D.letterLabelParts)?D.letterLabelParts:[];
 if(raw.length>=8)return raw;
 return [
  {id:'lp1',marker:'Anna Becker · Hauptstraße 12 · 66538 Neunkirchen',part:'Absender',article:'der'},
  {id:'lp2',marker:'Firma Sonnenschein · Personalabteilung · Bahnhofstraße 8 · 66538 Neunkirchen',part:'Empfänger',article:'der'},
  {id:'lp3',marker:'Neunkirchen,',part:'Ort',article:'der'},
  {id:'lp4',marker:'15.09.2026',part:'Datum',article:'das'},
  {id:'lp5',marker:'Krankmeldung',part:'Betreff',article:'der'},
  {id:'lp6',marker:'Sehr geehrte Frau Winter,',part:'Anrede',article:'die'},
  {id:'lp7',marker:'Mit freundlichen Grüßen',part:'Gruß',article:'der'},
  {id:'lp8',marker:'Anna Becker',part:'Unterschrift',article:'die'}
 ];
}
function makeGap(item,names){
 var options=shuffle([item.part].concat(shuffle(names.filter(function(x){return x!==item.part;})).slice(0,3)));
 return '<div class="sp-letter-gap" data-box="'+esc(item.id)+'" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:0 0 8px">'+
  '<input class="l8-input" data-article="'+esc(item.id)+'" placeholder="Artikel" style="width:92px;min-width:92px">'+
  '<select class="l8-input" data-select="'+esc(item.id)+'" style="flex:1;min-width:180px"><option value="">Briefteil wählen</option>'+options.map(function(o){return '<option value="'+esc(o)+'">'+esc(o)+'</option>';}).join('')+'</select></div>';
}
function draw13(){
 var parts=labelParts();
 var names=parts.map(function(x){return x.part;});
 var by={};parts.forEach(function(x){by[x.id]=x;});
 var a=by.lp1,b=by.lp2,c=by.lp3,d=by.lp4,e=by.lp5,f=by.lp6,g=by.lp7,h=by.lp8;
 var letter='<div class="sp-letter-sheet" style="background:#fff;border:1px solid #e7d7d7;border-radius:16px;padding:22px;max-width:760px;margin:0 auto;line-height:1.55">'+
  makeGap(a,names)+'<div style="margin-bottom:20px">Anna Becker<br>Hauptstraße 12<br>66538 Neunkirchen</div>'+
  makeGap(b,names)+'<div style="margin-bottom:24px">Firma Sonnenschein<br>Personalabteilung<br>Bahnhofstraße 8<br>66538 Neunkirchen</div>'+
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px"><div>'+makeGap(c,names)+'<div>Neunkirchen,</div></div><div>'+makeGap(d,names)+'<div>15.09.2026</div></div></div>'+
  makeGap(e,names)+'<div style="font-weight:700;margin-bottom:20px">Krankmeldung</div>'+
  makeGap(f,names)+'<div style="margin-bottom:18px">Sehr geehrte Frau Winter,</div>'+
  '<p style="margin:0 0 18px">leider bin ich krank und kann drei Tage nicht arbeiten. Das Attest finden Sie anbei.</p>'+
  makeGap(g,names)+'<div style="margin-bottom:18px">Mit freundlichen Grüßen</div>'+
  makeGap(h,names)+'<div>Anna Becker</div></div>';
 shell('<section class="l8-card l8-exercise"><div class="l8-note"><strong>Ganzer Brief:</strong> Wähle bei jeder Lücke den Briefteil und schreibe den Artikel.</div>'+letter+'<div class="l8-row l8-center-actions" style="margin-top:18px"><button class="l8-btn primary" id="check">Brief prüfen</button></div><div id="fb"></div></section>');
 document.getElementById('check').onclick=function(){
  var all=true,missing=[];
  parts.forEach(function(x){
   var article=document.querySelector('[data-article="'+x.id+'"]');
   var select=document.querySelector('[data-select="'+x.id+'"]');
   var box=document.querySelector('[data-box="'+x.id+'"]');
   var ok=norm(article?article.value:'')===norm(x.article)&&norm(select?select.value:'')===norm(x.part);
   if(box){box.style.outline=ok?'2px solid #b9dfc8':'2px solid #efb7b7';box.style.borderRadius='10px';}
   if(!ok){all=false;missing.push(x.article+' '+x.part);}
  });
  if(all){st.done=parts.map(function(x){return x.id;});save();feedback('good','Der ganze Brief ist richtig!');setTimeout(finish,500);}
  else{st.wrong.all=(st.wrong.all||0)+1;save();feedback('bad',st.wrong.all>=3?'Lösungen: <strong>'+esc(missing.join(' · '))+'</strong>':'Noch nicht alles richtig. Prüfe die markierten Lücken.');}
 };
}

function letterRows(){return Array.isArray(D.letterParts)?D.letterParts:[];}
function letterQuestions(){return Array.isArray(D.letterQuestions)?D.letterQuestions:[];}
function draw14(){
 var rows=letterRows();if(!rows.length)return finish();var idx=st.done.length;if(idx>=rows.length)return finish();var item=rows[idx];var all=rows.map(function(x){return x.a;});var opts=shuffle([item.a].concat(shuffle(all.filter(function(x){return x!==item.a;})).slice(0,2)));
 shell('<section class="l8-card l8-exercise"><div class="sp-source">'+esc(item.q)+'</div><div class="l8-options">'+opts.map(function(o,i){return '<button type="button" class="l8-option" data-a="'+esc(o)+'">'+String.fromCharCode(65+i)+' · '+esc(o)+'</button>';}).join('')+'</div><div id="fb"></div></section>');
 document.querySelectorAll('[data-a]').forEach(function(btn){btn.onclick=function(){if(norm(btn.dataset.a)===norm(item.a)){st.done.push(String(idx));save();feedback('good','Richtig!');setTimeout(draw14,350);}else feedback('bad','Noch nicht richtig.');};});
}
function draw15(){
 var rows=letterQuestions();if(!rows.length)return finish();var idx=st.done.length;if(idx>=rows.length)return finish();var item=rows[idx];
 shell('<section class="l8-card l8-exercise"><div class="sp-source">'+esc(item.q)+'</div><div class="l8-answer-row"><input class="l8-input" id="ans" placeholder="Antwort mit Artikel schreiben"><button class="l8-btn primary" id="check">Prüfen</button></div><div id="fb"></div></section>');
 document.getElementById('check').onclick=function(){var v=document.getElementById('ans').value;if(norm(v)===norm(item.a)){st.done.push(String(idx));save();feedback('good','Richtig!');setTimeout(draw15,350);}else feedback('bad','Noch nicht richtig.');};
}

try{
 if(taskId==='brief-beschriften')draw13();
 else if(taskId==='briefteile')draw14();
 else draw15();
}catch(err){
 console.error('L10T3 Briefaufgabe',err);
 root.innerHTML='<div class="l8-wrap"><section class="l8-card"><h1>Aufgabe konnte nicht geladen werden.</h1><button class="l8-btn primary" onclick="location.reload()">Neu laden</button></section></div>';
}
