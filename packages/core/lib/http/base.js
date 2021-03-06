"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _qs = _interopRequireDefault(require("qs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import middlewares from './middlewares';
var baseFetch = Symbol();
var BIND_KEYS = ['fetch', 'get', 'post', 'del', 'patch', 'adapt', 'put', 'head', baseFetch];
/*
 * http默认配置
 */

var defaults = {
  middlewares: [],
  config: {
    domain: '',
    servers: {},
    contentType: 'form'
  }
};
/*
 * 解析参数
 */

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
/*
 * 通用Http类,提供中间件来扩展
 * 方法: create, get, post, put, del, patch, head
 */


var BaseHttp =
/*#__PURE__*/
function () {
  function BaseHttp() {
    var _this = this;

    var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var _middlewares = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, BaseHttp);

    this.config = _config;
    this.middlewares = _middlewares;
    BIND_KEYS.forEach(function (key) {
      _this[key] = _this[key].bind(_this);
    }); // console.log('--------chonmx ');
  }
  /*
   * 创建新的http实例，新的实例会继承当前实例的config & middlewares;
   */


  _createClass(BaseHttp, [{
    key: "create",
    value: function create() {
      var _parseArgs = parseArgs.apply(void 0, arguments),
          _config = _parseArgs._config,
          _middlewares = _parseArgs._middlewares;

      _config = _objectSpread({}, this.config, {}, _config);
      _middlewares = [].concat(_toConsumableArray(this.middlewares), _toConsumableArray(_middlewares)); // return new BaseHttp(_config, _middlewares);

      this.config = _config;
      this.middlewares = _middlewares;
      return this;
    }
  }, {
    key: "adapt",
    value: function adapt(url, options) {
      throw new Error('请先适配xhr');
    } //   getRequestInit(args) {
    //     const requestInit = {};
    //     const requestInitKeys = ['method', 'headers', 'body', 'referrer', 'mode', 'credentials', 'cache', 'redirect'];
    //     Object.keys(args).forEach(key => {
    //       requestInitKeys.includes(key) && (requestInit[key] = args[key]);
    //     });
    //     return requestInit;
    //   }

  }, {
    key: baseFetch,
    value: function value(_ref) {
      var url = _ref.url,
          options = _ref.options,
          method = _ref.method,
          data = _ref.data;
      var defaultMethod = !data && !!options && !options.body ? 'GET' : 'POST';
      options.method = method || options.method || defaultMethod;

      if (!!data) {
        if (window && (window.Blob && data instanceof window.Blob || window.FormData && data instanceof window.FormData) || typeof data === 'string') {
          options.body = data;
        } else {
          options.body = JSON.stringify(data);
        }
      } // return fetch(url, this.getRequestInit(options));


      return this.adapt(url, options);
    }
  }, {
    key: "request",
    value: function request(url, options, method, data) {
      options = Object.assign({}, this.config, options);
      var request = {
        url: url,
        options: options,
        method: method,
        data: data
      };
      var promise = Promise.resolve(request);
      var chain = [this[baseFetch].bind(this), undefined];

      var wrapResponse = function wrapResponse(fn, req, reject) {
        return function (res) {
          return fn ? fn(res, req) : reject ? Promise.reject(res) : res;
        };
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.middlewares[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var middleware = _step.value;
          chain.unshift(middleware.request, middleware.requestError);
          chain.push(wrapResponse(middleware.response, request), wrapResponse(middleware.responseError, request, true));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      while (!!chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    }
  }, {
    key: "addMiddlewares",
    value: function addMiddlewares(_middlewares, overwirte) {
      var _this$middlewares;

      overwirte && this.clearMiddlewares();

      (_this$middlewares = this.middlewares).push.apply(_this$middlewares, _toConsumableArray(_middlewares));

      return this;
    }
  }, {
    key: "clearMiddlewares",
    value: function clearMiddlewares() {
      while (this.middlewares.length) {
        this.middlewares.pop();
      }

      return this;
    }
  }, {
    key: "fetch",
    value: function fetch(url, options) {
      return this.request(url, options);
    }
  }, {
    key: "get",
    value: function get(url, data, options) {
      if (data) {
        url = "".concat(url).concat(url.includes('?') ? '&' : '?').concat(_qs["default"].stringify(data));
      }

      return this.request(url, options, 'GET');
    }
  }, {
    key: "post",
    value: function post(url, data, options) {
      return this.request(url, options, 'POST', data);
    }
  }, {
    key: "patch",
    value: function patch(url, data, options) {
      return this.request(url, options, 'PATCH', data);
    }
  }, {
    key: "put",
    value: function put(url, data, options) {
      return this.request(url, options, 'PUT', data);
    }
  }, {
    key: "del",
    value: function del(url, options) {
      return this.request(url, options, 'DELETE');
    }
  }, {
    key: "head",
    value: function head(url, options) {
      return this.request(url, options, 'HEAD');
    }
  }]);

  return BaseHttp;
}();
/*
 * 创建http对象，继承默认配置
 */
// export function 
// export const


exports["default"] = BaseHttp;