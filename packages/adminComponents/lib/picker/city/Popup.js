"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _region = _interopRequireDefault(require("@sunflower/core/lib/region/"));

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var TabPane = _antd.Tabs.TabPane;
var tabStyle = {
  marginTop: '6px',
  cursor: 'pointer'
};
var tabActiveStyle = {
  backgroundColor: '#1890ff',
  color: '#fff',
  borderColor: 'transparent'
};

var Index = /*#__PURE__*/function (_React$Component) {
  _inherits(Index, _React$Component);

  var _super = _createSuper(Index);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);

    _this.handleChoice = function (value, type) {
      var _this$props = _this.props,
          regionType = _this$props.regionType,
          handleSelect = _this$props.handleSelect,
          triggerSelect = _this$props.triggerSelect;

      switch (type) {
        case 'province':
          if (regionType === 'province') {
            handleSelect(value.id);
            triggerSelect();
            return;
          }

          _this.setState({
            cityList: _region.default.findChildrenById(value.id),
            areaList: [],
            activeKey: 'city',
            provinceId: value.id,
            cityId: '',
            areaId: ''
          });

          break;

        case 'city':
          if (regionType === 'city') {
            handleSelect(value.id);
            triggerSelect();
            return;
          }

          _this.setState({
            areaList: _region.default.findChildrenById(value.id),
            activeKey: 'area',
            cityId: value.id,
            areaId: ''
          });

          break;

        case 'area':
          if (regionType === 'area') {
            handleSelect(value.id);
            triggerSelect();
            return;
          }

          _this.setState({
            areaId: value.id
          });

          break;

        default:
          break;
      }
    };

    _this.handleTabClick = function (tab) {
      _this.setState({
        activeKey: tab
      });
    };

    _this.state = {
      // visible: false,
      activeKey: 'province',
      provinceList: _region.default.findChildrenById(0),
      cityList: [],
      areaList: [],
      provinceId: '',
      cityId: '',
      areaId: ''
    };
    return _this;
  }

  _createClass(Index, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          provinceList = _this$state.provinceList,
          cityList = _this$state.cityList,
          areaList = _this$state.areaList,
          activeKey = _this$state.activeKey,
          provinceId = _this$state.provinceId,
          cityId = _this$state.cityId,
          areaId = _this$state.areaId;
      var regionType = this.props.regionType;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "cityPicker"
      }, /*#__PURE__*/_react.default.createElement(_antd.Tabs, {
        defaultActiveKey: "province",
        activeKey: activeKey,
        size: "small",
        tabBarStyle: {
          marginBottom: '0'
        },
        onTabClick: this.handleTabClick
      }, /*#__PURE__*/_react.default.createElement(TabPane, {
        tab: "\u7701",
        key: "province",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, provinceList.map(function (value) {
        return /*#__PURE__*/_react.default.createElement(_antd.Tag, {
          style: value.id === provinceId ? _objectSpread({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'province');
          }
        }, value.name);
      })), (regionType === 'area' || regionType === 'city') && /*#__PURE__*/_react.default.createElement(TabPane, {
        tab: "\u5E02",
        key: "city",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, cityList.map(function (value) {
        return /*#__PURE__*/_react.default.createElement(_antd.Tag, {
          style: value.id === cityId ? _objectSpread({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'city');
          }
        }, value.name);
      })), regionType === 'area' && /*#__PURE__*/_react.default.createElement(TabPane, {
        tab: "\u533A",
        key: "area",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, areaList.map(function (value) {
        return /*#__PURE__*/_react.default.createElement(_antd.Tag, {
          style: value.id === areaId ? _objectSpread({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'area');
          }
        }, value.name);
      }))));
    }
  }]);

  return Index;
}(_react.default.Component);

var _default = Index;
exports.default = _default;