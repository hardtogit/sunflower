"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import Input from 'antd-mobile/lib/input-item/Input';
var Option = _antd.AutoComplete.Option;
/**
 * 选择可搜索
 */

var AutoCompleteExtra =
/*#__PURE__*/
function (_Component) {
  _inherits(AutoCompleteExtra, _Component);

  _createClass(AutoCompleteExtra, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if ('value' in props) {
        if (props.value !== state.value) {
          return {
            value: props.value
          };
        }

        return null;
      }

      return null;
    }
  }]);

  function AutoCompleteExtra(props) {
    var _this;

    _classCallCheck(this, AutoCompleteExtra);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AutoCompleteExtra).call(this, props));
    _this.state = {
      value: undefined,
      dataSource: []
    };
    _this.timer = null;
    return _this;
  }

  _createClass(AutoCompleteExtra, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var _this$props = this.props,
          preload = _this$props.preload,
          load = _this$props.load,
          resFilter = _this$props.resFilter;

      if (preload && load) {
        load().then(function (result) {
          _this2.setState({
            dataSource: resFilter ? resFilter(result) : result
          });
        });
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(v) {
      var onChange = this.props.onChange;
      onChange(v);
    }
  }, {
    key: "handleSearch",
    value: function handleSearch(key) {
      var _this3 = this;

      var _this$props2 = this.props,
          load = _this$props2.load,
          resFilter = _this$props2.resFilter,
          linktype = _this$props2.linktype;

      if (key && load) {
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }

        this.timer = window.setTimeout(function () {
          load(key, linktype).then(function (result) {
            window.clearTimeout(_this3.timer);
            _this3.timer = null;

            _this3.setState({
              dataSource: resFilter ? resFilter(result) : result
            });
          });
        }, 100);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var dataSource = this.state.dataSource; // console.log('data', dataSource);

      var aProps = _objectSpread({}, this.props, {
        onSearch: function onSearch(keyword) {
          _this4.handleSearch(keyword);
        },
        dataSource: dataSource.map(function (_ref) {
          var key = _ref.key,
              label = _ref.label;
          return _react.default.createElement(Option, {
            key: key,
            value: key
          }, label);
        }),
        style: {
          width: '100%'
        },
        onChange: function onChange(v) {
          return _this4.handleChange(v);
        }
      });

      return _react.default.createElement(_antd.AutoComplete, aProps, _react.default.createElement(_antd.Input, aProps.input));
    }
  }]);

  return AutoCompleteExtra;
}(_react.Component);

exports.default = AutoCompleteExtra;