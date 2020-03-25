"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _qs = _interopRequireDefault(require("qs"));

var _antd = require("antd");

var _es6Promise = require("es6-promise");

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _object = require("../utils/object");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var applyFn = function applyFn(paramOrFn, _request, _response) {
  return typeof paramOrFn === 'function' ? paramOrFn(_request, _response) : paramOrFn;
};

var transformErrorMsg = function transformErrorMsg(errorMsg) {
  var transformTypes = {
    'Failed to fetch': '网络连接错误，请稍后再试',
    'Type error': '网络连接错误，请稍后再试',
    '无法 fetch': '网络连接错误，请稍后再试'
  };
  return transformTypes[errorMsg] || errorMsg;
};
/*
 * request domain 中间件
 * useMockProxyType 使用mock代理类别：0 - 仅使用mock数据；1 - 部分使用mock数据；2 - 不使用mock数据
 */


function requestDomain(_hosts) {
  return {
    request: function request(_request) {
      var url = _request.url,
          options = _request.options; // console.error(url);

      var domain = options.domain,
          servers = options.servers,
          headers = options.headers,
          _options$useMockProxy = options.useMockProxyType,
          useMockProxyType = _options$useMockProxy === void 0 ? 1 : _options$useMockProxy;
      var hosts = applyFn(_hosts, _request) || servers || {};
      var host = hosts[domain] || '';
      var enableMockProxy = process.env.UMI_ENV === 'dev' && useMockProxyType !== 2;

      if (enableMockProxy) {
        _request.options.headers = _objectSpread({}, headers, {
          'Host-Proxy': host,
          'Only-Mock-Data': !useMockProxyType
        });
      } else {
        _request.url = "".concat(host).concat(url);
      } // console.error(_request);


      return _request;
    }
  };
}
/*
 * request query 中间件
 */


function requestQuery(_tokens) {
  return {
    request: function request(_request) {
      var options = _request.options;
      var tokens = applyFn(_tokens || options.query, _request);

      if (tokens) {
        var url = _request.url;

        var tokenStr = _qs["default"].stringify(tokens);

        var connector = url.includes('?') ? '&' : '?';
        _request.url = "".concat(url).concat(connector).concat(tokenStr);
      }

      return _request;
    }
  };
}
/*
 * request headers 中间件
 */


function requestHeader(_header) {
  return {
    request: function request(_request) {
      var options = _request.options;
      var headers = applyFn(_header || options.header, _request);
      options.headers = Object.assign({}, options.headers, headers, options.customHeader);
      return _request;
    }
  };
}
/*
 * request headers 中间件
 */
// 参数数据转化中间件


function requestDataTransform(_transform) {
  function requestTypeTransform(_ref) {
    var data = _ref.data,
        options = _ref.options;
    var contentType = options.contentType;

    if (contentType === 'formData') {
      data = (0, _object.toFormData)(data);
    } else if (contentType === 'text') {
      options.headers = Object.assign(options.headers || {}, {
        'Content-type': 'text/plain;charset=UTF-8'
      });
    } else if (contentType === 'json') {
      options.headers = Object.assign(options.headers || {}, {
        'Content-type': 'application/json'
      });
    } else if (contentType === 'form') {
      options.headers = Object.assign(options.headers || {}, {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      });
      data = _qs["default"].stringify(data);
    }

    return {
      data: data,
      options: options
    };
  }

  return {
    request: function request(_request) {
      var _request$options = _request.options,
          dataTransform = _request$options.dataTransform,
          customDataTransform = _request$options.customDataTransform;
      var requestTransform = _transform || dataTransform;
      Object.assign(_request, requestTypeTransform(_request));

      if (requestTransform) {
        var transformedRequest = requestTransform(_request.data, _request.options, _request);
        Object.assign(_request, transformedRequest);
      }

      if (customDataTransform) {
        var _transformedRequest = customDataTransform(_request.data, _request.options, _request);

        Object.assign(_request, _transformedRequest);
      }

      return _request;
    }
  };
}
/*
 * response status 处理中间件
 */


function responseStatus() {
  function defaultResponseStatusResult(_response) {
    return _response.json().then(function (resData) {
      return _es6Promise.Promise.reject(resData);
    }, function () {
      return _es6Promise.Promise.reject(_response);
    });
  }

  return {
    response: function response(_response, _request) {
      var responseStatusResult = _request.options.responseStatusResult;

      if (_response.status >= 200 && _response.status < 300) {
        return _response;
      }

      return (responseStatusResult || defaultResponseStatusResult)(_response);
    }
  };
}
/*
 * response json 处理中间件
 */


function responseJson() {
  return {
    response: function response(_response, _request) {
      return _request.options.json === false ? _response : _response.json();
    }
  };
}
/*
 * response data 状态处理中间件
 */


function responseDataStatus(validateStateError) {
  var defaultErrorValidate = function defaultErrorValidate(_responseData) {
    return _responseData.status && _responseData.status.toUpperCase() === 'ERROR';
  };

  return {
    response: function response(_responseData, _request) {
      var responseDataValidator = _request.options.responseDataValidator;

      if (responseDataValidator) {
        if (responseDataValidator(_responseData, _request)) {
          return _es6Promise.Promise.reject(_responseData);
        }
      } else {
        if ((validateStateError || defaultErrorValidate)(_responseData)) {
          return _es6Promise.Promise.reject(_responseData);
        }
      }

      return _responseData;
    }
  };
}
/*
 * 授权处理中间件，检查是否非法授权
 */


function responseAuthorityValidator(_options) {
  var defaultOptions = {
    codes: ['120001', '120002', '120008', '10020002'],
    hash: '/login'
  };
  var hasErrorMessage = false;
  var DEFAULT_EXPIRE_MESSAGE = '登录过期，请重新登录！';
  return {
    responseError: function responseError(_responseError, _request) {
      /* eslint-disable no-shadow */
      var _request$options2 = _request.options,
          authorityValidator = _request$options2.authorityValidator,
          authorityFailureCodes = _request$options2.authorityFailureCodes,
          authorityFailureHash = _request$options2.authorityFailureHash,
          afterAuthorityFailure = _request$options2.afterAuthorityFailure;
      var authorityOptions = applyFn(_options, _request, _responseError) || defaultOptions;

      if (authorityValidator) {
        return _es6Promise.Promise.reject(authorityValidator(_responseError, _request) || _responseError);
      }

      if (authorityFailureCodes) {
        authorityOptions.codes = authorityFailureCodes;
      }

      if (authorityFailureHash) {
        authorityOptions.hash = authorityFailureHash;
      } // 将code全部转成字符串类型，兼容有时候后端返回errorCode类型为number的情况


      var errorCode = _responseError.errorCode;
      var codes = authorityOptions.codes.map(function (code) {
        return "".concat(code);
      });

      if (errorCode && codes.includes("".concat(errorCode))) {
        if (!hasErrorMessage) {
          var errorMessage = _responseError.errorMsg || DEFAULT_EXPIRE_MESSAGE;

          _antd.message.warning(errorMessage, 2, function () {
            return hasErrorMessage = false;
          });

          if (afterAuthorityFailure) {
            afterAuthorityFailure(_responseError, _request);
          }

          _jsCookie["default"].set('lastHash', window.location.hash);

          hasErrorMessage = true;
        }

        _request.options.ignoreErrorModal = true;
        window.location.hash = authorityOptions.hash;
      }

      return _es6Promise.Promise.reject(_responseError);
    }
  };
}
/*
 * response错误处理中间件
 */


function responseErrorHandler() {
  var DEFAULT_RES_ERROR = '请求错误';
  var hasErrorModal = false;

  function defaultResponseErrorHandler(_responseError, _request) {
    if (!_request.options.ignoreErrorModal && !hasErrorModal) {
      var title = transformErrorMsg(_responseError.message) || _responseError.errorMsg || _responseError.error_message || DEFAULT_RES_ERROR;

      _antd.Modal.error({
        title: title,
        onOk: function onOk() {
          hasErrorModal = false;
        },
        onCancel: function onCancel() {}
      });

      hasErrorModal = true;
    }
  }

  return {
    responseError: function responseError(_responseError, _request) {
      var _request$options3 = _request.options,
          responseErrorHandler = _request$options3.responseErrorHandler,
          customResponseErrorHandler = _request$options3.customResponseErrorHandler;

      var _responseErrorResult;

      if (customResponseErrorHandler) {
        _responseErrorResult = customResponseErrorHandler(_responseError, _request);
      }

      (responseErrorHandler || defaultResponseErrorHandler)(_responseError, _request);
      return _es6Promise.Promise.reject(_responseErrorResult || _responseError);
    }
  };
}
/*
 * request错误处理中间件
 */


function requestErrorHandler() {
  var DEFAULT_REQ_ERROR = '请求异常';
  var hasErrorModal = false;

  function defaultRequestErrorHandler(_requestError) {
    if (!hasErrorModal) {
      _antd.Modal.error({
        title: DEFAULT_REQ_ERROR,
        onOk: function onOk() {
          hasErrorModal = false;
        }
      });

      hasErrorModal = true;
    }

    return _es6Promise.Promise.reject(_requestError);
  }

  return {
    requestError: function requestError(_requestError) {
      var requestErrorHandler = _requestError.requestErrorHandler,
          customRequestErrorHandler = _requestError.customRequestErrorHandler;

      if (customRequestErrorHandler) {
        return customRequestErrorHandler(_requestError);
      }

      (requestErrorHandler || defaultRequestErrorHandler)(_requestError);
      return _es6Promise.Promise.reject(_requestError);
    }
  };
}
/*
 * response data 内容处理中间件
 */


function responseDataContent(contentKey) {
  return {
    response: function response(_response, _request) {
      var key = contentKey || _request.options.contentKey;
      return key ? _response[key] : _response;
    }
  };
}

var _default = {
  requestDomain: requestDomain,
  requestQuery: requestQuery,
  requestHeader: requestHeader,
  requestDataTransform: requestDataTransform,
  requestErrorHandler: requestErrorHandler,
  responseStatus: responseStatus,
  responseJson: responseJson,
  responseDataStatus: responseDataStatus,
  responseAuthorityValidator: responseAuthorityValidator,
  responseErrorHandler: responseErrorHandler,
  responseDataContent: responseDataContent
};
exports["default"] = _default;