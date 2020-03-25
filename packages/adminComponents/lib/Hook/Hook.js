"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 借鉴webpack之 hook
 *  插件化表单
 */
var Hook =
/*#__PURE__*/
function () {
  function Hook() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    _classCallCheck(this, Hook);

    this._args = args;
    this.taps = [];
    this.call = this._call;
    this._x = undefined;
  }

  _createClass(Hook, [{
    key: "_createCall",
    value: function _createCall(type) {
      return this.compile({
        taps: this.taps,
        // interceptors: this.interceptors,
        args: this._args,
        type: type
      });
    }
  }, {
    key: "tap",
    value: function tap(ops, fn) {
      var options = ops;
      if (typeof options === 'string') options = {
        name: options
      };

      if (_typeof(options) !== 'object' || options === null) {
        throw new Error('Invalid arguments to tap(options: Object, fn: function)');
      }

      options = Object.assign({
        type: 'sync',
        fn: fn
      }, options);

      if (typeof options.name !== 'string' || options.name === '') {
        throw new Error('Missing name for tap');
      }

      this._insert(options);
    }
  }, {
    key: "tapAsync",
    value: function tapAsync(options, fn) {
      if (typeof options === "string") options = {
        name: options
      };
      if (_typeof(options) !== "object" || options === null) throw new Error("Invalid arguments to tapAsync(options: Object, fn: function)");
      options = Object.assign({
        type: "async",
        fn: fn
      }, options);
      if (typeof options.name !== "string" || options.name === "") throw new Error("Missing name for tapAsync"); // options = this._runRegisterInterceptors(options);

      this._insert(options);
    }
  }, {
    key: "tapPromise",
    value: function tapPromise(options, fn) {
      if (typeof options === "string") options = {
        name: options
      };
      if (_typeof(options) !== "object" || options === null) throw new Error("Invalid arguments to tapPromise(options: Object, fn: function)");
      options = Object.assign({
        type: "promise",
        fn: fn
      }, options);
      if (typeof options.name !== "string" || options.name === "") throw new Error("Missing name for tapPromise"); // options = this._runRegisterInterceptors(options);

      this._insert(options);
    }
  }, {
    key: "isUsed",
    value: function isUsed() {
      return this.taps.length > 0 || this.interceptors.length > 0;
    }
  }, {
    key: "_resetCompilation",
    value: function _resetCompilation() {
      this.call = this._call;
      this.callAsync = this._callAsync;
      this.promise = this._promise;
    }
    /** no-eslint */

  }, {
    key: "_insert",
    value: function _insert(item) {
      this._resetCompilation();

      var before;
      if (typeof item.before === 'string') before = new Set([item.before]);else if (Array.isArray(item.before)) {
        before = new Set(item.before);
      }
      var stage = 0;
      if (typeof item.stage === 'number') stage = item.stage;
      var i = this.taps.length;

      while (i > 0) {
        i -= 1;
        var x = this.taps[i];
        this.taps[i + 1] = x;
        var xStage = x.stage || 0;

        if (before) {
          if (before.has(x.name)) {
            before.delete(x.name);
            continue;
          }

          if (before.size > 0) {
            continue;
          }
        }

        if (xStage > stage) {
          continue;
        }

        i += 1;
        break;
      }

      this.taps[i] = item;
    }
  }]);

  return Hook;
}();

function createCompileDelegate(name, type) {
  return function lazyCompileHook() {
    this[name] = this._createCall(type);
    return this[name].apply(this, arguments);
  };
}

Object.defineProperties(Hook.prototype, {
  _call: {
    value: createCompileDelegate("call", "sync"),
    configurable: true,
    writable: true
  },
  _promise: {
    value: createCompileDelegate("promise", "promise"),
    configurable: true,
    writable: true
  },
  _callAsync: {
    value: createCompileDelegate("callAsync", "async"),
    configurable: true,
    writable: true
  }
});
var _default = Hook;
exports.default = _default;