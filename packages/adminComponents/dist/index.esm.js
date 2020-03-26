import React, { Component } from 'react';
import { AutoComplete, Input, InputNumber, Tabs, Tag, Icon, Form, Row, Col, Button, Select, DatePicker } from 'antd';
import PropTypes from 'prop-types';
import type from '@sunflower/core/lib/utils/type';
import Trigger from 'rc-trigger';
import classNames from 'classnames';
import regionApi$1 from '@sunflower/core/lib/region';
import regionApi from '@sunflower/core/lib/region/';
import _ from 'lodash';
import { nextTick } from '@sunflower/core/lib/utils/nextTick';
import moment from 'moment';

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
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

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
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

function _createSuper(Derived) {
  return function () {
    var Super = _getPrototypeOf(Derived),
        result;

    if (_isNativeReflectConstruct()) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var Option = AutoComplete.Option;
/**
 * 选择可搜索
 */

var Index = /*#__PURE__*/function (_Component) {
  _inherits(Index, _Component);

  var _super = _createSuper(Index);

  _createClass(Index, null, [{
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

  function Index(props) {
    var _this;

    _classCallCheck(this, Index);

    _this = _super.call(this, props);
    _this.state = {
      value: undefined,
      dataSource: []
    };
    _this.timer = null;
    return _this;
  }

  _createClass(Index, [{
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

      var aProps = _objectSpread2({}, this.props, {
        onSearch: function onSearch(keyword) {
          _this4.handleSearch(keyword);
        },
        dataSource: dataSource.map(function (_ref) {
          var key = _ref.key,
              label = _ref.label;
          return /*#__PURE__*/React.createElement(Option, {
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

      return /*#__PURE__*/React.createElement(AutoComplete, aProps, /*#__PURE__*/React.createElement(Input, aProps.input));
    }
  }]);

  return Index;
}(Component);

var InputNumberGroup = /*#__PURE__*/function (_React$Component) {
  _inherits(InputNumberGroup, _React$Component);

  var _super = _createSuper(InputNumberGroup);

  function InputNumberGroup(props) {
    var _this;

    _classCallCheck(this, InputNumberGroup);

    _this = _super.call(this, props);

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

    var _value = !type.isEmpty(props.value) ? props.value : '';

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

      var inputNumberProps = _objectSpread2({}, this.props, {
        value: state.value,
        onChange: this.handleChange
      });

      return /*#__PURE__*/React.createElement("span", {
        className: "ant-input-group-wrapper"
      }, /*#__PURE__*/React.createElement("span", {
        className: "ant-input-wrapper ant-input-group"
      }, addonBefore && /*#__PURE__*/React.createElement("span", {
        className: "ant-input-group-addon"
      }, addonBefore), /*#__PURE__*/React.createElement(InputNumber, _extends({
        style: {
          padding: 0
        },
        className: "ant-input"
      }, inputNumberProps)), addonAfter && /*#__PURE__*/React.createElement("span", {
        className: "ant-input-group-addon"
      }, addonAfter)));
    }
  }]);

  return InputNumberGroup;
}(React.Component);

InputNumberGroup.defaultProps = {
  addonBefore: '',
  addonAfter: ''
};
InputNumberGroup.propTypes = {
  addonBefore: PropTypes.string,
  addonAfter: PropTypes.string
}; // InputNumberGroup.Scope = Scope;

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

var Index$1 = /*#__PURE__*/function (_React$Component) {
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
      return /*#__PURE__*/React.createElement("div", {
        className: "cityPicker"
      }, /*#__PURE__*/React.createElement(Tabs, {
        defaultActiveKey: "province",
        activeKey: activeKey,
        size: "small",
        tabBarStyle: {
          marginBottom: '0'
        },
        onTabClick: this.handleTabClick
      }, /*#__PURE__*/React.createElement(TabPane, {
        tab: "\u7701",
        key: "province",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, provinceList.map(function (value) {
        return /*#__PURE__*/React.createElement(Tag, {
          style: value.id === provinceId ? _objectSpread2({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'province');
          }
        }, value.name);
      })), (regionType === 'area' || regionType === 'city') && /*#__PURE__*/React.createElement(TabPane, {
        tab: "\u5E02",
        key: "city",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, cityList.map(function (value) {
        return /*#__PURE__*/React.createElement(Tag, {
          style: value.id === cityId ? _objectSpread2({}, tabStyle, {}, tabActiveStyle) : tabStyle,
          key: value.id,
          onClick: function onClick() {
            return _this2.handleChoice(value, 'city');
          }
        }, value.name);
      })), regionType === 'area' && /*#__PURE__*/React.createElement(TabPane, {
        tab: "\u533A",
        key: "area",
        style: {
          padding: '4px 10px 10px 10px'
        }
      }, areaList.map(function (value) {
        return /*#__PURE__*/React.createElement(Tag, {
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

var Index$2 = /*#__PURE__*/function (_React$Component) {
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
      var regionData = regionApi$1.formatRegion(value, regionType);

      if (!Array.isArray(regionData)) {
        if (regionData) {
          regionData = [regionData];
        } else {
          regionData = [];
        }
      }

      return /*#__PURE__*/React.createElement(Trigger, _extends({}, this.props, {
        action: ['click'],
        popup: /*#__PURE__*/React.createElement(Index$1, _extends({}, this.props, {
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
      }), /*#__PURE__*/React.createElement("div", {
        onClick: this.triggerSelect,
        className: classNames(['ant-select', disabled ? 'ant-select-disabled' : 'ant-select-enabled']),
        style: {
          width: '100%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "ant-select-selection ant-select-selection--multiple"
      }, /*#__PURE__*/React.createElement("div", {
        className: "ant-select-selection__rendered"
      }, (!value || value.length === 0) && /*#__PURE__*/React.createElement("div", {
        className: "ant-select-selection__placeholder"
      }, "\u8BF7\u9009\u62E9\u5730\u5740"), /*#__PURE__*/React.createElement("ul", null, regionData.map(function (value, index) {
        return /*#__PURE__*/React.createElement("li", {
          key: index,
          className: "ant-select-selection__choice"
        }, /*#__PURE__*/React.createElement("div", {
          className: "ant-select-selection__choice__content"
        }, value.name), /*#__PURE__*/React.createElement("div", {
          className: "ant-select-selection__choice__remove",
          onClick: function onClick(e) {
            e.stopPropagation();

            _this2.handleRemove(value.id);
          }
        }, /*#__PURE__*/React.createElement(Icon, {
          type: "close"
        })));
      }))))));
    }
  }]);

  return Index;
}(React.Component);

Index$2.defaultProps = {
  disabled: false,
  // 是否禁用
  multiple: false,
  // 是否多选
  regionType: 'area',
  // 支持 省province  市city  区area
  simple: true // 支持 simple true返回id或id组成的数组，false返回区域对象或区域对象组成的数组

};
Index$2.formatRegion = regionApi$1.formatRegion;

var _require = require("tapable"),
    SyncHook = _require.SyncHook,
    SyncBailHook = _require.SyncBailHook,
    SyncWaterfallHook = _require.SyncWaterfallHook,
    AsyncSeriesHook = _require.AsyncSeriesHook;

var FormItem = Form.Item;
var itemLayout = {
  itemCol: {
    xxl: {
      span: 6
    },
    xl: {
      span: 8
    },
    md: {
      span: 12
    }
  },
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
};
/**
 * 表单构建器
 */

var Compiler = /*#__PURE__*/function () {
  function Compiler() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Compiler);

    this.hooks = {
      // 配置修改可以传递
      config: new SyncWaterfallHook(['fields']),
      install: new SyncHook(['fieldTypes']),
      make: new SyncHook(['elements', 'btnElements']),
      layout: new SyncBailHook(['formEles', 'elements', 'btns']),
      change: new SyncWaterfallHook(['prop', 'val', 'values']),
      validator: new AsyncSeriesHook(['form']),
      submit: new SyncWaterfallHook(['source', 'values']),
      rev: new SyncHook(['values']),
      more: new SyncHook(['type'])
    }; // 格式化配置参数

    this.fields = options.fields;
    this.btns = options.btns || [];
    this.fieldTypes = {};
    this.plugins = options.plugins || [];
    this.elements = [];
    this.btnElements = [];
    this.formEles = null;
    this.form = options.form;
    this.num = options.num;
    this.more = options.more;
    this.moreType = true;
    this.btnColLayout = options.btnColLayout;

    this.layoutFn = options.layoutFn || function (r) {
      return r;
    };
  }

  _createClass(Compiler, [{
    key: "install",
    value: function install() {
      var _this = this;

      if (Array.isArray(this.plugins) && this.plugins.length > 0) {
        this.plugins.forEach(function (plugins) {
          if (typeof plugins === 'function') {
            plugins(_this);
          } else if (_typeof(plugins) === 'object') {
            plugins.apply && plugins.apply(_this);
          }
        });
      }

      this.fields = this.hooks.config.call(this.fields); // this.num || ( this.num= this.fields.length);

      this.hooks.install.call(this.fieldTypes);
    }
  }, {
    key: "handle",
    value: function handle(source, noValidator) {
      var _this2 = this;

      // 所有的按钮提交必须走表单验证
      // 重置 不走表单验证
      if (source === 'Reset' || noValidator) {
        source === 'Reset' && this.form.resetFields();
        this.hooks.submit.call(source, this.form.getFieldsValue());
        return;
      }

      this.hooks.validator.callAsync(this.form, function (err) {
        if (!err) {
          _this2.hooks.submit.call(source, _this2.form.getFieldsValue());
        }
      });
    }
  }, {
    key: "layout",
    value: function layout() {
      var _this3 = this;

      // 最初的元素集合
      var elements = this.elements;
      console.log(elements);
      var btnElements = this.btnElements;
      var getFieldDecorator = this.form.getFieldDecorator;
      var dfStyle = {
        marginLeft: '9px'
      };

      var btnColLayout = this.btnColLayout || _objectSpread2({}, itemLayout.itemCol, {}, elements[0].field.ColLayout); // let visDom;


      if (elements.length) {
        this.formEles = /*#__PURE__*/React.createElement(Form, null, /*#__PURE__*/React.createElement(Row, null, (!(this.more && this.moreType) ? elements : elements.slice(0, this.num)).map(function (_ref) {
          var ele = _ref.ele,
              field = _ref.field;

          var colLayout = _objectSpread2({}, itemLayout.itemCol, {}, field.ColLayout);

          var span = parseInt(24 / ele.length, 10);
          var layoutFn = field.layoutFn || _this3.layoutFn;
          return /*#__PURE__*/React.createElement(Col, _extends({}, colLayout, {
            key: Array.isArray(field.key) ? field.key.join(',') : field.key
          }), !Array.isArray(ele) ? /*#__PURE__*/React.createElement(FormItem, _extends({
            label: field.name
          }, layoutFn(itemLayout)), getFieldDecorator(field.key, _objectSpread2({}, field.formItemProps || {}))(ele)) : /*#__PURE__*/React.createElement(FormItem, _extends({
            label: field.name
          }, layoutFn(itemLayout)), /*#__PURE__*/React.createElement(Row, null, ele.map(function (it, idx) {
            return /*#__PURE__*/React.createElement(Col, {
              span: span,
              key: field.key[idx]
            }, getFieldDecorator(field.key[idx], {
              initialValue: field.initialValue[idx] || undefined,
              rules: field.rules[idx] || []
            })(it));
          }))));
        }), this.more && /*#__PURE__*/React.createElement(Col, {
          span: 24
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            textAlign: 'right',
            paddingRight: 40
          }
        }, /*#__PURE__*/React.createElement(Button, {
          type: "link",
          onClick: function onClick() {
            return _this3.hooks.more.call(_this3.moreType);
          }
        }, /*#__PURE__*/React.createElement(Icon, {
          type: this.moreType ? 'down' : 'up'
        }), " ", this.moreType ? '更多条件' : '收起'))), /*#__PURE__*/React.createElement(Col, btnColLayout, /*#__PURE__*/React.createElement(Row, btnColLayout && btnColLayout.rows, /*#__PURE__*/React.createElement(Col, _extends({
          offset: btnColLayout.offSetSpan || btnColLayout.offSetSpan === 0 ? btnColLayout.offSetSpan : itemLayout.labelCol.span,
          style: {
            marginBottom: '24px'
          }
        }, btnColLayout && btnColLayout.cols), // btns
        btnElements.map(function (_ref2, idx) {
          var type = _ref2.type,
              style = _ref2.style,
              source = _ref2.source,
              title = _ref2.title,
              noValidator = _ref2.noValidator;
          var btnPros = {
            type: type,
            onClick: function onClick() {
              return _this3.handle(source, noValidator);
            },
            style: style
          };
          return /*#__PURE__*/React.createElement(Button, _extends({}, btnPros, {
            style: _objectSpread2({}, idx !== 0 ? dfStyle : {}, {}, style),
            key: source
          }), title);
        }))))));
      } // 布局交给用户自己去整理


      var layout = this.hooks.layout.call(this.formEles, this.elements, this.btnElements);
      return layout || this.formEles;
    }
  }, {
    key: "make",
    value: function make() {
      var _this4 = this;

      var fieldTypes = this.fieldTypes;
      var fields = this.fields;
      var btns = this.btns;

      if (fields.length) {
        fields.forEach(function (field) {
          field.onChange = function (args) {
            nextTick(function () {
              _this4.hooks.change.call(field.key, args, _this4.form.getFieldsValue());
            });
          };

          console.log(fieldTypes);

          _this4.elements.push({
            ele: Array.isArray(field.type) ? field.type.map(function (type, idx) {
              return fieldTypes[type](_objectSpread2({}, field, {
                placeholder: field.placeholders[idx]
              }));
            }) : fieldTypes[field.type](field),
            native: fieldTypes[field.type],
            field: field,
            group: field.group
          });
        });
      }

      if (btns.length) {
        btns.forEach(function (_ref3) {
          var type = _ref3.type,
              source = _ref3.source,
              style = _ref3.style,
              title = _ref3.title,
              noValidator = _ref3.noValidator;

          _this4.btnElements.push({
            type: type,
            source: source,
            style: style,
            title: title,
            noValidator: noValidator
          });
        });
      }

      this.hooks.make.call(this.elements, this.btnElements);
    }
  }, {
    key: "run",
    value: function run() {
      return this.layout();
    }
  }]);

  return Compiler;
}();

var Format = {
  DATE: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm:ss',
  MONTH: 'YYYY-MM'
}; // 支持格式 moment、date、时间戳(数值或者number)、IOS9601/RFC2822日期格式

function toMoment(value, format) {
  var momentValue;

  var isNumber = _.isNumber(value);

  var isMoment = moment.isMoment(value);

  var isString = _.isString(value);

  var isNotNaN = !_.isNaN(value);
  var isDate = value instanceof Date;
  var isDefaultFormat = Object.values(Format).includes(format); // 忽略[]或{}的情况

  if (!value && _.isEmpty(value)) return null;

  if (isMoment) {
    momentValue = value;
  } else if (isDate || isNumber) {
    momentValue = moment(value);
  } else if (isString && isNotNaN && isDefaultFormat) {
    // 判断isDefaultFormat 主要是为了避免格式为数字型format时，也被强转为number，比如: 2012.12
    momentValue = moment(parseInt(value, 10));
  } else {
    momentValue = moment(value, format);
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

var Option$1 = Select.Option;

function getPlaceholder(_ref) {
  var type = _ref.type,
      name = _ref.name;
  var dot = '';

  switch (type) {
    case 'select':
    case 'date':
    case 'enum':
    case 'dateRange':
    default:
      dot = '输入';
      break;
  }

  return "\u8BF7".concat(dot).concat(name);
}

var elementTypePlugin = /*#__PURE__*/function () {
  function elementTypePlugin() {
    _classCallCheck(this, elementTypePlugin);

    this.options = {
      text: function text(field) {
        return /*#__PURE__*/React.createElement(Input, _extends({
          placeholder: getPlaceholder(field)
        }, field.fieldProps));
      },
      textarea: function textarea(field) {
        return /*#__PURE__*/React.createElement(Input.TextArea, _extends({
          placeholder: getPlaceholder(field)
        }, field.fieldProps));
      },
      number: function number(field) {
        return /*#__PURE__*/React.createElement(InputNumber, _extends({
          placeholder: getPlaceholder(field),
          style: {
            width: '100%'
          }
        }, field.fieldProps));
      },
      dateRange: function dateRange(field) {
        return /*#__PURE__*/React.createElement(DatePicker.RangePicker, field.fieldProps);
      },
      date: function date(field) {
        return /*#__PURE__*/React.createElement(DatePicker, _extends({
          placeholder: getPlaceholder(field)
        }, field.fieldProps));
      },
      month: function month(field) {
        return /*#__PURE__*/React.createElement(DatePicker.MonthPicker, _extends({
          placeholder: getPlaceholder(field)
        }, field.fieldProps));
      },
      enum: function _enum(field) {
        var options = [];
        field.enums && Object.keys(field.enums).forEach(function (key) {
          if (field.enums[key] === '全部') {
            options.unshift( /*#__PURE__*/React.createElement(Option$1, {
              value: key,
              key: key
            }, " ", field.enums[key]));
          } else {
            options.push( /*#__PURE__*/React.createElement(Option$1, {
              value: key,
              key: key
            }, " ", field.enums[key]));
          }
        });
        return /*#__PURE__*/React.createElement(Select, _extends({
          style: {
            width: '100%'
          },
          placeholder: getPlaceholder(field)
        }, field.fieldProps), options);
      }
    };
  }

  _createClass(elementTypePlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var _this = this;

      compiler.hooks.install.tap('ElementTypePugin', function (fieldsTypes) {
        Object.keys(_this.options).forEach(function (type) {
          fieldsTypes[type] = function (field) {
            // 自动添加onChange监听 触发change hook 帮助联动性处理
            var fieldCopy = _objectSpread2({}, field);

            delete fieldCopy.ColLayout;
            return _this.options[type](fieldCopy);
          };
        });
      });
    }
  }]);

  return elementTypePlugin;
}();

/**
 * 验证插件
 */
function validatorPlugin(compiler) {
  compiler.hooks.validator.tapAsync('validatorPlugin', function (form, callback) {
    form.validateFieldsAndScroll(function (err, values) {
      callback(err, values);
    });
  });
}
function extraRulePlugin(compiler) {
  var form = compiler.form;
  compiler.hooks.config.tap('extraRulePlugin', function (fileds) {
    return fileds.map(function (field) {
      if (field.extraRule && field.rules && field.rules.length > 0) {
        field.rules.forEach(function (vl) {
          if (vl.validator) {
            var oldFn = vl.validator;

            vl.validator = function (rule, value, callback) {
              oldFn(rule, value, callback, form);
            };
          }
        });
      }

      return field;
    });
  });
}

var Patter = 'YYYY-MM-DD HH:mm:ss';
var BeginPatter = 'YYYY-MM-DD 00:00:00';
var EndPatter = 'YYYY-MM-DD 23:59:59'; // const Ratter = 'YYYY-MM-DD';

var Mpatter = 'YYYY-MM';
var Factory = {
  date: function date(val) {
    return val.format(Patter);
  },
  dateRange: function dateRange(val) {
    return val.map(function (v, i) {
      return i === 0 ? "".concat(v.format(BeginPatter)) : "".concat(v.format(EndPatter));
    });
  },
  month: function month(val) {
    return val.format(Mpatter);
  } // cityPicker: val=>

};
/**
 * 格式化参数
 * @param {*} compier
 */

function formteParamPugin(compier) {
  compier.hooks.submit.tap('formteParamPugin', function (source, values) {
    if (!values) return {
      source: source
    };
    var fieldsMap = compier.fields.reduce(function (p, v) {
      p[v.key] = v;
      return p;
    }, {});
    return {
      source: source,
      values: Object.keys(values).reduce(function (prev, next) {
        var field = fieldsMap[next];

        if (field && Factory[field.type] && values[next]) {
          prev[next] = Factory[field.type](values[next]);
        } else {
          prev[next] = values[next];
        }

        return prev;
      }, {})
    };
  });
}

/**
 * 干掉查询空格
 */

function trimStringPugin(compiler) {
  compiler.hooks.submit.tap('trimStringPugin', function (target) {
    if (!target.values) {
      return target;
    }

    Object.keys(target.values).forEach(function (key) {
      var val = target.values[key];

      if (val && typeof val === 'string') {
        target.values[key] = val.trim();
      }
    });
    return target;
  });
}
/**
 * 干掉参数中存在的 为空的参数
 * @param {} compiler
 */

function trimParamPugin(compiler) {
  compiler.hooks.submit.tap('trimParamPugin', function (target) {
    if (!target.values) {
      return target;
    }

    Object.keys(target.values).forEach(function (key) {
      var val = target.values[key];

      if (_.isEmpty(val) || Array.isArray(val) && val.length === 0) {
        delete target.values[key];
      }
    });
    return target;
  });
}

function moreQueryPlugins(compiler) {
  compiler.hooks.more.tap('moreQueryPlugins', function (type) {
    compiler.moreType = !type;
    compiler.hooks.submit.call('MoreQuery');
  });
}

/**
 * 插件集合
 */

var plugins = [extraRulePlugin, formate, new elementTypePlugin(), validatorPlugin, formteParamPugin, trimStringPugin, trimParamPugin, moreQueryPlugins];

var _dec, _class;
/**
 * 统一表单生成器
 */

var FormHook = (_dec = Form.create(), _dec(_class = /*#__PURE__*/function (_React$Component) {
  _inherits(FormHook, _React$Component);

  var _super = _createSuper(FormHook);

  function FormHook(props) {
    var _this;

    _classCallCheck(this, FormHook);

    _this = _super.call(this, props);
    _this.compiler = new Compiler({
      fields: props.fields,
      btns: props.btns,
      form: props.form,
      plugins: [].concat(_toConsumableArray(plugins), _toConsumableArray(props.plugins || [])),
      num: props.num,
      more: props.more,
      btnColLayout: props.btnColLayout,
      layoutFn: props.layoutFn
    });
    _this.state = {
      type: true
    };
    return _this;
  }

  _createClass(FormHook, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      this.compiler.install();
      this.compiler.make();
      this.handle();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      // 接受处理给表单设置值
      // console.log(nextProps.search,);
      var search = nextProps.search;

      if (!!search && Object.keys(search).length > 0 && this.props.search !== search && !_.isEqual(this.props.search, search)) {
        // const values = form.getFieldsValue();
        // if (!looseEqual(search, values)) {
        // 当 search 和 values 不相等 才有赋值的
        // 这里不再进行form的value和当前 search的比较 如果需要判断将这块逻辑纳入到插件
        this.compiler.hooks.rev.call(search); // }
      }
    }
  }, {
    key: "handle",
    value: function handle() {
      var _this2 = this;

      var _this$props = this.props,
          onSearch = _this$props.onSearch,
          handler = _this$props.handler;
      var compiler = this.compiler; // 将表单的按钮回调全部返回回去

      compiler.hooks.submit.tap('CallBack', function (_ref) {
        var source = _ref.source,
            values = _ref.values;

        if (source === 'Submit' || source === 'Reset') {
          onSearch(values, source);
        } else if (source === 'MoreQuery') {
          _this2.setState({
            type: !_this2.state.type
          });
        } else {
          handler(source, values);
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.compiler.run();
    }
  }]);

  return FormHook;
}(React.Component)) || _class);

var index = {
  AutoComponent: Index,
  InputNumberGroup: InputNumberGroup,
  City: Index$2,
  FormHook: FormHook
};

export default index;
