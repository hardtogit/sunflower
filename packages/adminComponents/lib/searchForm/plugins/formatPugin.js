"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formate = formate;

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Format = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM'
}; // 支持格式 moment、date、时间戳(数值或者number)、IOS9601/RFC2822日期格式

function toMoment(value, format) {
  var momentValue;

  var isNumber = _lodash.default.isNumber(value);

  var isMoment = _moment.default.isMoment(value);

  var isString = _lodash.default.isString(value);

  var isNotNaN = !_lodash.default.isNaN(value);
  var isDate = value instanceof Date;
  var isDefaultFormat = Object.values(Format).includes(format); // 忽略[]或{}的情况

  if (!value && _lodash.default.isEmpty(value)) return null;

  if (isMoment) {
    momentValue = value;
  } else if (isDate || isNumber) {
    momentValue = (0, _moment.default)(value);
  } else if (isString && isNotNaN && isDefaultFormat) {
    // 判断isDefaultFormat 主要是为了避免格式为数字型format时，也被强转为number，比如: 2012.12
    momentValue = (0, _moment.default)(parseInt(value, 10));
  } else {
    momentValue = (0, _moment.default)(value, format);
  }

  return momentValue.isValid() ? momentValue : null;
}
/**
 * 配置参数的格式化 z
 * 主要是针对fields
 * @param {*} compiler
 */


function formate(compiler) {
  compiler.hooks.config.tap('FieldsFormate', function () {
    var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return fields.map(function (field) {
      // 如果不给type 默认text
      field.type = field.type || 'text';

      if ((field.type === 'date' || field.type === 'month') && field.initialValue) {
        field.initialValue = toMoment(field.initialValue);
      } else if (field.type === 'dateRange' && Array.isArray(field.initialValue)) {
        field.initialValue = field.initialValue.map(function (it) {
          return toMoment(it);
        });
      }

      return field;
    });
  });
}