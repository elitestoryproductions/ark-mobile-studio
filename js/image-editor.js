// Image fill for shapes
function addImageToShape() {
  const active = canvas.getActiveObject();
  if (!active) {
    updateStatus('Select a shape first');
    return;
  }
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      fabric.Image.fromURL(ev.target.result, (img) => {
        active.set('fill', new fabric.Pattern({ source: img.getElement(), repeat: 'no-repeat' }));
        canvas.renderAll();
        saveHistory();
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// Opacity gradient effect
function applyOpacityGradient() {
  const active = canvas.getActiveObject();
  if (!active) return;
  
  const dir = document.getElementById('opacityDirection')?.value || 'none';
  const strength = document.getElementById('opacityStrength')?.value / 100 || 0.5;
  
  if (dir !== 'none') {
    // Apply gradient opacity effect
    active.set('opacity', 1);
    // Custom gradient effect based on direction
    if (dir === 'left') active.set('gradient', { type: 'linear', coords: { x1: 0, y1: 0, x2: 1, y2: 0 }, colorStops: [{ offset: 0, color: `rgba(0,0,0,${strength})` }, { offset: 1, color: 'rgba(0,0,0,0)' }] });
  }
  canvas.renderAll();
}

// Mask opacity with visual line
let maskLine = null;
function addMaskLine() {
  maskLine = new fabric.Line([50, 100, 200, 100], { stroke: '#e0b05a', strokeWidth: 3, selectable: true, hasControls: true });
  canvas.add(maskLine);
  maskLine.on('modified', () => {
    const angle = maskLine.angle || 0;
    updateStatus(`Mask angle: ${Math.round(angle)}° - Adjust opacity accordingly`);
  });
  saveHistory();
}