/**
 * 对localStorage封装，方便使用
 * ⚠️ 不能存储function类型【本身存储function也没意义】
 */

const storage = window.localStorage;

function serialize(value) {
  return JSON.stringify({ value });
}

function deserialize(value) {
  try {
    return JSON.parse(value).value;
  } catch (error) {
    // eslint-disable-next-line
    console.warn(`caught an error ${error}`);
    return value;
  }
}

const wrappedNativeMethods = {
  setItem(key, value) {
    storage.setItem(key, serialize(value));
  },
  getItem(key) {
    return deserialize(storage.getItem(key));
  },
  removeItem(key) {
    storage.removeItem(key);
  },
  clear() {
    storage.clear();
  }
};

export default (() => {
  if (window.Proxy) {
    return new window.Proxy(
      {},
      {
        get(target, prop) {
          const result = storage[prop];
          if (typeof result === 'function') {
            const methodName = result.name;
            return wrappedNativeMethods[methodName];
          }
          return deserialize(result);
        },
        set(target, prop, value) {
          storage[prop] = serialize(value);
          return true;
        }
      }
    );
  }
  return wrappedNativeMethods;
})();

