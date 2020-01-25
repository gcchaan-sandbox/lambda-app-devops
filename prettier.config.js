/** @type {import('prettier').Options} */
module.exports = {
  printWidth: 100,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  overrides: [
    {
      files: '*.md',
      options: {
        semi: true,
        trailingComma: 'none',
      },
    },
  ],
}