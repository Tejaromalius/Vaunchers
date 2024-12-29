const TASKS = {
  'Debug: Angular w/ Firefox': {
    label: 'Serve Angular',
    type: 'npm',
    script: 'start',
    isBackground: true,
    problemMatcher: {
      base: '$tsc',
      severity: 'info',
      pattern: '$tsc',
      applyTo: 'allDocuments',
      background: {
        beginsPattern: {
          regexp: '(.*?)',
        },
        endsPattern: 'Compiled successfully.',
      },
    },
  },
};

module.exports = {
  TASKS,
};
