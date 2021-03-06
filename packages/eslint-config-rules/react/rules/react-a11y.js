module.exports = {
  plugins: [
    'jsx-a11y',
  ],

  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },

  rules: {
    // 官方文档删去了这个规则
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/commit/e621917a58065e9e5ad2ab2bffc4ad6c95955332
    'jsx-a11y/href-no-hash': 0,

    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    'jsx-a11y/no-static-element-interactions': 0,
  },
};
