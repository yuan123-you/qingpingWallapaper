"use strict";
const utils_request = require("../../utils/request.js");
function userLogin(data) {
  return utils_request.request.post("/api/user/login", data);
}
function getClassifyList() {
  return utils_request.request.get("/api/user/classify/list");
}
function getBannerList() {
  return utils_request.request.get("/api/user/banner/list");
}
function getNoticeList(type = "", pageNum = 1, pageSize = 10) {
  return utils_request.request.get("/api/user/notice/list", { type, pageNum, pageSize });
}
function getWallpaperList(params) {
  return utils_request.request.get("/api/user/wallpaper/list", params);
}
function getWallpaperDetail(id) {
  return utils_request.request.get("/api/user/wallpaper/detail", { id });
}
function submitWallpaperScore(data) {
  return utils_request.request.post("/api/user/wallpaper/score", data);
}
function addUserBehavior(data) {
  return utils_request.request.post("/api/user/behavior/add", data);
}
function getHotSearch() {
  return utils_request.request.get("/api/user/search/hot");
}
function searchWallpaper(params) {
  return utils_request.request.get("/api/user/search", params);
}
exports.addUserBehavior = addUserBehavior;
exports.getBannerList = getBannerList;
exports.getClassifyList = getClassifyList;
exports.getHotSearch = getHotSearch;
exports.getNoticeList = getNoticeList;
exports.getWallpaperDetail = getWallpaperDetail;
exports.getWallpaperList = getWallpaperList;
exports.searchWallpaper = searchWallpaper;
exports.submitWallpaperScore = submitWallpaperScore;
exports.userLogin = userLogin;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/api/user/index.js.map
