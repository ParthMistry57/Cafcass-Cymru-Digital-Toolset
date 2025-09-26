const { app, BrowserWindow } = require('electron');
const path = require('path');

// Function to create the main application window
function createWindow() {
  // Create a new browser window with specified width and height
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: true, // Enable Node.js integration in the renderer process
      contextIsolation: false, // Disable context isolation to allow direct access to the Node.js environment
      enableRemoteModule: true, // Enable the use of the remote module
    },
  });

  // Log the path to the HTML file being loaded
  console.log('Loading file:', path.join(__dirname, 'build', 'index.html'));

  // Load the application's index.html file into the window
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
}

// When Electron has finished initialization, create the application window
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate a window when the dock icon is clicked and there are no other open windows
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit the application when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});