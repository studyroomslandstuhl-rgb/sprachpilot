
const WORDS=[{"id": "flasche", "article": "die", "word": "Flasche", "full": "die Flasche", "plural": "die Flaschen", "pluralGroup": "-n", "image": "../bilder/flasche.png", "translations": {"Deutsch": "Flasche", "Russisch": "бутылка", "Ukrainisch": "пляшка", "Arabisch": "زجاجة", "Türkisch": "şişe", "Rumänisch": "sticlă", "Englisch": "bottle"}}, {"id": "dose", "article": "die", "word": "Dose", "full": "die Dose", "plural": "die Dosen", "pluralGroup": "-n", "image": "../bilder/dose.png", "translations": {"Deutsch": "Dose", "Russisch": "банка", "Ukrainisch": "банка", "Arabisch": "علبة", "Türkisch": "kutu", "Rumänisch": "cutie", "Englisch": "can"}}, {"id": "glas", "article": "das", "word": "Glas", "full": "das Glas", "plural": "die Gläser", "pluralGroup": "-er/Umlaut", "image": "../bilder/glas.png", "translations": {"Deutsch": "Glas", "Russisch": "стакан", "Ukrainisch": "склянка", "Arabisch": "كأس", "Türkisch": "bardak", "Rumänisch": "pahar", "Englisch": "glass"}}, {"id": "packung", "article": "die", "word": "Packung", "full": "die Packung", "plural": "die Packungen", "pluralGroup": "-en", "image": "../bilder/packung.png", "translations": {"Deutsch": "Packung", "Russisch": "упаковка", "Ukrainisch": "упаковка", "Arabisch": "عبوة", "Türkisch": "paket", "Rumänisch": "pachet", "Englisch": "package"}}, {"id": "tuete", "article": "die", "word": "Tüte", "full": "die Tüte", "plural": "die Tüten", "pluralGroup": "-n", "image": "../bilder/tuete.png", "translations": {"Deutsch": "Tüte", "Russisch": "пакет", "Ukrainisch": "пакет", "Arabisch": "كيس", "Türkisch": "poşet", "Rumänisch": "pungă", "Englisch": "bag"}}, {"id": "becher", "article": "der", "word": "Becher", "full": "der Becher", "plural": "die Becher", "pluralGroup": "-", "image": "../bilder/becher.png", "translations": {"Deutsch": "Becher", "Russisch": "стаканчик", "Ukrainisch": "стаканчик", "Arabisch": "كوب", "Türkisch": "bardak", "Rumänisch": "pahar", "Englisch": "cup"}}, {"id": "karton", "article": "der", "word": "Karton", "full": "der Karton", "plural": "die Kartons", "pluralGroup": "-s", "image": "../bilder/karton.png", "translations": {"Deutsch": "Karton", "Russisch": "картонная коробка", "Ukrainisch": "картонна коробка", "Arabisch": "كرتون", "Türkisch": "karton", "Rumänisch": "carton", "Englisch": "carton"}}, {"id": "stueck", "article": "das", "word": "Stück", "full": "das Stück", "plural": "die Stücke", "pluralGroup": "-e", "image": "../bilder/stueck.png", "translations": {"Deutsch": "Stück", "Russisch": "кусок", "Ukrainisch": "шматок", "Arabisch": "قطعة", "Türkisch": "parça", "Rumänisch": "bucată", "Englisch": "piece"}}, {"id": "kilo", "article": "das", "word": "Kilo", "full": "das Kilo", "plural": "die Kilos", "pluralGroup": "-s", "image": "../bilder/kilo.png", "translations": {"Deutsch": "Kilo", "Russisch": "кило", "Ukrainisch": "кіло", "Arabisch": "كيلو", "Türkisch": "kilo", "Rumänisch": "kilogram", "Englisch": "kilo"}}, {"id": "gramm", "article": "das", "word": "Gramm", "full": "das Gramm", "plural": "die Gramm", "pluralGroup": "-", "image": "../bilder/gramm.png", "translations": {"Deutsch": "Gramm", "Russisch": "грамм", "Ukrainisch": "грам", "Arabisch": "غرام", "Türkisch": "gram", "Rumänisch": "gram", "Englisch": "gram"}}, {"id": "liter", "article": "der", "word": "Liter", "full": "der Liter", "plural": "die Liter", "pluralGroup": "-", "image": "../bilder/liter.png", "translations": {"Deutsch": "Liter", "Russisch": "литр", "Ukrainisch": "літр", "Arabisch": "لتر", "Türkisch": "litre", "Rumänisch": "litru", "Englisch": "liter"}}];
const PRODUCTS=[{"id": "wasser", "article": "das", "word": "Wasser", "full": "das Wasser", "image": "../bilder/wasser.png"}, {"id": "milch", "article": "die", "word": "Milch", "full": "die Milch", "image": "../bilder/milch.png"}, {"id": "kaffee", "article": "der", "word": "Kaffee", "full": "der Kaffee", "image": "../bilder/kaffee.png"}, {"id": "zucker", "article": "der", "word": "Zucker", "full": "der Zucker", "image": "../bilder/zucker.png"}, {"id": "salz", "article": "das", "word": "Salz", "full": "das Salz", "image": "../bilder/salz.png"}, {"id": "saft", "article": "der", "word": "Saft", "full": "der Saft", "image": "../bilder/saft.png"}, {"id": "kaese", "article": "der", "word": "Käse", "full": "der Käse", "image": "../bilder/kaese.png"}, {"id": "apfel", "article": "der", "word": "Apfel", "full": "der Apfel", "image": "../bilder/apfel.png"}, {"id": "tomate", "article": "die", "word": "Tomate", "full": "die Tomate", "image": "../bilder/tomate.png"}, {"id": "bier", "article": "das", "word": "Bier", "full": "das Bier", "image": "../bilder/bier.png"}, {"id": "wein", "article": "das", "word": "Wein", "full": "das Wein", "image": "../bilder/wein.png"}, {"id": "tee", "article": "der", "word": "Tee", "full": "der Tee", "image": "../bilder/tee.png"}, {"id": "mehl", "article": "das", "word": "Mehl", "full": "das Mehl", "image": "../bilder/mehl.png"}, {"id": "cola", "article": "die", "word": "Cola", "full": "die Cola", "image": "../bilder/cola.png"}, {"id": "ananas", "article": "die", "word": "Ananas", "full": "die Ananas", "image": "../bilder/ananas.png"}, {"id": "joghurt", "article": "das", "word": "Joghurt", "full": "das Joghurt", "image": "../bilder/joghurt.png"}, {"id": "sahne", "article": "die", "word": "Sahne", "full": "die Sahne", "image": "../bilder/sahne.png"}, {"id": "marmelade", "article": "die", "word": "Marmelade", "full": "die Marmelade", "image": "../bilder/marmelade.png"}, {"id": "nutella", "article": "das", "word": "Nutella", "full": "das Nutella", "image": "../bilder/nutella.png"}, {"id": "chips", "article": "das", "word": "Chips", "full": "das Chips", "image": "../bilder/chips.png"}, {"id": "schokolade", "article": "die", "word": "Schokolade", "full": "die Schokolade", "image": "../bilder/schokolade.png"}, {"id": "ei", "article": "das", "word": "Ei", "full": "das Ei", "image": "../bilder/ei.png"}, {"id": "zwiebel", "article": "die", "word": "Zwiebel", "full": "die Zwiebel", "image": "../bilder/zwiebel.png"}, {"id": "brokkoli", "article": "der", "word": "Brokkoli", "full": "der Brokkoli", "image": "../bilder/brokkoli.png"}, {"id": "kohl", "article": "der", "word": "Kohl", "full": "der Kohl", "image": "../bilder/kohl.png"}, {"id": "wuerstchen", "article": "das", "word": "Würstchen", "full": "das Würstchen", "image": "../bilder/wuerstchen.png"}, {"id": "fleisch", "article": "das", "word": "Fleisch", "full": "das Fleisch", "image": "../bilder/fleisch.png"}, {"id": "fisch", "article": "der", "word": "Fisch", "full": "der Fisch", "image": "../bilder/fisch.png"}];
const COMBOS=[{"text": "eine Flasche Wasser", "container": "flasche", "product": "wasser", "price": "0,79 €", "question": "Was kostet eine Flasche Wasser?", "answer": "Eine Flasche Wasser kostet 0,79 Euro.", "isPlural": false}, {"text": "eine Flasche Saft", "container": "flasche", "product": "saft", "price": "1,99 €", "question": "Was kostet eine Flasche Saft?", "answer": "Eine Flasche Saft kostet 1,99 Euro.", "isPlural": false}, {"text": "eine Flasche Bier", "container": "flasche", "product": "bier", "price": "1,29 €", "question": "Was kostet eine Flasche Bier?", "answer": "Eine Flasche Bier kostet 1,29 Euro.", "isPlural": false}, {"text": "eine Flasche Wein", "container": "flasche", "product": "wein", "price": "5,99 €", "question": "Was kostet eine Flasche Wein?", "answer": "Eine Flasche Wein kostet 5,99 Euro.", "isPlural": false}, {"text": "eine Packung Zucker", "container": "packung", "product": "zucker", "price": "1,29 €", "question": "Was kostet eine Packung Zucker?", "answer": "Eine Packung Zucker kostet 1,29 Euro.", "isPlural": false}, {"text": "eine Packung Kaffee", "container": "packung", "product": "kaffee", "price": "4,99 €", "question": "Was kostet eine Packung Kaffee?", "answer": "Eine Packung Kaffee kostet 4,99 Euro.", "isPlural": false}, {"text": "eine Packung Tee", "container": "packung", "product": "tee", "price": "2,49 €", "question": "Was kostet eine Packung Tee?", "answer": "Eine Packung Tee kostet 2,49 Euro.", "isPlural": false}, {"text": "eine Packung Mehl", "container": "packung", "product": "mehl", "price": "0,99 €", "question": "Was kostet eine Packung Mehl?", "answer": "Eine Packung Mehl kostet 0,99 Euro.", "isPlural": false}, {"text": "eine Dose Kaffee", "container": "dose", "product": "kaffee", "price": "3,99 €", "question": "Was kostet eine Dose Kaffee?", "answer": "Eine Dose Kaffee kostet 3,99 Euro.", "isPlural": false}, {"text": "eine Dose Bier", "container": "dose", "product": "bier", "price": "0,89 €", "question": "Was kostet eine Dose Bier?", "answer": "Eine Dose Bier kostet 0,89 Euro.", "isPlural": false}, {"text": "eine Dose Cola", "container": "dose", "product": "cola", "price": "0,99 €", "question": "Was kostet eine Dose Cola?", "answer": "Eine Dose Cola kostet 0,99 Euro.", "isPlural": false}, {"text": "eine Dose Tomaten", "container": "dose", "product": "tomate", "price": "1,29 €", "question": "Was kostet eine Dose Tomaten?", "answer": "Eine Dose Tomaten kostet 1,29 Euro.", "isPlural": false}, {"text": "eine Dose Ananas", "container": "dose", "product": "ananas", "price": "1,49 €", "question": "Was kostet eine Dose Ananas?", "answer": "Eine Dose Ananas kostet 1,49 Euro.", "isPlural": false}, {"text": "ein Becher Joghurt", "container": "becher", "product": "joghurt", "price": "0,69 €", "question": "Was kostet ein Becher Joghurt?", "answer": "Ein Becher Joghurt kostet 0,69 Euro.", "isPlural": false}, {"text": "ein Becher Sahne", "container": "becher", "product": "sahne", "price": "1,19 €", "question": "Was kostet ein Becher Sahne?", "answer": "Ein Becher Sahne kostet 1,19 Euro.", "isPlural": false}, {"text": "ein Becher Kaffee", "container": "becher", "product": "kaffee", "price": "1,49 €", "question": "Was kostet ein Becher Kaffee?", "answer": "Ein Becher Kaffee kostet 1,49 Euro.", "isPlural": false}, {"text": "ein Glas Marmelade", "container": "glas", "product": "marmelade", "price": "2,49 €", "question": "Was kostet ein Glas Marmelade?", "answer": "Ein Glas Marmelade kostet 2,49 Euro.", "isPlural": false}, {"text": "ein Glas Nutella", "container": "glas", "product": "nutella", "price": "3,49 €", "question": "Was kostet ein Glas Nutella?", "answer": "Ein Glas Nutella kostet 3,49 Euro.", "isPlural": false}, {"text": "eine Tüte Chips", "container": "tuete", "product": "chips", "price": "1,99 €", "question": "Was kostet eine Tüte Chips?", "answer": "Eine Tüte Chips kostet 1,99 Euro.", "isPlural": false}, {"text": "eine Tüte Schokolade", "container": "tuete", "product": "schokolade", "price": "2,19 €", "question": "Was kostet eine Tüte Schokolade?", "answer": "Eine Tüte Schokolade kostet 2,19 Euro.", "isPlural": false}, {"text": "zehn Eier", "container": "stueck", "amount": "10", "product": "ei", "price": "2,99 €", "question": "Was kosten zehn Eier?", "answer": "Zehn Eier kosten 2,99 Euro.", "isPlural": true}, {"text": "ein Kilo Zwiebeln", "container": "kilo", "amount": "1", "product": "zwiebel", "price": "1,49 €", "question": "Was kostet ein Kilo Zwiebeln?", "answer": "Ein Kilo Zwiebeln kostet 1,49 Euro.", "isPlural": false}, {"text": "zwei Kilo Äpfel", "container": "kilo", "amount": "2", "product": "apfel", "price": "5,98 €", "question": "Was kosten zwei Kilo Äpfel?", "answer": "Zwei Kilo Äpfel kosten 5,98 Euro.", "isPlural": true}, {"text": "drei Kilo Tomaten", "container": "kilo", "amount": "3", "product": "tomate", "price": "7,47 €", "question": "Was kosten drei Kilo Tomaten?", "answer": "Drei Kilo Tomaten kosten 7,47 Euro.", "isPlural": true}, {"text": "ein Kilo Brokkoli", "container": "kilo", "amount": "1", "product": "brokkoli", "price": "2,79 €", "question": "Was kostet ein Kilo Brokkoli?", "answer": "Ein Kilo Brokkoli kostet 2,79 Euro.", "isPlural": false}, {"text": "zwei Kilo Kohl", "container": "kilo", "amount": "2", "product": "kohl", "price": "3,98 €", "question": "Was kosten zwei Kilo Kohl?", "answer": "Zwei Kilo Kohl kosten 3,98 Euro.", "isPlural": true}, {"text": "100 Gramm Käse", "container": "gramm", "amount": "100", "product": "kaese", "price": "1,99 €", "question": "Was kosten 100 Gramm Käse?", "answer": "100 Gramm Käse kosten 1,99 Euro.", "isPlural": true}, {"text": "200 Gramm Würstchen", "container": "gramm", "amount": "200", "product": "wuerstchen", "price": "2,79 €", "question": "Was kosten 200 Gramm Würstchen?", "answer": "200 Gramm Würstchen kosten 2,79 Euro.", "isPlural": true}, {"text": "300 Gramm Fleisch", "container": "gramm", "amount": "300", "product": "fleisch", "price": "4,49 €", "question": "Was kosten 300 Gramm Fleisch?", "answer": "300 Gramm Fleisch kosten 4,49 Euro.", "isPlural": true}, {"text": "500 Gramm Fisch", "container": "gramm", "amount": "500", "product": "fisch", "price": "6,99 €", "question": "Was kosten 500 Gramm Fisch?", "answer": "500 Gramm Fisch kosten 6,99 Euro.", "isPlural": true}];
const PRICE_TASKS=[{"price": "0,79 €", "spoken": "Eine Flasche Wasser kostet 0,79 Euro."}, {"price": "1,99 €", "spoken": "Eine Flasche Saft kostet 1,99 Euro."}, {"price": "1,29 €", "spoken": "Eine Flasche Bier kostet 1,29 Euro."}, {"price": "5,99 €", "spoken": "Eine Flasche Wein kostet 5,99 Euro."}, {"price": "1,29 €", "spoken": "Eine Packung Zucker kostet 1,29 Euro."}, {"price": "4,99 €", "spoken": "Eine Packung Kaffee kostet 4,99 Euro."}, {"price": "2,49 €", "spoken": "Eine Packung Tee kostet 2,49 Euro."}, {"price": "0,99 €", "spoken": "Eine Packung Mehl kostet 0,99 Euro."}, {"price": "3,99 €", "spoken": "Eine Dose Kaffee kostet 3,99 Euro."}, {"price": "0,89 €", "spoken": "Eine Dose Bier kostet 0,89 Euro."}, {"price": "0,99 €", "spoken": "Eine Dose Cola kostet 0,99 Euro."}, {"price": "1,29 €", "spoken": "Eine Dose Tomaten kostet 1,29 Euro."}, {"price": "1,49 €", "spoken": "Eine Dose Ananas kostet 1,49 Euro."}, {"price": "0,69 €", "spoken": "Ein Becher Joghurt kostet 0,69 Euro."}, {"price": "1,19 €", "spoken": "Ein Becher Sahne kostet 1,19 Euro."}, {"price": "1,49 €", "spoken": "Ein Becher Kaffee kostet 1,49 Euro."}, {"price": "2,49 €", "spoken": "Ein Glas Marmelade kostet 2,49 Euro."}, {"price": "3,49 €", "spoken": "Ein Glas Nutella kostet 3,49 Euro."}, {"price": "1,99 €", "spoken": "Eine Tüte Chips kostet 1,99 Euro."}, {"price": "2,19 €", "spoken": "Eine Tüte Schokolade kostet 2,19 Euro."}];
const KEY='SP_A1_L3_T2_FIXED_V2';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function lang(){try{let p=JSON.parse(localStorage.getItem('SP_USER_PROFILE')||'{}');return p.muttersprache||p.motherLanguage||'Russisch'}catch(e){return 'Russisch'}}
function tr(w){return (w.translations&&(w.translations[lang()]||w.translations.Russisch||w.translations.Englisch))||w.word}
function full(w){return w.full||w.article+' '+w.word}
function norm(x){return String(x||'').trim().replace(/\s+/g,' ')}
function simple(x){return norm(x).toLowerCase().replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replaceAll('ß','ss').replace(/[?.!,€]/g,'')}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function articleOk(a,w){return String(a||'').toLowerCase()===w.article}
function diagnose(ans,w){let a=norm(ans);let art=(a.split(' ')[0]||'').toLowerCase();if(!['der','die','das'].includes(art))return {ok:false,msg:'Artikel fehlt.',tip:'Schreibe Artikel + Nomen.',sol:full(w)};if(!articleOk(art,w))return {ok:false,msg:'Artikel falsch.',tip:'Achte auf der/die/das.',sol:full(w)};let word=a.replace(/^(der|die|das)\s+/i,'');if(simple(word)!==simple(w.word))return {ok:false,msg:'Wort falsch.',tip:'Vergleiche mit dem Bild.',sol:full(w)};return {ok:true}}
function speak(text,slow=false){try{speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=slow?0.55:0.82;let v=speechSynthesis.getVoices().find(x=>x.lang&&x.lang.toLowerCase().startsWith('de'));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
function startMic(btn,cb){let SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){cb('');return}btn.classList.add('active');let st=document.getElementById('micStatus');if(st)st.textContent='🎤 Mikrofon aktiv ...';let r=new SR();r.lang='de-DE';r.interimResults=false;r.maxAlternatives=1;r.onresult=e=>{btn.classList.remove('active');if(st)st.textContent='';cb(e.results[0][0].transcript)};r.onerror=()=>{btn.classList.remove('active');if(st)st.textContent='';cb('')};r.start()}
function state(file){let s=load();s[file]=s[file]||{done:[],bad:[]};save(s);return s[file]}
function setState(file,st){let s=load();s[file]=st;save(s)}
function queue(file,list){let st=state(file),done=new Set(st.done||[]);return {file,q:shuffle(list.filter(w=>!done.has(w.id))),bad:(st.bad||[]).map(id=>list.find(w=>w.id===id)).filter(Boolean),done:[...done],cur:null,tries:0,had:false}}
function next(Q){if(Q.q.length)return Q.q.shift();if(Q.bad.length){Q.q=shuffle(Q.bad);Q.bad=[];return Q.q.shift()}return null}
function wrong(Q){Q.tries++;Q.had=true}
function right(Q,w){if(Q.had)Q.bad.push(w);else if(!Q.done.includes(w.id))Q.done.push(w.id);setState(Q.file,{done:Q.done,bad:[...new Set(Q.bad.map(x=>x.id))]})}
function fail(Q,d){if(Q.tries===1)return d.msg;if(Q.tries===2)return d.msg+'<div class="hint">Tipp: '+d.tip+'</div>';return d.msg+'<div class="hint">Lösung: '+d.sol+'</div>'}
function prog(Q){let left=Q.q.length+Q.bad.length+(Q.cur?1:0),done=Q.done.length,p=Math.round(done/(done+left)*100)||0;return `<div class="small">${done} richtig · ${left} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`}
function done(file){let s=load();s.done=s.done||{};s.done[file]=true;save(s)}
function taskPct(file,total=WORDS.length){let s=load();if(s.done&&s.done[file])return 100;let st=s[file];return st?Math.round((st.done||[]).length/total*100):0}
function complete(area,file,next){done(file);area.innerHTML='<div class="big">Gut gemacht!</div><div class="actions"><a class="btn" href="'+next+'">Nächste Aufgabe →</a><a class="btn secondary" href="index.html">Menü</a></div>'}
function fixImg(img){img.classList.add('missing')}
function byId(list,id){return list.find(x=>x.id===id)||{}}
function byId(list,id){return list.find(x=>x.id===id)||{}}
function comboImages(c){
  let cont=byId(WORDS,c.container);
  let prod=byId(PRODUCTS,c.product);
  let amount=c.amount ? '<div class="amount-badge">'+c.amount+'</div>' : '';
  return `<div class="combo-images">
    <div class="combo-part">${amount}<img src="${cont.image||''}" onerror="fixImg(this)" alt=""></div>
    <div class="combo-plus">+</div>
    <div class="combo-part"><img src="${prod.image||''}" onerror="fixImg(this)" alt=""></div>
  </div>`;
}
function header(title){document.querySelector('.hero').innerHTML=`<div class="top"><a class="brand" href="../../index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="small">${title} · A1 Lektion 3 · Thema 2</div></div></a><div class="nav"><a class="btn secondary" href="../index.html">← Lektionsübersicht</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><a class="btn secondary" href="index.html">Thema 2</a></div></div>`}

function pctFor(file,total=WORDS.length){
  let s=load();
  if(s.done&&s.done[file]) return 100;
  let st=s[file];
  if(st && Array.isArray(st.done)) return Math.round(st.done.length/total*100);
  return 0;
}

function spPriceToSpeech(price){
  let p=String(price||'').replace('€','').trim();
  let parts=p.split(',');
  let euro=parseInt(parts[0]||'0',10);
  let cent=parseInt((parts[1]||'00').padEnd(2,'0'),10);
  if(euro===0) return cent+' Cent';
  if(cent===0) return euro===1 ? 'ein Euro' : euro+' Euro';
  return (euro===1 ? 'ein Euro' : euro+' Euro')+' '+cent+' Cent';
}
function spSpeakPriceSentence(c){
  let text=c.spoken||c.answer||'';
  return text.replace(c.price.replace('€','').trim()+' Euro', spPriceToSpeech(c.price))
             .replace(c.price, spPriceToSpeech(c.price))
             .replace(/0,(\d\d)\s*Euro/g, (_,cent)=>parseInt(cent,10)+' Cent');
}
function spTaskStateKey(file){return 'SP_TASK_STATE_'+file;}
function spLoadTaskState(file,total){
  try{
    let st=JSON.parse(localStorage.getItem(spTaskStateKey(file))||'null');
    if(st && Array.isArray(st.queue) && st.total===total) return st;
  }catch(e){}
  let queue=[...Array(total).keys()].sort(()=>Math.random()-.5);
  return {total,queue,done:[],current:null,tries:0};
}
function spSaveTaskState(file,st){
  localStorage.setItem(spTaskStateKey(file), JSON.stringify(st));
}
function spNextIndex(file,total){
  let st=spLoadTaskState(file,total);
  if(st.current===null || st.current===undefined){
    st.current=st.queue.shift();
    st.tries=0;
    spSaveTaskState(file,st);
  }
  return st.current;
}
function spProgressHtml(file,total){
  let st=spLoadTaskState(file,total);
  let done=st.done.length;
  let left=total-done;
  let p=Math.round(done/total*100)||0;
  return `<div class="small">${done} richtig · ${left} übrig · ${p}%</div><div class="progress"><div class="bar" style="width:${p}%"></div></div>`;
}
function spMarkRight(file,total){
  let st=spLoadTaskState(file,total);
  if(st.current!==null && !st.done.includes(st.current)) st.done.push(st.current);
  st.current=null;
  st.tries=0;
  spSaveTaskState(file,st);
  return st.done.length>=total;
}
function spMarkWrong(file,total){
  let st=spLoadTaskState(file,total);
  st.tries=(st.tries||0)+1;
  if(st.tries===1){
    // current item stays current for another try
  }else{
    // after second+ wrong attempt, move to end and continue
    if(st.current!==null) st.queue.push(st.current);
    st.current=null;
  }
  spSaveTaskState(file,st);
  return st.tries;
}
function spFeedbackForTry(tries, solution, type){
  if(tries===1) return 'Da ist noch ein Fehler.';
  if(tries===2) return 'Tipp: Prüfe '+(type||'Form, Wort und Preis')+'.';
  return 'Lösung: '+solution;
}
function spResetTask(file){
  localStorage.removeItem(spTaskStateKey(file));
}

function priceVariants(price){
  let p = String(price||'').replace('€','').trim();
  let parts = p.split(',');
  let euro = parts[0] || '0';
  let cent = parts[1] || '00';
  let compact = euro+','+cent;
  let euroNum = parseInt(euro,10);
  let centNum = parseInt(cent,10);
  let out = [
    compact+' Euro',
    euro+' Euro '+cent,
    euro+' Euro '+cent+' Cent',
    euro+' '+cent,
    compact
  ];
  if(euroNum===0){
    out.push(centNum+' Cent');
    out.push('null Euro '+cent);
  }
  return out.map(simple);
}
function acceptablePriceSentence(ans,price){
  let a=simple(ans);
  if(!a.startsWith('das kostet') && !a.startsWith('das macht')) return false;
  return priceVariants(price).some(v=>a.includes(v));
}
function acceptableQuestion(ans,c){
  let a=simple(ans);
  let verb=c.isPlural?'kosten':'kostet';
  let wrong=c.isPlural?'kostet':'kosten';
  let starts=['was '+verb,'wie viel '+verb,'wieviel '+verb].map(simple);
  if(!starts.some(st=>a.startsWith(st))) return false;
  if(a.includes(simple(' '+wrong+' '))) return false;
  return true;
}
function acceptableAnswer(ans,c){
  let a=simple(ans);
  if(acceptablePriceSentence(ans,c.price)) return true;
  let verb=c.isPlural?'kosten':'kostet';
  let wrong=c.isPlural?'kostet':'kosten';
  if(a.includes(simple(' '+wrong+' '))) return false;
  let pvars=priceVariants(c.price);
  let starts=[
    simple(c.text+' '+verb),
    simple('Der Artikel '+verb),
    simple('Das Produkt '+verb),
    simple('Es '+verb),
    simple('Das '+verb)
  ];
  return starts.some(st=>a.startsWith(st)) && pvars.some(v=>a.includes(v));
}

