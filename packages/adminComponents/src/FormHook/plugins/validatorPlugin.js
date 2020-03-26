/**
 * 验证插件
 */

export function validatorPlugin(compiler) {
  compiler.hooks.validator.tapAsync('validatorPlugin', (form, callback) => {
    form.validateFieldsAndScroll((err, values) => {
      callback(err, values);
    });
  });
}


export function extraRulePlugin(compiler) {
  const { form } = compiler;
  compiler.hooks.config.tap('extraRulePlugin', (fileds) => {
    return fileds.map((field) => {
      if (field.extraRule && field.rules && field.rules.length > 0) {
        field.rules.forEach((vl) => {
          if (vl.validator) {
            const oldFn = vl.validator;
            vl.validator = (rule, value, callback) => {
              oldFn(rule, value, callback, form);
            };
          }
        });
      }
      return field;
    });
  });
}
