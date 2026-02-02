"use strict";
function throttle(fn, gapTime = 1e3) {
  let _lastTime = null;
  return function() {
    let _nowTime = +/* @__PURE__ */ new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments);
      _lastTime = _nowTime;
    }
  };
}
exports.throttle = throttle;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/common.js.map
