"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestIdleCallback = requestIdleCallback;
exports.timerScheduler = timerScheduler;
exports.requestAnimationFrameOf = requestAnimationFrameOf;
exports.cancelAnimationFrameOf = cancelAnimationFrameOf;
exports.createAnimtionFrame = createAnimtionFrame;

/**
 * 调度工具
 */
function requestIdleCallback(callback) {
  // ie
  if (window.setImmediate) {
    window.setImmediate(function () {
      callback();
    }); // chrome firefox
  } else if (window.MessageChannel) {
    var chan = new window.MessageChannel();
    var port2 = chan.port2;

    chan.port1.onmessage = function () {
      callback();
    };

    port2.postMessage(undefined);
  } else {
    // old broswer
    var timer = setTimeout(function () {
      callback();
      clearTimeout(timer);
      timer = null;
    }, 100); // 100ms 保持离散操作最流畅的方式
  }
} // 分片调度 适用于大量DOM操作和密集cpu计算


function timerScheduler(arr, fn, count, callback, ctx) {
  var result = [];
  var total = Math.ceil(arr.length / count);
  var i = 0; // 重置

  var reset = function reset() {
    i = 0;
    result = [];
  };

  var fncall = function fncall(timerResult) {
    i++;
    result = result.concat(timerResult);

    if (i === total) {
      callback(result);
      reset();
    }
  };

  return function () {
    // 判断浏览器在空线处理
    // 代码分片
    if (arr.length < 200) {
      return callback([fn(arr, 0)]);
    }

    var tl = arr.length % count === 0 ? arr.length / count : (arr.length / count | 0) + 1;

    var _loop = function _loop(h) {
      requestIdleCallback(function () {
        var rt = fn.call(ctx, arr.slice(h * count, (h + 1) * count), h * count);
        fncall(rt); // 触发结果 判断回调是否完成
      });
    };

    for (var h = 0; h < tl; h++) {
      _loop(h);
    }
  };
}
/**
 * 动画引擎
 * @param {*} fn
 */


function requestAnimationFrameOf(fn) {
  if (window.requestAnimationFrame) {
    return window.requestAnimationFrame(fn);
  } else if (window.setTimeout) {
    return window.setTimeout(fn, 1000 / 60);
  }
}

function cancelAnimationFrameOf(timer) {
  if (window.cancelAnimationFrame) {
    window.cancelAnimationFrame(timer);
  } else if (window.clearTimeout) {
    window.clearTimeout(timer);
  }
}
/**
 * 创建timer
 * @param {*} count
 * @param {*} step
 * @param {*} fn
 */


function createAnimtionFrame(count, step, fn) {
  return setInterval(function () {
    fn();
  }, count / step);
}