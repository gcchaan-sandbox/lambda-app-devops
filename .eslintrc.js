/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  plugins: ['simple-import-sort'],
  env: {
    node: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'import/default': 'off',
    'import/order': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
  },
  overrides: [
    {
      files: '*.js',
      rules: {
        'import/order': ['error', { 'newlines-between': 'always' }],
        'simple-import-sort/sort': 'off',
      },
    },
  ],
}