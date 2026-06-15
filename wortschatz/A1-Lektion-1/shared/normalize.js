export function cleanAnswer(value){
  return String(value||"")
    .trim()
    .toLowerCase()
    .replace(/[.,!?]/g,"")
    .replace(/\s+/g," ");
}
export function isCorrect(answer, correct){
  return cleanAnswer(answer) === cleanAnswer(correct);
}
export function shuffle(arr){
  return [...arr].sort(()=>Math.random()-.5);
}
export function safeText(s){
  return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}
