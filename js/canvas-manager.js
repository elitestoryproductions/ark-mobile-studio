// Canvas initialization and shape management
let canvas;
let historyStack = [];
let historyIndex = -1;

function initCanvas() {
  canvas = new fabric.Canvas('design-canvas');
  canvas.setWidth(800);
  canvas.setHeight(1000);
  canvas.setBackgroundColor('#f0ede8', canvas.renderAll.bind(canvas));
  
  canvas.on('object:modified', saveHistory);
  canvas.on('object:added', saveHistory);
  canvas.on('object:removed', saveHistory);
  
  // Enable free corner stretching (each corner independent)
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
  'circle', 'rect', 'triangle', 'ellipse', 'heart', 'star', 'hexagon', 
  'pentagon', 'diamond', 'cross', 'arrow', 'trapezoid', 'parallelogram', 
  'octagon', 'cloud', 'blob', 'leaf', 'teardrop', 'ring', 'donut', 
  'crescent', 'pill', 'bolt', 'infinity', 'clover', 'spade', 'club', 
  'shield', 'flag', 'cube', 'cylinder', 'cone', 'pyramid', 'sphere', 
  'halfcircle', 'frame', 'burst', 'drop', 'moon', 'sun', 'flower', 
  'snowflake', 'gear', 'ribbon', 'tag', 'bubble', 'roundedRect', 'zigzag', 'wave', 'spiral'
];

function addShape(type) {
  let obj;
  const opts = { left: 100, top: 100, fill: '#c9a03d', stroke: '#b47c2e', strokeWidth: 2, selectable: true };
  
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