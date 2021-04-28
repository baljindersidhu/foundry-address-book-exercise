const { app, BrowserWindow, ipcMain } = require("electron");
const { join } = require("path");
const { fork } = require('child_process');
const contactsService = fork(join(__dirname, "electron-scripts/get-contacts.js"));

// create a window with 600x800 dimensions and load root file index.html
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // added nodeIntegration as true and contextIsolation as false for enabling
            // require in contacts.service to make use of ipcRenderer from electron
            nodeIntegration: true,
            contextIsolation: false,
            preload: join(__dirname, "preload.js"),
        },
        resizable: false
    });
    
    win.loadFile(join(__dirname, `/dist/index.html`));
};

ipcMain.handle('get-contacts', async (event, ...args) => {
    contactsService.send('start');
    return new Promise((resolve, reject) => {
        contactsService.on('message', contacts => {
            resolve(contacts);
        });

        contactsService.on('error', error => {
            reject(error);
        });
    });
});

// when application is ready then create a new window
// and  listen for activate event which would create 
// a new window if there are no current open windows (Mac OS)
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// quit app when all windows are closed except on Mac OS devices
// since it doens't destroy the app on closing
app.on("window-all-closed", () => {
  if (process.platform !== "darwin"){
      app.quit();
      contactsService.kill('SIGINT');
  }
});
