document.addEventListener('DOMContentLoaded', () => {
  // Wait for all scripts to load first
  setTimeout(() => {
    if (typeof initCanvas === 'function') initCanvas();
    if (typeof renderShapeGrid === 'function') renderShapeGrid();
    if (typeof loadWork === 'function') loadWork();
    if (typeof saveHistory === 'function') saveHistory();
    
    // Bind buttons
    const btns = {
      addImageBtn: addImageToShape,
      maskLineBtn: addMaskLine,
      addTextBtn: addText,
      mirrorTextBtn: mirrorText,
      apply3DTextBtn: apply3DEffect,
      applyShadeBtn: applyBackdrop,
      applyBorderBtn: applyBorder,
      addLineBtn: addLine,
      undoBtn: undo,
      redoBtn: redo,
      saveBtn: saveWork,
      uploadBtn: uploadAnyFile,
      exportBtn: exportAsImage
    };
    
    for (const [id, fn] of Object.entries(btns)) {
      document.getElementById(id)?.addEventListener('click', fn);
    }
    
    document.getElementById('textRotate')?.addEventListener('input', (e) => rotateText(e.target.value));
    document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
    document.getElementById('uploadFontBtn')?.addEventListener('click', uploadCustomFont);
    document.getElementById('opacityDirection')?.addEventListener('change', applyOpacityGradient);
    document.getElementById('opacityStrength')?.addEventListener('input', applyOpacityGradient);
    
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
    
    updateStatus('Ready');
  }, 100);
});