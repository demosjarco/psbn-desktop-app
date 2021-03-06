'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const livestreamApi = require('./livestreamApi');

let mainWindow;

app.on('ready', () => {
	// Create the browser window.
	let mainWindowState = require('electron-window-state')({
		defaultWidth: 1024,
		defaultHeight: 768
	});
	mainWindow = new BrowserWindow({
		width: mainWindowState.width,
		height: mainWindowState.height,
		x: mainWindowState.x,
		y: mainWindowState.y,
		minWidth: 1024,
		minHeight: 768,
		title: 'PSBN Desktop App',
		frame: false,
		backgroundColor: (process.platform !== 'darwin') ? '#212121' : null,
		darkTheme: true,
		vibrancy: 'ultra-dark',
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			enableRemoteModule: false,
			webSecurity: true,
			allowRunningInsecureContent: false,
			scrollBounce: true,
			experimentalFeatures: true,
			enableBlinkFeatures: 'OverlayScrollbars,AutomaticLazyImageLoading'
		}
	});

	mainWindowState.manage(mainWindow);

	// and load the index.html of the app.
	mainWindow.loadURL('http://localhost:3000');
	//mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	module.exports.mainWindow = mainWindow;
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('minimize', (event) => {
	mainWindow.minimize();
});
ipcMain.on('maximize', (event) => {
	if (mainWindow.isMaximized()) {
		mainWindow.unmaximize();
	} else {
		mainWindow.maximize();
	}
});
ipcMain.on('close', (event) => {
	mainWindow.close();
});

ipcMain.on('getEvents', (event) => {
	livestreamApi.loadAll();
});