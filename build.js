// Script for automatically selecting the appropriate packaging command based on the operating system
const { exec } = require('child_process');
const os = require('os');

// Determine the current operating system
const platform = os.platform();

let command;

if (platform === 'darwin') {
  // If running on macOS, use the macOS packaging script
  command = 'npm run package-mac';
} else if (platform === 'win32') {
  // If running on Windows, use the Windows packaging script
  command = 'npm run package-windows';
} else {
  // If the platform is not supported, log an error and exit the script
  console.error('Unsupported platform:', platform);
  process.exit(1);
}

// Execute the appropriate packaging command
exec(command, (err, stdout, stderr) => {
  if (err) {
    // If an error occurs during execution, log the error and return
    console.error(`Error executing ${command}:`, err);
    return;
  }
  // Log the standard output from the command
  console.log(stdout);
  // Log any error output from the command
  console.error(stderr);
});