"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _formatPugin = require("./formatPugin");

var _FiledsTypePugin = require("./FiledsTypePugin");

var _validatorPugin = require("./validatorPugin");

var _formatParamPugin = require("./formatParamPugin");

var _trimPugin = require("./trimPugin");

// import { submitAndResetPugin } from './submitPugin';
// import { revPlugin } from './revPlugin';

/**
 * 插件集合
 */
var _default = [_validatorPugin.extraRulePlugin, _formatPugin.formate, new _FiledsTypePugin.ElementTypePugin(), _validatorPugin.validatorPugin, // submitAndResetPugin,
_formatParamPugin.formteParamPugin, _trimPugin.trimStringPugin, _trimPugin.trimParamPugin // revPlugin
];
exports.default = _default;