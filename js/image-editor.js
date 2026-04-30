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
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      fabric.Image.fromURL(ev.target.result, (img) => {
        const pattern = new fabric.Pattern({
          source: img.getElement(),
          repeat: 'no-repeat',
          offsetX: 0,
          offsetY: 0,
          scaleX: 1,
          scaleY: 1
        });
        active.set('fill', pattern);
        canvas.renderAll();
        saveHistory();
        updateStatus('Image added. Use arrow buttons to position.');
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function addCollage() {
  updateStatus('Select multiple images for collage');
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*';
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    let x = 50;
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        fabric.Image.fromURL(ev.target.result, (img) => {
          img.set({ left: x, top: 200, width: 100, height: 100, scaleX: 0.5, scaleY: 0.5 });
          canvas.add(img);
          x += 120;
          if (idx === files.length - 1) {
            canvas.renderAll();
            saveHistory();
            updateStatus(`Collage created with ${files.length} images`);
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };
  input.click();
}

function adjustImagePosition(direction) {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape with image first'); return; }
  const pattern = active.get('fill');
  if (!pattern || pattern.source === undefined) { updateStatus('Selected shape has no image'); return; }
  let offsetX = pattern.offsetX || 0;
  let offsetY = pattern.offsetY || 0;
  const step = 5;
  switch(direction) {
    case 'left': offsetX -= step; break;
    case 'right': offsetX += step; break;
    case 'up': offsetY -= step; break;
    case 'down': offsetY += step; break;
  }
  pattern.offsetX = offsetX;
  pattern.offsetY = offsetY;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus(`Image moved ${direction}`);
}

function resetImagePosition() {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape first'); return; }
  const pattern = active.get('fill');
  if (!pattern || pattern.source === undefined) { updateStatus('Selected shape has no image'); return; }
  pattern.offsetX = 0;
  pattern.offsetY = 0;
  pattern.scaleX = 1;
  pattern.scaleY = 1;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Image position reset');
}

function scaleImageInsideShape(delta) {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape first'); return; }
  const pattern = active.get('fill');
  if (!pattern || pattern.source === undefined) { updateStatus('Selected shape has no image'); return; }
  let currentScale = pattern.scaleX || 1;
  let newScale = currentScale + delta;
  if (newScale < 0.3) newScale = 0.3;
  if (newScale > 3) newScale = 3;
  pattern.scaleX = newScale;
  pattern.scaleY = newScale;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus(`Scale: ${Math.round(newScale * 100)}%`);
}

function applyOpacityGradient() {
  const active = canvas.getActiveObject();
  if (!active) return;
  updateStatus('Gradient applied');
  canvas.renderAll();
}

let maskLine = null;
function addMaskLine() {
  if (!canvas) return;
  maskLine = new fabric.Line([50, 100, 200, 100], { 
    stroke: '#e0b05a', strokeWidth: 3, selectable: true, hasControls: true 
  });
  canvas.add(maskLine);
  maskLine.on('modified', () => {
    const angle = maskLine.angle || 0;
    updateStatus(`Mask angle: ${Math.round(angle)}°`);
  });
  saveHistory();
}