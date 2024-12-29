const vscode = require('vscode');
const fs = require('fs');
const { logger } = require('../utils/logger');

function updateLauncher(launchConfigPath, newConfiguration) {
  let content;
  let launchConfig;

  _createLaunchConfigFileIfNotExist(launchConfigPath);
  if (!fs.existsSync(launchConfigPath)) return;
  content = _readFileContent(launchConfigPath);
  if (!content) return;
  launchConfig = _parseJSON(content);
  if (!launchConfig) return;
  _updateConfigurations(launchConfig, newConfiguration, launchConfigPath);
}

function _createLaunchConfigFileIfNotExist(launchConfigPath) {
  try {
    if (!fs.existsSync(launchConfigPath)) {
      fs.writeFileSync(
        launchConfigPath,
        JSON.stringify({ configurations: [], version: '0.2.0' }, null, 2),
      );
    }
  } catch (error) {
    logger.error(`Error creating launch config file: ${error.message}`);
    vscode.window.showErrorMessage(
      `Failed to create launch config file: ${error.message}`,
    );
  }
}

function _readFileContent(filePath) {
  try {
    return (
      fs.readFileSync(filePath, 'utf8').trim() ||
      '{ "configurations": [], "version": "0.2" }'
    );
  } catch (error) {
    logger.error(`Error reading file: ${error.message}`);
    vscode.window.showErrorMessage(
      'Failed to read launch.json. The file might be corrupted.',
    );
    return null;
  }
}

function _parseJSON(content) {
  try {
    return JSON.parse(content);
  } catch (error) {
    logger.error(`Error parsing file: ${error.message}`);
    vscode.window.showErrorMessage(
      'Failed to parse launch.json. The file might be corrupted.',
    );
    return null;
  }
}

function _updateConfigurations(
  launchConfig,
  newConfiguration,
  launchConfigPath,
) {
  try {
    launchConfig.configurations.push(newConfiguration);
    fs.writeFileSync(launchConfigPath, JSON.stringify(launchConfig, null, 2));
    vscode.window.showInformationMessage(
      `Added '${newConfiguration['name']}' launcher configuration`,
    );
  } catch (error) {
    logger.error(`Error writing file: ${error.message}`);
    vscode.window.showErrorMessage(
      'Failed to write launch.json. The file might be corrupted.',
    );
  }
}

module.exports = {
  updateLauncher,
};
