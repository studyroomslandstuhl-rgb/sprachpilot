import { isCorrect, shuffle, safeText } from "../../shared/normalize.js";
import { imagePath } from "../../shared/images.js";
export function renderMemory(ctx){
  const words = ctx.progress.activeVerbs.slice(0,6);
  let first = null;
  const cards = shuffle(words.flatMap(v=>[{v,type:"word"},{v,type:"image"}]));
  ctx.app.innerHTML = `<h2>Memory</h2><div class="grid">${cards.map((c,i)=>`<button class="verb-card" data-i="${i}" data-v="${c.v}" data-type="${c.type}">${c.type==="word"?safeText(c.v):`<img class="img" src="${imagePath(c.v)}" onerror="this.style.display='none'">`}</button>`).join("")}</div><div id="feedback"></div>`;
  ctx.app.querySelectorAll("[data-i]").forEach(btn=>{
    btn.onclick=()=>{
      if(!first){ first=btn; btn.disabled=true; return; }
      const good = first.dataset.v===btn.dataset.v && first.dataset.type!==btn.dataset.type;
      ctx.finishTask(btn.dataset.v,"memory",good);
    };
  });
}
