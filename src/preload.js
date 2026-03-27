const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openCsv: () => ipcRenderer.invoke('dialog:openCsv'),
  savePrn: (content) => ipcRenderer.invoke('dialog:savePrn', content),
});
