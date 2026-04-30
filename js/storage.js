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
      updateStatus('Work loaded');
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
  });
}