function addText() {
  if (!canvas) return;
  const text = new fabric.IText('Edit Me', { 
    left: 200, top: 200, fontSize: 32, fill: '#2c2c2c', fontFamily: 'Arial',
    selectable: true, hasControls: true, hasRotatingPoint: true
  });
  canvas.add(text);
  canvas.setActiveObject(text);
  saveHistory();
  updateStatus('Text added');
}

function rotateText(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.rotate(parseInt(value));
    canvas.renderAll();
  }
}

function mirrorText() {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('scaleX', active.scaleX * -1);
    canvas.renderAll();
    saveHistory();
    updateStatus('Text mirrored');
  }
}

function apply3DEffect() {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('shadow', '8px 8px 4px rgba(0,0,0,0.4)');
    active.set('fill', '#e0b05a');
    canvas.renderAll();
    saveHistory();
    updateStatus('3D effect applied');
  }
}

function applyBulletStyle() {
  const active = canvas.getActiveObject();
  const bullet = document.getElementById('bulletStyle')?.value || '•';
  if (active && active.type === 'i-text') {
    const currentText = active.text || '';
    if (!currentText.startsWith(bullet)) {
      active.set('text', bullet + ' ' + currentText);
      canvas.renderAll();
      updateStatus(`Bullet style: ${bullet}`);
    }
  }
}

function applyBetweenDots() {
  const active = canvas.getActiveObject();
  const pattern = document.getElementById('betweenDots')?.value;
  if (active && active.type === 'i-text' && pattern) {
    active.set('text', pattern);
    canvas.renderAll();
    updateStatus('Pattern applied');
  }
}

function updateTextSize(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('fontSize', parseInt(value));
    canvas.renderAll();
  }
}

function updateLineSpacing(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('lineHeight', 1 + (parseInt(value) / 50));
    canvas.renderAll();
  }
}

function updateCharSpacing(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('charSpacing', parseInt(value));
    canvas.renderAll();
  }
}

function updateTextColor(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('fill', value);
    canvas.renderAll();
  }
}

function updateTextOpacity(value) {
  const active = canvas.getActiveObject();
  if (active && active.type === 'i-text') {
    active.set('opacity', parseFloat(value));
    canvas.renderAll();
  }
}

function uploadCustomFont() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.ttf,.otf,.woff';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const fontName = file.name.replace(/\.[^/.]+$/, '');
      const fontFace = new FontFace(fontName, ev.target.result);
      fontFace.load().then((font) => {
        document.fonts.add(font);
        const active = canvas.getActiveObject();
        if (active && active.type === 'i-text') {
          active.set('fontFamily', fontName);
          canvas.renderAll();
        }
        updateStatus(`Font "${fontName}" loaded`);
      }).catch(() => updateStatus('Font load failed'));
    };
    reader.readAsArrayBuffer(file);
  };
  input.click();
}