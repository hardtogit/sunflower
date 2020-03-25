"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoCompleteComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _core = require("@cot/core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// looseEqual

/**
 * 搜索组件
 */
var TreeNode = _antd.TreeSelect.TreeNode;

var AutoCompleteComponent =
/*#__PURE__*/
function (_Component) {
  _inherits(AutoCompleteComponent, _Component);

  _createClass(AutoCompleteComponent, null, [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if ('value' in props) {
        if (props.value !== state.value) {
          var target = props.value;

          if (_core.utils.isObjStr(target)) {
            target = JSON.parse(target);

            if (!(state.dataSource && state.dataSource.length > 0)) {
              return {
                value: target.label
              };
            }

            return {
              value: target[props.showName || 'name']
            };
          }

          return {
            value: props.value
          };
        }

        return null;
      }

      return null;
    }
  }]);

  function AutoCompleteComponent(props) {
    var _this;

    _classCallCheck(this, AutoCompleteComponent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AutoCompleteComponent).call(this, props));
    _this.state = {
      value: undefined,
      dataSource: []
    };
    _this.timer = null;
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this)); // this.handleSearch = this.handleChange.bind(this);

    return _this;
  }

  _createClass(AutoCompleteComponent, [{
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
          resFilter = _this$props2.resFilter;

      if (key && load) {
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }

        this.timer = window.setTimeout(function () {
          load(key).then(function (result) {
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
    key: "renderNode",
    value: function renderNode() {
      var dataSource = this.state.dataSource;
      return dataSource.map(function (item) {
        var title = _react.default.createElement("span", {
          className: "search-item",
          key: item.value
        }, item.label);

        return _react.default.createElement(TreeNode, {
          value: item.value,
          title: title,
          key: item.value
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var treeNode = this.renderNode();
      return _react.default.createElement(_antd.TreeSelect, _extends({}, this.props, {
        showSearch: true,
        onChange: this.handleChange,
        onSearch: function onSearch(key) {
          return _this4.handleSearch(key);
        },
        filterTreeNode: function filterTreeNode() {
          return true;
        },
        dropdownStyle: {
          maxHeight: 400,
          overflow: 'auto'
        },
        dropdownClassName: "selectAccount",
        value: this.state.value,
        allowClear: true,
        treeDefaultExpandAll: true
      }), treeNode);
    }
  }]);

  return AutoCompleteComponent;
}(_react.Component);

exports.AutoCompleteComponent = AutoCompleteComponent;