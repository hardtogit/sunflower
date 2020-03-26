"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Compiler = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _nextTick = require("@sunflower/core/lib/utils/nextTick");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("tapable"),
    SyncHook = _require.SyncHook,
    SyncBailHook = _require.SyncBailHook,
    SyncWaterfallHook = _require.SyncWaterfallHook,
    AsyncSeriesHook = _require.AsyncSeriesHook;

var FormItem = _antd.Form.Item;
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

      var btnColLayout = this.btnColLayout || _objectSpread({}, itemLayout.itemCol, {}, elements[0].field.ColLayout); // let visDom;


      if (elements.length) {
        this.formEles = /*#__PURE__*/_react.default.createElement(_antd.Form, null, /*#__PURE__*/_react.default.createElement(_antd.Row, null, (!(this.more && this.moreType) ? elements : elements.slice(0, this.num)).map(function (_ref) {
          var ele = _ref.ele,
              field = _ref.field;

          var colLayout = _objectSpread({}, itemLayout.itemCol, {}, field.ColLayout);

          var span = parseInt(24 / ele.length, 10);
          var layoutFn = field.layoutFn || _this3.layoutFn;
          return /*#__PURE__*/_react.default.createElement(_antd.Col, _extends({}, colLayout, {
            key: Array.isArray(field.key) ? field.key.join(',') : field.key
          }), !Array.isArray(ele) ? /*#__PURE__*/_react.default.createElement(FormItem, _extends({
            label: field.name
          }, layoutFn(itemLayout)), getFieldDecorator(field.key, _objectSpread({}, field.formItemProps || {}))(ele)) : /*#__PURE__*/_react.default.createElement(FormItem, _extends({
            label: field.name
          }, layoutFn(itemLayout)), /*#__PURE__*/_react.default.createElement(_antd.Row, null, ele.map(function (it, idx) {
            return /*#__PURE__*/_react.default.createElement(_antd.Col, {
              span: span,
              key: field.key[idx]
            }, getFieldDecorator(field.key[idx], {
              initialValue: field.initialValue[idx] || undefined,
              rules: field.rules[idx] || []
            })(it));
          }))));
        }), this.more && /*#__PURE__*/_react.default.createElement(_antd.Col, {
          span: 24
        }, /*#__PURE__*/_react.default.createElement("div", {
          style: {
            textAlign: 'right',
            paddingRight: 40
          }
        }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
          type: "link",
          onClick: function onClick() {
            return _this3.hooks.more.call(_this3.moreType);
          }
        }, /*#__PURE__*/_react.default.createElement(_antd.Icon, {
          type: this.moreType ? 'down' : 'up'
        }), " ", this.moreType ? '更多条件' : '收起'))), /*#__PURE__*/_react.default.createElement(_antd.Col, btnColLayout, /*#__PURE__*/_react.default.createElement(_antd.Row, btnColLayout && btnColLayout.rows, /*#__PURE__*/_react.default.createElement(_antd.Col, _extends({
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
          return /*#__PURE__*/_react.default.createElement(_antd.Button, _extends({}, btnPros, {
            style: _objectSpread({}, idx !== 0 ? dfStyle : {}, {}, style),
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
            (0, _nextTick.nextTick)(function () {
              _this4.hooks.change.call(field.key, args, _this4.form.getFieldsValue());
            });
          };

          console.log(fieldTypes);

          _this4.elements.push({
            ele: Array.isArray(field.type) ? field.type.map(function (type, idx) {
              return fieldTypes[type](_objectSpread({}, field, {
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

exports.Compiler = Compiler;