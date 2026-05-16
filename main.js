const { app, BrowserWindow, ipcMain, screen, desktopCapturer } = require('electron');

let win;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: 80,
    height: 80,
    x: width - 100,
    y: height - 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: __dirname + "/preload.js"
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Expand window
ipcMain.on("expand-window", () => {
  win.setSize(350, 500);
});

// Minimize back to icon
ipcMain.on("shrink-window", () => {
  win.setSize(80, 80);
});

// Capture screen
const screenshot = require('screenshot-desktop');
const fs = require('fs');

ipcMain.handle("capture-screen", async () => {

  const img = await screenshot({ format: 'png' });

  return img.toString('base64');
});