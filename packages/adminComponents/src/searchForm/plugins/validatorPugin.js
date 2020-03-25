/**
 * 验证插件
 */

export function validatorPugin(compiler) {
  compiler.hooks.validator.tapAsync('validatorPugin', (form, callback) => {
    // console.log(callback);
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
        //  let  validtors =  field.rules.filter((it=>it.validator));
        field.rules.forEach((vl) => {
          if (vl.validator) {
            const oldFn = vl.validator;
            // console.log('OK哦跨框架');
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
