"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formteParamPugin = formteParamPugin;
exports.Factory = void 0;
var Patter = 'YYYY-MM-DD HH:mm:ss';
var BeginPatter = 'YYYY-MM-DD 00:00:00';
var EndPatter = 'YYYY-MM-DD 23:59:59'; // const Ratter = 'YYYY-MM-DD';

var Mpatter = 'YYYY-MM';
var Factory = {
  date: function date(val) {
    return val.format(Patter);
  },
  dateRange: function dateRange(val) {
    return val.map(function (v, i) {
      return i === 0 ? "".concat(v.format(BeginPatter)) : "".concat(v.format(EndPatter));
    });
  },
  month: function month(val) {
    return val.format(Mpatter);
  } // cityPicker: val=>

};
/**
 * 格式化参数
 * @param {*} compier
 */

exports.Factory = Factory;

function formteParamPugin(compier) {
  compier.hooks.submit.tap('formteParamPugin', function (source, values) {
    if (!values) return {
      source: source
    };
    var fieldsMap = compier.fields.reduce(function (p, v) {
      p[v.key] = v;
      return p;
    }, {});
    return {
      source: source,
      values: Object.keys(values).reduce(function (prev, next) {
        var field = fieldsMap[next];

        if (field && Factory[field.type] && values[next]) {
          prev[next] = Factory[field.type](values[next]);
        } else {
          prev[next] = values[next];
        }

        return prev;
      }, {})
    };
  });
}