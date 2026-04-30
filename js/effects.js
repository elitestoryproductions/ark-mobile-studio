// Backdrop shades
function applyBackdrop() {
  const color = document.getElementById('shadeColor')?.value || '#1a1a2e';
  const strength = document.getElementById('shadeStrength')?.value / 100 || 0.3;
  const opacity = document.getElementById('shadeOpacity')?.value || 0.3;
  
  // Parse color and apply with opacity
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  canvas.set('backgroundVpt', false);
  canvas.renderAll();
  updateStatus('Backdrop applied');
}

// Borders
function applyBorder() {
  const active = canvas.getActiveObject();
  if (!active) {
    updateStatus('Select an object first');
    return;
  }
  
  const width = parseInt(document.getElementById('borderWidth')?.value || 2);
  const color = document.getElementById('borderColor')?.value || '#e0b05a';
  const type = document.getElementById('borderType')?.value || 'solid';
  const opacity = parseFloat(document.getElementById('borderOpacity')?.value || 1);
  
  active.set('stroke', color);
  active.set('strokeWidth', width);
  active.set('strokeOpacity', opacity);
  
  if (type === 'dotted') active.set('strokeDashArray', [5, 5]);
  else if (type === 'dashed') active.set('strokeDashArray', [10, 5]);
  else active.set('strokeDashArray', null);
  
  canvas.renderAll();
  saveHistory();
}

// Lines
function addLine() {
  const width = parseInt(document.getElementById('lineWidth')?.value || 3);
  const color = document.getElementById('lineColor')?.value || '#ffffff';
  const type = document.getElementById('lineType')?.value || 'solid';
  
  const line = new fabric.Line([100, 100, 300, 100], { 
    stroke: color, 
    strokeWidth: width, 
    selectable: true, 
    hasControls: true,
    hasBorders: true
  });
  
  if (type === 'dot') line.set('strokeDashArray', [2, 6]);
  else if (type === 'dash') line.set('strokeDashArray', [10, 5]);
  
  canvas.add(line);
  canvas.setActiveObject(line);
  saveHistory();
}