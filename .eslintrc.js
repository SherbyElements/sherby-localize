module.exports = {
  // Extends the UdeS ESLint config
  extends: 'eslint-config-udes/polymer-2-element',

  parserOptions: {
    sourceType: 'module',
  },

  rules: {
    'new-cap': ['error', {
      capIsNewExceptionPattern: '^(UdeS|Polymer|Sherby)',
    }],
  },

  globals: {
    IntlMessageFormat: true,
    Sherby: true,
  },

  // Limit ESLint to a specific project
  root: true,
}
