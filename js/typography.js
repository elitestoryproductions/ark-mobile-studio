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
  }
}

function apply3DEffect() {
  const active = canvas.getActiveObject();
  if (active && active.type.includes('text')) {
    active.set('shadow', '8px 8px 4px rgba(0,0,0,0.4)');
    active.set('fill', 'linear-gradient(135deg, #e0b05a, #b47c2e)');
    canvas.renderAll();
    saveHistory();
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