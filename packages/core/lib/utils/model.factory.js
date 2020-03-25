"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _share = require("./share");

/**
 * model 池
 */
var getModel = function getModel(name) {
  var models = window.g_app._models;
  var model = (0, _share.queryArray)(models, name, 'namespace');
  return model;
};

var _default = {
  getModel: getModel
};
exports["default"] = _default;