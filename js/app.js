document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM ready');
  
  try {
    initCanvas();
    renderShapeGrid();
    
    // Simple buttons
    const btn = document.getElementById('addImageBtn');
    if (btn) btn.onclick = function() { alert('Select a shape first, then click Add Image'); addImageToShape(); };
    
    const undoBtn = document.getElementById('undoBtn');
    if (undoBtn) undoBtn.onclick = function() { undo(); };
    
    const redoBtn = document.getElementById('redoBtn');
    if (redoBtn) redoBtn.onclick = function() { redo(); };
    
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) saveBtn.onclick = function() { saveWork(); };
    
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.onclick = function() { exportAsImage(); };
    
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) uploadBtn.onclick = function() { uploadAnyFile(); };
    
    const addTextBtn = document.getElementById('addTextBtn');
    if (addTextBtn) addTextBtn.onclick = function() { addText(); };
    
    const mirrorBtn = document.getElementById('mirrorTextBtn');
    if (mirrorBtn) mirrorBtn.onclick = function() { mirrorText(); };
    
    const rotateSlider = document.getElementById('textRotate');
    if (rotateSlider) rotateSlider.oninput = function(e) { rotateText(e.target.value); };
    
    const sizeSlider = document.getElementById('textSize');
    if (sizeSlider) sizeSlider.oninput = function(e) { updateTextSize(e.target.value); };
    
    const colorPicker = document.getElementById('textColor');
    if (colorPicker) colorPicker.oninput = function(e) { updateTextColor(e.target.value); };
    
    const applyBorderBtn = document.getElementById('applyBorderBtn');
    if (applyBorderBtn) applyBorderBtn.onclick = function() { applyBorder(); };
    
    const addLineBtn = document.getElementById('addLineBtn');
    if (addLineBtn) addLineBtn.onclick = function() { addLine(); };
    
    const applyShadeBtn = document.getElementById('applyShadeBtn');
    if (applyShadeBtn) applyShadeBtn.onclick = function() { applyBackdrop(); };
    
    const maskBtn = document.getElementById('maskLineBtn');
    if (maskBtn) maskBtn.onclick = function() { addMaskLine(); };
    
    // Image position buttons
    const upBtn = document.getElementById('imgMoveUp');
    if (upBtn) upBtn.onclick = function() { adjustImagePosition('up'); };
    const downBtn = document.getElementById('imgMoveDown');
    if (downBtn) downBtn.onclick = function() { adjustImagePosition('down'); };
    const leftBtn = document.getElementById('imgMoveLeft');
    if (leftBtn) leftBtn.onclick = function() { adjustImagePosition('left'); };
    const rightBtn = document.getElementById('imgMoveRight');
    if (rightBtn) rightBtn.onclick = function() { adjustImagePosition('right'); };
    const resetBtn = document.getElementById('imgReset');
    if (resetBtn) resetBtn.onclick = function() { resetImagePosition(); };
    const zoomInBtn = document.getElementById('imgZoomIn');
    if (zoomInBtn) zoomInBtn.onclick = function() { scaleImageInsideShape(0.1); };
    const zoomOutBtn = document.getElementById('imgZoomOut');
    if (zoomOutBtn) zoomOutBtn.onclick = function() { scaleImageInsideShape(-0.1); };
    
    // Drawer
    const drawer = document.getElementById('toolDrawer');
    const trigger = document.getElementById('floatingTrigger');
    const closeBtn = document.getElementById('closeDrawer');
    if (trigger) trigger.onclick = function() {
      drawer.classList.toggle('open');
      document.body.classList.toggle('drawer-open');
      setTimeout(function() { if (canvas) canvas.renderAll(); }, 300);
    };
    if (closeBtn) closeBtn.onclick = function() {
      drawer.classList.remove('open');
      document.body.classList.remove('drawer-open');
    };
    
    updateStatus('Ready! Tap magic wand');
    console.log('App initialized');
  } catch(e) {
    console.error('Init error:', e);
    updateStatus('Error: ' + e.message);
  }
});