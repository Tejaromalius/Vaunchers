const vscode = require('vscode');
const { CONFIGURATIONS } = require('./configurations');
const { updateLauncherConfigurations } = require('./launchConfigHandler');
const { logger } = require('./logger');

async function addNewLauncher() {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      logger.error(`No workspace folder found.`);
      vscode.window.showErrorMessage('No workspace folder found.');
      return;
    }

    let selectedLauncher = await _getSelectedLauncher();
    if (!selectedLauncher) {
      logger.error(`No launcher selected.`);
      vscode.window.showErrorMessage('No launcher selected.');
      return;
    }

    let newConfiguration = CONFIGURATIONS[selectedLauncher];
    if (newConfiguration.name === 'Debug: .NET Core') {
      newConfiguration.projectPath = await _getDotnetProjectPath();

      if (!newConfiguration.projectPath) {
        logger.error(`No project file selected.`);
        vscode.window.showErrorMessage('No project file selected.');
        return;
      }
    }

    const launchConfigPath = `${workspaceFolders[0].uri.path}/.vscode/launch.json`;
    updateLauncherConfigurations(launchConfigPath, newConfiguration);
  } catch (error) {
    logger.appendLine(`Error in addNewLauncher: ${error.message}`);
    vscode.window.showErrorMessage(
      `Failed to add new launcher: ${error.message}`,
    );
  }
}

async function _getSelectedLauncher() {
  try {
    return await vscode.window.showQuickPick(Object.keys(CONFIGURATIONS), {
      placeHolder: 'Select the type of launcher to add',
    });
  } catch (error) {
    logger.appendLine(`Error in _getSelectedLauncher: ${error.message}`);
    vscode.window.showErrorMessage(
      `Failed to get selected launcher: ${error.message}`,
    );
    return null;
  }
}

async function _getDotnetProjectPath() {
  try {
    const projectFiles = await vscode.workspace.findFiles('**/*.csproj');
    if (projectFiles.length === 0) {
      logger.error(`No .csproj files found in the workspace.`);
      vscode.window.showErrorMessage(
        'No .csproj files found in the workspace.',
      );
      return null;
    }
    let dotnetProjectPath = await vscode.window.showQuickPick(
      projectFiles.map((file) => file.fsPath),
      {
        placeHolder: 'Select the project file',
        canPickMany: false,
        matchOnDetail: true,
        matchOnDescription: true,
        ignoreFocusOut: true,
      },
    );

    return dotnetProjectPath;
  } catch (error) {
    logger.appendLine(`Error in _getDotnetProjectPath: ${error.message}`);
    vscode.window.showErrorMessage(
      `Failed to get .NET project path: ${error.message}`,
    );
    return null;
  }
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vaunchers.addNewLauncher', addNewLauncher),
  );
}

module.exports = {
  activate,
};
