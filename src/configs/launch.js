const CONFIGURATIONS = {
  'Debug: Angular w/ Firefox': {
    name: 'Debug: Angular w/ Firefox',
    type: 'firefox',
    request: 'launch',
    preLaunchTask: 'Serve Angular',
    url: 'http://localhost:4200/',
  },
  'Debug: VS Code Extension': {
    name: 'Debug: VS Code Extension',
    args: ['--extensionDevelopmentPath=${workspaceFolder}'],
    outFiles: ['${workspaceFolder}/out/**/*.js'],
    request: 'launch',
    type: 'extensionHost',
  },
  'Debug: Firefox Addon': {
    type: 'firefox',
    request: 'launch',
    reAttach: true,
    name: 'Debug: Firefox Addon',
    addonPath: '${workspaceFolder}',
  },
  'Debug: .NET Core': {
    name: 'Debug: .NET Core',
    type: 'dotnet',
    request: 'launch',
    projectPath: null,
  },
};

module.exports = {
  CONFIGURATIONS,
};
