/**
 * 同步Hook 遇到返回值就停止
 */

import Hook from "./Hook";
import HookCodeFactory from "./HookCodeFactory";

class SyncBailHookCodeFactory extends HookCodeFactory {
  constructor(){
    super()
  }
	content({ onError, onResult, onDone, rethrowIfPossible }) {
		return this.callTapsSeries({
			onError: (i, err) => onError(err),
			onResult: (i, result, next) =>
				`if(${result} !== undefined) {\n${onResult(
					result
				)};\n} else {\n${next()}}\n`,
			onDone,
			rethrowIfPossible
		});
	}
}

const factory = new SyncBailHookCodeFactory();

export class SyncBailHook extends Hook {
  constructor(args){
    super(args);
  }
	compile(options) {
		factory.setup(this, options);
		return factory.create(options);
	}
}
