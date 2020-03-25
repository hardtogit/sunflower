import React, { Component, createContext } from 'react';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import regionApi$1 from '@cot/core/lib/region';
import { Tabs, Tag, Icon } from 'antd';
import regionApi from '@cot/core/lib/region/';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ".cityPicker {\r\n    width: 300px;\r\n    background-color: #fff;\r\n    background-clip: padding-box;\r\n    border: 1px solid #fff;\r\n    border-radius: 4px;\r\n    outline: none;\r\n    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\r\n}";
styleInject(css);

var TabPane = Tabs.TabPane;
var tabStyle = {
  marginTop: '6px',
  cursor: 'pointer'
};
var tabActiveStyle = {
  backgroundColor: '#1890ff',
  color: '#fff',
  borderColor: 'transparent'
};

var Index =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Index, _React$Component);

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Index).call(this, props));

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
            cityList: regionApi.findChildrenById(value.id),
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
            areaList: regionApi.findChildrenById(value.id),
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
      provinceList: regionApi.findChildrenById(0),
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
      return React.createElement("div", {
        className: "cityPicker"
      }, React.createElement(Tabs, {
        defaultActiveKey: "province",
        activeKey: activeKey,
        size: "small",
        tabBarStyle: {
          marginBottom: '0'
        },
        onTabClick: this.handleTabClick
      }, React.createElement(TabPane, {
        tab: "\u7701",
        key: "province",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, provinceList.map(function (value) {
        return React.createElement(Tag, {
          style: value.id === provinceId ? _objectSpread2({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'province');
          }
        }, value.name);
      })), (regionType === 'area' || regionType === 'city') && React.createElement(TabPane, {
        tab: "\u5E02",
        key: "city",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, cityList.map(function (value) {
        return React.createElement(Tag, {
          style: value.id === cityId ? _objectSpread2({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'city');
          }
        }, value.name);
      })), regionType === 'area' && React.createElement(TabPane, {
        tab: "\u533A",
        key: "area",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, areaList.map(function (value) {
        return React.createElement(Tag, {
          style: value.id === areaId ? _objectSpread2({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'area');
          }
        }, value.name);
      }))));
    }
  }]);

  return Index;
}(React.Component);

var ContainerContext = React.createContext('');

var Index$1 =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Index$1, _React$Component);

  function Index$1(props) {
    var _this;

    _classCallCheck(this, Index$1);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Index$1).call(this, props));

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
              onChange(regionApi$1.formatRegion(_this.state.value, regionType));
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
              onChange(regionApi$1.formatRegion(_this.state.value, regionType));
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
              onChange(regionApi$1.formatRegion(_this.state.value, regionType));
            }
          }

          if (onSelect) {
            onSelect(regionApi$1.formatRegion(_this.state.value, regionType));
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
              onChange(regionApi$1.formatRegion(_this.state.value, regionType));
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

  _createClass(Index$1, [{
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
      var regionData = regionApi$1.formatRegion(value, regionType);

      if (!Array.isArray(regionData)) {
        if (regionData) {
          regionData = [regionData];
        } else {
          regionData = [];
        }
      }

      return React.createElement(ContainerContext.Consumer, null, function (fn) {
        return React.createElement(Trigger, _extends({}, _this2.props, {
          action: ['click'],
          popup: React.createElement(Index, _extends({}, _this2.props, {
            triggerSelect: _this2.triggerSelect,
            handleSelect: _this2.handleSelect
          })),
          popupVisible: visible,
          destroyPopupOnHide: true // getPopupContainer={fn ||()=>{return document.getElementsByTagName('body')[0];}}
          ,
          popupStyle: {
            zIndex: 1050,
            width: '300px'
          },
          onPopupVisibleChange: _this2.handleDropdownVisibleChange,
          popupAlign: {
            points: ['tl', 'bl'],
            offset: [0, 3]
          }
        }), React.createElement("div", {
          onClick: _this2.triggerSelect,
          className: classNames(['ant-select', disabled ? 'ant-select-disabled' : 'ant-select-enabled']),
          style: {
            width: '100%'
          }
        }, React.createElement("div", {
          className: "ant-select-selection ant-select-selection--multiple"
        }, React.createElement("div", {
          className: "ant-select-selection__rendered"
        }, (!value || value.length === 0) && React.createElement("div", {
          className: "ant-select-selection__placeholder"
        }, "\u8BF7\u9009\u62E9\u5730\u5740"), React.createElement("ul", null, regionData.map(function (value, index) {
          return React.createElement("li", {
            key: index,
            className: "ant-select-selection__choice"
          }, React.createElement("div", {
            className: "ant-select-selection__choice__content"
          }, value.name), React.createElement("div", {
            className: "ant-select-selection__choice__remove",
            onClick: function onClick(e) {
              e.stopPropagation();

              _this2.handleRemove(value.id);
            }
          }, React.createElement(Icon, {
            type: "close"
          })));
        }))))));
      });
    }
  }]);

  return Index$1;
}(React.Component);

Index$1.defaultProps = {
  disabled: false,
  // 是否禁用
  multiple: false,
  // 是否多选
  regionType: 'area',
  // 支持 省province  市city  区area
  simple: true // 支持 simple true返回id或id组成的数组，false返回区域对象或区域对象组成的数组

};
Index$1.formatRegion = regionApi$1.formatRegion;

var css$1 = ".Page-module_contentInner__1grgj {\n  background: #e8eaed;\n  height: calc(100vh - 64px);\n  position: relative;\n  background-color: #fff;\n  overflow-y: auto;\n  overflow-x: hidden;\n}\n.Page-module_containerOut__3bj2f {\n  padding: 15px 20px;\n}\n.Page-module_listPage-searchBar__-tl9d {\n  border: 1px solid #ddd;\n  padding: 24px 0 0 0;\n}\n.Page-module_listPage-table__3AQhC {\n  margin-top: 24px;\n}\n@media (max-width: 767px) {\n  .Page-module_contentInner__1grgj {\n    padding: 12px;\n    min-height: calc(100vh - 160px);\n    background-color: #eaecef;\n  }\n}\n";
styleInject(css$1);

var Page =
/*#__PURE__*/
function (_Component) {
  _inherits(Page, _Component);

  function Page(props) {
    var _this;

    _classCallCheck(this, Page);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Page).call(this, props));
    _this.state = {};
    return _this;
  }

  _createClass(Page, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          className = _this$props.className,
          children = _this$props.children,
          _this$props$loading = _this$props.loading,
          loading = _this$props$loading === void 0 ? false : _this$props$loading,
          _this$props$inner = _this$props.inner,
          inner = _this$props$inner === void 0 ? false : _this$props$inner,
          _this$props$out = _this$props.out,
          out = _this$props$out === void 0 ? true : _this$props$out;
      var loadingStyle = {
        height: 'calc(100vh - 185px)',
        overflow: 'hidden'
      }; // console.log(this.props, styles);

      return React.createElement("div", {
        className: classNames(className, {
          contentInner: inner,
          containerOut: inner && out
        }),
        style: loading ? loadingStyle : null
      }, children);
    }
  }]);

  return Page;
}(Component);

var css$2 = "html,\nbody,\n#root {\n  height: 100%;\n}\n.mt20 {\n  margin-top: 20px;\n}\n.mt10 {\n  margin-top: 10px;\n}\n.mb20 {\n  margin-bottom: 20px;\n}\n.mll0 {\n  margin-left: 10px;\n}\n.ml20 {\n  margin-left: 20px;\n}\n.mr20 {\n  margin-right: 20px;\n}\n.fl {\n  float: left;\n}\n.fr {\n  float: right;\n}\n.actions {\n  margin-bottom: 8px;\n}\n.actions button {\n  margin-right: 5px;\n}\n.text-editor .ant-form-item-control {\n  line-height: normal!important;\n}\n.rc-tree-select {\n  width: 100% !important;\n}\n.rc-tree-select-selection {\n  min-height: 32px;\n  line-height: 32px;\n  border-radius: 4px !important;\n}\n.has-error .rc-tree-select-selection {\n  border-color: #f5222d;\n}\n.ant-breadcrumb {\n  display: none;\n}\n.ant-select-selection--multiple {\n  -ms-overflow-style: none;\n  overflow: -moz-scrollbars-none;\n}\n.ant-select-selection--multiple::-webkit-scrollbar {\n  width: 0 !important;\n  height: 0;\n}\n {\n  background-color: #eee;\n}\n.rc-tree-select-selection--multiple {\n  line-height: 32px;\n  border-radius: 4px;\n}\n.ant-select-tree {\n  height: 200px;\n}\n.index-module_contextMenu__2knql {\n  position: fixed;\n  z-index: 100;\n  left: 200px;\n  padding: 8px 0px;\n  top: 100px;\n  background-color: #fff;\n  border: 1px solid #ddd;\n}\n.index-module_contextMenu__2knql ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.index-module_contextMenu__2knql ul li {\n  font-size: 12px;\n  line-height: 24px;\n  padding: 0 12px;\n}\n.index-module_contextMenu__2knql ul li:hover {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  background-color: #ddd;\n}\n";
styleInject(css$2);

var TabPane$1 = Tabs.TabPane;
var tabContext = createContext({
  remove: function remove() {}
});

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
        state.panes.set(currentMenu.key, _objectSpread2({}, it, {
          pathname: location.pathname
        }));
        return {
          activeKey: currentMenu.key
        };
      }

      return {
        panes: panes.set(currentMenu.key, _objectSpread2({}, currentMenu, {
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
      panes.set(_this.opKey, _objectSpread2({}, panes.get(_this.opKey), {
        content: React.createElement("div", null)
      }));

      _this.setState({
        panes: panes
      });

      var menu = getCurrentMenu(_this.opKey);

      var CurrentComponent = function CurrentComponent() {
        return React.createElement("div", null);
      };

      _this.props.route.routes.forEach(function (item) {
        if (menu.path === item.path) {
          CurrentComponent = item.component;
        }
      });

      setTimeout(function () {
        panes.set(_this.opKey, _objectSpread2({}, panes.get(_this.opKey), {
          content: React.createElement(CurrentComponent, null)
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
      return React.createElement(React.Fragment, null, contextMenu && React.createElement("div", {
        className: "contextMenu",
        style: {
          left: this.contextMenuLeft,
          top: this.contextMenuTop
        }
      }, React.createElement("ul", null, React.createElement("li", {
        onClick: function onClick() {
          return _this4.reLoad(panes);
        }
      }, "\u5237\u65B0\u5F53\u524D\u9875"), React.createElement("li", {
        onClick: function onClick() {
          return _this4.closeTab('left');
        }
      }, "\u5173\u95ED\u5DE6\u4FA7\u6807\u7B7E"), React.createElement("li", {
        onClick: function onClick() {
          return _this4.closeTab('right');
        }
      }, "\u5173\u95ED\u53F3\u4FA7\u6807\u7B7E"))), React.createElement(Tabs, {
        hideAdd: true,
        onChange: this.onChange,
        activeKey: activeKey,
        type: "editable-card",
        renderTabBar: function renderTabBar(DefaultTabBarProps, DefaultTabBar) {
          return React.createElement(DefaultTabBar, DefaultTabBarProps, function (node, i) {
            return React.createElement("span", {
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
        return React.createElement(TabPane$1, {
          tab: pane.title,
          key: pane.key,
          closable: pane.closable
        }, React.createElement(Page, {
          inner: true,
          out: !pane.isFull
        }, React.createElement(tabContext.Provider, {
          value: {
            remove: _this4.remove,
            find: _this4.findTab
          }
        }, pane.content)));
      })));
    }
  }]);

  return TabLayout;
}(React.Component);

export { Index$1 as City, Page, TabLayout };
