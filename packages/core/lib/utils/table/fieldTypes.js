"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.combineTypes = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _type = require("../type");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 测试
 * console.log('字符串', isValide('121312')); // 字符串 true
 * console.log('正整数', isValide(1231231231)); // 正整数 true
 * console.log('数字0', isValide(0)); // 数字0 false
 * console.log('空字符串', isValide('')); // 空字符串 false
 * console.log('null', isValide(null)); // null false
 * console.log('undefined', isValide(undefined)); // undefined false
 * console.log('空对象', isValide({})); // 空对象 false
 * console.log('空数组', isValide([])); // 空数组 false
 */
var isValid = function isValid(date) {
  return Boolean(date) && (_type.Type.isNumber(date) || _type.Type.isString(date));
};

var getParsedDate = function getParsedDate(date, format) {
  return isValid(date) ? (0, _moment["default"])(date).format(format) : '';
};
/*
 * column类型定义
 */


var fieldTypes = {
  normal: function normal(value) {
    return value;
  },
  text: function text(value) {
    return value;
  },
  textarea: function textarea(value) {
    return value;
  },
  number: function number(value) {
    return value;
  },
  "boolean": function boolean(value) {
    return value === 'true' || value === true ? '是' : '否';
  },
  date: function date(value) {
    return getParsedDate(value, 'YYYY-MM-DD');
  },
  datetime: function datetime(value) {
    return getParsedDate(value, 'YYYY-MM-DD HH:mm:ss');
  },
  time: function time(value) {
    return getParsedDate(value, 'HH:mm:ss');
  },
  month: function month(value) {
    return getParsedDate(value, 'YYYY-MM');
  },
  dateRange: function dateRange(value) {
    if (!_type.Type.isArray(value)) {
      return '';
    }

    var start = getParsedDate(value[0], 'YYYY-MM-DD');
    var end = getParsedDate(value[1], 'YYYY-MM-DD');
    return "".concat(start, " - ").concat(end);
  },
  datetimeRange: function datetimeRange(value) {
    if (!_type.Type.isArray(value)) {
      return '';
    }

    var start = getParsedDate(value[0], 'YYYY-MM-DD HH:mm:ss');
    var end = getParsedDate(value[1], 'YYYY-MM-DD HH:mm:ss');
    return "".concat(start, " - ").concat(end);
  },
  monthRange: function monthRange(value) {
    if (!_type.Type.isArray(value)) {
      return '';
    }

    var start = getParsedDate(value[0], 'YYYY-MM');
    var end = getParsedDate(value[1], 'YYYY-MM');
    return "".concat(start, " - ").concat(end);
  },
  range: function range(value) {
    if (!_type.Type.isArray(value)) {
      return '';
    }

    return value.join('-');
  },
  "enum": function _enum(value, _ref) {
    var enums = _ref.enums;
    var enumValue;

    if (_type.Type.isEmpty(value)) {
      enumValue = '';
    } else if (_type.Type.isObject(enums)) {
      enumValue = enums[value];
    } else if (_type.Type.isArray(enums)) {
      enumValue = (enums.find(function (x) {
        return x.value === value;
      }) || {}).label || value;
    }

    return enumValue;
  },
  enumGroup: function enumGroup(value, _ref2) {
    var options = _ref2.options;
    var enumGroup = [];

    if (!_type.Type.isArray(value)) {
      enumGroup = [value];
    } else if (_type.Type.isObject(options)) {
      enumGroup = value.map(function (v) {
        return options[v];
      });
    } else if (_type.Type.isArray(options)) {
      enumGroup = value.map(function (v) {
        return (options.find(function (x) {
          return x.value === v;
        }) || {}).label;
      });
    }

    return enumGroup.filter(function (v) {
      return v !== undefined && v !== '';
    }).join(',');
  },
  cascader: function cascader(value, _ref3) {
    var options = _ref3.options;
    var cascader = [];

    if (!_type.Type.isArray(value)) {
      cascader = [value];
    } else if (!_type.Type.isArray(options)) {
      cascader = value;
    } else {
      cascader = [];
      var opts = options;

      var _loop = function _loop(index) {
        var opt = opts.find(function (x) {
          return x.value === value[index];
        });

        if (!opt) {
          cascader = [];
          return "break";
        }

        cascader.push(opt.label);
        opts = opt.children;
      };

      for (var index = 0; index < value.length; index++) {
        var _ret = _loop(index);

        if (_ret === "break") break;
      }
    }

    return cascader.filter(function (v) {
      return v !== undefined && v !== '';
    }).join('/');
  }
};
/*
 * 扩展column类型定义
 */

var combineTypes = function combineTypes(types) {
  Object.assign(fieldTypes, types);
};

exports.combineTypes = combineTypes;
var _default = fieldTypes;
exports["default"] = _default;