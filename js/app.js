// ============================================
// COMPLETE APP.JS - ALL FUNCTIONS
// ============================================

let canvas;
let historyStack = [];
let historyIndex = -1;

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
    updateStatus('Ready | ' + (historyIndex + 1) + '/' + historyStack.length);
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

function initCanvas() {
  canvas = new fabric.Canvas('design-canvas');
  canvas.setWidth(800);
  canvas.setHeight(1000);
  canvas.setBackgroundColor('#f0ede8', () => canvas.renderAll());
  canvas.on('object:modified', () => saveHistory());
  canvas.on('object:added', () => saveHistory());
  canvas.on('object:removed', () => saveHistory());
  saveHistory();
  updateStatus('Canvas ready');
}

const shapes = ['circle', 'rect', 'triangle', 'heart', 'star', 'diamond', 'hexagon', 'pentagon', 'octagon', 'cloud', 'leaf', 'teardrop', 'pill', 'bolt', 'infinity', 'clover', 'shield', 'flag', 'cube', 'sphere', 'drop', 'moon', 'sun', 'flower', 'snowflake', 'gear', 'ribbon', 'bubble', 'roundedRect', 'zigzag', 'wave', 'spiral', 'cross', 'arrow', 'parallelogram', 'trapezoid', 'ring', 'donut', 'crescent', 'blob', 'frame', 'burst', 'tag', 'cone', 'pyramid', 'cylinder', 'halfcircle', 'spade', 'club'];

function addShape(type) {
  if (!canvas) return;
  let obj;
  const opts = { left: 100, top: 100, fill: '#c9a03d', stroke: '#b47c2e', strokeWidth: 2, selectable: true };
  if (type === 'circle') obj = new fabric.Circle({ radius: 50, ...opts });
  else if (type === 'rect') obj = new fabric.Rect({ width: 100, height: 100, ...opts });
  else if (type === 'triangle') obj = new fabric.Triangle({ width: 100, height: 100, ...opts });
  else if (type === 'heart') obj = new fabric.Path('M 0 0 C -20 -30, -50 -10, 0 40 C 50 -10, 20 -30, 0 0', { ...opts, scaleX: 1.5, scaleY: 1.5 });
  else if (type === 'star') obj = new fabric.Polygon([{x:0,y:-50},{x:14,y:-15},{x:50,y:-15},{x:22,y:10},{x:34,y:45},{x:0,y:25},{x:-34,y:45},{x:-22,y:10},{x:-50,y:-15},{x:-14,y:-15}], opts);
  else if (type === 'diamond') obj = new fabric.Polygon([{x:0,y:-50},{x:50,y:0},{x:0,y:50},{x:-50,y:0}], opts);
  else obj = new fabric.Rect({ width: 90, height: 90, rx: 15, ry: 15, ...opts });
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
}

function addImageToShape() {
  const active = canvas.getActiveObject();
  if (!active) { updateStatus('Select a shape first'); return; }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      fabric.Image.fromURL(ev.target.result, (img) => {
        const pattern = new fabric.Pattern({ source: img.getElement(), repeat: 'no-repeat', offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 });
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
  let x = pattern.offsetX || 0;
  let y = pattern.offsetY || 0;
  if (direction === 'left') x -= 5;
  if (direction === 'right') x += 5;
  if (direction === 'up') y -= 5;
  if (direction === 'down') y += 5;
  pattern.offsetX = x;
  pattern.offsetY = y;
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
  updateStatus('Zoom');
}

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

function addMaskLine() {
  if (!canvas) return;
  const line = new fabric.Line([50, 100, 200, 100], { stroke: '#e0b05a', strokeWidth: 3, selectable: true });
  canvas.add(line);
  saveHistory();
  updateStatus('Mask line added');
}

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
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  initCanvas();
  renderShapeGrid();
  loadWork();
  
  document.getElementById('addImageBtn')?.addEventListener('click', addImageToShape);
  document.getElementById('maskLineBtn')?.addEventListener('click', addMaskLine);
  document.getElementById('addTextBtn')?.addEventListener('click', addText);
  document.getElementById('mirrorTextBtn')?.addEventListener('click', mirrorText);
  document.getElementById('apply3DTextBtn')?.addEventListener('click', apply3DEffect);
  document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
  document.getElementById('applyBorderBtn')?.addEventListener('click', applyBorder);
  document.getElementById('addLineBtn')?.addEventListener('click', addLine);
  document.getElementById('applyShadeBtn')?.addEventListener('click', applyBackdrop);
  document.getElementById('undoBtn')?.addEventListener('click', undo);
  document.getElementById('redoBtn')?.addEventListener('click', redo);
  document.getElementById('saveBtn')?.addEventListener('click', saveWork);
  document.getElementById('uploadBtn')?.addEventListener('click', uploadAnyFile);
  document.getElementById('exportBtn')?.addEventListener('click', exportAsImage);
  
  document.getElementById('textRotate')?.addEventListener('input', (e) => rotateText(e.target.value));
  document.getElementById('textSize')?.addEventListener('input', (e) => updateTextSize(e.target.value));
  document.getElementById('textColor')?.addEventListener('input', (e) => updateTextColor(e.target.value));
  
  document.getElementById('imgMoveUp')?.addEventListener('click', () => adjustImagePosition('up'));
  document.getElementById('imgMoveDown')?.addEventListener('click', () => adjustImagePosition('down'));
  document.getElementById('imgMoveLeft')?.addEventListener('click', () => adjustImagePosition('left'));
  document.getElementById('imgMoveRight')?.addEventListener('click', () => adjustImagePosition('right'));
  document.getElementById('imgReset')?.addEventListener('click', resetImagePosition);
  document.getElementById('imgZoomIn')?.addEventListener('click', () => scaleImageInsideShape(0.1));
  document.getElementById('imgZoomOut')?.addEventListener('click', () => scaleImageInsideShape(-0.1));
  
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
  
  updateStatus('Ready! Click shapes to draw');
});