"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 模板生成代码
 */
var HookCodeFactory =
/*#__PURE__*/
function () {
  function HookCodeFactory(config) {
    _classCallCheck(this, HookCodeFactory);

    this.config = config;
    this.options = undefined;
    this._args = undefined;
  }

  _createClass(HookCodeFactory, [{
    key: "create",
    value: function create(options) {
      this.init(options);
      var fn;

      switch (this.options.type) {
        case 'sync':
          fn = new Function(this.args(), "\"use strict\";\n".concat(this.header()).concat(this.content({
            onError: function onError(err) {
              return "throw ".concat(err, ";\n");
            },
            onResult: function onResult(result) {
              return "return ".concat(result, ";\n");
            },
            onDone: function onDone() {
              return '';
            },
            rethrowIfPossible: true
          })));
          break;

        case "async":
          fn = new Function(this.args({
            after: "_callback"
          }), '"use strict";\n' + this.header() + this.content({
            onError: function onError(err) {
              return "_callback(".concat(err, ");\n");
            },
            onResult: function onResult(result) {
              return "_callback(null, ".concat(result, ");\n");
            },
            onDone: function onDone() {
              return "_callback();\n";
            }
          }));
          break;

        case "promise":
          var code = "";
          code += '"use strict";\n';
          code += "return new Promise((_resolve, _reject) => {\n";
          code += "var _sync = true;\n";
          code += this.header();
          code += this.content({
            onError: function onError(err) {
              var code = "";
              code += "if(_sync)\n";
              code += "_resolve(Promise.resolve().then(() => { throw ".concat(err, "; }));\n");
              code += "else\n";
              code += "_reject(".concat(err, ");\n");
              return code;
            },
            onResult: function onResult(result) {
              return "_resolve(".concat(result, ");\n");
            },
            onDone: function onDone() {
              return "_resolve();\n";
            }
          });
          code += "_sync = false;\n";
          code += "});\n";
          fn = new Function(this.args(), code);
          break;
      }

      this.deinit();
      return fn;
    }
  }, {
    key: "setup",
    value: function setup(instance, options) {
      instance._x = options.taps.map(function (t) {
        return t.fn;
      });
    }
  }, {
    key: "init",
    value: function init(options) {
      this.options = options;
      this._args = options.args.slice();
    }
  }, {
    key: "deinit",
    value: function deinit() {
      this.options = undefined;
      this._args = undefined;
    }
  }, {
    key: "header",
    value: function header() {
      var code = 'var _context;\n';
      code += 'var _x = this._x;\n';
      return code;
    }
  }, {
    key: "callTap",
    value: function callTap(tapIndex, _ref) {
      var onError = _ref.onError,
          onResult = _ref.onResult,
          onDone = _ref.onDone,
          rethrowIfPossible = _ref.rethrowIfPossible;
      var code = '';
      var hasTapCached = false;
      code += "var _fn".concat(tapIndex, " = ").concat(this.getTapFn(tapIndex), ";\n");
      var tap = this.options.taps[tapIndex];

      switch (tap.type) {
        case 'sync':
          if (!rethrowIfPossible) {
            code += "var _hasError".concat(tapIndex, " = false;\n");
            code += 'try {\n';
          }

          if (onResult) {
            code += "var _result".concat(tapIndex, " = _fn").concat(tapIndex, "(").concat(this.args({
              before: tap.context ? '_context' : undefined
            }), ");\n");
          } else {
            code += "_fn".concat(tapIndex, "(").concat(this.args({
              before: tap.context ? '_context' : undefined
            }), ");\n");
          }

          if (!rethrowIfPossible) {
            code += '} catch(_err) {\n';
            code += "_hasError".concat(tapIndex, " = true;\n");
            code += onError('_err');
            code += '}\n';
            code += "if(!_hasError".concat(tapIndex, ") {\n");
          }

          if (onResult) {
            code += onResult("_result".concat(tapIndex));
          }

          if (onDone) {
            code += onDone();
          }

          if (!rethrowIfPossible) {
            code += '}\n';
          }

          break;

        case 'async':
          var cbCode = '';
          if (onResult) cbCode += "(_err".concat(tapIndex, ", _result").concat(tapIndex, ") => {\n");else cbCode += "_err".concat(tapIndex, " => {\n");
          cbCode += "if(_err".concat(tapIndex, ") {\n");
          cbCode += onError("_err".concat(tapIndex));
          cbCode += '} else {\n';

          if (onResult) {
            cbCode += onResult("_result".concat(tapIndex));
          }

          if (onDone) {
            cbCode += onDone();
          }

          cbCode += '}\n';
          cbCode += '}';
          code += "_fn".concat(tapIndex, "(").concat(this.args({
            before: tap.context ? '_context' : undefined,
            after: cbCode
          }), ");\n");
          break;

        case 'promise':
          code += "var _hasResult".concat(tapIndex, " = false;\n");
          code += "var _promise".concat(tapIndex, " = _fn").concat(tapIndex, "(").concat(this.args({
            before: tap.context ? '_context' : undefined
          }), ");\n");
          code += "if (!_promise".concat(tapIndex, " || !_promise").concat(tapIndex, ".then)\n");
          code += "  throw new Error('Tap function (tapPromise) did not return promise (returned ' + _promise".concat(tapIndex, " + ')');\n");
          code += "_promise".concat(tapIndex, ".then(_result").concat(tapIndex, " => {\n");
          code += "_hasResult".concat(tapIndex, " = true;\n");

          if (onResult) {
            code += onResult("_result".concat(tapIndex));
          }

          if (onDone) {
            code += onDone();
          }

          code += "}, _err".concat(tapIndex, " => {\n");
          code += "if(_hasResult".concat(tapIndex, ") throw _err").concat(tapIndex, ";\n");
          code += onError("_err".concat(tapIndex));
          code += '});\n';
          break;

        default:
          break;
      }

      return code;
    }
  }, {
    key: "callTapsSeries",
    value: function callTapsSeries(_ref2) {
      var _this = this;

      var _onError = _ref2.onError,
          onResult = _ref2.onResult,
          onDone = _ref2.onDone,
          rethrowIfPossible = _ref2.rethrowIfPossible;
      if (this.options.taps.length === 0) return onDone();
      var firstAsync = this.options.taps.findIndex(function (t) {
        return t.type !== 'sync';
      });

      var next = function next(i) {
        if (i >= _this.options.taps.length) {
          return onDone();
        }

        var done = function done() {
          return next(i + 1);
        };

        var doneBreak = function doneBreak(skipDone) {
          if (skipDone) return '';
          return onDone();
        };

        return _this.callTap(i, {
          onError: function onError(error) {
            return _onError(i, error, done, doneBreak);
          },
          onResult: onResult && function (result) {
            return onResult(i, result, done, doneBreak);
          },
          onDone: !onResult && function () {
            return done();
          },
          rethrowIfPossible: rethrowIfPossible && (firstAsync < 0 || i < firstAsync)
        });
      };

      return next(0);
    }
  }, {
    key: "callTapsParallel",
    value: function callTapsParallel(_ref3) {
      var _this2 = this;

      var _onError2 = _ref3.onError,
          onResult = _ref3.onResult,
          onDone = _ref3.onDone,
          rethrowIfPossible = _ref3.rethrowIfPossible,
          _ref3$onTap = _ref3.onTap,
          onTap = _ref3$onTap === void 0 ? function (i, run) {
        return run();
      } : _ref3$onTap;

      if (this.options.taps.length <= 1) {
        return this.callTapsSeries({
          onError: _onError2,
          onResult: onResult,
          onDone: onDone,
          rethrowIfPossible: rethrowIfPossible
        });
      }

      var code = '';
      code += 'do {\n';
      code += "var _counter = ".concat(this.options.taps.length, ";\n");

      if (onDone) {
        code += 'var _done = () => {\n';
        code += onDone();
        code += '};\n';
      }

      var _loop = function _loop(i) {
        var done = function done() {
          if (onDone) return 'if(--_counter === 0) _done();\n';
          return '--_counter;';
        };

        var doneBreak = function doneBreak(skipDone) {
          if (skipDone || !onDone) return '_counter = 0;\n';
          return '_counter = 0;\n_done();\n';
        };

        code += 'if(_counter <= 0) break;\n';
        code += onTap(i, function () {
          return _this2.callTap(i, {
            onError: function onError(error) {
              var code = '';
              code += 'if(_counter > 0) {\n';
              code += _onError2(i, error, done, doneBreak);
              code += '}\n';
              return code;
            },
            onResult: onResult && function (result) {
              var code = '';
              code += 'if(_counter > 0) {\n';
              code += onResult(i, result, done, doneBreak);
              code += '}\n';
              return code;
            },
            onDone: !onResult && function () {
              return done();
            },
            rethrowIfPossible: rethrowIfPossible
          });
        }, done, doneBreak);
      };

      for (var i = 0; i < this.options.taps.length; i++) {
        _loop(i);
      }

      code += '} while(false);\n';
      return code;
    }
  }, {
    key: "args",
    value: function args() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          before = _ref4.before,
          after = _ref4.after;

      var allArgs = this._args;
      if (before) allArgs = [before].concat(allArgs);
      if (after) allArgs = allArgs.concat(after);

      if (allArgs.length === 0) {
        return '';
      }

      return allArgs.join(', ');
    }
  }, {
    key: "getTapFn",
    value: function getTapFn(idx) {
      return "_x[".concat(idx, "]");
    }
  }, {
    key: "getTap",
    value: function getTap(idx) {
      return "_taps[".concat(idx, "]");
    }
  }]);

  return HookCodeFactory;
}();

exports.default = HookCodeFactory;