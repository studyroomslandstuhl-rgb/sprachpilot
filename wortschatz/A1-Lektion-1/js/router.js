import { TASK_TYPES } from "../data/taskTypes.js";
import { renderFlashcards } from "./tasks/flashcards.js";
import { renderMemory } from "./tasks/memory.js";
import { renderImageToVerb } from "./tasks/imageToVerb.js";
import { renderVerbToImage } from "./tasks/verbToImage.js";
import { renderWriteVerb } from "./tasks/writeVerb.js";
import { renderHearWrite } from "./tasks/hearWrite.js";
import { renderHearSpeak } from "./tasks/hearSpeak.js";
import { renderImageSpeak } from "./tasks/imageSpeak.js";
import { renderSentencePuzzle } from "./tasks/sentencePuzzle.js";

const RENDERERS = {
  flashcards:renderFlashcards,
  memory:renderMemory,
  imageToVerb:renderImageToVerb,
  verbToImage:renderVerbToImage,
  writeVerb:renderWriteVerb,
  hearWrite:renderHearWrite,
  hearSpeak:renderHearSpeak,
  imageSpeak:renderImageSpeak,
  sentencePuzzle:renderSentencePuzzle
};

export function renderTaskOverview({app, assignment, progress, openTask}){
  app.innerHTML = `
    <h2>Aufgaben</h2>
    
    <div class="grid">
      ${assignment.enabledTasks.map(t => {
        const title = TASK_TYPES[t]?.title || t;
        return `<button class="task-card" data-task="${t}">${title}</button>`;
      }).join("")}
    </div>
  `;
  app.querySelectorAll("[data-task]").forEach(btn => {
    btn.onclick = () => openTask(btn.dataset.task);
  });
}

export function openTask(taskId, ctx){
  const renderer = RENDERERS[taskId];
  if(!renderer){
    ctx.app.innerHTML = `<div class="no">Diese Aufgabe ist noch nicht eingebunden: ${taskId}</div>`;
    return;
  }
  renderer(ctx);
}
