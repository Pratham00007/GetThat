const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("api", {
  expand: () => ipcRenderer.send("expand-window"),
  shrink: () => ipcRenderer.send("shrink-window"),
  moveWindow: (x, y) => ipcRenderer.send("move-window", { x, y }),
  captureScreen: () => ipcRenderer.invoke("capture-screen"),
  quitApp: () => ipcRenderer.send("quit-app")
});