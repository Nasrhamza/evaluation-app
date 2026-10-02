const { app, BrowserWindow, dialog, ipcMain, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const PRINT_CHANNEL = 'evaluation:print';
const PDF_CHANNEL = 'evaluation:export-pdf';

function createWindow() {
  const window = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 650,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });

  window.setMenuBarVisibility(false);
  window.loadFile('index.html');
  window.once('ready-to-show', () => window.show());

  window.webContents.on('will-navigate', (event) => event.preventDefault());
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  return window;
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false);
  });

  ipcMain.handle(PRINT_CHANNEL, async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window || window.isDestroyed()) {
      return { ok: false, error: 'Fenêtre indisponible.' };
    }

    const landscape = options.landscape === true;

    return new Promise((resolve) => {
      window.webContents.print(
        {
          silent: false,
          printBackground: true,
          landscape,
          margins: { marginType: 'default' }
        },
        (success, failureReason) => {
          resolve(success
            ? { ok: true }
            : { ok: false, error: failureReason || 'Impression annulée.' });
        }
      );
    });
  });

  ipcMain.handle(PDF_CHANNEL, async (event, options = {}) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (!window || window.isDestroyed()) return { ok: false, error: 'Fenêtre indisponible.' };
    const proposedName = String(options.defaultName || 'evaluation.pdf')
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
      .slice(0, 120);
    try {
      const result = await dialog.showSaveDialog(window, {
        title: 'Enregistrer le document PDF',
        defaultPath: proposedName.toLowerCase().endsWith('.pdf') ? proposedName : `${proposedName}.pdf`,
        filters: [{ name: 'Document PDF', extensions: ['pdf'] }]
      });
      if (result.canceled || !result.filePath) return { ok: false, canceled: true };
      const data = await window.webContents.printToPDF({
        printBackground: true,
        landscape: options.landscape === true,
        pageSize: 'A4',
        preferCSSPageSize: true,
        margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
      });
      await fs.writeFile(result.filePath, data);
      return { ok: true, filePath: result.filePath };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Création PDF impossible.' };
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
