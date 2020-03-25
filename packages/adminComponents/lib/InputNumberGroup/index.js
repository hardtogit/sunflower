"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _type = _interopRequireDefault(require("@cot/core/lib/utils/type"));

var _scope = _interopRequireDefault(require("./scope"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var InputNumberGroup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(InputNumberGroup, _React$Component);

  function InputNumberGroup(props) {
    var _this;

    _classCallCheck(this, InputNumberGroup);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputNumberGroup).call(this, props));

    _this.handleChange = function (value) {
      if (!('value' in _this.props)) {
        _this.setState({
          value: value
        });
      }

      _this.triggerChange(value);
    };

    _this.triggerChange = function (changedValue) {
      var onChange = _this.props.onChange;

      if (onChange) {
        onChange(changedValue);
      }
    };

    var _value = !_type.default.isEmpty(props.value) ? props.value : '';

    _this.state = {
      value: _value
    };
    return _this;
  }

  _createClass(InputNumberGroup, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      if ('value' in nextProps) {
        var value = nextProps.value;
        this.setState({
          value: value
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var state = this.state;
      var _this$props = this.props,
          addonAfter = _this$props.addonAfter,
          addonBefore = _this$props.addonBefore;

      var inputNumberProps = _objectSpread({}, this.props, {
        value: state.value,
        onChange: this.handleChange
      });

      return _react.default.createElement("span", {
        className: "ant-input-group-wrapper"
      }, _react.default.createElement("span", {
        className: "ant-input-wrapper ant-input-group"
      }, addonBefore && _react.default.createElement("span", {
        className: "ant-input-group-addon"
      }, addonBefore), _react.default.createElement(_antd.InputNumber, _extends({
        style: {
          padding: 0
        },
        className: "ant-input"
      }, inputNumberProps)), addonAfter && _react.default.createElement("span", {
        className: "ant-input-group-addon"
      }, addonAfter)));
    }
  }]);

  return InputNumberGroup;
}(_react.default.Component);

InputNumberGroup.defaultProps = {
  addonBefore: '',
  addonAfter: ''
};
InputNumberGroup.propTypes = {
  addonBefore: _propTypes.default.string,
  addonAfter: _propTypes.default.string
};
InputNumberGroup.Scope = _scope.default;
var _default = InputNumberGroup;
exports.default = _default;