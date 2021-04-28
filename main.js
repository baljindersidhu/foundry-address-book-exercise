const { app, BrowserWindow } = require("electron");
const { join } = require("path");

// create a window with 600x800 dimensions and load root file index.html
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });
    
    win.loadFile(join(__dirname, `/dist/index.html`));
};

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
  if (process.platform !== "darwin") app.quit();
});