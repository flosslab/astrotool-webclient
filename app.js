const {app, BrowserWindow, Menu, ipcMain, shell} = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;
let secondaryWindow;
let sharedState = {};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 960,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Percorso del preload
      contextIsolation: true, // Isola il contesto del renderer
      nodeIntegration: false, // Disabilita Node.js nel renderer per sicurezza
    },
  });

  mainWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      mainWindow.webContents.toggleDevTools();
    }
  });

  mainWindow.loadFile(
    path.join(__dirname, `/www/browser/index.html`)
  );

  // mainWindow.loadURL(
  //   url.format({
  //     pathname: path.join(__dirname, `/www/index.html`),
  //     protocol: "file:",
  //     slashes: true,
  //   })
  // );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });

  enableExternalUrl(mainWindow);

  createMenu();
}

function createMenu() {
  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'Apri Finestra',
  //         click: () => {
  //           createSecondaryWindow();
  //         },
  //       },
  //       {role: 'quit'},
  //     ],
  //   },
  // ]);
  Menu.setApplicationMenu(null);
}
//
// function createSecondaryWindow() {
//   if (!secondaryWindow) {
//     secondaryWindow = new BrowserWindow({
//       width: 400,
//       height: 300,
//       parent: mainWindow || undefined,
//       modal: true,
//       webPreferences: {
//         preload: path.join(__dirname, 'preload.js'), // Percorso del preload
//         contextIsolation: true, // Isola il contesto del renderer
//         nodeIntegration: false, // Disabilita Node.js nel renderer per sicurezza
//       },
//     });
//
//     // secondaryWindow.loadURL('http://google.it'); // Cambia con il path della tua finestra
//     secondaryWindow.loadFile(
//       path.join(__dirname, `/www/browser/index.html/#`),
//       {hash: '/testpage'}
//     );
//     secondaryWindow.on('closed', () => {
//       secondaryWindow = null;
//     });
//
//     secondaryWindow.webContents.on('before-input-event', (_, input) => {
//       if (input.type === 'keyDown' && input.key === 'F12') {
//         secondaryWindow.webContents.toggleDevTools();
//       }
//     });
//   }
// }

ipcMain.on('update-state', (_, newState) => {
  console.log('Ricevuto nuovo stato:', newState);
  sharedState = {...sharedState, ...newState};

  // Propaga lo stato aggiornato a tutte le finestre
  if (mainWindow) {
    mainWindow.webContents.send('state-updated', sharedState);
  }
  if (secondaryWindow) {
    secondaryWindow.webContents.send('state-updated', sharedState);
  }
});

ipcMain.on('open-window', (_, position, options) => {
  console.log('Apri finestra:', position, options);
  openNewWindow(position, options);
});

function enableExternalUrl(currentWindow) {
  currentWindow.webContents.setWindowOpenHandler(({url}) => {
    shell.openExternal(url);
    return { action: 'deny' }
  })
}

function openNewWindow(position, options = {width: 400, height: 300}) {
  let newWindow = new BrowserWindow({
    width: options.width,
    height: options.height,
    parent: mainWindow || undefined,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  newWindow.loadFile(
    path.join(__dirname, `/www/browser/index.html`),
    {hash: `/${position}`}
  );

  newWindow.on('closed', () => {
    newWindow = null;
  });

  newWindow.webContents.on('before-input-event', (_, input) => {
    if (input.type === 'keyDown' && input.key === 'F12') {
      newWindow.webContents.toggleDevTools();
    }
  });

  enableExternalUrl(newWindow)
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});


