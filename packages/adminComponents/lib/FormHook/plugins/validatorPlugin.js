"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatorPlugin = validatorPlugin;
exports.extraRulePlugin = extraRulePlugin;

/**
 * 验证插件
 */
function validatorPlugin(compiler) {
  compiler.hooks.validator.tapAsync('validatorPlugin', function (form, callback) {
    form.validateFieldsAndScroll(function (err, values) {
      callback(err, values);
    });
  });
}

function extraRulePlugin(compiler) {
  var form = compiler.form;
  compiler.hooks.config.tap('extraRulePlugin', function (fileds) {
    return fileds.map(function (field) {
      if (field.extraRule && field.rules && field.rules.length > 0) {
        field.rules.forEach(function (vl) {
          if (vl.validator) {
            var oldFn = vl.validator;

            vl.validator = function (rule, value, callback) {
              oldFn(rule, value, callback, form);
            };
          }
        });
      }

      return field;
    });
  });
}