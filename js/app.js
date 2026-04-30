document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof initCanvas === 'function') initCanvas();
    if (typeof renderShapeGrid === 'function') renderShapeGrid();
    if (typeof loadWork === 'function') loadWork();
    if (typeof saveHistory === 'function') saveHistory();
    
    // Shape grid is already rendered
    
    // Image controls
    document.getElementById('addImageBtn')?.addEventListener('click', addImageToShape);
    document.getElementById('addCollageBtn')?.addEventListener('click', addCollage);
    document.getElementById('opacityDirection')?.addEventListener('change', applyOpacityGradient);
    document.getElementById('opacityStrength')?.addEventListener('input', applyOpacityGradient);
    document.getElementById('maskLineBtn')?.addEventListener('click', addMaskLine);
    
    // Image position
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
    document.getElementById('textSize')?.addEventListener('input', (e) => updateTextSize(e.target.value));
    document.getElementById('lineSpacing')?.addEventListener('input', (e) => updateLineSpacing(e.target.value));
    document.getElementById('charSpacing')?.addEventListener('input', (e) => updateCharSpacing(e.target.value));
    document.getElementById('textColor')?.addEventListener('input', (e) => updateTextColor(e.target.value));
    document.getElementById('textOpacity')?.addEventListener('input', (e) => updateTextOpacity(e.target.value));
    document.getElementById('mirrorTextBtn')?.addEventListener('click', mirrorText);
    document.getElementById('apply3DTextBtn')?.addEventListener('click', apply3DEffect);
    document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
    document.getElementById('betweenDots')?.addEventListener('change', applyBetweenDots);
    document.getElementById('applyBetweenDots')?.addEventListener('click', applyBetweenDots);
    document.getElementById('uploadFontBtn')?.addEventListener('click', uploadCustomFont);
    
    // Backdrop controls
    document.getElementById('applyShadeBtn')?.addEventListener('click', applyBackdrop);
    document.querySelectorAll('#shadePresets .color-swatch').forEach((swatch, i) => {
      const colors = ['#1a1a2e', '#2e1a1a', '#1a2e1a', '#2e2e1a', '#1a2e2e', '#2e1a2e'];
      swatch.addEventListener('click', () => loadShadePreset(colors[i]));
    });
    document.getElementById('shadeEffect')?.addEventListener('change', applyBackdrop);
    document.getElementById('shadeOpacity')?.addEventListener('input', applyBackdrop);
    
    // Border controls
    document.getElementById('applyBorderBtn')?.addEventListener('click', applyBorder);
    document.getElementById('borderType')?.addEventListener('change', applyBorder);
    document.getElementById('borderGradient')?.addEventListener('change', applyBorder);
    document.getElementById('borderOpacity')?.addEventListener('input', (e) => updateBorderOpacity(e.target.value));
    
    // Line controls
    document.getElementById('addLineBtn')?.addEventListener('click', addLine);
    document.getElementById('lineType')?.addEventListener('change', addLine);
    document.getElementById('lineGradient')?.addEventListener('change', addLine);
    document.getElementById('lineOpacity')?.addEventListener('input', (e) => updateLineOpacity(e.target.value));
    
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
    
    updateStatus('Ready | All tools available');
  }, 100);
});