import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import react from 'eslint-plugin-react'

export default defineConfig([
  { ignores: ['dist', 'src/components/ui'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
    settings: { react: { version: 'detect' } },
  },
  // ↓テストファイルだけESLintの特定ルールをゆるくするためのオーバーライド設定
  {
    files: ['**/*.test.ts', '**/*.test.tsx'], // 対象ファイルのパターンを指定
    rules: {
      '@typescript-eslint/no-empty-function': 'off', // 対象ファイルに限って、「空の関数を禁止するルール」を無効化（モックなどで「何もしない関数」を置くため）
    },
  },
])
