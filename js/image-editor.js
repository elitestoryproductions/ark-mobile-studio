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
        // Apply crop preset
        const crop = document.getElementById('cropPreset')?.value;
        let cropImg = img;
        if (crop === 'circle') {
          // Circular crop effect
          img.clipPath = new fabric.Circle({ radius: 50, originX: 'center', originY: 'center' });
        } else if (crop === 'square') {
          img.clipPath = new fabric.Rect({ width: 100, height: 100, originX: 'center', originY: 'center' });
        } else if (crop === 'rounded') {
          img.clipPath = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 20, originX: 'center', originY: 'center' });
        }
        
        // Apply effect
        const effect = document.getElementById('imageEffect')?.value;
        const strength = document.getElementById('effectStrength')?.value / 100 || 0.5;
        if (effect === 'grayscale') img.filters.push(new fabric.Image.filters.Grayscale());
        if (effect === 'sepia') img.filters.push(new fabric.Image.filters.Sepia());
        if (effect === 'brightness') img.filters.push(new fabric.Image.filters.Brightness({ brightness: strength }));
        if (effect === 'contrast') img.filters.push(new fabric.Image.filters.Contrast({ contrast: strength }));
        img.applyFilters();
        
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
  updateStatus('Collage feature: Select multiple images');
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
  const dir = document.getElementById('opacityDirection')?.value;
  const strength = document.getElementById('opacityStrength')?.value / 100 || 0.5;
  if (dir === 'angle') {
    updateStatus('Draw mask line to set angle');
  } else if (dir !== 'none') {
    updateStatus(`Gradient: ${dir} at ${Math.round(strength * 100)}%`);
  }
  canvas.renderAll();
}

let maskLineAngle = 0;
function addMaskLine() {
  const line = new fabric.Line([100, 100, 200, 100], { 
    stroke: '#e0b05a', strokeWidth: 3, selectable: true, hasControls: true 
  });
  canvas.add(line);
  line.on('modified', () => {
    maskLineAngle = line.angle || 0;
    updateStatus(`Mask angle: ${Math.round(maskLineAngle)}° - Use this angle for opacity`);
  });
  saveHistory();
}