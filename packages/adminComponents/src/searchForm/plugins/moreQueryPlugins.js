export function moreQueryPlugins(compiler) {
  compiler.hooks.more.tap('moreQueryPlugins', (type) => {
    compiler.moreType = !type;
    compiler.hooks.submit.call('MoreQuery');
  });
}

