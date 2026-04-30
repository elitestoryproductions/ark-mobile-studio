function applyBorder() {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select an object'); return; }
  const width = document.getElementById('borderWidth')?.value || 2;
  const color = document.getElementById('borderColor')?.value || '#e0b05a';
  active.set('stroke', color);
  active.set('strokeWidth', parseInt(width));
  canvas.renderAll();
  saveHistory();
  updateStatus('Border applied');
}

function addLine() {
  if (!canvas) return;
  const line = new fabric.Line([100, 100, 300, 100], { stroke: '#e0b05a', strokeWidth: 3, selectable: true });
  canvas.add(line);
  saveHistory();
  updateStatus('Line added');
}

function applyBackdrop() {
  if (!canvas) return;
  const color = document.getElementById('shadeColor')?.value || '#1a1a2e';
  canvas.setBackgroundColor(color, function() { canvas.renderAll(); });
  updateStatus('Backdrop applied');
}