const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('evaluationAPI', {
  print: (landscape) => ipcRenderer.invoke('evaluation:print', {
    landscape: landscape === true
  }),
  exportPDF: (options = {}) => ipcRenderer.invoke('evaluation:export-pdf', {
    landscape: options.landscape === true,
    defaultName: String(options.defaultName || 'evaluation.pdf').slice(0, 120)
  })
});
