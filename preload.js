const { contextBridge, ipcRenderer } = require('electron');

// Esponi API sicure al contesto di rendering
contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, (_, ...args) => callback(...args)),
});
