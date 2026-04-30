function saveHistory() {
  const state = JSON.stringify(canvas.toJSON(['selectable', 'hasControls', 'hasBorders']));
  if (historyIndex < historyStack.length - 1) {
    historyStack = historyStack.slice(0, historyIndex + 1);
  }
  historyStack.push(state);
  historyIndex = historyStack.length - 1;
  if (historyStack.length > 50) historyStack.shift();
  updateStatus(`History: ${historyIndex + 1}/${historyStack.length}`);
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    loadState(historyStack[historyIndex]);
  }
}

function redo() {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    loadState(historyStack[historyIndex]);
  }
}

function loadState(state) {
  canvas.loadFromJSON(state, () => canvas.renderAll());
}

function updateStatus(msg) {
  const status = document.getElementById('statusMsg');
  if (status) status.innerText = msg;
}