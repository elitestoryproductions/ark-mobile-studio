function applyBackdrop() {
  if (!canvas) return;
  const color = document.getElementById('shadeColor')?.value || '#1a1a2e';
  const effect = document.getElementById('shadeEffect')?.value || 'normal';
  const opacity = document.getElementById('shadeOpacity')?.value || 0.3;
  
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  updateStatus(`Backdrop applied: ${color} with ${effect} effect at ${Math.round(opacity * 100)}%`);
}

function loadShadePreset(color) {
  document.getElementById('shadeColor').value = color;
  applyBackdrop();
}

function applyBorder() {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select an object first'); return; }
  
  const width = parseInt(document.getElementById('borderWidth')?.value || 2);
  const color = document.getElementById('borderColor')?.value || '#e0b05a';
  const type = document.getElementById('borderType')?.value || 'solid';
  const gradient = document.getElementById('borderGradient')?.value || 'none';
  const opacity = parseFloat(document.getElementById('borderOpacity')?.value || 1);
  
  active.set('stroke', color);
  active.set('strokeWidth', width);
  active.set('strokeOpacity', opacity);
  
  if (gradient === 'gold') active.set('stroke', 'linear-gradient(90deg, #e0b05a, #b47c2e)');
  else if (gradient === 'silver') active.set('stroke', 'linear-gradient(90deg, #ccc, #888)');
  else if (gradient === 'rainbow') active.set('stroke', 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)');
  
  if (type === 'dotted') active.set('strokeDashArray', [5, 5]);
  else if (type === 'dashed') active.set('strokeDashArray', [10, 5]);
  else if (type === 'double') active.set('strokeDashArray', [2, 2, 10, 2]);
  else if (type === 'groove' || type === 'ridge') active.set('strokeDashArray', null);
  else active.set('strokeDashArray', null);
  
  canvas.renderAll();
  saveHistory();
  updateStatus(`Border applied: ${width}px ${type}`);
}

function addLine() {
  const width = parseInt(document.getElementById('lineWidth')?.value || 3);
  const color = document.getElementById('lineColor')?.value || '#e0b05a';
  const type = document.getElementById('lineType')?.value || 'solid';
  const gradient = document.getElementById('lineGradient')?.value || 'none';
  const opacity = parseFloat(document.getElementById('lineOpacity')?.value || 1);
  
  let lineColor = color;
  if (gradient === 'gold') lineColor = '#e0b05a';
  else if (gradient === 'metallic') lineColor = '#c0c0c0';
  
  const line = new fabric.Line([100, 100, 300, 100], { 
    stroke: lineColor, 
    strokeWidth: width,
    strokeOpacity: opacity,
    selectable: true, 
    hasControls: true,
    hasBorders: true
  });
  
  if (type === 'dot') line.set('strokeDashArray', [2, 6]);
  else if (type === 'dash') line.set('strokeDashArray', [10, 5]);
  else if (type === 'dash-dot') line.set('strokeDashArray', [10, 3, 2, 3]);
  
  canvas.add(line);
  canvas.setActiveObject(line);
  saveHistory();
  updateStatus('Line added');
}

function updateBorderOpacity(value) {
  const active = canvas.getActiveObject();
  if (active) {
    active.set('strokeOpacity', parseFloat(value));
    canvas.renderAll();
  }
}

function updateLineOpacity(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'line') {
    active.set('strokeOpacity', parseFloat(value));
    canvas.renderAll();
  }
}