const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
  expand: () => ipcRenderer.send("expand-window"),
  shrink: () => ipcRenderer.send("shrink-window"),
  captureScreen: () => ipcRenderer.invoke("capture-screen")
});