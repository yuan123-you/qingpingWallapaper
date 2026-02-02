"use strict";
const common_vendor = require("../common/vendor.js");
const utils_apiRouter = require("./api-router.js");
utils_apiRouter.apiRouter.getBestEndpoint() || "https://qingping-wallpaper-api.1628973345.workers.dev";
const CACHE_PREFIX = "api_cache_";
const CACHE_DURATION = 5 * 60 * 1e3;
function getCacheKey(url, method, data) {
  return `${CACHE_PREFIX}${method}_${url}_${JSON.stringify(data)}`;
}
function getCache(key) {
  try {
    const cached = common_vendor.index.getStorageSync(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  } catch (e) {
    return null;
  }
}
function setCache(key, data) {
  try {
    common_vendor.index.setStorageSync(key, {
      data,
      timestamp: Date.now()
    });
  } catch (e) {
    common_vendor.index.__f__("warn", "at utils/request.js:31", "Cache set failed:", e);
  }
}
const request = (options) => {
  return new Promise((resolve, reject) => {
    const cacheKey = getCacheKey(options.url, options.method || "GET", options.data);
    if ((options.method || "GET") === "GET" && !options.noCache) {
      const cached = getCache(cacheKey);
      if (cached) {
        common_vendor.index.__f__("log", "at utils/request.js:42", "Using cached data for:", options.url);
        resolve(cached);
        return;
      }
    }
    const maxRetries = 3;
    let retryCount = 0;
    let endpointIndex = 0;
    const baseTimeout = options.timeout || 15e3;
    const makeRequest = () => {
      const currentEndpoint = utils_apiRouter.apiRouter.API_ENDPOINTS[endpointIndex % utils_apiRouter.apiRouter.API_ENDPOINTS.length];
      const currentTimeout = baseTimeout * (retryCount + 1);
      common_vendor.index.__f__("log", "at utils/request.js:57", `Requesting ${currentEndpoint}${options.url} (attempt ${retryCount + 1}/${maxRetries})`);
      common_vendor.index.request({
        url: currentEndpoint + options.url,
        method: options.method || "GET",
        data: options.data || {},
        header: {
          "Content-Type": "application/json",
          "Authorization": common_vendor.index.getStorageSync("token") || "",
          ...options.header
        },
        timeout: currentTimeout,
        success: (res) => {
          if (res.statusCode === 200) {
            if (res.data.errCode === 0) {
              if ((options.method || "GET") === "GET" && !options.noCache) {
                setCache(cacheKey, res.data);
              }
              resolve(res.data);
            } else {
              if (retryCount < maxRetries && res.data.errCode !== 401) {
                retryCount++;
                if (res.statusCode >= 500 || res.statusCode === 0) {
                  endpointIndex++;
                }
                common_vendor.index.__f__("log", "at utils/request.js:82", `Retry ${retryCount}/${maxRetries} for:`, options.url);
                setTimeout(makeRequest, 1e3 * retryCount);
              } else {
                common_vendor.index.showToast({
                  title: res.data.errMsg || "请求失败",
                  icon: "none",
                  duration: 2e3
                });
                reject(res.data);
              }
            }
          } else {
            if (retryCount < maxRetries) {
              retryCount++;
              endpointIndex++;
              common_vendor.index.__f__("log", "at utils/request.js:97", `Retry ${retryCount}/${maxRetries} for status ${res.statusCode}:`, options.url);
              setTimeout(makeRequest, 1e3 * retryCount);
            } else {
              common_vendor.index.showToast({
                title: "网络错误，请稍后重试",
                icon: "none",
                duration: 2e3
              });
              reject(res);
            }
          }
        },
        fail: (err) => {
          utils_apiRouter.apiRouter.markEndpointFailed(currentEndpoint);
          if (retryCount < maxRetries) {
            retryCount++;
            endpointIndex++;
            common_vendor.index.__f__("log", "at utils/request.js:115", `Retry ${retryCount}/${maxRetries} for network error:`, options.url);
            setTimeout(makeRequest, 1e3 * retryCount);
          } else {
            common_vendor.index.showToast({
              title: "网络连接失败，请检查网络",
              icon: "none",
              duration: 2e3
            });
            reject(err);
          }
        }
      });
    };
    makeRequest();
  });
};
const request$1 = {
  get(url, data = {}) {
    return request({
      url,
      method: "GET",
      data
    });
  },
  post(url, data = {}) {
    return request({
      url,
      method: "POST",
      data
    });
  },
  put(url, data = {}) {
    return request({
      url,
      method: "PUT",
      data
    });
  },
  delete(url, data = {}) {
    return request({
      url,
      method: "DELETE",
      data
    });
  }
};
exports.request = request$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
