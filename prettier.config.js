import organizeImports from 'prettier-plugin-organize-imports'

/** @type {import("prettier").Config} */
export default {
    semi: false,
    singleQuote: true,
    trailingComma: 'none',
    printWidth: 100,
    tabWidth: 4,
    arrowParens: 'always',
    plugins: [organizeImports]
}
