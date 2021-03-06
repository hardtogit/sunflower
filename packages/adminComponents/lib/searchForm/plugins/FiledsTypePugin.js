"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementTypePugin = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _city = _interopRequireDefault(require("../../picker/city"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import { nextTick } from '@/utils/nextTick';
var Option = _antd.Select.Option;

function getPlaceholder(_ref) {
  var type = _ref.type,
      name = _ref.name;
  var dot = '';

  switch (type) {
    case 'select':
    case 'date':
    case 'enum':
    case 'dateRange':
    case 'cityPicker':
      dot = '选择';
      break;

    default:
      dot = '输入';
      break;
  }

  return "\u8BF7".concat(dot).concat(name);
}

var ElementTypePugin =
/*#__PURE__*/
function () {
  function ElementTypePugin() {
    _classCallCheck(this, ElementTypePugin);

    this.options = {
      text: function text(field) {
        return _react.default.createElement(_antd.Input, _extends({
          placeholder: getPlaceholder(field)
        }, field));
      },
      textarea: function textarea(field) {
        return _react.default.createElement(_antd.Input.TextArea, _extends({
          placeholder: getPlaceholder(field)
        }, field));
      },
      number: function number(field) {
        return _react.default.createElement(_antd.InputNumber, _extends({
          placeholder: getPlaceholder(field),
          style: {
            width: '100%'
          }
        }, field));
      },
      dateRange: function dateRange(field) {
        return _react.default.createElement(_antd.DatePicker.RangePicker, field);
      },
      date: function date(field) {
        return _react.default.createElement(_antd.DatePicker, _extends({
          placeholder: getPlaceholder(field)
        }, field));
      },
      month: function month(field) {
        return _react.default.createElement(_antd.DatePicker.MonthPicker, _extends({
          placeholder: getPlaceholder(field)
        }, field));
      },
      enum: function _enum(field) {
        var options = [];
        field.enums && Object.keys(field.enums).forEach(function (key) {
          if (field.enums[key] === '全部') {
            options.unshift(_react.default.createElement(Option, {
              value: key,
              key: key
            }, " ", field.enums[key]));
          } else {
            options.push(_react.default.createElement(Option, {
              value: key,
              key: key
            }, " ", field.enums[key]));
          }
        });
        return _react.default.createElement(_antd.Select, _extends({
          style: {
            width: '100%'
          },
          placeholder: getPlaceholder(field)
        }, field), options);
      },
      cityPicker: function cityPicker(field) {
        return _react.default.createElement(_city.default, _extends({
          placeholder: getPlaceholder(field)
        }, field));
      }
    };
  }

  _createClass(ElementTypePugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.install.tap('ElementTypePugin', function (fieldsTypes) {
        Object.keys(_this.options).forEach(function (type) {
          fieldsTypes[type] = function (field) {
            // 自动添加onChange监听 触发change hook 帮助联动性处理
            var fieldCopy = _objectSpread({}, field);

            delete fieldCopy.ColLayout;
            return _this.options[type](fieldCopy);
          };
        });
      });
    }
  }]);

  return ElementTypePugin;
}();

exports.ElementTypePugin = ElementTypePugin;