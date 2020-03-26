
/**
 * 查询和重置按钮添加
 * @param {*} compiler
 */
export function submitAndResetPlugin(compiler) {
  compiler.hooks.make.tap('submitAndResetPlugin', (elements, btns) => {
    btns.unshift({
      source: 'Reset',
      title: '重置',
      type: 'default'
    });
    btns.unshift({
      source: 'Submit',
      title: '查询',
      type: 'primary'
    });
  });

  // 监听按钮hook
  // compiler.hooks.submit.tap('submitAndResetPugin', (source) => {
  //   if (source === 'Reset') {
  //     compiler.form.resetFields();
  //   }
  // });
}
