"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchFormHook = void 0;

var _react = _interopRequireDefault(require("react"));

var _core = require("@cot/core");

var _antd = require("antd");

var _compiler = require("./compiler");

var _index = _interopRequireDefault(require("./plugins/index"));

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * 统一表单生成器
 * pugins 拼写错误 忽略【plugins】
 */
var SearchFormHook = (_dec = _antd.Form.create(), _dec(_class =
/*#__PURE__*/
function (_React$Component) {
  _inherits(SearchFormHook, _React$Component);

  function SearchFormHook(props) {
    var _this;

    _classCallCheck(this, SearchFormHook);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SearchFormHook).call(this, props));
    _this.compiler = new _compiler.Compiler({
      fields: props.fields,
      btns: props.btns,
      form: props.form,
      pugins: [].concat(_toConsumableArray(_index.default), _toConsumableArray(props.pugins || [])),
      num: props.num,
      more: props.more,
      btnCollayout: props.btnCollayout,
      layoutFn: props.layoutFn
    });
    _this.state = {
      type: true
    }; // this.handle();

    return _this;
  }

  _createClass(SearchFormHook, [{
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

      if (!!search && Object.keys(search).length > 0 && this.props.search !== search && !(0, _core.looseEqual)(this.props.search, search)) {
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

  return SearchFormHook;
}(_react.default.Component)) || _class);
exports.SearchFormHook = SearchFormHook;