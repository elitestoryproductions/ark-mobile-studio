function uploadAnyFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,.txt,.docx,.pdf,.jpg,.png,.svg';
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (ev) => {
      const content = ev.target.result;
      
      try {
        const jsonData = typeof content === 'string' ? JSON.parse(content) : null;
        if (jsonData && jsonData.objects) {
          canvas.loadFromJSON(jsonData, () => canvas.renderAll());
          updateStatus('JSON design loaded');
          return;
        }
      } catch(e) {}
      
      // Add as text element
      const text = new fabric.IText(content.substring(0, 500), {
        left: 100, top: 100, fontSize: 16, fill: '#2c2c2c'
      });
      canvas.add(text);
      updateStatus(`File "${file.name}" added as text`);
    };
    
    reader.readAsText(file);
  };
  input.click();
}