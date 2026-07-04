// Strenger Filter: Lehrerdashboard wertet nur explizit freigeschaltete Inhalte aus.
(function(){
  if(typeof Analytics==='undefined'||Analytics.__strictReleaseFilter)return;
  const A=Analytics;
  const baseRows=A.topicRecords.bind(A);
  function get(obj,path){let cur=obj;for(const p of path){if(!cur||typeof cur!=='object'||!(p in cur))return undefined;cur=cur[p]}return cur}
  function hasReleaseData(c){return !!(c&&typeof c==='object'&&(c.enabledModules||c.enabledLessons||c.enabledThemes||c.enabledTasks||c.enabledWords||c.releases))}
  function valTrue(c,paths){return paths.some(p=>get(c,p)===true)}
  function valFalse(c,paths){return paths.some(p=>get(c,p)===false)}
  function lesson(row){const s=String(row.lesson||row.id||row.title||'');const m=s.match(/A\d[- ]Lektion[- ]\d+/i)||s.match(/lektion[- ]?(\d+)/i);return m?(m[0].startsWith('A')?m[0].replace(/ /g,'-'):'A1-Lektion-'+m[1]):''}
  function theme(row){const s=String(row.theme||row.id||row.title||'');const m=s.match(/Thema[- ]\d+/i)||s.match(/thema[- ]?(\d+)/i);return m?(m[0].toLowerCase().startsWith('thema')&&m[0].includes('-')?m[0].replace(/ /g,'-'):'Thema-'+m[1]):''}
  function modulePaths(row){const m=String(row.module||'').toLowerCase();if(m==='verben')return [['enabledModules','Verben A1'],['enabledModules','verben-A1'],['releases','Verben A1','enabled'],['releases','verben-A1','enabled']];if(m==='fragen')return [['enabledModules','Fragen A1'],['enabledModules','fragen-A1'],['releases','Fragen A1','enabled'],['releases','fragen-A1','enabled']];return [['enabledModules','Wortschatz'],['enabledModules','wortschatz'],['releases','Wortschatz','enabled'],['releases','wortschatz','enabled']]}
  function released(course,row){
    if(!hasReleaseData(course))return false;
    const m=String(row.module||'').toLowerCase();
    if(valFalse(course,modulePaths(row)))return false;
    if(valTrue(course,modulePaths(row)))return true;
    if(m==='verben')return Object.keys(course.enabledWords||{}).some(k=>course.enabledWords[k]===true);
    if(m==='fragen')return false;
    const l=lesson(row), th=theme(row);
    const lPaths=[['enabledLessons',l],['enabledLessons','Wortschatz/'+l],['enabledLessons','wortschatz/'+l],['releases','Wortschatz','lessons',l,'enabled'],['releases','wortschatz','lessons',l,'enabled']];
    const tPaths=[['enabledThemes',th],['enabledThemes',l+'/'+th],['enabledThemes','Wortschatz/'+l+'/'+th],['enabledThemes','wortschatz/'+l+'/'+th],['releases','Wortschatz','lessons',l,'themes',th,'enabled'],['releases','wortschatz','lessons',l,'themes',th,'enabled']];
    if(valFalse(course,lPaths)||valFalse(course,tPaths))return false;
    if(valTrue(course,lPaths)||valTrue(course,tPaths))return true;
    return false;
  }
  A.topicRecords=function(s,course){return baseRows(s,course).filter(row=>released(course,row))};
  A.overallProgress=function(s,course){const rows=this.topicRecords(s,course);return rows.length?this.percent(rows.reduce((sum,x)=>sum+this.percent(x.percent),0)/rows.length):0};
  A.topicSummary=function(s,course){const rows=this.topicRecords(s,course);if(!rows.length)return this.pill('keine freigegebenen Inhalte','warn');const active=rows.filter(x=>this.percent(x.percent)>0&&this.percent(x.percent)<100).length;const done=rows.filter(x=>this.percent(x.percent)>=100).length;const fresh=rows.filter(x=>this.percent(x.percent)===0).length;return `${this.pill(`${active} aktiv`,active?'ok':'')} ${this.pill(`${done} fertig`,done?'ok':'')} ${fresh?this.pill(`${fresh} neu`,'warn'):''}`};
  Analytics.__strictReleaseFilter=true;
})();
