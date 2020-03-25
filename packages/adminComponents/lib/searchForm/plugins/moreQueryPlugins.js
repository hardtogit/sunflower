"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moreQueryPlugins = moreQueryPlugins;

function moreQueryPlugins(compiler) {
  compiler.hooks.more.tap('moreQueryPlugins', function (type) {
    compiler.moreType = !type;
    compiler.hooks.submit.call('MoreQuery');
  });
}