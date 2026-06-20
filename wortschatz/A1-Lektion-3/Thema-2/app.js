
const WORDS=[{"id": "flasche", "article": "die", "word": "Flasche", "full": "die Flasche", "plural": "die Flaschen", "pluralGroup": "-n", "image": "../bilder/flasche.png", "translations": {"Deutsch": "Flasche", "Russisch": "бутылка", "Ukrainisch": "пляшка", "Arabisch": "زجاجة", "Türkisch": "şişe", "Rumänisch": "sticlă", "Englisch": "bottle"}}, {"id": "dose", "article": "die", "word": "Dose", "full": "die Dose", "plural": "die Dosen", "pluralGroup": "-n", "image": "../bilder/dose.png", "translations": {"Deutsch": "Dose", "Russisch": "банка", "Ukrainisch": "банка", "Arabisch": "علبة", "Türkisch": "kutu", "Rumänisch": "cutie", "Englisch": "can"}}, {"id": "glas", "article": "das", "word": "Glas", "full": "das Glas", "plural": "die Gläser", "pluralGroup": "-er/Umlaut", "image": "../bilder/glas.png", "translations": {"Deutsch": "Glas", "Russisch": "стакан", "Ukrainisch": "склянка", "Arabisch": "كأس", "Türkisch": "bardak", "Rumänisch": "pahar", "Englisch": "glass"}}, {"id": "packung", "article": "die", "word": "Packung", "full": "die Packung", "plural": "die Packungen", "pluralGroup": "-en", "image": "../bilder/packung.png", "translations": {"Deutsch": "Packung", "Russisch": "упаковка", "Ukrainisch": "упаковка", "Arabisch": "عبوة", "Türkisch": "paket", "Rumänisch": "pachet", "Englisch": "package"}}, {"id": "tuete", "article": "die", "word": "Tüte", "full": "die Tüte", "plural": "die Tüten", "pluralGroup": "-n", "image": "../bilder/tuete.png", "translations": {"Deutsch": "Tüte", "Russisch": "пакет", "Ukrainisch": "пакет", "Arabisch": "كيس", "Türkisch": "poşet", "Rumänisch": "pungă", "Englisch": "bag"}}, {"id": "becher", "article": "der", "word": "Becher", "full": "der Becher", "plural": "die Becher", "pluralGroup": "-", "image": "../bilder/becher.png", "translations": {"Deutsch": "Becher", "Russisch": "стаканчик", "Ukrainisch": "стаканчик", "Arabisch": "كوب", "Türkisch": "bardak", "Rumänisch": "pahar", "Englisch": "cup"}}, {"id": "karton", "article": "der", "word": "Karton", "full": "der Karton", "plural": "die Kartons", "pluralGroup": "-s", "image": "../bilder/karton.png", "translations": {"Deutsch": "Karton", "Russisch": "картонная коробка", "Ukrainisch": "картонна коробка", "Arabisch": "كرتون", "Türkisch": "karton", "Rumänisch": "carton", "Englisch": "carton"}}, {"id": "stueck", "article": "das", "word": "Stück", "full": "das Stück", "plural": "die Stücke", "pluralGroup": "-e", "image": "../bilder/stueck.png", "translations": {"Deutsch": "Stück", "Russisch": "кусок", "Ukrainisch": "шматок", "Arabisch": "قطعة", "Türkisch": "parça", "Rumänisch": "bucată", "Englisch": "piece"}}, {"id": "kilo", "article": "das", "word": "Kilo", "full": "das Kilo", "plural": "die Kilos", "pluralGroup": "-s", "image": "../bilder/kilo.png", "translations": {"Deutsch": "Kilo", "Russisch": "кило", "Ukrainisch": "кіло", "Arabisch": "كيلو", "Türkisch": "kilo", "Rumänisch": "kilogram", "Englisch": "kilo"}}, {"id": "gramm", "article": "das", "word": "Gramm", "full": "das Gramm", "plural": "die Gramm", "pluralGroup": "-", "image": "../bilder/gramm.png", "translations": {"Deutsch": "Gramm", "Russisch": "грамм", "Ukrainisch": "грам", "Arabisch": "غرام", "Türkisch": "gram", "Rumänisch": "gram", "Englisch": "gram"}}, {"id": "liter", "article": "der", "word": "Liter", "full": "der Liter", "plural": "die Liter", "pluralGroup": "-", "image": "../bilder/liter.png", "translations": {"Deutsch": "Liter", "Russisch": "литр", "Ukrainisch": "літр", "Arabisch": "لتر", "Türkisch": "litre", "Rumänisch": "litru", "Englisch": "liter"}}];
const PRODUCTS=[{"id": "wasser", "article": "das", "word": "Wasser", "full": "das Wasser", "image": "../bilder/wasser.png"}, {"id": "milch", "article": "die", "word": "Milch", "full": "die Milch", "image": "../bilder/milch.png"}, {"id": "kaffee", "article": "der", "word": "Kaffee", "full": "der Kaffee", "image": "../bilder/kaffee.png"}, {"id": "zucker", "article": "der", "word": "Zucker", "full": "der Zucker", "image": "../bilder/zucker.png"}, {"id": "salz", "article": "das", "word": "Salz", "full": "das Salz", "image": "../bilder/salz.png"}, {"id": "saft", "article": "der", "word": "Saft", "full": "der Saft", "image": "../bilder/saft.png"}, {"id": "kaese", "article": "der", "word": "Käse", "full": "der Käse", "image": "../bilder/kaese.png"}, {"id": "apfel", "article": "der", "word": "Apfel", "full": "der Apfel", "image": "../bilder/apfel.png"}, {"id": "tomate", "article": "die", "word": "Tomate", "full": "die Tomate", "image": "../bilder/tomate.png"}];
const COMBOS=[{"text": "eine Flasche Wasser", "plural": "zwei Flaschen Wasser", "container": "flasche", "product": "wasser", "price": "1,50 €", "question": "Was kostet eine Flasche Wasser?", "answer": "Eine Flasche Wasser kostet 1,50 Euro."}, {"text": "eine Packung Kaffee", "plural": "drei Packungen Kaffee", "container": "packung", "product": "kaffee", "price": "4,99 €", "question": "Was kostet eine Packung Kaffee?", "answer": "Eine Packung Kaffee kostet 4,99 Euro."}, {"text": "eine Dose Saft", "plural": "vier Dosen Saft", "container": "dose", "product": "saft", "price": "0,99 €", "question": "Was kostet eine Dose Saft?", "answer": "Eine Dose Saft kostet 0,99 Euro."}, {"text": "ein Glas Milch", "plural": "zwei Gläser Milch", "container": "glas", "product": "milch", "price": "1,20 €", "question": "Was kostet ein Glas Milch?", "answer": "Ein Glas Milch kostet 1,20 Euro."}, {"text": "eine Tüte Zucker", "plural": "zwei Tüten Zucker", "container": "tuete", "product": "zucker", "price": "1,29 €", "question": "Was kostet eine Tüte Zucker?", "answer": "Eine Tüte Zucker kostet 1,29 Euro."}, {"text": "ein Kilo Äpfel", "plural": "zwei Kilo Äpfel", "container": "kilo", "product": "apfel", "price": "2,99 €", "question": "Was kostet ein Kilo Äpfel?", "answer": "Ein Kilo Äpfel kostet 2,99 Euro."}, {"text": "100 Gramm Käse", "plural": "200 Gramm Käse", "container": "gramm", "product": "kaese", "price": "2,49 €", "question": "Was kosten 100 Gramm Käse?", "answer": "100 Gramm Käse kosten 2,49 Euro."}, {"text": "ein Liter Wasser", "plural": "zwei Liter Wasser", "container": "liter", "product": "wasser", "price": "0,80 €", "question": "Was kostet ein Liter Wasser?", "answer": "Ein Liter Wasser kostet 0,80 Euro."}];
const PRICE_TASKS=[{"price": "0,80 €", "spoken": "Das kostet achtzig Cent."}, {"price": "0,99 €", "spoken": "Das macht neunundneunzig Cent."}, {"price": "1,20 €", "spoken": "Das kostet ein Euro zwanzig."}, {"price": "1,29 €", "spoken": "Das macht ein Euro neunundzwanzig."}, {"price": "1,50 €", "spoken": "Das kostet ein Euro fünfzig."}, {"price": "2,49 €", "spoken": "Das macht zwei Euro neunundvierzig."}, {"price": "2,99 €", "spoken": "Das kostet zwei Euro neunundneunzig."}, {"price": "4,20 €", "spoken": "Das macht vier Euro zwanzig."}, {"price": "4,99 €", "spoken": "Das kostet vier Euro neunundneunzig."}, {"price": "7,99 €", "spoken": "Das macht sieben Euro neunundneunzig."}];
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
function header(title){document.querySelector('.hero').innerHTML=`<div class="top"><a class="brand" href="../../index.html"><div class="logo">SP</div><div><h1>SprachPilot</h1><div class="small">${title} · A1 Lektion 3 · Thema 2</div></div></a><div class="nav"><a class="btn secondary" href="../index.html">← Lektionsübersicht</a><a class="btn secondary" href="uebersicht.html">Übersicht</a><a class="btn secondary" href="statistik.html">Statistik</a><a class="btn secondary" href="index.html">Thema 2</a></div></div>`}

function pctFor(file,total=WORDS.length){
  let s=load();
  if(s.done&&s.done[file]) return 100;
  let st=s[file];
  if(st && Array.isArray(st.done)) return Math.round(st.done.length/total*100);
  return 0;
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
  let targets=[
    c.question,
    'Was kostet '+c.text+'?',
    'Wie viel kostet '+c.text+'?',
    'Was macht '+c.text+'?',
    'Wie viel kostet das?',
    'Was kostet das?'
  ].map(simple);
  return targets.includes(a);
}
function acceptableAnswer(ans,c){
  let a=simple(ans);
  if(acceptablePriceSentence(ans,c.price)) return true;
  let pvars=priceVariants(c.price);
  let starts=[
    simple(c.text+' kostet'),
    simple('Der Artikel kostet'),
    simple('Das Produkt kostet'),
    simple('Es kostet')
  ];
  return starts.some(st=>a.startsWith(st)) && pvars.some(v=>a.includes(v));
}

