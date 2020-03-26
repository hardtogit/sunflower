"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trimStringPugin = trimStringPugin;
exports.trimParamPugin = trimParamPugin;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 干掉查询空格
 */
function trimStringPugin(compiler) {
  compiler.hooks.submit.tap('trimStringPugin', function (target) {
    if (!target.values) {
      return target;
    }

    Object.keys(target.values).forEach(function (key) {
      var val = target.values[key];

      if (val && typeof val === 'string') {
        target.values[key] = val.trim();
      }
    });
    return target;
  });
}
/**
 * 干掉参数中存在的 为空的参数
 * @param {} compiler
 */


function trimParamPugin(compiler) {
  compiler.hooks.submit.tap('trimParamPugin', function (target) {
    if (!target.values) {
      return target;
    }

    Object.keys(target.values).forEach(function (key) {
      var val = target.values[key];

      if (_lodash.default.isEmpty(val) || Array.isArray(val) && val.length === 0) {
        delete target.values[key];
      }
    });
    return target;
  });
}