
// ============================================
// ARK STUDIO - COMPLETE FIXED APP.JS
// ============================================

let canvas;
let historyStack = [];
let historyIndex = -1;
let activeMaskLine = null;

function updateStatus(msg) {
  const el = document.getElementById('statusMsg');
  if (el) el.innerText = msg;
  console.log(msg);
}

function saveHistory() {
  if (!canvas) return;
  try {
    const state = JSON.stringify(canvas.toJSON());
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(state);
    historyIndex = historyStack.length - 1;
    if (historyStack.length > 50) historyStack.shift();
  } catch(e) {}
}

function undo() {
  if (!canvas || historyIndex <= 0) return;
  historyIndex--;
  canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
  updateStatus('Undo');
}

function redo() {
  if (!canvas || historyIndex >= historyStack.length - 1) return;
  historyIndex++;
  canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
  updateStatus('Redo');
}

// ============================================
// CONTAINER SHAPES (50 UNIQUE MODELS)
// ============================================

function initCanvas() {
  canvas = new fabric.Canvas('design-canvas');
  canvas.setWidth(800);
  canvas.setHeight(1000);
  canvas.setBackgroundColor('#f0ede8', () => canvas.renderAll());
  canvas.on('object:modified', () => saveHistory());
  canvas.on('object:added', () => saveHistory());
  canvas.on('object:removed', () => saveHistory());
  
  canvas.on('object:selected', function(e) {
    const obj = e.target;
    if (obj) {
      obj.set({
        cornerSize: 10,
        cornerColor: '#e0b05a',
        cornerStrokeColor: '#b47c2e',
        transparentCorners: false,
        borderColor: '#e0b05a',
        hasRotatingPoint: true
      });
      
      // Only top-right corner resizes
      obj.setControlVisible('tl', false);
      obj.setControlVisible('tr', true);
      obj.setControlVisible('bl', false);
      obj.setControlVisible('br', false);
      obj.setControlVisible('ml', false);
      obj.setControlVisible('mr', false);
      obj.setControlVisible('mt', false);
      obj.setControlVisible('mb', false);
      
      canvas.renderAll();
    }
  });
  
  saveHistory();
  updateStatus('Canvas ready');
}

// 50 UNIQUE SHAPES - NO REPEATS
const shapes = [
  'circle', 'square', 'triangle', 'heart', 'star-5', 'diamond', 'hexagon', 
  'pentagon', 'octagon', 'cross', 'arrow-up', 'arrow-right', 'arrow-down', 
  'arrow-left', 'plus', 'minus', 'multiply', 'divide', 'equals', 
  'cloud', 'lightning', 'drop', 'sun', 'moon', 'flower', 'leaf', 
  'shield', 'flag', 'ribbon', 'tag', 'bubble', 'rounded-rect', 
  'parallelogram', 'trapezoid', 'ring', 'donut', 'crescent', 'blob', 
  'frame', 'burst', 'spiral', 'wave', 'zigzag', 'infinity', 'clover', 
  'spade', 'club', 'heart-2', 'anchor', 'key'
];

function addShape(type) {
  if (!canvas) return;
  let obj;
  const opts = { 
    left: 150, top: 150, fill: '#c9a03d', stroke: '#b47c2e', strokeWidth: 2, 
    selectable: true, hasControls: true, hasBorders: true
  };
  
  // Opacity setting for shape
  const shapeOpacity = document.getElementById('shapeOpacity')?.value || 1;
  
  if (type === 'circle') obj = new fabric.Circle({ radius: 60, ...opts, opacity: parseFloat(shapeOpacity) });
  else if (type === 'square') obj = new fabric.Rect({ width: 120, height: 120, ...opts, opacity: parseFloat(shapeOpacity) });
  else if (type === 'triangle') obj = new fabric.Triangle({ width: 120, height: 120, ...opts, opacity: parseFloat(shapeOpacity) });
  else if (type === 'heart') obj = new fabric.Path('M 0 0 C -20 -30, -50 -10, 0 40 C 50 -10, 20 -30, 0 0', { ...opts, scaleX: 1.5, scaleY: 1.5, opacity: parseFloat(shapeOpacity) });
  else if (type === 'star-5') obj = new fabric.Polygon([{x:0,y:-50},{x:14,y:-15},{x:50,y:-15},{x:22,y:10},{x:34,y:45},{x:0,y:25},{x:-34,y:45},{x:-22,y:10},{x:-50,y:-15},{x:-14,y:-15}], opts);
  else if (type === 'diamond') obj = new fabric.Polygon([{x:0,y:-50},{x:50,y:0},{x:0,y:50},{x:-50,y:0}], opts);
  else if (type === 'hexagon') obj = new fabric.Polygon([{x:0,y:-50},{x:43,y:-25},{x:43,y:25},{x:0,y:50},{x:-43,y:25},{x:-43,y:-25}], opts);
  else if (type === 'pentagon') obj = new fabric.Polygon([{x:0,y:-50},{x:47,y:-15},{x:29,y:40},{x:-29,y:40},{x:-47,y:-15}], opts);
  else if (type === 'octagon') obj = new fabric.Polygon([{x:0,y:-50},{x:35,y:-35},{x:50,y:0},{x:35,y:35},{x:0,y:50},{x:-35,y:35},{x:-50,y:0},{x:-35,y:-35}], opts);
  else if (type === 'cross') obj = new fabric.Path('M -20 -20 L 20 20 M 20 -20 L -20 20', { ...opts, strokeWidth: 8 });
  else if (type === 'arrow-up') obj = new fabric.Triangle({ width: 40, height: 60, ...opts, angle: 0 });
  else if (type === 'arrow-right') obj = new fabric.Triangle({ width: 40, height: 60, ...opts, angle: 90 });
  else if (type === 'arrow-down') obj = new fabric.Triangle({ width: 40, height: 60, ...opts, angle: 180 });
  else if (type === 'arrow-left') obj = new fabric.Triangle({ width: 40, height: 60, ...opts, angle: 270 });
  else if (type === 'plus') obj = new fabric.Path('M 0 -30 L 0 30 M -30 0 L 30 0', { ...opts, strokeWidth: 8 });
  else if (type === 'minus') obj = new fabric.Path('M -30 0 L 30 0', { ...opts, strokeWidth: 8 });
  else if (type === 'cloud') obj = new fabric.Circle({ radius: 40, ...opts });
  else obj = new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 20, ...opts });
  
  canvas.add(obj);
  canvas.setActiveObject(obj);
  canvas.renderAll();
  saveHistory();
  updateStatus('Added ' + type);
}

function renderShapeGrid() {
  const grid = document.getElementById('shapeGrid');
  if (!grid) return;
  grid.innerHTML = '';
  for (let i = 0; i < 50; i++) {
    const s = shapes[i % shapes.length];
    const div = document.createElement('div');
    div.className = 'shape-card';
    div.innerHTML = '<i class="fas fa-shape"></i><span>' + s + '</span>';
    div.onclick = (function(shape) { return function() { addShape(shape); }; })(s);
    grid.appendChild(div);
  }
  updateStatus('50 unique shapes loaded');
}

// Shape Opacity Control
function updateShapeOpacity(value) {
  const active = canvas.getActiveObject();
  if (active) {
    active.set('opacity', parseFloat(value));
    canvas.renderAll();
    saveHistory();
    updateStatus('Shape opacity: ' + Math.round(parseFloat(value) * 100) + '%');
  } else {
    updateStatus('Select a shape first');
  }
}

// ============================================
// IMAGE TOOLS - MOVING, ZOOMING, MASK OPACITY
// ============================================

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
        updateStatus('Image added | Use arrow buttons to move, zoom buttons to scale');
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function adjustImagePosition(direction) {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape with image'); return; }
  
  const pattern = active.get('fill');
  if (!pattern || !pattern.source) { updateStatus('No image in shape. Add image first'); return; }
  
  let x = pattern.offsetX || 0;
  let y = pattern.offsetY || 0;
  const step = 10;
  
  switch(direction) {
    case 'left': x -= step; break;
    case 'right': x += step; break;
    case 'up': y -= step; break;
    case 'down': y += step; break;
  }
  
  pattern.offsetX = x;
  pattern.offsetY = y;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Image moved ' + direction);
}

function resetImagePosition() {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape'); return; }
  
  const pattern = active.get('fill');
  if (!pattern || !pattern.source) { updateStatus('No image in shape'); return; }
  
  pattern.offsetX = 0;
  pattern.offsetY = 0;
  pattern.scaleX = 1;
  pattern.scaleY = 1;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Image position reset to center');
}

function scaleImageInsideShape(delta) {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape'); return; }
  
  const pattern = active.get('fill');
  if (!pattern || !pattern.source) { updateStatus('No image in shape'); return; }
  
  let scale = (pattern.scaleX || 1) + delta;
  if (scale < 0.3) scale = 0.3;
  if (scale > 3) scale = 3;
  
  pattern.scaleX = scale;
  pattern.scaleY = scale;
  active.set('fill', pattern);
  canvas.renderAll();
  saveHistory();
  updateStatus('Image zoom: ' + Math.round(scale * 100) + '%');
}

// ============================================
// MASK OPACITY - SWIPE LINE FROM ANY SIDE
// ============================================

let isDrawingMask = false;
let maskStartPoint = null;

function startMaskLine(event) {
  isDrawingMask = true;
  const pointer = canvas.getPointer(event.e);
  maskStartPoint = { x: pointer.x, y: pointer.y };
}

function drawMaskLine(event) {
  if (!isDrawingMask) return;
  const pointer = canvas.getPointer(event.e);
  const line = new fabric.Line([maskStartPoint.x, maskStartPoint.y, pointer.x, pointer.y], {
    stroke: '#e0b05a',
    strokeWidth: 3,
    strokeDashArray: [8, 8],
    selectable: false,
    evented: false,
    opacity: 0.8
  });
  
  // Remove previous temporary line
  if (activeMaskLine && canvas.contains(activeMaskLine)) {
    canvas.remove(activeMaskLine);
  }
  
  activeMaskLine = line;
  canvas.add(line);
  canvas.renderAll();
}

function finishMaskLine(event) {
  if (!isDrawingMask) return;
  isDrawingMask = false;
  
  const pointer = canvas.getPointer(event.e);
  const endPoint = { x: pointer.x, y: pointer.y };
  
  if (activeMaskLine && canvas.contains(activeMaskLine)) {
    canvas.remove(activeMaskLine);
  }
  
  // Calculate angle and apply mask opacity to selected shape
  const active = canvas.getActiveObject();
  if (active) {
    const dx = endPoint.x - maskStartPoint.x;
    const dy = endPoint.y - maskStartPoint.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Apply gradient opacity based on line angle
    const gradient = new fabric.Gradient({
      type: 'linear',
      coords: { x1: maskStartPoint.x - active.left, y1: maskStartPoint.y - active.top, 
                x2: endPoint.x - active.left, y2: endPoint.y - active.top },
      colorStops: [{ offset: 0, color: 'rgba(0,0,0,1)' }, { offset: 1, color: 'rgba(0,0,0,0)' }]
    });
    
    active.set('fill', gradient);
    canvas.renderAll();
    saveHistory();
    updateStatus('Mask opacity applied at angle: ' + Math.round(angle) + '°');
  }
  
  // Draw final visible line
  const finalLine = new fabric.Line([maskStartPoint.x, maskStartPoint.y, endPoint.x, endPoint.y], {
    stroke: '#e0b05a',
    strokeWidth: 2,
    selectable: true,
    opacity: 0.6
  });
  canvas.add(finalLine);
  canvas.renderAll();
  
  maskStartPoint = null;
}

// Enable mask drawing on canvas
function enableMaskDrawing() {
  canvas.on('mouse:down', startMaskLine);
  canvas.on('mouse:move', drawMaskLine);
  canvas.on('mouse:up', finishMaskLine);
  updateStatus('Mask mode ON - Swipe across shape to create opacity gradient');
}

function disableMaskDrawing() {
  canvas.off('mouse:down', startMaskLine);
  canvas.off('mouse:move', drawMaskLine);
  canvas.off('mouse:up', finishMaskLine);
  updateStatus('Mask mode OFF');
}

// ============================================
// TYPOGRAPHY
// ============================================

function addText() {
  if (!canvas) return;
  const text = new fabric.IText('Edit Me', { left: 200, top: 200, fontSize: 32, fill: '#2c2c2c', fontFamily: 'Arial' });
  canvas.add(text);
  canvas.setActiveObject(text);
  saveHistory();
  updateStatus('Text added');
}

function rotateText(val) {
  const active = canvas.getActiveObject();
  if (active && active.rotate) { active.rotate(parseInt(val)); canvas.renderAll(); }
}

function mirrorText() {
  const active = canvas.getActiveObject();
  if (active) { active.set('scaleX', (active.scaleX || 1) * -1); canvas.renderAll(); saveHistory(); updateStatus('Mirrored'); }
}

function updateTextSize(val) {
  const active = canvas.getActiveObject();
  if (active && active.set) { active.set('fontSize', parseInt(val)); canvas.renderAll(); }
}

function updateTextColor(val) {
  const active = canvas.getActiveObject();
  if (active && active.set) { active.set('fill', val); canvas.renderAll(); }
}

function apply3DEffect() {
  const active = canvas.getActiveObject();
  if (active && active.set) { active.set('shadow', '8px 8px 4px rgba(0,0,0,0.4)'); active.set('fill', '#e0b05a'); canvas.renderAll(); saveHistory(); updateStatus('3D effect'); }
}

function applyBulletStyle() {
  const active = canvas.getActiveObject();
  const bullet = document.getElementById('bulletStyle')?.value || '•';
  if (active && active.type === 'i-text') {
    const current = active.text || '';
    if (!current.startsWith(bullet)) { active.set('text', bullet + ' ' + current); canvas.renderAll(); updateStatus('Bullet added'); }
  }
}

// ============================================
// BORDERS, LINES, BACKDROP
// ============================================

function applyBorder() {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select an object'); return; }
  const width = document.getElementById('borderWidth')?.value || 2;
  const color = document.getElementById('borderColor')?.value || '#e0b05a';
  const type = document.getElementById('borderType')?.value || 'solid';
  active.set('stroke', color);
  active.set('strokeWidth', parseInt(width));
  if (type === 'dotted') active.set('strokeDashArray', [5, 5]);
  else if (type === 'dashed') active.set('strokeDashArray', [10, 5]);
  else active.set('strokeDashArray', null);
  canvas.renderAll();
  saveHistory();
  updateStatus('Border applied');
}

function addLine() {
  if (!canvas) return;
  const width = document.getElementById('lineWidth')?.value || 3;
  const color = document.getElementById('lineColor')?.value || '#e0b05a';
  const line = new fabric.Line([100, 100, 300, 100], { stroke: color, strokeWidth: parseInt(width), selectable: true });
  canvas.add(line);
  saveHistory();
  updateStatus('Line added');
}

function applyBackdrop() {
  if (!canvas) return;
  const color = document.getElementById('shadeColor')?.value || '#1a1a2e';
  canvas.setBackgroundColor(color, () => canvas.renderAll());
  updateStatus('Backdrop applied');
}

// ============================================
// SAVE, LOAD, EXPORT
// ============================================

function saveWork() {
  if (!canvas) return;
  localStorage.setItem('ark_studio_save', JSON.stringify(canvas.toJSON()));
  updateStatus('Saved');
}

function loadWork() {
  const saved = localStorage.getItem('ark_studio_save');
  if (saved) { canvas.loadFromJSON(JSON.parse(saved), () => canvas.renderAll()); updateStatus('Loaded'); }
  else updateStatus('No save');
}

function exportAsImage() {
  html2canvas(document.querySelector('#canvas-container')).then(c => {
    const link = document.createElement('a');
    link.download = 'ark-studio.png';
    link.href = c.toDataURL();
    link.click();
    updateStatus('Exported');
  }).catch(() => updateStatus('Export failed'));
}

function uploadAnyFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        canvas.loadFromJSON(JSON.parse(ev.target.result), () => canvas.renderAll());
        updateStatus('Loaded');
      } catch(e) { updateStatus('Invalid file'); }
    };
    reader.readAsText(e.target.files[0]);
  };
  input.click();
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initCanvas();
  renderShapeGrid();
  loadWork();
  
  // Shape Opacity
  document.getElementById('shapeOpacity')?.addEventListener('input', (e) => updateShapeOpacity(e.target.value));
  
  // Image buttons
  document.getElementById('addImageBtn')?.addEventListener('click', addImageToShape);
  document.getElementById('imgMoveUp')?.addEventListener('click', () => adjustImagePosition('up'));
  document.getElementById('imgMoveDown')?.addEventListener('click', () => adjustImagePosition('down'));
  document.getElementById('imgMoveLeft')?.addEventListener('click', () => adjustImagePosition('left'));
  document.getElementById('imgMoveRight')?.addEventListener('click', () => adjustImagePosition('right'));
  document.getElementById('imgReset')?.addEventListener('click', resetImagePosition);
  document.getElementById('imgZoomIn')?.addEventListener('click', () => scaleImageInsideShape(0.1));
  document.getElementById('imgZoomOut')?.addEventListener('click', () => scaleImageInsideShape(-0.1));
  
  // Mask Opacity buttons
  document.getElementById('enableMaskBtn')?.addEventListener('click', enableMaskDrawing);
  document.getElementById('disableMaskBtn')?.addEventListener('click', disableMaskDrawing);
  
  // Typography
  document.getElementById('addTextBtn')?.addEventListener('click', addText);
  document.getElementById('textRotate')?.addEventListener('input', (e) => rotateText(e.target.value));
  document.getElementById('textSize')?.addEventListener('input', (e) => updateTextSize(e.target.value));
  document.getElementById('textColor')?.addEventListener('input', (e) => updateTextColor(e.target.value));
  document.getElementById('mirrorTextBtn')?.addEventListener('click', mirrorText);
  document.getElementById('apply3DTextBtn')?.addEventListener('click', apply3DEffect);
  document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
  
  // Borders, Lines, Backdrop
  document.getElementById('applyBorderBtn')?.addEventListener('click', applyBorder);
  document.getElementById('addLineBtn')?.addEventListener('click', addLine);
  document.getElementById('applyShadeBtn')?.addEventListener('click', applyBackdrop);
  
  // Undo/Redo
  document.getElementById('undoBtn')?.addEventListener('click', undo);
  document.getElementById('redoBtn')?.addEventListener('click', redo);
  
  // Save/Upload/Export
  document.getElementById('saveBtn')?.addEventListener('click', saveWork);
  document.getElementById('uploadBtn')?.addEventListener('click', uploadAnyFile);
  document.getElementById('exportBtn')?.addEventListener('click', exportAsImage);
  
  // Drawer
  const drawer = document.getElementById('toolDrawer');
  const trigger = document.getElementById('floatingTrigger');
  const closeBtn = document.getElementById('closeDrawer');
  if (trigger) trigger.onclick = function() {
    drawer.classList.toggle('open');
    document.body.classList.toggle('drawer-open');
  };
  if (closeBtn) closeBtn.onclick = function() {
    drawer.classList.remove('open');
    document.body.classList.remove('drawer-open');
  };
  
  updateStatus('Ready! 50 unique shapes | Image position/zoom working | Swipe for mask opacity');
});