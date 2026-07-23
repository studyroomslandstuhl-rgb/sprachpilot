(function(){
'use strict';
const E=window.VerbGroupsEngine;
if(!E||E.__requestedVerbSupport)return;
E.__requestedVerbSupport=true;
const NEW=new Set(window.SP_ADDED_VERBS||[]);
const REF=new Set(['sich bewegen','sich konzentrieren','sich kümmern','sich interessieren','sich erinnern','sich anziehen','sich ausziehen','sich umziehen','sich duschen','sich freuen','sich ärgern','sich beschweren','sich überlegen']);
const DAT_REF=new Set(['sich überlegen']);
const SEP={
 'hinweisen':['weisen','hin'],'auffallen':['fallen','auf'],'einfallen':['fallen','ein'],'hinzufügen':['fügen','hin'],'spazieren gehen':['gehen','spazieren'],
 'sich anziehen':['ziehen','an'],'sich ausziehen':['ziehen','aus'],'sich umziehen':['ziehen','um']
};
const FORMS={
 'bieten':['biete','bietest','bietet','bieten','bietet','bieten'],
 'bitten':['bitte','bittest','bittet','bitten','bittet','bitten'],
 'nennen':['nenne','nennst','nennt','nennen','nennt','nennen'],
 'sitzen':['sitze','sitzt','sitzt','sitzen','sitzt','sitzen'],
 'treiben':['treibe','treibst','treibt','treiben','treibt','treiben'],
 'binden':['binde','bindest','bindet','binden','bindet','binden'],
 'brennen':['brenne','brennst','brennt','brennen','brennt','brennen'],
 'erschrecken':['erschrecke','erschrickst','erschrickt','erschrecken','erschreckt','erschrecken'],
 'fliehen':['fliehe','fliehst','flieht','fliehen','flieht','fliehen'],
 'fließen':['fließe','fließt','fließt','fließen','fließt','fließen'],
 'frieren':['friere','frierst','friert','frieren','friert','frieren'],
 'gelingen':['gelinge','gelingst','gelingt','gelingen','gelingt','gelingen'],
 'gelten':['gelte','giltst','gilt','gelten','geltet','gelten'],
 'geschehen':['geschehe','geschiehst','geschieht','geschehen','gescheht','geschehen'],
 'gleichen':['gleiche','gleichst','gleicht','gleichen','gleicht','gleichen'],
 'heben':['hebe','hebst','hebt','heben','hebt','heben'],
 'klingen':['klinge','klingst','klingt','klingen','klingt','klingen'],
 'leiden':['leide','leidest','leidet','leiden','leidet','leiden'],
 'leihen':['leihe','leihst','leiht','leihen','leiht','leihen'],
 'meiden':['meide','meidest','meidet','meiden','meidet','meiden'],
 'reiben':['reibe','reibst','reibt','reiben','reibt','reiben'],
 'schaffen':['schaffe','schaffst','schafft','schaffen','schafft','schaffen'],
 'scheiden':['scheide','scheidest','scheidet','scheiden','scheidet','scheiden'],
 'scheinen':['scheine','scheinst','scheint','scheinen','scheint','scheinen'],
 'schießen':['schieße','schießt','schießt','schießen','schießt','schießen'],
 'schmeißen':['schmeiße','schmeißt','schmeißt','schmeißen','schmeißt','schmeißen'],
 'senden':['sende','sendest','sendet','senden','sendet','senden'],
 'treten':['trete','trittst','tritt','treten','tretet','treten'],
 'verzeihen':['verzeihe','verzeihst','verzeiht','verzeihen','verzeiht','verzeihen'],
 'weisen':['weise','weist','weist','weisen','weist','weisen'],
 'wiegen':['wiege','wiegst','wiegt','wiegen','wiegt','wiegen'],
 'zwingen':['zwinge','zwingst','zwingt','zwingen','zwingt','zwingen']
};
const IRR=new Set(Object.keys(FORMS).concat(['auffallen','einfallen','hinweisen','spazieren gehen']));
const ACC={ich:'mich',du:'dich',er:'sich',wir:'uns',ihr:'euch',sie:'sich'};
const DAT={ich:'mir',du:'dir',er:'sich',wir:'uns',ihr:'euch',sie:'sich'};
const original={forms:E.forms.bind(E),displayForm:E.displayForm.bind(E),groupLabel:E.groupLabel.bind(E),phrase:E.phrase.bind(E),meaning:E.meaning.bind(E),sentence:E.sentence.bind(E),question:E.question.bind(E)};
function parts(v){
 const sep=SEP[v]||null,ref=REF.has(v),base=sep?sep[0]:(ref?v.replace(/^sich\s+/,''):v);
 return{base,prefix:sep?.[1]||'',reflexive:ref,dative:DAT_REF.has(v)}
}
function forms(v){
 if(!NEW.has(v))return original.forms(v);
 const p=parts(v);
 return FORMS[p.base]||original.forms(p.base)
}
function displayForm(v,pi){
 if(!NEW.has(v))return original.displayForm(v,pi);
 const p=parts(v),person=E.PERSONS[pi]||E.PERSONS[0],bits=[forms(v)[pi]];
 if(p.reflexive)bits.push((p.dative?DAT:ACC)[person.key]||'sich');
 if(p.prefix)bits.push(p.prefix);
 return bits.join(' ')
}
function groupLabel(v){
 if(!NEW.has(v))return original.groupLabel(v);
 if(REF.has(v))return'Reflexiv';
 if(SEP[v])return'Trennbar';
 if(IRR.has(v))return'Unregelmäßig';
 return'Regelmäßig'
}
function phrase(v,pi){return NEW.has(v)?`${E.PERSONS[pi].label} ${displayForm(v,pi)}`:original.phrase(v,pi)}
function meaning(v){return NEW.has(v)?(window.SP_VERB_ENGLISH?.[v]||v):original.meaning(v)}
function sentence(v){return NEW.has(v)?(window.SP_VERB_SENTENCES?.[v]||`Ich lerne das Verb „${v}“.`):original.sentence(v)}
const norm=v=>String(v||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss');
const shuffle=a=>{a=[...(a||[])];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function options(answer,pool,count=4){const seen=new Set([norm(answer)]),others=[];shuffle(pool).forEach(x=>{if(x!=null&&!seen.has(norm(x))){seen.add(norm(x));others.push(x)}});return shuffle([answer,...others.slice(0,count-1)])}
function question(groupId,task,v,personOverride=null){
 if(!NEW.has(v))return original.question(groupId,task,v,personOverride);
 const group=E.GROUPS[groupId-1],names=group.verbs,pi=personOverride??E.personFor(groupId,task,v),answerForm=displayForm(v,pi),meanings=group.verbs.map(meaning);
 if(task==='meaning-to-verb')return{kind:'mc',prompt:meaning(v),answer:v,options:options(v,names),image:v};
 if(task==='verb-to-meaning')return{kind:'mc',prompt:`Was bedeutet „${v}“?`,answer:meaning(v),options:options(meaning(v),meanings)};
 if(task==='listen')return{kind:'mc',prompt:'Höre das Verb.',answer:v,options:options(v,names),audio:v};
 if(task==='image-to-verb')return{kind:'mc',prompt:'Welches Verb zeigt das Bild?',answer:v,options:options(v,names),image:v};
 if(task==='verb-to-image')return{kind:'images',prompt:`Welches Bild passt zu „${v}“?`,answer:v,options:options(v,names)};
 if(task==='read-sentence')return{kind:'mc',prompt:sentence(v),answer:v,options:options(v,names)};
 if(task==='change')return{kind:'mc',prompt:`Zu welcher Gruppe gehört „${v}“?`,answer:groupLabel(v),options:options(groupLabel(v),['Regelmäßig','Unregelmäßig','Trennbar','Nicht trennbar','Reflexiv','Modalverb'])};
 if(task==='choose-form')return{kind:'mc',prompt:`${E.PERSONS[pi].label} – ${v}`,answer:answerForm,options:options(answerForm,group.verbs.map(x=>NEW.has(x)?displayForm(x,pi):original.displayForm(x,pi)))};
 if(task==='write-form')return{kind:'input',prompt:`${E.PERSONS[pi].label} – ${v}`,answer:answerForm,placeholder:'Verbform schreiben'};
 if(task==='speak')return{kind:'speech',prompt:`Sprich: ${E.PERSONS[pi].label} – ${v}`,answer:phrase(v,pi),answers:[phrase(v,pi),answerForm],writeAnswer:answerForm};
 if(task==='sentence')return{kind:'input',prompt:`${E.PERSONS[pi].label} ________ (${v}).`,answer:answerForm,placeholder:'Verbform schreiben'};
 return{kind:'input',prompt:'Schreibe das Verb.',answer:v}
}
E.forms=forms;E.displayForm=displayForm;E.groupLabel=groupLabel;E.phrase=phrase;E.meaning=meaning;E.sentence=sentence;E.question=question;
})();