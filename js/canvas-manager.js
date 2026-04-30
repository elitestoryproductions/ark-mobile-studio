let canvas;
let historyStack = [];
let historyIndex = -1;

function saveHistory() {
  if (!canvas) return;
  try {
    const state = JSON.stringify(canvas.toJSON());
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(state);
    historyIndex = historyStack.length - 1;
    if (historyStack.length > 50) historyStack.shift();
    const status = document.getElementById('statusMsg');
    if (status) status.innerText = 'Ready | ' + (historyIndex + 1) + '/' + historyStack.length;
  } catch(e) { console.log('Save error', e); }
}

function undo() {
  if (!canvas) return;
  if (historyIndex > 0) {
    historyIndex--;
    canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
    updateStatus('Undo done');
  } else { updateStatus('Nothing to undo'); }
}

function redo() {
  if (!canvas) return;
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
    updateStatus('Redo done');
  } else { updateStatus('Nothing to redo'); }
}

function updateStatus(msg) {
  const el = document.getElementById('statusMsg');
  if (el) el.innerText = msg;
  console.log(msg);
}

function initCanvas() {
  console.log('initCanvas called');
  canvas = new fabric.Canvas('design-canvas');
  canvas.setWidth(800);
  canvas.setHeight(1000);
  canvas.setBackgroundColor('#f0ede8', () => canvas.renderAll());
  canvas.on('object:modified', () => saveHistory());
  canvas.on('object:added', () => saveHistory());
  canvas.on('object:removed', () => saveHistory());
  console.log('Canvas ready');
  saveHistory();
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
  console.log('Shape grid rendered');
}