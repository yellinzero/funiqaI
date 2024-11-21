import path from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

import tailwindcss from 'eslint-plugin-tailwindcss'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default antfu({
  react: true,
  stylistic: true,
  rules: {
    'no-console': 'warn',
  },
}).append(
  ...compat.extends('plugin:@next/next/recommended'),
  ...tailwindcss.configs['flat/recommended'],
  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
    ignores: ['**/node_modules/*', '.next', '.vscode'],
  },
)
