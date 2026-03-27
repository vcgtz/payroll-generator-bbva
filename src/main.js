const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 920,
    height: 700,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

ipcMain.handle('dialog:openCsv', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Seleccionar archivo CSV',
    filters: [{ name: 'CSV', extensions: ['csv'] }],
    properties: ['openFile'],
  });

  if (canceled || filePaths.length === 0) {
    return null;
  }

  const content = fs.readFileSync(filePaths[0], 'utf-8');
  return { content, fileName: path.basename(filePaths[0]) };
});

ipcMain.handle('dialog:savePrn', async (event, prnContent) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Guardar archivo PRN',
    defaultPath: 'nomina.txt',
    filters: [
      { name: 'Texto', extensions: ['txt'] },
      { name: 'PRN', extensions: ['prn'] },
    ],
  });

  if (canceled || !filePath) {
    return false;
  }

  fs.writeFileSync(filePath, prnContent, 'latin1');
  return true;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
