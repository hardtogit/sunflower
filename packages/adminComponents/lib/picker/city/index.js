"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _rcTrigger = _interopRequireDefault(require("rc-trigger"));

var _classnames = _interopRequireDefault(require("classnames"));

var _region = _interopRequireDefault(require("@sunflower/core/lib/region"));

var _antd = require("antd");

var _Popup = _interopRequireDefault(require("./Popup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Index = /*#__PURE__*/function (_React$Component) {
  _inherits(Index, _React$Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);

    _this.handleRemove = function (id) {
      var value = _this.state.value;
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          simple = _this$props.simple,
          regionType = _this$props.regionType;

      if (Array.isArray(value)) {
        _this.setState({
          value: value.filter(function (item) {
            return item !== id;
          })
        }, function () {
          if (onChange) {
            if (simple) {
              onChange(_this.state.value);
            } else {
              onChange(_region.default.formatRegion(_this.state.value, regionType));
            }
          }
        });
      } else {
        _this.setState({
          value: ''
        }, function () {
          if (onChange) {
            if (simple) {
              onChange(_this.state.value);
            } else {
              onChange(_region.default.formatRegion(_this.state.value, regionType));
            }
          }
        });
      }
    };

    _this.handleSelect = function (id) {
      var _this$props2 = _this.props,
          multiple = _this$props2.multiple,
          onChange = _this$props2.onChange,
          simple = _this$props2.simple,
          regionType = _this$props2.regionType,
          onSelect = _this$props2.onSelect;

      if (multiple) {
        _this.setState(function (_ref) {
          var value = _ref.value;
          return {
            value: [].concat(_toConsumableArray(value), [id])
          };
        }, function () {
          if (onChange) {
            if (simple) {
              onChange(_this.state.value);
            } else {
              onChange(_region.default.formatRegion(_this.state.value, regionType));
            }
          }

          if (onSelect) {
            onSelect(_region.default.formatRegion(_this.state.value, regionType));
          }
        });
      } else {
        _this.setState({
          value: id
        }, function () {
          if (onChange) {
            if (simple) {
              onChange(_this.state.value);
            } else {
              onChange(_region.default.formatRegion(_this.state.value, regionType));
            }
          }
        });
      }
    };

    _this.triggerSelect = function () {
      if (_this.props.disabled) {
        return;
      }

      var visible = _this.state.visible;

      _this.setState({
        visible: !visible
      });
    };

    _this.handleDropdownVisibleChange = function (open) {
      if (_this.props.disabled) {
        return;
      }

      _this.setState({
        visible: open
      });
    };

    var initValue = props.multiple ? [] : '';

    if (props.value) {
      if (props.simple) {
        initValue = props.value;
      } else if (props.multiple) {
        props.value = props.value ? props.value : [];
        initValue = props.value.reduce(function (total, current) {
          return [].concat(_toConsumableArray(total), [current.id]);
        }, []);
      } else {
        initValue = props.value && props.value.id;
      }
    }

    _this.state = {
      visible: false,
      value: initValue
    };
    return _this;
  }

  _createClass(Index, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this$props3 = this.props,
          multiple = _this$props3.multiple,
          simple = _this$props3.simple;

      if ('value' in nextProps) {
        if (simple) {
          this.setState({
            value: nextProps.value
          });
        } else if (multiple) {
          nextProps.value = nextProps.value ? nextProps.value : [];
          this.setState({
            value: nextProps.value.reduce(function (total, current) {
              return [].concat(_toConsumableArray(total), [current.id]);
            }, [])
          });
        } else {
          this.setState({
            value: nextProps.value && nextProps.value.id
          });
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          visible = _this$state.visible,
          value = _this$state.value;
      var _this$props4 = this.props,
          disabled = _this$props4.disabled,
          regionType = _this$props4.regionType;

      var regionData = _region.default.formatRegion(value, regionType);

      if (!Array.isArray(regionData)) {
        if (regionData) {
          regionData = [regionData];
        } else {
          regionData = [];
        }
      }

      return /*#__PURE__*/_react.default.createElement(_rcTrigger.default, _extends({}, this.props, {
        action: ['click'],
        popup: /*#__PURE__*/_react.default.createElement(_Popup.default, _extends({}, this.props, {
          triggerSelect: this.triggerSelect,
          handleSelect: this.handleSelect
        })),
        popupVisible: visible,
        destroyPopupOnHide: true // getPopupContainer={fn ||()=>{return document.getElementsByTagName('body')[0];}}
        ,
        popupStyle: {
          zIndex: 1050,
          width: '300px'
        },
        onPopupVisibleChange: this.handleDropdownVisibleChange,
        popupAlign: {
          points: ['tl', 'bl'],
          offset: [0, 3]
        }
      }), /*#__PURE__*/_react.default.createElement("div", {
        onClick: this.triggerSelect,
        className: (0, _classnames.default)(['ant-select', disabled ? 'ant-select-disabled' : 'ant-select-enabled']),
        style: {
          width: '100%'
        }
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "ant-select-selection ant-select-selection--multiple"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "ant-select-selection__rendered"
      }, (!value || value.length === 0) && /*#__PURE__*/_react.default.createElement("div", {
        className: "ant-select-selection__placeholder"
      }, "\u8BF7\u9009\u62E9\u5730\u5740"), /*#__PURE__*/_react.default.createElement("ul", null, regionData.map(function (value, index) {
        return /*#__PURE__*/_react.default.createElement("li", {
          key: index,
          className: "ant-select-selection__choice"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "ant-select-selection__choice__content"
        }, value.name), /*#__PURE__*/_react.default.createElement("div", {
          className: "ant-select-selection__choice__remove",
          onClick: function onClick(e) {
            e.stopPropagation();

            _this2.handleRemove(value.id);
          }
        }, /*#__PURE__*/_react.default.createElement(_antd.Icon, {
          type: "close"
        })));
      }))))));
    }
  }]);

  return Index;
}(_react.default.Component);

Index.defaultProps = {
  disabled: false,
  // 是否禁用
  multiple: false,
  // 是否多选
  regionType: 'area',
  // 支持 省province  市city  区area
  simple: true // 支持 simple true返回id或id组成的数组，false返回区域对象或区域对象组成的数组

};
Index.formatRegion = _region.default.formatRegion;
var _default = Index;
exports.default = _default;