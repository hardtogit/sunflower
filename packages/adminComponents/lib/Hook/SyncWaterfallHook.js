"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyncWaterfallHook = void 0;

var _Hook2 = _interopRequireDefault(require("./Hook"));

var _HookCodeFactory2 = _interopRequireDefault(require("./HookCodeFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SyncWaterfallHookCodeFactory =
/*#__PURE__*/
function (_HookCodeFactory) {
  _inherits(SyncWaterfallHookCodeFactory, _HookCodeFactory);

  function SyncWaterfallHookCodeFactory() {
    _classCallCheck(this, SyncWaterfallHookCodeFactory);

    return _possibleConstructorReturn(this, _getPrototypeOf(SyncWaterfallHookCodeFactory).call(this));
  }

  _createClass(SyncWaterfallHookCodeFactory, [{
    key: "content",
    value: function content(_ref) {
      var _this = this;

      var _onError = _ref.onError,
          onResult = _ref.onResult,
          onDone = _ref.onDone,
          rethrowIfPossible = _ref.rethrowIfPossible;
      return this.callTapsSeries({
        onError: function onError(i, err) {
          return _onError(err);
        },
        onResult: function onResult(i, result, next) {
          var code = "";
          code += "if(".concat(result, " !== undefined) {\n");
          code += "".concat(_this._args[0], " = ").concat(result, ";\n");
          code += "}\n";
          code += next();
          return code;
        },
        onDone: function onDone() {
          return onResult(_this._args[0]);
        },
        rethrowIfPossible: rethrowIfPossible
      });
    }
  }]);

  return SyncWaterfallHookCodeFactory;
}(_HookCodeFactory2.default);

var factory = new SyncWaterfallHookCodeFactory();

var SyncWaterfallHook =
/*#__PURE__*/
function (_Hook) {
  _inherits(SyncWaterfallHook, _Hook);

  function SyncWaterfallHook(args) {
    var _this2;

    _classCallCheck(this, SyncWaterfallHook);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SyncWaterfallHook).call(this, args));
    if (args.length < 1) throw new Error("Waterfall hooks must have at least one argument");
    return _this2;
  }

  _createClass(SyncWaterfallHook, [{
    key: "compile",
    value: function compile(options) {
      factory.setup(this, options);
      return factory.create(options);
    }
  }]);

  return SyncWaterfallHook;
}(_Hook2.default); // module.exports = SyncWaterfallHook;


exports.SyncWaterfallHook = SyncWaterfallHook;