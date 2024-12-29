const vscode = require('vscode');
const fs = require('fs');
const { logger } = require('../utils/logger');

function updateTasks(tasksPath, newTask) {
  let content;
  let taskConfig;

  _createtaskConfigFileIfNotExist(tasksPath);
  if (!fs.existsSync(tasksPath)) return;
  content = _readFileContent(tasksPath);
  if (!content) return;
  taskConfig = _parseJSON(content);
  if (!taskConfig) return;
  _updateConfigurations(taskConfig, newTask, tasksPath);
}

function _createtaskConfigFileIfNotExist(taskConfigPath) {
  try {
    if (!fs.existsSync(taskConfigPath)) {
      fs.writeFileSync(
        taskConfigPath,
        JSON.stringify({ tasks: [], version: '2.0.0' }, null, 2),
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
      '{ "tasks": [], "version": "2.0.0" }'
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
      'Failed to parse tasks.json. The file might be corrupted.',
    );
    return null;
  }
}

function _updateConfigurations(taskConfig, newTask, taskConfigPath) {
  try {
    taskConfig.tasks.push(newTask);
    fs.writeFileSync(taskConfigPath, JSON.stringify(taskConfig, null, 2));
    vscode.window.showInformationMessage(
      `Added '${newTask['label']}' launcher configuration`,
    );
  } catch (error) {
    logger.error(`Error writing file: ${error.message}`);
    vscode.window.showErrorMessage(
      'Failed to write launch.json. The file might be corrupted.',
    );
  }
}

module.exports = {
  updateTasks,
};
