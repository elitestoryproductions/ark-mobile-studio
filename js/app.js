document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  renderShapeGrid();
  loadWork();
  saveHistory();
  initDrawer();
  
  // Event listeners
  document.getElementById('addImageBtn')?.addEventListener('click', addImageToShape);
  document.getElementById('opacityDirection')?.addEventListener('change', applyOpacityGradient);
  document.getElementById('opacityStrength')?.addEventListener('input', applyOpacityGradient);
  document.getElementById('maskLineBtn')?.addEventListener('click', addMaskLine);
  document.getElementById('addTextBtn')?.addEventListener('click', addText);
  document.getElementById('textRotate')?.addEventListener('input', (e) => rotateText(e.target.value));
  document.getElementById('mirrorTextBtn')?.addEventListener('click', mirrorText);
  document.getElementById('apply3DTextBtn')?.addEventListener('click', apply3DEffect);
  document.getElementById('bulletStyle')?.addEventListener('change', applyBulletStyle);
  document.getElementById('uploadFontBtn')?.addEventListener('click', uploadCustomFont);
  document.getElementById('applyShadeBtn')?.addEventListener('click', applyBackdrop);
  document.getElementById('applyBorderBtn')?.addEventListener('click', applyBorder);
  document.getElementById('addLineBtn')?.addEventListener('click', addLine);
  document.getElementById('undoBtn')?.addEventListener('click', undo);
  document.getElementById('redoBtn')?.addEventListener('click', redo);
  document.getElementById('saveBtn')?.addEventListener('click', saveWork);
  document.getElementById('uploadBtn')?.addEventListener('click', uploadAnyFile);
  document.getElementById('exportBtn')?.addEventListener('click', exportAsImage);
});

function initDrawer() {
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
}