"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.revPlugin = revPlugin;

// import { nextTick } from '../../../../utils/nextTick';

/**
 * 接收到新参数 重置表单
 * 放弃下面插件
 * 如果只是search的改变去重塑表单 代价过高
 * 如果需要改变 请tap rev form.setFieldsValue 即可
 * @deprecated
 */
function revPlugin(compiler) {
  compiler.hooks.rev.tap('revPlugin', function (values) {
    var fields = compiler.fields;
    fields.forEach(function (field) {
      field.initialValue = values[field.key];
    });
    compiler.elements = [];
    compiler.btnElements = [];
    compiler.fields = compiler.hooks.config.call(fields);
    compiler.make(); // console.log(values, '9999999999999999');
    // nextTick(() => {
    //   compiler.form.setFieldsValue(values);
    // });
  });
}