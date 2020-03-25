"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apiHttp = exports["default"] = void 0;

var _http = _interopRequireDefault(require("../http/"));

var _jsCookie = _interopRequireDefault(require("js-cookie"));

var _server = _interopRequireDefault(require("@/config/server"));

var _share = require("./share");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*eslint-disable */
var serverConfig = {
  servers: _server["default"][process.env.UMI_ENV],
  contentKey: 'content',
  // 使用mock代理类别：0 - 仅使用mock数据；1 - 部分使用mock数据；2 - 不使用mock数据
  useMockProxyType: 2,
  authorityFailureCodes: ['120001', '120002', '120003', '120010', '10020002'],
  dataTransform: function dataTransform(data, option) {
    // return { data, option };
    var contentType = option.contentType;
    var dt = data;

    if (contentType === 'form') {
      dt = (0, _share.objToUrlStr)((0, _share.deepTrim)((0, _share.urlStrToObj)(data)));
    } else if (contentType === 'json') {
      dt = (0, _share.deepTrim)(data);
    }

    return {
      data: dt,
      option: option
    };
  },
  header: function header() {
    return {
      token: _jsCookie["default"].get('token')
    };
  }
};

var _default = _http["default"].create(serverConfig);

exports["default"] = _default;

var apiHttp = _http["default"].create({}).create();

exports.apiHttp = apiHttp;