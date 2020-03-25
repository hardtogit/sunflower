package.json
src
lib
dist
README.md
LICENSE
    .umirc.library.js
    .prettierrc
    .gitignore
    .prettierignore
    .eslintrc
    .doczmodule.exports = {
  extends: [
    'eslint-config-airbnb',
    './rules/base',
    './rules/import',
    './rules/react',
    './rules/react-a11y',
  ].map(require.resolve),
  rules: {},
  globals: {
    require: false,
    document: false,
    Prism: false,
    fetch: false,
    React: false,
    window: false,
    location: false,
    editormd: false,
    FormData: false,
    FileReader: false,
    localStorage: false,
    $: false
  }
};
