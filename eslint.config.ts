import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
    {
        ignores: ['src/generated/**'],
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        rules: {
            // Allow both `type` and `interface` declarations
            '@typescript-eslint/consistent-type-definitions': 'off'
        }
    }
])
