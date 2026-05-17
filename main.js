const { app, BrowserWindow, ipcMain, screen, desktopCapturer } = require('electron');

let win;

const MINIMIZED_SIZE = { width: 120, height: 120 };
const EXPANDED_SIZE = { width: 380, height: 520 };

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  win = new BrowserWindow({
    width: MINIMIZED_SIZE.width,
    height: MINIMIZED_SIZE.height,
    x: width - 140,
    y: height - 140,
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

function clampToWorkArea(position, size) {
  const display = screen.getDisplayNearestPoint(position || { x: 0, y: 0 });
  const workArea = display.workArea;

  const maxX = workArea.x + workArea.width - size.width;
  const maxY = workArea.y + workArea.height - size.height;

  return {
    x: Math.min(Math.max(position.x, workArea.x), maxX),
    y: Math.min(Math.max(position.y, workArea.y), maxY)
  };
}

ipcMain.on("expand-window", () => {
  if (!win) return;

  const bounds = win.getBounds();
  const nextX = bounds.x + bounds.width - EXPANDED_SIZE.width;
  const nextY = bounds.y + bounds.height - EXPANDED_SIZE.height;

  win.setBounds({
    x: nextX,
    y: nextY,
    width: EXPANDED_SIZE.width,
    height: EXPANDED_SIZE.height
  });
});

ipcMain.on("shrink-window", () => {
  if (!win) return;

  const bounds = win.getBounds();
  const nextX = bounds.x + bounds.width - MINIMIZED_SIZE.width;
  const nextY = bounds.y + bounds.height - MINIMIZED_SIZE.height;

  win.setBounds({
    x: nextX,
    y: nextY,
    width: MINIMIZED_SIZE.width,
    height: MINIMIZED_SIZE.height
  });
});

ipcMain.on("move-window", (_event, position) => {
  if (!win || !position) return;

  const bounds = win.getBounds();
  const nextPosition = clampToWorkArea(position, { width: bounds.width, height: bounds.height });

  win.setPosition(nextPosition.x, nextPosition.y);
});

ipcMain.on("quit-app", () => {
  app.quit();
});

const screenshot = require('screenshot-desktop');
const fs = require('fs');

ipcMain.handle("capture-screen", async () => {

  const img = await screenshot({ format: 'png' });

  return img.toString('base64');
});