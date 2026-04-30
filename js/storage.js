function uploadAnyFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.txt';
  input.onchange = function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const json = JSON.parse(ev.target.result);
        if (json.objects) {
          canvas.loadFromJSON(json, function() { canvas.renderAll(); updateStatus('Loaded'); });
          return;
        }
      } catch(e) {}
      const text = new fabric.IText(ev.target.result.substring(0, 500), { left: 100, top: 100 });
      canvas.add(text);
      updateStatus('File added as text');
    };
    reader.readAsText(file);
  };
  input.click();
}