// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  renderShapeGrid();
  
  // Load saved work
  loadWork();
  saveHistory();
  
  // UI Drawer
  const drawer = document.getElementById('toolDrawer');
  document.getElementById('floatingTrigger')?.addEventListener('click', () => {
    drawer.classList.toggle('open');
  });
  document.getElementById('closeDrawer')?.addEventListener('click', () => {
    drawer.classList.remove('open');
  });
  
  // Step 1: Shapes are handled by canvas-manager.js
  
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
});