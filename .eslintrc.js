module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:import/typescript'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
  },
}
