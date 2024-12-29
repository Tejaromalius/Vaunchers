const vscode = require('vscode');
const { TASKS } = require('./configs/tasks');
const { CONFIGURATIONS } = require('./configs/launch');
const { updateTasks } = require('./handlers/tasksHandler');
const { updateLauncher } = require('./handlers/launchersHandler');
const { logger } = require('./utils/logger');

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

    let newLauncher = CONFIGURATIONS[selectedLauncher];
    if (newLauncher.name === 'Debug: .NET Core') {
      newLauncher.projectPath = await _getDotnetProjectPath();

      if (!newLauncher.projectPath) {
        logger.error(`No project file selected.`);
        vscode.window.showErrorMessage('No project file selected.');
        return;
      }
    }

    const launchersPath = `${workspaceFolders[0].uri.path}/.vscode/launch.json`;
    updateLauncher(launchersPath, newLauncher);

    if (newLauncher.name === 'Debug: Angular w/ Firefox') {
      const tasksPath = `${workspaceFolders[0].uri.path}/.vscode/tasks.json`;
      updateTasks(tasksPath, TASKS[newLauncher.name]);
    }
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
