"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeployEnv = getDeployEnv;
exports.wrapActions = void 0;

function getDeployEnv(deployEnv) {
  // 由于公共组件内部与业务项目使用的getRuntimeEnv为不同的函数，故需要使用window全局变量来保持数据一致
  if (arguments.length) {
    window.$$cachedEnv = window.DEPLOY_ENV || deployEnv || window.localStorage.getItem('DEPLOY_ENV') || 'dev';
  }

  return window.$$cachedEnv;
} // 包装actions对象


var wrapActions = function wrapActions(actions) {
  return {
    actions: actions
  };
};

exports.wrapActions = wrapActions;