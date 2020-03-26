"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNative = isNative;
exports.noop = noop;
exports.isChrome = exports.isIOS = exports.isAndroid = exports.isEdge = exports.isIE9 = exports.isIE = exports.UA = exports.inBrowser = exports.hasProto = void 0;
var hasProto = ('__proto__' in {}); // Browser environment sniffing

exports.hasProto = hasProto;
var inBrowser = typeof window !== 'undefined';
exports.inBrowser = inBrowser;
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
exports.UA = UA;
var isIE = UA && /msie|trident/.test(UA);
exports.isIE = isIE;
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
exports.isIE9 = isIE9;
var isEdge = UA && UA.indexOf('edge/') > 0;
exports.isEdge = isEdge;
var isAndroid = UA && UA.indexOf('android') > 0;
exports.isAndroid = isAndroid;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
exports.isIOS = isIOS;
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
exports.isChrome = isChrome;

function isNative(Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
}

function noop() {}