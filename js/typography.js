function addText() {
  if (!canvas) return;
  const text = new fabric.IText('Edit Me', { left: 200, top: 200, fontSize: 32, fill: '#2c2c2c', fontFamily: 'Arial' });
  canvas.add(text);
  canvas.setActiveObject(text);
  saveHistory();
  updateStatus('Text added');
}

function rotateText(value) {
  const active = canvas.getActiveObject();
  if (active && active.set) {
    active.rotate(parseInt(value));
    canvas.renderAll();
  }
}

function mirrorText() {
  const active = canvas.getActiveObject();
  if (active && active.set) {
    active.set('scaleX', (active.scaleX || 1) * -1);
    canvas.renderAll();
    saveHistory();
    updateStatus('Mirrored');
  }
}

function updateTextSize(value) {
  const active = canvas.getActiveObject();
  if (active && active.set) {
    active.set('fontSize', parseInt(value));
    canvas.renderAll();
  }
}

function updateTextColor(value) {
  const active = canvas.getActiveObject();
  if (active && active.set) {
    active.set('fill', value);
    canvas.renderAll();
  }
}