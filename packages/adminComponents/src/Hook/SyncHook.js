/**
 * 同步hook
 */

import Hook from "./Hook";
import HookCodeFactory from "./HookCodeFactory";

class SyncHookCodeFactory extends HookCodeFactory {
  constructor(config) {
    super(config)
  }
  content({
    onError,
    onResult,
    onDone,
    rethrowIfPossible
  }) {
    return this.callTapsSeries({
      onError: (i, err) => onError(err),
      onDone,
      rethrowIfPossible
    });
  }
}

const factory = new SyncHookCodeFactory();

/**
 * 同步hook
 */
export class SyncHook extends Hook {
  constructor(args) {
    super(args);
  }
  compile(options) {
    factory.setup(this, options);
    return factory.create(options);
  }
}
