/**
 * 防抖函数：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
 */
export function debounce(fn, delay = 300) {
    let timer = null;
    return function () {
        const args = arguments;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

/**
 * 节流函数：规定在一个单位时间内，只能触发一次函数。
 */
export function throttle(fn, gapTime = 1000) {
    let _lastTime = null;
    return function () {
        let _nowTime = +new Date();
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn.apply(this, arguments);
            _lastTime = _nowTime;
        }
    };
}

/**
 * 格式化数字：超过1万显示w
 */
export function formatCount(count) {
    if (count < 10000) return count;
    return (count / 10000).toFixed(1) + 'w';
}
