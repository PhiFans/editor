import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: { react: { version: '19.0' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'no-async-promise-executor': [
        'off',
      ],
      '@typescript-eslint/prefer-promise-reject-errors': [
        'off',
      ],
      '@typescript-eslint/no-misused-promises': [
        'off',
      ],
      '@typescript-eslint/no-unsafe-member-access': [
        'off',
      ],
      '@typescript-eslint/no-unsafe-call': [
        'off'
      ],
      'react/no-unknown-property': [
        'error',
        { ignores: [ '@pixi/react' ] }
      ],
    },
  },
)
