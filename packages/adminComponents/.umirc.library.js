import { css } from "docz-plugin-umi-css";

export default {
  cjs: 'babel',
  esm: 'rollup',
  cssModules: false,
  doc: {
    title: '时光之穴',
    theme: 'docz-theme-umi',
    htmlContext: {
      head: {
        links: [
          {
            rel: 'stylesheet',
            href: 'https://codemirror.net/theme/solarized.css',
          },
        ],
      },
    },
    themeConfig: {
      codemirrorTheme: 'solarized'
    }
  }
}
