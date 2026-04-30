let historyStack = [];
let historyIndex = -1;

function saveHistory() {
  if (!canvas) return;
  const state = JSON.stringify(canvas.toJSON());
  if (historyIndex < historyStack.length - 1) {
    historyStack = historyStack.slice(0, historyIndex + 1);
  }
  historyStack.push(state);
  historyIndex = historyStack.length - 1;
  if (historyStack.length > 50) historyStack.shift();
  const status = document.getElementById('statusMsg');
  if (status) status.innerText = `History: ${historyIndex + 1}/${historyStack.length}`;
}

function undo() {
  if (!canvas) return;
  if (historyIndex > 0) {
    historyIndex--;
    canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
    updateStatus(`Undo - History: ${historyIndex + 1}/${historyStack.length}`);
  } else {
    updateStatus('Nothing to undo');
  }
}

function redo() {
  if (!canvas) return;
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
    updateStatus(`Redo - History: ${historyIndex + 1}/${historyStack.length}`);
  } else {
    updateStatus('Nothing to redo');
  }
}

function updateStatus(msg) {
  const status = document.getElementById('statusMsg');
  if (status) status.innerText = msg;
  console.log(msg);
}