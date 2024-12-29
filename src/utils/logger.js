const vscode = require('vscode');

const logger = vscode.window.createOutputChannel('Vaunchers', { log: true });

module.exports = {
  logger,
};
