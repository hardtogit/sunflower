"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatPlugin = require("./formatPlugin");

var _filedsTypePlugin = require("./filedsTypePlugin");

var _validatorPlugin = require("./validatorPlugin");

var _formatParamPlugin = require("./formatParamPlugin");

var _trimPlugin = require("./trimPlugin");

var _moreQueryPlugins = require("./moreQueryPlugins");

/**
 * 插件集合
 */
var _default = [_validatorPlugin.extraRulePlugin, _formatPlugin.formate, new _filedsTypePlugin.elementTypePlugin(), _validatorPlugin.validatorPlugin, _formatParamPlugin.formteParamPugin, _trimPlugin.trimStringPugin, _trimPlugin.trimParamPugin, _moreQueryPlugins.moreQueryPlugins];
exports.default = _default;