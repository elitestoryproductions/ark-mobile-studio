document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof initCanvas === 'function') initCanvas();
    if (typeof renderShapeGrid === 'function') renderShapeGrid();
    if (typeof loadWork === 'function') loadWork();
    if (typeof saveHistory === 'function') saveHistory();
    
    // Image controls
    document.getElementById('addImageBtn')?.addEventListener('click', addImageToShape);
    document.getElementById('opacityDirection')?.addEventListener('change', applyOpacityGradient);
    document.getElementById('opacityStrength')?.addEventListener('input', applyOpacityGradient);
    document.getElementById('maskLineBtn')?.addEventListener('click', addMaskLine);
    
    // Image position controls (4-way nudge)
    document.getElementById('imgMoveUp')?.addEventListener('click', () => adjustImagePosition('up'));
    document.getElementById('imgMoveDown')?.addEventListener('click', () => adjustImagePosition('down'));
    document.getElementById('imgMoveLeft')?.addEventListener('click', () => adjustImagePosition('left'));
    document.getElementById('imgMoveRight')?.addEventListener('click', () => adjustImagePosition('right'));
    document.getElementById('imgReset')?.addEventListener('click', resetImagePosition);
    document.getElementById('imgZoomIn')?.addEventListener('click', () => scaleImageInsideShape(0.1));
    document.getElementById('imgZoomOut')?.addEventListener('click', () => scaleImageInsideShape(-0.1));
    
    // Typography controls
    document.getElementById('addTextBtn')?.addEventListener('click', addText);
    document.getElementById('textRotate')?.addEventListener('input', (e) => rotateText(e.target.value));
    document.getElementById('mirrorTextBtn')?.addEventListener('click', mirrorText);
    document.getElementById('apply3DTextBtn')?.addEventListener('click', apply3DEffect);
    document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
    document.getElementById('uploadFontBtn')?.addEventListener('click', uploadCustomFont);
    
    // Backdrop controls
    document.getElementById('applyShadeBtn')?.addEventListener('click', applyBackdrop);
    
    // Border controls
    document.getElementById('applyBorderBtn')?.addEventListener('click', applyBorder);
    
    // Line controls
    document.getElementById('addLineBtn')?.addEventListener('click', addLine);
    
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
    
    trigger?.addEventListener('click', () => {
      drawer.classList.toggle('open');
      document.body.classList.toggle('drawer-open');
      setTimeout(() => canvas?.renderAll(), 300);
    });
    
    closeBtn?.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.classList.remove('drawer-open');
    });
    
    updateStatus('Ready | Select shape, add image, use arrow buttons to position');
  }, 100);
});