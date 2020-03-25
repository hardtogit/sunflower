
import Hook from "./Hook";
import HookCodeFactory from "./HookCodeFactory";

class SyncWaterfallHookCodeFactory extends HookCodeFactory {
  constructor(){
    super()
  }
	content({ onError, onResult, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) => {
				let code = "";
				code += `if(${result} !== undefined) {\n`;
				code += `${this._args[0]} = ${result};\n`;
				code += `}\n`;
				code += next();
				return code;
			},
			onDone: () => onResult(this._args[0]),
			rethrowIfPossible
		});
	}
}

const factory = new SyncWaterfallHookCodeFactory();

export class SyncWaterfallHook extends Hook {
	constructor(args) {
		super(args);
		if (args.length < 1)
			throw new Error("Waterfall hooks must have at least one argument");
	}
	compile(options) {
		factory.setup(this, options);
		return factory.create(options);
	}
}

// module.exports = SyncWaterfallHook;
