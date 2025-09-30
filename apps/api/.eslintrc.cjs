module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  ignorePatterns: ['dist', 'node_modules', 'test/**/*.ts'], // add this
};