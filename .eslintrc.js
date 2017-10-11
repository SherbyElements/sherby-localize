module.exports = {
  extends: [
    "udes"
  ],
  rules: {
    'new-cap': ['error', {
      capIsNewExceptionPattern: '^(UdeS|Polymer|Sherby)'
    }]
  },
  globals: {
    Sherby: true
  }
}
