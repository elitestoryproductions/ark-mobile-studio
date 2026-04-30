function addImageToShape() {
  const active = canvas.getActiveObject();
  if (!active) {
    updateStatus('Select a shape first');
    return;
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      fabric.Image.fromURL(ev.target.result, function(img) {
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
        updateStatus('Image added');
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function adjustImagePosition(direction) {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select shape with image'); return; }
  const pattern = active.get('fill');
  if (!pattern || !pattern.source) { updateStatus('No image in shape'); return; }
  let offsetX = pattern.offsetX || 0;
  let offsetY = pattern.offsetY || 0;
  if (direction === 'left') offsetX -= 5;
  if (direction === 'right') offsetX += 5;
  if (direction === 'up') offsetY -= 5;
  if (direction === 'down') offsetY += 5;
  pattern.offsetX = offsetX;
  pattern.offsetY = offsetY;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Moved ' + direction);
}

function resetImagePosition() {
  const active = canvas.getActiveObject();
  if (!active) return;
  const pattern = active.get('fill');
  if (!pattern) return;
  pattern.offsetX = 0;
  pattern.offsetY = 0;
  pattern.scaleX = 1;
  pattern.scaleY = 1;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Reset');
}

function scaleImageInsideShape(delta) {
  const active = canvas.getActiveObject();
  if (!active) return;
  const pattern = active.get('fill');
  if (!pattern) return;
  let scale = (pattern.scaleX || 1) + delta;
  if (scale < 0.3) scale = 0.3;
  if (scale > 3) scale = 3;
  pattern.scaleX = scale;
  pattern.scaleY = scale;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Zoom ' + (delta > 0 ? '+' : '-'));
}

function addMaskLine() {
  if (!canvas) return;
  const line = new fabric.Line([50, 100, 200, 100], { stroke: '#e0b05a', strokeWidth: 3, selectable: true });
  canvas.add(line);
  saveHistory();
  updateStatus('Mask line added');
}