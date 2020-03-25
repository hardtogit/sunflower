/**
 * 借鉴webpack之 hook
 *  插件化表单
 */
class Hook {
  constructor(args = []) {
    this._args = args;
    this.taps = [];
    this.call = this._call;
    this._x = undefined;
  }
  _createCall(type) {
    return this.compile({
      taps: this.taps,
      // interceptors: this.interceptors,
      args: this._args,
      type
    });
  }

  tap(ops, fn) {
    let options = ops;
    if (typeof options === 'string') options = { name: options };
    if (typeof options !== 'object' || options === null) {
      throw new Error(
        'Invalid arguments to tap(options: Object, fn: function)'
      );
    }
    options = Object.assign({ type: 'sync', fn }, options);
    if (typeof options.name !== 'string' || options.name === '') { throw new Error('Missing name for tap'); }
    this._insert(options);
  }
  tapAsync(options, fn) {
		if (typeof options === "string") options = { name: options };
		if (typeof options !== "object" || options === null)
			throw new Error(
				"Invalid arguments to tapAsync(options: Object, fn: function)"
			);
		options = Object.assign({ type: "async", fn: fn }, options);
		if (typeof options.name !== "string" || options.name === "")
			throw new Error("Missing name for tapAsync");
		// options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

	tapPromise(options, fn) {
		if (typeof options === "string") options = { name: options };
		if (typeof options !== "object" || options === null)
			throw new Error(
				"Invalid arguments to tapPromise(options: Object, fn: function)"
			);
		options = Object.assign({ type: "promise", fn: fn }, options);
		if (typeof options.name !== "string" || options.name === "")
			throw new Error("Missing name for tapPromise");
		// options = this._runRegisterInterceptors(options);
		this._insert(options);
	}

  isUsed() {
    return this.taps.length > 0 || this.interceptors.length > 0;
  }

  _resetCompilation() {
    this.call = this._call;
    this.callAsync = this._callAsync;
    this.promise = this._promise;
  }
  /** no-eslint */
  _insert(item) {
    this._resetCompilation();
    let before;
    if (typeof item.before === 'string') before = new Set([item.before]);
    else if (Array.isArray(item.before)) {
      before = new Set(item.before);
    }
    let stage = 0;
    if (typeof item.stage === 'number') stage = item.stage;
    let i = this.taps.length;
    while (i > 0) {
      i -= 1;
      const x = this.taps[i];
      this.taps[i + 1] = x;
      const xStage = x.stage || 0;
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
}

function createCompileDelegate(name, type) {
  return function lazyCompileHook(...args) {
    this[name] = this._createCall(type);
    return this[name](...args);
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

export default Hook;