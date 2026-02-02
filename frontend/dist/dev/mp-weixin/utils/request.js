"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "https://qingping-wallpaper-api.1628973345.workers.dev";
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        "Authorization": common_vendor.index.getStorageSync("token") || "",
        ...options.header
      },
      timeout: 1e4,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.errCode === 0) {
            resolve(res.data);
          } else {
            common_vendor.index.showToast({
              title: res.data.errMsg || "请求失败",
              icon: "none"
            });
            reject(res.data);
          }
        } else {
          common_vendor.index.showToast({
            title: "网络错误",
            icon: "none"
          });
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          title: "网络连接失败",
          icon: "none"
        });
        reject(err);
      }
    });
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
