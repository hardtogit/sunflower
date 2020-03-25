"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatorPugin = validatorPugin;
exports.extraRulePlugin = extraRulePlugin;

/**
 * 验证插件
 */
function validatorPugin(compiler) {
  compiler.hooks.validator.tapAsync('validatorPugin', function (form, callback) {
    // console.log(callback);
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
        //  let  validtors =  field.rules.filter((it=>it.validator));
        field.rules.forEach(function (vl) {
          if (vl.validator) {
            var oldFn = vl.validator; // console.log('OK哦跨框架');

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