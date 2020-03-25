"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.tabContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _page = require("../page/");

require("./index.module.less");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TabPane = _antd.Tabs.TabPane;
var tabContext = (0, _react.createContext)({
  remove: function remove() {}
});
exports.tabContext = tabContext;

var TabLayout =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TabLayout, _React$Component);

  _createClass(TabLayout, null, [{
    key: "getDerivedStateFromProps",
    // 更新tab
    value: function getDerivedStateFromProps(nextProps, state) {
      var panes = state.panes;
      var location = nextProps.location,
          content = nextProps.content,
          menuMapKeys = nextProps.menuMapKeys,
          getMenuPath = nextProps.getMenuPath;
      var path = getMenuPath(location.pathname);
      var currentMenu = menuMapKeys.get(path);

      if (currentMenu.key === state.activeKey) {
        return null;
      }

      if (state.panes.get(currentMenu.key)) {
        var it = state.panes.get(currentMenu.key);
        state.panes.set(currentMenu.key, _objectSpread({}, it, {
          pathname: location.pathname
        }));
        return {
          activeKey: currentMenu.key
        };
      }

      return {
        panes: panes.set(currentMenu.key, _objectSpread({}, currentMenu, {
          content: content,
          pathname: location.pathname
        })),
        activeKey: currentMenu.key
      };
    }
  }]);

  function TabLayout(props) {
    var _this;

    _classCallCheck(this, TabLayout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TabLayout).call(this, props));

    _this.onChange = function (activeKey) {
      var menu = _this.state.panes.get(activeKey);

      _this.props.push(menu.pathname);
    };

    _this.onEdit = function (targetKey, action) {
      _this[action](targetKey);
    };

    _this.onContextMenu = function (e, DefaultTabBarProps) {
      // const { panes} = this.state;
      // console.log(DefaultTabBarProps);
      _this.opKey = DefaultTabBarProps.key;
      e.preventDefault();
      _this.contextMenuLeft = e.clientX;
      _this.contextMenuTop = e.clientY;

      _this.setState({
        contextMenu: true
      });
    };

    _this.reLoad = function (panes) {
      // console.error(this.opKey, panes.get(this.opKey));
      // return ;
      var getCurrentMenu = _this.props.getCurrentMenu;
      panes.set(_this.opKey, _objectSpread({}, panes.get(_this.opKey), {
        content: _react.default.createElement("div", null)
      }));

      _this.setState({
        panes: panes
      });

      var menu = getCurrentMenu(_this.opKey);

      var CurrentComponent = function CurrentComponent() {
        return _react.default.createElement("div", null);
      };

      _this.props.route.routes.forEach(function (item) {
        if (menu.path === item.path) {
          CurrentComponent = item.component;
        }
      });

      setTimeout(function () {
        panes.set(_this.opKey, _objectSpread({}, panes.get(_this.opKey), {
          content: _react.default.createElement(CurrentComponent, null)
        }));

        _this.setState({
          panes: panes
        });
      }, 0);
    };

    _this.closeTab = function (type) {
      var _this$state = _this.state,
          panes = _this$state.panes,
          activeKey = _this$state.activeKey;

      var keyArr = _toConsumableArray(panes.keys());

      var deleteKey = [];

      if (type === 'left') {
        deleteKey = keyArr.slice(0, keyArr.indexOf(_this.opKey));
      } else {
        deleteKey = keyArr.slice(keyArr.indexOf(_this.opKey) + 1, keyArr.length + 1);
      }

      deleteKey = deleteKey.filter(function (key) {
        return key !== activeKey;
      });
      deleteKey.forEach(function (key) {
        panes.delete(key);
      });

      _this.setState({
        panes: panes
      });
    };

    _this.remove = function (targetKey) {
      var _this$state2 = _this.state,
          panes = _this$state2.panes,
          activeKey = _this$state2.activeKey;
      var push = _this.props.push;
      var nextKey = activeKey;
      panes.delete(targetKey);
      var len = panes.size; // let last

      if (activeKey === targetKey && len > 0) {
        nextKey = Array.from(panes.keys())[len - 1];
      } else if (len === 0) {
        return push('/');
      }

      var menu = panes.get(nextKey);
      push(menu.pathname);
      return _assertThisInitialized(_this);
    };

    _this.findTab = function (key) {
      return _this.state.panes.get(key);
    };

    _this.state = {
      panes: new Map(),
      contextMenu: false
    };
    _this.contextMenuLeft = 0;
    _this.contextMenuTop = 0;
    _this.opKey = '';
    return _this;
  }

  _createClass(TabLayout, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.addEventListener('click', function () {
        if (_this2.state.contextMenu) {
          _this2.setState({
            contextMenu: false
          });
        }
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this3 = this;

      window.removeEventListener('click', function () {
        _this3.setState({
          contextMenu: false
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$state3 = this.state,
          panes = _this$state3.panes,
          activeKey = _this$state3.activeKey,
          contextMenu = _this$state3.contextMenu;
      return _react.default.createElement(_react.default.Fragment, null, contextMenu && _react.default.createElement("div", {
        className: "contextMenu",
        style: {
          left: this.contextMenuLeft,
          top: this.contextMenuTop
        }
      }, _react.default.createElement("ul", null, _react.default.createElement("li", {
        onClick: function onClick() {
          return _this4.reLoad(panes);
        }
      }, "\u5237\u65B0\u5F53\u524D\u9875"), _react.default.createElement("li", {
        onClick: function onClick() {
          return _this4.closeTab('left');
        }
      }, "\u5173\u95ED\u5DE6\u4FA7\u6807\u7B7E"), _react.default.createElement("li", {
        onClick: function onClick() {
          return _this4.closeTab('right');
        }
      }, "\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E"))), _react.default.createElement(_antd.Tabs, {
        hideAdd: true,
        onChange: this.onChange,
        activeKey: activeKey,
        type: "editable-card",
        renderTabBar: function renderTabBar(DefaultTabBarProps, DefaultTabBar) {
          return _react.default.createElement(DefaultTabBar, DefaultTabBarProps, function (node, i) {
            return _react.default.createElement("span", {
              onContextMenu: function onContextMenu(e) {
                _this4.onContextMenu(e, node);
              },
              key: i
            }, node);
          });
        },
        onEdit: this.onEdit,
        style: {
          backgroundColor: '#fff'
        },
        tabBarStyle: {
          margin: '0',
          backgroundColor: '#eee'
        }
      }, _toConsumableArray(panes.values()).map(function (pane) {
        return _react.default.createElement(TabPane, {
          tab: pane.title,
          key: pane.key,
          closable: pane.closable
        }, _react.default.createElement(_page.Page, {
          inner: true,
          out: !pane.isFull
        }, _react.default.createElement(tabContext.Provider, {
          value: {
            remove: _this4.remove,
            find: _this4.findTab
          }
        }, pane.content)));
      })));
    }
  }]);

  return TabLayout;
}(_react.default.Component);

exports.default = TabLayout;