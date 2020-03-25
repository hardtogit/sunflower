"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("whatwg-fetch");

var _base = _interopRequireDefault(require("./base"));

var _middlewares2 = _interopRequireDefault(require("./middlewares"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

// import { fetch } from 'whatwg-fetch';
var defaults = {
  middlewares: [_middlewares2["default"].requestDomain(), _middlewares2["default"].requestQuery(), _middlewares2["default"].requestHeader(), _middlewares2["default"].requestDataTransform(), _middlewares2["default"].requestErrorHandler(), _middlewares2["default"].responseStatus(), _middlewares2["default"].responseJson(), _middlewares2["default"].responseDataStatus(), _middlewares2["default"].responseAuthorityValidator(), _middlewares2["default"].responseErrorHandler(), //需要时打开
  _middlewares2["default"].responseDataContent()],
  config: {
    domain: '',
    servers: {},
    contentType: 'form'
  }
};

var Http =
/*#__PURE__*/
function (_BaseHttp) {
  _inherits(Http, _BaseHttp);

  function Http() {
    var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, Http);

    return _possibleConstructorReturn(this, _getPrototypeOf(Http).call(this, _config, [].concat(_toConsumableArray(defaults.middlewares), _toConsumableArray(_middlewares))));
  }

  _createClass(Http, [{
    key: "getRequestInit",
    value: function getRequestInit(args) {
      var requestInit = {};
      var requestInitKeys = ['method', 'headers', 'body', 'referrer', 'mode', 'credentials', 'cache', 'redirect'];
      Object.keys(args).forEach(function (key) {
        requestInitKeys.includes(key) && (requestInit[key] = args[key]);
      });
      return requestInit;
    }
  }, {
    key: "adapt",
    value: function adapt(url, options) {
      return fetch(url, options);
    }
  }]);

  return Http;
}(_base["default"]);

exports["default"] = Http;

function parseArgs() {
  var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (_config instanceof Array) {
    _middlewares = _config;
    _config = {};
  } else if (typeof _config === 'string') {
    _config = {
      domain: _config
    };
  }

  return {
    _config: _config,
    _middlewares: _middlewares
  };
}

Http.create = function () {
  var _parseArgs = parseArgs.apply(void 0, arguments),
      _config = _parseArgs._config,
      _middlewares = _parseArgs._middlewares;

  _config = _objectSpread({}, defaults.config, {}, _config); // _middlewares = [..._middlewares];

  return new Http(_config, _middlewares);
};