import path from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default antfu({
  react: true,
  stylistic: true,
  rules: {
    'no-console': ['warn', {
      allow: ['info', 'error'],
    }],
    'react/no-array-index-key': 'off',
    'node/prefer-global/process': 'off',
    'ts/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
}).append(
  ...compat.extends('plugin:@next/next/recommended'),
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    ignores: ['**/node_modules/*', '.next', '.vscode', 'output', 'dist', 'out'],
  },
)
