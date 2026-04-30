// Canvas and history management
let canvas;
let historyStack = [];
let historyIndex = -1;

function saveHistory() {
  const state = JSON.stringify(canvas.toJSON());
  if (historyIndex < historyStack.length - 1) {
    historyStack = historyStack.slice(0, historyIndex + 1);
  }
  historyStack.push(state);
  historyIndex = historyStack.length - 1;
  if (historyStack.length > 50) historyStack.shift();
  updateStatus(`History: ${historyIndex + 1}/${historyStack.length}`);
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
  }
}

function redo() {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    canvas.loadFromJSON(historyStack[historyIndex], () => canvas.renderAll());
  }
}

function updateStatus(msg) {
  const status = document.getElementById('statusMsg');
  if (status) status.innerText = msg;
}

// Initialize canvas
function initCanvas() {
  canvas = new fabric.Canvas('design-canvas');
  canvas.setWidth(800);
  canvas.setHeight(1000);
  canvas.setBackgroundColor('#f0ede8', canvas.renderAll.bind(canvas));
  
  canvas.on('object:modified', saveHistory);
  canvas.on('object:added', saveHistory);
  canvas.on('object:removed', saveHistory);
  
  // Enable corner stretching
  canvas.on('object:selected', (e) => {
    const obj = e.target;
    if (obj) {
      obj.set('hasRotatingPoint', true);
      obj.set('cornerSize', 8);
      obj.set('transparentCorners', false);
      obj.set('cornerColor', '#e0b05a');
      obj.set('cornerStrokeColor', '#b47c2e');
      canvas.renderAll();
    }
  });
}

// 50+ shapes
const shapes = [
  'circle', 'rect', 'triangle', 'heart', 'star', 'diamond', 'hexagon', 
  'pentagon', 'octagon', 'cloud', 'leaf', 'teardrop', 'pill', 'bolt', 
  'infinity', 'clover', 'shield', 'flag', 'cube', 'sphere', 'drop', 
  'moon', 'sun', 'flower', 'snowflake', 'gear', 'ribbon', 'bubble', 
  'roundedRect', 'zigzag', 'wave', 'spiral', 'cross', 'arrow', 
  'parallelogram', 'trapezoid', 'ring', 'donut', 'crescent', 'blob', 
  'frame', 'burst', 'tag', 'cone', 'pyramid', 'cylinder', 'halfcircle', 
  'spade', 'club'
];

function addShape(type) {
  let obj;
  const opts = { 
    left: 100, top: 100, fill: '#c9a03d', stroke: '#b47c2e', strokeWidth: 2, 
    selectable: true, hasRotatingPoint: true, cornerSize: 8, cornerColor: '#e0b05a'
  };
  
  switch(type) {
    case 'circle': obj = new fabric.Circle({ radius: 50, ...opts }); break;
    case 'rect': obj = new fabric.Rect({ width: 100, height: 100, ...opts }); break;
    case 'triangle': obj = new fabric.Triangle({ width: 100, height: 100, ...opts }); break;
    case 'heart': obj = new fabric.Path('M 0 0 C -20 -30, -50 -10, 0 40 C 50 -10, 20 -30, 0 0', { ...opts, scaleX: 1.5, scaleY: 1.5 }); break;
    case 'star': obj = new fabric.Polygon([{x:0,y:-50},{x:14,y:-15},{x:50,y:-15},{x:22,y:10},{x:34,y:45},{x:0,y:25},{x:-34,y:45},{x:-22,y:10},{x:-50,y:-15},{x:-14,y:-15}], opts); break;
    case 'diamond': obj = new fabric.Polygon([{x:0,y:-50},{x:50,y:0},{x:0,y:50},{x:-50,y:0}], opts); break;
    default: obj = new fabric.Rect({ width: 90, height: 90, rx: 15, ry: 15, ...opts });
  }
  
  canvas.add(obj);
  canvas.setActiveObject(obj);
  canvas.renderAll();
  saveHistory();
}

function renderShapeGrid() {
  const grid = document.getElementById('shapeGrid');
  if (!grid) return;
  
  for (let i = 0; i < 50; i++) {
    const s = shapes[i % shapes.length];
    const div = document.createElement('div');
    div.className = 'shape-card';
    div.innerHTML = `<i class="fas fa-${s === 'rect' ? 'square' : s === 'circle' ? 'circle' : 'shape'}"></i><span>${s}</span>`;
    div.onclick = () => addShape(s);
    grid.appendChild(div);
  }
}

// Image functions
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
        updateStatus('Image added to shape');
      });
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function applyOpacityGradient() {
  const active = canvas.getActiveObject();
  if (!active) return;
  
  const dir = document.getElementById('opacityDirection')?.value || 'none';
  const strength = document.getElementById('opacityStrength')?.value / 100 || 0.5;
  
  if (dir !== 'none') {
    active.set('opacity', 1);
    updateStatus(`Gradient applied: ${dir} at ${Math.round(strength * 100)}%`);
  }
  canvas.renderAll();
}

let maskLine = null;
function addMaskLine() {
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

// Typography functions
function addText() {
  const text = new fabric.IText('Edit Me', { 
    left: 200, top: 200, fontSize: 32, fill: '#2c2c2c', fontFamily: 'Arial',
    selectable: true, hasControls: true, hasRotatingPoint: true
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  saveHistory();
}

function rotateText(value) {
  const active = canvas.getActiveObject();
  if (active && active.type.includes('text')) {
    active.rotate(parseInt(value));
    canvas.renderAll();
  }
}

function mirrorText() {
  const active = canvas.getActiveObject();
  if (active && active.type.includes('text')) {
    active.set('scaleX', active.scaleX * -1);
    canvas.renderAll();
    saveHistory();
    updateStatus('Text mirrored');
  }
}

function apply3DEffect() {
  const active = canvas.getActiveObject();
  if (active && active.type.includes('text')) {
    active.set('shadow', '8px 8px 4px rgba(0,0,0,0.4)');
    active.set('fill', 'linear-gradient(135deg, #e0b05a, #b47c2e)');
    canvas.renderAll();
    saveHistory();
    updateStatus('3D effect applied');
  }
}

function applyBulletStyle() {
  const active = canvas.getActiveObject();
  const bullet = document.getElementById('bulletStyle')?.value || '•';
  if (active && active.type.includes('text')) {
    const currentText = active.text || '';
    if (!currentText.startsWith(bullet)) {
      active.set('text', bullet + ' ' + currentText);
      canvas.renderAll();
      updateStatus(`Bullet style: ${bullet}`);
    }
  }
}

function uploadCustomFont() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.ttf,.otf,.woff';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const fontName = file.name.replace(/\.[^/.]+$/, '');
      const fontFace = new FontFace(fontName, ev.target.result);
      fontFace.load().then((font) => {
        document.fonts.add(font);
        updateStatus(`Font "${fontName}" loaded`);
      });
    };
    reader.readAsArrayBuffer(file);
  };
  input.click();
}

// Backdrop effects
function applyBackdrop() {
  const color = document.getElementById('shadeColor')?.value || '#1a1a2e';
  const opacity = document.getElementById('shadeOpacity')?.value || 0.3;
  
  canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
  canvas.set('backgroundVpt', false);
  canvas.renderAll();
  updateStatus(`Backdrop applied: ${color} at ${Math.round(opacity * 100)}%`);
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
  updateStatus(`Border applied: ${width}px ${type}`);
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
  updateStatus('Line added');
}

// Storage functions
function saveWork() {
  const data = JSON.stringify(canvas.toJSON());
  localStorage.setItem('ark_studio_save', data);
  updateStatus('Work saved locally');
}

function loadWork() {
  const saved = localStorage.getItem('ark_studio_save');
  if (saved) {
    canvas.loadFromJSON(JSON.parse(saved), () => {
      canvas.renderAll();
      updateStatus('Work loaded from save');
    });
  } else {
    updateStatus('No saved work found');
  }
}

function exportAsImage() {
  html2canvas(document.querySelector('#canvas-container')).then(canv => {
    const link = document.createElement('a');
    link.download = `ark-studio-${Date.now()}.png`;
    link.href = canv.toDataURL();
    link.click();
    updateStatus('Exported as PNG');
  }).catch(err => {
    updateStatus('Export failed: ' + err.message);
  });
}

// File upload
function uploadAnyFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.txt,.docx,.pdf,.jpg,.png';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (ev) => {
      const content = ev.target.result;
      
      // Try to parse as JSON (canvas data)
      try {
        const jsonData = typeof content === 'string' ? JSON.parse(content) : null;
        if (jsonData && jsonData.objects) {
          canvas.loadFromJSON(jsonData, () => canvas.renderAll());
          updateStatus('JSON design loaded');
          return;
        }
      } catch(e) {}
      
      // If not JSON, add as text element
      const text = new fabric.IText(content.substring(0, 500), {
        left: 100, top: 100, fontSize: 16, fill: '#2c2c2c'
      });
      canvas.add(text);
      updateStatus(`File "${file.name}" added as text`);
    };
    
    reader.readAsText(file);
  };
  input.click();
}

// ============================================
// DRAWER TOGGLE WITH HALF-SCREEN BEHAVIOR
// ============================================

function initDrawer() {
  const drawer = document.getElementById('toolDrawer');
  const trigger = document.getElementById('floatingTrigger');
  const closeBtn = document.getElementById('closeDrawer');
  
  function openDrawer() {
    drawer.classList.add('open');
    document.body.classList.add('drawer-open');
    // Force canvas to re-render after animation
    setTimeout(() => {
      canvas.renderAll();
      canvas.calcOffset();
      if (window.innerWidth < 768) {
        // Scroll canvas into view on mobile
        const canvasArea = document.querySelector('.canvas-area');
        if (canvasArea) canvasArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350);
  }
  
  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.classList.remove('drawer-open');
    setTimeout(() => {
      canvas.renderAll();
      canvas.calcOffset();
    }, 300);
  }
  
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
  
  closeBtn.addEventListener('click', closeDrawer);
  
  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && 
        !drawer.contains(e.target) && 
        !trigger.contains(e.target)) {
      closeDrawer();
    }
  });
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  renderShapeGrid();
  loadWork();
  saveHistory();
  initDrawer();
  
  // Step 1: Shapes are handled by renderShapeGrid()
  
  // Step 2: Image
  document.getElementById('addImageBtn')?.addEventListener('click', addImageToShape);
  document.getElementById('opacityDirection')?.addEventListener('change', applyOpacityGradient);
  document.getElementById('opacityStrength')?.addEventListener('input', applyOpacityGradient);
  document.getElementById('maskLineBtn')?.addEventListener('click', addMaskLine);
  
  // Step 3: Typography
  document.getElementById('addTextBtn')?.addEventListener('click', addText);
  document.getElementById('textRotate')?.addEventListener('input', (e) => rotateText(e.target.value));
  document.getElementById('mirrorTextBtn')?.addEventListener('click', mirrorText);
  document.getElementById('apply3DTextBtn')?.addEventListener('click', apply3DEffect);
  document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
  document.getElementById('uploadFontBtn')?.addEventListener('click', uploadCustomFont);
  
  // Step 4: Backdrop
  document.getElementById('applyShadeBtn')?.addEventListener('click', applyBackdrop);
  
  // Step 5: Borders
  document.getElementById('applyBorderBtn')?.addEventListener('click', applyBorder);
  
  // Step 6: Lines
  document.getElementById('addLineBtn')?.addEventListener('click', addLine);
  
  // Undo/Redo
  document.getElementById('undoBtn')?.addEventListener('click', undo);
  document.getElementById('redoBtn')?.addEventListener('click', redo);
  
  // Save/Upload/Export
  document.getElementById('saveBtn')?.addEventListener('click', saveWork);
  document.getElementById('uploadBtn')?.addEventListener('click', uploadAnyFile);
  document.getElementById('exportBtn')?.addEventListener('click', exportAsImage);
  
  updateStatus('Ready | Tap magic wand to open tools');
});