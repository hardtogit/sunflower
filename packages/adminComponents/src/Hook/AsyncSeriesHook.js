
import Hook from "./Hook";
import HookCodeFactory from "./HookCodeFactory";

 class AsyncSeriesHookCodeFactory extends HookCodeFactory {
  constructor(){
    super()
  }
	content({ onError, onDone }) {
		return this.callTapsSeries({
			onError: (i, err, next, doneBreak) => onError(err) + doneBreak(true),
			onDone
		});
	}
}

const factory = new AsyncSeriesHookCodeFactory();

export class AsyncSeriesHook extends Hook {
  constructor(args){
    super(args);
  }
	compile(options) {
		factory.setup(this, options);
		return factory.create(options);
	}
}

Object.defineProperties(AsyncSeriesHook.prototype, {
	_call: { value: undefined, configurable: true, writable: true }
});

